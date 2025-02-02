import { en } from '../translations/en';

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<typeof en>;

let currentLanguage = 'en';
const translations: { [key: string]: typeof en } = {
  en,
};

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
  } else {
    console.warn(`Language ${lang} not loaded`);
  }
}; 