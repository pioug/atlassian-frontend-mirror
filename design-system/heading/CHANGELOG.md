# @atlaskit/heading

## 1.3.1

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 1.3.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 1.2.1

### Patch Changes

- [`e0460d5d989`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0460d5d989) - Usages of `process` are now guarded by a `typeof` check.

## 1.2.0

### Minor Changes

- [`261420360ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/261420360ec) - Upgrades component types to support React 18.

## 1.1.4

### Patch Changes

- [`cfe48bb7ece`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfe48bb7ece) - Internal change only. Replace usages of Inline/Stack with stable version from `@atlaskit/primitives`.

## 1.1.3

### Patch Changes

- [`b6c5779d358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6c5779d358) - Internal changes only to restrict usage of `Box` from the primitives package.

## 1.1.2

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- [`18aeca8c199`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18aeca8c199) - Internal change to update token references. There is no expected behaviour or visual change.

## 1.1.0

### Minor Changes

- [`fce52a022f5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fce52a022f5) - Adds typography tokens to @atlaskit/heading.

## 1.0.4

### Patch Changes

- Updated dependencies

## 1.0.3

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- [`95fdae34c94`](https://bitbucket.org/atlassian/atlassian-frontend/commits/95fdae34c94) - Revert experimental change to `@compiled/react` from `@emotion/react`.

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [`7d92ed50264`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d92ed50264) - [ux] This package is still considered to be in an experimental state and is discouraged for use in production. The major is to simplify consumption and versioning in product.

  Other changes:

  - Introduction of a `HeadingContext` provider to aid with creating the right semantic structure for headings.
  - Migrated internals to use `@compiled/react` from `@emotion/react`.

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
