import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type Plan = "free" | "creator" | "pro";

interface SubscriptionData {
  plan: Plan;
  status: string;
  loading: boolean;
  isTrial: boolean;
  trialDaysLeft: number;
}

const PLAN_LIMITS: Record<Plan, { audits: number; keywords: number; rankTracker: boolean; competitors: boolean; aiAssistant: boolean }> = {
  free: { audits: 3, keywords: 20, rankTracker: false, competitors: false, aiAssistant: false },
  creator: { audits: Infinity, keywords: Infinity, rankTracker: false, competitors: false, aiAssistant: false },
  pro: { audits: Infinity, keywords: Infinity, rankTracker: true, competitors: true, aiAssistant: true },
};

export function useSubscription(): SubscriptionData & { limits: typeof PLAN_LIMITS[Plan]; canUse: (feature: string) => boolean } {
  const { user } = useAuth();
  const [plan, setPlan] = useState<Plan>("free");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(true);
  const [isTrial, setIsTrial] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    supabase
      .from("subscriptions")
      .select("plan, status, trial_ends_at")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const trialEnd = data.trial_ends_at ? new Date(data.trial_ends_at) : null;
          const now = new Date();
          const onTrial = trialEnd !== null && trialEnd > now && data.status === "trialing";

          if (onTrial) {
            setPlan(data.plan as Plan);
            setIsTrial(true);
            setTrialDaysLeft(Math.ceil((trialEnd!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
          } else if (data.status === "trialing" && trialEnd && trialEnd <= now) {
            // Trial expired — treat as free
            setPlan("free");
            setIsTrial(false);
          } else {
            setPlan(data.plan as Plan);
          }
          setStatus(data.status);
        }
        setLoading(false);
      });
  }, [user]);

  const effectivePlan = isTrial ? plan : plan;
  const limits = PLAN_LIMITS[effectivePlan];

  const canUse = (feature: string) => {
    if (feature === "rankTracker") return limits.rankTracker;
    if (feature === "competitors") return limits.competitors;
    if (feature === "aiAssistant") return limits.aiAssistant;
    return true;
  };

  return { plan: effectivePlan, status, loading, limits, canUse, isTrial, trialDaysLeft };
}
