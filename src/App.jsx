// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Card from './components/Card';
import Header from './components/Header';
import AnalysisPage from './components/AnalysisPage';

function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-900 min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Card />} />
          <Route path="/analyze/:prId" element={<AnalysisPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
