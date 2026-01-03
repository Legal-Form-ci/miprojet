import { useState, useEffect } from "react";
import { Quote, Star, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/i18n/LanguageContext";
import logoAgricapital from "@/assets/logo-agricapital.jpg";

// Témoignages avec projets réalistes d'Afrique de l'Ouest portés par la jeunesse
const testimonials = [
  {
    id: 1,
    name: "Inocent KOFFI",
    role: {
      fr: "Fondateur & CEO, AgriCapital SARL",
      en: "Founder & CEO, AgriCapital SARL",
      ar: "المؤسس والرئيس التنفيذي، AgriCapital SARL",
      zh: "创始人兼首席执行官，AgriCapital SARL",
      es: "Fundador y CEO, AgriCapital SARL",
      de: "Gründer & CEO, AgriCapital SARL",
    },
    initials: "IK",
    logo: logoAgricapital,
    content: {
      fr: "MIPROJET a été un partenaire déterminant dans la structuration de notre modèle d'accompagnement agricole. Grâce à leur expertise en structuration ISO 21500, AgriCapital a pu consolider son offre de support aux producteurs de palmiers à huile en Côte d'Ivoire. Après 12 ans d'immersion sur le terrain, cette structuration professionnelle nous a permis de présenter un dossier solide aux investisseurs.",
      en: "MIPROJET was a decisive partner in structuring our agricultural support model. Thanks to their ISO 21500 structuring expertise, AgriCapital was able to consolidate its support offer for oil palm producers in Côte d'Ivoire. After 12 years of field immersion, this professional structuring allowed us to present a solid file to investors.",
      ar: "كانت MIPROJET شريكاً حاسماً في هيكلة نموذج الدعم الزراعي لدينا. بفضل خبرتهم في هيكلة ISO 21500، تمكنت AgriCapital من تعزيز عرض الدعم لمنتجي نخيل الزيت في كوت ديفوار.",
      zh: "MIPROJET在构建我们的农业支持模式方面是一个决定性的合作伙伴。凭借他们的ISO 21500结构化专业知识，AgriCapital能够为科特迪瓦的油棕生产商巩固其支持服务。",
      es: "MIPROJET fue un socio decisivo en la estructuración de nuestro modelo de apoyo agrícola. Gracias a su experiencia en estructuración ISO 21500, AgriCapital pudo consolidar su oferta de apoyo a los productores de palma aceitera en Costa de Marfil.",
      de: "MIPROJET war ein entscheidender Partner bei der Strukturierung unseres landwirtschaftlichen Unterstützungsmodells. Dank ihrer ISO 21500-Strukturierungsexpertise konnte AgriCapital sein Unterstützungsangebot für Ölpalmenproduzenten in der Elfenbeinküste konsolidieren.",
    },
    rating: 5,
    project: {
      fr: "Accompagnement producteurs agricoles",
      en: "Agricultural producers support",
      ar: "دعم المنتجين الزراعيين",
      zh: "农业生产者支持",
      es: "Apoyo a productores agrícolas",
      de: "Unterstützung landwirtschaftlicher Produzenten",
    },
    funded: "85M FCFA",
    website: "www.agricapital.ci",
  },
  {
    id: 2,
    name: "Aminata Diallo",
    role: {
      fr: "Directrice Générale, TechFem Abidjan",
      en: "General Manager, TechFem Abidjan",
      ar: "المديرة العامة، TechFem أبيدجان",
      zh: "总经理，TechFem阿比让",
      es: "Directora General, TechFem Abiyán",
      de: "Geschäftsführerin, TechFem Abidjan",
    },
    initials: "AD",
    content: {
      fr: "Notre centre de formation numérique pour femmes a été structuré par MIPROJET avec un professionnalisme remarquable. En 6 mois, nous avons obtenu une subvention de la BAD et formé 200 jeunes femmes au codage. Le label qualité MIPROJET a été décisif pour les bailleurs.",
      en: "Our digital training center for women was structured by MIPROJET with remarkable professionalism. In 6 months, we obtained a grant from the AfDB and trained 200 young women in coding. The MIPROJET quality label was decisive for the donors.",
      ar: "تم هيكلة مركز التدريب الرقمي للنساء لدينا من قبل MIPROJET باحترافية ملحوظة. في 6 أشهر، حصلنا على منحة من بنك التنمية الأفريقي ودربنا 200 شابة على البرمجة.",
      zh: "我们的女性数字培训中心由MIPROJET以卓越的专业精神进行了结构化。在6个月内，我们获得了非洲开发银行的资助，并培训了200名年轻女性编程。",
      es: "Nuestro centro de formación digital para mujeres fue estructurado por MIPROJET con un profesionalismo notable. En 6 meses, obtuvimos una subvención del BAD y formamos a 200 jóvenes mujeres en programación.",
      de: "Unser digitales Ausbildungszentrum für Frauen wurde von MIPROJET mit bemerkenswerter Professionalität strukturiert. In 6 Monaten erhielten wir einen Zuschuss der AfDB und schulten 200 junge Frauen im Programmieren.",
    },
    rating: 5,
    project: {
      fr: "Formation numérique pour femmes",
      en: "Digital training for women",
      ar: "التدريب الرقمي للنساء",
      zh: "女性数字培训",
      es: "Formación digital para mujeres",
      de: "Digitale Ausbildung für Frauen",
    },
    funded: "45M FCFA",
  },
  {
    id: 3,
    name: "Oumar Konaté",
    role: {
      fr: "Fondateur, AgroSolaire Mali",
      en: "Founder, AgroSolaire Mali",
      ar: "المؤسس، AgroSolaire مالي",
      zh: "创始人，AgroSolaire马里",
      es: "Fundador, AgroSolaire Malí",
      de: "Gründer, AgroSolaire Mali",
    },
    initials: "OK",
    content: {
      fr: "À 28 ans, j'ai pu structurer mon projet d'irrigation solaire grâce à MIPROJET. Leur méthodologie ISO 21500 nous a permis de convaincre un fonds d'investissement à impact. Aujourd'hui, nous irriguons 150 hectares et soutenons 80 familles d'agriculteurs au Mali.",
      en: "At 28, I was able to structure my solar irrigation project thanks to MIPROJET. Their ISO 21500 methodology allowed us to convince an impact investment fund. Today, we irrigate 150 hectares and support 80 farming families in Mali.",
      ar: "في سن 28، تمكنت من هيكلة مشروعي للري بالطاقة الشمسية بفضل MIPROJET. سمحت لنا منهجيتهم ISO 21500 بإقناع صندوق استثمار ذي تأثير.",
      zh: "28岁时，我能够通过MIPROJET构建我的太阳能灌溉项目。他们的ISO 21500方法论使我们能够说服一个影响力投资基金。",
      es: "A los 28 años, pude estructurar mi proyecto de irrigación solar gracias a MIPROJET. Su metodología ISO 21500 nos permitió convencer a un fondo de inversión de impacto.",
      de: "Mit 28 Jahren konnte ich mein Solarbewässerungsprojekt dank MIPROJET strukturieren. Ihre ISO 21500-Methodik ermöglichte es uns, einen Impact-Investmentfonds zu überzeugen.",
    },
    rating: 5,
    project: {
      fr: "Irrigation solaire agricole",
      en: "Agricultural solar irrigation",
      ar: "الري الشمسي الزراعي",
      zh: "农业太阳能灌溉",
      es: "Irrigación solar agrícola",
      de: "Landwirtschaftliche Solarbewässerung",
    },
    funded: "120M FCFA",
  },
  {
    id: 4,
    name: "Fatou Sow",
    role: {
      fr: "CEO, KaritéGold Sénégal",
      en: "CEO, KaritéGold Senegal",
      ar: "الرئيسة التنفيذية، KaritéGold السنغال",
      zh: "首席执行官，KaritéGold塞内加尔",
      es: "CEO, KaritéGold Senegal",
      de: "CEO, KaritéGold Senegal",
    },
    initials: "FS",
    content: {
      fr: "MIPROJET a structuré notre coopérative de transformation du karité de A à Z. Grâce à leur accompagnement, nous employons maintenant 150 femmes et exportons vers 5 pays européens. La structuration professionnelle a été la clé de notre crédibilité.",
      en: "MIPROJET structured our shea butter transformation cooperative from A to Z. Thanks to their support, we now employ 150 women and export to 5 European countries. Professional structuring was the key to our credibility.",
      ar: "قامت MIPROJET بهيكلة تعاونيتنا لتحويل زبدة الشيا من الألف إلى الياء. بفضل دعمهم، نوظف الآن 150 امرأة ونصدر إلى 5 دول أوروبية.",
      zh: "MIPROJET从头到尾构建了我们的乳木果油转化合作社。感谢他们的支持，我们现在雇用150名女性并出口到5个欧洲国家。",
      es: "MIPROJET estructuró nuestra cooperativa de transformación de karité de la A a la Z. Gracias a su apoyo, ahora empleamos a 150 mujeres y exportamos a 5 países europeos.",
      de: "MIPROJET hat unsere Shea-Transformationsgenossenschaft von A bis Z strukturiert. Dank ihrer Unterstützung beschäftigen wir jetzt 150 Frauen und exportieren in 5 europäische Länder.",
    },
    rating: 5,
    project: {
      fr: "Coopérative transformation karité",
      en: "Shea butter transformation cooperative",
      ar: "تعاونية تحويل زبدة الشيا",
      zh: "乳木果油转化合作社",
      es: "Cooperativa transformación karité",
      de: "Shea-Transformationsgenossenschaft",
    },
    funded: "65M FCFA",
  },
  {
    id: 5,
    name: "Yao Kouamé",
    role: {
      fr: "Fondateur, MobiHealth CI",
      en: "Founder, MobiHealth CI",
      ar: "المؤسس، MobiHealth CI",
      zh: "创始人，MobiHealth CI",
      es: "Fundador, MobiHealth CI",
      de: "Gründer, MobiHealth CI",
    },
    initials: "YK",
    content: {
      fr: "Notre application de télémédecine rurale a été structurée par MIPROJET en 4 mois. Le business plan et l'analyse de risques ont convaincu nos investisseurs. À 26 ans, nous connectons maintenant 50 villages à des médecins qualifiés.",
      en: "Our rural telemedicine app was structured by MIPROJET in 4 months. The business plan and risk analysis convinced our investors. At 26, we now connect 50 villages to qualified doctors.",
      ar: "تم هيكلة تطبيقنا للطب عن بعد الريفي من قبل MIPROJET في 4 أشهر. أقنع خطة العمل وتحليل المخاطر مستثمرينا.",
      zh: "我们的农村远程医疗应用程序在4个月内由MIPROJET进行了结构化。商业计划和风险分析说服了我们的投资者。",
      es: "Nuestra aplicación de telemedicina rural fue estructurada por MIPROJET en 4 meses. El plan de negocios y análisis de riesgos convencieron a nuestros inversores.",
      de: "Unsere ländliche Telemedizin-App wurde von MIPROJET in 4 Monaten strukturiert. Der Businessplan und die Risikoanalyse überzeugten unsere Investoren.",
    },
    rating: 5,
    project: {
      fr: "Télémédecine rurale",
      en: "Rural telemedicine",
      ar: "الطب عن بعد الريفي",
      zh: "农村远程医疗",
      es: "Telemedicina rural",
      de: "Ländliche Telemedizin",
    },
    funded: "35M FCFA",
  },
  {
    id: 6,
    name: "Mariama Bah",
    role: {
      fr: "Directrice, EcoPlast Guinée",
      en: "Director, EcoPlast Guinea",
      ar: "المديرة، EcoPlast غينيا",
      zh: "总监，EcoPlast几内亚",
      es: "Directora, EcoPlast Guinea",
      de: "Direktorin, EcoPlast Guinea",
    },
    initials: "MB",
    content: {
      fr: "Notre usine de recyclage plastique a bénéficié d'une structuration exemplaire par MIPROJET. Le label qualité a été déterminant pour obtenir le financement d'un bailleur international. Nous recyclons maintenant 500 tonnes de plastique par an à Conakry.",
      en: "Our plastic recycling plant benefited from exemplary structuring by MIPROJET. The quality label was decisive in obtaining funding from an international donor. We now recycle 500 tons of plastic per year in Conakry.",
      ar: "استفاد مصنعنا لإعادة تدوير البلاستيك من هيكلة نموذجية من MIPROJET. كانت علامة الجودة حاسمة للحصول على تمويل من مانح دولي.",
      zh: "我们的塑料回收厂受益于MIPROJET的示范性结构化。质量标签对于获得国际捐助者的资金至关重要。",
      es: "Nuestra planta de reciclaje de plástico se benefició de una estructuración ejemplar por MIPROJET. El sello de calidad fue decisivo para obtener financiamiento de un donante internacional.",
      de: "Unsere Kunststoffrecyclinganlage profitierte von einer vorbildlichen Strukturierung durch MIPROJET. Das Qualitätslabel war entscheidend für die Finanzierung durch einen internationalen Geber.",
    },
    rating: 5,
    project: {
      fr: "Recyclage plastique urbain",
      en: "Urban plastic recycling",
      ar: "إعادة تدوير البلاستيك الحضري",
      zh: "城市塑料回收",
      es: "Reciclaje plástico urbano",
      de: "Städtisches Kunststoffrecycling",
    },
    funded: "95M FCFA",
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
    }, 6000);
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
  const role = typeof currentTestimonial.role === 'string' 
    ? currentTestimonial.role 
    : (currentTestimonial.role[language as keyof typeof currentTestimonial.role] || currentTestimonial.role.fr);
  const project = typeof currentTestimonial.project === 'string'
    ? currentTestimonial.project
    : (currentTestimonial.project[language as keyof typeof currentTestimonial.project] || currentTestimonial.project.fr);
  const avatarColor = avatarColors[currentIndex % avatarColors.length];

  const labels = {
    fr: { badge: 'Témoignages', title: 'Ils ont réussi avec MIPROJET', subtitle: 'Découvrez les histoires de succès de nos porteurs de projets structurés', raised: 'obtenus après structuration' },
    en: { badge: 'Testimonials', title: 'They succeeded with MIPROJET', subtitle: 'Discover the success stories of our structured project holders', raised: 'obtained after structuring' },
    ar: { badge: 'الشهادات', title: 'نجحوا مع MIPROJET', subtitle: 'اكتشف قصص نجاح حاملي مشاريعنا المهيكلة', raised: 'تم الحصول عليها بعد الهيكلة' },
    zh: { badge: '推荐', title: '他们与MIPROJET一起成功', subtitle: '发现我们结构化项目持有者的成功故事', raised: '结构化后获得' },
    es: { badge: 'Testimonios', title: 'Tuvieron éxito con MIPROJET', subtitle: 'Descubre las historias de éxito de nuestros portadores de proyectos estructurados', raised: 'obtenidos después de estructuración' },
    de: { badge: 'Referenzen', title: 'Sie haben mit MIPROJET Erfolg gehabt', subtitle: 'Entdecken Sie die Erfolgsgeschichten unserer strukturierten Projektträger', raised: 'nach Strukturierung erhalten' },
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
                      <Avatar className={`h-14 w-14 md:h-16 md:w-16 border-2 border-primary ring-2 ring-primary/20 ${!currentTestimonial.logo ? avatarColor : ''}`}>
                        {currentTestimonial.logo ? (
                          <AvatarImage src={currentTestimonial.logo} alt={currentTestimonial.name} className="object-contain bg-white p-1" />
                        ) : (
                          <AvatarFallback className={avatarColor}>
                            {currentTestimonial.initials}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-bold text-foreground">{currentTestimonial.name}</p>
                        <p className="text-muted-foreground text-sm">{role}</p>
                        {currentTestimonial.website && (
                          <a 
                            href={`https://${currentTestimonial.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary text-sm hover:underline inline-flex items-center gap-1"
                          >
                            {currentTestimonial.website}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="text-left sm:text-right bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">{project}</p>
                      <p className="font-bold text-success text-lg">{currentTestimonial.funded}</p>
                      <p className="text-xs text-muted-foreground">{t.raised}</p>
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
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? "bg-primary w-8" 
                      : "bg-border hover:bg-primary/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
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
