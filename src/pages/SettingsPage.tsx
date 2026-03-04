import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Globe, CreditCard, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [domain, setDomain] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingDomain, setSavingDomain] = useState(false);

  useEffect(() => {
    if (!user) return;
    setDisplayName(user.user_metadata?.display_name || "");

    // Fetch user's primary website
    supabase.from("websites").select("domain").eq("user_id", user.id).limit(1).single()
      .then(({ data }) => { if (data) setDomain(data.domain); });
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: { display_name: displayName },
      });
      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ display_name: displayName })
        .eq("user_id", user.id);
      if (profileError) throw profileError;

      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDomain = async () => {
    if (!user || !domain.trim()) return;
    setSavingDomain(true);
    try {
      // Check if website exists
      const { data: existing } = await supabase
        .from("websites")
        .select("id")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (existing) {
        const { error } = await supabase.from("websites").update({ domain: domain.trim() }).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("websites").insert({ user_id: user.id, domain: domain.trim() });
        if (error) throw error;
      }
      toast.success("Domain updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update domain");
    } finally {
      setSavingDomain(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="max-w-2xl">
      <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-2xl font-bold mb-8">Settings</motion.h1>

      <div className="space-y-6">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
              <Input value={user?.email || ""} readOnly className="bg-muted border-border" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Display Name</label>
              <Input placeholder="Your name" className="bg-muted border-border" value={displayName} onChange={e => setDisplayName(e.target.value)} />
            </div>
            <Button variant="hero" size="sm" onClick={handleSaveProfile} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> Website</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Primary Domain</label>
              <Input placeholder="example.com" className="bg-muted border-border" value={domain} onChange={e => setDomain(e.target.value)} />
            </div>
            <Button variant="hero" size="sm" onClick={handleSaveDomain} disabled={savingDomain}>
              {savingDomain && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              Update Domain
            </Button>
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

        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
