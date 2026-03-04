import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, AlertTriangle, CheckCircle2, Info, Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

type Issue = { title: string; explanation: string; fix: string; severity: "error" | "warning" | "pass" };
type AuditCategory = { category: string; issues: Issue[] };

const severityIcon = {
  error: <AlertTriangle className="h-4 w-4 text-destructive" />,
  warning: <Info className="h-4 w-4 text-amber-500" />,
  pass: <CheckCircle2 className="h-4 w-4 text-primary" />,
};

export default function SeoAudit() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [categories, setCategories] = useState<AuditCategory[]>([]);
  const { user } = useAuth();

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setScore(null);
    setCategories([]);

    try {
      const { data, error } = await supabase.functions.invoke("seo-audit", {
        body: { domain: url.trim() },
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setScore(data.seo_score);
      setCategories(data.categories || []);

      // Save audit to database
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

  return (
    <div className="max-w-4xl">
      <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-2xl font-bold mb-2">
        SEO Audit
      </motion.h1>
      <motion.p initial="hidden" animate="visible" variants={fadeUp} className="text-muted-foreground mb-8">
        Analyze your website and get AI-powered SEO recommendations.
      </motion.p>

      <motion.form
        initial="hidden" animate="visible" variants={fadeUp}
        onSubmit={handleAudit}
        className="flex gap-3 mb-8"
      >
        <Input
          placeholder="Enter website URL (e.g. example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 bg-muted border-border"
          disabled={loading}
        />
        <Button variant="hero" type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Search className="h-4 w-4 mr-1" />}
          {loading ? "Analyzing..." : "Audit"}
        </Button>
      </motion.form>

      {loading && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">AI is analyzing your website...</p>
          <p className="text-xs text-muted-foreground mt-1">This may take 10-20 seconds</p>
        </motion.div>
      )}

      {score !== null && !loading && (
        <div className="space-y-6">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-6 flex items-center gap-6">
            <div className="relative h-20 w-20 shrink-0">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--muted))" strokeWidth="2" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--primary))" strokeWidth="2"
                  strokeDasharray={`${score * 1.005} 100`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-foreground">{score}</span>
            </div>
            <div>
              <h2 className="font-semibold text-lg">SEO Score</h2>
              <p className="text-sm text-muted-foreground">
                {score >= 80 ? "Great job! Your site is well optimized." :
                 score >= 50 ? "Your site has room for improvement. Fix the issues below." :
                 "Your site needs significant SEO work. Start with the critical issues."}
              </p>
            </div>
          </motion.div>

          {categories.map((cat) => (
            <motion.div key={cat.category} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="glass-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                {cat.category}
              </h3>
              <div className="space-y-3">
                {cat.issues.map((issue) => (
                  <div key={issue.title} className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 mb-1">
                      {severityIcon[issue.severity] || severityIcon.warning}
                      <span className="font-medium text-sm text-foreground">{issue.title}</span>
                    </div>
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
