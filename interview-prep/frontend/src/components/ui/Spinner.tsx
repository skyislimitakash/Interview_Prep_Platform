import { Loader2 } from "lucide-react";

export const Spinner = ({ label = "Loading..." }: { label?: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-paper-muted">
    <Loader2 className="w-6 h-6 animate-spin" />
    <span className="text-sm">{label}</span>
  </div>
);
