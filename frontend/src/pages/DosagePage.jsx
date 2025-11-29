import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Pill, 
  AlertCircle, 
  Info, 
  Clock, 
  Users, 
  Sparkles, 
  Leaf, 
  Heart, 
  Zap, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

const DosagePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedPrecautions, setExpandedPrecautions] = useState(false);
  const [expandedTips, setExpandedTips] = useState(false);
  const [expandedGuidelines, setExpandedGuidelines] = useState(false);

  const dosageGuides = [
    {
      id: "adults",
      group: "Adults (General Health)",
      icon: Users,
      description: "General wellness and maintenance dosage recommendations",
      color: "from-[#1B5E20] to-[#66BB6A]",
      dosages: [
        {
          form: "Leaf Extract Powder",
          amount: "200-400 mg daily",
          timing: "With meals (breakfast & dinner)",
          notes: "Start with 200mg and gradually increase to 400mg over 2 weeks. Mix with water or juice.",
          method: "Take 1 capsule (200mg) with breakfast and 1 with dinner, or mix powder in 8oz of water.",
        },
        {
          form: "Dried Leaf Powder",
          amount: "2-3 grams daily",
          timing: "Divided into 2-3 doses throughout the day",
          notes: "Best taken 30 minutes before meals for blood sugar management.",
          method: "Mix 1 teaspoon (1g) in warm water or smoothie. Take morning, afternoon, and evening.",
        },
        {
          form: "Gymnema Tea",
          amount: "1-2 cups daily",
          timing: "Morning and/or evening",
          notes: "Steep 1-2 teaspoons of dried leaves in hot water for 5-10 minutes.",
          method: "Use 1-2 tsp dried leaves per cup. Let steep 5-10 min. Strain and drink warm or cold.",
        },
      ],
    },
    {
      id: "blood-sugar",
      group: "Blood Sugar Support",
      icon: Sparkles,
      description: "Specialized dosage for diabetes and blood sugar management",
      color: "from-blue-500 to-cyan-500",
      dosages: [
        {
          form: "Standardized Extract (25% Gymnemic Acids)",
          amount: "400-600 mg daily",
          timing: "30 minutes before main meals",
          notes: "Higher potency for blood sugar management. Monitor glucose levels regularly.",
          method: "Take 200mg capsule 30 min before breakfast, lunch, and dinner (total 600mg/day).",
        },
        {
          form: "Capsules (500mg each)",
          amount: "2-3 capsules daily",
          timing: "15-30 minutes before main meals",
          notes: "Consult healthcare provider if diabetic or on blood sugar medications.",
          method: "1 capsule before breakfast, 1 before lunch, 1 before dinner with full glass of water.",
        },
      ],
    },
    {
      id: "weight",
      group: "Weight Management",
      icon: Heart,
      description: "Dosage recommendations for weight loss and sugar cravings",
      color: "from-purple-500 to-pink-500",
      dosages: [
        {
          form: "Leaf Extract",
          amount: "300-400 mg daily",
          timing: "Before meals to reduce sugar cravings",
          notes: "Helps reduce sugar absorption and curb sweet cravings.",
          method: "Take 1 capsule (200mg) 20-30 minutes before breakfast and dinner.",
        },
      ],
    },
  ];

  const precautions = [
    {
      title: "Consult Healthcare Provider First",
      description:
        "Always consult with a qualified healthcare professional before starting Gymnema sylvestre, especially if you have diabetes, hypoglycemia, or take medications that affect blood sugar levels.",
      icon: AlertCircle,
    },
    {
      title: "Medication Interactions",
      description:
        "Gymnema may interact with diabetes medications, insulin, blood sugar-lowering drugs, and cholesterol medications. Medical supervision is essential to prevent hypoglycemia.",
      icon: Info,
    },
    {
      title: "Pregnancy & Breastfeeding",
      description:
        "Not recommended during pregnancy or breastfeeding due to insufficient safety data. Avoid use unless specifically directed by a healthcare provider.",
      icon: AlertCircle,
    },
    {
      title: "Monitor Blood Sugar Levels",
      description:
        "If diabetic or pre-diabetic, monitor blood glucose levels frequently when starting Gymnema. Watch for signs of hypoglycemia: dizziness, shakiness, confusion, or weakness.",
      icon: Zap,
    },
    {
      title: "Surgery Precaution",
      description:
        "Stop taking Gymnema at least 2 weeks before scheduled surgery, as it may affect blood sugar control during and after the procedure.",
      icon: AlertCircle,
    },
    {
      title: "Quality & Source",
      description:
        "Purchase from reputable suppliers. Look for standardized extracts (25% gymnemic acids) and third-party testing certificates for purity and potency.",
      icon: Leaf,
    },
  ];

  const administrationTips = [
    {
      title: "Best Time to Take",
      tip: "Take 15-30 minutes before meals for maximum effectiveness in blood sugar management and reducing sugar cravings.",
    },
    {
      title: "With or Without Food",
      tip: "Can be taken on an empty stomach, but if you experience digestive discomfort, take with a small amount of food.",
    },
    {
      title: "Consistency is Key",
      tip: "Take at the same times each day for best results. It may take 4-6 weeks to notice full effects.",
    },
    {
      title: "Stay Hydrated",
      tip: "Drink plenty of water throughout the day when taking Gymnema to support optimal absorption and metabolism.",
    },
    {
      title: "Start Low, Go Slow",
      tip: "Begin with the lowest recommended dose and gradually increase over 1-2 weeks to assess tolerance and effectiveness.",
    },
    {
      title: "Duration of Use",
      tip: "Can be used long-term under medical supervision. Most studies show benefits within 18-24 months of consistent use.",
    },
  ];

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    // Scroll to dosage section
    setTimeout(() => {
      document.getElementById("dosage-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setExpandedPrecautions(false);
    setExpandedTips(false);
    setExpandedGuidelines(false);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedGuide = dosageGuides.find((guide) => guide.id === selectedCategory);

  return (
    <div className="min-h-screen relative leaf-pattern">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 rounded-3xl bg-gradient-to-br from-[#1B5E20] to-[#66BB6A] shadow-glow animate-float">
                <Pill className="h-12 w-12 text-black" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-black font-display">
              Dosage Guide
            </h1>
            <p className="text-xl text-black max-w-2xl mx-auto font-body">
              {selectedCategory 
                ? "Personalized dosage recommendations for your needs"
                : "Select your category to view personalized dosage recommendations"
              }
            </p>
          </motion.div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="glass border-2 border-red-500/50 shadow-glow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-red-500/20">
                    <AlertCircle className="h-6 w-6 text-red-400" />
                  </div>
                  <CardTitle className="text-2xl text-black font-display">Important Medical Notice</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed text-black font-body">
                  <strong className="text-black">This information is for educational purposes only</strong> and should not replace professional medical advice. 
                  Always consult with a qualified healthcare provider before starting any new supplement, especially if you have existing health 
                  conditions, are taking medications, are pregnant, breastfeeding, or planning surgery.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Category Selection Screen */}
      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          <motion.section
            key="selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="py-12"
          >
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-black mb-4 font-display">
                  Choose Your Category
                </h2>
                <p className="text-xl text-black max-w-2xl mx-auto font-body">
                  Select the category that best describes your needs to view personalized dosage recommendations
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
                {dosageGuides.map((guide, index) => {
                  const Icon = guide.icon;
                  return (
                    <motion.div
                      key={guide.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className="h-full glass border-2 border-[#66BB6A]/30 shadow-glow hover:shadow-glow-lg transition-all cursor-pointer"
                        onClick={() => handleCategorySelect(guide.id)}
                      >
                        <CardHeader className="text-center">
                          <div className={`mx-auto mb-4 p-6 rounded-3xl bg-gradient-to-br ${guide.color} shadow-glow animate-float`}>
                            <Icon className="h-12 w-12 text-black" />
                          </div>
                          <CardTitle className="text-2xl text-black font-display mb-2">
                            {guide.group}
                          </CardTitle>
                          <CardDescription className="text-base text-black font-body">
                            {guide.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button 
                            className={`w-full bg-gradient-to-r ${guide.color} text-black hover:opacity-90 font-bold`}
                            size="lg"
                          >
                            View Dosage
                            <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="dosage-content"
            id="dosage-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="py-12"
          >
            <div className="container mx-auto px-4">
              {/* Back/Reset Button */}
              <div className="mb-8 flex items-center justify-between">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="font-bold border-2 border-[#66BB6A] text-black hover:bg-[#C8E6C9]/20"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Change Category
                </Button>
                {selectedGuide && (
                  <Badge className="bg-gradient-to-r from-[#1B5E20] to-[#66BB6A] text-black font-bold text-lg px-6 py-2">
                    {selectedGuide.group}
                  </Badge>
                )}
              </div>

              {/* Selected Category Dosage Guidelines */}
              {selectedGuide && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="glass border-2 border-[#66BB6A]/30 shadow-glow-lg mb-8">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${selectedGuide.color} shadow-glow`}>
                          <selectedGuide.icon className="h-6 w-6 text-black" />
                        </div>
                        <div>
                          <CardTitle className="text-3xl text-black font-display">
                            {selectedGuide.group}
                          </CardTitle>
                          <CardDescription className="text-lg text-black mt-1">
                            {selectedGuide.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {selectedGuide.dosages.map((dosage, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="p-6 rounded-2xl glass-light border border-[#66BB6A]/20"
                          >
                            <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                              <h4 className="font-black text-xl text-black font-display">
                                {dosage.form}
                              </h4>
                              <Badge className="bg-gradient-to-r from-[#1B5E20] to-[#66BB6A] text-black font-bold text-base px-4 py-1">
                                {dosage.amount}
                              </Badge>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-[#66BB6A] mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-bold text-[#1B5E20] mb-1">Timing:</p>
                                  <p className="text-base text-black font-body">{dosage.timing}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-bold text-blue-300 mb-1">How to Take:</p>
                                  <p className="text-base text-black font-body">{dosage.method}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-3">
                                <Sparkles className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-bold text-yellow-300 mb-1">Important Notes:</p>
                                  <p className="text-base text-black font-body">{dosage.notes}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Collapsible Administration Tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <Card className="glass border-2 border-[#66BB6A]/30 shadow-glow">
                  <button
                    onClick={() => setExpandedTips(!expandedTips)}
                    className="w-full text-left"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl text-black font-display">
                          Administration Tips
                        </CardTitle>
                        <div className="flex-shrink-0">
                          {expandedTips ? (
                            <ChevronUp className="h-6 w-6 text-[#66BB6A]" />
                          ) : (
                            <ChevronDown className="h-6 w-6 text-[#66BB6A]" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </button>
                  <AnimatePresence>
                    {expandedTips && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent>
                          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {administrationTips.map((tip, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <Card className="h-full glass-light border border-[#66BB6A]/20">
                                  <CardHeader>
                                    <CardTitle className="text-lg text-black font-display">
                                      {tip.title}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-base text-black leading-relaxed font-body">
                                      {tip.tip}
                                    </p>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>

              {/* Collapsible Precautions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <Card className="glass border-2 border-red-500/30 shadow-glow">
                  <button
                    onClick={() => setExpandedPrecautions(!expandedPrecautions)}
                    className="w-full text-left"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl text-black font-display">
                          Important Precautions
                        </CardTitle>
                        <div className="flex-shrink-0">
                          {expandedPrecautions ? (
                            <ChevronUp className="h-6 w-6 text-red-400" />
                          ) : (
                            <ChevronDown className="h-6 w-6 text-red-400" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </button>
                  <AnimatePresence>
                    {expandedPrecautions && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent>
                          <div className="grid gap-6 md:grid-cols-2">
                            {precautions.map((precaution, index) => {
                              const Icon = precaution.icon;
                              return (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  <Card className="h-full glass-light border border-red-500/20">
                                    <CardHeader>
                                      <CardTitle className="text-xl flex items-start gap-3 text-black font-display">
                                        <Icon className="h-6 w-6 text-red-400 mt-1 flex-shrink-0" />
                                        {precaution.title}
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p className="text-base text-black leading-relaxed font-body">
                                        {precaution.description}
                                      </p>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>

              {/* Collapsible General Guidelines */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="glass border-2 border-[#66BB6A]/30 shadow-glow">
                  <button
                    onClick={() => setExpandedGuidelines(!expandedGuidelines)}
                    className="w-full text-left"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl text-black font-display">
                          General Guidelines
                        </CardTitle>
                        <div className="flex-shrink-0">
                          {expandedGuidelines ? (
                            <ChevronUp className="h-6 w-6 text-[#66BB6A]" />
                          ) : (
                            <ChevronDown className="h-6 w-6 text-[#66BB6A]" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </button>
                  <AnimatePresence>
                    {expandedGuidelines && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent>
                          <div className="grid gap-8 md:grid-cols-3">
                            <div className="text-center p-6 rounded-2xl glass-light border border-[#66BB6A]/20">
                              <div className="text-5xl font-black text-[#66BB6A] mb-2 font-display">4-6</div>
                              <div className="text-sm font-bold text-black mb-2 font-body">Weeks</div>
                              <div className="text-sm text-black font-body">
                                Typical time to notice full effects
                              </div>
                            </div>
                            <div className="text-center p-6 rounded-2xl glass-light border border-[#66BB6A]/20">
                              <div className="text-5xl font-black text-[#66BB6A] mb-2 font-display">15-30</div>
                              <div className="text-sm font-bold text-black mb-2 font-body">Minutes</div>
                              <div className="text-sm text-black font-body">
                                Take before meals for blood sugar support
                              </div>
                            </div>
                            <div className="text-center p-6 rounded-2xl glass-light border border-[#66BB6A]/20">
                              <div className="text-5xl font-black text-[#66BB6A] mb-2 font-display">2-3x</div>
                              <div className="text-sm font-bold text-black mb-2 font-body">Daily</div>
                              <div className="text-sm text-black font-body">
                                Divided doses throughout day work best
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DosagePage;