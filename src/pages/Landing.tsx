import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Search, BarChart3, Users, TrendingUp, Bot, Shield,
  ArrowRight, Sparkles, CheckCircle2, Sprout
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
  }),
};

const features = [
  { icon: Shield, title: "SEO Audit", desc: "Analyze your website and detect SEO issues instantly." },
  { icon: Search, title: "Keyword Finder", desc: "Discover low competition keywords for your niche." },
  { icon: Users, title: "Competitor Insights", desc: "Understand which keywords your competitors rank for." },
  { icon: TrendingUp, title: "Rank Tracker", desc: "Track your Google keyword positions over time." },
  { icon: Bot, title: "AI SEO Assistant", desc: "Get daily SEO tasks powered by AI." },
];

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    features: ["3 SEO audits", "20 keyword searches", "Basic reports"],
    cta: "Start Free",
    highlight: false,
  },
  {
    name: "Creator",
    price: "₹199",
    period: "/month",
    features: ["Unlimited SEO audits", "Keyword research", "Blog idea generator", "Priority support"],
    cta: "Get Creator",
    highlight: true,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    features: ["Everything in Creator", "Rank tracking", "Competitor analysis", "AI SEO assistant"],
    cta: "Get Pro",
    highlight: false,
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">RankSprout</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/signup">Start Free</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32">
        {/* Glow effect */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial="hidden" animate="visible" custom={0} variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm mb-8"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered SEO Made Simple
          </motion.div>

          <motion.h1
            initial="hidden" animate="visible" custom={1} variants={fadeUp}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl mx-auto"
          >
            Simple SEO for{" "}
            <span className="gradient-text">Small Businesses</span>
          </motion.h1>

          <motion.p
            initial="hidden" animate="visible" custom={2} variants={fadeUp}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Rank higher on Google with AI-powered SEO insights designed for freelancers and local businesses.
          </motion.p>

          <motion.div
            initial="hidden" animate="visible" custom={3} variants={fadeUp}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="hero" size="lg" asChild>
              <Link to="/signup">Start Free <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/dashboard">View Demo</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Everything you need to rank</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Powerful SEO tools simplified into clear daily actions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                custom={i} variants={fadeUp}
                className="glass-card p-6 group hover:border-primary/30 transition-all duration-300"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Simple, transparent pricing</h2>
            <p className="mt-4 text-muted-foreground">Start free. Upgrade when you're ready.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                custom={i} variants={fadeUp}
                className={`rounded-xl p-6 flex flex-col ${
                  plan.highlight
                    ? "gradient-border bg-card shadow-glow"
                    : "glass-card"
                }`}
              >
                <h3 className="font-semibold text-lg text-foreground">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlight ? "hero" : "hero-outline"}
                  className="mt-8 w-full"
                  asChild
                >
                  <Link to="/signup">{plan.cta}</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">RankSprout</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 RankSprout. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
