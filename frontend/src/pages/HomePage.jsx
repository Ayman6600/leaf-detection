import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Upload,
  Leaf,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Award,
  Camera,
  FileImage,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import apiService from "../services/api";
import { useHistory } from "../contexts/HistoryContext";
import { useToast } from "../components/ui/toast";
import { compressImage } from "../utils/imageCompression";

const HomePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const { addToHistory } = useHistory();
  const toast = useToast();

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
        return;
      }
      
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      toast.success("Image selected successfully");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please drop a valid image file");
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
        return;
      }
      
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      toast.success("Image uploaded successfully");
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.warning("Please select an image first");
      return;
    }
    
    setLoading(true);
    toast.info("Compressing image...", { duration: 2000 });
    
    try {
      // Compress image before upload
      const compressedFile = await compressImage(selectedFile);
      toast.info("Analyzing image...", { duration: 2000 });
      
      const result = await apiService.predictDisease(compressedFile);
      localStorage.setItem("predictionResult", JSON.stringify(result));
      
      // Save image URL temporarily for ResultPage to add to history
      if (previewUrl) {
        localStorage.setItem("lastAnalyzedImageUrl", previewUrl);
      }
      
      toast.success("Analysis complete!");
      navigate("/result");
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error(
        error.message || "Failed to analyze image. Please try again.",
        { duration: 5000 }
      );
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Zap,
      title: "Instant Detection",
      description: "Get accurate results in seconds with our AI-powered analysis",
    },
    {
      icon: Shield,
      title: "99% Accuracy",
      description: "Trained on thousands of leaf images for precise diagnosis",
    },
    {
      icon: TrendingUp,
      title: "Treatment Plans",
      description: "Receive detailed treatment recommendations instantly",
    },
  ];

  const stats = [
    { icon: Users, value: "50K+", label: "Happy Farmers" },
    { icon: Leaf, value: "1M+", label: "Leaves Analyzed" },
    { icon: Award, value: "99.2%", label: "Accuracy Rate" },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Hero Section - Minimal Design */}
      <section className="relative pt-20 pb-24 bg-background">

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted mb-8">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  AI-Powered Plant Disease Detection
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl font-semibold mb-6 leading-tight">
                Protect Your Plants
                <br />
                <span className="text-primary">with AI Technology</span>
            </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                Upload a photo of your plant leaf and get instant disease diagnosis with
                expert treatment recommendations powered by advanced machine learning
              </p>
          </motion.div>

            {/* Stats - Minimal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="border shadow-sm">
                    <CardContent className="p-6 text-center">
                      <Icon className="h-8 w-8 text-primary mx-auto mb-4" />
                      <div className="text-3xl md:text-4xl font-semibold text-foreground mb-2">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section - Minimal */}
      <section id="upload-section" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                Start Your Analysis
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Upload a clear photo of your plant leaf for instant diagnosis
              </p>
            </div>

            <Card className="border shadow-sm">
              <CardContent className="p-8">
                {!previewUrl ? (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    role="button"
                    tabIndex={0}
                    aria-label="Drag and drop zone for leaf image upload"
                    className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                      dragActive
                        ? "border-primary bg-accent/50"
                        : "border-border bg-background"
                    }`}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      aria-label="Select leaf image file"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <div className="mb-4 p-4 bg-primary/10 rounded-lg">
                          <FileImage className="h-12 w-12 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          Drop your image here
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          or click to browse from your device
                        </p>
                        <Button
                          type="button"
                          size="lg"
                          className="rounded-lg"
                          aria-label="Choose image file to upload"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Choose File
                        </Button>
                        <p className="text-xs text-muted-foreground mt-4">
                          Supports: JPG, PNG, WEBP (Max 10MB)
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden border">
                      <img
                        src={previewUrl}
                        alt="Preview of uploaded leaf image"
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                          }}
                          variant="destructive"
                          size="sm"
                          className="rounded-lg"
                          aria-label="Remove uploaded image"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                    {loading && (
                      <div className="p-4 bg-muted rounded-lg border">
                        <div className="flex items-center gap-3 text-foreground">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                          <span className="text-sm">Analyzing leaf image with AI...</span>
                        </div>
                      </div>
                    )}
                    <Button
                      onClick={handleAnalyze}
                      disabled={loading}
                      size="lg"
                      className="w-full rounded-lg"
                      aria-label={loading ? "Analyzing image in progress" : "Start analyzing plant health"}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Analyze Plant Health
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Why Choose Leaf AI?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Advanced technology meets agricultural expertise
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="h-full border shadow-sm">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 inline-flex p-4 bg-primary/10 rounded-lg">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Three simple steps to healthier plants
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Upload Photo",
                  description: "Take a clear photo of the affected leaf and upload it",
                  icon: Upload,
                },
                {
                  step: "02",
                  title: "AI Analysis",
                  description: "Our AI analyzes the image and identifies diseases",
                  icon: Sparkles,
                },
                {
                  step: "03",
                  title: "Get Results",
                  description: "Receive diagnosis and treatment recommendations",
                  icon: CheckCircle2,
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="relative">
                    <Card className="h-full border shadow-sm">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl font-semibold text-muted-foreground mb-4">
                          {item.step}
                        </div>
                        <div className="mb-4 inline-flex p-3 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                    {index < 2 && (
                      <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
