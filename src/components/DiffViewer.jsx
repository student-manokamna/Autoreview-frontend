// components/DiffViewer.jsx
import React, { useEffect } from 'react';
import { Diff2Html } from 'diff2html';

const DiffViewer = ({ diffText }) => {
  useEffect(() => {
    if (diffText) {
      const html = Diff2Html.getPrettyHtml(diffText, {
        inputFormat: 'diff',
        showFiles: true,
        matching: 'lines',
        outputFormat: 'line-by-line',
      });

      document.getElementById('diff-container').innerHTML = html;
    }
  }, [diffText]);

  return (
    <div
      id="diff-container"
      className="text-sm border border-gray-700 rounded-lg bg-white text-black overflow-auto max-h-[600px]"
    />
  );
};

export default DiffViewer;
