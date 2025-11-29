import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../components/ui/toast';
import { BackgroundGradient } from '../components/ui/background-gradient';
import { askAgricultureAssistant } from '../services/api';

const AssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'bot',
      text: "Hello! I'm your Agriculture Assistant. I can help you with questions about plant diseases, treatments, farming practices, and more. How can I assist you today?",
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
    setInputValue('');
    setLoading(true);

    try {
      const response = await askAgricultureAssistant(inputValue.trim());
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: response.answer || response.response || 'I apologize, but I could not generate a response. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Assistant error:', error);
      toast.error('Failed to get response from assistant. Please try again.');
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: 'I apologize, but I encountered an error. Please try again in a moment.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "How do I prevent powdery mildew?",
    "What are the best practices for plant care?",
    "How often should I water my plants?",
    "What causes leaf spots on plants?",
    "How to treat aphids naturally?",
  ];

  const handleSuggestionClick = (question) => {
    setInputValue(question);
  };

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 rounded-3xl bg-gradient-to-br from-[#1B5E20] to-[#66BB6A] shadow-lg">
              <Bot className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-black mb-4 font-display">
            Agriculture Assistant
          </h1>
          <p className="text-lg text-gray-600">
            Ask me anything about plant diseases, treatments, and farming practices
          </p>
        </motion.div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <p className="text-sm font-semibold text-gray-600 mb-3">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(question)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-black transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Chat Container */}
        <BackgroundGradient className="rounded-3xl">
          <Card className="border-0">
            <CardContent className="p-0">
              {/* Messages Area */}
              <div className="h-[600px] overflow-y-auto p-6 space-y-4">
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
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#1B5E20] to-[#66BB6A] flex items-center justify-center">
                          <Bot className="h-6 w-6 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                          message.type === 'user'
                            ? 'bg-[#1B5E20] text-white'
                            : 'bg-gray-100 text-black'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.text}
                        </p>
                        <span className="text-xs opacity-70 mt-2 block">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {message.type === 'user' && (
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-600" />
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
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#1B5E20] to-[#66BB6A] flex items-center justify-center">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <Loader2 className="h-5 w-5 animate-spin text-[#1B5E20]" />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSend} className="flex gap-3">
                  <Input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask a question about plant care, diseases, or farming..."
                    className="flex-1 h-12"
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    disabled={!inputValue.trim() || loading}
                    className="bg-[#1B5E20] hover:bg-[#66BB6A] text-white h-12 px-6"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </BackgroundGradient>
      </div>
    </div>
  );
};

export default AssistantPage;

