import { useEffect } from "react";

export const useShortcut = (shortcuts: Record<string, () => void>, deps: any[] = []) => {
  useEffect(
    () =>
      window.mosaic.onShortcut((shortcutName) => {
        shortcuts?.[shortcutName]?.();
      }),
    deps
  );
};
