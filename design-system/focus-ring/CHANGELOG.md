# @atlaskit/focus-ring

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [`3e1a93c6b67`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e1a93c6b67) - Releases FocusRing to v1.

### Minor Changes

- [`63b8679585b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63b8679585b) - Adds an additional prop `focus` to the `FocusRing` to allow the component to also be controlled. This prop is designed to be used in conjunction with a complementary hook; `useFocusRing`.

## 0.2.7

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Updates usage of deprecated token names so they're aligned with the latest naming conventions. No UI or visual changes
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - [ux] The component has reworked its internal so that it can now better deal with issues where the background-color was obscured by the focus-ring box shadow.
- Updated dependencies

## 0.2.6

### Patch Changes

- Updated dependencies

## 0.2.5

### Patch Changes

- [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds for this package now pass through a tokens babel plugin, removing runtime invocations of the tokens() function and improving bundle size.
- Updated dependencies

## 0.2.4

### Patch Changes

- [`6c1c909296d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c1c909296d) - [ux] When composing elements that define class name they will now be correctly retained.
- Updated dependencies

## 0.2.3

### Patch Changes

- [`34282240102`](https://bitbucket.org/atlassian/atlassian-frontend/commits/34282240102) - Adds explicit type to button usages components.

## 0.2.2

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [`c765dce3afb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c765dce3afb) - [ux] Focus Ring now exposes an additional prop `isInset` to support inset focus states; for example on inputs, or textfields.
- [`0dac09c47b6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0dac09c47b6) - [ux] Colors are now sourced through tokens.

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- [`9c9296f2959`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9c9296f2959) - Fix bug where the package was being exported from the wrong file.

## 0.1.0

### Minor Changes

- [`5ab09801cfa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ab09801cfa) - [ux] Updates focus-ring to use an offset box-shadow for its focus state.
- [`adaa7913de0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/adaa7913de0) - Initial release for the package. A Focus Ring can be used to compose focusable elements with a simple composable API.

### Patch Changes

- Updated dependencies

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
