# @atlaskit/date-label

## 1.0.4

### Patch Changes

- Updated dependencies

## 1.0.3

### Patch Changes

- [`1233133cba8f7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1233133cba8f7) -
  Updated the `spacious` neutral-appearance `DateLabel` and `DateLabelDropdownTrigger` colors to
  match a `subtle` Button: `color.border` border, `color.text.subtle` text, and `currentColor` icon.

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

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
