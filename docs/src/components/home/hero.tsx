'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Terminal } from 'lucide-react';

export function Hero({ lang, codeHtml }: { lang: string; codeHtml: string }) {
  const translations = {
    en: {
      title: 'Type-safe error handling for TypeScript',
      description: 'A zero-dependency utility providing a clean Result pattern for synchronous and asynchronous operations. Inspired by Go, built for modern TypeScript.',
      getStarted: 'Documentation',
      viewGithub: 'GitHub',
    },
    pt: {
      title: 'Tratamento de erros tipado para TypeScript',
      description: 'Utilitário sem dependências que fornece um padrão Result limpo para operações síncronas e assíncronas. Inspirado em Go, feito para o TypeScript moderno.',
      getStarted: 'Documentação',
      viewGithub: 'GitHub',
    }
  };

  const t = translations[lang as keyof typeof translations] || translations.en;

  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container relative z-10 px-4 md:px-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fd-secondary border border-fd-border text-fd-secondary-foreground text-xs font-medium mb-6">
                <Terminal size={12} strokeWidth={2} />
                <span>v1.0.0</span>
              </div>
              
              <h1 className="text-4xl md:text-7xl font-bold tracking-tighter leading-[0.9] text-fd-foreground mb-8 max-w-[15ch]">
                {t.title}
              </h1>
              
              <p className="text-lg md:text-xl text-fd-muted-foreground leading-relaxed max-w-[45ch] mb-10">
                {t.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/${lang}/docs`}
                  className="group relative inline-flex h-12 items-center justify-center rounded-xl bg-fd-primary px-8 font-medium text-fd-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] shadow-lg shadow-fd-primary/20"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {t.getStarted}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                
                <a
                  href="https://github.com/fuma-nama/fumadocs"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-fd-border bg-fd-background px-8 font-medium text-fd-foreground transition-all hover:bg-fd-accent active:scale-[0.98]"
                >
                  {t.viewGithub}
                </a>
              </div>
            </motion.div>
          </div>
          
          <div className="flex-1 w-full md:w-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="relative rounded-3xl border border-fd-border bg-fd-card/50 p-2 shadow-2xl shadow-fd-shadow/10">
                <div className="overflow-hidden rounded-2xl border border-fd-border bg-fd-card shadow-inner">
                  <div className="flex items-center justify-between border-b border-fd-border bg-fd-muted/50 px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-fd-border" />
                      <div className="h-3 w-3 rounded-full bg-fd-border" />
                      <div className="h-3 w-3 rounded-full bg-fd-border" />
                    </div>
                    <div className="text-[10px] font-mono text-fd-muted-foreground uppercase tracking-widest">
                      example.ts
                    </div>
                  </div>
                  <div 
                    className="p-6 font-mono text-sm leading-relaxed [&_pre]:!bg-transparent [&_code]:!bg-transparent"
                    dangerouslySetInnerHTML={{ __html: codeHtml }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
