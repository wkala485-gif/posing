import { LevelData, Point, StickmanPose } from '../types';
import { CANVAS_SIZE, GROUND_Y } from '../utils/kinematics';

export function createNeutralPose(id: string, centerX: number = 250, centerY: number = 290): StickmanPose {
  return {
    id,
    head: { x: centerX, y: centerY - 152 },
    neck: { x: centerX, y: centerY - 110 },
    hip: { x: centerX, y: centerY },
    leftElbow: { x: centerX - 32, y: centerY - 55 },
    leftWrist: { x: centerX - 36, y: centerY - 12 },
    rightElbow: { x: centerX + 32, y: centerY - 55 },
    rightWrist: { x: centerX + 36, y: centerY - 12 },
    leftKnee: { x: centerX - 18, y: centerY + 65 },
    leftAnkle: { x: centerX - 20, y: GROUND_Y },
    rightKnee: { x: centerX + 18, y: centerY + 65 },
    rightAnkle: { x: centerX + 20, y: GROUND_Y },
  };
}

// Preset library of unique iconic target poses
const SOLO_PRESETS: ((centerX: number) => StickmanPose)[] = [
  // 1: Standing Open Arms (雙腳踩在地面線 y=420，雙手自然展開，比例協調)
  (cx) => ({
    id: 'agent1',
    head: { x: cx, y: 138 },
    neck: { x: cx, y: 180 },
    hip: { x: cx, y: 290 },
    leftElbow: { x: cx - 60, y: 186 },
    leftWrist: { x: cx - 104, y: 186 },
    rightElbow: { x: cx + 60, y: 186 },
    rightWrist: { x: cx + 104, y: 186 },
    leftKnee: { x: cx - 25, y: 355 },
    leftAnkle: { x: cx - 30, y: GROUND_Y },
    rightKnee: { x: cx + 25, y: 355 },
    rightAnkle: { x: cx + 30, y: GROUND_Y },
  }),

  // 2: Drunken Master
  (cx) => ({
    id: 'agent1',
    head: { x: cx + 25, y: 140 },
    neck: { x: cx + 15, y: 180 },
    hip: { x: cx - 10, y: 284 },
    leftElbow: { x: cx - 35, y: 170 },
    leftWrist: { x: cx - 20, y: 130 },
    rightElbow: { x: cx + 65, y: 200 },
    rightWrist: { x: cx + 50, y: 160 },
    leftKnee: { x: cx - 30, y: 350 },
    leftAnkle: { x: cx - 25, y: GROUND_Y },
    rightKnee: { x: cx + 45, y: 300 },
    rightAnkle: { x: cx + 80, y: 340 },
  }),

  // 3: Saturday Disco Fever
  (cx) => ({
    id: 'agent1',
    head: { x: cx - 10, y: 125 },
    neck: { x: cx - 10, y: 165 },
    hip: { x: cx - 25, y: 265 },
    leftElbow: { x: cx - 50, y: 205 },
    leftWrist: { x: cx - 80, y: 250 },
    rightElbow: { x: cx + 45, y: 140 },
    rightWrist: { x: cx + 85, y: 105 },
    leftKnee: { x: cx - 45, y: 325 },
    leftAnkle: { x: cx - 50, y: GROUND_Y },
    rightKnee: { x: cx + 15, y: 325 },
    rightAnkle: { x: cx + 40, y: GROUND_Y },
  }),

  // 4: Flamingo Ninja
  (cx) => ({
    id: 'agent1',
    head: { x: cx, y: 125 },
    neck: { x: cx, y: 165 },
    hip: { x: cx, y: 260 },
    leftElbow: { x: cx - 45, y: 155 },
    leftWrist: { x: cx - 75, y: 130 },
    rightElbow: { x: cx + 45, y: 155 },
    rightWrist: { x: cx + 75, y: 130 },
    leftKnee: { x: cx - 40, y: 250 },
    leftAnkle: { x: cx - 5, y: 290 },
    rightKnee: { x: cx + 5, y: 325 },
    rightAnkle: { x: cx, y: GROUND_Y },
  }),

  // 5: Running Secret Agent
  (cx) => ({
    id: 'agent1',
    head: { x: cx + 60, y: 145 },
    neck: { x: cx + 35, y: 175 },
    hip: { x: cx - 20, y: 245 },
    leftElbow: { x: cx + 65, y: 200 },
    leftWrist: { x: cx + 90, y: 170 },
    rightElbow: { x: cx - 10, y: 210 },
    rightWrist: { x: cx - 45, y: 235 },
    leftKnee: { x: cx + 30, y: 295 },
    leftAnkle: { x: cx + 50, y: GROUND_Y },
    rightKnee: { x: cx - 65, y: 280 },
    rightAnkle: { x: cx - 95, y: 330 },
  }),

  // 6: Titanic King of the World
  (cx) => ({
    id: 'agent1',
    head: { x: cx, y: 115 },
    neck: { x: cx, y: 155 },
    hip: { x: cx, y: 255 },
    leftElbow: { x: cx - 48, y: 155 },
    leftWrist: { x: cx - 92, y: 155 },
    rightElbow: { x: cx + 48, y: 155 },
    rightWrist: { x: cx + 92, y: 155 },
    leftKnee: { x: cx - 20, y: 322 },
    leftAnkle: { x: cx - 25, y: GROUND_Y },
    rightKnee: { x: cx + 20, y: 322 },
    rightAnkle: { x: cx + 25, y: GROUND_Y },
  }),

  // 7: Lightning Bolt Sprint
  (cx) => ({
    id: 'agent1',
    head: { x: cx - 30, y: 135 },
    neck: { x: cx - 15, y: 165 },
    hip: { x: cx + 15, y: 260 },
    leftElbow: { x: cx - 60, y: 140 },
    leftWrist: { x: cx - 95, y: 110 },
    rightElbow: { x: cx + 10, y: 185 },
    rightWrist: { x: cx - 35, y: 165 },
    leftKnee: { x: cx - 25, y: 315 },
    leftAnkle: { x: cx - 55, y: GROUND_Y },
    rightKnee: { x: cx + 40, y: 320 },
    rightAnkle: { x: cx + 60, y: GROUND_Y },
  }),

  // 8: Yoga Tree of Stealth
  (cx) => ({
    id: 'agent1',
    head: { x: cx, y: 125 },
    neck: { x: cx, y: 165 },
    hip: { x: cx, y: 260 },
    leftElbow: { x: cx - 25, y: 110 },
    leftWrist: { x: cx - 4, y: 80 },
    rightElbow: { x: cx + 25, y: 110 },
    rightWrist: { x: cx + 4, y: 80 },
    leftKnee: { x: cx - 55, y: 305 },
    leftAnkle: { x: cx - 5, y: 320 },
    rightKnee: { x: cx, y: 325 },
    rightAnkle: { x: cx, y: GROUND_Y },
  }),

  // 9: The Deceptive Dab
  (cx) => ({
    id: 'agent1',
    head: { x: cx - 35, y: 175 },
    neck: { x: cx - 15, y: 175 },
    hip: { x: cx, y: 265 },
    leftElbow: { x: cx - 45, y: 195 },
    leftWrist: { x: cx - 15, y: 165 },
    rightElbow: { x: cx + 45, y: 145 },
    rightWrist: { x: cx + 90, y: 115 },
    leftKnee: { x: cx - 25, y: 325 },
    leftAnkle: { x: cx - 35, y: GROUND_Y },
    rightKnee: { x: cx + 25, y: 325 },
    rightAnkle: { x: cx + 35, y: GROUND_Y },
  }),

  // 10: Kung Fu Crane Stance
  (cx) => ({
    id: 'agent1',
    head: { x: cx, y: 130 },
    neck: { x: cx, y: 170 },
    hip: { x: cx - 10, y: 265 },
    leftElbow: { x: cx - 40, y: 140 },
    leftWrist: { x: cx - 75, y: 165 },
    rightElbow: { x: cx + 40, y: 140 },
    rightWrist: { x: cx + 75, y: 165 },
    leftKnee: { x: cx - 50, y: 245 },
    leftAnkle: { x: cx - 35, y: 300 },
    rightKnee: { x: cx - 5, y: 325 },
    rightAnkle: { x: cx - 10, y: GROUND_Y },
  }),

  // 11: Michael Jackson Gravity Lean
  (cx) => ({
    id: 'agent1',
    head: { x: cx + 85, y: 140 },
    neck: { x: cx + 60, y: 175 },
    hip: { x: cx + 30, y: 260 },
    leftElbow: { x: cx + 45, y: 215 },
    leftWrist: { x: cx + 35, y: 255 },
    rightElbow: { x: cx + 75, y: 215 },
    rightWrist: { x: cx + 65, y: 255 },
    leftKnee: { x: cx + 15, y: 322 },
    leftAnkle: { x: cx - 20, y: GROUND_Y },
    rightKnee: { x: cx + 35, y: 322 },
    rightAnkle: { x: cx + 10, y: GROUND_Y },
  }),

  // 12: Karate Kid Crane Kick
  (cx) => ({
    id: 'agent1',
    head: { x: cx - 35, y: 145 },
    neck: { x: cx - 20, y: 175 },
    hip: { x: cx, y: 265 },
    leftElbow: { x: cx - 50, y: 145 },
    leftWrist: { x: cx - 70, y: 120 },
    rightElbow: { x: cx + 25, y: 145 },
    rightWrist: { x: cx + 55, y: 120 },
    leftKnee: { x: cx - 15, y: 325 },
    leftAnkle: { x: cx - 20, y: GROUND_Y },
    rightKnee: { x: cx + 50, y: 245 },
    rightAnkle: { x: cx + 95, y: 230 },
  }),

  // 13: Spider Crawl on Concrete
  (cx) => ({
    id: 'agent1',
    head: { x: cx, y: 250 },
    neck: { x: cx, y: 275 },
    hip: { x: cx, y: 310 },
    leftElbow: { x: cx - 55, y: 335 },
    leftWrist: { x: cx - 85, y: GROUND_Y },
    rightElbow: { x: cx + 55, y: 335 },
    rightWrist: { x: cx + 85, y: GROUND_Y },
    leftKnee: { x: cx - 60, y: 315 },
    leftAnkle: { x: cx - 40, y: GROUND_Y },
    rightKnee: { x: cx + 60, y: 315 },
    rightAnkle: { x: cx + 40, y: GROUND_Y },
  }),

  // 14: Asphalt Surfer
  (cx) => ({
    id: 'agent1',
    head: { x: cx - 10, y: 175 },
    neck: { x: cx - 10, y: 210 },
    hip: { x: cx, y: 285 },
    leftElbow: { x: cx - 55, y: 195 },
    leftWrist: { x: cx - 95, y: 220 },
    rightElbow: { x: cx + 50, y: 195 },
    rightWrist: { x: cx + 85, y: 170 },
    leftKnee: { x: cx - 50, y: 335 },
    leftAnkle: { x: cx - 75, y: GROUND_Y },
    rightKnee: { x: cx + 45, y: 335 },
    rightAnkle: { x: cx + 75, y: GROUND_Y },
  }),

  // 15: Breakdance Freeze
  (cx) => ({
    id: 'agent1',
    head: { x: cx - 50, y: 330 },
    neck: { x: cx - 35, y: 305 },
    hip: { x: cx, y: 255 },
    leftElbow: { x: cx - 35, y: 350 },
    leftWrist: { x: cx - 35, y: GROUND_Y },
    rightElbow: { x: cx + 15, y: 275 },
    rightWrist: { x: cx + 45, y: 245 },
    leftKnee: { x: cx - 35, y: 215 },
    leftAnkle: { x: cx - 75, y: 185 },
    rightKnee: { x: cx + 40, y: 215 },
    rightAnkle: { x: cx + 85, y: 180 },
  }),

  // 16: Secret Pistol Sidestep
  (cx) => ({
    id: 'agent1',
    head: { x: cx - 20, y: 140 },
    neck: { x: cx - 20, y: 175 },
    hip: { x: cx - 20, y: 265 },
    leftElbow: { x: cx + 25, y: 175 },
    leftWrist: { x: cx + 70, y: 175 },
    rightElbow: { x: cx + 30, y: 185 },
    rightWrist: { x: cx + 70, y: 175 },
    leftKnee: { x: cx - 45, y: 325 },
    leftAnkle: { x: cx - 55, y: GROUND_Y },
    rightKnee: { x: cx + 20, y: 325 },
    rightAnkle: { x: cx + 40, y: GROUND_Y },
  }),

  // 17: Olympic Hurdle Leap
  (cx) => ({
    id: 'agent1',
    head: { x: cx + 25, y: 155 },
    neck: { x: cx + 10, y: 185 },
    hip: { x: cx - 15, y: 255 },
    leftElbow: { x: cx + 55, y: 185 },
    leftWrist: { x: cx + 90, y: 165 },
    rightElbow: { x: cx - 30, y: 210 },
    rightWrist: { x: cx - 65, y: 235 },
    leftKnee: { x: cx + 45, y: 270 },
    leftAnkle: { x: cx + 95, y: 265 },
    rightKnee: { x: cx - 60, y: 295 },
    rightAnkle: { x: cx - 85, y: 345 },
  }),

  // 18: Burglar On Tiptoe
  (cx) => ({
    id: 'agent1',
    head: { x: cx + 15, y: 170 },
    neck: { x: cx, y: 200 },
    hip: { x: cx - 20, y: 280 },
    leftElbow: { x: cx - 45, y: 215 },
    leftWrist: { x: cx - 65, y: 195 },
    rightElbow: { x: cx + 30, y: 215 },
    rightWrist: { x: cx + 55, y: 195 },
    leftKnee: { x: cx - 40, y: 335 },
    leftAnkle: { x: cx - 25, y: GROUND_Y - 14 },
    rightKnee: { x: cx + 15, y: 335 },
    rightAnkle: { x: cx + 30, y: GROUND_Y - 14 },
  }),

  // 19: Iron Bodyguard Salute
  (cx) => ({
    id: 'agent1',
    head: { x: cx, y: 120 },
    neck: { x: cx, y: 160 },
    hip: { x: cx, y: 255 },
    leftElbow: { x: cx - 25, y: 210 },
    leftWrist: { x: cx - 20, y: 255 },
    rightElbow: { x: cx + 40, y: 155 },
    rightWrist: { x: cx + 22, y: 125 },
    leftKnee: { x: cx - 12, y: 320 },
    leftAnkle: { x: cx - 12, y: GROUND_Y },
    rightKnee: { x: cx + 12, y: 320 },
    rightAnkle: { x: cx + 12, y: GROUND_Y },
  }),

  // 20: Dominance T-Pose
  (cx) => ({
    id: 'agent1',
    head: { x: cx, y: 120 },
    neck: { x: cx, y: 160 },
    hip: { x: cx, y: 255 },
    leftElbow: { x: cx - 46, y: 166 },
    leftWrist: { x: cx - 90, y: 166 },
    rightElbow: { x: cx + 46, y: 166 },
    rightWrist: { x: cx + 90, y: 166 },
    leftKnee: { x: cx - 14, y: 320 },
    leftAnkle: { x: cx - 14, y: GROUND_Y },
    rightKnee: { x: cx + 14, y: 320 },
    rightAnkle: { x: cx + 14, y: GROUND_Y },
  }),
];

