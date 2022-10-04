# @af/frontend-utilities

## 2.0.1

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 2.0.0

### Major Changes

- [`6546b9fda06`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6546b9fda06) - Removed the markdown renderer as it is not needed

## 1.1.1

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 1.1.0

### Minor Changes

- [`09e1f73b86e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/09e1f73b86e) - Added documentation for the frontend utilities, as well as a MarkdownRenderer component

## 1.0.0

### Major Changes

- [`efa6d1d7755`](https://bitbucket.org/atlassian/atlassian-frontend/commits/efa6d1d7755) - Initial version of the frontend-utilities package

## 0.1.8

### Patch Changes

- [`be85240a978`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be85240a978) - Upgrades to emotion 11.

## 0.1.7

### Patch Changes

- [`a2bcd45904d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2bcd45904d) - Adds examples for psuedo classes and style tests.

## 0.1.6

### Patch Changes

- [`750d311806c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/750d311806c) - Updates template to use static styles.

## 0.1.5

### Patch Changes

- [`38e489b2ba3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/38e489b2ba3) - Adding "dom-events" tech stack rule to template package

## 0.1.4

### Patch Changes

- [`39c585a4fd5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/39c585a4fd5) - Remove emoji from example code as it fails the eslint precommit hook.

## 0.1.3

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 0.1.1

### Patch Changes

- Updated dependencies

## 0.1.0

### Minor Changes

- [`1e1848e5689`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e1848e5689) - [ux] Instrumented '@af/frontend-utilities' with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in alpha).
  These changes are intended to be interoperable with the legacy theme implementation. Legacy dark mode users should expect no visual or breaking changes.

## 0.0.9

### Patch Changes

- [`884191bbb30`](https://bitbucket.org/atlassian/atlassian-frontend/commits/884191bbb30) - Update Copyright 2022 Atlassian Pty Ltd

## 0.0.8

### Patch Changes

- [`12c6ef62cb6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12c6ef62cb6) - Fix build/tsconfig.json to exclude examples folder in `src`.

## 0.0.7

### Patch Changes

- Updated dependencies

## 0.0.6

### Patch Changes

- [`63369507489`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63369507489) - Update build/tsconfig.json to exclude tests and examples.

## 0.0.5

### Patch Changes

- [`524b20aff9a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/524b20aff9a) - Update package.jsons to remove unused dependencies. Also excludes tests from some build tsconfigs
- [`3c0349f272a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c0349f272a) - Update package.jsons to remove unused dependencies. Also excludes tests from some build tsconfigs
- [`591d34f966f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/591d34f966f) - Update package.jsons to remove unused dependencies. Also excludes tests from some build tsconfigs

## 0.0.4

### Patch Changes

- [`229b32842b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/229b32842b5) - Fix .npmignore and tsconfig.json for **tests**

## 0.0.3

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 0.0.2

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 0.0.1

### Patch Changes

- [`b443b5a60f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b443b5a60f) - Renamed template package
