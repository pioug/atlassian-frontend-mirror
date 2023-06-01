# @atlaskit/tree

## 8.8.5

### Patch Changes

- [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing unused dependencies and dev dependencies

## 8.8.4

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 8.8.3

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 8.8.2

### Patch Changes

- [`a1935b9b9bc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1935b9b9bc) - Upgrading @atlaskit/tokens dependency to version 1.3.2

## 8.8.1

### Patch Changes

- [`ea97cc58f54`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea97cc58f54) - Internal change to enforce token usage for spacing properties. There is no expected visual or behaviour change.

## 8.8.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

## 8.7.0

### Minor Changes

- [`813b1a6ca29`](https://bitbucket.org/atlassian/atlassian-frontend/commits/813b1a6ca29) - Migrate tree package to declarative entry points

## 8.6.3

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 8.6.2

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 8.6.1

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 8.6.0

### Minor Changes

- [`7becb9517f5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7becb9517f5) - Fixed bug where drag and drop is broken in the case where only some tree items are draggable (i.e. passing a function to the isDragEnabled prop)

## 8.5.0

### Minor Changes

- [`1fb6e5f07eb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1fb6e5f07eb) - Performance optimization which prevents Draggables from being rendered if drag and drop is disabled

## 8.4.0

### Minor Changes

- [`996a944785e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/996a944785e) - [ux] nondraggable and draggable tree items will both re-render every time the tree renders. This allows draggable/nondraggable items to behave the same.

## 8.3.0

### Minor Changes

- [`7d9095756b7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d9095756b7) - [ux] nondraggable and draggable tree items will both re-render every time the tree renders. This allows draggable/nondraggable items to behave the same.

## 8.2.0

### Minor Changes

- [`955641ffdc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/955641ffdc) - Add the ability to specify `isDragEnabled` as a function. This will allow to control whether the item is draggable or not on a per-item basis.

## 8.1.3

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 8.1.2

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 8.1.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 8.1.0

### Minor Changes

- [`5584033c5e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5584033c5e) - Fixed missing react beautiful D&D placeholder behavior

## 8.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 7.1.2

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/button@13.3.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/navigation@36.0.1
  - @atlaskit/spinner@12.1.4
  - @atlaskit/theme@9.5.1

## 7.1.1

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/icon@20.0.0
  - @atlaskit/navigation@36.0.0
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6

## 7.1.0

### Minor Changes

- [minor][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Moving to react-beautiful-dnd-next in order to lock package to 11.x API. Tree is not compatible with 12.x for now

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Fixes a bug in Tree that causes children of other nodes to show unexpectedly when clicking on a parent- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  - @atlaskit/navigation@35.3.0

## 7.0.2

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 7.0.1

### Patch Changes

- [patch][2b158873d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b158873d1):

  Add linting rule to prevent unsafe usage of setTimeout within React components.

## 7.0.0

### Major Changes

- [major][ec1bf6161f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec1bf6161f):

  @atlaskit/tree has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 6.0.9

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 6.0.8

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 6.0.7

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 6.0.6

### Patch Changes

- [patch][b7c0cddc30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b7c0cddc30):

  Removed unused dependencies from package.json for tree: memoize-one was unused.

## 6.0.5

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/navigation@35.1.8
  - @atlaskit/icon@19.0.0

## 6.0.4

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 6.0.3

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/navigation@35.1.5
  - @atlaskit/icon@18.0.0

## 6.0.2

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 6.0.1

- Updated dependencies [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
  - @atlaskit/button@13.0.4
  - @atlaskit/spinner@12.0.0

## 6.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 5.0.3

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/icon@16.0.9
  - @atlaskit/navigation@34.0.4
  - @atlaskit/section-message@2.0.3
  - @atlaskit/spinner@10.0.7
  - @atlaskit/theme@8.1.7

## 5.0.2

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/icon@16.0.8
  - @atlaskit/navigation@34.0.3
  - @atlaskit/section-message@2.0.2
  - @atlaskit/spinner@10.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 5.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/navigation@34.0.1
  - @atlaskit/section-message@2.0.1
  - @atlaskit/spinner@10.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0

## 5.0.0

- [major][76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):

  - Drop ES5 from all the flow modules

  ### Dropping CJS support in all @atlaskit packages

  As a breaking change, all @atlaskit packages will be dropping cjs distributions and will only distribute esm. This means all distributed code will be transpiled, but will still contain `import` and
  `export` declarations.

  The major reason for doing this is to allow us to support multiple entry points in packages, e.g:

  ```js
  import colors from `@atlaskit/theme/colors`;
  ```

  Previously this was sort of possible for consumers by doing something like:

  ```js
  import colors from `@atlaskit/theme/dist/esm/colors`;
  ```

  This has a couple of issues. 1, it treats the file system as API making internal refactors harder, we have to worry about how consumers might be using things that aren't _actually_ supposed to be used. 2. We are unable to do this _internally_ in @atlaskit packages. This leads to lots of packages bundling all of theme, just to use a single color, especially in situations where tree shaking fails.

  To support being able to use multiple entrypoints internally, we unfortunately cannot have multiple distributions as they would need to have very different imports from of their own internal dependencies.

  ES Modules are widely supported by all modern bundlers and can be worked around in node environments.

  We may choose to revisit this solution in the future if we find any unintended condequences, but we see this as a pretty sane path forward which should lead to some major bundle size decreases, saner API's and simpler package architecture.

  Please reach out to #fabric-build (if in Atlassian) or create an issue in [Design System Support](https://ecosystem.atlassian.net/secure/CreateIssue.jspa?pid=24670) (for external) if you have any questions or queries about this.

## 4.1.11

- [patch][e3b442c128](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e3b442c128):

  - Adopting API changes in Icon for examples

## 4.1.10

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/navigation@33.3.9
  - @atlaskit/section-message@1.0.16
  - @atlaskit/icon@16.0.0

## 4.1.9

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/icon@15.0.2
  - @atlaskit/navigation@33.3.8
  - @atlaskit/section-message@1.0.14
  - @atlaskit/spinner@9.0.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 4.1.8

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/icon@15.0.1
  - @atlaskit/navigation@33.3.7
  - @atlaskit/section-message@1.0.13
  - @atlaskit/spinner@9.0.12
  - @atlaskit/theme@7.0.0

## 4.1.7

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/navigation@33.3.6
  - @atlaskit/section-message@1.0.12
  - @atlaskit/icon@15.0.0

## 4.1.6

- [patch][ce60809](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce60809):

  - Replace react-beautiful-dnd-next dependency with react-beautiful-dnd@10.0.2

## 4.1.5

- [patch][6c250fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c250fe):

  - Upgrading react-beautiful-dnd-next to 10.0.0-beta.2

## 4.1.4

- [patch][7b08fd4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7b08fd4):

  - Solving race condition when dropping and nesting at the same time

## 4.1.3

- [patch][5de65a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5de65a9):

  - Upgrading react-beautiful-dnd-next to 10.0.0-alpha.5

## 4.1.2

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 4.1.1

- [patch] Fixing drag&drop on clipped trees [b18ecfe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b18ecfe)

## 4.1.0

- [minor] Expanded parent item is collapsed while dragged. [192b3e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/192b3e2)

## 4.0.0

- [major] Implementing nesting and expanding parents while dragging [2bdbf04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2bdbf04)

## 3.0.4

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/navigation@33.1.11
  - @atlaskit/section-message@1.0.8
  - @atlaskit/icon@14.0.0

## 3.0.3

- [patch] Collapsing parent automatically when last child moved out [f4992db](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f4992db)

## 3.0.2

- [patch] Fixing issue of not calling onDragStart when drag&drop starts [d7be874](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7be874)

## 3.0.1

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 3.0.0

- [major] Horizontal movement to disambiguate the case when the user is dropping at end of subtree [9ee9657](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ee9657)

## 2.0.6

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/spinner@9.0.6
  - @atlaskit/section-message@1.0.5
  - @atlaskit/navigation@33.1.5
  - @atlaskit/icon@13.2.5
  - @atlaskit/docs@5.0.6

## 2.0.5

- [patch] Bumping react-beautiful-dnd to version 9. Making use of use onBeforeDragStart for dynamic table [9cbd494](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cbd494)
- [none] Updated dependencies [9cbd494](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cbd494)
  - @atlaskit/navigation@33.1.4

## 2.0.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/navigation@33.1.3
  - @atlaskit/theme@5.1.3
  - @atlaskit/spinner@9.0.5
  - @atlaskit/section-message@1.0.4
  - @atlaskit/icon@13.2.4

## 2.0.3

- [patch] Bumping react-beautiful-dnd to 8.0.7 to fix timing issue with onDragStart [812a39c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/812a39c)

## 2.0.2

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/navigation@33.1.2
  - @atlaskit/icon@13.2.2
  - @atlaskit/section-message@1.0.3
  - @atlaskit/theme@5.1.2
  - @atlaskit/spinner@9.0.4
  - @atlaskit/docs@5.0.2

## 2.0.1

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/theme@5.1.1
  - @atlaskit/spinner@9.0.3
  - @atlaskit/section-message@1.0.2
  - @atlaskit/navigation@33.1.1
  - @atlaskit/icon@13.2.1

## 2.0.0

- [major] Disabling drag&drop by default. [63de261](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/63de261)

## 1.1.0

- [minor] Introducing Drag&Drop functionality to atlaskit/tree [98fe2b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98fe2b5)

* [none] Updated dependencies [87cd977](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87cd977)
  - @atlaskit/navigation@33.0.5
* [none] Updated dependencies [22efc08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/22efc08)
  - @atlaskit/navigation@33.0.5

## 1.0.1

- [patch] Update docs, change dev deps [25d6e48](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d6e48)
- [none] Updated dependencies [25d6e48](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d6e48)

## 1.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/navigation@33.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/navigation@33.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0

## 0.1.2

- [patch] Updated dependencies [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
  - @atlaskit/spinner@8.0.0

## 0.1.1

- [patch] Bump version of spinner [1adf8d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1adf8d1)

## 0.1.0

- [minor] Developer preview version of @atlaskit/tree component [79b10a4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79b10a4)
