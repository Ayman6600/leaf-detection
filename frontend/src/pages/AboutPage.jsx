import React from "react";
import { motion } from "framer-motion";
import { Leaf, Target, Zap, Smartphone, FileText, Sparkles, Heart, Shield, Award, Globe, Users, TrendingUp, Upload, ArrowRight, Database, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

const AboutPage = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Blood Sugar Management",
      description: "Helps reduce sugar absorption in the intestines and may lower blood glucose levels naturally.",
    },
    {
      icon: TrendingUp,
      title: "Weight Management",
      description: "Suppresses sugar cravings and may help reduce body weight when combined with a healthy lifestyle.",
    },
    {
      icon: Shield,
      title: "Anti-Diabetic Properties",
      description: "Stimulates insulin secretion from pancreatic beta cells and may regenerate islet cells.",
    },
    {
      icon: Sparkles,
      title: "Reduces Sweet Taste",
      description: "Gymnemic acids temporarily suppress the taste of sweetness, helping reduce sugar intake.",
    },
    {
      icon: Heart,
      title: "Cholesterol Support",
      description: "May help lower LDL cholesterol and triglyceride levels while supporting heart health.",
    },
    {
      icon: Shield,
      title: "Anti-Inflammatory",
      description: "Contains compounds with anti-inflammatory and antioxidant properties for overall wellness.",
    },
  ];

  const scientificInfo = [
    {
      title: "Active Compounds",
      description: "Gymnemic acids (gymnemagenin, gymnemasaponins), gurmarin protein, and triterpene saponins.",
    },
    {
      title: "Mechanism of Action",
      description: "Blocks sweet taste receptors, inhibits glucose absorption in intestines, and stimulates insulin production.",
    },
    {
      title: "Traditional Use",
      description: "Used in Ayurvedic medicine for over 2,000 years as 'Gurmar' (sugar destroyer) for diabetes treatment.",
    },
  ];

  const plantInfo = [
    {
      icon: Globe,
      title: "Origin & Habitat",
      description: "Native to tropical forests of India, Africa, and Australia. Thrives in warm, humid climates.",
    },
    {
      icon: Leaf,
      title: "Botanical Features",
      description: "Woody climbing plant with opposite, oval leaves. Small yellow flowers in umbel-like clusters.",
    },
    {
      icon: Users,
      title: "Common Names",
      description: "Gurmar (Hindi), Meshashringi (Sanskrit), Australian Cowplant, Periploca of the Woods.",
    },
  ];

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
                <Sparkles className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-black font-display">
              About Leaf AI
            </h1>
            <p className="text-xl md:text-2xl text-black max-w-3xl mx-auto mb-4 font-body">
              AI-Powered Plant Disease Detection System for Farmers
            </p>
            <p className="text-lg text-[#1B5E20] italic font-body">
              Built with MobileNetV2 Deep Learning Model
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="glass border-2 border-[#66BB6A]/30 shadow-glow-lg">
              <CardContent className="p-10 md:p-12">
                <p className="text-lg md:text-xl text-black leading-relaxed mb-8 font-body">
                  <strong className="text-black text-xl md:text-2xl">Leaf AI</strong> is an advanced AI-powered plant disease detection system designed to help farmers and gardeners identify leaf diseases quickly and accurately. 
                  Using state-of-the-art deep learning technology, our system can analyze images of plant leaves and provide instant diagnosis with treatment recommendations.
                </p>
                <p className="text-lg md:text-xl text-black leading-relaxed font-body">
                  Our system is built on <strong className="text-[#1B5E20]">MobileNetV2</strong>, a powerful convolutional neural network architecture optimized for mobile and edge devices. 
                  This makes our detection system fast, accurate, and accessible to farmers worldwide, even those using smartphones with limited connectivity.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* AI Model Information */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4 font-display">
              AI Model Information
            </h2>
            <p className="text-xl text-black font-body">
              Deep learning architecture and technical specifications
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {[
              {
                title: "Architecture",
                value: "MobileNetV2",
                description: "Efficient CNN model optimized for mobile devices",
                icon: Target,
              },
              {
                title: "Input Size",
                value: "224×224",
                description: "Standard image resolution for processing",
                icon: Smartphone,
              },
              {
                title: "Classes",
                value: "4 Diseases",
                description: "Powdery Mildew, Leaf Spot, Aphids, Healthy",
                icon: FileText,
              },
              {
                title: "Accuracy",
                value: "77.78%",
                description: "Validation accuracy on test dataset",
                icon: Award,
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className="h-full glass border-2 border-[#66BB6A]/30 shadow-glow hover:shadow-glow-lg transition-all card-hover">
                    <CardHeader className="pb-6">
                      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#66BB6A] shadow-glow">
                        <Icon className="h-10 w-10 text-white" />
                      </div>
                      <CardTitle className="text-center text-xl md:text-2xl text-black font-display">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center text-3xl md:text-4xl font-black text-[#1B5E20] mb-4">{item.value}</div>
                      <p className="text-center text-sm md:text-base text-black font-body leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4 font-display">
              System Architecture
            </h2>
            <p className="text-xl text-black font-body">
              How the detection system works end-to-end
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <Card className="glass border-2 border-[#66BB6A]/30 shadow-glow-lg">
              <CardContent className="p-10 md:p-16">
                <div className="grid md:grid-cols-5 gap-6 items-center">
                  {[
                    { label: "User Uploads Image", icon: Upload },
                    { label: "Frontend", icon: FileText },
                    { label: "Flask API", icon: Zap },
                    { label: "CNN Model", icon: Target },
                    { label: "Result UI", icon: Sparkles },
                  ].map((step, index) => {
                    const StepIcon = step.icon;
                    return (
                      <React.Fragment key={index}>
                        <div className="flex flex-col items-center text-center">
                          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#66BB6A] shadow-glow mb-4">
                            <StepIcon className="h-8 w-8 text-white" />
                          </div>
                          <p className="text-sm md:text-base font-semibold text-black">{step.label}</p>
                        </div>
                        {index < 4 && (
                          <div className="hidden md:flex items-center justify-center">
                            <ArrowRight className="h-8 w-8 text-[#66BB6A]" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Plant Information */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4 font-display">
              Plant Information
            </h2>
            <p className="text-xl text-black font-body">
              Botanical characteristics and natural habitat
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {plantInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className="h-full glass border-2 border-[#66BB6A]/30 shadow-glow hover:shadow-glow-lg transition-all card-hover">
                    <CardHeader className="pb-6">
                      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#66BB6A] shadow-glow">
                        <Icon className="h-10 w-10 text-black" />
                      </div>
                      <CardTitle className="text-center text-xl md:text-2xl text-black font-display">{info.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-center text-base md:text-lg text-black font-body leading-relaxed">
                        {info.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Health Benefits */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4 font-display">
              Health Benefits
            </h2>
            <p className="text-xl text-black max-w-2xl mx-auto font-body">
              Scientifically studied therapeutic properties of Gymnema sylvestre
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className="h-full glass border-2 border-[#66BB6A]/30 shadow-glow hover:shadow-glow-lg transition-all card-hover">
                    <CardHeader className="pb-6">
                      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#66BB6A] shadow-glow">
                        <Icon className="h-10 w-10 text-black" />
                      </div>
                      <CardTitle className="text-center text-xl md:text-2xl text-black font-display">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-center text-base md:text-lg text-black font-body leading-relaxed">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Scientific Information */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4 font-display">
              Scientific Information
            </h2>
            <p className="text-xl text-black font-body">
              Active compounds and mechanisms of action
            </p>
          </div>

          <div className="grid gap-8 max-w-4xl mx-auto">
            {scientificInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-2 border-[#66BB6A]/30 shadow-glow hover:shadow-glow-lg transition-all">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-2xl md:text-3xl text-black font-display">{info.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base md:text-lg text-black leading-relaxed font-body">
                      {info.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Traditional & Modern Use */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full glass border-2 border-[#66BB6A]/30 shadow-glow hover:shadow-glow-lg transition-all">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#66BB6A] shadow-glow">
                      <Users className="h-7 w-7 text-black" />
                    </div>
                    <CardTitle className="text-2xl md:text-3xl text-black font-display">Traditional Use</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 text-base md:text-lg text-black font-body">
                    <li className="flex items-start">
                      <span className="text-[#66BB6A] mr-2 text-xl">•</span>
                      <span>Used in Ayurvedic medicine for over 2,000 years</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#66BB6A] mr-2 text-xl">•</span>
                      <span>Prescribed for "Madhumeha" (diabetes) in ancient texts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#66BB6A] mr-2 text-xl">•</span>
                      <span>Leaves chewed to reduce sugar cravings</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#66BB6A] mr-2 text-xl">•</span>
                      <span>Decoction used for digestive issues and weight loss</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#66BB6A] mr-2 text-xl">•</span>
                      <span>Applied topically for wounds and snake bites</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full glass border-2 border-[#66BB6A]/30 shadow-glow hover:shadow-glow-lg transition-all">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#66BB6A] shadow-glow">
                      <Award className="h-7 w-7 text-black" />
              </div>
                    <CardTitle className="text-2xl md:text-3xl text-black font-display">Modern Research</CardTitle>
              </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 text-base md:text-lg text-black font-body">
                    <li className="flex items-start">
                      <span className="text-[#66BB6A] mr-2 text-xl">•</span>
                      <span>Clinically proven to reduce blood sugar levels</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#66BB6A] mr-2 text-xl">•</span>
                      <span>Studies show 18-24 months of use improves A1C levels</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#66BB6A] mr-2 text-xl">•</span>
                      <span>Standardized extracts (25% gymnemic acids) widely used</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#66BB6A] mr-2 text-xl">•</span>
                      <span>FDA-approved dietary supplement in many countries</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#66BB6A] mr-2 text-xl">•</span>
                      <span>Ongoing research for obesity and metabolic syndrome</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
              </div>
            </div>
      </section>

      {/* Dataset Preparation */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4 font-display">
              Dataset Preparation
            </h2>
            <p className="text-xl text-black font-body">
              How we built our training dataset
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="glass border-2 border-[#66BB6A]/30 shadow-glow-lg">
              <CardContent className="p-10 md:p-12">
                <p className="text-lg md:text-xl text-black leading-relaxed mb-6 font-body">
                  Our model was trained on a comprehensive dataset of leaf images collected from various sources, 
                  including field photographs and agricultural research databases. The dataset includes thousands of 
                  high-quality images across four categories:
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="p-6 rounded-2xl bg-[#C8E6C9]/20 border border-[#66BB6A]/20">
                    <h4 className="font-bold text-lg text-[#1B5E20] mb-3">Disease Classes</h4>
                    <ul className="space-y-2 text-black">
                      <li className="flex items-center gap-2">
                        <span className="text-[#66BB6A]">•</span>
                        <span>Powdery Mildew</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#66BB6A]">•</span>
                        <span>Leaf Spot</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#66BB6A]">•</span>
                        <span>Aphids</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#66BB6A]">•</span>
                        <span>Healthy</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#C8E6C9]/20 border border-[#66BB6A]/20">
                    <h4 className="font-bold text-lg text-[#1B5E20] mb-3">Data Processing</h4>
                    <ul className="space-y-2 text-black">
                      <li className="flex items-center gap-2">
                        <span className="text-[#66BB6A]">•</span>
                        <span>Image augmentation for diversity</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#66BB6A]">•</span>
                        <span>Normalized to 224×224 pixels</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#66BB6A]">•</span>
                        <span>Train/validation split</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#66BB6A]">•</span>
                        <span>Preprocessing pipeline</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Metrics Visualization */}
      <section className="py-12 pb-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4 font-display">
              Model Performance
            </h2>
            <p className="text-xl text-black font-body">
              Accuracy and validation metrics
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="glass border-2 border-[#66BB6A]/30 shadow-glow-lg">
              <CardContent className="p-10 md:p-12">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-black">Validation Accuracy</span>
                    <span className="text-2xl font-black text-[#1B5E20]">77.78%</span>
                  </div>
                  <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "77.78%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#1B5E20] to-[#66BB6A] rounded-full"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Accuracy improves with more training data</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center p-6 rounded-2xl bg-[#C8E6C9]/20">
                    <BarChart3 className="h-8 w-8 text-[#1B5E20] mx-auto mb-3" />
                    <div className="text-3xl font-black text-[#1B5E20] mb-2">4</div>
                    <div className="text-sm text-black">Disease Classes</div>
                  </div>
                  <div className="text-center p-6 rounded-2xl bg-[#C8E6C9]/20">
                    <Database className="h-8 w-8 text-[#1B5E20] mx-auto mb-3" />
                    <div className="text-3xl font-black text-[#1B5E20] mb-2">1000+</div>
                    <div className="text-sm text-black">Training Images</div>
                  </div>
                  <div className="text-center p-6 rounded-2xl bg-[#C8E6C9]/20">
                    <Target className="h-8 w-8 text-[#1B5E20] mx-auto mb-3" />
                    <div className="text-3xl font-black text-[#1B5E20] mb-2">224×224</div>
                    <div className="text-sm text-black">Input Resolution</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
