# Portal

A wrapper for rendering components in React portals.

## Deprecated

This package is deprecated. Do not add new usages. The browser top layer renders layered UI above
the page without a portal. Use a design system layer component (for example Popup, Tooltip or Modal
dialog), or `Popover` and `Dialog` from `@atlaskit/top-layer`. Content portalled to `document.body`
renders below every open top-layer surface. Design system components still use Portal on their
`platform-dst-top-layer` gate-off path. A ratchet blocks new imports; existing imports stay until
the top-layer rollout is cleaned up.

## Installation

```sh
yarn add @atlaskit/portal
```

## Usage

[View documentation](https://atlassian.design/components/portal/).
