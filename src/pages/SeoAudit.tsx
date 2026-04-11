import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, AlertTriangle, CheckCircle2, Info, Search, Loader2, Gauge, Eye, ShieldCheck, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import HowToUse from "@/components/HowToUse";
import QuickSuggestions from "@/components/QuickSuggestions";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

type Issue = { title: string; explanation: string; fix: string; severity: "error" | "warning" | "pass" };
type AuditCategory = { category: string; issues: Issue[] };
type CoreWebVitals = { lcp: string; fid: string; cls: string; fcp: string; si: string; tbt: string; tti: string };
type PageSpeedData = {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  coreWebVitals: CoreWebVitals;
  diagnostics: { title: string; description: string; score: number; displayValue: string }[];
};

const severityIcon = {
  error: <AlertTriangle className="h-4 w-4 text-destructive" />,
  warning: <Info className="h-4 w-4 text-amber-500" />,
  pass: <CheckCircle2 className="h-4 w-4 text-primary" />,
};

const howToSteps = [
  { title: "Enter your website URL", description: "Type your domain like example.com or https://example.com in the input field." },
  { title: "Click 'Audit'", description: "Our AI will crawl your site and analyze SEO factors like meta tags, headings, speed, and more." },
  { title: "Review your score", description: "Get a score out of 100 with real Google PageSpeed data and AI-powered insights." },
  { title: "Fix the issues", description: "Follow the suggested fixes for each issue to improve your ranking." },
];

const suggestions = ["example.com", "shopify.com", "wordpress.org", "medium.com", "github.com"];

