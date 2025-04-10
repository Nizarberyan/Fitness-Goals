import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex justify-center space-x-4">
      <button
        onClick={() => changeLanguage("en")}
        className={`px-3 py-1 rounded ${i18n.language === "en" ? "bg-green-500 text-white" : "bg-gray-200"}`}
      >
        English
      </button>
      <button
        onClick={() => changeLanguage("fr")}
        className={`px-3 py-1 rounded ${i18n.language === "fr" ? "bg-green-500 text-white" : "bg-gray-200"}`}
      >
        Français
      </button>
    </div>
  );
};

export default LanguageSwitcher;
