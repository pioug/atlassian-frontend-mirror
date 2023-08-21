# @atlaskit/json-schema-generator

## 3.3.6

### Patch Changes

- [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete version.json

## 3.3.5

### Patch Changes

- [`7b00632e7a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7b00632e7a8) - npm ignore files, fix ts-node dep, add logic to determine if in monorepo

## 3.3.4

### Patch Changes

- [`bd1126bb798`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bd1126bb798) - Change transpilation to static for json-schema-generator

## 3.3.3

### Patch Changes

- [`e40395c82d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e40395c82d9) - Attempt to publish json-schema-generator to the greater world

## 3.3.2

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 3.3.1

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 3.3.0

### Minor Changes

- [`0088e374340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0088e374340) - Returning promise from function in index.js so that it can write the output to files before process exits from cli.js

## 3.2.4

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 3.2.3

### Patch Changes

- [`2d1e14605e2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d1e14605e2) - This fixes the error “doc_node not found in the added definitions” that was breaking the json-schema generation script in adf-schema. In addition, it fixes the bug due to which the build process was failing silently on this error.

## 3.2.2

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 3.2.1

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 3.2.0

### Minor Changes

- [`83154234335`](https://bitbucket.org/atlassian/atlassian-frontend/commits/83154234335) - ED-13522 Add safe URL check to ADF validator (smart cards now show as unsupported content if the check fails)

## 3.1.3

### Patch Changes

- [`4fdb9762af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4fdb9762af) - ED-10792: allow shouldExclude() to work on enum values

## 3.1.2

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 3.1.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 3.1.0

### Minor Changes

- [`abce19a6d1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/abce19a6d1) - ED-9599 Add proper support for Tuple with `typescript` `TupleType`

  Array spec now has an optional `isTuple` property.

### Patch Changes

- [`9fe56e9d64`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fe56e9d64) - Revert TaskList and ItemList type

## 3.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 2.3.0

### Minor Changes

- [minor][7602615cd4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7602615cd4):

  ED-8785 Improve stage-0 & type reference support in JSON Schema Generator

## 2.2.1

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes

## 2.2.0

### Minor Changes

- [minor][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Relax text color mark validation to allow upper case characters

## 2.1.5

### Patch Changes

- [patch][cc28419139](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc28419139):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.- [patch][ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):

**FABDODGEM-13 Editor Damask Release** - [Internal post](http://go.atlassian.com/damask-release)

**BREAKING CHANGES**

- **Media:** Removed deprecated "context" property from media components in favor of "mediaClientConfig". This affects all public media UI components.
  - https://product-fabric.atlassian.net/browse/MS-2038
- **Tasks & Decisions:** Removed containerAri for task-decisions components.
  - https://product-fabric.atlassian.net/browse/ED-7631
- **Renderer:** Adapts to task-decision changes.
- **Editor Mobile Bridge:** Adapts to task-decision changes.
- **Util Data Test:** Adapts to task-decision changes.

---

**Affected Editor Components:**

tables, media, mobile, emoji, tasks & decisions, analytics

**Editor**

- Support nested actions in stage-0 schema; Change DOM representation of actions
  - https://product-fabric.atlassian.net/browse/ED-7674
- Updated i18n translations
  - https://product-fabric.atlassian.net/browse/ED-7750
- Improved analytics & crash reporting (via a new error boundary)
  - https://product-fabric.atlassian.net/browse/ED-7766
  - https://product-fabric.atlassian.net/browse/ED-7806
- Improvements to heading anchor links.
  - https://product-fabric.atlassian.net/browse/ED-7849
  - https://product-fabric.atlassian.net/browse/ED-7860
- Copy/Paste improvements
  - https://product-fabric.atlassian.net/browse/ED-7840
  - https://product-fabric.atlassian.net/browse/ED-7849
- Fixes for the selection state of Smart links.
  - https://product-fabric.atlassian.net/browse/ED-7602?src=confmacro
- Improvements for table resizing & column creation.
  - https://product-fabric.atlassian.net/browse/ED-7698
  - https://product-fabric.atlassian.net/browse/ED-7319
  - https://product-fabric.atlassian.net/browse/ED-7799

**Mobile**

- GASv3 Analytics Events are now relayed from the web to the native context, ready for dispatching.
  - https://product-fabric.atlassian.net/browse/FM-2502
- Hybrid Renderer Recycler view now handles invalid ADF nodes gracefully.
  - https://product-fabric.atlassian.net/browse/FM-2370

**Media**

- Improved analytics
  - https://product-fabric.atlassian.net/browse/MS-2036
  - https://product-fabric.atlassian.net/browse/MS-2145
  - https://product-fabric.atlassian.net/browse/MS-2416
  - https://product-fabric.atlassian.net/browse/MS-2487
- Added shouldOpenMediaViewer property to renderer
  - https://product-fabric.atlassian.net/browse/MS-2393
- Implemented analytics for file copy
  - https://product-fabric.atlassian.net/browse/MS-2036
- New `media-viewed` event dispatched when media is interacted with via the media card or viewer.
  - https://product-fabric.atlassian.net/browse/MS-2284
- Support for `alt` text attribute on media image elements.
  - https://product-fabric.atlassian.net/browse/ED-7776

**i18n-tools**

Bumped dependencies.

## 2.1.4

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 2.1.3

### Patch Changes

- [patch][0d7d459f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7d459f1a):

  Fixes type errors which were incompatible with TS 3.6

## 2.1.2

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 2.1.1

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 2.1.0

- [minor][e36f791fd6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e36f791fd6):

  - Improve types

## 2.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 1.3.0

- [minor][1eb20bca95](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1eb20bca95):

  - ED-6368: No implicit any for editor-\*-transformer packages

## 1.2.3

- [patch][9f43a40e1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f43a40e1e):

  - run prettier with bablyon as default parser; removes a bunch of warnings

## 1.2.2

- [patch][d5eec5a831](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5eec5a831):

  - Fix ts-node config because it can not resolve type package as the name doesn't match

## 1.2.1

- [patch][11d4b85](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11d4b85):

  - ED-5606 Spec generator now produces object for empty type

## 1.2.0

- [minor] Wrap invalid node with unsupported node [fb60e39](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fb60e39)

## 1.1.3

- [patch] ED-5529 Fix JSON Schema [d286ab3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d286ab3)

## 1.1.2

- [patch] Fix generator to work with TS3 [4040b00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4040b00)

## 1.1.1

- [patch] Update TS to 3.0 [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)

## 1.1.0

- [minor] ED-4421 ADF Validator [fd7e953](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fd7e953)

## 1.0.1

- [patch] ED-4713 Add stage 0 support in json-schema-generator [cce275f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cce275f)
