import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const trackedKeywords = [
  { keyword: "best seo tools", url: "ranksprout.com", position: 12, change: +3 },
  { keyword: "seo for small business", url: "ranksprout.com/blog", position: 8, change: +5 },
  { keyword: "free seo audit", url: "ranksprout.com/audit", position: 23, change: -2 },
  { keyword: "keyword research tool", url: "ranksprout.com/keywords", position: 15, change: +1 },
  { keyword: "rank tracker free", url: "ranksprout.com", position: 31, change: -4 },
];

export default function RankTracker() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-2xl font-bold mb-1">Rank Tracker</motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} className="text-muted-foreground text-sm">Track your keyword positions over time.</motion.p>
        </div>
        <Button variant="hero" size="sm" onClick={() => setShowAdd(!showAdd)}><Plus className="h-3.5 w-3.5 mr-1" /> Add Keyword</Button>
      </div>

      {showAdd && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-4 mb-6 flex gap-3">
          <Input placeholder="Keyword" className="bg-muted border-border flex-1" />
          <Input placeholder="Target URL" className="bg-muted border-border flex-1" />
          <Input placeholder="Location" className="bg-muted border-border w-32" />
          <Button variant="hero" size="sm">Track</Button>
        </motion.div>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <ArrowUpRight className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Top Rising</span>
          </div>
          <div className="space-y-2">
            {trackedKeywords.filter(k => k.change > 0).slice(0, 3).map(k => (
              <div key={k.keyword} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{k.keyword}</span>
                <span className="text-primary font-medium">+{k.change}</span>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <ArrowDownRight className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-foreground">Top Dropping</span>
          </div>
          <div className="space-y-2">
            {trackedKeywords.filter(k => k.change < 0).map(k => (
              <div key={k.keyword} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{k.keyword}</span>
                <span className="text-destructive font-medium">{k.change}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left p-3 font-medium">Keyword</th>
              <th className="text-left p-3 font-medium">URL</th>
              <th className="text-right p-3 font-medium">Position</th>
              <th className="text-right p-3 font-medium">Change</th>
            </tr>
          </thead>
          <tbody>
            {trackedKeywords.map(k => (
              <tr key={k.keyword} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="p-3 text-foreground">{k.keyword}</td>
                <td className="p-3 text-muted-foreground">{k.url}</td>
                <td className="p-3 text-right font-medium text-foreground">#{k.position}</td>
                <td className={`p-3 text-right font-medium ${k.change > 0 ? "text-primary" : "text-destructive"}`}>
                  {k.change > 0 ? `+${k.change}` : k.change}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
