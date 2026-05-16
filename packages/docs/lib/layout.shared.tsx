import { defineI18nUI } from "fumadocs-ui/i18n";
import { i18n } from "@/lib/i18n";

export const translations = {
  en: {
    docs: "Docs",
    apiReference: "API Reference",
  },
  pt: {
    displayName: "Português",
    search: "Pesquisar",
    searchNoResult: "Nenhum resultado encontrado",
    toc: "Nesta página",
    lastUpdate: "Última atualização em",
    previousPage: "Anterior",
    nextPage: "Próximo",
    chooseLanguage: "Escolher idioma",
    editOnGithub: "Editar no GitHub",
    docs: "Documentação",
    apiReference: "Referência da API",
  },
};

export const i18nUI = defineI18nUI(i18n, translations as any);
