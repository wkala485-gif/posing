import { JointKey, LimbAccuracy, LimbKey, LimbMatchMap, Point, StickmanPose } from '../types';

export const CANVAS_SIZE = 500;
export const GROUND_Y = 420;

// Restored human proportions (shorter ape arms, standard torso/legs)
// BONE = { torso: 110, shoulderW: 32, uArm: 46, fArm: 44, hipW: 24, thigh: 65, calf: 65, headR: 28 }
export const BONE_LENGTHS = {
  headRadius: 28,
  neckToHead: 42,
  torso: 110,
  upperArm: 46,
  forearm: 44,
  shoulderOffset: 16, // shoulderW: 32 / 2
  hipOffset: 12,      // hipW: 24 / 2
  thigh: 65,
  calf: 65,
};

export function distance(p1: Point, p2: Point): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

export function angleDeg(from: Point, to: Point): number {
  const rad = Math.atan2(to.y - from.y, to.x - from.x);
  let deg = (rad * 180) / Math.PI;
  if (deg < 0) deg += 360;
  return deg;
}

export function angleDiffDeg(a1: number, a2: number): number {
  let diff = Math.abs(a1 - a2) % 360;
  if (diff > 180) diff = 360 - diff;
  return diff;
}

export function getShoulderPos(neck: Point, isLeft: boolean): Point {
  return {
    x: neck.x + (isLeft ? -BONE_LENGTHS.shoulderOffset : BONE_LENGTHS.shoulderOffset),
    y: neck.y + 6,
  };
}

export function getPelvisPos(hip: Point, isLeft: boolean): Point {
  return {
    x: hip.x + (isLeft ? -BONE_LENGTHS.hipOffset : BONE_LENGTHS.hipOffset),
    y: hip.y + 4,
  };
}

/**
 * 100% Freeform Drag Handler.
 * Physical IK solver (solve2BoneIK / solveTwoBoneSmooth) has been completely removed
 * to eliminate unwanted limb snapping, popping, and reverse bending.
 * Every joint can be positioned directly and freely on the canvas.
 */
