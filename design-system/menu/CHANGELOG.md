# @atlaskit/menu

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [`224028babd3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/224028babd3) - Menu now uses the design system and emotion styling techstacks.
- [`506282a89f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/506282a89f2) - [ux] Menu items now have their text color set using `currentColor` instead of using colors directly off the palette.
- [`58832848c98`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58832848c98) - Instrumented menu with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in alpha).
  These changes are intended to be interoperable with the legacy theme implementation. Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- [`f5a527024d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5a527024d4) - Suppress `@atlaskit/design-system/ensure-design-token-usage` token fallback errors.
- Updated dependencies

## 1.0.4

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 1.0.3

### Patch Changes

- [`3c1182fdf13`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c1182fdf13) - added optional `role` prop to link item for a11y

## 1.0.2

### Patch Changes

- [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates to development dependency `storybook-addon-performance`

## 1.0.1

### Patch Changes

- [`1648daf0308`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1648daf0308) - Updates button item props.

## 1.0.0

### Major Changes

- [`7727f723965`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7727f723965) - Internal change to the release model from continous to scheduled release. There are **NO API CHANGES** in this release.

## 0.7.6

### Patch Changes

- [`9ea5f8887cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9ea5f8887cd) - Internal change to menu styling to allow for the separator color to be customisable in side-navigation

## 0.7.5

### Patch Changes

- [`21713b1335a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/21713b1335a) - [ux] adding shouldTitleWrap and shouldDescriptionWrap prop to menu items for wrap long text in title and description

## 0.7.4

### Patch Changes

- [`a1def13c6fb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1def13c6fb) - Restructure the package to align with lite mode convention, and introduce entry points to each item type

## 0.7.3

### Patch Changes

- [`451f220a771`](https://bitbucket.org/atlassian/atlassian-frontend/commits/451f220a771) - Set disabled/aria-disabled for menu item HTML elements, and prevent mouse events when the item is disabled
- [`981c9be6b32`](https://bitbucket.org/atlassian/atlassian-frontend/commits/981c9be6b32) - Fix generics for custom item to work with typed components from external libs
- [`11fea0f7e4b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/11fea0f7e4b) - Memoise menu item variants

## 0.7.2

### Patch Changes

- [`1b5d5c0fca9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1b5d5c0fca9) - Use light mode values instead of calling the themed() API

## 0.7.1

### Patch Changes

- [`0b2f7e76803`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b2f7e76803) - Codemods will only format a file if it is mutated.

## 0.7.0

### Minor Changes

- [`79a40dec30`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79a40dec30) - **Breaking** Adjusts the API of the cssFn prop used in both menu and side-navigation. The prop now no longer exposes the currentStyles to the user in the callback and instead only provides the current state. Users no longer need to spread the currentStyles into their components when overriding. This change also resolves a bug where cssFn overrides did not always take precedence correctly over the default component styles.

## 0.6.5

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 0.6.4

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 0.6.3

### Patch Changes

- Updated dependencies

## 0.6.2

### Patch Changes

- [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable integration tests for Edge browser

## 0.6.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 0.6.0

### Minor Changes

- [`63625ea30c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63625ea30c) - Add `aria-current="page"` attribute to anchor tag when `isSelected` prop is `true` for `LinkItem` component.

## 0.5.2

### Patch Changes

- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all the theme imports to be tree-shakable

## 0.5.1

### Patch Changes

- [`a70b60d9f1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a70b60d9f1) - The line height of menu items has been slightly increased to accomodate descender spacing viewed on non-retina displays.

## 0.5.0

### Minor Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 0.4.7

### Patch Changes

- [`952087be5b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/952087be5b) - Item components now blur themselves during the mouse down event.

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
