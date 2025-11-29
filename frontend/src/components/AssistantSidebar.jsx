import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/toast';
import { askAgricultureAssistant } from '../services/api';

const AssistantSidebar = ({ context = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'bot',
      text: context 
        ? `Hello! I'm your Agriculture Assistant. I can see you've detected "${context.predicted_label}" with ${(context.confidence * 100).toFixed(1)}% confidence. How can I help you with treatment or care questions?`
        : "Hello! I'm your Agriculture Assistant. I can help you with questions about plant diseases, treatments, farming practices, and more. How can I assist you today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Reset messages when context changes
    if (context) {
      setMessages([
        {
          id: '1',
          type: 'bot',
          text: `Hello! I'm your Agriculture Assistant. I can see you've detected "${context.predicted_label}" with ${(context.confidence * 100).toFixed(1)}% confidence. How can I help you with treatment or care questions?`,
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [context?.predicted_label, context?.confidence]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: inputValue.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const question = inputValue.trim();
    setInputValue('');
    setLoading(true);

    try {
      const response = await askAgricultureAssistant(question, context);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: response.answer || response.response || 'I apologize, but I could not generate a response. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Assistant error:', error);
      
      // Extract error message from response if available
      let errorMessage = 'I apologize, but I encountered an error. Please try again in a moment.';
      
      if (error.message) {
        const errorLower = error.message.toLowerCase();
        if (errorLower.includes('quota') || errorLower.includes('rate limit') || errorLower.includes('429')) {
          errorMessage = 'The AI assistant is currently experiencing high demand. Please wait a moment and try again. If this persists, the API quota may need to be increased.';
          toast.error('AI assistant quota exceeded. Please try again in a few moments.');
        } else if (errorLower.includes('api key') || errorLower.includes('unauthorized') || errorLower.includes('401')) {
          errorMessage = 'There is an issue with the AI assistant configuration. Please contact support.';
          toast.error('AI assistant configuration error.');
        } else {
          toast.error('Failed to get response from assistant. Please try again.');
        }
      } else {
        toast.error('Failed to get response from assistant. Please try again.');
      }
      
      const errorBotMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: errorMessage,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = context
    ? [
        `Tell me more about ${context.predicted_label}`,
        "What are the best treatment options?",
        "How can I prevent this disease?",
        "What are the symptoms I should watch for?",
      ]
    : [
        "How do I prevent powdery mildew?",
        "What are the best practices for plant care?",
        "How often should I water my plants?",
        "What causes leaf spots on plants?",
      ];

  const handleSuggestionClick = async (question) => {
    if (loading) return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: question,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await askAgricultureAssistant(question, context);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: response.answer || response.response || 'I apologize, but I could not generate a response. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Assistant error:', error);
      
      // Extract error message from response if available
      let errorMessage = 'I apologize, but I encountered an error. Please try again in a moment.';
      
      if (error.message) {
        const errorLower = error.message.toLowerCase();
        if (errorLower.includes('quota') || errorLower.includes('rate limit') || errorLower.includes('429')) {
          errorMessage = 'The AI assistant is currently experiencing high demand. Please wait a moment and try again. If this persists, the API quota may need to be increased.';
          toast.error('AI assistant quota exceeded. Please try again in a few moments.');
        } else if (errorLower.includes('api key') || errorLower.includes('unauthorized') || errorLower.includes('401')) {
          errorMessage = 'There is an issue with the AI assistant configuration. Please contact support.';
          toast.error('AI assistant configuration error.');
        } else {
          toast.error('Failed to get response from assistant. Please try again.');
        }
      } else {
        toast.error('Failed to get response from assistant. Please try again.');
      }
      
      const errorBotMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: errorMessage,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button - Always visible */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setIsOpen(true)}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-40 bg-primary text-primary-foreground p-4 rounded-l-xl shadow-lg hover:bg-primary/90 transition-colors"
          aria-label="Open AI Assistant"
        >
          <Bot className="h-6 w-6" />
        </motion.button>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-[400px] z-50 bg-background border-l border-border shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">AI Assistant</h2>
                  <p className="text-xs text-muted-foreground">Powered by Gemini 2.5 Flash</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
                aria-label="Close assistant"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex gap-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type === 'bot' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {message.type === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 border-t border-border pt-2">
                <p className="text-xs font-medium text-muted-foreground mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(question)}
                      className="px-3 py-1.5 bg-muted hover:bg-accent rounded-full text-xs text-foreground transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-border p-4 bg-card">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 h-10 text-sm"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  disabled={!inputValue.trim() || loading}
                  size="icon"
                  className="h-10 w-10"
                  aria-label="Send message"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AssistantSidebar;

