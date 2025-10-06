import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";

// Optimize rendering for production
const root = ReactDOM.createRoot(document.getElementById("root"));

// Remove StrictMode in production for better performance
if (process.env.NODE_ENV === "production") {
  root.render(<App />);
} else {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
