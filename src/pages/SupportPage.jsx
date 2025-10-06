import React from "react";
import { motion } from "framer-motion";

const SupportPage = () => {
  const supportSections = [
    {
      id: "soil",
      title: "1. Soil Preparation",
      content: [
        "Preferred Soil Type: Well-draining loamy to sandy soil.",
        "Soil pH: 6.0 – 7.5 (slightly acidic to neutral).",
        "Nutrient Enrichment: Add compost or FYM at 20–30% volume.",
        "Drainage: Ensure good drainage to avoid root rot.",
      ],
    },
    {
      id: "planting",
      title: "2. Planting & Propagation",
      content: [
        "Seeds: Soak for 24 hrs before sowing.",
        "Cuttings: Use hardwood cuttings, 3 nodes each.",
        "Spacing: 1–1.5m between rows, 0.5–1m within row.",
        "Planting Time: Onset of rainy season is best.",
      ],
    },
    {
      id: "irrigation",
      title: "3. Irrigation Management",
      content: [
        "Use drip or sprinkler irrigation for efficiency.",
        "Keep soil moist but avoid waterlogging.",
        "Reduce watering during dormant periods.",
      ],
    },
    {
      id: "nutrient",
      title: "4. Nutrient Management",
      content: [
        "Apply well-rotted FYM (4000 kg/ha).",
        "Use NPK 10-10-10 every 4–6 weeks.",
        "Do soil testing regularly.",
      ],
    },
    {
      id: "pest",
      title: "5. Pest & Disease Management",
      content: [
        "Monitor plants regularly.",
        "Use Integrated Pest Management (IPM).",
        "Maintain good air circulation to prevent fungal diseases.",
      ],
    },
    {
      id: "harvesting",
      title: "6. Harvesting",
      content: [
        "Leaves ready after 18–24 months.",
        "Harvest twice a year (June & October).",
        "Use sharp tools to avoid damage.",
      ],
    },
    {
      id: "post",
      title: "7. Post-Harvest Processing",
      content: [
        "Dry leaves under shade.",
        "Store in airtight containers away from moisture and sunlight.",
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <motion.header
        className="page-header py-5 bg-success text-white text-center rounded-4 mb-5"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container">
          <motion.h1
            className="fw-bold"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            🌱 Agronomic Support
          </motion.h1>
          <motion.p
            className="lead"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Comprehensive guidance for Gymnema Sylvestre cultivation
          </motion.p>
        </div>
      </motion.header>

      {/* Accordion Sections */}
      <motion.div
        className="container my-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <div className="accordion" id="supportAccordion">
          {supportSections.map((section, index) => (
            <motion.div
              className="accordion-item border-0 shadow-sm rounded-3 mb-3"
              key={section.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
            >
              <h2 className="accordion-header" id={`${section.id}Heading`}>
                <motion.button
                  className={`accordion-button rounded-3 ${
                    index !== 0 ? "collapsed" : ""
                  }`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#${section.id}Collapse`}
                  whileHover={{ scale: 1.01 }}
                >
                  <strong>{section.title}</strong>
                </motion.button>
              </h2>
              <div
                id={`${section.id}Collapse`}
                className={`accordion-collapse collapse ${
                  index === 0 ? "show" : ""
                }`}
                data-bs-parent="#supportAccordion"
              >
                <div className="accordion-body rounded-3">
                  <ul className="mb-0">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="py-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Expert Support Section */}
        <motion.div
          className="card border-0 shadow rounded-4 mt-5"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.6 }}
        >
          <div className="card-body text-center">
            <h3 className="text-success mb-4">📞 Need Expert Help?</h3>
            <p className="lead">
              Connect with our agricultural specialists for personalized
              guidance
            </p>
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="p-3 bg-light rounded-3">
                  <i className="bi bi-telephone-fill text-success fs-1"></i>
                  <h5 className="mt-3">Phone Support</h5>
                  <p className="text-muted">24/7 helpline for urgent queries</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="p-3 bg-light rounded-3">
                  <i className="bi bi-chat-dots-fill text-success fs-1"></i>
                  <h5 className="mt-3">Live Chat</h5>
                  <p className="text-muted">Instant assistance from experts</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="p-3 bg-light rounded-3">
                  <i className="bi bi-envelope-fill text-success fs-1"></i>
                  <h5 className="mt-3">Email Support</h5>
                  <p className="text-muted">
                    Detailed responses within 24 hours
                  </p>
                </div>
              </div>
            </div>
            <motion.button
              className="btn btn-success btn-lg rounded-pill px-5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Our Experts
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .page-header {
          background: linear-gradient(135deg, #2e7d32, #4caf50);
          color: white;
          padding: 40px 20px;
          text-align: center;
        }
        .accordion-button {
          font-weight: 600;
          color: #2e7d32;
          background-color: #f8f9fa;
        }
        .accordion-body {
          background: #fff;
          border-radius: 8px;
          padding: 20px;
        }
      `}</style>
    </motion.div>
  );
};

export default SupportPage;
