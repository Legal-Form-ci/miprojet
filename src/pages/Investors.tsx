import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

function setMeta(title: string, description: string) {
  document.title = title;
  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
  meta.content = description;
}

const Investors = () => {
  useEffect(() => setMeta("Investisseurs | MIPROJET", "Investissez selon votre profil: don, prêt ou equity."), []);
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-4">Espace Investisseur</h1>
        <p className="text-muted-foreground max-w-3xl">Transparence des risques (A, B, C), fonds en séquestre, déblocage progressif, rapports trimestriels.</p>
      </main>
      <Footer />
    </div>
  );
};
export default Investors;
