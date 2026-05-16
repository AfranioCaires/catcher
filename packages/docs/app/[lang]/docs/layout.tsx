import { DocsSidebar } from '@/components/docs/sidebar/docs-sidebar'
import { SiteHeader } from '@/components/layout/site-header/site-header'
import { DocsProvider } from '@/components/providers/docs-provider'
import { AnchoredToastProvider } from '@/components/ui/toast/toast'
import { source } from '@/lib/source'

import './layout.css'
import styles from './layout.module.css'

export default async function DocsLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>
  children: React.ReactNode
}) {
  const { lang } = await params
  const tree = source.getPageTree(lang)

  return (
    <DocsProvider>
      <AnchoredToastProvider>
        <div className={styles.header}>
          <SiteHeader pageTree={tree} />
        </div>
        <div className={styles.docsContainer}>
          <div className={styles.sidebar}>
            <DocsSidebar tree={tree} />
          </div>
          <div className={styles.content}>{children}</div>
        </div>
      </AnchoredToastProvider>
    </DocsProvider>
  )
}
