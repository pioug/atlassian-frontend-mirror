# @atlaskit/editor-plugin-block-menu

## 6.0.16

### Patch Changes

- [`0caee373bff2d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0caee373bff2d) -
  Exported additional types to fix typescript portable annotation errors
- Updated dependencies

## 6.0.15

### Patch Changes

- [`2a1bf10d70beb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2a1bf10d70beb) -
  EDITOR-4293 Fix block menu selection highlight issues
- Updated dependencies

## 6.0.14

### Patch Changes

- [`3a117b2d76d59`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3a117b2d76d59) -
  [ux] Transform decision -> codeBlock and quote -> headings are disabled.
- Updated dependencies

## 6.0.13

### Patch Changes

- [`799170edab4f8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/799170edab4f8) -
  Fix the delete wrong content via keyboard when block menu open

## 6.0.12

### Patch Changes

- [`b909e5f47ea91`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b909e5f47ea91) -
  EDITOR-4159 Make sure block-menu-item type component return null when tranform disabled
- Updated dependencies

## 6.0.11

### Patch Changes

- Updated dependencies

## 6.0.10

### Patch Changes

- [`b512bf962fe38`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b512bf962fe38) -
  [ux] codeblock transformations should drop any incompatible content, it should just be wrapped
- Updated dependencies

## 6.0.9

### Patch Changes

- [`c77659e594c55`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c77659e594c55) -
  [ux] Editor-4020: Fix decision to quote and code block, fixed empty panel to code block"

## 6.0.8

### Patch Changes

- [`bdcaf574d7d2d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bdcaf574d7d2d) -
  Fix transformation of multiple headings and paragraphs to codeblocks
- [`68ebba7ccdc1b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/68ebba7ccdc1b) -
  [EDITOR-4157] Fix editor freeze when transforming mediaSingle at bottom of document
- [`fef9134c6feb5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fef9134c6feb5) -
  [ux] Implement multiselect transformations for text (heading, paragraph) nodes
- Updated dependencies

## 6.0.7

### Patch Changes

- [`65223704a60e0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/65223704a60e0) -
  Fix hard breaks being lost in nested task lists during transformation
- Updated dependencies

## 6.0.6

### Patch Changes

- [`27a9a5b28e8a6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/27a9a5b28e8a6) -
  [ux] Add ability to transform multiselected content to layouts

## 6.0.5

### Patch Changes

- [`1c4801e3e64b4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1c4801e3e64b4) -
  [ux] Add ability for multi selected block transformations to lists
- Updated dependencies

## 6.0.4

### Patch Changes

- [`9d63742a083b1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9d63742a083b1) -
  Fixes analytics and updates getTargeNodeTypeNameInContext to be used for transforms and contextual
  options.
- Updated dependencies

## 6.0.3

### Patch Changes

- [`c94a46ce70f89`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c94a46ce70f89) -
  [ux] File can't be transformed to bullet or ordered list. Disable those options in the 'Turn into'
  menu.

## 6.0.2

### Patch Changes

- [`7b54da3c92435`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7b54da3c92435) -
  EDITOR-3993 Add analytics measure timings for transformNode function with operational events
  tracking duration, node count, and source/target node types
- Updated dependencies

## 6.0.1

### Patch Changes

- [`3ae29083b2189`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3ae29083b2189) -
  Remove block marks when wrapping nodes (fixes multi-select codeblock)

## 6.0.0

### Patch Changes

- [`4da819b186eaf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4da819b186eaf) -
  EDITOR-3911 selection preservation key handling
- [`2f000c01bd8ac`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2f000c01bd8ac) -
  Retain block marks for text -> text transforms
- Updated dependencies

## 5.2.28

### Patch Changes

- [`8c62a0141a5fa`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8c62a0141a5fa) -
  [ux] Fixes contextual transform options for direct children of top level nodes.
- Updated dependencies

## 5.2.27

### Patch Changes

- [`6eba84d34e1a5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6eba84d34e1a5) -
  Add a new multi node type which supports multi-selected content
