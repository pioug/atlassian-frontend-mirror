# Navigation System

The latest navigation system for Atlassian apps.

Atlassian’s navigation is made of these basic parts:

- The layout defines clear areas for navigation elements
- Side navigation menus create a consistent feel for actions and links
- Top navigation elements provide familiar spots for common features

## Installation

Note: the package will be renamed to `@atlaskit/navigation-system` in the next release, and will be
made public and published to npm. The existing `@atlassian/navigation-system` package will still be
available in Atlassian's internal registry, but will be deprecated. There will be no support for the
private package going forwards - you should migrate to the new `@atlaskit/navigation-system`
package.

```sh
yarn add @atlaskit/navigation-system
```

## Usage

Detailed docs and example usage can be found
[here](https://atlassian.design/components/navigation-system/).

### Positioning controls beside a local panel

For global controls outside the layout, the primary `Root` can opt into
`UNSAFE_dangerouslyHoistSlotSizes`. Its `PanelLayout` then publishes its rendered border-box width
on the document element, using `localPanelWidthVar` from
`@atlaskit/navigation-system/layout/panel-layout`:

```tsx
import type { localPanelWidthVar } from '@atlaskit/navigation-system/layout/panel-layout';

// A type-checked literal keeps static styles compatible with Compiled.
style={{ right: `calc(var(${'--n_localPanelWidth' satisfies typeof localPanelWidthVar}, 0px) + 24px)` }}
```

The value follows both inline and overlay widths, including CSS constraints before the deferred
resize coordinator activates. It is removed when the panel surface unmounts; use the `0px` fallback
when closed or before hydration. Only one primary Root should enable global size hoisting. This
variable is for positioning external controls, not for sizing the panel or persisting a preferred
width. The legacy Panel's `--rightPanelWidth` contract is unchanged.
