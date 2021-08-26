# @atlaskit/adf-utils

## 14.2.0

### Minor Changes

- [`ad67f6684f1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad67f6684f1) - Add MediaInline to ADF Stage0 schema

### Patch Changes

- Updated dependencies

## 14.1.1

### Patch Changes

- Updated dependencies

## 14.1.0

### Minor Changes

- [`9fef23ee77c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fef23ee77c) - ED-12477 Add unsupported node capability to Media Group
- [`fc04f067e14`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc04f067e14) - Fix DataConsumer mark builder type

### Patch Changes

- Updated dependencies

## 14.0.0

### Major Changes

- [`7e6fe5abae9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e6fe5abae9) - revert heading with indentation in table cell content

### Patch Changes

- Updated dependencies

## 13.0.0

### Major Changes

- [`9d3472d1a17`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d3472d1a17) - ED-12889: Remove heading with indentation from table cell content

### Minor Changes

- [`ee1c658ca80`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ee1c658ca80) - ED-12270 Add unsupported content support for decision lists and task lists

### Patch Changes

- Updated dependencies

## 12.3.0

### Minor Changes

- [`1fbe305bf7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1fbe305bf7d) - ED-12273 Unsupported content support for Layout

### Patch Changes

- Updated dependencies

## 12.2.0

### Minor Changes

- [`8c84c29006b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c84c29006b) - Improve data-consumer mark being nested, aAdd basic doc tests for data consumer
- [`621f12ec284`](https://bitbucket.org/atlassian/atlassian-frontend/commits/621f12ec284) - Update adf util specs to support unsupported content changes

### Patch Changes

- Updated dependencies

## 12.1.0

### Minor Changes

- [`357edf7b4a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/357edf7b4a1) - ED-12266 Extend code block to support UnsupportedInline content.

### Patch Changes

- Updated dependencies

## 12.0.0

### Major Changes

