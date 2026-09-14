# CSS reset

A base stylesheet for ADG.

## Installation

```sh
yarn add @atlaskit/css-reset
```

## Usage

[View documentation](https://atlassian.design/components/css-reset/).

## Standalone scrollbar appearance

Products that do not consume the full CSS reset can import only the harmonised scrollbar styles:

```ts
import '@atlaskit/css-reset/scrollbars.css';
```

The stylesheet remains inactive until the product adds `data-scrollbar-harmonisation` to the
document root. Products own feature-gate evaluation and attribute cleanup. To use the transparent
track treatment, add `data-scrollbar-harmonisation-transparent` to that same root only while the
base treatment is active. Browser and operating system scrollbar width and visibility preferences
remain unchanged.
