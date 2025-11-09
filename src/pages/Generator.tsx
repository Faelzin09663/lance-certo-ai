import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Copy, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Generator = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState("");
  const [oldProposals, setOldProposals] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [generatedProposal, setGeneratedProposal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!profile.trim() || !jobDescription.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha seu perfil e a descrição do job.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedProposal("");

    try {
      const { data, error } = await supabase.functions.invoke("generate-proposal", {
        body: {
          profile: profile.trim(),
          oldProposals: oldProposals.trim(),
          jobDescription: jobDescription.trim(),
        },
      });

      if (error) throw error;

      if (data?.proposal) {
        setGeneratedProposal(data.proposal);
        toast({
          title: "Proposta gerada!",
          description: "Sua proposta profissional está pronta.",
        });
      }
    } catch (error: any) {
      console.error("Error generating proposal:", error);
      toast({
        title: "Erro ao gerar proposta",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedProposal);
    toast({
      title: "Copiado!",
      description: "Proposta copiada para a área de transferência.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 gradient-subtle py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Gerador de Propostas IA</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Crie sua proposta vencedora
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Preencha os campos abaixo e deixe nossa IA criar uma proposta profissional e persuasiva
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 animate-fade-in">
            {/* Input Section */}
            <div className="space-y-6">
              <Card className="shadow-soft border-border">
                <CardHeader>
                  <CardTitle>Seu Perfil</CardTitle>
                  <CardDescription>
                    Cole sua bio, resumo profissional ou principais skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Ex: Sou desenvolvedor full-stack com 5 anos de experiência em React, Node.js e bancos de dados..."
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                    className="min-h-[150px] resize-none"
                  />
                </CardContent>
              </Card>

              <Card className="shadow-soft border-border">
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
                    className="min-h-[120px] resize-none"
                  />
                </CardContent>
              </Card>

              <Card className="shadow-soft border-border">
                <CardHeader>
                  <CardTitle>Descrição do Job</CardTitle>
                  <CardDescription>
                    Cole a descrição completa do projeto que você quer conquistar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Ex: Preciso de um desenvolvedor para criar um site institucional com..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[150px] resize-none"
                  />
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    variant="hero"
                    size="lg"
                    className="w-full"
                  >
                    {isGenerating ? (
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
            </div>

            {/* Output Section */}
            <div>
              <Card className="shadow-medium border-border sticky top-24">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Sua Proposta</CardTitle>
                      <CardDescription>
                        Proposta gerada pela IA - pronta para usar
                      </CardDescription>
                    </div>
                    {generatedProposal && (
                      <Button
                        onClick={handleCopy}
                        variant="outline"
                        size="sm"
                      >
                        <Copy className="w-4 h-4" />
                        Copiar
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <Loader2 className="w-12 h-12 animate-spin text-accent" />
                      <p className="text-muted-foreground text-sm">
                        Criando sua proposta perfeita...
                      </p>
                    </div>
                  ) : generatedProposal ? (
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-foreground bg-muted/30 p-6 rounded-lg border border-border">
                        {generatedProposal}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-accent" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">
                          Preencha os campos e clique em "Gerar Lance"
                        </p>
                        <p className="text-muted-foreground text-xs mt-2">
                          Sua proposta aparecerá aqui
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Generator;
