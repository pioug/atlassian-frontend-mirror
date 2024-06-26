# @atlaskit/badge

## 16.2.2

### Patch Changes

- Updated dependencies

## 16.2.1

### Patch Changes

- Updated dependencies

## 16.2.0

### Minor Changes

- [#111696](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111696)
  [`20c2d58f6f8a9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/20c2d58f6f8a9) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.
- [#111623](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111623)
  [`0392b6e4d865a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0392b6e4d865a) -
  Sets `flex-shrink: 0` on Badge to avoid it spanning multiple lines when in flex containers that
  aren't wide enough.

### Patch Changes

- Updated dependencies

## 16.1.2

### Patch Changes

- Updated dependencies

## 16.1.1

### Patch Changes

- Updated dependencies

## 16.1.0

### Minor Changes

- [#94806](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94806)
  [`6f40240a7290`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6f40240a7290) -
  Removed feature flag from previous release, keeping the newer changes.

## 16.0.0

### Major Changes

- [#88033](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88033)
  [`8c3fac87dcc9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8c3fac87dcc9) -
  Badge now sets specific font size, line height, font style, and font family properties under the
  hood. If you previously had Badge wrapped with elements like `<em>` or `<strong>` that specify
  font style or font weight properties, there will be a visual difference as these styles are
  overriden within Badge. Avoid wrapping Badge in elements that modify text properties.

  If you need to preserve these styles, wrap the children of Badge instead, for example:
  `<Badge><em>1</em></Badge>`. Please note however this is not fully supported and will not work
  with the `max` prop.

## 15.3.0

### Minor Changes

- [#87252](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87252)
  [`eef585934a84`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eef585934a84) -
  Add support for React 18 in non-strict mode.

### Patch Changes

- Updated dependencies

## 15.2.7

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 15.2.6

### Patch Changes

- Updated dependencies

## 15.2.5

### Patch Changes

- [#81805](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81805)
  [`36d7e564977a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/36d7e564977a) -
  Explicitly coerce value in `getSafeValue` utility function to improve compatibility with
  TypeScript 5

## 15.2.4

### Patch Changes

- Updated dependencies

## 15.2.3

### Patch Changes

- Updated dependencies

## 15.2.2

### Patch Changes

- Updated dependencies

## 15.2.1

### Patch Changes

- [#60167](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60167)
  [`ae0930df4bfa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ae0930df4bfa) -
  Renamed supportReact18 to runReact18

## 15.2.0

### Minor Changes

- [#57070](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57070)
  [`42ba4ac39529`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/42ba4ac39529) -
  Badge now uses height: min-content so it doesn't stretch when directly used as a flex / grid item.

## 15.1.16

### Patch Changes

- [#41725](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41725)
  [`8d838ab41ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d838ab41ed) - Removed
  all remaining legacy theming logic from Badge, IconObject, Lozenge and SectionMessage. This only
  affects the examples and some tests in each component. No internal component logic contained
  legacy theming.

## 15.1.15

### Patch Changes

- Updated dependencies

## 15.1.14

### Patch Changes

- [#37533](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37533)
  [`1ed303de3e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1ed303de3e8) - Updated
  dependencies
- [#37419](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37419)
  [`95401cac781`](https://bitbucket.org/atlassian/atlassian-frontend/commits/95401cac781) - Internal
  change to component composition. There is no expected change.

## 15.1.13

### Patch Changes

- [#36754](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36754)
  [`4ae083a7e66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ae083a7e66) - Use
  `@af/accessibility-testing` for default jest-axe config and jest-axe import in accessibility
  testing.

## 15.1.12

### Patch Changes

- [#36412](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36412)
  [`7e4085cd951`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e4085cd951) - Allow
  caret version range in @atlaskit/primitives dependency.

## 15.1.11

### Patch Changes

- Updated dependencies

## 15.1.10

### Patch Changes

- Updated dependencies

## 15.1.9

### Patch Changes

- Updated dependencies

## 15.1.8

### Patch Changes

- [#35712](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35712)
  [`5af07899f5b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5af07899f5b) - Loosens
  types to better reflect `xcss` API.
- Updated dependencies

## 15.1.7

### Patch Changes

- Updated dependencies

## 15.1.6

### Patch Changes

- [#35337](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35337)
  [`529814693a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/529814693a1) - Pin
  version of @atlaskit/primitives so it resolves to correct version

## 15.1.5

### Patch Changes

- [#33833](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33833)
  [`b8b41649492`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8b41649492) - Update
  how certain background colors are referenced by name. Internal changes only.
- Updated dependencies

## 15.1.4

### Patch Changes

- [#34922](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34922)
  [`779727e307a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/779727e307a) - Internal
  change only. Replace all instances of Box with stable @atlaskit/primitives version.

## 15.1.3

### Patch Changes

- [#34124](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34124)
  [`77766ad157d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/77766ad157d) - Enrol
  packages to push-model consumption in Jira.

## 15.1.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 15.1.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 15.1.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 15.0.23

### Patch Changes

- [#27891](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27891)
  [`a7f643a0ee7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a7f643a0ee7) - Updated
  badge line-height to use design system values, removed block padding. There are no visual or
  behaviour changes.
- [`eadbf13d8c0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eadbf13d8c0) - Updated
  usages of `Text`, `Box`, `Stack`, and `Inline` primitives to reflect their updated APIs. There are
  no visual or behaviour changes.
- Updated dependencies

## 15.0.22

### Patch Changes

- [#25860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25860)
  [`936d6bccf4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/936d6bccf4f) - Update
  to emotion v11. No expected behaviour change.
- [`e35fc41dc33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e35fc41dc33) - Internal
  change to use updated primtive spacing prop values. No expected behaviour change.
- Updated dependencies

## 15.0.21

### Patch Changes

- [#26488](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26488)
  [`bc989043572`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc989043572) - Internal
  changes to apply spacing tokens. This should be a no-op change.

## 15.0.20

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 15.0.19

### Patch Changes

- [#24991](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24991)
  [`342ab3bc77e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/342ab3bc77e) - Update
  ds-explorations dependency to support previous patch

## 15.0.18

### Patch Changes

- [#24929](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24929)
  [`57adb9bb931`](https://bitbucket.org/atlassian/atlassian-frontend/commits/57adb9bb931) - Fixes an
  issue with '@atlaskit/badge' text color for certain appearances.

## 15.0.17

### Patch Changes

- [#24916](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24916)
  [`fe54d8f1aec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe54d8f1aec) - Update
  ds-explorations dependency. No change in behaviour.

## 15.0.16

### Patch Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004)
  [`06fd023cd85`](https://bitbucket.org/atlassian/atlassian-frontend/commits/06fd023cd85) - Minor
  internal change to how text is displayed. No change to consumers.
- [`52809e4839b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/52809e4839b) - Allow
  makers to disable max value formatting in the Badge component
- Updated dependencies

## 15.0.15

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 15.0.14

### Patch Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`899199caabb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/899199caabb) - Internal
  changes to the way styles are applied. There should be no noticeable changes to consumers.
- [`8067cc918d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8067cc918d9) - Update
  implementation to match changes made to Text primitive
- [`ea36ea17c4e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea36ea17c4e) - Text now
  supports text-align and it's used for Badge to retain existing visuals
- Updated dependencies

## 15.0.13

### Patch Changes

- Updated dependencies

## 15.0.12

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 15.0.11

### Patch Changes

- Updated dependencies

## 15.0.10

### Patch Changes

- Updated dependencies

## 15.0.9

### Patch Changes

- Updated dependencies

## 15.0.8

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Updates
  usage of deprecated token names so they're aligned with the latest naming conventions. No UI or
  visual changes
- Updated dependencies

## 15.0.7

### Patch Changes

- Updated dependencies

## 15.0.6

### Patch Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving bundle size.
- Updated dependencies

## 15.0.5

### Patch Changes

- Updated dependencies

## 15.0.4

### Patch Changes

- Updated dependencies

## 15.0.3

### Patch Changes

- Updated dependencies

## 15.0.2

### Patch Changes

- Updated dependencies

## 15.0.1

### Patch Changes

- Updated dependencies

## 15.0.0

### Major Changes

- [#12837](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12837)
  [`942dd25df09`](https://bitbucket.org/atlassian/atlassian-frontend/commits/942dd25df09) - In this
  version we made **Badge** dramatically faster and lighter.

  - General performance improvements.

  - We are now exporting a new `style` prop which you can use to pass a custom `backgroundColor` and
    `color`.

  - You can now pass `ReactNode` instead of `string` as children; however, **Badge** should only be
    used in cases where you want to represent a number. If the value is `number`, we will use
    existing formatting based on the `max` prop, otherwise the value will get rendered as it is.

  - [**BREAKING**] We have removed the deprecated `theme` prop. Please use a combination of
    `appearance` and `style` prop for custom theming.

  **Before**:

  ```tsx
  import Badge from '@atlaskit/badge';

  type GetThemeTokensFn<ThemeTokens, ThemeProps> = (props: ThemeProps) => ThemeTokens;

  function themeGetterFunction<ThemeTokens, ThemeProps>(
  	getTokens: GetThemeTokensFn<ThemeTokens, ThemeProps>,
  	themeProps: ThemeProps,
  ): ThemeTokens {
  	const defaultTokens = getTokens(themeProps);

  	if (themeProps.appearance === 'removed') {
  		return {
  			...defaultTokens,
  			textColor: 'grey',
  		};
  	}

  	return defaultTokens;
  }

  <Badge appearance="removed" theme={themeGetterFunction}>
  	{10}
  </Badge>;
  ```

  **After**:

  ```tsx
  import Badge, { BadgeProps } from '@atlaskit/badge';

  function getStyle(appearance: BadgeProps['appearance']) {
  	if (appearance === 'removed') {
  		return {
  			color: 'grey',
  		};
  	}

  	return undefined;
  }

  const appearance = 'removed';

  <Badge appearance={appearance} style={getStyle(appearance)}>
  	{10}
  </Badge>;
  ```

  - [**BREAKING**] We have removed `Container` and `Format` components. Please use a combination of
    `style` and `ReactNode` type `children` prop for customization.

  **Before**:

  ```tsx
  import { Container, Format } from '@atlaskit/badge';

  <Container backgroundColor="red" textColor="blue">
  	<em>
  		<Format>{10}</Format>
  	</em>
  </Container>;
  ```

  **After**:

  ```tsx
  import Badge from '@atlaskit/badge';

  <Badge style={{ backgroundColor: 'red', color: 'blue' }}>
    <em>
      {10}
    </em>
  </Badge>

  // or if you are passing `max` prop so that formatting logic should work

  <em>
    <Badge style={{ backgroundColor: 'red', color: 'blue' }} max={5}>
      {10}
    </Badge>
  </em>
  ```

  - [**BREAKING**] We have removed the support of `appearance` prop object value. Please use `style`
    prop for customization.

  **Before**:

  ```tsx
  import Badge from '@atlaskit/badge';

  <Badge appearance={{ backgroundColor: 'red', textColor: 'blue' }}>{10}</Badge>;
  ```

  **After**:

  ```tsx
  import Badge from '@atlaskit/badge';

  <Badge style={{ backgroundColor: 'red', color: 'blue' }}>{10}</Badge>;
  ```

  **Running the codemod cli**

  To run the codemod: **You first need to have the latest version installed**

  ```bash

  yarn upgrade @atlaskit/badge@^15.0.0

  ```

  Once upgraded, use `@atlaskit/codemod-cli` via `npx`:

  ```bash

  npx @atlaskit/codemod-cli --parser babel --extensions ts,tsx,js [relativePath]

  ```

  The CLI will show a list of components and versions so select `@atlaskit/badge@^15.0.0` and you
  will automatically be upgraded.

  What will be changed:

  - It will move `backgroundColor` and `textColor` from `appearance` prop (if object is passed as
    `appearance` prop value) to `style` prop.

  Run `npx @atlaskit/codemod-cli -h` for more details on usage.

  For Atlassians, refer to the
  [documentation](https://hello.atlassian.net/wiki/spaces/AF/pages/2627171992/Codemods) for more
  details on the codemod CLI.

### Minor Changes

- [`0ced21f8470`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ced21f8470) - [ux]
  Colors are now sourced through tokens.

### Patch Changes

- Updated dependencies

## 14.3.2

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 14.3.1

### Patch Changes

- [#12328](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12328)
  [`9c98e8227f6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9c98e8227f6) - Internal
  refactor for style declarations.

## 14.3.0

### Minor Changes

- [#11649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11649)
  [`ed3b6be05af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed3b6be05af) - - Expose
  2 new entry points: badge and types
  - Internal refactoring

### Patch Changes

- [`75b394efe89`](https://bitbucket.org/atlassian/atlassian-frontend/commits/75b394efe89) - Added
  the design-system tech stacks to the package.json and fixed linting errors, also disabled some
  linting rules to prevent breaking changes
- [`e3205bce20d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3205bce20d) - Internal
  change (migrated from styled-components to emotion)

## 14.2.1

### Patch Changes

- [#12167](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12167)
  [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates
  to development dependency `storybook-addon-performance`

## 14.2.0

### Minor Changes

- [#12170](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12170)
  [`f6b951a51f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6b951a51f2) - Removes
  usage of styled-components in favour of standardising on emotion

## 14.1.1

### Patch Changes

- [#11113](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11113)
  [`b71c7c1e132`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b71c7c1e132) - Added
  the `design-system` tech stacks to the `package.json`

## 14.1.0

### Minor Changes

- [#7170](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7170)
  [`4f9e6e2db5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f9e6e2db5) - These
  packages now have defined entry points -- this means that you cannot access internal files in the
  packages that are not meant to be public. Sub-components in these packages have been explicitly
  defined, aiding tree-shaking and reducing bundle size.

## 14.0.7

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 14.0.6

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 14.0.5

### Patch Changes

- Updated dependencies

## 14.0.4

### Patch Changes

- [#4707](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4707)
  [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable
  integration tests for Edge browser

## 14.0.3

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 14.0.2

### Patch Changes

- [#3293](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3293)
  [`954cc87b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/954cc87b62) - The readme
  and package information has been updated to point to the new design system website.

## 14.0.1

### Patch Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all
  the theme imports to be tree-shakable

## 14.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 13.1.10

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 13.1.9

### Patch Changes

- Updated dependencies

## 13.1.8

### Patch Changes

- [patch][093fdc91b1](https://bitbucket.org/atlassian/atlassian-frontend/commits/093fdc91b1):

  Change imports to comply with Atlassian conventions- Updated dependencies
  [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):

  - @atlaskit/webdriver-runner@0.3.4

## 13.1.7

### Patch Changes

- Updated dependencies
  [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies
  [64fb94fb1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/64fb94fb1e):
- Updated dependencies
  [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies
  [109c1a2c0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c1a2c0a):
- Updated dependencies
  [c57bb32f6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/c57bb32f6d):
  - @atlaskit/docs@8.4.0
  - @atlaskit/webdriver-runner@0.3.0

## 13.1.6

### Patch Changes

- Updated dependencies
  [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0

## 13.1.5

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/theme@9.5.1

## 13.1.4

### Patch Changes

- [patch][4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):

  Removes babel/runtime from dependencies. Users should see a smaller bundlesize as a result-
  Updated dependencies
  [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):

  - @atlaskit/theme@9.5.0

## 13.1.3

### Patch Changes

- [patch][557a8e2451](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/557a8e2451):

  Rebuilds package to fix typescript typing error.

## 13.1.2

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 13.1.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 13.1.0

### Minor Changes

- [minor][a97f1c5b5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a97f1c5b5e):

  Adding an optional prop `testId` that will set the attribute value `data-testid`. It will help
  products to write better integration and end to end tests.

## 13.0.0

### Major Changes

- [major][6410edd029](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6410edd029):

  Deprecated props, `value` and `onValueUpdated` have been removed from the Badge component. Please
  use the children prop instead.

## 12.1.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 12.0.8

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 12.0.7

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 12.0.6

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 12.0.5

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 12.0.4

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 12.0.3

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root Please see this
    [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this
    [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points)
    for further details

## 12.0.2

### Patch Changes

- [patch][d0db01b410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0db01b410):

  TypeScript users of withAnalyticsEvents and withAnalyticsContext are now required to provide props
  as a generic type. This is so that TypeScript can correctly calculate the props and defaultProps
  of the returned component.

  Before:

  ```typescript
  withAnalyticsEvents()(Button) as ComponentClass<Props>;
  ```

  After:

  ```typescript
  withAnalyticsEvents<Props>()(Button);
  ```

## 12.0.1

### Patch Changes

- [patch][29a1f158c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29a1f158c1):

  Use default react import in typescript files.

## 12.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 11.0.3

- [patch][50e8c82ec4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50e8c82ec4):

  - index.ts is now ignored when published to npm to avoid ambiguity between ts and js files

## 11.0.2

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 11.0.1

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/theme@8.1.7

## 11.0.0

- [major][c95557e3ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c95557e3ff):

  - Drops flow support.
  - Badge has been internally converted to TypeScript.
  - Typescript consumers will get static type safety.
  - No API or behavioural changes.

## 10.0.1

- [patch][98e11001ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98e11001ff):

  - Removes duplicate babel-runtime dependency

## 10.0.0

- [major][76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):

  - Drop ES5 from all the flow modules

  ### Dropping CJS support in all @atlaskit packages

  As a breaking change, all @atlaskit packages will be dropping cjs distributions and will only
  distribute esm. This means all distributed code will be transpiled, but will still contain
  `import` and `export` declarations.

  The major reason for doing this is to allow us to support multiple entry points in packages, e.g:

  ```js
  import colors from `@atlaskit/theme/colors`;
  ```

  Previously this was sort of possible for consumers by doing something like:

  ```js
  import colors from `@atlaskit/theme/dist/esm/colors`;
  ```

  This has a couple of issues. 1, it treats the file system as API making internal refactors harder,
  we have to worry about how consumers might be using things that aren't _actually_ supposed to be
  used. 2. We are unable to do this _internally_ in @atlaskit packages. This leads to lots of
  packages bundling all of theme, just to use a single color, especially in situations where tree
  shaking fails.

  To support being able to use multiple entrypoints internally, we unfortunately cannot have
  multiple distributions as they would need to have very different imports from of their own
  internal dependencies.

  ES Modules are widely supported by all modern bundlers and can be worked around in node
  environments.

  We may choose to revisit this solution in the future if we find any unintended condequences, but
  we see this as a pretty sane path forward which should lead to some major bundle size decreases,
  saner API's and simpler package architecture.

  Please reach out to #fabric-build (if in Atlassian) or create an issue in
  [Design System Support](https://ecosystem.atlassian.net/secure/CreateIssue.jspa?pid=24670) (for
  external) if you have any questions or queries about this.

## 9.2.2

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 9.2.1

- [patch][d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):

  - Change API to experimental theming API to namespace component themes into separate contexts and
    make theming simpler. Update all dependant components.

## 9.2.0

- [minor] Allow badge to accept strings, so custom number formats can be easily passed in
  [cc0a1de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc0a1de)

## 9.1.5

- [patch] Adds missing implicit @babel/runtime dependency
  [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 9.1.4

- [patch] Adds sideEffects: false to allow proper tree shaking
  [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 9.1.2

- [patch] Fix broken type export
  [a203203](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a203203)

## 9.1.1

- [patch] Remove export from \* to fix the cjs export
  [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)

## 9.1.0

- [minor] Update badge to the new theming API. Rework experimental theming API.
  [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
- [patch] Updated dependencies
  [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/docs@5.0.6

## 9.0.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions
  read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/theme@5.1.3

## 9.0.3

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/theme@5.1.2
  - @atlaskit/docs@5.0.2

## 9.0.2

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/theme@5.1.1

## 9.0.1

- [patch] Move analytics tests and replace elements to core
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/docs@5.0.1

## 9.0.0

- [major] Updates to React ^16.4.0
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0

## 8.1.0

- [minor] Create a Container and Format export so that you can compose custom badges together.
  [ac1b819](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ac1b819)

## 8.0.3

- [patch] Update changelogs to remove duplicate
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/docs@4.1.1

## 8.0.2

- [none] Updated dependencies
  [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2

## 8.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies
  [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/theme@4.0.1
  - @atlaskit/docs@4.0.1

## 8.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to
  ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies
  [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0

## 7.1.3

- [patch] Update color pairing for Badge
  [168773b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/168773b)

## 7.1.2

- [patch] Updated dependencies
  [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4

## 7.1.0

- [minor] Added ability to specify an object as the badge appearance. Added an Appearance export to
  theme so that we can use strings and objects for appearance theming."
  [6e89615](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e89615)

## 7.0.0

- [major] Bump to React 16.3.
  [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 6.3.1

- [patch] Re-releasing due to potentially broken babel release
  [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 6.3.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3
  [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 6.2.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2
  [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 6.2.1

- [patch] Packages Flow types for elements components
  [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 6.2.0

- [minor] Add React 16 support.
  [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 6.1.0 (2017-08-24)

- feature; remove util-shared-styles as a dependency
  ([52a0a63](https://bitbucket.org/atlassian/atlaskit/commits/52a0a63))
- feature; adjust dark mode colors to spec 1.2, add primaryInveted appearance
  ([9c79e7b](https://bitbucket.org/atlassian/atlaskit/commits/9c79e7b))

## 6.0.0 (2017-08-11)

- bug fix; fix the theme-dependency
  ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))
- bug fix; reimplement appearance prop validation for badges
  ([25dabe3](https://bitbucket.org/atlassian/atlaskit/commits/25dabe3))
- breaking; affects internal styled-components implementation
  ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- breaking; implement dark mode theme
  ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))

## 5.0.0 (2017-08-11)

- bug fix; reimplement appearance prop validation for badges
  ([25dabe3](https://bitbucket.org/atlassian/atlaskit/commits/25dabe3))
- breaking; affects internal styled-components implementation
  ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- breaking; implement dark mode theme
  ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))

## 4.5.2 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily
  ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 4.5.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps
  ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 4.2.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts
  ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 4.2.0 (2017-07-17)

- feature; added ES module builds to dist and add jsnext:main to most ADG packages
  ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 4.1.0 (2017-07-06)

- feature; reducing the contrast of white on blue for global nav
  ([ff89e2b](https://bitbucket.org/atlassian/atlaskit/commits/ff89e2b))

## 4.0.5 (2017-05-26)

- fix; add prop-types as a dependency to avoid React 15.x warnings
  ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))

## 4.0.3 (2017-05-10)

- fix; testing releasing more than 5 packages at a time
  ([e69b832](https://bitbucket.org/atlassian/atlaskit/commits/e69b832))
- fix; update dependencies ([0c92fef](https://bitbucket.org/atlassian/atlaskit/commits/0c92fef))

## 4.0.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license.
  ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 4.0.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and
  ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 4.0.0 (2017-04-12)

- null align component with new conventions
  ([726dc9b](https://bitbucket.org/atlassian/atlaskit/commits/726dc9b))
- breaking; removed TypeScript
- ISSUES CLOSED: AK-2084

## 3.0.2 (2017-04-11)

- fix; update badge stories to fix proptype bug
  ([0fa922f](https://bitbucket.org/atlassian/atlaskit/commits/0fa922f))

## 3.0.1 (2017-04-10)

- fix; simplify the Badge component, fixes tests and docs
  ([07946a1](https://bitbucket.org/atlassian/atlaskit/commits/07946a1))

## 3.0.0 (2017-03-29)

- feature; update badge to use new guidelines, and readme story
  ([fe7bd5a](https://bitbucket.org/atlassian/atlaskit/commits/fe7bd5a))
- breaking; remove APPEARANCE_ENUM and THEME_ENUM from exports
- ISSUES CLOSED: AK-1534

## 2.0.0 (2017-03-27)

- null refactor the badge component to use styled-components
  ([70aa262](https://bitbucket.org/atlassian/atlaskit/commits/70aa262))
- breaking; badges now require peerDep styled-components
- ISSUES CLOSED: AK-1943

## 1.2.3 (2017-03-23)

- fix; Empty commit to release the component
  ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))
- null refactor the badge component to use styled-components
  ([a5c8722](https://bitbucket.org/atlassian/atlaskit/commits/a5c8722))
- breaking; badges now require peerDep styled-components
- ISSUES CLOSED: AK-1943

## 1.2.1 (2017-03-21)

- fix; maintainers for all the packages were added
  ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.1.0 (2017-03-15)

- feature; added application links to media-card and restructured
  ([618650e](https://bitbucket.org/atlassian/atlaskit/commits/618650e))
- feature; added typescript definition file to badges
  ([a067336](https://bitbucket.org/atlassian/atlaskit/commits/a067336))

## 1.0.3 (2017-02-16)

- fix; refactor stories to use // rather than http://
  ([a0826cf](https://bitbucket.org/atlassian/atlaskit/commits/a0826cf))

## 1.0.2 (2017-02-10)

- fix; Dummy commit to release components to registry
  ([5bac43b](https://bitbucket.org/atlassian/atlaskit/commits/5bac43b))

## 1.0.1 (2017-02-06)

- fix; Bumps dependencies to used scoped packages
  ([f41dbfc](https://bitbucket.org/atlassian/atlaskit/commits/f41dbfc))
