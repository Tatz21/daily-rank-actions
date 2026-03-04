import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Plus, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

type TrackedKeyword = {
  id: string;
  keyword: string;
  target_url: string | null;
  position: number | null;
  tracked_at: string;
};

export default function RankTracker() {
  const [showAdd, setShowAdd] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(false);
  const [tracked, setTracked] = useState<TrackedKeyword[]>([]);
  const [fetching, setFetching] = useState(true);
  const { user } = useAuth();

  const fetchTracked = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("rank_tracking")
      .select("*")
      .eq("user_id", user.id)
      .order("tracked_at", { ascending: false });

    if (!error && data) setTracked(data);
    setFetching(false);
  };

  useEffect(() => { fetchTracked(); }, [user]);

  const handleAdd = async () => {
    if (!keyword.trim() || !user) return;
    setLoading(true);

    try {
      const { error } = await supabase.from("rank_tracking").insert({
        user_id: user.id,
        keyword: keyword.trim(),
        target_url: targetUrl.trim() || null,
        position: position ? parseInt(position) : null,
      });

      if (error) throw error;
      toast.success("Keyword tracked!");
      setKeyword(""); setTargetUrl(""); setPosition("");
      setShowAdd(false);
      fetchTracked();
    } catch (err: any) {
      toast.error(err.message || "Failed to add keyword");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("rank_tracking").delete().eq("id", id);
    if (!error) {
      setTracked(prev => prev.filter(k => k.id !== id));
      toast.success("Keyword removed");
    }
  };

  // Group by keyword to find latest + calculate change
  const keywordMap = new Map<string, TrackedKeyword[]>();
  tracked.forEach(t => {
    const existing = keywordMap.get(t.keyword) || [];
    existing.push(t);
    keywordMap.set(t.keyword, existing);
  });

  const latestKeywords = Array.from(keywordMap.entries()).map(([keyword, entries]) => {
    const sorted = entries.sort((a, b) => new Date(b.tracked_at).getTime() - new Date(a.tracked_at).getTime());
    const latest = sorted[0];
    const previous = sorted[1];
    const change = latest.position && previous?.position ? previous.position - latest.position : 0;
    return { ...latest, change };
  });

  const rising = latestKeywords.filter(k => k.change > 0).slice(0, 3);
  const dropping = latestKeywords.filter(k => k.change < 0).slice(0, 3);

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
          <Input placeholder="Keyword" className="bg-muted border-border flex-1" value={keyword} onChange={e => setKeyword(e.target.value)} />
          <Input placeholder="Target URL" className="bg-muted border-border flex-1" value={targetUrl} onChange={e => setTargetUrl(e.target.value)} />
          <Input placeholder="Position" type="number" className="bg-muted border-border w-24" value={position} onChange={e => setPosition(e.target.value)} />
          <Button variant="hero" size="sm" onClick={handleAdd} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Track"}
          </Button>
        </motion.div>
      )}

      {latestKeywords.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <ArrowUpRight className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Top Rising</span>
            </div>
            <div className="space-y-2">
              {rising.length === 0 && <p className="text-xs text-muted-foreground">No rising keywords yet</p>}
              {rising.map(k => (
                <div key={k.id} className="flex items-center justify-between text-sm">
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
              {dropping.length === 0 && <p className="text-xs text-muted-foreground">No dropping keywords</p>}
              {dropping.map(k => (
                <div key={k.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{k.keyword}</span>
                  <span className="text-destructive font-medium">{k.change}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card overflow-hidden">
        {fetching ? (
          <div className="p-8 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading tracked keywords...</p>
          </div>
        ) : latestKeywords.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No keywords tracked yet. Click "Add Keyword" to start.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-3 font-medium">Keyword</th>
                <th className="text-left p-3 font-medium">URL</th>
                <th className="text-right p-3 font-medium">Position</th>
                <th className="text-right p-3 font-medium">Change</th>
                <th className="text-right p-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {latestKeywords.map(k => (
                <tr key={k.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-3 text-foreground">{k.keyword}</td>
                  <td className="p-3 text-muted-foreground text-xs">{k.target_url || "—"}</td>
                  <td className="p-3 text-right font-medium text-foreground">{k.position ? `#${k.position}` : "—"}</td>
                  <td className={`p-3 text-right font-medium ${k.change > 0 ? "text-primary" : k.change < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                    {k.change > 0 ? `+${k.change}` : k.change || "—"}
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(k.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
}
