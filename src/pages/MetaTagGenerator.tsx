import { useState } from "react";
import { motion } from "framer-motion";
import { Tags, Loader2, Copy, Check } from "lucide-react";
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
  { title: "Enter your page URL", description: "Type the URL of the page you want optimized meta tags for." },
  { title: "Click 'Generate'", description: "AI analyzes your page and generates SEO-optimized title and description." },
  { title: "Copy & paste", description: "Copy the generated meta tags directly into your site's HTML head." },
];

const suggestions = ["example.com", "myblog.com/about", "store.com/products", "startup.io"];

type MetaResult = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  keywords: string[];
};

export default function MetaTagGenerator() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MetaResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("meta-tag-generator", {
        body: { url: url.trim() },
      });
      if (error) throw error;
      if (data?.error) { toast.error(data.error); return; }
      setResult(data);
      toast.success("Meta tags generated!");
    } catch (err: any) {
      console.error("Meta tag error:", err);
      toast.error(err.message || "Failed to generate meta tags");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(null), 2000);
  };

  const CopyBtn = ({ text, label }: { text: string; label: string }) => (
    <button onClick={() => copyToClipboard(text, label)} className="ml-auto shrink-0 p-1 rounded hover:bg-muted/50 transition-colors">
      {copied === label ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
    </button>
  );

  return (
    <div className="max-w-4xl">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Tags className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Meta Tag Generator</h1>
          <p className="text-sm text-muted-foreground">AI-optimized title tags & meta descriptions for any page.</p>
        </div>
      </motion.div>

      <HowToUse steps={howToSteps} />
      <QuickSuggestions suggestions={suggestions} onSelect={(s) => setUrl(s)} label="Try with a sample URL" />

      <motion.form initial="hidden" animate="visible" custom={1} variants={fadeUp} onSubmit={handleGenerate} className="flex gap-3 mb-8">
        <Input placeholder="Enter page URL (e.g. example.com/about)" value={url} onChange={(e) => setUrl(e.target.value)} className="flex-1 bg-muted border-border" disabled={loading} />
        <Button variant="hero" type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Tags className="h-4 w-4 mr-1" />}
          {loading ? "Generating..." : "Generate"}
        </Button>
      </motion.form>

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">AI is crafting optimized meta tags...</p>
        </motion.div>
      )}

      {!loading && result && (
        <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp} className="space-y-4">
          {[
            { label: "Title Tag", value: result.title, limit: 60 },
            { label: "Meta Description", value: result.description, limit: 160 },
            { label: "OG Title", value: result.ogTitle, limit: 60 },
            { label: "OG Description", value: result.ogDescription, limit: 160 },
          ].map((item) => (
            <div key={item.label} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                <span className={`text-xs ml-auto mr-2 ${item.value.length > item.limit ? "text-destructive" : "text-primary"}`}>
                  {item.value.length}/{item.limit}
                </span>
                <CopyBtn text={item.value} label={item.label} />
              </div>
              <p className="text-sm text-foreground">{item.value}</p>
            </div>
          ))}

          {result.keywords.length > 0 && (
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-muted-foreground">Suggested Keywords</span>
                <CopyBtn text={result.keywords.join(", ")} label="Keywords" />
              </div>
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((kw) => (
                  <span key={kw} className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">{kw}</span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
