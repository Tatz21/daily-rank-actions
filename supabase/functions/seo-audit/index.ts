import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function fetchPageSpeedData(url: string) {
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=performance&category=accessibility&category=best-practices&category=seo&strategy=mobile`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      console.error("PageSpeed API error:", res.status);
      return null;
    }
    const data = await res.json();
    const categories = data.lighthouseResult?.categories || {};
    const audits = data.lighthouseResult?.audits || {};

    return {
      performance: Math.round((categories.performance?.score || 0) * 100),
      accessibility: Math.round((categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((categories["best-practices"]?.score || 0) * 100),
      seo: Math.round((categories.seo?.score || 0) * 100),
      coreWebVitals: {
        lcp: audits["largest-contentful-paint"]?.displayValue || "N/A",
        fid: audits["max-potential-fid"]?.displayValue || "N/A",
        cls: audits["cumulative-layout-shift"]?.displayValue || "N/A",
        fcp: audits["first-contentful-paint"]?.displayValue || "N/A",
        si: audits["speed-index"]?.displayValue || "N/A",
        tbt: audits["total-blocking-time"]?.displayValue || "N/A",
        tti: audits["interactive"]?.displayValue || "N/A",
      },
      diagnostics: Object.values(audits)
        .filter((a: any) => a.score !== null && a.score < 0.9 && a.title && a.description)
        .slice(0, 10)
        .map((a: any) => ({
          title: a.title,
          description: a.description?.replace(/\[.*?\]\(.*?\)/g, "").slice(0, 200),
          score: Math.round((a.score || 0) * 100),
          displayValue: a.displayValue || "",
        })),
    };
  } catch (err) {
    console.error("PageSpeed fetch error:", err);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { domain } = await req.json();
    if (!domain) {
      return new Response(JSON.stringify({ error: "Domain is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Normalize URL
    const fullUrl = domain.startsWith("http") ? domain : `https://${domain}`;

    // Fetch real PageSpeed data and AI analysis in parallel
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const [pageSpeed, aiResponse] = await Promise.all([
      fetchPageSpeedData(fullUrl),
      fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: "You are an SEO analysis AI. Always respond with valid JSON only, no markdown formatting." },
            {
              role: "user",
              content: `You are an expert SEO consultant. Analyze the website "${domain}" and generate a comprehensive SEO audit.

Return a JSON object with this exact structure:
{
  "categories": [
    {
      "category": "Technical SEO",
      "issues": [
        { "title": "<issue title>", "explanation": "<brief explanation>", "fix": "<suggested fix>", "severity": "error" | "warning" | "pass" }
      ]
    },
    { "category": "On-Page SEO", "issues": [...] },
    { "category": "Content SEO", "issues": [...] }
  ]
}

Generate 3-4 realistic issues per category. Include a mix of errors, warnings, and passes. Be specific to "${domain}". Return ONLY valid JSON.`,
            },
          ],
        }),
      }),
    ]);

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (aiResponse.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error("AI gateway error");
    }

    const data = await aiResponse.json();
    const content = data.choices?.[0]?.message?.content;

    let audit;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      audit = JSON.parse(jsonMatch[1].trim());
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse audit results");
    }

    // Compute final score: use real PageSpeed SEO score if available, else estimate from AI issues
    let seoScore: number;
    if (pageSpeed) {
      // Weighted: 40% PageSpeed SEO, 20% Performance, 20% Accessibility, 20% Best Practices
      seoScore = Math.round(pageSpeed.seo * 0.4 + pageSpeed.performance * 0.2 + pageSpeed.accessibility * 0.2 + pageSpeed.bestPractices * 0.2);
    } else {
      // Fallback: estimate from AI issues
      const allIssues = (audit.categories || []).flatMap((c: any) => c.issues || []);
      const errors = allIssues.filter((i: any) => i.severity === "error").length;
      const warnings = allIssues.filter((i: any) => i.severity === "warning").length;
      seoScore = Math.max(10, 100 - errors * 15 - warnings * 5);
    }

    const result = {
      seo_score: seoScore,
      categories: audit.categories || [],
      pageSpeed: pageSpeed || null,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("seo-audit error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