- [`accd87f8116`](https://bitbucket.org/atlassian/atlassian-frontend/commits/accd87f8116) - ED-10216 Remove sanitizeNode helper function

  BREAKING CHANGE:

  ```javascript
  // Before
  import { sanitizeNode } from '@atlaskit/adf-utils';
  import { sanitizeNode } from '@atlaskit/adf-utils/sanitize';

  // After
  import { sanitizeNode } from '@atlaskit/editor-json-transformer/sanitize';
  ```

### Minor Changes

- [`330c1fce7f9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/330c1fce7f9) - ED-12264 Add unsupported content capability to panel and blockquote

### Patch Changes

- Updated dependencies

## 11.9.0

### Minor Changes

- [`6d748ea5140`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6d748ea5140) - New stage-0 data consumer mark in ADF schema

### Patch Changes

- Updated dependencies

## 11.8.1

### Patch Changes

- [`ffbe78153cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ffbe78153cf) - New stage0 ADF change: localId attribute on Table nodes
- Updated dependencies

## 11.8.0

### Minor Changes

- [`586040bf70b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/586040bf70b) - Ensure that all children are validated in new error path

## 11.7.1

### Patch Changes

- [`7374ce442af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7374ce442af) - Scrub content in array attributes

## 11.7.0

### Minor Changes

- [`70f47afdee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70f47afdee) - Added unsupportedBlock support for mediaSingle as a child
- [`549740c01d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/549740c01d) - Exported the validator errors map
  Convert nodes that are after an invalid length to be unsupported

### Patch Changes

- Updated dependencies

## 11.6.0

### Minor Changes

- [`f523768cdc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f523768cdc) - Fix validator and schema for Image Captions

### Patch Changes

- Updated dependencies

## 11.5.0

### Minor Changes

- [`9697099745`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9697099745) - NO-ISSUE: replace media and smart links with valid nodes

## 11.4.0

### Minor Changes

- [`4d9d11c246`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d9d11c246) - Fixes nodes with multiple validation specs to return node with most suitable spec.

## 11.3.0

### Minor Changes

- [`9b1c48edd1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b1c48edd1) - Revert ED-10820 to resolve broken validator

### Patch Changes

- [`4e64133fdc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e64133fdc) - Remove empty captions on the editor saving
- Updated dependencies

## 11.2.2

### Patch Changes

- [`e6f6e57465`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6f6e57465) - NO-ISSUE: replace unicode glyphs including emojis

## 11.2.1

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 11.2.0

### Minor Changes

- [`24af67e112`](https://bitbucket.org/atlassian/atlassian-frontend/commits/24af67e112) - NO-ISSUE: allow consumers to specify per-type node replacements

## 11.1.2

### Patch Changes

- [`b0203bf159`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0203bf159) - NO-ISSUE: retain numeric characters

## 11.1.1

### Patch Changes

- [`b7e3b9c8f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7e3b9c8f2) - retain non-word characters and case when scrubbing

## 11.1.0

### Minor Changes

- [`988bc9cfc9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/988bc9cfc9) - ED-10676: ADF scrub util

## 11.0.0

### Major Changes

- [`f2fbde158a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f2fbde158a) - getEmptyADF() returns correct DocNode type

### Minor Changes

- [`a929e563b9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a929e563b9) - Text color mark changed to be case insensitive
- [`eba787da28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eba787da28) - Allow link marks on media

### Patch Changes

- Updated dependencies

## 10.5.0

### Minor Changes

- [`a41378f853`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a41378f853) - Refactor & fix few cases of unsupported node attributes:

  - Preseve attributes on nodes which do not support any attributes
  - Add unsupportedNodeAttribute to bulletList, layoutSection etc.

### Patch Changes

- [`be142eec6e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be142eec6e) - Refactor attributes validation and add unsupportedNodeAttribute mark in layoutsection
- Updated dependencies

## 10.4.1

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 10.4.0

### Minor Changes

- [`6e237a6753`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e237a6753) - Add optional caption to mediaSingle in adf schema for stage 0

### Patch Changes

- [`26ff0e5e9a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/26ff0e5e9a) - ED-10353 Added adf schema changes to support emoji panels
- Updated dependencies

## 10.3.0

### Minor Changes

- [`aa03ba4b0b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa03ba4b0b) - ED-9733 Preserve known mark on node which does not support it.
- [`e4114d7053`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4114d7053) - ED-9607 - Preserve Unsupported Node attributes

### Patch Changes

- Updated dependencies

## 10.2.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 10.2.1

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 10.2.0

### Minor Changes

- [`0f5b0a3f5d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0f5b0a3f5d) - CS-2944 Traversing visitor function provides current node's depth inside document tree
- [`d55f8066fd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d55f8066fd) - ED-9569 Preserve unsupported mark attribute and value
- [`abce19a6d1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/abce19a6d1) - Remove hard coded branching for Tuples
  Remove `forceContentValidation`
- [`9d278c2387`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d278c2387) - NONE: ADF traverse Visitor and VisitorCollection is now exported

### Patch Changes

- [`9fe56e9d64`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fe56e9d64) - Revert TaskList and ItemList type
- [`0cd9a41d67`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0cd9a41d67) - ED-9843 Refactor spec based validator
- Updated dependencies

## 10.1.0

### Minor Changes

- [`b7c4fc3b08`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7c4fc3b08) - Preseve unsupported mark from getting lost

### Patch Changes

- Updated dependencies

## 10.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 9.4.0

### Minor Changes

- [`0ae829a4ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ae829a4ea) - EDM-648: Adds resizing and alignment to embed cards

### Patch Changes

- Updated dependencies

## 9.3.0

### Minor Changes

- [`50c333ab3a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50c333ab3a) - EDM-216: Adds EmbedCards in the Editor under the flag - allowEmbeds in the UNSAFE_cards prop

### Patch Changes

- [`f7ee96b6c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7ee96b6c3) - Move sanitizeNode from editor-core to adf-utils so that it can be shared easier
- Updated dependencies

## 9.2.0

### Minor Changes

- [minor][1156536403](https://bitbucket.org/atlassian/atlassian-frontend/commits/1156536403):

  Expose missing status node in exports

### Patch Changes

- Updated dependencies [92d04b5c28](https://bitbucket.org/atlassian/atlassian-frontend/commits/92d04b5c28):
  - @atlaskit/adf-schema@9.0.1

## 9.1.0

### Minor Changes

- [minor][5d430f7d37](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d430f7d37):

  ED-8517 Add localId support to Extension node

  **BREAKING CHANGE**
  `ExtensionContent` has been removed.

### Patch Changes

- [patch][04e54bf405](https://bitbucket.org/atlassian/atlassian-frontend/commits/04e54bf405):

  EDM-500: Allow blockCard inside Panel- Updated dependencies [04e54bf405](https://bitbucket.org/atlassian/atlassian-frontend/commits/04e54bf405):

- Updated dependencies [9f43b9f0ca](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f43b9f0ca):
- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
- Updated dependencies [5d430f7d37](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d430f7d37):
  - @atlaskit/adf-schema@9.0.0
  - @atlaskit/docs@8.5.1

## 9.0.0

### Major Changes

- [major][715572f9e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/715572f9e5):

  Remove indentation from table cell and layout paragraphs

### Patch Changes

- Updated dependencies [bc29fbc030](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc29fbc030):
- Updated dependencies [1386afaecc](https://bitbucket.org/atlassian/atlassian-frontend/commits/1386afaecc):
- Updated dependencies [584279e2ae](https://bitbucket.org/atlassian/atlassian-frontend/commits/584279e2ae):
- Updated dependencies [f83b67a761](https://bitbucket.org/atlassian/atlassian-frontend/commits/f83b67a761):
- Updated dependencies [6b4fe5d0e0](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b4fe5d0e0):
- Updated dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
- Updated dependencies [715572f9e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/715572f9e5):
  - @atlaskit/adf-schema@8.0.0
  - @atlaskit/docs@8.5.0

## 8.0.2

### Patch Changes

- [patch][04a627ee6c](https://bitbucket.org/atlassian/atlassian-frontend/commits/04a627ee6c):

  ED-8974 Remove file option from adf-utils package.json

## 8.0.1

### Patch Changes

- [patch][b3cf2b8a05](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3cf2b8a05):

  Fix expand not allowing marks issue- Updated dependencies [b3cf2b8a05](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3cf2b8a05):

  - @atlaskit/adf-schema@7.0.1

## 8.0.0

### Major Changes

- [major][4695ac5697](https://bitbucket.org/atlassian/atlassian-frontend/commits/4695ac5697):

  ED-8751 Change entry points to current Atlaskit standard

  Old

  ```javascript
  import {} from '@atlaskit/adf-utils/validator.es';
  import {} from '@atlaskit/adf-utils/builders.es';
  import {} from '@atlaskit/adf-utils/traverse.es';
  ```

  New

  ```javascript
  import {} from '@atlaskit/adf-utils/validator';
  import {} from '@atlaskit/adf-utils/builders';
  import {} from '@atlaskit/adf-utils/traverse';
  ```

  Now each entry point contain a `package.json` with `main` and `module` properties pointing to the right target. There is no need to consume a particular extension- [major][7baff84f38](https://bitbucket.org/atlassian/atlassian-frontend/commits/7baff84f38):

  [ED-8521] Fix ADFSchema to invalidate any Expand Node with marks inside of Block nodes other than the Doc Node

### Patch Changes

- [patch][7602615cd4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7602615cd4):

  ED-8785 Improve stage-0 & type reference support in JSON Schema Generator- [patch][96ee7441fe](https://bitbucket.org/atlassian/atlassian-frontend/commits/96ee7441fe):

  ED-8751 Remove 'export \*' and add lint rule to prevent circular deps on adf-utils- Updated dependencies [7602615cd4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7602615cd4):

- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [c171660346](https://bitbucket.org/atlassian/atlassian-frontend/commits/c171660346):
- Updated dependencies [27fde59914](https://bitbucket.org/atlassian/atlassian-frontend/commits/27fde59914):
- Updated dependencies [b18fc8a1b6](https://bitbucket.org/atlassian/atlassian-frontend/commits/b18fc8a1b6):
- Updated dependencies [7baff84f38](https://bitbucket.org/atlassian/atlassian-frontend/commits/7baff84f38):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [a5d0019a5e](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5d0019a5e):
  - @atlaskit/json-schema-generator@2.3.0
  - @atlaskit/adf-schema@7.0.0
  - @atlaskit/docs@8.4.0

## 7.4.3

### Patch Changes

- [patch][8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):

  Remove Karma tests - based on AFP-960- Updated dependencies [e8a31c2714](https://bitbucket.org/atlassian/atlassian-frontend/commits/e8a31c2714):

- Updated dependencies [8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):
  - @atlaskit/adf-schema@6.2.0

## 7.4.2

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/adf-schema@6.1.1
  - @atlaskit/json-schema-generator@2.2.1

## 7.4.1

### Patch Changes

- [patch][b01fc0ceef](https://bitbucket.org/atlassian/atlassian-frontend/commits/b01fc0ceef):

  ED-8151 Alt text is promoted to full schema. Feature flag and MediaOptions property UNSAFE_allowAltTextOnImages was renamed to allowAltTextOnImages.- Updated dependencies [b01fc0ceef](https://bitbucket.org/atlassian/atlassian-frontend/commits/b01fc0ceef):

- Updated dependencies [d085ab4419](https://bitbucket.org/atlassian/atlassian-frontend/commits/d085ab4419):
  - @atlaskit/adf-schema@6.1.0
  - @atlaskit/docs@8.3.1

## 7.4.0

### Minor Changes

- [minor][9d8752351f](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d8752351f):

  ED-7783 Expose function that returns empty ADF document

  New function `getEmptyADF()` which returns agreed upon format for empty ADF is now exported from `@atlaskit/adf-utils`

### Patch Changes

- Updated dependencies [3e87f5596a](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e87f5596a):
- Updated dependencies [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
- Updated dependencies [26dbe7be6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/26dbe7be6d):
  - @atlaskit/adf-schema@6.0.0
  - @atlaskit/docs@8.3.0

## 7.3.2

### Patch Changes

- [patch][761dcd6d19](https://bitbucket.org/atlassian/atlassian-frontend/commits/761dcd6d19):

  ED-7675: promote nested taskLists from stage-0 schema to full- Updated dependencies [761dcd6d19](https://bitbucket.org/atlassian/atlassian-frontend/commits/761dcd6d19):

- Updated dependencies [faccb537d0](https://bitbucket.org/atlassian/atlassian-frontend/commits/faccb537d0):
  - @atlaskit/adf-schema@5.0.0

## 7.3.1

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Relax text color mark validation to allow upper case characters

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/adf-schema@4.3.2
  - @atlaskit/json-schema-generator@2.2.0

## 7.3.0

### Minor Changes

- [minor][f1a06fc2fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a06fc2fd):

  ED-7876 Add expand and nestedExpand to stage-0 schema

  Adds two new nodes `expand` and `nestedExpand` to the stage-0 schema.

- [minor][ae42b1ba1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae42b1ba1e):

  Adf schema changes (for stage-0) to support alt text on media nodes.
  `editor-core` changes are wrapped under the editor prop `UNSAFE_allowAltTextOnImages`. There is no alt text implementation yet, so the user won't be able to add alt text to images just yet.

## 7.2.0

### Minor Changes

- [minor][1a0fe670f9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1a0fe670f9):

  ED-7674: support nested actions in stage-0 schema; change DOM representation of actions

  ### Nested actions

  This changeset adds support for nesting actions _at the schema level_, currently only within the stage-0 ADF schema.

  The editor and renderer currently do nothing special to represent these nested actions. As of this release, they appear as as flat list.

  To enable this feature, use the new `allowNestedTasks` prop.

  ### DOM representation of actions in renderer + editor

  This release also changes the DOM representation of actions away from a `ol > li` structure, to a `div > div` one. That is, both the `taskList` and `taskItem` are wrapped in `div` elements.

  Because taskLists can now be allowed to nest themselves, this would otherwise have created an `ol > ol` structure, which is invalid.- [minor][ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):

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

### Patch Changes

- [patch][cc28419139](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc28419139):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 7.1.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 7.1.0

### Minor Changes

- [minor][65ada7f318](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65ada7f318):

  **FABDODGEM-12 Editor Cashmere Release**

  - [Internal post](http://go.atlassian.com/cashmere-release)

  **Affected editor components:**

  tables, media, mobile, text color, emoji, copy/paste, analytics

  **Performance**

  - Async import for code blocks and task items on renderer
    - https://product-fabric.atlassian.net/browse/ED-7155

  **Table**

  - Add support to sort tables that contains smart links
    - https://product-fabric.atlassian.net/browse/ED-7449
  - Scale table when changing to full width mode
    - https://product-fabric.atlassian.net/browse/ED-7724

  **Text color**

  - Update text color toolbar with right color when text is inside a list, panel, etc.
    - https://product-fabric.atlassian.net/browse/FM-1752

**Mobile** - Implement undo/redo interface on Hybrid Editor - https://product-fabric.atlassian.net/browse/FM-2393

**Copy and Paste**

    - Support copy & paste when missing context-id attr
      - https://product-fabric.atlassian.net/browse/MS-2344
    - Right click + copy image fails the second time that is pasted
      - https://product-fabric.atlassian.net/browse/MS-2324
    - Copying a never touched image for the first time from editor fails to paste
      - https://product-fabric.atlassian.net/browse/MS-2338
    - Implement analytics when a file is copied
      - https://product-fabric.atlassian.net/browse/MS-2036

**Media**

- Add analytics events and error reporting [NEW BIG FEATURE]
  - https://product-fabric.atlassian.net/browse/MS-2275
  - https://product-fabric.atlassian.net/browse/MS-2329
  - https://product-fabric.atlassian.net/browse/MS-2330
  - https://product-fabric.atlassian.net/browse/MS-2331
  - https://product-fabric.atlassian.net/browse/MS-2332
  - https://product-fabric.atlassian.net/browse/MS-2390
- Fixed issue where we can’t insert same file from MediaPicker twice
  - https://product-fabric.atlassian.net/browse/MS-2080
- Disable upload of external files to media
  - https://product-fabric.atlassian.net/browse/MS-2372

**Notable Bug Fixes**

    - Implement consistent behaviour for rule and mediaSingle on insertion
      - Feature Flag:
        - allowNewInsertionBehaviour - [default: true]
      - https://product-fabric.atlassian.net/browse/ED-7503
    - Fixed bug where we were showing table controls on mobile.
      - https://product-fabric.atlassian.net/browse/ED-7690
    - Fixed bug where editor crashes after unmounting react component.
      - https://product-fabric.atlassian.net/browse/ED-7318
    - Fixed bug where custom emojis are not been showed on the editor
      - https://product-fabric.atlassian.net/browse/ED-7726

- [minor][79c69ed5cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79c69ed5cd):

  ED-7449 Implement sorting inline cards inside tables base on resolved title

## 7.0.0

### Major Changes

- [major][80adfefba2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80adfefba2):

  Remove applicationCard node and action mark

- Updated dependencies [1194ad5eb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1194ad5eb3):
  - @atlaskit/adf-schema@4.0.0

## 6.1.7

### Patch Changes

- [patch][48fcfce0a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48fcfce0a1):

  Export missing definitions from schema to fix types in utils

## 6.1.6

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 6.1.5

### Patch Changes

- [patch][0d7d459f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7d459f1a):

  Fixes type errors which were incompatible with TS 3.6

## 6.1.4

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 6.1.3

- Updated dependencies [6164bc2629](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6164bc2629):
  - @atlaskit/adf-schema@3.0.0

## 6.1.2

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 6.1.1

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 6.1.0

- [minor][79f0ef0601](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79f0ef0601):

  - Use strict tsconfig to compile editor packages

## 6.0.5

- Updated dependencies [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - @atlaskit/adf-schema@2.5.5
  - @atlaskit/docs@8.0.0

## 6.0.4

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

- [patch][0ac39bd2dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ac39bd2dd):

  - Bump tslib to 1.9

## 6.0.3

- [patch][97e555c168](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97e555c168):

  - Revert "[ED-5259 - ED-6200] adds defaultMarks on tableNode (pull request #5259)"

## 6.0.2

- [patch][b425ea772b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b425ea772b):

  - Revert "ED-5505 add strong as default mark to table header (pull request #5291)"

## 6.0.1

- [patch][499f9783d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/499f9783d8):

  - [ED-5505] Fix forceContentValidation replacing valid entities to empty array

## 6.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 5.8.0

- [minor][a7af8a8865](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a7af8a8865):

  - [ED-6325] Add forceContentValidation to array specs

## 5.7.2

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/docs@7.0.0

## 5.7.1

- [patch][60ea09b0cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60ea09b0cc):

  - ED-6246 Improves types and adds more metadata to errors

## 5.7.0

- [minor][4d8d759bf9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d8d759bf9):

  - [ED-6255] Migrate ADFNode type to ADFEntity

## 5.6.3

- [patch][e83a441140](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e83a441140):

  - Revert type change to width/height attributes for media node

## 5.6.2

- [patch][09696170ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/09696170ec):

  - Bumps prosemirror-utils to 0.7.6

## 5.6.1

- [patch][14fe1381ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/14fe1381ba):

  - ED-6118: ensure media dimensions are always integers, preventing invalid ADF

## 5.6.0

- [minor][be706e55f6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/be706e55f6):

  - ED-6154 Adds `array` validation support

## 5.5.0

- [minor][a5b5a5098e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a5b5a5098e):

  - Adds index to visitor

## 5.4.2

- [patch][76ed7f0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76ed7f0):

  - Update Specs

## 5.4.1

- [patch][57cffcb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/57cffcb):

  - Need tslib

## 5.4.0

- [minor][1205725](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1205725):

  - Move schema to its own package

## 5.3.4

- Updated dependencies [80f765b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80f765b):
  - @atlaskit/editor-common@23.0.0

## 5.3.3

- [patch][34df084](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/34df084):

  - Fix layout schema and enable breakout layouts in renderer

## 5.3.2

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/docs@6.0.0

## 5.3.1

- [patch][0a297ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a297ba):

  - Packages should not be shown in the navigation, search and overview

## 5.3.0

- [minor][a1b03d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1b03d0):

  - ED-3890 Adds Indentation support on paragraphs and headings

## 5.2.0

- [minor][94094fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/94094fe):

  - Adds support for links around images

## 5.1.9

- Updated dependencies [7e8b4b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e8b4b9):
  - @atlaskit/editor-common@22.0.0

## 5.1.8

- [patch][416fbb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/416fbb3):

  - ED-3298: codeBlocks inside lists

## 5.1.7

- [patch][409e610](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/409e610):

  - Fix schema block marks name inconsistency

## 5.1.6

- [patch][df33a8b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df33a8b):

  - Fix block marks validation

## 5.1.5

- [patch][d3bb11f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d3bb11f):

  - Fixing validator for alignment marks

## 5.1.4

- [patch][4e2a3b1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e2a3b1):

  - Fixes validating marks with multiple possible branch

## 5.1.3

- [patch][a1fb551](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1fb551):

  - Fixed style attribute ADF error for Fabric Status

## 5.1.2

- [patch][11d4b85](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11d4b85):

  - ED-5606 Adds union attrs support to validator

## 5.1.1

- [patch][b19b7bb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b19b7bb):

  - ED-5721 Validator now supports optional content

## 5.1.0

- [minor][b440439](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b440439):

  - Add breakout mark to editor, renderer and adf-utils

## 5.0.1

- Updated dependencies [2c21466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c21466):
  - @atlaskit/editor-common@21.0.0

## 5.0.0

- [major][e1db106](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e1db106):

  - New validator API

  ### Breaking Change

  **Old API**

  ```
  export type ValidationMode = 'strict' | 'loose';

  validator(
    nodes?: Array<string>,
    marks?: Array<string>,
    validationMode?: ValidationMode,
  )
  ```

  **New API**

  We introduced a new `allowPrivateAttributes` option. It allows attributes starting with `__` without validation.

  ```
  export type ValidationMode = 'strict' | 'loose';

  export interface ValidationOptions {
    mode?: ValidationMode;
    allowPrivateAttributes?: boolean;
  }

  validator(
    nodes?: Array<string>,
    marks?: Array<string>,
    options?: ValidationOptions,
  )
  ```

## 4.1.0

- [minor][4f5830f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4f5830f):

  - ED-4200: add page layout support to generator and ADF schema

## 4.0.4

- [patch][e8052e1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8052e1):

  - Add main field to adf-utils package.json

## 4.0.3

- [patch][653b6a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/653b6a9):

  - removed optional attributes from adf-builder module for status node

- [patch][cd5471b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cd5471b):

  - added style attribute for Status node in ADF schema

## 4.0.2

- [patch][6201223" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6201223"
  d):

  - Add examples.

## 4.0.1

- [patch] Fix floating number validation [ea027b8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea027b8)

## 4.0.0

- [major] Wrap invalid node with unsupported node [fb60e39](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fb60e39)

## 3.0.1

- [patch] Updated dependencies [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)
  - @atlaskit/editor-common@20.0.0

## 3.0.0

- [major] New validator API [db2d466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/db2d466)

## 2.2.6

- [patch] Updated dependencies [2afa60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2afa60d)
  - @atlaskit/editor-common@19.0.0

## 2.2.5

- [patch] Updated dependencies [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [patch] Updated dependencies [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)
  - @atlaskit/editor-common@18.0.0

## 2.2.4

- [patch] make attris in ADFNode optioanla as not every node have this value [df13878](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df13878)

## 2.2.3

- [patch] Updated dependencies [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
  - @atlaskit/editor-common@17.0.0

## 2.2.2

- [patch] Fix .d.ts file names [3d6c0fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d6c0fd)

## 2.2.1

- [patch] .es.js files now reference es2015 builds instead of es5 [98034c7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98034c7)

## 2.2.0

- [minor] FS-2961 Introduce status component and status node in editor [7fe2b0a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7fe2b0a)

## 2.1.5

- [patch] Updated dependencies [6e1d642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e1d642)
  - @atlaskit/editor-common@16.0.0

## 2.1.4

- [patch] Update TS to 3.0 [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
- [none] Updated dependencies [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
  - @atlaskit/editor-common@15.0.7

## 2.1.3

- [patch] Updated dependencies [7545979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7545979)
  - @atlaskit/editor-common@15.0.0

## 2.1.2

- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/editor-common@14.0.11

## 2.1.1

- [patch] ED-5178: added card node to default schema [51e7446](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/51e7446)
- [none] Updated dependencies [51e7446](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/51e7446)
  - @atlaskit/editor-common@14.0.8

## 2.1.0

- [minor] ED-4421 ADF Validator [fd7e953](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fd7e953)
- [none] Updated dependencies [fd7e953](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fd7e953)
  - @atlaskit/json-schema-generator@1.1.0
  - @atlaskit/editor-common@14.0.4

## 2.0.5

- [patch] Fix es5 exports of some of the newer modules [3f0cd7d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f0cd7d)
- [none] Updated dependencies [3f0cd7d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f0cd7d)

## 2.0.4

- [none] Updated dependencies [597e0bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/597e0bd)
  - @atlaskit/editor-common@14.0.0
- [none] Updated dependencies [61df453](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/61df453)
  - @atlaskit/editor-common@14.0.0
- [none] Updated dependencies [812a39c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/812a39c)
  - @atlaskit/editor-common@14.0.0
- [none] Updated dependencies [c8eb097](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8eb097)
  - @atlaskit/editor-common@14.0.0
- [patch] Updated dependencies [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
  - @atlaskit/editor-common@14.0.0

## 2.0.3

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/editor-common@13.2.7
  - @atlaskit/docs@5.0.2

## 2.0.2

- [patch] Include type files to release [02cae82](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/02cae82)

## 2.0.1

- [patch] Fix types for top level imports [61cd06b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/61cd06b)

## 2.0.0

- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/editor-common@13.0.0
  - @atlaskit/docs@5.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/editor-common@13.0.0
  - @atlaskit/docs@5.0.0

## 1.0.1

- [patch] Fix failing master build [1e2faf4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e2faf4)

- [none] Updated dependencies [5f6ec84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f6ec84)
  - @atlaskit/editor-common@12.0.0

## 1.0.0

- [major] Add @atlaskit/adf-utils package [dd2efd5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd2efd5)
- [none] Updated dependencies [dd2efd5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd2efd5)
  - @atlaskit/editor-common@11.4.0
