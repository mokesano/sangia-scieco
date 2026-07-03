import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * AdminPage Component
 * 
 * Halaman admin analytics dengan statistik platform, grafik harvesting, dan log aktivitas.
 */

const AdminPage = () => {
  // Mock data - dalam implementasi nyata akan diambil dari API
  const [stats] = useState({
    total_researchers: 15420,
    total_institutions: 342,
    total_journals: 1250,
    total_articles: 89500,
    total_users: 2840
  });

  const [harvestTrend] = useState([
    { date: '2024-12-01', inserted: 125 },
    { date: '2024-12-02', inserted: 98 },
    { date: '2024-12-03', inserted: 156 },
    { date: '2024-12-04', inserted: 142 },
    { date: '2024-12-05', inserted: 178 },
    { date: '2024-12-06', inserted: 89 },
    { date: '2024-12-07', inserted: 134 },
  ]);

  const [scoreDistribution] = useState([
    { bucket: 0, count: 1250 },
    { bucket: 10, count: 2340 },
    { bucket: 20, count: 3120 },
    { bucket: 30, count: 2890 },
    { bucket: 40, count: 2450 },
    { bucket: 50, count: 1680 },
    { bucket: 60, count: 980 },
    { bucket: 70, count: 520 },
    { bucket: 80, count: 150 },
    { bucket: 90, count: 40 },
  ]);

  const [topInstitutions] = useState([
    { name: 'Universitas Indonesia', researcher_count: 2450, avg_score: 78.5 },
    { name: 'Institut Teknologi Bandung', researcher_count: 1890, avg_score: 82.3 },
    { name: 'Universitas Gadjah Mada', researcher_count: 2120, avg_score: 76.8 },
    { name: 'IPB University', researcher_count: 1450, avg_score: 74.2 },
    { name: 'Universitas Airlangga', researcher_count: 1680, avg_score: 75.9 },
    { name: 'Universitas Diponegoro', researcher_count: 1230, avg_score: 71.4 },
    { name: 'Universitas Brawijaya', researcher_count: 1150, avg_score: 72.8 },
    { name: 'Universitas Padjadjaran', researcher_count: 1340, avg_score: 73.5 },
    { name: 'Universitas Hasanuddin', researcher_count: 980, avg_score: 69.2 },
    { name: 'Universitas Sebelas Maret', researcher_count: 850, avg_score: 68.5 },
  ]);

  const [recentLogs] = useState([
    { created_at: '2024-12-07 14:30:00', action: 'HARVEST_COMPLETE', description: 'Garuda OAI-PMH: 847 articles harvested' },
    { created_at: '2024-12-07 14:25:00', action: 'SCORE_CALCULATION', description: 'Batch calculation for 150 researchers' },
    { created_at: '2024-12-07 14:20:00', action: 'USER_LOGIN', description: 'Admin user logged in' },
    { created_at: '2024-12-07 14:15:00', action: 'DATA_SYNC', description: 'SINTA synchronization completed' },
    { created_at: '2024-12-07 14:10:00', action: 'CRAWLER_START', description: 'WizdamCrawler full cycle initiated' },
  ]);

  return (
    <div className="space-y-6">
      {/* Statistik Ringkasan */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Peneliti', val: stats.total_researchers, color: 'indigo' },
          { label: 'Institusi', val: stats.total_institutions, color: 'violet' },
          { label: 'Jurnal', val: stats.total_journals, color: 'blue' },
          { label: 'Artikel', val: stats.total_articles, color: 'emerald' },
          { label: 'Pengguna', val: stats.total_users, color: 'amber' },
        ].map((s, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-center">
            <div className={`text-2xl font-bold text-${s.color}-600`}>{s.val.toLocaleString()}</div>
            <div className="text-xs text-slate-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tren Harvesting */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Artikel Masuk (7 Hari Terakhir)</h2>
          {harvestTrend && harvestTrend.length > 0 ? (
            <div className="h-[200px] flex items-end justify-between gap-2">
              {harvestTrend.map((d, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-indigo-500 rounded-t transition-all hover:bg-indigo-600"
                    style={{ height: `${(d.inserted / Math.max(...harvestTrend.map(t => t.inserted))) * 100}%` }}
                  ></div>
                  <span className="text-xs text-slate-400 mt-2 rotate-45 origin-top-left">
                    {new Date(d.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-xs italic text-center py-10">Tidak ada data harvesting.</p>
          )}
        </div>

        {/* Distribusi Skor */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Distribusi Impact Score Peneliti</h2>
          {scoreDistribution && scoreDistribution.length > 0 ? (
            <div className="h-[200px] flex items-end justify-between gap-2">
              {scoreDistribution.map((d, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-emerald-500 rounded-t transition-all hover:bg-emerald-600"
                    style={{ height: `${(d.count / Math.max(...scoreDistribution.map(t => t.count))) * 100}%` }}
                  ></div>
                  <span className="text-xs text-slate-400 mt-2 rotate-45 origin-top-left">
                    {d.bucket}–{d.bucket + 10}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-xs italic text-center py-10">Belum ada data distribusi.</p>
          )}
        </div>
      </div>

      {/* Top Institusi */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Top 10 Institusi (Rata-rata Impact Score)</h2>
        {topInstitutions && topInstitutions.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase">
                <th className="py-2 text-left">#</th>
                <th className="py-2 text-left">Institusi</th>
                <th className="py-2 text-right">Peneliti</th>
                <th className="py-2 text-right">Rata-rata Skor</th>
              </tr>
            </thead>
            <tbody>
              {topInstitutions.map((inst, idx) => (
                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-2 text-slate-400 text-xs font-mono">{idx + 1}</td>
                  <td className="py-2 font-medium text-slate-800">{inst.name}</td>
                  <td className="py-2 text-right text-slate-500">{inst.researcher_count.toLocaleString()}</td>
                  <td className="py-2 text-right">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200">
                      {inst.avg_score.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-slate-400 text-xs italic text-center py-6">Belum ada data institusi.</p>
        )}
      </div>

      {/* Log Aktivitas */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Log Aktivitas Terbaru</h2>
        {recentLogs && recentLogs.length > 0 ? (
          <ul className="divide-y divide-slate-50">
            {recentLogs.map((log, idx) => (
              <li key={idx} className="py-2 flex items-center justify-between text-xs text-slate-600">
                <span className="font-mono text-slate-400">
                  {new Date(log.created_at).toLocaleString('id-ID', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="font-medium">{log.action}</span>
                <span className="text-slate-400 truncate max-w-[200px]">{log.description || ''}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400 text-xs italic text-center py-6">Belum ada log aktivitas.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
