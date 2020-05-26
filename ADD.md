# Architectural Design Decisions

## Tiling

**Problem:** Preserving context while browsing the web can be impossible task. Since you can view only single tab in the window and have to manually switch between the tabs (keyboard or mouse), you can easily get lost while navigating. Long browsing session that involves a lot of googling, reading, copy&pasting, and occasional Reddit is a prime example for intensive and exhaustive context-switching.

**Solution:** The act of computer programming comprises of navigating multiple levels of abstraction (files, functions, pointers, stacks, classes, containers, data flow, etc.) which can be very taxing for short-term memory. Almost all [IDE](https://en.wikipedia.org/wiki/Integrated_development_environment)s naturally evolved into simple [tiling window managers](https://en.wikipedia.org/wiki/Tiling_window_manager) which manages windows/panels/tiles of a single application. User can do a extremely fast context-switch just by *looking* at the different section of the screen where the needed information is readily available. Having a tiling mechanism built-in in the web browser might unlock some useful modes of browsing and working on/with the web.

## New Web Browser

**Problem:** Chrome can't be bent this way via extensions. Vivaldi is years ahead in the different UI/UX direction. OS-level tiling sucks.

**Solution**: *"Electron-based web app for managing iframes."*

## Mosaic

**Problem:**: Naming is a hard problem.

**Solution:** Tiling creates some kind of a mosaic. There already is legendary browser called [NSCA Mosaic](https://en.wikipedia.org/wiki/Mosaic_(web_browser)), so the choice seemed right. No idea about copyright issues. IANAL

## Webviews

**Problem:** `iframe`s can leak to parent frame and can do nasty stuff – bad encapsulation.

**Solution**: `webview` is friendlier `iframe` made for embedding websites in the Electron/Chrome. Has security built-in, does generate more useful events for state-tracking (`did-finish-load`, `will-navigate`, `context-menu`, and [other](https://www.electronjs.org/docs/api/web-contents))), and runs in a separate OS-level process (can crash gracefully).

## Golden Layout

**Problem:** First iteration of *Mosaic* used `react-mosaic` layout mechanism for tiling `webview`s. However it did not have a `stack` feature – universally known as *tabs*. Tabs are well understood and really useful UI interaction design pattern – especially in the context of web browsers.

**Solution:** There exist some extensions to `react-mosaic` which supposedly can add tabs, but it was not an officially supported feature. `golden-layout` has half-baked `React` support hacked-in and the codebase is rather old (think `jQuery` era), but new cleaner version 2.0 is on a way. Mosaic uses unreleased 2.0-alpha from git master.

## Layered rendering

**Problem:** `golden-layout` library moves container items in the DOM hierarchy. `webview` refreshes itself when it is moved in the DOM, so it must have stable rendering place in the DOM hierarchy.

**Solution**: `Tile` and `TileProxy` are coupled components – `TileProxy` is being moved in the DOM by the `golden-layout` lib, and its position and dimensions are mirrored to the `Tile` component. All `Tile`s are rendered in the same container named `TileContainer` outside of the layout via `React.Portal`. All `Tile`s (and therefore `webview`s) have stable (1-level deep) rendering position while they are virtually placed in a deeply-nested hierarchy of `rows`/`columns`/`stacks`.

## Dock

**Problem:** Getting rid of the native title bar (having frame-less window) provides extra vertical screen space, which is precious. Preserving native window controls (traffic lights) is a must.

**Solution**: Having kind of sidebar, in this case *dock*, which contains window controls was at first purely visual decision. Choping off much larger horizontal space is admisible while it also becomes functional. *Dock* is an active area, which holds actions for opening new tiles, or store some other content.

## Golden Layout package

**Problem:** Golden Layout from master has a bug/feature which manifests when dragging tabs. After tear, the proxy is created, but the teared tab stays in the header, which is super-confusing.

**Solution:** Version of Golden Layout is fixed to v1.5.9, which is so far the latest stable version on the NPM.