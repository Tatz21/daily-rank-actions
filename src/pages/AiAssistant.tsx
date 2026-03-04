import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Wrench, Lightbulb, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 }
  }),
};

const iconMap: Record<string, typeof Wrench> = {
  "Top SEO Fixes": Wrench,
  "Keyword Opportunities": Lightbulb,
  "Blog Content Ideas": FileText,
};

type Section = { title: string; items: string[] };

export default function AiAssistant() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setSections([]);

    try {
      const { data, error } = await supabase.functions.invoke("ai-assistant", {
        body: { domain: domain.trim() },
      });

      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setSections(data.sections || []);
      toast.success("AI tasks generated!");
    } catch (err: any) {
      console.error("AI assistant error:", err);
      toast.error(err.message || "Failed to generate tasks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI SEO Assistant</h1>
          <p className="text-sm text-muted-foreground">Get AI-generated SEO tasks for your website.</p>
        </div>
      </motion.div>

      <motion.form initial="hidden" animate="visible" custom={1} variants={fadeUp} onSubmit={handleGenerate} className="flex gap-3 mb-8">
        <Input
          placeholder="Enter your domain (e.g. example.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="flex-1 bg-muted border-border"
          disabled={loading}
        />
        <Button variant="hero" type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Bot className="h-4 w-4 mr-1" />}
          {loading ? "Generating..." : "Generate Tasks"}
        </Button>
      </motion.form>

      {loading && (
        <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="glass-card p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">AI is analyzing your site and generating tasks...</p>
        </motion.div>
      )}

      {!loading && sections.length > 0 && (
        <div className="space-y-6">
          {sections.map((section, si) => {
            const Icon = iconMap[section.title] || Wrench;
            return (
              <motion.div
                key={section.title}
                initial="hidden" animate="visible" custom={si + 2} variants={fadeUp}
                className="glass-card p-6"
              >
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  {section.title}
                </h2>
                <div className="space-y-2">
                  {section.items.map((item, i) => (
                    <label key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                      <input type="checkbox" className="mt-0.5 accent-[hsl(var(--primary))]" />
                      <span className="text-sm text-foreground group-hover:text-foreground/90">{item}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
