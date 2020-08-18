/*

This is extremely bad design.

Since Recoil.js does not support cross-root state sharing, this is acting as
shared global state for all tiles, but only for focus managment.

It does not remove listeners, so there will be memory leaks and performance
problems down the road.

This tracks cross-root state sharing in Recoil.js:
https://github.com/facebookexperimental/Recoil/issues/140

*/

export default (() => {
  let lastFocusedTab: Element | null = null;
  let listeners: ((e: Element) => void)[] = [];
  const onFocusTile = (e: Element) => {
    lastFocusedTab = e;
    listeners.forEach((listener) => listener?.(e));
  };

  const onFocusedTileChanged = (listener: (e: Element) => void) => {
    listeners.push(listener);
  };

  return {
    onFocusTile,
    onFocusedTileChanged,
  };
})();
