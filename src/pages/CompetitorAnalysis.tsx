import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, TrendingUp, AlertTriangle } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const mockCompetitor = {
  domain: "competitor.com",
  organicTraffic: "12.5K",
  topKeywords: [
    { keyword: "seo tools online", position: 3, volume: 4200 },
    { keyword: "website audit tool", position: 5, volume: 3100 },
    { keyword: "check seo score", position: 2, volume: 2800 },
    { keyword: "seo checker free", position: 7, volume: 5600 },
  ],
  gaps: [
    { keyword: "local seo tips", competitorPos: 4, yourPos: null },
    { keyword: "seo for restaurants", competitorPos: 8, yourPos: null },
    { keyword: "small business seo", competitorPos: 6, yourPos: 42 },
  ],
};

export default function CompetitorAnalysis() {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState(false);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim()) setResults(true);
  };

  return (
    <div className="max-w-4xl">
      <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-2xl font-bold mb-2">Competitor Analysis</motion.h1>
      <motion.p initial="hidden" animate="visible" variants={fadeUp} className="text-muted-foreground mb-8">Understand your competitors' SEO strategy.</motion.p>

      <motion.form initial="hidden" animate="visible" variants={fadeUp} onSubmit={handleAnalyze} className="flex gap-3 mb-8">
        <Input placeholder="Enter competitor domain..." value={domain} onChange={(e) => setDomain(e.target.value)} className="flex-1 bg-muted border-border" />
        <Button variant="hero" type="submit"><Search className="h-4 w-4 mr-1" /> Analyze</Button>
      </motion.form>

      {results && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground"><Users className="h-4 w-4" /> Domain</div>
              <p className="text-lg font-semibold text-foreground">{mockCompetitor.domain}</p>
            </motion.div>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground"><TrendingUp className="h-4 w-4" /> Est. Organic Traffic</div>
              <p className="text-lg font-semibold text-foreground">{mockCompetitor.organicTraffic}/mo</p>
            </motion.div>
          </div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card overflow-hidden">
            <div className="p-4 border-b border-border"><h3 className="font-semibold">Top Ranking Keywords</h3></div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-3 font-medium">Keyword</th>
                <th className="text-right p-3 font-medium">Position</th>
                <th className="text-right p-3 font-medium">Volume</th>
              </tr></thead>
              <tbody>
                {mockCompetitor.topKeywords.map(k => (
                  <tr key={k.keyword} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-3 text-foreground">{k.keyword}</td>
                    <td className="p-3 text-right font-medium text-primary">#{k.position}</td>
                    <td className="p-3 text-right text-muted-foreground">{k.volume.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <h3 className="font-semibold">Keyword Gaps</h3>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-3 font-medium">Keyword</th>
                <th className="text-right p-3 font-medium">Competitor</th>
                <th className="text-right p-3 font-medium">You</th>
              </tr></thead>
              <tbody>
                {mockCompetitor.gaps.map(g => (
                  <tr key={g.keyword} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-3 text-foreground">{g.keyword}</td>
                    <td className="p-3 text-right font-medium text-primary">#{g.competitorPos}</td>
                    <td className="p-3 text-right font-medium text-destructive">{g.yourPos ? `#${g.yourPos}` : "Not ranking"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      )}
    </div>
  );
}
