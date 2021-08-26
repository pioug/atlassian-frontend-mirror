# @atlaskit/adf-schema

## 19.1.0

### Minor Changes

- [`ad67f6684f1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad67f6684f1) - Add MediaInline to ADF Stage0 schema
- [`71bb1bb3cd0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/71bb1bb3cd0) - [ED-12933] Add new custom step for TypeAhead local flow control

## 19.0.0

### Major Changes

- [`96c6146eef1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/96c6146eef1) - ED-13187: localId optional & empty values filtered
- [`2aef13b22d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2aef13b22d8) - ED-12604: add localId for tables and dataConsumer mark for extensions in full schema

### Patch Changes

- [`aa6f29f8c3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa6f29f8c3d) - Setting up empty string value for alt attribute (images) by default

## 18.2.0

### Minor Changes

- [`489e4d18bc1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/489e4d18bc1) - ED-12891 Enable indentation as a valid mark on headings in layouts to align PM schema with ADF schema

### Patch Changes

- [`18a96c228f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18a96c228f8) - EDM-2024: fix MediaGroup Prosemirror Schema incompatibility

## 18.1.1

### Patch Changes

- [`d9e3deda557`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9e3deda557) - ED-12545 We are adding compatibility test for ADF Schema with ProseMirror Schema

## 18.1.0

### Minor Changes

- [`9fef23ee77c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fef23ee77c) - ED-12477 Add unsupported node capability to Media Group

## 18.0.0

### Major Changes

- [`7e6fe5abae9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e6fe5abae9) - revert heading with indentation in table cell content

## 17.0.0

### Major Changes

- [`ddecaf6f306`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ddecaf6f306) - ED-12436 remove 'allowLocalIdGeneration' from Editor as extension localId is added to full schema
- [`084abc13201`](https://bitbucket.org/atlassian/atlassian-frontend/commits/084abc13201) - ED-12265 Add unsupport content support to media single
  ED-12265 Remove `caption` from default schema - Renderer
- [`9d3472d1a17`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d3472d1a17) - ED-12889: Remove heading with indentation from table cell content

### Minor Changes

- [`ee1c658ca80`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ee1c658ca80) - ED-12270 Add unsupported content support for decision lists and task lists
- [`5fba22a5a21`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5fba22a5a21) - [NO ISSUE] Move Table Sort Custom Step to the ADF package

## 16.0.0

### Major Changes

- [`f973bb5dde8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f973bb5dde8) - [ux] ED-12782 Remove codeblock languages from adf-schema

  BREAKING CHANGE

  `@atlaskit/adf-schema` is not longer exporting: `DEFAULT_LANGUAGES`, `createLanguageList`, `filterSupportedLanguages`, `findMatchedLanguage`, `getLanguageIdentifier` and `Language`. This are now used internally in `@atlaskit/editor-core`

### Minor Changes

