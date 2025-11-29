// API service to handle communication with the backend
const API_BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || "http://localhost:5004" // Use VITE_API_URL in production or fallback
  : "http://localhost:5004"; // Flask server API endpoint

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
