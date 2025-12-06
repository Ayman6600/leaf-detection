import React, { useState, useCallback, memo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Home,
  Info,
  Package,
  Pill,
  HelpCircle,
  MessageSquare,
  Menu,
  X,
  History,
  Sprout,
  Globe
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";



const Navbar = memo(({ onOpenLanguageModal }) => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: t('nav.home'), href: "/", icon: Home },
    { name: t('nav.about'), href: "/about", icon: Info },
    { name: t('nav.agronomy'), href: "/dosage", icon: Sprout },
    { name: t('nav.history'), href: "/history", icon: History },
    { name: t('nav.faq'), href: "/faq", icon: HelpCircle },
    { name: t('nav.contact'), href: "/support", icon: MessageSquare },
  ];

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <>
      {/* Enhanced Navbar - Botanic Theme */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#0A1F1C]/90 backdrop-blur-md border-b border-white/10"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-24">

            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm md:text-base font-serif font-bold text-white tracking-wide max-w-[200px] md:max-w-md leading-tight">
                  {t('app.title')}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors duration-200 relative group",
                      isActive
                        ? "text-[#E5C558]"
                        : "text-white/90 hover:text-[#E5C558]"
                    )}
                  >
                    {item.name}
                    <span className={cn(
                      "absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E5C558] transition-all duration-300 group-hover:w-full",
                      isActive ? "w-full" : ""
                    )} />
                  </Link>
                );
              })}
            </div>

            {/* Language Button */}
            <button
              onClick={onOpenLanguageModal}
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white ml-4"
              aria-label="Change Language"
            >
              <Globe className="h-4 w-4 text-[#E5C558]" />
              <span className="text-sm font-medium">Language</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-80 z-50 lg:hidden bg-[#0A1F1C] border-l border-white/10 shadow-2xl"
            >
              <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-6 w-6 text-[#E5C558]" />
                    <span className="text-sm font-serif font-bold text-white leading-tight max-w-[200px]">{t('app.title')}</span>
                  </div>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Links */}
                <nav className="space-y-4 flex-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={closeMobileMenu}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-medium transition-all",
                          isActive
                            ? "bg-[#E5C558]/10 text-[#E5C558]"
                            : "text-white/80 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
