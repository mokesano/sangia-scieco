import React, { useState, useRef } from 'react';

/**
 * PdfCompressPage Component
 * 
 * Halaman untuk kompresi file PDF menggunakan API backend.
 */

const PdfCompressPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [quality, setQuality] = useState('ebook');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const qualityPresets = ['screen', 'ebook', 'printer', 'prepress'];
  const qualityLabels = {
    screen: 'Screen (72 dpi)',
    ebook: 'eBook (150 dpi)',
    printer: 'Printer (300 dpi)',
    prepress: 'Prepress (CMYK)'
  };

  const handleFile = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('File harus berupa PDF');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('Ukuran file maksimal 50 MB');
      return;
    }
    setError(null);
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dropZoneRef.current?.classList.remove('border-indigo-500');
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dropZoneRef.current?.classList.add('border-indigo-500');
  };

  const handleDragLeave = () => {
    dropZoneRef.current?.classList.remove('border-indigo-500');
  };

  const handleCompress = async () => {
    if (!selectedFile) return;

    setError(null);
    setResult(null);
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('pdf', selectedFile);
    formData.append('quality', quality);

    try {
      const response = await fetch('/api/tools/pdf-compress', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult({
          originalKb: data.original_kb,
          compressedKb: data.compressed_kb,
          reductionPct: data.reduction_pct,
          url: data.url
        });
      }
    } catch (e) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">PDF Compressor</h1>
        <p className="text-slate-500 text-sm mt-1">Kompres file PDF menggunakan Ghostscript. Maksimal 50 MB.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
        {/* Drop Zone */}
        <div
          ref={dropZoneRef}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
        >
          <svg className="w-10 h-10 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <p className="text-slate-500 text-sm">
            Seret PDF ke sini atau <span className="text-indigo-600 font-medium">klik untuk memilih</span>
          </p>
          <input
            type="file"
            ref={fileInputRef}
            accept="application/pdf"
            onChange={(e) => handleFile(e.target.files[0])}
            className="hidden"
          />
        </div>

        {/* File selected indicator */}
        {selectedFile && (
          <div className="text-center text-sm text-slate-600">
            ✓ {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
          </div>
        )}

        {/* Preset Kualitas */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">Preset Kualitas</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {qualityPresets.map((preset) => (
              <label key={preset} className="cursor-pointer">
                <input
                  type="radio"
                  name="quality"
                  value={preset}
                  checked={quality === preset}
                  onChange={(e) => setQuality(e.target.value)}
                  className="peer sr-only"
                />
                <div className={`text-center border rounded-lg px-2 py-2 text-xs text-slate-600 transition-colors
                  peer-checked:border-indigo-500 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 peer-checked:font-semibold
                  hover:border-indigo-300`}>
                  {qualityLabels[preset]}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Compress Button */}
        <button
          onClick={handleCompress}
          disabled={!selectedFile || isProcessing}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {isProcessing ? 'Memproses...' : 'Kompres Sekarang'}
        </button>

        {/* Progress */}
        {isProcessing && (
          <div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 animate-pulse w-full"></div>
            </div>
            <p className="text-xs text-slate-400 text-center mt-1">Memproses dengan Ghostscript…</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4 space-y-3">
            <p className="text-sm font-semibold text-emerald-700">Kompresi Berhasil!</p>
            <div className="flex flex-wrap gap-4 text-xs text-emerald-600">
              <span>Semula: <strong>{result.originalKb} KB</strong></span>
              <span>Sesudah: <strong>{result.compressedKb} KB</strong></span>
              <span>Pengurangan: <strong>{result.reductionPct}%</strong></span>
            </div>
            <a
              href={result.url}
              download="compressed.pdf"
              className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Unduh PDF Terkompresi
            </a>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfCompressPage;
