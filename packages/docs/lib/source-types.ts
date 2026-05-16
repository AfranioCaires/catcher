import type { source } from './source'

export type Source = typeof source
export type PageTree = ReturnType<Source['getPageTree']>
export type Page = ReturnType<Source['getPage']>

export namespace PageTree {
  export type Root = ReturnType<Source['getPageTree']>
  export type Node = Root['children'][number]
  export type Item = Extract<Node, { type: 'page' }>
  export type Folder = Extract<Node, { type: 'folder' }>
}
