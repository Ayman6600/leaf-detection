import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Search, ChevronDown, ChevronUp, MessageCircle, Book, Video, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { BackgroundGradient } from "../components/ui/background-gradient";
import { Spotlight } from "../components/ui/spotlight";
import { useTranslation } from 'react-i18next';

const FAQPage = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const faqSections = [
    {
      question: t('faq.q1'),
      answer: t('faq.a1'),
    },
    {
      question: t('faq.q2'),
      answer: t('faq.a2'),
    },
    {
      question: t('faq.q3'),
      answer: t('faq.a3'),
    },
    {
      question: t('faq.q4'),
      answer: t('faq.a4'),
    },
    {
      question: t('faq.q5'),
      answer: t('faq.a5'),
    },
    {
      question: t('faq.q6'),
      answer: t('faq.a6'),
    },
    {
      question: t('faq.q7'),
      answer: t('faq.a7'),
    },
    {
      question: t('faq.q8'),
      answer: t('faq.a8'),
    },
  ];

  const filteredFAQs = faqSections.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resources = [
    {
      icon: Book,
      title: t('faq.kb'),
      description: "Comprehensive guides and tutorials",
    },
    {
      icon: Video,
      title: t('faq.video'),
      description: "Step-by-step video guides",
    },
    {
      icon: Users,
      title: t('faq.forum'),
      description: "Connect with other users",
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
              <HelpCircle className="h-12 w-12 text-black" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
            {t('faq.title')}
          </h1>
          <p className="text-xl text-black max-w-2xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 max-w-3xl mx-auto"
        >
          <BackgroundGradient className="rounded-3xl">
            <Card className="border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Search className="mr-3 h-6 w-6 text-primary" />
                  {t('faq.search_title')}
                </CardTitle>
                <CardDescription className="text-base">
                  {t('faq.search_desc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 mb-6">
                  <Input
                    type="text"
                    placeholder={t('faq.search_placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 h-12 text-base rounded-xl"
                  />
                  <Button size="lg" className="px-6">
                    <Search className="h-5 w-5" />
                  </Button>
                </div>
                <Button variant="outline" size="lg" className="w-full font-bold">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {t('faq.contact_support')}
                </Button>
              </CardContent>
            </Card>
          </BackgroundGradient>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto mb-16 space-y-4">
          {filteredFAQs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <BackgroundGradient className="rounded-2xl" animate={false}>
                  <Card className="border-0">
                    <button
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      className="w-full text-left"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-bold pr-4">{faq.question}</CardTitle>
                          <div className="flex-shrink-0">
                            {isOpen ? (
                              <ChevronUp className="h-6 w-6 text-primary" />
                            ) : (
                              <ChevronDown className="h-6 w-6 text-black" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent>
                            <p className="text-black text-base leading-relaxed">{faq.answer}</p>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </BackgroundGradient>
              </motion.div>
            );
          })}
        </div>

        {/* Resources */}
        <div>
          <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
            {t('faq.resources_title')}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <BackgroundGradient className="rounded-3xl h-full">
                    <Card className="h-full border-0 text-center">
                      <CardHeader>
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary/60 shadow-xl">
                          <Icon className="h-10 w-10 text-black" />
                        </div>
                        <CardTitle className="text-xl">{resource.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-6 text-base">
                          {resource.description}
                        </CardDescription>
                        <Button variant="outline" className="w-full font-bold">
                          {t('faq.explore')}
                        </Button>
                      </CardContent>
                    </Card>
                  </BackgroundGradient>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
