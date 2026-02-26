import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ru from "./locales/ru.json";
import pl from "./locales/pl.json";
import by from "./locales/by.json";
import lt from "./locales/lt.json";
import en from "./locales/en.json";

const resources = {
  ru: { app: ru },
  pl: { app: pl },
  by: { app: by },
  lt: { app: lt },
  en: { app: en },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ru",
  fallbackLng: "en",
  defaultNS: "app",
  interpolation: { escapeValue: false },
});

export default i18n;
