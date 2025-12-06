import os
import json
import time
import copy
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader
from sklearn.metrics import classification_report, confusion_matrix
from torch.cuda.amp import autocast, GradScaler # Mixed Precision

# ============ CONFIGURATION ============
IMG_SIZE = 224
BATCH_SIZE = 64        # PyTorch + Mixed Precision allows larger batches
EPOCHS_HEAD = 10        # Phase 1: Train Head only
EPOCHS_FINE = 20      # Phase 2: Fine-tune
LEARNING_RATE_HEAD = 1e-3
LEARNING_RATE_FINE = 1e-5

# Path Setup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TRAIN_DIR = os.path.join(BASE_DIR, "dataset", "train")
MODEL_SAVE_PATH = os.path.join(BASE_DIR, "plant_disease_model.pth") # .pth for PyTorch
LABELS_SAVE_PATH = os.path.join(BASE_DIR, "labels.json")

# Mapping for display (Folder Name -> Human Readable)
# Ensure your folder names match keys exactly, or rely on automatic detection
DISPLAY_MAP = {
    "Powdery_mildew": "Powdery mildew",
    "Leaf_Spot": "Leaf spot",
    "Aphids": "Aphids (Aphis sp.)",
    "Healthy": "Healthy"
}

# ============ DEVICE SETUP ============
# Detects CUDA (NVIDIA), MPS (Mac M1/M2/M3), or CPU
device = torch.device("cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu")

print("="*60)
print(f"🚀 STARTING EXPERT TRAINING (PyTorch DenseNet121)")
print(f"⚙️  Device: {device}")
print(f"📂 Data Directory: {TRAIN_DIR}")
print("="*60)

# ============ 1. DATA TRANSFORMS & LOADERS ============
# Expert Tip: Normalize using ImageNet mean/std because DenseNet was pre-trained on it
data_transforms = {
    'train': transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(),
        transforms.RandomRotation(30),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ]),
    'val': transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ]),
}

print("\n[1/5] Loading Data...")

if not os.path.exists(TRAIN_DIR):
    print(f"❌ ERROR: Dataset not found at {TRAIN_DIR}")
    exit()

# Load full dataset
full_dataset = datasets.ImageFolder(TRAIN_DIR, transform=data_transforms['train'])
class_names = full_dataset.classes
print(f"Found classes: {class_names}")

# Split Train/Val (80/20)
train_size = int(0.8 * len(full_dataset))
val_size = len(full_dataset) - train_size
train_dataset, val_dataset = torch.utils.data.random_split(full_dataset, [train_size, val_size])

# Fix validation transform (random_split copies transforms, so we must override)
val_dataset.dataset.transform = data_transforms['val']

# Data Loaders (Optimized with num_workers)
# num_workers=4 is usually a sweet spot. Increase if you have a powerful CPU.
workers = 4 if os.name != 'nt' else 0 # Windows sometimes has issues with workers > 0

train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=workers, pin_memory=True)
val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=workers, pin_memory=True)

dataset_sizes = {'train': len(train_dataset), 'val': len(val_dataset)}
print(f"Training images: {dataset_sizes['train']} | Validation images: {dataset_sizes['val']}")

# ============ 2. MODEL SETUP ============
print("\n[2/5] Building DenseNet121 Model...")

# Load Pretrained DenseNet121
model = models.densenet121(weights=models.DenseNet121_Weights.IMAGENET1K_V1)

# Freeze all layers initially
for param in model.parameters():
    param.requires_grad = False

# Replace Classifier Head
# DenseNet121's classifier input features is 1024
num_ftrs = model.classifier.in_features
model.classifier = nn.Sequential(
    nn.Linear(num_ftrs, 512),
    nn.ReLU(),
    nn.Dropout(0.4),
    nn.Linear(512, len(class_names))
)

model = model.to(device)