- Updated dependencies

## 5.2.26

### Patch Changes

- [`7b47062997f9b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7b47062997f9b) -
  EDITOR-3793 Stop preserving selection on click into editor
- Updated dependencies

## 5.2.25

### Patch Changes

- [`9cb0ce7857313`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9cb0ce7857313) -
  [ux] Fix contextual transform options for single node selections.

## 5.2.24

### Patch Changes

- [`ec581339891b4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ec581339891b4) -
  Fix code block transformation to remove block marks (breakout, alignment) when wrapping into
  layout, blockquote, expand, or panel
- Updated dependencies

## 5.2.23

### Patch Changes

- [`6c9c4e73b1c39`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6c9c4e73b1c39) -
  EDITOR-4037 Block menu selection extension tests

## 5.2.22

### Patch Changes

- [`3356921b0b0ff`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3356921b0b0ff) -
  [ux] Enables 'Copy link to block' feature for nested nodes
- Updated dependencies

## 5.2.21

### Patch Changes

- [`b5d004bf834f8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b5d004bf834f8) -
  [ux] Adds block menu action to check if 'Turn into' item should be rendered or not.
- Updated dependencies

## 5.2.20

### Patch Changes

- [`65f1df43f39d7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/65f1df43f39d7) -
  Add heading transform
- Updated dependencies

## 5.2.19

### Patch Changes

- Updated dependencies

## 5.2.18

### Patch Changes

- [`bfb0acc5f3d72`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bfb0acc5f3d72) -
  [ux] Update list flattening steps to handle decision lists as well
- [`a528ea956ce65`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a528ea956ce65) -
  [ux] EDITOR-3956 fix sync block resize handle padding and alignment
- Updated dependencies

## 5.2.17

### Patch Changes

- [`1da3868c8f709`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1da3868c8f709) -
  EDITOR-3916 Fix block menu alternating on drag handle click
- [`722f272e8b78f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/722f272e8b78f) -
  Editor-2778: Smartlink card and embed transform
- Updated dependencies

## 5.2.16

### Patch Changes

- [`493a21ccda098`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/493a21ccda098) -
  Add wrapTextToCodeblock step to handle text to codeblock step, add remaining steps for paragraph
  to container steps
- [`38369379f9e12`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/38369379f9e12) -
  [ux] Editor-3976: Make copy link and delete available for empty line
- Updated dependencies

## 5.2.15

### Patch Changes

- Updated dependencies

## 5.2.14

### Patch Changes

- [`6bf9c33a49f72`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6bf9c33a49f72) -
  [ux] Add check for empty transformation and create blank node
- Updated dependencies

## 5.2.13

### Patch Changes

- [`8da61d284b811`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8da61d284b811) -
  EDITOR-3911 Expand selection to block range
- [`010fbe9d85b12`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/010fbe9d85b12) -
  [ux] Fix bug / make wrap of expand convert to nestedExpand node
- Updated dependencies

## 5.2.12

### Patch Changes

- [`b3c4249a34e4b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b3c4249a34e4b) -
  EDITOR-3880 Improve block menu rendering to support infinite nesting

## 5.2.11

### Patch Changes

- [`0c673432d72e9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0c673432d72e9) -
  [ux] Fix bug / make wrap of expand convert to nestedExpand node

## 5.2.10

### Patch Changes

- [`eb116a739e7c2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/eb116a739e7c2) -
  [ux] Fix bug / make unwrap of expand convert nestedExpand node to regular expand node

## 5.2.9

### Patch Changes

- [`3d03e8b001dab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3d03e8b001dab) -
  Add logic to handle unsupported content for list to task/decision list
- [`b831109342cdf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b831109342cdf) -
  EDITOR-3880 Register block menu selection extensions statically

## 5.2.8

### Patch Changes

