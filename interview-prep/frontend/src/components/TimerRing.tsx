interface TimerRingProps {
  elapsedSeconds: number;
  size?: number;
}

// Visual reference point only — ring "lap" length, not a hard limit.
// At 180s the ring completes one full revolution, then keeps spinning.
const LAP_SECONDS = 180;

const formatTime = (totalSeconds: number): string => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const TimerRing = ({ elapsedSeconds, size = 56 }: TimerRingProps) => {
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (elapsedSeconds % LAP_SECONDS) / LAP_SECONDS;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#2A2D35"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#6C63FF"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      <span className="absolute text-[11px] font-medium text-paper-muted tabular-nums">
        {formatTime(elapsedSeconds)}
      </span>
    </div>
  );
};
