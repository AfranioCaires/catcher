import { ImageResponse } from 'next/og'

import { generate, getImageResponseOptions } from '@/lib/og/mono'

export async function GET() {
  const options = await getImageResponseOptions()

  return new ImageResponse(
    generate({
      title: 'Catcher',
      description: 'Standardized Error Handling for TypeScript',
      site: 'Catcher',
    }),
    options,
  )
}
