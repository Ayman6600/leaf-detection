import React from "react";
import "./Layout.css";

const Layout = ({ setCurrentPage, children }) => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <div className="container">
          <button
            className="navbar-brand btn btn-link text-white text-decoration-none"
            onClick={() => setCurrentPage("home")}
          >
            🌿 Gymnema Sylvestre
          </button>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white text-decoration-none"
                  onClick={() => setCurrentPage("home")}
                >
                  Home
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white text-decoration-none"
                  onClick={() => setCurrentPage("about")}
                >
                  About Us
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white text-decoration-none"
                  onClick={() => setCurrentPage("products")}
                >
                  Products
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white text-decoration-none"
                  onClick={() => setCurrentPage("dosage")}
                >
                  Dosage
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white text-decoration-none"
                  onClick={() => setCurrentPage("support")}
                >
                  Agronomic Support
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white text-decoration-none"
                  onClick={() => setCurrentPage("faq")}
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">{children}</div>

      {/* Footer */}
      <footer className="bg-success text-white text-center py-3 mt-5">
        <p className="mb-0">
          © 2025 Gymnema Sylvestre Disease Detection. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Layout;
