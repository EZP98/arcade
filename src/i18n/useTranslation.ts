import { useLanguage } from './LanguageContext';
import { translations, TranslationKey } from './translations';

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: TranslationKey): any => {
    return translations[language][key];
  };

  return { t, language };
}
