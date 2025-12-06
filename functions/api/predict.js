export async function onRequest(context) {
  const { request } = context;
  
  // Mock prediction response - replace with TensorFlow.js model later
  if (request.method === 'POST') {
    try {
      const formData = await request.formData();
      const file = formData.get('file');
      
      if (!file) {
        return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });
      }
      
      // Placeholder: Real implementation would load TensorFlow.js model
      const mockPrediction = {
        disease: 'Healthy',
        confidence: 0.92,
        description: 'Your plant appears healthy.',
        recommendation: 'Continue regular care and monitoring.',
        status: 'success'
      };
      
      return new Response(JSON.stringify(mockPrediction), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
  
  // Handle OPTIONS for CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  
  return new Response('Method not allowed', { status: 405 });
}