- [`0006edf16b3a3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0006edf16b3a3) -
  Editor-2778: Media wrap in container

## 5.2.7

### Patch Changes

- [`b2e5262017fa8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2e5262017fa8) -
  Editor-2676: Remove moveFocusTo in block menu provider
- Updated dependencies

## 5.2.6

### Patch Changes

- [`fa50da8ee6860`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fa50da8ee6860) -
  EDITOR-3879 [multi-select] Detect nodes from multi-selection
- Updated dependencies

## 5.2.5

### Patch Changes

- [`c125e9935090b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c125e9935090b) -
  Add decision list transformation support in block menu

## 5.2.4

### Patch Changes

- [`dbbf4fabef4fe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dbbf4fabef4fe) -
  [ux] Scope change | Remove text transformations for incompatible nodes
- [`bb7cbcb12ae4f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bb7cbcb12ae4f) -
  [ux] Implement transformation steps for panel to other nodes

## 5.2.3

### Patch Changes

- [`d0857f52fd866`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d0857f52fd866) -
  Add list-to-list transformation support in block menu

## 5.2.2

### Patch Changes

- [`8696c9d95fe26`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8696c9d95fe26) -
  [ux] EDITOR-3382 Block menu copy link for multi select
- Updated dependencies

## 5.2.1

### Patch Changes

- [`e1a0f13fc5c83`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e1a0f13fc5c83) -
  Editor-2778: Table transform to expand and layout
- Updated dependencies

## 5.2.0

### Minor Changes

- [`0bff72d37394d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0bff72d37394d) -
  [ux] Implement steps for bullet, task, and numbered lists transformations to container nodes

### Patch Changes

- Updated dependencies

## 5.1.11

### Patch Changes

- [`7c295bfea1292`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7c295bfea1292) -
  EDITOR-3380 Use preserved selection when deleting selected range
- Updated dependencies

## 5.1.10

### Patch Changes

- Updated dependencies

## 5.1.9

### Patch Changes

- [`fdcaf17b021af`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fdcaf17b021af) -
  Editor-2676: keep block menu open when move up down clicked
- Updated dependencies

## 5.1.8

### Patch Changes

- [`1ce87340b7e3e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1ce87340b7e3e) -
  [ux] Implement wrapMixedContentStep function to handle complex container transformations
- [`4e0c1ce981b5e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4e0c1ce981b5e) -
  EDITOR-2930: Add SuggestedItemsRenderer for suggested block menu section
- Updated dependencies

## 5.1.7

### Patch Changes

- [`65ef204463ce4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/65ef204463ce4) -
  Add predicate param to expandBlockRange, add logic to cater for selection being broken in lists
- Updated dependencies

## 5.1.6

### Patch Changes

- [`a202e97c73f3a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a202e97c73f3a) -
  Adds base transform cases for codeBlock, layout, blockquote.

## 5.1.5

### Patch Changes

- [`f6905b2543ef1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f6905b2543ef1) -
  [ux] Implements base steps for from container to other node categories transfroms.
- Updated dependencies

## 5.1.4

### Patch Changes

- [`7e5df3d5beaf3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7e5df3d5beaf3) -
  Add new flattenListStep and unwrapListStep and use for list -> paragraph step. Also moved
  expandToBlockRange util function to editor-common to re-use
- Updated dependencies

## 5.1.3

### Patch Changes

- [`8ae5288a74a40`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8ae5288a74a40) -
  Update traversal logic in selection
- Updated dependencies

## 5.1.2

### Patch Changes

- [`00c08e3995cb2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/00c08e3995cb2) -
  Clean up platform_editor_block_menu_empty_line
- Updated dependencies

## 5.1.1

### Patch Changes

- [`55bf82f6468ac`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/55bf82f6468ac) -
  Update transformNode command to work with preservedSelection
- Updated dependencies

## 5.1.0

### Minor Changes

- [`bd911d5eca1cb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bd911d5eca1cb) -
  Use new transfromNode command in existing block menu items. Update transformNode analytics type.

