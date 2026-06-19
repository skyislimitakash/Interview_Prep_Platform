import { ReactNode } from "react";

type BadgeTone = "neutral" | "good" | "warn" | "bad" | "accent";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
}

const toneStyles: Record<BadgeTone, string> = {
  neutral: "bg-ink-raised text-paper-muted hairline",
  good: "bg-good/10 text-good border border-good/30",
  warn: "bg-warn/10 text-warn border border-warn/30",
  bad: "bg-bad/10 text-bad border border-bad/30",
  accent: "bg-accent/10 text-accent border border-accent/30",
};

export const Badge = ({ children, tone = "neutral" }: BadgeProps) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${toneStyles[tone]}`}
  >
    {children}
  </span>
);
