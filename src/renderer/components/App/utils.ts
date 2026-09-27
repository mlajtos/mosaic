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

// Trellis ends a divider or floating tile resize only on a pointerup at the grabbed handle. When the
// browser drops the pointer capture first (e.g. a mouse move without buttons just before the release),
// that pointerup lands elsewhere and the workspace stays busy: pages ignore the mouse and the resize
// cursor sticks. Hand the pointerup to the handle, so Trellis finishes the resize itself.
export const useFinishInterruptedResizes = () => {
  useEffect(() => {
    const onLostPointerCapture = (e: PointerEvent) => {
      const handle = e.target as HTMLElement;
      const resizing = handle.closest(".trellis")?.hasAttribute("data-resizing");
      if (resizing && handle.matches('[data-trellis-part="divider"], [data-trellis-part="resize"]')) {
        handle.dispatchEvent(new PointerEvent("pointerup", { pointerId: e.pointerId }));
      }
    };

    document.addEventListener("lostpointercapture", onLostPointerCapture, true);
    return () => document.removeEventListener("lostpointercapture", onLostPointerCapture, true);
  }, []);
};
