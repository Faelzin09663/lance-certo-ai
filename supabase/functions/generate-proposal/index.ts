import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profile, oldProposals, jobDescription } = await req.json();

    if (!profile || !jobDescription) {
      return new Response(
        JSON.stringify({ error: 'Profile and job description are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build the prompt for the AI
    let systemPrompt = `Você é um especialista em criar propostas comerciais para freelancers.

Seu objetivo é criar uma proposta profissional, persuasiva e personalizada que:
1. Demonstre entendimento profundo do projeto
2. Destaque as qualificações relevantes do freelancer
3. Mostre entusiasmo genuíno e profissionalismo
4. Seja objetiva mas calorosa
5. Termine com um call-to-action claro

IMPORTANTE:
- Use um tom profissional mas acessível
- Seja específico sobre como o freelancer pode ajudar
- Evite clichês genéricos
- Mantenha a proposta concisa (200-300 palavras)
- Use português brasileiro
- NÃO inclua saudações como "Olá" ou "Prezado cliente" no início
- Comece diretamente falando sobre o projeto`;

    let userPrompt = `PERFIL DO FREELANCER:
${profile}

${oldProposals ? `EXEMPLOS DE PROPOSTAS ANTERIORES (para aprender o estilo):
${oldProposals}

` : ''}DESCRIÇÃO DO JOB:
${jobDescription}

Crie uma proposta comercial profissional para este projeto.`;

    console.log('Calling Lovable AI Gateway...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requisições excedido. Tente novamente mais tarde.' }),
          { 
            status: 429, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Créditos insuficientes. Por favor, adicione créditos.' }),
          { 
            status: 402, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('Failed to generate proposal');
    }

    const data = await response.json();
    const proposal = data.choices?.[0]?.message?.content;

    if (!proposal) {
      throw new Error('No proposal generated');
    }

    console.log('Proposal generated successfully');

    return new Response(
      JSON.stringify({ proposal }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error in generate-proposal function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
