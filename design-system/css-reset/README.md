# CSS reset

A base stylesheet for ADG.

## Installation

```sh
yarn add @atlaskit/css-reset
```

## Usage

[View documentation](https://atlassian.design/components/css-reset/).

## Standalone scrollbar appearance

Products that do not consume the full CSS reset can import only the harmonized scrollbar styles:

```ts
import '@atlaskit/css-reset/scrollbars.css';
```

The stylesheet remains inactive until the product adds `data-scrollbar-harmonisation` to the
document root. Products own feature-gate evaluation and attribute cleanup. Tracks are always
transparent; no separate transparency attribute is needed.

Only colors change: the thumb uses `color.background.accent.gray.subtle` and the track is
transparent, set once with `scrollbar-color` on the root and inherited. Scrollbar size, visibility
and overlay behavior stay native, so operating system preferences such as macOS "When scrolling" are
honored and apply live when changed. Custom WebKit scrollbar sizing is not used because browsers
never draw it as an overlay. Browsers without `scrollbar-color` support keep native colors. Forced
colors use browser colors.

In Chromium, a non-auto `scrollbar-color` disables `::-webkit-scrollbar` styles on the same element.
Components that own a custom WebKit scrollbar should set their own `scrollbar-color`, or
`scrollbar-color: auto`, on their scroll container.

The subtle token has approximately 3.24:1 contrast against the white page surface in light mode and
2.85:1 against the #1F1F21 page surface in dark mode; contrast is lower on raised and overlay
surfaces. This contrast is accepted for the harmonized treatment, which is not a claim of
accessibility conformance. Painted width and allocated width are not a target-size conformance
assessment.

### Avoiding a flash of un-harmonized scrollbars on SSR pages

The attributes above are normally installed on `document.documentElement` at runtime by
`useScrollbarHarmonisation` (`@atlaskit/app-provider/use-scrollbar-harmonisation`). On a
server-rendered page that hook only runs client-side, so scrollbars briefly render un-harmonized
until the effect fires. Products that render `<html>` from a server-side template can instead call
`getScrollbarHarmonisationHtmlAttrs`
(`@atlaskit/app-provider/get-scrollbar-harmonisation-html-attrs`) and spread its result onto the
server-rendered `<html>` element, so the attributes — and therefore these CSS rules — are present
from the very first paint.
