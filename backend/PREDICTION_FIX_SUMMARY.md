# Prediction Pipeline Fix Summary

## Root Causes Identified

### 1. **CRITICAL: Index-to-Label Mapping Bug**
   - **Problem**: In `Train.py`, `index_to_class` was created with integer keys `{0: "Powdery_mildew", ...}`, but when saved to JSON, it needed explicit string keys for consistency
   - **Impact**: Backend might misinterpret class indices, leading to wrong predictions
   - **Fix**: Explicitly use string keys when creating `index_to_label_canonical` mapping

### 2. **Class Order Inconsistency**
   - **Problem**: Potential mismatch between training class order and inference class order
   - **Impact**: Model outputs index 0, but backend might map it to wrong class
   - **Fix**: Ensure `ordered_classes` is built directly from generator's `class_indices` and saved correctly

### 3. **Label Mapping Chain Issues**
   - **Problem**: Complex mapping chain (index → canonical → display) could break at any step
   - **Impact**: Wrong labels shown to users even if prediction is correct
   - **Fix**: Clear, validated mapping chain with explicit conversions

### 4. **Missing Validation**
   - **Problem**: No validation of prediction shape, probability sum, or mapping consistency
   - **Impact**: Silent failures or incorrect outputs
   - **Fix**: Added comprehensive validation and error messages

## Changes Made

### Train.py Fixes

1. **Fixed index_to_label mapping** (Line 191-211):
   ```python
   # OLD (buggy):
   index_to_class = {v: k for k, v in class_indices.items()}  # Integer keys
   labels = {"index_to_label": index_to_class}
   
   # NEW (fixed):
   index_to_class = {str(v): k for k, v in class_indices.items()}  # String keys
   index_to_label_canonical = {str(i): ordered_classes[i] for i in range(len(ordered_classes))}
   labels = {"index_to_label": index_to_label_canonical}  # Explicit string keys
   ```

2. **Added debugging output**:
   - Print generator class_indices
   - Print ordered classes
   - Print index_to_label mapping
   - Print display_map

3. **Saved class_indices_from_generator** in metadata for debugging

### app.py Fixes

1. **Improved label loading** (Lines 65-120):
   - Clear separation: canonical names vs display names
   - Explicit validation of mapping consistency
   - Better error messages
   - Debug output on startup

2. **Fixed index_to_label mapping chain** (Lines 106-116):
   ```python
   # Step 1: Get canonical name from index (raw_index_to_label)
   # Step 2: Convert canonical → display name (display_map)
   index_to_label = {}
   for idx_str in [str(i) for i in range(len(class_order))]:
       canonical_name = raw_index_to_label.get(idx_str)
       display_name = display_map.get(canonical_name, canonical_name)
       index_to_label[idx_str] = display_name
   ```

3. **Enhanced preprocess_image function** (Lines 197-214):
   - Added detailed docstring explaining preprocessing steps
   - Ensures exact match with training preprocessing
   - Uses MobileNetV2 `preprocess_input` (normalizes to [-1, 1])

4. **Improved prediction handling** (Lines 179-222):
   - Better shape validation
   - Probability sum validation
   - Clearer error messages
   - Debug output in DEBUG mode

5. **Updated API response format** (Lines 227-254):
   - Added required fields: `disease`, `confidence` (0-1), `description`, `recommendation`
   - Maintained backward compatibility with existing fields
   - Added `get_disease_info()` helper function

6. **Added get_disease_info() function** (Lines 127-195):
   - Returns description and recommendation based on disease and confidence
   - Handles severity levels (early/moderate/severe)
   - Supports all disease types

## Preprocessing Consistency

### Training Preprocessing:
```python
def preprocess_for_training(img):
    return preprocess_input(img)  # MobileNetV2 normalization

train_datagen = ImageDataGenerator(
    preprocessing_function=preprocess_for_training,
    # ... augmentation parameters
)
```

