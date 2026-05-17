'use client'

import { createMarkdownRenderer } from 'fumadocs-core/content/md'
import { useDocsSearch } from 'fumadocs-core/search/client'
import { Astroid, ChevronRight, Component, FileText, Hash, Info, Puzzle, Zap } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { EnterArrowIcon } from '@/components/ui/arrow-icon/arrow-icon'
import {
  Command,
  CommandCollection,
  CommandDialog,
  CommandDialogPopup,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command/command'
import { Kbd } from '@/components/ui/kbd/kbd'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import { cn } from '@/lib/utils'

import { SearchTrigger } from './search-trigger'

import styles from './search.module.css'

type SearchResult = {
  id: string
  type: 'page' | 'heading' | 'text'
  content: string
  url: string
  breadcrumbs?: string[]
}

type TreeItem = {
  id: string
  name: string
  url: string
  group: string
}

const ICON_MAPPING: Record<string, React.ReactNode> = {
  start: <Zap size={16} />,
  intro: <Info size={16} />,
  docs: <Info size={16} />,
  'agents-skills': <Astroid size={16} />,
}

const getIcon = (url: string, type?: string) => {
  if (type === 'heading') return <Hash size={16} />

  if (url.includes('/ui/')) return <Puzzle size={16} />
  if (url.includes('/blocks/')) return <Component size={16} />

  const segments = url.split('/').filter(Boolean)
  const slug = segments[segments.length - 1]

  if (ICON_MAPPING[slug]) return ICON_MAPPING[slug]

  return <FileText size={16} />
}

const mdRenderer = createMarkdownRenderer({
  remarkRehypeOptions: { allowDangerousHtml: true },
})

const mdComponents = {
  mark(props: any) {
    return <mark {...props} className={styles.highlight} />
  },
}

/**
 * Renders the documentation search trigger and searchable dialog that shows remote search results or a browsable page tree.
 *
 * @param tree - Optional page tree object whose `children` (folders with `page` items) are used to build the browseable groups shown when no search query is entered.
 * @returns A React element containing the search trigger button and the command-style search dialog with results and tree groups.
 */
export function Search({ tree }: { tree?: any }) {
  const { lang } = useParams()
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { setSearch, query } = useDocsSearch({
    type: 'fetch',
  })

  const t = {
    en: {
      placeholder: 'Search documentation...',
      searching: 'Searching...',
      noResults: 'No results found.',
      results: 'Search Results',
      footer: 'Go to page',
    },
    pt: {
      placeholder: 'Pesquisar documentação...',
      searching: 'Pesquisando...',
      noResults: 'Nenhum resultado encontrado.',
      results: 'Resultados da Pesquisa',
      footer: 'Ir para a página',
    },
  }[lang as 'en' | 'pt'] || {
    placeholder: 'Search documentation...',
    searching: 'Searching...',
    noResults: 'No results found.',
    results: 'Search Results',
    footer: 'Go to page',
  }

  useKeyboardShortcut({ key: 'k', metaKey: true }, () => setOpen(true))
  useKeyboardShortcut({ key: 'k', ctrlKey: true }, () => setOpen(true))

  useEffect(
    () => () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    },
    [],
  )

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen)
      if (!isOpen) {
        setTimeout(() => {
          setInputValue('')
          setSearch('')
        }, 150)
      }
    },
    [setSearch],
  )

  const handleValueChange = useCallback(
    (value: string) => {
      setInputValue(value)

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      searchTimeoutRef.current = setTimeout(() => {
        setSearch(value)
      }, 300)
    },
    [setSearch],
  )

  const handleItemClick = useCallback(() => {
    handleOpenChange(false)
  }, [handleOpenChange])

  const treeGroups = useMemo(() => {
    if (!tree?.children) return []

    const groups: { name: string; items: TreeItem[] }[] = []

    tree.children.forEach((group: any) => {
      if (group.type !== 'folder') return

      const items: TreeItem[] = (group.children as any[])
        .filter((item: any) => item.type === 'page')
        .map((item: any) => ({
          id: item.url,
          name: item.name?.toString() || '',
          url: item.url,
          group: group.name?.toString() || '',
        }))

      if (items.length > 0) {
        groups.push({
          name: group.name?.toString() || '',
          items,
        })
      }
    })

    return groups
  }, [tree])

  const searchResults = useMemo(() => {
    if (!query.data || query.data === 'empty' || !Array.isArray(query.data)) {
      return []
    }

    return query.data.filter(
      (item: any, index: number, self: any[]) =>
        !(item.type === 'text' && item.content.trim().split(/\s+/).length <= 1) &&
        index === self.findIndex((t) => t.content === item.content),
    ) as SearchResult[]
  }, [query.data])

  const itemToStringValue = useCallback((item: unknown) => {
    if (!item || typeof item !== 'object') return ''
    if ('content' in item) return (item as SearchResult).content
    if ('name' in item) return (item as TreeItem).name
    return ''
  }, [])

  const showSearchResults = inputValue.trim().length > 0
  const isLoading = query.isLoading
  const hasSearchResults = searchResults.length > 0

  const allItems = useMemo(() => {
    if (showSearchResults) {
      return searchResults
    }
    return treeGroups.flatMap((g) => g.items)
  }, [showSearchResults, searchResults, treeGroups])

  return (
    <>
      <SearchTrigger onClick={() => setOpen(true)} />
      <CommandDialog onOpenChange={handleOpenChange} open={open}>
        <CommandDialogPopup className={styles.searchDialog} initialFocus={inputRef}>
          <Command
            items={allItems}
            itemToStringValue={itemToStringValue}
            onValueChange={handleValueChange}
          >
            <CommandInput
              className={styles.commandInput}
              placeholder={t.placeholder}
              ref={inputRef}
            />
            <CommandList className={styles.searchList}>
              {showSearchResults ? (
                <>
                  {!hasSearchResults && (
                    <CommandEmpty>{isLoading ? t.searching : t.noResults}</CommandEmpty>
                  )}
                  {hasSearchResults && (
                    <CommandGroup items={searchResults}>
                      <CommandGroupLabel>{t.results}</CommandGroupLabel>
                      <CommandCollection>
                        {(result: SearchResult) => (
                          <CommandItem
                            key={result.id}
                            render={
                              <Link href={result.url} onNavigate={handleItemClick} tabIndex={-1} />
                            }
                            value={result}
                          >
                            <div className={styles.resultItem}>
                              <div className={styles.resultIcon}>
                                {getIcon(result.url, result.type)}
                              </div>
                              <div className={styles.resultContent}>
                                {result.breadcrumbs && result.breadcrumbs.length > 0 && (
                                  <div className={styles.resultBreadcrumbs}>
                                    {result.breadcrumbs.map((bc, i) => (
                                      <Fragment key={i}>
                                        {i > 0 && (
                                          <ChevronRight
                                            className={styles.breadcrumbSeparator}
                                            size={12}
                                          />
                                        )}
                                        <span className={styles.breadcrumbItem}>{bc}</span>
                                      </Fragment>
                                    ))}
                                  </div>
                                )}
                                <div className={cn(styles.resultText)}>
                                  <mdRenderer.Markdown components={mdComponents}>
                                    {result.content}
                                  </mdRenderer.Markdown>
                                </div>
                              </div>
                            </div>
                          </CommandItem>
                        )}
                      </CommandCollection>
                    </CommandGroup>
                  )}
                </>
              ) : (
                treeGroups.map((group, index) => (
                  <div key={group.name}>
                    {index > 0 && <CommandSeparator />}
                    <CommandGroup items={group.items}>
                      <CommandGroupLabel>{group.name}</CommandGroupLabel>
                      <CommandCollection>
                        {(item: TreeItem) => (
                          <CommandItem
                            key={item.id}
                            render={
                              <Link href={item.url} onNavigate={handleItemClick} tabIndex={-1} />
                            }
                            value={item}
                          >
                            {getIcon(item.url)}
                            {item.name}
                          </CommandItem>
                        )}
                      </CommandCollection>
                    </CommandGroup>
                  </div>
                ))
              )}
            </CommandList>
            <CommandFooter>
              <div className={styles.commandFooterItem}>
                <Kbd className={styles.commandFooterKbd} size="md">
                  <EnterArrowIcon />
                </Kbd>
                <span className={styles.commandFooterText}>{t.footer}</span>
              </div>
            </CommandFooter>
          </Command>
        </CommandDialogPopup>
      </CommandDialog>
    </>
  )
}
