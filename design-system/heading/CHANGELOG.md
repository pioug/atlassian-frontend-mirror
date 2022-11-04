# @atlaskit/heading

## 0.1.18

### Patch Changes

- [`bc989043572`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc989043572) - Internal changes to apply spacing tokens. This should be a no-op change.

## 0.1.17

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 0.1.16

### Patch Changes

- [`30b11aab9fb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30b11aab9fb) - Updates `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.
- Updated dependencies

## 0.1.15

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 0.1.14

### Patch Changes

- [`47b01007f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/47b01007f27) - Introduces color prop with values default and inverse.

## 0.1.13

### Patch Changes

- [`354050b68da`](https://bitbucket.org/atlassian/atlassian-frontend/commits/354050b68da) - Revert font size calculations to raw pixels.

## 0.1.12

### Patch Changes

- Updated dependencies

## 0.1.11

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 0.1.10

### Patch Changes

- Updated dependencies

## 0.1.9

### Patch Changes

- Updated dependencies

## 0.1.8

### Patch Changes

- Updated dependencies

## 0.1.7

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Updates usage of deprecated token names so they're aligned with the latest naming conventions. No UI or visual changes
- Updated dependencies

## 0.1.6

### Patch Changes

- Updated dependencies

## 0.1.5

### Patch Changes

- [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds for this package now pass through a tokens babel plugin, removing runtime invocations of the tokens() function and improving bundle size.
- Updated dependencies

## 0.1.4

### Patch Changes

- Updated dependencies

## 0.1.3

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- [`d7a9a4ff7ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7a9a4ff7ec) - Instrumented heading with the new theming package, `@atlaskit/tokens`.
  New tokens will be visible only in applications configured to use the new Tokens API (currently in alpha).
  These changes are intended to be interoperable with the legacy theme implementation.
  Legacy dark mode users should expect no visual or breaking changes.
- Updated dependencies

## 0.1.0

### Minor Changes

- [`ee15e59ba60`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ee15e59ba60) - This is the initial release of the Heading package. Typography styles have been duplicated from the `@atlaskit/theme` package as standalone components.

### Patch Changes

- [`46816ee8526`](https://bitbucket.org/atlassian/atlassian-frontend/commits/46816ee8526) - Changes heading element mappings to match '@atlaskit/css-reset'.
- [`f9cd2065648`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f9cd2065648) - Removed redundant styles for text-transform, moved font-size to `rem` insteda of `em`.
- Updated dependencies
