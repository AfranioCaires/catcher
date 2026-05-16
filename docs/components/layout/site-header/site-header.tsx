"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Search } from "@/components/docs/search/search";
import { LanguageSwitcher } from "@/components/layout/language-switcher/language-switcher";
import { MobileNav } from "@/components/layout/mobile-nav/mobile-nav";
import { PaletteSwitcher } from "@/components/layout/palette-switcher/palette-switcher";
import { ThemeSwitcher } from "@/components/layout/theme-switcher/theme-switcher";
import { GitHubIcon } from "@/components/shared/github-icon";
import { Button } from "@/components/ui/button/button";
import type { PageTree } from "@/lib/source-types";
import { cn } from "@/lib/utils";
import styles from "./site-header.module.css";

type SiteHeaderProps = {
  pageTree?: PageTree.Root;
  isHomePage?: boolean;
};

export function SiteHeader({ pageTree, isHomePage }: SiteHeaderProps) {
  const { lang } = useParams();
  const base = lang ? `/${lang}` : "";

  return (
    <header className={styles.header} data-slot="site-header">
      <div className={cn(styles.container, isHomePage ? styles.containerHomePage : null)}>
        <div className={cn(styles.innerWrapper, isHomePage ? styles.innerWrapperHomePage : null)}>
          <nav className={styles.nav}>
            <div className={styles.leftSection}>
              <Link aria-label="Catcher Home" className={styles.logoLink} href={base || "/"}>
                Catcher
              </Link>
            </div>

            <div className={styles.navLinks}>
              <Button
                aria-label="Navigate to /docs page"
                className={styles.navLink}
                nativeButton={false}
                render={<Link href={`${base}/docs`} />}
                size="sm"
                variant="ghost"
              >
                Docs
              </Button>
            </div>
          </nav>

          <div className={styles.actions}>
            <div className={styles.desktopOnly}>
              <Search tree={pageTree} />
            </div>
            <div className={`${styles.separator} ${styles.desktopOnly}`} />
            <div className={styles.desktopOnly}>
              <LanguageSwitcher />
            </div>
            <div className={`${styles.separator} ${styles.desktopOnly}`} />
            <div className={styles.desktopOnly}>
              <PaletteSwitcher />
            </div>
            <div className={`${styles.separator} ${styles.desktopOnly}`} />
            <Button
              aria-label="View source on GitHub"
              className={`${styles.githubLink} ${styles.desktopOnly}`}
              nativeButton={false}
              render={<Link href="https://github.com/preetecool/Catcher" rel="noopener noreferrer" target="_blank" />}
              size="icon"
              variant="ghost"
            >
              <GitHubIcon />
            </Button>
            <div className={`${styles.separator} ${styles.desktopOnly}`} />
            <div className={styles.desktopOnly}>
              <ThemeSwitcher />
            </div>
            {pageTree ? (
              <div className={styles.mobileMenuWrapper}>
                <MobileNav tree={pageTree} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
