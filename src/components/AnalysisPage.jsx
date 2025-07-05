// src/pages/AnalysisPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Bot, Loader2 } from 'lucide-react';

const AnalysisPage = () => {
  const { prId } = useParams();
  const [summary, setSummary] = useState('');
  const [commitSummary, setCommitSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingCommits, setLoadingCommits] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`http://localhost:7777/api/summary/${prId}`);
        setSummary(res.data.summary);
      } catch (err) {
        console.error('Error fetching PR summary:', err);
      } finally {
        setLoadingSummary(false);
      }
    };

    fetchSummary();
  }, [prId]);

  const handleAnalyzeCommits = async () => {
    setLoadingCommits(true);
    try {
      const res = await axios.get(`http://localhost:7777/api/analyze-commits/${prId}`);
      setCommitSummary(res.data.commitSummary);
    } catch (err) {
      console.error('Error analyzing commits:', err);
    } finally {
      setLoadingCommits(false);
    }
  };

  return (
    <div className="p-6 text-white max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">AI Analysis for PR #{prId}</h2>

      {/* Main PR Summary */}
      <div className="bg-zinc-800 p-4 rounded-md whitespace-pre-wrap">
        {loadingSummary ? 'Loading summary...' : summary}
      </div>

      {/* Analyze All Commits Button */}
      <div>
        <button
          onClick={handleAnalyzeCommits}
          disabled={loadingCommits}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-white flex items-center gap-2 disabled:opacity-60"
        >
          {loadingCommits ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing Commits...
            </>
          ) : (
            <>
              <Bot className="w-4 h-4" />
              Analyze All Commits
            </>
          )}
        </button>
      </div>

      {/* Commit Summary Output */}
      {commitSummary && (
        <div className="bg-zinc-900 p-4 rounded-md whitespace-pre-wrap border border-zinc-700">
          <h3 className="text-lg font-semibold mb-2">Commit Summary:</h3>
          {commitSummary}
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;
