import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Upload,
  ArrowRight,
  Shield,
  Zap,
  Layers,
  CloudSun,
  Phone
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import apiService from "../services/api";
import { useToast } from "../components/ui/toast";
import { compressImage } from "../utils/imageCompression";

const HomePage = () => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      toast.success("Image selected successfully");
      // Scroll to upload section if needed or keep focus
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
      const compressedFile = await compressImage(selectedFile);
      toast.info("Analyzing image...", { duration: 2000 });
      const result = await apiService.predictDisease(compressedFile);
      localStorage.setItem("predictionResult", JSON.stringify(result));

      // Save image as Base64 for persistent history
      if (selectedFile) {
        await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result;
            localStorage.setItem("lastAnalyzedImageUrl", base64String);
            resolve();
          };
          reader.readAsDataURL(selectedFile);
        });
      }

      toast.success("Analysis complete!");
      navigate("/result");
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error(error.message || "Failed to analyze image. Please try again.", { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1F1C] text-white font-sans selection:bg-[#E5C558] selection:text-[#0A1F1C]">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2070&auto=format&fit=crop"
            alt="Greenhouse Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F1C] via-[#0A1F1C]/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-6">
              {t('app.title')}
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-lg leading-relaxed">
              {t('app.description')}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-transparent border-2 border-[#E5C558] text-[#E5C558] hover:bg-[#E5C558] hover:text-[#0A1F1C] rounded-full px-8 py-6 text-lg font-bold transition-all"
                onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Upload className="mr-2 h-5 w-5" />
                {t('hero.upload_button')}
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:text-[#E5C558] hover:bg-white/5 rounded-full px-8 py-6 text-lg font-bold"
                onClick={() => navigate('/dosage')}
              >
                <Phone className="mr-2 h-5 w-5" />
                {t('hero.explore_button')}
              </Button>
            </div>
          </motion.div>
        </div>


      </section>



      {/* Upload & Diagnose Section (Functional) */}
      <section id="upload-section" className="py-24 bg-[#051816]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">{t('upload.title')}</h2>
            <p className="text-gray-400">{t('upload.subtitle')}</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="bg-background border border-white/10 shadow-2xl overflow-hidden">
              <CardContent className="p-0">
                {!previewUrl ? (
                  <div className="p-12 text-center border-2 border-dashed border-white/10 hover:border-[#E5C558]/50 transition-colors m-4 rounded-2xl bg-white/5">
                    <input
                      type="file"
                      id="file-upload"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer block">
                      <div className="h-20 w-20 bg-[#E5C558]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Upload className="h-10 w-10 text-[#E5C558]" />
                      </div>
                      <h3 className="text-2xl font-serif font-bold mb-2 text-white">{t('hero.upload_button')}</h3>
                      <p className="text-gray-400 mb-8">{t('upload.drag_drop')}</p>
                      <Button className="bg-[#E5C558] text-[#0A1F1C] hover:bg-[#D4B04C] rounded-full px-8 font-bold">
                        {t('upload.choose_file')}
                      </Button>
                    </label>
                  </div>
                ) : (
                  <div className="p-8">
                    <div className="relative rounded-2xl overflow-hidden mb-8 h-80 border border-white/10">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <Button
                        onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                        className="absolute top-4 right-4 bg-red-500/80 hover:bg-red-600 text-white rounded-full"
                        size="sm"
                      >
                        Remove
                      </Button>
                    </div>
                    <Button
                      onClick={handleAnalyze}
                      disabled={loading}
                      className="w-full bg-[#E5C558] text-[#0A1F1C] hover:bg-[#D4B04C] rounded-full py-6 text-lg font-bold"
                    >
                      {loading ? t('upload.analyzing') : t('upload.analyze_button')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-[#0A1F1C]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">{t('services.title')}</h2>
            <p className="text-gray-400">{t('services.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: t('services.disease_detection'), desc: t('services.disease_desc') },
              { icon: Layers, title: t('services.soil_analysis'), desc: t('services.soil_desc') },
              { icon: Shield, title: t('services.pest_control'), desc: t('services.pest_desc') },
              { icon: CloudSun, title: t('services.climate_data'), desc: t('services.climate_desc') }
            ].map((service, index) => (
              <div key={index} className="bg-[#1B4D3E] p-8 rounded-3xl hover:transform hover:-translate-y-2 transition-all duration-300 border border-white/5 group">
                <div className="h-14 w-14 bg-[#0A1F1C] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#E5C558] transition-colors">
                  <service.icon className="h-7 w-7 text-[#E5C558] group-hover:text-[#0A1F1C] transition-colors" />
                </div>
                <h3 className="text-xl font-serif font-bold mb-3">{service.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{service.desc}</p>
                <div className="mt-6 flex items-center text-[#E5C558] text-sm font-bold cursor-pointer">
                  {t('services.learn_more')} <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Footer */}
      <section className="py-16 bg-[#E5C558] text-[#0A1F1C]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-serif font-bold mb-2">1M+</div>
              <div className="text-sm font-bold uppercase tracking-wider opacity-80">{t('stats.leaves_analyzed')}</div>
            </div>
            <div>
              <div className="text-4xl font-serif font-bold mb-2">99%</div>
              <div className="text-sm font-bold uppercase tracking-wider opacity-80">{t('stats.accuracy_rate')}</div>
            </div>
            <div>
              <div className="text-4xl font-serif font-bold mb-2">50K+</div>
              <div className="text-sm font-bold uppercase tracking-wider opacity-80">{t('stats.farmers_helped')}</div>
            </div>
            <div>
              <div className="text-4xl font-serif font-bold mb-2">24/7</div>
              <div className="text-sm font-bold uppercase tracking-wider opacity-80">{t('stats.ai_support')}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
