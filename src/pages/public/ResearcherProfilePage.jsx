import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ImpactScoreBadge from '../../components/ImpactScoreBadge';
import SdgCard from '../../components/SdgCard';
import FrappeChart from '../../components/FrappeChart';

/**
 * ResearcherProfilePage Component
 * 
 * Halaman profil peneliti dengan informasi lengkap, impact score, tren skor, dan artikel.
 */

const ResearcherProfilePage = () => {
  const { orcid } = useParams();
  
  // Mock data - dalam implementasi nyata akan diambil dari API
  const [researcher] = useState({
    full_name: 'Dr. Ahmad Wijaya',
    position_title: 'Lektor Kepala',
    institution_name: 'Universitas Indonesia',
    orcid_id: '0000-0001-2345-6789',
    sinta_id: '123456',
    h_index: 25,
    total_citations: 1250
  });

  const [score] = useState({
    composite_score: 87.4,
    pillar_academic: 90,
    pillar_social: 80,
    pillar_economic: 85,
    pillar_sdg: 88
  });

  const [sdgTags] = useState([
    { sdg_id: 3, name: 'Good Health', color: '#4c9f38' },
    { sdg_id: 4, name: 'Quality Education', color: '#c5192d' },
    { sdg_id: 9, name: 'Industry & Innovation', color: '#fd6925' },
    { sdg_id: 13, name: 'Climate Action', color: '#3f7e44' },
  ]);

  const [scoreHistory] = useState([
    { calculated_at: '2024-01-01', composite_score: 82.1 },
    { calculated_at: '2024-02-01', composite_score: 83.5 },
    { calculated_at: '2024-03-01', composite_score: 84.2 },
    { calculated_at: '2024-04-01', composite_score: 85.0 },
    { calculated_at: '2024-05-01', composite_score: 85.8 },
    { calculated_at: '2024-06-01', composite_score: 86.3 },
    { calculated_at: '2024-07-01', composite_score: 86.9 },
    { calculated_at: '2024-08-01', composite_score: 87.1 },
    { calculated_at: '2024-09-01', composite_score: 87.4 },
    { calculated_at: '2024-10-01', composite_score: 87.4 },
    { calculated_at: '2024-11-01', composite_score: 87.4 },
    { calculated_at: '2024-12-01', composite_score: 87.4 },
  ]);

  const [recentArticles] = useState([
    { title: 'Machine Learning for Healthcare Diagnostics', journal_name: 'Journal of Medical Systems', year: 2024, citations: 45, impact_score: 92.3 },
    { title: 'AI-Powered Educational Platform Design', journal_name: 'Computers & Education', year: 2024, citations: 32, impact_score: 88.1 },
    { title: 'Sustainable Manufacturing Process Optimization', journal_name: 'Journal of Cleaner Production', year: 2023, citations: 58, impact_score: 91.5 },
    { title: 'Climate Change Prediction Models', journal_name: 'Nature Climate Change', year: 2023, citations: 120, impact_score: 96.8 },
    { title: 'Digital Transformation in Indonesian Universities', journal_name: 'Higher Education Policy', year: 2023, citations: 28, impact_score: 85.2 },
  ]);

  // Format labels untuk chart
  const trendLabels = scoreHistory.map(r => new Date(r.calculated_at).toLocaleString('id-ID', { month: 'short', year: 'numeric' }));
  const trendDatasets = [{ name: 'Skor Komposit', values: scoreHistory.map(r => r.composite_score) }];

  const pillarLabels = ['Akademik (40%)', 'Sosial (25%)', 'Ekonomi (20%)', 'SDG (15%)'];
  const pillarDatasets = [{ values: [score.pillar_academic, score.pillar_social, score.pillar_economic, score.pillar_sdg] }];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Profil */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
            {researcher.full_name.charAt(0)}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-slate-900">{researcher.full_name}</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {[researcher.position_title, researcher.institution_name].filter(Boolean).join(' · ')}
          </p>

          <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
            {researcher.orcid_id && (
              <a
                href={`https://orcid.org/${researcher.orcid_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-green-600 hover:underline font-medium"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" fill="#A6CE39" />
                  <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">iD</text>
                </svg>
                ORCID {researcher.orcid_id}
              </a>
            )}
            {researcher.sinta_id && (
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                SINTA {researcher.sinta_id}
              </span>
            )}
            {researcher.h_index && (
              <span className="px-2.5 py-1 bg-slate-50 text-slate-700 text-xs font-medium rounded-full border border-slate-200">
                h-index: {researcher.h_index}
              </span>
            )}
            {researcher.total_citations && (
              <span className="px-2.5 py-1 bg-slate-50 text-slate-700 text-xs font-medium rounded-full border border-slate-200">
                {researcher.total_citations.toLocaleString()} sitasi
              </span>
            )}
          </div>

          {/* SDG Tags */}
          {sdgTags && sdgTags.length > 0 && (
            <div className="mt-3">
              <SdgCard sdg_tags={sdgTags} max_show={4} />
            </div>
          )}
        </div>

        {/* Impact Score Badge */}
        <div className="flex-shrink-0 flex justify-center">
          <ImpactScoreBadge score={score} size="lg" />
        </div>
      </div>

      {/* Grid Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tren Skor (Frappe Chart) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Tren Impact Score (12 Bulan)</h2>
          {scoreHistory && scoreHistory.length > 0 ? (
            <FrappeChart
              chartId="score-trend"
              chartType="line"
              chartTitle="Tren Impact Score"
              labels={trendLabels}
              datasets={trendDatasets}
              colors={['#6366f1']}
              height={200}
            />
          ) : (
            <p className="text-slate-400 text-sm italic text-center py-10">Data tren belum tersedia.</p>
          )}
        </div>

        {/* Breakdown 4 Pilar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Breakdown 4 Pilar</h2>
          {score ? (
            <FrappeChart
              chartId="pillar-breakdown"
              chartType="percentage"
              chartTitle=""
              labels={pillarLabels}
              datasets={pillarDatasets}
              colors={['#6366f1', '#8b5cf6', '#f59e0b', '#10b981']}
              height={180}
            />
          ) : (
            <p className="text-slate-400 text-sm italic text-center py-10">Skor belum tersedia.</p>
          )}
        </div>
      </div>

      {/* Artikel Terbaru */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h2 className="text-base font-semibold text-slate-700 mb-4">Artikel Terbaru</h2>
        {recentArticles && recentArticles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wide">
                  <th className="py-2 text-left font-medium">Judul</th>
                  <th className="py-2 text-left font-medium">Jurnal</th>
                  <th className="py-2 text-right font-medium">Tahun</th>
                  <th className="py-2 text-right font-medium">Sitasi</th>
                  <th className="py-2 text-right font-medium">Skor</th>
                </tr>
              </thead>
              <tbody>
                {recentArticles.map((article, idx) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 pr-4 font-medium text-slate-800 max-w-xs truncate">{article.title}</td>
                    <td className="py-2.5 pr-4 text-slate-500 text-xs truncate max-w-[150px]">{article.journal_name || '–'}</td>
                    <td className="py-2.5 text-right text-slate-500">{article.year}</td>
                    <td className="py-2.5 text-right text-slate-700 font-medium">{article.citations}</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200">
                        {article.impact_score.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-400 text-sm italic text-center py-6">Belum ada artikel yang tercatat.</p>
        )}
      </div>
    </div>
  );
};

export default ResearcherProfilePage;
