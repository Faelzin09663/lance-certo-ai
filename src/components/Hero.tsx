import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.png";

const Hero = () => {
  return (
    <section className="relative overflow-hidden gradient-subtle py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Gerador de Propostas com IA</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Menos tempo escrevendo,{" "}
              <span className="text-accent">mais tempo faturando</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Transforme 30 minutos em 30 segundos. Crie propostas profissionais e persuasivas que aumentam suas chances de conquistar projetos em até 5x.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/gerador">
                <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                  Gerar Proposta Agora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                Ver Exemplo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-border">
              <div>
                <div className="text-3xl font-bold text-accent">5x</div>
                <div className="text-sm text-muted-foreground mt-1">Taxa de conversão</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">30s</div>
                <div className="text-sm text-muted-foreground mt-1">Tempo médio</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">1000+</div>
                <div className="text-sm text-muted-foreground mt-1">Freelancers</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative animate-fade-in lg:block hidden">
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="Freelancer criando propostas profissionais"
                className="rounded-2xl shadow-medium w-full"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-accent/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
