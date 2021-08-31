# @atlaskit/tabs

## 13.2.1

### Patch Changes

- Updated dependencies

## 13.2.0

### Minor Changes

- [`cc54bf994d6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc54bf994d6) - Instrumented Tabs with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in alpha).
  These changes are intended to be interoperable with the legacy theme implementation. Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- [`af4bca32ad4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/af4bca32ad4) - Internal changes to supress eslint rules.
- Updated dependencies

## 13.1.4

### Patch Changes

- [`9a84a3ceb82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a84a3ceb82) - Internal code changes.
- Updated dependencies

## 13.1.3

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 13.1.2

### Patch Changes

- [`ecbf4a3267f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ecbf4a3267f) - [ux] Fix tabs focus ring in the windows high contrast mode
- Updated dependencies

## 13.1.1

### Patch Changes

- [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates to development dependency `storybook-addon-performance`

## 13.1.0

### Minor Changes

- [`4f40ecb4471`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f40ecb4471) - [ux] Added `Home` and `End` keys handlers for tablist. Changed arrow keys handlers to make tabs cycled. Now when you press the left arrow key on the first tab the last tab will be selected and when you press right arrow key on the last tab the first tab will be selected

### Patch Changes

- Updated dependencies

## 13.0.1

### Patch Changes

- Updated dependencies

## 13.0.0

### Major Changes

- [`c17fe6144f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c17fe6144f8) - ### Major Changes

  In this version, `Tabs` has had a pretty substantial rewrite. As well as now being dramatically faster and more lightweight, it has a brand new flexible composable API and a bunch of accessibility improvements.

  ### Composable API

  The old version of `Tabs` had a `tabs` prop that would map to `TabItem`'s and `TabContent`'s.

  ```
  import Tabs from '@atlaskit/tabs';

  const ComponentUsingTabs = () => (
    <Tabs tabs={
      { label: 'Tab 1', content: 'One' },
      { label: 'Tab 2', content: 'Two' },
      { label: 'Tab 3', content: 'Three' },
    ]} />
  );
  ```

  We've changed the language to match the W3 spec so a `TabItem` is now a `Tab` and a `TabContent` is a `TabPanel`. We now export these components as well as a `TabList` so consumers use a composable API that matches the DOM structure.

  ```
  import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';

  const ComponentUsingTabs = () => (
    <Tabs
      id="component-using-tabs"
    >
      <TabList>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
        <Tab>Tab 3</Tab>
      </TabList>
      <TabPanel>
        One
      </TabPanel>
      <TabPanel>
        Two
      </TabPanel>
      <TabPanel>
        Three
      </TabPanel>
    </Tabs>
  );
  ```

  This allows you to easily customise your usage, for example if you want to add a tooltip.

  ```
  import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
  import Tooltip from '@atlaskit/tooltip';

  const TooltipTab = ({ label, tooltip }: { label: string; tooltip: string }) => (
    <Tooltip content={tooltip}>
      <Tab>{label}</Tab>
    </Tooltip>
  );

  const ComponentUsingTabs = () => (
    <Tabs
      id="component-using-tabs"
    >
      <TabList>
        <TooltipTab label="Tab 1" tooltip="Tooltip for tab 1" />
        <TooltipTab label="Tab 2" tooltip="Tooltip for tab 2" />
        <TooltipTab label="Tab 3" tooltip="Tooltip for tab 3" />
      </TabList>
      <TabPanel>
        One
      </TabPanel>
      <TabPanel>
        Two
      </TabPanel>
      <TabPanel>
        Three
      </TabPanel>
    </Tabs>
  );
  ```

  ### Hooks replacing Component prop

  The `component` prop allowed you to customise the `Tab` and `TabPanel`. This approach seemed counter-intuitive and had a performance impact regardless of whether you were using it. Instead with composability we have have added two hooks, `useTab` and `useTabPanel`.

  To create a custom `Tab`, call `useTab` and spread those attributes onto the custom tab. From there you can use it in place of a `Tab`. For example if you want to change the font size you would do so like this.

  ```
  import { useTab } from '@atlaskit/tabs';

  const CustomTab = ({ label }: { label: string }) => {
    const tabAttributes = useTab();

    return (
      <div
        css={css`
          font-size: 16px;
        `}
        {...tabAttributes}
      >
        {label}
      </div>
    );
  };
  ```

  Likewise, to create a custom `TabPanel`, call `useTabPanel` and spread those attributes onto the custom tab panel.

  ```
  import { useTabPanel } from '@atlaskit/tabs';

  const CustomTabPanel = ({ body }: { body: string }) => {
    const tabPanelAttributes = useTabPanel();

    return (
      <div
        css={css`
          margin: 12px;
        `}
        {...tabPanelAttributes}
      >
        {body}
      </div>
    );
  };
  ```

  ### onSelect -> onChange

  The `onSelect` prop has been renamed to `onChange` to be consistent with other design system components. Internal state has now changed to keep track of the selected index. Previously the object in the `tabs` prop array of type `TabData` was passed as well as the index. If you were using this object you will have to change to use the index.

  The type has changed from
  `(selected: TabData, selectedIndex: number, analyticsEvent: UIAnalyticsEvent) => void;`
  to
  `(index: number, analyticsEvent: UIAnalyticsEvent) => void;`

  This also means if you are using the `selected` prop you will have to ensure you are using the index of the selected tab instead of the object of type `TabData`.

  ### isSelectedTest

  Previously you could provide the prop `isSelectedTest` to `Tabs` and it would determine what tab is selected by seeing what tab returns true when `isSelectedTest` is called. This is a messy API that effectively means there were two ways of making `Tabs` controlled. If you are using `isSelectedTest` you should swap to using the `selected` prop to indicate that a tab is selected.

  ### Accessibility and required ID

  According to the w3 spec each tab should be linked to its corresponding tab panel. We have added the `aria-controls` attribute to tabs and the `aria-labelledby` attribute to tab panels. In order to do this we needed to generate a unique id for each tab and tab panel. To ensure these id's are unique if there are multiple `Tabs` components on the same page there is now a required `id` prop.

  ### shouldUnmountTabPanelOnChange

  There was previously a prop `isContentPersisted` which defaults to false. When true it would render all tab panels. The new default behaviour of `Tabs` is to leave each tab panel mounted on the page after it has been selected. This means that tab panels will only mount if selected and will not unmount and remount when changing tabs. In light of this change, `isContentPersisted` has been removed and `shouldUnmountTabPanelOnChange` has been introduced. It defaults to false and if it is set to true it will unmount a `TabPanel` when it is not selected. Effectively `shouldUnmountTabPanelOnChange` is the inverse of `isContentPersisted`.

  ### Other changes

  - Remove `TabItem` and `TabContent` export.
  - Remove the types: `TabItemElementProps`, `TabItemComponentProvided`, `TabContentComponentProvided`, `TabItemType`, `TabContentType`, `SelectedProp`, `IsSelectedTestFunction`, `OnSelectCallback`, `TabsState`, `TabsNavigationProps` and `Mode`.

  ### Automatic upgrading

  There is a codemod that assists you in upgrading most of the changes from above.
  Depending on your usage, you will most likely have to do a manual step as this is a fairly big change in API. The codemod will do its best job at making sure everything functions but you may want to clean up your usage of `@atlaskit/tabs`. It does these following changes:

  - Adds a randomly generated ID
  - Changes `onSelect` to `onChange` and defines a new inline function that will functionally work the same as it used to. It is however a messy solution and you may want to change the function to only use the selected index.
  - Remove the `TabItem` and `TabContent` imports.
  - Map the array you supplied as a `tabs` prop to create `Tab`'s and `TabPanel`'s.
  - Remove the `component` and `isSelectedTest` prop.
  - Removes types that no longer exist.
  - Migrates your usage of `isContentPersisted` to one of `shouldUnmountTabPanelOnChange`.

  To run the codemod: **You first need to have the latest version installed**

  ```bash
  yarn upgrade @atlaskit/tabs@^13.0.0
  ```

  Once upgraded,
  use `@atlaskit/codemod-cli`:

  ```bash
  npx @atlaskit/codemod-cli --parser babel --extensions ts,tsx,js [relativePath]
  ```

  The CLI will show a list of components and versions so select `@atlaskit/tabs@^13.0.0` and you will automatically be upgraded.

  Run `npx @atlaskit/codemod-cli -h` for more details on usage.
  For Atlassians,
  refer to the [documentation](https://developer.atlassian.com/cloud/framework/atlassian-frontend/codemods/01-atlassian-codemods/) for more details on the codemod CLI.

### Patch Changes

- [`4a969d5c40f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a969d5c40f) - Fix a bug where the active element is blurred instead of the current element when clicked.
- [`1adf9a493f5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1adf9a493f5) - Fix codemod issue
- Updated dependencies

## 12.1.3

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use injected package name and version for analytics instead of version.json.

## 12.1.2

### Patch Changes

- [`e795d0a849`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e795d0a849) - The `Tabs` component now uses emotion instead of styled-components for it's internal styling.

## 12.1.1

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 12.1.0

### Minor Changes

- [`98c957d889`](https://bitbucket.org/atlassian/atlassian-frontend/commits/98c957d889) - [ux] Content of tabs will be preserved on the DOM while switching between tabs

## 12.0.6

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 12.0.5

### Patch Changes

- Updated dependencies

## 12.0.4

### Patch Changes

- [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable integration tests for Edge browser

## 12.0.3

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 12.0.2

### Patch Changes

- [`954cc87b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/954cc87b62) - The readme and package information has been updated to point to the new design system website.

