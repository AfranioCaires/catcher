import { defineI18n } from 'fumadocs-core/i18n';
import { defineI18nUI } from 'fumadocs-ui/i18n';

export const i18n = defineI18n({
  defaultLanguage: 'en',
  languages: ['en', 'pt'],
});

export const i18nUI = defineI18nUI(i18n, {
  en: {
    displayName: 'English',
    toc: 'On this page',
    chooseLanguage: 'Choose a language',
  },
  pt: {
    displayName: 'Português',
    toc: 'Nesta página',
    chooseLanguage: 'Escolha um idioma',
  },
});
