# @atlaskit/stylelint-design-system

## 0.3.10

### Patch Changes

- [`61a0cc155e2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61a0cc155e2) - Augment design-sytem/ensure-design-token-usage rule to include spacing

## 0.3.9

### Patch Changes

- [`9827dcb82b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9827dcb82b8) - No-op change to introduce spacing tokens to design system components.

## 0.3.8

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 0.3.7

### Patch Changes

- [`631207af050`](https://bitbucket.org/atlassian/atlassian-frontend/commits/631207af050) - Manual bump of @atlaskit/tokens due to a bug with atlassian/changesets

## 0.3.6

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 0.3.5

### Patch Changes

- [`ec850b9fc2d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec850b9fc2d) - Improves lint coverage by ensuring all css variables are wrapped in a design token at the callsite.

  For example, the following will now error:

  ```
  color: var(--adg3-color-R75);
  ```

  and request that you wrap it in a token:

  ```
  color: var(--ds-text-danger, var(--adg3-color-R75));
  ```

  In addition, named colors such as `red, white, violet` will now error.

## 0.3.4

### Patch Changes

- Updated dependencies

## 0.3.3

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 0.3.2

### Patch Changes

- Updated dependencies

## 0.3.1

### Patch Changes

- [`578055b6cf2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/578055b6cf2) - Fix dependency issue with `@atlaskit/tokens` requiring minimum version ^0.8.1

## 0.3.0

### Minor Changes

- [`47d91601f23`](https://bitbucket.org/atlassian/atlassian-frontend/commits/47d91601f23) - - 'no-deprecated-design-token-usage' rule now provides fix for deprecated tokens by replacing with the recommended token replacement
  - 'no-unsafe-design-token-usage' rule now provides fix for deleted tokens by replacing with the recommended token replacement

## 0.2.3

### Patch Changes

- Updated dependencies

## 0.2.2

### Patch Changes

- [`541edde8e78`](https://bitbucket.org/atlassian/atlassian-frontend/commits/541edde8e78) - Upgrade `stylelint` from `8.x` to `14.x`

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [`04386dad0c2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/04386dad0c2) - Addition of new `no-deprecated-design-token-usage` rule, which mirrors its eslint counterpart

## 0.1.3

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- [`260878cb563`](https://bitbucket.org/atlassian/atlassian-frontend/commits/260878cb563) - The .npmignore file has been fixed, so that required files are no longer missing.

## 0.1.1

### Patch Changes

- Updated dependencies

## 0.1.0

### Minor Changes

- [`0c6d6d29289`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c6d6d29289) - Initial release introducing `ensure-design-token-usage` and `no-unsafe-design-token-usage` rules, which mirror their eslint counterparts.
