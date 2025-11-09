import { Target } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold">LanceCerto</span>
            </div>
            <p className="text-primary-foreground/80 text-sm mb-4 max-w-sm">
              A ferramenta de IA que ajuda freelancers a criar propostas vencedoras em segundos.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/gerador" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Gerador
                </Link>
              </li>
              <li>
                <Link to="/como-funciona" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Como Funciona
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Sobre
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; 2024 LanceCerto. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
