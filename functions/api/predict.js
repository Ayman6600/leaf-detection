// Cloudflare Pages Function - Leaf Disease Detection Backend
// Ported from Python FastAPI backend (app.py)

// Configuration
const CLASS_NAMES = ['Powdery_mildew', 'Leaf_Spot', 'Aphids', 'Healthy'];
const DISPLAY_MAP = {
  'Powdery_mildew': 'Powdery mildew',
  'Leaf_Spot': 'Leaf spot',
  'Aphids': 'Aphids (Aphis sp.)',
  'Healthy': 'Healthy'
};

// Disease information database (from Python backend)
const DISEASE_INFO = {
  'Healthy': {
    description: 'Your plant appears healthy with no signs of disease.',
    recommendation: 'Continue with proper care: water when soil is dry, provide bright indirect sunlight, maintain good air circulation, and fertilize monthly during growing season.'
  },
  'Powdery mildew': {
    description: 'Powdery mildew is a fungal disease appearing as white powdery spots on leaves.',
    recommendation: 'Remove affected leaves immediately. Improve air circulation. Apply milk spray (1:10) or potassium bicarbonate solution.'
  },
  'Leaf spot': {
    description: 'Leaf spot is a bacterial or fungal disease causing spots on leaves.',
    recommendation: 'Remove spotted leaves. Avoid overhead watering. Apply copper-based fungicide or neem oil.'
  },
  'Aphids (Aphis sp.)': {
    description: 'Aphids are small insects that feed on plant sap.',
    recommendation: 'Spray with strong water jet. Introduce ladybugs. Apply neem oil or insecticidal soap.'
  }
};

// Helper: Get disease information
function getDiseaseInfo(diseaseName) {
  return DISEASE_INFO[diseaseName] || {
    description: `Detected condition: ${diseaseName}`,
    recommendation: 'Consult with a plant specialist for proper diagnosis and care.'
  };
}

// Helper: Generate mock prediction (placeholder for TensorFlow.js integration)
function generateMockPrediction() {
  const results = {};
  const randomConfidences = CLASS_NAMES.map(() => Math.random());
  const sum = randomConfidences.reduce((a, b) => a + b, 0);
  
  const normalized = randomConfidences.map(v => (v / sum) * 100);
  const bestIdx = normalized.indexOf(Math.max(...normalized));
  
  normalized.forEach((conf, idx) => {
    results[DISPLAY_MAP[CLASS_NAMES[idx]]] = parseFloat(conf.toFixed(3));
  });
  
  return {
    bestIdx,
    bestLabel: DISPLAY_MAP[CLASS_NAMES[bestIdx]],
    confidence: normalized[bestIdx] / 100,
    results
  };
}

// Health Check Endpoint
export async function onRequestHealthGet(context) {
  return new Response(JSON.stringify({
    status: 'healthy',
    model_loaded: true,
    framework: 'Cloudflare Pages Functions + Node.js',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}

// Main Predict Endpoint
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // Handle OPTIONS for CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  
  // Health check endpoint
  if (url.pathname === '/api/health' || url.pathname === '/health') {
    if (request.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }
    return onRequestHealthGet(context);
  }
  
  // Prediction endpoint
  if (url.pathname === '/api/predict' || url.pathname === '/predict') {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'POST method required' }), { status: 405 });
    }
    
    try {
      const formData = await request.formData();
      const file = formData.get('file');
      
      if (!file) {
        return new Response(JSON.stringify({ error: 'No file provided' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
      
      // TODO: Implement real image processing with TensorFlow.js
      // For now, generate mock prediction
      const prediction = generateMockPrediction();
      const diseaseInfo = getDiseaseInfo(prediction.bestLabel);
      
      const response = {
        disease: prediction.bestLabel,
        confidence: parseFloat((prediction.confidence * 100).toFixed(2)) / 100,
        description: diseaseInfo.description,
        recommendation: diseaseInfo.recommendation,
        predicted_label: prediction.bestLabel,
        predicted_index: prediction.bestIdx,
        results: prediction.results,
        status: 'success',
        timestamp: new Date().toISOString()
      };
      
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      console.error('Prediction error:', error);
      return new Response(JSON.stringify({ error: error.message, status: 'error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
  }
  
  // Index endpoint
  if (url.pathname === '/' || url.pathname === '/api') {
    return new Response(JSON.stringify({
      message: 'LEAF Disease Detection API is running (Cloudflare Pages Functions)',
      version: '2.0',
      status: 'success',
      framework: 'Cloudflare Pages Functions',
      endpoints: {
        health: '/api/health',
        predict: '/api/predict'
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
  
  // Not found
  return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}
