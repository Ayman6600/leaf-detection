# Debugging Report: Leaf Disease Detection Model

## 🔍 Findings

### 1. Dataset Imbalance
Your dataset is extremely imbalanced. This is likely the primary cause of the model collapsing to one class.
- **Leaf_Spot**: ~3867 images
- **Powdery_mildew**: ~1683 images
- **Healthy**: ~466 images
- **Aphids**: ~96 images

**Impact**: The model sees "Leaf_Spot" 40 times more often than "Aphids". Even with class weights, the model might just learn to predict "Leaf_Spot" to minimize loss quickly.

### 2. Validation Logic
The previous `validate_model.py` was loading images directly from `dataset/train` without splitting. This means you were testing on the exact same images the model trained on.
- **Fix**: I updated `validate_model.py` to use the same `validation_split=0.2` and `seed=123` as `Train.py`. This ensures you are testing on unseen data (the validation set).

### 3. Model Collapse
If your model predicts 99% confidence for one class (likely Leaf_Spot) for almost every image, it has "collapsed". This happens when the model finds a local minimum where it just guesses the majority class and ignores the features.

## 🛠 How to Debug

I have updated `backend/validate_model.py` to be a powerful debugging tool.

**Run it with:**
```bash
python backend/validate_model.py
```

**What to look for in the output:**
1.  **Prediction Distribution**: If it shows 100% for one class, the model is broken.
2.  **Confusion Matrix**: You want to see numbers on the diagonal. If you see a full column for one class, that's the issue.
3.  **Confidence**: If confidence is >99% for wrong predictions, the model is overfitting or the loss function is fighting the class weights.

## 🚀 Recommended Fixes

1.  **Balance the Dataset (Best)**:
    - Add more images for **Aphids** and **Healthy**.
    - If you can't find more, duplicate the existing ones (Oversampling) so that each class has at least 1000 images.

2.  **Aggressive Augmentation**:
    - Increase augmentation for the minority classes specifically.

3.  **Adjust Training**:
    - If using Class Weights isn't enough, try **Focal Loss** (which focuses on hard-to-classify examples).
    - Reduce Learning Rate (e.g., `1e-4` instead of `1e-3`) to prevent the model from jumping to the "easy" solution (predicting majority class).
