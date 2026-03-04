import { motion } from "framer-motion";
import { Bot, CheckCircle2, Lightbulb, FileText, Wrench } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 }
  }),
};

const sections = [
  {
    title: "Top SEO Fixes",
    icon: Wrench,
    items: [
      "Add primary keyword to homepage title tag",
      "Improve meta description length to 150-160 characters",
      "Add alt text to 3 images missing attributes",
      "Fix 2 broken internal links",
      "Optimize page load speed — compress hero image",
    ],
  },
  {
    title: "Keyword Opportunities",
    icon: Lightbulb,
    items: [
      "\"best gym in baguiati\" — low competition, high local intent",
      "\"seo tips for startups\" — trending upward",
      "\"free website audit\" — matches your service",
      "\"how to improve google ranking\" — informational content gap",
      "\"local business seo checklist\" — content opportunity",
    ],
  },
  {
    title: "Blog Content Ideas",
    icon: FileText,
    items: [
      "Write: \"10 SEO Mistakes Small Businesses Make\"",
      "Write: \"How to Do Keyword Research in 2026\"",
      "Write: \"Local SEO Guide for Restaurants\"",
      "Write: \"Why Your Website Isn't Ranking on Google\"",
      "Write: \"SEO vs SEM: Which is Better for Small Business?\"",
    ],
  },
];

export default function AiAssistant() {
  return (
    <div className="max-w-4xl">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI SEO Assistant</h1>
          <p className="text-sm text-muted-foreground">AI-generated SEO tasks based on your site analysis.</p>
        </div>
      </motion.div>

      <div className="space-y-6">
        {sections.map((section, si) => (
          <motion.div
            key={section.title}
            initial="hidden" animate="visible" custom={si + 1} variants={fadeUp}
            className="glass-card p-6"
          >
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <section.icon className="h-4 w-4 text-primary" />
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
        ))}
      </div>
    </div>
  );
}
