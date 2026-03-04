import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, User, Globe, CreditCard } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SettingsPage() {
  return (
    <div className="max-w-2xl">
      <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-2xl font-bold mb-8">Settings</motion.h1>

      <div className="space-y-6">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
              <Input value="user@example.com" readOnly className="bg-muted border-border" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Display Name</label>
              <Input placeholder="Your name" className="bg-muted border-border" />
            </div>
            <Button variant="hero" size="sm">Save Changes</Button>
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> Website</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Primary Domain</label>
              <Input placeholder="example.com" className="bg-muted border-border" />
            </div>
            <Button variant="hero" size="sm">Update Domain</Button>
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /> Subscription</h2>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div>
              <p className="font-medium text-foreground">Free Plan</p>
              <p className="text-xs text-muted-foreground">3 audits · 20 keyword searches</p>
            </div>
            <Button variant="hero-outline" size="sm">Upgrade</Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
