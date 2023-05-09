# Pragmatic drag and drop

A performance optimized drag and drop framework

> ℹ️ This package is in early access. We have not yet guaranteed API stability

## Background

There are a wealth of existing drag and drop libraries for the web. Some drag and drop libraries are general purpose (e.g. `@shopify/draggable`, `react-dnd`), and some are for specific experiences (e.g. `react-beautiful-dnd` is for lists and connected lists). Some libraries leverage the platform's built in drag and drop capabilities, and some rebuild the drag and drop operation from scratch.

Every drag and drop solution will make tradeoffs regarding feature sets, user experience, startup performance and runtime performance.

The goals of `@atlaskit/pragmatic-drag-and-drop` are:

- 🚀 Speed: Best of class startup and runtime performance
- 🤸 Flexibility: Can be used to power any interaction
- 🧑‍🦽 Accessibility\*: Ensuring that all users have a good experience

> \*Accessible experiences are achieved through alternative keyboard and screen reader flows. Unfortunately, the browsers drag and drop behaviour is not accessible (yet). But don't worry, we have a comprehensive guide and toolchain to help you be successful here

## Core characteristics

- 🌎 Platform powered: leverages the browsers drag and drop capabilities
- 🐁 Tiny: ~`4.5kB` base
- 🪡 Incremental: only pay for what you use
- ⏳ Deferred compatible: consumers can delay the loading of `@atlaskit/pragmatic-drag-and-drop` (and related packages) in order to improve page load speeds
- 🎨 Headless: full rendering and style control
- 🦊 Cross browser support: full feature support in Firefox, Safari and Chrome
- 📱 Touch device compatible
- 🎁 Addons: patterns that allow sharing small pieces of functionality that can be added together
- 🎄 Framework agnostic: works with any frontend framework
- 👾 Virtualization support
- 🧑‍🦽 Accessible: comprehensive toolchain and patterns for creating highly accessible experiences

## Installation

```sh
yarn add @atlaskit/pragmatic-drag-and-drop
```

## Usage

Detailed docs and example usage can be found on [atlassian.design](https://atlassian.design/components/pragmatic-drag-and-drop/).
