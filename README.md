# Mosaic – A Tiling Web Browser

Web browser that can display multiple web pages at the same time in one shared window.

[![](showcase/Mosaic-0.0.1.gif)](showcase/Mosaic-0.0.1.gif)

## Features

- [x] Documented [Design Decisions](DesignDecisions.md)
- [x] Pure Electron app, i.e. not based on Chromium
- [x] Intuitive drag&drop tile managment
- [x] Built-in search engine ([DDG](https://duckduckgo.com/))
    - auto suggest while typing
    - use [!bang](https://duckduckgo.com/bang) for advanced searches
- [x] Minimalistic look
- [x] Dock
- [x] Automatic zoom-to-fit
- [ ] Website thumbnail on tab hover and drag
- [ ] Familiar shortcuts (⌘T, ⌘W, ⌘L, ⌘←, ⌘→)
- [ ] Built-in privacy
    - [ ] Adblock ([uBlock Origin](https://github.com/gorhill/uBlock))
    - [ ] Blocking cookie consent non-sense
    - [x] No history
    - [ ] HTTPS everywhere
- [ ] [System keychain integration](https://github.com/atom/node-keytar)

## Download

- [Mosaic for Mac 0.0.1 (DMG)](https://github.com/mlajtos/mosaic/releases/download/v0.0.1/Mosaic-0.0.1.dmg)
- [Mosaic for Windows 0.0.1 (Installer)](https://github.com/mlajtos/mosaic/releases/download/v0.0.1/Mosaic.Setup.0.0.1.exe)

## Development

System prerequisites: [Git](https://git-scm.com/), [NodeJS](https://nodejs.org/en/), [Yarn](https://yarnpkg.com/)


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

Create a distribution package for current platform (Mac, Linux, Windows):

```bash
$ yarn dist
```

## Packaging
Requirement: [`docker`]().
Run:
```
docker run --rm -ti  --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_')  --env ELECTRON_CACHE="/root/.cache/electron"  --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder"  -v ${PWD}:/project  -v ${PWD##*/}-node-modules:/project/node_modules  -v ~/.cache/electron:/root/.cache/electron  -v ~/.cache/electron-builder:/root/.cache/electron-builder  electronuserland/builder:wine
```
Inside the container:
```
yarn
yarn dist:linux_windows
```

## Thank you

[@mdatko](https://github.com/mdatko) for Windows build