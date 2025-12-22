import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, languageNames } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languageNames: Record<Language, string>;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Detect browser language and map to supported languages
const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language || (navigator as any).userLanguage || 'fr';
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  const languageMap: Record<string, Language> = {
    'fr': 'fr',
    'en': 'en',
    'ar': 'ar',
    'zh': 'zh',
    'es': 'es',
    'de': 'de',
  };
  
  return languageMap[langCode] || 'fr';
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('miprojet-language');
    if (saved && ['fr', 'en', 'ar', 'zh', 'es', 'de'].includes(saved)) {
      return saved as Language;
    }
    // Auto-detect browser language if no saved preference
    return detectBrowserLanguage();
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem('miprojet-language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    
    // Update meta tags for SEO
    updateMetaTags(language);
  }, [language, isRTL]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['fr']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languageNames, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Update meta tags based on language
const updateMetaTags = (lang: Language) => {
  const metaDescriptions: Record<Language, string> = {
    fr: "La seule plateforme qui structure vos projets AVANT de les financer. Validation professionnelle, financement participatif sécurisé et accompagnement jusqu'au succès en Afrique.",
    en: "The only platform that structures your projects BEFORE funding them. Professional validation, secure crowdfunding, and complete support for success in Africa.",
    ar: "المنصة الوحيدة التي تهيكل مشاريعك قبل تمويلها. التحقق المهني، التمويل الجماعي الآمن، والدعم الكامل للنجاح في أفريقيا.",
    zh: "唯一在融资前构建项目的平台。专业验证、安全众筹和非洲成功的全面支持。",
    es: "La única plataforma que estructura tus proyectos ANTES de financiarlos. Validación profesional, crowdfunding seguro y acompañamiento completo para el éxito en África.",
    de: "Die einzige Plattform, die Ihre Projekte VOR der Finanzierung strukturiert. Professionelle Validierung, sicheres Crowdfunding und vollständige Unterstützung für den Erfolg in Afrika.",
  };

  const metaTitles: Record<Language, string> = {
    fr: "MIPROJET - Structurez, Financez, Réussissez | Plateforme Panafricaine",
    en: "MIPROJET - Structure, Fund, Succeed | Pan-African Platform",
    ar: "MIPROJET - هيكل، مول، نجح | منصة أفريقية",
    zh: "MIPROJET - 构建、融资、成功 | 泛非平台",
    es: "MIPROJET - Estructura, Financia, Triunfa | Plataforma Panafricana",
    de: "MIPROJET - Strukturieren, Finanzieren, Erfolg | Panafrikanische Plattform",
  };

  // Update document title
  const currentPath = window.location.pathname;
  if (currentPath === '/' || currentPath === '') {
    document.title = metaTitles[lang];
  }

  // Update meta description
  let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  if (currentPath === '/' || currentPath === '') {
    metaDesc.content = metaDescriptions[lang];
  }

  // Update OG tags
  let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
  if (ogTitle) {
    ogTitle.content = metaTitles[lang];
  }

  let ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
  if (ogDesc) {
    ogDesc.content = metaDescriptions[lang];
  }

  // Add hreflang tags for SEO
  const existingHreflangs = document.querySelectorAll('link[rel="alternate"][hreflang]');
  existingHreflangs.forEach(el => el.remove());

  const languages: Language[] = ['fr', 'en', 'ar', 'zh', 'es', 'de'];
  languages.forEach(l => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = l;
    link.href = `${window.location.origin}${currentPath}?lang=${l}`;
    document.head.appendChild(link);
  });

  // Add x-default
  const defaultLink = document.createElement('link');
  defaultLink.rel = 'alternate';
  defaultLink.hreflang = 'x-default';
  defaultLink.href = `${window.location.origin}${currentPath}`;
  document.head.appendChild(defaultLink);
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
