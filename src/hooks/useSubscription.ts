import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type Plan = "free" | "creator" | "pro";

interface SubscriptionData {
  plan: Plan;
  status: string;
  loading: boolean;
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

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setPlan(data.plan as Plan);
          setStatus(data.status);
        }
        setLoading(false);
      });
  }, [user]);

  const limits = PLAN_LIMITS[plan];

  const canUse = (feature: string) => {
    if (feature === "rankTracker") return limits.rankTracker;
    if (feature === "competitors") return limits.competitors;
    if (feature === "aiAssistant") return limits.aiAssistant;
    return true;
  };

  return { plan, status, loading, limits, canUse };
}
