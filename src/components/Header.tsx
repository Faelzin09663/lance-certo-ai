import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-accent-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">LanceCerto</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Início
          </Link>
          <Link to="/gerador" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Gerador
          </Link>
          <Link to="/como-funciona" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Como Funciona
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/gerador">
            <Button variant="accent" size="default">
              Começar Grátis
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
