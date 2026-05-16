"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { GitHubIcon } from "@/components/shared/github-icon";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  const { lang } = useParams();
  const t = {
    en: {
      builtBy: "Built by",
      sourceCode: "Source Code",
    },
    pt: {
      builtBy: "Criado por",
      sourceCode: "Código Fonte",
    },
  }[lang as "en" | "pt"] || {
    builtBy: "Built by",
    sourceCode: "Source Code",
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <div className={styles.brand}>
            <span className={styles.brandName}>Catcher</span>
          </div>
          <p className={styles.copyright}>© {new Date().getFullYear()} Catcher. MIT License.</p>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.links}>
            <Link
              className={styles.link}
              href="https://github.com/afraniocaires/catcher"
              rel="noopener noreferrer"
              target="_blank"
            >
              <GitHubIcon size={16} />
              <span>GitHub</span>
            </Link>
          </div>
          <p className={styles.attribution}>
            {t.builtBy}{" "}
            <Link
              className={styles.authorLink}
              href="https://github.com/afraniocaires"
              rel="noopener noreferrer"
              target="_blank"
            >
              Afranio C
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
