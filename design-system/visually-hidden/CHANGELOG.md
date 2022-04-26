# @atlaskit/visually-hidden

## 1.0.1

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 1.0.0

### Major Changes

- [`08ce7935675`](https://bitbucket.org/atlassian/atlassian-frontend/commits/08ce7935675) - Update `@atlaskit/visually-hidden` to v1. No breaking changes from previous version.

  `@atlaskit/visually-hidden` now exposes an additional `id` prop. This prop is exposed to allow consumers to pair the component with the
  `aria-describedby` HTML attribute.

## 0.1.2

### Patch Changes

- [`248133ff889`](https://bitbucket.org/atlassian/atlassian-frontend/commits/248133ff889) - Fixes the name of the entrypoint in package.json

## 0.1.1

### Patch Changes

- [`cd34d8ca8ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd34d8ca8ea) - Internal wiring up to the tokens techstack, no code changes.

## 0.1.0

### Minor Changes

- [`4a26bfd6414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a26bfd6414) - Initial release of the visually hidden component. This component should be used as an accessbility tool to wrap content for screen readers that would otherwise not be relevant in the natural flow of the page.

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
