import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, AlertTriangle, CheckCircle2, Info, Search } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

type Issue = { title: string; explanation: string; fix: string; severity: "error" | "warning" | "pass" };

const mockIssues: { category: string; issues: Issue[] }[] = [
  {
    category: "Technical SEO",
    issues: [
      { title: "Missing SSL certificate", explanation: "Your site doesn't use HTTPS.", fix: "Install an SSL certificate via your hosting provider.", severity: "error" },
      { title: "XML sitemap found", explanation: "Sitemap is properly configured.", fix: "No action needed.", severity: "pass" },
    ],
  },
  {
    category: "On-Page SEO",
    issues: [
      { title: "Title tag too short", explanation: "Your title is only 15 characters.", fix: "Aim for 50-60 characters including primary keyword.", severity: "warning" },
      { title: "Missing meta description", explanation: "No meta description tag found.", fix: "Add a compelling meta description of 150-160 characters.", severity: "error" },
    ],
  },
  {
    category: "Content SEO",
    issues: [
      { title: "Images missing alt text", explanation: "3 images don't have alt attributes.", fix: "Add descriptive alt text to all images.", severity: "warning" },
      { title: "Good heading structure", explanation: "H1-H3 tags are properly nested.", fix: "No action needed.", severity: "pass" },
    ],
  },
];

const severityIcon = {
  error: <AlertTriangle className="h-4 w-4 text-destructive" />,
  warning: <Info className="h-4 w-4 text-amber-500" />,
  pass: <CheckCircle2 className="h-4 w-4 text-primary" />,
};

export default function SeoAudit() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState(false);

  const handleAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) setResults(true);
  };

  return (
    <div className="max-w-4xl">
      <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-2xl font-bold mb-2">
        SEO Audit
      </motion.h1>
      <motion.p initial="hidden" animate="visible" variants={fadeUp} className="text-muted-foreground mb-8">
        Analyze your website and get actionable SEO recommendations.
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
        />
        <Button variant="hero" type="submit">
          <Search className="h-4 w-4 mr-1" /> Audit
        </Button>
      </motion.form>

      {results && (
        <div className="space-y-6">
          {/* Score */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-6 flex items-center gap-6">
            <div className="relative h-20 w-20 shrink-0">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--muted))" strokeWidth="2" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--primary))" strokeWidth="2"
                  strokeDasharray={`${68 * 1.005} 100`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-foreground">68</span>
            </div>
            <div>
              <h2 className="font-semibold text-lg">SEO Score</h2>
              <p className="text-sm text-muted-foreground">Your site has room for improvement. Fix the issues below to boost your score.</p>
            </div>
          </motion.div>

          {/* Issues */}
          {mockIssues.map((cat) => (
            <motion.div key={cat.category} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="glass-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                {cat.category}
              </h3>
              <div className="space-y-3">
                {cat.issues.map((issue) => (
                  <div key={issue.title} className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 mb-1">
                      {severityIcon[issue.severity]}
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
