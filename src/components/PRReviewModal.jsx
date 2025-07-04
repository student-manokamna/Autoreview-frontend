import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, ChevronDown, ChevronUp, Bot } from 'lucide-react';

const PRReviewModal = ({ prData }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setExpanded(true);
    try {
      const response = await axios.post('http://localhost:7777/api/analyze', {
        prData
      });
      setAnalysis(response.data.result);
    } catch (error) {
      console.error('Error fetching AI analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      {/* Analyze Button */}
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

      {/* Toggle Collapse */}
      {analysis && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-blue-400 text-sm hover:underline transition"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" /> Hide Analysis
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" /> Show Analysis
            </>
          )}
        </button>
      )}

      {/* Chat Bubble AI Output */}
      {analysis && expanded && (
        <div className="bg-zinc-900 border border-zinc-700 p-4 rounded-2xl max-h-72 overflow-y-auto space-y-2 transition-all text-sm">
          {analysis.split('\n').map((line, idx) => (
            <div
              key={idx}
              className="bg-purple-700 text-white px-4 py-2 rounded-2xl max-w-full w-fit"
            >
              {line.trim()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PRReviewModal;
