import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BaseLayout from '../../components/layouts/BaseLayout';
import ImpactScoreBadge from '../../components/ImpactScoreBadge';
import FrappeChart from '../../components/FrappeChart';

/**
 * InstitutionProfilePage Component
 * Transformasi dari institution_profile.twig
 */
const InstitutionProfilePage = () => {
  // TODO: Replace with actual data fetching from API/router params
  const [institution] = useState({
    name: 'Universitas Contoh',
    acronym: 'UC',
    type: 'Universitas Negeri',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    researcher_count: 150,
    total_citations: 5000,
    sinta_id: '12345',
  });

  const [score] = useState({
    composite_score: 75.5,
    pillar_academic: 80,
    pillar_social: 70,
    pillar_economic: 65,
    pillar_sdg: 72,
  });

  const [pubTrend] = useState([
    { year: 2019, total_articles: 50, total_citations: 200 },
    { year: 2020, total_articles: 65, total_citations: 350 },
    { year: 2021, total_articles: 80, total_citations: 500 },
    { year: 2022, total_articles: 95, total_citations: 700 },
    { year: 2023, total_articles: 110, total_citations: 900 },
  ]);

  const [researchers] = useState([
    { id: 1, name: 'Dr. Ahmad Santoso', orcid: '0000-0001-2345-6789', h_index: 25, total_citations: 1200, impact_score: 78.5 },
    { id: 2, name: 'Prof. Siti Aminah', orcid: '0000-0002-3456-7890', h_index: 35, total_citations: 2500, impact_score: 85.2 },
    { id: 3, name: 'Dr. Budi Wijaya', orcid: null, h_index: 18, total_citations: 800, impact_score: 65.3 },
  ]);

  return (
    <BaseLayout pageTitle={`${institution.name} - Wizdam Scola`}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Institusi */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600 flex-shrink-0">
            {institution.acronym ? institution.acronym.slice(0, 2).toUpperCase() : institution.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{institution.name}</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {institution.type}
              {institution.city && ` · ${institution.city}`}
              {institution.province && `, ${institution.province}`}
            </p>
            <div className="flex flex-wrap gap-3 mt-3 text-xs">
              <span className="badge badge-slate">{institution.researcher_count} Peneliti</span>
              <span className="badge badge-slate">{institution.total_citations.toLocaleString()} Total Sitasi</span>
              {institution.sinta_id && (
                <span className="badge badge-blue">SINTA ID: {institution.sinta_id}</span>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            <ImpactScoreBadge score={score} size="lg" />
          </div>
        </div>

        {/* Tren Publikasi */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Tren Publikasi per Tahun</h2>
          {pubTrend && pubTrend.length > 0 ? (
            <FrappeChart
              chartId="pub-trend"
              chartType="bar"
              labels={pubTrend.map((r) => r.year.toString())}
              datasets={[
                { name: 'Artikel', values: pubTrend.map((r) => r.total_articles) },
                { name: 'Sitasi', values: pubTrend.map((r) => r.total_citations) },
              ]}
              colors={['#6366f1', '#10b981']}
              height={220}
            />
          ) : (
            <p className="text-center text-slate-400 text-sm italic py-10">Data tren belum tersedia.</p>
          )}
        </div>

        {/* Tabel Peneliti */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Peneliti di Institusi Ini</h2>
          {researchers && researchers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase">
                    <th className="py-2 text-left">Nama</th>
                    <th className="py-2 text-right">H-Index</th>
                    <th className="py-2 text-right">Sitasi</th>
                    <th className="py-2 text-right">Skor</th>
                  </tr>
                </thead>
                <tbody>
                  {researchers.map((r) => (
                    <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="py-2.5">
                        <Link
                          to={`/researcher/${r.orcid || r.id}`}
                          className="font-medium text-indigo-700 hover:underline"
                        >
                          {r.name}
                        </Link>
                      </td>
                      <td className="py-2.5 text-right text-slate-500">{r.h_index || '–'}</td>
                      <td className="py-2.5 text-right text-slate-500">{r.total_citations || 0}</td>
                      <td className="py-2.5 text-right">
                        <span className="badge badge-indigo">{Math.round(r.impact_score * 10) / 10}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-400 text-sm italic text-center py-6">Belum ada peneliti yang terdaftar.</p>
          )}
        </div>
      </div>
    </BaseLayout>
  );
};

export default InstitutionProfilePage;
