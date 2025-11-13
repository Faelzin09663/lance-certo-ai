import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const validateInput = (data: any) => {
  const errors: string[] = [];
  
  if (!data.profile || typeof data.profile !== 'string') {
    errors.push('Profile is required and must be a string');
  } else if (data.profile.trim().length < 10) {
    errors.push('Profile must be at least 10 characters');
  } else if (data.profile.length > 5000) {
    errors.push('Profile must not exceed 5000 characters');
  }
  
  if (data.oldProposals && typeof data.oldProposals !== 'string') {
    errors.push('Old proposals must be a string');
  } else if (data.oldProposals && data.oldProposals.length > 3000) {
    errors.push('Old proposals must not exceed 3000 characters');
  }
  
  if (!data.jobDescription || typeof data.jobDescription !== 'string') {
    errors.push('Job description is required and must be a string');
  } else if (data.jobDescription.trim().length < 10) {
    errors.push('Job description must be at least 10 characters');
  } else if (data.jobDescription.length > 5000) {
    errors.push('Job description must not exceed 5000 characters');
  }
  
  if (data.plan && !['free', 'starter', 'premium'].includes(data.plan)) {
    errors.push('Plan must be one of: free, starter, premium');
  }
  
  return errors;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('User authenticated:', user.id);

    // Parse and validate input
    const requestData = await req.json();
    const validationErrors = validateInput(requestData);
    
    if (validationErrors.length > 0) {
      console.error('Validation errors:', validationErrors);
      return new Response(
        JSON.stringify({ error: validationErrors.join('; ') }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { profile, oldProposals, jobDescription, plan = "free" } = requestData;

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
