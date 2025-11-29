import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

const ToastContext = React.createContext();

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

const Toast = ({ toast, onRemove }) => {
  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  const Icon = icons[toast.type] || Info;

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'min-w-[320px] max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-start gap-3 border border-gray-200 dark:border-gray-700'
      )}
    >
      <div className={cn('p-2 rounded-full', colors[toast.type], 'text-white')}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        {toast.title && (
          <h4 className="font-bold text-gray-900 dark:text-white mb-1">
            {toast.title}
          </h4>
        )}
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
    </motion.div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (toast) => {
    const id = Date.now().toString();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast,
    };
    setToasts(prev => [...prev, newToast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const toastMethods = {
    success: (message, options = {}) => 
      showToast({ ...options, type: 'success', message }),
    error: (message, options = {}) => 
      showToast({ ...options, type: 'error', message, duration: 7000 }),
    info: (message, options = {}) => 
      showToast({ ...options, type: 'info', message }),
    warning: (message, options = {}) => 
      showToast({ ...options, type: 'warning', message }),
  };

  return (
    <ToastContext.Provider value={toastMethods}>
      {children}
      <AnimatePresence>
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
          {toasts.map(toast => (
            <Toast key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </div>
      </AnimatePresence>
    </ToastContext.Provider>
  );
};

