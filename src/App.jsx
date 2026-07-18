import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Components
import Dashboard from './components/Dashboard';
import TopResearchersComponent from './components/TopResearchersComponent';
import TrendsAnalysisComponent from './components/TrendsAnalysisComponent';
import ArticleImpactComponent from './components/ArticleImpactComponent';
import ResearcherMapComponent from './components/ResearcherMapComponent';

// Layouts
import ReactShell from './components/layouts/ReactShell';
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';

// Pages - Public
import LoginPage from './pages/LoginPage';
import InstitutionProfilePage from './pages/public/InstitutionProfilePage';
import ResearcherListPage from './pages/public/ResearcherListPage';
import DashboardPage from './pages/private/DashboardPage';
import SangiaCrawlerPage from './pages/public/SangiaCrawlerPage';
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
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/researchers" element={<ResearcherListPage />} />
              <Route path="/researcher/:orcid" element={<ResearcherProfilePage />} />
              <Route path="/institution/:id" element={<InstitutionProfilePage />} />
              <Route path="/journal/:issn" element={<JournalProfilePage />} />
              <Route path="/sangia-crawler" element={<SangiaCrawlerPage />} />

              {/* Tools Routes */}
              <Route path="/tools/pdf-compress" element={<PdfCompressPage />} />
              <Route path="/tools/image-resizer" element={<ImageResizerPage />} />

              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />

              {/* Private Routes */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={<AdminPage />} />

              {/* Feature Routes */}
              <Route path="/article-impact" element={<ArticleImpactComponent />} />
              <Route path="/researcher-map" element={<ResearcherMapComponent />} />
              <Route path="/trends" element={<TrendsAnalysisComponent />} />

              {/* Error Routes */}
              <Route path="/error" element={<ErrorPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;