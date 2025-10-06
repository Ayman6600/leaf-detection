import React from "react";
import { motion } from "framer-motion";

const FAQPage = () => {
  const faqSections = [
    {
      id: "powdery1",
      question: "How do I identify powdery mildew?",
      answer: "White powdery patches appear on leaves and stems.",
    },
    {
      id: "powdery2",
      question: "What conditions cause powdery mildew?",
      answer:
        "High humidity, crowding, and poor airflow encourage powdery mildew.",
    },
    {
      id: "leafspot",
      question: "What causes leaf spot?",
      answer: "Fungal or bacterial infection favored by wet conditions.",
    },
    {
      id: "aphids",
      question: "What do aphids look like?",
      answer: "Small green, black, or yellow insects on leaves and stems.",
    },
    {
      id: "consumption",
      question: "What are Gymnema's medicinal uses?",
      answer: "Helps manage diabetes, weight, and cholesterol.",
    },
    {
      id: "dosage",
      question: "Typical adult dosage?",
      answer: "200–400 mg extract or 2–3 grams dried leaf daily.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container py-5">
        <motion.h2
          className="text-center mb-5 fw-bold text-success"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          ❓ Frequently Asked Questions
        </motion.h2>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="accordion" id="faqAccordion">
              {faqSections.map((faq, index) => (
                <motion.div
                  className="accordion-item border-0 shadow-sm rounded-3 mb-3"
                  key={faq.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                >
                  <h2 className="accordion-header" id={`faq${index}`}>
                    <motion.button
                      className={`accordion-button rounded-3 ${
                        index !== 0 ? "collapsed" : ""
                      }`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${index}`}
                      whileHover={{ scale: 1.01 }}
                    >
                      <strong>{faq.question}</strong>
                    </motion.button>
                  </h2>
                  <div
                    id={`collapse${index}`}
                    className={`accordion-collapse collapse ${
                      index === 0 ? "show" : ""
                    }`}
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body rounded-3">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Search Section */}
        <motion.div
          className="card border-0 shadow rounded-4 mt-5"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className="card-body text-center">
            <h3 className="text-success mb-4">
              🔍 Can't find what you're looking for?
            </h3>
            <p className="lead">
              Search our knowledge base or contact our support team
            </p>
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control form-control-lg rounded-start-pill"
                    placeholder="Search FAQs..."
                  />
                  <motion.button
                    className="btn btn-success rounded-end-pill"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="bi bi-search"></i>
                  </motion.button>
                </div>
              </div>
            </div>
            <motion.button
              className="btn btn-outline-success btn-lg rounded-pill mt-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Support Team
            </motion.button>
          </div>
        </motion.div>

        {/* Helpful Resources */}
        <motion.div
          className="row mt-5"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <div className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow rounded-3 text-center">
              <div className="card-body">
                <i
                  className="bi bi-book text-success"
                  style={{ fontSize: "3rem" }}
                ></i>
                <h5 className="mt-3">Knowledge Base</h5>
                <p className="text-muted">Comprehensive guides and tutorials</p>
                <motion.button
                  className="btn btn-success btn-sm rounded-pill"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Browse
                </motion.button>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow rounded-3 text-center">
              <div className="card-body">
                <i
                  className="bi bi-camera text-success"
                  style={{ fontSize: "3rem" }}
                ></i>
                <h5 className="mt-3">Video Tutorials</h5>
                <p className="text-muted">Step-by-step video guides</p>
                <motion.button
                  className="btn btn-success btn-sm rounded-pill"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Watch
                </motion.button>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow rounded-3 text-center">
              <div className="card-body">
                <i
                  className="bi bi-people text-success"
                  style={{ fontSize: "3rem" }}
                ></i>
                <h5 className="mt-3">Community Forum</h5>
                <p className="text-muted">Connect with other users</p>
                <motion.button
                  className="btn btn-success btn-sm rounded-pill"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FAQPage;
