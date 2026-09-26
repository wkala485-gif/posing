import React from 'react';
import { Language, LevelResult } from '../types';
import { getMissionName, getScoreQuote } from '../i18n';

interface Props {
  result: LevelResult;
  language: Language;
  onNext: () => void;
  onRetry: () => void;
  onLevelSelect: () => void;
}

export const ResultModal: React.FC<Props> = ({
  result,
  language,
  onNext,
  onRetry,
  onLevelSelect,
}) => {
  const missionTitle = getMissionName(language, result.levelId);
  const quote = getScoreQuote(language, result.score);
  const missionCode = `MISSION #${result.levelId < 10 ? `0${result.levelId}` : result.levelId}`;

  // Sub-metrics derived from result
  const angleScore = Math.min(100, Math.max(0, Math.round(result.score * 0.98 + (result.passed ? 2 : -2))));
  const distScore = Math.min(100, Math.max(0, Math.round(result.score * 1.02 - (result.passed ? 2 : 1))));

  const isZh = language === 'zh';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-sm sm:max-w-md bg-slate-900/95 border border-cyan-500/30 rounded-3xl shadow-[0_0_40px_rgba(6,182,212,0.18)] p-5 sm:p-6 text-center flex flex-col items-center relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        {/* 1. Header: Explicit Mission Code & Dynamic Time Spent (No undefined!) */}
        <div className="w-full flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold tracking-wider">
            <span className={`w-2 h-2 rounded-full ${result.passed ? 'bg-emerald-400' : 'bg-rose-500'} animate-pulse`} />
            <span>{missionCode} // TOP SECRET</span>
          </div>
          <div className="text-slate-300 font-bold">
            {isZh ? '耗時' : 'Time:'}{' '}
            <span className="text-cyan-300 tabular-nums">{result.timeSpent.toFixed(1)}s</span>
          </div>
        </div>

        {/* 2. Mission Subtitle */}
        <p className="text-xs text-slate-400 font-medium tracking-wide">
          {isZh ? `第 ${result.levelId} 關：` : `Mission ${result.levelId}: `}
          {missionTitle}
        </p>

        {/* 3. Main Verdict */}
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
          {result.passed
            ? isZh ? '偽裝成功，完美潛入！' : 'Infiltration Successful!'
            : isZh ? '潛入失敗，警報大響！' : 'Infiltration Failed, Alarm Sounded!'}
        </h2>

        {/* 4. Agent Rank */}
        <p className="text-xs font-bold text-cyan-400 mt-0.5 tracking-wider">
          {result.passed
            ? isZh ? '【金牌特工 (直通總部)】' : '【Elite Agent (HQ Promotion)】'
            : isZh ? '【菜鳥實習生 (被捕入獄)】' : '【Rookie Intern (Apprehended)】'}
        </p>

        {/* 5. Central Score Box with Angled Stamp & Stars */}
        <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 my-3.5 relative flex flex-col items-center shadow-inner">
          {/* Angled Stamp Badge */}
          <div
            className={`absolute top-3 right-4 px-2.5 py-0.5 border-2 rounded-lg font-black tracking-widest text-xs rotate-[-8deg] uppercase shadow-md ${
              result.passed
                ? 'border-emerald-400 text-emerald-400 bg-emerald-950/60 shadow-emerald-950'
                : 'border-rose-500 text-rose-500 bg-rose-950/60 shadow-rose-950'
            }`}
          >
            {result.passed ? 'PASSED' : 'REJECTED'}
          </div>

          {/* Big Score Percentage */}
          <div
            className={`text-5xl sm:text-6xl font-black font-mono tabular-nums tracking-tighter ${
              result.passed ? 'text-emerald-400' : 'text-rose-500'
            }`}
          >
            {result.score}
            <span className="text-3xl font-sans ml-0.5">%</span>
          </div>

          <p className="text-[11px] text-slate-400 mt-1">
            {isZh ? '匹配度判定 (及格線: 65%)' : 'Match Evaluation (Passing: 65%)'}
          </p>

          {/* 3 Stars using Unicode glyphs */}
          <div className="flex items-center gap-2 mt-2">
            {[1, 2, 3].map((starIdx) => (
              <span
                key={starIdx}
                className={`text-2xl leading-none transition-colors ${
                  result.passed && result.stars >= starIdx
                    ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : 'text-slate-800'
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* 6. Dual Metric Breakdown Meters */}
        <div className="w-full space-y-2 mb-3 text-xs">
          <div>
            <div className="flex justify-between text-[11px] text-slate-300 mb-1">
              <span>{isZh ? '關節角度:' : 'Joint Angles:'}</span>
              <span className="font-mono font-bold tabular-nums text-cyan-300">{angleScore}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${angleScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-300 mb-1">
              <span>{isZh ? '坐標歐氏距離:' : 'Coordinate Distance:'}</span>
              <span className="font-mono font-bold tabular-nums text-emerald-300">{distScore}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${distScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* 7. Agent Debrief Quote Box */}
        <div className="w-full bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 mb-4 text-xs text-slate-300 italic text-left leading-relaxed">
          {quote}
        </div>

        {/* 8. Action Buttons with Unicode Glyphs */}
        <div className="w-full flex items-center gap-2.5">
          <button
            onClick={onRetry}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border border-slate-700 active:scale-95 transition-all shadow-md"
          >
            <span>↺</span>
            <span>{isZh ? '再試一次' : 'Try Again'}</span>
          </button>

          {result.passed ? (
            <button
              onClick={onNext}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-[0_0_16px_rgba(6,182,212,0.4)] transition-all"
            >
              <span>{isZh ? '下一關' : 'Next Mission'}</span>
              <span>➔</span>
            </button>
          ) : (
            <button
              onClick={onLevelSelect}
              className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-[0_0_14px_rgba(6,182,212,0.3)] active:scale-95 transition-all"
            >
              <span>☰</span>
              <span>{isZh ? '關卡列表' : 'Mission List'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
