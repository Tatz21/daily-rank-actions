import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Search, Users, Shield, Loader2, ArrowUpRight, Tags, Link2, FileText, Map, Bot, Activity, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

function HealthRing({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "text-primary" : score >= 40 ? "text-amber-500" : "text-destructive";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="100" height="100" className="-rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" strokeWidth="6" className="stroke-muted/30" />
        <circle
          cx="50" cy="50" r={radius} fill="none" strokeWidth="6"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" className={`${color} stroke-current transition-all duration-1000`}
        />
      </svg>
      <span className={`absolute text-xl font-bold ${color}`}>{score}</span>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { plan } = useSubscription();
  const [stats, setStats] = useState({ audits: 0, keywords: 0, tracked: 0, latestScore: 0, avgScore: 0 });
  const [recentAudits, setRecentAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDeleteAudit = async (e: React.MouseEvent, auditId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleting(auditId);
    const { error } = await supabase.from("seo_audits").delete().eq("id", auditId).eq("user_id", user!.id);
    if (error) {
      toast.error("Failed to delete audit");
    } else {
      setRecentAudits((prev) => prev.filter((a) => a.id !== auditId));
      toast.success("Audit deleted");
    }
    setDeleting(null);
  };

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [auditsRes, keywordsRes, trackingRes] = await Promise.all([
        supabase.from("seo_audits").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("keywords").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("rank_tracking").select("id", { count: "exact" }).eq("user_id", user.id),
      ]);

      const audits = auditsRes.data || [];
      const avgScore = audits.length ? Math.round(audits.reduce((a, b) => a + b.seo_score, 0) / audits.length) : 0;
      setRecentAudits(audits);
      setStats({
        audits: audits.length,
        keywords: keywordsRes.count || 0,
        tracked: trackingRes.count || 0,
        latestScore: audits[0]?.seo_score || 0,
        avgScore,
      });
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const statCards = [
    { label: "Keywords Saved", value: stats.keywords, icon: Search, link: "/dashboard/keywords" },
    { label: "Keywords Tracked", value: stats.tracked, icon: TrendingUp, link: "/dashboard/rank-tracker" },
    { label: "Total Audits", value: stats.audits, icon: Shield, link: "/dashboard/audit" },
  ];

  const quickTools = [
    { label: "Meta Tags", desc: "Generate optimized tags", icon: Tags, link: "/dashboard/meta-tags" },
    { label: "Backlinks", desc: "Analyze link profile", icon: Link2, link: "/dashboard/backlinks" },
    { label: "Content Score", desc: "Score your content", icon: FileText, link: "/dashboard/content-score" },
    { label: "Sitemap", desc: "Generate XML sitemap", icon: Map, link: "/dashboard/sitemap" },
    { label: "AI Assistant", desc: "Get SEO task list", icon: Bot, link: "/dashboard/ai-assistant" },
  ];

  return (
    <div className="max-w-5xl">
      <motion.h1 initial="hidden" animate="visible" custom={0} variants={fadeUp} className="text-2xl font-bold mb-2">
        Dashboard
      </motion.h1>
      <motion.p initial="hidden" animate="visible" custom={0} variants={fadeUp} className="text-muted-foreground mb-8">
        Welcome back{user?.user_metadata?.display_name ? `, ${user.user_metadata.display_name}` : ""}! Here's your SEO overview.
      </motion.p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* SEO Health Score */}
          <motion.div initial="hidden" animate="visible" custom={1} variants={fadeUp} className="glass-card p-6 mb-6">
            <div className="flex items-center gap-6 flex-wrap">
              <HealthRing score={stats.avgScore} />
              <div>
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" /> SEO Health Score
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.avgScore >= 70 ? "Great! Your site is well optimized." : stats.avgScore >= 40 ? "Room for improvement. Check your audits." : stats.audits === 0 ? "Run your first audit to see your score." : "Needs attention. Review your SEO issues."}
                </p>
                <p className="text-xs text-muted-foreground mt-2 capitalize">Plan: <span className="text-primary font-medium">{plan}</span></p>
              </div>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {statCards.map((s, i) => (
              <motion.div key={s.label} initial="hidden" animate="visible" custom={i + 2} variants={fadeUp}>
                <Link to={s.link} className="glass-card p-5 block hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">{s.label}</span>
                    <s.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-3xl font-bold text-foreground">{s.value}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div initial="hidden" animate="visible" custom={5} variants={fadeUp} className="mb-8">
            <h2 className="font-semibold text-lg mb-4">Quick Tools</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {quickTools.map((tool) => (
                <Link key={tool.label} to={tool.link} className="glass-card p-4 hover:border-primary/30 transition-colors group text-center">
                  <tool.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{tool.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" custom={6} variants={fadeUp} className="glass-card p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Recent Audits
            </h2>
            {recentAudits.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-3">No audits yet. Run your first SEO audit!</p>
                <Link to="/dashboard/audit" className="text-primary hover:underline text-sm">Go to SEO Audit →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAudits.map((audit) => (
                  <Link key={audit.id} to={`/dashboard/audit/${audit.id}`} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div>
                      <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{audit.domain}</p>
                      <p className="text-xs text-muted-foreground">{new Date(audit.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${audit.seo_score >= 70 ? "text-primary" : audit.seo_score >= 40 ? "text-amber-500" : "text-destructive"}`}>
                        {audit.seo_score}
                      </span>
                      <span className="text-xs text-muted-foreground">/100</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
