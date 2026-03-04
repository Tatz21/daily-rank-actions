import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface QuickSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  label?: string;
}

export default function QuickSuggestions({ suggestions, onSelect, label = "Quick suggestions" }: QuickSuggestionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
        <Sparkles className="h-3 w-3 text-primary" />
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            className="px-3 py-1.5 text-xs rounded-full border border-border bg-muted/50 text-foreground hover:bg-primary/10 hover:border-primary/30 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