export function updateStickmanDrag(
  current: StickmanPose,
  draggedJoint: JointKey,
  pointer: Point,
  prevPointer: Point
): StickmanPose {
  const next = JSON.parse(JSON.stringify(current)) as StickmanPose;
  const dx = pointer.x - prevPointer.x;
  const dy = pointer.y - prevPointer.y;

  // 1. Hip moves the whole stickman body as a translation unit
  if (draggedJoint === 'hip') {
    const clampedDx = Math.max(-60, Math.min(60, dx));
    const clampedDy = Math.max(-60, Math.min(60, dy));

    const joints: JointKey[] = [
      'head', 'neck', 'hip',
      'leftElbow', 'leftWrist', 'rightElbow', 'rightWrist',
      'leftKnee', 'leftAnkle', 'rightKnee', 'rightAnkle'
    ];
    for (const key of joints) {
      next[key].x = Math.max(10, Math.min(CANVAS_SIZE - 10, next[key].x + clampedDx));
      next[key].y = Math.max(20, Math.min(GROUND_Y + 10, next[key].y + clampedDy));
    }
    return next;
  }

  // 2. Head moves and spine tilts naturally
  if (draggedJoint === 'head') {
    next.head = {
      x: Math.max(25, Math.min(CANVAS_SIZE - 25, pointer.x)),
      y: Math.max(25, Math.min(GROUND_Y - 30, pointer.y)),
    };
    const dHeadHip = distance(next.head, next.hip) || 1;
    const spineDirX = (next.head.x - next.hip.x) / dHeadHip;
    const spineDirY = (next.head.y - next.hip.y) / dHeadHip;
    next.neck = {
      x: next.hip.x + spineDirX * BONE_LENGTHS.torso,
      y: next.hip.y + spineDirY * BONE_LENGTHS.torso,
    };
    return next;
  }

  // 3. Neck moves with head offset preserved
  if (draggedJoint === 'neck') {
    const clampedX = Math.max(25, Math.min(CANVAS_SIZE - 25, pointer.x));
    const clampedY = Math.max(30, Math.min(GROUND_Y - 40, pointer.y));
    const headOffX = next.head.x - next.neck.x;
    const headOffY = next.head.y - next.neck.y;
    next.neck = { x: clampedX, y: clampedY };
    next.head = { x: clampedX + headOffX, y: clampedY + headOffY };
    return next;
  }

  // 4. Arms: 100% Freeform direct drag for Wrists and Elbows
  if (draggedJoint === 'leftWrist') {
    next.leftWrist = {
      x: Math.max(15, Math.min(CANVAS_SIZE - 15, pointer.x)),
      y: Math.max(20, Math.min(GROUND_Y + 10, pointer.y)),
    };
    return next;
  }

  if (draggedJoint === 'rightWrist') {
    next.rightWrist = {
      x: Math.max(15, Math.min(CANVAS_SIZE - 15, pointer.x)),
      y: Math.max(20, Math.min(GROUND_Y + 10, pointer.y)),
    };
    return next;
  }

  if (draggedJoint === 'leftElbow') {
    next.leftElbow = {
      x: Math.max(15, Math.min(CANVAS_SIZE - 15, pointer.x)),
      y: Math.max(20, Math.min(GROUND_Y + 10, pointer.y)),
    };
    return next;
  }

  if (draggedJoint === 'rightElbow') {
    next.rightElbow = {
      x: Math.max(15, Math.min(CANVAS_SIZE - 15, pointer.x)),
      y: Math.max(20, Math.min(GROUND_Y + 10, pointer.y)),
    };
    return next;
  }

  // 5. Legs: 100% Freeform direct drag for Ankles and Knees (resting on or above ground)
  if (draggedJoint === 'leftAnkle') {
    next.leftAnkle = {
      x: Math.max(15, Math.min(CANVAS_SIZE - 15, pointer.x)),
      y: Math.max(50, Math.min(GROUND_Y, pointer.y)),
    };
    return next;
  }

  if (draggedJoint === 'rightAnkle') {
    next.rightAnkle = {
      x: Math.max(15, Math.min(CANVAS_SIZE - 15, pointer.x)),
      y: Math.max(50, Math.min(GROUND_Y, pointer.y)),
    };
    return next;
  }

  if (draggedJoint === 'leftKnee') {
    next.leftKnee = {
      x: Math.max(15, Math.min(CANVAS_SIZE - 15, pointer.x)),
      y: Math.max(50, Math.min(GROUND_Y, pointer.y)),
    };
    return next;
  }

  if (draggedJoint === 'rightKnee') {
    next.rightKnee = {
      x: Math.max(15, Math.min(CANVAS_SIZE - 15, pointer.x)),
      y: Math.max(50, Math.min(GROUND_Y, pointer.y)),
    };
    return next;
  }

  return next;
}

// Strict Dual-Bone Angle Tolerances:
// Both upper and lower bones must simultaneously match the shadow vector <= 18°
export const BONE_ANGLE_ENTER_TOL = 18; // deg: enter tolerance
export const BONE_ANGLE_EXIT_TOL = 23;  // deg: exit tolerance (hysteresis buffer to prevent flicker)
export const LIMB_POS_ENTER_TOL = 38;   // px
export const LIMB_POS_EXIT_TOL = 48;    // px

/**
 * Evaluates real-time limb alignment glow based strictly on dual-bone vector angles.
 * Both the upper bone (e.g. upper arm / thigh) and lower bone (e.g. forearm / calf)
 * must simultaneously match the target shadow angles within 18 degrees to emit Emerald Green (#10B981).
 * If there is any unwanted bend at elbow or knee, the entire limb remains White.
 */
