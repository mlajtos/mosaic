<div align="center">
  <img src="showcase/Mosaic-0.0.1.gif">
  <h1>Mosaic</h1>
  <p>
    <b>Web browser that can display multiple web pages at the same time in one shared window. <em>A tiling web browser.</em></b>
  </p>
    <p>
        Latest release: <a href="https://github.com/mlajtos/mosaic/releases/tag/v0.0.3">0.0.3</a> <br> <a href="https://github.com/mlajtos/mosaic/releases/tag/v0.0.3">Download</a> · <a href="https://github.com/mlajtos/mosaic/blob/master/CHANGELOG.md">Changelog</a>
    </p>
    <br>
</div>

## Features

- [x] Documented [Design Decisions](DesignDecisions.md)
  - [Why the name Mosaic?](https://github.com/mlajtos/mosaic/blob/master/DesignDecisions.md#mosaic)
- [x] [Blink](https://www.chromium.org/blink) rendering engine
- [x] Written in Typescript using React
- [x] Intuitive drag&drop tile managment
- [x] Built-in [DuckDuckGo](https://duckduckgo.com/) search engine
  - auto suggest while typing
  - use [!bang](https://duckduckgo.com/bang) for advanced searches
    - e.g. "!g hello" to google for "hello"
- [x] Minimalistic dark look
- [x] Dock
  - drag out icon from dock to make a new tab
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

Create a distribution package for all platforms (Mac, Linux, Windows):

```bash
$ yarn dist
```

## Contributors

- [@mdatko](https://github.com/mdatko)
- [@marc2332](https://github.com/marc2332)
- [@michalklempa](https://github.com/michalklempa)
