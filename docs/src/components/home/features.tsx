'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { 
  Zap, 
  ShieldCheck, 
  Layers, 
  Box, 
  Activity 
} from 'lucide-react';

export function Features({ lang }: { lang: string }) {
  const t = {
    en: {
      title: 'Built for the modern stack',
      features: [
        {
          title: 'Dual API Strategy',
          description: 'Consume results via Go-style tuples or a functional fluent API. Zero context switching.',
          icon: Layers,
          className: 'md:col-span-2',
          color: 'text-fd-primary'
        },
        {
          title: 'Zero Overhead',
          description: 'No dependencies. Minimized runtime footprint for high-performance systems.',
          icon: Box,
          className: 'md:col-span-1',
          color: 'text-fd-muted-foreground'
        },
        {
          title: 'Error Isolation',
          description: 'Granular filtering allows catching specific exceptions while bubbling critical failures.',
          icon: ShieldCheck,
          className: 'md:col-span-1',
          color: 'text-fd-primary'
        },
        {
          title: 'Batch Ready',
          description: 'Built-in support for independent parallel processing without global failure.',
          icon: Zap,
          className: 'md:col-span-2',
          color: 'text-fd-primary'
        }
      ],
      footer: 'Protocol Validated'
    },
    pt: {
      title: 'Feito para a stack moderna',
      features: [
        {
          title: 'Estratégia de API Dupla',
          description: 'Consuma resultados via tuplas estilo Go ou uma API funcional fluente. Zero troca de contexto.',
          icon: Layers,
          className: 'md:col-span-2',
          color: 'text-fd-primary'
        },
        {
          title: 'Zero Overhead',
          description: 'Sem dependências. Footprint de runtime minimizado para sistemas de alta performance.',
          icon: Box,
          className: 'md:col-span-1',
          color: 'text-fd-muted-foreground'
        },
        {
          title: 'Isolamento de Erros',
          description: 'Filtragem granular permite capturar exceções específicas enquanto propaga falhas críticas.',
          icon: ShieldCheck,
          className: 'md:col-span-1',
          color: 'text-fd-primary'
        },
        {
          title: 'Pronto para Lote',
          description: 'Suporte nativo para processamento paralelo independente sem falha global.',
          icon: Zap,
          className: 'md:col-span-2',
          color: 'text-fd-primary'
        }
      ],
      footer: 'Protocolo Validado'
    }
  }[lang as 'en' | 'pt'] || { title: 'Built for the modern stack', features: [], footer: '' };

  return (
    <section className="py-24 border-t border-fd-border">
      <div className="container px-4 md:px-6 max-w-[1400px] mx-auto">
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-fd-foreground"
          >
            {t.title}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "group relative overflow-hidden rounded-3xl border border-fd-border bg-fd-card p-8 transition-all hover:bg-fd-accent/50",
                feature.className
              )}
            >
              <div className="flex flex-col h-full">
                <div className={cn("mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-fd-muted", feature.color)}>
                  <feature.icon size={20} strokeWidth={2} />
                </div>
                
                <h3 className="text-xl font-bold text-fd-foreground mb-3 tracking-tight">
                  {feature.title}
                </h3>
                
                <p className="text-fd-muted-foreground leading-relaxed text-sm">
                  {feature.description}
                </p>
                
                <div className="mt-auto pt-8 flex items-center gap-1 text-[10px] font-mono font-bold text-fd-muted-foreground/40 uppercase tracking-widest group-hover:text-fd-muted-foreground transition-colors">
                  <Activity size={10} />
                  <span>{t.footer}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
