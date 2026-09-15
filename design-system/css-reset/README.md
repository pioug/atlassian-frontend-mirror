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

### Avoiding a flash of un-harmonised scrollbars on SSR pages

The attributes above are normally installed on `document.documentElement` at runtime by
`useScrollbarHarmonisation` (`@atlaskit/app-provider/use-scrollbar-harmonisation`). On a
server-rendered page that hook only runs client-side, so scrollbars briefly render un-harmonised
until the effect fires. Products that render `<html>` from a server-side template can instead call
`getScrollbarHarmonisationHtmlAttrs`
(`@atlaskit/app-provider/get-scrollbar-harmonisation-html-attrs`) and spread its result onto the
server-rendered `<html>` element, so the attributes — and therefore these CSS rules — are present
from the very first paint.
