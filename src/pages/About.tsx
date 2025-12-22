import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

function setMeta(title: string, description: string) {
  document.title = title;
  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
  meta.content = description;
}

const About = () => {
  useEffect(() => setMeta("À propos | MIPROJET", "Découvrez la mission et l'équipe MIPROJET."), []);
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-4">À propos de MIPROJET</h1>
        <p className="text-muted-foreground max-w-3xl">La seule plateforme qui structure avant de financer : label qualité, accompagnement end-to-end, compte séquestre et déblocage progressif.</p>
      </main>
      <Footer />
    </div>
  );
};
export default About;
