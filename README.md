<div align="center">
  <a href="showcase/Mosaic-0.0.1.mp4"><img src="showcase/Mosaic-0.0.1.gif"></a>
  <h1>Mosaic</h1>
  <p>
    <b>Web browser that can display multiple web pages at the same time in one shared window. <em>A tiling web browser.</em></b>
  </p>
    <p>
        Latest release: <a href="https://github.com/mlajtos/mosaic/releases/tag/v0.0.3">0.0.3</a> <br> <a href="https://github.com/mlajtos/mosaic/releases/tag/v0.0.3">Download</a> · <a href="https://github.com/mlajtos/mosaic/blob/master/CHANGELOG.md">Changelog</a>
    </p>
    <br>
</div>

## Value proposition

The main value of using Mosaic over Chrome with builtin macOS tiling can be seen on this non-exhaustive list of tasks that often pop up when you want to use web in a tiling fashion:

1. **Task 1** – create a 1:2 splitscreen from a single fullscreen window containing two tabs
   - Chrome on macOS – [video, 12 seconds](https://www.youtube.com/watch?v=acpdYwx13tM)
     1. turn-off fullscreen
     1. tear off one tab into a window
     1. hold cursor over green (maximise) window button
     1. select "Tile window to the left side"
     1. choose the second Chrome window to fill the rest of the screen (right side)
     1. resize via the splitter between the tiles
   - Mosaic on macOS – [video, 6 seconds](https://www.youtube.com/watch?v=UBIxEerWKbQ)
     1. drag out a tab to the wanted place
        - 🤬 the animation is extremely choppy 
     1. resize via the splitter between the tiles
2. **Task 2** – interact with unfocused tile and repeat
   - Chrome on macOS – [video, 5 seconds](https://www.youtube.com/watch?v=OGHneorb0Xc)
     1. move cursor over unfocused tile
     1. click on the unfocused tile to focus it
     1. click on the interactive element
     1. [repeat]
   - Mosaic on macOS – [video, 2 seconds](https://www.youtube.com/watch?v=Ej-0LTTm_yQ)
     1. move cursor over unfocused tile
        - 🤬 tile did not change the appearance to communicate focus
     1. click on the interactive element
     1. [repeat]

## Features

- [x] Documented [Design Decisions](DesignDecisions.md)
  - [Why the name Mosaic?](https://github.com/mlajtos/mosaic/blob/master/DesignDecisions.md#mosaic)
- [x] [Blink](https://www.chromium.org/blink) rendering engine
- [x] Written in Typescript using React
- [x] Intuitive drag&drop tile managment, built on [Trellis](https://trellisui.com)
  - tiles are restored after restart
- [x] Built-in [DuckDuckGo](https://duckduckgo.com/) search engine
  - auto suggest while typing
  - use [!bang](https://duckduckgo.com/bang) for advanced searches
    - e.g. "!g hello" to google for "hello"
- [x] Minimalistic look
- [x] Dock
  - click an icon to open it as a new tile
- [x] Automatic zoom-to-fit of webpage
- [x] Familiar shortcuts for tab managment (⌘T, ⌘W)
- [ ] Built-in privacy
  - [ ] Adblock ([uBlock Origin](https://github.com/gorhill/uBlock))
  - [ ] Blocking cookie consent non-sense
  - [x] No history
  - [ ] HTTPS everywhere
- [ ] [System keychain integration](https://github.com/atom/node-keytar)

## Development

Requirements: [Git](https://git-scm.com/), [NodeJS](https://nodejs.org/en/), [Yarn](https://yarnpkg.com/)

Clone repository and install project dependencies:

```bash
$ git clone https://github.com/mlajtos/mosaic.git
$ cd mosaic
$ yarn
```

Live development

```bash
$ yarn dev
```

Type checking

```bash
$ yarn typecheck
```

## License

Mosaic is [MIT](LICENSE) licensed. It uses [Trellis](https://github.com/DanFessler/trellis) by Dan Fessler for its tiling, which is free for non-commercial use only; see [its license](licenses/Trellis-LICENSE-NONCOMMERCIAL.md). Using Mosaic commercially requires a [Trellis commercial license](https://github.com/DanFessler/trellis/blob/main/LICENSE.md).