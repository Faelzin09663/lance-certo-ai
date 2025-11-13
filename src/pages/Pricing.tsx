import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Loader2, Settings } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { STRIPE_PLANS } from "@/lib/stripe";

const Pricing = () => {
  const { plan, user, loading: subLoading } = useSubscription();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [managingPortal, setManagingPortal] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = async (planKey: 'starter' | 'premium') => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setLoadingPlan(planKey);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId: STRIPE_PLANS[planKey].price_id },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Erro ao processar pagamento",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setManagingPortal(true);

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening portal:', error);
      toast({
        title: "Erro ao abrir portal",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setManagingPortal(false);
    }
  };

  const plans = [
    {
      key: 'free' as const,
      name: "Free",
      price: "R$ 0",
      description: "Para experimentar",
      features: [
        "1 projeto grátis",
        "Geração básica de propostas",
        "Suporte por email",
      ],
      cta: "Plano Atual",
      variant: "outline" as const,
    },
    {
      key: 'starter' as const,
      name: "Starter",
      price: "R$ 49,99",
      description: "Para freelancers ativos",
      features: [
        "Projetos ilimitados",
        "Geração avançada de propostas",
        "Histórico de propostas",
        "Suporte prioritário",
      ],
      cta: "Assinar Starter",
      variant: "default" as const,
      popular: false,
    },
    {
      key: 'premium' as const,
      name: "Premium",
      price: "R$ 99,99",
      description: "Para profissionais sérios",
      features: [
        "Tudo do Starter +",
        "IA cria plano de execução do projeto",
        "Dicas valiosas personalizadas",
        "Análise de competitividade",
        "Suporte VIP 24/7",
      ],
      cta: "Assinar Premium",
      variant: "accent" as const,
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Planos e Preços
              </h1>
              <p className="text-xl text-muted-foreground">
                Escolha o plano ideal para impulsionar sua carreira freelance
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            {plan !== 'free' && user && (
              <div className="max-w-2xl mx-auto mb-8 text-center">
                <Card className="bg-accent/5">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      Você está no plano <strong className="text-accent">{plan.toUpperCase()}</strong>
                    </p>
                    <Button
                      onClick={handleManageSubscription}
                      disabled={managingPortal}
                      variant="outline"
                    >
                      {managingPortal ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Abrindo...
                        </>
                      ) : (
                        <>
                          <Settings className="w-4 h-4" />
                          Gerenciar Assinatura
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((planItem) => {
                const isCurrentPlan = planItem.key === plan;
                
                return (
                  <Card 
                    key={planItem.name}
                    className={`relative ${planItem.popular ? 'border-accent shadow-accent' : ''} ${isCurrentPlan ? 'border-success' : ''}`}
                  >
                    {planItem.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <Sparkles className="w-4 h-4" />
                          Mais Popular
                        </span>
                      </div>
                    )}

                    {isCurrentPlan && (
                      <div className="absolute -top-4 right-4">
                        <span className="bg-success text-white px-4 py-1 rounded-full text-sm font-semibold">
                          Seu Plano
                        </span>
                      </div>
                    )}
                    
                    <CardHeader>
                      <CardTitle className="text-2xl">{planItem.name}</CardTitle>
                      <CardDescription>{planItem.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-foreground">{planItem.price}</span>
                        {planItem.price !== "R$ 0" && (
                          <span className="text-muted-foreground">/mês</span>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {planItem.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </CardContent>

                    <CardFooter>
                      {planItem.key === 'free' ? (
                        <Button 
                          variant={isCurrentPlan ? "outline" : planItem.variant} 
                          className="w-full" 
                          size="lg"
                          disabled={isCurrentPlan}
                        >
                          {isCurrentPlan ? "Plano Atual" : "Começar Grátis"}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleSubscribe(planItem.key)}
                          disabled={loadingPlan === planItem.key || isCurrentPlan || subLoading}
                          variant={isCurrentPlan ? "outline" : planItem.variant}
                          className="w-full"
                          size="lg"
                        >
                          {loadingPlan === planItem.key ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Processando...
                            </>
                          ) : isCurrentPlan ? (
                            "Plano Atual"
                          ) : (
                            planItem.cta
                          )}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Posso cancelar a qualquer momento?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Sim! Você pode cancelar sua assinatura a qualquer momento, sem taxas de cancelamento.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">O que acontece após o projeto grátis?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      No plano Free, você pode gerar propostas para 1 projeto. Depois, precisará fazer upgrade 
                      para o plano Starter ou Premium para continuar usando.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Como funciona o plano Premium?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      No plano Premium, além de gerar a proposta, a IA também cria um plano detalhado de 
                      como executar o projeto, com dicas valiosas sobre prazos, tecnologias e melhores práticas.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Posso fazer upgrade do meu plano?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Sim! Você pode fazer upgrade do seu plano a qualquer momento e começar a usar os 
                      novos recursos imediatamente.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
