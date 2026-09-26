import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GamePhase, Language, LevelData, LevelResult, LimbMatchMap, StickmanPose } from './types';
import { getBrowserLanguage } from './i18n';
import { getLevelData } from './data/levels';
import {
  evaluateLimbMatches,
  calculateAccuracy,
} from './utils/kinematics';
import { sounds } from './utils/audio';
import { StickmanCanvas } from './components/StickmanCanvas';
import { HUD } from './components/HUD';
import { ResultModal } from './components/ResultModal';
import { LevelSelectModal } from './components/LevelSelectModal';

export default function App() {
  // Bilingual state with browser auto-detect
  const [language, setLanguage] = useState<Language>(() => getBrowserLanguage());

  // Audio mute state
  const [isMuted, setIsMuted] = useState(false);

  // Level Progression State
  const [currentLevelId, setCurrentLevelId] = useState<number>(() => {
    const saved = localStorage.getItem('shadow_agent_lvl');
    return saved ? Math.max(1, parseInt(saved, 10)) : 1;
  });

  const [highestUnlocked, setHighestUnlocked] = useState<number>(() => {
    const saved = localStorage.getItem('shadow_agent_unlocked');
    return saved ? Math.max(1, parseInt(saved, 10)) : 1;
  });

  const [levelScores, setLevelScores] = useState<Record<number, { score: number; stars: number }>>(() => {
    const saved = localStorage.getItem('shadow_agent_scores');
    return saved ? JSON.parse(saved) : {};
  });

  // Current Level Data
  const [levelData, setLevelData] = useState<LevelData>(() => getLevelData(currentLevelId));

  // Stickman Poses (User current poses)
  const [userPoses, setUserPoses] = useState<StickmanPose[]>(() =>
    JSON.parse(JSON.stringify(levelData.initialPoses))
  );

  // Limb Match Status (with 10px hysteresis buffer & strict dual-bone 15 deg rule)
  const [limbMatches, setLimbMatches] = useState<LimbMatchMap>({});

  // Game Phases: 'PREVIEW' | 'PLAYING' | 'REVEAL' | 'RESULT'
  const [gamePhase, setGamePhase] = useState<GamePhase>('PLAYING');

  // Timers
  const [remainingTime, setRemainingTime] = useState<number>(levelData.timeLimit);
  const [previewCountdown, setPreviewCountdown] = useState<number>(levelData.previewTime);

  // Peek State (Memory Mode)
  const [peeksLeft, setPeeksLeft] = useState<number>(levelData.peeksAllowed);
  const [isPeeking, setIsPeeking] = useState<boolean>(false);

  // Modals
  const [result, setResult] = useState<LevelResult | null>(null);
  const [showLevelSelect, setShowLevelSelect] = useState<boolean>(false);

  // ===== Step-1 Flat Slit Test Mode (temporary verification) =====
  const [flatTestMode, setFlatTestMode] = useState(false);
  const [flatStatus, setFlatStatus] = useState<{ pass: boolean; bodyHeight: number; heightRatio: number } | null>(null);

  // Reference for last tick sound
  const lastTickSecondRef = useRef<number>(-1);

  // Synchronized refs to guarantee latest state during timeout evaluation
  const userPosesRef = useRef<StickmanPose[]>(userPoses);
  userPosesRef.current = userPoses;

  const levelDataRef = useRef<LevelData>(levelData);
  levelDataRef.current = levelData;

  const currentLevelIdRef = useRef<number>(currentLevelId);
  currentLevelIdRef.current = currentLevelId;

  const remainingTimeRef = useRef<number>(remainingTime);
  remainingTimeRef.current = remainingTime;

  // Setup level when currentLevelId changes
  const initLevel = useCallback((lvlId: number) => {
    const data = getLevelData(lvlId);
    setLevelData(data);
    setUserPoses(JSON.parse(JSON.stringify(data.initialPoses)));
    setLimbMatches({});
    setResult(null);
    setIsPeeking(false);
    setPeeksLeft(data.peeksAllowed);
    setRemainingTime(data.timeLimit);
    lastTickSecondRef.current = -1;

    if (data.isMemoryMode && data.previewTime > 0) {
      setGamePhase('PREVIEW');
      setPreviewCountdown(data.previewTime);
    } else {
      setGamePhase('PLAYING');
      setPreviewCountdown(0);
    }
  }, []);

  useEffect(() => {
    initLevel(currentLevelId);
  }, [currentLevelId, initLevel]);

  // Real-time Limb Alignment Glow with strict dual-bone criteria
  useEffect(() => {
    const { updatedMatches, newGlowOccurred } = evaluateLimbMatches(
      userPoses,
      levelData.targets,
      limbMatches
    );

    setLimbMatches(updatedMatches);

    // Only play audio / haptic in non-memory mode or during reveal!
    if (newGlowOccurred && (!levelData.isMemoryMode || gamePhase === 'REVEAL')) {
      sounds.playLimbGlow();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(10);
      }
    }
  }, [userPoses, levelData.targets, levelData.isMemoryMode, gamePhase]);

  // Single unified evaluation logic for BOTH Manual Submit and Timeout
  const evaluateAndSubmit = useCallback((finalRemainingTime: number) => {
    sounds.playSubmitScan();
    setGamePhase('REVEAL');

    const currentLevel = levelDataRef.current;
    const currentPoses = userPosesRef.current;
    const currentLvlId = currentLevelIdRef.current;

    // Dynamic actual time spent: initialTime - remainingTime (Strictly no placeholder!)
    const initialTime = currentLevel.timeLimit;
    const timeSpent = Math.max(0.1, Number((initialTime - finalRemainingTime).toFixed(1)));

    // Dynamic accuracy calculation from live poses
    const { overallScore, limbAccuracies } = calculateAccuracy(
      currentPoses,
      currentLevel.targets
    );

    // UNIFIED PASS CRITERIA: ONLY score >= 65 determines pass. Timeout NEVER forces a fake fail!
    const passed = overallScore >= 65;
    let stars = 0;
    if (passed) {
      stars = overallScore >= 92 ? 3 : overallScore >= 80 ? 2 : 1;
    }

    // Delay result modal slightly for reveal animation
    setTimeout(() => {
      if (passed) {
        sounds.playVictory();
        // Update highest unlocked
        setHighestUnlocked((prev) => {
          const next = Math.max(prev, currentLvlId + 1);
          localStorage.setItem('shadow_agent_unlocked', next.toString());
          return next;
        });
        // Save best score
        setLevelScores((prev) => {
          const currentBest = prev[currentLvlId];
          const newBest = {
            score: Math.max(currentBest?.score || 0, overallScore),
            stars: Math.max(currentBest?.stars || 0, stars),
          };
          const updated = { ...prev, [currentLvlId]: newBest };
          localStorage.setItem('shadow_agent_scores', JSON.stringify(updated));
          return updated;
        });
      } else {
        sounds.playDefeat();
      }

      setResult({
        levelId: currentLvlId,
        passed,
        score: overallScore,
        timeSpent,
        stars,
        quoteKey: `q${currentLvlId}`,
        limbAccuracies,
      });
      setGamePhase('RESULT');
    }, 800);
  }, []);

  // Main Game Loop Timer (Countdown & Phase Transitions)
  useEffect(() => {
    let timerId: number | null = null;

    if (gamePhase === 'PREVIEW') {
      timerId = window.setInterval(() => {
        setPreviewCountdown((prev) => {
          if (prev <= 0.1) {
            setGamePhase('PLAYING');
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
    } else if (gamePhase === 'PLAYING') {
      timerId = window.setInterval(() => {
        setRemainingTime((prev) => {
          const next = prev - 0.1;

          // Sound tick on last 5 seconds
          const roundedSec = Math.ceil(next);
          if (roundedSec <= 5 && roundedSec > 0 && roundedSec !== lastTickSecondRef.current) {
            lastTickSecondRef.current = roundedSec;
            sounds.playTick();
          }

          if (next <= 0.05) {
            if (timerId !== null) clearInterval(timerId);
            evaluateAndSubmit(0);
            return 0;
          }
          return next;
        });
      }, 100);
    }

    return () => {
      if (timerId !== null) {
        clearInterval(timerId);
      }
    };
  }, [gamePhase, evaluateAndSubmit]);

  // Peek Button Action (Memory Mode)
  const handlePeek = () => {
    if (peeksLeft <= 0 || isPeeking || gamePhase !== 'PLAYING') return;

    sounds.playPeek();
    setIsPeeking(true);
    setPeeksLeft((prev) => Math.max(0, prev - 1));

    // Flash shadow for 1.0s then vanish
    setTimeout(() => {
      setIsPeeking(false);
    }, 1000);
  };

  // Live Similarity Score calculation
  const liveAccuracy = calculateAccuracy(userPoses, levelData.targets);
  const liveSimilarityScore = liveAccuracy.overallScore;

  // Language Switcher Toggle
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'zh' : 'en'));
  };

  // Audio Mute Toggle
  const toggleSound = () => {
    setIsMuted((prev) => {
      const next = !prev;
      sounds.isMuted = next;
      return next;
    });
  };

  // Shadow Visibility Logic:
  const showShadow =
    !levelData.isMemoryMode ||
    gamePhase === 'PREVIEW' ||
    isPeeking ||
    gamePhase === 'REVEAL' ||
    gamePhase === 'RESULT';

  // Blind Phase is when user is posing in memory mode without peek
  const isMemoryBlindPhase =
    levelData.isMemoryMode && gamePhase === 'PLAYING' && !isPeeking;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex flex-col font-sans select-none touch-none">
      {/* 1. Header & Stage Info HUD */}
      <HUD
        levelData={levelData}
        language={language}
        remainingTime={remainingTime}
        previewCountdown={previewCountdown}
        gamePhase={gamePhase}
        similarityScore={liveSimilarityScore}
        onToggleLanguage={toggleLanguage}
        onOpenLevelSelect={() => setShowLevelSelect(true)}
      />

      {/* 2. Main Play Area */}
      <main className="flex-1 w-full relative flex items-center justify-center p-2 overflow-hidden">
        <StickmanCanvas
          userPoses={userPoses}
          targetPoses={levelData.targets}
          limbMatches={limbMatches}
          showShadow={showShadow && !flatTestMode}
          isMemoryBlindPhase={isMemoryBlindPhase}
          isDuo={levelData.isDuo}
          language={language}
          onPoseChange={(poses) => setUserPoses(poses)}
          interactive={gamePhase === 'PLAYING' || flatTestMode}
          flatTestMode={flatTestMode}
          onFlatStatusChange={setFlatStatus}
        />

        {/* Peek active flash indicator */}
        {isPeeking && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-mono text-xs font-bold animate-pulse pointer-events-none z-30">
            👁️ PEEKING (1s)
          </div>
        )}

        {/* ===== Step-1 Flat Test HUD ===== */}
        {flatTestMode && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1.5 pointer-events-none">
            <div className={`px-4 py-1.5 rounded-full font-mono text-sm font-bold border ${
              flatStatus?.pass
                ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300'
                : 'bg-rose-500/20 border-rose-400 text-rose-300'
            }`}>
              {flatStatus?.pass ? '✓ FLAT ENOUGH – CAN PASS' : '✗ TOO TALL – FLATTEN MORE'}
            </div>
            {flatStatus && (
              <div className="text-[11px] font-mono text-slate-400">
                height {flatStatus.bodyHeight.toFixed(0)}px / ratio {(flatStatus.heightRatio * 100).toFixed(0)}%
              </div>
            )}
          </div>
        )}
      </main>

      {/* 3. Bottom Action Panel: Reset, Sound, Peek, and Submit Pose */}
      <footer className="w-full px-3 py-2 sm:px-6 sm:py-3 bg-slate-950/95 border-t border-cyan-500/25 backdrop-blur-md flex items-center justify-between gap-2 z-20 shrink-0">
        {/* Left Action Buttons: Reset & Sound */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => initLevel(currentLevelId)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-200 text-xs font-bold transition-all active:scale-95 shadow-md whitespace-nowrap"
            title={language === 'zh' ? '重新開始關卡' : 'Reset Level'}
          >
            <span className="text-sm">↺</span>
            <span className="hidden xs:inline">{language === 'zh' ? '重置' : 'Reset'}</span>
          </button>

          {/* Temporary Step-1 Flat Test toggle */}
          <button
            onClick={() => setFlatTestMode((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all active:scale-95 shadow-md whitespace-nowrap ${
              flatTestMode
                ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200'
                : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 hover:border-cyan-500/50 text-slate-200'
            }`}
            title="Step-1: Static Flat Slit Test"
          >
            <span className="text-sm">═</span>
            <span className="hidden xs:inline">{flatTestMode ? 'Flat ON' : 'Flat Test'}</span>
          </button>

          <button
            onClick={toggleSound}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-200 text-xs font-bold transition-all active:scale-95 shadow-md whitespace-nowrap"
            title={isMuted ? (language === 'zh' ? '開啟音效' : 'Unmute') : (language === 'zh' ? '靜音' : 'Mute')}
          >
            <span className="text-sm">{isMuted ? '🔇' : '🔊'}</span>
            <span className="hidden xs:inline">{isMuted ? (language === 'zh' ? '靜音' : 'Muted') : (language === 'zh' ? '音效' : 'Sound')}</span>
          </button>

          {/* Peek button in memory mode */}
          {levelData.isMemoryMode && gamePhase === 'PLAYING' && (
            <button
              onClick={handlePeek}
              disabled={peeksLeft <= 0 || isPeeking}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all active:scale-95 whitespace-nowrap ${
                peeksLeft > 0 && !isPeeking
                  ? 'bg-amber-950/80 border-amber-500/60 text-amber-300'
                  : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <span>👁️</span>
              <span className="hidden xs:inline">{language === 'zh' ? '偷看' : 'Peek'}</span>
              <span className="font-mono text-[11px]">({peeksLeft})</span>
            </button>
          )}
        </div>

        {/* Center / Right: Submit Pose Button */}
        <button
          onClick={() => evaluateAndSubmit(remainingTime)}
          disabled={gamePhase !== 'PLAYING'}
          className="flex-1 max-w-sm py-2.5 sm:py-3 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 active:scale-[0.98] text-slate-950 font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(6,182,212,0.35)] transition-all disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap ml-auto"
        >
          <span className="text-sm sm:text-base">✔️</span>
          <span className="text-sm sm:text-base">📸</span>
          <span>
            {language === 'zh' ? '提交姿勢 (特工考核)' : 'Submit Pose (Agent Evaluation)'}
          </span>
        </button>
      </footer>

      {/* 4. Result Modal with dynamic metrics & humorous evaluations (matching Screenshot 3) */}
      {result && gamePhase === 'RESULT' && (
        <ResultModal
          result={result}
          language={language}
          onNext={() => {
            const nextLvl = currentLevelId + 1;
            setCurrentLevelId(nextLvl);
            localStorage.setItem('shadow_agent_lvl', nextLvl.toString());
          }}
          onRetry={() => initLevel(currentLevelId)}
          onLevelSelect={() => setShowLevelSelect(true)}
        />
      )}

      {/* 5. Level Selection Modal */}
      {showLevelSelect && (
        <LevelSelectModal
          currentLevel={currentLevelId}
          highestUnlocked={highestUnlocked}
          levelScores={levelScores}
          language={language}
          onSelectLevel={(lvl) => {
            setCurrentLevelId(lvl);
            localStorage.setItem('shadow_agent_lvl', lvl.toString());
          }}
          onClose={() => setShowLevelSelect(false)}
        />
      )}
    </div>
  );
}
