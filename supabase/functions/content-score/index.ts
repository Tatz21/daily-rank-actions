import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { content, keyword } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const wordCount = content.split(/\s+/).length;
    const keywordCount = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), "g")) || []).length;
    const density = ((keywordCount / wordCount) * 100).toFixed(2);

    const prompt = `You are an SEO content analyst. Analyze this content for the target keyword "${keyword}".

Content (${wordCount} words, keyword density: ${density}%):
${content.substring(0, 3000)}

Return a JSON object with this exact structure:
{
  "overallScore": 72,
  "readability": { "score": 75, "feedback": "Specific feedback about readability" },
  "keywordUsage": { "score": 68, "density": "${density}%", "feedback": "Specific feedback about keyword placement" },
  "structure": { "score": 70, "feedback": "Specific feedback about headings, paragraphs, lists" },
  "suggestions": [
    "Specific actionable suggestion 1",
    "Specific actionable suggestion 2",
    "Specific actionable suggestion 3",
    "Specific actionable suggestion 4",
    "Specific actionable suggestion 5"
  ]
}

Be specific and actionable. Return ONLY valid JSON.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a content SEO analyst. Always respond with valid JSON only." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content;
    let result;
    try {
      const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, raw];
      result = JSON.parse(jsonMatch[1].trim());
    } catch { throw new Error("Failed to parse AI response"); }

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("content-score error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
