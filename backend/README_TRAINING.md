# Training the Leaf Disease Detection Model

## 🚀 Improvements Implemented
I have updated `Train.py` with expert-level improvements to fix the "99% confidence" issue and improve performance:

1.  **Increased Epochs**: Set to `50` (was 12). This allows the model to learn properly. `EarlyStopping` is enabled to prevent overfitting.
2.  **Class Weights**: Critical for your imbalanced dataset. The script now calculates and applies them to penalize the model for ignoring minority classes (Aphids, Healthy).
3.  **Confusion Matrix**: The script now prints a confusion matrix at the end so you can see exactly *what* is being misclassified.
4.  **Model Collapse Check**: Added a safety check to warn you if the model predicts only one class for everything.
5.  **Lower Learning Rate**: Reduced to `1e-4` for fine-tuning, which helps stabilize training.
6.  **Data Augmentation**: Increased rotation and zoom to help with the small dataset.

## ⚠️ Environment Issue (AVX / Mac)
I attempted to run the training, but your environment is throwing an error:
`The TensorFlow library was compiled to use AVX instructions, but these aren't available on your machine.`

This happens on Apple Silicon (M1/M2) Macs when using a Python/TensorFlow version meant for Intel chips.

**To fix this:**
1.  Create a new virtual environment using your system Python (which is usually ARM-native):
    ```bash
    python3 -m venv venv-metal
    source venv-metal/bin/activate
    ```
2.  Install the Mac-optimized TensorFlow:
    ```bash
    pip install tensorflow-macos tensorflow-metal
    pip install -r requirements.txt
    ```
3.  Run the training:
    ```bash
    python backend/Train.py
    ```

## 📊 How to Interpret Results
After training, look at the **Confusion Matrix** in the output.
-   **Diagonal numbers** (top-left to bottom-right) are correct predictions.
-   **Off-diagonal numbers** are errors.
-   If you see a whole column of zeros (except for one class), the model is still collapsing. In that case, you **must** collect more data for "Aphids" and "Healthy".
