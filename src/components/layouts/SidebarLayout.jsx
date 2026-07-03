import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * SidebarLayout Component
 * Layout dengan sidebar untuk halaman private/dashboard (transformasi dari sidebar.twig)
 */
const SidebarLayout = ({ children, pageHeading = '', activeMenu = '' }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="sidebar w-64 bg-indigo-900 text-white flex-shrink-0 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-indigo-800">
          <Link to="/" className="flex items-center gap-2 font-bold text-base">
            <svg className="w-6 h-6 text-indigo-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            Sangia Scieco
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1 text-sm">
          <Link
            to="/dashboard"
            className={`sidebar-link flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              activeMenu === 'dashboard' || location.pathname === '/dashboard'
                ? 'bg-indigo-800 text-white'
                : 'text-indigo-200 hover:text-white hover:bg-indigo-800'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
            </svg>
            Dashboard Saya
          </Link>

          {/* Admin Section - TODO: Replace with actual isAdmin check from context */}
          {false && (
            <>
              <div className="pt-4 pb-1 px-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                Admin
              </div>
              <Link
                to="/admin"
                className={`sidebar-link flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  activeMenu === 'admin' || location.pathname === '/admin'
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-200 hover:text-white hover:bg-indigo-800'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Analytics Platform
              </Link>
            </>
          )}

          <div className="pt-4 pb-1 px-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Tools
          </div>
          <Link
            to="/tools/image-resizer"
            className={`sidebar-link flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              activeMenu === 'image-resizer' || location.pathname === '/tools/image-resizer'
                ? 'bg-indigo-800 text-white'
                : 'text-indigo-200 hover:text-white hover:bg-indigo-800'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Image Resizer
          </Link>
          <Link
            to="/tools/pdf-compress"
            className={`sidebar-link flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              activeMenu === 'pdf-compress' || location.pathname === '/tools/pdf-compress'
                ? 'bg-indigo-800 text-white'
                : 'text-indigo-200 hover:text-white hover:bg-indigo-800'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            PDF Compressor
          </Link>
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-indigo-800">
          <a
            href="/auth/logout"
            className="sidebar-link flex items-center gap-2 px-3 py-2 rounded-lg text-indigo-300 hover:text-white hover:bg-indigo-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Keluar
          </a>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-800">{pageHeading}</h1>
          <div className="text-sm text-slate-500">Sangia Scieco</div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default SidebarLayout;
