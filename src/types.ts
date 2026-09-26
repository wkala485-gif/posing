export interface Point {
  x: number;
  y: number;
}

export type JointKey =
  | 'head'
  | 'neck'
  | 'hip'
  | 'leftElbow'
  | 'leftWrist'
  | 'rightElbow'
  | 'rightWrist'
  | 'leftKnee'
  | 'leftAnkle'
  | 'rightKnee'
  | 'rightAnkle';

export interface StickmanPose {
  id: string;
  head: Point;
  neck: Point;
  hip: Point;
  leftElbow: Point;
  leftWrist: Point;
  rightElbow: Point;
  rightWrist: Point;
  leftKnee: Point;
  leftAnkle: Point;
  rightKnee: Point;
  rightAnkle: Point;
}

export type LimbKey =
  | 'head'
  | 'torso'
  | 'left_arm'
  | 'right_arm'
  | 'left_leg'
  | 'right_leg';

export type LimbMatchMap = Record<string, Record<LimbKey, boolean>>;

export interface LimbAccuracy {
  head: number;
  torso: number;
  left_arm: number;
  right_arm: number;
  left_leg: number;
  right_leg: number;
  overall: number;
}

export interface LevelData {
  id: number;
  tier: 1 | 2 | 3 | 4;
  nameKey: string;
  timeLimit: number; // in seconds
  previewTime: number; // in seconds
  isMemoryMode: boolean;
  isDuo: boolean;
  peeksAllowed: number;
  targets: StickmanPose[];
  initialPoses: StickmanPose[];
}

export type Language = 'en' | 'zh';

export type GamePhase = 'PREVIEW' | 'PLAYING' | 'REVEAL' | 'RESULT';

export interface LevelResult {
  levelId: number;
  passed: boolean;
  score: number; // 0 - 100
  timeSpent: number; // in seconds
  stars: number; // 1, 2, or 3
  quoteKey: string;
  limbAccuracies: Record<string, LimbAccuracy>;
}
