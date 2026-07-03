import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * WizdamCrawlerPage Component
 * 
 * Halaman informasi tentang WizdamCrawler - mesin harvesting data riset Indonesia.
 * Menampilkan penjelasan tentang pipeline OAI-PMH, kemampuan crawler, dan integrasi dengan Sangia APIs.
 */

const WizdamCrawlerPage = () => {
  const oaiReasons = [
    { icon: '✅', title: 'Legal & Resmi', desc: 'Repositori menyediakan endpoint OAI-PMH secara eksplisit untuk dipanen oleh harvester eksternal.' },
    { icon: '⚡', title: 'Struktural & Konsisten', desc: 'Data dalam format Dublin Core (oai_dc), JATS XML, atau MODS — tidak perlu parsing HTML yang rapuh.' },
    { icon: '♾️', title: 'Resumption Token', desc: 'Mendukung paginasi besar dengan resumptionToken sehingga ribuan record bisa dipanen tanpa timeout.' },
  ];

  const endpoints = [
    { name: 'Garuda (Kemdikbud)', url: 'https://garuda.kemdikbud.go.id/oai', formats: 'oai_dc, oai_jats', flag: '🇮🇩' },
    { name: 'LIPI / BRIN', url: 'https://lipi.go.id/oai', formats: 'oai_dc', flag: '🇮🇩' },
    { name: 'Zenodo', url: 'https://zenodo.org/oai2d', formats: 'oai_dc, mods', flag: '🌐' },
    { name: 'arXiv', url: 'https://export.arxiv.org/oai2', formats: 'oai_dc, mods', flag: '🌐' },
    { name: 'DOAJ', url: 'https://doaj.org/oai', formats: 'oai_dc, mods', flag: '🌐' },
    { name: 'PubMed Central', url: 'https://www.ncbi.nlm.nih.gov/pmc/oai/oai.cgi', formats: 'oai_dc, pmc', flag: '🌐' },
    { name: 'Crossref', url: 'https://api.crossref.org/works', formats: 'JSON REST', flag: '🌐' },
  ];

  const pipeline = [
    { step: '1', label: 'Sumber Data', items: ['Garuda OAI-PMH', 'Zenodo OAI-PMH', 'DOAJ OAI-PMH', 'Crossref API', 'Google Scholar', 'Semantic Scholar'], color: 'blue' },
    { step: '2', label: 'Harvesting Layer', items: ['OaiPmhHarvester', 'WebCrawler', 'ProfileManager', 'Rate Limiting', 'robots.txt check'], color: 'violet' },
    { step: '3', label: 'Normalisasi', items: ['DC → Wizdam Schema', 'JATS → Wizdam Schema', 'MODS → Wizdam Schema', 'ORCID Extraction', 'DOI Dedup'], color: 'indigo' },
    { step: '4', label: 'Penyimpanan', items: ['author_profiles_cache', 'citations_cache', 'journal_profiles_cache', 'RawDataPersister'], color: 'emerald' },
    { step: '5', label: 'Analisis Sangia', items: ['ImpactScoreClient', 'SdgIntegrator', 'WeightConfigService', 'Wizdam Impact Score'], color: 'amber' },
  ];

  const capabilities = [
    {
      title: 'Harvesting Metadata Publikasi',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      color: 'blue',
      items: [
        'OAI-PMH Garuda & LIPI (jurnal Indonesia)',
        'Zenodo, DOAJ, PMC, arXiv (internasional)',
        'Format Dublin Core, JATS XML, MODS',
        'Deduplikasi berbasis DOI otomatis',
        'Resumption token untuk dataset besar',
      ]
    },
    {
      title: 'Profil Peneliti',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      color: 'violet',
      items: [
        'ORCID API — data profil resmi',
        'Google Scholar — h-index, citation count',
        'ResearchGate — engagement metrics',
        'SINTA — peringkat peneliti Indonesia',
        'Ekstraksi ORCID dari contrib JATS',
      ]
    },
    {
      title: 'Jaringan Sitasi',
      icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
      color: 'emerald',
      items: [
        'OpenCitations — forward & backward citations',
        'Crossref — metadata DOI lengkap',
        'Semantic Scholar — artikel terkait',
        'Citation network per peneliti (top 10 DOI)',
        'Penyimpanan otomatis di citations_cache',
      ]
    },
    {
      title: 'Indikator Jurnal',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      color: 'amber',
      items: [
        'Scimago — quartile, SJR, H-Index',
        'SINTA — akreditasi jurnal Indonesia',
        'Impact factor dari berbagai database',
        'Metadata jurnal (ISSN, publisher, scope)',
        'Update periodik via scheduled jobs',
      ]
    },
  ];

  const ethics = [
    { label: 'robots.txt', desc: 'Mematuhi aturan robots.txt setiap domain sebelum mengakses.' },
    { label: 'Rate Limiting', desc: 'Jeda minimum 2 detik antar permintaan per domain; lebih lambat untuk sumber sensitif.' },
    { label: 'User-Agent Transparan', desc: 'Mengidentifikasi diri sebagai WizdamBot dengan kontak yang bisa dihubungi.' },
    { label: 'CAPTCHA Detection', desc: 'Mendeteksi dan berhenti otomatis jika menemukan halaman CAPTCHA.' },
    { label: 'OAI-PMH Prioritas', desc: 'Menggunakan API resmi terlebih dahulu; scraping hanya sebagai pelengkap.' },
    { label: 'Open Data Only', desc: 'Hanya memanen data yang tersedia secara publik dan legal untuk dipanen.' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-6">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full border border-indigo-200">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Mesin Resmi Wizdam
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
          WizdamCrawler
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Pipeline harvesting data riset Indonesia yang menghormati etika web, menggunakan
          <strong className="text-slate-700"> OAI-PMH</strong> sebagai jalur resmi dan
          <strong className="text-slate-700"> smart web scraping</strong> sebagai pelengkap.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">OAI-PMH v2.0</span>
          <span className="px-3 py-1 bg-violet-50 text-violet-700 text-xs font-medium rounded-full border border-violet-200">Semantic Scholar</span>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">OpenCitations</span>
          <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">Crossref</span>
          <span className="px-3 py-1 bg-slate-50 text-slate-700 text-xs font-medium rounded-full border border-slate-200">SINTA / Garuda</span>
        </div>
      </section>

      {/* Apa itu WizdamCrawler */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Apa itu WizdamCrawler?</h2>
        <p className="text-slate-600 leading-relaxed">
          WizdamCrawler adalah mesin pengumpul data riset yang dibangun khusus untuk ekosistem
          <strong> Sangia</strong>. Ia memanen metadata publikasi ilmiah, profil peneliti, jaringan
          sitasi, dan indikator dampak dari berbagai sumber terpercaya secara otomatis —
          kemudian menyalurkan hasilnya ke <strong>Sangia-APIs</strong> (Sangia Engine) untuk
          kalkulasi <em>Wizdam Impact Score</em>.
        </p>
        <p className="text-slate-600 leading-relaxed">
          Berbeda dengan crawler generik, WizdamCrawler didesain dengan prinsip
          <strong> respectful crawling</strong>: menghormati <code className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">robots.txt</code>, membatasi
          kecepatan permintaan, merotasi user-agent, dan memprioritaskan API publik resmi
          (OAI-PMH) sebelum menggunakan web scraping.
        </p>
      </section>

      {/* OAI-PMH: Jalur Resmi */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">OAI-PMH: Jalur Resmi & Legal</h2>
        </div>

        <p className="text-slate-600 leading-relaxed">
          <strong>Open Archives Initiative Protocol for Metadata Harvesting (OAI-PMH v2.0)</strong>
          adalah standar internasional yang digunakan repositori akademik untuk membagikan
          metadata secara terbuka. WizdamCrawler mengutamakan protokol ini karena:
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {oaiReasons.map((r, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-2">
              <div className="text-2xl">{r.icon}</div>
              <div className="font-semibold text-slate-800">{r.title}</div>
              <div className="text-sm text-slate-500">{r.desc}</div>
            </div>
          ))}
        </div>

        {/* Known OAI Endpoints */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-700">Endpoint OAI-PMH yang Dikenal</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {endpoints.map((ep, idx) => (
              <div key={idx} className="px-6 py-3 flex items-center gap-4">
                <span className="text-xl">{ep.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-800 text-sm">{ep.name}</div>
                  <div className="text-xs text-slate-400 font-mono truncate">{ep.url}</div>
                </div>
                <div className="flex-shrink-0 text-xs text-slate-500 hidden md:block">{ep.formats}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Arsitektur Pipeline */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Arsitektur Pipeline</h2>

        <div className="relative">
          <div className="grid md:grid-cols-5 gap-2 items-stretch">
            {pipeline.map((p, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full bg-${p.color}-100 text-${p.color}-700 text-xs font-bold flex items-center justify-center flex-shrink-0`}>
                    {p.step}
                  </div>
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{p.label}</div>
                </div>
                <ul className="space-y-1">
                  {p.items.map((item, i) => (
                    <li key={i} className="text-xs text-slate-500 flex items-start gap-1.5">
                      <span className={`text-${p.color}-400 mt-0.5`}>›</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kemampuan WizdamCrawler */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Kemampuan WizdamCrawler</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {capabilities.map((cap, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg bg-${cap.color}-100 flex items-center justify-center flex-shrink-0`}>
                  <svg className={`w-5 h-5 text-${cap.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={cap.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800">{cap.title}</h3>
              </div>
              <ul className="space-y-2">
                {cap.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <svg className={`w-4 h-4 text-${cap.color}-500 mt-0.5 flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Etika & Compliance */}
      <section className="bg-emerald-50 rounded-2xl border border-emerald-200 p-8 space-y-4">
        <h2 className="text-2xl font-bold text-emerald-900">Etika & Kepatuhan</h2>
        <p className="text-emerald-800">
          WizdamCrawler dirancang dengan standar etika pengumpulan data yang ketat:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {ethics.map((e, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-emerald-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <span className="font-semibold text-emerald-900 text-sm">{e.label}: </span>
                <span className="text-emerald-800 text-sm">{e.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Integrasi dengan Sangia APIs */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Integrasi dengan Sangia-APIs (Sangia Engine)</h2>
        <p className="text-slate-600 leading-relaxed">
          Data yang dipanen WizdamCrawler mengalir langsung ke
          <strong> Sangia Engine</strong> melalui pola <em>supplied_data</em> —
          data dikirim bersama permintaan analisis sehingga Sangia tidak perlu
          fetch ulang dari sumber eksternal, mengurangi latensi dan beban pada sumber data.
        </p>

        <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
          <pre className="text-sm text-slate-300 font-mono leading-relaxed">
            <code>{`{# Ilustrasi aliran data #}
WizdamCrawler
  ├── OaiPmhHarvester.harvestGaruda()   → 847 articles (oai_dc + JATS)
  ├── WebCrawler.crawlCitationNetworks() → citation counts via OpenCitations
  └── RawDataPersister.saveAuthorProfile() → cached in author_profiles_cache

CrawlerEngine.runFullCycle()
  └── yields stats: { harvested: 847, persisted: 847, errors: 0 }

ImpactAnalysisJob (queue)
  ├── RawDataPersister.loadAuthorProfile(orcid) → supplied_data
  ├── ImpactScoreClient.calculateByOrcid(...)   → POSTs supplied_data ke Sangia
  └── SangiaGateway responds: { wizdam_score: 87.4, pillar_scores: {...} }`}</code>
          </pre>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-indigo-600 rounded-2xl p-10 text-white space-y-4">
        <h2 className="text-2xl font-bold">Mulai Gunakan Data Wizdam</h2>
        <p className="text-indigo-200 max-w-lg mx-auto">
          Semua data yang dipanen oleh WizdamCrawler tersedia melalui Sangia-APIs
          dan ditampilkan di platform ini secara real-time.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link to="/researchers" className="bg-white text-indigo-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-indigo-50 transition-colors">
            Lihat Daftar Peneliti
          </Link>
          <Link to="/dashboard" className="bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-indigo-400 transition-colors border border-indigo-400">
            Buka Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
};

export default WizdamCrawlerPage;
