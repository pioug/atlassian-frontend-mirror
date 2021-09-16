# @atlaskit/side-navigation

## 1.1.2

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [`0e1894c8eb0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e1894c8eb0) - Instrumented side navigation with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in alpha).
  These changes are intended to be interoperable with the legacy theme implementation. Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- [`7c843858398`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c843858398) - [ux] LinkItem and CustomItem now have correct blue text color when selected and the href has visited

## 1.0.0

### Major Changes

- [`7727f723965`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7727f723965) - Internal change to the release model from continous to scheduled release. There are **NO API CHANGES** in this release.

### Patch Changes

- Updated dependencies

## 0.8.5

### Patch Changes

- [`4e72825fa89`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e72825fa89) - JET-1156:

  - Export `VAR_SEPARATOR_COLOR` to override separator color when using custom backrounds in side navigation.
  - Export `VAR_SCROLL_INDICATOR_COLOR` to override menu scroll indicator color when using custom backrounds in side navigation.

## 0.8.4

### Patch Changes

- [`240c4120435`](https://bitbucket.org/atlassian/atlassian-frontend/commits/240c4120435) - Side navigation now uses the new common utility to calculate scrollbar width for offsetting keylines.
- Updated dependencies

## 0.8.3

### Patch Changes

- [`e6f96e8d782`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6f96e8d782) - Fix styling for hover and active states for disabled items

## 0.8.2

### Patch Changes

- [`101b102ed33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/101b102ed33) - Fix disabled state; menu items with icons after the text should have height of 40px

## 0.8.1

### Patch Changes

- [`0b2f7e76803`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b2f7e76803) - Codemods will only format a file if it is mutated.

## 0.8.0

### Minor Changes

- [`79a40dec30`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79a40dec30) - **Breaking** Adjusts the API of the cssFn prop used in both menu and side-navigation. The prop now no longer exposes the currentStyles to the user in the callback and instead only provides the current state. Users no longer need to spread the currentStyles into their components when overriding. This change also resolves a bug where cssFn overrides did not always take precedence correctly over the default component styles.

### Patch Changes

- Updated dependencies

## 0.7.10

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 0.7.9

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 0.7.8

### Patch Changes

- [`e55c4eb5a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e55c4eb5a8) - [ux] Earlier left sidebar was getting focus while clicking on it. We have removed focus ring to fix this issue.

## 0.7.7

### Patch Changes

- Updated dependencies

## 0.7.6

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 0.7.5

### Patch Changes

- [`a3c91f82f6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a3c91f82f6) - Add tabindex=0 to nested container which makes it focusable when interacting with keyboard.

## 0.7.4

### Patch Changes

