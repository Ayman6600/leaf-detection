import React from "react";
import { motion } from "framer-motion";

const AboutPage = () => {
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
          About Our Leaf Disease Detection System
        </motion.h2>

        <motion.div
          className="card border-0 shadow rounded-4 mb-5"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="card-body p-5">
            <p className="lead text-center">
              <strong>
                Your Intelligent Assistant for Gymnema sylvestre Health, Growth,
                and Wellness
              </strong>
            </p>
            <p className="text-center">
              Welcome to the ultimate solution for <em>Gymnema sylvestre</em>{" "}
              cultivation, health diagnosis, and safe medicinal use — all
              powered by advanced AI to simplify your journey from planting to
              personal wellness.
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
                <h4 className="text-success">Our Mission</h4>
                <p>
                  To empower cultivators and wellness-focused individuals with
                  instant, reliable, and actionable intelligence for every step
                  — from field health to daily intake. By combining disease
                  recognition, agronomic resources, and personalized dosage
                  tools, we unlock the full potential of
                  <em> Gymnema sylvestre</em> — securely, sustainably, and
                  confidently.
                </p>
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
                <h4 className="text-success">What Makes Us Different</h4>
                <ul>
                  <li>
                    <strong>One Unified Experience:</strong> Manage plant
                    health, optimize growth, and monitor your Gymnema intake in
                    one intuitive app.
                  </li>
                  <li>
                    <strong>Advanced AI-Driven Diagnosis:</strong> Instantly
                    identify 12+ Gymnema issues by uploading a photo, powered by
                    a growing global image database.
                  </li>
                  <li>
                    <strong>Actionable Agronomic Support:</strong> Get soil,
                    irrigation, pest, and nutrition advice tailored to your
                    location and conditions.
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
            <h4 className="text-success">Explore Our Core Features</h4>
            <ol>
              <li>
                <strong>⚕️ Disease Health Detection:</strong> AI-powered
                identification of fungal, bacterial, viral, and nutritional
                problems with guides and resources.
              </li>
              <li>
                <strong>🌱 Agronomic Support:</strong> Personalized advice from
                planting to harvest, with alerts and community resources.
              </li>
              <li>
                <strong>⚕️⚕️ Dosage & Health Tracker:</strong> Safe,
                individualized intake plans with progress tracking and alerts.
              </li>
              <li>
                <strong>🤝 Support & Feedback:</strong> Expert help desk,
                forums, and learning center for all users.
              </li>
            </ol>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutPage;
