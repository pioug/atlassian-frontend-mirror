# @atlaskit/primitives

## 0.11.0

### Minor Changes

- [`8bd6dc6027f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8bd6dc6027f) - Box backgroundColor prop now accepts full token names, abbreviated forms will no longer work. xCSS now accepts full token names, abbreviated forms will no longer work.

## 0.10.1

### Patch Changes

- [`b6302963111`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6302963111) - Change border.radius.normal to be 3px instead of 4px.
  `display: grid` is now accepted for `xcss`.

## 0.10.0

### Minor Changes

- [`313d71fce9c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/313d71fce9c) - Allow media queries at predefined breakpoints to be applied through xCSS.

## 0.9.5

### Patch Changes

- [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing unused dependencies and dev dependencies

## 0.9.4

### Patch Changes

- [`b19d5c53b64`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b19d5c53b64) - Internal changest to the primitives package related to token generated styles.
- [`4c4dcc3d571`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c4dcc3d571) - Updates primitives internal style map.
- Updated dependencies

## 0.9.3

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8
- [`e06d56c5a3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e06d56c5a3d) - Adds type hinting for `fill` CSS property.

## 0.9.2

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 0.9.1

### Patch Changes

- [`5a9e73494eb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a9e73494eb) - Updates to internal documentation.

## 0.9.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 0.8.9

### Patch Changes

- [`da1727baf77`](https://bitbucket.org/atlassian/atlassian-frontend/commits/da1727baf77) - Allow non tokenised values to be passed through for tokenisable properties like `padding`. Adds type hinting for zIndex CSS property.

## 0.8.8

### Patch Changes

- [`5a134a5128a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a134a5128a) - Adds type hinting for boxShadow CSS property. Fixes bug with token to CSS custom property transformation for gap, rowGap, columnGap.

## 0.8.7

### Patch Changes

- [`bad2da77917`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bad2da77917) - The Box primitive now accepts more elements for the 'as' prop

## 0.8.6

### Patch Changes

- [`b5b26f3d947`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b5b26f3d947) - Bugfix: 'padding' prop no longer takes (incorrect) precedence over any other padding props.

## 0.8.5

### Patch Changes

- [`0969a35c1b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0969a35c1b0) - Allow type hinting for nested styles inside pseudo-selectors.

## 0.8.4

### Patch Changes

- [`7127e85932a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7127e85932a) - Update codegen to explicitly list spacing prop values as string unions for compatibility with extract-react-types.

## 0.8.3

### Patch Changes

- [`64e7c72773e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/64e7c72773e) - Update type to allow typehints for CSS color property.

## 0.8.2

### Patch Changes

- [`983b1e61003`](https://bitbucket.org/atlassian/atlassian-frontend/commits/983b1e61003) - Fix Primitives pages being shown in prod despite being marked as alpha.

## 0.8.1

### Patch Changes

- [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils

## 0.8.0

### Minor Changes

- [`ac4c8695d3f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac4c8695d3f) - Constrain CSS values of flex-direction to account for accessibility considerations.
- [`4d19bdd2218`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d19bdd2218) - **Inline**:

  - `space` prop now accepts values in the form `space.XXX`. For example: `space="space.100"`.
  - `rowSpace` prop now accepts values in the form `space.XXX`. For example: `rowSpace="space.100"`.

  **Stack**:

  - `space` prop now accepts values in the form `space.XXX`. For example: `space="space.100"`.

## 0.7.1

### Patch Changes

- [`a02eed2974e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a02eed2974e) - Move codegen into @atlassian scope to publish it to private registry

## 0.7.0

### Minor Changes

- [`7e17a8b8934`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e17a8b8934) - Box:

  - Add xcss prop to enable token powered styling.

## 0.6.0

### Minor Changes

- [`4d60ec345a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d60ec345a5) - Remove internal/exploratory responsive props available in BaseBox.

## 0.5.0

### Minor Changes

- [`e379d04c74a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e379d04c74a) - Expose a new form of `xcss` that is parameterised so it can be statically bound to the intended usage context.

## 0.4.2

### Patch Changes

- [`fa26963628c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa26963628c) - Removes `customStyles` in favour of `xcss`.

## 0.4.1

### Patch Changes

- [`8e03331eb8b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8e03331eb8b) - Introduce 'as' prop to Inline and Stack so the resulting element can be controlled.

## 0.4.0

### Minor Changes

- [`003c381e37d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/003c381e37d) - Apply `width: 100%` to Inline and Stack when `grow` prop is set to `fill`.

## 0.3.3

### Patch Changes

- [`261420360ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/261420360ec) - Upgrades component types to support React 18.

## 0.3.2

### Patch Changes

- [`e7b64da97a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7b64da97a1) - Add `rowSpace` prop to override the `space` prop's spacing between rows.

## 0.3.1

### Patch Changes

- [`114d6a73f72`](https://bitbucket.org/atlassian/atlassian-frontend/commits/114d6a73f72) - Cleanup the experimental responsive box utilizing our responsive helpers.

## 0.3.0

### Minor Changes

- [`7c280fead96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c280fead96) - Add new responsive helpers, breakpoints config, and types into `@atlaskit/primitives/responsive`. Exports are treated as `UNSAFE_` and experimental until modified as they're being worked on in parallel to our Alpha Grid.

## 0.2.2

### Patch Changes

- [`bf90d854748`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf90d854748) - Internal representation of Box primitive now supports some responsive styles

## 0.2.1

### Patch Changes

- [`5b886634089`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b886634089) - [ux] Change Box to be the default export from `@atlaskit/primitives/box`. Fix the negative value of `margin-inline` in Inline `separator` not being applied properly.

## 0.2.0

### Minor Changes

- [`228cce759e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/228cce759e8) - Create Box component.

## 0.1.1

### Patch Changes

- [`fe50d8cb56c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe50d8cb56c) - Internal change to add shape tokens to primitives.
- Updated dependencies

## 0.1.0

### Minor Changes

- [`eeb8baa5d74`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eeb8baa5d74) - - Create `Stack` component
  - Create `Inline` component

## 0.0.2

### Patch Changes

- [`069494fbea6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/069494fbea6) - Internal change. There is no behaviour or visual change.
- Updated dependencies

## 0.0.1

### Patch Changes

- [`87074bc6cb3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87074bc6cb3) - Initial release of package scaffold.