## 5.0.24

### Patch Changes

- Updated dependencies

## 5.0.23

### Patch Changes

- [`01a138be1a16d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/01a138be1a16d) -
  Clean up platform_editor_block_menu_expand_format
- Updated dependencies

## 5.0.22

### Patch Changes

- [`41a91a916c125`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/41a91a916c125) -
  EDITOR-2846 Change platform_synced_block to use editorExperiment and add Jira experiment
- Updated dependencies

## 5.0.21

### Patch Changes

- [`7583860e8637f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7583860e8637f) -
  EDITOR-3621 Clean up platform_editor_block_menu_keyboard_navigation feature gate
- [`e3fe76664f63b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e3fe76664f63b) -
  Clean up platform_editor_block_menu_shouldfitcontainer
- Updated dependencies

## 5.0.20

### Patch Changes

- [`a26ad89b7926c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a26ad89b7926c) -
  [ux] FG cleanup platform_editor_block_menu_for_disabled_nodes
- Updated dependencies

## 5.0.19

### Patch Changes

- [`56c0427b2ab20`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/56c0427b2ab20) -
  [ux] Use new IA for block menu items.

## 5.0.18

### Patch Changes

- [`4d676bbdb3ce6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4d676bbdb3ce6) -
  ts-ignore added temporarily to unblock local consumption for help-center, will be removed once
  project refs are setup
- Updated dependencies

## 5.0.17

### Patch Changes

- Updated dependencies

## 5.0.16

### Patch Changes

- [`459eb2064ff46`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/459eb2064ff46) -
  [ux] Implements base for the new transform logic for the block menu.
- Updated dependencies

## 5.0.15

### Patch Changes

- [`8854ad2383b33`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8854ad2383b33) -
  Suppress no-literal-string-in-jsx
- Updated dependencies

## 5.0.14

### Patch Changes

- [`b5dc6946c55d9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b5dc6946c55d9) -
  Clean up platform_editor_block_menu_layout_format
- Updated dependencies

## 5.0.13

### Patch Changes

- [`6f765533c791b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6f765533c791b) -
  FG platform_editor_block_menu_patch_1 clean up.
- Updated dependencies

## 5.0.12

### Patch Changes

- Updated dependencies

## 5.0.11

### Patch Changes

- [`bf1f847655683`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bf1f847655683) -
  ED-29512: Fixed not able to delete node when block menu is visible
- Updated dependencies

## 5.0.10

### Patch Changes

- [`c0f06bd1a9b63`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c0f06bd1a9b63) -
  Feature flag removal platform_editor_block_menu_patch_2
- Updated dependencies

## 5.0.9

### Patch Changes

- [`d43ebcd35ce11`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d43ebcd35ce11) -
  [ux] Enable block menu on all top level nodes by default

## 5.0.8

### Patch Changes

- [`66669e4c6a5d3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/66669e4c6a5d3) -
  [ux] Update block menu renderer to support mulitple sections inside of a nested menu
- Updated dependencies

## 5.0.7

### Patch Changes

- Updated dependencies

## 5.0.6

### Patch Changes

- [`9aaf4b9af9258`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9aaf4b9af9258) -
  Clean up `platform_editor_block_menu_selection_fix` feature gate

## 5.0.5

### Patch Changes

