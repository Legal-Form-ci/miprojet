import { useState, useEffect } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/i18n/LanguageContext";

// Témoignages avec noms ivoiriens authentiques
const testimonials = [
  {
    id: 1,
    name: "Kouassi Yao Marcel",
    role: "Fondateur & CEO, AgriCapital CI",
    initials: "KYM",
    content: {
      fr: "MIPROJET a transformé notre vision agricole en réalité. Grâce à leur accompagnement professionnel et leur label qualité, AgriCapital a pu lever les fonds nécessaires pour développer notre réseau de coopératives agricoles en Côte d'Ivoire. Un partenariat stratégique qui a changé la donne.",
      en: "MIPROJET transformed our agricultural vision into reality. Thanks to their professional support and quality label, AgriCapital was able to raise the necessary funds to develop our network of agricultural cooperatives in Côte d'Ivoire.",
      ar: "حولت MIPROJET رؤيتنا الزراعية إلى واقع. بفضل دعمهم المهني وعلامة الجودة، تمكنت AgriCapital من جمع الأموال اللازمة لتطوير شبكة التعاونيات الزراعية.",
      zh: "MIPROJET将我们的农业愿景变为现实。感谢他们的专业支持和质量标签，AgriCapital能够筹集必要的资金来发展我们的农业合作社网络。",
      es: "MIPROJET transformó nuestra visión agrícola en realidad. Gracias a su apoyo profesional, AgriCapital pudo recaudar los fondos necesarios para desarrollar nuestra red de cooperativas agrícolas.",
      de: "MIPROJET hat unsere landwirtschaftliche Vision in die Realität umgesetzt. Dank ihrer professionellen Unterstützung konnte AgriCapital die notwendigen Mittel beschaffen.",
    },
    rating: 5,
    project: "AgriCapital - Coopératives Agricoles",
    funded: "75M FCFA",
    website: "www.agricapital.ci",
  },
  {
    id: 2,
    name: "Aminata Koné",
    role: "Directrice Générale, AgroTech Ivoire",
    initials: "AK",
    content: {
      fr: "La structuration ISO 21500 de notre projet par MIPROJET a été décisive. En 4 mois, nous avons obtenu notre financement et lancé notre ferme avicole moderne. L'équipe est compétente et à l'écoute.",
      en: "The ISO 21500 structuring of our project by MIPROJET was decisive. In 4 months, we obtained our funding and launched our modern poultry farm. The team is competent and attentive.",
      ar: "كانت هيكلة ISO 21500 لمشروعنا من قبل MIPROJET حاسمة. في 4 أشهر، حصلنا على تمويلنا وأطلقنا مزرعة الدواجن الحديثة.",
      zh: "MIPROJET对我们项目的ISO 21500结构化是决定性的。在4个月内，我们获得了资金并启动了现代化养禽场。",
      es: "La estructuración ISO 21500 de nuestro proyecto por MIPROJET fue decisiva. En 4 meses, obtuvimos nuestra financiación y lanzamos nuestra granja avícola moderna.",
      de: "Die ISO 21500-Strukturierung unseres Projekts durch MIPROJET war entscheidend. In 4 Monaten erhielten wir unsere Finanzierung.",
    },
    rating: 5,
    project: "Ferme Avicole Moderne",
    funded: "18M FCFA",
  },
  {
    id: 3,
    name: "Ouattara Ibrahim",
    role: "CEO, EduTech Abidjan",
    initials: "OI",
    content: {
      fr: "Le label MIPROJET a donné une crédibilité immédiate à notre projet d'école numérique. Les investisseurs ont eu confiance dès le départ. Nous avons formé plus de 500 jeunes depuis notre lancement.",
      en: "The MIPROJET label gave immediate credibility to our digital school project. Investors trusted us from the start. We have trained over 500 young people since our launch.",
      ar: "أعطت علامة MIPROJET مصداقية فورية لمشروع مدرستنا الرقمية. وثق المستثمرون بنا منذ البداية.",
      zh: "MIPROJET标签为我们的数字学校项目提供了即时可信度。投资者从一开始就信任我们。",
      es: "La etiqueta MIPROJET dio credibilidad inmediata a nuestro proyecto de escuela digital. Los inversores confiaron desde el principio.",
      de: "Das MIPROJET-Label verlieh unserem digitalen Schulprojekt sofortige Glaubwürdigkeit.",
    },
    rating: 5,
    project: "Centre de Formation Numérique",
    funded: "12M FCFA",
  },
  {
    id: 4,
    name: "Bamba Fatou",
    role: "Fondatrice, KaritéPlus",
    initials: "BF",
    content: {
      fr: "Mon projet de transformation du karité a été structuré de A à Z par MIPROJET. Aujourd'hui, notre coopérative emploie 120 femmes et exporte vers l'Europe. Merci pour cet accompagnement de qualité.",
      en: "My shea butter transformation project was structured from A to Z by MIPROJET. Today, our cooperative employs 120 women and exports to Europe. Thank you for this quality support.",
      ar: "تم هيكلة مشروعي لتحويل زبدة الشيا من الألف إلى الياء بواسطة MIPROJET. اليوم، توظف تعاونيتنا 120 امرأة وتصدر إلى أوروبا.",
      zh: "我的乳木果油转化项目由MIPROJET从头到尾进行了结构化。如今，我们的合作社雇用了120名妇女并出口到欧洲。",
      es: "Mi proyecto de transformación de karité fue estructurado de la A a la Z por MIPROJET. Hoy, nuestra cooperativa emplea a 120 mujeres y exporta a Europa.",
      de: "Mein Shea-Transformationsprojekt wurde von MIPROJET von A bis Z strukturiert. Heute beschäftigt unsere Genossenschaft 120 Frauen.",
    },
    rating: 5,
    project: "Coopérative KaritéPlus",
    funded: "25M FCFA",
  },
  {
    id: 5,
    name: "Diallo Mamadou",
    role: "Directeur Général, TransportCI",
    initials: "DM",
    content: {
      fr: "L'analyse des risques et le business plan fournis par MIPROJET ont convaincu nos partenaires bancaires. Notre flotte de transport compte maintenant 15 véhicules.",
      en: "The risk analysis and business plan provided by MIPROJET convinced our banking partners. Our transport fleet now has 15 vehicles.",
      ar: "أقنع تحليل المخاطر وخطة العمل التي قدمتها MIPROJET شركاءنا المصرفيين. أسطول النقل لدينا يضم الآن 15 مركبة.",
      zh: "MIPROJET提供的风险分析和商业计划书说服了我们的银行合作伙伴。我们的运输车队现在有15辆车。",
      es: "El análisis de riesgos y el plan de negocios proporcionados por MIPROJET convencieron a nuestros socios bancarios. Nuestra flota de transporte ahora tiene 15 vehículos.",
      de: "Die von MIPROJET bereitgestellte Risikoanalyse und der Geschäftsplan überzeugten unsere Bankpartner.",
    },
    rating: 5,
    project: "Flotte Transport Urbain",
    funded: "45M FCFA",
  },
  {
    id: 6,
    name: "Touré Mariam",
    role: "CEO, SantéPlus Clinique",
    initials: "TM",
    content: {
      fr: "Grâce à MIPROJET, notre clinique privée est devenue une référence en santé communautaire. La structuration professionnelle nous a permis d'accéder à des financements institutionnels.",
      en: "Thanks to MIPROJET, our private clinic has become a reference in community health. Professional structuring allowed us to access institutional funding.",
      ar: "بفضل MIPROJET، أصبحت عيادتنا الخاصة مرجعاً في الصحة المجتمعية.",
      zh: "感谢MIPROJET，我们的私人诊所已成为社区健康的参考。",
      es: "Gracias a MIPROJET, nuestra clínica privada se ha convertido en una referencia en salud comunitaria.",
      de: "Dank MIPROJET ist unsere Privatklinik zu einer Referenz in der Gemeindegesundheit geworden.",
    },
    rating: 5,
    project: "Clinique SantéPlus",
    funded: "85M FCFA",
  },
  {
    id: 7,
    name: "Koffi Serge",
    role: "Fondateur, TechLab CI",
    initials: "KS",
    content: {
      fr: "MIPROJET a compris notre vision tech et nous a aidés à la présenter aux investisseurs de manière professionnelle. Notre startup emploie maintenant 25 développeurs.",
      en: "MIPROJET understood our tech vision and helped us present it to investors professionally. Our startup now employs 25 developers.",
      ar: "فهمت MIPROJET رؤيتنا التقنية وساعدتنا في تقديمها للمستثمرين بشكل احترافي.",
      zh: "MIPROJET理解我们的技术愿景，并帮助我们以专业的方式向投资者展示。",
      es: "MIPROJET entendió nuestra visión tecnológica y nos ayudó a presentarla a los inversores de manera profesional.",
      de: "MIPROJET verstand unsere Tech-Vision und half uns, sie professionell den Investoren zu präsentieren.",
    },
    rating: 5,
    project: "Incubateur TechLab",
    funded: "35M FCFA",
  },
  {
    id: 8,
    name: "N'Guessan Ahou",
    role: "Directrice, ModeAfrik",
    initials: "NA",
    content: {
      fr: "De l'idée à la réalité en 6 mois. MIPROJET m'a connectée avec des investisseurs qui croyaient vraiment en la mode africaine. Nos créations sont maintenant vendues dans 8 pays.",
      en: "From idea to reality in 6 months. MIPROJET connected me with investors who truly believed in African fashion. Our creations are now sold in 8 countries.",
      ar: "من الفكرة إلى الواقع في 6 أشهر. ربطتني MIPROJET بمستثمرين يؤمنون حقاً بالموضة الأفريقية.",
      zh: "从想法到现实只用了6个月。MIPROJET将我与真正相信非洲时尚的投资者联系起来。",
      es: "De la idea a la realidad en 6 meses. MIPROJET me conectó con inversores que realmente creían en la moda africana.",
      de: "Von der Idee zur Realität in 6 Monaten. MIPROJET vernetzte mich mit Investoren, die wirklich an afrikanische Mode glaubten.",
    },
    rating: 5,
    project: "Marketplace Mode Africaine",
    funded: "15M FCFA",
  },
  {
    id: 9,
    name: "Coulibaly Drissa",
    role: "CEO, SolarCI",
    initials: "CD",
    content: {
      fr: "Le secteur de l'énergie solaire nécessite une approche professionnelle. MIPROJET nous a structurés selon les normes internationales, ce qui a facilité notre levée de fonds auprès de bailleurs internationaux.",
      en: "The solar energy sector requires a professional approach. MIPROJET structured us according to international standards, which facilitated our fundraising from international donors.",
      ar: "يتطلب قطاع الطاقة الشمسية نهجاً مهنياً. هيكلتنا MIPROJET وفقاً للمعايير الدولية.",
      zh: "太阳能行业需要专业的方法。MIPROJET按照国际标准对我们进行了结构化。",
      es: "El sector de energía solar requiere un enfoque profesional. MIPROJET nos estructuró según estándares internacionales.",
      de: "Der Solarenergiesektor erfordert einen professionellen Ansatz. MIPROJET strukturierte uns nach internationalen Standards.",
    },
    rating: 5,
    project: "Centrales Solaires Rurales",
    funded: "120M FCFA",
  },
  {
    id: 10,
    name: "Assouma Rokiatou",
    role: "Fondatrice, BioFood CI",
    initials: "AR",
    content: {
      fr: "L'accompagnement MIPROJET va au-delà du financement. Ils nous ont aidés à structurer notre chaîne de production bio et à obtenir les certifications nécessaires. Un vrai partenaire de croissance.",
      en: "MIPROJET support goes beyond funding. They helped us structure our organic production chain and obtain the necessary certifications. A true growth partner.",
      ar: "يتجاوز دعم MIPROJET التمويل. ساعدونا في هيكلة سلسلة الإنتاج العضوي والحصول على الشهادات اللازمة.",
      zh: "MIPROJET的支持超越了资金。他们帮助我们构建了有机生产链并获得了必要的认证。",
      es: "El apoyo de MIPROJET va más allá del financiamiento. Nos ayudaron a estructurar nuestra cadena de producción orgánica.",
      de: "Die Unterstützung von MIPROJET geht über die Finanzierung hinaus. Sie halfen uns, unsere Bio-Produktionskette zu strukturieren.",
    },
    rating: 5,
    project: "Transformation Agroalimentaire Bio",
    funded: "28M FCFA",
  },
];