### Inference Preprocessing:
```python
def preprocess_image(path: str, target_size=(224, 224)):
    img = keras_image.load_img(path, target_size=target_size)
    arr = keras_image.img_to_array(img).astype("float32")
    arr = preprocess_input(arr)  # Same MobileNetV2 normalization
    arr = np.expand_dims(arr, axis=0)
    return arr
```

**✅ Both use `preprocess_input` from MobileNetV2 - consistent!**

## Class Label Mapping Flow

### Training:
1. Generator creates `class_indices`: `{"Powdery_mildew": 0, "Leaf_Spot": 1, ...}`
2. Create `ordered_classes`: `["Powdery_mildew", "Leaf_Spot", "Aphids", "Healthy"]`
3. Create `index_to_label_canonical`: `{"0": "Powdery_mildew", "1": "Leaf_Spot", ...}`
4. Save to `labels.json`

### Inference:
1. Load `labels.json`
2. Get `raw_index_to_label`: `{"0": "Powdery_mildew", ...}` (canonical names)
3. Get `display_map`: `{"Powdery_mildew": "Powdery mildew", ...}`
4. Build `index_to_label`: `{"0": "Powdery mildew", ...}` (display names)
5. Use `index_to_label[str(best_idx)]` for API response

## API Response Format

### Required Fields (as specified):
```json
{
  "disease": "Powdery mildew",           // string
  "confidence": 0.856,                   // float 0-1
  "description": "Powdery mildew is...", // string
  "recommendation": "Remove affected...", // string
  ...
}
```

### Backward Compatibility Fields:
```json
{
  "predicted_label": "Powdery mildew",
  "predicted_index": 0,
  "results": {
    "Powdery mildew": 85.6,
    "Leaf spot": 8.2,
    ...
  },
  "img_url": "...",
  "status": "success"
}
```

## Testing Checklist

After applying fixes:

1. **Retrain the model**:
   ```bash
   cd backend
   python3 Train.py
   ```
   - Verify `labels.json` is created with correct structure
   - Check console output for class order and mappings

2. **Restart Flask backend**:
   ```bash
   python3 app.py
   ```
   - Check startup logs for label loading
   - Verify "Final index_to_label (display)" output

3. **Test prediction**:
   - Upload a known image (e.g., from validation set)
   - Verify prediction matches expected class
   - Check confidence values are reasonable (0-1)
   - Verify description and recommendation are present

4. **Validate preprocessing**:
   - Ensure no double normalization
   - Check image is resized to 224x224
   - Verify MobileNetV2 preprocessing is applied

## Key Improvements

1. ✅ **Explicit string keys** in index_to_label mapping
2. ✅ **Validated mapping chain** with error checking
3. ✅ **Consistent preprocessing** between training and inference
4. ✅ **Better error messages** for debugging
5. ✅ **API response format** matches requirements
6. ✅ **Model loaded once** at startup (already implemented)
7. ✅ **Thread-safe predictions** (already implemented)

## Next Steps

1. **Retrain the model** to generate new `labels.json` with correct structure
2. **Restart the backend** to load new labels
3. **Test with validation images** to verify correct predictions
4. **Monitor logs** for any warnings or errors

## Debugging Tips

If predictions are still wrong:

1. Check `labels.json` structure:
   ```bash
   cat backend/labels.json | python3 -m json.tool
   ```

2. Verify class order matches:
   - Training: Check `ordered_classes` in Train.py output
   - Inference: Check "Class order:" in app.py startup logs

3. Test preprocessing:
   - Add debug prints in `preprocess_image()` to verify image shape and value range

4. Check prediction probabilities:
   - Enable DEBUG mode in app.py
   - Check "All probabilities" output

5. Validate model output:
   - Ensure model outputs 4 classes (NUM_CLASSES)
   - Check probabilities sum to ~1.0

---

**All fixes applied!** The prediction pipeline should now work correctly with proper class mapping and consistent preprocessing.

