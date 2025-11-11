import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Target, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Como Funciona o LanceCerto
              </h1>
              <p className="text-xl text-muted-foreground">
                Gere propostas profissionais em 3 passos simples
              </p>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle>1. Adicione seu Perfil</CardTitle>
                  <CardDescription>
                    Cole sua biografia profissional ou resumo de experiências
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                    <Target className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle>2. Descreva o Job</CardTitle>
                  <CardDescription>
                    Cole a descrição do projeto que você quer se candidatar
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle>3. Gere a Proposta</CardTitle>
                  <CardDescription>
                    Clique em gerar e receba uma proposta personalizada em segundos
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Example Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Exemplo de Uso</h2>
              
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Entrada: Seu Perfil</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground italic">
                      "Sou desenvolvedor Full Stack com 5 anos de experiência em React, Node.js e Python. 
                      Especializado em criar aplicações web escaláveis e responsivas. Já trabalhei com 
                      startups e empresas de médio porte, entregando projetos no prazo e com alta qualidade."
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Entrada: Descrição do Job</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground italic">
                      "Preciso de um desenvolvedor para criar um sistema de agendamento online para 
                      minha clínica. O sistema deve permitir que pacientes marquem consultas, recebam 
                      lembretes por email e que minha equipe gerencie a agenda. Prazo: 45 dias."
                    </p>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <Zap className="w-12 h-12 text-accent animate-pulse" />
                </div>

                <Card className="border-accent">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="text-success" />
                      Saída: Proposta Gerada pela IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground">
                      Olá! Vi seu projeto de sistema de agendamento e tenho a solução perfeita para você.
                      <br /><br />
                      <strong>Por que sou o profissional ideal:</strong>
                      <br />
                      Com 5 anos de experiência em desenvolvimento Full Stack, já criei diversos sistemas 
                      similares para clínicas e consultórios. Domino React para interfaces intuitivas e 
                      Node.js para backends robustos.
                      <br /><br />
                      <strong>O que vou entregar:</strong>
                      <br />
                      ✅ Sistema de agendamento online responsivo
                      <br />
                      ✅ Notificações automáticas por email
                      <br />
                      ✅ Painel administrativo completo
                      <br />
                      ✅ Integração com calendário
                      <br />
                      ✅ Suporte técnico pós-entrega
                      <br /><br />
                      Posso entregar em 40 dias com qualidade garantida. Vamos conversar sobre os detalhes?
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12 text-center">
                <Link to="/gerador">
                  <Button variant="accent" size="lg">
                    Experimentar Agora
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Por Que Usar o LanceCerto?</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Economize Tempo</h3>
                  <p className="text-muted-foreground">
                    De 30 minutos para 30 segundos por proposta
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Aumente Conversões</h3>
                  <p className="text-muted-foreground">
                    Propostas mais persuasivas = mais projetos fechados
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Qualidade Profissional</h3>
                  <p className="text-muted-foreground">
                    IA treinada para gerar textos persuasivos e bem estruturados
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Personalizado</h3>
                  <p className="text-muted-foreground">
                    Cada proposta é única e adaptada ao job específico
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
