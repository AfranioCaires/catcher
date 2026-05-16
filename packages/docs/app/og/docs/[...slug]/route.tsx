import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'

import { generate as MonoImage, getImageResponseOptions } from '@/lib/og/mono'
import { getPageImage, source } from '@/lib/source'

export const revalidate = false

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const page = source.getPage(slug.slice(0, -1))
  if (!page) notFound()

  const options = await getImageResponseOptions()

  return new ImageResponse(
    <MonoImage description={page.data.description} site="Catcher" title={page.data.title} />,
    options,
  )
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }))
}
