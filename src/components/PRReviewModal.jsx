import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PRReviewModal = ({ prData }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:7777/api/analyze', { prData });
      navigate(`/analyze/${prData.id}`);
    } catch (error) {
      console.error('Error analyzing PR:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 transition px-4 py-2 text-sm font-medium text-white rounded-xl flex items-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-4 h-4" />
            Analyzing...
          </>
        ) : (
          <>
            <Bot className="w-4 h-4" />
            Analyze PR with AI
          </>
        )}
      </button>
    </div>
  );
};

export default PRReviewModal;
