# @atlaskit/eslint-plugin-platform

## 2.2.0

### Minor Changes

- [#103661](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103661)
  [`976a915b13fc2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/976a915b13fc2) -
  add flat config support

## 2.1.2

### Patch Changes

- [#102248](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102248)
  [`05acb13c43541`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/05acb13c43541) -
  AFB-825 Fixing edge case of expand-spacing-shorthand rule

## 2.1.1

### Patch Changes

- [#101753](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101753)
  [`ab8a4d93399e8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ab8a4d93399e8) -
  AFB-822 Turn of expand-spacing-shorthand rule until all of Jira and Platform rollout is complete

## 2.1.0

### Minor Changes

- [#98759](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98759)
  [`e6f89962ceaba`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e6f89962ceaba) -
  ESLint rule for expand-spacing-shorthand (i.e. padding and margin)

## 2.0.2

### Patch Changes

- [#182128](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/182128)
  [`c00cde6230838`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c00cde6230838) -
  fix v9 support regression
- Updated dependencies

## 2.0.1

### Patch Changes

- [`2034d96c50c40`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2034d96c50c40) -
  fixed backwards compatibility with older versions of eslint

## 2.0.0

### Major Changes

- [#176646](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/176646)
  [`9612cd921a885`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9612cd921a885) -
  ESlint rule for expand background shorthand with color token

## 1.1.0

### Minor Changes

- [#176809](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/176809)
  [`ec53bfbf3e476`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ec53bfbf3e476) -
  support eslint v9

### Patch Changes

- [#176809](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/176809)
  [`d03658b0cfd2e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d03658b0cfd2e) -
  remove compiled plugin from peer dependencies

## 1.0.0

### Major Changes

- [#168864](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168864)
  [`49e4510bd86d3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/49e4510bd86d3) -
  update eslint rule 'expand-border-properties' from warn to error

## 0.14.0

### Minor Changes

- [#173404](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/173404)
  [`7818ef3312ccd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7818ef3312ccd) -
  Eslint rule for expand-background-shorthand with token

## 0.13.1

### Patch Changes

- [#171997](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171997)
  [`4a7b02da0e9f0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4a7b02da0e9f0) -
  Added missing dependency

## 0.13.0

### Minor Changes

- [#169492](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/169492)
  [`31cbda90535ea`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/31cbda90535ea) -
  New eslint rule to expand css shorthand property 'border' into 'borderWidth',
  'borderStyle','borderColor'

## 0.12.0

### Minor Changes

- [#157394](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157394)
  [`aba8228458905`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/aba8228458905) -
  Renamed `ensure-valid-yarn-protocol-usage` to `ensure-valid-plaform-yarn-protocol-usage`

## 0.11.0

### Minor Changes

- [#157006](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157006)
  [`cfd78f9ae1e67`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cfd78f9ae1e67) -
  Renamed `ensure-valid-workspace-protocol-usage` to `ensure-valid-yarn-protocol-usage` and updated
  the rule to error if the root custom yarn protocol is used in any platform package.

## 0.10.1

### Patch Changes

- [#156370](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156370)
  [`b8def46d59747`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b8def46d59747) -
  Improved error message in ensure-valid-workspace-protocol-usage rule to provide information about
  how to resolve the error.

## 0.10.0

### Minor Changes

- [#151601](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151601)
  [`d619298dc0279`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d619298dc0279) -
  Adds `use-entrypoints-in-examples` rule which prevents the use of relative imports from `src` in
  examples. Instead they should use public entrypoints to ensure they reflect public API.

## 0.9.0

### Minor Changes

- [#146603](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/146603)
  [`73a0361be46a2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/73a0361be46a2) -
  Created new rule `@atlaskit/platform/ensure-valid-bin-values` which validates bin values in
  package.json files are valid point to files, not directories.

## 0.8.0

### Minor Changes

- [#143784](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143784)
  [`dd1180ff23e22`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dd1180ff23e22) -
  Created new rule `@atlaskit/platform/ensure-valid-workspace-protocol-usage` which validates the
  yarn workspace protocol is only used in private packages.

## 0.7.5

### Patch Changes

- [#131612](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/131612)
  [`898640d108441`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/898640d108441) -
  Add other nav4 functions to the lint rule for no-module-level-eval-nav4

## 0.7.4

### Patch Changes

- [#141306](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/141306)
  [`afce5e7baf293`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/afce5e7baf293) -
  Addition of feature-flags/no-module-level-eval-nav4 eslint rule

## 0.7.3

### Patch Changes

- [#122050](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122050)
  [`db22dc84c34c3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db22dc84c34c3) -
  Moves away from the use of ts-node to esbuild-register for local consumption

## 0.7.2

### Patch Changes

- [#116772](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116772)
  [`46167815c5528`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/46167815c5528) -
  Update feature flag prefix rule to be warn and recommend prefix only for deprecated launch darkly
  flags.

## 0.7.1

### Patch Changes

- [#116062](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116062)
  [`c965047f03c61`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c965047f03c61) -
  Update rule docs link.

## 0.7.0

### Minor Changes

- [#115707](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115707)
  [`a5cce078e311b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a5cce078e311b) -
  Add new feature flag rules and add them to the recommended preset as error violations.

## 0.6.2

### Patch Changes

- [#104090](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104090)
  [`3f7cadbe8c81`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f7cadbe8c81) -
  Fixed an issue with the package.json processor in FlatConfig

## 0.6.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 0.6.0

### Minor Changes

- [#82550](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/82550)
  [`f0948af9e586`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f0948af9e586) -
  Allow typescript upgrade to 5.x

## 0.5.0

### Minor Changes

- [#81166](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81166)
  [`a249a1bd29a6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a249a1bd29a6) -
  Upgrade ESLint to version 8

## 0.4.1

### Patch Changes

- [#78702](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78702)
  [`6b76dabb8255`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b76dabb8255) -
  Add rule to check for invalid flag usages in exports

## 0.4.0

### Minor Changes

- [#43563](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43563)
  [`51f9f6e2f10`](https://bitbucket.org/atlassian/atlassian-frontend/commits/51f9f6e2f10) - Add
  @types/react v18.2 to critical deps whitelist

## 0.3.0

### Minor Changes

- [#41190](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41190)
  [`a5047d254d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5047d254d4) - Add
  no-duplicate-dependencies rule and enable package-json-processor autofix

## 0.2.6

### Patch Changes

- [#39249](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39249)
  [`7efeb93141c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7efeb93141c) - Add a
  rule to ensure critical packages are resolved to the correct versions

## 0.2.5

### Patch Changes

- [#39049](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39049)
  [`e5f52093b2a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5f52093b2a) - Add a
  rule to ensure that publish config is correct for packages

## 0.2.4

### Patch Changes

- [#38261](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38261)
  [`eb64cbdd681`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb64cbdd681) - Add a
  new rule to verify that the atlassian team is defined if the relevant section exists in the
  package.json

## 0.2.3

### Patch Changes

- [#33879](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33879)
  [`0bf64fb3dd0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0bf64fb3dd0) - Update
  to support unary expressions like negation

## 0.2.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 0.2.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 0.2.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

## 0.1.8

### Patch Changes

- [#32441](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32441)
  [`cb0e94d2ce4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb0e94d2ce4) - Fix
  prefixes for all flags being checked at any callsite, only the current flag will be checked from
  now on

## 0.1.7

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils

## 0.1.6

### Patch Changes

- [#31962](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31962)
  [`e8a8808f299`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e8a8808f299) - Add a
  new eslint rule that enforces prefixes on platform feature flags. Ignore existing usages.

## 0.1.5

### Patch Changes

- [#31956](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31956)
  [`b47e48ad163`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b47e48ad163) - Adds an
  eslint rule to confirm that storybooks only get passed an object - to ensure that codemods work
  correctly.

## 0.1.4

### Patch Changes

- [#31631](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31631)
  [`971489f4ff4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/971489f4ff4) - Add test
  runner to identified calls that require registration of platform feature flags

## 0.1.3

### Patch Changes

- [#31581](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31581)
  [`7facf919a4e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7facf919a4e) - Remove
  product specific rules and make it so the recommended set is used everywhere instead

## 0.1.2

### Patch Changes

- [#31440](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31440)
  [`166815fbd8f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/166815fbd8f) - Add
  recommended set of flags for use in products

## 0.1.1

### Patch Changes

- [#30710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30710)
  [`7edd9e8b4b1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7edd9e8b4b1) - Add
  suggestion to change feature flag to the closest matching feature flag using fuzzy search

## 0.1.0

### Minor Changes

- [#30401](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30401)
  [`6339334e3ac`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6339334e3ac) - Adds new
  rule to disallow pre/post install scripts in package.json.

## 0.0.7

### Patch Changes

- [#30777](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30777)
  [`0cab60b90c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0cab60b90c3) - Add fix
  to eslint rule on the arguments of nested test runner

## 0.0.6

### Patch Changes

- [#30491](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30491)
  [`99449cce7f5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/99449cce7f5) - Eslint
  rules around test runner arguments and limit on nested test runners

## 0.0.5

### Patch Changes

- [#30484](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30484)
  [`aeb52cac34c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aeb52cac34c) - Split
  feature flag registration rule into two to more easily use it in products

## 0.0.4

### Patch Changes

- [#30432](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30432)
  [`cd5b194f403`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd5b194f403) - Add
  check to ensure that there is only one feature flag call per expression

## 0.0.3

### Patch Changes

- [#30320](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30320)
  [`11706c3e7c5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/11706c3e7c5) - Publish
  platform eslint rules to npm to be consumed in other products

## 0.0.2

### Patch Changes

- [#28303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28303)
  [`85dc0230439`](https://bitbucket.org/atlassian/atlassian-frontend/commits/85dc0230439) - Add
  eslint rule to allow for platform feature flag usage
