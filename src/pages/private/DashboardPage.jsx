import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SidebarLayout from '../components/layouts/SidebarLayout';
import ImpactScoreBadge from '../components/ImpactScoreBadge';
import FrappeChart from '../components/FrappeChart';

/**
 * DashboardPage Component
 * Transformasi dari dashboard.twig
 */
const DashboardPage = () => {
  const activeMenu = 'dashboard';

  // TODO: Replace with actual data from context/API
  const [researcher] = useState({
    id: 1,
    name: 'Dr. Ahmad Santoso',
    h_index: 25,
    total_citations: 1500,
  });

  const [score] = useState({
    composite_score: 72.5,
    pillar_academic: 78,
    pillar_social: 65,
    pillar_economic: 60,
    pillar_sdg: 70,
  });

  const [scoreHistory] = useState([
    { calculated_at: '2023-01-15', composite_score: 65 },
    { calculated_at: '2023-04-15', composite_score: 68 },
    { calculated_at: '2023-07-15', composite_score: 70 },
    { calculated_at: '2023-10-15', composite_score: 72.5 },
  ]);

  const [recentWork] = useState([
    { id: 1, title: 'Advanced Machine Learning for Climate Prediction', journal_name: 'Nature Climate Change', year: 2023, citations: 45 },
    { id: 2, title: 'Sustainable Agriculture in Tropical Regions', journal_name: 'Agriculture Journal', year: 2023, citations: 28 },
    { id: 3, title: 'Renewable Energy Systems Optimization', journal_name: 'Energy Reports', year: 2022, citations: 62 },
  ]);

  const [notifications] = useState([
    { id: 1, message: 'Impact Score Anda telah diperbarui', created_at: '2024-01-10' },
    { id: 2, message: 'Artikel baru Anda telah mendapat 10 sitasi', created_at: '2024-01-08' },
  ]);

  return (
    <SidebarLayout pageHeading="Dashboard Saya" activeMenu={activeMenu}>
      <div className="space-y-6">
        {/* Belum link ke profil peneliti */}
        {!researcher && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
            <svg className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="font-semibold text-amber-800 text-sm">Profil Peneliti Belum Terhubung</h3>
              <p className="text-amber-700 text-xs mt-1">
                Hubungkan ORCID Anda untuk melihat impact score dan statistik riset Anda.
              </p>
              <a href="/auth/login?orcid=1" className="mt-3 inline-block btn btn-primary text-xs">
                Hubungkan ORCID →
              </a>
            </div>
          </div>
        )}

        {researcher && (
          <>
            {/* Kartu Statistik Utama */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Impact Score', val: Math.round(score.composite_score * 10) / 10, color: 'indigo' },
                { label: 'H-Index', val: researcher.h_index, color: 'violet' },
                { label: 'Total Sitasi', val: researcher.total_citations.toLocaleString(), color: 'blue' },
                { label: 'Karya Tercatat', val: recentWork.length, color: 'emerald' },
              ].map((kpi, index) => (
                <div key={index} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-center">
                  <div className={`text-2xl font-bold text-${kpi.color}-600`}>{kpi.val}</div>
                  <div className="text-xs text-slate-400 mt-1">{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Tren + Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tren Skor */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-700 mb-4">Tren Impact Score</h2>
                {scoreHistory && scoreHistory.length > 0 ? (
                  <FrappeChart
                    chartId="dash-trend"
                    chartType="line"
                    labels={scoreHistory.map((r) => new Date(r.calculated_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }))}
                    datasets={[{ name: 'Skor', values: scoreHistory.map((r) => r.composite_score) }]}
                    colors={['#6366f1']}
                    height={180}
                  />
                ) : (
                  <p className="text-slate-400 text-xs italic text-center py-8">Belum ada data tren.</p>
                )}
              </div>

              {/* 4 Pilar */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col items-center justify-center">
                <h2 className="text-sm font-semibold text-slate-700 mb-4 self-start">4 Pilar Dampak</h2>
                <ImpactScoreBadge score={score} size="lg" />
              </div>
            </div>

            {/* Karya Terbaru */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">Karya Terbaru Anda</h2>
              {recentWork && recentWork.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase">
                      <th className="py-2 text-left">Judul</th>
                      <th className="py-2 text-left hidden md:table-cell">Jurnal</th>
                      <th className="py-2 text-right">Tahun</th>
                      <th className="py-2 text-right">Sitasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentWork.map((w) => (
                      <tr key={w.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-2.5 font-medium text-slate-800 truncate max-w-[200px]">{w.title}</td>
                        <td className="py-2.5 text-slate-500 text-xs hidden md:table-cell truncate max-w-[150px]">
                          {w.journal_name || '–'}
                        </td>
                        <td className="py-2.5 text-right text-slate-500">{w.year}</td>
                        <td className="py-2.5 text-right font-medium text-slate-700">{w.citations}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-slate-400 text-xs italic text-center py-6">Belum ada karya yang tercatat.</p>
              )}
            </div>
          </>
        )}

        {/* Notifikasi */}
        {notifications && notifications.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">
              Notifikasi ({notifications.length})
            </h2>
            <ul className="space-y-2">
              {notifications.map((n) => (
                <li key={n.id} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0"></span>
                  {n.message}{' '}
                  <span className="ml-auto text-slate-400 whitespace-nowrap">
                    {new Date(n.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default DashboardPage;
