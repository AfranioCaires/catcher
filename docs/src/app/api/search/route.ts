import { source } from '@/lib/source';
import { createI18nSearchAPI } from 'fumadocs-core/search/server';
import { i18n } from '@/lib/i18n';

export const { GET } = createI18nSearchAPI('simple', {
  i18n,
  indexes: source.getPages().map((page) => ({
    title: page.data.title,
    content: page.data.description || page.data.title,
    id: page.url,
    url: page.url,
    locale: (page as any).language || 'en',
  })),
});

