# @atlaskit/adf-schema

## 51.5.17

### Patch Changes

- [`708ab6d0c8d6d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/708ab6d0c8d6d) -
  EDITOR-5416 flexible list indentation stage 0

  https://hello.atlassian.net/wiki/spaces/EDITOR/pages/6434470772/ADF+Change+94+List+indentation+flexibility

- Updated dependencies

## 51.5.16

### Patch Changes

- [`b56fac4df95b4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b56fac4df95b4) -
  remove no-tscheck and fix safe url logic
- Updated dependencies

## 51.5.15

### Patch Changes

- Updated dependencies

## 51.5.14

### Patch Changes

- Updated dependencies

## 51.5.13

### Patch Changes

- Updated dependencies

## 51.5.12

### Patch Changes

- [`47dce55fed533`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/47dce55fed533) -
  Add option to filter out marks if they don't have all required attrs and therefore are invalid
- Updated dependencies

## 51.5.11

### Patch Changes

- Updated dependencies

## 51.5.10

### Patch Changes

- Updated dependencies

## 51.5.9

### Patch Changes

- Updated dependencies

## 51.5.8

### Patch Changes

- Updated dependencies

## 51.5.7

### Patch Changes

- [`25c388e0f807a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/25c388e0f807a) -
  EDITOR-4684 Clean up platform_editor_add_orange_highlight_color experiment - orange highlight
  color is now permanently enabled
- Updated dependencies

## 51.5.6

### Patch Changes

- [`8eca3ae04714e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8eca3ae04714e) -
  Fixed mixed HTML/Editor content copy/paste issue on Status node.

## 51.5.5

### Patch Changes

- [`4e6624861c374`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4e6624861c374) -
  [NO-ISSUE] Moves eslint to devDependencies

## 51.5.4

### Patch Changes

- [`6aa3d234b547c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6aa3d234b547c) -
  clean up unused scripts
- Updated dependencies

## 51.5.3

### Patch Changes

- [`18ea40790b19b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/18ea40790b19b) -
  fix missing json-schema in dist/ folder

## 51.5.2

### Patch Changes

