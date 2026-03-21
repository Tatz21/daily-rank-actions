import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradeNudgeProps {
  feature: string;
  requiredPlan?: string;
}

export default function UpgradeNudge({ feature, requiredPlan = "Pro" }: UpgradeNudgeProps) {
  return (
    <div className="glass-card p-6 text-center max-w-md mx-auto my-12">
      <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
      <h3 className="font-semibold text-lg mb-1">Upgrade to {requiredPlan}</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {feature} is available on the {requiredPlan} plan. Upgrade to unlock this and more.
      </p>
      <Button variant="hero" size="sm" asChild>
        <Link to="/dashboard/pricing">View Plans</Link>
      </Button>
    </div>
  );
}
