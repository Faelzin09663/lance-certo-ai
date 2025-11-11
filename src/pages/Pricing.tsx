import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "R$ 0",
      description: "Para experimentar",
      features: [
        "1 projeto grátis",
        "Geração básica de propostas",
        "Suporte por email",
      ],
      cta: "Começar Grátis",
      variant: "outline" as const,
    },
    {
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
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <Card 
                  key={plan.name}
                  className={`relative ${plan.popular ? 'border-accent shadow-accent' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        Mais Popular
                      </span>
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      {plan.price !== "R$ 0" && (
                        <span className="text-muted-foreground">/mês</span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </CardContent>

                  <CardFooter>
                    <Link to="/auth" className="w-full">
                      <Button variant={plan.variant} className="w-full" size="lg">
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
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