export function evaluateLimbMatches(
  userPoses: StickmanPose[],
  targetPoses: StickmanPose[],
  previousMatches: LimbMatchMap
): { updatedMatches: LimbMatchMap; newGlowOccurred: boolean } {
  const updatedMatches: LimbMatchMap = {};
  let newGlowOccurred = false;

  userPoses.forEach((user, idx) => {
    const target = targetPoses[idx] || targetPoses[0];
    const agentId = user.id;
    const prevAgentMatches = previousMatches[agentId] || {
      head: false,
      torso: false,
      left_arm: false,
      right_arm: false,
      left_leg: false,
      right_leg: false,
    };

    const agentResult: Record<LimbKey, boolean> = {
      head: false,
      torso: false,
      left_arm: false,
      right_arm: false,
      left_leg: false,
      right_leg: false,
    };

    // 1. Head
    const headPosErr = distance(user.head, target.head);
    const headAngleErr = angleDiffDeg(angleDeg(user.neck, user.head), angleDeg(target.neck, target.head));
    const wasHeadMatched = prevAgentMatches.head;
    agentResult.head = wasHeadMatched
      ? headPosErr <= LIMB_POS_EXIT_TOL && headAngleErr <= BONE_ANGLE_EXIT_TOL
      : headPosErr <= LIMB_POS_ENTER_TOL && headAngleErr <= BONE_ANGLE_ENTER_TOL;

    // 2. Torso
    const neckPosErr = distance(user.neck, target.neck);
    const hipPosErr = distance(user.hip, target.hip);
    const torsoPosErr = (neckPosErr + hipPosErr) * 0.5;
    const torsoAngleErr = angleDiffDeg(angleDeg(user.hip, user.neck), angleDeg(target.hip, target.neck));
    const wasTorsoMatched = prevAgentMatches.torso;
    agentResult.torso = wasTorsoMatched
      ? torsoPosErr <= LIMB_POS_EXIT_TOL && torsoAngleErr <= BONE_ANGLE_EXIT_TOL
      : torsoPosErr <= LIMB_POS_ENTER_TOL && torsoAngleErr <= BONE_ANGLE_ENTER_TOL;

    // 3. Left Arm: Upper arm <= 18° AND Forearm <= 18° simultaneously
    const uLShoulder = getShoulderPos(user.neck, true);
    const tLShoulder = getShoulderPos(target.neck, true);
    const lUpperAngleErr = angleDiffDeg(angleDeg(uLShoulder, user.leftElbow), angleDeg(tLShoulder, target.leftElbow));
    const lForeAngleErr = angleDiffDeg(angleDeg(user.leftElbow, user.leftWrist), angleDeg(target.leftElbow, target.leftWrist));
    const lWristPosErr = distance(user.leftWrist, target.leftWrist);

    const wasLArmMatched = prevAgentMatches.left_arm;
    const lAngleTol = wasLArmMatched ? BONE_ANGLE_EXIT_TOL : BONE_ANGLE_ENTER_TOL;
    const lPosTol = wasLArmMatched ? LIMB_POS_EXIT_TOL : LIMB_POS_ENTER_TOL;
    agentResult.left_arm = lUpperAngleErr <= lAngleTol && lForeAngleErr <= lAngleTol && lWristPosErr <= lPosTol;

    // 4. Right Arm: Upper arm <= 18° AND Forearm <= 18° simultaneously
    const uRShoulder = getShoulderPos(user.neck, false);
    const tRShoulder = getShoulderPos(target.neck, false);
    const rUpperAngleErr = angleDiffDeg(angleDeg(uRShoulder, user.rightElbow), angleDeg(tRShoulder, target.rightElbow));
    const rForeAngleErr = angleDiffDeg(angleDeg(user.rightElbow, user.rightWrist), angleDeg(target.rightElbow, target.rightWrist));
    const rWristPosErr = distance(user.rightWrist, target.rightWrist);

    const wasRArmMatched = prevAgentMatches.right_arm;
    const rAngleTol = wasRArmMatched ? BONE_ANGLE_EXIT_TOL : BONE_ANGLE_ENTER_TOL;
    const rPosTol = wasRArmMatched ? LIMB_POS_EXIT_TOL : LIMB_POS_ENTER_TOL;
    agentResult.right_arm = rUpperAngleErr <= rAngleTol && rForeAngleErr <= rAngleTol && rWristPosErr <= rPosTol;

    // 5. Left Leg: Thigh <= 18° AND Calf <= 18° simultaneously
    const uLPelvis = getPelvisPos(user.hip, true);
    const tLPelvis = getPelvisPos(target.hip, true);
    const lThighAngleErr = angleDiffDeg(angleDeg(uLPelvis, user.leftKnee), angleDeg(tLPelvis, target.leftKnee));
    const lCalfAngleErr = angleDiffDeg(angleDeg(user.leftKnee, user.leftAnkle), angleDeg(target.leftKnee, target.leftAnkle));
    const lAnklePosErr = distance(user.leftAnkle, target.leftAnkle);

    const wasLLegMatched = prevAgentMatches.left_leg;
    const lLegAngleTol = wasLLegMatched ? BONE_ANGLE_EXIT_TOL : BONE_ANGLE_ENTER_TOL;
    const lLegPosTol = wasLLegMatched ? LIMB_POS_EXIT_TOL : LIMB_POS_ENTER_TOL;
    agentResult.left_leg = lThighAngleErr <= lLegAngleTol && lCalfAngleErr <= lLegAngleTol && lAnklePosErr <= lLegPosTol;

    // 6. Right Leg: Thigh <= 18° AND Calf <= 18° simultaneously
    const uRPelvis = getPelvisPos(user.hip, false);
    const tRPelvis = getPelvisPos(target.hip, false);
    const rThighAngleErr = angleDiffDeg(angleDeg(uRPelvis, user.rightKnee), angleDeg(tRPelvis, target.rightKnee));
    const rCalfAngleErr = angleDiffDeg(angleDeg(user.rightKnee, user.rightAnkle), angleDeg(target.rightKnee, target.rightAnkle));
    const rAnklePosErr = distance(user.rightAnkle, target.rightAnkle);

    const wasRLegMatched = prevAgentMatches.right_leg;
    const rLegAngleTol = wasRLegMatched ? BONE_ANGLE_EXIT_TOL : BONE_ANGLE_ENTER_TOL;
    const rLegPosTol = wasRLegMatched ? LIMB_POS_EXIT_TOL : LIMB_POS_ENTER_TOL;
    agentResult.right_leg = rThighAngleErr <= rLegAngleTol && rCalfAngleErr <= rLegAngleTol && rAnklePosErr <= rLegPosTol;

    // Check if any limb newly matched
    (Object.keys(agentResult) as LimbKey[]).forEach((k) => {
      if (agentResult[k] && !prevAgentMatches[k]) {
        newGlowOccurred = true;
      }
    });

    updatedMatches[agentId] = agentResult;
  });

  return { updatedMatches, newGlowOccurred };
}

