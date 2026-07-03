import React from 'react';

/**
 * SdgCard Component
 * Transformasi dari sdg_card.twig
 * @param {Array} sdgTags - Array of {sdg: int, label: string, score: float, color: string}
 * @param {number} maxShow - Maximum number of tags to show (default: 5)
 */
const SdgCard = ({ sdgTags = [], maxShow = 5 }) => {
  if (!sdgTags || sdgTags.length === 0) {
    return <p className="text-xs text-slate-400 italic">Belum ada klasifikasi SDG.</p>;
  }

  const visibleTags = sdgTags.slice(0, maxShow);
  const remainingCount = sdgTags.length - maxShow;

  return (
    <div className="sdg-card-group flex flex-wrap gap-2">
      {visibleTags.map((tag, index) => (
        <div
          key={index}
          className="sdg-pill flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
          style={{ backgroundColor: tag.color }}
          title={`${tag.label} (kepercayaan: ${Math.round(tag.score * 100)}%)`}
        >
          <span className="sdg-number font-bold opacity-80">SDG {tag.sdg}</span>
          <span className="sdg-label hidden sm:inline truncate max-w-[120px]">{tag.label}</span>
        </div>
      ))}

      {remainingCount > 0 && (
        <div className="sdg-pill flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-600">
          +{remainingCount} lainnya
        </div>
      )}
    </div>
  );
};

export default SdgCard;