// Duo target generators (Blue on left cx1 ~ 160, Orange on right cx2 ~ 340)
const DUO_PRESETS: ((cx1: number, cx2: number) => [StickmanPose, StickmanPose])[] = [
  // 21: Back-to-Back Cover Fire
  (cx1, cx2) => [
    {
      id: 'agent1',
      head: { x: cx1 + 30, y: 130 },
      neck: { x: cx1 + 30, y: 170 },
      hip: { x: cx1 + 40, y: 260 },
      leftElbow: { x: cx1 - 10, y: 175 },
      leftWrist: { x: cx1 - 50, y: 175 },
      rightElbow: { x: cx1, y: 185 },
      rightWrist: { x: cx1 - 50, y: 175 },
      leftKnee: { x: cx1 + 10, y: 320 },
      leftAnkle: { x: cx1 - 15, y: GROUND_Y },
      rightKnee: { x: cx1 + 45, y: 320 },
      rightAnkle: { x: cx1 + 30, y: GROUND_Y },
    },
    {
      id: 'agent2',
      head: { x: cx2 - 30, y: 130 },
      neck: { x: cx2 - 30, y: 170 },
      hip: { x: cx2 - 40, y: 260 },
      leftElbow: { x: cx2, y: 185 },
      leftWrist: { x: cx2 + 50, y: 175 },
      rightElbow: { x: cx2 + 10, y: 175 },
      rightWrist: { x: cx2 + 50, y: 175 },
      leftKnee: { x: cx2 - 45, y: 320 },
      leftAnkle: { x: cx2 - 30, y: GROUND_Y },
      rightKnee: { x: cx2 - 10, y: 320 },
      rightAnkle: { x: cx2 + 15, y: GROUND_Y },
    },
  ],

  // 22: Double Agent High Five
  (cx1, cx2) => [
    {
      id: 'agent1',
      head: { x: cx1 + 20, y: 130 },
      neck: { x: cx1 + 15, y: 170 },
      hip: { x: cx1, y: 260 },
      leftElbow: { x: cx1 - 35, y: 205 },
      leftWrist: { x: cx1 - 50, y: 245 },
      rightElbow: { x: cx1 + 50, y: 145 },
      rightWrist: { x: 250, y: 110 }, // Hand meets in center
      leftKnee: { x: cx1 - 25, y: 320 },
      leftAnkle: { x: cx1 - 30, y: GROUND_Y },
      rightKnee: { x: cx1 + 25, y: 320 },
      rightAnkle: { x: cx1 + 30, y: GROUND_Y },
    },
    {
      id: 'agent2',
      head: { x: cx2 - 20, y: 130 },
      neck: { x: cx2 - 15, y: 170 },
      hip: { x: cx2, y: 260 },
      leftElbow: { x: cx2 - 50, y: 145 },
      leftWrist: { x: 250, y: 110 }, // Hand meets in center
      rightElbow: { x: cx2 + 35, y: 205 },
      rightWrist: { x: cx2 + 50, y: 245 },
      leftKnee: { x: cx2 - 25, y: 320 },
      leftAnkle: { x: cx2 - 30, y: GROUND_Y },
      rightKnee: { x: cx2 + 25, y: 320 },
      rightAnkle: { x: cx2 + 30, y: GROUND_Y },
    },
  ],

  // 23: Dragon Fusion Stance
  (cx1, cx2) => [
    {
      id: 'agent1',
      head: { x: cx1 + 35, y: 170 },
      neck: { x: cx1 + 20, y: 205 },
      hip: { x: cx1 - 10, y: 285 },
      leftElbow: { x: cx1 - 30, y: 175 },
      leftWrist: { x: cx1 - 10, y: 140 },
      rightElbow: { x: cx1 + 55, y: 165 },
      rightWrist: { x: 240, y: 145 },
      leftKnee: { x: cx1 - 50, y: 335 },
      leftAnkle: { x: cx1 - 70, y: GROUND_Y },
      rightKnee: { x: cx1 + 25, y: 335 },
      rightAnkle: { x: cx1 + 45, y: GROUND_Y },
    },
    {
      id: 'agent2',
      head: { x: cx2 - 35, y: 170 },
      neck: { x: cx2 - 20, y: 205 },
      hip: { x: cx2 + 10, y: 285 },
      leftElbow: { x: cx2 - 55, y: 165 },
      leftWrist: { x: 260, y: 145 },
      rightElbow: { x: cx2 + 30, y: 175 },
      rightWrist: { x: cx2 + 10, y: 140 },
      leftKnee: { x: cx2 - 25, y: 335 },
      leftAnkle: { x: cx2 - 45, y: GROUND_Y },
      rightKnee: { x: cx2 + 50, y: 335 },
      rightAnkle: { x: cx2 + 70, y: GROUND_Y },
    },
  ],

  // 24: Mirror Sparring Showdown
  (cx1, cx2) => [
    {
      id: 'agent1',
      head: { x: cx1 + 20, y: 140 },
      neck: { x: cx1 + 10, y: 175 },
      hip: { x: cx1 - 15, y: 265 },
      leftElbow: { x: cx1 + 40, y: 165 },
      leftWrist: { x: cx1 + 75, y: 155 },
      rightElbow: { x: cx1 + 20, y: 195 },
      rightWrist: { x: cx1 + 50, y: 205 },
      leftKnee: { x: cx1 - 35, y: 325 },
      leftAnkle: { x: cx1 - 45, y: GROUND_Y },
      rightKnee: { x: cx1 + 15, y: 325 },
      rightAnkle: { x: cx1 + 35, y: GROUND_Y },
    },
    {
      id: 'agent2',
      head: { x: cx2 - 20, y: 140 },
      neck: { x: cx2 - 10, y: 175 },
      hip: { x: cx2 + 15, y: 265 },
      leftElbow: { x: cx2 - 20, y: 195 },
      leftWrist: { x: cx2 - 50, y: 205 },
      rightElbow: { x: cx2 - 40, y: 165 },
      rightWrist: { x: cx2 - 75, y: 155 },
      leftKnee: { x: cx2 - 15, y: 325 },
      leftAnkle: { x: cx2 - 35, y: GROUND_Y },
      rightKnee: { x: cx2 + 35, y: 325 },
      rightAnkle: { x: cx2 + 45, y: GROUND_Y },
    },
  ],

  // 25: Tango Assassin Dip
  (cx1, cx2) => [
    {
      id: 'agent1',
      head: { x: cx1 + 20, y: 125 },
      neck: { x: cx1 + 20, y: 165 },
      hip: { x: cx1 + 10, y: 260 },
      leftElbow: { x: cx1 + 55, y: 180 },
      leftWrist: { x: 235, y: 220 },
      rightElbow: { x: cx1 - 25, y: 205 },
      rightWrist: { x: cx1 - 45, y: 250 },
      leftKnee: { x: cx1 - 15, y: 325 },
      leftAnkle: { x: cx1 - 25, y: GROUND_Y },
      rightKnee: { x: cx1 + 35, y: 325 },
      rightAnkle: { x: cx1 + 50, y: GROUND_Y },
    },
    {
      id: 'agent2',
      head: { x: 210, y: 245 },
      neck: { x: 235, y: 230 },
      hip: { x: cx2 - 20, y: 265 },
      leftElbow: { x: 215, y: 275 },
      leftWrist: { x: 190, y: 310 },
      rightElbow: { x: 260, y: 205 },
      rightWrist: { x: 235, y: 180 },
      leftKnee: { x: cx2 - 40, y: 325 },
      leftAnkle: { x: cx2 - 35, y: GROUND_Y },
      rightKnee: { x: cx2 + 10, y: 285 },
      rightAnkle: { x: cx2 + 45, y: 320 },
    },
  ],
];

