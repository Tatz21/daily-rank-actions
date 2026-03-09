import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import HowToUse from "@/components/HowToUse";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

const howToSteps = [
  { title: "Paste your content", description: "Enter your blog post, article, or page content in the text area." },
  { title: "Add your target keyword", description: "Enter the primary keyword you want to rank for." },
  { title: "Click 'Analyze'", description: "AI scores your content on readability, keyword usage, structure, and SEO factors." },
  { title: "Apply suggestions", description: "Follow the AI recommendations to improve your content score." },
];

type ScoreResult = {
  overallScore: number;
  readability: { score: number; feedback: string };
  keywordUsage: { score: number; density: string; feedback: string };
  structure: { score: number; feedback: string };
  suggestions: string[];
};

export default function ContentScoreAnalyzer() {
  const [content, setContent] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim() || !keyword.trim()) {
      toast.error("Please enter both content and a target keyword");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("content-score", {
        body: { content: content.trim(), keyword: keyword.trim() },
      });
      if (error) throw error;
      if (data?.error) { toast.error(data.error); return; }
      setResult(data);
      toast.success("Content analysis complete!");
    } catch (err: any) {
      console.error("Content score error:", err);
      toast.error(err.message || "Failed to analyze content");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) =>
    score >= 80 ? "text-primary" : score >= 50 ? "text-amber-500" : "text-destructive";

  const scoreIcon = (score: number) =>
    score >= 80 ? <CheckCircle2 className="h-4 w-4 text-primary" /> :
    score >= 50 ? <Info className="h-4 w-4 text-amber-500" /> :
    <AlertTriangle className="h-4 w-4 text-destructive" />;

  return (
    <div className="max-w-4xl">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Content Score Analyzer</h1>
          <p className="text-sm text-muted-foreground">Score your content for SEO and get AI suggestions.</p>
        </div>
      </motion.div>

      <HowToUse steps={howToSteps} />

      <motion.form initial="hidden" animate="visible" custom={1} variants={fadeUp} onSubmit={handleAnalyze} className="space-y-4 mb-8">
        <Input placeholder="Target keyword (e.g. best running shoes)" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="bg-muted border-border" disabled={loading} />
        <textarea
          placeholder="Paste your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[200px] p-3 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground resize-y focus:outline-none focus:ring-2 focus:ring-ring"
          disabled={loading}
        />
        <Button variant="hero" type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <FileText className="h-4 w-4 mr-1" />}
          {loading ? "Analyzing..." : "Analyze Content"}
        </Button>
      </motion.form>

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">AI is scoring your content...</p>
        </motion.div>
      )}

      {!loading && result && (
        <div className="space-y-4">
          <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp} className="glass-card p-6 flex items-center gap-6">
            <div className="relative h-20 w-20 shrink-0">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--muted))" strokeWidth="2" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray={`${result.overallScore * 1.005} 100`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-foreground">{result.overallScore}</span>
            </div>
            <div>
              <h2 className="font-semibold text-lg">Content Score</h2>
              <p className="text-sm text-muted-foreground">
                {result.overallScore >= 80 ? "Excellent! Your content is well optimized." :
                 result.overallScore >= 50 ? "Good, but there's room to improve." :
                 "Needs work. Follow the suggestions below."}
              </p>
            </div>
          </motion.div>

          {[
            { label: "Readability", ...result.readability },
            { label: "Keyword Usage", score: result.keywordUsage.score, feedback: `${result.keywordUsage.feedback} (Density: ${result.keywordUsage.density})` },
            { label: "Structure", ...result.structure },
          ].map((item) => (
            <motion.div key={item.label} initial="hidden" animate="visible" custom={3} variants={fadeUp} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-1">
                {scoreIcon(item.score)}
                <span className="font-medium text-sm">{item.label}</span>
                <span className={`ml-auto text-sm font-bold ${scoreColor(item.score)}`}>{item.score}/100</span>
              </div>
              <p className="text-xs text-muted-foreground ml-6">{item.feedback}</p>
            </motion.div>
          ))}

          <motion.div initial="hidden" animate="visible" custom={4} variants={fadeUp} className="glass-card p-6">
            <h3 className="font-semibold mb-3">AI Suggestions</h3>
            <div className="space-y-2">
              {result.suggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <span className="shrink-0 h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="text-sm text-foreground">{s}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
