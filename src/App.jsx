import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Components
import WizdamDashboard from './components/WizdamDashboard';
import TopResearchersComponent from './components/TopResearchersComponent';
import TrendsAnalysisComponent from './components/TrendsAnalysisComponent';
import ArticleImpactComponent from './components/ArticleImpactComponent';
import ResearcherMapComponent from './components/ResearcherMapComponent';

// Layouts
import ReactShell from './components/layouts/ReactShell';
import BaseLayout from './components/layouts/BaseLayout';

// Pages - Public
import LoginPage from './pages/LoginPage';
import InstitutionProfilePage from './pages/public/InstitutionProfilePage';
import ResearcherListPage from './pages/public/ResearcherListPage';
import DashboardPage from './pages/private/DashboardPage';
import WizdamCrawlerPage from './pages/public/WizdamCrawlerPage';
import JournalProfilePage from './pages/public/JournalProfilePage';
import ResearcherProfilePage from './pages/public/ResearcherProfilePage';

// Pages - Private
import AdminPage from './pages/private/AdminPage';

// Pages - Tools
import PdfCompressPage from './pages/tools/PdfCompressPage';
import ImageResizerPage from './pages/tools/ImageResizerPage';

// Pages - Error
import ErrorPage from './pages/error/ErrorPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with BaseLayout */}
          <Route path="/" element={<BaseLayout><WizdamDashboard /></BaseLayout>} />
          <Route path="/researchers" element={<BaseLayout><ResearcherListPage /></BaseLayout>} />
          <Route path="/researcher/:orcid" element={<BaseLayout><ResearcherProfilePage /></BaseLayout>} />
          <Route path="/institution/:id" element={<BaseLayout><InstitutionProfilePage /></BaseLayout>} />
          <Route path="/journal/:issn" element={<BaseLayout><JournalProfilePage /></BaseLayout>} />
          <Route path="/wizdam-crawler" element={<BaseLayout><WizdamCrawlerPage /></BaseLayout>} />
          
          {/* Tools Routes with BaseLayout */}
          <Route path="/tools/pdf-compress" element={<BaseLayout><PdfCompressPage /></BaseLayout>} />
          <Route path="/tools/image-resizer" element={<BaseLayout><ImageResizerPage /></BaseLayout>} />
          
          {/* Auth Routes - without BaseLayout for cleaner auth pages */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Private Routes with BaseLayout */}
          <Route path="/dashboard" element={<BaseLayout><DashboardPage /></BaseLayout>} />
          <Route path="/admin" element={<BaseLayout><AdminPage /></BaseLayout>} />
          
          {/* Feature Routes with BaseLayout */}
          <Route path="/article-impact" element={<BaseLayout><ArticleImpactComponent /></BaseLayout>} />
          <Route path="/researcher-map" element={<BaseLayout><ResearcherMapComponent /></BaseLayout>} />
          <Route path="/trends" element={<BaseLayout><TrendsAnalysisComponent /></BaseLayout>} />
          
          {/* Error Routes with BaseLayout */}
          <Route path="/error" element={<BaseLayout><ErrorPage /></BaseLayout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;