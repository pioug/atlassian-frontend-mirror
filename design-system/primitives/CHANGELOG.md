# @atlaskit/primitives

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