- [`1fbe305bf7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1fbe305bf7d) - ED-12273 Unsupported content support for Layout

## 15.3.0

### Minor Changes

- [`8c84c29006b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c84c29006b) - Improve data-consumer mark being nested, aAdd basic doc tests for data consumer
- [`621f12ec284`](https://bitbucket.org/atlassian/atlassian-frontend/commits/621f12ec284) - Update adf util specs to support unsupported content changes

### Patch Changes

- [`794b81df22c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/794b81df22c) - Removes surplus style whitespace rule on code mark.

## 15.2.0

### Minor Changes

- [`653093877f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/653093877f8) - Update data-consumer behaviour for json transforming
- [`357edf7b4a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/357edf7b4a1) - ED-12266 Extend code block to support UnsupportedInline content.

## 15.1.1

### Patch Changes

- Updated dependencies

## 15.1.0

### Minor Changes

- [`330c1fce7f9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/330c1fce7f9) - ED-12264 Add unsupported content capability to panel and blockquote

### Patch Changes

- [`5089bd2544d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5089bd2544d) - ED-11919: generate localId for tables
- [`58b170725be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58b170725be) - Renamed @atlaskit/editor-test-helpers/schema-builder to @atlaskit/editor-test-helpers/doc-builder

## 15.0.0

### Major Changes

- [`db9dec112b1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db9dec112b1) - ED-10613: clean up text colour experiment

### Minor Changes

- [`6d748ea5140`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6d748ea5140) - New stage-0 data consumer mark in ADF schema

### Patch Changes

- [`e6bd5669a53`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6bd5669a53) - ED-10888 Deduplicate AJV initialization from our codebase
- [`d2e70ebaaa9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2e70ebaaa9) - NO-ISSUE: updated editor tests to use 'doc: DocBuilder' instead of 'doc: any'
- [`fe1c96a3d28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe1c96a3d28) - added DocBuilder type to @atlaskit/editor-test-helpers, replaced duplicate definitions and DocumentType

## 14.1.0

### Minor Changes

- [`e6033cf5a7b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6033cf5a7b) - HOT-94716 Add embedCard to allowable content in bodiedExtension

## 14.0.0

### Major Changes

- [`85cc08ec2e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/85cc08ec2e6) - [ED-11353] Adds the input method for undo/redo events

  #Breaking Change

  `adf-schema`

  AnalyticsStep doesn't need the `handleAnalyticsEvent: HandleAnalyticsEvent<P>` anymore.
  We are submitting the events using the editor-core plugin `analytics`. On this file:
  `packages/editor/editor-core/src/plugins/analytics/plugin.ts`

  This will fix a hard to catch bug where the events were being dispatched before the transaction being applied.
  The transaction wasn't used, but the event was dispatched anyway, causing a data mismatch between user experience and actions.

### Minor Changes

- [`be0bfb03f12`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be0bfb03f12) - [ux] Implement syntax highlighting in editor code-block

### Patch Changes

- [`ffbe78153cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ffbe78153cf) - New stage0 ADF change: localId attribute on Table nodes

## 13.7.2

### Patch Changes

- [`b36f8119df5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b36f8119df5) - Add in keymap for moving to gap cursor from caption
- [`d01a017e81e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d01a017e81e) - fixed schema node type definitions to be more consistent

## 13.7.1

### Patch Changes

- [`3405124622e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3405124622e) - ED-11742 Fix table custom step start position
- [`04649ad9889`](https://bitbucket.org/atlassian/atlassian-frontend/commits/04649ad9889) - ED-10369: fixed table breakout layout when pasted from renderer
- [`c3ff456f166`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3ff456f166) - ED-11860 fix renderer code block content paste inconsistencies

## 13.7.0

### Minor Changes

- [`70f47afdee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70f47afdee) - Added unsupportedBlock support for mediaSingle as a child
- [`714fd9e922`](https://bitbucket.org/atlassian/atlassian-frontend/commits/714fd9e922) - Promote media link mark to full schema

## 13.6.0

### Minor Changes

- [`f523768cdc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f523768cdc) - Fix validator and schema for Image Captions

### Patch Changes

- [`b7d42ec728`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7d42ec728) - [ux] ED-11631 Sort code block language list as case insensitive
- [`1bd969d9c1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1bd969d9c1) - Fix re-renders in a table cell with the NodeView update
- [`9e76e3a5c5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e76e3a5c5) - [ux] Adding support to detect and render anchor links.

## 13.5.0

### Minor Changes

- [`7f7643108f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f7643108f) - [ux] EmbedCard node's `width` attribute will have 100% default value now. For UI this means, embeds are 100% wide when inserted (instead of slightly smaller then 100% previously).

### Patch Changes

- [`aa671045fc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa671045fc) - [ux] ED-11300: allowed link mark under actionItem and decisionItem

## 13.4.0

### Minor Changes

- [`21de2f736a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/21de2f736a) - fix: normalizeHexColor behaves normally when passed 'default'

## 13.3.1

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 13.3.0

### Minor Changes

- [`4fdb9762af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4fdb9762af) - ED-10792: allow shouldExclude() to work on enum values

### Patch Changes

- [`0175a00afc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0175a00afc) - [ED-10670] Update prosemirror-model type to use posAtIndex methods
- [`a242048609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a242048609) - Re-enable adf schema backwards compatibility check
- [`d6c23f1886`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6c23f1886) - Added dark mode support to table cell background colors
- [`db4e6ab0d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db4e6ab0d4) - EDM-1388: Toggle link mark on media and not mediaSingle

## 13.2.0

### Minor Changes

- [`a929e563b9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a929e563b9) - Text color mark changed to be case insensitive
- [`eba787da28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eba787da28) - Allow link marks on media

### Patch Changes

- [`703752d487`](https://bitbucket.org/atlassian/atlassian-frontend/commits/703752d487) - ED-10647 Remove caret from prosemirror-model, prosemirror-keymap, prosemirror-state, prosemirror-transform to lock them down to an explicit version
- [`ff39f9f643`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff39f9f643) - ED-10614 Add match indexing (Confluence API) for annotation creation for the renderer

  BEFORE

  ```
  export type AnnotationActionResult =
    {
      step: Step;
      doc: JSONDocNode;
    } | false;
  ```

  AFTER

  ```
  export type AnnotationActionResult =
    {
      step: Step;
      doc: JSONDocNode;
      originalSelection: string;    // <<===
      numMatches: number;           // <<===
      matchIndex: number;           // <<===
    } | false;
  ```

## 13.1.0

### Minor Changes

- [`a41378f853`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a41378f853) - Refactor & fix few cases of unsupported node attributes:

  - Preseve attributes on nodes which do not support any attributes
  - Add unsupportedNodeAttribute to bulletList, layoutSection etc.

### Patch Changes

- [`e4abda244e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4abda244e) - ED-9912: replace prosemirror-tables with editor-tables
- [`3e652479cc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e652479cc) - ED-9912: use CellAttributes from editor-tables in adf-schema
- [`be142eec6e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be142eec6e) - Refactor attributes validation and add unsupportedNodeAttribute mark in layoutsection

## 13.0.1

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 13.0.0

### Major Changes

- [`26ff0e5e9a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/26ff0e5e9a) - ED-10353 Added adf schema changes to support emoji panels

### Minor Changes

- [`db7170dc53`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db7170dc53) - Promote EmbedCard to full schema
- [`c536839013`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c536839013) - ED-10214 Add typeAheadQuery to default schema
- [`6e237a6753`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e237a6753) - Add optional caption to mediaSingle in adf schema for stage 0
- [`9a39500244`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a39500244) - Bump ProseMirror packages

  Read more: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1671956531/2020-08

- [`2e5e9bf891`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e5e9bf891) - ED-10123 Export Analytics Step from adf-schema instead of internal editor-core

### Patch Changes

- [`c90f346430`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c90f346430) - Remove @ts-ignores/@ts-expect-errors

## 12.3.0

### Minor Changes

- [`15fe5f8731`](https://bitbucket.org/atlassian/atlassian-frontend/commits/15fe5f8731) - ED-9601 Mark all nodes that don't support node selection with `selectable: false` in their node spec
- [`78de49291b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78de49291b) - [TWISTA-130] Exports AnnotationDataAttributes type and variable typo
- [`e4114d7053`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4114d7053) - ED-9607 - Preserve Unsupported Node attributes

### Patch Changes

- [`e485167c47`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e485167c47) - ED-10018: bump prosemirror-tables to fix copy-pasting merged rows
- [`d0596d4bfa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0596d4bfa) - change Html and Csharp to HTML and C# in codeblock language list

## 12.2.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 12.2.1

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 12.2.0

### Minor Changes

- [`50b49e0eb9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50b49e0eb9) - [ED-9780] allow link mark inside bodied extension
- [`abce19a6d1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/abce19a6d1) - Change old Array style tuples to Tuple

  ```
  interface X extends Array<T | U> {
    0: T
  }
  ```

  to

  ```
  type X = [T, T | U];
  ```

- [`8f843aaa4b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f843aaa4b) - EDM-927: Adding embeds inside expand and layouts

### Patch Changes

- [`9fe56e9d64`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fe56e9d64) - Revert TaskList and ItemList type
- [`0cd9a41d67`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0cd9a41d67) - ED-9843 Refactor spec based validator

## 12.1.0

### Minor Changes

- [`b7c4fc3b08`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7c4fc3b08) - Preseve unsupported mark from getting lost

### Patch Changes

- [`7c6dc39447`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c6dc39447) - ED-9568 annotations are now preserved when copy/pasting; also updated general copy/paste behaviour to preserve formatting of the pasted content, so that e.g. copying italic text into bold will preserve both italic and bold.

## 12.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 11.1.0

### Minor Changes

- [`01c27cf8cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/01c27cf8cf) - ED-9552 Move SetAttrsStep into adf-schema

## 11.0.0

### Major Changes

- [`0ae829a4ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ae829a4ea) - EDM-648: Adds resizing and alignment to embed cards

### Patch Changes

- [`fb1a9c8009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb1a9c8009) - [FM-3726] Call onAnnotationClick when user taps in inline comment on Renderer
- [`2589a3e4fc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2589a3e4fc) - EDM-713: fix copy-paste from Renderer to Editor on Firefox

## 10.0.0

### Major Changes

- [`e30894b112`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e30894b112) - [FM-3716] Breaking changing: AnnotationType is now AnnotationTypes

  ```js
  // Before

  import { AnnotationType } from '@atlaskit/adf-schema';

  annotation({
    type: AnnotationType,
  });

  // After

  import { AnnotationTypes } from '@atlaskit/adf-schema';

  annotation({
    type: AnnotationTypes.INLINE_COMMENT,
  });
  ```

### Minor Changes

- [`39b2e48c32`](https://bitbucket.org/atlassian/atlassian-frontend/commits/39b2e48c32) - Export new Add Column custom step in `@atlaskit/adf-schema/steps`
- [`50c333ab3a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50c333ab3a) - EDM-216: Adds EmbedCards in the Editor under the flag - allowEmbeds in the UNSAFE_cards prop

### Patch Changes

- [`0964848b95`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0964848b95) - [FM-3505] Add support for inline comments in the renderer mobile bridge getElementScrollOffsetByNodeType function
- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove unused dependencies

## 9.0.2

### Patch Changes

- [`ee0333aa64`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ee0333aa64) - ED-6318 Add (None) option to top of code block language list- Updated dependencies

## 9.0.1

### Patch Changes

- [patch][92d04b5c28](https://bitbucket.org/atlassian/atlassian-frontend/commits/92d04b5c28):

  ED-9079 Disable spell check for text marked as inline code.

  This prevents the red squiggly line appearing underneath inline code, and aligns the UX with codeblock which already disables spell check. - @atlaskit/editor-json-transformer@7.0.11

  - @atlaskit/editor-test-helpers@11.1.1

## 9.0.0

### Major Changes

- [major][5d430f7d37](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d430f7d37):

  ED-8517 Add localId support to Extension node

  **BREAKING CHANGE**
  `ExtensionContent` has been removed.

### Minor Changes

- [minor][04e54bf405](https://bitbucket.org/atlassian/atlassian-frontend/commits/04e54bf405):

  EDM-500: Allow blockCard inside Panel

### Patch Changes

- [patch][9f43b9f0ca](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f43b9f0ca):

  ED-9037 / ED-9039: ProseMirror node selection for mentions and emojis- Updated dependencies [7e26fba915](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e26fba915):

- Updated dependencies [205b05851a](https://bitbucket.org/atlassian/atlassian-frontend/commits/205b05851a):
- Updated dependencies [823d80f31c](https://bitbucket.org/atlassian/atlassian-frontend/commits/823d80f31c):
- Updated dependencies [3644fc1afe](https://bitbucket.org/atlassian/atlassian-frontend/commits/3644fc1afe):
- Updated dependencies [62f1f218d9](https://bitbucket.org/atlassian/atlassian-frontend/commits/62f1f218d9):
- Updated dependencies [6eb8c0799f](https://bitbucket.org/atlassian/atlassian-frontend/commits/6eb8c0799f):
  - @atlaskit/editor-test-helpers@11.1.0
  - @atlaskit/editor-json-transformer@7.0.10

## 8.0.0

### Major Changes

- [major][715572f9e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/715572f9e5):

  Remove indentation from table cell and layout paragraphs

### Minor Changes

- [minor][bc29fbc030](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc29fbc030):

  ED-8748 ED-8211: Update media linking UI experience in renderer, fixes other rendering issues and workarounds.

### Patch Changes

- [patch][1386afaecc](https://bitbucket.org/atlassian/atlassian-frontend/commits/1386afaecc):

  ED-8751 Remove 'export \*' from adf-schema- [patch][584279e2ae](https://bitbucket.org/atlassian/atlassian-frontend/commits/584279e2ae):

  ED-8751 Remove circular dependencies, add eslint rule and recreate json schema caused by different import order- [patch][f83b67a761](https://bitbucket.org/atlassian/atlassian-frontend/commits/f83b67a761):

  EDM-407: Smart cards copy pasted from Renderer to Editor create mediaSingles- [patch][6b4fe5d0e0](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b4fe5d0e0):

  preserve image alt-text when pasting rich text content- Updated dependencies [4bec09aa74](https://bitbucket.org/atlassian/atlassian-frontend/commits/4bec09aa74):

- Updated dependencies [d63888b5e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63888b5e5):
- Updated dependencies [bdf25b1c4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdf25b1c4c):
- Updated dependencies [645918eda6](https://bitbucket.org/atlassian/atlassian-frontend/commits/645918eda6):
- Updated dependencies [fad8a16962](https://bitbucket.org/atlassian/atlassian-frontend/commits/fad8a16962):
  - @atlaskit/editor-test-helpers@11.0.0
  - @atlaskit/editor-json-transformer@7.0.9

## 7.0.1

### Patch Changes

- [patch][b3cf2b8a05](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3cf2b8a05):

  Fix expand not allowing marks issue

## 7.0.0

### Major Changes

- [major][7baff84f38](https://bitbucket.org/atlassian/atlassian-frontend/commits/7baff84f38):

  [ED-8521] Fix ADFSchema to invalidate any Expand Node with marks inside of Block nodes other than the Doc Node

### Minor Changes

- [minor][c171660346](https://bitbucket.org/atlassian/atlassian-frontend/commits/c171660346):

  Expose MediaADFAttrs- [minor][a5d0019a5e](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5d0019a5e):

  EDM-336: Add inlineCard to BB schema and support roundtripping

### Patch Changes

- [patch][7602615cd4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7602615cd4):

  ED-8785 Improve stage-0 & type reference support in JSON Schema Generator- [patch][27fde59914](https://bitbucket.org/atlassian/atlassian-frontend/commits/27fde59914):

  ED-8626 Can click on "open link in a new tab" with `javascript:` links in editor.- [patch][b18fc8a1b6](https://bitbucket.org/atlassian/atlassian-frontend/commits/b18fc8a1b6):

  ED-8700 Alt text property on external images is added, this is required to make external images saved and validated correctly when they contain alt text.- Updated dependencies [7602615cd4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7602615cd4):

- Updated dependencies [5e3aab8e77](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e3aab8e77):
  - @atlaskit/json-schema-generator@2.3.0
  - @atlaskit/editor-test-helpers@10.6.1
  - @atlaskit/editor-json-transformer@7.0.8

## 6.2.0

### Minor Changes

- [minor][e8a31c2714](https://bitbucket.org/atlassian/atlassian-frontend/commits/e8a31c2714):

  ED-8687 Export default schema configuration

### Patch Changes

- [patch][8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):

  Remove Karma tests - based on AFP-960- Updated dependencies [9d6b02c04f](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d6b02c04f):

- Updated dependencies [8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):
  - @atlaskit/editor-test-helpers@10.6.0
  - @atlaskit/editor-json-transformer@7.0.7

## 6.1.1

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/editor-json-transformer@7.0.6
  - @atlaskit/editor-test-helpers@10.5.1
  - @atlaskit/json-schema-generator@2.2.1

## 6.1.0

### Minor Changes

- [minor][b01fc0ceef](https://bitbucket.org/atlassian/atlassian-frontend/commits/b01fc0ceef):

  ED-8151 Alt text is promoted to full schema. Feature flag and MediaOptions property UNSAFE_allowAltTextOnImages was renamed to allowAltTextOnImages.

### Patch Changes

- [patch][d085ab4419](https://bitbucket.org/atlassian/atlassian-frontend/commits/d085ab4419):

  [ED-8109] Enable media link inside of block contents like layoutColumn and expand- Updated dependencies [3b19e30129](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b19e30129):

- Updated dependencies [fe4eaf06fc](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe4eaf06fc):
  - @atlaskit/editor-test-helpers@10.5.0
  - @atlaskit/editor-json-transformer@7.0.5

## 6.0.0

### Major Changes

- [major][26dbe7be6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/26dbe7be6d):

  ED-8470: removed unecessary borderColorPalette, made Palette.Color border a required prop

### Patch Changes

- [patch][3e87f5596a](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e87f5596a):

  ED-8388 Strip annotation marks when pasting content into Editor- Updated dependencies [cfcd27b2e4](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfcd27b2e4):

- Updated dependencies [ec929ab10e](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec929ab10e):
  - @atlaskit/editor-test-helpers@10.4.3
  - @atlaskit/editor-json-transformer@7.0.4

## 5.0.0

### Major Changes

- [major][761dcd6d19](https://bitbucket.org/atlassian/atlassian-frontend/commits/761dcd6d19):

  ED-7675: promote nested taskLists from stage-0 schema to full

### Minor Changes

- [minor][faccb537d0](https://bitbucket.org/atlassian/atlassian-frontend/commits/faccb537d0):

  ED-8167: Re-worked GapCursor implementation; alignment should be more consistent

### Patch Changes

- Updated dependencies [edc4a4a7ae](https://bitbucket.org/atlassian/atlassian-frontend/commits/edc4a4a7ae):
  - @atlaskit/editor-test-helpers@10.4.1
  - @atlaskit/editor-json-transformer@7.0.3

## 4.4.0

### Minor Changes

- [minor][e5dd37f7a4](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5dd37f7a4):

  ED-7966: Promote expand to full schema, update flag and add appropriate tests

### Patch Changes

- [patch][4eefd368a8](https://bitbucket.org/atlassian/atlassian-frontend/commits/4eefd368a8):

  default media collection to empty string instead of null- Updated dependencies [46e6693eb3](https://bitbucket.org/atlassian/atlassian-frontend/commits/46e6693eb3):

- Updated dependencies [83300f0b6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/83300f0b6d):
- Updated dependencies [e5dd37f7a4](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5dd37f7a4):
  - @atlaskit/editor-test-helpers@10.4.0
  - @atlaskit/editor-json-transformer@7.0.2

## 4.3.3

### Patch Changes

- [patch][ee262a5a37](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee262a5a37):

  default media collection to empty string instead of null

## 4.3.2

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Relax text color mark validation to allow upper case characters

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/json-schema-generator@2.2.0

## 4.3.1

### Patch Changes

- [patch][161a30be16](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/161a30be16):

  ED-7974: fix copying expand with tables that contain nestedExpand

- [patch][ef2ba36d5c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef2ba36d5c):

  Add alt text support for renderer

- [patch][6e4b678428](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e4b678428):

  ED-8077: Fixes pasting expands into a table that is inside an expand

- [patch][b3fd0964f2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3fd0964f2):

  Fix an issue in the media node spec with alt text

- [patch][9a261337b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a261337b5):

  Add a fixture of a document with different cases of unsupported content- [patch][cc1b89d310](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc1b89d310):

  ED-8162: Prevent the editor from locking up when navigating from gap-cursor to an expand title- [patch][938f1c2902](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/938f1c2902):

  ED-8186: Fix incorrect mark filtering when toggling lists- Updated dependencies [10425b84b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10425b84b4):

- Updated dependencies [926798632e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926798632e):
  - @atlaskit/editor-test-helpers@10.3.0
  - @atlaskit/editor-json-transformer@7.0.1

## 4.3.0

### Minor Changes

- [minor][a484cc35c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a484cc35c8):

  ED-7911: external media will now be uploaded to media service

- [minor][f1a06fc2fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a06fc2fd):

  ED-7876 Add expand and nestedExpand to stage-0 schema

  Adds two new nodes `expand` and `nestedExpand` to the stage-0 schema.

- [minor][ae42b1ba1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae42b1ba1e):

  Adf schema changes (for stage-0) to support alt text on media nodes.
  `editor-core` changes are wrapped under the editor prop `UNSAFE_allowAltTextOnImages`. There is no alt text implementation yet, so the user won't be able to add alt text to images just yet.

### Patch Changes

- [patch][5b2c89203e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b2c89203e):

  Fix linting errors from prettier upgrade

- Updated dependencies [6d9c8a9073](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d9c8a9073):
  - @atlaskit/editor-json-transformer@7.0.0

## 4.2.0

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

## 4.1.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 4.1.0

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

### Patch Changes

- [patch][1715ad2bd5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1715ad2bd5):

  ED-7731: add support for GraphQL syntax highlighting

## 4.0.0

### Major Changes

- [major][1194ad5eb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1194ad5eb3):

  Remove unnecessary `tableBackgroundBorderColors` in favour of unique `tableBackgroundBorderColor` for all table cell background border- [major][80adfefba2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80adfefba2):

  Remove applicationCard node and action mark

### Minor Changes

- [minor][5276c19a41](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5276c19a41):

  ED-5996: support viewing inline comments within editor

  You can do this with the `annotationProvider` prop. Passing a truthy value to this (e.g. the empty object `{}`) will:

  - enable support for working with the `annotation` ADF mark
  - will render highlights around any annotations, and
  - allow copying and pasting of annotations within the same document, or between documents

  You can also optionally pass a React component to the `component`, so you can render custom components on top of or around the editor when the user's text cursor is inside an annotation.

  Please see [the package documentation](https://atlaskit.atlassian.com/packages/editor/editor-core/docs/annotations) for more information.

  There is an example component called `ExampleInlineCommentComponent` within the `@atlaskit/editor-test-helpers` package. It is currently featured in the full page examples on the Atlaskit website.

  Annotations are styled within the editor using the `fabric-editor-annotation` CSS class.

  Other changes:

  - `Popup` now supports an optional `rect` parameter to direct placement, rather than calculating the bounding client rect around a DOM node.- [minor][45ae9e1cc2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/45ae9e1cc2):

  ED-7201 Add new background cell colors and improve text color

### Patch Changes

- [patch][bbb4f9463d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbb4f9463d):

  CEMS-234 Prioritize media single over media group

  This solves issue where pasting images with text from third party applications into a table ends adding an error image.- [patch][922ec81fe7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/922ec81fe7):

  ED-7710: Only show annotation highlight if we have a provider

## 3.1.3

### Patch Changes

- [patch][48fcfce0a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48fcfce0a1):

  Export missing definitions from schema to fix types in utils

## 3.1.2

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 3.1.1

### Patch Changes

- [patch][0d7d459f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7d459f1a):

  Fixes type errors which were incompatible with TS 3.6

## 3.1.0

### Minor Changes

- [minor][66c5c88f4a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66c5c88f4a):

  Refactor emoji to use typeahead plugin- [minor][bdee736f14](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bdee736f14):

  ED-7175: unify smart link and hyperlink toolbars

  Also updates the toDOM and parseDOM on ADF nodes, making `url` optional.

  Smart cards can now optionally be passed an onResolve callback, of the shape:

      onResolve?: (data: { url?: string; title?: string }) => void;

  This gets fired when the view resolves a smart card from JSON-LD, either via the client or the `data` prop.

### Patch Changes

- [patch][6e3a0038fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e3a0038fc):

  ED-7288: reduces the number of DOM nodes in table cells, changes the way resize handles are positioned- [patch][a0a3fa7aac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a0a3fa7aac):

  Ensure mediagroup nodes are copied to destination collection when pasted in different documents

## 3.0.0

### Major Changes

- [major][6164bc2629](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6164bc2629):

  ED-6806 Move 'calcTableColumnWidths' from adf-schema into editor-common

  BREAKING CHANGE

  We move 'calcTableColumnWidths' helper from adf-schema into our helper library editor-common, you can use it from editor-common in the same way:

  Before:

  ```javascript
  import { calcTableColumnWidths } from '@atlaskit/adf-schema';
  ```

  Now:

  ```javascript
  import { calcTableColumnWidths } from '@atlaskit/editor-common';
  ```

## 2.13.1

### Patch Changes

- [patch][a892339c19](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a892339c19):

  Give all editor decorations a key to prevent ProseMirror from re-rendering decorations constantly.

  Enables YAML language for codeblocks

## 2.13.0

### Minor Changes

- [minor][ec66d3c646](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec66d3c646):

  Improve performance of pages with smart cards

## 2.12.4

### Patch Changes

- [patch][0bb88234e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0bb88234e6):

  Upgrade prosemirror-view to 1.9.12

## 2.12.3

### Patch Changes

- [patch][ec8066a555](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec8066a555):

  Upgrade `@types/prosemirror-view` Typescript definitions to latest 1.9.x API

## 2.12.2

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 2.12.1

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 2.12.0

### Minor Changes

- [minor][13ca42c394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/13ca42c394):

  # use getAuthFromContext from media when a file if pasted from a different collection

  Now products can provide auth using **getAuthFromContext** on MediaClientConfig:

  ```
  import {MediaClientConfig} from '@atlaskit/media-core'
  import Editor from '@atlaskit/editor-core'

  const viewMediaClientConfig: MediaClientConfig = {
    authProvider // already exists
    getAuthFromContext(contextId: string) {
      // here products can return auth for external pages.
      // in case of copy & paste on Confluence, they can provide read token for
      // files on the source collection
    }
  }
  const mediaProvider: = {
    viewMediaClientConfig
  }

  <Editor {...otherNonRelatedProps} media={{provider: mediaProvider}} />
  ```

## 2.11.4

### Patch Changes

- [patch][f60618b0f0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f60618b0f0):

  ED-5844 Adding media link UI to editor

## 2.11.3

### Patch Changes

- [patch][4aed452b1b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aed452b1b):

  ED-7041, SL-231: fix copying smart link from renderer to editor

## 2.11.2

### Patch Changes

- [patch][1b12e59bfd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b12e59bfd):

  ED-6917, SL-260: support drag and drop of smart links

## 2.11.1

### Patch Changes

- [patch][4c0fcec857](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4c0fcec857):

  ED-7059: fix trailing slashes for hyperlinks being removed, and smart links resolving

## 2.11.0

### Minor Changes

- [minor][ef787dba60](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef787dba60):

  ED-7178: Promoting alignment and indentation to full schema

## 2.10.0

### Minor Changes

- [minor][3d9136e483](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d9136e483):

  ED-7182: Promoting annotation to full schema

## 2.9.0

### Minor Changes

- [minor][d6c31deacf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d6c31deacf):

  ED-6701 Upgrade prosemirror-view to 1.9.10 and prosemirror-inputrules to 1.0.4 for composition input improvements

## 2.8.1

### Patch Changes

- [patch][34c6df4fb8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/34c6df4fb8):

  adf-schema has been extended with one missing color, email-renderer now bundles up styles into .css file

## 2.8.0

### Minor Changes

- [minor][86bf524679](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/86bf524679):

  ED-7117, ED-7087: Fix copy pasting smart links out of editor. Fallback to HTML anchor tag if errors occur during rendering (e.g. no provider found).

## 2.7.1

### Patch Changes

- [patch][4931459ac1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4931459ac1):

  Revert removed by accident breakout mark

## 2.7.0

### Minor Changes

- [minor][0a7ce4f0e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a7ce4f0e6):

  ED-7046: promote layoutSection and layoutColumn from stage-0 to full schema

## 2.6.1

### Patch Changes

- [patch][aff59f9a99](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aff59f9a99):

  ED-7045: promote mediaSingle width attribute from stage-0 to full schema

## 2.6.0

### Minor Changes

- [minor][a6a241d230](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6a241d230):

  Breakout mark stage-0 -> full schema

## 2.5.10

### Patch Changes

- [patch][9886f4afa1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9886f4afa1):

  - [ED-7017] Improve table performance removing cellView from table

## 2.5.9

- [patch][f823890888](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f823890888):

  - ED-6970: Fix backspacing inside a layout removing all content.

## 2.5.8

- [patch][5ad66b6d1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ad66b6d1a):

  - [ED-6860] Revert prosemirror-view 1.8.9 bumps, this version was making the cursor typing slowly. this version is recreating all plugins when we use `EditorView.setProps`

## 2.5.7

- [patch][1ec6367e00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ec6367e00):

  - ED-6551 - Lists should correctly wrap adjacent floated content without overlapping

## 2.5.6

- [patch][80cf1c1e82](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80cf1c1e82):

  - [ED-6654] Update prosemirror-view to 1.8.9 that fixes a few issues with mouse selections on prosemirror like click on table and the controls doesn't show up

## 2.5.5

- Updated dependencies [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - @atlaskit/editor-json-transformer@6.0.0
  - @atlaskit/editor-test-helpers@9.0.0

## 2.5.4

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

- [patch][0ac39bd2dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ac39bd2dd):

  - Bump tslib to 1.9

## 2.5.3

- [patch][583f5db46d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/583f5db46d):

  - Use tslib as dependency

## 2.5.2

- [patch][6695367885](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6695367885):

  - Revert emoji refactor

## 2.5.1

- [patch][c01f9e1cc7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c01f9e1cc7):

  - Standardise code-block class between editor/renderer. Fix bg color when code-block is nested within a table heading.

## 2.5.0

- [minor][64dd2ab46f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64dd2ab46f):

  - ED-6558 Fix clicking to set the cursor placement after an inline node that's at the end of a line. Set the default style attribute of Status nodes to be empty instead of 'null'.

## 2.4.1

- [patch][97e555c168](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97e555c168):

  - Revert "[ED-5259 - ED-6200] adds defaultMarks on tableNode (pull request #5259)"

## 2.4.0

- [minor][09a90e4af1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/09a90e4af1):

  - ED-6319 Supporting select media using gap cursor, fix behaviour of backspace key and gap cursor in media single with layout wrap-right.

## 2.3.2

- [patch][b425ea772b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b425ea772b):

  - Revert "ED-5505 add strong as default mark to table header (pull request #5291)"

## 2.3.1

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 2.3.0

- [minor][02dd1f7287](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/02dd1f7287):

  - [ED-5505] Persists formatting to table cells and headers when toggling header row, column or applying any text formatting to empty cells.

## 2.2.1

- [patch][3f8a08fc88](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f8a08fc88):

  Release a new version of adf-schema

## 2.2.0

- [minor][63133d8704](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/63133d8704):

  - [ED-6200] Add defaultMarks attribute on tableCell schema

## 2.1.0

- [minor][0fea11af41](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0fea11af41):

  - Email renderer supports numbered columns, adf-schema extended with colors

## 2.0.1

- [patch][205b101e2b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/205b101e2b):

  - ED-6230: bump prosemirror-view to 1.8.3; workaround Chrome bug with copy paste multiple images

## 2.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 1.7.1

- [patch][0825fbe634](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0825fbe634):

  - ED-6410: remove opacity from cells background color

## 1.7.0

- [minor][6380484429](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6380484429):

  - ED-6485 Support breakout mark on layout-section. Retain breakout mark when toggling list nested within columns.

## 1.6.2

- [patch][d18b085e2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d18b085e2a):

  - Integrating truly upfront ID

## 1.6.1

- [patch][4d0c196597](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d0c196597):

  - ED-6232 Fix copy-pasting a table with numbered column drops one column

## 1.6.0

- [minor][3672ec23ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3672ec23ef):

  - [ED-5788] Add new layout Breakout button for CodeBlock and Layout

## 1.5.5

- [patch][356de07a87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/356de07a87):

  - Revert back to number for external media

## 1.5.4

- Updated dependencies [4af5bd2a58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4af5bd2a58):
  - @atlaskit/editor-json-transformer@4.1.11
  - @atlaskit/editor-test-helpers@7.0.0

## 1.5.3

- [patch][775da616c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/775da616c6):

  - [ED-5910] Keep width & height on media node as number

## 1.5.2

- [patch][e83a441140](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e83a441140):

  - Revert type change to width/height attributes for media node

## 1.5.1

- [patch][09696170ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/09696170ec):

  - Bumps prosemirror-utils to 0.7.6

## 1.5.0

- [minor][14fe1381ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/14fe1381ba):

  - ED-6118: ensure media dimensions are always integers, preventing invalid ADF

## 1.4.6

- [patch][557a2b5734](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/557a2b5734):

  - ED-5788: bump prosemirror-view and prosemirror-model

## 1.4.5

- [patch][4552e804d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4552e804d3):

  - dismiss StatusPicker if status node is not selected

## 1.4.4

- [patch][adff2caed7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/adff2caed7):

  - Improve typings

## 1.4.3

- [patch][d10cf50721](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d10cf50721):

  - added fabric status to ADF full schema

## 1.4.2

- [patch][478a86ae8a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/478a86ae8a):

  - avoid using the same localId when pasting status

## 1.4.1

- [patch][2d6d5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d6d5b6):

  - ED-5379: rework selecting media under the hood; maintain size and layout when copy-pasting

## 1.4.0

- [minor][c5ee0c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c5ee0c8):

  - Added Annotation mark to ADF, editor & renderer

## 1.3.3

- [patch][060f2da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/060f2da):

  - ED-5991: bumped prosemirror-view to 1.6.8

## 1.3.2

- [patch][a50c114](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a50c114):

  - ED-6026: unify attributes for blockCard and inlineCard; allow parseDOM using just 'data' attribute

## 1.3.1

- [patch][7d9ccd7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d9ccd7):

  - fixed copy/paste status from renderer to editor

## 1.3.0

- [minor][cbcac2e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbcac2e):

  - Promote smartcard nodes to full schema

## 1.2.0

- [minor][5b11b69](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b11b69):

  - Allow mixed of cell types in a table row

## 1.1.0

- [minor][b9f8a8f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9f8a8f):

  - Adding alignment options to media

## 1.0.1

- [patch][d7bfd60](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7bfd60):

  - Rengenerate JSON schema after moving packages

## 1.0.0

- [major][1205725](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1205725):

  - Move schema to its own package
