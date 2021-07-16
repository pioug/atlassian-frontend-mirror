# @atlaskit/field-base

## 15.0.5

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 15.0.4

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 15.0.3

### Patch Changes

- Updated dependencies

## 15.0.2

### Patch Changes

- [`30853172ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30853172ff) - Reset babel config back to ie11 to prevent runtime issues in Jira and to unbreak the Confluence es5-check

## 15.0.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 15.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 14.0.5

### Patch Changes

- Updated dependencies

## 14.0.4

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 14.0.3

### Patch Changes

- Updated dependencies

## 14.0.2

### Patch Changes

- [patch][eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):

  Follow-up on AFP-1401 when removing types to component. Some left over types and small issues- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):

- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/inline-dialog@12.1.11
  - @atlaskit/section-message@4.1.7
  - @atlaskit/spinner@12.1.6

## 14.0.1

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/inline-dialog@12.1.9
  - @atlaskit/input@7.0.1
  - @atlaskit/section-message@4.1.5
  - @atlaskit/spinner@12.1.4
  - @atlaskit/theme@9.5.1

## 14.0.0

### Major Changes

- [major][c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):

  BREAKING CHANGE: As part of AFP-1404, we are dropping flow support. It means that those packages are not typed. Consumer will need to manually add their types to the component.Background ticket: https://product-fabric.atlassian.net/browse/AFP-1397Plan: https://product-fabric.atlassian.net/wiki/spaces/AFP/pages/1052870901/Drop+Flow+Support+Plan

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/icon@20.0.0
  - @atlaskit/input@7.0.0
  - @atlaskit/section-message@4.1.4
  - @atlaskit/docs@8.3.1
  - @atlaskit/inline-dialog@12.1.8

## 13.0.16

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Fixes onClick return type to void- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  - @atlaskit/inline-dialog@12.1.6

## 13.0.15

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 13.0.14

### Patch Changes

- [patch][01b580e17e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/01b580e17e):

  Fix type definitions

## 13.0.13

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 13.0.12

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 13.0.11

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 13.0.10

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 13.0.9

### Patch Changes

- [patch][d905cbc0ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d905cbc0ac):

  Adding a condition to check if the component are referenced in tests running in CI. It reduces the noise and help reading the CI log.

## 13.0.8

### Patch Changes

- [patch][226a5fece8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/226a5fece8):

  Upating deprecation messages and adding console warning to improve visibility

## 13.0.7

### Patch Changes

- [patch][688f2957ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/688f2957ca):

  Fixes various TypeScript errors which were previously failing silently

## 13.0.6

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/inline-dialog@12.0.3
  - @atlaskit/icon@19.0.0

## 13.0.5

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 13.0.4

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/inline-dialog@12.0.1
  - @atlaskit/icon@18.0.0

## 13.0.3

- Updated dependencies [181209d135](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/181209d135):
  - @atlaskit/inline-dialog@12.0.0

## 13.0.2

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 13.0.1

- Updated dependencies [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
  - @atlaskit/spinner@12.0.0

## 13.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 12.0.2

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/icon@16.0.9
  - @atlaskit/inline-dialog@10.0.4
  - @atlaskit/input@5.0.2
  - @atlaskit/spinner@10.0.7
  - @atlaskit/theme@8.1.7

## 12.0.1

- [patch][98e11001ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98e11001ff):

  - Removes duplicate babel-runtime dependency

## 12.0.0

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

## 11.0.15

- [patch][f77cd3fb66](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f77cd3fb66):

  - fixed reactjs warning on FieldBase.onBlur and prevent breaking line when inserting Status via enter key

## 11.0.14

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/inline-dialog@9.0.14
  - @atlaskit/icon@16.0.0

## 11.0.13

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/icon@15.0.2
  - @atlaskit/inline-dialog@9.0.13
  - @atlaskit/spinner@9.0.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 11.0.12

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/icon@15.0.1
  - @atlaskit/inline-dialog@9.0.12
  - @atlaskit/input@4.0.8
  - @atlaskit/spinner@9.0.12
  - @atlaskit/theme@7.0.0

## 11.0.11

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/inline-dialog@9.0.11
  - @atlaskit/icon@15.0.0

## 11.0.10

- [patch][a637f5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a637f5e):

  - Refine and fix some flow type errors found by fixing @atlaskit/analytics-next HOCs to allow flow to type check properly

## 11.0.9

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 11.0.8

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/inline-dialog@9.0.6
  - @atlaskit/icon@14.0.0

## 11.0.7

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 11.0.5

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/spinner@9.0.6
  - @atlaskit/input@4.0.4
  - @atlaskit/inline-dialog@9.0.2
  - @atlaskit/icon@13.2.5
  - @atlaskit/docs@5.0.6

## 11.0.4

- [patch] Fieldbase now using new inline-dialog and @atlaskit/popper under the hood [a3109d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3109d3)

* [patch] Updated dependencies [1d9e75a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d9e75a)
  - @atlaskit/inline-dialog@9.0.0
* [none] Updated dependencies [a3109d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3109d3)
  - @atlaskit/inline-dialog@9.0.0
* [none] Updated dependencies [87d45d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87d45d3)
  - @atlaskit/inline-dialog@9.0.0
* [none] Updated dependencies [a08b0c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a08b0c2)
  - @atlaskit/inline-dialog@9.0.0

## 11.0.3

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/inline-dialog@8.0.4
  - @atlaskit/input@4.0.3
  - @atlaskit/theme@5.1.3
  - @atlaskit/spinner@9.0.5
  - @atlaskit/icon@13.2.4

## 11.0.2

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/inline-dialog@8.0.3
  - @atlaskit/icon@13.2.2
  - @atlaskit/theme@5.1.2
  - @atlaskit/input@4.0.2
  - @atlaskit/spinner@9.0.4
  - @atlaskit/docs@5.0.2

## 11.0.1

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/inline-dialog@8.0.2
  - @atlaskit/input@4.0.1
  - @atlaskit/theme@5.1.1
  - @atlaskit/spinner@9.0.3
  - @atlaskit/icon@13.2.1

## 11.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/inline-dialog@8.0.0
  - @atlaskit/input@4.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/inline-dialog@8.0.0
  - @atlaskit/input@4.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0

## 10.2.0

- [minor] Updated visual styles for textfield and textarea components to match latest ADG spec [37f5ea5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/37f5ea5)
- [none] Updated dependencies [37f5ea5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/37f5ea5)

## 10.1.3

- [patch] Updated dependencies [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
  - @atlaskit/spinner@8.0.0

## 10.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/inline-dialog@7.1.2
  - @atlaskit/input@3.0.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/spinner@7.0.2
  - @atlaskit/icon@12.1.2

## 10.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/spinner@7.0.1
  - @atlaskit/inline-dialog@7.1.1
  - @atlaskit/icon@12.1.1
  - @atlaskit/docs@4.1.1

## 10.1.0

- [patch] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/spinner@7.0.0
  - @atlaskit/inline-dialog@7.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2

## 10.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/icon@12.0.1
  - @atlaskit/inline-dialog@7.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/spinner@6.0.1
  - @atlaskit/docs@4.0.1

## 10.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/icon@12.0.0
  - @atlaskit/inline-dialog@7.0.0
  - @atlaskit/input@3.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/spinner@6.0.0
  - @atlaskit/docs@4.0.0

## 9.0.3

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/inline-dialog@6.0.2
  - @atlaskit/input@2.0.2
  - @atlaskit/theme@3.2.2
  - @atlaskit/spinner@5.0.2
  - @atlaskit/docs@3.0.4

## 9.0.1

- [patch] Form developer preview [d8b2b03](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d8b2b03)
- [patch] Form package developer preview release [9b28847](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b28847)

## 9.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 8.2.1

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 8.2.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 8.1.13

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 8.1.12

- [patch] Fix field base read view content overflowing in IE11 when isFitContainerWidthEnabled is set [4417234](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4417234)

## 8.1.11

- [patch] firing onblur in field-base only once [0223de2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0223de2)

## 8.1.10

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 8.1.9

- [patch] Minor documentation fixes [f0e96bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f0e96bd)

## 8.1.8

- [patch] Mark packages as internal [016d74d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/016d74d)

## 8.1.7

- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website, \$ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 8.1.6

- [patch] Migrated to mk2 repo [ad90f48](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ad90f48)

## 8.1.5 (2017-11-15)

- bug fix; bumping internal dependencies to latest major version ([a9658f4](https://bitbucket.org/atlassian/atlaskit/commits/a9658f4))

## 8.1.4 (2017-11-14)

- bug fix; fix inline-edit component edit mode triggering when clicking outside hover width (issues closed: ak-3800) ([16fd4c0](https://bitbucket.org/atlassian/atlaskit/commits/16fd4c0))

## 8.1.3 (2017-10-22)

- bug fix; update styled component dependency and react peerDep ([39f3286](https://bitbucket.org/atlassian/atlaskit/commits/39f3286))

## 8.1.1 (2017-09-15)

- bug fix; aK-3528: Add missing semicolons which broke styles (issues closed: ak-3528) ([891cedd](https://bitbucket.org/atlassian/atlaskit/commits/891cedd))

## 8.1.0 (2017-09-05)

- bug fix; update styles for ie11 to respect flex-wrap ([7cec339](https://bitbucket.org/atlassian/atlaskit/commits/7cec339))
- feature; fixes lots of spacing and alignment issues. Needed to add a maxWidth prop as part o ([188ee4b](https://bitbucket.org/atlassian/atlaskit/commits/188ee4b))

## 8.0.2 (2017-09-04)

- bug fix; fix color of focused field ([8f6f4c2](https://bitbucket.org/atlassian/atlaskit/commits/8f6f4c2))

## 8.0.1 (2017-08-30)

- bug fix; field-base label color fixed, dependencies updated (issues closed: ak-3363) ([7b77635](https://bitbucket.org/atlassian/atlaskit/commits/7b77635))

## 8.0.0 (2017-08-29)

- feature; adjust darkmode colors based on design feedback ([93a5eb9](https://bitbucket.org/atlassian/atlaskit/commits/93a5eb9))
- breaking; Remove dependency on util-shared-styles and replace with theme ([960c062](https://bitbucket.org/atlassian/atlaskit/commits/960c062))
- breaking; add darkmode to field-base (issues closed: #ak-3338) ([960c062](https://bitbucket.org/atlassian/atlaskit/commits/960c062))

## 7.4.4 (2017-08-22)

- bug fix; after discussing the implementation ([27e1963](https://bitbucket.org/atlassian/atlaskit/commits/27e1963))
- bug fix; fieldbase required asterisk was not red - it is now ([943a17c](https://bitbucket.org/atlassian/atlaskit/commits/943a17c))

## 7.4.3 (2017-08-21)

- bug fix; fix PropTypes warning ([040d579](https://bitbucket.org/atlassian/atlaskit/commits/040d579))

## 7.4.2 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 7.4.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 7.1.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))
- feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 7.0.1 (2017-05-30)

- fix; field-base: fix alignment of warning icon ([3ea648f](https://bitbucket.org/atlassian/atlaskit/commits/3ea648f))
- fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))

## 6.0.0 (2017-05-25)

- fix; add onBlur and onStateless no-ops to example FieldStateless for stories ([0440540](https://bitbucket.org/atlassian/atlaskit/commits/0440540))
- refactor field-base to styled-components ([88defeb](https://bitbucket.org/atlassian/atlaskit/commits/88defeb))
- breaking; Named export \`FieldBase\` renamed to \`FieldBaseStateless\`, for consistency and clarity.
- ISSUES CLOSED: #AK-2468

## 5.4.2 (2017-05-19)

- fix; fixed a typo in code and added a test ([cae6648](https://bitbucket.org/atlassian/atlaskit/commits/cae6648))

## 5.4.1 (2017-05-19)

- fix; handle possible onBlur-onFocus race conditions in field-base ([425b23f](https://bitbucket.org/atlassian/atlaskit/commits/425b23f))

## 5.4.0 (2017-05-10)

- fix; fixed warning icon size in field-base component ([47698ef](https://bitbucket.org/atlassian/atlaskit/commits/47698ef))
- fix; update dependencies ([c4b98eb](https://bitbucket.org/atlassian/atlaskit/commits/c4b98eb))
- feature; bump icon in emoji and field-base ([5f0a127](https://bitbucket.org/atlassian/atlaskit/commits/5f0a127))

## 5.3.4 (2017-05-06)

- fix; do not stretch non-textual content ([7066311](https://bitbucket.org/atlassian/atlaskit/commits/7066311))

## 5.3.3 (2017-05-04)

- fix; updating fieldbase label typography and ensuring spacing is on grid ([9bb9af6](https://bitbucket.org/atlassian/atlaskit/commits/9bb9af6))

## 5.3.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 5.3.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 5.3.0 (2017-04-20)

- feature; removed explicit style! imports, set style-loader in webpack config ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))

## 5.1.1 (2017-04-13)

- fix; update field-base stories to use new readme component ([b98df36](https://bitbucket.org/atlassian/atlaskit/commits/b98df36))
- feature; flip the warning dialog to the top if there is no space on the right ([73d28f9](https://bitbucket.org/atlassian/atlaskit/commits/73d28f9))

## 5.1.0 (2017-03-28)

- fix; clicking the warning icon when there is no warning message should focus the field ([6012cbd](https://bitbucket.org/atlassian/atlaskit/commits/6012cbd))
- fix; fix field-base being unable to wrap long text with no whitespace ([0ec4cf5](https://bitbucket.org/atlassian/atlaskit/commits/0ec4cf5))
- feature; add onDialogClick property ([df790ab](https://bitbucket.org/atlassian/atlaskit/commits/df790ab))
- feature; open the dialog whenever the field is focused, and close when the dialog and field ([bc1a70b](https://bitbucket.org/atlassian/atlaskit/commits/bc1a70b))

## 5.0.1 (2017-03-21)

- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 5.0.0 (2017-03-07)

- fix; the isFitContainerWidthEnabled prop now correctly causes the field to fit the contai ([68ac90a](https://bitbucket.org/atlassian/atlaskit/commits/68ac90a))
- feature; replace onIconClick with onIconMouseDown, update smart component isFocused prop to ([ac909b0](https://bitbucket.org/atlassian/atlaskit/commits/ac909b0))
- breaking; Replaced onIconClick with onIconMouseDown. | Renamed smart FieldBase isFocused prop to defaultIsFocused

## 4.1.0 (2017-03-06)

- feature; implement warning dialog for field base ([c131133](https://bitbucket.org/atlassian/atlaskit/commits/c131133))

## 4.0.0 (2017-03-03)

- feature; don't show warning icon when the field is disabled ([c7f89be](https://bitbucket.org/atlassian/atlaskit/commits/c7f89be))
- breaking; Warning icon is no longer shown when the field is disabled
- ISSUES CLOSED: AK-1858

## 3.0.1 (2017-03-01)

- fix; fix incorrect height for compact subtle field base ([97e0030](https://bitbucket.org/atlassian/atlaskit/commits/97e0030))

## 2.1.6 (2017-02-28)

- fix; dummy commit to release stories ([3df5d9f](https://bitbucket.org/atlassian/atlaskit/commits/3df5d9f))

## 2.1.4 (2017-02-28)

- fix; dummy commit to fix broken stories and missing registry pages ([a31e92a](https://bitbucket.org/atlassian/atlaskit/commits/a31e92a))
- feature; remove compact appearance, replacing it with the isCompact boolean prop ([1156877](https://bitbucket.org/atlassian/atlaskit/commits/1156877))q
- breaking; Removed compact appearance, added isCompact property
- ISSUES CLOSED: AK-1825

## 2.1.4 (2017-02-28)

- fix; dummy commit to release stories for components ([a105c02](https://bitbucket.org/atlassian/atlaskit/commits/a105c02))

## 2.1.3 (2017-02-28)

- fix; Removes jsdocs annoations and moves them to usage.md ([2e6f725](https://bitbucket.org/atlassian/atlaskit/commits/2e6f725))

## 2.1.2 (2017-02-27)

- empty commit to make components release themselves ([5511fbe](https://bitbucket.org/atlassian/atlaskit/commits/5511fbe))

## 2.1.1 (2017-02-24)

- fix; changed hasSpinner to isLoading in field base ([aad6d77](https://bitbucket.org/atlassian/atlaskit/commits/aad6d77))
- fix; fixes AK-1789 adds a hasSpinner to field-base + inline-edit update to use it ([32de1d0](https://bitbucket.org/atlassian/atlaskit/commits/32de1d0))

## 2.0.5 (2017-02-20)

- fix; use correctly scoped package names in npm docs ([500fdf8](https://bitbucket.org/atlassian/atlaskit/commits/500fdf8))
- feature; selects should support different appearances ([961bd5c](https://bitbucket.org/atlassian/atlaskit/commits/961bd5c))

## 2.0.4 (2017-02-19)

- Include typscript definition for [@atlaskit](https://github.com/atlaskit)/field-base ([09e5343](https://bitbucket.org/atlassian/atlaskit/commits/09e5343))

## 2.0.3 (2017-02-16)

- fix; fixes a bug when inline-edit switch to read view programatically ([3a93e51](https://bitbucket.org/atlassian/atlaskit/commits/3a93e51))

## 2.0.2 (2017-02-09)

- fix; avoiding binding render to this ([40c9951](https://bitbucket.org/atlassian/atlaskit/commits/40c9951))

## 2.0.1 (2017-02-08)

- fix; fix 'jumping' of the invalid state ([aeda4bf](https://bitbucket.org/atlassian/atlaskit/commits/aeda4bf))

## 1.0.4 (2017-02-06)

- fix; fix onFocus and onBlur handlers ([c3c2314](https://bitbucket.org/atlassian/atlaskit/commits/c3c2314))
- feature; type and isFirstChild props were added to the Label sub-component ([4379ebb](https://bitbucket.org/atlassian/atlaskit/commits/4379ebb))
- breaking; label now has 'type' prop with 'form' value by default. For the 'old' design (which is only used in the inline edit component) type should be set to 'inline-edit' value.

## 1.0.3 (2017-02-06)

- fix; fix the jumping when focused ([5412538](https://bitbucket.org/atlassian/atlaskit/commits/5412538))
