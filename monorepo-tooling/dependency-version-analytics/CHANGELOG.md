# @atlaskit/dependency-version-analytics

## 2.0.0

### Major Changes

- [`f2dc9097319f0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f2dc9097319f0) - ###
  Dropped support for _legacy_ Typescript 4 types. **Typescript 5 is now the new minimum**.

  Removes the `typesVersions` property and `dist/types-ts4.5` directory from the dist.

  Types are now exclusively via the `"types": "dist/types/index.d.ts"` property.

  ```diff
  - "typesVersions": {
  -    ">=4.5 <4.9": {
  -        "*": [
  -            "dist/types-ts4.5/*",
  -            "dist/types-ts4.5/index.d.ts"
  -        ]
  -    }
  - },
  ```

## 1.7.0

### Minor Changes

- [`3f23aba4db7f2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3f23aba4db7f2) -
  Autofix: add explicit package exports (barrel removal)

## 1.6.7

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.6.6

### Patch Changes

- [#69779](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69779)
  [`8dd71b2e0653`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8dd71b2e0653) -
  Updated bin property to string as the package name and bin name matches.
  https://yarnpkg.com/configuration/manifest#bin

## 1.6.5

### Patch Changes

- [#68871](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68871)
  [`1cb2b8f4e1d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1cb2b8f4e1d7) -
  Take subWorkDir into consideration when checking for root package.json changes

## 1.6.4

### Patch Changes

- [#68766](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68766)
  [`da0d4d88ccc6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/da0d4d88ccc6) -
  added logs to debug issue related to UPMI-247

## 1.6.3

### Patch Changes

- [#66058](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66058)
  [`f602c4298340`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f602c4298340) -
  Migrate @atlaskit/dependency-version-analytics to use declarative entry points

## 1.6.2

### Patch Changes

- [#43610](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43610)
  [`b43034e49a9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b43034e49a9) - Bump
  Axios version to patch the vulnerability

## 1.6.1

### Patch Changes

- [#40619](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40619)
  [`1d902045dff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1d902045dff) - Skip
  alpha versions packages

## 1.6.0

### Minor Changes

- [#40000](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40000)
  [`d6cf767ff5e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6cf767ff5e) - Use
  subWorkDir flag to get root package.json

## 1.5.1

### Patch Changes

- [#39405](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39405)
  [`b8ca83aa350`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8ca83aa350) - Swap
  exec with spawn to avoid maxBuffer errors

## 1.5.0

### Minor Changes

- [#39186](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39186)
  [`d23cb258eb0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d23cb258eb0) - Using
  flags.cwd to set current workDir and use package.json from current workDir instead of root

## 1.4.9

### Patch Changes

- [#39119](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39119)
  [`0fd070e4bba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0fd070e4bba) - Improved
  logs

## 1.4.8

### Patch Changes

- [#38998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38998)
  [`27db2e84c40`](https://bitbucket.org/atlassian/atlassian-frontend/commits/27db2e84c40) - Removing
  '--current' postfix from packageName before checking it for support

## 1.4.7

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json

## 1.4.6

### Patch Changes

- [#37925](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37925)
  [`f01deb5e6ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f01deb5e6ab) - Use
  injected env vars instead of version.json

## 1.4.5

### Patch Changes

- [#37340](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37340)
  [`b9355830504`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9355830504) - Opt out
  of peer dependency enforcement

## 1.4.4

### Patch Changes

- [#36757](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36757)
  [`3fb20c4aeba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fb20c4aeba) - Add
  postinstall check to enforce internal peer dependencies

## 1.4.3

### Patch Changes

- [#35950](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35950)
  [`50cf866a219`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50cf866a219) - bump
  semver

## 1.4.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 1.4.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 1.4.0

### Minor Changes

- [#33371](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33371)
  [`34c045e90ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/34c045e90ed) - Added
  supportedPackages to product flow

## 1.3.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

## 1.2.2

### Patch Changes

- [#33099](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33099)
  [`2d3cc41d7d6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d3cc41d7d6) - Removed
  logic to fetch tags metadata during product flow.

## 1.2.1

### Patch Changes

- [#33019](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33019)
  [`7873dd15ba2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7873dd15ba2) - Updated
  version analytics events to exclude tags

## 1.2.0

### Minor Changes

- [#32737](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32737)
  [`b734af05daf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b734af05daf) - Added
  support for non-ak scoped packages

## 1.1.0

### Minor Changes

- [#30415](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30415)
  [`dd9a70fcafc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dd9a70fcafc) - Add npm
  dist-tags (latest, next, rc, hotfix) to analytics

## 1.0.0

### Major Changes

- [#29512](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29512)
  [`7913f15625c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7913f15625c) - Upgraded
  @atlassiansox/analytics-node-client from 2.2.1 to 3.2.1

## 0.4.2

### Patch Changes

- [#28684](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28684)
  [`f7f61c05062`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7f61c05062) - The
  'debug' dependency was updated from 2.2 to 4.3.4

## 0.4.1

### Patch Changes

- [#29170](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29170)
  [`708957d360f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/708957d360f) - Upgrade
  a dependency package simple-git

## 0.4.0

### Minor Changes

- [#28150](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28150)
  [`00ea8db4763`](https://bitbucket.org/atlassian/atlassian-frontend/commits/00ea8db4763) -
  Upgrading the simple-git version

## 0.3.13

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 0.3.12

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 0.3.11

### Patch Changes

- [#23888](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23888)
  [`ec86e718ae9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec86e718ae9) - Upgrade
  internal dependency @atlassiansox/analytics-node-client to fix a bug when bundling the analytics
  client

## 0.3.10

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`a424e62b264`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a424e62b264) - Changes
  to support Node 16 Typescript definitions from `@types/node`.

## 0.3.9

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 0.3.8

### Patch Changes

- [#20310](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20310)
  [`1977986ea86`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1977986ea86) - Bumping
  dependencies via Renovate:
  - simple-git

## 0.3.7

### Patch Changes

- [#19927](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19927)
  [`5c45b17200d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c45b17200d) - Bumping
  dependencies via Renovate:
  - simple-git

## 0.3.6

### Patch Changes

- [#19537](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19537)
  [`4d32baaa06a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d32baaa06a) - Major
  bump inquirer to latest

## 0.3.5

### Patch Changes

- [#18957](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18957)
  [`99ef999a39f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/99ef999a39f) - Renovate
  Bot upgraded simple-git from ^1.130.0 to 2.48.0

## 0.3.4

### Patch Changes

- [#18668](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18668)
  [`bca63cdea49`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bca63cdea49) - Remove
  url-parse

  We should use browser built-ins not url-parse

## 0.3.3

### Patch Changes

- [#16649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16649)
  [`650aa20f6fe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/650aa20f6fe) - Upgrade
  meow dependency

## 0.3.2

### Patch Changes

- [#9018](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9018)
  [`84270dcf31a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/84270dcf31a) - Bump
  dependency "meow" to version ^6.0.0

## 0.3.1

### Patch Changes

- [#9025](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9025)
  [`9f6045d38ce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f6045d38ce) - Upgrade
  analytics-node-client dependency

## 0.3.0

### Minor Changes

- [#7071](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7071)
  [`98deccc667`](https://bitbucket.org/atlassian/atlassian-frontend/commits/98deccc667) - Add
  support for repositories using yarn workspaces

  Upgrade events are sent for dependencies listed in any declared workspace, not only the root
  package.json. An upgrade event is only sent when all workspaces move to a new version. The lowest
  semver version across the repo is used as the aggregated version of a dependency.

## 0.2.0

### Minor Changes

- [#6793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6793)
  [`b3d3b36c06`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3d3b36c06) - Add
  statlas flag that uploads last run state to statlas rather than a git tag

## 0.1.21

### Patch Changes

- [#6734](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6734)
  [`3f51c7d0b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f51c7d0b8) - Fix
  versionString not including version range or prerelease info

## 0.1.20

### Patch Changes

- [#6673](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6673)
  [`365c4257e0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/365c4257e0) - Fix types
  not being resolvable

## 0.1.19

### Patch Changes

- [#6631](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6631)
  [`c8a5330883`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8a5330883) - Fix custom
  jira suffixed dependencies used for independent upgrades.

  '--current' suffixed deps are now treated as normal deps and converted to a non-suffixed name and
  proper version. '--next' deps are ignored. upgradeType is now also fixed to reflect the 'upgrade'
  upgradeType rather than 'add' and 'remove'.

- [`26c63f4bc3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/26c63f4bc3) - Fix
  dependency type changes not being sent as separate remove/add events

  When a dependency changes type, e.g. dependencies to devDependencies, we need to record it as
  separate remove & add events so that our queries can easily tell that the package is no longer a
  normal dependency. This is even a bigger problem when a dependency changed dependency type without
  any version change as no event would be sent at all in that case.

## 0.1.18

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 0.1.17

### Patch Changes

- [#5623](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5623)
  [`7ef9198547`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ef9198547) - Update
  dependency name & version to take into account `--next` and `--current`.

## 0.1.16

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 0.1.15

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 0.1.14

### Patch Changes

- [patch][03add6d4b5](https://bitbucket.org/atlassian/atlassian-frontend/commits/03add6d4b5):

  # What have been fixed?
  - `inquirer` version `3.3.0` . It has been fixed by bumping it to `6.4.0`.
    [Changelog](https://github.com/SBoudrias/Inquirer.js/compare/v3.3.0...v6.0.0) Mostly improvement
    and Node support.
  - `svgexport` version `0.3.2`. I has been fixed by bumping to `0.4.0`. There is no changelog but
    this is the change before the bump to
    [0.4.0](https://github.com/shakiba/svgexport/commit/3acbf51f0687f54d1972265cd3aef4c6a7e925fc),
    it should not affect anything.

## 0.1.13

### Patch Changes

- [patch][da71912521](https://bitbucket.org/atlassian/atlassian-frontend/commits/da71912521):

  ED-8822 fix: readd @atlassiansox/analytics-node-client as peer dependency

## 0.1.12

### Patch Changes

- [patch][5ccd5d5712](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ccd5d5712):

  ED-8822: promote internal packages from peer to automatically installed dependencies

## 0.1.11

### Patch Changes

- [patch][a1bc1e6637](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1bc1e6637):

  AFP-1437: Fix vulnerability issue for url-parse and bump to ^1.4.5.Packages.

## 0.1.10

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes

## 0.1.9

### Patch Changes

- [patch][23fbdc1de3](https://bitbucket.org/atlassian/atlassian-frontend/commits/23fbdc1de3):

  Update simple-git dependency

## 0.1.8

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 0.1.7

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 0.1.6

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 0.1.5

### Patch Changes

- [patch][b9b8222978](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9b8222978):

  @types/node-fetch was declared in devDependencies and dependencies. Move @types/node-fetch,
  @types/node, @types/url-parse from dependencies to devDependencies.

## 0.1.4

### Patch Changes

- [patch][620613c342](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/620613c342):

  Fix regression in populate-package where new packages would throw an error

## 0.1.3

### Patch Changes

- [patch][10b3af15f6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10b3af15f6):

  Fix version.json (cli version in analytics) being one version behind

## 0.1.2

### Patch Changes

- [patch][50ddd93885](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50ddd93885):
  - [populate-package] Fix upgradeType erroneously set to 'add' instead of 'upgrade' for the first
    event sent using --since
  - Add new upgradeType 'downgrade' to analytics payloads when a package is downgraded, typically
    after a rollback.

## 0.1.1

### Patch Changes

- [patch][b0c82fff8f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0c82fff8f):

  Add '--no-interactive' flag to disable interactive prompts

## 0.1.0

### Minor Changes

- [minor][94835b2d03](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/94835b2d03):

  Initial version