/**
 * Helper to compute an individual limb accuracy score.
 * Both bones must match to achieve a high score (> 75%).
 * Unposed limbs with large angular discrepancy drop steeply toward 0%.
 */
function computeLimbAccuracy(degErr1: number, degErr2: number, endDist: number): number {
  const maxAngleErr = Math.max(degErr1, degErr2);

  let angleScore = 0;
  if (maxAngleErr <= 8) {
    angleScore = 100 - maxAngleErr * 1.25; // 90 ~ 100%
  } else if (maxAngleErr <= 18) {
    angleScore = 90 - (maxAngleErr - 8) * 1.5; // 75 ~ 90%
  } else if (maxAngleErr <= 32) {
    angleScore = Math.max(0, 75 - (maxAngleErr - 18) * 3.5); // 26 ~ 75%
  } else if (maxAngleErr <= 55) {
    angleScore = Math.max(0, 26 - (maxAngleErr - 32) * 1.1); // 0 ~ 26%
  } else {
    angleScore = 0;
  }

  let distScore = 0;
  if (endDist <= 15) {
    distScore = 100 - endDist;
  } else if (endDist <= 40) {
    distScore = Math.max(0, 85 - (endDist - 15) * 2.2);
  } else {
    distScore = Math.max(0, 30 - (endDist - 40) * 1.0);
  }

  // Dual-bone angle match accounts for 85%, end joint distance accounts for 15%
  return Math.min(100, Math.max(0, Math.round(angleScore * 0.85 + distScore * 0.15)));
}

/**
 * Calculates continuous overall accuracy.
 * Cancels Torso/Head base points.
 * Total score is evenly divided across the 4 limbs (25% each).
 * Initial unposed stickman starts at < 20%.
 */
