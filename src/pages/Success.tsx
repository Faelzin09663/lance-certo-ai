import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Success = () => {
  const navigate = useNavigate();
  const { checkSubscription, loading } = useSubscription();

  useEffect(() => {
    // Check subscription status after successful payment
    const timer = setTimeout(() => {
      checkSubscription();
    }, 2000);

    return () => clearTimeout(timer);
  }, [checkSubscription]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="text-center border-success">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                {loading ? (
                  <Loader2 className="w-8 h-8 text-success animate-spin" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-success" />
                )}
              </div>
              <CardTitle className="text-3xl">Pagamento Confirmado!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground text-lg">
                Sua assinatura foi ativada com sucesso. Agora você pode aproveitar todos os recursos do seu plano!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate("/gerador")}
                  variant="accent"
                  size="lg"
                >
                  Começar a Usar
                </Button>
                <Button
                  onClick={() => navigate("/planos")}
                  variant="outline"
                  size="lg"
                >
                  Ver Meu Plano
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Success;
