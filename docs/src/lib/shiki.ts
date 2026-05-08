import { createHighlighter, type Highlighter } from 'shiki';

let highlighterPromise: Promise<Highlighter> | null = null;

export async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['vitesse-light', 'vitesse-dark'],
      langs: ['typescript', 'bash'],
    });
  }
  return highlighterPromise;
}

export async function highlight(code: string, lang: string) {
  const highlighter = await getHighlighter();

  return highlighter.codeToHtml(code, {
    lang,
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  });
}
