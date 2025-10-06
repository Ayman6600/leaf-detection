// API service to handle communication with the backend
const API_BASE_URL = "http://localhost:5003"; // Flask server API endpoint

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

export default {
  uploadImage,
};
