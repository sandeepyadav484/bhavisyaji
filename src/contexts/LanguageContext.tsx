import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from '../i18n';

interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
  loading: false,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(i18n.language || 'en');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && savedLang !== language) {
      setLanguageState(savedLang);
      i18n.changeLanguage(savedLang);
    }
  }, []);

  const setLanguage = (lang: string) => {
    setLoading(true);
    i18n.changeLanguage(lang).then(() => {
      setLanguageState(lang);
      localStorage.setItem('language', lang);
      setLoading(false);
    });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext); 