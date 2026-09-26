import React, { useState } from 'react';
import { Language } from '../types';
import { I18N, getMissionName } from '../i18n';

interface Props {
  currentLevel: number;
  highestUnlocked: number;
  levelScores: Record<number, { score: number; stars: number }>;
  language: Language;
  onSelectLevel: (lvl: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<Props> = ({
  currentLevel,
  highestUnlocked,
  levelScores,
  language,
  onSelectLevel,
  onClose,
}) => {
  const t = I18N[language];
  const [selectedTier, setSelectedTier] = useState<1 | 2 | 3 | 4>(
    currentLevel >= 81 ? 4 : currentLevel >= 41 ? 3 : currentLevel >= 21 ? 2 : 1
  );
  const [showRules, setShowRules] = useState(false);

  // Range of levels per tier
  const tierRanges = {
    1: { start: 1, end: 20, name: t.tier1Name, desc: 'Solo · Visible Shadow · 45s · Real-time Glow' },
    2: { start: 21, end: 40, name: t.tier2Name, desc: 'Duo · Blue & Orange · 45s · Real-time Glow' },
    3: { start: 41, end: 80, name: t.tier3Name, desc: 'Solo Memory · 3s Preview · 20s Blind · Peek (1s)' },
    4: { start: 81, end: 100, name: t.tier4Name, desc: 'Duo Memory · 3s Preview · 10s Urgent · Peek (1s)' },
  };

  const currentRange = tierRanges[selectedTier];
  const levelList = Array.from(
    { length: currentRange.end - currentRange.start + 1 },
    (_, i) => currentRange.start + i
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-lg max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-wide">
              {t.levelSelect}
            </h2>
            <button
              onClick={() => setShowRules(!showRules)}
              className="px-1.5 py-0.5 rounded-md text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-900/50 transition-colors"
              title={t.howToPlay}
            >
              ❓ {t.howToPlay}
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* How to Play accordion banner */}
        {showRules && (
          <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 text-xs text-slate-300 space-y-1.5 animate-slide-down">
            <p className="font-bold text-emerald-400">{t.howToPlay}:</p>
            {t.rules.map((rule, idx) => (
              <p key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold shrink-0">{idx + 1}.</span>
                <span>{rule}</span>
              </p>
            ))}
          </div>
        )}

        {/* Tier Tabs (Segmented Control) */}
        <div className="p-2 bg-slate-950/60 border-b border-slate-800 grid grid-cols-4 gap-1">
          {([1, 2, 3, 4] as const).map((tierNum) => (
            <button
              key={tierNum}
              onClick={() => setSelectedTier(tierNum)}
              className={`py-2 px-1 rounded-lg text-[11px] font-bold tracking-tight transition-all truncate text-center ${
                selectedTier === tierNum
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              {t.tier} {tierNum}
            </button>
          ))}
        </div>

        {/* Tier Description */}
        <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="font-semibold text-slate-300">{currentRange.name}</span>
          <span className="text-[10px] text-slate-500">{currentRange.desc}</span>
        </div>

        {/* Level Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {levelList.map((lvl) => {
            const isUnlocked = lvl <= highestUnlocked + 1; // allow playing next unlocked
            const isCurrent = lvl === currentLevel;
            const record = levelScores[lvl];
            const missionName = getMissionName(language, lvl);

            return (
              <button
                key={lvl}
                onClick={() => {
                  if (isUnlocked) {
                    onSelectLevel(lvl);
                    onClose();
                  }
                }}
                disabled={!isUnlocked}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-emerald-950/40 border-emerald-500/70 shadow-md ring-1 ring-emerald-500/30'
                    : isUnlocked
                    ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    : 'bg-slate-950/20 border-slate-900/60 opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-mono font-bold text-xs text-white">
                    #{lvl}
                  </span>
                  {isUnlocked ? (
                    record ? (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map((s) => (
                          <span
                            key={s}
                            className={`text-xs leading-none ${
                              record.stars >= s
                                ? 'text-amber-400'
                                : 'text-slate-700'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500 font-bold text-sm">›</span>
                    )
                  ) : (
                    <span className="text-xs">🔒</span>
                  )}
                </div>

                <p className="text-[11px] text-slate-300 font-medium truncate w-full">
                  {missionName}
                </p>

                {record && (
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{record.score}%</span>
                    <span className="text-emerald-400 font-bold">PASSED</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
