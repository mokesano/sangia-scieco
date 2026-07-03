import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * ErrorPage Component
 * 
 * Halaman error untuk menampilkan pesan kesalahan dengan kode HTTP.
 */

const ErrorPage = ({ code = 404, message = 'Halaman tidak ditemukan' }) => {
  const getErrorTitle = (code) => {
    switch (code) {
      case 404: return 'Halaman Tidak Ditemukan';
      case 403: return 'Akses Ditolak';
      case 500: return 'Kesalahan Server';
      default: return 'Terjadi Kesalahan';
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="text-8xl font-black text-slate-100 select-none mb-4">{code}</div>
      <h1 className="text-xl font-bold text-slate-700 mb-2">
        {getErrorTitle(code)}
      </h1>
      <p className="text-slate-500 text-sm max-w-md">{message}</p>
      <Link to="/" className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
        ← Kembali ke Beranda
      </Link>
    </div>
  );
};

export default ErrorPage;
