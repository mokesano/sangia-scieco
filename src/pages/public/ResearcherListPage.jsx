import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import BaseLayout from '../components/layouts/BaseLayout';

/**
 * ResearcherListPage Component
 * Transformasi dari researcher_list.twig
 */
const ResearcherListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') || '';
  const field = searchParams.get('field') || 'all';

  // TODO: Replace with actual data fetching from API
  const [researchers] = useState([
    { id: 1, name: 'Prof. Dr. Ahmad Santoso', orcid: '0000-0001-2345-6789', institution_name: 'Universitas Indonesia', h_index: 35, total_citations: 2500, impact_score: 85.2 },
    { id: 2, name: 'Dr. Siti Aminah, M.Sc.', orcid: '0000-0002-3456-7890', institution_name: 'ITB', h_index: 28, total_citations: 1800, impact_score: 78.5 },
    { id: 3, name: 'Prof. Budi Wijaya', orcid: null, institution_name: 'Universitas Gadjah Mada', h_index: 32, total_citations: 2100, impact_score: 82.1 },
    { id: 4, name: 'Dr. Rina Kusumawati', orcid: '0000-0003-4567-8901', institution_name: 'IPB University', h_index: 22, total_citations: 1200, impact_score: 72.3 },
  ]);

  const [avgPillars] = useState({
    avg_academic: 75.5,
    avg_social: 68.2,
    avg_economic: 62.8,
    avg_sdg: 70.1,
  });

  const fields = ['all', 'teknik', 'kedokteran', 'pertanian', 'sosial', 'hukum', 'ekonomi'];

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const q = formData.get('q');
    if (q) {
      setSearchParams({ ...Object.fromEntries(searchParams), q });
    } else {
      searchParams.delete('q');
      setSearchParams(searchParams);
    }
  };

  return (
    <BaseLayout pageTitle="Peneliti Terdampak - Wizdam Scola">
      <div className="max-w-5xl mx-auto space-y-6">
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
              defaultValue={search}
              placeholder="Cari nama peneliti…"
              className="form-input w-full md:w-64"
            />
            <button type="submit" className="btn btn-primary px-4">
              Cari
            </button>
          </form>
        </div>

        {/* Filter Bidang */}
        <div className="flex flex-wrap gap-2 text-sm">
          {fields.map((f) => (
            <Link
              key={f}
              to={`/?field=${f}`}
              className={`px-3 py-1 rounded-full border transition-colors ${
                field === f
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400'
              }`}
            >
              {f === 'all' ? 'Semua Bidang' : f.charAt(0).toUpperCase() + f.slice(1)}
            </Link>
          ))}
        </div>

        {/* Rata-rata Platform */}
        {avgPillars && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Rata-rata Akademik', val: avgPillars.avg_academic, color: 'blue' },
              { label: 'Rata-rata Sosial', val: avgPillars.avg_social, color: 'violet' },
              { label: 'Rata-rata Ekonomi', val: avgPillars.avg_economic, color: 'amber' },
              { label: 'Rata-rata SDG', val: avgPillars.avg_sdg, color: 'emerald' },
            ].map((p, index) => (
              <div key={index} className="bg-white rounded-xl border border-slate-200 px-4 py-3 text-center shadow-sm">
                <div className={`text-xl font-bold text-${p.color}-600`}>{Math.round(p.val * 10) / 10}</div>
                <div className="text-xs text-slate-400 mt-0.5">{p.label}</div>
              </div>
            ))}
          </div>
        )}

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
              {researchers.length > 0 ? (
                researchers.map((r, i) => (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-indigo-50 transition-colors group">
                    <td className="py-3 px-4 text-slate-400 font-mono text-xs">{i + 1}</td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/researcher/${r.orcid || r.id}`}
                        className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors"
                      >
                        {r.name}
                      </Link>
                      {r.orcid && <div className="text-xs text-slate-400 font-mono">{r.orcid}</div>}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs hidden md:table-cell truncate max-w-[200px]">
                      {r.institution_name || '–'}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600 hidden sm:table-cell">
                      {r.h_index || '–'}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600 hidden sm:table-cell">
                      {r.total_citations || 0}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          r.impact_score >= 80
                            ? 'bg-emerald-100 text-emerald-700'
                            : r.impact_score >= 60
                            ? 'bg-blue-100 text-blue-700'
                            : r.impact_score >= 40
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {Math.round(r.impact_score * 10) / 10}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 italic">
                    Tidak ada peneliti yang ditemukan{search && ` untuk "${search}"`}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </BaseLayout>
  );
};

export default ResearcherListPage;
