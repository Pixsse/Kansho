export const STORAGE_KEYS = {
  SIDEBAR: 'sidebarOpen',
  THEME: 'theme',
} as const

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]