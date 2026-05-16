'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import { Badge } from '@/components/ui/badge/badge'
import { ArrowPointer, Button } from '@/components/ui/button/button'

import { CodeTransformation } from '../code-animation/code-transformation'

import styles from './hero.module.css'

export const Hero = () => {
  const { lang } = useParams()
  const base = lang ? `/${lang}` : ''

  const content = {
    en: {
      badge: 'Version 1.0 is here',
      heading: 'Catcher',
      subheading: 'Standardized error handling for TypeScript inspired by Go and Rust.',
      button: 'Explore Docs',
    },
    pt: {
      badge: 'Versão 1.0 disponível',
      heading: 'Catcher',
      subheading: 'Tratamento de erros padronizado para TypeScript inspirado em Go e Rust.',
      button: 'Explorar Docs',
    },
  }[lang as 'en' | 'pt'] || {
    badge: 'Version 1.0 is here',
    heading: 'Catcher',
    subheading: 'Standardized error handling for TypeScript inspired by Go and Rust.',
    button: 'Explore Docs',
  }

  return (
    <section aria-label="Hero section" className={styles.container}>
      <div className={styles.heroContent}>
        <div className={styles.textContent}>
          <Badge className={styles.badge} variant="outline">
            <span>{content.badge}</span>
            <ArrowPointer />
          </Badge>
          <h1 className={styles.h1}>
            {content.heading.split(' ').map((word, index) => (
              <span className={styles.wordContainer} key={`word-${word}`}>
                <span
                  className={styles.wordWrapper}
                  style={{ '--index': index } as React.CSSProperties}
                >
                  {word}
                  {index < content.heading.split(' ').length - 1 && ' '}
                </span>
              </span>
            ))}
          </h1>
          <p className={styles.subheading}>{content.subheading}</p>
          <div className={styles.buttonWrapper}>
            <Button nativeButton={false} render={<Link href={`${base}/docs`} />}>
              {content.button}
            </Button>
          </div>
        </div>
        <div className={styles.visualContent}>
          <CodeTransformation />
        </div>
      </div>
    </section>
  )
}
