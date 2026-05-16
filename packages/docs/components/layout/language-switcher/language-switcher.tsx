'use client'

import { Languages } from 'lucide-react'
import { useParams, usePathname, useRouter } from 'next/navigation'

import { SelectMenu } from '@/components/shared/select-menu/select-menu'

import styles from './language-switcher.module.css'

export function LanguageSwitcher() {
  const { lang } = useParams()
  const router = useRouter()
  const pathname = usePathname()

  const ariaLabel = lang === 'pt' ? 'Selecionar idioma' : 'Select language'
  const languageLabel = lang === 'pt' ? 'Idioma' : 'Language'

  const options = [
    { value: 'en', label: 'English' },
    { value: 'pt', label: 'Português' },
  ]

  const onValueChange = (newLang: string) => {
    const segments = pathname.split('/')
    segments[1] = newLang
    router.push(segments.join('/'))
  }

  return (
    <div className={styles.container}>
      <SelectMenu
        ariaLabel={ariaLabel}
        onValueChange={onValueChange}
        options={options}
        trigger={
          <button className={styles.trigger} type="button">
            <Languages className={styles.icon} />
            <span className="sr-only">{languageLabel}</span>
          </button>
        }
        value={lang as string}
      />
    </div>
  )
}
