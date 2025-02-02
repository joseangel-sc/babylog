import { en } from '../translations/en';
import { es } from '../translations/es';

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<typeof en>;

const isBrowser = typeof window !== 'undefined';

let currentLanguage = 'en';
if (isBrowser) {
  currentLanguage = localStorage.getItem('language') || 'en';
}

const translations: { [key: string]: typeof en } = {
  en,
  es,
};

export const getCurrentLanguage = () => currentLanguage;

export const t = (key: TranslationKey, params?: Record<string, string>): string => {
  const keys = key.split('.');
  let value = keys.reduce((obj, key) => obj?.[key], translations[currentLanguage] as any);

  if (typeof value !== 'string') {
    console.warn(`Translation missing for key: ${key}`);
    return key;
  }

  if (params) {
    Object.entries(params).forEach(([param, replacement]) => {
      value = value.replace(`{{${param}}}`, replacement);
    });
  }

  return value;
};

export const setLanguage = (lang: string) => {
  if (translations[lang]) {
    currentLanguage = lang;
    if (isBrowser) {
      localStorage.setItem('language', lang);
    }
  } else {
    console.warn(`Language ${lang} not loaded`);
  }
}; 