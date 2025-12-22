import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

function setMeta(title: string, description: string) {
  document.title = title;
  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
  meta.content = description;
}

const FAQ = () => {
  useEffect(() => setMeta("FAQ | MIPROJET", "Questions fréquentes sur la plateforme MIPROJET."), []);
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-4">FAQ</h1>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Comment soumettre un projet ? Créez un compte puis utilisez « Soumettre un projet ».</li>
          <li>Quels types de financement ? Don, prêt participatif, equity.</li>
        </ul>
      </main>
      <Footer />
    </div>
  );
};
export default FAQ;
