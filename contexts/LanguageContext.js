"use client";

import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load translations with improved error handling
  const loadTranslations = async (lang) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/locales/${lang}.json`);

      if (!response.ok) {
        throw new Error(`Failed to load ${lang} translations`);
      }

      const data = await response.json();
      setTranslations(data);
    } catch (err) {
      console.error("Translation loading error:", err);
      setError(err);

      // Fallback to English if loading fails and requested language isn't English
      if (lang !== "en") {
        try {
          const fallbackResponse = await fetch("/locales/en.json");
          const fallbackData = await fallbackResponse.json();
          setTranslations(fallbackData);
        } catch (fallbackErr) {
          console.error("Failed to load fallback translations:", fallbackErr);
          setTranslations({}); // Set empty translations as final fallback
        }
      } else {
        setTranslations({}); // Set empty translations if English fails too
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize language
  useEffect(() => {
    const initializeLanguage = async () => {
      const savedLanguage = localStorage.getItem("language") || "en";
      setLanguage(savedLanguage);
      await loadTranslations(savedLanguage);
    };

    initializeLanguage();
  }, []);

  // Update document attributes when language changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = language;
    }
  }, [language]);

  const changeLanguage = async (newLanguage) => {
    if (newLanguage !== language) {
      await loadTranslations(newLanguage);
      setLanguage(newLanguage);
      localStorage.setItem("language", newLanguage);
    }
  };

  // Enhanced translation function
  const t = (key, fallback = "") => {
    if (!translations) return fallback || key;

    try {
      const keys = key.split(".");
      let value = translations;

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          return fallback || key;
        }
      }

      // Handle arrays and strings
      if (Array.isArray(value)) {
        return value.length > 0 ? value : fallback || [];
      }
      return value || fallback || key;
    } catch (err) {
      console.error("Translation error:", err);
      return fallback || key;
    }
  };

  const value = {
    language,
    changeLanguage,
    t,
    translations,
    isRTL: language === "ar",
    isLoading,
    error,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
