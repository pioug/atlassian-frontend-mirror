# @atlaskit/logo

## 19.9.4

### Patch Changes

- Updated dependencies

## 19.9.3

### Patch Changes

- Updated dependencies

## 19.9.2

### Patch Changes

- [`d55bbfc88149b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d55bbfc88149b) -
  Internal changes to logo generation; package no longer consumes @atlaskit/temp-nav-app-icons

## 19.9.1

### Patch Changes

- Updated dependencies

## 19.9.0

### Minor Changes

- [`2b99763b3879d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2b99763b3879d) -
  Minor bump to force all consumers to update to receive patch bumps 19.8.1 -> 19.8.3

## 19.8.3

### Patch Changes

- [`6bbf9c58510f8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6bbf9c58510f8) -
  Internal update to support feature flagging updated logo design
- Updated dependencies

## 19.8.2

### Patch Changes

- [`5f025f8437a46`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5f025f8437a46) -
  Internal changes to support updates to `chat`, `search` and `studio` logos. These changes are
  being tested behind a feature flag, and will be available in a future release.
- Updated dependencies

## 19.8.1

### Patch Changes

- Updated dependencies

## 19.8.0

### Minor Changes

- [`24c86074987da`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/24c86074987da) -
  Added `rovo-dev` and `rovo-dev-agent` logos

### Patch Changes

- Updated dependencies

## 19.7.3

### Patch Changes

- Updated dependencies

## 19.7.2

### Patch Changes

- [`23bcc5bbc9cee`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/23bcc5bbc9cee) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 19.7.1

### Patch Changes

- Updated dependencies

## 19.7.0

### Minor Changes

- [`46af0313b8e7a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/46af0313b8e7a) -
  We are testing rebranded logos behind a feature flag. If this change is successful it will be
  available in a later release.

## 19.6.2

### Patch Changes

- Updated dependencies

## 19.6.1

### Patch Changes

- Updated dependencies

## 19.6.0

### Minor Changes