- [`292d52fa1530f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/292d52fa1530f) -
  EDITOR-2759 Copy content block menu option copies source sync block content
- Updated dependencies

## 5.0.4

### Patch Changes

- Updated dependencies

## 5.0.3

### Patch Changes

- Updated dependencies

## 5.0.2

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- Updated dependencies

## 5.0.0

### Major Changes

- [`6e51d74bb2a29`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6e51d74bb2a29) -
  [ux] ED-29560 Use hash instead of query parameter for link to block

### Patch Changes

- [`4f5569bde5e64`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4f5569bde5e64) -
  Add new 'dragHandleSelected' user intent, use this to control table toolbar when drag handle is
  selected
- Updated dependencies

## 4.0.25

### Patch Changes

- Updated dependencies

## 4.0.24

### Patch Changes

- Updated dependencies

## 4.0.23

### Patch Changes

- Updated dependencies

## 4.0.22

### Patch Changes

- [`3c7b7f4449751`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3c7b7f4449751) -
  Add error observability for block menu
- Updated dependencies

## 4.0.21

### Patch Changes

- Updated dependencies

## 4.0.20

### Patch Changes

- [`e053b5e610ac2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e053b5e610ac2) -
  [ux] EDITOR-1652 add convert to sync block to block menu
- Updated dependencies

## 4.0.19

### Patch Changes

- [`e3ca1a4b9b932`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e3ca1a4b9b932) -
  [ux] ED-29489 Remove focus ring when drag handle is clicked and fix menu closing on menu open
- Updated dependencies

## 4.0.18

### Patch Changes

- [`64b94b53839de`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/64b94b53839de) -
  Fix the outdated Turn into disabled state in block menu
- Updated dependencies

## 4.0.17

### Patch Changes

- [`dc211dc1927b5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dc211dc1927b5) -
  [ux] ED-29232: Fixed issues with block menu for file
- Updated dependencies

## 4.0.16

### Patch Changes

- [`26917199e153a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/26917199e153a) -
  ED-29473 Add inputMethod attribute for block menu opened and switch inputMethod and triggeredFrom
  attributes for element converted event
- Updated dependencies

## 4.0.15

### Patch Changes

- [`d5cf7cd71a821`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d5cf7cd71a821) -
  ED-29124: Fixed format neste menu on top of top toolbar
- Updated dependencies

## 4.0.14

### Patch Changes

- [`4141e6d6c0258`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4141e6d6c0258) -
  [ux] ED-29125 Add danger styles for media group, tables with numbered columns and nested panels
- [`b775e7e1ebae1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b775e7e1ebae1) -
  Fix incorrect selection after copy content via block menu
- Updated dependencies

## 4.0.13

### Patch Changes

- Updated dependencies

## 4.0.12

### Patch Changes

- [`1f3aae72424a3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1f3aae72424a3) -
  ED-29742 Set focus at drag handle when drag handle is clicked and don't refocus on editor to fix
  arrow key setting new selection instead of keyboard nav

## 4.0.11

### Patch Changes

- [`7011f9be6a430`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7011f9be6a430) -
  [ux] EDITOR-1653 add create synced block item to the block menu
- Updated dependencies

## 4.0.10

### Patch Changes

- Updated dependencies

## 4.0.9

### Patch Changes

- [`bbb9bb5594379`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bbb9bb5594379) -
  Add eventCategory attribute in the payload of `elementConverted` event from Block menu
- Updated dependencies

## 4.0.8

### Patch Changes

- Updated dependencies

## 4.0.7

### Patch Changes

- [`eb4899e5362e5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/eb4899e5362e5) -
  Update BlockMenuItemClicked event payload
- Updated dependencies

## 4.0.6

### Patch Changes

- Updated dependencies

## 4.0.5

### Patch Changes

- [`51d46145cda56`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/51d46145cda56) -
  Adds additional attributes to Element Converted event and fires the event for the empty line
  transforms
- Updated dependencies

## 4.0.4

### Patch Changes

- [`1eda79686167c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1eda79686167c) -
  ED-29418: Fix empty code block convert to lists
- [`0778701e62192`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0778701e62192) -
  [ux] ED-29424 Focus first menu item when block menu is opened and remove decorations when delete
  button unmounts
- Updated dependencies

## 4.0.3

### Patch Changes

- [`c158b1ba4f0fd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c158b1ba4f0fd) -
  ED-29388: fix converting empty list
- Updated dependencies

## 4.0.2

### Patch Changes

- [`9cf29da7572b3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9cf29da7572b3) -
  [ux] Fires Element converted event when Turn into menu is used to transform a node from one node
  type to another.
