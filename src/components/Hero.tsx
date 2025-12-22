import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, Shield, CheckCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import heroImage from "@/assets/hero-collaboration.jpg";

export const Hero = () => {
  const { t } = useLanguage();

  const highlights = [
    "Structuration selon norme ISO 21500",
    "Validation avant financement",
    "Accompagnement end-to-end",
    "Label qualité MIPROJET",
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-hero opacity-95" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-primary-foreground">
            <div className="inline-block">
              <span className="px-4 py-2 bg-accent/20 rounded-full text-accent font-semibold text-sm">
                {t('hero.badge')}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              {t('hero.title1')}{" "}
              <span className="text-accent">{t('hero.title2')}</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-primary-foreground/90 leading-relaxed max-w-xl">
              {t('hero.description')}
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-primary-foreground/90">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 py-6 sm:py-8">
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                  <span className="text-2xl sm:text-3xl font-bold">150+</span>
                </div>
                <p className="text-xs sm:text-sm text-primary-foreground/80">{t('hero.projectsFinanced')}</p>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                  <span className="text-2xl sm:text-3xl font-bold">2K+</span>
                </div>
                <p className="text-xs sm:text-sm text-primary-foreground/80">{t('hero.activeMembers')}</p>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                  <span className="text-2xl sm:text-3xl font-bold">92%</span>
                </div>
                <p className="text-xs sm:text-sm text-primary-foreground/80">{t('hero.successRate')}</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/submit-project">
                <Button size="lg" variant="premium" className="w-full sm:w-auto">
                  {t('hero.startProject')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/projects">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  {t('hero.discoverProjects')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-glow">
              <img
                src={heroImage}
                alt="Entrepreneurs africains collaborant sur MIPROJET"
                className="w-full h-auto object-cover"
                loading="eager"
              />
            </div>
            {/* Floating Cards */}
            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-elegant animate-fade-in">
              <p className="text-sm text-muted-foreground">Label Qualité</p>
              <p className="text-2xl font-bold text-success">Score A</p>
            </div>
            <div className="absolute -top-6 -right-6 bg-card p-4 rounded-xl shadow-elegant animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <p className="text-sm text-muted-foreground">Fonds mobilisés</p>
              <p className="text-2xl font-bold text-primary">850M+ FCFA</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
