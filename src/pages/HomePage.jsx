import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { uploadImage } from "../services/api";
import "./HomePage.css";

const HomePage = ({ setCurrentPage }) => {
  const uploadRef = useRef(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const scrollToUpload = () => {
    console.log("Get Started Now button clicked - scrolling to upload section");

    // First try using the ref
    if (uploadRef.current) {
      console.log("Upload ref found, scrolling...");
      uploadRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    // Fallback: try to find the element by ID
    console.log("Upload ref not found, trying fallback method...");
    const uploadElement = document.getElementById("upload");
    if (uploadElement) {
      console.log("Upload element found by ID, scrolling...");
      uploadElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    // Last resort: scroll to bottom of page
    console.log("Neither ref nor ID found, scrolling to bottom...");
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("File selected:", file.name);
      handleUpload(file);
    }
  };

  const handleUpload = async (file) => {
    setLoading(true);
    console.log("Starting upload process...");
    try {
      const result = await uploadImage(file);
      console.log("Upload successful:", result);

      // Store result data in localStorage for the result page
      localStorage.setItem("predictionResult", JSON.stringify(result));

      // Navigate to the results page
      setCurrentPage("result");
    } catch (error) {
      console.error("Upload failed:", error);
      let errorMessage = error.message;

      // Provide more user-friendly error messages
      if (errorMessage.includes("Unable to connect")) {
        errorMessage =
          "Unable to connect to the server. Please make sure the backend server is running on port 5003 and try again.";
      } else if (errorMessage.includes("Request timeout")) {
        errorMessage =
          "Request timeout. The server is taking too long to respond. Please try again.";
      } else if (errorMessage.includes("Network error")) {
        errorMessage =
          "Network error occurred. Please check your internet connection and try again.";
      } else if (errorMessage.includes("HTTP error")) {
        errorMessage = "Server error occurred. Please try again later.";
      }

      alert(`Upload failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted");
    if (fileInputRef.current && fileInputRef.current.files[0]) {
      console.log("File found in input, processing...");
      handleUpload(fileInputRef.current.files[0]);
    } else {
      console.log("No file selected");
      alert("Please select a file first");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div>
      {/* Animated Intro */}
      <motion.section
        className="intro"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        >
          🌿 Welcome to Gymnema Sylvestre Leaf Disease Detection
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        >
          Revolutionizing agricultural health with{" "}
          <b>Artificial Intelligence</b>. Upload a leaf photo and get instant,
          accurate disease diagnosis to ensure healthier cultivation and
          improved yield for your Gymnema Sylvestre plants.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        >
          <motion.button
            className="btn btn-success btn-lg"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 15px 30px rgba(46, 125, 50, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              console.log("Get Started Now button clicked");
              scrollToUpload();
            }}
          >
            🚀 Start Diagnosis
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Hero Section with Stats */}
      <motion.section
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
        >
          AI-Powered Precision Agriculture
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          Harness the power of machine learning to protect your crops and
          maximize yields with our cutting-edge disease detection technology
        </motion.p>

        {/* Stats Section */}
        <motion.div
          className="row mt-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="col-md-3 mb-4" variants={itemVariants}>
            <div
              className="p-4 bg-white rounded shadow"
              style={{ borderRadius: "15px" }}
            >
              <h3 className="text-success fw-bold">95%+</h3>
              <p className="text-muted">Accuracy Rate</p>
            </div>
          </motion.div>
          <motion.div className="col-md-3 mb-4" variants={itemVariants}>
            <div
              className="p-4 bg-white rounded shadow"
              style={{ borderRadius: "15px" }}
            >
              <h3 className="text-success fw-bold">10k+</h3>
              <p className="text-muted">Diseases Detected</p>
            </div>
          </motion.div>
          <motion.div className="col-md-3 mb-4" variants={itemVariants}>
            <div
              className="p-4 bg-white rounded shadow"
              style={{ borderRadius: "15px" }}
            >
              <h3 className="text-success fw-bold">500+</h3>
              <p className="text-muted">Farmers Served</p>
            </div>
          </motion.div>
          <motion.div className="col-md-3 mb-4" variants={itemVariants}>
            <div
              className="p-4 bg-white rounded shadow"
              style={{ borderRadius: "15px" }}
            >
              <h3 className="text-success fw-bold">24/7</h3>
              <p className="text-muted">Instant Results</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.button
          className="btn btn-success btn-lg mt-4"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 15px 30px rgba(46, 125, 50, 0.5)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.preventDefault();
            console.log(
              "Detect Leaf Disease Now button clicked - scrolling to upload"
            );
            scrollToUpload();
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          📸 Detect Leaf Disease Now
        </motion.button>
      </motion.section>

      {/* How It Works */}
      <motion.section
        className="steps"
        id="steps"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.8 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          How It Works
        </motion.h2>
        <div className="row">
          <motion.div
            className="col-md-4 step-box"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.5 }}
            whileHover={{ y: -10 }}
          >
            <motion.i
              className="bi bi-camera"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2.4, type: "spring", stiffness: 200 }}
            ></motion.i>
            <h5>Capture</h5>
            <p>
              Take a clear photo of your Gymnema leaf using your smartphone
              camera
            </p>
          </motion.div>
          <motion.div
            className="col-md-4 step-box"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.5 }}
            whileHover={{ y: -10 }}
          >
            <motion.i
              className="bi bi-cloud-upload"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2.6, type: "spring", stiffness: 200 }}
            ></motion.i>
            <h5>Upload</h5>
            <p>Submit your image to our advanced AI-powered detection system</p>
          </motion.div>
          <motion.div
            className="col-md-4 step-box"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 0.5 }}
            whileHover={{ y: -10 }}
          >
            <motion.i
              className="bi bi-bar-chart"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2.8, type: "spring", stiffness: 200 }}
            ></motion.i>
            <h5>Diagnose</h5>
            <p>
              Receive instant, accurate diagnosis with treatment recommendations
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="container my-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.0, duration: 0.8 }}
      >
        <motion.h2
          className="text-center mb-5 text-success fw-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Why Choose Our Platform?
        </motion.h2>
        <div className="row">
          <motion.div
            className="col-md-4 mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2, duration: 0.5 }}
          >
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <i
                  className="bi bi-lightning-fill text-success"
                  style={{ fontSize: "3rem" }}
                ></i>
                <h5 className="card-title mt-3">Lightning Fast</h5>
                <p className="card-text">
                  Get results in seconds, not days. Our AI processes images
                  instantly.
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="col-md-4 mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.4, duration: 0.5 }}
          >
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <i
                  className="bi bi-shield-fill-check text-success"
                  style={{ fontSize: "3rem" }}
                ></i>
                <h5 className="card-title mt-3">Scientifically Accurate</h5>
                <p className="card-text">
                  Trained on thousands of images with 95%+ accuracy rate.
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="col-md-4 mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.6, duration: 0.5 }}
          >
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <i
                  className="bi bi-phone text-success"
                  style={{ fontSize: "3rem" }}
                ></i>
                <h5 className="card-title mt-3">Mobile Friendly</h5>
                <p className="card-text">
                  Works seamlessly on any device - phone, tablet, or desktop.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Upload Section */}
      <motion.section
        className="upload-section"
        id="upload"
        ref={uploadRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.8, duration: 0.8 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          📤 Upload Your Leaf Image
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Ready to get started? Upload a clear image of your Gymnema Sylvestre
          leaf for instant disease detection
        </motion.p>
        <div className="container">
          <motion.div
            className="upload-box"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.4,
              duration: 0.6,
              type: "spring",
              stiffness: 300,
            }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)",
            }}
          >
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label fw-bold text-success">
                  Choose Image File
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="form-control form-control-lg"
                  accept="image/*"
                  required
                  onChange={handleFileChange}
                  disabled={loading}
                  style={{
                    padding: "15px",
                    border: "2px dashed #4caf50",
                    borderRadius: "15px",
                  }}
                />
                <div className="form-text text-muted mt-2">
                  Supported formats: JPG, PNG, JPEG (Max size: 5MB)
                </div>
              </div>
              <motion.button
                type="submit"
                className="btn btn-success detect-btn"
                disabled={loading}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 15px 30px rgba(46, 125, 50, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Analyzing Leaf...
                  </>
                ) : (
                  "📸 Detect Leaf Disease Now"
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