- Updated dependencies

## 4.0.1

### Patch Changes

- [`f4c0936dc05fe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f4c0936dc05fe) -
  ED-29391 Add keyboard support for block menu
- Updated dependencies

## 4.0.0

### Patch Changes

- Updated dependencies

## 3.2.9

### Patch Changes

- [`3a405e30c22dc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3a405e30c22dc) -
  ED-29384: Fixed copy texts in extension, pasted the extension
- Updated dependencies

## 3.2.8

### Patch Changes

- [`3e49f15a87d52`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3e49f15a87d52) -
  Add analytics events for block menu discovery
- Updated dependencies

## 3.2.7

### Patch Changes

- [`0ef848d2118aa`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0ef848d2118aa) -
  Grey out `Turn Into` option on block menu where it is not supported
- Updated dependencies

## 3.2.6

### Patch Changes

- [`3c44ed6acd860`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3c44ed6acd860) -
  Enable `Turn into` in block menu on all nested node under a feature gate
- Updated dependencies

## 3.2.5

### Patch Changes

- [`f7bc2f60e0fc6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f7bc2f60e0fc6) -
  [ux] Updates copy text for drag handle, copy block, copy link and updates order of items in Turn
  into menu.
- Updated dependencies

## 3.2.4

### Patch Changes

- [`ef686b3cfdbff`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ef686b3cfdbff) -
  ED-29222: Make empty line experiment dependent on block menu
- Updated dependencies

## 3.2.3

### Patch Changes

- [`d5e5b25fe885a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d5e5b25fe885a) -
  [ux] ED-29226 Open block menu when drag handle is focussed and space or enter key is pressed
- Updated dependencies

## 3.2.2

### Patch Changes

- [`0cde512c00691`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0cde512c00691) -
  [ux] When resized node it transformed to another resized node, the width should be preserved.
- [`245e047a2f6e9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/245e047a2f6e9) -
  [ux] Change `Format` option text to `Turn into` in block menu
- Updated dependencies

## 3.2.1

### Patch Changes

- [`7958282e36bdf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7958282e36bdf) -
  [ux] ED-29222: Show block menu on empty line
- Updated dependencies

## 3.2.0

### Minor Changes

- [`b610a8281f843`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b610a8281f843) -
  Fix double format options highlight for selection with blockQuotes

### Patch Changes

- Updated dependencies

## 3.1.6

### Patch Changes

- [`f1e12e7cf00ba`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1e12e7cf00ba) -
  ED-29083: Fixed copying code block only copy texts
- Updated dependencies

## 3.1.5

### Patch Changes

- [`6087f73c2a306`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6087f73c2a306) -
  [ux] ED-29309 Insert unsupported content from lists when transformed
- Updated dependencies

## 3.1.4

### Patch Changes

- [`f2000345dec2c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f2000345dec2c) -
  ED-29258 Break up list items into new lines when converted into codeblock

## 3.1.3

### Patch Changes

- Updated dependencies

## 3.1.2

### Patch Changes

- [`77f5d276a6b30`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/77f5d276a6b30) -
  [ux] Put layout and expand format menu visibility behind experiment flags
- Updated dependencies

## 3.1.1

### Patch Changes

- [`c30d1876a650a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c30d1876a650a) -
  ED-29256 Transform content with indentation in layouts
- Updated dependencies

## 3.1.0

### Minor Changes

- [`cebd8f9171426`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cebd8f9171426) -
  [ux] ED-29159 Implement transform task inside lists - handle logic

### Patch Changes

- Updated dependencies

## 3.0.2

### Patch Changes

- [`d6f3f3b09ebff`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d6f3f3b09ebff) -
  [ux] ED-29255 Fix layout transformation when column is empty, transform nested lists to match
  container to list transformations and fix task list transforms when task item is empty

