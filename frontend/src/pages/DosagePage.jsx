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
  RotateCcw,
  Sprout,
  Sun,
  Droplets,
  Shield,
  Bug
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useTranslation } from 'react-i18next';

const DosagePage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("cultivation");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedPrecautions, setExpandedPrecautions] = useState(false);
  const [expandedTips, setExpandedTips] = useState(false);
  const [expandedGuidelines, setExpandedGuidelines] = useState(false);

  const dosageGuides = [
    {
      id: "adults",
      group: t('dosage.group_adults'),
      icon: Users,
      description: t('dosage.group_adults_desc'),
      color: "from-[#1B5E20] to-[#66BB6A]",
      dosages: [
        {
          form: t('dosage.form_leaf_extract'),
          amount: "200-400 mg daily",
          timing: "With meals (breakfast & dinner)",
          notes: "Start with 200mg and gradually increase to 400mg over 2 weeks. Mix with water or juice.",
          method: "Take 1 capsule (200mg) with breakfast and 1 with dinner, or mix powder in 8oz of water.",
        },
        {
          form: t('dosage.form_dried_leaf'),
          amount: "2-3 grams daily",
          timing: "Divided into 2-3 doses throughout the day",
          notes: "Best taken 30 minutes before meals for blood sugar management.",
          method: "Mix 1 teaspoon (1g) in warm water or smoothie. Take morning, afternoon, and evening.",
        },
        {
          form: t('dosage.form_tea'),
          amount: "1-2 cups daily",
          timing: "Morning and/or evening",
          notes: "Steep 1-2 teaspoons of dried leaves in hot water for 5-10 minutes.",
          method: "Use 1-2 tsp dried leaves per cup. Let steep 5-10 min. Strain and drink warm or cold.",
        },
      ],
    },
    {
      id: "blood-sugar",
      group: t('dosage.group_sugar'),
      icon: Sparkles,
      description: t('dosage.group_sugar_desc'),
      color: "from-blue-500 to-cyan-500",
      dosages: [
        {
          form: t('dosage.form_std_extract'),
          amount: "400-600 mg daily",
          timing: "30 minutes before main meals",
          notes: "Higher potency for blood sugar management. Monitor glucose levels regularly.",
          method: "Take 200mg capsule 30 min before breakfast, lunch, and dinner (total 600mg/day).",
        },
        {
          form: t('dosage.form_capsules'),
          amount: "2-3 capsules daily",
          timing: "15-30 minutes before main meals",
          notes: "Consult healthcare provider if diabetic or on blood sugar medications.",
          method: "1 capsule before breakfast, 1 before lunch, 1 before dinner with full glass of water.",
        },
      ],
    },
    {
      id: "weight",
      group: t('dosage.group_weight'),
      icon: Heart,
      description: t('dosage.group_weight_desc'),
      color: "from-purple-500 to-pink-500",
      dosages: [
        {
          form: t('dosage.form_leaf_extract'),
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
      title: t('dosage.prec_consult'),
      description: t('dosage.prec_consult_desc'),
      icon: AlertCircle,
    },
    {
      title: t('dosage.prec_meds'),
      description: t('dosage.prec_meds_desc'),
      icon: Info,
    },
    {
      title: t('dosage.prec_pregnancy'),
      description: t('dosage.prec_pregnancy_desc'),
      icon: AlertCircle,
    },
    {
      title: t('dosage.prec_monitor'),
      description: t('dosage.prec_monitor_desc'),
      icon: Zap,
    },
    {
      title: t('dosage.prec_surgery'),
      description: t('dosage.prec_surgery_desc'),
      icon: AlertCircle,
    },
    {
      title: t('dosage.prec_quality'),
      description: t('dosage.prec_quality_desc'),
      icon: Leaf,
    },
  ];

  const administrationTips = [
    {
      title: t('dosage.tip_time'),
      tip: t('dosage.tip_time_desc'),
    },
    {
      title: t('dosage.tip_food'),
      tip: t('dosage.tip_food_desc'),
    },
    {
      title: t('dosage.tip_consistency'),
      tip: t('dosage.tip_consistency_desc'),
    },
    {
      title: t('dosage.tip_hydrate'),
      tip: t('dosage.tip_hydrate_desc'),
    },
    {
      title: t('dosage.tip_start'),
      tip: t('dosage.tip_start_desc'),
    },
    {
      title: t('dosage.tip_duration'),
      tip: t('dosage.tip_duration_desc'),
    },
  ];

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setTimeout(() => {
      document.getElementById("dosage-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setExpandedPrecautions(false);
    setExpandedTips(false);
    setExpandedGuidelines(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedGuide = dosageGuides.find((guide) => guide.id === selectedCategory);

  const tabs = [
    { id: "cultivation", label: t('dosage.tab_cultivation'), icon: Sprout },
    { id: "protection", label: t('dosage.tab_protection'), icon: Shield },
    { id: "medicinal", label: t('dosage.tab_medicinal'), icon: Pill },
  ];

  return (
    <div className="min-h-screen relative bg-background">

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              {t('dosage.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('dosage.subtitle')}
            </p>
          </motion.div>

          {/* Tabs Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all ${activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {activeTab === "cultivation" && (
            <motion.div
              key="cultivation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto grid gap-8"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sun className="h-5 w-5 text-primary" />
                      {t('dosage.climate_req')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Temperature</span>
                      <span className="font-medium">20°C - 35°C</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Rainfall</span>
                      <span className="font-medium">600mm - 1000mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunlight</span>
                      <span className="font-medium">Partial Shade</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-primary" />
                      {t('dosage.soil_cond')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium">Sandy Loam</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">pH Level</span>
                      <span className="font-medium">6.5 - 7.5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Drainage</span>
                      <span className="font-medium">Well-drained</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sprout className="h-5 w-5 text-primary" />
                    {t('dosage.propagation')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
                      <span>Propagated through seeds or stem cuttings. Seeds should be sown immediately after collection as they lose viability quickly.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                      <span>Plant spacing should be 2m x 2m to allow sufficient growth. Support structures (trellises) are recommended as it is a climber.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                      <span>Regular weeding and light irrigation during dry periods are essential for establishment.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "protection" && (
            <motion.div
              key="protection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto grid gap-8"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-yellow-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bug className="h-5 w-5 text-yellow-500" />
                      {t('dosage.common_pests')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-1">Aphids</h4>
                      <p className="text-sm text-muted-foreground">Small sap-sucking insects causing leaf curling. Treat with neem oil.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Spider Mites</h4>
                      <p className="text-sm text-muted-foreground">Cause yellow stippling on leaves. Increase humidity and use miticides if severe.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      {t('dosage.common_diseases')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-1">Powdery Mildew</h4>
                      <p className="text-sm text-muted-foreground">White powdery growth on leaves. Improve air circulation and apply fungicides.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Leaf Spot</h4>
                      <p className="text-sm text-muted-foreground">Brown or black spots. Remove infected leaves and avoid overhead watering.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === "medicinal" && (
            <motion.div
              key="medicinal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Existing Dosage Content */}
              {!selectedCategory ? (
                <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
                  {dosageGuides.map((guide, index) => {
                    const Icon = guide.icon;
                    return (
                      <Card
                        key={guide.id}
                        className="h-full hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50"
                        onClick={() => handleCategorySelect(guide.id)}
                      >
                        <CardHeader className="text-center">
                          <div className={`mx-auto mb-4 p-4 rounded-full bg-gradient-to-br ${guide.color} text-white`}>
                            <Icon className="h-8 w-8" />
                          </div>
                          <CardTitle className="mb-2">{guide.group}</CardTitle>
                          <CardDescription>{guide.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full" variant="outline">{t('dosage.view_dosage')}</Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div id="dosage-content" className="max-w-4xl mx-auto">
                  <Button onClick={handleReset} variant="ghost" className="mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('dosage.back_categories')}
                  </Button>

                  {selectedGuide && (
                    <Card className="mb-8">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full bg-gradient-to-br ${selectedGuide.color} text-white`}>
                            <selectedGuide.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl">{selectedGuide.group}</CardTitle>
                            <CardDescription>{selectedGuide.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {selectedGuide.dosages.map((dosage, index) => (
                          <div key={index} className="p-4 rounded-lg bg-muted/50 border">
                            <h4 className="font-bold text-lg mb-2">{dosage.form}</h4>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div><span className="font-semibold">{t('dosage.amount')}:</span> {dosage.amount}</div>
                              <div><span className="font-semibold">{t('dosage.timing')}:</span> {dosage.timing}</div>
                              <div className="col-span-2"><span className="font-semibold">{t('dosage.method')}:</span> {dosage.method}</div>
                              <div className="col-span-2 text-muted-foreground"><span className="font-semibold">{t('dosage.note')}:</span> {dosage.notes}</div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Precautions Section */}
                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    {precautions.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <Card key={index} className="border-l-4 border-l-red-500">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Icon className="h-5 w-5 text-red-500" />
                              {item.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>

                  {/* Tips Section */}
                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    {administrationTips.map((item, index) => (
                      <Card key={index} className="bg-primary/5 border-primary/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-primary">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{item.tip}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DosagePage;