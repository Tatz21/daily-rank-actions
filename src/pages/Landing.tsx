import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Search, BarChart3, Users, TrendingUp, Bot, Shield,
  ArrowRight, Sparkles, CheckCircle2, Sprout, Lock, Settings
} from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import {
  PricingWrapper, Heading, Price, Paragraph
} from "@/components/ui/animated-pricing-cards";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
  }),
};

const features = [
  { area: "md:[grid-area:1/1/2/7]", icon: <Shield className="h-5 w-5 text-primary" />, title: "SEO Audit", desc: "Analyze your website and detect SEO issues instantly with AI-powered scoring." },
  { area: "md:[grid-area:1/7/2/13]", icon: <Search className="h-5 w-5 text-primary" />, title: "Keyword Finder", desc: "Discover low competition keywords for your niche." },
  { area: "md:[grid-area:2/1/3/5]", icon: <Users className="h-5 w-5 text-primary" />, title: "Competitor Insights", desc: "Understand which keywords your competitors rank for." },
  { area: "md:[grid-area:2/5/3/9]", icon: <TrendingUp className="h-5 w-5 text-primary" />, title: "Rank Tracker", desc: "Track your Google keyword positions over time." },
  { area: "md:[grid-area:2/9/3/13]", icon: <Bot className="h-5 w-5 text-primary" />, title: "AI SEO Assistant", desc: "Get daily SEO tasks powered by AI." },
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

      {/* Features - Glowing Grid */}
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

          <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-2 lg:gap-4 xl:max-w-5xl xl:mx-auto">
            {features.map((f, i) => (
              <motion.li
                key={f.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                custom={i} variants={fadeUp}
                className={`min-h-[14rem] list-none ${f.area}`}
              >
                <div className="relative h-full rounded-2xl border border-border bg-card p-2">
                  <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={2} disabled={false} />
                  <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.5px] border-border bg-background p-6">
                    <div className="relative flex flex-1 flex-col justify-between gap-3">
                      <div className="w-fit rounded-lg border border-border p-2">
                        {f.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                        <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pricing - Animated Cards */}
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
              >
                <PricingWrapper
                  contactHref="/signup"
                  type={plan.highlight ? "waves" : "crosses"}
                  className={plan.highlight ? "shadow-glow border-primary/30" : ""}
                >
                  <div className="p-6">
                    <Heading>{plan.name}</Heading>
                    <Price>
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    </Price>
                    <Paragraph>
                      <ul className="space-y-3 mt-4 text-left">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </Paragraph>
                    <Button
                      variant={plan.highlight ? "hero" : "hero-outline"}
                      className="mt-6 w-full"
                      asChild
                    >
                      <Link to="/signup">{plan.cta}</Link>
                    </Button>
                  </div>
                </PricingWrapper>
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
