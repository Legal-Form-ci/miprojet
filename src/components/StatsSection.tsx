import { useEffect, useState, useRef } from "react";
import { TrendingUp, Users, Globe, Award, Building, Briefcase } from "lucide-react";

const stats = [
  { icon: TrendingUp, value: 500, suffix: "+", label: "Projets structurés", color: "text-primary" },
  { icon: Users, value: 5000, suffix: "+", label: "Membres actifs", color: "text-secondary" },
  { icon: Globe, value: 12, suffix: "", label: "Pays couverts", color: "text-accent" },
  { icon: Award, value: 95, suffix: "%", label: "Taux de succès", color: "text-success" },
  { icon: Building, value: 150, suffix: "+", label: "Partenaires", color: "text-info" },
  { icon: Briefcase, value: 2, suffix: "Mds FCFA", label: "Fonds mobilisés", color: "text-warning" },
];

const useCountUp = (end: number, duration: number = 2000, start: boolean = false) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!start) return;
    
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, start]);
  
  return count;
};

const StatCard = ({ stat, index, isVisible }: { stat: typeof stats[0]; index: number; isVisible: boolean }) => {
  const count = useCountUp(stat.value, 2000, isVisible);
  
  return (
    <div 
      className="text-center p-6 rounded-2xl bg-card border border-border/50 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-muted mb-4`}>
        <stat.icon className={`h-7 w-7 ${stat.color}`} />
      </div>
      <div className="space-y-1">
        <p className={`text-4xl font-bold ${stat.color}`}>
          {count}{stat.suffix}
        </p>
        <p className="text-muted-foreground font-medium">{stat.label}</p>
      </div>
    </div>
  );
};

export const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            MIPROJET en Chiffres
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Des résultats concrets qui témoignent de notre engagement envers l'entrepreneuriat africain
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
};
