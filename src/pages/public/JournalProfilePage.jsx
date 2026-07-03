import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ImpactScoreBadge from '../../components/ImpactScoreBadge';
import SdgCard from '../../components/SdgCard';
import FrappeChart from '../../components/FrappeChart';

/**
 * JournalProfilePage Component
 * 
 * Halaman profil jurnal dengan informasi indeksasi, impact score, dan daftar artikel.
 */

const JournalProfilePage = () => {
  const { issn } = useParams();
  
  // Mock data - dalam implementasi nyata akan diambil dari API
  const [journal] = useState({
    title: 'Jurnal Teknologi Indonesia',
    issn: '0000-0000',
    e_issn: '1234-5678',
    publisher: 'Universitas Indonesia',
    is_predatory: false
  });

  const [indexing] = useState({
    sinta: { indexed: true, rank: '2' },
    scopus: { indexed: true, sjr: '0.45' },
    wos: { indexed: false }
  });

  const [score] = useState({
    composite_score: 78.5,
    pillar_academic: 85,
    pillar_social: 70,
    pillar_economic: 75,
    pillar_sdg: 80
  });

  const [articles] = useState([
    { title: 'Implementasi Machine Learning untuk Analisis Sentimen', year: 2024, citations: 15, impact_score: 82.3, doi: '10.1234/jti.2024.001' },
    { title: 'Sistem Rekomendasi Berbasis Deep Learning', year: 2024, citations: 8, impact_score: 75.1, doi: '10.1234/jti.2024.002' },
    { title: 'Optimasi Jaringan Syaraf Tiruan untuk Prediksi Cuaca', year: 2023, citations: 22, impact_score: 88.7, doi: '10.1234/jti.2023.015' },
    { title: 'Analisis Big Data untuk Smart City', year: 2023, citations: 12, impact_score: 71.4, doi: null },
  ]);

  const [liveIndexing] = useState(null);

  const handleCheckIndexing = () => {
    // Simulasi cek indeksasi real-time
    setTimeout(() => {
      setLiveIndexing({
        scopus: { indexed: true, sjr: '0.45' },
        sinta: { indexed: true, rank: '2' },
        wos: { indexed: false }
      });
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Jurnal */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{journal.title}</h1>
            <p className="text-slate-500 text-sm mt-1">
              ISSN: <span className="font-mono">{journal.issn}</span>
              {journal.e_issn && ` · e-ISSN: `}<span className="font-mono">{journal.e_issn}</span>
            </p>
            {journal.publisher && (
              <p className="text-slate-400 text-xs mt-1">Penerbit: {journal.publisher}</p>
            )}

            {/* Badge Indeksasi */}
            <div className="flex flex-wrap gap-2 mt-3">
              {indexing.sinta?.indexed && (
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                  SINTA {indexing.sinta.rank || ''}
                </span>
              )}
              {indexing.scopus?.indexed && (
                <>
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200">
                    Scopus
                  </span>
                  {indexing.scopus.sjr && (
                    <span className="px-2.5 py-1 bg-slate-50 text-slate-700 text-xs rounded-full border border-slate-200">
                      SJR {indexing.scopus.sjr}
                    </span>
                  )}
                </>
              )}
              {indexing.wos?.indexed && (
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                  WoS / ESCI
                </span>
              )}
              {journal.is_predatory && (
                <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full border border-red-200">
                  Potensial Predatory
                </span>
              )}
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <ImpactScoreBadge score={score} size="lg" />
          </div>
        </div>

        {/* Tombol cek indeksasi real-time */}
        {!liveIndexing && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={handleCheckIndexing}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              Cek Status Indeksasi Real-Time →
            </button>
          </div>
        )}
      </div>

      {/* Live Indexing Result */}
      {liveIndexing && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-indigo-700 mb-3">Hasil Cek Indeksasi Real-Time</h2>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className={`font-bold text-lg ${liveIndexing.scopus.indexed ? 'text-emerald-600' : 'text-slate-400'}`}>
                {liveIndexing.scopus.indexed ? '✓' : '✗'}
              </div>
              <div className="text-slate-500 text-xs">Scopus</div>
              {liveIndexing.scopus.sjr && (
                <div className="text-xs text-slate-400">SJR {liveIndexing.scopus.sjr}</div>
              )}
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className={`font-bold text-lg ${liveIndexing.sinta.indexed ? 'text-emerald-600' : 'text-slate-400'}`}>
                {liveIndexing.sinta.indexed ? '✓' : '✗'}
              </div>
              <div className="text-slate-500 text-xs">SINTA</div>
              {liveIndexing.sinta.rank !== undefined && (
                <div className="text-xs text-slate-400">Peringkat {liveIndexing.sinta.rank}</div>
              )}
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className={`font-bold text-lg ${liveIndexing.wos.indexed ? 'text-emerald-600' : 'text-slate-400'}`}>
                {liveIndexing.wos.indexed ? '✓' : '✗'}
              </div>
              <div className="text-slate-500 text-xs">WoS</div>
            </div>
          </div>
        </div>
      )}

      {/* Artikel Terbaru */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h2 className="text-base font-semibold text-slate-700 mb-4">Artikel Terbaru</h2>
        {articles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase">
                  <th className="py-2 text-left">Judul</th>
                  <th className="py-2 text-right">Tahun</th>
                  <th className="py-2 text-right">Sitasi</th>
                  <th className="py-2 text-right">Skor</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a, idx) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-2.5 pr-4 font-medium text-slate-800 max-w-sm truncate">
                      {a.doi ? (
                        <a
                          href={`https://doi.org/${a.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-indigo-600"
                        >
                          {a.title}
                        </a>
                      ) : (
                        a.title
                      )}
                    </td>
                    <td className="py-2.5 text-right text-slate-500">{a.year}</td>
                    <td className="py-2.5 text-right font-medium text-slate-700">{a.citations}</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200">
                        {a.impact_score.toFixed(1)}
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

export default JournalProfilePage;
