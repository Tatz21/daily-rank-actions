import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

type CompetitorData = {
  domain: string;
  organicTraffic: string;
  topKeywords: { keyword: string; position: number; volume: number }[];
  gaps: { keyword: string; competitorPos: number; yourPos: number | null }[];
};

export default function CompetitorAnalysis() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CompetitorData | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setData(null);

    try {
      const { data: result, error } = await supabase.functions.invoke("competitor-analysis", {
        body: { domain: domain.trim() },
      });

      if (error) throw error;
      if (result?.error) { toast.error(result.error); return; }

      setData(result);
      toast.success("Competitor analysis complete!");
    } catch (err: any) {
      console.error("Competitor error:", err);
      toast.error(err.message || "Failed to analyze competitor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-2xl font-bold mb-2">Competitor Analysis</motion.h1>
      <motion.p initial="hidden" animate="visible" variants={fadeUp} className="text-muted-foreground mb-8">Understand your competitors' SEO strategy with AI.</motion.p>

      <motion.form initial="hidden" animate="visible" variants={fadeUp} onSubmit={handleAnalyze} className="flex gap-3 mb-8">
        <Input placeholder="Enter competitor domain..." value={domain} onChange={(e) => setDomain(e.target.value)} className="flex-1 bg-muted border-border" disabled={loading} />
        <Button variant="hero" type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Search className="h-4 w-4 mr-1" />}
          {loading ? "Analyzing..." : "Analyze"}
        </Button>
      </motion.form>

      {loading && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">AI is analyzing the competitor...</p>
        </motion.div>
      )}

      {data && !loading && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground"><Users className="h-4 w-4" /> Domain</div>
              <p className="text-lg font-semibold text-foreground">{data.domain}</p>
            </motion.div>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground"><TrendingUp className="h-4 w-4" /> Est. Organic Traffic</div>
              <p className="text-lg font-semibold text-foreground">{data.organicTraffic}/mo</p>
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
                {data.topKeywords?.map(k => (
                  <tr key={k.keyword} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-3 text-foreground">{k.keyword}</td>
                    <td className="p-3 text-right font-medium text-primary">#{k.position}</td>
                    <td className="p-3 text-right text-muted-foreground">{k.volume?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h3 className="font-semibold">Keyword Gaps</h3>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-3 font-medium">Keyword</th>
                <th className="text-right p-3 font-medium">Competitor</th>
                <th className="text-right p-3 font-medium">You</th>
              </tr></thead>
              <tbody>
                {data.gaps?.map(g => (
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
