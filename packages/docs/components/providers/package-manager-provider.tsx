"use client";

import type { ReactNode } from "react";
import { createPreferenceProvider } from "./create-preference-provider";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

const VALID_PACKAGE_MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const;

const { Provider, usePreference } = createPreferenceProvider<PackageManager>({
  storageKey: "preferred-package-manager",
  validValues: VALID_PACKAGE_MANAGERS,
  dataAttribute: "data-package-manager",
});

type PackageManagerProviderProps = {
  children: ReactNode;
  defaultValue?: PackageManager;
};

export function PackageManagerProvider({
  children,
  defaultValue = "npm",
}: PackageManagerProviderProps) {
  return <Provider defaultValue={defaultValue}>{children}</Provider>;
}

export function usePackageManager() {
  const { value, setValue } = usePreference();
  return { packageManager: value, setPackageManager: setValue };
}