- [`cac3d6228356a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cac3d6228356a) -
  adf-schema doc updates
- Updated dependencies

## 51.5.1

### Patch Changes

- 5ebd544: [EDITOR-3648] Support layout with 4/5 columns in bodiedSyncBlock node

## 51.5.0

### Minor Changes

- 16a4426: Promote syncBlock and bodiedSyncBlock to full schema

## 51.4.0

### Minor Changes

- b76eeec: EDITOR-2752 update BodiedSyncBlockDefinition to be an isolating node

## 51.3.2

### Patch Changes

- fbb3b5f: EDITOR-2443 Fix order of node types under bodied sync block to ensure paragraph is first

## 51.3.1

### Patch Changes

- 2c46f94: EDITOR-2443 Fix order of node types under bodied sync block to ensure paragraph is first
  so empty paragraph is for a default new n

## 51.3.0

### Minor Changes

- 1f40219: EDITOR-2332 add bodied sync block node

## 51.2.0

### Minor Changes

- 46fd534: EDITOR-1566 add sync-block to default stage-0 schema

## 51.1.2

### Patch Changes

- 5d6f6e4: EDITOR-1526 add export syncBlock

## 51.1.1

### Patch Changes

- a5d311d: Update tableCellNodeSpecOptionsWithLocalId parseDOM method to include all cell
  attributes.

## 51.1.0

### Minor Changes

- 8556bce: EDITOR-1526 implement sync block node type

## 51.0.0

### Major Changes

- 81923c7: EDITOR-1534 Removes blockTaskItemStage0 ProseMirror node spec, replacing it with
  blockTaskItem

## 50.4.0

### Minor Changes

- a2428f6: EDITOR-1534 Restores blockTaskItemStage0 which was removed in a minor version, (should
  have been major) breaking backwards compatibility of the package

## 50.3.0

### Minor Changes

- 5e27e9b: EDITOR-1432 Promote blockTaskItem to the full schema

## 50.2.4

### Patch Changes

- 79c4757: Added fix for table cell attribute parser which was not correctly identifying background
  colors when the data-cell-background attribute was not lowercase

## 50.2.3

### Patch Changes

- cdf64a5: NO-ISSUE Fix layoutSectionWithLocalId export to use stage0 schema builder.

## 50.2.2

### Patch Changes

- ed9288b: [EDITOR-1353] Disallow most marks on blockTaskItem nodes

## 50.2.1

### Patch Changes

- b6e815d: EDITOR-1373 Fix tableCellWithLocalId toDOM and export nested table cell nodes with
  localId.

## 50.2.0

### Minor Changes

- 4aa837d: EDITOR-1219 Remove localId from hardBreak. Fix exports for listItemWithLocalId and
  layoutSectionwithLocalId. Add localId to media nodes.

## 50.1.1

### Patch Changes

- f27ce6e: EDITOR-1105 Add typescript types for blockTaskItem

## 50.1.0

### Minor Changes

- 8df84f2: EDITOR-1124 Adds `blockTaskItem` element to `taskList` which allows block content
  children of task items. Initially only paragraph and extension elements are allowed, as this
  change is to facilitate migration from TinyMCE to cloud editor in Confluence. To do so we need to
  support the Legacy Content Extension (LCE) in task items, with unsupported content in task items
  in TinyMCE simply being wrapped with the LCE and adopting `blockTaskItem` instead of `taskItem`

## 50.0.1

### Patch Changes

- 866c567: Improve typing for overrideDocumentStepJSON

## 50.0.0

### Major Changes

- c385ae6: EDITOR-987 Added optional localId attribute to table nodes

## 49.1.0

### Minor Changes

- d090050: Added optional localId attribute to nodes and marks

## 49.0.6

### Patch Changes

- 243f95a: [ED-28432] Reorder background color palette swatches

## 49.0.5

### Patch Changes

- 076fe56: [ED-28432] Replace feature gate with experiment
  platform_editor_add_orange_highlight_color

## 49.0.4

### Patch Changes

- 522c857: Unpin version of @babel/runtime to allow minor version variance
- Updated dependencies [522c857]
  - @atlaskit/editor-prosemirror@7.1.3

## 49.0.3

### Patch Changes

- 00c6129: [ED-28432] Enable orange highlight color, along with yellow color

## 49.0.2

### Patch Changes

- f22895a: [FD-91152] Clean up experiment editor_text_highlight_orange_to_yellow

## 49.0.1

### Patch Changes

- 25dfcfe: bumping @babel/runtime to 7.26.10
- Updated dependencies [25dfcfe]
  - @atlaskit/editor-prosemirror@7.1.1

## 49.0.0

### Major Changes

- bf5cbd4: BREAKING CHANGE: EDITOR-616 Remove unused variations of blockquote, listItem,
  nestedExpand, and panel

## 48.0.0

### Major Changes

- 926c3fd: We fully rolled out expands with nested expands, please use expandWithNestedExpand
  instead of expand

## 47.7.1

### Patch Changes

- 742cd9b: fixed MBE maxItems for marks array issue

## 47.7.0

### Minor Changes

- 105bd25: EDF-2577: Remap orange to yellow in text background color mapping functions behind
  editor_text_highlight_orange_to_yellow experiment

## 47.6.0

### Minor Changes

- 7bf089a: ED-26493 Promote extension in listItem to full schema

## 47.5.0

### Minor Changes

- ce54136: [ED-26496]Promote extension in nestedExpand to full schema

## 47.4.0

### Minor Changes

- d016a37: ED-26949 Promote extension in panel to full schema

## 47.3.1

### Patch Changes

- f2b0b30: Fix schema capatibility

## 47.3.0

### Minor Changes

- 21d074f: Promote extension in blockquote to full schema

## 47.2.1

### Patch Changes

- 2fb3ae7: ED-26375 Add Extensions in blockQuote

## 47.2.0

### Minor Changes

- 878a5d5: Add stage 0 node to allow non-bodied macros to be nested inside of list item

## 47.1.0

### Minor Changes

- 3fbc2ea: Add stage 0 node to allow non-bodied macros to be nested inside of panel

## 47.0.0

### Major Changes

- f367c37: Remove panelWithBlockquoteStage0 node and corresponding validators

## 46.2.0

### Minor Changes

- 6bc9490: Stage 0 - non-bodied-macros-in-nested-expand

## 46.1.0

### Minor Changes

- 2eee4d8: Make attrs optional for expand, remove type from layoutSectionFull

## 46.0.0

### Major Changes

- a0f224a: Remove `expand_with_with_no_mark` and replace `expand_with_breakout_mark` with
  `expand_root_only`

  Upgrade instructions
  - Replace `expand_with_breakout_mark` with `expand_root_only`
  - Replace `expand_no_mark` with `expand`

## 45.2.0

### Minor Changes

- 0ad17eb: Remove DSL inconsistency for code block with text with new no mark text variant - no
  functionality changes.

  Added: `text_with_no_marks` variant

## 45.1.0

### Minor Changes

- aab5f4d: Validator will now correctly validate media inline nodes with the URL attribute

### Patch Changes

- 162fff6: Remove exception for uniqueId on codeBlock and allow property on validator and json
  schema.

## 45.0.0

### Major Changes

- a3ce608: Remove code block with marks and merge with standard code block definition to resolve adf
  inconsistencies.

  Major change:
  - Entry-point `@atlaskit/adf-schema/schema-validator` no longer has `codeBlock_with_marks` it has
    been replaced with `codeBlock`.

## 44.7.0

### Minor Changes

- cb04de2: bump typescript to v5

### Patch Changes

- Updated dependencies [cb04de2]
  - @atlaskit/editor-prosemirror@6.1.0

## 44.6.2

### Patch Changes

- 976a85b: Remove validator spec marks override for inlineCard

## 44.6.1

### Patch Changes

- d58545f: Alphabetically sort nodes in generated json schema & validator spec

## 44.6.0

### Minor Changes

- c8a4a74: Fix ADF Inconsistency for Block Card

## 44.5.0

### Minor Changes

- bca057f: - fix content expressions cleanup logic
  - add separate entry point for sanitizeNodes

## 44.4.0

### Minor Changes

- bd599ae: Give heading marks in pm-spec

## 44.3.0

### Minor Changes

- 7705aa3: remove layoutSection overrides for validator spec

## 44.2.1

### Patch Changes

- b9a2f17: Made hex color tolerant to nulls

## 44.2.0

### Minor Changes

- 20b1f98: [ED-25393] This change creates new variants for the table, tableRow, tableCell and
  tableHeader nodes such that we can nest tables one level deep. This change is not making any
  changes to any existing nodes.

## 44.1.0

### Minor Changes

- 2aebf23: Add optional attribute 'width' to Breakout Mark, approved in adf change 84

## 44.0.0

### Major Changes

- a794c81: Remove list item legacy

## 43.0.0

### Major Changes

- 711e93b: ED-25392 Prevent validator-spec ignored nodes from being exposed in validator output -
  the following ignored node validator specs will no longer be exported and should not be used:
  `unsupportedInline`, `unsupportedBlock`, `image`, `confluenceJiraIssue`,
  `confluenceUnsupportedInline`, `listItem_legacy`, `blockquote_legacy`,
  `blockquote_without_nested_codeblock_or_media`, `tableCellContent`,
  `expand_without_nested_expand`, `confluenceUnsupportedBlock`.

## 42.5.0

### Minor Changes

- 82af32e: Remove exception for minItems=0 from caption node, aligning JSON schema and Validator
  Spec with PM Spec

## 42.4.0

### Minor Changes

- 6114d78: add attr.text to hr, in order to match it with json schema spec
- 844e6bd: Filter out empty content groups in json and validator spec and improve min and max item
  calculation

## 42.3.1

### Patch Changes

- dfa64c8: Add override for pm.spec to ensure unsupportedBlock is correct for
  layoutSection_single_column

## 42.3.0

### Minor Changes

- 8aff3bc: [ED-25105] This change aligns the node attributes between schema and next-schema for
  these nodes: codeblock, expand and nested expand, media and media inline.

## 42.2.1

### Patch Changes

- e4e695f: Change order of layoutSection_with_single_column with layoutSection_full to fix validator
  issues in the editor

## 42.2.0

### Minor Changes

- 767b124: Added columnRuleStyle to layoutSection_with_single_column, and add
  layoutSectionAdvLayouts nodespec export

## 42.1.0

### Minor Changes

- b54cb82: remove unused legacy panel variant

## 42.0.2

### Patch Changes

- 0e37f47: Fix type definition for inline node

## 42.0.1

### Patch Changes

- 0f5e112: Support "#top" and "#" special hrefs for link mark

## 42.0.0

### Major Changes

- b46b206: Remove atomicInlineGroup

## 41.0.0

### Major Changes

- 5c60258: remove getNodeNameOverrides from adfToValidatorSpec

## 40.10.0

### Minor Changes

- 52bf2ea: [ED-23241] Set hardBreak as the Prosemirror `linebreakReplacement` which is used when
  converting between codeBlocks and other block types. Implementation of feature introduced to
  Prosemirror after [this GitHub discussion](https://github.com/ProseMirror/prosemirror/issues/1460)

## 40.9.4

### Patch Changes

- 7868b30: [ED-25037] This change sets selectable to true for the blockquote node.

## 40.9.3

### Patch Changes

- e21dbfc: Cleanup feature flag for parsing code block from div better.

## 40.9.2

### Patch Changes

- 35a84ef: [HOT-111702] Added missing marks in PM node specs due to overrides in the ADF generator

## 40.9.1

### Patch Changes

- 3fbc24f: [ED-24525] Move mediaGroup ranking after mediaSingle in blockquote's content to fix bug
  where pasting external images would be converted to a mediaGroup instead of mediaSingle.

## 40.9.0

### Minor Changes

- dcc54e6: [ED-24636] Implements BatchAttrsStep

## 40.8.2

### Patch Changes

- fde250b: Unskip parsing rules to parse content of expand and nestedExpand.

## 40.8.1

### Patch Changes

- f515514: [ED-24281] Add new node nesting scenario to pseudo block content element, so the
  validator spec gets updated

## 40.8.0

### Minor Changes

- 276b273: In validator spec when mixed content nodes + groups, groups should be flattened

## 40.7.0

### Minor Changes

- b198a5c: [ED-24170] Stage 0 - Quotes in Panels

## 40.6.0

### Minor Changes

- cc19189: [ED-24187 promoting to full schema - Nested Expands in Expands

## 40.5.0

### Minor Changes

- 401d96d: [ED-24188] Promoting to full schema - Codeblock & Media in Quotes

## 40.4.0

### Minor Changes

- c233ecd: [ED-24169] Stage 0 - Decision in Lists

## 40.3.1

### Patch Changes

- b34f0b5: [ED-24167] This is a follow up PR as we forgot to export
  blockquoteWithNestedCodeblockOrMediaStage0

## 40.3.0

### Minor Changes

- eabfb58: [ED-24167] Allow nesting codeBlock and media nodes in blockquote

## 40.2.1

### Patch Changes

- 60c7ca6: [ED-24166] Fixed type issue where it was pulling in a type based on a PMNode into the
  DocNode type, which isn't compatible with the ADFEntity type which doesn't have the PM methods

## 40.2.0

### Minor Changes

- 5e176a4: [ED-24076] Allow nesting nested expand nodes in expands

## 40.1.1

### Patch Changes

- 7da23cc: Added better AJV errors to make troubleshooting invalid documents easier

## 40.1.0

### Minor Changes

- 5288c99: update prosemirror dependencies

### Patch Changes

- Updated dependencies [5288c99]
  - @atlaskit/editor-prosemirror@5.0.0

## 40.0.3

### Patch Changes

- d425c19: Remove redundant tests

## 40.0.2

### Patch Changes

- 32c5913: Remove forwards compatability check in JSOn schema

## 40.0.1

### Patch Changes

- fe59c22: Fix table background colour on dark mode when pasting from the renderer

## 40.0.0

### Major Changes

- 763da58: [ED-23275] Removing legacy panel node with extendedPanel as a replacement.

## 39.0.3

### Patch Changes

- 3f37dcf: Sorting of validator spec is breaking for isTupleLike content

## 39.0.2

### Patch Changes

- 3d69cd2: clean up comments and remove validating pm spec unit tests as we have migrated pm spec

## 39.0.1

### Patch Changes

- 76e3778: [ED-23275] Deprecating panel node from schema. To use `extendedPanel` instead.

## 39.0.0

### Major Changes

- a284de0: Replace existing json schema with the one generated from ADF DSL

## 38.0.0

### Major Changes

- 198f8ee: migrate old PM schema with new PM schema generated from ADF DSL

## 37.2.1

### Patch Changes

- 8cd0dd0: improve codeBlock parseDOM of tag div['style'] to fix issues in certain versions of
  Android Studio
- a3502ad: Add support for stage0

## 37.2.0

### Minor Changes

- 5f92d0b: Added entry-point for validator spec from adf-schema package at `./schema-validator`

## 37.1.43

### Patch Changes

- 73eec15: Improve types in adf-schema-generator package

## 37.1.42

### Patch Changes

- 758ee06: last hacks to support tableCell_content, nestedExpand_content and atomic_inlines pseudo
  groups in validator spec

## 37.1.41

### Patch Changes

- a6b9c1d: Create script to generate validator spec and commit the generated file.

## 37.1.40

### Patch Changes

- f78fc78: enable validator spec support for layoutSection_with_single_column
- d131854: Align nested expand node with validator spec

## 37.1.39

### Patch Changes

- e2605b6: Align multi-bodied-extension node for validator spec in DSL.

## 37.1.38

### Patch Changes

- f1944e4: throws error if applying validator spec manual override that does not exist

## 37.1.37

### Patch Changes

- 407f5d1: Align table cell and table header to validator spec.
- e596783: Align confluence inline comment mark to validator spec.

## 37.1.36

### Patch Changes

- 3faf4f8: Reverse compatability for doc, blockRootOnly and block in full JSON Schema

## 37.1.35

### Patch Changes

- 9132a0c: Fix media and mediaInline nodes with the validator spec.
- 20fadb8: align codeBlock node to existing validator spec

## 37.1.34

### Patch Changes

- 526f86e: ED-23030: Overrides layoutSection_full for validator spec

## 37.1.33

### Patch Changes

- 755765e: Align doc node to existing validator spec

## 37.1.32

### Patch Changes

- 64d5ec6: Aligned extensionFrame with current validator spec implementation with exception
  override.
- 497d3c4: fix unit test description for node spec check

## 37.1.31

### Patch Changes

- 79fd420: ED-23030: overrides caption for validator spec
- 2d1185b: ED-23030: overrides validator-spec for expand node

## 37.1.30

### Patch Changes

- 90da950: ED-23030: overrides caption DSL for validator spec

## 37.1.29

### Patch Changes

- f6c953f: align extensionFrame to match ADF
- 362c287: ED-23030: adds overrides for required for table nodes

## 37.1.28

### Patch Changes

- 9f0af09: Fix inlineCard validator spec from DSL.

## 37.1.27

### Patch Changes

- 8d8dd32: Fix exception to layoutSection node for validator spec from DSL.

## 37.1.26

### Patch Changes

- 6106a46: Unskip nestedExpand, nestedExpand_content and nestedExpand_with_no_marks

## 37.1.25

### Patch Changes

- 0932746: ED-23030: support blockcard in validator spec transform

## 37.1.24

### Patch Changes

- 962ff63: add unit tests for pm schema

## 37.1.23

### Patch Changes

- e0280dc: Add backwards compatability for bodied extension, code block, expand, layout section,
  non-nestable block content

## 37.1.22

### Patch Changes

- 16c9ef7: Make extension, inlineExtension and mediaInline backwards compatible

## 37.1.21

### Patch Changes

- 988f8c6: add known and unknown to PM groups to DSL

## 37.1.20

### Patch Changes

- e57d797: Add new optional property for string attributes used in the validator ("validatorFn")
  function used for URL.

  This is used for the validator for "link" and "embedCard".

## 37.1.19

### Patch Changes

- e84155e: Remove npm package alias for @types/json-schema

## 37.1.18

### Patch Changes

- 48c369f: Add anyOf support to validator spec generator

## 37.1.17

### Patch Changes

- 590931c: fix extends use case for content

## 37.1.16

### Patch Changes

- a5f7b07: align all text nodes to validator spec

## 37.1.15

### Patch Changes

- 7a3c038: Support isTupleLike in validator spec
- 1651bd9: revert some broken changes in validating spec test, enable strict equal check, update DSL
  overrides to ensure equal to old spec, update text and media node spec without generate undefined
  in it

## 37.1.14

### Patch Changes

- 8e181e5: ED-23030: Generates marks for validator specs

## 37.1.13

### Patch Changes

- ae627f8: Fix package.json issue so that it can publish to npm

## 37.1.12

### Patch Changes

- f36bed2: Unskip heading & paragraph and handle hasEmptyMarks in JSON schema

## 37.1.11

### Patch Changes

- fdaf6c2: Add support for groups - block_content and inline_node

## 37.1.10

### Patch Changes

- 05e5d5c: ED-23030: excludes empty attributes from validator specs

## 37.1.9

### Patch Changes

- 862d96b: fix: inherited nodes sometimes wrap marks into an extra array

## 37.1.8

### Patch Changes

- fce3994: ED-23030: enables support for minlength attr

## 37.1.7

### Patch Changes

- 7cb5e06: Fix media single full content expression

## 37.1.6

### Patch Changes

- 3d4149b: Update mention, status, date and emoji nodes to match validator spec output

## 37.1.5

### Patch Changes

- 9e0d798: ED-23030: strips private properties from attributes for validator specs

## 37.1.4

### Patch Changes

- 908e8cd: improve marks support and add extends case handling in validator spec generator

## 37.1.3

### Patch Changes

- 1c0e069: ED-23030: transforms optional properties for validators

## 37.1.2

### Patch Changes

- 359dcc5: Added additionalProperties for object items in allOf as per full JSON schema

## 37.1.1

### Patch Changes

- 509c150: Removed type from data attribute to match full JSON schema

## 37.1.0

### Minor Changes

- 25e7404: feat: add DANGEROUS_MANUAL_OVERRIDE to ADF DSL

## 37.0.7

### Patch Changes

- 6af54f7: fix adf dsl to match old pm schema

## 37.0.6

### Patch Changes

- 8b1029b: Updated node DSL with information missing from fixture

## 37.0.5

### Patch Changes

- f1d39e4: update validating pm spec unit test to cover all old pm spec

## 37.0.4

### Patch Changes

- 2a8c66a: Add allOf field to JSON transformer from ADF DSL

## 37.0.3

### Patch Changes

- c248f5c: add schema-next package to export new PM specs and types generated from ADF DSL

## 37.0.2

### Patch Changes

- 9789fe6: Alphabetically sort imports in Generated PM Spec files

## 37.0.1

### Patch Changes

- ef918ca: Alphabetically sort PM Spec Code Generation

## 37.0.0

### Major Changes

- bb1cbf4: Promote optional localId attribute in heading and paragraph nodes to full schema

## 36.18.3

### Patch Changes

- 3ed35ed: refacotor build attrs when build pm spec, unskip few tests of validation for mark spec

## 36.18.2

### Patch Changes

- 4126ead: json schema validation for the next schema produced by adf-schema-generator

## 36.18.1

### Patch Changes

- 53dce02: Add autogenerated warning to the top of the autogenerated files

## 36.18.0

### Minor Changes

- fc86a6a: added function to adfNode, updated buildContent and added buildMarks

## 36.17.0

### Minor Changes

- d4cf757: Align newly generated PM spec to old PM spec, only 2 nodes are still not 100% aligned

## 36.16.0

### Minor Changes

- bd85ab9: Fix handling of anyOf in PM Spec

## 36.15.0

### Minor Changes

- e0c8b0e: Add suuport for all and no child marks in DSL

## 36.14.1

### Patch Changes

- 32308a7: add test to validate generated nodeSpec from ADF DSL

## 36.14.0

### Minor Changes

- 8df4b1b: Sync generated Pm Spec files

## 36.13.0

### Minor Changes

- eea2271: Add unsupported nodes and marks

## 36.12.3

### Patch Changes

- 9e4b045: Add additional properties field

## 36.12.2

### Patch Changes

- 94ea518: Move codemods and json-schema-generator to devdeps
- 5ba2c7d: updated buildAttrs to clean up objects, added extra test coverage

## 36.12.1

### Patch Changes

- d589477: Add required field to nodes and marks for JSON Schema transformer from ADF DSL

## 36.12.0

### Minor Changes

- b9c6fee: Update PM Spec to current

## 36.11.0

### Minor Changes

- 3685cbb: Move generated files to adf-schema package

## 36.10.13

### Patch Changes

- 98d9d14: Create anyof field under content items in JSON Schema transformer for ADF dSL

## 36.10.12

### Patch Changes

- cc7c8bf: Add content list field and $ref field to JSON Schema transformer from ADF DSL

## 36.10.11

### Patch Changes

- 0705b07: Add version field to ADF DSL and JSON transformer

## 36.10.10

### Patch Changes

- b29eee7: update ADF DSL to match old PM spec, add validation unit test to verify nodeSpec and
  markSpec generated from ADF DSL

## 36.10.9

### Patch Changes

- 7579d7a: Add minItems field to ADF JSON Schema transformer from ADF DSL

## 36.10.8

### Patch Changes

- 78e9cf4: Change types to account for parameter and data attributes

## 36.10.7

### Patch Changes

- b05b267: reverted uuid migration due to upstream issues with tesseract

## 36.10.6

### Patch Changes

- d87e824: add clean:build cmd and add in build cmd to clean dist folder first

## 36.10.5

### Patch Changes

- 1b75a44: Add items field to JSON Schema transformer from ADF DSL

## 36.10.4

### Patch Changes

- ec6b9e2: Add type field to content in JSON transformer for ADF DSL

## 36.10.3

### Patch Changes

- b94c981: Add content field to JSON ADF transformer from ADF DSL

## 36.10.2

### Patch Changes

- e78e409: Update default blockCard layout fallback value to undefined

## 36.10.1

### Patch Changes

- 1baff5c: Add node and mark attributes to JSON transformer from ADF DSL

## 36.10.0

### Minor Changes

- 4cdf270: [ED-23332] Exclude other `color` group marks from the `backgroundColor` mark

## 36.9.2

### Patch Changes

- 6e9e5d6: migrated uuid function to use uuid npm package instead of custom random logic

## 36.9.1

### Patch Changes

- c55acf7: fix circlue deps issue in link mark | minor dsl update

## 36.9.0

### Minor Changes

- c8ecca1: Generate new uuid to support copy paste in mentionNode

## 36.8.5

### Patch Changes

- 669a895: Add anyof field to json marks in DSL transformer

## 36.8.4

### Patch Changes

- 9323c96: Add mark items

## 36.8.3

### Patch Changes

- 3d6a62a: Add properties, marks, and mark array type

## 36.8.2

### Patch Changes

- f80bbc4: Process type for json schema generator from ADF DSL

## 36.8.1

### Patch Changes

- 1b3718c: Add basic JSON Schema Transformer from ADF DSL

## 36.8.0

### Minor Changes

- e71ebfd: ED-23361 Introduce support for annotations on emojis, dates, statuses and mentions.

## 36.7.0

### Minor Changes

- b6349e2: ED-21680:Promoted displayMode table node attr to full schema

## 36.6.0

### Minor Changes

- 14fa4c0: Bootstrap ADF DSL nodes and marks

### Patch Changes

- d21d4ab: fix: alignment and indentation cycle results in one of them being undefined

## 36.5.0

### Minor Changes

- 7d33189: Bootstrap ADF DSL nodes and marks

## 36.4.0

### Minor Changes

- fad062c: Bootstrap ADF DSL -> PM transformation

## 36.3.0

### Minor Changes

- 6ee2066: Add optional localId attribute to paragraph nodes in stage-0

## 36.2.0

### Minor Changes

- 7f5f636: Add optional localId attribute to heading nodes in stage-0

## 36.1.0

### Minor Changes

- 175bfe7: Reverted add optional localId attribute to paragraph and heading nodes

## 36.0.0

### Major Changes

- e83fa9b: [ED-22282] [Breaking change] A transition ProseMirror node `extendedNestedExpand` was
  introduced for the changes in the node nesting project. Now that it's fully rolled out, the old
  `nestedExpand` isn't used anymore and we can clean them up. `nestedExpand` now contains the
  functionality of what was the transitional `extendedNestedExpand`.

  Any usage of `extendedNestedExpand` should be updated to `nestedExpand` now.

## 35.14.0

### Minor Changes

- e5e99e7: Separately exported the node spec for paragraph with localId so its use can be feature
  flagged

## 35.13.0

### Minor Changes

- cac3a5b: Add optional localId attribute to paragraph and heading nodes

## 35.12.2

### Patch Changes

- 05ba2ed: [ED-23102] Add background color mark to default schema and move it up in mark order to
  the inline marks

## 35.12.1

### Patch Changes

- aea8879: NO-ISSUE Fixed a serialisation bug resulting in invalid ADF JSON in mention nodes

## 35.12.0

### Minor Changes

- 24014bb: [ED-23064] Added the background color mark

## 35.11.0

### Minor Changes

- b7684a5: [COMMENTS-1380] Moving the localId on mentions to full schema because it was accidentally
  promoted to full schema already due to a erroneously placed stage 0 tag

## 35.10.0

### Minor Changes

- b9f54d8: add localId attribute to mention node

## 35.9.2

### Patch Changes

- e44d8b0: Exports TableDisplayType

## 35.9.1

### Patch Changes

- ba72fd3: ED-22925: Added alignment to table layout attrs

## 35.9.0

### Minor Changes

- 7c4f67c: Adds displayMode attribute on tableNode

## 35.8.0

### Minor Changes

- 39eba61: [ED-22607] - Remove `maxFrames` attribute from `multiBodiedExtension`

## 35.7.0

### Minor Changes

- 1502335: Added annotation mark to media and mediaInline

## 35.6.0

### Minor Changes

- cbc7286: ED-22379 Add annotation mark to inline card

## 35.5.2

### Patch Changes

- 63299c9: ED-22219: Added back marks to extensionFrame node and ADF

## 35.5.1

### Patch Changes

- 621b110: ED-21910: Fixed support content order for extensionFrame

## 35.5.0

### Minor Changes

- 49b81f8: Adding node-nesting rules for list, codeblock, actions, divider, decision, panel, quote
  inside nestedExpand

## 35.4.0

### Minor Changes

- d915d07: EDF-26 Cleaned up platform.editor.use-lch-for-color-inversion_1qv8ol flag and removed
  platform feature flags as a package dependency as it is no longer used. Text and table cell
  background colors will now use the LCH inversion method in dark mode by default.

## 35.3.0

### Minor Changes

- 529022b: ED-21611: Adding node-nesting rules for task inside list, and media, codeblock, rule,
  action and decision inside panel.

## 35.2.0

### Minor Changes

- b241b07: Add inline support for border mark

## 35.1.1

### Patch Changes

- 2023f5a: ED-20070: Added multiBodiedExtension and extensionFrame as defaultSchema customNodeSpecs
  for stage-0

## 35.1.0

### Minor Changes

- 4eff3f6: ED-20960-list-in-quotes: Create new node blockquoteWithList which allows node nesting for
  list inside blockquote

## 35.0.0

### Major Changes

- 6af8338: [ADF change] Added image type to mediaInline and also support for border mark

## 34.0.1

### Patch Changes

- 726054a: ED-21266: updated extensionFrame to be non-selectable to address selection issue

## 34.0.0

### Major Changes

- 8132ac3: ED-20699 Add LCH color inversion method behind feature flag
  platform.editor.use-lch-for-color-inversion_1qv8ol for text and table cell background colors. Also
  adds @atlaskit/platform-feature-flags as a devDep.

## 33.2.3

### Patch Changes

- 8ecd624: ED-20946 Added a small script to copy the contents of adf-schema to @atlaskit/adf-schema
  node_modules in AFE to allow local testing of package changes.

## 33.2.2

### Patch Changes

- 04d447f: ED-20068: Added missing MultiBodiedExtensionDefinition and ExtensionFrameDefinition

## 33.2.1

### Patch Changes

- e545688: ED-20068: Updated ADF schema and PM schema for MBE

## 33.2.0

### Minor Changes

- e958e89: ED-20043: Adding Multi-bodied Extension to enable Nested Bodied Macros (NBM)

## 33.1.3

### Patch Changes

- 6ac028f: [ux] ED-20700 Clean up color inversion feature flag

## 33.1.2

### Patch Changes

- b175bba: Minor tsconfig inclusion change

## 33.1.1

### Patch Changes

- 91855c6: Add feature flags package as dev dependency to resolve pipleines issue in Atlassian
  frontend.

## 33.1.0

### Minor Changes

- 2b9e201: ED-20037 feat(adf-schema): invert custom text colors in dark mode

### Patch Changes

- 94ff748: ED-20037 feat(adf-schema): invert custom tableCell backgrounds in dark mode

## 33.0.0

### Major Changes

- 4d8c6fb: Remove version.json from root

## 32.1.0

### Minor Changes

- 47644bb: Promote blockCard datasources to full schema

## 32.0.0

### Major Changes

- 9fb5cec: Remove fs use

## 31.1.2

### Patch Changes

- 8b3c47b: Remove api report
- Updated dependencies [8b3c47b]
  - @atlaskit/editor-prosemirror@2.0.1

## 31.1.1

### Patch Changes

- b5e7cbb: Remove fs from index

## 31.1.0

### Minor Changes

- 1edde90: Remove banned types

## 31.0.0

### Major Changes

- 1731496: Remove unused vars

### Patch Changes

- Updated dependencies [1731496]
  - @atlaskit/editor-prosemirror@2.0.0

## 30.2.3

### Patch Changes

- c2bdc1c: Remove uneeded escape characters

## 30.2.2

### Patch Changes

- 655b591: Set non reassigned variables to constants

## 30.2.1

### Patch Changes

- fb8dcc0: Loosen eslint rules and change comments
- Updated dependencies [fb8dcc0]
  - @atlaskit/editor-prosemirror@1.1.7

## 30.2.0

### Minor Changes

- 9a8af3a: Promote widthType to full schema

## 30.1.0

### Minor Changes

- 36f9a84: Remove index.ts from npmignore

## 30.0.4

### Patch Changes

- e90ca6c: ADFEXP-524: filter out index file in nodes and marks

## 30.0.3

### Patch Changes

- 598e6dc: ADFEXP-524: move nodes & marks in to index folder inside src

## 30.0.2

### Patch Changes

- 97ae642: Remove ignored root index file

## 30.0.1

### Patch Changes

- e30eb67: Remove changeset dev dep

## 30.0.0

### Major Changes

- a20ef7f: Remove editor-tables

## 29.2.0

### Minor Changes

- e5770f4: Promote table width attribute to full schema

## 29.1.2

### Patch Changes

- 8f56e32: ADFEXP-524: move code into root index file

## 29.1.1

### Patch Changes

- f057413: ADFEXP-524: export nodes and marks file names

## 29.1.0

### Minor Changes

- 1581d5b: Remove editor palette dep

## 29.0.1

### Patch Changes

- d08fff3: add atlaskit/tokens as direct dependencies

## 29.0.0

### Major Changes

- abac347: update editor palette version

## 28.3.1

### Patch Changes

- 10b1a4c: ADFEXP-542: add transpiling to @atlassian/adf-schema-json

## 28.3.0

### Minor Changes

- e64da57: Make json shcmea generator version caroted

## 28.2.0

### Minor Changes

- bab2fe8: Export DatasourceAttributeProperties from root index

## 28.1.13

### Patch Changes

- 7999d27: Add src to npmignore

## 28.1.12

### Patch Changes

- d20f097: Return index to npmignore

## 28.1.11

### Patch Changes

- 54cb9cc: ADFEXP-542: rename @atlaskit/adf-schema-json to @atlassian/adf-schema-json

## 28.1.10

### Patch Changes

- 1f0ccea: move JSON schema files from adf-schema to a new package adf-schema-json

## 28.1.9

### Patch Changes

- ca09bf1: ADFEXP-516: fix add-column-merge-columns unit test
- dbbe197: ADFEXP-516: fix add-column-merge-rows unit test
- f41bdd2: ADFEXP-516: add-column tests are now passing
- Updated dependencies [e2d45b8]
  - @atlaskit/editor-prosemirror@1.1.6

## 28.1.8

### Patch Changes

- 29390f0: ADFEXP-516: fix import in set-selection test helper and fix override document unit test

## 28.1.7

### Patch Changes

- 955a95e: ADFEXP-540: merge config files in monorepo top level, and unify test structure

## 28.1.6

### Patch Changes

- e25027e: Remove AF cruft from package.json
- e25027e: Remove AF package.json information

## 28.1.5

### Patch Changes

- aa524e9: Ensure we use the latest version of editor-prosemirror locally"

## 28.1.4

### Patch Changes

- 945d5c5: Fix @atlaskit references

## 28.1.3

### Patch Changes

- cebe202: Release from new repository

## 28.1.2

### Patch Changes

- [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json

## 28.1.1

### Patch Changes

- Updated dependencies

## 28.1.0

### Minor Changes

- [`106c54b0ce4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/106c54b0ce4) - [ux]
  ED-15896 - Added support for unsupported nodes in listItem

