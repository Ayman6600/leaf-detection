import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import { 
  ArrowLeft, 
  Download, 
  Leaf, 
  AlertCircle, 
  CheckCircle2, 
  Droplets,
  Sun,
  Wind,
  TrendingUp,
  Activity,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Skeleton } from "../components/ui/skeleton";
import { BackgroundGradient } from "../components/ui/background-gradient";
import { cn } from "../lib/utils";
import { useHistory } from "../contexts/HistoryContext";
import { useToast } from "../components/ui/toast";
import AssistantSidebar from "../components/AssistantSidebar";

const ResultPage = () => {
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { addToHistory, history } = useHistory();
  const toast = useToast();

  useEffect(() => {
    const storedResult = localStorage.getItem("predictionResult");
    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        setResultData(parsedResult);
        
        // Save to history if image URL is available
        const storedImageUrl = localStorage.getItem("lastAnalyzedImageUrl");
        if (storedImageUrl) {
          // Check if this result is already in history to avoid duplicates
          const isDuplicate = history.some(item => 
            item.predictedLabel === parsedResult.predicted_label && 
            Math.abs(item.confidence - parsedResult.confidence) < 0.1 &&
            Math.abs(new Date(item.timestamp).getTime() - Date.now()) < 5000 // Within 5 seconds
          );
          
          if (!isDuplicate) {
            addToHistory(parsedResult, storedImageUrl);
          }
          // Clean up stored image URL
          localStorage.removeItem("lastAnalyzedImageUrl");
        }
      } catch (err) {
        console.error("Error parsing result data:", err);
        setError("Failed to load prediction results. Please try again.");
        toast.error("Failed to load prediction results");
      }
    } else {
      setError("No prediction results found. Please upload an image first.");
      toast.warning("No prediction results found");
    }
    setLoading(false);
  }, [addToHistory, history, toast]);

  const getTreatmentInfo = (results) => {
    let maxDisease = "";
    let maxProbability = 0;

    Object.entries(results).forEach(([disease, probability]) => {
      if (probability > maxProbability) {
        maxProbability = probability;
        maxDisease = disease;
      }
    });

    const getTreatment = (disease, probability) => {
      switch (disease) {
        case "Healthy":
          return {
            title: "Healthy Plant",
            description: "Your Gymnema sylvestre plant is healthy! Continue with proper care.",
            treatment: [
              "Water when the top inch of soil feels dry",
              "Provide bright, indirect sunlight",
              "Maintain temperatures between 65-80°F",
              "Ensure good air circulation",
              "Fertilize monthly during growing season",
              "Regularly inspect for pests and diseases",
            ],
            severity: "low",
            icon: CheckCircle2,
            color: "text-[#1B5E20]",
            bgColor: "from-[#C8E6C9]/30 to-[#66BB6A]/10",
          };

        case "Powdery mildew":
          return {
            title: "Powdery Mildew",
            description: "Fungal disease that appears as white powdery spots on leaves.",
            treatment:
              probability <= 30
                ? [
                    "Remove affected leaves immediately",
                    "Improve air circulation around plants",
                    "Avoid overhead watering",
                    "Apply milk spray (1:10 ratio) weekly as preventive measure",
                  ]
                : probability <= 60
                ? [
                    "Remove and dispose of infected plant material",
                    "Apply potassium bicarbonate solution (1 tbsp + ½ tsp liquid soap per gallon)",
                    "Spray thoroughly on both sides of leaves every 7-10 days",
                    "Space plants adequately for better air circulation",
                  ]
                : [
                    "Remove heavily infected leaves and dispose in sealed bags",
                    "Apply sulfur-based fungicide according to manufacturer instructions",
                    "Treat surrounding plants as preventive measure",
                    "Improve growing conditions (airflow, spacing, watering practices)",
                  ],
            severity: probability <= 30 ? "low" : probability <= 60 ? "medium" : "high",
            icon: AlertCircle,
            color: probability <= 30 ? "text-yellow-600" : probability <= 60 ? "text-orange-600" : "text-red-600",
            bgColor: probability <= 30 ? "from-yellow-500/20 to-yellow-600/5" : probability <= 60 ? "from-orange-500/20 to-orange-600/5" : "from-red-500/20 to-red-600/5",
          };

        case "Leaf spot":
          return {
            title: "Leaf Spot",
            description: "Bacterial or fungal disease causing spots on leaves.",
            treatment:
              probability <= 30
                ? [
                    "Remove spotted leaves immediately",
                    "Avoid overhead watering",
                    "Improve air circulation",
                    "Apply neem oil spray (2ml per liter) as preventive measure",
                  ]
                : probability <= 60
                ? [
                    "Remove and destroy infected leaves",
                    "Apply copper-based fungicide (follow label instructions)",
                    "Water at soil level, not on foliage",
                    "Increase spacing between plants for better airflow",
                  ]
                : [
                    "Remove all severely affected leaves",
                    "Apply copper fungicide every 7-14 days",
                    "Consider crop rotation for next planting",
                    "Improve drainage and reduce humidity around plants",
                  ],
            severity: probability <= 30 ? "low" : probability <= 60 ? "medium" : "high",
            icon: AlertCircle,
            color: probability <= 30 ? "text-yellow-600" : probability <= 60 ? "text-orange-600" : "text-red-600",
            bgColor: probability <= 30 ? "from-yellow-500/20 to-yellow-600/5" : probability <= 60 ? "from-orange-500/20 to-orange-600/5" : "from-red-500/20 to-red-600/5",
          };

        case "Aphids (Aphis sp.)":
          return {
            title: "Aphids Infestation",
            description: "Small insects that feed on plant sap.",
            treatment:
              probability <= 30
                ? [
                    "Spray plants with strong water jet to dislodge aphids",
                    "Introduce beneficial insects like ladybugs",
                    "Apply neem oil spray (2ml per liter) in the evening",
                  ]
                : probability <= 60
                ? [
                    "Apply insecticidal soap (2 tsp per liter)",
                    "Spray thoroughly, covering undersides of leaves",
                    "Check for ants and control them (they protect aphids)",
                    "Repeat treatment every 3-4 days until controlled",
                  ]
                : [
                    "Use neem oil or pyrethrin-based insecticide",
                    "Apply systemic insecticide if infestation persists",
                    "Remove heavily infested plant parts",
                    "Monitor and reapply treatment as needed",
                  ],
            severity: probability <= 30 ? "low" : probability <= 60 ? "medium" : "high",
            icon: AlertCircle,
            color: probability <= 30 ? "text-yellow-600" : probability <= 60 ? "text-orange-600" : "text-red-600",
            bgColor: probability <= 30 ? "from-yellow-500/20 to-yellow-600/5" : probability <= 60 ? "from-orange-500/20 to-orange-600/5" : "from-red-500/20 to-red-600/5",
          };

        default:
          return {
            title: "Unknown Condition",
            description: "Unable to determine specific treatment.",
            treatment: [
              "Consult with a plant specialist for proper diagnosis",
              "Monitor plant health closely",
              "Ensure proper growing conditions",
            ],
            severity: "unknown",
            icon: AlertCircle,
            color: "text-black",
            bgColor: "from-gray-500/20 to-gray-600/5",
          };
      }
    };

    return {
      disease: maxDisease,
      confidence: maxProbability,
      ...getTreatment(maxDisease, maxProbability),
    };
  };

  const downloadReport = () => {
    if (!resultData) return;

    const doc = new jsPDF();
    const treatmentInfo = getTreatmentInfo(resultData.results);

    doc.setFontSize(20);
    doc.setTextColor(46, 125, 50);
    doc.text("Leaf Disease Detection Report", 105, 20, { align: "center" });

    doc.setDrawColor(46, 125, 50);
    doc.line(20, 25, 190, 25);

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`Predicted Disease: ${resultData.predicted_label}`, 20, 40);
    doc.text(`Confidence Level: ${resultData.confidence}%`, 20, 50);

    doc.setFontSize(14);
    doc.text("Probability Distribution:", 20, 70);

    let yPos = 80;
    doc.setFontSize(12);
    Object.entries(resultData.results)
      .sort((a, b) => b[1] - a[1])
      .forEach(([disease, probability]) => {
        doc.text(`${disease}: ${probability}%`, 30, yPos);
        yPos += 10;
      });

    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(46, 125, 50);
    doc.text("Recommended Treatment:", 20, yPos);

    yPos += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Condition: ${treatmentInfo.title}`, 20, yPos);
    yPos += 10;
    doc.text(`Description: ${treatmentInfo.description}`, 20, yPos);

    yPos += 10;
    doc.text("Treatment Plan:", 20, yPos);
    yPos += 10;
    treatmentInfo.treatment.forEach((step) => {
      doc.text(`• ${step}`, 30, yPos);
      yPos += 8;
    });

    yPos += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 20, yPos);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "This report was generated by the Leaf AI Detection System",
      105,
      280,
      { align: "center" }
    );

    const filename = `leaf-disease-report-${Date.now()}.pdf`;
    doc.save(filename);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-6 w-64" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !resultData) {
    return (
      <div className="container mx-auto px-4 py-24">
        <BackgroundGradient className="rounded-3xl max-w-2xl mx-auto">
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="text-destructive text-2xl">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-black mb-6 text-lg">{error}</p>
              <Button onClick={() => navigate("/")} size="lg" className="font-bold">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </BackgroundGradient>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="container mx-auto px-4 py-24">
        <BackgroundGradient className="rounded-3xl max-w-2xl mx-auto">
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="text-2xl">No Results Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-black mb-6 text-lg">
                Please upload an image first to get prediction results.
              </p>
              <Button onClick={() => navigate("/")} size="lg" className="font-bold">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </BackgroundGradient>
      </div>
    );
  }

  const treatmentInfo = getTreatmentInfo(resultData.results);
  const Icon = treatmentInfo.icon;

  // Prepare context data for assistant
  const assistantContext = resultData ? {
    predicted_label: resultData.predicted_label,
    confidence: resultData.confidence,
    description: treatmentInfo.description,
    recommendation: treatmentInfo.treatment.join(' ')
  } : null;

  return (
    <div className="min-h-screen relative">
      {/* Assistant Sidebar */}
      <AssistantSidebar context={assistantContext} />
      
    <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
      <div className="mb-10">
        <Button 
          onClick={() => navigate("/")} 
          variant="ghost" 
          size="lg" 
          className="font-semibold hover:bg-[#C8E6C9]/20 transition-all"
          aria-label="Go back to home page"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Button>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Main Result Card */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          >
            <BackgroundGradient className="rounded-3xl">
              <Card className="border-0 shadow-xl">
                <CardHeader className="pb-6">
                  <div className="flex items-start justify-between flex-wrap gap-6">
                    <div className="flex items-center space-x-5">
                      <div className={cn("p-5 rounded-2xl bg-gradient-to-br shadow-xl", treatmentInfo.bgColor)}>
                        <Icon className={cn("h-10 w-10", treatmentInfo.color)} />
                      </div>
                      <div>
                        <CardTitle className="text-3xl md:text-4xl font-black mb-3">{resultData.predicted_label}</CardTitle>
                        <CardDescription className="text-base md:text-lg">{treatmentInfo.description}</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-5xl md:text-6xl font-black bg-gradient-to-br from-primary to-primary/50 bg-clip-text text-transparent">
                        {resultData.confidence}%
                      </div>
                      <div className="text-sm md:text-base text-black font-semibold mt-1">Confidence</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-8">
                    <div className="h-4 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${resultData.confidence}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full shadow-glow"
                      />
                    </div>
                  </div>

                  <Separator className="my-10" />

                  <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-8 flex items-center">
                      <Activity className="h-6 w-6 mr-3 text-primary" />
                      Probability Distribution
                    </h3>
                    <div className="space-y-5">
                      {Object.entries(resultData.results)
                        .sort((a, b) => b[1] - a[1])
                        .map(([disease, probability], index) => (
                          <div key={index}>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-base md:text-lg font-semibold text-foreground">{disease}</span>
                              <span className="text-base md:text-lg font-bold text-primary">{probability}%</span>
                            </div>
                            <div className="h-3 bg-secondary rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${probability}%` }}
                                transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="mt-10 flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={() => navigate("/")} 
                      variant="outline" 
                      size="lg" 
                      className="flex-1 font-bold hover:bg-[#C8E6C9]/20 transition-all"
                      aria-label="Start a new analysis"
                    >
                      <Leaf className="mr-2 h-5 w-5" />
                      Scan Another Image
                    </Button>
                    <Button 
                      onClick={downloadReport} 
                      size="lg" 
                      className="flex-1 font-bold bg-[#1B5E20] hover:bg-[#66BB6A] text-white hover:scale-105 active:scale-95 transition-all"
                      aria-label="Download PDF report"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Download Report (PDF)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </BackgroundGradient>
          </motion.div>

          {/* Treatment Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <BackgroundGradient className="rounded-3xl">
              <Card className="border-0">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl md:text-3xl flex items-center">
                    <TrendingUp className="mr-3 h-7 w-7 text-primary" />
                    Recommended Treatment Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-8">
                    <h4 className="font-bold text-xl md:text-2xl mb-4 text-foreground">{treatmentInfo.title}</h4>
                    <p className="text-black text-base md:text-lg leading-relaxed">{treatmentInfo.description}</p>
                  </div>
                  <Separator className="my-8" />
                  <div>
                    <h5 className="font-bold mb-6 text-lg md:text-xl">Treatment Steps:</h5>
                    <ul className="space-y-4">
                      {treatmentInfo.treatment.map((step, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="flex items-start"
                        >
                          <CheckCircle2 className="h-6 w-6 text-primary mr-4 mt-0.5 flex-shrink-0" />
                          <span className="text-base md:text-lg text-foreground leading-relaxed">{step}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-10 p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border-2 border-primary/20">
                    <p className="text-base md:text-lg text-foreground leading-relaxed">
                      <strong className="text-primary flex items-center gap-2 mb-3 text-lg">
                        <Sparkles className="h-5 w-5" />
                        Pro Tip:
                      </strong>
                      Always test treatments on a small area first and monitor your plant's response.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </BackgroundGradient>
          </motion.div>
        </div>

        {/* Sidebar - Care Tips */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <BackgroundGradient className="rounded-3xl">
              <Card className="border-0">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center text-xl md:text-2xl">
                    <Leaf className="mr-3 h-7 w-7 text-primary" />
                    Prevention & Care
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <div className="flex items-center mb-4">
                      <Droplets className="h-7 w-7 text-primary mr-3" />
                      <h4 className="font-bold text-lg text-foreground">Watering</h4>
                    </div>
                    <p className="text-sm md:text-base text-black leading-relaxed">
                      Water at soil level, avoid wetting leaves. Allow top inch of
                      soil to dry between waterings.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <div className="flex items-center mb-4">
                      <Sun className="h-7 w-7 text-primary mr-3" />
                      <h4 className="font-bold text-lg text-foreground">Lighting</h4>
                    </div>
                    <p className="text-sm md:text-base text-black leading-relaxed">
                      Provide bright, indirect sunlight. Avoid direct afternoon sun
                      which can scorch leaves.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <div className="flex items-center mb-4">
                      <Wind className="h-7 w-7 text-primary mr-3" />
                      <h4 className="font-bold text-lg text-foreground">Air Flow</h4>
                    </div>
                    <p className="text-sm md:text-base text-black leading-relaxed">
                      Ensure good airflow around plants to prevent fungal diseases.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </BackgroundGradient>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <BackgroundGradient className="rounded-3xl">
              <Card className="border-0">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl md:text-2xl">Severity Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge
                    variant={
                      treatmentInfo.severity === "low"
                        ? "default"
                        : treatmentInfo.severity === "medium"
                        ? "secondary"
                        : "destructive"
                    }
                    className="text-lg md:text-xl px-8 py-4 font-bold w-full justify-center"
                  >
                    {treatmentInfo.severity === "low"
                      ? "Low Risk"
                      : treatmentInfo.severity === "medium"
                      ? "Moderate Risk"
                      : "High Risk"}
                  </Badge>
                </CardContent>
              </Card>
            </BackgroundGradient>
          </motion.div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ResultPage;
