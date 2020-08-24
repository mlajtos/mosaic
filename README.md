<div align="center">
	<img src="showcase/Mosaic-0.0.1.gif" height="200">
	<h1>Mosaic</h1>
	<p>
		<b>Web browser that can display multiple web pages at the same time in one shared window.</b>
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
  - drag out icon from dock to make a new window
- [x] Automatic zoom-to-fit of webpage
- [x] Familiar shortcuts for tab managment (⌘T, ⌘W)
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

Create a distribution package for current platform (Mac, Linux, Windows):

```bash
$ yarn dist
```

## Packaging

Requirement: [Docker](https://www.docker.com/).

Run:

```
docker run --rm -ti  --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_')  --env ELECTRON_CACHE="/root/.cache/electron"  --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder"  -v ${PWD}:/project  -v ${PWD##*/}-node-modules:/project/node_modules  -v ~/.cache/electron:/root/.cache/electron  -v ~/.cache/electron-builder:/root/.cache/electron-builder  electronuserland/builder:wine
```

Inside the container:

```
yarn
yarn dist:linux_windows
```

## Contributors

- [@mdatko](https://github.com/mdatko)
- [@marc2332](https://github.com/marc2332)
- [@michalklempa](https://github.com/michalklempa)
