import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { researcherApi } from '../services/api';

const ResearcherListPage = () => {
  const [researchers, setResearchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchQuery = searchParams.get('q') || '';
  const selectedField = searchParams.get('field') || 'all';

  const fields = ['all', 'teknik', 'kedokteran', 'pertanian', 'sosial', 'hukum', 'ekonomi'];

  useEffect(() => {
    const fetchResearchers = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (searchQuery) params.q = searchQuery;
        if (selectedField !== 'all') params.field = selectedField;
        
        const data = await researcherApi.list(params);
        setResearchers(data.researchers || []);
      } catch (err) {
        setError(err.message || 'Gagal memuat data peneliti');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResearchers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedField]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newParams = new URLSearchParams();
    if (formData.get('q')) newParams.set('q', formData.get('q'));
    if (selectedField !== 'all') newParams.set('field', selectedField);
    setSearchParams(newParams);
  };

  const handleFieldChange = (field) => {
    const newParams = new URLSearchParams(searchParams);
    if (field === 'all') {
      newParams.delete('field');
    } else {
      newParams.set('field', field);
    }
    setSearchParams(newParams);
  };

  const getImpactColor = (score) => {
    if (score >= 80) return 'bg-emerald-100 text-emerald-700';
    if (score >= 60) return 'bg-blue-100 text-blue-700';
    if (score >= 40) return 'bg-amber-100 text-amber-700';
    return 'bg-slate-100 text-slate-600';
  };

  if (loading && researchers.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Peneliti Terdampak</h1>
          <p className="text-slate-500 text-sm mt-1">Daftar peneliti Indonesia berdasarkan Impact Score tertinggi</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} method="GET" className="flex gap-2">
          <input
            type="text"
            name="q"
            value={searchQuery}
            onChange={(e) => setSearchParams({ ...Object.fromEntries(searchParams), q: e.target.value })}
            placeholder="Cari nama peneliti…"
            className="w-full md:w-64 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors">
            Cari
          </button>
        </form>
      </div>

      {/* Filter Bidang */}
      <div className="flex flex-wrap gap-2 text-sm">
        {fields.map((f) => (
          <button
            key={f}
            onClick={() => handleFieldChange(f)}
            className={`px-3 py-1 rounded-full border transition-colors ${
              selectedField === f
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400'
            }`}
          >
            {f === 'all' ? 'Semua Bidang' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Tabel Peneliti */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-400 uppercase tracking-wide">
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Peneliti</th>
              <th className="py-3 px-4 text-left hidden md:table-cell">Institusi</th>
              <th className="py-3 px-4 text-right hidden sm:table-cell">H-Index</th>
              <th className="py-3 px-4 text-right hidden sm:table-cell">Sitasi</th>
              <th className="py-3 px-4 text-right">Impact Score</th>
            </tr>
          </thead>
          <tbody>
            {researchers.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-400 italic">
                  Tidak ada peneliti yang ditemukan{searchQuery ? ` untuk "${searchQuery}"` : ''}.
                </td>
              </tr>
            ) : (
              researchers.map((r, i) => (
                <tr key={r.id || i} className="border-b border-slate-50 hover:bg-indigo-50 transition-colors group">
                  <td className="py-3 px-4 text-slate-400 font-mono text-xs">{i + 1}</td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/researcher/${r.orcid || r.id}`}
                      className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors"
                    >
                      {r.full_name || r.name}
                    </Link>
                    {r.orcid && <div className="text-xs text-slate-400 font-mono">{r.orcid}</div>}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-xs hidden md:table-cell truncate max-w-[200px]">
                    {r.institution_name || '–'}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600 hidden sm:table-cell">{r.h_index || '–'}</td>
                  <td className="py-3 px-4 text-right text-slate-600 hidden sm:table-cell">
                    {(r.total_citations || 0).toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${getImpactColor(r.impact_score || r.wizdam_score)}`}>
                      {(r.impact_score || r.wizdam_score || 0).toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}
    </div>
  );
};

export default ResearcherListPage;
