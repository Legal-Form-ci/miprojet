import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FundingForm } from "@/components/services/FundingForm";
import { useLanguage } from "@/i18n/LanguageContext";

const FundingService = () => {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = "Mobilisation de Financement | MIPROJET";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Mobilisation de Financement
          </h1>
          <p className="text-muted-foreground text-lg">
            Nous vous accompagnons dans la recherche d'investisseurs et de bailleurs de fonds 
            pour financer votre projet à fort impact.
          </p>
        </div>
        <FundingForm />
      </main>
      <Footer />
    </div>
  );
};

export default FundingService;
