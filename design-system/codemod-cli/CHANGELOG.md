# @atlaskit/codemod-cli

## 0.27.4

### Patch Changes

- [#127093](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127093)
  [`1378ea7a99ce1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1378ea7a99ce1) -
  Upgrades `jscodeshift` to handle generics properly.
- Updated dependencies

## 0.27.3

### Patch Changes

- Updated dependencies

## 0.27.2

### Patch Changes

- [#105698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105698)
  [`e2455bc212b5c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e2455bc212b5c) -
  Resolve small ESLint issues.
- Updated dependencies

## 0.27.1

### Patch Changes

- Updated dependencies

## 0.27.0

### Minor Changes

- [#163865](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/163865)
  [`e66453c2716df`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e66453c2716df) -
  Added new codemod for migrating to Link component from `@atlaskit/link`.

## 0.26.3

### Patch Changes

- Updated dependencies

## 0.26.2

### Patch Changes

- [#137870](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137870)
  [`92637b4b74cf7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/92637b4b74cf7) -
  Fixed the import path check in remove-gemini-dark-options transformer

## 0.26.1

### Patch Changes

- [#136464](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136464)
  [`4f11a637eccad`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4f11a637eccad) -
  Fixed the import path checking in remove-gemini-dark-options transformer.

## 0.26.0

### Minor Changes

- [#135958](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/135958)
  [`61059e42a3aa2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/61059e42a3aa2) -
  Added a new preset and codemod for removing dark options from Gemini VR tests.

## 0.25.2

### Patch Changes

- [#123131](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/123131)
  [`862fb8cdd4b71`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/862fb8cdd4b71) -
  Codemod includes new migration pathways for legacy button

## 0.25.1

### Patch Changes

- [#120049](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120049)
  [`77504ff274f72`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/77504ff274f72) -
  DSP-19576: Assign names to anonymous default exports

## 0.25.0

### Minor Changes

- [#111403](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111403)
  [`cc57d517bca2a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cc57d517bca2a) -
  Migrate to new buttons codemod now adds comment for deprecated `overlay` props.

## 0.24.4

### Patch Changes

- [#108929](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108929)
  [`a25122bc3dc8f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a25122bc3dc8f) -
  Fixed the duplicated "Button" imports after migrating loading buttons to default buttons.

## 0.24.3

### Patch Changes

- [#105931](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105931)
  [`1eb788112d7d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1eb788112d7d) -
  Various improvements to `migrate-to-new-buttons` codemod to improve success rate.

## 0.24.2

### Patch Changes

- [#102800](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102800)
  [`868e9aebf5af`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/868e9aebf5af) -
  Fix icon buttons with loading being converted to default buttons

## 0.24.1

### Patch Changes

- [#100948](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100948)
  [`28061857f2cd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/28061857f2cd) -
  Prevent migration of buttons where icon component might be wrapped.

## 0.24.0

### Minor Changes

- [#99062](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99062)
  [`b8cd8340331d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b8cd8340331d) -
  Add transform to move away for UNSAFE button APIs.

## 0.23.1

### Patch Changes

- [#98241](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98241)
  [`41fe923d46ae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/41fe923d46ae) -
  Fix duplicated button imports when migrating LoadingButtons in test files.

## 0.23.0

### Minor Changes

- [#98066](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98066)
  [`414a343b18e7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/414a343b18e7) -
  Add new testing abstraction and update some tests

## 0.22.0

### Minor Changes

- [#91603](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91603)
  [`7cb9b3b277be`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7cb9b3b277be) -
  Update button mod to prefer render props over UNSAFE\_ APIs

## 0.21.1

### Patch Changes

- [#87918](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87918)
  [`1de8dc826f8d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1de8dc826f8d) -
  Fixed the duplicated label issue and the missing JSX pragma comment.

## 0.21.0

### Minor Changes

- [#87074](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87074)
  [`92be609ad553`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/92be609ad553) -
  Adds migration support for LoadingButtons

## 0.20.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 0.20.0

### Minor Changes

- [#70616](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70616)
  [`533c86673290`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/533c86673290) -
  Adding a new pattern for upgrading Pragmatic drag and drop consumers to `1.0`

  Pattern name: `"upgrade-pragmatic-drag-and-drop-to-stable"`

## 0.19.0

### Minor Changes

- [#60956](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60956)
  [`3c438c899565`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3c438c899565) -
  Updated glob dependency to 9.0.0 to fix VULN-1129796

## 0.18.0

### Minor Changes

- [#71146](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71146)
  [`3e20d00d3d46`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3e20d00d3d46) -
  Moves tokens codemods into the tokens package.

### Patch Changes

- Updated dependencies

## 0.17.10

### Patch Changes

- [#69779](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69779)
  [`8dd71b2e0653`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8dd71b2e0653) -
  Updated bin property to string as the package name and bin name matches.
  https://yarnpkg.com/configuration/manifest#bin

## 0.17.9

### Patch Changes

- [#67949](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67949)
  [`4ceb213f9313`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4ceb213f9313) -
  Migrate packages to use declarative entry points
- Updated dependencies

## 0.17.8

### Patch Changes

- [#62539](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62539)
  [`4055341131ca`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4055341131ca) -
  Update button codemod to add type keywork for type imports

## 0.17.7

### Patch Changes

- [#61900](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61900)
  [`101b5d5ef72a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/101b5d5ef72a) -
  Small changes in mixin migration - Use `token` instead of `theamed` to avoid migration to
  depricated code
- [#62187](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62187)
  [`03bb58064010`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/03bb58064010) -
  Added a small bug-fix in button codemods: add TODO comment on default buttons with "link" or
  "subtle-link" appearance but without `href`

## 0.17.6

### Patch Changes

- [#61943](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61943)
  [`dfdb42df4b4c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dfdb42df4b4c) -
  Now building the `@atlaskit/tokens` package when during `"prestart"` as tokens is required to be
  built for some of the patterns to run.

## 0.17.5

### Patch Changes

- [#59501](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59501)
  [`2c30839b5156`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2c30839b5156) -
  Button migration codemods- updated import path to the new entry point "@atlaskit/button/new"

## 0.17.4

### Patch Changes

- [#59085](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59085)
  [`360ae69766f9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/360ae69766f9) -
  small fix in button migration codemod - don't move the size prop from icon if it is medium.

## 0.17.3

### Patch Changes

- [#57531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57531)
  [`18f167967f89`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/18f167967f89) -
  Handle button migrations with unsupported props.

## 0.17.2

### Patch Changes

- [#56711](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/56711)
  [`a48d9247ddb2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a48d9247ddb2) - Small
  changes in button migration codemod - renamed UNSAFE_size to UNSAFE_iconBefore/iconAfter_size for
  new link and default buttons

## 0.17.1

### Patch Changes

- [#43812](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43812)
  [`15c0e36ba0f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/15c0e36ba0f) - Update
  button codemods to adapt new API changes for IconButton.

## 0.17.0

### Minor Changes

- [#43699](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43699)
  [`82e6819e04b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/82e6819e04b) - Update
  the codemod-cli to accept custom options, e.g.
  `npx @atlaskit/codemod-cli --foo bar /project/src/file.js`

### Patch Changes

- Updated dependencies

## 0.16.0

### Minor Changes

- [#41699](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41699)
  [`436fa9358ae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/436fa9358ae) -
  Introduces new codemod “migrate-to-new-buttons” to automate the new button migration.

## 0.15.0

### Minor Changes

- [#40270](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40270)
  [`27bbdfcb6ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/27bbdfcb6ad) - This
  update includes several improvements and fixes to the css-to-design-tokens preset:

  - Resolved transformation errors.
  - Added support for new color properties such as `border-color-left`.
  - Omitted unrecognized functions, including `url`, and certain Less functions to prevent compile
    errors.
  - Enhanced codemod to only substitute raw, named colors and known variables (like old Atlaskit
    colors), and to avoid substituting variables not related to colors.
  - Introduced token filtering for more precise token identification.
  - Added parsing for gradient functions and multiple colors.

## 0.14.0

### Minor Changes

- [#39017](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39017)
  [`26d4e25c2b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/26d4e25c2b3) - replace
  strings that contain only the color name; replace hard-coded colors in template literals that have
  CSS declarations; better color names for literals that have multiple expressions; replace full
  value of box-shadow in template literals

## 0.13.4

### Patch Changes

- [#38813](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38813)
  [`9c4335f135d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9c4335f135d) - Updated
  README.md

## 0.13.3

### Patch Changes

- [#35950](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35950)
  [`50cf866a219`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50cf866a219) - bump
  semver

## 0.13.2

### Patch Changes

- [#32800](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32800)
  [`07f0eb8e1f4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07f0eb8e1f4) -
  Refactors `theme-to-design-tokens` to improve its accuracy

## 0.13.1

### Patch Changes

- [#34443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34443)
  [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing
  unused dependencies and dev dependencies

## 0.13.0

### Minor Changes

- [#34602](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34602)
  [`c528571ef3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c528571ef3d) -
  Introduces new codemod "theme-remove-deprecated-mixins" to automate the removal of deprecated
  color mixins

## 0.12.3

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 0.12.2

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 0.12.1

### Patch Changes

- [#33377](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33377)
  [`07020547a93`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07020547a93) - Safe
  direct migraiton to design token API. This change is not visible for those who aren't using design
  tokens

## 0.12.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 0.11.5

### Patch Changes

- [#27634](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27634)
  [`cc84a1ed227`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc84a1ed227) - Updates
  default behaviour of codemods when a suggested token cannot be found
- Updated dependencies

## 0.11.4

### Patch Changes

- [#29170](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29170)
  [`708957d360f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/708957d360f) - Upgrade
  a dependency package simple-git

## 0.11.3

### Patch Changes

- [#27875](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27875)
  [`b14dca751fa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b14dca751fa) - Exclude
  the chart tokens from the list of tokens that we pass into the codemod.

## 0.11.2

### Patch Changes

- Updated dependencies

## 0.11.1

### Patch Changes

- Updated dependencies

## 0.11.0

### Minor Changes

- [#28150](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28150)
  [`00ea8db4763`](https://bitbucket.org/atlassian/atlassian-frontend/commits/00ea8db4763) -
  Upgrading the simple-git version

## 0.10.5

### Patch Changes

- [#27794](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27794)
  [`7a958dda205`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a958dda205) - Updates
  tokens codemods to only suggest active tokens

## 0.10.4

### Patch Changes

- Updated dependencies

## 0.10.3

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 0.10.2

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 0.10.1

### Patch Changes

- [#23137](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23137)
  [`6ec444547a9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ec444547a9) - Applies
  various fixes to the tokens post-css codemod. Box shadows and border properties are respected
  syntactically

## 0.10.0

### Minor Changes

- [#21570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21570)
  [`54c548f34ca`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54c548f34ca) - Adds
  preset codemod for css-to-design-tokens. This codemod transforms css,scss,less color usage to
  design tokens.

## 0.9.7

### Patch Changes

- Updated dependencies

## 0.9.6

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`a424e62b264`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a424e62b264) - Changes
  to support Node 16 Typescript definitions from `@types/node`.

## 0.9.5

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 0.9.4

### Patch Changes

- Updated dependencies

## 0.9.3

### Patch Changes

- [#20310](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20310)
  [`1977986ea86`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1977986ea86) - Bumping
  dependencies via Renovate:

  - simple-git

## 0.9.2

### Patch Changes

- [#19927](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19927)
  [`5c45b17200d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c45b17200d) - Bumping
  dependencies via Renovate:

  - simple-git

## 0.9.1

### Patch Changes

- Updated dependencies

## 0.9.0

### Minor Changes

- [#19516](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19516)
  [`2b8c48b26ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2b8c48b26ab) -
  Instrumented `@atlaskit/codemod-cli` with none interaction support

  New argument for the codemod-cli has been added to support preselect transform in command line.

## 0.8.7

### Patch Changes

- [#18960](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18960)
  [`54a44d46e29`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a44d46e29) - Renovate
  Bot upgraded simple-git from ^1.130.0 to 2.48.0

## 0.8.6

### Patch Changes

- Updated dependencies

## 0.8.5

### Patch Changes

- [#18965](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18965)
  [`e4dd80187f5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4dd80187f5) -
  Refactors theme-to-tokens codemod with new token names + simplifies logic

## 0.8.4

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Adds a
  new codemod preset `theme-to-design-tokens` that helps migrate from atlaskit theme to atlaskit
  tokens.
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Theme
  preset is now picked up by the CLI.
- Updated dependencies

## 0.8.3

### Patch Changes

- [#17016](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17016)
  [`f4d22b1c8af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f4d22b1c8af) - Ignore
  directory filtering logic if filtering returns no paths

## 0.8.2

### Patch Changes

- [#16649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16649)
  [`650aa20f6fe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/650aa20f6fe) - Upgrade
  meow dependency

## 0.8.1

### Patch Changes

- [#16252](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16252)
  [`982e2f3d3d2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/982e2f3d3d2) -
  Directory filtering now defaults to true

## 0.8.0

### Minor Changes

- [#15374](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15374)
  [`f3d46c395b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3d46c395b4) - Add path
  filtering to codemod-cli

## 0.7.0

### Minor Changes

- [#13957](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13957)
  [`d3a285fdc82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3a285fdc82) - Add
  support for codemods authored as .tsx files

## 0.6.7

### Patch Changes

- [#12535](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12535)
  [`4a67fb592c8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a67fb592c8) - Bump
  jscodeshift to 0.13.0.
  [Commit Changelog](https://github.com/facebook/jscodeshift/commit/2fd5e11f469427d474983b2d1c47be9408677591).

  ### Added

  - Added a `--fail-on-error` flag to return a `1` error code when errors were found (#416,
    @marcodejongh)
  - Created `template.asyncExpression` (#405, @jedwards1211)

  ### Changed

  - Removed lodash dependency from tsx parser (#432, @JHilker and @robyoder)

## 0.6.6

### Patch Changes

- [#11911](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11911)
  [`d0ef46dee01`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0ef46dee01) - Removes
  ts-node / cjs bundle switcher from main entrypoint of codemod-utils and updated codemod-cli
  scripts to support

## 0.6.5

### Patch Changes

- [#10735](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10735)
  [`fdbd74cdb32`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdbd74cdb32) - Remove
  --no-babel flag when parser flow is used

## 0.6.4

### Patch Changes

- [#10705](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10705)
  [`6a0b92d2af9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a0b92d2af9) - MONO-103
  Fixed bug were codemod-cli would erronously run

## 0.6.3

### Patch Changes

- [#10392](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10392)
  [`30c279f85eb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30c279f85eb) - Bump
  atlassian-forks-jscodeshift to "^0.12.2-atlassian-6".

## 0.6.2

### Patch Changes

- [#10060](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10060)
  [`6c420d1698d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c420d1698d) - Fix
  application of --no-babel flag

## 0.6.1

### Patch Changes

- [#10014](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10014)
  [`13d9c023e8d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/13d9c023e8d) - Log the
  package version when running codemod cli

## 0.6.0

### Minor Changes

- [#9924](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9924)
  [`cdd78d4ff38`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cdd78d4ff38) - The
  codemod-cli can fail on error when the flag `--fail-on-error` is passed, it will return a 1 exit
  code when errors were found during execution of codemods

  This flag `--fail-on-error` was added as part of this
  [PR](https://github.com/facebook/jscodeshift/pull/416) that forked `jscodeshift`.

  In Atlassian Frontend, we are now using the fork of `jscodeshift`,
  [atlassian-forks-jscodeshift](https://www.npmjs.com/package/atlassian-forks-jscodeshift) till we
  get this change back to the library.

  Add `--fail-on-error` in the config to be passed as a flag when the codemod runs - only for branch
  integrator.

## 0.5.3

### Patch Changes

- [#9832](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9832)
  [`d72b572dfc2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d72b572dfc2) - bumped
  jscodeshift@^0.11.0
- [`d72b572dfc2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d72b572dfc2) - bumped
  @types/jscodeshift@^0.11.0

## 0.5.2

### Patch Changes

- [#9482](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9482)
  [`cfd7c0b5bcc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfd7c0b5bcc) - Update
  the logic to properly check for the env var FAIL_CODEMODS_ON_ERROR and add `--no-babel` when
  running js file.

## 0.5.1

### Patch Changes

- [#9018](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9018)
  [`6afd79db199`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6afd79db199) - Bump
  dependency "meow" to version ^6.0.0

## 0.5.0

### Minor Changes

- [#8789](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8789)
  [`a9e359236b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a9e359236b4) - The
  codemod-cli can fail on error when the flag `--fail-on-error` is passed, it will return a 1 exit
  code when errors were found during execution of codemods This flag `--fail-on-error` was added as
  part of this [PR](https://github.com/facebook/jscodeshift/pull/416) that forked `jscodeshift`. In
  Atlassian Frontend, we are now using the fork of `jscodeshift`,
  [atlassian-forks-jscodeshift](https://www.npmjs.com/package/atlassian-forks-jscodeshift) till we
  get this change back to the library.

  Add `--fail-on-error` in the config to be passed as a flag when the codemod runs - only for branch
  integrator.

## 0.4.4

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 0.4.3

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 0.4.2

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 0.4.1

### Patch Changes

- [#3841](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3841)
  [`88ceeac950`](https://bitbucket.org/atlassian/atlassian-frontend/commits/88ceeac950) - Fix CLI
  not working due to missing ts-node dependency

## 0.4.0

### Minor Changes

- [#3197](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3197)
  [`d9f34d27e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9f34d27e8) - Add
  --packages flag to automatically run codemods for specific packages Add --sinceRef flag to
  automatically run codemods that have been upgraded since a certain git ref Add support for running
  over multiple filepaths Extend support to restricted scoped packages Expose programmatic API

### Patch Changes

- [`d9f34d27e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9f34d27e8) - Fix
  transforms being sourced from nested node_modules directories Return non-zero exit codes on
  failure

## 0.3.4

### Patch Changes

- [#3093](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3093)
  [`f664568219`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f664568219) - Codemods
  are now presented with their module name prepended to make it easier to see which codemod belongs
  to which packages

## 0.3.3

### Patch Changes

- [#3062](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3062)
  [`4be3a868e1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4be3a868e1) - Ensure the
  library is running with the Node environment + adds ts-lib

## 0.3.2

### Patch Changes

- [#3002](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3002)
  [`78dde805ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78dde805ef) - Fixes an
  issue with loading presets in javascript

## 0.3.1

### Patch Changes

- [#2137](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2137)
  [`b4e29ceda2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4e29ceda2) - Fixed
  broken entrypoint

## 0.3.0

### Minor Changes

- [#1868](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/1868)
  [`332a418dd1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/332a418dd1) - Adds the
  concept of presets to act as a library of codemods relevant to an entire library or repo rather
  than specific component codemods. Also introduces the styled-to-emotion codemod

## 0.2.0

### Minor Changes

- [minor][63787f3327](https://bitbucket.org/atlassian/atlassian-frontend/commits/63787f3327):

  Initial implementation of the Codemod-cli

### Patch Changes

- Updated dependencies
  [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
  - @atlaskit/docs@8.5.1
