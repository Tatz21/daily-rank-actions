import { useState } from "react";
import { motion } from "framer-motion";
import { Map, Loader2, Copy, Check, Download } from "lucide-react";
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
  { title: "Enter your domain", description: "Type the website you want to generate a sitemap for." },
  { title: "Click 'Generate'", description: "AI discovers your site's pages and builds a structured XML sitemap." },
  { title: "Copy or download", description: "Copy the XML to clipboard or download as a .xml file to upload to your server." },
];

const suggestions = ["mybusiness.com", "blogsite.com", "store.example.com", "portfolio.dev"];

export default function SitemapGenerator() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [xml, setXml] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setXml("");
    setPageCount(0);

    try {
      const { data, error } = await supabase.functions.invoke("sitemap-generator", {
        body: { domain: domain.trim() },
      });
      if (error) throw error;
      if (data?.error) { toast.error(data.error); return; }
      setXml(data.xml);
      setPageCount(data.pageCount || 0);
      toast.success(`Sitemap generated with ${data.pageCount} pages!`);
    } catch (err: any) {
      console.error("Sitemap error:", err);
      toast.error(err.message || "Failed to generate sitemap");
    } finally {
      setLoading(false);
    }
  };

  const copyXml = () => {
    navigator.clipboard.writeText(xml);
    setCopied(true);
    toast.success("XML copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadXml = () => {
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sitemap-${domain.replace(/[^a-z0-9]/gi, "-")}.xml`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Sitemap downloaded!");
  };

  return (
    <div className="max-w-4xl">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Map className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Sitemap Generator</h1>
          <p className="text-sm text-muted-foreground">Generate XML sitemaps for your website.</p>
        </div>
      </motion.div>

      <HowToUse steps={howToSteps} />
      <QuickSuggestions suggestions={suggestions} onSelect={(s) => setDomain(s)} label="Try with a sample domain" />

      <motion.form initial="hidden" animate="visible" custom={1} variants={fadeUp} onSubmit={handleGenerate} className="flex gap-3 mb-8">
        <Input placeholder="Enter domain (e.g. example.com)" value={domain} onChange={(e) => setDomain(e.target.value)} className="flex-1 bg-muted border-border" disabled={loading} />
        <Button variant="hero" type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Map className="h-4 w-4 mr-1" />}
          {loading ? "Generating..." : "Generate"}
        </Button>
      </motion.form>

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">AI is discovering pages and building your sitemap...</p>
        </motion.div>
      )}

      {!loading && xml && (
        <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp} className="space-y-4">
          <div className="glass-card p-4 flex items-center justify-between">
            <span className="text-sm text-foreground font-medium">{pageCount} pages discovered</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyXml}>
                {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                {copied ? "Copied" : "Copy XML"}
              </Button>
              <Button variant="outline" size="sm" onClick={downloadXml}>
                <Download className="h-3.5 w-3.5 mr-1" />
                Download
              </Button>
            </div>
          </div>
          <div className="glass-card p-4 overflow-auto max-h-[400px]">
            <pre className="text-xs text-foreground font-mono whitespace-pre-wrap">{xml}</pre>
          </div>
        </motion.div>
      )}
    </div>
  );
}