export function calculateAccuracy(
  userPoses: StickmanPose[],
  targetPoses: StickmanPose[]
): { overallScore: number; limbAccuracies: Record<string, LimbAccuracy> } {
  const limbAccuracies: Record<string, LimbAccuracy> = {};
  let totalScoreSum = 0;

  userPoses.forEach((user, idx) => {
    const target = targetPoses[idx] || targetPoses[0];

    // 1. Head (for diagnostics only, 0% of overall score)
    const headAngleErr = angleDiffDeg(angleDeg(user.neck, user.head), angleDeg(target.neck, target.head));
    const headDist = distance(user.head, target.head);
    const headAcc = Math.round(
      Math.max(0, 100 - headAngleErr * 2.5) * 0.7 +
      Math.max(0, 100 - headDist * 2) * 0.3
    );

    // 2. Torso (for diagnostics only, 0% of overall score)
    const torsoAngleErr = angleDiffDeg(angleDeg(user.hip, user.neck), angleDeg(target.hip, target.neck));
    const torsoDist = (distance(user.neck, target.neck) + distance(user.hip, target.hip)) * 0.5;
    const torsoAcc = Math.round(
      Math.max(0, 100 - torsoAngleErr * 2.5) * 0.7 +
      Math.max(0, 100 - torsoDist * 2) * 0.3
    );

    // 3. Left Arm (Upper arm + Forearm vector angles)
    const uLShoulder = getShoulderPos(user.neck, true);
    const tLShoulder = getShoulderPos(target.neck, true);
    const lUpperAngleErr = angleDiffDeg(angleDeg(uLShoulder, user.leftElbow), angleDeg(tLShoulder, target.leftElbow));
    const lForeAngleErr = angleDiffDeg(angleDeg(user.leftElbow, user.leftWrist), angleDeg(target.leftElbow, target.leftWrist));
    const lWristDist = distance(user.leftWrist, target.leftWrist);
    const lArmAcc = computeLimbAccuracy(lUpperAngleErr, lForeAngleErr, lWristDist);

    // 4. Right Arm (Upper arm + Forearm vector angles)
    const uRShoulder = getShoulderPos(user.neck, false);
    const tRShoulder = getShoulderPos(target.neck, false);
    const rUpperAngleErr = angleDiffDeg(angleDeg(uRShoulder, user.rightElbow), angleDeg(tRShoulder, target.rightElbow));
    const rForeAngleErr = angleDiffDeg(angleDeg(user.rightElbow, user.rightWrist), angleDeg(target.rightElbow, target.rightWrist));
    const rWristDist = distance(user.rightWrist, target.rightWrist);
    const rArmAcc = computeLimbAccuracy(rUpperAngleErr, rForeAngleErr, rWristDist);

    // 5. Left Leg (Thigh + Calf vector angles)
    const uLPelvis = getPelvisPos(user.hip, true);
    const tLPelvis = getPelvisPos(target.hip, true);
    const lThighAngleErr = angleDiffDeg(angleDeg(uLPelvis, user.leftKnee), angleDeg(tLPelvis, target.leftKnee));
    const lCalfAngleErr = angleDiffDeg(angleDeg(user.leftKnee, user.leftAnkle), angleDeg(target.leftKnee, target.leftAnkle));
    const lAnkleDist = distance(user.leftAnkle, target.leftAnkle);
    const lLegAcc = computeLimbAccuracy(lThighAngleErr, lCalfAngleErr, lAnkleDist);

    // 6. Right Leg (Thigh + Calf vector angles)
    const uRPelvis = getPelvisPos(user.hip, false);
    const tRPelvis = getPelvisPos(target.hip, false);
    const rThighAngleErr = angleDiffDeg(angleDeg(uRPelvis, user.rightKnee), angleDeg(tRPelvis, target.rightKnee));
    const rCalfAngleErr = angleDiffDeg(angleDeg(user.rightKnee, user.rightAnkle), angleDeg(target.rightKnee, target.rightAnkle));
    const rAnkleDist = distance(user.rightAnkle, target.rightAnkle);
    const rLegAcc = computeLimbAccuracy(rThighAngleErr, rCalfAngleErr, rAnkleDist);

    // Total score is strictly and evenly divided among the 4 limbs (25% each)
    // No free anchor/torso bonus!
    const agentOverall = Math.round(
      lArmAcc * 0.25 +
      rArmAcc * 0.25 +
      lLegAcc * 0.25 +
      rLegAcc * 0.25
    );

    limbAccuracies[user.id] = {
      head: headAcc,
      torso: torsoAcc,
      left_arm: lArmAcc,
      right_arm: rArmAcc,
      left_leg: lLegAcc,
      right_leg: rLegAcc,
      overall: agentOverall,
    };

    totalScoreSum += agentOverall;
  });

  const overallScore = Math.round(totalScoreSum / userPoses.length);
  return { overallScore, limbAccuracies };
}
