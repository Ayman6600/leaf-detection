import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import "./ResultPage.css";

const ResultPage = ({ setCurrentPage }) => {
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to determine cure information based on detection results
  const getCureInfo = (results) => {
    // Find the disease with the highest probability
    let maxDisease = "";
    let maxProbability = 0;

    Object.entries(results).forEach(([disease, probability]) => {
      if (probability > maxProbability) {
        maxProbability = probability;
        maxDisease = disease;
      }
    });

    // Provide cure information based on the detected disease
    switch (maxDisease) {
      case "Healthy":
        // For healthy leaves, provide general care tips
        return {
          disease: "Healthy Plant",
          percentage: maxProbability,
          cure: "Your Gymnema sylvestre plant is healthy! Continue with proper care:\n\n• Water when the top inch of soil feels dry\n• Provide bright, indirect sunlight\n• Maintain temperatures between 65-80°F\n• Ensure good air circulation\n• Fertilize monthly during growing season\n• Regularly inspect for pests and diseases",
        };

      case "Powdery mildew":
        return {
          disease: "Powdery Mildew",
          percentage: maxProbability,
          cure:
            maxProbability <= 30
              ? "Early Stage Treatment:\n• Remove affected leaves immediately\n• Improve air circulation around plants\n• Avoid overhead watering\n• Apply milk spray (1:10 ratio) weekly as preventive measure"
              : maxProbability <= 60
              ? "Moderate Stage Treatment:\n• Remove and dispose of infected plant material\n• Apply potassium bicarbonate solution (1 tbsp + ½ tsp liquid soap per gallon of water)\n• Spray thoroughly on both sides of leaves every 7-10 days\n• Space plants adequately for better air circulation"
              : "Severe Stage Treatment:\n• Remove heavily infected leaves and dispose in sealed bags\n• Apply sulfur-based fungicide according to manufacturer instructions\n• Treat surrounding plants as preventive measure\n• Improve growing conditions (airflow, spacing, watering practices)",
        };

      case "Leaf spot":
        return {
          disease: "Leaf Spot",
          percentage: maxProbability,
          cure:
            maxProbability <= 30
              ? "Early Stage Treatment:\n• Remove spotted leaves immediately\n• Avoid overhead watering\n• Improve air circulation\n• Apply neem oil spray (2ml per liter of water) as preventive measure"
              : maxProbability <= 60
              ? "Moderate Stage Treatment:\n• Remove and destroy infected leaves\n• Apply copper-based fungicide (follow label instructions)\n• Water at soil level, not on foliage\n• Increase spacing between plants for better airflow"
              : "Severe Stage Treatment:\n• Remove all severely affected leaves\n• Apply copper fungicide every 7-14 days\n• Consider crop rotation for next planting\n• Improve drainage and reduce humidity around plants",
        };

      case "Aphids (Aphis sp.)":
        return {
          disease: "Aphids Infestation",
          percentage: maxProbability,
          cure:
            maxProbability <= 30
              ? "Early Stage Treatment:\n• Spray plants with strong water jet to dislodge aphids\n• Introduce beneficial insects like ladybugs\n• Apply neem oil spray (2ml per liter of water) in the evening"
              : maxProbability <= 60
              ? "Moderate Stage Treatment:\n• Apply insecticidal soap (2 tsp per liter of water)\n• Spray thoroughly, covering undersides of leaves\n• Check for ants and control them (they protect aphids)\n• Repeat treatment every 3-4 days until controlled"
              : "Severe Stage Treatment:\n• Use neem oil or pyrethrin-based insecticide\n• Apply systemic insecticide if infestation persists\n• Remove heavily infested plant parts\n• Monitor and reapply treatment as needed",
        };

      default:
        return {
          disease: "Unknown Condition",
          percentage: maxProbability,
          cure: "Unable to determine specific treatment. Consult with a plant specialist for proper diagnosis and care recommendations.",
        };
    }
  };

  // Function to download the report as PDF
  const downloadReport = () => {
    if (!resultData) return;

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(40, 167, 69); // Bootstrap success color
    doc.text(
      "🌿 Gymnema Sylvestre Disease Detection Report",
      105,
      20,
      null,
      null,
      "center"
    );

    // Add separator line
    doc.setDrawColor(40, 167, 69);
    doc.line(20, 25, 190, 25);

    // Add prediction results
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`Predicted Disease: ${resultData.predicted_label}`, 20, 40);
    doc.text(`Confidence Level: ${resultData.confidence}%`, 20, 50);

    // Add probability distribution header
    doc.setFontSize(14);
    doc.text("Probability Distribution:", 20, 70);

    // Add probability distribution
    let yPosition = 80;
    doc.setFontSize(12);
    Object.entries(resultData.results).forEach(([disease, probability]) => {
      doc.text(`${disease}: ${probability}%`, 30, yPosition);
      yPosition += 10;
    });

    // Add cure information
    if (cureInfo) {
      yPosition += 15;
      doc.setFontSize(14);
      doc.setTextColor(40, 167, 69);
      doc.text("Recommended Treatment:", 20, yPosition);

      yPosition += 10;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Condition: ${cureInfo.disease}`, 20, yPosition);

      yPosition += 10;
      doc.text(`Confidence: ${cureInfo.percentage}%`, 20, yPosition);

      yPosition += 10;
      doc.text("Treatment Plan:", 20, yPosition);
      const lines = doc.splitTextToSize(cureInfo.cure, 170);
      for (let i = 0; i < lines.length; i++) {
        yPosition += 10;
        doc.text(lines[i], 30, yPosition);
      }
    }

    // Add separator line
    yPosition += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPosition, 190, yPosition);

    // Add timestamp
    const timestamp = new Date().toLocaleString();
    yPosition += 15;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Report Generated: ${timestamp}`, 20, yPosition);

    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "This report was generated by the LEAF Disease Detection System",
      105,
      280,
      null,
      null,
      "center"
    );

    // Generate filename
    const filename = `leaf-disease-report-${timestamp.replace(
      /[:/]/g,
      "-"
    )}.pdf`;

    // Save the PDF
    doc.save(filename);
  };

  useEffect(() => {
    // Retrieve result data from localStorage
    const storedResult = localStorage.getItem("predictionResult");
    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        setResultData(parsedResult);
      } catch (error) {
        console.error("Error parsing result data:", error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <motion.div
        className="bg-gradient d-flex align-items-center justify-content-center min-vh-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.div
            className="spinner-border text-success"
            role="status"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <span className="visually-hidden">Loading...</span>
          </motion.div>
          <motion.p
            className="mt-3 fs-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Analyzing your leaf image...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  if (!resultData) {
    return (
      <motion.div
        className="bg-gradient d-flex align-items-center justify-content-center min-vh-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container">
          <motion.div
            className="card shadow-xl rounded-4 p-5 text-center border-0"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <i
              className="bi bi-exclamation-circle text-warning"
              style={{ fontSize: "4rem" }}
            ></i>
            <h2 className="mt-4">No Results Found</h2>
            <p className="lead">
              Please upload an image first to see the detection results.
            </p>
            <motion.button
              className="btn btn-success btn-lg rounded-pill mt-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage("home")}
            >
              <span className="text-white text-decoration-none">
                📤 Upload Image
              </span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Get cure information for display
  const cureInfo = resultData ? getCureInfo(resultData.results) : null;

  return (
    <motion.div
      className="bg-gradient min-vh-100 py-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container d-flex align-items-center justify-content-center">
        <motion.div
          className="card shadow-xl rounded-4 p-4 border-0"
          style={{ maxWidth: "960px", width: "100%" }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-4">
            <motion.h2
              className="fw-bold text-success"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              🌱 Disease Detection Results
            </motion.h2>
            <motion.p
              className="text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Analysis completed successfully
            </motion.p>
          </div>

          <div className="row g-4 align-items-center">
            <div className="col-md-5 text-center">
              {resultData.img_url ? (
                <motion.img
                  src={`http://localhost:5003${resultData.img_url}`}
                  className="img-fluid rounded-4 border shadow-sm"
                  alt="Uploaded leaf"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                />
              ) : (
                <motion.div
                  className="bg-light rounded-4 border d-flex align-items-center justify-content-center"
                  style={{ height: "250px" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <i
                    className="bi bi-image text-muted"
                    style={{ fontSize: "4rem" }}
                  ></i>
                </motion.div>
              )}
            </div>

            <div className="col-md-7">
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <div className="mb-4 p-3 bg-success rounded-3 text-white">
                  <p className="lead mb-1">Predicted Disease:</p>
                  <h3 className="fw-bold mb-2">{resultData.predicted_label}</h3>
                  <p className="mb-0">
                    Confidence: <strong>{resultData.confidence}%</strong>
                  </p>
                </div>

                <h5 className="fw-bold text-success mb-3">
                  Probability Distribution
                </h5>
                {Object.entries(resultData.results).map(
                  ([name, probability], index) => (
                    <motion.div
                      className="mb-3"
                      key={name}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.0 + index * 0.1, duration: 0.4 }}
                    >
                      <div className="d-flex justify-content-between small mb-1">
                        <span>{name}</span>
                        <span>{probability}%</span>
                      </div>
                      <div
                        className="progress"
                        role="progressbar"
                        aria-label={`${name} probability`}
                        aria-valuenow={probability}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <motion.div
                          className="progress-bar bg-success"
                          style={{ width: `${probability}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${probability}%` }}
                          transition={{
                            delay: 1.2 + index * 0.1,
                            duration: 0.8,
                            ease: "easeOut",
                          }}
                        ></motion.div>
                      </div>
                    </motion.div>
                  )
                )}

                {/* Cure Information Section */}
                {cureInfo && (
                  <motion.div
                    className="mt-4 p-3 bg-info rounded-3 text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    <h5 className="fw-bold mb-2">🌿 Recommended Treatment</h5>
                    <p className="mb-1">
                      <strong>Condition:</strong> {cureInfo.disease}
                    </p>
                    <p className="mb-1">
                      <strong>Confidence:</strong> {cureInfo.percentage}%
                    </p>
                    <p className="mb-0">
                      <strong>Treatment Plan:</strong> {cureInfo.cure}
                    </p>
                  </motion.div>
                )}

                <div className="d-grid gap-2 mt-4">
                  <motion.button
                    className="btn btn-success rounded-pill"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentPage("home")}
                  >
                    <span className="text-white text-decoration-none">
                      🔙 Upload Another Image
                    </span>
                  </motion.button>
                  <motion.button
                    className="btn btn-outline-success rounded-pill"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={downloadReport}
                  >
                    <i className="bi bi-download me-2"></i>
                    Download Report
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultPage;
