"use client";

import { Astroid, Info, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge/badge";
import type { PageTree } from "@/lib/source-types";
import styles from "./docs-sidebar.module.css";

const NEW_SIDEBAR_ITEMS = new Set<string>([]);

type SidebarItem = {
  $id?: string;
  name: React.ReactNode;
  url?: string;
  type: string;
  disabled?: boolean;
  badge?: string;
  children?: SidebarItem[];
};

type DocsSidebarProps = {
  tree: PageTree.Root;
};

type TreeNode = PageTree.Node;

export function DocsSidebar({ tree }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation navigation" className={styles.sidebar}>
      <div className={styles.content}>
        {tree.children.map((item: TreeNode, index: number) => (
          <div className={styles.group} key={item.$id || `item-${index}`}>
            <DocsSidebarGroup item={item as SidebarItem} level={0} pathname={pathname} />
          </div>
        ))}
      </div>
    </nav>
  );
}

const ICON_MAPPING: Record<string, React.ReactNode> = {
  start: <Zap size={16} />,
  intro: <Info size={16} />,
  docs: <Info size={16} />,
  "agents-skills": <Astroid size={16} />,
};

function getIconForItem(item: SidebarItem) {
  if (!item.url) return null;

  const segments = item.url.split("/").filter(Boolean);
  const slug = segments[segments.length - 1];

  return ICON_MAPPING[slug] || null;
}

function DocsSidebarGroup({ item, pathname, level = 0 }: { item: SidebarItem; pathname: string; level?: number }) {
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const isActive = pathname === item.url;

  if (!hasChildren && item.type === "page" && item.url) {
    return (
      <Link
        aria-current={isActive ? "page" : undefined}
        className={`${styles.menuButton} ${isActive ? styles.menuButtonActive : ""}`}
        href={item.url}
      >
        {getIconForItem(item)}
        <span>{item.name}</span>
        {item.badge && (
          <Badge className={styles.badge} size="sm" variant="secondary">
            {item.badge}
          </Badge>
        )}
        {NEW_SIDEBAR_ITEMS.has(item.name as string) && <span className={styles.newBadge}>New</span>}
      </Link>
    );
  }

  if (level === 0 && hasChildren) {
    return (
      <>
        <h3 className={styles.groupLabel}>
          {getIconForItem(item)}
          {item.name}
        </h3>
        <ul className={styles.groupContent}>
          {item.children?.map((child, index) => (
            <li key={child.$id || `child-${index}`}>
              <DocsSidebarGroup item={child} level={level + 1} pathname={pathname} />
            </li>
          ))}
        </ul>
      </>
    );
  }

  return null;
}
