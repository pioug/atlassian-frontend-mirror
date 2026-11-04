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
document root. Products own feature-gate evaluation and attribute cleanup. Tracks are always
transparent; no separate transparency attribute is needed.

On browsers supporting the required WebKit scrollbar selectors, with a fine pointer, hover support,
and no coarse pointer, the thumb paints at a fixed 8px inside a 12px scrollbar allocation (2px
transparent insets). It uses `color.background.accent.gray.subtle` at rest and
`color.background.accent.gray.bolder` while the thumb is hovered or pressed. Its width does not
grow; the browser controls its length. Component-owned scrollbar styles take precedence.

Other environments use the same inherited `color.background.accent.gray.subtle` thumb colour and
`scrollbar-width: thin` on scroll containers. The browser chooses the pixel width for `thin`;
browsers without that property retain native sizing. Direct-thumb hover/pressed highlighting is
available only on the supported WebKit selector path described above. Forced colours use browser
colours and native sizing. Custom sizing can affect operating system scrollbar appearance; validate
supported browsers and user preferences before rollout.

The subtle token has approximately 3.24:1 contrast against the white page surface in light mode and
2.85:1 against the #1F1F21 page surface in dark mode; contrast is lower on raised and overlay
surfaces. This contrast is accepted for the harmonised treatment, which is not a claim of
accessibility conformance. Painted width and allocated width are not a target-size conformance
assessment.

### Avoiding a flash of un-harmonised scrollbars on SSR pages

The attributes above are normally installed on `document.documentElement` at runtime by
`useScrollbarHarmonisation` (`@atlaskit/app-provider/use-scrollbar-harmonisation`). On a
server-rendered page that hook only runs client-side, so scrollbars briefly render un-harmonised
until the effect fires. Products that render `<html>` from a server-side template can instead call
`getScrollbarHarmonisationHtmlAttrs`
(`@atlaskit/app-provider/get-scrollbar-harmonisation-html-attrs`) and spread its result onto the
server-rendered `<html>` element, so the attributes — and therefore these CSS rules — are present
from the very first paint.
