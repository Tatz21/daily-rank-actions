import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Search, Users, CheckCircle2, ArrowUpRight, ArrowDownRight, Shield, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 }
  }),
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ audits: 0, keywords: 0, tracked: 0, latestScore: 0 });
  const [recentAudits, setRecentAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [auditsRes, keywordsRes, trackingRes] = await Promise.all([
        supabase.from("seo_audits").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("keywords").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("rank_tracking").select("id", { count: "exact" }).eq("user_id", user.id),
      ]);

      const audits = auditsRes.data || [];
      setRecentAudits(audits);
      setStats({
        audits: audits.length,
        keywords: keywordsRes.count || 0,
        tracked: trackingRes.count || 0,
        latestScore: audits[0]?.seo_score || 0,
      });
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const statCards = [
    { label: "SEO Score", value: stats.latestScore || "—", icon: TrendingUp, link: "/dashboard/audit" },
    { label: "Keywords Saved", value: stats.keywords, icon: Search, link: "/dashboard/keywords" },
    { label: "Keywords Tracked", value: stats.tracked, icon: Users, link: "/dashboard/rank-tracker" },
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
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {statCards.map((s, i) => (
              <motion.div key={s.label} initial="hidden" animate="visible" custom={i + 1} variants={fadeUp}>
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

          <motion.div initial="hidden" animate="visible" custom={4} variants={fadeUp} className="glass-card p-6">
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
