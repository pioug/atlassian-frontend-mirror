# @atlaskit/analytics-cross-product

## 2.1.0

### Minor Changes

- [`6b9f343eca6ce`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6b9f343eca6ce) -
  Clean up rolled-out cross_product_wrapper_react_safe feature gate; useCrossProductUrlWrapper now
  always uses the React-safe implementation

## 2.0.0

### Major Changes

- [`f2dc9097319f0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f2dc9097319f0) - ###
  Dropped support for _legacy_ Typescript 4 types. **Typescript 5 is now the new minimum**.

  Removes the `typesVersions` property and `dist/types-ts4.5` directory from the dist.

  Types are now exclusively via the `"types": "dist/types/index.d.ts"` property.

  ```diff
  - "typesVersions": {
  -    ">=4.5 <4.9": {
  -        "*": [
  -            "dist/types-ts4.5/*",
  -            "dist/types-ts4.5/index.d.ts"
  -        ]
  -    }
  - },
  ```

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [`5887ba08efb41`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5887ba08efb41) -
  Add cross_product_wrapper_react_safe feature gate to route useCrossProductUrlWrapper to a
  React-safe implementation that eagerly initialises the interaction session client ref and uses a
  single stable useCallback. Old behaviour is preserved as useCrossProductUrlWrapper_DEPRECATED.

## 1.1.0

### Minor Changes

- [`3f23aba4db7f2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3f23aba4db7f2) -
  Autofix: add explicit package exports (barrel removal)

## 1.0.1

### Patch Changes

- [`b4f0528444f65`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b4f0528444f65) -
  Cleanup console error logs