/**
 * Data-Driven level generator supporting 100+ missions across all 4 Tiers.
 */
export function getLevelData(levelId: number): LevelData {
  let tier: 1 | 2 | 3 | 4 = 1;
  if (levelId >= 81) {
    tier = 4;
  } else if (levelId >= 41) {
    tier = 3;
  } else if (levelId >= 21) {
    tier = 2;
  } else {
    tier = 1;
  }

  const isDuo = tier === 2 || tier === 4;
  const isMemoryMode = tier === 3 || tier === 4;

  let timeLimit = 45;
  let previewTime = 0;
  let peeksAllowed = 0;

  if (tier === 1 || tier === 2) {
    timeLimit = 45;
    previewTime = 0;
    peeksAllowed = 0;
  } else if (tier === 3) {
    timeLimit = 20; // 20s blind posing
    previewTime = 3; // 3s preview
    peeksAllowed = 2; // 2 peeks
  } else if (tier === 4) {
    timeLimit = 10; // 10s urgent blind posing
    previewTime = 3; // 3s preview
    peeksAllowed = 1; // 1 peek
  }

  let targets: StickmanPose[] = [];
  let initialPoses: StickmanPose[] = [];

  if (!isDuo) {
    // Solo
    const presetIdx = (levelId - 1) % SOLO_PRESETS.length;
    const targetPose = SOLO_PRESETS[presetIdx](250);
    targetPose.id = 'agent1';
    targets = [targetPose];
    initialPoses = [createNeutralPose('agent1', 250, 284)];
  } else {
    // Duo
    const duoIdx = (levelId - 1) % DUO_PRESETS.length;
    const [t1, t2] = DUO_PRESETS[duoIdx](160, 340);
    t1.id = 'agent1';
    t2.id = 'agent2';
    targets = [t1, t2];
    initialPoses = [
      createNeutralPose('agent1', 160, 284),
      createNeutralPose('agent2', 340, 284),
    ];
  }

  return {
    id: levelId,
    tier,
    nameKey: `m${levelId}`,
    timeLimit,
    previewTime,
    isMemoryMode,
    isDuo,
    peeksAllowed,
    targets,
    initialPoses,
  };
}
