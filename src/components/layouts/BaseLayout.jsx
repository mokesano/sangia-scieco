import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * BaseLayout Component
 * Layout utama untuk SEMUA halaman (transformasi dari desainInterface.html)
 *
 * Gaya navbar, footer, dan warna dasar diselaraskan dengan desainInterface.html
 * (palet brand orange #ff5627, font Inter, navbar glassmorphism sticky,
 * dan footer gelap #05070a).
 */
const BaseLayout = ({ children, pageTitle = 'CODECanau' }) => {
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
      {/* Navbar - mengikuti desainInterface.html */}
      <header
        id="header"
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

        {/* Nav Links - mengikuti desainInterface.html */}
        <nav className="hidden md:flex gap-2">
          <Link to="/" className={navLinkClass('/')}>
            Home
          </Link>
          <Link to="/#solution" className={navLinkClass('/#solution')}>
            Solution
          </Link>
          <Link to="/#service" className={navLinkClass('/#service')}>
            Service
          </Link>
          <Link to="/#network" className={navLinkClass('/#network')}>
            Network
          </Link>
          <Link to="/#sdgs-api" className={navLinkClass('/#sdgs-api')}>
            SDGs API
          </Link>
          <Link to="/#scopus-tracker" className={navLinkClass('/#scopus-tracker')}>
            Scopus Tracker
          </Link>
          <Link to="/#features" className={navLinkClass('/#features')}>
            Features
          </Link>
        </nav>

        {/* Documentation Button */}
        <Link
          to="/docs"
          className="hidden md:inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-semibold text-sm bg-gray-900 text-white hover:bg-brand-muted transition-all duration-300"
        >
          Documentation
        </Link>
      </header>

      {/* Konten Utama */}
      <main className="flex-1 w-full">{children}</main>

      {/* Footer - mengikuti desainInterface.html */}
      <footer className="bg-[#05070a] text-gray-400 py-20 px-6 border-t border-white/5 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="text-2xl font-extrabold text-white mb-4 inline-block">
              CODE<span className="text-brand">Canau</span>
            </Link>
            <p className="max-w-sm leading-relaxed">
              Sistem manajemen penerbitan modern dengan infrastruktur analitik cerdas berskala global.
            </p>
          </div>
          
          <div>
            <h5 className="text-white font-bold tracking-wider text-sm uppercase mb-6">Ecosystem</h5>
            <ul className="space-y-4">
              <li><Link to="#" className="hover:text-brand transition-colors">Lumera</Link></li>
              <li><Link to="#" className="hover:text-brand transition-colors">Frontedge</Link></li>
              <li><Link to="#" className="hover:text-brand transition-colors">Sciecola</Link></li>
              <li><Link to="#" className="hover:text-brand transition-colors">Sciecola Debug Toolbar</Link></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-white font-bold tracking-wider text-sm uppercase mb-6">Core Engines</h5>
            <ul className="space-y-4">
              <li><Link to="#" className="hover:text-brand transition-colors">SDGs NLP Classifier</Link></li>
              <li><Link to="#" className="hover:text-brand transition-colors">Smart Scopus Sync</Link></li>
              <li><Link to="#" className="hover:text-brand transition-colors">Citation Fetcher</Link></li>
              <li><Link to="#" className="hover:text-brand transition-colors">Global Checkout</Link></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-white font-bold tracking-wider text-sm uppercase mb-6">Network</h5>
            <ul className="space-y-4">
              <li><Link to="#" className="hover:text-brand transition-colors">Sangia Publishing</Link></li>
              <li><Link to="#" className="hover:text-brand transition-colors">CSISC Research</Link></li>
              <li><Link to="#" className="hover:text-brand transition-colors">Sangia Group Inc.</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} CodeCanau Team. All rights reserved.</p>
          <p>Built with Strict Standards & Modern CSS.</p>
        </div>
      </footer>
    </div>
  );
};

export default BaseLayout;