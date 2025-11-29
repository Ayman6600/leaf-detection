# 🌿 Leaf Disease Detection System

A full-stack AI application that detects plant leaf diseases using a deep learning CNN model. This system helps farmers identify early signs of infection by uploading real-time leaf images, enabling proactive disease management and improved crop yields.

## 📋 Overview

The Leaf Disease Detection System is designed to assist farmers in early disease detection for Gymnema Sylvestre plants. By leveraging advanced deep learning techniques, the system provides instant, accurate disease diagnosis with treatment recommendations.

### Key Features

- **AI-Powered Detection**: Deep learning CNN model (MobileNetV2) for accurate disease classification
- **Real-Time Processing**: Fast image upload and instant prediction results
- **Secure Image Handling**: Secure file upload and storage system
- **Confidence Scoring**: Detailed probability distribution for each disease class
- **Health Recommendations**: Treatment plans and care instructions based on detection results
- **Modern UI**: Responsive React frontend with intuitive user experience
- **RESTful API**: Fast Flask backend with efficient model inference

## 📁 Project Structure

```
leaf/
├── frontend/              # React frontend application
│   ├── src/              # React source code
│   ├── public/          # Static assets
│   ├── dist/            # Build output
│   ├── package.json     # Frontend dependencies
│   ├── vite.config.js   # Vite configuration
│   └── index.html       # HTML entry point
│
├── backend/              # Flask backend application
│   ├── app.py           # Flask API server
│   ├── Train.py         # Model training script
│   ├── dataset/         # Training and validation data
│   ├── static/          # Static files (uploads)
│   ├── templates/       # HTML templates
│   ├── plant_disease_model.h5  # Trained model
│   ├── labels.json      # Class labels
│   ├── requirements.txt # Python dependencies
│   └── venv/            # Python virtual environment
│
└── README.md            # This file
```

## 🛠️ Tech Stack

### Backend
- **Flask**: Web framework for API endpoints
- **TensorFlow/Keras**: Deep learning model training and inference
- **MobileNetV2**: Pre-trained CNN architecture for transfer learning
- **NumPy**: Numerical computations
- **Pillow**: Image processing
- **scikit-learn**: Model evaluation metrics

### Frontend
- **React**: Modern UI framework
- **Vite**: Fast build tool and dev server
- **Bootstrap 5**: Responsive CSS framework
- **Framer Motion**: Smooth animations
- **React Router**: Client-side routing

### Model
- **Architecture**: MobileNetV2 (transfer learning)
- **Input Size**: 224x224 pixels
- **Classes**: Powdery Mildew, Leaf Spot, Aphids, Healthy
- **Accuracy**: ~77.78% validation accuracy (improves with more training data)

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd leaf
   ```

2. **Backend Setup**
   ```bash
   cd backend
   
   # Create virtual environment
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   
   # Install dependencies
   npm install
   ```

4. **Train the Model** (Optional - model already included)
   ```bash
   cd backend
   python3 Train.py
   ```

### Running the Application

1. **Start the Flask Backend** (Terminal 1)
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   python3 app.py
   ```
   Backend will run on `http://localhost:5004`

2. **Start the React Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

3. **Access the Application**
   - Open your browser and navigate to `http://localhost:3000`
   - Upload a leaf image to get instant disease detection

## 🔧 Configuration

### Environment Variables

**Frontend** - Create `frontend/.env.local` for local development:
```
VITE_API_URL=http://localhost:5004
```

**Backend** - The Flask app runs on port 5004 by default. You can change this in `backend/app.py`:
```python
port = int(os.environ.get("PORT", 5004))
```

### Model Configuration

The model can be configured in `backend/Train.py`:
- `IMG_SIZE`: Image input size (default: 224)
- `BATCH_SIZE`: Training batch size (default: 16)
- `TOTAL_EPOCHS`: Number of training epochs (default: 4)
- `CLASS_ORDER`: Disease class order

## 📊 API Endpoints

### Health Check
```
GET /api/health
```
Returns API status and model loading state.

### Prediction
```
POST /predict
POST /api/predict
```
Upload an image file to get disease prediction.

**Request**: Multipart form data with `file` field
**Response**: JSON with prediction results, confidence scores, and treatment recommendations

## 🎯 Future Scope

The following enhancements are planned for future releases:

### Mobile App Integration
- Native iOS and Android applications
- Offline prediction capability
- Camera integration for direct image capture

### Multilingual Farmer Support
- Support for multiple languages (Hindi, Tamil, Telugu, etc.)
- Localized treatment recommendations
- Regional disease name mapping

### Weather-Based Predictive Alerts
- Integration with weather APIs
- Disease risk prediction based on weather conditions
- Proactive alerts for farmers

### Real-Time Crop Monitoring Dashboard
- Field-level disease tracking
- Historical trend analysis
- Comparative analytics across regions

### Model Improvements
- Transfer learning with additional datasets
- Ensemble models for better accuracy
- Support for more plant species
- Continuous learning from user feedback

## 📝 Deployment

### Frontend Deployment (Vercel)

1. Navigate to the frontend directory
2. Push the code to a GitHub repository
3. Create a new project on Vercel
4. Connect your GitHub repository
5. Set the root directory to `frontend`
6. Vercel will automatically detect the Vite project
7. Set the build command to `npm run build` and output directory to `dist`
8. Add environment variables in Vercel project settings:
   - `VITE_API_URL` = https://your-backend-url.com

### Backend Deployment (Render)

1. Navigate to the backend directory
2. Push the backend code to a GitHub repository
3. Create a new web service on Render
4. Connect your GitHub repository
5. Set the root directory to `backend`
6. Set the build command to `pip install -r requirements.txt`
7. Set the start command to `gunicorn --preload -w 1 app:app`
8. Add environment variables if needed

### Important Notes

- Ensure CORS is properly configured on your Flask backend
- The Flask backend should accept requests from your frontend domain
- Model file size may require special handling in deployment
- Update `frontend/src/services/api.js` with production API URL

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- TensorFlow team for the MobileNetV2 architecture
- React and Vite communities
- Bootstrap for the UI framework

---

**Built with ❤️ for farmers and agricultural communities**
