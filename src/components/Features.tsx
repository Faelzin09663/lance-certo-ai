import { Zap, Target, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "IA Avançada",
    description: "Powered by GPT-4, nossa IA aprende com seu estilo e cria propostas únicas e personalizadas.",
  },
  {
    icon: Clock,
    title: "Economize 95% do Tempo",
    description: "De 30 minutos para 30 segundos. Foque no que importa: entregar projetos incríveis.",
  },
  {
    icon: Target,
    title: "Alta Precisão",
    description: "Propostas que acertam o alvo. Destaque seus pontos fortes e conquiste mais clientes.",
  },
  {
    icon: TrendingUp,
    title: "Aumente Conversões",
    description: "Freelancers reportam até 5x mais aprovações com propostas geradas pela nossa IA.",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Por que usar o LanceCerto?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A ferramenta completa para freelancers que querem vencer mais projetos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="shadow-soft hover:shadow-medium transition-shadow duration-300 border-border"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
