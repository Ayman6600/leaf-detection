import React, { createContext, useContext, useState, useEffect } from 'react';

const HistoryContext = createContext();

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('analysisHistory');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  });

  // Save to localStorage whenever history changes
  useEffect(() => {
    try {
      localStorage.setItem('analysisHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }, [history]);

  const addToHistory = (result, imageUrl) => {
    const newEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      predictedLabel: result.predicted_label,
      confidence: result.confidence,
      results: result.results,
      imageUrl: imageUrl, // Store preview URL
    };
    
    setHistory(prev => {
      // Keep only last 50 entries to prevent localStorage overflow
      const updated = [newEntry, ...prev].slice(0, 50);
      return updated;
    });
    
    return newEntry.id;
  };

  const removeFromHistory = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const getHistoryItem = (id) => {
    return history.find(item => item.id === id);
  };

  return (
    <HistoryContext.Provider 
      value={{ 
        history, 
        addToHistory, 
        removeFromHistory, 
        clearHistory,
        getHistoryItem 
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

