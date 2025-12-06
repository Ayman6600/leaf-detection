# CORS Error Fix for localhost:5004

## Quick Fix (DO THIS FIRST - Takes 2 Minutes):

### STEP 1: Disable Browser Extensions
1. Open **DevTools** (F12)
2. Check **Console tab** for errors
3. If you see `ERR_BLOCKED_BY_CLIENT` - it's likely an extension (AdBlocker, uBlock, Privacy Badger)
4. **Temporarily disable all extensions** and try again

### STEP 2: Make sure Backend is Running
```bash
cd backend
python app.py
```
You should see:
```
INFO:     Application startup complete
INFO:     Uvicorn running on http://0.0.0.0:5004
```

### STEP 3: Verify CORS is Enabled
Open your browser and visit:
```
http://localhost:5004/api/health
```
You should see:
```json
{"status": "healthy", "model_loaded": true, "framework": "FastAPI + PyTorch"}
```

## If it STILL doesn't work:

### Issue: Frontend calling localhost from Cloudflare Pages
**Problem:** Your React app is deployed on Cloudflare Pages (HTTPS), but trying to call HTTP localhost

**Solution:**
1. **For LOCAL TESTING:** Run frontend locally too
   ```bash
   cd frontend
   npm start  # runs on localhost:3000
   ```

2. **For PRODUCTION:** Deploy backend to public server
   - Use Render (free): https://render.com
   - Use Railway: https://railway.app
   - Update frontend to call deployed backend URL

## CORS Middleware is Already Configured
Your app.py lines 189-196:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
This allows requests from ANY origin ✅

## Quick Test Command
```bash
curl -X POST http://localhost:5004/predict -F "file=@test_image.jpg"
```

## Common Causes & Fixes:
| Error | Cause | Fix |
|-------|-------|-----|
| `ERR_BLOCKED_BY_CLIENT` | Browser extension | Disable extensions |
| `ERR_CONNECTION_REFUSED` | Backend not running | Run `python app.py` |
| `CORS error in console` | Frontend on different domain | Deploy both or run locally |
| 503 error | Model not loaded | Check backend logs |

**Status:** ✅ Backend CORS is properly configured. Issue is likely browser extension or backend not running.
