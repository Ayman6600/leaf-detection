import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Globe, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
];

const LanguagePreferenceModal = ({ isOpen, setIsOpen }) => {
    const { t, i18n } = useTranslation();
    const [showLanguageSelection, setShowLanguageSelection] = useState(false);

    useEffect(() => {
        setIsOpen(true);
    }, [setIsOpen]);

    const handleYes = () => {
        i18n.changeLanguage('en');
        setIsOpen(false);
    };

    const handleNo = () => {
        setShowLanguageSelection(true);
    };

    const handleLanguageSelect = (langCode) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full max-w-md"
                    >
                        <Card className="border-2 border-primary/20 shadow-2xl">
                            <CardHeader className="text-center pb-2">
                                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                                    <Globe className="h-8 w-8 text-primary" />
                                </div>
                                <CardTitle className="text-2xl font-bold">
                                    {showLanguageSelection ? t('language_modal.select_language') : t('language_modal.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-4">
                                {!showLanguageSelection ? (
                                    <>
                                        <p className="text-center text-lg text-muted-foreground">
                                            {t('language_modal.question')}
                                        </p>
                                        <div className="grid gap-4">
                                            <Button
                                                size="lg"
                                                onClick={handleYes}
                                                className="w-full font-semibold text-lg"
                                            >
                                                {t('language_modal.yes_button')}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                onClick={handleNo}
                                                className="w-full font-semibold text-lg"
                                            >
                                                {t('language_modal.no_button')}
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="grid gap-3">
                                        {languages.map((lang) => (
                                            <Button
                                                key={lang.code}
                                                variant="outline"
                                                size="lg"
                                                onClick={() => handleLanguageSelect(lang.code)}
                                                className="w-full justify-between text-lg h-14 hover:border-primary hover:bg-primary/5"
                                            >
                                                <span className="font-medium">{lang.nativeName}</span>
                                                <span className="text-muted-foreground text-sm">{lang.name}</span>
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LanguagePreferenceModal;
