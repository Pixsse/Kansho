import { STORAGE_KEYS } from "~/constants/storageKeys"

export function setSidebarState(value: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR, value)
  }
}

export function getSidebarState() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEYS.SIDEBAR)
  }
  return null
}

export function setTheme(value: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.THEME, value)
  }
}

export function getTheme() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEYS.THEME)
  }
  return null
}
