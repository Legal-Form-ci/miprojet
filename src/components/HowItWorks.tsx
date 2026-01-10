import { FileText, CheckCircle, TrendingUp, Handshake, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/i18n/LanguageContext";

const steps = [
  {
    number: 1,
    icon: FileText,
    titleKey: "howItWorks.step1.title",
    descriptionKey: "howItWorks.step1.description",
    color: "text-primary",
  },
  {
    number: 2,
    icon: CheckCircle,
    titleKey: "howItWorks.step2.title",
    descriptionKey: "howItWorks.step2.description",
    color: "text-info",
  },
  {
    number: 3,
    icon: TrendingUp,
    titleKey: "howItWorks.step3.title",
    descriptionKey: "howItWorks.step3.description",
    color: "text-success",
  },
  {
    number: 4,
    icon: Award,
    titleKey: "howItWorks.step4.title",
    descriptionKey: "howItWorks.step4.description",
    color: "text-warning",
  },
  {
    number: 5,
    icon: Handshake,
    titleKey: "howItWorks.step5.title",
    descriptionKey: "howItWorks.step5.description",
    color: "text-secondary",
  },
];

export const HowItWorks = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            {t('howItWorks.title')}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <Card
              key={step.number}
              className="relative group hover:shadow-glow transition-all duration-300 hover:-translate-y-2"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg bg-gradient-primary ${step.color}`}>
                    <step.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-4xl font-bold text-muted/20">
                    {step.number}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(step.descriptionKey)}
                  </p>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-primary" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 p-8 bg-primary/5 border border-primary/20 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-primary rounded-lg flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                {t('howItWorks.label.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('howItWorks.label.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
