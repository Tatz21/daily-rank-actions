import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown, Download, Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import HowToUse from "@/components/HowToUse";
import QuickSuggestions from "@/components/QuickSuggestions";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

type KW = { keyword: string; volume: number; difficulty: number; opportunity: number };

const difficultyColor = (d: number) =>
  d < 30 ? "text-primary" : d < 50 ? "text-amber-500" : "text-destructive";

const howToSteps = [
  { title: "Enter a seed keyword", description: "Type a topic or keyword related to your niche, like 'organic skincare' or 'web design'." },
  { title: "Click 'Search'", description: "AI will generate related keyword ideas with volume, difficulty, and opportunity scores." },
  { title: "Sort and filter", description: "Click column headers to sort by volume, difficulty, or opportunity score." },
  { title: "Save or Export", description: "Save keywords to your database or export as CSV for later use." },
];

const suggestions = ["seo tools", "digital marketing", "web design", "content writing", "ecommerce", "social media marketing"];

export default function KeywordResearch() {
  const [seed, setSeed] = useState("");
  const [results, setResults] = useState<KW[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sortKey, setSortKey] = useState<keyof KW>("opportunity");
  const [sortAsc, setSortAsc] = useState(false);
  const { user } = useAuth();

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!seed.trim()) return;

    setLoading(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke("keyword-research", {
        body: { seed: seed.trim() },
      });

      if (error) throw error;
      if (data?.error) { toast.error(data.error); return; }

      setResults(data.keywords || []);
      toast.success(`Found ${data.keywords?.length || 0} keywords!`);
    } catch (err: any) {
      console.error("Keyword research error:", err);
      toast.error(err.message || "Failed to research keywords");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    if (!results || !user) return;
    setSaving(true);
    try {
      const rows = results.map(kw => ({
        user_id: user.id, keyword: kw.keyword, volume: kw.volume,
        difficulty: kw.difficulty, opportunity_score: kw.opportunity,
      }));
      const { error } = await supabase.from("keywords").insert(rows);
      if (error) throw error;
      toast.success("Keywords saved!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally { setSaving(false); }
  };

  const handleExport = () => {
    if (!results) return;
    const csv = ["Keyword,Volume,Difficulty,Opportunity",
      ...results.map(kw => `"${kw.keyword}",${kw.volume},${kw.difficulty},${kw.opportunity}`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `keywords-${seed}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Keywords exported!");
  };

  const sorted = results
    ? [...results].sort((a, b) => sortAsc ? (a[sortKey] as number) - (b[sortKey] as number) : (b[sortKey] as number) - (a[sortKey] as number))
    : null;

  const toggleSort = (key: keyof KW) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  return (
    <div className="max-w-4xl">
      <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-2xl font-bold mb-2">Keyword Research</motion.h1>
      <motion.p initial="hidden" animate="visible" variants={fadeUp} className="text-muted-foreground mb-6">Discover low-competition keywords for your niche using AI.</motion.p>

      <HowToUse steps={howToSteps} />

      <QuickSuggestions suggestions={suggestions} onSelect={(s) => setSeed(s)} label="Try these keywords" />

      <motion.form initial="hidden" animate="visible" variants={fadeUp} onSubmit={handleSearch} className="flex gap-3 mb-8">
        <Input placeholder="Enter a seed keyword..." value={seed} onChange={(e) => setSeed(e.target.value)} className="flex-1 bg-muted border-border" disabled={loading} />
        <Button variant="hero" type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Search className="h-4 w-4 mr-1" />}
          {loading ? "Searching..." : "Search"}
        </Button>
      </motion.form>

      {loading && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">AI is researching keywords...</p>
        </motion.div>
      )}

      {sorted && !loading && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="text-sm text-muted-foreground">{sorted.length} keywords found</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleSaveAll} disabled={saving}><Save className="h-3.5 w-3.5 mr-1" /> {saving ? "Saving..." : "Save All"}</Button>
              <Button variant="ghost" size="sm" onClick={handleExport}><Download className="h-3.5 w-3.5 mr-1" /> Export</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-3 font-medium">Keyword</th>
                {(["volume", "difficulty", "opportunity"] as const).map((k) => (
                  <th key={k} className="text-right p-3 font-medium cursor-pointer hover:text-foreground transition-colors" onClick={() => toggleSort(k)}>
                    <span className="inline-flex items-center gap-1 capitalize">{k} <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                ))}
              </tr></thead>
              <tbody>
                {sorted.map((kw) => (
                  <tr key={kw.keyword} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-3 text-foreground">{kw.keyword}</td>
                    <td className="p-3 text-right text-muted-foreground">{kw.volume.toLocaleString()}</td>
                    <td className={`p-3 text-right font-medium ${difficultyColor(kw.difficulty)}`}>{kw.difficulty}</td>
                    <td className="p-3 text-right font-medium text-primary">{kw.opportunity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
