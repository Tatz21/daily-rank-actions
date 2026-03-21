import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Sparkles, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

const plans = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "forever",
    icon: Zap,
    features: ["3 SEO audits", "20 keyword searches", "Basic reports"],
    highlight: false,
  },
  {
    id: "creator",
    name: "Creator",
    price: "₹199",
    period: "/month",
    icon: Sparkles,
    features: ["Unlimited SEO audits", "Keyword research", "Blog idea generator", "Priority support"],
    highlight: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹499",
    period: "/month",
    icon: Crown,
    features: ["Everything in Creator", "Rank tracking", "Competitor analysis", "AI SEO assistant"],
    highlight: false,
  },
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPage() {
  const { user } = useAuth();
  const { plan: currentPlan, loading: subLoading } = useSubscription();
  const [loading, setLoading] = useState<string | null>(null);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (planId: string) => {
    if (planId === "free" || planId === currentPlan) return;
    if (!user) {
      toast.error("Please log in to subscribe");
      return;
    }

    setLoading(planId);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Failed to load payment gateway");

      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: { plan: planId, userId: user.id, email: user.email },
      });

      if (error || data?.error) throw new Error(data?.error || error?.message);

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "RankSprout",
        description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
        order_id: data.orderId,
        prefill: { email: user.email },
        theme: { color: "#22c55e" },
        handler: async (response: any) => {
          try {
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              "verify-razorpay-payment",
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  plan: planId,
                  userId: user.id,
                },
              }
            );
            if (verifyError || verifyData?.error) throw new Error(verifyData?.error || verifyError?.message);
            toast.success(`Upgraded to ${planId} plan! 🎉`);
            window.location.reload();
          } catch (err: any) {
            toast.error(err.message || "Payment verification failed");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate payment");
    } finally {
      setLoading(null);
    }
  };

  const getButtonLabel = (planId: string) => {
    if (planId === currentPlan) return "Current Plan";
    if (planId === "free") return "Free";
    const planOrder = ["free", "creator", "pro"];
    return planOrder.indexOf(planId) > planOrder.indexOf(currentPlan) ? `Upgrade to ${plans.find(p => p.id === planId)?.name}` : "Downgrade";
  };

  return (
    <div className="max-w-4xl">
      <motion.h1 initial="hidden" animate="visible" custom={0} variants={fadeUp} className="text-2xl font-bold mb-2">
        Upgrade Your Plan
      </motion.h1>
      <motion.p initial="hidden" animate="visible" custom={0} variants={fadeUp} className="text-muted-foreground mb-8">
        Unlock more SEO power. Cancel anytime.
      </motion.p>

      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((plan, i) => {
          const isCurrent = plan.id === currentPlan;
          return (
            <motion.div
              key={plan.id}
              initial="hidden"
              animate="visible"
              custom={i + 1}
              variants={fadeUp}
              className={`glass-card p-6 flex flex-col ${plan.highlight ? "border-primary/40 shadow-glow" : ""} ${isCurrent ? "ring-2 ring-primary/50" : ""}`}
            >
              {isCurrent && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-2">Your Plan</span>
              )}
              <div className="flex items-center gap-2 mb-4">
                <plan.icon className={`h-5 w-5 ${plan.highlight ? "text-primary" : "text-muted-foreground"}`} />
                <h3 className="font-semibold text-lg text-foreground">{plan.name}</h3>
              </div>

              <div className="mb-5">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlight ? "hero" : "hero-outline"}
                className="w-full"
                disabled={isCurrent || loading !== null || subLoading}
                onClick={() => handleSubscribe(plan.id)}
              >
                {loading === plan.id && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                {getButtonLabel(plan.id)}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
