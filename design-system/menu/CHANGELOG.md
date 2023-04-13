# @atlaskit/menu

## 1.5.6

### Patch Changes

- Updated dependencies

## 1.5.5

### Patch Changes

- Updated dependencies

## 1.5.4

### Patch Changes

- Updated dependencies

## 1.5.3

### Patch Changes

- [`a8debc96871`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a8debc96871) - Internal update to menu primitive so it renders a span instead of a div as child of button.

## 1.5.2

### Patch Changes

- [`3ca97be0c06`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3ca97be0c06) - Internal change only. Replace usages of Inline/Stack with stable version from `@atlaskit/primitives`.
- Updated dependencies

## 1.5.1

### Patch Changes

- [`261420360ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/261420360ec) - Upgrades component types to support React 18.
- Updated dependencies

## 1.5.0

### Minor Changes

- [`93d761786d6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93d761786d6) - [ux] Default spacing for all menu items has been changed from 20px inline padding to 16px.

  Adds a new spacing prop to on `MenuGroup`. The prop can be used to control the content density of the component and its children.

  Adds a new internal export `SpacingContext`. This should not be used directly.

## 1.4.10

### Patch Changes

- [`63c2f0b3f96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63c2f0b3f96) - Internal changes to use spacing tokens. There is no expected behaviour or visual change.

## 1.4.9

### Patch Changes

- Updated dependencies

## 1.4.8

### Patch Changes

- [`18aeca8c199`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18aeca8c199) - Internal change to update token references. There is no expected behaviour or visual change.

## 1.4.7

### Patch Changes

- [`4ee60bafc6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ee60bafc6d) - ED-16603: Remove tooltips from VR tests and make them opt in. To opt-in, add `allowedSideEffects` when loading the page.

## 1.4.6

### Patch Changes

- Updated dependencies

## 1.4.5

### Patch Changes

- [`b0f6dd0bc35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0f6dd0bc35) - Updated to use typography tokens. There is no expected behaviour or visual change.

## 1.4.4

### Patch Changes

- [`f96f3ebd861`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f96f3ebd861) - [ux] Use color.background.neutral.subtle token to represent transparent background.
- [`981faeea2ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/981faeea2ff) - Application of spacing tokens for some internal styles of `MenuPrimitive`.
- [`bcbd0c5b5bf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bcbd0c5b5bf) - Fix text color styling of disabled descriptions in menu and link items

## 1.4.3

### Patch Changes

- Updated dependencies

## 1.4.2

### Patch Changes

- Updated dependencies

## 1.4.1

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [`3acf8a89149`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3acf8a89149) - Updates `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

### Patch Changes

- Updated dependencies

## 1.3.12

### Patch Changes

- [`9de88fa1e1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9de88fa1e1e) - Internal changes to include spacing tokens in component implementations.

## 1.3.11

### Patch Changes

- [`8f2153a45a7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f2153a45a7) - Convert Menu Group to use primitives.
- Updated dependencies

## 1.3.10

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 1.3.9

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 1.3.8

### Patch Changes

- [`b196f69e76b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b196f69e76b) - Menu items no longer intercept mouse down events to force focus or blur behavior depending on the last focused element.
- Updated dependencies

## 1.3.7

### Patch Changes

- [`8a5bdb3c844`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a5bdb3c844) - Upgrading internal dependency (bind-event-listener) for improved internal types

## 1.3.6

### Patch Changes

- [`c8145459eb5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8145459eb5) - [ux] Updating skeleton token in @atlakist/menu, @atlaskit/theme
- Updated dependencies

## 1.3.5

### Patch Changes

- [`efa50ac72ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/efa50ac72ba) - Adjusts jsdoc strings to improve prop documentation

## 1.3.4

### Patch Changes

- Updated dependencies

## 1.3.3

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 1.3.2

### Patch Changes

- Updated dependencies

## 1.3.1

### Patch Changes

- [`59e2178901f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/59e2178901f) - The `isShimmering` prop for skeleton items has been fixed, resolving a regression in version 1.2.0.
- [`62edf20ab1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62edf20ab1e) - Migrates all usage of brand tokens to either selected or information tokens. This change is purely for semantic reasons, there are no visual or behavioural changes.
- Updated dependencies

## 1.3.0

### Minor Changes

- [`77c46ec96a7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/77c46ec96a7) - Adds a prop for `role` to the MenuGroup component that acts as you'd expect the HTML attribute to act. You are now able to override the accessibility role for the element.

### Patch Changes

- Updated dependencies

## 1.2.6

### Patch Changes

- [`58884c2f6c1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58884c2f6c1) - Internal code change turning on a new linting rule.
- [`27467f65f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/27467f65f68) - [ux] Update headingStyle to color that passes WCAG AA color contrast
- [`2066efabc65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2066efabc65) - A fix for the `StatelessCSSFn` type so that it now correctly accetps a void argument.
- [`96cfc6c1c7f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/96cfc6c1c7f) - Deprecates the `cssFn` and `overrides` APIs in '@atlaskit/menu'. These APIs are not performant and allow unbounded customisation of the Menu components. These APIs will be removed in a future release.
- Updated dependencies

## 1.2.5

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when auto-fixing by correctly formatting token ids.
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when auto-fixing by correctly formatting token ids.
- Updated dependencies

## 1.2.4

### Patch Changes

- Updated dependencies

## 1.2.3

### Patch Changes

- [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds for this package now pass through a tokens babel plugin, removing runtime invocations of the tokens() function and improving bundle size.
- Updated dependencies

## 1.2.2

### Patch Changes

- [`2eeb5c46710`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2eeb5c46710) - Menu items can take `data-testid` directly again however we recommend to still use the officially supported `testId` prop instead. The `data-testid` prop was unintentionally removed in a previous version however will be removed as a breaking change in a later major version and remains not officially typed.

## 1.2.1

### Patch Changes

- [`2b2290121eb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2b2290121eb) - Raised the minimum version carat range of focus ring to latest.

## 1.2.0

### Minor Changes

- [`213bfd77e61`](https://bitbucket.org/atlassian/atlassian-frontend/commits/213bfd77e61) - The DOM structure of menu item components has been flattened.
  If you used CSS hacks (via className or cssFn) that targetted specific DOM nodes you may be broken.

  Previously the structure looked like:

  ```jsx
  <button>
    <div> // <-- this intermediate div has been removed
      <span>
        <span />
      </span>
    </div>
  </button>
  ```

  Now it looks like:

  ```jsx
  <button>
    <span>
      <span />
    </span>
  </button>
  ```

- [`63888b03b49`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63888b03b49) - Internal refactor to align style declarations to common techstack.

### Patch Changes

- Updated dependencies

## 1.1.4

### Patch Changes

- [`34282240102`](https://bitbucket.org/atlassian/atlassian-frontend/commits/34282240102) - Adds explicit type to button usages components.

## 1.1.3

### Patch Changes

- [`192d35cfdbd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/192d35cfdbd) - Defaults native button usage to type="button" to prevent unintended submittig of forms.

## 1.1.2

### Patch Changes

- Updated dependencies

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
