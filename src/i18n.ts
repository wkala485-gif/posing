import { Language } from './types';

export const I18N = {
  en: {
    appTitle: 'Pose Match: Shadow Agent',
    subtitle: 'Bend. Match. Infiltrate.',
    mission: 'MISSION',
    tier: 'TIER',
    tier1Name: 'Tier 1: Rookie Infiltration',
    tier2Name: 'Tier 2: Duo Infiltration',
    tier3Name: 'Tier 3: Solo Memory Mode',
    tier4Name: 'Tier 4: Duo Ghost Memory',
    timeRemaining: 'TIME',
    peekBtn: 'PEEK (1s)',
    peeksLeft: 'PEEKS',
    submitBtn: 'SUBMIT POSE',
    previewPhase: 'MEMORIZE SHADOW!',
    blindPhase: 'BLIND RECREATION!',
    revealPhase: 'SCANNING MATCH...',
    touchHintNormal: 'Drag active joints (Wrists, Ankles, Head, Hip) to fit shadow',
    touchHintDuo: 'Adjust both Blue and Orange agents to match silhouettes',
    touchHintMemory: 'Memory Mode: Glow disabled! Pose accurately from memory',
    passedTitle: 'INFILTRATION SUCCESSFUL',
    failedTitle: 'COVER BLOWN!',
    accuracy: 'ACCURACY',
    timeSpent: 'TIME SPENT',
    thresholdNotice: 'Passing threshold: ≥ 65%',
    nextMission: 'NEXT MISSION',
    retry: 'RETRY',
    levelSelect: 'MISSIONS',
    howToPlay: 'HOW TO PLAY',
    soundOn: 'Sound: ON',
    soundOff: 'Sound: MUTED',
    langToggle: '繁中',
    quote95: 'Godlike Infiltration! Even their biological mother couldn\'t tell you apart.',
    quote85: 'Flawless disguise. MI6 recruiters are already blowing up your phone.',
    quote75: 'Passable undercover work. Guard assumed you were stretching a sudden cramp.',
    quote65: 'Barely scraped by! Guard genuinely thought you were a modern art installation.',
    quoteFail: 'COVER BLOWN! You have been sent straight to yoga re-education boot camp.',
    rules: [
      'Touch and drag joints to shape your stickman into the shadow silhouette.',
      'Individual limbs turn Glowing Emerald Green when matched within tolerance.',
      'In Memory Mode (Tier 3 & 4), real-time glow is hidden. Use "PEEK (1s)" if you forget!',
      'Reach at least 65% accuracy to pass and unlock the next assignment.'
    ],
    limbs: {
      head: 'Head & Neck',
      torso: 'Torso',
      left_arm: 'Left Arm',
      right_arm: 'Right Arm',
      left_leg: 'Left Leg',
      right_leg: 'Right Leg',
      overall: 'Overall Match'
    },
    // Mission Names
    missions: {
      m1: 'Basic Standing Open Arms',
      m2: 'Drunken Master',
      m3: 'Saturday Disco Fever',
      m4: 'Flamingo Ninja',
      m5: 'Running Secret Agent',
      m6: 'Titanic King of the World',
      m7: 'Lightning Bolt Sprint',
      m8: 'Yoga Tree of Stealth',
      m9: 'The Deceptive Dab',
      m10: 'Kung Fu Crane Stance',
      m11: 'Michael Jackson Gravity Lean',
      m12: 'Karate Kid Crane Kick',
      m13: 'Spider Crawl on Concrete',
      m14: 'Asphalt Surfer',
      m15: 'Breakdance Freeze',
      m16: 'Secret Pistol Sidestep',
      m17: 'Olympic Hurdle Leap',
      m18: 'Burglar On Tiptoe',
      m19: 'Iron Bodyguard Salute',
      m20: 'Dominance T-Pose',
      m21: 'Back-to-Back Cover Fire',
      m22: 'Double Agent High Five',
      m23: 'Dragon Fusion Stance',
      m24: 'Mirror Sparring Showdown',
      m25: 'Tango Assassin Dip',
      m26: 'Human Bicycle Duo',
      m27: 'Leapfrog Extraction',
      m28: 'Synchronized Land Ballet',
      m29: 'Pulp Fiction Dance V',
      m30: 'Double Superhero Landing',
      m31: 'Human Ladder Escape',
      m32: 'Interlocking Secret Handshake',
      m33: 'VIP Duck & Bodyguard Shield',
      m34: 'Symmetrical Double Dab',
      m35: 'Rockstar Air Guitar Duo',
      m36: 'Handstand Spotter Duo',
      m37: 'Laser Grid Limbo & Vault',
      m38: 'Ping Pong Smash Duel',
      m39: 'Giant Double Heart',
      m40: 'Shadow Syndicate Final Standoff',
      mGeneric: 'Ghost Operation'
    }
  },
  zh: {
    appTitle: '神還原臥底 (Pose Match: Shadow Agent)',
    subtitle: '扭曲肢體 · 完美偽裝 · 潛入敵營',
    mission: '任務',
    tier: '階級',
    tier1Name: '第一階：菜鳥潛入 (單人顯影)',
    tier2Name: '第二階：雙人搭檔 (雙人顯影)',
    tier3Name: '第三階：記憶盲測 (單人盲擺)',
    tier4Name: '第四階：幽靈極限 (雙人盲擺)',
    timeRemaining: '剩餘時間',
    peekBtn: '偷看 (1秒)',
    peeksLeft: '偷看機會',
    submitBtn: '提交偽裝',
    previewPhase: '記住影子姿勢！',
    blindPhase: '憑記憶還原影子！',
    revealPhase: '掃描偽裝還原度...',
    touchHintNormal: '拖曳關鍵關節（手腕、腳踝、頭部、腰部）以貼合影子',
    touchHintDuo: '同時調整 藍色 與 橘色 兩位特務的肢體以貼合影子',
    touchHintMemory: '盲測模式：即時綠光已關閉，憑記憶還原影子姿勢！',
    passedTitle: '偽裝潛入成功！',
    failedTitle: '身份曝光！當場露餡',
    accuracy: '還原度',
    timeSpent: '耗費時間',
    thresholdNotice: '通關門檻：≥ 65%',
    nextMission: '下一項任務',
    retry: '重新嘗試',
    levelSelect: '任務列表',
    howToPlay: '遊玩教學',
    soundOn: '音效：開啟',
    soundOff: '音效：靜音',
    langToggle: 'EN',
    quote95: '神級還原！親媽來了都認不出不是本人！',
    quote85: '完美的潛入偽裝！MI6情報局破格直接錄取！',
    quote75: '偽裝勉強過關，警衛以為你只是突然全身大抽筋。',
    quote65: '擦邊通關！警衛真心以為你是走廊上的現代藝術雕塑。',
    quoteFail: '當場穿幫露餡！已直接遣送至瑜伽集中營強制重修！',
    rules: [
      '用手指或滑鼠拖曳各個關鍵節點，將火柴人調整至與目標影子完全重合。',
      '當單一肢體角度與位置進入容許誤差範圍時，該部位將發出翡翠綠光。',
      '在記憶模式（第3、4階）中，即時綠光提示將關閉，若忘記可按「偷看 (1秒)」。',
      '還原度達到 65% 以上即可通關，並解鎖更高階機密任務。'
    ],
    limbs: {
      head: '頭部與頸部',
      torso: '軀幹腰身',
      left_arm: '左手臂',
      right_arm: '右手臂',
      left_leg: '左腿部',
      right_leg: '右腿部',
      overall: '總體吻合度'
    },
    // Mission Names
    missions: {
      m1: '基礎站立雙手張開',
      m2: '醉拳宗師搖晃步',
      m3: '週末狂熱迪斯可',
      m4: '紅鶴單腳忍術',
      m5: '疾速特務奔馳',
      m6: '鐵達尼號世界之王',
      m7: '閃電博爾特勝利姿',
      m8: '隱密單腳瑜伽樹',
      m9: '無影欺敵Dab',
      m10: '白鶴亮翅拳',
      m11: '麥可傑克森傾斜45度',
      m12: '龍威虎震單腿飛踢',
      m13: '蜘蛛人低空攀爬',
      m14: '柏油路衝浪奇俠',
      m15: '街舞單手定格Freeze',
      m16: '雙手握槍側身瞄準',
      m17: '奧運跨欄冠軍跳',
      m18: '神偷躡手躡腳',
      m19: '鐵壁保鏢立正致敬',
      m20: '制霸全場T-Pose',
      m21: '背對背持槍掩護',
      m22: '雙面間諜凌空擊掌',
      m23: '七龍珠究極融合姿勢',
      m24: '鏡像特工巔峰對決',
      m25: '刺客雙人致命探戈',
      m26: '人體雙人協力車',
      m27: '特工跳馬絕境營救',
      m28: '陸上水上芭蕾舞步',
      m29: '黑色追緝令剪刀舞',
      m30: '英雄降落雙人組',
      m31: '人體天梯高牆突圍',
      m32: '暗號纏指秘密握手',
      m33: 'VIP俯身與鐵壁保鏢',
      m34: '對稱雙人甩手Dab',
      m35: '搖滾天團空氣吉他',
      m36: '特技倒立雙人支撐',
      m37: '雷射光束低空翻越',
      m38: '桌球絕殺扣殺對峙',
      m39: '心心相印巨型愛心',
      m40: '暗影集團最終大決戰',
      mGeneric: '幽靈行動'
    }
  }
} as const;

export function getBrowserLanguage(): Language {
  if (typeof window !== 'undefined' && window.navigator) {
    const lang = (window.navigator.languages && window.navigator.languages[0]) || window.navigator.language;
    if (lang && (lang.toLowerCase().startsWith('zh'))) {
      return 'zh';
    }
  }
  return 'en';
}

export function getMissionName(lang: Language, levelId: number): string {
  const dict = I18N[lang].missions;
  const key = `m${levelId}` as keyof typeof dict;
  if (dict[key]) {
    return dict[key];
  }
  return `${I18N[lang].missions.mGeneric} #${levelId}`;
}

export function getScoreQuote(lang: Language, score: number): string {
  const dict = I18N[lang];
  if (score >= 95) return dict.quote95;
  if (score >= 85) return dict.quote85;
  if (score >= 75) return dict.quote75;
  if (score >= 65) return dict.quote65;
  return dict.quoteFail;
}
