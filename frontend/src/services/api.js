// API service to handle communication with the backend
const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    const url = import.meta.env.VITE_API_URL;
    if (!url) {
      console.warn("VITE_API_URL is not set! API calls will fail. Please set this to your Backend URL (e.g., Render.com URL).");
      return "http://localhost:5004"; // Fallback that will likely fail with Connection Refused
    }
    if (url.includes(window.location.hostname)) {
      console.error("CRITICAL CONFIG ERROR: VITE_API_URL is set to the Frontend URL. It MUST point to the Python Backend.");
    }
    return url;
  }
  return "http://localhost:5004";
};

const API_BASE_URL = getApiBaseUrl();

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const askAgricultureAssistant = async (question, context = null) => {
  try {
    const requestBody = { question };
    if (context) {
      requestBody.context = context;
    }

    const response = await fetch(`${API_BASE_URL}/api/assistant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error asking agriculture assistant:", error);
    throw error;
  }
};

const predictDisease = async (file) => {
  return uploadImage(file);
};

export default {
  uploadImage,
  predictDisease,
  askAgricultureAssistant,
};
