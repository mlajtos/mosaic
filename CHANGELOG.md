# Changelog

## Unreleased

### Added

- open tiles and tabs are restored after restart
- tiles can float, and a double-click on the tab bar maximizes a tile
- hint when there is no tile

### Changed

- new tiling engine – [Trellis](https://trellisui.com)
- dock items open with a click, as a new tile next to the focused one
- a tile gets focus when clicked instead of when hovered
- light or dark look following the system setting, instead of always dark
- Electron 44 (was 8)

### Deprecated

### Removed

### Fixed

- resizing tiles no longer gets stuck, leaving pages unclickable
- close button of the find-in-page dialog was squeezed out of view

### Security

## [0.0.3](https://github.com/mlajtos/mosaic/releases/tag/v0.0.2) – 2020-10-26

### Added

- add hover indicator to dock items
- add message when user tries to click on dock item

### Fixed

- unify back/forward arrows across platforms

## [0.0.2](https://github.com/mlajtos/mosaic/releases/tag/v0.0.2) – 2020-08-24

### Added

- changelog for user-facing changes
- _focus follow mouse_ for tabs – keyboard shortcuts will land in the intended tab
- shortcut <kbd>⌘T</kbd> for opening a new tab inside focused tab stack
- shortcut <kbd>⌘W</kbd> for closing a focused tab (works also by hovering over inactive tab)
- find text in page – thx @marc2332
- restore window position and dimensions – thx @marc2332
- Linux packages (`.deb`, `.rpm`, `.pacman`) – thx @michalklempa

### Changed

- add placeholder text to URL bar for clear instructions on how to use it
- make shortened URL a clear click target that will focus URL bar

### Fixed

- prevent webview from jumping up and down when URL bar is focused/blured
- make shortened URL into Search button when URL is empty
- non-visible window frame on Windows and Linux – thx @marc2332

## [0.0.1](https://github.com/mlajtos/mosaic/releases/tag/v0.0.1) – 2020-08-08

### Added

- everything
