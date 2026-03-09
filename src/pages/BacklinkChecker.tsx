import { useState } from "react";
import { motion } from "framer-motion";
import { Link2, Loader2, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import HowToUse from "@/components/HowToUse";
import QuickSuggestions from "@/components/QuickSuggestions";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

const howToSteps = [
  { title: "Enter a domain", description: "Type the website you want to analyze backlinks for." },
  { title: "Click 'Analyze'", description: "AI estimates the backlink profile including authority, toxic links, and opportunities." },
  { title: "Review insights", description: "Use the analysis to plan your link-building strategy." },
];

const suggestions = ["example.com", "competitor.com", "mybusiness.com", "techblog.io"];

type BacklinkResult = {
  authorityScore: number;
  estimatedBacklinks: number;
  toxicLinks: string[];
  opportunities: string[];
  topReferringDomains: string[];
};

export default function BacklinkChecker() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BacklinkResult | null>(null);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("backlink-checker", {
        body: { domain: domain.trim() },
      });
      if (error) throw error;
      if (data?.error) { toast.error(data.error); return; }
      setResult(data);
      toast.success("Backlink analysis complete!");
    } catch (err: any) {
      console.error("Backlink error:", err);
      toast.error(err.message || "Failed to analyze backlinks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Link2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Backlink Checker</h1>
          <p className="text-sm text-muted-foreground">AI-estimated backlink profile analysis.</p>
        </div>
      </motion.div>

      <HowToUse steps={howToSteps} />
      <QuickSuggestions suggestions={suggestions} onSelect={(s) => setDomain(s)} label="Try with a sample domain" />

      <motion.form initial="hidden" animate="visible" custom={1} variants={fadeUp} onSubmit={handleAnalyze} className="flex gap-3 mb-8">
        <Input placeholder="Enter domain (e.g. example.com)" value={domain} onChange={(e) => setDomain(e.target.value)} className="flex-1 bg-muted border-border" disabled={loading} />
        <Button variant="hero" type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Link2 className="h-4 w-4 mr-1" />}
          {loading ? "Analyzing..." : "Analyze"}
        </Button>
      </motion.form>

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">AI is estimating your backlink profile...</p>
        </motion.div>
      )}

      {!loading && result && (
        <div className="space-y-4">
          <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp} className="glass-card p-6 flex items-center gap-6">
            <div className="relative h-20 w-20 shrink-0">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--muted))" strokeWidth="2" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray={`${result.authorityScore * 1.005} 100`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-foreground">{result.authorityScore}</span>
            </div>
            <div>
              <h2 className="font-semibold text-lg">Domain Authority</h2>
              <p className="text-sm text-muted-foreground">Est. {result.estimatedBacklinks} backlinks</p>
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp} className="glass-card p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />Top Referring Domains</h3>
            <div className="space-y-2">
              {result.topReferringDomains.map((d) => (
                <div key={d} className="p-2 rounded-lg bg-muted/30 text-sm text-foreground">{d}</div>
              ))}
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" custom={4} variants={fadeUp} className="glass-card p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><XCircle className="h-4 w-4 text-destructive" />Potential Toxic Links</h3>
            <div className="space-y-2">
              {result.toxicLinks.map((t) => (
                <div key={t} className="p-2 rounded-lg bg-destructive/5 text-sm text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />{t}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" custom={5} variants={fadeUp} className="glass-card p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Link2 className="h-4 w-4 text-primary" />Link Building Opportunities</h3>
            <div className="space-y-2">
              {result.opportunities.map((o) => (
                <div key={o} className="p-2 rounded-lg bg-primary/5 text-sm text-foreground">{o}</div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
