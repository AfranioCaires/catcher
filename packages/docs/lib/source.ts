import { loader } from 'fumadocs-core/source'
import { docs } from 'fumadocs-mdx:collections/server'

import { i18n } from './i18n'

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  i18n,
})

export function getPageImage(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'image.png']

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  }
}
