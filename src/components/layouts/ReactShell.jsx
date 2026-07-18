import React from 'react';
import { Link } from 'react-router-dom';

/**
 * ReactShell Component
 * 
 * Shell utama untuk aplikasi React yang di-mount oleh PHP.
 * Menyediakan struktur HTML dasar, meta tags, dan mount point untuk React.
 * 
 * Dalam implementasi nyata, komponen ini biasanya tidak digunakan secara langsung
 * karena React di-mount ke div#root oleh main.jsx, tetapi komponen ini berguna
 * untuk dokumentasi struktur atau SSR.
 */

const ReactShell = ({ 
  title = 'Dashboard – Sangia Scieco',
  description = 'Platform analisis dampak penelitian Indonesia berbasis AI.',
  children 
}) => {
  // Data dari PHP diteruskan ke React via window.__SANGIA_INIT__
  const initData = typeof window !== 'undefined' ? window.__SANGIA_INIT__ : {
    apiUrl: '/api',
    currentUser: null,
    csrfToken: '',
    appPath: '/app'
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800">
      {/* Mount point untuk React */}
      <div id="root">
        {children}
      </div>

      {/* Script inisialisasi data dari backend */}
      <script
        type="application/json"
        id="sangia-init"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(initData)
        }}
      />
    </div>
  );
};

export default ReactShell;
