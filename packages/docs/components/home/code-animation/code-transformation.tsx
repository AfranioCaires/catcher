"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { ShikiMagicMove } from "shiki-magic-move/react";
import { getSingletonHighlighter } from "shiki";
import styles from "./code-transformation.module.css";
import "shiki-magic-move/dist/style.css";

const codeBefore = `try {
  const data = await fetchUser(id);
} catch (error) {
  if (error instanceof UserNotFoundError) {
    return null;
  }
  throw error;
}`;

const codeAfter = `const [error, data] = await catcher(
  fetchUser(id),
  [UserNotFoundError]
);

if (error) return null;

`;

export const CodeTransformation = () => {
  const [code, setCode] = useState(codeBefore);
  const [highlighter, setHighlighter] = useState<any>(null);
  const { lang } = useParams();
  const { resolvedTheme } = useTheme();

  const content = useMemo(() => {
    const translations = {
      en: {
        filename: "user-service.ts",
      },
      pt: {
        filename: "servico-usuario.ts",
      },
    };
    return translations[lang as "en" | "pt"] || translations.en;
  }, [lang]);

  const theme = resolvedTheme === "dark" ? "github-dark" : "github-light";

  useEffect(() => {
    getSingletonHighlighter({
      themes: ["github-dark", "github-light"],
      langs: ["tsx"],
    }).then(setHighlighter);

    const interval = setInterval(() => {
      setCode((c) => (c === codeBefore ? codeAfter : codeBefore));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.filename}>{content.filename}</span>
        </div>
      </div>
      <div className={styles.content}>
        {highlighter ? (
          <ShikiMagicMove
            key={theme}
            lang="tsx"
            theme={theme}
            highlighter={highlighter}
            code={code}
            options={{ duration: 800, stagger: 1 }}
            className={styles.magicMove}
          />
        ) : (
          <div className={styles.placeholder}>
            <pre>{code}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
