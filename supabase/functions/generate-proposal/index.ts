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
    const { profile, oldProposals, jobDescription, plan = "free" } = await req.json();

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

    let systemPrompt = `Você é um assistente especializado em criar propostas comerciais persuasivas para freelancers.
Sua tarefa é gerar uma proposta profissional, personalizada e convincente com base no perfil do freelancer e na descrição do job.

Diretrizes:
- Seja direto e objetivo, mas também persuasivo
- Destaque as competências relevantes do freelancer
- Mostre compreensão do problema do cliente
- Apresente uma solução clara
- Use um tom profissional mas amigável
- Não invente informações que não estão no perfil
- Mantenha a proposta entre 200-300 palavras`;

    // Premium plan gets extra features
    if (plan === "premium") {
      systemPrompt += `

RECURSOS PREMIUM ATIVADOS:
Além da proposta, você deve incluir:

1. PLANO DE EXECUÇÃO DO PROJETO
- Divida o projeto em etapas claras (3-5 fases)
- Estime o tempo de cada etapa
- Sugira marcos importantes (milestones)

2. DICAS VALIOSAS
- Tecnologias recomendadas e por quê
- Possíveis desafios e como superá-los
- Sugestões de melhorias além do pedido inicial
- Boas práticas específicas para este tipo de projeto

Formate assim:
[PROPOSTA]
(texto da proposta aqui)

[PLANO DE EXECUÇÃO]
(plano detalhado aqui)

[DICAS VALIOSAS]
(dicas e insights aqui)`;
    }

    const userPrompt = `
Perfil do Freelancer:
${profile}

${oldProposals ? `Exemplos de propostas anteriores (para aprender o estilo):
${oldProposals}` : ''}

Descrição do Job:
${jobDescription}

Gere uma proposta comercial profissional e persuasiva para este job.`;

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
