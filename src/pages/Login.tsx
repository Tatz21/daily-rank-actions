import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Login() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Sprout className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">RankSprout</span>
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
        </div>
        <div className="glass-card p-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
            <Input type="email" placeholder="you@example.com" className="bg-muted border-border" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Password</label>
            <Input type="password" placeholder="••••••••" className="bg-muted border-border" />
          </div>
          <Button variant="hero" className="w-full" asChild>
            <Link to="/dashboard">Sign In</Link>
          </Button>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
