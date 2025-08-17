import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PRReviewModal from './PRReviewModal';

const Card = () => {
  const [result, setResult] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [authorFilter, setAuthorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [repoUrl, setRepoUrl] = useState('');
  const [owner, setOwner] = useState('calcom');
  const [repo, setRepo] = useState('cal.com');
  const perPage = 6;
  const [commits, setCommits] = useState({});
  const [openPRId, setOpenPRId] = useState(null);
  const [copyStatus, setCopyStatus] = useState(null);

  const fetchCommits = async (prId, commitsUrl) => {
    try {
      const response = await axios.get(commitsUrl);
      setCommits((prev) => ({ ...prev, [prId]: response.data }));
      setOpenPRId(prId);
    } catch (error) {
      console.error('Failed to fetch commits:', error);
    }
  };

  const handleCopySHA = (sha) => {
    navigator.clipboard.writeText(sha).then(() => {
      setCopyStatus(sha);
      setTimeout(() => setCopyStatus(null), 2000);
    });
  };

  const fetchPRs = async (o, r) => {
    if (!o || !r) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:7777/api/pull-requests?owner=${o}&repo=${r}`
      );
      setResult(response.data);
    } catch (error) {
      console.error('Error fetching pull requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRepoFetch = () => {
    try {
      const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (match) {
        const extractedOwner = match[1];
        const extractedRepo = match[2].replace(/\.git$/, '');
        setOwner(extractedOwner);
        setRepo(extractedRepo);
        fetchPRs(extractedOwner, extractedRepo);
      } else {
        alert('Invalid GitHub repo URL');
      }
    } catch (e) {
      console.error('Failed to parse repo URL:', e);
    }
  };

  useEffect(() => {
    fetchPRs(owner, repo);
  }, []);

  useEffect(() => {
    let filteredPRs = result.filter((pr) => pr.state !== 'closed');

    if (authorFilter !== 'all') {
      filteredPRs = filteredPRs.filter((pr) => pr.user.login === authorFilter);
    }

    if (statusFilter !== 'all') {
      filteredPRs = filteredPRs.filter((pr) =>
        statusFilter === 'draft' ? pr.draft : pr.state === statusFilter
      );
    }

    if (searchTerm.trim() !== '') {
      filteredPRs = filteredPRs.filter((pr) =>
        pr.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFiltered(filteredPRs);
    setCurrentPage(1);
  }, [result, authorFilter, statusFilter, searchTerm]);

  const indexOfLastPR = currentPage * perPage;
  const indexOfFirstPR = indexOfLastPR - perPage;
  const currentPRs = filtered.slice(indexOfFirstPR, indexOfLastPR);
  const totalPages = Math.ceil(filtered.length / perPage);

  const uniqueAuthors = [...new Set(result.map((pr) => pr.user.login))];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-white mb-4">Pull Requests</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Paste GitHub repo URL..."
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="px-3 py-2 rounded bg-zinc-900 text-white border border-zinc-600 w-80"
        />
        <button
          onClick={handleRepoFetch}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Fetch PRs
        </button>

        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 rounded bg-zinc-900 text-white border border-zinc-600 w-64"
        />

        <select
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
          className="px-3 py-2 rounded bg-zinc-900 text-white border border-zinc-600"
        >
          <option value="all">All Authors</option>
          {uniqueAuthors.map((author) => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded bg-zinc-900 text-white border border-zinc-600"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : currentPRs.length > 0 ? (
        <div className="flex flex-wrap gap-4 justify-start">
          {currentPRs.map((pr) => {
            const author = pr.user;
            const baseBranch = pr.base?.ref;
            const headBranch = pr.head?.ref;
            const prCommits = commits[pr.id] || [];
            const recentCommitLimit = 3;

            return (
              <div
                key={pr.id}
                className="bg-zinc-800 border border-zinc-700 shadow-md rounded-xl p-5 w-[350px] text-white hover:scale-[1.02] hover:shadow-blue-600 transition-all duration-300 ease-in-out"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={author?.avatar_url}
                    alt={author?.login}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{author?.login}</h2>
                    <p className="text-sm text-gray-400">#{pr.number}</p>
                  </div>
                  <div className="ml-auto">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        pr.draft
                          ? 'bg-yellow-600'
                          : pr.state === 'open'
                          ? 'bg-green-600'
                          : 'bg-red-600'
                      }`}
                    >
                      {pr.draft ? 'Draft' : pr.state}
                    </span>
                  </div>
                </div>

                <h3 className="text-md font-medium mb-2">{pr.title}</h3>

                <p className="text-sm text-gray-300 mb-2">
                  <span className="font-semibold">From:</span> {headBranch} ➝{' '}
                  <span className="font-semibold">To:</span> {baseBranch}
                </p>

                <p className="text-sm text-gray-400 mb-1">
                  Created: {new Date(pr.created_at).toLocaleString()}
                </p>
                <p className="text-sm text-gray-400 mb-2">
                  Updated: {new Date(pr.updated_at).toLocaleString()}
                </p>

                <a
                  href={pr.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:underline"
                >
                  View on GitHub
                </a>

                <div className="mt-4">
                  <button
                    className="text-sm text-blue-300 hover:underline"
                    onClick={() =>
                      prCommits.length > 0
                        ? setOpenPRId(null)
                        : fetchCommits(pr.id, pr.commits_url)
                    }
                  >
                    {prCommits.length > 0 && openPRId === pr.id
                      ? 'Hide Commits'
                      : 'Show Commits'}
                  </button>

                  {openPRId === pr.id && prCommits.length > 0 && (
                    <ul className="mt-2 bg-zinc-900 rounded-lg p-3 text-xs space-y-2 max-h-48 overflow-y-auto">
                      {prCommits.slice(0, recentCommitLimit).map((commit) => (
                        <li
                          key={commit.sha}
                          className="flex justify-between items-start border-b border-zinc-700 pb-2"
                        >
                          <div className="flex flex-col">
                            <a
                              href={`https://github.com/${owner}/${repo}/commit/${commit.sha}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 truncate max-w-[180px] hover:underline"
                            >
                              {commit.sha.substring(0, 7)}
                            </a>
                            <span className="text-gray-300">
                              {commit.commit.message.split('\n')[0]}
                            </span>
                            <span className="text-gray-500 text-[10px]">
                              {commit.commit.author.name} •{' '}
                              {new Date(
                                commit.commit.author.date
                              ).toLocaleString()}
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopySHA(commit.sha)}
                            className="ml-2 text-gray-400 hover:text-white"
                            title="Copy SHA"
                          >
                            📋
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {copyStatus && (
                    <div className="text-green-400 text-xs mt-2 animate-pulse">
                      SHA copied to clipboard!
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <PRReviewModal prData={pr} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-white">No matching PRs found.</p>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded ${
                currentPage === num
                  ? 'bg-blue-500 text-white'
                  : 'bg-zinc-700 text-gray-300'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Card;