## 12.0.1

### Patch Changes

- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all the theme imports to be tree-shakable

## 12.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 11.2.11

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 11.2.10

### Patch Changes

- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove unused dependencies

## 11.2.9

### Patch Changes

- Updated dependencies

## 11.2.8

### Patch Changes

- [patch][b41c0887cd](https://bitbucket.org/atlassian/atlassian-frontend/commits/b41c0887cd):

  Change imports to comply with Atlassian conventions- Updated dependencies [3940bd71f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/3940bd71f1):

- Updated dependencies [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
  - @atlaskit/tooltip@15.2.6
  - @atlaskit/webdriver-runner@0.3.4

## 11.2.7

### Patch Changes

- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [64fb94fb1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/64fb94fb1e):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [109c1a2c0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c1a2c0a):
- Updated dependencies [c57bb32f6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/c57bb32f6d):
  - @atlaskit/docs@8.4.0
  - @atlaskit/webdriver-runner@0.3.0
  - @atlaskit/spinner@12.1.6
  - @atlaskit/tooltip@15.2.5

## 11.2.6

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/spinner@12.1.5
  - @atlaskit/tooltip@15.2.4

## 11.2.5

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/spinner@12.1.4
  - @atlaskit/theme@9.5.1
  - @atlaskit/tooltip@15.2.3

## 11.2.4

### Patch Changes

- [patch][4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):

  Removes babel/runtime from dependencies. Users should see a smaller bundlesize as a result- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):

- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/theme@9.5.0
  - @atlaskit/spinner@12.1.3
  - @atlaskit/tooltip@15.2.1

## 11.2.3

### Patch Changes

- [patch][36f6e99c5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36f6e99c5b):

  Fix type errors caused when generating declaration files

## 11.2.2

### Patch Changes

- [patch][d222c2b987](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d222c2b987):

  Theme has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided.

  ### Breaking

  ** getTokens props changes **
  When defining the value function passed into a ThemeProvider, the getTokens parameter cannot be called without props; if no props are provided an empty object `{}` must be passed in:

  ```javascript
  <CustomTheme.Provider
    value={t => ({ ...t(), backgroundColor: '#333'})}
  >
  ```

  becomes:

  ```javascript
  <CustomTheme.Provider
    value={t => ({ ...t({}), backgroundColor: '#333'})}
  >
  ```

  ** Color palette changes **
  Color palettes have been moved into their own file.
  Users will need to update imports from this:

  ```javascript
  import { colors } from '@atlaskit/theme';

  colors.colorPalette('8');
  ```

  to this:

  ```javascript
  import { colorPalette } from '@atlaskit/theme';

  colorPalette.colorPalette('8');
  ```

  or for multi entry-point users:

  ```javascript
  import * as colors from '@atlaskit/theme/colors';

  colors.colorPalette('8');
  ```

  to this:

  ```javascript
  import * as colorPalettes from '@atlaskit/theme/color-palette';

  colorPalettes.colorPalette('8');
  ```

## 11.2.1

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 11.2.0

### Minor Changes

- [minor][99957d4a20](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/99957d4a20):

  Adding an optional prop `testId` that will set the attribute value `data-testid`. It will help products to write better integration and end to end tests.

## 11.1.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 11.1.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 11.0.9

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 11.0.8

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 11.0.7

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 11.0.6

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 11.0.5

### Patch Changes

- [patch][926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):

  Analytics-next has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No behavioural changes.

  **Breaking changes**

  - `withAnalyticsForSumTypeProps` alias has been removed, please use `withAnalyticsEvents`
  - `AnalyticsContextWrappedComp` alias has been removed, please use `withAnalyticsContext`

  **Breaking changes to TypeScript annotations**

  - `withAnalyticsEvents` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
  - `withAnalyticsContext` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
  - Type `WithAnalyticsEventProps` has been renamed to `WithAnalyticsEventsProps` to match source code
  - Type `CreateUIAnalyticsEventSignature` has been renamed to `CreateUIAnalyticsEvent` to match source code
  - Type `UIAnalyticsEventHandlerSignature` has been renamed to `UIAnalyticsEventHandler` to match source code
  - Type `AnalyticsEventsPayload` has been renamed to `AnalyticsEventPayload`
  - Type `ObjectType` has been removed, please use `Record<string, any>` or `[key: string]: any`
  - Type `UIAnalyticsEventInterface` has been removed, please use `UIAnalyticsEvent`
  - Type `AnalyticsEventInterface` has been removed, please use `AnalyticsEvent`
  - Type `CreateAndFireEventFunction` removed and should now be inferred by TypeScript
  - Type `AnalyticsEventUpdater` removed and should now be inferred by TypeScript

## 11.0.4

### Patch Changes

- [patch][3342f64d5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3342f64d5e):

  Removed unused dependencies from package.json for tabs: keycode was unused.

## 11.0.3

### Patch Changes

- [patch][f34776be97](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f34776be97):

  Type definition files are now referenced in package.json

## 11.0.2

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 11.0.1

### Patch Changes

- [patch][d0db01b410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0db01b410):

  TypeScript users of withAnalyticsEvents and withAnalyticsContext are now required to provide props as a generic type. This is so that TypeScript can correctly calculate the props and defaultProps of the returned component.

  Before:

  ```typescript
  withAnalyticsEvents()(Button) as ComponentClass<Props>;
  ```

  After:

  ```typescript
  withAnalyticsEvents<Props>()(Button);
  ```

## 11.0.0

### Major Changes

- [major][61a919319a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/61a919319a):

  @atlaskit/tabs has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes. tabIndex now only accepts type number.

## 10.0.4

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 10.0.3

- Updated dependencies [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/tooltip@15.0.0

## 10.0.2

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 10.0.1

- Updated dependencies [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
  - @atlaskit/spinner@12.0.0

## 10.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 9.0.1

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/spinner@10.0.7
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/theme@8.1.7

## 9.0.0

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

## 8.0.11

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/spinner@9.0.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/tooltip@12.1.13
  - @atlaskit/docs@6.0.0

## 8.0.10

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/spinner@9.0.12
  - @atlaskit/tooltip@12.1.12
  - @atlaskit/theme@7.0.0

## 8.0.9

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 8.0.8

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 8.0.6

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/tooltip@12.0.9
  - @atlaskit/spinner@9.0.6
  - @atlaskit/docs@5.0.6

## 8.0.5

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/tooltip@12.0.5
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/theme@5.1.3
  - @atlaskit/spinner@9.0.5

## 8.0.4

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/tooltip@12.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/spinner@9.0.4
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2

## 8.0.3

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/tooltip@12.0.3
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/theme@5.1.1
  - @atlaskit/spinner@9.0.3

## 8.0.2

- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/tooltip@12.0.1
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/spinner@9.0.2
  - @atlaskit/docs@5.0.1

## 8.0.1

- [patch] Updated dependencies [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/tooltip@12.0.0

## 8.0.0

- [major] Provides analytics for common component interations. See the [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for more details. If you are using enzyme for testing you will have to use [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme). [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0

## 7.1.3

- [patch] Updated dependencies [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
  - @atlaskit/spinner@8.0.0

## 7.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/tooltip@10.2.1
  - @atlaskit/theme@4.0.4
  - @atlaskit/spinner@7.0.2

## 7.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/spinner@7.0.1
  - @atlaskit/docs@4.1.1

## 7.1.0

- [patch] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/spinner@7.0.0
  - @atlaskit/tooltip@10.2.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2

## 7.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/tooltip@10.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/spinner@6.0.1
  - @atlaskit/docs@4.0.1

## 7.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/tooltip@10.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/spinner@6.0.0
  - @atlaskit/docs@4.0.0

## 6.0.3

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/tooltip@9.2.1
  - @atlaskit/theme@3.2.2
  - @atlaskit/spinner@5.0.2
  - @atlaskit/docs@3.0.4

## 6.0.1

- [patch] Update types [0073768](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0073768)

## 6.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 5.2.1

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 5.2.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 5.1.3

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 5.1.2

- [patch] Tabs now abide by selected prop when tabs and selected props both change, instead of using internal selected state [3facabc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3facabc)

## 5.1.1

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 5.1.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 5.0.1

- [patch] fix tabs so that it re-renders when content props update [9b039dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b039dd)

## 5.0.0

- [major] Re-write tabs to provide a more flexible API. Breaking changes: 1) The package no longer exports TabsStateless. The Tabs component manages its own state by default, but will behave as a controlled component if the selectedTab prop is set. 2) The component no longer recognises the defaultSelected property on individual tab objects. Tabs now takes a defaultSelectedTab prop which accepts either a tab object or tab index. 3) The tabs prop is now required - the component will not render if this prop is not set. 4) It is no longer possible to render Tabs without a tab being selected. If the defaultSelectedTab and selectedTab props are not set the first tab will be selected by default. [10a5a5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10a5a5a)

## 4.1.0

- [minor] Update type for label to accept string [0d0ca5f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d0ca5f)

## 4.0.5

- [patch] Migrate to ak-mk-2 [4c679a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4c679a0)

## 4.0.4 (2017-11-17)

- bug fix; bumping internal dependencies to latest version ([f87bb04](https://bitbucket.org/atlassian/atlaskit/commits/f87bb04))

## 4.0.3 (2017-10-26)

- bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 4.0.2 (2017-10-22)

- bug fix; update styled-components dep and react peerDep ([6a67bf8](https://bitbucket.org/atlassian/atlaskit/commits/6a67bf8))

## 4.0.1 (2017-10-04)

- bug fix; tabs now hide overflow, and ellipsis text-overflow (issues closed: #ak3519) ([aa91734](https://bitbucket.org/atlassian/atlaskit/commits/aa91734))

## 4.0.0 (2017-08-11)

- bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))
- breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- bug fix; fix prop types ([8abfd3c](https://bitbucket.org/atlassian/atlaskit/commits/8abfd3c))
- bug fix; make tab types clearer ([3071418](https://bitbucket.org/atlassian/atlaskit/commits/3071418))
- bug fix; move babel-plugin-react-flow-props-to-prop-types to devDep ([e1cd3aa](https://bitbucket.org/atlassian/atlaskit/commits/e1cd3aa))
- feature; dark mode for Tabs, plus a bunch of cleanup for the component and its docs ([a111cf2](https://bitbucket.org/atlassian/atlaskit/commits/a111cf2))

## 3.0.0 (2017-08-11)

- breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- bug fix; fix prop types ([8abfd3c](https://bitbucket.org/atlassian/atlaskit/commits/8abfd3c))
- bug fix; make tab types clearer ([3071418](https://bitbucket.org/atlassian/atlaskit/commits/3071418))
- bug fix; move babel-plugin-react-flow-props-to-prop-types to devDep ([e1cd3aa](https://bitbucket.org/atlassian/atlaskit/commits/e1cd3aa))
- feature; dark mode for Tabs, plus a bunch of cleanup for the component and its docs ([a111cf2](https://bitbucket.org/atlassian/atlaskit/commits/a111cf2))

## 2.4.2 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 2.4.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 2.1.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 2.1.0 (2017-07-17)

- feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 2.0.0 (2017-05-30)

- refactor tabs to styled-components. Rename StatelessTabs named export to TabsSta ([b77172d](https://bitbucket.org/atlassian/atlaskit/commits/b77172d))
- breaking; Rename StatelessTabs named export to TabsStateless for consistency.
- ISSUES CLOSED: #AK-2396

## 1.3.3 (2017-05-26)

- fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))
- fix; pin react-lorem-component version to avoid newly released broken version ([6f3d9c6](https://bitbucket.org/atlassian/atlaskit/commits/6f3d9c6))

## 1.3.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 1.3.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 1.3.0 (2017-04-20)

- feature; removed explicit style! imports, set style-loader in webpack config ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))

## 1.2.8 (2017-03-23)

- fix; empty commit to force release of tabs ([47d958e](https://bitbucket.org/atlassian/atlaskit/commits/47d958e))

## 1.2.6 (2017-03-21)

- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.2.5 (2017-02-22)

- fix; trigger onSelect prop on keyboard nav ([71bb315](https://bitbucket.org/atlassian/atlaskit/commits/71bb315))

## 1.2.4 (2017-02-10)

- fix; render tabs with flex content correctly in FF and IE11 ([dc181da](https://bitbucket.org/atlassian/atlaskit/commits/dc181da))

## 1.2.2 (2017-02-07)

- fix; Updates docs to use https to load demo image ([0468d4d](https://bitbucket.org/atlassian/atlaskit/commits/0468d4d))
- fix; small design fixes for tabs ([d3a6666](https://bitbucket.org/atlassian/atlaskit/commits/d3a6666))

## 1.2.0 (2017-02-03)

- fix; support centering of tab flex children ([87fe198](https://bitbucket.org/atlassian/atlaskit/commits/87fe198))
- feature; support fitting tabs inside a flex box container ([4158cd8](https://bitbucket.org/atlassian/atlaskit/commits/4158cd8))
