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

export function t(key: string, params: Record<string, string | number> = {}): string {
  const keys = key.split('.');
  let value = keys.reduce<Record<string, unknown>>((obj, key) => 
    obj && typeof obj === 'object' ? obj[key] as Record<string, unknown> : undefined, 
    translations[currentLanguage]
  );

  if (typeof value !== 'string') {
    console.warn(`Translation missing for key: ${key}`);
    return key;
  }

  if (params) {
    Object.entries(params).forEach(([param, replacement]) => {
      value = value.replace(`{{${param}}}`, replacement.toString());
    });
  }

  return value;
}

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
