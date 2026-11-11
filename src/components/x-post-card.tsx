import type { ReactNode } from 'react'

interface XPostCardProps {
  href: string
  title: string
  description?: string
  thumbnail?: string
  children?: ReactNode
}

const POST_HREF = /^https:\/\/(x\.com|twitter\.com)\/[A-Za-z0-9_]+\/status\/[0-9]+\/?(\?.*)?$/
const THUMB_HREF = /^https:\/\/(pbs\.twimg\.com|abs\.twimg\.com)\//

export function XPostCard({ href, title, description, thumbnail, children }: XPostCardProps) {
  const safeHref = POST_HREF.test(href) ? href : null
  if (!safeHref) return null
  const safeThumb = thumbnail && THUMB_HREF.test(thumbnail) ? thumbnail : null
  const blurb = description || children

  return (
    <a
      href={safeHref}
      target="_blank"
      rel="noreferrer"
      className="not-prose my-6 flex flex-col overflow-hidden rounded-xl border border-border bg-background text-foreground no-underline transition-colors hover:border-foreground/25 sm:flex-row"
    >
      {safeThumb ? (
        <span className="relative block aspect-video w-full shrink-0 sm:aspect-auto sm:w-64">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={safeThumb} alt="" className="h-full w-full object-cover" />
        </span>
      ) : null}
      <span className="min-w-0 p-4">
        <strong className="block text-sm font-semibold">{title}</strong>
        {blurb ? <span className="mt-1 block text-sm leading-6 text-foreground/65">{blurb}</span> : null}
        <span className="mt-2 block text-xs text-foreground/50">Watch on X</span>
      </span>
    </a>
  )
}
