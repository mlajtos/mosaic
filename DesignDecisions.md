# Design Decisions

Every now and then, a decision has to be made on how to proceed with the implementation. This is a list of all major design decisions.

## Tiling

**Problem:** Preserving context while browsing the web can be impossible task. Since you can view only single tab in the window and have to manually switch between the tabs (keyboard or mouse), you can easily get lost while navigating. Long browsing session that involves a lot of googling, reading, copy&pasting, and occasional Reddit is a prime example for intensive and exhaustive context-switching.

**Solution:** The act of computer programming comprises of navigating multiple levels of abstraction (files, functions, pointers, stacks, classes, containers, data flow, etc.) which can be very taxing for short-term memory. Almost all [IDE](https://en.wikipedia.org/wiki/Integrated_development_environment)s naturally evolved into simple [tiling window managers](https://en.wikipedia.org/wiki/Tiling_window_manager) which manages windows/panels/tiles of a single application. User can do an extremely fast context-switch just by *looking* at the different section of the screen where the needed information is readily available. Having a tiling mechanism built-in in the web browser might unlock some useful modes of browsing and working on/with the web.

## New Web Browser

**Problem:** Chrome can't be bent this way via extensions. Vivaldi is years ahead in the different UI/UX direction. OS-level tiling sucks.

**Solution**: *"Electron-based web app for managing iframes."* (Chromium is a bad choice for an exploratory phase.)

## Mosaic

**Problem:** Naming is a hard problem.

**Solution:** Tiling creates some kind of a mosaic. There already is the legendary browser called [NCSA Mosaic](https://en.wikipedia.org/wiki/Mosaic_(web_browser)), so the choice seemed right to pay a small homage to it. No idea about copyright issues. IANAL

## Webviews

**Problem:** `iframe`s can leak to parent frame and can do nasty stuff – bad encapsulation.

**Solution:** `webview` is friendlier `iframe` made for embedding websites in the Electron/Chrome. Has built-in security, generates more useful events for state-tracking (`did-finish-load`, `will-navigate`, `context-menu`, and [other](https://www.electronjs.org/docs/api/web-contents))), and runs in a separate OS-level process (can crash gracefully).

## Golden Layout

**Problem:** First iteration of *Mosaic* used `react-mosaic` layout mechanism for tiling `webview`s. However it did not have a `stack` feature – universally known as *tabs*. Tabs are well understood and really useful UI interaction design pattern – especially in the context of web browsers.

**Solution:** There exist some extensions to `react-mosaic` which supposedly can add tabs, but it was not an officially supported feature. `golden-layout` has half-baked `React` support hacked-in and the codebase is rather old (think `jQuery` era), but new cleaner version 2.0 is on a way. Mosaic uses unreleased 2.0-alpha from git master. (Not true anymore, see [Golden Layout package](#golden-layout-package))

## Layered rendering

**Problem:** `golden-layout` library moves container items in the DOM hierarchy. `webview` refreshes itself when it is moved in the DOM, so it must have stable rendering place in the DOM hierarchy. It is a [known issue](https://github.com/golden-layout/golden-layout/search?q=iframe&type=Issues) of Golden Layout.

**Solution:** `Tile` and `TileProxy` are coupled components – `TileProxy` is being moved in the DOM by the `golden-layout` lib, and its position and dimensions are mirrored to the `Tile` component. All `Tile`s are rendered in the same container named `TileContainer` outside of the layout via `React.Portal`. All `Tile`s (and therefore `webview`s) have stable (1-level deep) rendering position while they are virtually placed in a deeply-nested hierarchy of `rows`/`columns`/`stacks`.

## Dock

**Problem:** Getting rid of the native title bar (having frame-less window) provides extra vertical screen space, which is precious. Preserving native window controls (traffic lights) is a must.

**Solution:** Having kind of sidebar, in this case *dock*, which contains window controls was at first purely visual decision. Choping off much larger horizontal space is admisible while it also becomes functional. *Dock* is an active area, which holds actions for opening new tiles, or store some other content.

## Golden Layout package

**Problem:** Golden Layout from master branch has a bug/feature which manifests when dragging tabs. After tearing the tab, the proxy is created, but the teared tab stays in the header, which is super-confusing.

**Solution:** Version of Golden Layout is fixed to v1.5.9, which is so far the latest stable version on the NPM.

## Tabs rendered by React

**Problem:** Tab in Golden Layout can display only text with predefined action (close) and is hard to customize.

**Solution:** Hijack DOM node and render there through React.

## Recoil.js – cross-root state sharing

**Problem:** Decision to use Recoil.js was made without a proper research and one particular problem complicates development – ability to share state between React roots. Since Golden Layout is sandwiched between React stuff, this is really pain in the ass.

**Solution:** There is an ongoing work to bring cross-root state sharing ([Recoil-#140](https://github.com/facebookexperimental/Recoil/issues/140)), but it will probably take a while to bring it to production. So far only `TileFocusState` suffers from this, but it will probably gets messy along the way. Also, when the feature lands in Recoil.js, then there is a need to use `atomFamily` for `Tile`s and `Webview`s state. Cross-root sharing landed in [0.0.11](https://github.com/facebookexperimental/Recoil/releases/tag/0.0.11).

## Default search engine

**Problem:** Web browser without search capabilities is useless browser. Today, *"to google"* is a synonym for searching on the web. However, Google positioned themselves as data harvesting company that does not guarantee user privacy.

**Solution:** [DuckDuckGo](https://duckduckgo.com/) seems like the best choice right now. It does not track you and therefore does not provide personalized search results. This means that some ambiguous search terms will yield wrong results. Using [bangs](https://duckduckgo.com/bang) (e.g. "!g" for Google) as a deliberate opt-in for user tracking seems like a good tradeoff for precise context-sensitive searching.