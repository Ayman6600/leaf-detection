import os
import shutil
import random
from pathlib import Path

# Config
dataset_dir = Path("dataset/train")

def balance_classes():
    print("⚖️  Balancing Dataset...")
    
    # 1. Count images in each class
    class_counts = {}
    classes = [d for d in dataset_dir.iterdir() if d.is_dir()]
    
    for class_dir in classes:
        count = len(list(class_dir.glob("*")))
        class_counts[class_dir.name] = count
    
    if not class_counts:
        print("❌ No data found in dataset/train")
        return

    max_count = max(class_counts.values())
    print(f"📊 Largest class has {max_count} images. Balancing others to match...")

    # 2. Oversample smaller classes
    for class_dir in classes:
        current_count = class_counts[class_dir.name]
        
        if current_count < max_count:
            needed = max_count - current_count
            print(f"   ↳ {class_dir.name}: Adding {needed} duplicate images...")
            
            files = list(class_dir.glob("*"))
            if not files:
                print(f"     ⚠️  Skipping {class_dir.name} (empty folder)")
                continue
                
            for i in range(needed):
                src = random.choice(files)
                # Create a unique name for the duplicate
                dst = class_dir / f"aug_{i}_{src.name}"
                shutil.copy(src, dst)
                
    print("✅ Dataset Balanced! All classes now have equal weight.")

if __name__ == "__main__":
    balance_classes()