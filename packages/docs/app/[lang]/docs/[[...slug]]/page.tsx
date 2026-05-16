import { findNeighbour } from 'fumadocs-core/page-tree'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { TableOfContents } from '@/components/docs/toc/toc'
import { FooterNav } from '@/components/layout/footer-nav/footer-nav'
import { ArrowPointer, Button } from '@/components/ui/button/button'
import { translations } from '@/lib/layout.shared'
import { source, getPageImage } from '@/lib/source'
import { mdxComponents } from '@/mdx-components'

import styles from './page.module.css'

export function generateStaticParams() {
  return source.generateParams('slug', 'lang')
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string; slug?: string[] }>
}): Promise<Metadata> {
  const { lang, slug } = await props.params
  const page = source.getPage(slug, lang)

  if (!page) {
    notFound()
  }

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  }
}

export default async function Page(props: { params: Promise<{ lang: string; slug?: string[] }> }) {
  const { lang, slug } = await props.params
  const page = source.getPage(slug, lang)
  if (!page) {
    notFound()
  }

  const doc = page.data
  const t = (translations as any)[lang] || translations.en

  const MDX = doc.body
  const links = doc.links
  const components = doc.components
  const motion = doc.motion
  const toc = doc.toc

  const tree = (source.pageTree as any)[lang]
  const neighbours = findNeighbour(tree, page.url)

  return (
    <>
      <article className={styles.pageContent}>
        <header className={styles.pageHeader}>
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <h1 className={styles.pageTitle}>{doc.title}</h1>
            </div>
            {doc.description ? <p className={styles.pageDescription}>{doc.description}</p> : null}
          </div>
          {links || components ? (
            <div className={styles.linksSection}>
              {links?.doc || links?.api ? (
                <div className={styles.externalLinks}>
                  {links?.doc ? (
                    <Button
                      className={styles.badgeButton}
                      nativeButton={false}
                      render={<Link href={links.doc} rel="noopener noreferrer" target="_blank" />}
                      size="sm"
                      variant="outline"
                    >
                      {t.docs || 'Docs'}
                      <ArrowPointer pointExternal />
                    </Button>
                  ) : null}
                  {links?.api ? (
                    <Button
                      className={styles.badgeButton}
                      nativeButton={false}
                      render={<Link href={links.api} rel="noopener noreferrer" target="_blank" />}
                      size="sm"
                      variant="outline"
                    >
                      {t.apiReference || 'API Reference'}
                      <ArrowPointer pointExternal />
                    </Button>
                  ) : null}
                </div>
              ) : null}
              {components && components.length > 0 ? (
                <div className={styles.componentBadges}>
                  {components.map((component: string) => (
                    <Button
                      className={styles.badgeButton}
                      key={component}
                      render={<Link href={`/docs/ui/${component}`} />}
                      size="sm"
                      variant="secondary"
                    >
                      {component.charAt(0).toUpperCase() + component.slice(1)}
                    </Button>
                  ))}
                  {motion ? (
                    <Button
                      className={styles.badgeButton}
                      render={
                        <Link href="https://motion.dev" rel="noopener noreferrer" target="_blank" />
                      }
                      size="sm"
                      variant="outline"
                    >
                      Motion
                      <ArrowPointer pointExternal />
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </header>

        <div className={`${styles.contentWrapper} ${styles.prose}`}>
          <MDX components={mdxComponents} />
        </div>

        <FooterNav
          className={styles.footerNav}
          next={
            neighbours.next
              ? { url: neighbours.next.url, title: neighbours.next.name as string }
              : null
          }
          previous={
            neighbours.previous
              ? { url: neighbours.previous.url, title: neighbours.previous.name as string }
              : null
          }
        />
      </article>

      <aside className={styles.toc}>
        <TableOfContents toc={toc} />
      </aside>
    </>
  )
}
