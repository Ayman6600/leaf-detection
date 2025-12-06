import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Download,
  Share2,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Droplets,
  Sun,
  Wind,
  Thermometer,
  Activity,
  FileText,
  Scan,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { BackgroundGradient } from '../components/ui/background-gradient';
import { useToast } from '../components/ui/toast';
import jsPDF from 'jspdf';
import { useTranslation } from 'react-i18next';

const ResultPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get data from location state first, then localStorage
    const stateData = location.state;
    const localData = localStorage.getItem('predictionResult');

    if (stateData) {
      setResult(stateData);
    } else if (localData) {
      setResult(JSON.parse(localData));
    }

    setLoading(false);
  }, [location.state]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#1B5E20]"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('result.no_results')}</h2>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          {t('result.no_results_text')}
        </p>
        <Button
          onClick={() => navigate('/')}
          className="bg-[#1B5E20] hover:bg-[#2E7D32]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('result.back_home')}
        </Button>
      </div>
    );
  }

  const { predicted_label, confidence, results } = result;

  // Helper to translate labels
  const getTranslatedLabel = (label) => {
    const keyMap = {
      'Powdery Mildew': 'result.label_powdery_mildew',
      'Powdery mildew': 'result.label_powdery_mildew', // Match API
      'Leaf Spot': 'result.label_leaf_spot',
      'Leaf spot': 'result.label_leaf_spot', // Match API
      'Aphids': 'result.label_aphids',
      'Aphids (Aphis sp.)': 'result.label_aphids', // Match API
      'Healthy': 'result.label_healthy'
    };
    return t(keyMap[label] || 'result.label_unknown');
  };

  const translatedLabel = getTranslatedLabel(predicted_label);

  // Format confidence: if < 1 (e.g. 0.88), multiply by 100. If > 1 (e.g. 88.75), keep as is.
  const rawConfidence = parseFloat(confidence);
  const formattedConfidence = (rawConfidence <= 1 ? rawConfidence * 100 : rawConfidence).toFixed(2);

  // Get treatment info based on prediction
  const getTreatmentInfo = (label) => {
    const treatments = {
      'Powdery Mildew': {
        risk: t('result.moderate_risk'),
        color: 'text-yellow-600',
        bg: 'bg-yellow-100',
        description: t('result.pm_desc'),
        steps: [
          t('result.pm_step1'),
          t('result.pm_step2'),
          t('result.pm_step3'),
          t('result.pm_step4')
        ],
        prevention: {
          water: t('result.watering'),
          sun: t('result.lighting'),
          air: t('result.airflow')
        }
      },
      'Powdery mildew': {
        risk: t('result.moderate_risk'),
        color: 'text-yellow-600',
        bg: 'bg-yellow-100',
        description: t('result.pm_desc'),
        steps: [
          t('result.pm_step1'),
          t('result.pm_step2'),
          t('result.pm_step3'),
          t('result.pm_step4')
        ],
        prevention: {
          water: t('result.watering'),
          sun: t('result.lighting'),
          air: t('result.airflow')
        }
      },
      'Leaf Spot': {
        risk: t('result.high_risk'),
        color: 'text-red-600',
        bg: 'bg-red-100',
        description: t('result.ls_desc'),
        steps: [
          t('result.ls_step1'),
          t('result.ls_step2'),
          t('result.ls_step3'),
          t('result.ls_step4')
        ],
        prevention: {
          water: t('result.watering'),
          sun: t('result.lighting'),
          air: t('result.airflow')
        }
      },
      'Leaf spot': {
        risk: t('result.high_risk'),
        color: 'text-red-600',
        bg: 'bg-red-100',
        description: t('result.ls_desc'),
        steps: [
          t('result.ls_step1'),
          t('result.ls_step2'),
          t('result.ls_step3'),
          t('result.ls_step4')
        ],
        prevention: {
          water: t('result.watering'),
          sun: t('result.lighting'),
          air: t('result.airflow')
        }
      },
      'Aphids': {
        risk: t('result.moderate_risk'),
        color: 'text-orange-600',
        bg: 'bg-orange-100',
        description: t('result.aphids_desc'),
        steps: [
          t('result.aphids_step1'),
          t('result.aphids_step2'),
          t('result.aphids_step3'),
          t('result.aphids_step4')
        ],
        prevention: {
          water: t('result.watering'),
          sun: t('result.lighting'),
          air: t('result.airflow')
        }
      },
      'Aphids (Aphis sp.)': {
        risk: t('result.moderate_risk'),
        color: 'text-orange-600',
        bg: 'bg-orange-100',
        description: t('result.aphids_desc'),
        steps: [
          t('result.aphids_step1'),
          t('result.aphids_step2'),
          t('result.aphids_step3'),
          t('result.aphids_step4')
        ],
        prevention: {
          water: t('result.watering'),
          sun: t('result.lighting'),
          air: t('result.airflow')
        }
      },
      'Healthy': {
        risk: t('result.low_risk'),
        color: 'text-green-600',
        bg: 'bg-green-100',
        description: t('result.healthy_desc'),
        steps: [
          t('result.healthy_step1'),
          t('result.healthy_step2'),
          t('result.healthy_step3'),
          t('result.healthy_step4')
        ],
        prevention: {
          water: t('result.watering'),
          sun: t('result.lighting'),
          air: t('result.airflow')
        }
      }
    };

    // Fallback for unknown conditions
    const unknownTreatment = {
      risk: t('result.unknown_risk') || 'Unknown Risk',
      color: 'text-gray-600',
      bg: 'bg-gray-100',
      description: t('result.unknown_desc') || 'The condition could not be identified with high confidence. Please consult an expert.',
      steps: [
        t('result.unknown_step1') || 'Consult a local agricultural expert',
        t('result.unknown_step2') || 'Monitor the plant for further symptoms',
        t('result.unknown_step3') || 'Isolate the plant to prevent potential spread',
        t('result.unknown_step4') || 'Ensure optimal growing conditions'
      ],
      prevention: {
        water: '-',
        sun: '-',
        air: '-'
      }
    };

    return treatments[label] || unknownTreatment;
  };

  const info = getTreatmentInfo(predicted_label);

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add Header
    doc.setFillColor(27, 94, 32); // #1B5E20
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("Leaf AI Analysis Report", 105, 25, { align: "center" });

    // Add Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);

    // Result Section
    doc.setFontSize(16);
    doc.setTextColor(27, 94, 32);
    doc.text("Diagnosis Result", 20, 70);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Condition: ${translatedLabel}`, 20, 85);
    doc.text(`Confidence: ${formattedConfidence}%`, 20, 95);
    doc.text(`Risk Level: ${info.risk}`, 20, 105);

    // Treatment Section
    doc.setFontSize(16);
    doc.setTextColor(27, 94, 32);
    doc.text("Recommended Treatment", 20, 125);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    let yPos = 140;
    info.steps.forEach((step, index) => {
      doc.text(`${index + 1}. ${step}`, 20, yPos);
      yPos += 10;
    });

    // Prevention Section
    doc.setFontSize(16);
    doc.setTextColor(27, 94, 32);
    doc.text("Prevention & Care", 20, yPos + 20);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Watering: ${info.prevention.water}`, 20, yPos + 35);
    doc.text(`Sunlight: ${info.prevention.sun}`, 20, yPos + 45);
    doc.text(`Airflow: ${info.prevention.air}`, 20, yPos + 55);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text("Generated by Leaf AI - Plant Disease Detection System", 105, 280, { align: "center" });

    doc.save("leaf-ai-report.pdf");
    toast.success("Report downloaded successfully");
  };

  return (
    <div className="min-h-screen relative bg-[#0A1F1C] pb-20 text-white">

      {/* Header Section */}
      <div className="bg-[#0A1F1C] pt-20 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1F1C]/50 via-[#0A1F1C]/80 to-[#0A1F1C]" />

        <div className="container mx-auto px-4 relative z-10">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 mb-6"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            {t('result.back_home')}
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <Badge className={`mb-4 px-4 py-1 text-base ${info.bg} ${info.color} border-0`}>
                {info.risk}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black mb-2 font-display text-white">
                {translatedLabel}
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl font-body">
                {info.description}
              </p>
            </div>

            <div className="bg-[#1B4D3E] rounded-2xl p-6 border border-[#E5C558]/20 shadow-xl backdrop-blur-sm">
              <div className="text-sm text-[#E5C558] mb-1 font-bold uppercase tracking-wider">{t('result.confidence')}</div>
              <div className="text-4xl font-black text-white">{formattedConfidence}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <BackgroundGradient className="rounded-3xl">
                <Card className="border-0 overflow-hidden bg-[#1B4D3E] text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#E5C558]">
                      <Scan className="h-5 w-5" />
                      {t('result.analyzed_image')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {result.imageUrl && (
                      <div className="relative h-64 md:h-96 w-full bg-black/20">
                        <img
                          src={result.imageUrl}
                          alt="Analyzed Leaf"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </BackgroundGradient>
            </motion.div>

            {/* Treatment Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border border-[#E5C558]/20 shadow-lg bg-[#1B4D3E] text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl text-[#E5C558]">
                    <Activity className="h-6 w-6" />
                    {t('result.treatment_plan')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
                        <CheckCircle className="h-5 w-5 text-[#E5C558]" />
                        {t('result.treatment_steps')}
                      </h3>
                      <div className="grid gap-4">
                        {info.steps.map((step, index) => (
                          <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-[#0A1F1C]/50 border border-white/5 hover:border-[#E5C558]/30 transition-colors">
                            <div className="h-8 w-8 rounded-full bg-[#E5C558] text-[#0A1F1C] flex items-center justify-center flex-shrink-0 font-bold">
                              {index + 1}
                            </div>
                            <p className="text-gray-200 mt-1">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 rounded-xl bg-blue-900/20 border border-blue-500/30">
                      <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        {t('result.pro_tip')}
                      </h4>
                      <p className="text-blue-200">
                        {t('result.protip_isolate')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg bg-[#E5C558] text-[#0A1F1C]">
                <CardContent className="p-6 space-y-4">
                  <Button
                    onClick={() => navigate('/')}
                    className="w-full bg-[#0A1F1C] text-[#E5C558] hover:bg-[#0A1F1C]/90 font-bold h-12 border border-[#E5C558]"
                  >
                    <Scan className="mr-2 h-5 w-5" />
                    {t('result.scan_another')}
                  </Button>
                  <Button
                    onClick={generatePDF}
                    variant="outline"
                    className="w-full border-[#0A1F1C]/20 text-[#0A1F1C] hover:bg-[#0A1F1C]/10 h-12"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    {t('result.download_report')}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Prevention Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border border-[#E5C558]/20 shadow-lg bg-[#1B4D3E] text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#E5C558]">
                    <Shield className="h-5 w-5" />
                    {t('result.prevention_care')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
                      <Droplets className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">{t('result.watering')}</div>
                      <div className="font-medium text-white">{info.prevention.water}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-yellow-500/20 text-yellow-400">
                      <Sun className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">{t('result.lighting')}</div>
                      <div className="font-medium text-white">{info.prevention.sun}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-green-500/20 text-green-400">
                      <Wind className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">{t('result.airflow')}</div>
                      <div className="font-medium text-white">{info.prevention.air}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Severity Meter */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border border-[#E5C558]/20 shadow-lg bg-[#1B4D3E] text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#E5C558]">
                    <Thermometer className="h-5 w-5" />
                    {t('result.severity')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-green-400 font-medium">{t('result.low_risk')}</span>
                      <span className="text-red-400 font-medium">{t('result.high_risk')}</span>
                    </div>
                    <Progress
                      value={
                        info.risk === t('result.low_risk') ? 25 :
                          info.risk === t('result.moderate_risk') ? 50 : 90
                      }
                      className={`h-4 bg-[#0A1F1C]`}
                      indicatorClassName={
                        info.risk === t('result.low_risk') ? 'bg-green-500' :
                          info.risk === t('result.moderate_risk') ? 'bg-yellow-500' : 'bg-red-500'
                      }
                    />
                    <p className="text-sm text-gray-400 text-center mt-2">
                      Current condition assessment based on visual analysis
                    </p>
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

export default ResultPage;
