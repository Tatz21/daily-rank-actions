import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown, Download } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

type KW = { keyword: string; volume: number; difficulty: number; opportunity: number };

const mockKeywords: KW[] = [
  { keyword: "best seo tools for small business", volume: 2400, difficulty: 35, opportunity: 82 },
  { keyword: "seo tips for beginners", volume: 5100, difficulty: 42, opportunity: 71 },
  { keyword: "local seo checklist", volume: 1800, difficulty: 28, opportunity: 88 },
  { keyword: "how to rank on google", volume: 8200, difficulty: 65, opportunity: 45 },
  { keyword: "free keyword research tool", volume: 3300, difficulty: 52, opportunity: 58 },
  { keyword: "seo audit free", volume: 1200, difficulty: 22, opportunity: 91 },
  { keyword: "on page seo guide", volume: 2700, difficulty: 38, opportunity: 76 },
];

const difficultyColor = (d: number) =>
  d < 30 ? "text-primary" : d < 50 ? "text-yellow-500" : "text-destructive";

export default function KeywordResearch() {
  const [seed, setSeed] = useState("");
  const [results, setResults] = useState<KW[] | null>(null);
  const [sortKey, setSortKey] = useState<keyof KW>("opportunity");
  const [sortAsc, setSortAsc] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (seed.trim()) setResults(mockKeywords);
  };

  const sorted = results
    ? [...results].sort((a, b) => sortAsc ? (a[sortKey] as number) - (b[sortKey] as number) : (b[sortKey] as number) - (a[sortKey] as number))
    : null;

  const toggleSort = (key: keyof KW) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  return (
    <div className="max-w-4xl">
      <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-2xl font-bold mb-2">
        Keyword Research
      </motion.h1>
      <motion.p initial="hidden" animate="visible" variants={fadeUp} className="text-muted-foreground mb-8">
        Discover low-competition keywords for your niche.
      </motion.p>

      <motion.form initial="hidden" animate="visible" variants={fadeUp} onSubmit={handleSearch} className="flex gap-3 mb-8">
        <Input placeholder="Enter a seed keyword..." value={seed} onChange={(e) => setSeed(e.target.value)} className="flex-1 bg-muted border-border" />
        <Button variant="hero" type="submit"><Search className="h-4 w-4 mr-1" /> Search</Button>
      </motion.form>

      {sorted && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="text-sm text-muted-foreground">{sorted.length} keywords found</span>
            <Button variant="ghost" size="sm"><Download className="h-3.5 w-3.5 mr-1" /> Export</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left p-3 font-medium">Keyword</th>
                  {(["volume", "difficulty", "opportunity"] as const).map((k) => (
                    <th key={k} className="text-right p-3 font-medium cursor-pointer hover:text-foreground transition-colors" onClick={() => toggleSort(k)}>
                      <span className="inline-flex items-center gap-1 capitalize">{k} <ArrowUpDown className="h-3 w-3" /></span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((kw) => (
                  <tr key={kw.keyword} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-3 text-foreground">{kw.keyword}</td>
                    <td className="p-3 text-right text-muted-foreground">{kw.volume.toLocaleString()}</td>
                    <td className={`p-3 text-right font-medium ${difficultyColor(kw.difficulty)}`}>{kw.difficulty}</td>
                    <td className="p-3 text-right font-medium text-primary">{kw.opportunity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
