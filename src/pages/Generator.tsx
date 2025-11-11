import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Session } from '@supabase/supabase-js';

const Generator = () => {
  const [profile, setProfile] = useState("");
  const [oldProposals, setOldProposals] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [generatedProposal, setGeneratedProposal] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userPlan, setUserPlan] = useState<string>("free");
  const [projectCount, setProjectCount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          setTimeout(() => {
            navigate("/auth");
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
      } else {
        fetchUserData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', userId)
      .maybeSingle();

    if (subscription) {
      setUserPlan(subscription.plan);
    }

    const { count } = await supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    setProjectCount(count || 0);
  };

  const handleGenerate = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (userPlan === "free" && projectCount >= 1) {
      toast({
        title: "Limite atingido",
        description: "No plano Free você tem direito a 1 projeto. Faça upgrade para continuar!",
        variant: "destructive",
      });
      return;
    }

    if (!profile.trim() || !jobDescription.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha seu perfil e a descrição do job.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setGeneratedProposal("");

    try {
      const { data, error } = await supabase.functions.invoke('generate-proposal', {
        body: {
          profile,
          oldProposals,
          jobDescription,
          plan: userPlan,
        },
      });

      if (error) throw error;

      setGeneratedProposal(data.proposal);

      // Save proposal to database
      await supabase.from('proposals').insert({
        user_id: user.id,
        profile_text: profile,
        job_description: jobDescription,
        generated_proposal: data.proposal,
      });

      // Update project count
      setProjectCount(projectCount + 1);

      toast({
        title: "Proposta gerada!",
        description: "Sua proposta foi criada com sucesso.",
      });
    } catch (error) {
      console.error('Error generating proposal:', error);
      toast({
        title: "Erro ao gerar proposta",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedProposal);
    toast({
      title: "Copiado!",
      description: "Proposta copiada para a área de transferência.",
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Gerador de Propostas
            </h1>
            <p className="text-xl text-muted-foreground">
              Preencha os campos abaixo e deixe a IA criar sua proposta perfeita
            </p>
            <div className="mt-4">
              <span className="text-sm text-muted-foreground">
                Plano: <strong className="text-accent">{userPlan.toUpperCase()}</strong>
                {userPlan === "free" && ` • Projetos: ${projectCount}/1`}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Seu Perfil</CardTitle>
                <CardDescription>
                  Cole sua bio, resumo profissional ou principais skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Ex: Sou desenvolvedor full-stack com 5 anos de experiência em React, Node.js..."
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                  className="min-h-[150px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Propostas Antigas (Opcional)</CardTitle>
                <CardDescription>
                  Cole exemplos de propostas suas para a IA aprender seu estilo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Ex: Olá! Vi seu projeto e tenho experiência com..."
                  value={oldProposals}
                  onChange={(e) => setOldProposals(e.target.value)}
                  className="min-h-[120px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Descrição do Job</CardTitle>
                <CardDescription>
                  Cole a descrição completa do projeto que você quer conquistar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Ex: Preciso de um desenvolvedor para criar um site institucional..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[150px]"
                />
                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  variant="hero"
                  size="lg"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Gerando proposta...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Gerar Lance
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {generatedProposal && (
              <Card className="border-accent">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Sua Proposta</CardTitle>
                    <Button onClick={handleCopy} variant="outline" size="sm">
                      <Copy className="w-4 h-4" />
                      Copiar
                    </Button>
                  </div>
                  <CardDescription>Proposta gerada pela IA - pronta para usar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-foreground bg-muted/30 p-6 rounded-lg">
                    {generatedProposal}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Generator;
