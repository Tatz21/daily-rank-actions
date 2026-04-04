import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get all users with a saved website
    const { data: websites } = await supabase.from("websites").select("user_id, domain");
    if (!websites || websites.length === 0) {
      return new Response(JSON.stringify({ message: "No websites to audit" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results = [];

    for (const site of websites) {
      try {
        const prompt = `You are an expert SEO consultant. Analyze the website "${site.domain}" and generate a comprehensive SEO audit.
Return a JSON object with: { "seo_score": <0-100>, "categories": [{ "category": "...", "issues": [{ "title": "...", "explanation": "...", "fix": "...", "severity": "error"|"warning"|"pass" }] }] }
Generate 3-4 issues per category (Technical SEO, On-Page SEO, Content SEO). Mix severities. Return ONLY valid JSON.`;

        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-lite",
            messages: [
              { role: "system", content: "Respond with valid JSON only." },
              { role: "user", content: prompt },
            ],
          }),
        });

        if (!response.ok) continue;

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
        const audit = JSON.parse(jsonMatch[1].trim());

        await supabase.from("seo_audits").insert({
          user_id: site.user_id,
          domain: site.domain,
          seo_score: audit.seo_score,
          issues: audit.categories || [],
        });

        results.push({ domain: site.domain, score: audit.seo_score });
      } catch (e) {
        console.error(`Failed audit for ${site.domain}:`, e);
      }
    }

    return new Response(JSON.stringify({ audited: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("weekly-audit error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