- [`308ad47024`](https://bitbucket.org/atlassian/atlassian-frontend/commits/308ad47024) - Passes `cssFn` throught to NestingItem so that its styles can be customised

## 0.7.3

### Patch Changes

- Updated dependencies

## 0.7.2

### Patch Changes

- [`159e0808a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/159e0808a5) - Updates the background color of NestingItem, ButtonItem and LinkItem so that it can work with the Onboarding component.
  Hover and selected states will appear darker and they provide better contrast against normal items.

## 0.7.1

### Patch Changes

- [`5b3383fe67`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b3383fe67) - Nesting transitions will no longer occur if a modifier key such as Shift or Control is detected while clicking on a nesting item in the side-navigation.

## 0.7.0

### Minor Changes

- [`c7e637753f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c7e637753f) - Removed unused export of SIDEBAR_DEFAULT_WIDTH. It was added when page-layout wasn’t complete. Now page-layout is fairly mature, that’s why this export isn’t required anymore.

## 0.6.1

### Patch Changes

- [`01e279bdcd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/01e279bdcd) - Restyled footer - align with new design

## 0.6.0

### Minor Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 0.5.7

### Patch Changes

- Updated dependencies

## 0.5.6

### Patch Changes

- [`cc14956821`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc14956821) - Update all the theme imports to a path thats tree shakable

## 0.5.5

### Patch Changes

- [`5217dcfa4d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5217dcfa4d) - Remove opacity from side-navigation seperators that appear when the container scrolls. The color is the same, just without the alpha channel.

## 0.5.4

### Patch Changes

- [`d674e203b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d674e203b3) - Previously Menu items controlled their own margin spacing which caused issues when trying to use them outside of Menu.
  Now we have moved Menu item margin styles into the Section component so now the Section dictates the spacing around child items.
  We had to update Side Navigation to control its child item margins as well.

## 0.5.3

### Patch Changes

- [`649f69b6d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/649f69b6d7) - Patch all packages that are used by confluence that have a broken es2019 dist

## 0.5.2

### Patch Changes

- [`131cee6d7a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/131cee6d7a) - Add missing tslib dependency

## 0.5.1

### Patch Changes

- [`6ef13297b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ef13297b2) - Fixes scroll indicator not being the correct width when lazy loading large amounts of nav items.

## 0.5.0

### Minor Changes

- [`07b2d8c491`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07b2d8c491) - FIX: NestedItem `iconAfter` will now display always and right arrow will show up and replace it on hover

## 0.4.0

### Minor Changes

- [minor][7e408e4037](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e408e4037):

  **BREAKING** - renames `elemBefore` and `elemAfter` props to `iconBefore` and `iconAfter` on all item components.- [minor][d1ef176211](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1ef176211):

  **BREAKING** - renames section heading to heading item- [minor][41760ea4a6](https://bitbucket.org/atlassian/atlassian-frontend/commits/41760ea4a6):

  **BREAKING**: modifies custom item component to take only valid HTML attributes. This means `wrapperClass` is now known as `className`.- [minor][b3441cd210](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3441cd210):

  **BREAKING** - removes render go back item component from nesting item and nestable navigation content. Replaces with overrides equivalent.- [minor][e67a87dbf2](https://bitbucket.org/atlassian/atlassian-frontend/commits/e67a87dbf2):

  **BREAKING** - renames `customItemComponent` prop on nesting item to `component`.

### Patch Changes

- [patch][724935beab](https://bitbucket.org/atlassian/atlassian-frontend/commits/724935beab):

  Adds loading section component to use when wanting lazy load menu items.- [patch][6453c8de48](https://bitbucket.org/atlassian/atlassian-frontend/commits/6453c8de48):

  Exposes typescript types alongside components.- [patch][3bfb526c22](https://bitbucket.org/atlassian/atlassian-frontend/commits/3bfb526c22):

  Corrects disabled nesting item to not show the after element on hover.- [patch][7a9bf45e58](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a9bf45e58):

  Fixes section heading to correctly compose passed in css function.- [patch][d8dc3813c1](https://bitbucket.org/atlassian/atlassian-frontend/commits/d8dc3813c1):

  Fixes section heading spacing.- [patch][684ee794d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/684ee794d6):

  Improves type safety with custom item by using TypeScript generics to pass on the custom component types to the parent.- Updated dependencies [7e408e4037](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e408e4037):

- Updated dependencies [5633f516a4](https://bitbucket.org/atlassian/atlassian-frontend/commits/5633f516a4):
- Updated dependencies [6453c8de48](https://bitbucket.org/atlassian/atlassian-frontend/commits/6453c8de48):
- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
- Updated dependencies [e4dde0ad13](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4dde0ad13):
- Updated dependencies [41760ea4a6](https://bitbucket.org/atlassian/atlassian-frontend/commits/41760ea4a6):
- Updated dependencies [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies [971e294b1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/971e294b1e):
- Updated dependencies [684ee794d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/684ee794d6):
- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies [286770886d](https://bitbucket.org/atlassian/atlassian-frontend/commits/286770886d):
- Updated dependencies [2c1b78027c](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c1b78027c):
- Updated dependencies [fb3ca3a3b2](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb3ca3a3b2):
  - @atlaskit/menu@0.4.0
  - @atlaskit/motion@0.2.3
  - @atlaskit/docs@8.5.1
  - @atlaskit/theme@9.5.3
  - @atlaskit/button@13.3.10

## 0.3.1

### Patch Changes

- [patch][ab133d934f](https://bitbucket.org/atlassian/atlassian-frontend/commits/ab133d934f):

  Change imports to comply with Atlassian conventions

## 0.3.0

### Minor Changes

- [minor][7ecbf8d0bd](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ecbf8d0bd):

  **Breaking:**

  - SideNavigation now has a required `label` prop.

  **Accessibility Changes**

  - SideNavigation now has a `navigation` landmark for use with screen readers;
    this landmark is further described by the `label` prop to differentiate it from
    AtlassianNavigation- [minor][1fea6757c4](https://bitbucket.org/atlassian/atlassian-frontend/commits/1fea6757c4):

  **BREAKING** - NavigationFooter component has been renamed to Footer.

### Patch Changes

- [patch][7b230682c2](https://bitbucket.org/atlassian/atlassian-frontend/commits/7b230682c2):

  Adds controlled component support.
  It is now possible to use the `stack` and `onChange` props on the `NestableNavigationContent` component to dictate which view is active.
  This is useful for use cases where nested views need to be changed programmatically.

  ```
  const [stack, setStack] = useState([]);

  <SideNavigation>
    <NestableNavigationContent
      onChange={setStack}
      stack={stack}
    >
      ...
    </NestableNavigationContent>
  </SideNavigation>
  ```

  This is supported by a new hook called `useShouldNestedElementRender()`.
  All components that can be composed with `NestableNavigationContent` use it out of the box,
  but if you want to compose your own components you may have to opt into it else you will see your component rendering on every view (which may or may not be what you want).

  ```
  import { useShouldNestedElementRender } from '@atlaskit/side-navigation';

  const MyCustomComponent = () => {
    const { shouldRender } = useShouldNestedElementRender();

    if (shouldRender) {
      return <div>hello world!</div>;
    }

    // If your component takes children you'll probably want to return children here instead.
    return null;
  };
  ```

  ```
  <SideNavigation>
    <NestableNavigationContent>
      <MyCustomComponent />
    </NestableNavigationContent>
  </SideNavigation>
  ```

  - [patch][5c0bb69f7b](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c0bb69f7b):

  Fixes horizontal alignment for item icons in relation to the app switcher in the horizontal navigation bar.- [patch][1a3192c1c1](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a3192c1c1):

  Introduces skeletons for heading and item components.- [patch][43353900f7](https://bitbucket.org/atlassian/atlassian-frontend/commits/43353900f7):

  Corrects and consolidates colors for item and side navigation components.- [patch][c60324c748](https://bitbucket.org/atlassian/atlassian-frontend/commits/c60324c748):

  Adds new Footer component. Ensures this and the Header component come with baked in styles for you to use out of the box.- [patch][c56d86d95c](https://bitbucket.org/atlassian/atlassian-frontend/commits/c56d86d95c):

  Adds scrolling indicators to the scrollable container component.

- Updated dependencies [ed8d8dea65](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed8d8dea65):
- Updated dependencies [db2f869556](https://bitbucket.org/atlassian/atlassian-frontend/commits/db2f869556):
- Updated dependencies [81ea791176](https://bitbucket.org/atlassian/atlassian-frontend/commits/81ea791176):
- Updated dependencies [6e2dda87f4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e2dda87f4):
- Updated dependencies [e57c4aa96d](https://bitbucket.org/atlassian/atlassian-frontend/commits/e57c4aa96d):
- Updated dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
- Updated dependencies [89d35b919a](https://bitbucket.org/atlassian/atlassian-frontend/commits/89d35b919a):
- Updated dependencies [083cfbaeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/083cfbaeb4):
- Updated dependencies [46d95777ef](https://bitbucket.org/atlassian/atlassian-frontend/commits/46d95777ef):
- Updated dependencies [9b264df34d](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b264df34d):
  - @atlaskit/menu@0.3.1
  - @atlaskit/atlassian-navigation@0.10.0
  - @atlaskit/docs@8.5.0

## 0.2.0

### Minor Changes

- [minor][dce5efb012](https://bitbucket.org/atlassian/atlassian-frontend/commits/dce5efb012):

  Support forward ref on side-navigation primitives

### Patch Changes

- [patch][4da717940e](https://bitbucket.org/atlassian/atlassian-frontend/commits/4da717940e):

  Refactor side-navigation nesting logic to support async components- [patch][93709ca7eb](https://bitbucket.org/atlassian/atlassian-frontend/commits/93709ca7eb):

  Adds `testId` to `NestingItem`- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):

- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [7a6e5f6e3d](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a6e5f6e3d):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/logo@12.3.3
  - @atlaskit/menu@0.3.0
  - @atlaskit/button@13.3.9

## 0.1.0

### Minor Changes

- [minor][e1416630ed](https://bitbucket.org/atlassian/atlassian-frontend/commits/e1416630ed):

  **BREAKING**: Renamed exported components

  - Renamed `MainSection` to `NavigationContent`
  - Renamed `NestingTransitionProvider` to `NestableNavigationContent`
  - `NestableNavigationContent` does not need to be wrapped by a `MainSection`
  - Renamed `HeaderSection` to `NavigationHeader`
  - Renamed `Footer` to `NavigationFooter`

  Improve behaviour of scrollabe sections:

  - Fixes a bug where different views shared the same scrollable section causing unexpected jumps on some unnesting interactions
  - `ScrollableSection` now shows an overflow indicator when items are scrolled off the top border
  - Fixes a bug where the Go Back component could scroll off the top in some cases- [minor][d752f27427](https://bitbucket.org/atlassian/atlassian-frontend/commits/d752f27427):

  API changes and design changes for side-navigation

  - **BREAKING**: `SectionHeader` has been renamed to `SectionHeading`
  - `SIDEBAR_DEFAULT_WIDTH` has been exported
  - `Item` has been removed and replaced with `CustomItem`, `ButtonItem`, `LinkItem` which are thin wrappers around their `@atlaskit/menu` counterparts
  - All exported components now have sensible default styles applied
  - A `GoBackItem` has been exported
  - `testId` props have been added to more components with `side-navigation`
  - `CustomItem`, `ButtonItem` and `LinkItem` themselves have a `cssFn` prop exposed which will allow custom styles to be applied and combined with side-navigation defaults
  - `Heading` and `Footer` have been updated to allow consumers to pass in their own custom components
  - Rich examples have been updated for composing your own navigations with RBD etc.- [minor][08fa439ec7](https://bitbucket.org/atlassian/atlassian-frontend/commits/08fa439ec7):

  **BREAKING**: `id` prop is now required on NestingItems

  The back button in nested views can now be customised

  - By default an English `Go Back` button will be shown
  - Use `renderDefaultBackButton` on the `NestableNavigationContent` to set a new default
  - Use `renderBackButton` on each `NestingItem` to specifically set a back trigger for exiting the view it controls

  The link form of nested views can now be customised

  - Use `customItemComponent` to pass in a functional/class component that adds extra behaviour around the link (see @atlaskit/menu for examples on how to configure CustomItems)

### Patch Changes

- [patch][babae63a7b](https://bitbucket.org/atlassian/atlassian-frontend/commits/babae63a7b):

  - Refactors nested navigation implementation
  - Now selects `NestingItem` & `GoBackItem` when it is exiting
  - Fixes double clicking a `NestingItem` and `GoBackItem` resulting in an unwanted double navigation
  - Fixes `NestingItem` not calling back on click
  - Adds optional `id` prop to `NestingItem`- Updated dependencies [1f9c4f974a](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f9c4f974a):

- Updated dependencies [b80c88fd26](https://bitbucket.org/atlassian/atlassian-frontend/commits/b80c88fd26):
- Updated dependencies [9ec1606d00](https://bitbucket.org/atlassian/atlassian-frontend/commits/9ec1606d00):
- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
- Updated dependencies [1b3069e06b](https://bitbucket.org/atlassian/atlassian-frontend/commits/1b3069e06b):
  - @atlaskit/menu@0.2.7
  - @atlaskit/atlassian-navigation@0.9.6
  - @atlaskit/icon@20.0.2

## 0.0.4

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/menu@0.2.6
  - @atlaskit/theme@9.5.1
  - @atlaskit/motion@0.2.2

## 0.0.3

### Patch Changes

- [patch][f3433f2096](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3433f2096):

  `NestingItem` now has an extra prop `isInitiallyOpen` that allows the side-navigation to initially render a particular nested view

  - To select a particular sidebar view to be rendered initially the `isInitiallyOpen` prop must be set on all parent `NestingItem`s in the navigation tree- [patch][a806cde423](https://bitbucket.org/atlassian/atlassian-frontend/commits/a806cde423):

  Iterative updates to side-navigation:

  - Go Back link in nested views now sticks to the top of the scrollable area
  - Removed broken css styles
  - Implemented sliding transitions rather than fades- Updated dependencies [4ed951b8d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ed951b8d8):

- Updated dependencies [e0e91e02a6](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0e91e02a6):
- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies [166d7b1626](https://bitbucket.org/atlassian/atlassian-frontend/commits/166d7b1626):
  - @atlaskit/menu@0.2.4
  - @atlaskit/icon@20.0.0
  - @atlaskit/motion@0.2.1
  - @atlaskit/docs@8.3.1

## 0.0.2

### Patch Changes

- [patch][0e6929fbb9](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e6929fbb9):

  Fixes a broken internal omport- [patch][146ca7139a](https://bitbucket.org/atlassian/atlassian-frontend/commits/146ca7139a):

  Bump package to enable branch deploys- Updated dependencies [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):

- Updated dependencies [1d72045e6b](https://bitbucket.org/atlassian/atlassian-frontend/commits/1d72045e6b):
  - @atlaskit/docs@8.3.0
  - @atlaskit/motion@0.2.0
