import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

function setMeta(title: string, description: string) {
  document.title = title;
  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
  meta.content = description;
}

const Guide = () => {
  useEffect(() => setMeta("Guide du porteur | MIPROJET", "Guide pour soumettre et structurer votre projet."), []);
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-4">Guide du porteur</h1>
        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
          <li>Créez un compte et complétez votre profil.</li>
          <li>Soumettez l'idée et payez l'adhésion.</li>
          <li>Suivez la structuration et validez le dossier.</li>
          <li>Lancement du financement participatif.</li>
        </ol>
      </main>
      <Footer />
    </div>
  );
};
export default Guide;