// Couleurs pour les avatars (basées sur l'initiale)
const avatarColors = [
  'bg-primary text-primary-foreground',
  'bg-success text-white',
  'bg-accent text-accent-foreground',
  'bg-warning text-white',
  'bg-destructive text-white',
];

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];
  const content = currentTestimonial.content[language as keyof typeof currentTestimonial.content] || currentTestimonial.content.fr;
  const avatarColor = avatarColors[currentIndex % avatarColors.length];

  const labels = {
    fr: { badge: 'Témoignages', title: 'Ils ont réussi avec MIPROJET', subtitle: 'Découvrez les histoires de succès de nos porteurs de projets', raised: 'levés' },
    en: { badge: 'Testimonials', title: 'They succeeded with MIPROJET', subtitle: 'Discover the success stories of our project holders', raised: 'raised' },
    ar: { badge: 'الشهادات', title: 'نجحوا مع MIPROJET', subtitle: 'اكتشف قصص نجاح حاملي مشاريعنا', raised: 'جمعت' },
    zh: { badge: '推荐', title: '他们与MIPROJET一起成功', subtitle: '发现我们项目持有者的成功故事', raised: '筹集' },
    es: { badge: 'Testimonios', title: 'Tuvieron éxito con MIPROJET', subtitle: 'Descubre las historias de éxito de nuestros portadores de proyectos', raised: 'recaudados' },
    de: { badge: 'Referenzen', title: 'Sie haben mit MIPROJET Erfolg gehabt', subtitle: 'Entdecken Sie die Erfolgsgeschichten unserer Projektträger', raised: 'gesammelt' },
  };

  const t = labels[language as keyof typeof labels] || labels.fr;

  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <span className="inline-block px-4 py-2 bg-success/10 rounded-full text-success font-semibold text-sm mb-4">
            {t.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t.title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-border/50 shadow-elegant hover:shadow-glow transition-all duration-500">
            <CardContent className="p-6 md:p-8 lg:p-12">
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 md:-top-4 md:-left-4 h-12 w-12 md:h-16 md:w-16 text-primary/10" />
                
                <div className="space-y-6 animate-fade-in" key={currentIndex}>
                  <div className="flex items-center gap-1">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 md:h-5 md:w-5 fill-accent text-accent animate-scale-in" style={{ animationDelay: `${i * 100}ms` }} />
                    ))}
                  </div>

                  <p className="text-lg md:text-xl lg:text-2xl text-foreground leading-relaxed italic">
                    "{content}"
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className={`h-12 w-12 md:h-14 md:w-14 border-2 border-primary ring-2 ring-primary/20 ${avatarColor}`}>
                        <AvatarFallback className={avatarColor}>
                          {currentTestimonial.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-foreground">{currentTestimonial.name}</p>
                        <p className="text-muted-foreground text-sm">{currentTestimonial.role}</p>
                        {currentTestimonial.website && (
                          <a 
                            href={`https://${currentTestimonial.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary text-sm hover:underline"
                          >
                            {currentTestimonial.website}
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-sm text-muted-foreground">{currentTestimonial.project}</p>
                      <p className="font-bold text-success text-lg">{currentTestimonial.funded} {t.raised}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button variant="outline" size="icon" onClick={prevTestimonial} className="hover:bg-primary hover:text-primary-foreground transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-2 flex-wrap justify-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => { setIsAutoPlaying(false); setCurrentIndex(index); }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-primary w-6" : "bg-muted hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Voir témoignage ${index + 1}`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={nextTestimonial} className="hover:bg-primary hover:text-primary-foreground transition-colors">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