- [#188580](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188580)
  [`0f6c63fbd303f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0f6c63fbd303f) -
  **Added**: **`JiraServiceManagementDataCenterLogo`** and **`JiraServiceManagementDataCenterIcon`**

### Patch Changes

- Updated dependencies

## 19.5.3

### Patch Changes

- Updated dependencies

## 19.5.2

### Patch Changes

- [#185530](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185530)
  [`555824150f707`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/555824150f707) -
  Fixed inconsistency in `aria-label` handling between old and new logo designs. When label is an
  empty string, new logos (with `shouldUseNewLogoDesign`) now correctly remove the `aria-label`
  attribute to make them decorative, matching the behavior of old logos.
- Updated dependencies

## 19.5.1

### Patch Changes

- Updated dependencies

## 19.5.0

### Minor Changes

- [#179339](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/179339)
  [`b4951bab10eb2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b4951bab10eb2) -
  **Added**:
  - **`CrowdLogo`** and **`CrowdIcon`**
  - **`BambooLogo`** and **`BambooIcon`**
  - **`raw-icons`** entrypoint with string-encoded versions of all logo icons for use in favicons
    and other scenarios where React components cannot be used

### Patch Changes

- Updated dependencies

## 19.4.0

### Minor Changes

- [#177235](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/177235)
  [`227f5ae9544a1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/227f5ae9544a1) -

  **Updated**:
  - **`LoomAttributionLogo`** and **`LoomAttributionIcon`**: support new logo design language.

  **Added**:
  - **`LoomBlurpleLogo`** and **`LoomBlurpleIcon`**: matches the new logo design language, but using
    Loom's blurple color

### Patch Changes

- Updated dependencies

## 19.3.1

### Patch Changes

- [#177236](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/177236)
  [`2bf9f8bd0c060`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2bf9f8bd0c060) -
  Internal documentation changes

## 19.3.0

### Minor Changes

- [#176906](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/176906)
  [`86b046c9bf641`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/86b046c9bf641) -
  **Added**:
  - **`BitbucketDataCenterLogo`** and **`BitbucketDataCenterIcon`**
  - **`JiraDataCenterLogo`** and **`JiraDataCenterIcon`**
  - **`ConfluenceDataCenterLogo`** and **`ConfluenceDataCenterIcon`**

### Patch Changes

- Updated dependencies

## 19.2.0

### Minor Changes

- [#173001](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/173001)
  [`445bba751a18a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/445bba751a18a) -
  **Added**:
  - **`AdminLogo`** and **`AdminIcon`**
  - **`AnalyticsLogo`** and **`AnalyticsIcon`**
  - **`AlignLogo`** and **`AlignIcon`**

  **Updated**: Feature flagging added to:
  - **`AtlassianAdministrationLogo`** and **`AtlassianAdministrationIcon`**
  - **`AtlassianAnalyticsLogo`** and **`AtlassianAnalyticsIcon`**
  - **`AtlassianAlignLogo`** and **`AtlassianAlignIcon`**

## 19.1.0

### Minor Changes

- [#169522](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/169522)
  [`e55cd122d35de`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e55cd122d35de) -
  Added a new prop, `shouldUseNewLogoDesign`, to allow new logo designs to be enabled ahead of
  feature flag roll-out

## 19.0.1

### Patch Changes

- [#164618](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/164618)
  [`6085f82218cd6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6085f82218cd6) -
  Fixed headings not appearing correctly on atlassian.design docs

## 19.0.0

### Major Changes

- [#163522](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/163522)
  [`76358104532e5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/76358104532e5) -
  **Removed**:
  - `admin`, `align`, `analytics`, `company-hub` and `guard-detect` logos
  - These logos have been feature flagged behind existing entry points.

### Patch Changes

- Updated dependencies

## 18.2.0

### Minor Changes

- [#159181](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159181)
  [`11df1e34c5d4f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/11df1e34c5d4f) -
  New logo designs have been added behind a feature flag

### Patch Changes

- Updated dependencies

## 18.1.0

### Minor Changes

- [#154600](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/154600)
  [`d573e939cabe3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d573e939cabe3) -
  Adds `xxsmall` size to Logo, that maps to the same size as `xsmall`.

  In a future major bump of this component, the `xsmall` size will be updated to render logos at
  20px height; please migrate any usages before then.

## 18.0.0

### Major Changes

- [#146780](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/146780)
  [`c1fa4405cb8c6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c1fa4405cb8c6) -
  Remove deprecated default prop constants.

## 17.0.0

### Major Changes

- [#148090](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148090)
  [`6b95a2eecc267`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6b95a2eecc267) -

  **Removed deprecated logos**:
  - `HalpIcon`, `HalpLogo`
  - `AtlassianStartLogo`

## 16.0.3

### Patch Changes

- [#127093](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127093)
  [`1378ea7a99ce1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1378ea7a99ce1) -
  Upgrades `jscodeshift` to handle generics properly.
- Updated dependencies

## 16.0.2

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.

## 16.0.1

### Patch Changes

- Updated dependencies

## 16.0.0

### Major Changes

- [#117363](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117363)
  [`10a0f7f6c2027`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10a0f7f6c2027) -
  This package's `peerDependencies` have been adjusted for `react` and/or `react-dom` to reflect the
  status of only supporting React 18 going forward. No explicit breaking change to React support has
  been made in this release, but this is to signify going forward, breaking changes for React 16 or
  React 17 may come via non-major semver releases.

  Please refer this community post for more details:
  https://community.developer.atlassian.com/t/rfc-78-dropping-support-for-react-16-and-rendering-in-a-react-18-concurrent-root-in-jira-and-confluence/87026

### Patch Changes

- Updated dependencies

## 15.4.0

### Minor Changes

- [#116138](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116138)
  [`b50c5d5d65ae2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b50c5d5d65ae2) -
  Bump to the latest version of @compiled/react

## 15.3.1

### Patch Changes

- Updated dependencies

## 15.3.0

### Minor Changes

- [#115211](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115211)
  [`3ef7f182f166b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3ef7f182f166b) -
  [ux] Updated Atlassian Analytics logo and icon to support `iconColor` and `textColor` to align
  with others.

## 15.2.2

### Patch Changes

- [#112549](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112549)
  [`ed68a8d2ee5f7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ed68a8d2ee5f7) -
  Update dependencies and remove unused exports and codemods.

## 15.2.1

### Patch Changes

- Updated dependencies

## 15.2.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 15.1.1

### Patch Changes

- Updated dependencies

## 15.1.0

### Minor Changes

- [#174515](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/174515)
  [`e948b27b6716a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e948b27b6716a) -
  [ux] Add Focus product logo.

## 15.0.0

### Major Changes

- [#170937](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170937)
  [`2f502fec31157`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2f502fec31157) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR.

  Please note, in order to use this version of `@atlaskit/logo`, you will need to ensure that your
  bundler is configured to handle `.css` imports correctly. Most bundlers come with built-in support
  for `.css` imports, so you may not need to do anything. If you are using a different bundler,
  please refer to the documentation for that bundler to understand how to handle `.css` imports.

## 14.3.5

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 14.3.4

### Patch Changes

- Updated dependencies

## 14.3.3

### Patch Changes

- Updated dependencies

## 14.3.2

### Patch Changes

- [#148281](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/148281)
  [`3c4de48168ffe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3c4de48168ffe) -
  Update the import path of `useId*` from `@atlaskit/ds-lib`
- Updated dependencies

## 14.3.1

### Patch Changes

- Updated dependencies

## 14.3.0

### Minor Changes

- [`a51c26afee964`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a51c26afee964) -
  Adds the loom attribution logo to the logo package.

## 14.2.2

### Patch Changes

- [#134918](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134918)
  [`702121b21483a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/702121b21483a) -
  Remove react-uid

## 14.2.1

### Patch Changes

- Updated dependencies

## 14.2.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 14.1.1

### Patch Changes

- [#118742](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118742)
  [`b4588e60d187b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b4588e60d187b) -
  Remove remnants of `extract-react-types`.

## 14.1.0

### Minor Changes

- [#110670](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110670)
  [`c733254a2dd6e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c733254a2dd6e) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

## 14.0.0

### Major Changes

- [#93481](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93481)
  [`fb0aacf8c8957`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fb0aacf8c8957) -
  Updates product logos following a brand refresh, cleaning up the feature flag from `13.17.0`. This
  release also deletes a number of deprecated logos and props, and marks other logos as deprecated.

  ### Breaking changes:
  - `iconGradientStart` and `iconGradientStop` props have been removed from all Icon and Logo
    components. Updated logos do not support gradients.
  - Deprecated `Wordmark` components have been removed. These wordmarks were only designed for use
    in a legacy navigation pattern which is no longer supported. If you are using these components,
    you should replace them with the appropriate `Logo` component.
  - Deleted deprecated logos:
    - `HipchatLogo` and `HipChatIcon`
    - `StrideLogo` and `StrideIcon`
    - `JiraCoreLogo` and `JiraCoreIcon`
    - `JiraServiceDeskLogo` and `JiraServiceDeskIcon`
    - `OpsGenieLogo` and `OpsGenieIcon` (old versions of `OpsgenieLogo` and `OpsgenieIcon`)

  ### Deprecations
  - `AtlasLogo` and `AtlasIcon`
  - `AtlassianStartLogo`
  - `HalpLogo` and `HalpIcon`
  - `JiraSoftwareLogo` and `JiraSoftwareIcon` - use `JiraLogo` and `JiraIcon` instead
  - `JiraWorkManagementLogo` and `JiraWorkManagementIcon` - use `JiraLogo` and `JiraIcon` instead

### Patch Changes

- Updated dependencies

## 13.17.0

### Minor Changes

- [#99225](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99225)
  [`428f67898ecb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/428f67898ecb) -
  [ux] Adding product logos for Guard, Rovo, Atlassian Marketplace, Atlassian Admin, Atlassian
  Administration, and Atlassian Access. Testing some other glyphs behind a feature flag, if
  successful these changes will be enabled in a future release.

## 13.16.1

### Patch Changes

- [#97031](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97031)
  [`539af758079d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/539af758079d) -
  [ux] Fixing Atlas logo bug with inconsistent sizing

## 13.16.0

### Minor Changes

- [#96639](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96639)
  [`f6cdb5e53e81`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f6cdb5e53e81) -
  Add support for React 18 in non-strict mode.

## 13.15.4

### Patch Changes

- [#92537](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92537)
  [`d6c368b4b3e5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d6c368b4b3e5) -
  [ux] This release updates some glyph, colour and theming behaviour changes.

## 13.15.3

### Patch Changes

- [#92971](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92971)
  [`89925a9d50b2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/89925a9d50b2) -
  [ux] This release tests some Jira Align and Atlas glyph, colour and theming behaviour changes
  behind a feature flag. If successful, these changes will be enabled in a future release.
- Updated dependencies

## 13.15.2

### Patch Changes

- [#89713](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89713)
  [`57d3c407b13c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57d3c407b13c) -
  [ux] This release tests some glyph, colour and theming behaviour changes behind a feature flag. If
  successful, these changes will be enabled in a future release.

## 13.15.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 13.15.0

### Minor Changes

- [#64792](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64792)
  [`5e543c3a5479`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e543c3a5479) -
  Adds Loom icon and logo components.

## 13.14.9

### Patch Changes

- [#40928](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40928)
  [`dbe29ba5d95`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dbe29ba5d95) - remove
  unused size/label paramaters to fix ts error

## 13.14.8

### Patch Changes

- [#36754](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36754)
  [`4ae083a7e66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ae083a7e66) - Use
  `@af/accessibility-testing` for default jest-axe config and jest-axe import in accessibility
  testing.

## 13.14.7

### Patch Changes

- [#33652](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33652)
  [`e7ea6832ad2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7ea6832ad2) - Bans the
  use of React.FC/React.FunctionComponent type in ADS components as part of the React 18 migration
  work. The change is internal only and should not introduce any changes for the component
  consumers.

## 13.14.6

### Patch Changes

- [#34445](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34445)
  [`33f10b7eb36`](https://bitbucket.org/atlassian/atlassian-frontend/commits/33f10b7eb36) - Removing
  unused dependencies and dev dependencies

## 13.14.5

### Patch Changes

- [#32935](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32935)
  [`b1bdec7cce2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1bdec7cce2) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 13.14.4

### Patch Changes

- [#34305](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34305)
  [`0ee3115921e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ee3115921e) - [ux]
  removed width property in svg tag fro atlas logo

## 13.14.3

### Patch Changes

- [#34124](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34124)
  [`77766ad157d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/77766ad157d) - Enrol
  packages to push-model consumption in Jira.

## 13.14.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 13.14.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 13.14.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 13.13.0

### Minor Changes

- [#32323](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32323)
  [`5111380b383`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5111380b383) - Adds
  logo assets for Atlas

## 13.12.1

### Patch Changes

- [#32294](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32294)
  [`e0460d5d989`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0460d5d989) - Usages
  of `process` are now guarded by a `typeof` check.

## 13.12.0

### Minor Changes

- [#31973](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31973)
  [`4d2e52e86d3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d2e52e86d3) - [ux] Add
  Atlassian Analytics logo and icon. Also fixes a bug with non-unique linear-gradient ids where
  subsequent logos on a page could be impacted by display/vvisibility styles applied to the first
  logo on a page.

## 13.11.2

### Patch Changes

- [#31206](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31206)
  [`261420360ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/261420360ec) - Upgrades
  component types to support React 18.
- Updated dependencies

## 13.11.1

### Patch Changes

- [#29835](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29835)
  [`b77d5924c19`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b77d5924c19) - [ux]
  Remove "width" attribute from Jira Product Discovery logo and icon SVGs.

## 13.11.0

### Minor Changes

- [#29472](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29472)
  [`a6da509aa20`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a6da509aa20) - [ux]
  Adds Jira Product Discovery logo and icon

## 13.10.5

### Patch Changes

- Updated dependencies

## 13.10.4

### Patch Changes

- Updated dependencies

## 13.10.3

### Patch Changes

- Updated dependencies

## 13.10.2

### Patch Changes

- Updated dependencies

## 13.10.1

### Patch Changes

- [#25860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25860)
  [`88a34a8c2dd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/88a34a8c2dd) - Remove
  redundant `role=presentation` on wrapping @atlaskit/icon and @atlaskit/logo spans.

## 13.10.0

### Minor Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710)
  [`68e771a783a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/68e771a783a) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

## 13.9.1

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 13.9.0

### Minor Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004)
  [`76eadca8ef3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76eadca8ef3) - Adds
  Jira Align logo, icon and wordmark.

### Patch Changes

- Updated dependencies

## 13.8.2

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 13.8.1

### Patch Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`d448e04e6a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d448e04e6a8) - [ux]
  Internal changes to make the styling more resilient to inherited styles.
- [`c320954edd7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c320954edd7) - Internal
  code change turning on new linting rules.
- Updated dependencies

## 13.8.0

### Minor Changes

- [#22642](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22642)
  [`c7c2083475d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c7c2083475d) - [ux] -
  Adds `appearance` prop that allows you to choose between three brand-approved appearances:
  `brand`, `neutral` and `inverse`. These will be based on design tokens and theme-responsive.
  - Deprecates the `iconColor`, `iconGradientStart`, `iconGradientEnd` and `textColor` props. They
    will still be supported in the immediate future but the goal is to shift usages towards using
    the `appearance` prop.

## 13.7.1

### Patch Changes

- Updated dependencies

## 13.7.0

### Minor Changes

- [#21570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21570)
  [`0793be315f4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0793be315f4) - [ux]
  This is an update to clearly mark all deprecated Logo exports as deprecated and slated for removal
  in the next major release. In the next verion we will be removing the following deprecated exports
  from the main entrypoint:
  - `StrideIcon`, `StrideLogo`, `StrideWordmark`
  - `HipchatIcon`, `HipchatLogo`, `HipchatWordmark`
  - `JiraCoreIcon`, `JiraCoreLogo`, `JiraCoreWordmark` (use `JiraWorkManagement` +
    `Icon`|`Logo`|`Wordmark` instead)
  - `JiraServiceDeskIcon`, `JiraServiceDeskLogo`, `JiraServiceDeskWordmark` (use
    `JiraServiceManagement` + `Icon`|`Logo`|`Wordmark` instead)
  - `OpsGenieIcon`, `OpsGenieLogo`, `OpsGenieWordmark` (use `Opsgenie` with a lowercase 'g' +
    `Icon`|`Logo`|`Wordmark` instead)

  We will also be removing the following deprecated exports from the `@atlaskit/logo/constants`
  entrypoint:
  - `Props` (use `LogoProps` instead)
  - `DefaultProps` (use `defaultLogoParams` instead)

  ## Codemod

  To help with this migration, we have provided a codemod that you can run to automatically update
  your imports (it will leave a comment if you are using a logo with no alternative). This codemod
  has been around for a while, but we've updated it in this release.

  Once you've upgraded `@atlaskit/logo`, use the Atlaskit codemod CLI. See
  [documentation on DAC](https://hello.atlassian.net/wiki/spaces/AF/pages/2627171992/Codemods) for
  general codemod guidance.

  Without setting options in your terminal command, you can run the following and type to search for
  `logo` and select `@atlaskit/logo: 13.6.0-rename-imports` from the interactive CLI.

  ```
  npx @atlaskit/codemod-cli [TARGET_PATH]`
  ```

  For a TypeScript codebase, a more detailed command might look something like this.

  ```
  npx @atlaskit/codemod-cli --ignore-pattern node_modules --parser tsx --extensions js,jsx,ts,tsx ./packages
  ```

  For a Flow codebase, you will want to use `--parser babylon` instead of `--parser flow`.

  ## Design System ESLint Plugin

  We've also updated `@atlaskit/eslint-plugin-design-system` to add new restrictions to these
  imports. If you haven't already, we recommend installing this plugin and enabling the rules in
  your ESLint config. For now, documentation for the plugin resides on
  [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/master/design-system/eslint-plugin/).

## 13.6.0

### Minor Changes

- [#20721](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20721)
  [`4caed6d5063`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4caed6d5063) -
  Refactors logo converting it from class components to functional components. This includes file
  renames and some API changes such as prop name changes but is still backwards compatible. These
  old APIs will be deprecated in a later release.

## 13.5.5

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 13.5.4

### Patch Changes

- [#16285](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16285)
  [`ec464e07b10`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec464e07b10) - Fixes a
  bug where the Atlassian Start logo did not render correctly on Firefox

## 13.5.3

### Patch Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302)
  [`af4bca32ad4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/af4bca32ad4) - Internal
  changes to supress eslint rules.
- Updated dependencies

## 13.5.2

### Patch Changes

- [#12837](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12837)
  [`545d363ca28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/545d363ca28) - Convert
  usage of `styled-components` to `emotion`.

## 13.5.1

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 13.5.0

### Minor Changes

- [#12328](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12328)
  [`83a089fe0cc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/83a089fe0cc) - Halp has
  been added to logos. This includes the logo, wordmark and icon.

### Patch Changes

- [`cc0c678724c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc0c678724c) - Add
  default label for Logo

## 13.4.2

### Patch Changes

- [#11649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11649)
  [`17770b662ac`](https://bitbucket.org/atlassian/atlassian-frontend/commits/17770b662ac) - NO-ISSUE
  reference existing file in af.exports['.']

## 13.4.1

### Patch Changes

- [#10230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10230)
  [`0017d2a8439`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0017d2a8439) - Since
  the logo, icon and workmard components of JiraCore, JiraServiceDesk, OpsGenie, Stride and Hipchat
  are deprecated in `@atlaskit/logo`, we provided a codemod to help consumers upgrade their
  components.

  **Running the codemod cli**

  To run the codemod: **You first need to have the latest avatar installed before you can run the
  codemod**

  `yarn upgrade @atlaskit/logo`

  Once upgraded, use the Atlaskit codemod-cli;

  `npx @atlaskit/codemod-cli --parser [PARSER] --extensions [FILE_EXTENSIONS] [TARGET_PATH]`

  Or run `npx @atlaskit/codemod-cli -h` for more details on usage. For Atlassians, refer to this doc
  for more details on the codemod CLI.

- Updated dependencies

## 13.4.0

### Minor Changes

- [#10212](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10212)
  [`5f44a31b58a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f44a31b58a) - [ux] Add
  new Trello logo, Atlassian Start logo and Compass logo to `@atlaskit/logo`

## 13.3.0

### Minor Changes

- [#9756](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9756)
  [`c8afaa49d34`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8afaa49d34) - Add
  `OpsgenieIcon`, `OpsgenieLogo` and `OpsgenieWordmark` in order to rename `OpsGenie` to `Opsgenie`,
  and deprecate the following logos:
  - `JiraCoreIcon`, `JiraCoreLogo`, `JiraCoreWordmark`
  - `JiraServiceDeskIcon`, `JiraServiceDeskLogo`, `JiraServiceDeskWordmark`
  - `StrideIcon`, `StrideLogo`, `StrideWordmark`
  - `HipchatIcon`, `HipchatLogo`, `HipchatWordmark`

### Patch Changes

- Updated dependencies

## 13.2.0

### Minor Changes

- [#9446](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9446)
  [`95838b0d7cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/95838b0d7cf) - [ux] Add
  Jira Work Management Logo

## 13.1.2

### Patch Changes

- [#9299](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9299)
  [`471e2431a7c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/471e2431a7c) -
  Downgrade back to date-fns 1.30.1 We discovered big bundle size increases associated with the
  date-fns upgrade. We're reverting the upgarde to investigate

## 13.1.1

### Patch Changes

- [#8291](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8291)
  [`70f0701c2e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70f0701c2e6) - Upgrade
  date-fns to 2.17

## 13.1.0

### Minor Changes

- [#8178](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8178)
  [`5216ebed3b6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5216ebed3b6) - Expose
  and use atlassian-icon, jira-icon entry points

## 13.0.8

### Patch Changes

- [#7762](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7762)
  [`952019cfd39`](https://bitbucket.org/atlassian/atlassian-frontend/commits/952019cfd39) - Removed
  extraneous/unnecessary dependencies for design system components.
- [`dfa1827ecad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfa1827ecad) - Fixed
  the broken "Download the logos" link on https://atlassian.design/components/logo/usage

## 13.0.7

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 13.0.6

### Patch Changes

- [#6125](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6125)
  [`ce8c85a20d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ce8c85a20d) - As part of
  this task we have introduced a new JSM logo and deprecated JSD logo

## 13.0.5

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 13.0.4

### Patch Changes

- [#4424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4424)
  [`7315203b80`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7315203b80) - Rename
  `AkCode` and `AkCodeBlock` exports to `Code` and `CodeBlock` for `@atlaskit/code`.

## 13.0.3

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 13.0.2

### Patch Changes

- [#3293](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3293)
  [`954cc87b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/954cc87b62) - The readme
  and package information has been updated to point to the new design system website.

## 13.0.1

### Patch Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`ce3b100bed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ce3b100bed) - Change the
  Atlassian Icon for better alignment with other Icons
- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all
  the theme imports to be tree-shakable

## 13.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 12.3.5

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 12.3.4

### Patch Changes

- [patch][f6667f2909](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6667f2909):

  Change imports to comply with Atlassian conventions- Updated dependencies
  [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):

- Updated dependencies
  [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies
  [f7f2068a76](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7f2068a76):
- Updated dependencies
  [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies
  [6efb12e06d](https://bitbucket.org/atlassian/atlassian-frontend/commits/6efb12e06d):
  - @atlaskit/button@13.3.11
  - @atlaskit/select@11.0.10
  - @atlaskit/code@11.1.5

## 12.3.3

### Patch Changes

- [patch][fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):

  Corrects accessibility behavior for wrapping span. It now will now:
  - conditionally set the `aria-label` if `label` is defined
  - conditionally set the `role` to either `img` if `label` is defined, or `presentation` if it is
    not defined- Updated dependencies
    [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):

- Updated dependencies
  [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
  - @atlaskit/docs@8.4.0
  - @atlaskit/field-radio-group@7.0.2
  - @atlaskit/button@13.3.9
  - @atlaskit/select@11.0.9

## 12.3.2

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):
  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/button@13.3.7
  - @atlaskit/code@11.1.3
  - @atlaskit/field-radio-group@7.0.1
  - @atlaskit/select@11.0.7
  - @atlaskit/theme@9.5.1

## 12.3.1

### Patch Changes

- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/field-radio-group@7.0.0
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/select@11.0.6

## 12.3.0

### Minor Changes

- [minor][308708081a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/308708081a):

  Export LogoProps

## 12.2.2

### Patch Changes

- [patch][30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):

  @atlaskit/select has been converted to Typescript. Typescript consumers will now get static type
  safety. Flow types are no longer provided. No API or behavioural changes.

## 12.2.1

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 12.2.0

### Minor Changes

- [minor][9e3b4ffeb1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9e3b4ffeb1):

  Add Trello logo

## 12.1.8

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 12.1.7

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 12.1.6

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 12.1.5

### Patch Changes

- [patch][6260319597](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6260319597):

  Updates OpsGenie logo width

## 12.1.4

### Patch Changes

- [patch][f34776be97](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f34776be97):

  Type definition files are now referenced in package.json

## 12.1.3

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 12.1.2

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

## 12.1.1

- Updated dependencies
  [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
  - @atlaskit/button@13.0.11
  - @atlaskit/select@10.0.0

## 12.1.0

### Minor Changes

- [minor][b81d931ee3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b81d931ee3):

  Added new OpsGenie logo, fixed the gradient for the StatusPage logo, and refactored
  atlassian-switcher to use the new logos

## 12.0.4

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 12.0.3

### Patch Changes

- [patch][94fc3757b8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/94fc3757b8):

  Update the Statuspage icon + logo

## 12.0.2

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):
  - This is just a safety release in case anything strange happened in in the previous one. See Pull
    Request #5942 for details

## 12.0.1

- Updated dependencies
  [97bfe81ec8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97bfe81ec8):
  - @atlaskit/docs@8.1.0
  - @atlaskit/code@11.0.0

## 12.0.0

- [major][4b07b57640](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b07b57640):
  - @atlaskit/logo has been converted to Typescript. Typescript consumers will now get static type
    safety. Flow types are no longer provided. No API or behavioural changes.

## 11.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 10.0.4

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/code@9.0.1
  - @atlaskit/field-radio-group@5.0.3
  - @atlaskit/select@8.1.1
  - @atlaskit/theme@8.1.7

## 10.0.3

- Updated dependencies
  [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/field-radio-group@5.0.2
  - @atlaskit/select@8.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 10.0.2

- [patch][e04a402953](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e04a402953):
  - Internal changes only. Ids relevant to Logo gradients are now ssr-friendly.

## 10.0.1

- Updated dependencies
  [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/field-radio-group@5.0.1
  - @atlaskit/select@8.0.3
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0

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

## 9.2.7

- Updated dependencies
  [06713e0a0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06713e0a0c):
  - @atlaskit/select@7.0.0

## 9.2.6

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/button@10.1.1
  - @atlaskit/code@8.2.2
  - @atlaskit/field-radio-group@4.0.14
  - @atlaskit/select@6.1.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 9.2.5

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/code@8.2.1
  - @atlaskit/field-radio-group@4.0.13
  - @atlaskit/select@6.1.10
  - @atlaskit/theme@7.0.0

## 9.2.4

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/field-radio-group@4.0.11
  - @atlaskit/select@6.1.8
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 9.2.3

- [patch] Adds missing implicit @babel/runtime dependency
  [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 9.2.2

- [patch] Updated dependencies
  [4194aa4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4194aa4)
  - @atlaskit/select@6.0.0

## 9.2.1

- [patch] Pulling the shared styles from @atlaskit/theme and removed dependency on
  util-shraed-styles [7d51a09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d51a09)

## 9.2.0

- [patch] Moved all the shared logic into the wrapper, so refactoring is easier in future
  [7e83442](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e83442)
- [minor] Make label required, but provide sane defaults
  [12839d4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12839d4)

## 9.1.0

- [minor] Update product logos alignment issues
  [6bbf9a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6bbf9a9)

## 9.0.4

- [patch] Updated dependencies
  [f9c0cdb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c0cdb)
  - @atlaskit/code@8.0.0
  - @atlaskit/docs@5.0.5

## 9.0.3

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions
  read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/select@5.0.8
  - @atlaskit/button@9.0.5
  - @atlaskit/code@7.0.3
  - @atlaskit/field-radio-group@4.0.4

## 9.0.2

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/select@5.0.7
  - @atlaskit/field-radio-group@4.0.3
  - @atlaskit/button@9.0.4
  - @atlaskit/code@7.0.2
  - @atlaskit/docs@5.0.2

## 9.0.1

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/select@5.0.6
  - @atlaskit/button@9.0.3
  - @atlaskit/code@7.0.1
  - @atlaskit/field-radio-group@4.0.2

## 9.0.0

- [major] Updates to React ^16.4.0
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/select@5.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/code@7.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/field-radio-group@4.0.0
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/select@5.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/code@7.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/field-radio-group@4.0.0

## 8.1.3

- [patch] Updated dependencies
  [eee2d45](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eee2d45)
  - @atlaskit/code@6.0.0
  - @atlaskit/docs@4.2.1

## 8.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/button@8.1.2
  - @atlaskit/field-radio-group@3.0.4

## 8.1.1

- [patch] Update changelogs to remove duplicate
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/field-radio-group@3.0.3
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1

## 8.1.0

- [none] Updated dependencies
  [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/field-radio-group@3.0.2
  - @atlaskit/docs@4.1.0
  - @atlaskit/button@8.1.0

## 8.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies
  [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/field-radio-group@3.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/docs@4.0.1

## 8.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to
  ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies
  [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/field-radio-group@3.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/docs@4.0.0

## 7.0.1

- [patch] Updated dependencies
  [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/field-radio-group@2.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/docs@3.0.4

## 7.0.0

- [major] Bump to React 16.3.
  [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 6.2.2

- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake
  [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)

## 6.2.1

- [patch] Re-releasing due to potentially broken babel release
  [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 6.2.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3
  [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 6.1.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2
  [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 6.1.1

- [patch] Packages Flow types for elements components
  [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 6.1.0

- [minor] Add React 16 support.
  [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 6.0.7

- [patch] Fix inherited color logo gradient changes not working in chrome
  [694c59f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/694c59f)

## 6.0.3

- [patch] Logo component gradients no work in Firefox and Safari [6d1f521](6d1f521)

## 6.0.0 (2017-11-09)

- breaking; Removed the collapseTo prop in favour of explicit named exports (see below).
- breaking; The default export has been removed in favour of named exports. The named exports are
  now: AtlassianLogo, AtlassianIcon, AtlassianWordmark, BitbucketLogo, BitbucketIcon,
  BitbucketWordmark, ConfluenceLogo, ConfluenceIcon, ConfluenceWordmark, HipchatLogo, HipchatIcon,
  HipchatWordmark, JiraCoreLogo, JiraCoreIcon, JiraCoreWordmark, JiraLogo, JiraIcon, JiraWordmark,
  StatuspageLogo, StatuspageIcon, StatuspageWordmark, StrideLogo, StrideIcon, StrideWordmark.

## 5.0.0 (2017-10-27)

- bug fix; fixed logo width issue in IE11.
  ([0ce8ab7](https://bitbucket.org/atlassian/atlaskit/commits/0ce8ab7))
- breaking; Logo sizes changed, children no longer accepted
  ([7173d81](https://bitbucket.org/atlassian/atlaskit/commits/7173d81))
- breaking; refactoring Logo component to fix numerous bugs
  ([7173d81](https://bitbucket.org/atlassian/atlaskit/commits/7173d81))

## 4.0.3 (2017-10-26)

- bug fix; fix to rebuild stories
  ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 4.0.2 (2017-10-22)

- bug fix; update styled-components dep and react peerDep
  ([6a67bf8](https://bitbucket.org/atlassian/atlaskit/commits/6a67bf8))

## 4.0.1 (2017-09-14)

- bug fix; jSD and Statuspage logo icons have fixed gradients (issues closed: ak-3479)
  ([60d8aca](https://bitbucket.org/atlassian/atlaskit/commits/60d8aca))

## 4.0.0 (2017-09-11)

- breaking; All logos have been updated with new assets, please test these inside your application
  to make sure ([c4db7fc](https://bitbucket.org/atlassian/atlaskit/commits/c4db7fc))
- breaking; new and updated company and product logos
  ([c4db7fc](https://bitbucket.org/atlassian/atlaskit/commits/c4db7fc))

## 3.5.3 (2017-08-11)

- bug fix; fix the theme-dependency
  ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))

## 3.5.2 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily
  ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 3.5.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps
  ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 3.2.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts
  ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 3.2.0 (2017-07-17)

- feature; added ES module builds to dist and add jsnext:main to most ADG packages
  ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 3.1.0 (2017-06-08)

- fix; add prop-types as a dependency to avoid React 15.x warnings
  ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))
- feature; Convert logo to styled-components updated internal structure
  ([ec91404](https://bitbucket.org/atlassian/atlaskit/commits/ec91404))

## 3.0.6 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license.
  ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 3.0.5 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and
  ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 3.0.4 (2017-04-18)

- fix; update logo readme to use new readme component
  ([491d789](https://bitbucket.org/atlassian/atlaskit/commits/491d789))

## 3.0.3 (2017-03-23)

- fix; Empty commit to release the component
  ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 3.0.1 (2017-03-21)

- fix; maintainers for all the packages were added
  ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 3.0.0 (2017-03-06)

- feature; text-only logo mode without icon
  ([b989245](https://bitbucket.org/atlassian/atlaskit/commits/b989245))
- breaking; isCollapsed prop has been replaced with an optional collapseTo prop (accepts value of
  'icon' or 'type')
- ISSUES CLOSED: AK-1408

## 2.0.1 (2017-02-09)

- fix; avoiding binding render to this
  ([40c9951](https://bitbucket.org/atlassian/atlaskit/commits/40c9951))

## 1.0.0 (2017-02-06)

- fix; fix logo to have public access
  ([5a41e37](https://bitbucket.org/atlassian/atlaskit/commits/5a41e37))

## 1.0.0 (2017-02-06)

- feature; Add more product logos
  ([e84ae80](https://bitbucket.org/atlassian/atlaskit/commits/e84ae80))
- feature; Adjust width of collapsed logo
  ([99fa4a5](https://bitbucket.org/atlassian/atlaskit/commits/99fa4a5))
