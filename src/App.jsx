import React, { useState, lazy, Suspense } from "react";
import Layout from "./components/Layout";
// Lazy load pages to improve initial loading time
const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const DosagePage = lazy(() => import("./pages/DosagePage"));
const SupportPage = lazy(() => import("./pages/SupportPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const ResultPage = lazy(() => import("./pages/ResultPage"));
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    // Suspense component to show loading state while components are being loaded
    return (
      <Suspense
        fallback={
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        }
      >
        {(() => {
          switch (currentPage) {
            case "home":
              return <HomePage setCurrentPage={setCurrentPage} />;
            case "about":
              return <AboutPage />;
            case "products":
              return <ProductsPage />;
            case "dosage":
              return <DosagePage />;
            case "support":
              return <SupportPage />;
            case "faq":
              return <FAQPage />;
            case "result":
              return <ResultPage setCurrentPage={setCurrentPage} />;
            default:
              return <HomePage setCurrentPage={setCurrentPage} />;
          }
        })()}
      </Suspense>
    );
  };

  return <Layout setCurrentPage={setCurrentPage}>{renderPage()}</Layout>;
}

export default App;
