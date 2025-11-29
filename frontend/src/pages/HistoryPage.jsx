import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  Calendar,
  TrendingUp,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useHistory } from '../contexts/HistoryContext';
import { useToast } from '../components/ui/toast';
import { BackgroundGradient } from '../components/ui/background-gradient';

const HistoryPage = () => {
  const { history, removeFromHistory, clearHistory } = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDisease, setFilterDisease] = useState('all');
  const navigate = useNavigate();
  const toast = useToast();

  const diseases = useMemo(() => {
    const unique = [...new Set(history.map(item => item.predictedLabel))];
    return unique;
  }, [history]);

  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.predictedLabel.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterDisease === 'all' || item.predictedLabel === filterDisease;
      return matchesSearch && matchesFilter;
    });
  }, [history, searchQuery, filterDisease]);

  const handleViewResult = (item) => {
    const resultData = {
      predicted_label: item.predictedLabel,
      confidence: item.confidence,
      results: item.results
    };
    localStorage.setItem('predictionResult', JSON.stringify(resultData));
    navigate('/result');
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    removeFromHistory(id);
    toast.success('Analysis removed from history');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      clearHistory();
      toast.success('History cleared');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between flex-wrap gap-4"
          >
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-black mb-4 font-display">
                Analysis History
              </h1>
              <p className="text-lg text-gray-600">
                View and manage your past plant disease analyses
              </p>
            </div>
            {history.length > 0 && (
              <Button
                onClick={handleClearAll}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                aria-label="Clear all analysis history"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </motion.div>
        </div>

        {/* Search and Filter */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <BackgroundGradient className="rounded-3xl">
              <Card className="border-0">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search by disease name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12"
                        aria-label="Search analysis history by disease name"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          aria-label="Clear search"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        value={filterDisease}
                        onChange={(e) => setFilterDisease(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-md border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                        aria-label="Filter by disease type"
                      >
                        <option value="all">All Diseases</option>
                        {diseases.map(disease => (
                          <option key={disease} value={disease}>{disease}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </BackgroundGradient>
          </motion.div>
        )}

        {/* History List */}
        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <div className="mb-6 inline-flex p-6 bg-gray-100 rounded-full">
                <Clock className="h-16 w-16 text-gray-400" />
              </div>
              <h2 className="text-3xl font-bold text-black mb-4">No History Yet</h2>
              <p className="text-gray-600 mb-8">
                Your plant disease analysis history will appear here once you start analyzing images.
              </p>
              <Button
                onClick={() => navigate('/')}
                size="lg"
                className="bg-[#1B5E20] hover:bg-[#66BB6A] text-white"
                aria-label="Go to home page to start analyzing a plant leaf"
              >
                Start Analyzing
              </Button>
            </div>
          </motion.div>
        ) : filteredHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-lg text-gray-600">No results found matching your search.</p>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredHistory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <BackgroundGradient className="rounded-3xl h-full">
                  <Card 
                    className="border-0 h-full cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleViewResult(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleViewResult(item);
                      }
                    }}
                    aria-label={`View analysis result for ${item.predictedLabel} with ${item.confidence}% confidence`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2 text-black">
                            {item.predictedLabel}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(item.timestamp)}</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-5 w-5 text-red-500" />
                        </button>
                      </div>
                      {item.imageUrl && (
                        <div className="mb-4 rounded-lg overflow-hidden border-2 border-gray-200">
                          <img
                            src={item.imageUrl}
                            alt="Plant leaf"
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-600">Confidence</span>
                          <Badge className="bg-[#1B5E20] text-white font-bold">
                            {item.confidence}%
                          </Badge>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={item.confidence} aria-valuemin="0" aria-valuemax="100">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.confidence}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-[#1B5E20] to-[#66BB6A]"
                          />
                        </div>
                        <Button
                          className="w-full bg-[#1B5E20] hover:bg-[#66BB6A] text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewResult(item);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </BackgroundGradient>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <BackgroundGradient className="rounded-3xl">
              <Card className="border-0">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-4xl font-black text-black mb-2">
                        {history.length}
                      </div>
                      <div className="text-sm text-gray-600">Total Analyses</div>
                    </div>
                    <div>
                      <div className="text-4xl font-black text-black mb-2">
                        {diseases.length}
                      </div>
                      <div className="text-sm text-gray-600">Diseases Detected</div>
                    </div>
                    <div>
                      <div className="text-4xl font-black text-black mb-2">
                        {history.length > 0 
                          ? Math.round(history.reduce((acc, item) => acc + item.confidence, 0) / history.length)
                          : 0}%
                      </div>
                      <div className="text-sm text-gray-600">Avg Confidence</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </BackgroundGradient>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;