## 3.0.1

### Patch Changes

- [`73f45bc07b4c6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/73f45bc07b4c6) -
  ED-29240: Fixed not able to delete table when it is last element
- Updated dependencies

## 3.0.0

### Major Changes

- [`bdad0e9db564d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bdad0e9db564d) -
  [ux] ED-29214 Clean up isFormatMenuHidden shared state and add logic for blockquote selections

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.0.13

### Patch Changes

- [`c24edcf83432c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c24edcf83432c) -
  [ux] ED-29147 Add functionality to convert layout to nodes
- Updated dependencies

## 1.0.12

### Patch Changes

- [`6e27819feadc7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6e27819feadc7) -
  ED-29183: Fixed aligned p and heading not able to convert to list
- [`6a9265f5389db`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6a9265f5389db) -
  Fix container transform with blockquote containing list
- [`24e0d952943aa`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/24e0d952943aa) -
  ED-29206: Fixed conversion from code block to panel, expand text formatting issue
- Updated dependencies

## 1.0.11

### Patch Changes

- [`fcef7ff2e1083`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fcef7ff2e1083) -
  Split unsupported content when converting to codeblock
- [`1754f5027f568`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1754f5027f568) -
  Fix missing copy link on table node
- Updated dependencies

## 1.0.10

### Patch Changes

- [`74c42a764926a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/74c42a764926a) -
  Hide copy link option when platform_editor_adf_with_localid FG is off or when selection is a
  nested node
- [`614ef1a575e84`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/614ef1a575e84) -
  [ux] ED-29183: Fixed p and headings with alignment not able to convert to panel, expand, block
  quote

## 1.0.9

### Patch Changes

- [`da23530028aac`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/da23530028aac) -
  [ux] ED-29145 Hide format menu for unsupported and nested nodes

## 1.0.8

### Patch Changes

- [`b3e1332c170a6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b3e1332c170a6) -
  Container to container transform with unsupportted content
- Updated dependencies

## 1.0.7

### Patch Changes

- [`34871606f04ba`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/34871606f04ba) -
  [ux] Updates unwrapAndConvertToList to support codeBlock to list case and cases where contnent is
  not textblock.

## 1.0.6

### Patch Changes

- [`40e6bcca6edd4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/40e6bcca6edd4) -
  [ux] ED-29146: unwrap container to block nodes
- Updated dependencies

## 1.0.5

### Patch Changes

- [`b76a419d23d3d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b76a419d23d3d) -
  [ux] ED-29143 Transform nodes into layout
- [`0d741324d534a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0d741324d534a) -
  [ux] Adds wrapping of list node types in container node types.
- Updated dependencies

## 1.0.4

### Patch Changes

- [`30454d0f4baf2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/30454d0f4baf2) -
  Support multiple levels list to list transform
- [`cb4decb701766`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cb4decb701766) -
  [ux] Enable max height on block menu flyout menu
- Updated dependencies

## 1.0.3

### Patch Changes

- [`3db18eece6c2f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3db18eece6c2f) -
  [ux] Adds basic conversion from expand, panel, blockquote to bulled, numbered or task list.
- Updated dependencies

## 1.0.2

### Patch Changes

- [`32434f817d714`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/32434f817d714) -
  ED-29126: Convert list to block nodes
- [`255837cfba315`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/255837cfba315) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 1.0.1

### Patch Changes

- [`ecae39119dc4b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ecae39119dc4b) -
  [ux] ED-28558 Wrap block nodes inside container nodes
- Updated dependencies

## 1.0.0

### Patch Changes

- [`e882e86092666`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e882e86092666) -
  [ux] Register expand, layout and code block itmes in block menu. Update panel item.
- Updated dependencies

## 0.0.20

### Patch Changes

- [`652bf219a308e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/652bf219a308e) -
  [ux] ED-28581: Added isSelected state for block type and lists"
- [`652bf219a308e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/652bf219a308e) -
  [ux] ED-28581: isSelected for block type and list
