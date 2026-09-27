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

// Trellis closes an open panel menu on any pointerdown outside of it, the ⋯ button included, and the
// click that follows opens the menu again. Swallow that click, so the ⋯ button toggles the menu.
export const useTogglingPanelMenus = () => {
  useEffect(() => {
    let closingButton: Element | null = null;

    const onPointerDown = (e: PointerEvent) => {
      const button = (e.target as Element).closest?.('[data-trellis-part="panel-menu"]');
      closingButton = button?.getAttribute("aria-expanded") === "true" ? button : null;
    };
    const onClick = (e: MouseEvent) => {
      if (closingButton?.contains(e.target as Node)) {
        e.stopPropagation();
      }
      closingButton = null;
    };

    // registered before any menu opens, so this runs before Trellis closes the menu
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("click", onClick, true);
    };
  }, []);
};
