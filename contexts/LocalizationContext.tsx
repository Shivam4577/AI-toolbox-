import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { translations, defaultLang, languages, Language } from '../utils/localization';

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
    const savedLang = localStorage.getItem('language') as Language;
    return savedLang && languages[savedLang] ? savedLang : defaultLang;
};

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string, replacements: { [key: string]: string | number } = {}) => {
    let translation = translations[language]?.[key] || translations[defaultLang][key] || key;
    
    Object.keys(replacements).forEach(placeholder => {
        const regex = new RegExp(`{{${placeholder}}}`, 'g');
        translation = translation.replace(regex, String(replacements[placeholder]));
    });

    return translation;
  };

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
