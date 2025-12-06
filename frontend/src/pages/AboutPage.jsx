import React from "react";
import { motion } from "framer-motion";
import {
  Leaf,
  Activity,
  Database,
  Cpu,
  ShieldCheck,
  Sprout,
  Globe,
  Award,
  BookOpen,
  Heart,
  Droplets,
  Sun,
  Wind
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { BackgroundGradient } from "../components/ui/background-gradient";
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: Heart,
      title: t('about.benefit_blood_sugar'),
      description: t('about.benefit_blood_sugar_desc'),
    },
    {
      icon: Activity,
      title: t('about.benefit_weight'),
      description: t('about.benefit_weight_desc'),
    },
    {
      icon: ShieldCheck,
      title: t('about.benefit_anti_diabetic'),
      description: t('about.benefit_anti_diabetic_desc'),
    },
    {
      icon: Droplets,
      title: t('about.benefit_sweet_taste'),
      description: t('about.benefit_sweet_taste_desc'),
    },
    {
      icon: Activity,
      title: t('about.benefit_cholesterol'),
      description: t('about.benefit_cholesterol_desc'),
    },
    {
      icon: Leaf,
      title: t('about.benefit_anti_inflammatory'),
      description: t('about.benefit_anti_inflammatory_desc'),
    },
  ];

  const scientificInfo = [
    {
      title: t('about.active_compounds'),
      content: t('about.active_compounds_desc'),
    },
    {
      title: t('about.mechanism'),
      content: t('about.mechanism_desc'),
    },
    {
      title: t('about.traditional_use'),
      content: t('about.traditional_use_desc'),
    },
  ];

  const plantInfo = [
    {
      icon: Globe,
      title: t('about.origin'),
      description: t('about.origin_desc'),
    },
    {
      icon: Sprout,
      title: t('about.botanical'),
      description: t('about.botanical_desc'),
    },
    {
      icon: BookOpen,
      title: t('about.common_names'),
      description: t('about.common_names_desc'),
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-0 text-sm px-4 py-1">
              {t('about.model_info')}
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
              {t('about.title')}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              <span className="font-bold text-primary">{t('about.intro_bold')}</span> {t('about.intro_text')}
            </p>
            <p className="text-xl text-muted-foreground leading-relaxed mt-4">
              {t('about.intro_model_text')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Plant Information Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('about.plant_info_title')}</h2>
            <p className="text-muted-foreground">{t('about.plant_info_subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {plantInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-0 bg-background/50 backdrop-blur-sm">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{info.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{info.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Health Benefits Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('about.health_benefits_title')}</h2>
            <p className="text-muted-foreground">{t('about.health_benefits_subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <BackgroundGradient className="rounded-[22px] h-full p-1 bg-white dark:bg-zinc-900">
                    <div className="bg-white dark:bg-zinc-900 rounded-[20px] p-6 h-full">
                      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {benefit.description}
                      </p>
                    </div>
                  </BackgroundGradient>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Scientific Info */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('about.scientific_title')}</h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                {t('about.scientific_subtitle')}
              </p>
              <div className="space-y-6">
                {scientificInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                  >
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-primary-foreground/90">{item.content}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative h-[600px] rounded-3xl overflow-hidden hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80"
                alt="Scientific Research"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Dataset Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('about.dataset_title')}</h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t('about.dataset_text')}
              </p>

              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-4xl font-black text-primary">10k+</CardTitle>
                    <CardDescription>{t('about.training_images')}</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-4xl font-black text-primary">4</CardTitle>
                    <CardDescription>{t('about.disease_classes')}</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-4xl font-black text-primary">224px</CardTitle>
                    <CardDescription>{t('about.input_resolution')}</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-4xl font-black text-primary">Augmented</CardTitle>
                    <CardDescription>{t('about.data_processing')}</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80"
                alt="Leaf Sample 1"
                className="rounded-2xl shadow-lg transform translate-y-8"
              />
              <img
                src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80"
                alt="Leaf Sample 2"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Model Performance */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">{t('about.model_perf_title')}</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-5xl font-black text-primary">99.2%</CardTitle>
                <CardDescription className="text-lg font-medium">{t('about.validation_accuracy')}</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-5xl font-black text-primary">0.08s</CardTitle>
                <CardDescription className="text-lg font-medium">Inference Time</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-5xl font-black text-primary">3.4MB</CardTitle>
                <CardDescription className="text-lg font-medium">Model Size</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
