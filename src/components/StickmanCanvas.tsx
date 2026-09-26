import React, { useRef, useState, useCallback, useEffect } from 'react';
import { JointKey, Language, LimbKey, LimbMatchMap, Point, StickmanPose } from '../types';
import {
  CANVAS_SIZE,
  GROUND_Y,
  BONE_LENGTHS,
  getShoulderPos,
  getPelvisPos,
  updateStickmanDrag,
  applySoftRebound,
  isBodyFlatEnough,
  DEFAULT_FLAT_SLIT,
  FlatSlit,
} from '../utils/kinematics';
import { sounds } from '../utils/audio';

interface Props {
  userPoses: StickmanPose[];
  targetPoses: StickmanPose[];
  limbMatches: LimbMatchMap;
  showShadow: boolean;
  isMemoryBlindPhase: boolean;
  isDuo: boolean;
  language?: Language;
  onPoseChange: (newPoses: StickmanPose[]) => void;
  interactive: boolean;
  /** Step-1 test mode: show a static horizontal slit and live flat-check feedback */
  flatTestMode?: boolean;
  flatSlit?: FlatSlit;
  onFlatStatusChange?: (status: { pass: boolean; bodyHeight: number; heightRatio: number }) => void;
}

export const StickmanCanvas: React.FC<Props> = ({
  userPoses,
  targetPoses,
  limbMatches,
  showShadow,
  isMemoryBlindPhase,
  isDuo,
  language = 'zh',
  onPoseChange,
  interactive,
  flatTestMode = false,
  flatSlit = DEFAULT_FLAT_SLIT,
  onFlatStatusChange,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Active dragging state
  const [activeDrag, setActiveDrag] = useState<{
    agentId: string;
    joint: JointKey;
    lastPointer: Point;
  } | null>(null);

  // Coordinate conversion from screen clientX/Y to SVG viewBox coordinates
  const getSVGPoint = useCallback((clientX: number, clientY: number): Point => {
    if (!svgRef.current) return { x: clientX, y: clientY };
    const pt = svgRef.current.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svgRef.current.getScreenCTM();
    if (!ctm) return { x: clientX, y: clientY };
    const svgPt = pt.matrixTransform(ctm.inverse());
    return { x: svgPt.x, y: svgPt.y };
  }, []);

  const handlePointerDown = (
    e: React.PointerEvent,
    agentId: string,
    joint: JointKey
  ) => {
    if (!interactive) return;
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);

    const pt = getSVGPoint(e.clientX, e.clientY);
    setActiveDrag({ agentId, joint, lastPointer: pt });
    sounds.playJointGrab();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeDrag || !interactive) return;
    const currentPt = getSVGPoint(e.clientX, e.clientY);

    const agentIdx = userPoses.findIndex((p) => p.id === activeDrag.agentId);
    if (agentIdx === -1) return;

    const currentPose = userPoses[agentIdx];
    const updatedPose = updateStickmanDrag(
      currentPose,
      activeDrag.joint,
      currentPt,
      activeDrag.lastPointer
    );

    const nextUserPoses = [...userPoses];
    nextUserPoses[agentIdx] = updatedPose;
    onPoseChange(nextUserPoses);

    setActiveDrag({
      agentId: activeDrag.agentId,
      joint: activeDrag.joint,
      lastPointer: currentPt,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activeDrag) {
      try {
        (e.target as Element).releasePointerCapture?.(e.pointerId);
      } catch {
        // ignore
      }

      // Soft rubber-band rebound on release (pleasant feel, prevents permanent spaghetti limbs)
      const agentIdx = userPoses.findIndex((p) => p.id === activeDrag.agentId);
      if (agentIdx !== -1) {
        const rebounded = applySoftRebound(userPoses[agentIdx], 0.28);
        const next = [...userPoses];
        next[agentIdx] = rebounded;
        onPoseChange(next);
      }

      setActiveDrag(null);
    }
  };

  // Live flat-check for Step-1 test mode
  useEffect(() => {
    if (!flatTestMode || !onFlatStatusChange || userPoses.length === 0) return;
    const status = isBodyFlatEnough(userPoses[0], flatSlit);
    onFlatStatusChange({
      pass: status.pass,
      bodyHeight: status.bodyHeight,
      heightRatio: status.heightRatio,
    });
  }, [userPoses, flatTestMode, flatSlit, onFlatStatusChange]);

  // Render individual target shadow stickman
  const renderShadow = (pose: StickmanPose, colorTheme: 'solo' | 'blue' | 'orange') => {
    const shoulderL = getShoulderPos(pose.neck, true);
    const shoulderR = getShoulderPos(pose.neck, false);
    const pelvisL = getPelvisPos(pose.hip, true);
    const pelvisR = getPelvisPos(pose.hip, false);

    const shadowFill =
      colorTheme === 'blue'
        ? 'rgba(56, 189, 248, 0.28)'
        : colorTheme === 'orange'
        ? 'rgba(251, 146, 60, 0.28)'
        : 'rgba(148, 163, 184, 0.26)';

    const shadowStroke =
      colorTheme === 'blue'
        ? 'rgba(56, 189, 248, 0.65)'
        : colorTheme === 'orange'
        ? 'rgba(251, 146, 60, 0.65)'
        : 'rgba(203, 213, 225, 0.55)';

    return (
      <g key={`shadow-${pose.id}`} className="transition-opacity duration-300">
        {/* Head */}
        <circle
          cx={pose.head.x}
          cy={pose.head.y}
          r={BONE_LENGTHS.headRadius}
          fill={shadowFill}
          stroke={shadowStroke}
          strokeWidth="3.5"
          strokeDasharray="5,4"
        />

        {/* Torso */}
        <line
          x1={pose.neck.x}
          y1={pose.neck.y}
          x2={pose.hip.x}
          y2={pose.hip.y}
          stroke={shadowStroke}
          strokeWidth="9.5"
          strokeLinecap="round"
          strokeDasharray="6,4"
        />

        {/* Left Arm */}
        <polyline
          points={`${shoulderL.x},${shoulderL.y} ${pose.leftElbow.x},${pose.leftElbow.y} ${pose.leftWrist.x},${pose.leftWrist.y}`}
          fill="none"
          stroke={shadowStroke}
          strokeWidth="7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="5,4"
        />

        {/* Right Arm */}
        <polyline
          points={`${shoulderR.x},${shoulderR.y} ${pose.rightElbow.x},${pose.rightElbow.y} ${pose.rightWrist.x},${pose.rightWrist.y}`}
          fill="none"
          stroke={shadowStroke}
          strokeWidth="7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="5,4"
        />

        {/* Left Leg */}
        <polyline
          points={`${pelvisL.x},${pelvisL.y} ${pose.leftKnee.x},${pose.leftKnee.y} ${pose.leftAnkle.x},${pose.leftAnkle.y}`}
          fill="none"
          stroke={shadowStroke}
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="6,4"
        />

        {/* Right Leg */}
        <polyline
          points={`${pelvisR.x},${pelvisR.y} ${pose.rightKnee.x},${pose.rightKnee.y} ${pose.rightAnkle.x},${pose.rightAnkle.y}`}
          fill="none"
          stroke={shadowStroke}
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="6,4"
        />

        {/* Target keypoint anchors */}
        {[
          pose.head,
          pose.leftWrist,
          pose.rightWrist,
          pose.leftAnkle,
          pose.rightAnkle,
        ].map((pt, i) => (
          <circle
            key={`shadow-node-${i}`}
            cx={pt.x}
            cy={pt.y}
            r="4.5"
            fill={shadowStroke}
            opacity="0.8"
          />
        ))}
      </g>
    );
  };

  // Render individual player stickman with Emerald Glow feedback
  const renderUserStickman = (pose: StickmanPose, colorTheme: 'solo' | 'blue' | 'orange') => {
    const matches = limbMatches[pose.id] || {
      head: false,
      torso: false,
      left_arm: false,
      right_arm: false,
      left_leg: false,
      right_leg: false,
    };

    // IN MEMORY MODE (Blind Phase): disable the real-time green glow completely!
    const effectiveMatches = isMemoryBlindPhase
      ? {
          head: false,
          torso: false,
          left_arm: false,
          right_arm: false,
          left_leg: false,
          right_leg: false,
        }
      : matches;

    const shoulderL = getShoulderPos(pose.neck, true);
    const shoulderR = getShoulderPos(pose.neck, false);
    const pelvisL = getPelvisPos(pose.hip, true);
    const pelvisR = getPelvisPos(pose.hip, false);

    const getLimbColor = (key: LimbKey): string => {
      if (effectiveMatches[key]) {
        return '#10B981'; // Glowing Emerald Green
      }
      return '#FFFFFF'; // Crisp White
    };

    const getLimbFilter = (key: LimbKey): string => {
      if (effectiveMatches[key]) {
        return 'url(#glow-emerald)';
      }
      return 'none';
    };

    const badgeBorder =
      colorTheme === 'blue'
        ? '#38BDF8'
        : colorTheme === 'orange'
        ? '#FB923C'
        : '#94A3B8';

    return (
      <g key={`agent-${pose.id}`}>
        {/* Torso */}
        <line
          x1={pose.neck.x}
          y1={pose.neck.y}
          x2={pose.hip.x}
          y2={pose.hip.y}
          stroke={getLimbColor('torso')}
          strokeWidth="9.5"
          strokeLinecap="round"
          filter={getLimbFilter('torso')}
          className="transition-colors duration-150"
        />

        {/* Head */}
        <g>
          <line
            x1={pose.neck.x}
            y1={pose.neck.y}
            x2={pose.head.x}
            y2={pose.head.y + 14}
            stroke={getLimbColor('head')}
            strokeWidth="7"
            strokeLinecap="round"
            filter={getLimbFilter('head')}
          />
          <circle
            cx={pose.head.x}
            cy={pose.head.y}
            r={BONE_LENGTHS.headRadius}
            fill="#0A101D"
            stroke={getLimbColor('head')}
            strokeWidth="4.5"
            filter={getLimbFilter('head')}
            className="transition-colors duration-150 cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => handlePointerDown(e, pose.id, 'head')}
          />
          {/* Agent color accent band on head in Duo mode */}
          {isDuo && (
            <circle
              cx={pose.head.x}
              cy={pose.head.y}
              r={BONE_LENGTHS.headRadius - 8}
              fill="none"
              stroke={badgeBorder}
              strokeWidth="2.5"
              strokeDasharray="4,3"
            />
          )}
        </g>

        {/* Left Arm */}
        <polyline
          points={`${shoulderL.x},${shoulderL.y} ${pose.leftElbow.x},${pose.leftElbow.y} ${pose.leftWrist.x},${pose.leftWrist.y}`}
          fill="none"
          stroke={getLimbColor('left_arm')}
          strokeWidth="7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={getLimbFilter('left_arm')}
          className="transition-colors duration-150"
        />

        {/* Right Arm */}
        <polyline
          points={`${shoulderR.x},${shoulderR.y} ${pose.rightElbow.x},${pose.rightElbow.y} ${pose.rightWrist.x},${pose.rightWrist.y}`}
          fill="none"
          stroke={getLimbColor('right_arm')}
          strokeWidth="7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={getLimbFilter('right_arm')}
          className="transition-colors duration-150"
        />

        {/* Left Leg */}
        <polyline
          points={`${pelvisL.x},${pelvisL.y} ${pose.leftKnee.x},${pose.leftKnee.y} ${pose.leftAnkle.x},${pose.leftAnkle.y}`}
          fill="none"
          stroke={getLimbColor('left_leg')}
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={getLimbFilter('left_leg')}
          className="transition-colors duration-150"
        />

        {/* Right Leg */}
        <polyline
          points={`${pelvisR.x},${pelvisR.y} ${pose.rightKnee.x},${pose.rightKnee.y} ${pose.rightAnkle.x},${pose.rightAnkle.y}`}
          fill="none"
          stroke={getLimbColor('right_leg')}
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={getLimbFilter('right_leg')}
          className="transition-colors duration-150"
        />

        {/* Active Draggable Joints */}
        {interactive && (
          <g>
            {/* Hip Body Move Handle (Purple) */}
            <g
              className="cursor-move"
              onPointerDown={(e) => handlePointerDown(e, pose.id, 'hip')}
            >
              <circle
                cx={pose.hip.x}
                cy={pose.hip.y}
                r="22"
                fill="transparent"
              />
              <circle
                cx={pose.hip.x}
                cy={pose.hip.y}
                r="9"
                fill="#8B5CF6"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                className="drop-shadow-[0_0_6px_rgba(139,92,246,0.8)]"
              />
              <circle
                cx={pose.hip.x}
                cy={pose.hip.y}
                r="3"
                fill="#FFFFFF"
              />
            </g>

            {/* Hand Wrists (Red Active Effectors) */}
            <g
              className="cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => handlePointerDown(e, pose.id, 'leftWrist')}
            >
              <circle cx={pose.leftWrist.x} cy={pose.leftWrist.y} r="24" fill="transparent" />
              <circle
                cx={pose.leftWrist.x}
                cy={pose.leftWrist.y}
                r="10"
                fill="#EF4444"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                filter="url(#glow-red)"
              />
              <circle
                cx={pose.leftWrist.x}
                cy={pose.leftWrist.y}
                r="3"
                fill="#FFFFFF"
              />
            </g>

            <g
              className="cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => handlePointerDown(e, pose.id, 'rightWrist')}
            >
              <circle cx={pose.rightWrist.x} cy={pose.rightWrist.y} r="24" fill="transparent" />
              <circle
                cx={pose.rightWrist.x}
                cy={pose.rightWrist.y}
                r="10"
                fill="#EF4444"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                filter="url(#glow-red)"
              />
              <circle
                cx={pose.rightWrist.x}
                cy={pose.rightWrist.y}
                r="3"
                fill="#FFFFFF"
              />
            </g>

            {/* Foot Ankles (Red Active Effectors) */}
            <g
              className="cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => handlePointerDown(e, pose.id, 'leftAnkle')}
            >
              <circle cx={pose.leftAnkle.x} cy={pose.leftAnkle.y} r="24" fill="transparent" />
              <circle
                cx={pose.leftAnkle.x}
                cy={pose.leftAnkle.y}
                r="10"
                fill="#EF4444"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                filter="url(#glow-red)"
              />
              <circle
                cx={pose.leftAnkle.x}
                cy={pose.leftAnkle.y}
                r="3"
                fill="#FFFFFF"
              />
            </g>

            <g
              className="cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => handlePointerDown(e, pose.id, 'rightAnkle')}
            >
              <circle cx={pose.rightAnkle.x} cy={pose.rightAnkle.y} r="24" fill="transparent" />
              <circle
                cx={pose.rightAnkle.x}
                cy={pose.rightAnkle.y}
                r="10"
                fill="#EF4444"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                filter="url(#glow-red)"
              />
              <circle
                cx={pose.rightAnkle.x}
                cy={pose.rightAnkle.y}
                r="3"
                fill="#FFFFFF"
              />
            </g>

            {/* Elbows (Orange bend nodes) */}
            <g
              className="cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => handlePointerDown(e, pose.id, 'leftElbow')}
            >
              <circle cx={pose.leftElbow.x} cy={pose.leftElbow.y} r="20" fill="transparent" />
              <circle
                cx={pose.leftElbow.x}
                cy={pose.leftElbow.y}
                r="7"
                fill="#F97316"
                stroke="#FFFFFF"
                strokeWidth="2"
                filter="url(#glow-orange)"
              />
              <circle
                cx={pose.leftElbow.x}
                cy={pose.leftElbow.y}
                r="2"
                fill="#FFFFFF"
              />
            </g>

            <g
              className="cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => handlePointerDown(e, pose.id, 'rightElbow')}
            >
              <circle cx={pose.rightElbow.x} cy={pose.rightElbow.y} r="20" fill="transparent" />
              <circle
                cx={pose.rightElbow.x}
                cy={pose.rightElbow.y}
                r="7"
                fill="#F97316"
                stroke="#FFFFFF"
                strokeWidth="2"
                filter="url(#glow-orange)"
              />
              <circle
                cx={pose.rightElbow.x}
                cy={pose.rightElbow.y}
                r="2"
                fill="#FFFFFF"
              />
            </g>

            {/* Knees (Orange bend nodes) */}
            <g
              className="cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => handlePointerDown(e, pose.id, 'leftKnee')}
            >
              <circle cx={pose.leftKnee.x} cy={pose.leftKnee.y} r="20" fill="transparent" />
              <circle
                cx={pose.leftKnee.x}
                cy={pose.leftKnee.y}
                r="7"
                fill="#F97316"
                stroke="#FFFFFF"
                strokeWidth="2"
                filter="url(#glow-orange)"
              />
              <circle
                cx={pose.leftKnee.x}
                cy={pose.leftKnee.y}
                r="2"
                fill="#FFFFFF"
              />
            </g>

            <g
              className="cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => handlePointerDown(e, pose.id, 'rightKnee')}
            >
              <circle cx={pose.rightKnee.x} cy={pose.rightKnee.y} r="20" fill="transparent" />
              <circle
                cx={pose.rightKnee.x}
                cy={pose.rightKnee.y}
                r="7"
                fill="#F97316"
                stroke="#FFFFFF"
                strokeWidth="2"
                filter="url(#glow-orange)"
              />
              <circle
                cx={pose.rightKnee.x}
                cy={pose.rightKnee.y}
                r="2"
                fill="#FFFFFF"
              />
            </g>
          </g>
        )}
      </g>
    );
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none touch-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
        className="w-full h-full max-w-[560px] max-h-[560px] aspect-square drop-shadow-2xl"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <defs>
          {/* Emerald Green Glow Filter */}
          <filter id="glow-emerald" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Red Node Glow Filter */}
          <filter id="glow-red" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Orange Node Glow Filter */}
          <filter id="glow-orange" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Cyan Floor Glow Filter */}
          <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Grid pattern for high-tech stealth floor */}
          <pattern
            id="stealth-grid"
            width="25"
            height="25"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 25 0 L 0 0 0 25"
              fill="none"
              stroke="rgba(51, 65, 85, 0.22)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        {/* Background Canvas Ambience */}
        <rect width={CANVAS_SIZE} height={CANVAS_SIZE} fill="#090D16" />

        {/* Laser Grid Background */}
        <rect
          x="20"
          y="20"
          width={CANVAS_SIZE - 40}
          height={GROUND_Y - 20}
          fill="url(#stealth-grid)"
          opacity="0.8"
        />

        {/* GROUND_Y = 420 Stealth Floor */}
        <g>
          {/* Ground glow line */}
          <line
            x1="10"
            y1={GROUND_Y}
            x2={CANVAS_SIZE - 10}
            y2={GROUND_Y}
            stroke="#06B6D4"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#glow-cyan)"
            opacity="0.85"
          />
          {/* Ground reflection gradient / depth */}
          <rect
            x="10"
            y={GROUND_Y}
            width={CANVAS_SIZE - 20}
            height={CANVAS_SIZE - GROUND_Y}
            fill="rgba(8, 15, 30, 0.85)"
          />
          {/* Floor measurement marks */}
          {[-150, -100, -50, 0, 50, 100, 150].map((offset, i) => (
            <line
              key={`ground-mark-${i}`}
              x1={250 + offset}
              y1={GROUND_Y}
              x2={250 + offset}
              y2={GROUND_Y + 7}
              stroke="rgba(6, 182, 212, 0.45)"
              strokeWidth="2"
            />
          ))}
        </g>

        {/* Target Silhouette Shadow (Shown when showShadow is true) */}
        {showShadow && (
          <g>
            {targetPoses.map((target, idx) => {
              const theme = isDuo
                ? idx === 0
                  ? 'blue'
                  : 'orange'
                : 'solo';
              return renderShadow(target, theme);
            })}
          </g>
        )}

        {/* ===== Step-1 Static Flat Slit (only when flatTestMode) ===== */}
        {flatTestMode && (
          <g>
            {/* Dark ceiling block */}
            <rect
              x={flatSlit.x ?? 40}
              y={0}
              width={flatSlit.width ?? 420}
              height={flatSlit.centerY - flatSlit.height / 2}
              fill="rgba(15, 23, 42, 0.82)"
              stroke="rgba(148, 163, 184, 0.35)"
              strokeWidth="2"
            />
            {/* Dark floor block */}
            <rect
              x={flatSlit.x ?? 40}
              y={flatSlit.centerY + flatSlit.height / 2}
              width={flatSlit.width ?? 420}
              height={GROUND_Y - (flatSlit.centerY + flatSlit.height / 2) + 30}
              fill="rgba(15, 23, 42, 0.82)"
              stroke="rgba(148, 163, 184, 0.35)"
              strokeWidth="2"
            />
            {/* The actual gap (glowing outline) */}
            <rect
              x={flatSlit.x ?? 40}
              y={flatSlit.centerY - flatSlit.height / 2}
              width={flatSlit.width ?? 420}
              height={flatSlit.height}
              fill="rgba(16, 185, 129, 0.08)"
              stroke="#10B981"
              strokeWidth="3"
              strokeDasharray="8,5"
            />
            {/* Center guide line */}
            <line
              x1={flatSlit.x ?? 40}
              y1={flatSlit.centerY}
              x2={(flatSlit.x ?? 40) + (flatSlit.width ?? 420)}
              y2={flatSlit.centerY}
              stroke="rgba(16, 185, 129, 0.45)"
              strokeWidth="1.5"
              strokeDasharray="4,4"
            />
          </g>
        )}

        {/* User Stickmen */}
        <g>
          {userPoses.map((pose, idx) => {
            const theme = isDuo
              ? idx === 0
                ? 'blue'
                : 'orange'
              : 'solo';
            return renderUserStickman(pose, theme);
          })}
        </g>
      </svg>
    </div>
  );
};