# ============ 3. TRAINING FUNCTION ============
# Handles Mixed Precision and Validations
def train_model(model, criterion, optimizer, scheduler, num_epochs, is_mixed_precision=True):
    since = time.time()
    best_model_wts = copy.deepcopy(model.state_dict())
    best_acc = 0.0
    
    # Gradient Scaler for Mixed Precision
    scaler = GradScaler(enabled=is_mixed_precision)

    for epoch in range(num_epochs):
        print(f'Epoch {epoch+1}/{num_epochs}')
        print('-' * 10)

        # Each epoch has a training and validation phase
        for phase in ['train', 'val']:
            if phase == 'train':
                model.train()
                dataloader = train_loader
            else:
                model.eval()
                dataloader = val_loader

            running_loss = 0.0
            running_corrects = 0

            # Iterate over data
            for inputs, labels in dataloader:
                inputs = inputs.to(device)
                labels = labels.to(device)

                optimizer.zero_grad()

                # Forward
                with torch.set_grad_enabled(phase == 'train'):
                    # Mixed Precision Context
                    with autocast(enabled=is_mixed_precision, dtype=torch.float16 if device.type == 'cuda' else torch.bfloat16):
                        outputs = model(inputs)
                        _, preds = torch.max(outputs, 1)
                        loss = criterion(outputs, labels)

                    # Backward + Optimize only if in training phase
                    if phase == 'train':
                        scaler.scale(loss).backward()
                        scaler.step(optimizer)
                        scaler.update()

                # Statistics
                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

            epoch_loss = running_loss / dataset_sizes[phase]
            epoch_acc = running_corrects.double() / dataset_sizes[phase]

            print(f'{phase} Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}')

            # Deep copy the model if it's the best one so far
            if phase == 'val' and epoch_acc > best_acc:
                best_acc = epoch_acc
                best_model_wts = copy.deepcopy(model.state_dict())
            
            # Step the scheduler if provided
            if phase == 'val' and scheduler:
                scheduler.step(epoch_loss)

        print()

    time_elapsed = time.time() - since
    print(f'Training complete in {time_elapsed // 60:.0f}m {time_elapsed % 60:.0f}s')
    print(f'Best val Acc: {best_acc:.4f}')

    # Load best weights
    model.load_state_dict(best_model_wts)
    return model

# ============ 4. PHASE 1: TRAIN HEAD ============
print(f"\n[3/5] Phase 1: Training Head ({EPOCHS_HEAD} Epochs)...")

criterion = nn.CrossEntropyLoss(label_smoothing=0.1) # Expert: Label smoothing helps generalization
optimizer = optim.Adam(model.classifier.parameters(), lr=LEARNING_RATE_HEAD)
# No scheduler for warm up phase
model = train_model(model, criterion, optimizer, scheduler=None, num_epochs=EPOCHS_HEAD, is_mixed_precision=(device.type=='cuda'))

# ============ 5. PHASE 2: FINE TUNING ============
print(f"\n[4/5] Phase 2: Fine-Tuning ({EPOCHS_FINE} Epochs)...")

# Unfreeze the last block of DenseNet
# DenseNet121 has 'features' block. We unlock the last denseblock.
for param in model.parameters():
    param.requires_grad = True # Unfreeze all
    
# Optional: Refreeze early layers if you want to be conservative
# for param in model.features[:8].parameters(): 
#     param.requires_grad = False

optimizer_ft = optim.AdamW(model.parameters(), lr=LEARNING_RATE_FINE, weight_decay=1e-4)
exp_lr_scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer_ft, mode='min', factor=0.1, patience=3, verbose=True)

model = train_model(model, criterion, optimizer_ft, scheduler=exp_lr_scheduler, num_epochs=EPOCHS_FINE, is_mixed_precision=(device.type=='cuda'))

# ============ 6. EVALUATION & SAVING ============
print("\n[5/5] Final Evaluation & Saving...")

model.eval()
y_true = []
y_pred = []

with torch.no_grad():
    for inputs, labels in val_loader:
        inputs = inputs.to(device)
        outputs = model(inputs)
        _, preds = torch.max(outputs, 1)
        y_true.extend(labels.cpu().numpy())
        y_pred.extend(preds.cpu().numpy())

print("\nConfusion Matrix:")
print(confusion_matrix(y_true, y_pred))

print("\nClassification Report:")
target_names = class_names 
print(classification_report(y_true, y_pred, target_names=target_names))

# Save Model
torch.save(model.state_dict(), MODEL_SAVE_PATH)

# Save Labels Metadata
# Generate mapping: Index -> Class Name -> Display Name
index_to_label = {str(i): name for i, name in enumerate(class_names)}
display_labels = [DISPLAY_MAP.get(name, name) for name in class_names]

labels_data = {
    "indices": class_names, # The actual folder names
    "index_to_label": index_to_label,
    "display_names": display_labels,
    "metadata": {
        "framework": "PyTorch",
        "model": "DenseNet121",
        "dataset_size": len(full_dataset)
    }
}

with open(LABELS_SAVE_PATH, "w", encoding="utf-8") as f:
    json.dump(labels_data, f, indent=2)

print("\n✅ SUCCESS!")
print(f"Model saved to: {MODEL_SAVE_PATH}")
print(f"Labels saved to: {LABELS_SAVE_PATH}")