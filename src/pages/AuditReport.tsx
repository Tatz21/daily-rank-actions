import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle2, Info, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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

export default function AuditReport() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("seo_audits")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();
      setAudit(data);
      setLoading(false);
    };
    fetch();
  }, [user, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">Audit not found.</p>
        <Button variant="hero-outline" asChild><Link to="/dashboard">Back to Dashboard</Link></Button>
      </div>
    );
  }

  const score = audit.seo_score;
  const categories: AuditCategory[] = Array.isArray(audit.issues) ? audit.issues : [];

  return (
    <div className="max-w-4xl">
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Audit Report</h1>
          <p className="text-sm text-muted-foreground">{audit.domain} • {new Date(audit.created_at).toLocaleDateString()}</p>
        </div>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-6 flex items-center gap-6 mb-6">
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
             score >= 50 ? "Room for improvement. Fix the issues below." :
             "Needs significant SEO work. Start with critical issues."}
          </p>
        </div>
      </motion.div>

      <div className="space-y-6">
        {categories.map((cat) => (
          <motion.div key={cat.category} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              {cat.category}
            </h3>
            <div className="space-y-3">
              {cat.issues?.map((issue) => (
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
    </div>
  );
}