- Updated dependencies

## 0.0.19

### Patch Changes

- [`bfd653291c561`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bfd653291c561) -
  [ux] ED-29018 Register taskList dropdown item and add menu item keys
- Updated dependencies

## 0.0.18

### Patch Changes

- [`942b7b9e97c21`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/942b7b9e97c21) -
  Support nested block menu via selection extension config
- Updated dependencies

## 0.0.17

### Patch Changes

- Updated dependencies

## 0.0.16

### Patch Changes

- [`1ab3eb4c56ebb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1ab3eb4c56ebb) -
  [ux] ED-28581: Registered components for block type and list plugins
- Updated dependencies

## 0.0.15

### Patch Changes

- [`de1880647c70f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/de1880647c70f) -
  Support block menu config in selection extension
- Updated dependencies

## 0.0.14

### Patch Changes

- Updated dependencies

## 0.0.13

### Patch Changes

- [`6dd96d8ae168d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6dd96d8ae168d) -
  [ux] ED-28581 ED-28581: Updated renderer logic to better support nest menu items register from
  outside block menu
- Updated dependencies

## 0.0.12

### Patch Changes

- [`2d45ff8531e21`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2d45ff8531e21) -
  Update move up and down registration and move blockMenuPlugin up in the fullPagePreset.

## 0.0.11

### Patch Changes

- [`f0b0ea63f59bc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f0b0ea63f59bc) -
  [ux] ED-28803 Register Delete Button in block menu and add delete functionality and hover styles
- [`580ef908f3abf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/580ef908f3abf) -
  ED-28592: Close menu after copy click
- Updated dependencies

## 0.0.10

### Patch Changes

- [`265c1bf0cefa4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/265c1bf0cefa4) -
  Sorted type and interface props to improve Atlaskit docs
- Updated dependencies

## 0.0.9

### Patch Changes

- [`9155252ad4c00`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9155252ad4c00) -
  [ux] copy link to the selected node in block menu
- Updated dependencies

## 0.0.8

### Patch Changes

- [`1bed58ba517b7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1bed58ba517b7) -
  [ux] BlockMenu will be opened to the left or the drag handle by default and to the right when
  there is no enough space.

## 0.0.7

### Patch Changes

- [`31fc6b9e10762`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/31fc6b9e10762) -
  [ux] ED-28592 ED-28592:Add copy block menu item to block menu
- Updated dependencies

## 0.0.6

### Patch Changes

- [`353075175e7ff`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/353075175e7ff) -
  [ux] ED-28584 Register move up and down options in block menu
- Updated dependencies

## 0.0.5

### Patch Changes

- [`3145f278b1f7a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3145f278b1f7a) -
  [ux] [ED-28473] minor UI updates for editor-toolbar
  - Use ADS ButtonGroup for ToolbarButtonGroup
  - Remove groupLocation prop and use CSS instead
  - Use DropdownItemGroup for ToolbarDropdownItemSection and expand props for section separator and
    title
  - Support ReactNode as content for ToolbarTooltip and add missing shortcuts in tooltips
  - Center Icons for split buttons and make chevron icon 24px wide
  - Align dropdown menu UI with current editor design

- Updated dependencies

## 0.0.4

### Patch Changes

- Updated dependencies

## 0.0.3

### Patch Changes

- [`c930aab37d2a6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c930aab37d2a6) -
  ED-28563: Block menu API to register menu items
- Updated dependencies

## 0.0.2

### Patch Changes

- [#199487](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/199487)
  [`53b66ca466092`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/53b66ca466092) -
  ED-28963 Update block menu to be aligned with drag handle
- Updated dependencies

## 0.0.1

### Patch Changes

- [#196697](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/196697)
  [`18b5fbc52627b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/18b5fbc52627b) -
  [ux] Adds block menu plugin for full-page preset and shows the menu when drag handle is clicked.
- Updated dependencies
