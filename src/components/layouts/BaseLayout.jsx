import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * BaseLayout Component
 * Layout utama untuk halaman publik (transformasi dari base.twig)
 *
 * Gaya navbar, footer, dan warna dasar diselaraskan dengan desainInterface.html
 * (palet brand orange #ff5627, font Inter, navbar glassmorphism sticky,
 * dan footer gelap).
 */
const BaseLayout = ({ children, pageTitle = 'Sangia Scicola' }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinkClass = (path) =>
    `text-gray-500 font-medium px-4 py-2 rounded-md hover:text-gray-900 hover:bg-gray-100/50 transition-colors ${
      location.pathname === path ? 'text-brand hover:text-brand' : ''
    }`;

  return (
    <div className="h-full flex flex-col font-sans bg-white text-gray-900 min-h-screen">
      {/* Navbar */}
      <header
        className={`sticky top-0 z-50 w-full h-20 px-6 md:px-10 flex items-center justify-between transition-all duration-300 border-b ${
          scrolled
            ? 'bg-white/85 backdrop-blur-md shadow-sm border-gray-200'
            : 'bg-white/85 backdrop-blur-md border-transparent'
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 text-2xl font-extrabold tracking-tight text-gray-900">
          CODE<span className="text-brand">Canau</span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex gap-2">
          <Link to="/" className={navLinkClass('/')}>
            Beranda
          </Link>
          <Link to="/journal/0000-0000" className={navLinkClass('/journal/0000-0000')}>
            Jurnal
          </Link>
          <Link to="/tools/image-resizer" className={navLinkClass('/tools/image-resizer')}>
            Tools
          </Link>
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3 text-sm">
          {/* TODO: Replace with actual auth context */}
          {false ? (
            <>
              <Link to="/dashboard" className="text-gray-500 hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
              <a
                href="/auth/logout"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold text-xs border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Keluar
              </a>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-semibold text-sm bg-brand text-white hover:bg-brand-hover transition-all duration-300 shadow-lg shadow-brand/20"
            >
              Masuk
            </Link>
          )}
        </div>
      </header>

      {/* Konten Utama */}
      <main className="flex-1 w-full">{children}</main>

      {/* Footer */}
      <footer className="bg-[#05070a] text-gray-400 py-16 px-6 border-t border-white/5 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-start justify-between gap-10">
          <div>
            <Link to="/" className="text-2xl font-extrabold text-white mb-3 inline-block">
              Sangia<span className="text-brand">Scicola</span>
            </Link>
            <p className="max-w-sm leading-relaxed text-sm">
              Platform analisis dampak penelitian Indonesia berbasis AI, dikembangkan oleh Sangia.
            </p>
          </div>

          <div>
            <h5 className="text-white font-bold tracking-wider text-sm uppercase mb-4">Tools</h5>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/tools/image-resizer" className="hover:text-brand transition-colors">
                  Image Resizer
                </Link>
              </li>
              <li>
                <Link to="/tools/pdf-compress" className="hover:text-brand transition-colors">
                  PDF Compressor
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} Sangia Scieco. Didukung oleh{' '}
            <a href="https://sangia.org" className="text-brand hover:underline">
              Sangia
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BaseLayout;