import React, { useState, useRef } from 'react';

/**
 * ImageResizerPage Component
 * 
 * Halaman untuk resize gambar langsung di browser menggunakan Canvas API.
 */

const ImageResizerPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(0);
  const [quality, setQuality] = useState(85);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPEG, PNG, WebP, atau GIF)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran file maksimal 10 MB');
      return;
    }
    setError(null);
    setSelectedFile(file);
    
    // Create preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
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

  const handleResize = async () => {
    if (!selectedFile || !canvasRef.current) return;

    setError(null);
    setResult(null);
    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = previewUrl;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Calculate dimensions
      let newWidth = width;
      let newHeight = height;

      if (height === 0) {
        // Maintain aspect ratio
        const ratio = img.height / img.width;
        newHeight = Math.round(width * ratio);
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Draw resized image
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setResult({
              sizeKb: (blob.size / 1024).toFixed(1),
              width: newWidth,
              height: newHeight,
              url: url
            });
          } else {
            setError('Gagal memproses gambar');
          }
          setIsProcessing(false);
        },
        selectedFile.type === 'image/png' ? 'image/png' : 'image/jpeg',
        quality / 100
      );
    } catch (e) {
      setError('Terjadi kesalahan saat memproses gambar');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Image Resizer</h1>
        <p className="text-slate-500 text-sm mt-1">Resize gambar JPEG, PNG, WebP, atau GIF langsung di browser. Maksimal 10 MB.</p>
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-slate-500 text-sm">
            Seret gambar ke sini atau <span className="text-indigo-600 font-medium">klik untuk memilih</span>
          </p>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={(e) => handleFile(e.target.files[0])}
            className="hidden"
          />
        </div>

        {/* File selected indicator */}
        {selectedFile && (
          <div className="text-center text-sm text-slate-600">
            ✓ {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
          </div>
        )}

        {/* Preview */}
        {previewUrl && (
          <div className="flex justify-center">
            <img src={previewUrl} alt="Preview" className="max-h-48 rounded-lg shadow-sm" />
          </div>
        )}

        {/* Controls */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Lebar (px)</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value) || 800)}
              min="1"
              max="5000"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Tinggi (px, 0=proporsional)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
              min="0"
              max="5000"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Kualitas (%)</label>
            <input
              type="number"
              value={quality}
              onChange={(e) => setQuality(Math.min(100, Math.max(10, parseInt(e.target.value) || 85)))}
              min="10"
              max="100"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Resize Button */}
        <button
          onClick={handleResize}
          disabled={!selectedFile || isProcessing}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {isProcessing ? 'Memproses...' : 'Resize Sekarang'}
        </button>

        {/* Progress */}
        {isProcessing && (
          <div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 animate-pulse w-full"></div>
            </div>
            <p className="text-xs text-slate-400 text-center mt-1">Memproses…</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
            <p className="text-sm font-semibold text-slate-700">Hasil Resize</p>
            <div className="flex gap-4 text-xs text-slate-500">
              <span>Ukuran: <strong className="text-slate-800">{result.sizeKb} KB</strong></span>
              <span>Dimensi: <strong className="text-slate-800">{result.width} × {result.height}</strong></span>
            </div>
            <a
              href={result.url}
              download={`resized-${selectedFile.name}`}
              className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Unduh Gambar
            </a>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default ImageResizerPage;