## 28.0.0

### Major Changes

- [`9064e2d0f28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9064e2d0f28) - [ux]
  HOT-104783 Reverting https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37639

## 27.0.0

### Major Changes

- [`30d82d3462c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30d82d3462c) -
  [ED-19175] add missing support for the unsupportedBlock in table related nodes

## 26.4.1

### Patch Changes

- [`4e6f1bf8511`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e6f1bf8511) -
  [ED-19233] Import prosemirror libraries from internal facade package

## 26.4.0

### Minor Changes

- [`1bab0faa2c8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1bab0faa2c8) - Add a
  new custom ProseMirror step OverrideDocumentStep for easy document replacing.

## 26.3.0

### Minor Changes

- [`91410d6064c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/91410d6064c) - [ux]
  NOISSUE Fix linkify of file links on space

## 26.2.2

### Patch Changes

- [`56e6ce31c75`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56e6ce31c75) - ED-19040
  improve handle paste media

## 26.2.1

### Patch Changes

- [`036351ec788`](https://bitbucket.org/atlassian/atlassian-frontend/commits/036351ec788) -
  [ED-18768] Make attrs reduce a readonly object

## 26.2.0

### Minor Changes

- [`a5877196a3c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5877196a3c) - [ux]
  EDM-6499 Fix handling of tel and other custom URI links

## 26.1.0

### Minor Changes

- [`65fe45e0cc0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/65fe45e0cc0) - Promoted
  border mark to full schema and add border support for email renderer

## 26.0.1

### Patch Changes

- [`5f5ba16de66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f5ba16de66) -
  [ED-13910] Fix prosemirror types

## 26.0.0

### Major Changes

- [`68ef7e6146c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/68ef7e6146c) - [ADF
  change] added widthType attribute to mediaSingle node, to support fixed width media node.

## 25.10.1

### Patch Changes

- [`54c95071cce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54c95071cce) - Move
  around order of BlockCardDefinition attribute variations.

## 25.10.0

### Minor Changes

- [`d85c737c1e9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d85c737c1e9) - Memoize
  getSchemaBasedOnStage for improved performance on repeated invocations

## 25.9.2

### Patch Changes

- Updated dependencies

## 25.9.1

### Patch Changes

- [`bf7e8e4968b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf7e8e4968b) - ED-15895
  add unsupportedinline support to caption

## 25.9.0

### Minor Changes

- [`6de13a329d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6de13a329d4) - Move
  `width` and `layout` out from `datasource` into `attr` root (context blockCard node)

## 25.8.3

### Patch Changes

- [`f22911fb9be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f22911fb9be) -
  ENGHEALTH-2667: Adjust table cell color logic to enable static analysis of token usages and follow
  eslint rules
- Updated dependencies

## 25.8.2

### Patch Changes

- Updated dependencies

## 25.8.1

### Patch Changes

- [`bbb877d8813`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bbb877d8813) -
  [ED-18157] Remove circular dependencies in adf-schema package by extracting the backwards
  compatibility tests to a separate package

## 25.8.0

### Minor Changes

- [`f3d2c08d61b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3d2c08d61b) - Adds new
  datasource attribute to existing blockCard node

## 25.7.0

### Minor Changes

- [`94561f309f3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/94561f309f3) - New
  stage-0 change: custom "width" attribute on Tables nodes

## 25.6.4

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8
- Updated dependencies

## 25.6.3

### Patch Changes

- [`a142ba1aa28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a142ba1aa28) -
  [ED17172] Bump prosemirror-model to 1.16.0 and prosemirror-view to 1.23.7 and removed work-arounds
  for fixed issues

## 25.6.2

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`
- Updated dependencies

## 25.6.1

### Patch Changes

- [`0233170f43a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0233170f43a) - ED-17810
  Handled malformed RGB table cell background color.

