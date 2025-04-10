import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import your translation files directly (alternative to backend)
import enTranslation from "./locales/i18n/en/translation.json";
import frTranslation from "./locales/i18n/fr/translation.json";

i18n
  // Use backend if you want to load translations over HTTP
  // Detect user language
  .use(LanguageDetector)
  // React integration
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      fr: {
        translation: frTranslation,
      },
    },
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
  });

export default i18n;
