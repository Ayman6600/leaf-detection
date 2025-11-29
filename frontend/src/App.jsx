import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import { Skeleton } from "./components/ui/skeleton";
import { ThemeProvider } from "./contexts/ThemeContext";
import { HistoryProvider } from "./contexts/HistoryContext";
import { ToastProvider } from "./components/ui/toast";

// Lazy load pages to improve initial loading time
const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const DosagePage = lazy(() => import("./pages/DosagePage"));
const SupportPage = lazy(() => import("./pages/SupportPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const ResultPage = lazy(() => import("./pages/ResultPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const AssistantPage = lazy(() => import("./pages/AssistantPage"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="flex flex-col items-center space-y-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-4 w-48" />
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <HistoryProvider>
        <ToastProvider>
          <BrowserRouter>
            <MainLayout>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/dosage" element={<DosagePage />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/result" element={<ResultPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/assistant" element={<AssistantPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </MainLayout>
          </BrowserRouter>
        </ToastProvider>
      </HistoryProvider>
    </ThemeProvider>
  );
}

export default App;
