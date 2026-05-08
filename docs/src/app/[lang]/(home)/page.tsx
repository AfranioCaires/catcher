import { Hero } from '@/components/home/hero';
import { Tabs, Tab } from 'fumadocs-ui/components/tabs';
import { highlight } from '@/lib/shiki';

export default async function HomePage(props: { params: Promise<{ lang: string }> }) {
  const p = await props.params;
  
  const translations = {
    en: {
      integrationTitle: 'Rapid integration',
      integrationDesc: 'Available on all major package managers. No configuration required.'
    },
    pt: {
      integrationTitle: 'Integração rápida',
      integrationDesc: 'Disponível em todos os principais gerenciadores de pacotes. Sem necessidade de configuração.'
    }
  };

  const t = translations[p.lang as keyof typeof translations] || translations.en;

  const codeExample = `import { catchError } from 'catch-error-lib';

const [error, data] = await catchError(fetchUser(id));

if (error) {
  console.error('Failed:', error);
  return;
}`;

  const [
    heroCodeHtml,
    npmHtml,
    pnpmHtml,
    yarnHtml,
    bunHtml
  ] = await Promise.all([
    highlight(codeExample, 'typescript'),
    highlight('npm install catch-error-lib', 'bash'),
    highlight('pnpm add catch-error-lib', 'bash'),
    highlight('yarn add catch-error-lib', 'bash'),
    highlight('bun add catch-error-lib', 'bash'),
  ]);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-fd-background text-fd-foreground">
      <Hero lang={p.lang} codeHtml={heroCodeHtml} />
      
      {/* Technical Installation Section */}
      <section className="py-24 border-t border-fd-border">
        <div className="container px-4 max-w-[1400px] mx-auto text-left">
          <div className="flex flex-col md:flex-row items-start gap-12">
            <div className="flex-1">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                {t.integrationTitle}
              </h2>
              <p className="text-fd-muted-foreground text-lg max-w-[40ch]">
                {t.integrationDesc}
              </p>
            </div>
            
            <div className="flex-[1.5] w-full max-w-2xl">
              <Tabs items={['npm', 'pnpm', 'yarn', 'bun']}>
                <Tab value="npm">
                  <div 
                    className="p-4 rounded-xl bg-fd-muted font-mono text-sm border border-fd-border overflow-x-auto [&_pre]:!bg-transparent"
                    dangerouslySetInnerHTML={{ __html: npmHtml }}
                  />
                </Tab>
                <Tab value="pnpm">
                  <div 
                    className="p-4 rounded-xl bg-fd-muted font-mono text-sm border border-fd-border overflow-x-auto [&_pre]:!bg-transparent"
                    dangerouslySetInnerHTML={{ __html: pnpmHtml }}
                  />
                </Tab>
                <Tab value="yarn">
                  <div 
                    className="p-4 rounded-xl bg-fd-muted font-mono text-sm border border-fd-border overflow-x-auto [&_pre]:!bg-transparent"
                    dangerouslySetInnerHTML={{ __html: yarnHtml }}
                  />
                </Tab>
                <Tab value="bun">
                  <div 
                    className="p-4 rounded-xl bg-fd-muted font-mono text-sm border border-fd-border overflow-x-auto [&_pre]:!bg-transparent"
                    dangerouslySetInnerHTML={{ __html: bunHtml }}
                  />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
