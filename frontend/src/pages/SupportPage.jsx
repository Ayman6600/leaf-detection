import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { BackgroundGradient } from "../components/ui/background-gradient";
import { Spotlight } from "../components/ui/spotlight";
import { useTranslation } from 'react-i18next';

const SupportPage = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t('support.email_support'),
      details: "support@leafai.com",
      subDetails: "Response within 24 hours",
    },
    {
      icon: Phone,
      title: t('support.phone_support'),
      details: "+1 (555) 123-4567",
      subDetails: "Mon-Fri, 9am-6pm EST",
    },
    {
      icon: MapPin,
      title: t('support.visit_us'),
      details: "123 Innovation Drive",
      subDetails: "Tech Valley, CA 94043",
    },
  ];

  return (
    <div className="min-h-screen relative">

      {/* Hero Section */}
      <div className="relative h-[40vh] flex items-center justify-center z-10">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="hsl(142 76% 42%)"
        />
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center px-4"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-3xl bg-gradient-to-br from-primary to-primary/60 shadow-2xl shadow-primary/50">
              <MessageSquare className="h-12 w-12 text-black" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
            {t('support.title')}
          </h1>
          <p className="text-xl text-black max-w-2xl mx-auto">
            {t('support.subtitle')}
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <BackgroundGradient className="rounded-3xl h-full">
                <Card className="h-full border-0">
                  <CardHeader>
                    <CardTitle className="text-2xl">{t('support.send_message')}</CardTitle>
                    <CardDescription>
                      {t('support.form_desc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-12 text-center"
                      >
                        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                          <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                        <p className="text-muted-foreground mb-8">
                          Thank you for reaching out. We'll get back to you shortly.
                        </p>
                        <Button onClick={() => setIsSubmitted(false)} variant="outline">
                          Send Another Message
                        </Button>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">{t('support.name')}</label>
                            <Input required placeholder="John Doe" className="h-12 rounded-xl" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">{t('support.email')}</label>
                            <Input required type="email" placeholder="john@example.com" className="h-12 rounded-xl" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t('support.subject')}</label>
                          <Input required placeholder="How can we help?" className="h-12 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t('support.message')}</label>
                          <Textarea required placeholder="Tell us more about your inquiry..." className="min-h-[150px] rounded-xl resize-none" />
                        </div>
                        <Button
                          type="submit"
                          className="w-full h-12 text-lg font-bold"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Clock className="mr-2 h-5 w-5 animate-spin" />
                              {t('support.sending')}
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-5 w-5" />
                              {t('support.send_btn')}
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </BackgroundGradient>
            </motion.div>
          </div>

          {/* Contact Info Cards */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-2 hover:border-primary/50 transition-colors">
                    <CardContent className="flex items-center gap-6 p-6">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{info.title}</h3>
                        <p className="font-medium">{info.details}</p>
                        <p className="text-sm text-muted-foreground">{info.subDetails}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <Card className="bg-primary text-primary-foreground border-0">
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-80" />
                  <h3 className="text-xl font-bold mb-2">{t('support.support_hours')}</h3>
                  <p className="opacity-90 mb-4">{t('support.online_support')}</p>
                  <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
                    <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    {t('support.quick_response')}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
