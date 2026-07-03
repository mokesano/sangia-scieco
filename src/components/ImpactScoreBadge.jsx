import React from 'react';

/**
 * ImpactScoreBadge Component
 * Transformasi dari impact_score_badge.twig
 * @param {Object} score - {composite_score, pillar_academic, pillar_social, pillar_economic, pillar_sdg}
 * @param {string} size - 'sm' | 'md' | 'lg' (default: 'md')
 * @param {boolean} showPillars - (default: true)
 */
const ImpactScoreBadge = ({ score, size = 'md', showPillars = true }) => {
  if (!score) {
    return <div className="text-slate-400 text-xs italic">Skor belum tersedia</div>;
  }

  const cs = Math.round(score.composite_score * 10) / 10;
  
  // Determine color based on score
  let color = 'slate';
  if (cs >= 80) color = 'emerald';
  else if (cs >= 60) color = 'blue';
  else if (cs >= 40) color = 'amber';

  // Size classes
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    lg: 'w-20 h-20 text-2xl',
  };

  const badgeSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="impact-score-badge inline-flex flex-col items-center gap-1">
      {/* Skor Komposit Utama */}
      <div
        className={`
          ${badgeSize}
          rounded-full bg-${color}-100 border-2 border-${color}-400
          flex items-center justify-center font-bold text-${color}-700
          ring-4 ring-${color}-50
        `}
      >
        {cs}
      </div>
      <span className="text-xs text-slate-500 font-medium">Impact Score</span>

      {/* 4 Pilar */}
      {showPillars && size !== 'sm' && (
        <div className="grid grid-cols-4 gap-1 mt-1 text-center text-xs">
          <div className="pillar-item">
            <div className="font-semibold text-blue-600">
              {Math.round(score.pillar_academic)}
            </div>
            <div className="text-slate-400">Akademik</div>
          </div>
          <div className="pillar-item">
            <div className="font-semibold text-violet-600">
              {Math.round(score.pillar_social)}
            </div>
            <div className="text-slate-400">Sosial</div>
          </div>
          <div className="pillar-item">
            <div className="font-semibold text-amber-600">
              {Math.round(score.pillar_economic)}
            </div>
            <div className="text-slate-400">Ekonomi</div>
          </div>
          <div className="pillar-item">
            <div className="font-semibold text-emerald-600">
              {Math.round(score.pillar_sdg)}
            </div>
            <div className="text-slate-400">SDG</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImpactScoreBadge;
