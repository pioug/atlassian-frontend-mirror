# @atlaskit/logo

## 13.5.3

### Patch Changes

- [`af4bca32ad4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/af4bca32ad4) - Internal changes to supress eslint rules.
- Updated dependencies

## 13.5.2

### Patch Changes

- [`545d363ca28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/545d363ca28) - Convert usage of `styled-components` to `emotion`.

## 13.5.1

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 13.5.0

### Minor Changes

- [`83a089fe0cc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/83a089fe0cc) - Halp has been added to logos. This includes the logo, wordmark and icon.

### Patch Changes

- [`cc0c678724c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc0c678724c) - Add default label for Logo

## 13.4.2

### Patch Changes

- [`17770b662ac`](https://bitbucket.org/atlassian/atlassian-frontend/commits/17770b662ac) - NO-ISSUE reference existing file in af.exports['.']

## 13.4.1

### Patch Changes

- [`0017d2a8439`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0017d2a8439) - Since the logo, icon and workmard components of JiraCore, JiraServiceDesk, OpsGenie, Stride and Hipchat are deprecated in `@atlaskit/logo`, we provided a codemod to help consumers upgrade their components.

  **Running the codemod cli**

  To run the codemod: **You first need to have the latest avatar installed before you can run the codemod**

  `yarn upgrade @atlaskit/logo`

  Once upgraded, use the Atlaskit codemod-cli;

  `npx @atlaskit/codemod-cli --parser [PARSER] --extensions [FILE_EXTENSIONS] [TARGET_PATH]`

  Or run `npx @atlaskit/codemod-cli -h` for more details on usage. For Atlassians, refer to this doc for more details on the codemod CLI.

- Updated dependencies

## 13.4.0

### Minor Changes

- [`5f44a31b58a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f44a31b58a) - [ux] Add new Trello logo, Atlassian Start logo and Compass logo to `@atlaskit/logo`

## 13.3.0

### Minor Changes

- [`c8afaa49d34`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8afaa49d34) - Add `OpsgenieIcon`, `OpsgenieLogo` and `OpsgenieWordmark` in order to rename `OpsGenie` to `Opsgenie`, and deprecate the following logos:

  - `JiraCoreIcon`, `JiraCoreLogo`, `JiraCoreWordmark`
  - `JiraServiceDeskIcon`, `JiraServiceDeskLogo`, `JiraServiceDeskWordmark`
  - `StrideIcon`, `StrideLogo`, `StrideWordmark`
  - `HipchatIcon`, `HipchatLogo`, `HipchatWordmark`

### Patch Changes

- Updated dependencies

## 13.2.0

### Minor Changes

- [`95838b0d7cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/95838b0d7cf) - [ux] Add Jira Work Management Logo

## 13.1.2

### Patch Changes

- [`471e2431a7c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/471e2431a7c) - Downgrade back to date-fns 1.30.1
  We discovered big bundle size increases associated with the date-fns upgrade.
  We're reverting the upgarde to investigate

## 13.1.1

### Patch Changes

- [`70f0701c2e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70f0701c2e6) - Upgrade date-fns to 2.17

## 13.1.0

### Minor Changes

- [`5216ebed3b6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5216ebed3b6) - Expose and use atlassian-icon, jira-icon entry points

## 13.0.8

### Patch Changes

- [`952019cfd39`](https://bitbucket.org/atlassian/atlassian-frontend/commits/952019cfd39) - Removed extraneous/unnecessary dependencies for design system components.
- [`dfa1827ecad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfa1827ecad) - Fixed the broken "Download the logos" link on https://atlassian.design/components/logo/usage

## 13.0.7

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 13.0.6

### Patch Changes

- [`ce8c85a20d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ce8c85a20d) - As part of this task we have introduced a new JSM logo and deprecated JSD logo

## 13.0.5

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 13.0.4

### Patch Changes

- [`7315203b80`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7315203b80) - Rename `AkCode` and `AkCodeBlock` exports to `Code` and `CodeBlock` for `@atlaskit/code`.

## 13.0.3

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 13.0.2

### Patch Changes

- [`954cc87b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/954cc87b62) - The readme and package information has been updated to point to the new design system website.

## 13.0.1

### Patch Changes

- [`ce3b100bed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ce3b100bed) - Change the Atlassian Icon for better alignment with other Icons
- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all the theme imports to be tree-shakable

## 13.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 12.3.5

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 12.3.4

### Patch Changes

- [patch][f6667f2909](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6667f2909):

  Change imports to comply with Atlassian conventions- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):

- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [f7f2068a76](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7f2068a76):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [6efb12e06d](https://bitbucket.org/atlassian/atlassian-frontend/commits/6efb12e06d):
  - @atlaskit/button@13.3.11
  - @atlaskit/select@11.0.10
  - @atlaskit/code@11.1.5

## 12.3.3

### Patch Changes

- [patch][fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):

  Corrects accessibility behavior for wrapping span. It now will now:

  - conditionally set the `aria-label` if `label` is defined
  - conditionally set the `role` to either `img` if `label` is defined, or `presentation` if it is not defined- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):

- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
  - @atlaskit/docs@8.4.0
  - @atlaskit/field-radio-group@7.0.2
  - @atlaskit/button@13.3.9
  - @atlaskit/select@11.0.9

## 12.3.2

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/button@13.3.7
  - @atlaskit/code@11.1.3
  - @atlaskit/field-radio-group@7.0.1
  - @atlaskit/select@11.0.7
  - @atlaskit/theme@9.5.1

## 12.3.1

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
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

  @atlaskit/select has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

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

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

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
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 12.1.1

- Updated dependencies [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
  - @atlaskit/button@13.0.11
  - @atlaskit/select@10.0.0

## 12.1.0

### Minor Changes

- [minor][b81d931ee3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b81d931ee3):

  Added new OpsGenie logo, fixed the gradient for the StatusPage logo, and refactored atlassian-switcher to use the new logos

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

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 12.0.1

- Updated dependencies [97bfe81ec8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97bfe81ec8):
  - @atlaskit/docs@8.1.0
  - @atlaskit/code@11.0.0

## 12.0.0

- [major][4b07b57640](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b07b57640):

  - @atlaskit/logo has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 11.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 10.0.4

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/code@9.0.1
  - @atlaskit/field-radio-group@5.0.3
  - @atlaskit/select@8.1.1
  - @atlaskit/theme@8.1.7

## 10.0.3

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/field-radio-group@5.0.2
  - @atlaskit/select@8.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 10.0.2

- [patch][e04a402953](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e04a402953):

  - Internal changes only. Ids relevant to Logo gradients are now ssr-friendly.

## 10.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/field-radio-group@5.0.1
  - @atlaskit/select@8.0.3
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0

## 10.0.0

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

## 9.2.7

- Updated dependencies [06713e0a0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06713e0a0c):
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

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 9.2.2

- [patch] Updated dependencies [4194aa4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4194aa4)
  - @atlaskit/select@6.0.0

## 9.2.1

- [patch] Pulling the shared styles from @atlaskit/theme and removed dependency on util-shraed-styles [7d51a09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d51a09)

## 9.2.0

- [patch] Moved all the shared logic into the wrapper, so refactoring is easier in future [7e83442](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e83442)
- [minor] Make label required, but provide sane defaults [12839d4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12839d4)

## 9.1.0

- [minor] Update product logos alignment issues [6bbf9a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6bbf9a9)

## 9.0.4

- [patch] Updated dependencies [f9c0cdb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c0cdb)
  - @atlaskit/code@8.0.0
  - @atlaskit/docs@5.0.5

## 9.0.3

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/select@5.0.8
  - @atlaskit/button@9.0.5
  - @atlaskit/code@7.0.3
  - @atlaskit/field-radio-group@4.0.4

## 9.0.2

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/select@5.0.7
  - @atlaskit/field-radio-group@4.0.3
  - @atlaskit/button@9.0.4
  - @atlaskit/code@7.0.2
  - @atlaskit/docs@5.0.2

## 9.0.1

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/select@5.0.6
  - @atlaskit/button@9.0.3
  - @atlaskit/code@7.0.1
  - @atlaskit/field-radio-group@4.0.2

## 9.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/select@5.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/code@7.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/field-radio-group@4.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/select@5.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/code@7.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/field-radio-group@4.0.0

## 8.1.3

- [patch] Updated dependencies [eee2d45](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eee2d45)
  - @atlaskit/code@6.0.0
  - @atlaskit/docs@4.2.1

## 8.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/button@8.1.2
  - @atlaskit/field-radio-group@3.0.4

## 8.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/field-radio-group@3.0.3
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1

## 8.1.0

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/field-radio-group@3.0.2
  - @atlaskit/docs@4.1.0
  - @atlaskit/button@8.1.0

## 8.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/field-radio-group@3.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/docs@4.0.1

## 8.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/field-radio-group@3.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/docs@4.0.0

## 7.0.1

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/field-radio-group@2.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/docs@3.0.4

## 7.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 6.2.2

- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)

## 6.2.1

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 6.2.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 6.1.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 6.1.1

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 6.1.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 6.0.7

- [patch] Fix inherited color logo gradient changes not working in chrome [694c59f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/694c59f)

## 6.0.3

- [patch] Logo component gradients no work in Firefox and Safari [6d1f521](6d1f521)

## 6.0.0 (2017-11-09)

- breaking; Removed the collapseTo prop in favour of explicit named exports (see below).
- breaking; The default export has been removed in favour of named exports. The named exports are now: AtlassianLogo, AtlassianIcon, AtlassianWordmark, BitbucketLogo, BitbucketIcon, BitbucketWordmark, ConfluenceLogo, ConfluenceIcon, ConfluenceWordmark, HipchatLogo, HipchatIcon, HipchatWordmark, JiraCoreLogo, JiraCoreIcon, JiraCoreWordmark, JiraLogo, JiraIcon, JiraWordmark, StatuspageLogo, StatuspageIcon, StatuspageWordmark, StrideLogo, StrideIcon, StrideWordmark.

## 5.0.0 (2017-10-27)

- bug fix; fixed logo width issue in IE11. ([0ce8ab7](https://bitbucket.org/atlassian/atlaskit/commits/0ce8ab7))
- breaking; Logo sizes changed, children no longer accepted ([7173d81](https://bitbucket.org/atlassian/atlaskit/commits/7173d81))
- breaking; refactoring Logo component to fix numerous bugs ([7173d81](https://bitbucket.org/atlassian/atlaskit/commits/7173d81))

## 4.0.3 (2017-10-26)

- bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 4.0.2 (2017-10-22)

- bug fix; update styled-components dep and react peerDep ([6a67bf8](https://bitbucket.org/atlassian/atlaskit/commits/6a67bf8))

## 4.0.1 (2017-09-14)

- bug fix; jSD and Statuspage logo icons have fixed gradients (issues closed: ak-3479) ([60d8aca](https://bitbucket.org/atlassian/atlaskit/commits/60d8aca))

## 4.0.0 (2017-09-11)

- breaking; All logos have been updated with new assets, please test these inside your application to make sure ([c4db7fc](https://bitbucket.org/atlassian/atlaskit/commits/c4db7fc))
- breaking; new and updated company and product logos ([c4db7fc](https://bitbucket.org/atlassian/atlaskit/commits/c4db7fc))

## 3.5.3 (2017-08-11)

- bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))

## 3.5.2 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 3.5.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 3.2.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 3.2.0 (2017-07-17)

- feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 3.1.0 (2017-06-08)

- fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))
- feature; Convert logo to styled-components updated internal structure ([ec91404](https://bitbucket.org/atlassian/atlaskit/commits/ec91404))

## 3.0.6 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 3.0.5 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 3.0.4 (2017-04-18)

- fix; update logo readme to use new readme component ([491d789](https://bitbucket.org/atlassian/atlaskit/commits/491d789))

## 3.0.3 (2017-03-23)

- fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 3.0.1 (2017-03-21)

- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 3.0.0 (2017-03-06)

- feature; text-only logo mode without icon ([b989245](https://bitbucket.org/atlassian/atlaskit/commits/b989245))
- breaking; isCollapsed prop has been replaced with an optional collapseTo prop (accepts value of 'icon' or 'type')
- ISSUES CLOSED: AK-1408

## 2.0.1 (2017-02-09)

- fix; avoiding binding render to this ([40c9951](https://bitbucket.org/atlassian/atlaskit/commits/40c9951))

## 1.0.0 (2017-02-06)

- fix; fix logo to have public access ([5a41e37](https://bitbucket.org/atlassian/atlaskit/commits/5a41e37))

## 1.0.0 (2017-02-06)

- feature; Add more product logos ([e84ae80](https://bitbucket.org/atlassian/atlaskit/commits/e84ae80))
- feature; Adjust width of collapsed logo ([99fa4a5](https://bitbucket.org/atlassian/atlaskit/commits/99fa4a5))
