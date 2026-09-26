import React from 'react';
import { GamePhase, Language, LevelData } from '../types';
import { I18N, getMissionName } from '../i18n';

interface Props {
  levelData: LevelData;
  language: Language;
  remainingTime: number;
  previewCountdown: number;
  gamePhase: GamePhase;
  similarityScore: number;
  onToggleLanguage: () => void;
  onOpenLevelSelect: () => void;
}

export const HUD: React.FC<Props> = ({
  levelData,
  language,
  remainingTime,
  previewCountdown,
  gamePhase,
  similarityScore,
  onToggleLanguage,
  onOpenLevelSelect,
}) => {
  const missionTitle = getMissionName(language, levelData.id);
  const isUrgent = remainingTime <= 5 && gamePhase === 'PLAYING';

  // Dynamic status text strictly synced with live score
  let dynamicCritique = '';
  if (language === 'zh') {
    if (similarityScore < 40) {
      dynamicCritique = '差距過大！請調整肢體！';
    } else if (similarityScore < 65) {
      dynamicCritique = '角度接近中！繼續微調！';
    } else {
      dynamicCritique = '對齊完美！隨時可提交！';
    }
  } else {
    if (similarityScore < 40) {
      dynamicCritique = 'Far from target! Needs adjustment!';
    } else if (similarityScore < 65) {
      dynamicCritique = 'Getting closer, keep tweaking!';
    } else {
      dynamicCritique = 'Well aligned! Ready to submit!';
    }
  }

  const missionTip =
    language === 'zh'
      ? '雙腳踩牢地面 · 展開四肢 · 對齊影子'
      : 'Plant feet on ground · Spread limbs · Match shadow';

  return (
    <div className="w-full z-20 shrink-0 flex flex-col bg-slate-950/95 backdrop-blur-xl border-b border-cyan-500/25 select-none">
      {/* 1. Sleek, Single-Row Top Header: ONLY Mission List, Mission Title, Timer, and Language Toggle */}
      <header className="px-3 sm:px-5 py-2 flex items-center justify-between gap-2 border-b border-cyan-500/15 flex-nowrap overflow-hidden">
        {/* Left: Missions List Button (☰) & Mission Title */}
        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
          <button
            onClick={onOpenLevelSelect}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/35 text-cyan-200 text-xs font-bold tracking-tight shadow-[0_0_10px_rgba(6,182,212,0.15)] transition-all active:scale-95 shrink-0 whitespace-nowrap"
            title={language === 'zh' ? '關卡清單' : 'Missions List'}
          >
            <span className="text-sm">☰</span>
            <span className="tabular-nums font-mono">
              {language === 'zh' ? `第 ${levelData.id} 關` : `Lvl ${levelData.id}`}
            </span>
          </button>

          <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
            <span className="text-teal-400 font-extrabold text-xs shrink-0 font-mono">[探]</span>
            <h1 className="text-xs sm:text-sm font-extrabold text-white truncate leading-tight">
              {missionTitle}
            </h1>
          </div>
        </div>

        {/* Right: Timer (⏱) & Language Toggle (🌐 EN/中) - Strictly No Wrapping */}
        <div className="flex items-center gap-2 shrink-0 flex-nowrap">
          {/* Timer Countdown Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all shrink-0 whitespace-nowrap ${
              isUrgent
                ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-[0_0_14px_rgba(244,63,94,0.4)] animate-pulse'
                : 'bg-slate-900/90 border-cyan-500/30 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
            }`}
          >
            <span className="text-xs">⏱</span>
            <span className="tabular-nums font-black text-white">
              {gamePhase === 'PREVIEW'
                ? `${Math.ceil(previewCountdown)}s`
                : `${remainingTime.toFixed(0)}s`}
            </span>
          </div>

          {/* Clean Language Toggle (Never squished or wrapped) */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 text-xs font-bold transition-all active:scale-95 shadow-[0_0_10px_rgba(6,182,212,0.15)] shrink-0 whitespace-nowrap"
            title="Switch Language / 切換語言"
          >
            <span className="text-xs">🌐</span>
            <span className="flex items-center gap-0.5">
              <span className={language === 'en' ? 'text-cyan-300 font-black' : 'text-slate-400'}>EN</span>
              <span className="text-cyan-500/40">/</span>
              <span className={language === 'zh' ? 'text-cyan-300 font-black' : 'text-slate-400'}>中</span>
            </span>
          </button>
        </div>
      </header>

      {/* 2. Live Similarity Bar & Critique */}
      <div className="px-3 sm:px-5 py-2 bg-slate-950/50">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[10px] font-mono text-cyan-400 tracking-wider font-semibold">
            STAGE {levelData.tier} // MISSION {levelData.id < 10 ? `0${levelData.id}` : levelData.id}
          </div>

          {/* Right: Similarity Score */}
          <div className="flex items-baseline gap-1 shrink-0">
            <span className="text-[11px] text-slate-400 font-medium">
              {language === 'zh' ? '相似度:' : 'Match:'}
            </span>
            <span
              className={`text-xl sm:text-2xl font-black font-mono tabular-nums ${
                similarityScore >= 65
                  ? 'text-emerald-400'
                  : similarityScore >= 40
                  ? 'text-amber-400'
                  : 'text-rose-500'
              }`}
            >
              {similarityScore}%
            </span>
          </div>
        </div>

        {/* Live Similarity Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800/80 overflow-hidden mt-1.5 relative">
          <div
            className={`h-full transition-all duration-200 rounded-full ${
              similarityScore >= 65
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                : similarityScore >= 40
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                : 'bg-gradient-to-r from-rose-600 to-pink-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(3, similarityScore))}%` }}
          />
          {/* 65% Passing Threshold Mark */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white/40 pointer-events-none"
            style={{ left: '65%' }}
            title="65% Passing Threshold"
          />
        </div>

        {/* Critique Badge and Mission Tip */}
        <div className="flex items-center justify-between gap-2 mt-1.5 text-[11px]">
          <div
            className={`px-2 py-0.5 rounded-md border text-[10px] font-bold tracking-tight truncate ${
              similarityScore >= 65
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : similarityScore >= 40
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
            }`}
          >
            {dynamicCritique}
          </div>

          <div className="text-slate-400 truncate text-[10px] hidden xs:block">
            {missionTip}
          </div>
        </div>
      </div>
    </div>
  );
};