## 25.6.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 25.5.1

### Patch Changes

- [`0ffb55018c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ffb55018c9) - Revert
  "[ED-17172] Bumped prosemirror-view from 1.23.2 to 1.23.7 and removed work-around for fixed
  issues"

## 25.5.0

### Minor Changes

- [`0237059f136`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0237059f136) - Adds
  `LinkMetaStep` prosemirror step to be used to annotate a transaction with metadata about how
  (action, input method etc) for how a transaction has been performed.

### Patch Changes

- [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils
- Updated dependencies

## 25.4.0

### Minor Changes

- [`bf04c417bfd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf04c417bfd) - Add
  "border" mark to stage0 ADF schema
- [`af9a85063e5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/af9a85063e5) - add
  image border toolbar

### Patch Changes

- Updated dependencies

## 25.3.2

### Patch Changes

- [`2367ba14aa0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2367ba14aa0) - [ux]
  ED-16758 Added support for theme tokens in table cell background color.
- [`6b52583b688`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b52583b688) - ED-15974
  Currently nodes are validated against single spec. When a node has multiple specs, like
  mediaSingle, the first spec is used to validate the node. Therefore, the validation fails with an
  error `INVALID_CONTENT_LENGTH` when the correct spec is not selected for validation.

  This fix is to re-arrange the specs so that the less restrictive spec is at the top.

- [`e771b41970b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e771b41970b) - Updating
  test cases for adf-schema json-compatibility-tests
- Updated dependencies

## 25.3.1

### Patch Changes

- [`f5568785246`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5568785246) - Support
  common URL protocols:
  - gopher
  - integrity
  - file
  - smb
  - dynamicsnav

## 25.3.0

### Minor Changes

- [`7f755f463e0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f755f463e0) -
  EDM-4553: allowing root relative links to be copied and pasted as a link by appending the parent
  root to the root relative link when it is copy and pasted.

## 25.2.3

### Patch Changes

