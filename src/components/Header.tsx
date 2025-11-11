import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img src={logo} alt="LanceCerto" className="h-10" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Início
          </Link>
          <Link to="/como-funciona" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Como Funciona
          </Link>
          <Link to="/planos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Planos
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/auth">
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
