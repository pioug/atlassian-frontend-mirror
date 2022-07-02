# @atlaskit/embedded-confluence

## 1.2.1

### Patch Changes

- [`4a4c40be7b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a4c40be7b4) - Fix SSR (server-side rendering) stopped working with the dash in locale query param

## 1.2.0

### Minor Changes

- [`bfe9ff99aea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bfe9ff99aea) - Accept `locale` as an optional React prop for React components

## 1.1.0

### Minor Changes

- [`163e573186e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/163e573186e) - Support localization based on locale info provided by parent product

## 1.0.1

### Patch Changes

- [`4d30d4a0b8f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d30d4a0b8f) - Updating user documentation for @atlaskit/embedded-confluence

## 1.0.0

### Major Changes

- [`eb3d79230ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb3d79230ea) - First release of Confluence Embeddable Pages package!

## 0.1.1

### Patch Changes

- Updated dependencies

## 0.1.0

### Minor Changes

- [`1e1848e5689`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e1848e5689) - [ux] Instrumented '@atlaskit/embedded-confluence' with the new theming package, `@atlaskit/tokens`.

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