- [`85f02a75990`](https://bitbucket.org/atlassian/atlassian-frontend/commits/85f02a75990) -
  [hot-102658] Dummy patch added to stabalise package build failures caused because of bad remote
  cache

## 25.2.2

### Patch Changes

- [`8c04b73312e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c04b73312e) - ED-16758
  Added data-cell-background attribute to store table cell background color information.

## 25.2.1

### Patch Changes

- [`f770f0118a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f770f0118a4) - This
  package is now declared as a singleton within its package.json file. Consumers should provide
  tooling to assist in deduplication and enforcement of the singleton pattern.

## 25.2.0

### Minor Changes

- [`391a8ec684e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/391a8ec684e) -
  [ESS-3165] Move fragment mark and mediaInline node into the default schema

## 25.1.1

### Patch Changes

- [`4f6a895f1d5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f6a895f1d5) - Set
  selectable property for selectable nodes
- [`5ac1c18bd04`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ac1c18bd04) - [ux] Fix
  selection blocking issue where user cannot left/right arrow key past a mediaSingle
- Updated dependencies

## 25.1.0

### Minor Changes

- [`055a333dad9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/055a333dad9) - [ux]
  Remove `moreTextColors` feature flag and deprecate `allowMoreTextColors` field of `allowTextColor`
  editor prop and `colorPaletteExtended` mark.

  Showing more colors in the color selection palette is now a default behaviour.

  ## **DEPRECATION WARNING:**

  There are 2 deprecations in this change:

  ### 1. `allowMoreTextColors` field of `allowTextColor` editor prop.

  `allowMoreTextColors` field of `allowTextColor` editor prop. **is now deprecated and will be
  removed in the next stable release of `@atlaskit/editor-core` package**. Please take steps to
  remove that field from your code. E.g.:

  ```tsx
  <Editor
   ...
   allowTextColor ={
    allowMoreTextColors: true // <-- Deprecated
    defaultColour: {color: 'red', label: 'red'}
   }
  />
  ```

  Remove all instances of `allowMoreTextColors` field from `allowTextColor` `Editor` prop. I.e.:

  ```tsx
  <Editor
   ...
   allowTextColor ={
    defaultColour: {color: 'red', label: 'red'}
   }
  />
  ```

  If the resulting `allowTextColor` prop is an empty object, set `allowTextColor` property value to
  `true`. E.g.:

  ```tsx
  <Editor
   appearance="full-page"
   ...
   allowTextColor ={
    allowMoreTextColors: true // <-- Invalid
   }
  />
  ```

  should become

  ```tsx
  <Editor
   appearance="full-page"
   ...
   allowTextColor={true}
  />
  ```

  ### 2. `colorPaletteExtended` mark of the ADF schema

  `colorPaletteExtended` mark of the ADF schema **is now deprecated and will be removed in the next
  stable release**. The extended palette is now rolled into the main one. use `colorPalette`
  instead.

## 25.0.0

### Major Changes

- [`5d317ed8aa3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d317ed8aa3) - [ux]
  ED-15882: Implement custom starting numbers for orderedList nodes in adf-schema, editor, renderer,
  transformers behind restartNumberedLists feature flag. Users will be able to set a custom starting
  number when typing to create a numbered list in the Editor and this will be persisted across
  Renderer and other format transformations.

  Note: restartNumberedLists will be off by default. To enable it, consumers will need to set
  <Editor featureFlags={{ restartNumberedLists: true }}> or <Renderer
  featureFlags={{ restartNumberedLists: true }}>

### Minor Changes

- [`92613b1f023`](https://bitbucket.org/atlassian/atlassian-frontend/commits/92613b1f023) - ED-15018
  and ED-13913 - Remove all circular dependencies and ignored warnings in editor

### Patch Changes

- [`aa3c130c43a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa3c130c43a) - Changes
  the annotation mark to inclusive in order to fix the annotation being deleted when doing
  composition
- [`7590e54ccc2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7590e54ccc2) - ED-15676
  deprecated product-specific schema exports from @atlaskit/adf-schema (`schema-bitbucket`,
  `schema-confluence` and `schema-jira`). Use `@atlaskit/adf-schema/schema-default` instead.

  From `@atlaskit/adf-schema/schema-bitbucket`
  - `default (bitbucketSchema)`

  From `@atlaskit/adf-schema/schema-confluence`
  - `default (confluenceSchema)`
  - `confluenceSchemaWithMediaSingle`

  From `@atlaskit/adf-schema/schema-jira`
  - `default (jiraSchema)`
  - `JIRASchemaConfig`
  - `isSchemaWithLists`
  - `isSchemaWithMentions`
  - `isSchemaWithEmojis`
  - `isSchemaWithLinks`
  - `isSchemaWithAdvancedTextFormattingMarks`
  - `isSchemaWithSubSupMark`
  - `isSchemaWithCodeBlock`
  - `isSchemaWithBlockQuotes`
  - `isSchemaWithMedia`
  - `isSchemaWithTextColor`
  - `isSchemaWithTables`

- [`ec05886ac07`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec05886ac07) - [ux]
  ED-15871 Fixed issue with pasting a table from renderer does not respect theme mode
- [`3a35da6c331`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a35da6c331) - DTR-825
  ED-9775: added jamfselfservice:// to whitelistedURLPatterns
- [`1267ffe2c42`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1267ffe2c42) - Add
  media traceId into copy/paste operations
- [`b2fa6d3e611`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2fa6d3e611) -
  [ED-16106] Fix margin top when paragraph has alignment marks

## 24.0.3

### Patch Changes

- [`c2510fa261f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2510fa261f) - [ux]
  ED-15961 [ux] Updates the presentation of text color to use dark and light mode colors when those
  modes are enabled
- Updated dependencies

## 24.0.2

### Patch Changes

- [`b86981a0cf0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b86981a0cf0) - [ux]
  ED-15426 fix broken copy paste of block card. Add content to schema toDOM.
- Updated dependencies

## 24.0.1

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 24.0.0

### Major Changes

- [`bd524db3926`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bd524db3926) - ED-15380
  Update fragment prosemirror-schema to match ADF schema

### Minor Changes

- [`1f99f6b79d3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f99f6b79d3) - Support
  media inline for jira transformer and minor schema changes

## 23.3.1

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 23.3.0

### Minor Changes

- [`fecd5f5c96c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fecd5f5c96c) - ED-15067
  Added paragraph_with_indentation to block content to allow indented paragraphs inside of layout
  columns. Prior to this change, it was possible to add indentation but it resulted in an
  unsupported mark.

### Patch Changes

- [`721bc4d7794`](https://bitbucket.org/atlassian/atlassian-frontend/commits/721bc4d7794) - ED-14377
  To remove the imports of version.json which is deprecated

## 23.2.1

### Patch Changes

- [`28ceecfd24d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/28ceecfd24d) - empty
  changeset

## 23.2.0

### Minor Changes

- [`4d8c675bd2a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d8c675bd2a) - EDM-3779
  Hotfix: Extend Media Inline ADF Schema to have type attribute

## 23.1.0

### Minor Changes

- [`8949731bc6a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8949731bc6a) -
  ED-14608: Migrate adf-utils imports in atlassian-frontend to new child entry points to improve
  treeshaking

### Patch Changes

- [`f0d6141f46c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f0d6141f46c) -
  ED-14114: added tests to ensure consistency between ADF/ProseMirror schemas for default Mark
  attributes
- Updated dependencies

## 23.0.2

### Patch Changes

- [`702b032500c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/702b032500c) - [ux]
  Corrected ordering of the toolbar text colour picker's drop down menu, updated its rows to be from
  darkest to lightest.

## 23.0.1

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 23.0.0

### Major Changes

- [`b29ce16dad8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b29ce16dad8) -
  [ED-14606] Move bitbucket schema, confluence schema, jira schema, and default schema from
  @atlaskit/adf-schema to their own entry points. These new entry points are as follows

  @atlaskit/adf-schema/schema-bitbucket for:
  - bitbucketSchema

  @atlaskit/adf-schema/schema-confluence for:
  - confluenceSchema
  - confluenceSchemaWithMediaSingle

  @atlaskit/adf-schema/schema-jira for:
  - default as createJIRASchema
  - isSchemaWithLists
  - isSchemaWithMentions
  - isSchemaWithEmojis
  - isSchemaWithLinks
  - isSchemaWithAdvancedTextFormattingMarks
  - isSchemaWithCodeBlock
  - isSchemaWithBlockQuotes
  - isSchemaWithMedia
  - isSchemaWithSubSupMark
  - isSchemaWithTextColor
  - isSchemaWithTables

  @atlaskit/adf-schema/schema-default for:
  - defaultSchema
  - getSchemaBasedOnStage
  - defaultSchemaConfig

  This change also includes codemods in @atlaskit/adf-schema to update these entry points. It also
  introduces a new util function "changeImportEntryPoint" to @atlaskit/codemod-utils to handle this
  scenario.

### Patch Changes

- [`d079ab083af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d079ab083af) - Don't
  make mediaInline trigger if pasted dom node is an img tag
- [`0663a4954aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0663a4954aa) -
  [ED-14690] Add safe check for text node on SetAttrs custom step
- Updated dependencies

## 22.1.0

### Minor Changes

- [`fd5028f6751`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5028f6751) -
  EDM-2873: Promote MediaInline to full schema

## 22.0.2

### Patch Changes

- [`03930b9f4c7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/03930b9f4c7) -
  ED-14253: fixed infinite transaction loop after uploading a file to the editor.
  - updated ADF for MediaBaseAttributes.\_\_contextId to allow for null value
  - fixed Editor example page 2-comment-jira-bento

## 22.0.1

### Patch Changes

- [`c7a3ccf95cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c7a3ccf95cd) - Patching
  versions to no longer reference localid from adf or smart-cards

## 22.0.0

### Major Changes

- [`439cf07029a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/439cf07029a) - ED-13881
  Move @atlaskit/adf-schema test helpers to @atlaskit/editor-test-helpers

  A new entry point for @atlaskit/editor-test-helpers/adf-schema has been introduced. All test
  helpers that previously lived under @atlaskit/adf-schema have been moved there instead.

  Imports inside @atlaskit/adf-schema that previously relied on relative paths, or imports from
  other packages that referred to @atlaskit/adf-schema/test-helpers, should be updated to reference
  @atlaskit/editor-test-helpers/adf-schema instead.

  Old usages:

  ```
  import { schema } from '../relative/path/to/test-helpers';
  import { schema } from '@atlaskit/adf-schema/test-helpers';
  ```

  New usage:

  ```
  import { schema } from '@atlaskit/editor-test-helpers/adf-schema';
  ```

- [`a86ac5fa763`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a86ac5fa763) - ED-13881
  Migrate @atlaskit/adf-schema to declarative entry points

  We are now explicitly declaring entry points as public API. Since some consumers may have
  previously relied on file-based entry points for the generated JSON schema outputs, this is
  considered a breaking change.

  Old usage:

  ```
  import * as fullSchema from '@atlaskit/adf-schema/json-schema/v1/full.json';
  import * as stageZeroSchema from '@atlaskit/adf-schema/json-schema/v1/stage-0.json';
  ```

  New usage:

  ```
  import { fullSchema } from '@atlaskit/adf-schema/json-schema';
  import { stageZeroSchema } from '@atlaskit/adf-schema/json-schema';
  ```

- [`304351e4b1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/304351e4b1e) -
  CETI-241 - Added additional panel ADF attributes (panelIconId, panelIconText) to uniquely identify
  custom panel emojis. The change has been categorised as major since it is a change to the
  full-schema ADF. However, the custom panel feature is behind a feature flag, has not yet been
  released to production, and is only currently planned for release to Confluence. See ADF change
  #61 for further details.
- [`3b49ff824ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b49ff824ec) - ED-14043
  update prosemirror schema to only allow link mark on children of paragraph and mediaSingle

### Minor Changes

- [`e9aea0f4191`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9aea0f4191) - CETI-243
  Handling Duplicate Emoji Issue When Copying From Renderer

### Patch Changes

- [`7f8be1a6a30`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f8be1a6a30) - clean
  stage0 artefacts from dataConsumer mark
- [`783bda0d683`](https://bitbucket.org/atlassian/atlassian-frontend/commits/783bda0d683) - Extra
  information added to analytics for toolbar change view options

## 21.0.0

### Major Changes

- [`5af69bfe9be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5af69bfe9be) -
  CETI-241 - Added additional panel ADF attributes (panelIconId, panelIconText) to uniquely identify
  custom panel emojis. The change has been categorised as major since it is a change to the
  full-schema ADF. However, the custom panel feature is behind a feature flag, has not yet been
  released to production, and is only currently planned for release to Confluence. See ADF change
  #61 for further details.

### Minor Changes

- [`f110cbb7218`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f110cbb7218) - CETI-243
  Handling Duplicate Emoji Issue When Copying From Renderer
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - - Allow
  `table` nodes to have `fragment` marks
  - Promote `fragment` mark to "full" ADF schema

## 20.1.3

### Patch Changes

- [`b4d09742c59`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4d09742c59) -
  [ED-14236] Add dataConsumer mark to defaultSchema on adf-schema

## 20.1.2

### Patch Changes

- [`bfc3a31f7d0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bfc3a31f7d0) - ED-14130
  fix copy paste block cards

## 20.1.1

### Patch Changes

- [`41265fc80a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41265fc80a4) - MEX-1245
  Ensure nodes with block marks can be parsed during parseDOM/toDOM (e.g. linked media)

## 20.1.0

### Minor Changes

- [`d6c140182ce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6c140182ce) -
  [ED-14095] Allow links along textColor marks to match the current ADF Schema
- [`b9cd2373064`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9cd2373064) -
  [ED-14106] Reset custom color when the node is inside a link

## 20.0.1

### Patch Changes

- [`977f778e630`](https://bitbucket.org/atlassian/atlassian-frontend/commits/977f778e630) - Add
  action elements to paste allowlist

## 20.0.0

### Major Changes

- [`3a2a5e14fdc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a2a5e14fdc) - As we
  are moving to full schema, merged the customPanel nodeSpec with panel nodeSpec
- [`8f0577e0eb1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f0577e0eb1) - [ux]
  Promoted captions to full schema and better support of wikimarkup, email and slack renderer

### Minor Changes

- [`65a541166fe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/65a541166fe) - ED-13766
  fix pm node spec for media single with caption
- [`83154234335`](https://bitbucket.org/atlassian/atlassian-frontend/commits/83154234335) - ED-13522
  Add safe URL check to ADF validator (smart cards now show as unsupported content if the check
  fails)
- [`8bbb96540ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8bbb96540ea) - Add
  "fragment" mark to stage0 ADF schema

### Patch Changes

- [`c6feed82071`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6feed82071) -
  ED-11632: Bump prosemirror packages;
  - prosmirror-commands 1.1.4 -> 1.1.11,
  - prosemirror-model 1.11.0 -> 1.14.3,
  - prosemirror-state 1.3.3 -> 1.3.4,
  - prosemirror-transform 1.2.8 -> 1.3.2,
  - prosemirror-view 1.15.4 + 1.18.8 -> 1.20.2.

- [`297d113d54b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/297d113d54b) - Unskip
  backwrd compat test and fix mistakes
- Updated dependencies

## 19.3.1

### Patch Changes

- [`f4ce830a2f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f4ce830a2f2) -
  [HOT-97158] Fix paste link applying marks on block nodes

## 19.3.0

### Minor Changes

- [`93da0afefce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93da0afefce) - CETI-78
  Change panel nodeSpec to handle paste when feature flag is off
- [`971845eac0d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/971845eac0d) - CETI-96
  Added new rule to emoji to solve the duplicate icon issue when we copy from renderer
- [`e856b56fd31`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e856b56fd31) - ED-13669
  reuse same links normalization method in plugin and adf schema

## 19.2.3

### Patch Changes

- [`a80f50a843c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a80f50a843c) -
  [HOT-97158] Fix paste link heading issue

## 19.2.2

### Patch Changes

- [`b85e7ce12cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b85e7ce12cd) - Internal
  upgrade of memoize-one to 6.0.0

## 19.2.1

### Patch Changes

- [`a55dbcb3ecd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a55dbcb3ecd) -
  [ED-13882] Fix layout section ProseMirror Schema content

## 19.2.0

### Minor Changes

- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - CETI-72
  Web: Copy from renderer loses custom panel attributes
- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - Add
  single column support for layouts
- [`9fbaa50c904`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fbaa50c904) - ED-13133
  fixed broken table with sticky headers after undo merge cells with tableCellOptimisation on
- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - [ux] add
  single layout support for layout
- [`6840e64d105`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6840e64d105) -
  CETI-124: Revert panel content wrapper from span to div

## 19.1.0

### Minor Changes

- [`ad67f6684f1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad67f6684f1) - Add
  MediaInline to ADF Stage0 schema
- [`71bb1bb3cd0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/71bb1bb3cd0) -
  [ED-12933] Add new custom step for TypeAhead local flow control

## 19.0.0

### Major Changes

- [`96c6146eef1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/96c6146eef1) -
  ED-13187: localId optional & empty values filtered
- [`2aef13b22d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2aef13b22d8) -
  ED-12604: add localId for tables and dataConsumer mark for extensions in full schema

### Patch Changes

- [`aa6f29f8c3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa6f29f8c3d) - Setting
  up empty string value for alt attribute (images) by default

## 18.2.0

### Minor Changes

- [`489e4d18bc1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/489e4d18bc1) - ED-12891
  Enable indentation as a valid mark on headings in layouts to align PM schema with ADF schema

### Patch Changes

- [`18a96c228f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18a96c228f8) -
  EDM-2024: fix MediaGroup Prosemirror Schema incompatibility

## 18.1.1

### Patch Changes

- [`d9e3deda557`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9e3deda557) - ED-12545
  We are adding compatibility test for ADF Schema with ProseMirror Schema

## 18.1.0

### Minor Changes

- [`9fef23ee77c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fef23ee77c) - ED-12477
  Add unsupported node capability to Media Group

## 18.0.0

### Major Changes

- [`7e6fe5abae9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e6fe5abae9) - revert
  heading with indentation in table cell content

## 17.0.0

### Major Changes

- [`ddecaf6f306`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ddecaf6f306) - ED-12436
  remove 'allowLocalIdGeneration' from Editor as extension localId is added to full schema
- [`084abc13201`](https://bitbucket.org/atlassian/atlassian-frontend/commits/084abc13201) - ED-12265
  Add unsupport content support to media single ED-12265 Remove `caption` from default schema -
  Renderer
- [`9d3472d1a17`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d3472d1a17) -
  ED-12889: Remove heading with indentation from table cell content

### Minor Changes

- [`ee1c658ca80`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ee1c658ca80) - ED-12270
  Add unsupported content support for decision lists and task lists
- [`5fba22a5a21`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5fba22a5a21) - [NO
  ISSUE] Move Table Sort Custom Step to the ADF package

## 16.0.0

### Major Changes

- [`f973bb5dde8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f973bb5dde8) - [ux]
  ED-12782 Remove codeblock languages from adf-schema

  BREAKING CHANGE

  `@atlaskit/adf-schema` is not longer exporting: `DEFAULT_LANGUAGES`, `createLanguageList`,
  `filterSupportedLanguages`, `findMatchedLanguage`, `getLanguageIdentifier` and `Language`. This
  are now used internally in `@atlaskit/editor-core`

### Minor Changes

- [`1fbe305bf7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1fbe305bf7d) - ED-12273
  Unsupported content support for Layout

## 15.3.0

### Minor Changes

- [`8c84c29006b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c84c29006b) - Improve
  data-consumer mark being nested, aAdd basic doc tests for data consumer
- [`621f12ec284`](https://bitbucket.org/atlassian/atlassian-frontend/commits/621f12ec284) - Update
  adf util specs to support unsupported content changes

### Patch Changes

- [`794b81df22c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/794b81df22c) - Removes
  surplus style whitespace rule on code mark.

## 15.2.0

### Minor Changes

- [`653093877f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/653093877f8) - Update
  data-consumer behaviour for json transforming
- [`357edf7b4a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/357edf7b4a1) - ED-12266
  Extend code block to support UnsupportedInline content.

## 15.1.1

### Patch Changes

- Updated dependencies

## 15.1.0

### Minor Changes

- [`330c1fce7f9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/330c1fce7f9) - ED-12264
  Add unsupported content capability to panel and blockquote

### Patch Changes

- [`5089bd2544d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5089bd2544d) -
  ED-11919: generate localId for tables
- [`58b170725be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58b170725be) - Renamed
  @atlaskit/editor-test-helpers/schema-builder to @atlaskit/editor-test-helpers/doc-builder

## 15.0.0

### Major Changes

- [`db9dec112b1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db9dec112b1) -
  ED-10613: clean up text colour experiment

### Minor Changes

- [`6d748ea5140`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6d748ea5140) - New
  stage-0 data consumer mark in ADF schema

### Patch Changes

- [`e6bd5669a53`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6bd5669a53) - ED-10888
  Deduplicate AJV initialization from our codebase
- [`d2e70ebaaa9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2e70ebaaa9) -
  NO-ISSUE: updated editor tests to use 'doc: DocBuilder' instead of 'doc: any'
- [`fe1c96a3d28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe1c96a3d28) - added
  DocBuilder type to @atlaskit/editor-test-helpers, replaced duplicate definitions and DocumentType

## 14.1.0

### Minor Changes

- [`e6033cf5a7b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6033cf5a7b) -
  HOT-94716 Add embedCard to allowable content in bodiedExtension

## 14.0.0

### Major Changes

- [`85cc08ec2e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/85cc08ec2e6) -
  [ED-11353] Adds the input method for undo/redo events

  #Breaking Change

  `adf-schema`

  AnalyticsStep doesn't need the `handleAnalyticsEvent: HandleAnalyticsEvent<P>` anymore. We are
  submitting the events using the editor-core plugin `analytics`. On this file:
  `packages/editor/editor-core/src/plugins/analytics/plugin.ts`

  This will fix a hard to catch bug where the events were being dispatched before the transaction
  being applied. The transaction wasn't used, but the event was dispatched anyway, causing a data
  mismatch between user experience and actions.

### Minor Changes

- [`be0bfb03f12`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be0bfb03f12) - [ux]
  Implement syntax highlighting in editor code-block

### Patch Changes

- [`ffbe78153cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ffbe78153cf) - New
  stage0 ADF change: localId attribute on Table nodes

## 13.7.2

### Patch Changes

- [`b36f8119df5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b36f8119df5) - Add in
  keymap for moving to gap cursor from caption
- [`d01a017e81e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d01a017e81e) - fixed
  schema node type definitions to be more consistent

## 13.7.1

### Patch Changes

- [`3405124622e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3405124622e) - ED-11742
  Fix table custom step start position
- [`04649ad9889`](https://bitbucket.org/atlassian/atlassian-frontend/commits/04649ad9889) -
  ED-10369: fixed table breakout layout when pasted from renderer
- [`c3ff456f166`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3ff456f166) - ED-11860
  fix renderer code block content paste inconsistencies

## 13.7.0

### Minor Changes

- [`70f47afdee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70f47afdee) - Added
  unsupportedBlock support for mediaSingle as a child
- [`714fd9e922`](https://bitbucket.org/atlassian/atlassian-frontend/commits/714fd9e922) - Promote
  media link mark to full schema

## 13.6.0

### Minor Changes

- [`f523768cdc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f523768cdc) - Fix
  validator and schema for Image Captions

### Patch Changes

- [`b7d42ec728`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7d42ec728) - [ux]
  ED-11631 Sort code block language list as case insensitive
- [`1bd969d9c1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1bd969d9c1) - Fix
  re-renders in a table cell with the NodeView update
- [`9e76e3a5c5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e76e3a5c5) - [ux]
  Adding support to detect and render anchor links.

## 13.5.0

### Minor Changes

- [`7f7643108f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f7643108f) - [ux]
  EmbedCard node's `width` attribute will have 100% default value now. For UI this means, embeds are
  100% wide when inserted (instead of slightly smaller then 100% previously).

### Patch Changes

- [`aa671045fc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa671045fc) - [ux]
  ED-11300: allowed link mark under actionItem and decisionItem

## 13.4.0

### Minor Changes

- [`21de2f736a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/21de2f736a) - fix:
  normalizeHexColor behaves normally when passed 'default'

## 13.3.1

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 13.3.0

### Minor Changes

- [`4fdb9762af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4fdb9762af) - ED-10792:
  allow shouldExclude() to work on enum values

### Patch Changes

- [`0175a00afc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0175a00afc) - [ED-10670]
  Update prosemirror-model type to use posAtIndex methods
- [`a242048609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a242048609) - Re-enable
  adf schema backwards compatibility check
- [`d6c23f1886`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6c23f1886) - Added dark
  mode support to table cell background colors
- [`db4e6ab0d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db4e6ab0d4) - EDM-1388:
  Toggle link mark on media and not mediaSingle

## 13.2.0

### Minor Changes

- [`a929e563b9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a929e563b9) - Text color
  mark changed to be case insensitive
- [`eba787da28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eba787da28) - Allow link
  marks on media

### Patch Changes

- [`703752d487`](https://bitbucket.org/atlassian/atlassian-frontend/commits/703752d487) - ED-10647
  Remove caret from prosemirror-model, prosemirror-keymap, prosemirror-state, prosemirror-transform
  to lock them down to an explicit version
- [`ff39f9f643`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff39f9f643) - ED-10614
  Add match indexing (Confluence API) for annotation creation for the renderer

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

- [`a41378f853`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a41378f853) - Refactor &
  fix few cases of unsupported node attributes:
  - Preseve attributes on nodes which do not support any attributes
  - Add unsupportedNodeAttribute to bulletList, layoutSection etc.

### Patch Changes

- [`e4abda244e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4abda244e) - ED-9912:
  replace prosemirror-tables with editor-tables
- [`3e652479cc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e652479cc) - ED-9912:
  use CellAttributes from editor-tables in adf-schema
- [`be142eec6e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be142eec6e) - Refactor
  attributes validation and add unsupportedNodeAttribute mark in layoutsection

## 13.0.1

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 13.0.0

### Major Changes

- [`26ff0e5e9a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/26ff0e5e9a) - ED-10353
  Added adf schema changes to support emoji panels

### Minor Changes

- [`db7170dc53`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db7170dc53) - Promote
  EmbedCard to full schema
- [`c536839013`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c536839013) - ED-10214
  Add typeAheadQuery to default schema
- [`6e237a6753`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e237a6753) - Add
  optional caption to mediaSingle in adf schema for stage 0
- [`9a39500244`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a39500244) - Bump
  ProseMirror packages

  Read more: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1671956531/2020-08

- [`2e5e9bf891`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e5e9bf891) - ED-10123
  Export Analytics Step from adf-schema instead of internal editor-core

### Patch Changes

- [`c90f346430`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c90f346430) - Remove
  @ts-ignores/@ts-expect-errors

## 12.3.0

### Minor Changes

- [`15fe5f8731`](https://bitbucket.org/atlassian/atlassian-frontend/commits/15fe5f8731) - ED-9601
  Mark all nodes that don't support node selection with `selectable: false` in their node spec
- [`78de49291b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78de49291b) -
  [TWISTA-130] Exports AnnotationDataAttributes type and variable typo
- [`e4114d7053`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4114d7053) - ED-9607 -
  Preserve Unsupported Node attributes

### Patch Changes

- [`e485167c47`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e485167c47) - ED-10018:
  bump prosemirror-tables to fix copy-pasting merged rows
- [`d0596d4bfa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0596d4bfa) - change
  Html and Csharp to HTML and C# in codeblock language list

## 12.2.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 12.2.1

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump
  required because of conflicts on wadmal release

## 12.2.0

### Minor Changes

- [`50b49e0eb9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50b49e0eb9) - [ED-9780]
  allow link mark inside bodied extension
- [`abce19a6d1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/abce19a6d1) - Change old
  Array style tuples to Tuple

  ```
  interface X extends Array<T | U> {
    0: T
  }
  ```

  to

  ```
  type X = [T, T | U];
  ```

- [`8f843aaa4b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f843aaa4b) - EDM-927:
  Adding embeds inside expand and layouts

### Patch Changes

- [`9fe56e9d64`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fe56e9d64) - Revert
  TaskList and ItemList type
- [`0cd9a41d67`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0cd9a41d67) - ED-9843
  Refactor spec based validator

## 12.1.0

### Minor Changes

- [`b7c4fc3b08`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7c4fc3b08) - Preseve
  unsupported mark from getting lost

### Patch Changes

- [`7c6dc39447`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c6dc39447) - ED-9568
  annotations are now preserved when copy/pasting; also updated general copy/paste behaviour to
  preserve formatting of the pasted content, so that e.g. copying italic text into bold will
  preserve both italic and bold.

## 12.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 11.1.0

### Minor Changes

- [`01c27cf8cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/01c27cf8cf) - ED-9552
  Move SetAttrsStep into adf-schema

## 11.0.0

### Major Changes

- [`0ae829a4ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ae829a4ea) - EDM-648:
  Adds resizing and alignment to embed cards

### Patch Changes

- [`fb1a9c8009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb1a9c8009) - [FM-3726]
  Call onAnnotationClick when user taps in inline comment on Renderer
- [`2589a3e4fc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2589a3e4fc) - EDM-713:
  fix copy-paste from Renderer to Editor on Firefox

## 10.0.0

### Major Changes

- [`e30894b112`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e30894b112) - [FM-3716]
  Breaking changing: AnnotationType is now AnnotationTypes

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

- [`39b2e48c32`](https://bitbucket.org/atlassian/atlassian-frontend/commits/39b2e48c32) - Export new
  Add Column custom step in `@atlaskit/adf-schema/steps`
- [`50c333ab3a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50c333ab3a) - EDM-216:
  Adds EmbedCards in the Editor under the flag - allowEmbeds in the UNSAFE_cards prop

### Patch Changes

- [`0964848b95`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0964848b95) - [FM-3505]
  Add support for inline comments in the renderer mobile bridge getElementScrollOffsetByNodeType
  function
- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove
  unused dependencies

## 9.0.2

### Patch Changes

- [`ee0333aa64`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ee0333aa64) - ED-6318
  Add (None) option to top of code block language list- Updated dependencies

## 9.0.1

### Patch Changes

- [patch][92d04b5c28](https://bitbucket.org/atlassian/atlassian-frontend/commits/92d04b5c28):

  ED-9079 Disable spell check for text marked as inline code.

  This prevents the red squiggly line appearing underneath inline code, and aligns the UX with
  codeblock which already disables spell check. - @atlaskit/editor-json-transformer@7.0.11
  - @atlaskit/editor-test-helpers@11.1.1

## 9.0.0

### Major Changes

- [major][5d430f7d37](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d430f7d37):

  ED-8517 Add localId support to Extension node

  **BREAKING CHANGE** `ExtensionContent` has been removed.

### Minor Changes

- [minor][04e54bf405](https://bitbucket.org/atlassian/atlassian-frontend/commits/04e54bf405):

  EDM-500: Allow blockCard inside Panel

### Patch Changes

- [patch][9f43b9f0ca](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f43b9f0ca):

  ED-9037 / ED-9039: ProseMirror node selection for mentions and emojis- Updated dependencies
  [7e26fba915](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e26fba915):

- Updated dependencies
  [205b05851a](https://bitbucket.org/atlassian/atlassian-frontend/commits/205b05851a):
- Updated dependencies
  [823d80f31c](https://bitbucket.org/atlassian/atlassian-frontend/commits/823d80f31c):
- Updated dependencies
  [3644fc1afe](https://bitbucket.org/atlassian/atlassian-frontend/commits/3644fc1afe):
- Updated dependencies
  [62f1f218d9](https://bitbucket.org/atlassian/atlassian-frontend/commits/62f1f218d9):
- Updated dependencies
  [6eb8c0799f](https://bitbucket.org/atlassian/atlassian-frontend/commits/6eb8c0799f):
  - @atlaskit/editor-test-helpers@11.1.0
  - @atlaskit/editor-json-transformer@7.0.10

## 8.0.0

### Major Changes

- [major][715572f9e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/715572f9e5):

  Remove indentation from table cell and layout paragraphs

### Minor Changes

- [minor][bc29fbc030](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc29fbc030):

  ED-8748 ED-8211: Update media linking UI experience in renderer, fixes other rendering issues and
  workarounds.

### Patch Changes

- [patch][1386afaecc](https://bitbucket.org/atlassian/atlassian-frontend/commits/1386afaecc):

  ED-8751 Remove 'export \*' from adf-schema-
  [patch][584279e2ae](https://bitbucket.org/atlassian/atlassian-frontend/commits/584279e2ae):

  ED-8751 Remove circular dependencies, add eslint rule and recreate json schema caused by different
  import order-
  [patch][f83b67a761](https://bitbucket.org/atlassian/atlassian-frontend/commits/f83b67a761):

  EDM-407: Smart cards copy pasted from Renderer to Editor create mediaSingles-
  [patch][6b4fe5d0e0](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b4fe5d0e0):

  preserve image alt-text when pasting rich text content- Updated dependencies
  [4bec09aa74](https://bitbucket.org/atlassian/atlassian-frontend/commits/4bec09aa74):

- Updated dependencies
  [d63888b5e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63888b5e5):
- Updated dependencies
  [bdf25b1c4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdf25b1c4c):
- Updated dependencies
  [645918eda6](https://bitbucket.org/atlassian/atlassian-frontend/commits/645918eda6):
- Updated dependencies
  [fad8a16962](https://bitbucket.org/atlassian/atlassian-frontend/commits/fad8a16962):
  - @atlaskit/editor-test-helpers@11.0.0
  - @atlaskit/editor-json-transformer@7.0.9

## 7.0.1

### Patch Changes

- [patch][b3cf2b8a05](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3cf2b8a05):

  Fix expand not allowing marks issue

## 7.0.0

### Major Changes

- [major][7baff84f38](https://bitbucket.org/atlassian/atlassian-frontend/commits/7baff84f38):

  [ED-8521] Fix ADFSchema to invalidate any Expand Node with marks inside of Block nodes other than
  the Doc Node

### Minor Changes

- [minor][c171660346](https://bitbucket.org/atlassian/atlassian-frontend/commits/c171660346):

  Expose MediaADFAttrs-
  [minor][a5d0019a5e](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5d0019a5e):

  EDM-336: Add inlineCard to BB schema and support roundtripping

### Patch Changes

- [patch][7602615cd4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7602615cd4):

  ED-8785 Improve stage-0 & type reference support in JSON Schema Generator-
  [patch][27fde59914](https://bitbucket.org/atlassian/atlassian-frontend/commits/27fde59914):

  ED-8626 Can click on "open link in a new tab" with `javascript:` links in editor.-
  [patch][b18fc8a1b6](https://bitbucket.org/atlassian/atlassian-frontend/commits/b18fc8a1b6):

  ED-8700 Alt text property on external images is added, this is required to make external images
  saved and validated correctly when they contain alt text.- Updated dependencies
  [7602615cd4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7602615cd4):

- Updated dependencies
  [5e3aab8e77](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e3aab8e77):
  - @atlaskit/json-schema-generator@2.3.0
  - @atlaskit/editor-test-helpers@10.6.1
  - @atlaskit/editor-json-transformer@7.0.8

## 6.2.0

### Minor Changes

- [minor][e8a31c2714](https://bitbucket.org/atlassian/atlassian-frontend/commits/e8a31c2714):

  ED-8687 Export default schema configuration

### Patch Changes

- [patch][8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):

  Remove Karma tests - based on AFP-960- Updated dependencies
  [9d6b02c04f](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d6b02c04f):

- Updated dependencies
  [8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):
  - @atlaskit/editor-test-helpers@10.6.0
  - @atlaskit/editor-json-transformer@7.0.7

## 6.1.1

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):
  - @atlaskit/editor-json-transformer@7.0.6
  - @atlaskit/editor-test-helpers@10.5.1
  - @atlaskit/json-schema-generator@2.2.1

## 6.1.0

### Minor Changes

- [minor][b01fc0ceef](https://bitbucket.org/atlassian/atlassian-frontend/commits/b01fc0ceef):

  ED-8151 Alt text is promoted to full schema. Feature flag and MediaOptions property
  UNSAFE_allowAltTextOnImages was renamed to allowAltTextOnImages.

### Patch Changes

- [patch][d085ab4419](https://bitbucket.org/atlassian/atlassian-frontend/commits/d085ab4419):

  [ED-8109] Enable media link inside of block contents like layoutColumn and expand- Updated
  dependencies [3b19e30129](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b19e30129):

- Updated dependencies
  [fe4eaf06fc](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe4eaf06fc):
  - @atlaskit/editor-test-helpers@10.5.0
  - @atlaskit/editor-json-transformer@7.0.5

## 6.0.0

### Major Changes

- [major][26dbe7be6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/26dbe7be6d):

  ED-8470: removed unecessary borderColorPalette, made Palette.Color border a required prop

### Patch Changes

- [patch][3e87f5596a](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e87f5596a):

  ED-8388 Strip annotation marks when pasting content into Editor- Updated dependencies
  [cfcd27b2e4](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfcd27b2e4):

- Updated dependencies
  [ec929ab10e](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec929ab10e):
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

- Updated dependencies
  [edc4a4a7ae](https://bitbucket.org/atlassian/atlassian-frontend/commits/edc4a4a7ae):
  - @atlaskit/editor-test-helpers@10.4.1
  - @atlaskit/editor-json-transformer@7.0.3

## 4.4.0

### Minor Changes

- [minor][e5dd37f7a4](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5dd37f7a4):

  ED-7966: Promote expand to full schema, update flag and add appropriate tests

### Patch Changes

- [patch][4eefd368a8](https://bitbucket.org/atlassian/atlassian-frontend/commits/4eefd368a8):

  default media collection to empty string instead of null- Updated dependencies
  [46e6693eb3](https://bitbucket.org/atlassian/atlassian-frontend/commits/46e6693eb3):

- Updated dependencies
  [83300f0b6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/83300f0b6d):
- Updated dependencies
  [e5dd37f7a4](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5dd37f7a4):
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

- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
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

  Add a fixture of a document with different cases of unsupported content-
  [patch][cc1b89d310](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc1b89d310):

  ED-8162: Prevent the editor from locking up when navigating from gap-cursor to an expand title-
  [patch][938f1c2902](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/938f1c2902):

  ED-8186: Fix incorrect mark filtering when toggling lists- Updated dependencies
  [10425b84b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10425b84b4):

- Updated dependencies
  [926798632e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926798632e):
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

  Adf schema changes (for stage-0) to support alt text on media nodes. `editor-core` changes are
  wrapped under the editor prop `UNSAFE_allowAltTextOnImages`. There is no alt text implementation
  yet, so the user won't be able to add alt text to images just yet.

### Patch Changes

- [patch][5b2c89203e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b2c89203e):

  Fix linting errors from prettier upgrade

- Updated dependencies
  [6d9c8a9073](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d9c8a9073):
  - @atlaskit/editor-json-transformer@7.0.0

## 4.2.0

### Minor Changes

- [minor][1a0fe670f9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1a0fe670f9):

  ED-7674: support nested actions in stage-0 schema; change DOM representation of actions

  ### Nested actions

  This changeset adds support for nesting actions _at the schema level_, currently only within the
  stage-0 ADF schema.

  The editor and renderer currently do nothing special to represent these nested actions. As of this
  release, they appear as as flat list.

  To enable this feature, use the new `allowNestedTasks` prop.

  ### DOM representation of actions in renderer + editor

  This release also changes the DOM representation of actions away from a `ol > li` structure, to a
  `div > div` one. That is, both the `taskList` and `taskItem` are wrapped in `div` elements.

  Because taskLists can now be allowed to nest themselves, this would otherwise have created an
  `ol > ol` structure, which is invalid.-
  [minor][ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):

**FABDODGEM-13 Editor Damask Release** - [Internal post](http://go.atlassian.com/damask-release)

**BREAKING CHANGES**

- **Media:** Removed deprecated "context" property from media components in favor of
  "mediaClientConfig". This affects all public media UI components.
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

**Mobile** - Implement undo/redo interface on Hybrid Editor -
https://product-fabric.atlassian.net/browse/FM-2393

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

  Remove unnecessary `tableBackgroundBorderColors` in favour of unique `tableBackgroundBorderColor`
  for all table cell background border-
  [major][80adfefba2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80adfefba2):

  Remove applicationCard node and action mark

### Minor Changes

- [minor][5276c19a41](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5276c19a41):

  ED-5996: support viewing inline comments within editor

  You can do this with the `annotationProvider` prop. Passing a truthy value to this (e.g. the empty
  object `{}`) will:
  - enable support for working with the `annotation` ADF mark
  - will render highlights around any annotations, and
  - allow copying and pasting of annotations within the same document, or between documents

  You can also optionally pass a React component to the `component`, so you can render custom
  components on top of or around the editor when the user's text cursor is inside an annotation.

  Please see
  [the package documentation](https://atlaskit.atlassian.com/packages/editor/editor-core/docs/annotations)
  for more information.

  There is an example component called `ExampleInlineCommentComponent` within the
  `@atlaskit/editor-test-helpers` package. It is currently featured in the full page examples on the
  Atlaskit website.

  Annotations are styled within the editor using the `fabric-editor-annotation` CSS class.

  Other changes:
  - `Popup` now supports an optional `rect` parameter to direct placement, rather than calculating
    the bounding client rect around a DOM node.-
    [minor][45ae9e1cc2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/45ae9e1cc2):

  ED-7201 Add new background cell colors and improve text color

### Patch Changes

- [patch][bbb4f9463d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbb4f9463d):

  CEMS-234 Prioritize media single over media group

  This solves issue where pasting images with text from third party applications into a table ends
  adding an error image.-
  [patch][922ec81fe7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/922ec81fe7):

  ED-7710: Only show annotation highlight if we have a provider

## 3.1.3

### Patch Changes

- [patch][48fcfce0a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48fcfce0a1):

  Export missing definitions from schema to fix types in utils

## 3.1.2

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 3.1.1

### Patch Changes

- [patch][0d7d459f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7d459f1a):

  Fixes type errors which were incompatible with TS 3.6

## 3.1.0

### Minor Changes

- [minor][66c5c88f4a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66c5c88f4a):

  Refactor emoji to use typeahead plugin-
  [minor][bdee736f14](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bdee736f14):

  ED-7175: unify smart link and hyperlink toolbars

  Also updates the toDOM and parseDOM on ADF nodes, making `url` optional.

  Smart cards can now optionally be passed an onResolve callback, of the shape:

      onResolve?: (data: { url?: string; title?: string }) => void;

  This gets fired when the view resolves a smart card from JSON-LD, either via the client or the
  `data` prop.

### Patch Changes

- [patch][6e3a0038fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e3a0038fc):

  ED-7288: reduces the number of DOM nodes in table cells, changes the way resize handles are
  positioned- [patch][a0a3fa7aac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a0a3fa7aac):

  Ensure mediagroup nodes are copied to destination collection when pasted in different documents

## 3.0.0

### Major Changes

- [major][6164bc2629](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6164bc2629):

  ED-6806 Move 'calcTableColumnWidths' from adf-schema into editor-common

  BREAKING CHANGE

  We move 'calcTableColumnWidths' helper from adf-schema into our helper library editor-common, you
  can use it from editor-common in the same way:

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
  - Removing the generation of the entry-points at the root Please see this
    [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this
    [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points)
    for further details

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

  ED-6701 Upgrade prosemirror-view to 1.9.10 and prosemirror-inputrules to 1.0.4 for composition
  input improvements

## 2.8.1

### Patch Changes

- [patch][34c6df4fb8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/34c6df4fb8):

  adf-schema has been extended with one missing color, email-renderer now bundles up styles into
  .css file

## 2.8.0

### Minor Changes

- [minor][86bf524679](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/86bf524679):

  ED-7117, ED-7087: Fix copy pasting smart links out of editor. Fallback to HTML anchor tag if
  errors occur during rendering (e.g. no provider found).

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
  - [ED-6860] Revert prosemirror-view 1.8.9 bumps, this version was making the cursor typing slowly.
    this version is recreating all plugins when we use `EditorView.setProps`

## 2.5.7

- [patch][1ec6367e00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ec6367e00):
  - ED-6551 - Lists should correctly wrap adjacent floated content without overlapping

## 2.5.6

- [patch][80cf1c1e82](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80cf1c1e82):
  - [ED-6654] Update prosemirror-view to 1.8.9 that fixes a few issues with mouse selections on
    prosemirror like click on table and the controls doesn't show up

## 2.5.5

- Updated dependencies
  [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
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
  - Standardise code-block class between editor/renderer. Fix bg color when code-block is nested
    within a table heading.

## 2.5.0

- [minor][64dd2ab46f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64dd2ab46f):
  - ED-6558 Fix clicking to set the cursor placement after an inline node that's at the end of a
    line. Set the default style attribute of Status nodes to be empty instead of 'null'.

## 2.4.1

- [patch][97e555c168](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97e555c168):
  - Revert "[ED-5259 - ED-6200] adds defaultMarks on tableNode (pull request #5259)"

## 2.4.0

- [minor][09a90e4af1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/09a90e4af1):
  - ED-6319 Supporting select media using gap cursor, fix behaviour of backspace key and gap cursor
    in media single with layout wrap-right.

## 2.3.2

- [patch][b425ea772b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b425ea772b):
  - Revert "ED-5505 add strong as default mark to table header (pull request #5291)"

## 2.3.1

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):
  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 2.3.0

- [minor][02dd1f7287](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/02dd1f7287):
  - [ED-5505] Persists formatting to table cells and headers when toggling header row, column or
    applying any text formatting to empty cells.

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
  - ED-6485 Support breakout mark on layout-section. Retain breakout mark when toggling list nested
    within columns.

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

- Updated dependencies
  [4af5bd2a58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4af5bd2a58):
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
  - ED-6026: unify attributes for blockCard and inlineCard; allow parseDOM using just 'data'
    attribute

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
