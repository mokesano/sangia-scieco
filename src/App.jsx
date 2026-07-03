import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';

import WizdamDashboard  from './components/WizdamDashboard';
import TopResearchersComponent   from './components/TopResearchersComponent';
import TrendsAnalysisComponent   from './components/TrendsAnalysisComponent';
import ArticleImpactComponent    from './components/ArticleImpactComponent';
import ResearcherMapComponent    from './components/ResearcherMapComponent';
import LoginPage                 from './pages/LoginPage';
import ResearcherListPage        from './pages/ResearcherListPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public pages dengan Layout */}
          <Route path="/" element={<Layout><ResearcherListPage /></Layout>} />
          
          {/* Dashboard dan fitur lainnya */}
          <Route path="/dashboard" element={<Layout><WizdamDashboard /></Layout>} />
          <Route path="/article-impact" element={<Layout><ArticleImpactComponent /></Layout>} />
          <Route path="/researchers" element={<Layout><TopResearchersComponent /></Layout>} />
          <Route path="/researcher-map" element={<Layout><ResearcherMapComponent /></Layout>} />
          <Route path="/trends" element={<Layout><TrendsAnalysisComponent /></Layout>} />
          
          {/* Login page tanpa layout standar */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Redirect semua route tidak dikenal ke home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
