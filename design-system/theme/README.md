# Theme

> **Deprecated:** `@atlaskit/theme` is deprecated. Use design tokens, Atlassian Design System
> components, or Top Layer as appropriate.

## Migration

- Replace color, spacing, typography, elevation, and other styling values with design tokens from
  [`@atlaskit/tokens`](https://atlassian.design/components/tokens).
- Replace `layers` with an Atlassian Design System layered component where possible. When building a
  low-level overlay, use [`@atlaskit/top-layer`](https://atlassian.design/components/top-layer). Top
  Layer manages overlay stacking through the browser's top layer; it is not a numeric `z-index` map
  and is not a drop-in replacement for `layers`.
- Replace `Theme`, `createTheme`, `getTheme`, and their associated types with design tokens and the
  supported customization APIs of the relevant Atlassian Design System component. There is no
  package-wide, one-to-one replacement for these legacy theming APIs.
- Remove direct use of legacy theme constants and types when no replacement is required.

Do not add new dependencies on this package.
