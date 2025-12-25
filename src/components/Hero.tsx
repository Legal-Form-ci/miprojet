import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, Shield, CheckCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import heroImage from "@/assets/hero-collaboration.jpg";

export const Hero = () => {
  const { t } = useLanguage();

  const highlights = [
    t('hero.highlight1'),
    t('hero.highlight2'),
    t('hero.highlight3'),
    t('hero.highlight4'),
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-12 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-hero opacity-95" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 text-primary-foreground text-center lg:text-left">
            {/* Title - New from PDF */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="block">{t('hero.titleLine1')}</span>
                <span className="text-accent block mt-1">{t('hero.titleLine2')}</span>
              </h1>
            </div>
            
            <p className="text-sm sm:text-base md:text-lg text-primary-foreground/90 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {t('hero.description')}
            </p>

            {/* Highlights - responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-w-xl mx-auto lg:mx-0">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-primary-foreground/90 justify-center lg:justify-start">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0" />
                  <span className="text-xs sm:text-sm">{item}</span>
                </div>
              ))}
            </div>

            {/* Stats - responsive */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 py-4 sm:py-6">
              <div className="space-y-1">
                <div className="flex items-center gap-1 sm:gap-2 justify-center lg:justify-start">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold">500+</span>
                </div>
                <p className="text-[10px] sm:text-xs md:text-sm text-primary-foreground/80">{t('hero.projectsStructured')}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 sm:gap-2 justify-center lg:justify-start">
                  <Users className="h-4 w-4 text-accent" />
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold">5K+</span>
                </div>
                <p className="text-[10px] sm:text-xs md:text-sm text-primary-foreground/80">{t('hero.activeMembers')}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 sm:gap-2 justify-center lg:justify-start">
                  <Shield className="h-4 w-4 text-accent" />
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold">12</span>
                </div>
                <p className="text-[10px] sm:text-xs md:text-sm text-primary-foreground/80">{t('hero.countriesCovered')}</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link to="/submit-project" className="w-full sm:w-auto">
                <Button size="lg" variant="premium" className="w-full">
                  {t('hero.submitProject')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/projects" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
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
              <p className="text-sm text-muted-foreground">{t('hero.qualityLabel')}</p>
              <p className="text-2xl font-bold text-success">Score A</p>
            </div>
            <div className="absolute -top-6 -right-6 bg-card p-4 rounded-xl shadow-elegant animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <p className="text-sm text-muted-foreground">{t('hero.projectsAccompanied')}</p>
              <p className="text-2xl font-bold text-primary">2 Mds+ FCFA</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
