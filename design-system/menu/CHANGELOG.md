# @atlaskit/menu

## 0.4.6

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 0.4.5

### Patch Changes

- [`d674e203b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d674e203b3) - Previously Menu items controlled their own margin spacing which caused issues when trying to use them outside of Menu.
  Now we have moved Menu item margin styles into the Section component so now the Section dictates the spacing around child items.
  We had to update Side Navigation to control its child item margins as well.

## 0.4.4

### Patch Changes

- [`649f69b6d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/649f69b6d7) - Patch all packages that are used by confluence that have a broken es2019 dist

## 0.4.3

### Patch Changes

- [`eb2ed36f5a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb2ed36f5a) - Fix characters with descenders (eg. 'g', 'j', 'p') in Menu Items from being clipped by increasing the line-height.

## 0.4.2

### Patch Changes

- [`0b64c87548`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b64c87548) - FIX: Global `a:visited` styles should not override LinkItem `:visited` styles

## 0.4.1

### Patch Changes

- [patch][1e7e54c20e](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e7e54c20e):

  Change imports to comply with Atlassian conventions- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):

- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [167a55fd7a](https://bitbucket.org/atlassian/atlassian-frontend/commits/167a55fd7a):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/avatar@17.1.10

## 0.4.0

### Minor Changes

- [minor][7e408e4037](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e408e4037):

  **BREAKING** - renames `elemBefore` and `elemAfter` props to `iconBefore` and `iconAfter` on all item components.- [minor][41760ea4a6](https://bitbucket.org/atlassian/atlassian-frontend/commits/41760ea4a6):

  **BREAKING**: modifies custom item component to take only valid HTML attributes. This means `wrapperClass` is now known as `className`.- [minor][fb3ca3a3b2](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb3ca3a3b2):

  **BREAKING** - removes `cssFn` from section component, introduces overrides on section component to override heading css.

### Patch Changes

- [patch][6453c8de48](https://bitbucket.org/atlassian/atlassian-frontend/commits/6453c8de48):

  Exposes typescript types alongside components.- [patch][e4dde0ad13](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4dde0ad13):

  Fixes custom item not passing selected and disabled props to the customized component.- [patch][971e294b1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/971e294b1e):

  Corrects background color for disabled item to transparent.- [patch][684ee794d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/684ee794d6):

  Improves type safety with custom item by using TypeScript generics to pass on the custom component types to the parent.- [patch][286770886d](https://bitbucket.org/atlassian/atlassian-frontend/commits/286770886d):

  Fixes item skeleton icon size to be slightly smaller than the real icon.- [patch][2c1b78027c](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c1b78027c):

  Fixes skeleton heading and item ui.- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):

- Updated dependencies [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies [aff1210e19](https://bitbucket.org/atlassian/atlassian-frontend/commits/aff1210e19):
  - @atlaskit/docs@8.5.1
  - @atlaskit/theme@9.5.3
  - @atlaskit/button@13.3.10
  - @atlaskit/icon-file-type@5.0.4

## 0.3.1

### Patch Changes

- [patch][ed8d8dea65](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed8d8dea65):

  Clean-up import statements- [patch][db2f869556](https://bitbucket.org/atlassian/atlassian-frontend/commits/db2f869556):

  Corrects separator color.- [patch][81ea791176](https://bitbucket.org/atlassian/atlassian-frontend/commits/81ea791176):

  Adds overrides for title component.- [patch][e57c4aa96d](https://bitbucket.org/atlassian/atlassian-frontend/commits/e57c4aa96d):

  Fixes vertical alignment for menu items in IE11.- [patch][89d35b919a](https://bitbucket.org/atlassian/atlassian-frontend/commits/89d35b919a):

  Adds css function to skeleton components.- [patch][083cfbaeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/083cfbaeb4):

  Improvement: `Section` now contains an optional `title` prop, which will be passed into an internal `HeadingItem` if provided. See the `Section` documentation for more details- [patch][46d95777ef](https://bitbucket.org/atlassian/atlassian-frontend/commits/46d95777ef):

  Fixes width override in item skeleton component not being applied correctly.- [patch][9b264df34d](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b264df34d):

  Fixes users being able to select text and drag both the link and custom item components.- Updated dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):

  - @atlaskit/docs@8.5.0

## 0.3.0

### Minor Changes

- [minor][7a6e5f6e3d](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a6e5f6e3d):

  Support forward ref on ButtonItem and LinkItem

### Patch Changes

- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon-file-type@5.0.3
  - @atlaskit/icon-object@5.0.3
  - @atlaskit/icon@20.1.0
  - @atlaskit/avatar@17.1.9
  - @atlaskit/button@13.3.9

## 0.2.7

### Patch Changes

- [patch][1f9c4f974a](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f9c4f974a):

  Updates to @atlaskit/menu to support better custom components

  - The `description` prop on items has been updated to take either `string` or `JSX.Element` allowing custom components such as links to be rendered
  - A stateless CSSFn type has been exported to override styles in static components (such as `<HeadingItem />`)- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
  - @atlaskit/icon@20.0.2

## 0.2.6

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/avatar@17.1.7
  - @atlaskit/button@13.3.7
  - @atlaskit/icon-file-type@5.0.2
  - @atlaskit/icon-object@5.0.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/theme@9.5.1

## 0.2.5

### Patch Changes

- [patch][77ffd08ea0](https://bitbucket.org/atlassian/atlassian-frontend/commits/77ffd08ea0):

  Adds `onClick` prop to menu group component.- [patch][0ae6ce5d46](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ae6ce5d46):

  Forwards ref of the button item component.

## 0.2.4

### Patch Changes

- [patch][4ed951b8d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ed951b8d8):

  Fixes on click being fired when items were disabled.- [patch][e0e91e02a6](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0e91e02a6):

  Adds support for a `cssFn` prop that allows consumers to override the styles of ButtonItem and LinkItem.- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):

- Updated dependencies [b9dc265bc9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9dc265bc9):
  - @atlaskit/icon@20.0.0
  - @atlaskit/avatar@17.1.6
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6

## 0.2.3

### Patch Changes

- [patch][ab0e00f203](https://bitbucket.org/atlassian/atlassian-frontend/commits/ab0e00f203):

  Fixes width being 100% on link and custom item. Adds export types to the main package.

## 0.2.2

### Patch Changes

- [patch][911d58c568](https://bitbucket.org/atlassian/atlassian-frontend/commits/911d58c568):

  - Fixes spacing between sections and items
  - Introduces new props on `MenuGroup` to control min/max width and height.
  - Introduces new `PopupMenuGroup` component which is variant of `MenuGroup` with sensible defaults.

## 0.2.1

### Patch Changes

- [patch][4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):

  Removes babel/runtime from dependencies. Users should see a smaller bundlesize as a result- Updated dependencies [28f8f0e089](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f8f0e089):

- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/icon@19.1.0
  - @atlaskit/theme@9.5.0
  - @atlaskit/button@13.3.5

## 0.2.0

### Minor Changes

- [minor][795a9503da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/795a9503da):

  Menu has had few styling fixes:

  - **BREAKING:** Height for all `Item` components when there is no `description` defined now equals `40px`.
  - **BREAKING:** `SkeletonHeadingItem` & `SkeletonItem` now match the real components dimensions,
    this means they will no longer move things around when swapping them in & out.
  - `SkeletonHeadingItem` has had its width slightly increased.
  - `Skeleton` items now have a shimmer effect that you can opt into with the `isShimmering` prop.
  - `HeadingItem` now has the correct `font-weight`.
  - `Item` components `description` now has the correct `font-size`.

### Patch Changes

- [patch][b7b0ead295](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b7b0ead295):

  Adds `testId` to all components - useful when wanting to do any automated tests that want to target these specific elements.- Updated dependencies [429925f854](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/429925f854):

  - @atlaskit/theme@9.4.0

## 0.1.3

### Patch Changes

- [patch][9af7977678](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9af7977678):

  Fixing visual tweaks for top nav and menu spacing

## 0.1.2

### Patch Changes

- [patch][3b785fa323](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3b785fa323):

  Various UI fixes

## 0.1.1

### Patch Changes

- [patch][ac6ba9b837](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ac6ba9b837):

  Fix bug where Skeleton width wasn't being picked up. Allow skeleton heading width to be configurable to make API consistent with skeleton item

## 0.1.0

### Minor Changes

- [minor][d85f0206b0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d85f0206b0):

  added isSelected prop to Items

## 0.0.2

### Patch Changes

- [patch][eaca633b3d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eaca633b3d):

  Style ItemSkeletons and ItemHeadings. Add the ability to add icon or avatar and configure skeleton width.

## 0.0.1

### Patch Changes

- [patch][ba4eed96dc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ba4eed96dc):

  Create Menu package and expose `Item` and `LinkItem` components