function ScoreRing({ score, label, icon, size = "sm" }: { score: number; label: string; icon: React.ReactNode; size?: "sm" | "lg" }) {
  const dim = size === "lg" ? 80 : 56;
  const r = size === "lg" ? 16 : 12;
  const vb = size === "lg" ? 36 : 28;
  const sw = size === "lg" ? 2 : 2;
  const circumference = 2 * Math.PI * r;
  const color = score >= 90 ? "hsl(var(--primary))" : score >= 50 ? "hsl(var(--amber-500, 45 93% 47%))" : "hsl(var(--destructive))";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg className="-rotate-90" width={dim} height={dim} viewBox={`0 0 ${vb} ${vb}`}>
          <circle cx={vb / 2} cy={vb / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={sw} />
          <circle cx={vb / 2} cy={vb / 2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={`${(score / 100) * circumference} ${circumference}`} strokeLinecap="round" />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center font-bold text-foreground ${size === "lg" ? "text-xl" : "text-sm"}`}>{score}</span>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
    </div>
  );
}

export default function SeoAudit() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [categories, setCategories] = useState<AuditCategory[]>([]);
  const [pageSpeed, setPageSpeed] = useState<PageSpeedData | null>(null);
  const { user } = useAuth();

  const handleAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setScore(null);
    setCategories([]);
    setPageSpeed(null);

    try {
      const { data, error } = await supabase.functions.invoke("seo-audit", {
        body: { domain: url.trim() },
      });

      if (error) throw error;
      if (data?.error) { toast.error(data.error); return; }

      setScore(data.seo_score);
      setCategories(data.categories || []);
      setPageSpeed(data.pageSpeed || null);

      if (user) {
        await supabase.from("seo_audits").insert({
          user_id: user.id,
          domain: url.trim(),
          seo_score: data.seo_score,
          issues: data.categories || [],
        });
      }

      toast.success("SEO audit complete!");
    } catch (err: any) {
      console.error("Audit error:", err);
      toast.error(err.message || "Failed to run audit");
    } finally {
      setLoading(false);
    }
  };

  const cwvItems = pageSpeed?.coreWebVitals ? [
    { label: "LCP", value: pageSpeed.coreWebVitals.lcp, desc: "Largest Contentful Paint" },
    { label: "FCP", value: pageSpeed.coreWebVitals.fcp, desc: "First Contentful Paint" },
    { label: "TBT", value: pageSpeed.coreWebVitals.tbt, desc: "Total Blocking Time" },
    { label: "CLS", value: pageSpeed.coreWebVitals.cls, desc: "Cumulative Layout Shift" },
    { label: "SI", value: pageSpeed.coreWebVitals.si, desc: "Speed Index" },
    { label: "TTI", value: pageSpeed.coreWebVitals.tti, desc: "Time to Interactive" },
  ] : [];

  return (
    <div className="max-w-4xl">
      <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-2xl font-bold mb-2">SEO Audit</motion.h1>
      <motion.p initial="hidden" animate="visible" variants={fadeUp} className="text-muted-foreground mb-6">Analyze your website with real Google PageSpeed data + AI-powered recommendations.</motion.p>

      <HowToUse steps={howToSteps} />
      <QuickSuggestions suggestions={suggestions} onSelect={(s) => setUrl(s)} label="Try these domains" />

      <motion.form initial="hidden" animate="visible" variants={fadeUp} onSubmit={handleAudit} className="flex gap-3 mb-8">
        <Input placeholder="Enter website URL (e.g. example.com)" value={url} onChange={(e) => setUrl(e.target.value)} className="flex-1 bg-muted border-border" disabled={loading} />
        <Button variant="hero" type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Search className="h-4 w-4 mr-1" />}
          {loading ? "Analyzing..." : "Audit"}
        </Button>
      </motion.form>

      {loading && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Fetching real PageSpeed data & AI analysis...</p>
        </motion.div>
      )}

      {score !== null && !loading && (
        <div className="space-y-6">
          {/* Overall Score + PageSpeed Scores */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-6">
            <div className="flex flex-wrap items-center justify-around gap-6">
              <ScoreRing score={score} label="Overall SEO" icon={<Shield className="h-3 w-3" />} size="lg" />
              {pageSpeed && (
                <>
                  <ScoreRing score={pageSpeed.performance} label="Performance" icon={<Zap className="h-3 w-3" />} />
                  <ScoreRing score={pageSpeed.accessibility} label="Accessibility" icon={<Eye className="h-3 w-3" />} />
                  <ScoreRing score={pageSpeed.bestPractices} label="Best Practices" icon={<ShieldCheck className="h-3 w-3" />} />
                  <ScoreRing score={pageSpeed.seo} label="SEO" icon={<Gauge className="h-3 w-3" />} />
                </>
              )}
            </div>
            {!pageSpeed && (
              <p className="text-xs text-muted-foreground text-center mt-3">PageSpeed data unavailable — score based on AI analysis only.</p>
            )}
          </motion.div>

          {/* Core Web Vitals */}
          {pageSpeed && cwvItems.length > 0 && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Gauge className="h-4 w-4 text-primary" />Core Web Vitals</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cwvItems.map((item) => (
                  <div key={item.label} className="p-3 rounded-lg bg-muted/30 text-center">
                    <p className="text-lg font-bold text-foreground">{item.value}</p>
                    <p className="text-xs font-medium text-primary">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* PageSpeed Diagnostics */}
          {pageSpeed?.diagnostics && pageSpeed.diagnostics.length > 0 && (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="glass-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Zap className="h-4 w-4 text-primary" />Performance Diagnostics</h3>
              <div className="space-y-3">
                {pageSpeed.diagnostics.map((d) => (
                  <div key={d.title} className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-foreground">{d.title}</span>
                      {d.displayValue && <span className="text-xs text-muted-foreground">{d.displayValue}</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">{d.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* AI Issue Categories */}
          {categories.map((cat) => (
            <motion.div key={cat.category} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="glass-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />{cat.category}</h3>
              <div className="space-y-3">
                {cat.issues.map((issue) => (
                  <div key={issue.title} className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 mb-1">{severityIcon[issue.severity] || severityIcon.warning}<span className="font-medium text-sm text-foreground">{issue.title}</span></div>
                    <p className="text-xs text-muted-foreground ml-6">{issue.explanation}</p>
                    <p className="text-xs text-primary/80 ml-6 mt-1">Fix: {issue.fix}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
