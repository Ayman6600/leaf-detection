import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Mail, Phone, Send, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { BackgroundGradient } from "../components/ui/background-gradient";
import { Spotlight } from "../components/ui/spotlight";
import { useToast } from "../components/ui/toast";

const SupportPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setSubmitting(true);
    
    // Save to localStorage
    try {
      const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
      const newSubmission = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...formData
      };
      submissions.unshift(newSubmission);
      // Keep only last 50 submissions
      const updated = submissions.slice(0, 50);
      localStorage.setItem('contactSubmissions', JSON.stringify(updated));
      
      toast.success("Thank you for your message! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setErrors({});
    } catch (error) {
      console.error("Error saving submission:", error);
      toast.error("Failed to save submission. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "support@leafai.com",
      action: "Send Email",
      color: "from-blue-500/20 to-blue-600/5",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "+1 (555) 123-4567",
      action: "Call Now",
      color: "from-[#C8E6C9]/30 to-[#66BB6A]/10",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "123 Agriculture Blvd, Farm City",
      action: "Get Directions",
      color: "from-purple-500/20 to-purple-600/5",
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
            Get Support
          </h1>
          <p className="text-xl text-black max-w-2xl mx-auto">
            We're here to help with any questions or concerns you may have
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Contact Methods */}
        <div className="mb-16">
          <div className="grid gap-6 md:grid-cols-3">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
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
                        <div
                          className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${method.color} shadow-xl`}
                        >
                          <Icon className="h-10 w-10 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{method.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base mb-6">
                          {method.description}
                        </CardDescription>
                        <Button variant="outline" className="w-full font-bold">
                          {method.action}
                        </Button>
                      </CardContent>
                    </Card>
                  </BackgroundGradient>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Contact Form & Info */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <BackgroundGradient className="rounded-3xl">
              <Card className="border-0">
                <CardHeader>
                  <CardTitle className="text-3xl">Send Us a Message</CardTitle>
                  <CardDescription className="text-base">
                    Fill out the form below and we'll respond within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-base font-bold">
                          Your Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className={`h-12 rounded-xl ${errors.name ? 'border-red-500' : ''}`}
                          required
                        />
                        {errors.name && (
                          <p className="text-sm text-red-600">{errors.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-base font-bold">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className={`h-12 rounded-xl ${errors.email ? 'border-red-500' : ''}`}
                          required
                        />
                        {errors.email && (
                          <p className="text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-base font-bold">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        className={`h-12 rounded-xl ${errors.subject ? 'border-red-500' : ''}`}
                        required
                      />
                      {errors.subject && (
                        <p className="text-sm text-red-600">{errors.subject}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-base font-bold">
                        Message
                      </Label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your question or concern..."
                        className={`w-full min-h-[200px] rounded-xl border bg-background px-4 py-3 text-base ring-offset-background placeholder:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                          errors.message ? 'border-red-500' : 'border-input'
                        }`}
                        required
                      />
                      {errors.message && (
                        <p className="text-sm text-red-600">{errors.message}</p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full font-bold text-lg"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </BackgroundGradient>
          </motion.div>

          {/* Sidebar Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <BackgroundGradient className="rounded-3xl">
              <Card className="border-0">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Clock className="mr-2 h-6 w-6 text-primary" />
                    Support Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="font-bold text-foreground mb-1">24/7 Online Support</div>
                    <div className="text-sm text-black">Email & Chat available anytime</div>
                  </div>
                  <div className="h-px bg-[hsl(var(--border))]" />
                  <div>
                    <div className="font-bold text-foreground mb-1">Phone Support</div>
                    <div className="text-sm text-black">Mon-Fri: 9 AM - 6 PM EST</div>
                    <div className="text-sm text-black">Sat-Sun: 10 AM - 4 PM EST</div>
                  </div>
                </CardContent>
              </Card>
            </BackgroundGradient>

            <BackgroundGradient className="rounded-3xl">
              <Card className="border-0">
                <CardHeader>
                  <CardTitle className="text-xl">Quick Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-black text-primary text-lg">
                        &lt;1h
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-sm">Email Response</div>
                        <div className="text-xs text-black">Average response time</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-black text-primary text-lg">
                        98%
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-sm">Satisfaction Rate</div>
                        <div className="text-xs text-black">Customer feedback</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </BackgroundGradient>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
