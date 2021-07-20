# @atlaskit/date

## 0.8.8

### Patch Changes

- [`414b6216adf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/414b6216adf) - Upgrade date-fns to ^2.17

## 0.8.7

### Patch Changes

- [`644b8b0710e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/644b8b0710e) - NO-ISSUE - TO BE REMOVED - Product fabric @atlaskit/date patch
- Updated dependencies

## 0.8.6

### Patch Changes

- [`471e2431a7c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/471e2431a7c) - Downgrade back to date-fns 1.30.1
  We discovered big bundle size increases associated with the date-fns upgrade.
  We're reverting the upgarde to investigate

## 0.8.5

### Patch Changes

- [`70f0701c2e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70f0701c2e6) - Upgrade date-fns to 2.17

## 0.8.4

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 0.8.3

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 0.8.2

### Patch Changes

- Updated dependencies

## 0.8.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 0.8.0

### Minor Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 0.7.10

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/theme@9.5.1
  - @atlaskit/elements-test-helpers@0.6.7

## 0.7.9

### Patch Changes

- [patch][36f6e99c5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36f6e99c5b):

  Fix type errors caused when generating declaration files

## 0.7.8

### Patch Changes

- [patch][f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):

  Corrects the type exports for typography, colors, elevation and layers. If you were doing any dynamic code it may break you. Refer to the [upgrade guide](/packages/core/theme/docs/upgrade-guide) for help upgrading.- Updated dependencies [3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):

- Updated dependencies [f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):
  - @atlaskit/theme@9.3.0

## 0.7.7

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

## 0.7.6

### Patch Changes

- [patch][c8bb1c7896](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8bb1c7896):

  Fix some packages having a 'modules' field in package.json rather than 'module'

## 0.7.5

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 0.7.4

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 0.7.3

### Patch Changes

- [patch][01cfa54997](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/01cfa54997):

  Move @types/date-fns from dependencies to devDependencies.

## 0.7.2

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 0.7.1

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 0.7.0

- [minor][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 0.6.4

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/theme@8.1.7

## 0.6.3

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 0.6.2

- Updated dependencies [b0210d7ccc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0210d7ccc):
  - @atlaskit/elements-test-helpers@0.5.0

## 0.6.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 0.6.0

- [minor][b684722884](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b684722884):

  - improvement of SSR tests and examples for Fabric Elements

## 0.5.0

- [minor][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 0.4.2

- Updated dependencies [7261577953](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7261577953):
  - @atlaskit/elements-test-helpers@0.3.0

## 0.4.1

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/docs@7.0.0
  - @atlaskit/theme@8.0.0

## 0.4.0

- [minor][4072865c1c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4072865c1c):

  - added SSR tests to task-decision

## 0.3.0

- [minor][36bb743af0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36bb743af0):

  - added/cleaned up ssr tests

## 0.2.1

- [patch][2762ffd47e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2762ffd47e):

  - add SSR/hydration tests to Date element

## 0.2.0

- [minor][67d563a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67d563a):

  - ED-5888 Add dark mode for date

## 0.1.9

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 0.1.8

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/theme@7.0.0

## 0.1.7

- [patch][3061b52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3061b52):

  - AK-5723 - adjust files in package.json to ensure correct publishing of dist/package.json

## 0.1.6

- [patch][36c362f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36c362f):

  - FS-3174 - Fix usage of gridSize() and borderRadius()

## 0.1.5

- [patch][527b954](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/527b954):

  - FS-3174 - Remove usage of util-shared-styles from elements components

## 0.1.4

- [patch] ED-5529 Fix JSON Schema [d286ab3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d286ab3)

## 0.1.3

- [patch] Fix rxjs and date-fns import in TS components [ab15cee](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab15cee)

## 0.1.2

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/docs@5.0.6

## 0.1.1

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/theme@5.1.3

## 0.1.0

- [minor] FS-2131 add date element [b026429](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b026429)
