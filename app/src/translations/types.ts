import { en } from './en';

export type TranslationKeys = typeof en;
export type NestedKeys<T> = T extends string
  ? []
  : {
      [K in keyof T]: [K, ...NestedKeys<T[K]>];
    }[keyof T];

export type TranslationKey = NestedKeys<TranslationKeys>; 