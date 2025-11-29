import React, { useState, useCallback, memo } from "react";
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
  History
} from "lucide-react";
import { cn } from "../lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: Info },
  { name: "Products", href: "/products", icon: Package },
  { name: "Dosage", href: "/dosage", icon: Pill },
  { name: "History", href: "/history", icon: History },
  { name: "Support", href: "/support", icon: MessageSquare },
  { name: "FAQ", href: "/faq", icon: HelpCircle },
];

const Navbar = memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);
  
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <>
      {/* Enhanced Navbar with Glass Morphism */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-md border-b border-gray-200"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-3 group hover:opacity-90 transition-opacity">
                <div className="p-2.5 rounded-2xl bg-[#1B5E20]/10 shadow-sm group-hover:scale-110 transition-transform">
                  <Leaf className="h-7 w-7 text-[#1B5E20]" />
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900 font-display leading-none">
                    Leaf AI
                  </div>
                  <div className="text-xs text-gray-600 font-semibold font-body leading-none mt-0.5">
                    Plant Health Expert
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group",
                      isActive
                        ? "text-[#1B5E20] bg-[#C8E6C9]/30"
                        : "text-gray-700 hover:text-[#1B5E20] hover:bg-[#C8E6C9]/20 hover:scale-105"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-[#C8E6C9]/30 rounded-xl shadow-sm"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2 transition-all">
                      <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
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
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-80 z-50 lg:hidden bg-white backdrop-blur-xl shadow-2xl border-l border-gray-200"
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#1B5E20]/10 backdrop-blur-sm">
                      <Leaf className="h-6 w-6 text-[#1B5E20]" />
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-xl font-black text-gray-900 font-display">Leaf AI</h2>
                      <p className="text-xs text-gray-600 font-semibold font-body">Menu</p>
                    </div>
                  </div>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 rounded-xl hover:bg-gray-100"
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6 text-gray-700" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2 mb-8">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={closeMobileMenu}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-bold transition-all",
                          isActive
                            ? "bg-[#C8E6C9]/30 text-[#1B5E20] shadow-sm"
                            : "text-gray-700 hover:text-[#1B5E20] hover:bg-[#C8E6C9]/20"
                        )}
                      >
                        <Icon className="h-5 w-5" />
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
