import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { TrendingUp, Loader2 } from "lucide-react";

type DataPoint = { date: string; score: number; domain: string };

export default function ScoreTrendsChart() {
  const { user } = useAuth();
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("seo_audits")
      .select("seo_score, created_at, domain")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(30)
      .then(({ data: audits }) => {
        setData(
          (audits || []).map((a) => ({
            date: new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            score: a.seo_score,
            domain: a.domain,
          }))
        );
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="glass-card p-6 flex items-center justify-center h-48">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  if (data.length < 2) return null;

  return (
    <div className="glass-card p-6">
      <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-primary" />
        Score Trends
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value: number, _: string, entry: any) => [
              `${value}/100`,
              entry.payload.domain,
            ]}
          />
          <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--primary))" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
