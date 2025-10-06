import React, { useState } from "react";
import { motion } from "framer-motion";

const DosagePage = () => {
  const [ageGroup, setAgeGroup] = useState("");
  const [formType, setFormType] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const dosages = {
      adult: {
        capsule: "Take 1 capsule (500 mg) twice daily with meals.",
        powder: "Mix 1 g with water or juice, twice daily after meals.",
        tea: "Steep 2 g dried leaves in hot water for 10 minutes, drink twice daily.",
      },
      elderly: {
        capsule:
          "Start with 1 capsule (500 mg) once daily. Increase to twice daily only if tolerated.",
        powder:
          "Start with 1 g once daily. Increase to twice daily if no side effects.",
        tea: "Steep 2 g dried leaves, drink once daily. Increase to twice daily if tolerated.",
      },
      children: {
        capsule: null,
        powder: null,
        tea: null,
      },
    };

    let dosageText = dosages[ageGroup][formType];
    let warning = "";

    if (ageGroup === "children") {
      warning =
        "⚠️ Gymnema sylvestre is unsafe for children under 18 years. Avoid all forms.";
      dosageText = "Not recommended.";
    }

    setResult({
      ageGroup: ageGroup.charAt(0).toUpperCase() + ageGroup.slice(1),
      formType: formType.charAt(0).toUpperCase() + formType.slice(1),
      dosageText,
      warning,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container py-5">
        <motion.h2
          className="mb-4 text-success fw-bold text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          🧪 Consumption & Dosage Guide
        </motion.h2>

        <motion.div
          className="card border-0 shadow rounded-4 mb-5"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="card-body">
            <h4>Introduction to Gymnema Sylvestre</h4>
            <p>
              <em>Gymnema sylvestre</em> is a woody climbing plant native to the
              tropical forests of India, Africa, and Australia. Known in
              Ayurveda as <strong>“Gurmar” (sugar destroyer)</strong>, it has
              been valued for centuries for its role in supporting healthy sugar
              metabolism and reducing the perception of sweetness.
            </p>
          </div>
        </motion.div>

        <div className="row">
          <motion.div
            className="col-md-6 mb-4"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="card h-100 border-0 shadow rounded-3">
              <div className="card-body">
                <h4 className="text-success">Traditional Uses</h4>
                <ul>
                  <li>
                    <strong>Sugar control:</strong> Managing excess sugar in the
                    body.
                  </li>
                  <li>
                    <strong>Digestive aid:</strong> Supports digestion and
                    balances doshas.
                  </li>
                  <li>
                    <strong>Craving management:</strong> Chewing leaves to dull
                    sweet taste and reduce sugar cravings.
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="col-md-6 mb-4"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="card h-100 border-0 shadow rounded-3">
              <div className="card-body">
                <h4 className="text-success">Modern Applications</h4>
                <ul>
                  <li>
                    Blood sugar balance through teas, capsules, and extracts.
                  </li>
                  <li>Weight management by curbing sugar cravings.</li>
                  <li>
                    Metabolic wellness for healthy lipid and glucose levels.
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="card border-0 shadow rounded-4 mt-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <div className="card-body">
            <h3 className="text-success text-center mb-4">
              ⚕️ Gymnema Dosage Calculator
            </h3>

            {/* Dosage Input Form */}
            <form id="dosageForm" className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <label htmlFor="ageGroup" className="form-label fw-bold">
                  Select Age Group
                </label>
                <select
                  className="form-select form-select-lg"
                  id="ageGroup"
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  required
                  style={{ padding: "12px", borderRadius: "10px" }}
                >
                  <option value="">-- Choose --</option>
                  <option value="adult">Adults (18–60)</option>
                  <option value="elderly">Elderly (60+)</option>
                  <option value="children">Children (&lt;18)</option>
                </select>
              </div>

              <div className="col-md-6">
                <label htmlFor="formType" className="form-label fw-bold">
                  Preferred Form
                </label>
                <select
                  className="form-select form-select-lg"
                  id="formType"
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  required
                  style={{ padding: "12px", borderRadius: "10px" }}
                >
                  <option value="">-- Choose --</option>
                  <option value="capsule">Capsule</option>
                  <option value="powder">Powder</option>
                  <option value="tea">Tea</option>
                </select>
              </div>

              <div className="col-12 text-center mt-4">
                <motion.button
                  type="submit"
                  className="btn btn-success btn-lg rounded-pill px-5"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔍 Get Personalized Dosage
                </motion.button>
              </div>
            </form>

            {/* Result Section */}
            {result && (
              <motion.div
                id="resultBox"
                className="mt-5 p-4 rounded-3 bg-white border border-success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h4 className="fw-bold text-success mb-3">
                  📋 Recommended Dosage
                </h4>
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>Age Group:</strong>{" "}
                      <span className="text-success">{result.ageGroup}</span>
                    </p>
                    <p>
                      <strong>Form:</strong>{" "}
                      <span className="text-success">{result.formType}</span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="fw-bold fs-5 text-success">
                      {result.dosageText}
                    </p>
                  </div>
                </div>

                {result.warning && (
                  <div className="alert alert-danger mt-3 rounded-3">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {result.warning}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DosagePage;
