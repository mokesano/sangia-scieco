import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar */}
      <header className="navbar sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-indigo-700">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            Wizdam <span className="text-slate-400 font-normal text-sm ml-1">Scola</span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/" className={`hover:text-indigo-600 transition-colors ${location.pathname === '/' ? 'text-indigo-600' : ''}`}>
              Beranda
            </Link>
            <Link to="/journal/0000-0000" className="hover:text-indigo-600 transition-colors">Jurnal</Link>
            <Link to="/tools/image-resizer" className="hover:text-indigo-600 transition-colors">Tools</Link>
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3 text-sm">
            <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 transition-colors">Dashboard</Link>
            <Link to="/auth/logout" className="btn btn-ghost text-xs">Keluar</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} Sangia Scieco. Didukung oleh <a href="https://sangia.org" className="text-indigo-400 hover:underline">Sangia</a>.</span>
          <nav className="flex gap-4">
            <Link to="/tools/image-resizer" className="hover:text-slate-600">Image Resizer</Link>
            <Link to="/tools/pdf-compress" className="hover:text-slate-600">PDF Compressor</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
