import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { i18n } from '@/lib/i18n';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const p = await params;
  return (
    <DocsLayout tree={source.getPageTree(p.lang)} {...baseOptions(p.lang)} i18n={i18n}>
      {children}
    </DocsLayout>
  );
}

