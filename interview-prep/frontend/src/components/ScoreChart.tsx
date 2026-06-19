import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Session } from "../types";

interface ScoreChartProps {
  sessions: Session[];
}

export const ScoreChart = ({ sessions }: ScoreChartProps) => {
  const data = sessions
    .filter((s) => s.avgScore !== null)
    .slice()
    .reverse()
    .map((s, idx) => ({
      session: idx + 1,
      score: Number(s.avgScore),
      topic: s.topic?.name || "Session",
    }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-paper-muted text-sm">
        Complete a session to see your score trend.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2A2D35" vertical={false} />
        <XAxis dataKey="session" stroke="#A3A299" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis domain={[0, 10]} stroke="#A3A299" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1B1E25",
            border: "1px solid #2A2D35",
            borderRadius: "8px",
            color: "#EDEBE3",
          }}
          labelFormatter={(label) => `Session ${label}`}
          formatter={(value: number) => [value.toFixed(1), "Avg score"]}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#6C63FF"
          strokeWidth={2}
          dot={{ fill: "#6C63FF", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
