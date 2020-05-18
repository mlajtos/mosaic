const shortcuts = {
  "focus-query-field": (e: React.KeyboardEvent<HTMLElement>) => e.key === "l" && e.metaKey,
  "blur-query-field": (e: React.KeyboardEvent<HTMLElement>) => e.key === "Escape",
  "new-tab": (e: React.KeyboardEvent<HTMLElement>) => e.key === "t" && e.metaKey,
  "history-back": (e: React.KeyboardEvent<HTMLElement>) => e.key === "ArrowLeft" && e.metaKey,
} as const;

export const isShortcut = (shortcut: keyof typeof shortcuts, e: React.KeyboardEvent<HTMLElement>) => {
  return shortcuts[shortcut]?.(e);
};
