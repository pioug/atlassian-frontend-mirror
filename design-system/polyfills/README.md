# Polyfills

**This module has been deprecated**

Instead we now recommend Atlaskit consumers to support fetch, ES6 & ES7 using babel-preset-env & babel-polyfill.
The supported browser-list most Atlassian products use is:

```
  "ie >= 11",
  "last 2 Edge version",
  "last 2 Firefox version",
  "last 2 Chrome version",
  "last 2 Safari version",
  "last 2 iOS version",
  "last 2 Android version",
  "last 2 ChromeAndroid version"
```

This package contains @atlaskit/polyfills for native methods which are unsupported by some of the browsers that we target.

## Installation

```sh
yarn add @atlaskit/polyfills
```

## Usage

Detailed docs and example usage can be found [here](https://atlaskit.atlassian.com/packages/core/polyfills).
