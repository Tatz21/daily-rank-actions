import { motion } from "framer-motion";
import { TrendingUp, Search, Users, CheckCircle2, ArrowUpRight, ArrowDownRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 }
  }),
};

const stats = [
  { label: "SEO Score", value: "72", change: "+5", up: true, icon: TrendingUp },
  { label: "Keywords Tracked", value: "24", change: "+3", up: true, icon: Search },
  { label: "Competitors", value: "8", change: "0", up: true, icon: Users },
];

const tasks = [
  { text: "Add primary keyword to homepage title", done: false },
  { text: "Improve meta description length", done: false },
  { text: "Add alt text to 3 images", done: true },
  { text: "Write blog targeting your top keyword", done: false },
  { text: "Fix broken internal link on /about", done: true },
];

export default function Dashboard() {
  return (
    <div className="max-w-5xl">
      <motion.h1
        initial="hidden" animate="visible" custom={0} variants={fadeUp}
        className="text-2xl font-bold mb-8"
      >
        Dashboard
      </motion.h1>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial="hidden" animate="visible" custom={i + 1} variants={fadeUp}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">{s.value}</span>
              <span className={`flex items-center gap-0.5 text-xs font-medium ${s.up ? "text-primary" : "text-destructive"}`}>
                {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {s.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Today's SEO Tasks */}
      <motion.div
        initial="hidden" animate="visible" custom={4} variants={fadeUp}
        className="glass-card p-6"
      >
        <h2 className="font-semibold text-lg mb-4">Today's SEO Tasks</h2>
        <div className="space-y-3">
          {tasks.map((t, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                t.done ? "bg-primary/5" : "bg-muted/30 hover:bg-muted/50"
              }`}
            >
              <CheckCircle2
                className={`h-4 w-4 shrink-0 ${t.done ? "text-primary" : "text-muted-foreground/40"}`}
              />
              <span className={`text-sm ${t.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                {t.text}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
