# @atlaskit/editor-core

## 149.0.0

### Major Changes

- [`71bb1bb3cd0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/71bb1bb3cd0) - [ED-12933] Replace TypeAhead node mark to ProseMirror Decoration

  # Minor change

  Type Ahead isn't a part of the document anymore. This version is introducing
  the Decoration system for this internal API.

  # Breaking Change

  We are replacing those public API:

  ```
  export { selectItem } from './plugins/type-ahead/commands/select-item';
  export { insertTypeAheadQuery } from './plugins/type-ahead/commands/insert-query';
  export { dismissCommand } from './plugins/type-ahead/commands/dismiss';
  export { insertMentionQuery } from './plugins/mentions/commands/insert-mention-query';
  export { insertEmojiQuery } from './plugins/emoji/commands/insert-emoji-query';
  ```

  If you need those behavior, please use this new one:

  ```
  export { createTypeAheadTools } from './plugins/type-ahead/api';
  export { createQuickInsertTools } from './plugins/quick-insert/api';
  ```

  Before:

  ```
  import {
    insertTypeAheadQuery,
    insertMentionQuery,
    dismissCommand,
  } from '@atlaskit/editor-core';

  // open the typeahead menu for mention
  insertMentionQuery(editorView.state, editorView.dispatch);

  // insert item
  insertTypeAheadQuery(editorView.state, editorView.dispatch);

  // close type ahead menu
  insertTypeAheadQuery(editorView.state, editorView.dispatch);
  ```

  Now:

  ```

  import {
    createTypeAheadTools,
  } from '@atlaskit/editor-core';

  const tools = createTypeAheadTools(editorView);

  tools.openMention();
  tools.insertMention();
  tools.close();
  ```

### Minor Changes

- [`ad67f6684f1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad67f6684f1) - Add MediaInline to ADF Stage0 schema
- [`2a6a10f9c5f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2a6a10f9c5f) - CETI-29 Updated emoji picker toolbar icon for custom panels
- [`5bafe5d2ccf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5bafe5d2ccf) - Add a new attribute to existing prop elementBrowser to pass a function to render Marketplace component for app discovery
- [`53d81fa08ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/53d81fa08ee) - CETI-14 added functionality to hide emoji from custom panel
- [`bd510f46bff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bd510f46bff) - CETI-30 added functionality to add custom panel via the slash command
- [`6f9352d04b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6f9352d04b5) - analytics for beautiful emoji panels
- [`511f07f7f7b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/511f07f7f7b) - allow enabling download for media card via enableDownloadButton feature prop
- [`d1a58a7a520`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1a58a7a520) - [ux] ED-12460 Implement collab scroll-to-telepointer: a user can now click on a collab avatar and be scrolled to another user's position in the document
- [`ab905c0e924`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ab905c0e924) - [ux] EDM-1641: add floating toolbar to media card and view switcher for inline view
- [`b95863772be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b95863772be) - Support external observers.
  Use better naming for refNode (refNode => reference).
  In favor of further work (supporting multiple references) pass array of references to Extension component.
  Expand node with localId for extentions.
- [`68c3a924b0c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/68c3a924b0c) - [ux] ED-13288: fixed ColorPickerField to work with fix color picker transformBefore()

### Patch Changes

- [`7d4bf49be6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d4bf49be6d) - CETI-2 Gracefully exiting the beautiful panel analytics when previousColor=== color | previousIcon=== icon. Such that we are not sending redundant analytics
- [`33a3f8baf8a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/33a3f8baf8a) - ED-12787 fixed issue with misaligned sticky header shadows with stickyHeadersOptimization on
- [`387c68f623c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/387c68f623c) - [ED-13558] Add the TypeAhead VIEWED and RENDERED events to the popup component
- [`099e8495f3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/099e8495f3d) - CETI-37 - Fixed custom panel icon sizing and alignment
- [`5e1c18076db`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e1c18076db) - [ED-13550] Fix Mention and Emoji toolbar menu disable when the TypeAhead menu is open
- [`b5072618005`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b5072618005) - ED-13347 Prevent list toolbar from crashing when the list state does not exist
- [`146ca2d6009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/146ca2d6009) - CETI-24 Copy and paste custom panels makes page unresponsive
- [`56129bdfc79`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56129bdfc79) - Upgrade to the latest version of @atlaskit/modal-dialog.
- [`47f2d84b5ac`](https://bitbucket.org/atlassian/atlassian-frontend/commits/47f2d84b5ac) - [ED-13567] Fix mobile typeahead API when its open
- [`b90c0237824`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b90c0237824) - Update package.jsons to remove unused dependencies.
- [`363971afa29`](https://bitbucket.org/atlassian/atlassian-frontend/commits/363971afa29) - [ux][ed-13574] Resolving a regression in the quick insert in mobile. A hotfix was merged to master a week ago to fix mobile feature flags, which seems to have clashed with changes in develop resulting in quick insert no longer working on mobile and a bunch of mobile integration tests failing.

  This change includes making quick insert work on mobile again by making sure the tracker isn’t reset every time CC @Sean Chamberlain

  All tests with configureEditor now have a way to refocus the editor after the config is set and before any document changes are made.

  New mobile integration tests have been added for feature flags to ensure we don't have any further regressions with mobile feature flags.

- [`6c2c8a1b3a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c2c8a1b3a5) - EDM-2288 Implement analytics attribute for paste link on text
- Updated dependencies

## 148.0.0

### Major Changes

- [`96c6146eef1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/96c6146eef1) - ED-13187: localId optional & empty values filtered
- [`86503f6d38f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/86503f6d38f) - [ux] Fixup the divider being inserted below the cursor on mobile using quick insert and when using shortcuts in web editor
- [`1dee7b71aee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1dee7b71aee) - ED-12500 distribute columns feature flag cleanup

### Minor Changes

- [`ea1cb28fb03`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea1cb28fb03) - CETI-3 User is able to change emoji and background color when selected
- [`c796dfa0ae4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c796dfa0ae4) - [ME-1589] Rearchitect the adaptive toolbar solution for the editor mobile bridge.

  - Add a new plugin to editor-core that allows you to subscribe to events when the editor view is updated.
  - Created a subscription that allows you to listen to toolbar and picker plugin updates.

- [`86aeb07cae3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/86aeb07cae3) - EDM-2264: allow embed resize events from all domains

  **Note:**

  The breaking change in this commit is a rename from `IframelyResizeMessageListener` to `EmbedResizeMessageListener`. The functionality of the component itself remains the same for all consumers.

- [`d2911917e8e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2911917e8e) - [ux] ED-12991: added ability to collapse a table, flagged via table.allowCollapse option

  - feature can be accessed via table floating toolbar item "table options"
  - hidden when flag is off or expands are not in the schema
  - option to collapse is disabled when table is currently in an expand OR when collapsing will result in an invalid ADF state
  - option to collapse will be ticked if the table is currently in an expand

- [`6de7ba8ca3b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6de7ba8ca3b) - ED-12424 Add scrollTo function to extension api
- [`e2e02bf0bd7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e2e02bf0bd7) - Removed mobile auto scrolling as it has been fixed elsewhere and renamed the mobile scroll plugin to mobile dimensions plugin to better represent its purpose.

### Patch Changes

- [`c0b7c19909b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0b7c19909b) - [ux][ed-12164] Fix for smart quotes overriding text formatting by doing a replace on the individual quotes and not including inner content
- [`aa6f29f8c3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa6f29f8c3d) - Setting up empty string value for alt attribute (images) by default
- [`a84a23aac69`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a84a23aac69) - ED-12917 Fix issue converted smart char to ascii inside inline code
- [`745605cc84e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/745605cc84e) - Higlight removed component when remove button is focused
- [`a7ffff656ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a7ffff656ad) - [ux][ed-11714] Adding an additional edge case check to the paste plugins transformPastedHTML. We're checking for cases of invalid HTML where there are nested links (eg. <a><a></a></a>) which occurs when a user pastes a list item block from Notion that contains a link as the first element). Two new utils, one to find these cases, and the other to fix the html enough to be parsed correctly.
- [`f3d416fc608`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3d416fc608) - Set correct alt text based on icon url [ListItem]
- [`5f6d2350dc0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f6d2350dc0) - ED-12391 Add special case to fix markdown for network paths
- [`15d14d67db0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/15d14d67db0) - ED-13010: track extension details when config panel is shown for extensions
- [`2aef13b22d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2aef13b22d8) - ED-12604: add localId for tables and dataConsumer mark for extensions in full schema
- [`501650d5d6c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/501650d5d6c) - Change type of emoji-picker to select with selectType of emoji
- [`0a30f9abe5b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0a30f9abe5b) - Add analytics to floating toolbar actions in links
- [`d68173a8c8d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d68173a8c8d) - manually update smart-links appearance translations
- Updated dependencies

## 147.0.1

### Patch Changes

- [`61eabb132cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61eabb132cd) - [ux][ed-13498] This solves a regression that has popped up in the editor-mobile-bridge version 28.0.0 where changes made to feature flags in the editor config are not triggering the shouldReconfigureState function which updates the state and applies the feature flag change.

## 147.0.0

### Major Changes

- [`5e55b55d035`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e55b55d035) - [ux][ed-9961] Remove the predictable lists feature flag and the legacy lists plugin so that predictable lists is default.

  Doing this by removing the lists plugin, removing the predictableLists feature flag, renaming lists-predictable to just list, refactoring any areas of the code that used the feature flag or the legacy lists still.

  This is a breaking change but has been thoroughly tested locally & with a team blitz on the branch deploy, on both web & mobile.

### Minor Changes

- [`3aa96b1de23`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3aa96b1de23) - [ME-1416] Show the floating toolbar based on the state and not the plugin state
- [`adccfcdafd8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/adccfcdafd8) - [ux] ED-13043 Add experimental `__hideFrame` option in extension manifest for extension nodes. This removes the border in edit mode to bring it closer to WYSIWYG. This cannot be opted into for the 'mobile' appearance & frames will continue to always show.
- [`5ad6ec7af6f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ad6ec7af6f) - Change selection plugin multi dispatch to append transaction
- [`450a8582760`](https://bitbucket.org/atlassian/atlassian-frontend/commits/450a8582760) - Added editor re-render analytics event.
- [`abf8b155d75`](https://bitbucket.org/atlassian/atlassian-frontend/commits/abf8b155d75) - [ME-1416] Remove multi dispatch occurance from the panels plugin. Make the floating toolbar items rely only on the node not what is in the plugin state.
- [`3faba8bc192`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3faba8bc192) - Refactor floating toolbar plugin to now store a function to retrieve current toolbar config

### Patch Changes

- [`ef89f94969d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ef89f94969d) - ED-13262 Fix and unskip integration table auto size
- [`b7ceb849775`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7ceb849775) - ED-12977 allow mouseMoveOptimization only when tableCellOptimization is on
- [`121b8280a98`](https://bitbucket.org/atlassian/atlassian-frontend/commits/121b8280a98) - Fixed typo
- [`3d363ebc5e7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3d363ebc5e7) - ED-13000: Capture browser extension usage in error analytics
- [`b015fe86197`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b015fe86197) - [ux] Gutter size for mobile editor lowered from 50px to 36px
- [`6881fe2f483`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6881fe2f483) - ED-9828 additional empty codeblock check for backspace keymap
- [`9dd40e58f82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9dd40e58f82) - Allow beautiful panel customisation on android
- [`6c0fb7a0bd1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c0fb7a0bd1) - Change default placeholder color
- Updated dependencies

## 146.0.3

### Patch Changes

- [`1a2d907b45f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a2d907b45f) - [ux][ed-13470] Hotfix to increase the moment the toolbar begins to collapse / scroll to medium instead of small due to an increase in width of toolbar contents.

## 146.0.2

### Patch Changes

- [`a572da3653e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a572da3653e) - HOT-96031 Extension with no localId were not showing context panel

## 146.0.1

### Patch Changes

- [`414b6216adf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/414b6216adf) - Upgrade date-fns to ^2.17
- Updated dependencies

## 146.0.0

### Minor Changes

- [`dc5951fa724`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc5951fa724) - Allows the editor mobile bridge plugin subscription listeners to optionally only update once the dom has been rendered. Also adds fix for inserting a date not triggering a toolbar update.
- [`bc3a0ad32d3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc3a0ad32d3) - ED-12998 Add docStructured to ErrorBoundary
- [`6a0a7c704cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a0a7c704cd) - ED-12998 Add docStructure to synchrony error analytic events
- [`bfef6a174d1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bfef6a174d1) - Stop date plugin from firing a plugin state update for every selection, even if it is not date related.

### Patch Changes

- [`fdb1b30696a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdb1b30696a) - [ux][ed-13102] Add in an override for list-style-type for ul within the toolbar to ensure no styles from the 'wiki-content' class in Confluence override styles the toolbar.
- [`95f09e76dd8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/95f09e76dd8) - Updated paste link over text rules to always be prioritised
- [`8bc06ca395f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8bc06ca395f) - [ux] EDM-2086 Re-resolve smart link when changing URL
- [`7ae504a8679`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ae504a8679) - Changes the message in the linking toolbar
- [`e2a10bdf7ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e2a10bdf7ea) - [ux] Floating toolbar - Change active color for delete button
- [`7a608fd13b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a608fd13b2) - Pin re-resizable version since later minor versions are causing trouble
- [`bb3f2dac40b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bb3f2dac40b) - ED-12467: include extension name for type performance analytics events
- [`1648ac429ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1648ac429ee) - [ux] Updated to use the new `@atlaskit/select` design.
- [`6720f568f2b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6720f568f2b) - EDM-983: Fix media max width when inside nested nodes
- [`b7209ee597c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7209ee597c) - No longer make a new paragraph for nodes other than a caption
- Updated dependencies

## 145.0.4

### Patch Changes

- [`2725933f7ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2725933f7ba) - [ux] ED-13331 Fix autoformatting being triggered after any keypress

## 145.0.3

### Patch Changes

- [`c48b38bf577`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c48b38bf577) - ED-13281 - Hotfix to ensure insert toolbar popup renders into popupMountPoint dom node when passed

## 145.0.2

### Patch Changes

- [`e780cc4e0cb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e780cc4e0cb) - Breadcrumb clicking fix

## 145.0.1

### Patch Changes

- [`d316627b838`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d316627b838) - Fix mouse click event on hyperlinktoolbar

## 145.0.0

### Major Changes

- [`0b9318d5c23`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b9318d5c23) - ED-11952 updated extension interface to allow dynamic toolbar buttons.
  BREAKING CHANGE: `ExtensionModules.contextualToolbarItems` has been removed in favor of `ExtensionModules.contextualToolbars`.

  `ExtensionModules.contextualToolbars` consist of a list of `ContextualToolbar` which has the following signature:

  ```
  type ContextualToolbar = {
    context: ToolbarContext;
    toolbarItems: ToolbarItem[] |
      ((contextNode: ADFEntity, api: ExtensionAPI) => ToolbarItem[]);
  };
  ```

- [`2f3e5d1beb5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2f3e5d1beb5) - [ux] Fix media alignment lose when copy-and-paste into table/layout

### Minor Changes

- [`a8c2596ed8e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a8c2596ed8e) - Add smartLinks prop to Editor and mark UNSAFE_cards as deprecated
- [`9fef23ee77c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fef23ee77c) - ED-12477 Add unsupported node capability to Media Group
- [`190b1333d06`](https://bitbucket.org/atlassian/atlassian-frontend/commits/190b1333d06) - [ux] EDM-1733: Add separator between unlink and remove button in smart card floating toolbar
- [`1a880dc5cce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a880dc5cce) - ED-11853 Update extension plugin editExtension to rely on localId instead of current selection
- [`a8b65e3ec2d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a8b65e3ec2d) - [ux] ED-13083: fixed serialize() for Tabs and Expand fields
- [`5783530b152`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5783530b152) - Added a new DSL in the mobile bridge to interpret a FloatingToolbarDatePicker. This extends from the FloatingToolbarSelectType.
- [`fa236537b70`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa236537b70) - Allow the mobile bridge to insert a date node
- [`19568bf5587`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19568bf5587) - Updated floating toolbar types to reflect new changes.Some of the floating toolbar types are adjusted and new ones are added. This was done to scale better and be more flexible to support the mobile editor.

      - FloatingToolbarInput now has id, title and description. These are used to generate a proper UI.
      - FloatingToolbarCustom has a mandatory fallback field. This is needed to support to mobile. Custom type uses a react render which has no metadata for the mobile. This is mandatory because we always want to have a fallback. For now, existing usages has an empty array but we will update them later on. Note that it is an array because fallback could be multiple items.
      - FloatingToolbarSelect has an additional type parameter for the options. FloatingToolbarSelect is extended to support different pickers. i.e. Color picker, emoji picker. In addition to the new type parameter, selectType and title fields are added. selectType is used to determine which type of UI needs to be used. color, emoji, date or list. Default one is list.
      - A new type is added. FloatingToolbarColorPicker. It extends select and selectType is color.

- [`4a0479a7ac1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a0479a7ac1) - [ux] Remove extra padding on the mobile editor
- [`45de4805196`](https://bitbucket.org/atlassian/atlassian-frontend/commits/45de4805196) - [ux] Add mention prop to editor core. This prop accepts HighlightComponent which is a component rendered at the top of the mention list. It also accepts mentionInsertDisplayName which was moved from the top level editor core api.
- [`66f17386ed6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/66f17386ed6) - [ux] ED-13022: Show a confirmation modal when clicking the delete button of a referenced table

### Patch Changes

- [`d05cb164f3f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d05cb164f3f) - NO-ISSUE dereference default export of async imported modules for better interop
- [`9752e454eff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9752e454eff) - Editor core => ColorPalette => add aria-label attribute to editor "text color" buttons
- [`00411ef7712`](https://bitbucket.org/atlassian/atlassian-frontend/commits/00411ef7712) - Fix cursor going inside/behind inline SmartLinks on backspace when SmartLinks is the last element on the paragraph
- [`d3e90d967f7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3e90d967f7) - ED-13002 Add error boundary around table context button component
- [`053577a0aa5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/053577a0aa5) - fix MediaSingle videos danger hover styles
- [`94448f306ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/94448f306ed) - AK-330 Fix editor toolbar and quick insert menu items pronounced twice by screen readers
- [`8077212e27e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8077212e27e) - ED-13095 Config panel: Fixed initial params are not set for nested fields.
  ED-13084 Config panel: Added a workaround for data lost in tabs when submitting.
- [`11c23085db7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/11c23085db7) - [ED-11076] Fix lists paste cursor position
- [`49026835944`](https://bitbucket.org/atlassian/atlassian-frontend/commits/49026835944) - Fix analytic events for captions
- [`b7473d81e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7473d81e1f) - [ux] ED-13053 Config panel: fixed mixed name/label on tabs
- [`a8baf001d81`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a8baf001d81) - ED-12999 Add more granular error boundaries to the editor
- [`5fca338c05d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5fca338c05d) - ED-12982 increase the expand chevron icon
- [`b943d1e7584`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b943d1e7584) - EDM-1847: prevent toolbars closing when text is selected in the toolbar using a mouse and the click is released outside the toolbar
- [`f94924f5fe3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f94924f5fe3) - EDM-1365 fix gap cursor clear:none
- [`79a06f80717`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79a06f80717) - Hyperlinks => HyperlinkAddToolbar add screenreader text to announce what "search recently viewed links" field does, add a possibility to announce search results
- [`b0dd3dd331f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0dd3dd331f) - Add metadata to hyperlink toolbar
- Updated dependencies

## 144.1.3

### Patch Changes

- [`139a522574f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/139a522574f) - Change selector for checking if breadcrumbs where clicked with click-area-helper

## 144.1.2

### Patch Changes

- [`5d7f119c55d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d7f119c55d) - Fix bread crumb issue

## 144.1.1

### Patch Changes

- [`9b9ca925f18`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b9ca925f18) - ED-13109 Fix inline extension insertion behavior

## 144.1.0

### Minor Changes

- [`92c1a74eb2d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/92c1a74eb2d) - [ux] ED-13083: fixed serialize() for Tabs and Expand fields

### Patch Changes

- [`6bbd57f1499`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6bbd57f1499) - ED-13095 Config panel: Fixed initial params are not set for nested fields.
  ED-13084 Config panel: Added a workaround for data lost in tabs when submitting.
- [`547024df2b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/547024df2b8) - [ux] ED-13053 Config panel: fixed mixed name/label on tabs
- Updated dependencies

## 144.0.4

### Patch Changes

- [`9e09b407b43`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e09b407b43) - Exclude `__tests_external__` from the `build/tsconfig.json`.
  Add `local-cypress` and remove types export.

## 144.0.3

### Patch Changes

- [`070261ec304`](https://bitbucket.org/atlassian/atlassian-frontend/commits/070261ec304) - Fix Cypress types for packages

## 144.0.2

### Patch Changes

- [`6abc1fb5b10`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6abc1fb5b10) - Change default value for displayInlineBlockForInlineNodes feature flag

## 144.0.1

### Patch Changes

- Updated dependencies

## 144.0.0

### Major Changes

- [`566f674ac8f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/566f674ac8f) - _Removes_ `allowReferentiality` & `UNSAFE_allowDataConsumer` props from editor props.
  These can now be toggled via the feature flags prop, e.g.

  ```tsx
  <Editor
    featureFlags={{
      'allow-local-id-generation-on-tables': true,
      'allow-data-consumer': true,
    }}
  />
  ```

- [`ddecaf6f306`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ddecaf6f306) - ED-12436 remove 'allowLocalIdGeneration' from Editor as extension localId is added to full schema

### Minor Changes

- [`d5c4ee88681`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d5c4ee88681) - [ux] ED-2942 Add option to enable sticky toolbar in the comment/standard editor.

  Enabled using the `useStickyToolbar` editor prop.

  If specified as `true`, the sticky toolbar will be enabled, sticking to the top of the scroll parent. Instead a reference can be specified to an existing sticky toolbar on the page that the editor toolbar should stay below (experimental).

- [`e66cd2fe716`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e66cd2fe716) - ED-12655: added support for config panel tabs
- [`2e51fbd1db2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e51fbd1db2) - [ux] ED-12733 Remove option to clear config panel select fields if there is a default value set.
- [`11b9305ca1b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/11b9305ca1b) - [ux] ED-12649 add ColorField definition and UI to ConfigPanel
- [`2fd50f55028`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2fd50f55028) - Updating documentation to inform users that soon picker popup will no longer be available and also getting rid of picker popup references in examples and all the associated dependencies
- [`8824d7de512`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8824d7de512) - ED-12143 Paste performance analytics event added.
- [`5d8e5bd7d50`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d8e5bd7d50) - [ux] Added support for dynamic getFieldsDefinition() in Editor Extensions.

  Made changes to the extension config panel fields so it triggers a submit only if the field is "dirty".

- [`084abc13201`](https://bitbucket.org/atlassian/atlassian-frontend/commits/084abc13201) - ED-12265 Add unsupport content support to media single
  ED-12265 Remove `caption` from default schema - Renderer
- [`9c449f9852b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9c449f9852b) - [ux] Moved the avatar group into an actual plugin container to the left of findreplace. Findeplace also got a minor centering fix in css and has to adjust its css based on whether the avatar group feature flag is on or not.
- [`7fbdeb26e81`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7fbdeb26e81) - Upgrade editor-core to directly import languages from @atlaskit/code.

### Patch Changes

- [`6ab1b4e3739`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ab1b4e3739) - [ux] ED-12739 polish expand field UI
- [`77751bd59e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/77751bd59e3) - Generate localIds for existing tables
- [`e9265f59ae7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9265f59ae7) - ED-12651 add analytics to color-picker-button
- [`cb105ce0163`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb105ce0163) - ED-12985 make color picker one line
- [`5fba22a5a21`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5fba22a5a21) - [NO ISSUE] Move Table Sort Custom Step to the ADF package
- [`cef4a451c74`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cef4a451c74) - [ux] ED-12658 added error boundary around config panel FormContent to catch unexpected errors without breaking the editor

  Added ConfigPanelCrashedAEP for tracking config panel crashes

- [`c193ef62683`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c193ef62683) - ED-12810 relocate color picker ui from within panel plugin to a general ui
- [`35645d7d1b7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/35645d7d1b7) - ED-12762 Prevent nesting of GroupingFields (for now)
  Added localization for expand field
- [`4edb69b3efc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4edb69b3efc) - NO-ISSUE remove-unused-comment-in-extension-api-file
- [`3c48c4147d1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c48c4147d1) - ED-12966: fix language selection highlight
- [`31d42e77267`](https://bitbucket.org/atlassian/atlassian-frontend/commits/31d42e77267) - Add back initial preventDefault behaviour to the click-area-helper
- [`ee023b6f981`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ee023b6f981) - ED-12603 fixed issue with navigating into the table via keyboard
- [`5e2f53b2a14`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e2f53b2a14) - add classnames to RemovableField for easier targeting
- [`427bdfcd794`](https://bitbucket.org/atlassian/atlassian-frontend/commits/427bdfcd794) - Fix undo MediaSingle resize
- [`fa92b08d5a7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa92b08d5a7) - ED-12981 remove paddings from tab in config panel
- [`de1ea3645b1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/de1ea3645b1) - [ux] extension config panels; fixed bug with custom/date/daterange fields not applying changes

  - renamed OnBlur > OnFieldChange, onFieldBlur/onBlur > onFieldChange, WithOnFieldBlur > WithOnFieldChange
  - removed blur event listeners on components which only update during onChange

- [`88a1b60b052`](https://bitbucket.org/atlassian/atlassian-frontend/commits/88a1b60b052) - ED-12789 fixed chart macro doesn't respect width adjustment
- [`1f493e1dc65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f493e1dc65) - Bump `react-select` to v4.
- [`b8ec1d5de7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8ec1d5de7d) - [ux] NO-ISSUE polish expand ui for margin bottom
- Updated dependencies

## 143.1.2

### Patch Changes

- [`312a2810b0b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/312a2810b0b) - [ux] ED-12931 Fix input rules replacing text outside of matched word in a long paragraph

## 143.1.1

### Patch Changes

- [`8efef26a27e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8efef26a27e) - [COLLAB-683] Fix editor collab plugin to always call the send function from collab provider when the native collab is enabled

  # Why?

  The new collab service uses the sendableSteps stored
  at the `prosemirror-collab` plugin. There is no need for Editor
  to stop this to been called.

## 143.1.0

### Minor Changes

- [`1fbe305bf7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1fbe305bf7d) - ED-12273 Unsupported content support for Layout
- [`90cb0207d4e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/90cb0207d4e) - Make code block content dynamic to different font sizes.
- [`f973bb5dde8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f973bb5dde8) - [ux] ED-12782 Remove codeblock languages from adf-schema

  BREAKING CHANGE

  `@atlaskit/adf-schema` is not longer exporting: `DEFAULT_LANGUAGES`, `createLanguageList`, `filterSupportedLanguages`, `findMatchedLanguage`, `getLanguageIdentifier` and `Language`. This are now used internally in `@atlaskit/editor-core`

- [`225c79d708a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/225c79d708a) - Simplify unique ID appendTransaction
- [`81a08ceb2e0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81a08ceb2e0) - ED-12653 added field definitions for GroupingField and ExpandField.

### Patch Changes

- [`3832da8481b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3832da8481b) - [ED-12772] Reconfigure the editor state when an editor props feature flag changes
- [`4e77e02a234`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e77e02a234) - ED-12769 Update editor example pages to point new JDog instance
- [`b0f14fe83a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0f14fe83a5) - ED-12715: set initial value for refNode in ExtensionWithDataSource and emit on table deletion
- [`de8814276f1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/de8814276f1) - Update editor content area context panel gutter margin to padding instead. This is to fix a bug with width emitter not including margin in the width.
- [`e90db7597b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e90db7597b2) - [ED-12772] This PR adds the feature flag for 'useUnpredictableInputRules' to the mobile bridge. When set to false, the new predictable input rules code will be used for auto-formatting.
- [`37cf63fa6b9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37cf63fa6b9) - ED-12465 add analytics to extensionAPI.doc.insertAfter()
- [`53211b3f035`](https://bitbucket.org/atlassian/atlassian-frontend/commits/53211b3f035) - ED-12442 workaround a codeblock selection issue on firefox.
- [`7fc538e08c0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7fc538e08c0) - ED-11781 Added overflowShadowOptimization to improve table overflow shadows performance
- [`2dbbed3493d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2dbbed3493d) - ED-12780 prevent offset duplicate code block content
- Updated dependencies

## 143.0.0

### Major Changes

- [`4befa7c039c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4befa7c039c) - ED-12593: rename ExtensionAPI.editInLegacyMacroBrowser() to \_editInLegacyMacroBrowser()

  Also cleaned up the options for createExtensionAPI() for easier use.

### Minor Changes

- [`9741a93417b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9741a93417b) - ED-12646 Add horizontal margin to editor content area when context panel is positioned over editor.

  Handled by adding new prop 'positionedOverEditor' to 'ContextPanelWidthProvider' which broadcasts whether the context panel is opened and positioned over (when there is enough space to open and not cover the editor area) the Editor content area instead of "pushing" it (when there isn't enough space to open the panel without covering the Editor).

- [`0fe1b02cf1a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0fe1b02cf1a) - ED-11790 Add analytics for onChange callback prop timing
- [`61c3c00a566`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61c3c00a566) - ED-12599 hook up onEditorReady callback analytics to only fire if enabled in performanceTracking Editor prop - e.g. performanceTracking={{ onEditorReadyCallbackTracking: { enabled: true } }}
- [`d401f589e88`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d401f589e88) - [ux] When a block node is the first node of the editor instead of selecting the node on load, it will insert a gap cursor in front. This is to alleviate issues where users will open a page with an image first, go to insert a new image and just replace the existing image because it's automatically selected and they didn't notice.
- [`33f40b09da3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/33f40b09da3) - ED-12729 Add container width to width plugin for use with context panel gutter calculation.
- [`d024b505c12`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d024b505c12) - [ux] ED-12598 Update extension config panel to close after saving if autosave is set to false
- [`0bc660b480b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0bc660b480b) - [ux] Allow extension of quickInsertAction with provided function for quickInsert plugin
- [`93d599c4044`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93d599c4044) - [ED-11915] Add new undo/redo behavior for autoformatting
- [`142f8d6c4e2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/142f8d6c4e2) - [ux] add role and aria-label for div
- [`0c2f73791da`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c2f73791da) - [ED-11915] Add useUnpredictableInputRule for editor prosemirror plugins
- [`00cf4f4451d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/00cf4f4451d) - Ensure context-panel doesn't delete marks
- [`3defe8bdf01`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3defe8bdf01) - Fix node mutation bug on extension insertion

### Patch Changes

- [`75a5f1e2489`](https://bitbucket.org/atlassian/atlassian-frontend/commits/75a5f1e2489) - Fix types for EventEmitters
- [`83eb0880a09`](https://bitbucket.org/atlassian/atlassian-frontend/commits/83eb0880a09) - [ED-12710] Fix hyperlink conversion when there is content before the link
- [`957abc45935`](https://bitbucket.org/atlassian/atlassian-frontend/commits/957abc45935) - Ensure localId never clashes for tables
- [`b95e9f97253`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b95e9f97253) - [ux][ed-12529] Add an additional catch to set smart links to display: inline to resolve a regression caused by setting inline nodes to display: inline-block (which solves selection issues).
- [`73fb0f146bd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73fb0f146bd) - [ux] Allow undo of text alignment when auto-formatting to a list
- [`a874f299a93`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a874f299a93) - [ED-12633] Fix paste + undo issue in a placeholder text
- [`8c84c29006b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c84c29006b) - Improve data-consumer mark being nested, aAdd basic doc tests for data consumer
- [`e20ad95e07f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e20ad95e07f) - implemented ExtensionAPI.doc.insertAfter()
- [`8510da483e5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8510da483e5) - added metadata property to floating toolbar buttons to use as a data payload for the mobile bridge
- [`e0e56c9d7d3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0e56c9d7d3) - Removed extra seperator in media floating toolbar when placed inside an expand
- [`e047cefd6ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e047cefd6ee) - ED-11929: handle table node mutation observation
- [`ac2eeccc60b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac2eeccc60b) - Update internal use of code block selector in editor packages.
- [`e0147cf2af5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0147cf2af5) - allowed autoformat to accept a comma to end matched rules
- [`a25e6616895`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a25e6616895) - allow Toolbar to update if the localId of a node differs
- [`9a77b3a5b06`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a77b3a5b06) - Only use Clipboard component when editor is focused
- [`693b2a6765b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/693b2a6765b) - Code snippet floating toolbar jumping only in kitchen sink bug fixed.
- [`7ba7af04db8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ba7af04db8) - Type fixes related to consumption of `@atlaskit/code`
- [`05c0e1cc1e5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/05c0e1cc1e5) - ED-12553 fix distribute columns bug on overflow table
- [`372a82eb975`](https://bitbucket.org/atlassian/atlassian-frontend/commits/372a82eb975) - [ux] ED-12587 Add ability to use • to insert a bullet list
- Updated dependencies

## 142.0.1

### Patch Changes

- [`c2c0160f566`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2c0160f566) - Bump editor-shared-styles to pick up relativeFontSizeToBase16
- Updated dependencies

## 142.0.0

### Major Changes

- [`864bae0214b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/864bae0214b) - Removed old methods for inserting a link as they were only being used by mobile. Fix hyperlink text removal on editor mobile bridge.

### Minor Changes

- [`262e3b64547`](https://bitbucket.org/atlassian/atlassian-frontend/commits/262e3b64547) - [ux] ED-12492 Remove blue overlay on selected extension to allow better visibility of extension content and improve accessibility.
- [`357edf7b4a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/357edf7b4a1) - ED-12266 Extend code block to support UnsupportedInline content.
- [`f042eac9bf1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f042eac9bf1) - Add SmartMentionResource to mentions with editor-core example
- [`818ad5911c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/818ad5911c9) - [ux] ED-12552 Add ability to clear optional Select fields in config panel

### Patch Changes

- [`8aed23756e2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8aed23756e2) - Change to injected version information for analytics
- [`df1da03ac3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df1da03ac3d) - define interface for api extension
- [`0919b985b3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0919b985b3d) - [ux][ed-12525] Fix regression caused by changing inline nodes to display inline-block. Pressing cmd + shift + arrow left was not working as expected but by adding user-select: all solves this. Integration tests added for this too.
- [`14050fe1345`](https://bitbucket.org/atlassian/atlassian-frontend/commits/14050fe1345) - Incorrect use of modal dialog types has been fixed.
- [`5a6e9efd99b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a6e9efd99b) - ED-12508 implement api stub
- [`573567c0132`](https://bitbucket.org/atlassian/atlassian-frontend/commits/573567c0132) - [ux][ed-12493] Made redo button tooltip have the Cmd icon instead of 'Mod' text by swapping mod for either Ctrl of Cmd in the makeKeymap function
- [`a1711bcd0c1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1711bcd0c1) - [ux] ED-12409 fixed issue with inline comment toolbar appearing on empty selection
- [`5c835144ef0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c835144ef0) - [ME-741][me-743] Remove PX references in editor packages and modify code block font size.
- [`7044e6988ac`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7044e6988ac) - Updated card toolbar snapshots to include id property
- [`d09597db582`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d09597db582) - ED-12505 Fix scoping of predictable lists input rule handlers
- [`e50673cfb2d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e50673cfb2d) - Import embedHeaderHeight from media-ui package instead of smart-card
- [`b4d175f5b2d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4d175f5b2d) - ED-12075: hide plus button for empty lists
- Updated dependencies

## 141.0.2

### Patch Changes

- Updated dependencies

## 141.0.1

### Patch Changes

- [`57ae710818f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/57ae710818f) - Turn off CustomSelect create animation in Config Panel

## 141.0.0

### Minor Changes

- [`769e10a40a7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/769e10a40a7) - ED-12108 Support duplicate named fields in config panel fieldset

  For a field to be allowed to have duplicates you must set `allowDuplicates: true` on the field definition

- [`330c1fce7f9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/330c1fce7f9) - ED-12264 Add unsupported content capability to panel and blockquote
- [`f27507bc838`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f27507bc838) - ED-12237: add editor referentiality plugin
- [`fff89761e3e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fff89761e3e) - [ux] ED-10732 implementation of Distribute Columns in table context menu

### Patch Changes

- [`150100fddec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/150100fddec) - ED-12006 Move event.preventDefault to only occur within ClickAreaMobile
- [`572ada5a337`](https://bitbucket.org/atlassian/atlassian-frontend/commits/572ada5a337) - [ED-12003] Fix cursor position at the end of inline nodes

  This patch will set all react inline nodes as display: inline-block. That will fix the current position issues we are having on Chrome when the user tries to put the mouse at the end of the inline node, like Emoji.

  However, this behavior can be disabled by feature flag if it's needed:

  ```
  <Editor
    featureFlags={{
      displayInlineBlockForInlineNodes: false,
    }}
   />
  ```

- [`752e64de8d3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/752e64de8d3) - ED-12105 Add analytics to onEditorReady callback duration
- [`be61d881112`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be61d881112) - Use localId for change detection
- [`649200b2318`](https://bitbucket.org/atlassian/atlassian-frontend/commits/649200b2318) - Removed extra seperator in embeds inside expands
- [`f1a18dadb8f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f1a18dadb8f) - [ux][ed-11974] Change the maxCount on the AvatarGroup component from default 5 to 3 to create more room in the toolbar. This is for the collab avatars.
- [`e82d44af176`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e82d44af176) - [ux][ed-11904] Remove secondary toolbar on comment if empty
- [`9c36253ed5e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9c36253ed5e) - ED-10216 Add sanitizeNode into @atlaskit/editor-json-transformer
- [`0293c05c966`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0293c05c966) - ed-12403: add compact stringification option to document-logger to decrease dispatchInvalidTransaction event payload size
- [`81a55b3fe71`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81a55b3fe71) - Reverting handling of dispatch being passed across two functions
- [`5089bd2544d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5089bd2544d) - ED-11919: generate localId for tables
- [`58b170725be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58b170725be) - Renamed @atlaskit/editor-test-helpers/schema-builder to @atlaskit/editor-test-helpers/doc-builder
- [`fcec9613a7e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fcec9613a7e) - Fix extension selection issue
- [`e2cc0eb2650`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e2cc0eb2650) - ED-12480: Fixes bug where quick insert would combine feature sets from two editors
- [`3d4caa9e46f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3d4caa9e46f) - Turn off Atlaskit Select create animation in Config
- Updated dependencies

## 140.0.0

### Major Changes

- [`5a02668a6f1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a02668a6f1) - [ED-12169] Removes the following methods being exposed from `@atlaskit/editor-core`

  ```
  indentList
  outdentList
  toggleOrderedList
  toggleBulletList
  ```

  Instead, these methods are replaced by a getter function `getListCommands` that allows opting into the new predictable list behaviours.

  BEFORE

  ```
  import { indentList } from '@atlaskit/editor-core';
  indentList(inputMethod)(editorView.state, editorView.dispatch);
  ```

  AFTER

  ```
  import { getListCommands } from '@atlaskit/editor-core';
  getListCommands(
    isPredictableListEnabled,
  ).indentList(inputMethod)(
    editorView.state,
    editorView.dispatch,
  );
  ```

- [`db9dec112b1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db9dec112b1) - ED-10613: clean up text colour experiment
- [`f33c11a9d0f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f33c11a9d0f) - PluginStates types in render of WithPluginState added.
- [`26da2d23264`](https://bitbucket.org/atlassian/atlassian-frontend/commits/26da2d23264) - ED-8985 Remove deprecated transactionTracking prop
- [`d2a715d1130`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2a715d1130) - ED-10260 Remove deprecated inputSamplingLimit prop

### Minor Changes

- [`811d400dbd0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/811d400dbd0) - [ux] ED-12109 - Update Config Panel DateRange field custom "from" and "to" fields to be optional. Previously when DateRange value was "custom", the "from" and "to" fields were required by default. This update will allow "isRequired" prop to be passed on to "from" and "to" fields.
- [`6d748ea5140`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6d748ea5140) - New stage-0 data consumer mark in ADF schema
- [`5b0477e64f6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b0477e64f6) - [ux] ED-11418 - Remove "Match case" button focus after click to fix bug with selection being updated. This is a workaround to fix the matched search being updated after "match case" is toggled.
- [`39a4c042483`](https://bitbucket.org/atlassian/atlassian-frontend/commits/39a4c042483) - ED-11072 WithPluginState infer states based on the pluginKey
- [`af2b3d57f85`](https://bitbucket.org/atlassian/atlassian-frontend/commits/af2b3d57f85) - ED-12238 expose dangerouslyAppendPlugins API for plugin injection
- [`31253d55150`](https://bitbucket.org/atlassian/atlassian-frontend/commits/31253d55150) - [ED-12132] Enable responsiveness for texting formatting toolbar menu

  This PR will introduce a new option to the text formatting plugin "textFormatting.responsiveToolbarMenu: boolean".

  When this option is true, Bold and Italic buttons will be hidden inside the toolbar menu when the viewport is less than 480px. For now, we are using this configuration for Undo Project only.

  # New Editor Props:

  ```
    <Editor
      textFormatting={{
        responsiveToolbarMenu: true,
      }}

    />

  ```

- [`b7e61c08ef5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7e61c08ef5) - [ux] ED-11916 Extended floating toolbars on table and exension nodes with buttons that can be provided by extensions
- [`5dd24d55d31`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5dd24d55d31) - [ME-536] Added unique identifiers for each floating toolbar capability in order to distinguish them. This was needed for mobile to filter out some capabilities that are not available as well as set actions for custom buttons.

### Patch Changes

- [`d0892017fb3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0892017fb3) - Improve kitchen sink handling `unsupportedNodeAttribute` cases
- [`df18d9fe342`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df18d9fe342) - [ux] ED-12340 Remove mouse positioning on tooltip on items in element browser UI, it will now default to position tooltip below the item

  This affects both the insert menu and the element browser when the `elementBrowser` prop is configured

- [`351001c0366`](https://bitbucket.org/atlassian/atlassian-frontend/commits/351001c0366) - ED-12397: Add analytics tracking to editorActions getValue calls
- [`3d4094f6eff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3d4094f6eff) - [ux] set minWidth on full page toolbar when undo redo is enabled to prevent overlapping buttons on smaller devices
- [`b94ebf23e84`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b94ebf23e84) - ED-11863: Fix - update extension to allow extension manifest with empty parameters
- [`7a6420be0e2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a6420be0e2) - [ED-12063] Predictable List: Copying a Nested Sublist to an empty panel results to a no-operation
- [`31a0f2723b9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/31a0f2723b9) - Fixed potential 404 call on /file/{id}/image/metadata in mediaNodeUpdater
- [`d0060c9bc7a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0060c9bc7a) - ED-12313 add separators in between toolbar items
- [`05ffc60fd6e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/05ffc60fd6e) - [ux] ED-7874: don't resize columns when toggling numbered columns option on a table
- [`e664334062d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e664334062d) - [ux] ED-11603: fixed creation of codeblock via markup when it includes bold text
- [`d2e70ebaaa9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2e70ebaaa9) - NO-ISSUE: updated editor tests to use 'doc: DocBuilder' instead of 'doc: any'
- [`fe1c96a3d28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe1c96a3d28) - added DocBuilder type to @atlaskit/editor-test-helpers, replaced duplicate definitions and DocumentType
- [`c119fdd32e7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c119fdd32e7) - Internal change to update usage of the custom `glyph` prop in @atlaskit/icon.
- [`b2a2c3cf8d1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2a2c3cf8d1) - [ux] ED-8566 Add internationalisation for alignment buttons
- [`937ccae721d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/937ccae721d) - [ED-11971] - Remove multi-dispatch calls in the editor codebase
- [`51acc122625`](https://bitbucket.org/atlassian/atlassian-frontend/commits/51acc122625) - [ux] ED-12382: fixed color not showing up as red for overdue dates nested in actions upon editor init
- [`9586ac165a6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9586ac165a6) - ED-12188 Fix sticky header flicker preview
- [`ee188b01fc0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ee188b01fc0) - ED-12339 added adf information to be passed into extension button on click action
- [`8baca10d489`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8baca10d489) - ED-12178 ED-11099 Fix inline extension style issues
- [`d1c48d92b73`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1c48d92b73) - [ED-120632] part 2. This is a bug fix I found in my original ticket. It fixes copying lists in panel and pasting it in another panel
- [`54a3c3fffee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a3c3fffee) - Emoji typeahead, selecting valid emoji on final ':', bug is fixed.
- [`487fc396b80`](https://bitbucket.org/atlassian/atlassian-frontend/commits/487fc396b80) - ED:12137: capture JS stack trace info via errorBoundary on editor crashes
- [`7baf62daafb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7baf62daafb) - EDM-1638: add media mobile VR test for captions
- Updated dependencies

## 139.0.3

### Patch Changes

- [`471e2431a7c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/471e2431a7c) - Downgrade back to date-fns 1.30.1
  We discovered big bundle size increases associated with the date-fns upgrade.
  We're reverting the upgarde to investigate

## 139.0.2

### Patch Changes

- [`e2fb7440936`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e2fb7440936) - ED-12430: Fix issue with Editor showing double scrollbar when context panel is visible.Update context panel to have same height as editor content area when using position absolute styles
- Updated dependencies

## 139.0.1

### Patch Changes

- [`70f0701c2e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70f0701c2e6) - Upgrade date-fns to 2.17

## 139.0.0

### Major Changes

- [`511a91ad376`](https://bitbucket.org/atlassian/atlassian-frontend/commits/511a91ad376) - [ux] ED-12128: Update Context Panel to use set width of 320px and remove 'width' prop.
  Remove 'width' prop from the Context Panel component as we no longer allow dynamic panel width to enforce consistency.

  All references to this component can safely remove the 'wdith' prop as it is no longer part of the component props.

- [`007103b93e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/007103b93e6) - [ux] ED-11993 Change behaviour of context panel so it will not push content if there is enough space to slide out without overlapping.
  Config panel will keep existing behaviour to push content if there isn't enough space to show without overlapping content. Also add width css transition to context panel content to mimic "slide in" animation.

  Add new shared const of `akEditorFullWidthLayoutLineLength` which indicates the line length of a full-width editor

### Minor Changes

- [`7eb8204486b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7eb8204486b) - ED-11975 Fix bug with Element browser category scroll position in Firefox
- [`5d37f7fc1f9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d37f7fc1f9) - Revert ED-9960. UNSAFE_predictableLists no longer defaulted to enabled.
- [`b74caaa43e9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b74caaa43e9) - add reserveCursor option to init event
- [`f208fc35a7b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f208fc35a7b) - ED-12172 Default `UNSAFE_predictableLists` to `true`
- [`a815affb9b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a815affb9b4) - [ux] ED-12038 Update Config Panel select component to have auto menu placement. This will position dropdown menu above the select input if there is not enough screen area to display below.
- [`d90182b6aef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d90182b6aef) - ED-11837 Scroll Gutter is not been added in full editor
- [`d33f17ed9b6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d33f17ed9b6) - ED-11153: additionally map tti values in editor tti event to severity strings
- [`be0bfb03f12`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be0bfb03f12) - [ux] Implement syntax highlighting in editor code-block
- [`968f152ef42`](https://bitbucket.org/atlassian/atlassian-frontend/commits/968f152ef42) - EDM-1673: use createMobileInlineDomRef for inline card when mobile appearance
- [`d513d80af55`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d513d80af55) - HyperLinktoolbar no longer takes onBlur and instead uses onSubmit to handle that case
- [`eb554a9d489`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb554a9d489) - ED-12048 Implement save indicator for config panel
- [`c675c4d9096`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c675c4d9096) - ED-12087 Config Panel with autosave mode will partial save invalid form
- [`4b7d23a926b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b7d23a926b) - ED-12052 When the Scroll Gutter plugin has `pluginOptions.persistScrollGutter` enabled, the gutter element will now only added while the document has content (not empty).

  > This option is typically used on mobile for the _Compact Editor_.

- [`85cc08ec2e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/85cc08ec2e6) - [ED-11353] Adds the input method for undo/redo events

  #Breaking Change

  `adf-schema`

  AnalyticsStep doesn't need the `handleAnalyticsEvent: HandleAnalyticsEvent<P>` anymore.
  We are submitting the events using the editor-core plugin `analytics`. On this file:
  `packages/editor/editor-core/src/plugins/analytics/plugin.ts`

  This will fix a hard to catch bug where the events were being dispatched before the transaction being applied.
  The transaction wasn't used, but the event was dispatched anyway, causing a data mismatch between user experience and actions.

- [`adba8407160`](https://bitbucket.org/atlassian/atlassian-frontend/commits/adba8407160) - [ED-11355] Improve undo predictability by adding a closeHistory everytime a user do a paste

### Patch Changes

- [`88920076196`](https://bitbucket.org/atlassian/atlassian-frontend/commits/88920076196) - ED-10584 yield to user interaction before sending analytics
- [`e98bae588e0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e98bae588e0) - NO-ISSUE pass through feature flags
- [`efacd2da78f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/efacd2da78f) - Add localId attribute on tables via "tableWithLocalId" node
- [`aaf3ca1459d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aaf3ca1459d) - Fix calendar position compatibility issue with will-change style bug
- [`3770eb71b69`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3770eb71b69) - [ux] Fix inline code bug on German keyboards using isComposing keyboard events
- [`8af9d636e29`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8af9d636e29) - ED-12127 fixed flickering issue when hovering on numbered column with tableRender optimisation on
- [`4f08f25ebfe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f08f25ebfe) - NO-ISSUE pass through feature flags into renderer
- [`178e91b75ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/178e91b75ad) - PL-AFDD-JOB1-158 Add translations for new messages
- [`ea2749f4489`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea2749f4489) - ED-12050: fixed card plugin toolbar using a stale state during getDomRef()
- [`2a2ecc1b6d5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2a2ecc1b6d5) - NO-ISSUE track code language changes
- [`03b29863b31`](https://bitbucket.org/atlassian/atlassian-frontend/commits/03b29863b31) - ED-12185 fix sticky header not working after toggling header rows for table
- [`7416411f8de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7416411f8de) - ED-12187 fix table sticky header flicker
- [`c3e840d3d05`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3e840d3d05) - [ux] ED-10865 Fix paste handler dropping paragraph content after list node on paste
- [`c50a63f9f72`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c50a63f9f72) - Upgrade `@types/react-select` to `v3.1.2` and fix type breaks
- [`d3e988ff4e1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3e988ff4e1) - ED-11799 gracefully handle invalid position errors
- [`b010a665e13`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b010a665e13) - Bump socket IO to version 3 for collab provider
- [`134e6ccab01`](https://bitbucket.org/atlassian/atlassian-frontend/commits/134e6ccab01) - EDM-1831: Revert EDM-1420
- [`02f4f8fbc96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/02f4f8fbc96) - ED-11476: made setTableRef() more strict on types to prevent an infinite transaction loop
- [`751db2a9a48`](https://bitbucket.org/atlassian/atlassian-frontend/commits/751db2a9a48) - ED-12040 Prevent required fields in fieldset to be removed or not shown
- [`809df0691f7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/809df0691f7) - [ED-12194] Add integration tests for undo & redo via toolbar buttons and keyboard shortcuts (in both Windows and Mac OS)
- [`e2bb7c1adbc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e2bb7c1adbc) - ED-9699 Fix codeblock in list within panel UI
- [`695ce4fe717`](https://bitbucket.org/atlassian/atlassian-frontend/commits/695ce4fe717) - Adds additional request access metadata to forbidden urls if avalible
- Updated dependencies

## 138.0.1

### Patch Changes

- [`a940fb90ccc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a940fb90ccc) - ED-11968: added function to determine difference in timing so it can be mocked during tests

## 138.0.0

### Minor Changes

- [`5ee57944f46`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ee57944f46) - ED-11948 Fix issue with table resize logic not retaining original node selection.
  Refactor table resize logic to retain selection after table resize.
- [`70fecd78610`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70fecd78610) - [ux] This commit includes UX changes to Cmd+K link toolbar

  - MouseLeave will now correctly cancel the highlight of the item
  - Press Enter will now always submit things in the input fields. Previously we were allowing MouseOver + Enter to submit selected item. This had caused many misoperations that user
    would accidently insert the link their mouse hovers on.
  - When a user iterate through result items with ArrowUp/ArrowDown, the URL field will be automatically populated with selected item's content. This is so that the ArrowKeys + Enter
    to select still works as expected.

  Refer to this RFC for more details of the decision https://product-fabric.atlassian.net/wiki/spaces/EM/pages/2168883953/EDM-RFC-18+Improve+mouseover+selection+experience+with+Link+Toolbar

- [`e0ec7e79fce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0ec7e79fce) - [ED-11251] Close editor undo history buffer every time the user press enter
- [`d335911aa2c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d335911aa2c) - The `ToolbarMention` component now includes a `testId` prop.
- [`b1faca325ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1faca325ab) - [ux] Add Undo Redo buttons under feature flag
- [`2cde1293d9f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2cde1293d9f) - [ux] `useAlternativePreloader` prop was added to `CardOptions`, which is type of editor prop `UNSAFE_cards`. Default value is true (if not defined). When `useAlternativePreloader` is true preloader experience for smart link components in editor will be different: there won't be normal smart link skeleton (border and a shaddow) and spinner is located on the right (compare to left as before). Note: renderer experience won't change.
- [`30b83e21da4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30b83e21da4) - ED-11870 Update Element Browser category item analytics to use fireAnalyticsEvent helper
- [`00b5f1d1beb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/00b5f1d1beb) - ED-11220 Fix element browser item tooltip hitbox area
- [`54e3474f640`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54e3474f640) - [ux] EDM-1420: Smart Links: Floating toolbar visible after display state change
- [`e18fc27f970`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e18fc27f970) - [ux] ED-11902 Fix bug with adding emoji via plus menu not working
- [`848d9fb54a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/848d9fb54a3) - ED-11875 align renderer to editor tab size in code-block
- [`56e5ed87897`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56e5ed87897) - [ux] ED-11981 Update config panel boolean (Checkbox) fields to autosave onchange instead of only onblur

### Patch Changes

- [`e07a815d377`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e07a815d377) - ED-11807 performance optimization for table sticky headers plugin
- [`5216ebed3b6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5216ebed3b6) - Expose and use atlassian-icon, jira-icon entry points
- [`b36f8119df5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b36f8119df5) - Add in keymap for moving to gap cursor from caption
- [`c3961b9d90f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3961b9d90f) - EDM-1679: add tooltip to smart link appearance switcher when options are disabled
- [`c6eb10bea9e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6eb10bea9e) - Fix `@atlaskit/calendar` typings
- [`b48fddb0c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b48fddb0c83) - Internal usage of icon now points to its new entrypoint instead of deep importing from dist.
- [`b94ee70e7d1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b94ee70e7d1) - ED-12008 Fix empty number field to resolve to 0 in config panel
- [`98309150746`](https://bitbucket.org/atlassian/atlassian-frontend/commits/98309150746) - Use spec based validator for the renderer in kitchen sink
- [`61e73eb1bad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61e73eb1bad) - ED-11994 add integration test to code block pasting from renderer
- [`ef52e0b0b5f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ef52e0b0b5f) - [ED-11387] Adds analytics redo event for toolbar button
- [`18d183a9db5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18d183a9db5) - [ED-11372] Add analytics event for ToolbarButton
- [`cf5909ab062`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf5909ab062) - [ux] Replaced the search icon with add icon in the invite item in the mention typeahead inside fabric-editor for invite from mention experiment (Growth)
- [`d8b3bb5ab78`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d8b3bb5ab78) - ED-10656 Implement generic solution for handling paragraph block marks
- [`152056bc522`](https://bitbucket.org/atlassian/atlassian-frontend/commits/152056bc522) - NO-ISSUE refetch items when getItems reference changes
- [`43b2f925f0b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/43b2f925f0b) - Add optional attributes to mentionProvider analytics callback
- Updated dependencies

## 137.0.3

### Patch Changes

- [`003a79ed2be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/003a79ed2be) - HOT-94478 Fix Editor selection reset problem on Chrome 88+

## 137.0.2

### Patch Changes

- [`8aa5285c47b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8aa5285c47b) - ED-12124 Fix plus menu search

## 137.0.1

### Patch Changes

- [`1ce3cd83260`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1ce3cd83260) - pass multiple option to media-picker Browser component so that one can select multiple files in native upload

## 137.0.0

### Major Changes

- [`4d65f8a67f4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d65f8a67f4) - [ED-11699] Persist scroll gutter for mobile COMPACT appearance and change mobile scroll gutter to 50px

### Minor Changes

- [`36480f3c6ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/36480f3c6ee) - ED-10297 guard catch-all performance tracking with feature flag
- [`8c90794239c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c90794239c) - ED-11587: quickInsert for placeholder-text plugin
- [`16dd9a6e934`](https://bitbucket.org/atlassian/atlassian-frontend/commits/16dd9a6e934) - NO-ISSUE clean up with optional chaining
- [`4e4f23da2ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e4f23da2ee) - ED-10585 close feature flag infrastructure gaps
- [`f48db072de7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f48db072de7) - ED-10585 optimize emoji nodeview
- [`6e854802c33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e854802c33) - [ux] ED-11215 Add help icon to new element browser
  Introduce new 'helpUrl' prop to elementBrowser which allow a help url to be passed to element browser component.
  E.g. elementBrowser={{ showModal: true, replaceMenu: true, helpUrl: 'https://examplehelpurl.com'  }}
- [`c330863ef3f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c330863ef3f) - Update margin and padding for element browser insert menu item
- [`cca3569e236`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cca3569e236) - ED-11647 Remove unnecessary rerender of table component for initial load. This is behind a feature flag `initialRenderOptimization`.
- [`b552334459c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b552334459c) - [ME-302](https://product-fabric.atlassian.net/browse/ME-302) Introduce table cell options in the floating toolbar for mobile.

  By default table cell options are disabled and hidden for the web.

- [`7ddbf962bd9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ddbf962bd9) - [ux] Updated and added new translations
- [`867b61b2698`](https://bitbucket.org/atlassian/atlassian-frontend/commits/867b61b2698) - ED-11692 add defaultOptions to CustomSelect to prevent calling resolver twice on mount.
  Resolve default options array on mount and pass array to AsyncCreatableSelect 'defaultOptions' prop. This prevents defaultOptions from calling the loadOptions / resolver again on mount.
- [`5c075025c14`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c075025c14) - ED-11640 table performance optimization for table component rendering - avoid extra re-renders on each transaction e.g. when typing
- [`67fd55dd3f1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/67fd55dd3f1) - ME-893 Added a new mobile editor configuration for placeholder text
- [`f48c16eb21d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f48c16eb21d) - ED-11383 Update extensions sidebar select-item icon vertical alignment
- [`bf8e85f044d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf8e85f044d) - Add remove button to inline links

### Patch Changes

- [`7d24194b639`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d24194b639) - EDM-1717: Fix Safari danger styles for inline smart links
- [`edfb17aaa70`](https://bitbucket.org/atlassian/atlassian-frontend/commits/edfb17aaa70) - [ED-11368] Add feature flag for adding undo/redo buttons in the editor. We will be encapsulating all dev work under this flag. The name of the feature flag type is `undoRedoButtons` and the editor prop is `UNSAFE_allowUndoRedoButtons`. This prop is for development purposes only, please don't turn this on. Only feature leads, can turn this on.
- [`c1633237d16`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1633237d16) - ED-11639 performance improvement, refactored TableComponent to remove redundant props
- [`5857b17788b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5857b17788b) - Change the way kitchen sink shows ADF errors
- [`b2d2417de34`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2d2417de34) - EDM-1590: fix embed & card danger styles
- [`babad0a5038`](https://bitbucket.org/atlassian/atlassian-frontend/commits/babad0a5038) - ED-11145: Add additional attributes to document inserted and text formatted analytic event payloads
- [`359ff24a999`](https://bitbucket.org/atlassian/atlassian-frontend/commits/359ff24a999) - Optimize table mousemove handler by using resizeObserver
- [`9d1bc4dde94`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d1bc4dde94) - [ux] As part of the bump to @atlaskit/code, the codeBlock element's visual appearance has been modified in renderer and editor-core. Specifically the fontSize and lineHeight have been made more consistent with the DS parent package.
- [`345f2af7da7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/345f2af7da7) - ED-11127 inject defaultValues in deserialize, fixes parameter dependency tests
  ED-11291 fix parameter passing regression, add regression tests
  ED-11127 fix singular CustomSelect serializing [] if defaultValue is omitted
- [`97384a3224c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/97384a3224c) - [ux] Initialise undo redo plugin, add undo button to ui (behind feature flag)
- [`c2225545836`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2225545836) - ED-11847 added checks for intersection and resize observers support
- [`44efa5f3f0f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/44efa5f3f0f) - [ux] Add undo functionality to Undo button
- [`d2bdd96ed83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2bdd96ed83) - Fix for backspace deleting entire nodeview
- [`faf98b96883`](https://bitbucket.org/atlassian/atlassian-frontend/commits/faf98b96883) - Removed unused comments in src from package
- [`b11735fd5f1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b11735fd5f1) - ED-11689: implement 'typeAhead rendered' and 'typeAheadItem viewed'
- [`aba85163bc2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aba85163bc2) - [ux] Dark mode line text color changed to make it easier to read
- [`a4bcf21a972`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4bcf21a972) - [ux] Syntax highlighting now uses accessibile colors that meet WCAG 2.0 Level AA guidelines for color contrast
- [`62b30905271`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62b30905271) - Update keymaps on captions to follow design spec
- [`501ca8b3083`](https://bitbucket.org/atlassian/atlassian-frontend/commits/501ca8b3083) - table plugin was ignoring the plugin states requested via WithPluginState
- [`871644c07e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/871644c07e6) - [ux] Prevent toolbar from having option to switch to card view on fattaly errored smartcards
- [`a6c1b0bc5cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a6c1b0bc5cd) - ED-11148: Allow valid transactions to be sampled and tracked in analytics
- [`19fa405c2ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19fa405c2ec) - [ux] ED-11724 update isEmptyNode to work with non default attrs
- Updated dependencies

## 136.3.1

### Patch Changes

- [`d361f290d63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d361f290d63) - NO-ISSUE avoid bundling test data for development

## 136.3.0

### Minor Changes

- [`a30fc2921e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a30fc2921e8) - HOT-94214 fix chrome selection issue

## 136.2.0

### Minor Changes

- [`658184c615`](https://bitbucket.org/atlassian/atlassian-frontend/commits/658184c615) - [ED-11630] Removes the usage of Query Parameter for Predictable List and Makes the Predictable List reconfigurable via the bridge.configureEditor method. All the clients setting allowPredictableList from query parameter should use bridge.configureEditor and pass in the allowPredictableList flag.
  Example: bridge.configureEditor("{\"allowPredictableList\": true}")
- [`2fe88ab389`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2fe88ab389) - [ED-11642] Remove "window.resize" listner and "ClickArea" for compact editor. Include padding calculation in onRenderedContentHeightChanged.
- [`7d8f1facfc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d8f1facfc) - [ME-300](https://product-fabric.atlassian.net/browse/ME-300) Introduced a toolbarBridge to support data-driven editing capabilities.

  By default, implementation is not required and native side won't be impacted. Once the implementation is done
  on the native side, this will work out of the box. Data-driven approach listens the floating toolbar state
  changes and relay the editing capabilities to the native side. Native mobile displays these capabilities with
  the native widgets in the main toolbar. Once the user performs an action, responsibility of the execution is
  delegated to the editor-core which is the shared components across all platforms. Native mobile doesn't know
  about the details of how to perform an action.

- [`92bf38166c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/92bf38166c) - [ED-11634] Removes the usage of Query Parameter for editorType and renames it to editorAppearance. editorAppearance is now reconfigurable via the bridge.configureEditor method.
  All the clients setting editorType from query parameter should use bridge.configureEditor and pass in the editorAppearance flag with either 'compact' or 'full'(Default).
  Example: bridge.configureEditor("{\"editorAppearance\": \"compact\"}")

### Patch Changes

- [`70f47afdee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70f47afdee) - Added unsupportedBlock support for mediaSingle as a child
- [`a4e37d0df4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4e37d0df4) - Fix EDM-1636 again
- [`c2901e028c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2901e028c) - ED-11672 Fix divider input rule when triggered at the end of a page
- [`3e42092709`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e42092709) - ED-11635 Avoid expensive nodesBetween in predictable lists if list is not selected to impove typing performance
- [`9203b21230`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9203b21230) - Rename locale from fabric.editor.emoji to fabric.editor.panel.emoji
- [`48825df727`](https://bitbucket.org/atlassian/atlassian-frontend/commits/48825df727) - Ensure mediaSingle updates when a caption is added from synchrony
- [`0c2ec01050`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c2ec01050) - revert EDM-1636 fix
- [`29c9de20a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/29c9de20a5) - Updating to pass all the transactions to sendTransaction
- [`9da08b115a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9da08b115a) - Revert fix for TWISTA-638
- Updated dependencies

## 136.1.1

### Patch Changes

- [`3e52031824`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e52031824) - HOT-93991 Fix async legacy macro insertion

## 136.1.0

### Minor Changes

- [`22c89bff23`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22c89bff23) - [ED-11493][twista-405] Add predictable list at the mobile bridge plugin subscription
- [`385e3de61b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/385e3de61b) - Remove the scroll gutter for compact mobile editor.

### Patch Changes

- [`3eb3ff9d54`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3eb3ff9d54) - ED-11586 fix CheckboxGroup isRequired behaviour
- [`4329551ee2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4329551ee2) - ED-11068: fix find and replace state management
- [`73d5cb22dd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73d5cb22dd) - Ensure gap cursor ignores a click on a caption node
- [`1bd969d9c1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1bd969d9c1) - Fix re-renders in a table cell with the NodeView update
- [`680d67533f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/680d67533f) - Fix boolean fields to have state [initially, and when updated] driven by Parameters
- [`e797f23ec3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e797f23ec3) - ED-10441: ensure code-block is WYSIWYG
- Updated dependencies

## 136.0.0

### Major Changes

- [`00ba3076ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/00ba3076ab) - [ux] Paste hyperlink into selected text will apply link mark to the selected text
  Breaking change on `isNodeTypeParagraph` function, use `isParagraph` instead (requires a schema to be passed as a second param)

### Minor Changes

- [`c7e408f3c8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c7e408f3c8) - [ux] Embed smart cart resizing now can dynamically change height when content is coming from a public resolver powered by iframe.
- [`2d80d6e283`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d80d6e283) - [ED-11464][editor] Introduce onContentRendered method in content bridge. It is called when content is rendered which is set by bridge.setContent

### Patch Changes

- [`d1e241f90f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1e241f90f) - ED-10693 Change tryAutoSave to a function
- [`a3d86f8925`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a3d86f8925) - Fix issue where custom emojis appeared stretched
- [`610cacff4e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/610cacff4e) - ED-11150: added severity to InputPerfSamlingAEP
- [`5f3cf8f7a9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f3cf8f7a9) - [ux] Fix bug where resize handlers should be in the middle of image and not image + captions
- [`cc04446cf9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc04446cf9) - Enable hyperlink toolbar in captions
- [`81a5e08f06`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81a5e08f06) - Fix divider not visible in dark mode
- [`44b543b221`](https://bitbucket.org/atlassian/atlassian-frontend/commits/44b543b221) - [ux][ed-10388] Fix height of ContentArea styled component to avoid surplus whitespace at the bottom of the page
  [ux][ed-9593] Reduce vertical margin of block nodes to 0.75rem
- [`6ae634a53e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ae634a53e) - Add analytics to image caption
- [`c6e1acf2ca`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6e1acf2ca) - ED-11213 Move testing library to devDependency
- [`888fc5ceef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/888fc5ceef) - [ux] When embed resizing is not enabled, wide and full-width embeds won't get bigger then 100% as they shoud
- [`c74a79f30e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c74a79f30e) - EDM-1529: fix switching link appearance in lists
- Updated dependencies

## 135.1.0

### Minor Changes

- [`4d9d11c246`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d9d11c246) - Fixes nodes with multiple validation specs to return node with most suitable spec.

### Patch Changes

- Updated dependencies

## 135.0.0

### Minor Changes

- [`5e68f04701`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e68f04701) - ED-11232 Make resolvers aware of other field values
- [`dfd440f4b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfd440f4b5) - [ux] New functionality to add and remove captions to images and videos. Select an image or video in the editor to start using it!
  editor-core now exports dedupe which aids in not having duplicate plugins added when initialising an editor
- [`9b1c48edd1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b1c48edd1) - Revert ED-10820 to resolve broken validator
- [`48995f73b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/48995f73b2) - Create entry points to export internal API isolated from UI changes.

### Patch Changes

- [`f51a912369`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f51a912369) - CMB-2437: Added VR tests for the Date node in both Editor and Renderer packages
- [`e03d8b75ac`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e03d8b75ac) - replaced inviteItem viewed event to inviteItem rendered event in mention plugin
- [`9aa0861e87`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9aa0861e87) - ED-11028 Fix bug where selection would sometimes be lost after opening config panel for an extension, causing the panel to instantly close again
- [`092c344df7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/092c344df7) - Update ctrl+k menu to check for smart link before inserting link
- [`3dd74f7124`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3dd74f7124) - ED-11043 Upgrade `prosemirror-inputrules` from `1.1.2` to `1.1.3` to prevent crashing when undoing input rules when the rule was triggered without inserting text.
- [`da06b5fd2f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/da06b5fd2f) - ED-10664 add ids to relate FEF feedbacks to performance analytics
- [`817ff063e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/817ff063e3) - ED-11024 Remove unused legacy undo/redo analytics event. This was replaced by an implmenentation within `@atlaskit/adf-schema` as part of ED-10123.
- [`15c311f84f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/15c311f84f) - ED-10800 added TransactionTracking.usePerformanceMarks flag. when false (default) uses alternative performance measurement methods via getMeasureHelpers() helper and startMeasureSimple() and stopMeasureSimple() utils.

  - moved measure-transactions.ts and should-track-transaction.ts into track-transactions.ts
  - split shouldTrackTransaction() into bumpDispatchCounter()
  - use constants for event names
  - potentially fixed a bug with mismatched event names for EVENT_NAME_VIEW_STATE_UPDATED !== '🦉 ReactEditorView::onEditorViewStateUpdated'

- [`cc9f374276`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc9f374276) - Remove unsupported API for includeGroups/includeTeams for Users in extension config, and stop setState after unmount
- [`47117b13f1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/47117b13f1) - close smart link edit toolbar on esc key
- [`1f113d0099`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f113d0099) - ED-11079 Fix keyboard accessible datepicker timezone bug
- [`39055f3ac5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/39055f3ac5) - ED-10694: Fix FieldComponent defaultValue behaviour losing value due to mutation
- [`dd91541afe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dd91541afe) - [ux] Further improvements on the invite from mention experiment
- [`ad2dfc89b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad2dfc89b4) - Update captions to respond to keyboard shortcuts correctly
- [`0b1bafbc8c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b1bafbc8c) - ED-11921 Fix User fields not validating
- Updated dependencies

## 134.0.1

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc
- Updated dependencies

## 134.0.0

### Major Changes

- [`9f81260dd5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f81260dd5) - ED-10683 Serialize number fields to Number instead of String

### Minor Changes

- [`af832a83e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/af832a83e8) - [ED-10671] Predictable Lists: Fix Paste Lists inside of panels

  ## Before

  Insert lists inside of at the begin of a panel was removing the panel

  ## Now

  It is adding the lists right before the current content

- [`22791ceed0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22791ceed0) - [ux] - added new properites in MentionResource interface to support invite from mention experiment

  - updated util-data-test/mention to enable invite from mention experiment
  - added invite from mention experiment logic into editor-core

- [`125571bf8e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/125571bf8e) - ED-10725: Add an experimental support of a modern analytics context to editor core

### Patch Changes

- [`386ef3f839`](https://bitbucket.org/atlassian/atlassian-frontend/commits/386ef3f839) - ED-10759 Refactor click area block & mobile
- [`0175a00afc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0175a00afc) - [ED-10670] Update prosemirror-model type to use posAtIndex methods
- [`53e72c45d1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/53e72c45d1) - [ux][ed-10879] Fix pasting invalid nodes into panel
- [`ff4b80f248`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff4b80f248) - [ux][ed-10675] Fix conversion when selection contains a list but has a paragraph on one or both ends
- [`23ad8adc0e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/23ad8adc0e) - ED-10555 Add ContextIdentifierProvider to performance analytics
- [`c60fe6d629`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c60fe6d629) - [ux][ed-10878, ed-11017, and ed-10942]: Fixing regressions for predictable lists copy & paste

  ED-10878 fixes copy and pasting divider followed by list item scrolls to end of page
  ED-11017 fixes unexpected behaviour when pasting list items into a nested list with an empty parent (incorrect nesting of list)
  ED-10942 fixes empty nested list items when paste destination selection is mid node

- [`af0d9c0965`](https://bitbucket.org/atlassian/atlassian-frontend/commits/af0d9c0965) - EDM-668: fixes a bug wherein pasting too many Smart Links causes the event loop to become overwhelmed.

  The fix is documented below for future reference.

  ### Cause

  When pasting a large number of Smart Links, a ProseMirror transaction is created for each link paste. This kicks off an asynchronous JavaScript task, in which the ADF representation of the link is fetched from the `EditorCardProvider`.

  As a consequence, when pasting 10/50/100 links, the macrotask queue is overwhelmed with asynchronous tasks.

  ### Solution

  To resolve this issue, a queuing mechanism separate to the macrotask queue is utilised, to ensure each asynchronous call is non-blocking and does not cause the browser to lock up with an overwhelmed macrotask queue.

  The mechanism utilised is `requestAnimationFrame`, using the `raf-schd` library. This is a common technique in the `@atlaskit/editor-core` codebase, which allows for asynchronous transactions to be invoked in quick succession without blocking interactivity.

  ***

  Thanks to @Vijay for being a legend in pairing on this one!

- [`33b8b7d85b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/33b8b7d85b) - ED-9860: Unskip and fix editor-core media unit tests
- [`d48b343171`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d48b343171) - [ED-10670] Predictable-List: Make sure if you copy a list into different list type it considers the target list
- [`acd4c9a9ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/acd4c9a9ee) - [ux][ed-11086] Fix pasting of a single nested list item into an empty panel
- [`50066eafe6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50066eafe6) - ED-10764 fix title field behaviour in full page example
- [`db4e6ab0d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db4e6ab0d4) - EDM-1388: Toggle link mark on media and not mediaSingle
- [`be5392f4a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be5392f4a4) - EDM-1395: Update analytic subject names for image linking
- [`815038b225`](https://bitbucket.org/atlassian/atlassian-frontend/commits/815038b225) - [ux] ED-10796 Fix selection changes over multiple paragraphs being ignored in expands
- [`691edb5246`](https://bitbucket.org/atlassian/atlassian-frontend/commits/691edb5246) - [ux][ed-10479] Copy & Paste for Lists: Prevent empty list item insertion when pasting into a text selection across nested levels
- [`9d3a706bb8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d3a706bb8) - Ignore search when input is a URL
- [`48c56025fa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/48c56025fa) - move selection based node view into new file
- [`3c263cb2df`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c263cb2df) - Added error handling when calling media client getCurrentState()
- [`b9b9d2aad2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9b9d2aad2) - TED-558: improved invite item selection by space pressed
- [`24a0f89239`](https://bitbucket.org/atlassian/atlassian-frontend/commits/24a0f89239) - [ED-10992] Predictable Lists: Add analytics to fix sibling list appendTransaction
- [`5fb3d63c3f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5fb3d63c3f) - Bump dompurify to prevent XSS vulnerability and prefer alternative architecture
- [`f50e5d16b1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f50e5d16b1) - CMB-2438: Added dark mode VR tests for tables in both Editor and Renderer
- Updated dependencies

## 133.0.1

### Patch Changes

- Updated dependencies

## 133.0.0

### Major Changes

- [`142d765bc4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/142d765bc4) - Revert ConfigPanel autoSaving in EditorActions.getValue
- [`f73b500ffa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f73b500ffa) - ED-10681 API for dismiss typeahead

### Minor Changes

- [`fd5c410db6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5c410db6) - [ux][ed-10626] Predictable List: New Outdent System

  ## HOW

  Enable feature flag: allowPredictableList is true

  ## WHEN

  The user try to outdent a list items inside of bullet or ordered list.

  ## WHAT

  In this new system only the list item selected will be outdented.

  More information: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1729466614/Wins

- [`a09fabd2df`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a09fabd2df) - [ux] ED-10625 Allow table to have leading cursor in mobile

  - Remove extra padding on the sides of the table component
  - Allow mobile nodes to have gap cursor

- [`677744c680`](https://bitbucket.org/atlassian/atlassian-frontend/commits/677744c680) - Add UserSelect field for ConfigPanel, and expose types in SmartUserPicker
- [`1e59fd65c5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e59fd65c5) - ED-8720 Add OnUnhandledClickHandler for Renderer

### Patch Changes

- [`dfda163bf6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfda163bf6) - ED-10594: track severity for browserFreeze event and add getAnalyticsEventSeverity util
- [`427d3c8300`](https://bitbucket.org/atlassian/atlassian-frontend/commits/427d3c8300) - Add testId (data-testid) to some toolbar buttons (layout) as well as data-testid to breakout button
- [`3aaa2cf6a6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3aaa2cf6a6) - EDM-1323: prevent edit link changes on cancel
- [`67739f7bee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/67739f7bee) - [ux] ED-10514 Fix toggling between list and paragraph via keyboard shortcut
- [`b760978439`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b760978439) - Show isRequired validation error if Boolean config field is false and isRequired is true
- [`f7cf7baae5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7cf7baae5) - Fix an unstable useEffect dependency causing an infinite autoSave loop
- [`bd856ee554`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bd856ee554) - ED-10799: rate limit transaction performance tracking in ReactEditorView.dispatchTransaction() and InstrumentedPlugin
- [`eeedafee68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eeedafee68) - ED-10532: Add new UI element to pick a date range - for supporting the cql component
- [`9ad541de7e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9ad541de7e) - [ux] ED-10682 fixed issue with unexpected highlight styles when selecting table cells with a mouse in firefox
- [`9e44b47202`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e44b47202) - ED-8576 fix table context menu re-render position
- [`9560f4208c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9560f4208c) - ED-10766 fix browser freezing issue.
- [`e194a919ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e194a919ec) - [ux] ED-10817: fixed table losing focus when pressing tab/shift+tab at start/end of tables
- [`8938a68c7b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8938a68c7b) - ED-9947 Batch breakout style update and make PM ignore it
- [`b13e3991ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b13e3991ef) - ED-10723: severity for rendered event
- [`1a702e6843`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a702e6843) - [ux] ED-10492 Showing errors in Fieldset
- [`1b3dd916d2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1b3dd916d2) - ED-10668: Remove placeholder plugin composition workaround to fix issue with Japanese characters converting to Roman characters
- [`14351a2eee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/14351a2eee) - [ux] ED-10873 fixed table row controls shrinking on focused table in small viewports.
- [`703752d487`](https://bitbucket.org/atlassian/atlassian-frontend/commits/703752d487) - ED-10647 Remove caret from prosemirror-model, prosemirror-keymap, prosemirror-state, prosemirror-transform to lock them down to an explicit version
- [`8a5ae33254`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a5ae33254) - [ux] ED-10623 add custom panel actions
- [`05f2c58ae8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/05f2c58ae8) - ED-10722: severity for proseMirrorRendered event
- [`e3b2251f29`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3b2251f29) - Breaking change for collab provider as userId has been removed from constructor. Mobile bridge and editor demo app require an upgrade too
- [`330da4d675`](https://bitbucket.org/atlassian/atlassian-frontend/commits/330da4d675) - Update translations via Traduki from issue/translation-2020-10-08T000543
- [`7f8a716c96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f8a716c96) - [ux] EDM-1213: fix escape key not closing HyperLinkToolbar
- Updated dependencies

## 132.0.0

### Minor Changes

- [`8904f49fe0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8904f49fe0) - [EDM-1235] Add Display URL option
- [`88e836d94d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/88e836d94d) - ED-10462 Disabled linking keyboard shortcut for video
- [`a41378f853`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a41378f853) - Refactor & fix few cases of unsupported node attributes:

  - Preseve attributes on nodes which do not support any attributes
  - Add unsupportedNodeAttribute to bulletList, layoutSection etc.

- [`0bbaa4a976`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0bbaa4a976) - ED-10553 added an option to enable analytics for synchrony entity
- [`1ef25b01ce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1ef25b01ce) - ED-9757 Refactor selection editor plugin to include both gap cursor and selection prosemirror plugins
- [`4b97e793af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b97e793af) - Add Tootltip Analytics for unsupported block and inline nodes
- [`522ef99af5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/522ef99af5) - Add analytics event to track tooltip for unsupported content
- [`28ada06e31`](https://bitbucket.org/atlassian/atlassian-frontend/commits/28ada06e31) - [ux] ED-10444 Preserve block marks when pasting paragraphs into a destination that supports them

  Paragraph nodes support block marks such as alignment and indentation. When pasting into a destination that supports these marks, like a table cell or another paragraph, these marks are now preserved. For other types of destinations, like panels or expands, these marks get dropped so only the text gets pasted.

- [`76cc1d3959`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76cc1d3959) - [ux][ed-10182] New indentation system for Predictable Lists

### Patch Changes

- [`863e781954`](https://bitbucket.org/atlassian/atlassian-frontend/commits/863e781954) - ED-10563: Fix bug where clearing up a custom field could thrown an exception
- [`4b2c7ce81c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b2c7ce81c) - ED-10580: Fix duplicate i18n ids
- [`e0b454499d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0b454499d) - ED-10469 improve status and date in uninsertable block node
- [`f0fbab604a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f0fbab604a) - ED-10552: browser freeze interaction types
- [`7895bfa4f3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7895bfa4f3) - [ux] ED-10562 Update selection styles for unsupported content

  Use background colour instead of blanket styling
  Fix an issue on Safari where text inside unsupported content appeared selected when node was selected

- [`ef432e6288`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ef432e6288) - ED-10544: Remove type restrictions to keep api backwards compatible"
- [`7ff0c42478`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ff0c42478) - Fix the cursor position after switch inline/block card
- [`fb417cad7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb417cad7d) - [ED-10202] Add delete key behaviour for ctrl-d shortcut
- [`b3025820d3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3025820d3) - [ux] ED-10700 Prevent single paragraph with block marks from being pasted onto new line
- [`10cdbcacae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/10cdbcacae) - Stopping ElementBrowser click event propagation
- [`fc5535b5a6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc5535b5a6) - Fix Config autoSave when deselecting an extension
- [`23452586c4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/23452586c4) - Reverting elementBrowser click propagation PR
- [`e4abda244e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4abda244e) - ED-9912: replace prosemirror-tables with editor-tables
- [`c5cf85e1b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c5cf85e1b0) - [ux] Design review changes from 17th sept 2020 for plus menu (InlineElementBrowser)
- [`9e06c6e2d6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e06c6e2d6) - [ux] ED-10651: custom panels - renderer and editor consistency
- [`8b303ade9f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b303ade9f) - EDM-1416 Disable useLongPress FF
- [`b596fcb672`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b596fcb672) - [ED-10716] Fix forward delete before a list item with inline code and text
- [`d271b899c2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d271b899c2) - [ux] ED-10548 dont try to refetch state of annotation with invalid ids, and don't show annotations with invalid ids
- [`1b89e3e0ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1b89e3e0ab) - Fixes an issue when activity provider is not provided to editor, the link cannot be inserted from Cmd + K
- [`15f7b4ae78`](https://bitbucket.org/atlassian/atlassian-frontend/commits/15f7b4ae78) - [ux] ED-10433 made custom icon and color applied on a panel based on node attributes (UI change). Changes are behind UNSAFE_allowCustomPanel feature flag.
- [`2a4d918b5b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2a4d918b5b) - [ux][ed-10663] Indentation on Predictable Lists will consider only visual selections.
- [`b724239b57`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b724239b57) - EDM-1318: fix nested image resizing in layout
- [`51d499862a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/51d499862a) - [ux] ED-10641 Fix inconsistent plus menu insertion behavior
- [`d0d4f926a2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0d4f926a2) - [ux] ED-10232 Removing frame around CQL FieldSet
- [`5a473547f3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a473547f3) - [ux] PlusMenu design review changes from 25th Sept 2020
- [`beda28c596`](https://bitbucket.org/atlassian/atlassian-frontend/commits/beda28c596) - [ux] ED-10354: added a colour picker to panels toolbar
- [`1ef54456a2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1ef54456a2) - ED-10563: Fix examples to show the right type if of extension node for macros"
- [`fa538b8313`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa538b8313) - ED-10432 add example page for beautiful emoji panels
- [`fe34558349`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe34558349) - Fix ConfigPanel losing data when publishing with autosave
- [`976367a939`](https://bitbucket.org/atlassian/atlassian-frontend/commits/976367a939) - [ux] ED-10355 add emoji picker to panel toolbar
- [`3d0b51445a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3d0b51445a) - ED-10544: Fix name collision between nested fields and top level fields
- [`0f824df74f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0f824df74f) - [ED-10545] Fix predictable list delete functionality when first list item is empty
- Updated dependencies

## 131.0.10

### Patch Changes

- [`34674fa4cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/34674fa4cd) - [ux] ED-10780 removed the threshold that enabled responsive changes

## 131.0.9

### Patch Changes

- [`ac54a7870c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac54a7870c) - Remove extraneous dependencies rule suppression

## 131.0.8

### Patch Changes

- [`a2634b5390`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2634b5390) - [ux] ED-10780 reduced the threshold for responcive toolbar oayout;fixed problem with italic button not working when it is in collapse menu.
- Updated dependencies

## 131.0.7

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.
- Updated dependencies

## 131.0.6

### Patch Changes

- [`91854cd5b6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/91854cd5b6) - ED-10645 Fix not being able to change dates in some collab sessions

## 131.0.5

### Patch Changes

- [`9a055964a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a055964a3) - ED-10628 Re-enable single click selection on mobile

  Long press selection is temporarily blocked, so we will re-enable single click selection for now

## 131.0.4

### Patch Changes

- [`9798ad1405`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9798ad1405) - Remove deep import paths of dependencies in TS declaration files
- Updated dependencies

## 131.0.3

### Patch Changes

- [`e27286a0f1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e27286a0f1) - Fix unable to change a date inside a table

## 131.0.2

### Patch Changes

- [`a1969c1be1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1969c1be1) - [ux] Deduplicate items from the Cmd+k search result

## 131.0.1

### Patch Changes

- [`2ac834240e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ac834240e) - Undo analytics-next file restructure to allow external ts definitions to continue working
- Updated dependencies

## 131.0.0

### Major Changes

- [`dd849c6a0c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dd849c6a0c) - [ED-9500] Removes sendDataOnViewUpdated property from EditorProps.

  # BREAKING CHANGE:

  ## WHAT:

  Editor component doesn't need the `sendDataOnViewUpdated` prop anymore.

  ## WHY:

  The test was done and all transaction are using the Public API: `onEditorViewStateUpdated`.

  ## HOW:

  Replace this:

  ```
  <Editor
    collabEdit={{
      sendDataOnViewUpdated: true,
    }}
    />
  ```

  To this:

  ```
  <Editor
    collabEdit={{ }}
    />

  ```

- [`68f7feae92`](https://bitbucket.org/atlassian/atlassian-frontend/commits/68f7feae92) - (major) `isHidden` is only supported for String Field types
  (patch) Remove duplicate Option type from ExtensionManifest types (now uses FieldDefinition Option type)
  (patch) Extract FormContent render\* functions to function components
- [`9a39500244`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a39500244) - Bump ProseMirror packages

  Read more: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1671956531/2020-08

### Minor Changes

- [`0f55310b9e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0f55310b9e) - ED-10114 Codeblock improvements: implement auto-closing of quote characters and add special case handling for auto-closing of brackets
- [`12172ca683`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12172ca683) - [ux] ED-10278 Fix indentation of child lists that are of different types

  This fixes an issue where a numbered list could not be indented into a parent bullet list, and vice versa.

- [`01788f87a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/01788f87a1) - ED-10128 Treat a cell selection that covers the whole table like a node selection

  This means:

  - If a user hits backspace with the table selected it is deleted
  - If a user types with the table selected, the table node is replaced with the typed text
  - If a user pastes content with the table selected, the table node is replaced with the pasted content

- [`c81f880916`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c81f880916) - Add style: multiline for string TextArea field type
- [`eb446e52e7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb446e52e7) - ED-9385 Disable selecting nodes with a single click/tap on mobile editor

  We want to use a long press gesture to select nodes on mobile instead

- [`ae50a98f18`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae50a98f18) - ED-9125 ED-8837 Update styles for selected media cards

  - Use editor selection styles from @atlaskit/editor-shared-styles
  - Update UI for selected items in media group to no longer set blue background and tick in corner
  - No longer set set text selection over filename, filesize etc. for media group cards when selected with Cmd + A or via a range selection

- [`f40f5aef03`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f40f5aef03) - ED-9953 ED-10154 Implement list conversion for list items in range selection
- [`903a529a3e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/903a529a3e) - Return types in activity-provider which will be used in analytics
  Adds in instrumentation metrics for HyperLinkToolBar
- [`d724695ca4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d724695ca4) - [ux] Change the config field CustomSelect to always be clearable
- [`a5696d6b4d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5696d6b4d) - ED-9602 Implement keyboard selection via arrow keys for table node

  Add a full-table cell selection state between selection inside table and gap cursor selection when using left/right arrow keys to navigate

  Add special rules if you select full table via table controls or clicking and dragging to select all cells - left arrow will take you to start of first cell, second left will take you to left-side gap cursor; right arrow will take you straight to right-side gap cursor

- [`8cbb19d0f9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cbb19d0f9) - ED-9957 Improve date picker accessibility
- [`558a213572`](https://bitbucket.org/atlassian/atlassian-frontend/commits/558a213572) - Add style: toggle as Field Definition option
- [`47f0c4b221`](https://bitbucket.org/atlassian/atlassian-frontend/commits/47f0c4b221) - Add isCreatable property for CustomSelect field

### Patch Changes

- [`39d658f40c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/39d658f40c) - [ux] ED-9955 Style list items by absolute indentation level

  List items will now be styled according to the total indentation level of the list, instead of relative to their immediate parent list.

- [`2d4bbe5e2e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d4bbe5e2e) - [ED-10503] Fix prosemirror-view version at 1.15.4 without carret
- [`0ac3eff13b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ac3eff13b) - TWISTA-176 Added analytics for inline comments in renderer
- [`8dbe72950d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8dbe72950d) - EDM-1107: fix media single resize in layout
- [`57c5a91b35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c5a91b35) - ED-10189: Show description at the top of config
- [`7a0aed8943`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a0aed8943) - [ux] ED-10042: restrict clear formatting on tables to the cells selected
- [`9b020378c1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b020378c1) - ED-9814 Design review changes from 12th Aug for ElementBrowser, replacing ModalElementBrowser's ref usage with state, and removing recomputeCellSizesAndPositions call in ElementList in favor of a key on resize to refresh Collection.
- [`e639f4a7c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e639f4a7c9) - fix copy to clipboard button flickering
- [`0aafd45275`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0aafd45275) - ED-10288: Add tracking for attempted last column resizing on table
- [`39b57c32e4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/39b57c32e4) - ED-10270 Prevent premature closure of color picker UI when clicking the More Colors button
- [`8a415b2620`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a415b2620) - ED-10010 Adding Visual Regression tests for ElementBrowser
- [`ecc196a701`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ecc196a701) - [ux] ED-10426 LazyLoading InlineElementBrowser
- [`22105274d2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22105274d2) - Only render smart-card when context.value is available
- [`6a93c4ab93`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a93c4ab93) - [ux] ED-10362: fix styles of table contextual menu button
- [`a5df678470`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5df678470) - ED-10231 Prevent users from removing the last visible dynamic fieldset.
- [`f456a69548`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f456a69548) - ED-10129 Fix annotation highlight staying active after component close
- [`e50bc4c2c7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e50bc4c2c7) - ED-10074 Prevent mention typeahead from flickering by fixing render condition
- [`e0876d4a03`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0876d4a03) - CSS fix to ensure consistency in image wrapping breaking to new line
- [`c90f346430`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c90f346430) - Remove @ts-ignores/@ts-expect-errors
- [`2270ba55e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2270ba55e6) - ED-10378 Add missing options back to applyRemoteSteps
- [`aae186c21a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aae186c21a) - [ux] ED-9527: convert ColorPalette to functional component and use useMemo()
- [`a636b2a5b1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a636b2a5b1) - ED-10383: fix table scaling when nodeview's getPos returns position outside the document
- [`165f252fb8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/165f252fb8) - ED-10246: remove extra margin for center/right aligned top row in tables
- [`e65fbaa6e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e65fbaa6e6) - [ED-10434] Implement correct delete forward behaviour for paragraphs before lists
- [`2396e68471`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2396e68471) - EDM-824: fix floating toolbar order
- [`6e237a6753`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e237a6753) - Add optional caption to mediaSingle in adf schema for stage 0
- [`d72f82bbc8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d72f82bbc8) - fix authoring behaviour of status and date node inside a codeblock
- [`02ad57c335`](https://bitbucket.org/atlassian/atlassian-frontend/commits/02ad57c335) - Added theming and dark mode colors to the Expand node
- [`c215f3e46b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c215f3e46b) - ED-8755: remove top margin for center/right aligned header row in tables
- [`86eb92b441`](https://bitbucket.org/atlassian/atlassian-frontend/commits/86eb92b441) - Limit the set of HTML tags supported in extension field descriptions
- [`2f72e5901b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2f72e5901b) - Disable media linking for video media
- [`ea22cf8a31`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea22cf8a31) - TWISTA-376 Provide node and mark details on mobile selection plugin
- [`c2e573479c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2e573479c) - EDM-937: added prefetching to Smart Links rendering path.

  As of this version of `@atlaskit/smart-card`, when a Smart Link is initially rendered, one of two things will take place:

  - The link will be considered as within the viewport, and a `fetch` and `render` path will be taken, or;
  - The link will be considered as outside of the viewport, and a `prefetch` and `render` later path will be taken.

  In the latter, the approach taken has been to separate the rendering of the UI of Smart Links from the data backing the Smart Link. This is important, as, otherwise, the browser will become extremely busy even though Smart Links are not in the viewport. Thus, instead, the data for Smart Links is fetched in the background, and persisted to the store.

  A few additional points here are:

  - The prefetching logic has been implemented as a hook which can be used in other components, `usePrefetch`;
  - The prefetching logic is error-safe, in that, if errors take place whilst replacing there should be no repercussions (this has been tested);
  - The prefetching logic and fetching logic peacefully co-exist, in that, if a link is scrolled into view whilst it is being prefetched, subject to prior logic in the Smart Links reducers, either one or the other is taken as the canonical source of truth for representation of the link's metadata (whichever finishes first, to benefit the customer experience).

  Tests have been added to verify associated functionality, with an integration test added to ensure the number of network requests at two points, (1) on initial page load and, (2) after scrolling to the end of the page are the same.

  **Note**: Prefetching is enabled by default. This is deliberate to minimise the UI reflow and associated 'jank' in the Smart Links experience. If required, opt-out behaviour will be provided in the future.

- [`f418a9b96e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f418a9b96e) - [EDM-956] Fix icon size in link search results
- [`c5bc98ff03`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c5bc98ff03) - [ux] ED-10459: inline comments - don't show highlights for resolved comments
- [`7e9ea57baa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e9ea57baa) - [ux] ED-9527: fix ColorPalette alignment when zoom is less than 100%
- [`26ff0e5e9a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/26ff0e5e9a) - ED-10353 Added adf schema changes to support emoji panels
- [`b5a06b9603`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b5a06b9603) - Extend browserFreeze, slowInput and inputPerfSampling events with nodeCount
- [`b5673eca6b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b5673eca6b) - [ED-10181] Replace an empty indented paragraph with a list after a text formatting
- [`b9812b8b35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9812b8b35) - ED-10004 improved editor toolbar responsiveness
- [`e9710e2477`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9710e2477) - [ED-10387] Replace Text Formated events on Predictable List
- [`a69bad0bf5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a69bad0bf5) - ED-10241 Ensure MainToolbarCustomComponentsSlot is at least the size of its contents, prevent find-replace icon from being overlapped during publish operations
- [`429c4359f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/429c4359f0) - ED-9951 Add list conversion analytics
- [`479aff7be3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/479aff7be3) - ED-10453: Add test ids in preparation for integration tests
- [`8de373491a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8de373491a) - Strengthen the Typescript rules for Enum fields per design guidelines
- [`78b192acc9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78b192acc9) - ED-10169 Update imports for style constants from @atlaskit/editor-common to @atlaskit/editor-shared-styles
- [`2e5e9bf891`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e5e9bf891) - ED-10123 Export Analytics Step from adf-schema instead of internal editor-core
- [`9a3be2dd27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a3be2dd27) - [ux] Force removing tabIndex from virtualized Collection component for ElementBrowser
- [`b17798ad2e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b17798ad2e) - ED-9840/41 Showing featured element items in full page x extensions along with "view more" to show ModalElementBrowser
- [`9f21deb3bb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f21deb3bb) - Adding theming support and dark mode colors to table cell backgrounds
- [`3ba991acd1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3ba991acd1) - ED-10034 Remove click listener added to extension node when it is destroyed
- [`f6cd72972e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6cd72972e) - ED-9763 Fix panel selection when node selected inside
- [`cd4e6fc7b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd4e6fc7b8) - [ED-10247] Bump prosemirror-schema-list package to 1.1.4
- [`9c8d6ef045`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9c8d6ef045) - [ED-10198] Fix insert event analytics events for Predictable List
- [`1e27e43442`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e27e43442) - [ED-10093] Conversion list analytics for predictable lists
- [`77668bdb34`](https://bitbucket.org/atlassian/atlassian-frontend/commits/77668bdb34) - ED-10183 Add richer analytics for list indentation
- [`c99904f2c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c99904f2c3) - [ux] InlineElementBrowser ui changes for design/review from 3rd september 2020 for full page x extensions example
- [`150788495a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/150788495a) - [ED-10162] Fix join list item analytics events
- Updated dependencies

## 130.0.0

### Patch Changes

- [`f3698d4c2d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3698d4c2d) - only render smart-card when react context is ready
- Updated dependencies

## 129.0.2

### Patch Changes

- [`b284fba3d1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b284fba3d1) - Components that had missing names are now fixed - this helps when looking for them using the React Dev Tools.

## 129.0.1

### Patch Changes

- [`383bdfb201`](https://bitbucket.org/atlassian/atlassian-frontend/commits/383bdfb201) - Updated VR test
- Updated dependencies

## 129.0.0

### Major Changes

- [`94ac6099e2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/94ac6099e2) - Rename FieldResolver to CustomFieldResolver
- [`2914e9ec0a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2914e9ec0a) - Change EditorManifest generic to propagate instead of defaulting to any

### Minor Changes

- [`5a14bab0bf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a14bab0bf) - ED-10112 Add analytics for unwrapped unsupported contents
- [`920d4514ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/920d4514ad) - ED-9601 Implement keyboard selection for block container nodes

  Add a node selection state between selection inside node and gap cursor selection when using left/right arrow keys to navigate

  Add special rules if you select a node by clicking on it - left arrow will take you inside node at start, second left will take you to left-side gap cursor; right arrow will take you straight to right-side gap cursor

  This covers nodes: code block, panel, layout, bodied extension, decision item

  This does not cover nodes: expand, table

- [`caae78bb98`](https://bitbucket.org/atlassian/atlassian-frontend/commits/caae78bb98) - Adds support for unsupportedBlock and unsupportedInline content analytics for Hybrid Editor and Hybrid Renderer.
- [`5ea181aab3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ea181aab3) - ED-9966: Added copy to clipboard functionality for the code block
- [`7bd494abdd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7bd494abdd) - WS-2137 Fix editor width plugin to look at editorView.dom geometry instead of the first editor on the page
- [`3354a3e971`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3354a3e971) - ED-9842: Replace plus menu with element browser
- [`a66b0a0d44`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a66b0a0d44) - ED-9497 Adds analytics to track unsupported Marks and Mark Attributes in editor and renderer.
- [`ff2f8eff7b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff2f8eff7b) - ED-9952 Implement list conversion for siblings in caret selection
- [`9ae1d20269`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9ae1d20269) - TYPH-239 Capture and update width changes on Mobile Appearance
- [`aa03ba4b0b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa03ba4b0b) - ED-9733 Preserve known mark on node which does not support it.
- [`44d287b640`](https://bitbucket.org/atlassian/atlassian-frontend/commits/44d287b640) - EDM-842: Adding support to the new search provider and activity provider
- [`d0ad2d8f59`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0ad2d8f59) - ED-9348 Implement keyboard selection via arrow keys for expand and nestedExpand nodes

  Add a node selection state between selection inside expand title and gap cursor selection when using left/right arrow keys to navigate

  Add special rules if you select expand by clicking on it - left arrow will take you inside expand title, second left will take you to left-side gap cursor; right arrow will take you straight to right-side gap cursor

  Tab key no longer selects expand from left-side gap cursor, however tab still cycles through expand toggle, title and body

- [`7d43faf2a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d43faf2a8) - ED-10114 Add support for searching code block languages via aliases
- [`e4114d7053`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4114d7053) - ED-9607 - Preserve Unsupported Node attributes
- [`d1c666bb6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1c666bb6d) - Adds activity analytic events

### Patch Changes

- [`98899ff81a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/98899ff81a) - Virtualizing ElementBrowser ElementList
- [`d28218f099`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d28218f099) - apply danger style for all panel types when nested
- [`5c5f54cdb5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c5f54cdb5) - Extract Plugin types
- [`31daf34b25`](https://bitbucket.org/atlassian/atlassian-frontend/commits/31daf34b25) - ED-9175:Change wordings of cell menu and tooltips
- [`b2e6b2856b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2e6b2856b) - Ship ModalElementBrowser as a component within the ElementBrowser extension
- [`351c595fbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/351c595fbb) - ED-9999: Fixes an issue where the collab provider would blindly remove all listeners instead of only its local ones.
- [`c9e96a24dc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c9e96a24dc) - Fixes issue where emoji picker wouldnt open if the current toolbar had less items than the current breakpoint allowed.
- [`7708d1a7cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7708d1a7cd) - ED-9861 Internationalize CategoryList
- [`e485167c47`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e485167c47) - ED-10018: bump prosemirror-tables to fix copy-pasting merged rows
- [`6e5372dcda`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e5372dcda) - **Ticket:** EDM-1121

  **Changes:**

  Added integration tests across the board, asserting that a new window is opened to kick off the 3LO flow.

  - Added integration test for account connection and try another account flows for Inline Links;
  - Added integration test for account connection and try another account flows for Card Links;
  - Added integration test for account connection and try another account flows for Embed Links;
  - Aligned `data-testid`s across all buttons for all unauthenticated views for each of the above to be - `button-connect-account` for connecting account, and `button-connect-other-account` for trying with another account.

  Further, added an `AuthorizationWindow` method to the `@atlaskit/media-integration-test-helpers`, with the following methods:

  - `AuthorizationWindow.open()` - to open a window to authorize, dependent on which card state it is being activated from;
  - `AuthorizationWindow.checkUrl()` - to check if the window URL when redirected is the same as the `MOCK_URL_AUTH_PROVIDER` inside of the package for assertions which ship with our mocks;
  - `AuthorizationWindow.close()` - to close the window opened for authorization.

- [`250b6247ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/250b6247ed) - ED-8952: Add analytics events for config and element browser
- [`be92791065`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be92791065) - ED-9791: open emoji panel when triggered from dropdown
- [`9468594ef9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9468594ef9) - **Ticket:** EDM-1120

  **Changes:**

  - Refactored Card Link `view` tests to separate files to be more maintainable;
  - Added unit tests to all Card Link actions;
  - Added unit tests to Card Link PreviewAction;
  - Added `openPreviewState` and `waitForPreviewState` selectors for VR tests;
  - Added VR test in Editor for Preview State;
  - Added VR test in Renderer for Preview State.

- [`dd8b35e4d0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dd8b35e4d0) - ED-10122: add a flag annotationProviders.inlineComment.isToolbarAbove to position the inline-comments toolbar above selection like renderer does
- [`7b22bcd5fb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7b22bcd5fb) - ED-9842: Use onInsertItem instead of onSelectItem
- [`3cef13652c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cef13652c) - refactor consts to table/ui/consts.ts from table/ui/styles.ts
- [`267af96c22`](https://bitbucket.org/atlassian/atlassian-frontend/commits/267af96c22) - Element Browser - Hide categories without items
- [`70e2dfe605`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70e2dfe605) - ED-9989: Fixed doubleClickResizeHandle test helper for firefox and edge
- [`21131ce6be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/21131ce6be) - [TWISTA-283, TWISTA-282, TWISTA-241] Normalizes and fixes Annotation range validator logic for Renderer and Editor

  @atlaskit/editor-common: It creates canApplyAnnotationOnRange function
  @atlaskit/editor-core: It moves current hasInvalidNodes logic to editor-common function
  @atlaskit/renderer: It replaces current logic to use the same as Editor

- [`fae13056e2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fae13056e2) - Fixed an issue where changing the style of a SmartLink would delete a parent panel, or remove the styling of a parent table cell
- [`e7d589ece8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7d589ece8) - ED-9702 Add Modal footer actions, introduce onInsertItem prop, and replace existing ElementBrowser usage to use onInsertItem instead of onSelectItem prop.
- [`96b564def2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/96b564def2) - ED-10066: disable copy button if code block is selected
- [`5fb111ff42`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5fb111ff42) - ED-10021 ConfigPanel -> CustomSelect's fieldResolver now accepts an optional defaultValue parameter
- [`8521d53791`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8521d53791) - Fixing ConfigPanel/SwappableContentArea component's overflow issue
- [`b6aada3ee5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6aada3ee5) - ED-9980: add toggle for inline-comments
- [`a606feb37f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a606feb37f) - ED-8979: Ensure selectable nodes are styled selected on TextSelection and AllSelection
- [`d3720a0080`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3720a0080) - ED-9949 Clone list plugin for predictable lists work (not enabled)
- [`ccb4d2e6d3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ccb4d2e6d3) - ED-8609 Use styled component's css for all template literals in table/ui/styles.ts
- [`6089993d2e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6089993d2e) - EDM-1116: centralize Smart Links selector and client utils for Integration, VR tests. Added mega-VR test for Smart Links in Renderer.

  Selectors exported now include:

  - `inlineCardSelector` - for selecting the Inline Link representation, in any of its resolved or unresolved states;
  - `blockCardSelector` - for selecting the Card Link representation, in any of its resolved or unresolved states;
  - `embedCardSelector` - for selecting the Embed Link representation, in any of its resolved or unresolved states;
  - `lazyCardSelector` - for selecting the fallback representation of Smart Links whilst lazy rendering;
  - `getLazyRenderedCards` - for getting DOM references to all Smart Links currently off the viewport, and rendered with a lazy fallback;
  - `getCards` - for getting DOM references to all rendered Smart Links;
  - `waitForLazyRenderedCard` - a predicate for when a fallback Smart Link has been rendered;
  - `waitForResolvedInlineCard` - a predicate for when an Inline Link has been rendered;
  - `waitForResolvedBlockCard` - a predicate for when a Block Link has been rendered;
  - `waitForResolvedEmbedCard` - a predicate for when an Embed Link has been rendered;
  - `waitForInlineCardSelection` - a predicate for when an Inline Link has been rendered and selected in the Teamwork Platform Editor;
  - `waitForBlockCardSelection` - a predicate for when a Card Link has been rendered and selected in the Teamwork Platform Editor;
  - `waitForEmbedCardSelection` - a predicate for when an Embed Link has been rendered and selected in the Teamwork Platform Editor.

  Further, a `cardClient` is now shipped from the same test helpers package, with up-to-date mock responses for a host of test URLs (in the format, `https://<type: 'inline' | 'block' | 'embed'>Card/<status: 'resolved' | 'unauthorised' | 'forbidden' | ...>`). Importantly _all_ selectors are powered by `testId`s part of the implementation of Smart Links in `@atlaskit/smart-card` and `@atlaskit/media-ui`.

- [`cfeee4c017`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfeee4c017) - Adding context information to formatted text analytics events (parent node + selection info)
- [`13dda820f6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/13dda820f6) - remove IE11 support from table/ui/styles.ts
- [`2f83154e42`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2f83154e42) - ED-10124 Remove the redundant flag allowUnsupportedContent from collab edit and default to false
- [`4834f87d96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4834f87d96) - EDM-1010: Fix image reszing within list & layout
- [`4bc106c8c5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4bc106c8c5) - ED-10036 Copy unit and integration tests from old list plugin
- [`e8b2e867a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e8b2e867a0) - refactor ui styles and css from table/ui/styles.ts
- [`a422948149`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a422948149) - ED-10132 Prevent backticks from converting to inline code when inside a code block
- [`7315203b80`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7315203b80) - Rename `AkCode` and `AkCodeBlock` exports to `Code` and `CodeBlock` for `@atlaskit/code`.
- [`335cc0e6cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/335cc0e6cd) - ED-9954 Fixed media link layout
- [`4c3cc9c1d6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c3cc9c1d6) - add media feature flags to media-picker
- [`5c283c56e7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c283c56e7) - Fix pluginFactory ExtensionState types falling back to any
- Updated dependencies

## 128.0.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 128.0.1

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 128.0.0

### Major Changes

- [`68ca47f536`](https://bitbucket.org/atlassian/atlassian-frontend/commits/68ca47f536) - ED-9145: Remove analyticsHandler prop.

  We have removed the prop `analyticsHandler` from the `Editor` component, as these events are no longer tracked.

  e.g.

  ```
   <Editor
    analyticsHandler={fn}
   />
  ```

  You can safely remove this prop.

### Minor Changes

- [`9cef81c5f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9cef81c5f0) - ED-9145: Remove GASv2 event calls invoked by withAnalytics
- [`92a85eab5a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/92a85eab5a) - ED-9598 Fix breakout for selected nodes
- [`41596c1581`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41596c1581) - EDM-925: fix cmd + k behaviour of Smart Links; respect user's display text
- [`fe31ba459f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe31ba459f) - ED-8198 Include Spec based validator behind toggle for Renderer
- [`b932cbbc42`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b932cbbc42) - Added support for rendering image captions
- [`62eb1114c4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62eb1114c4) - Enable passing of MediaFeatureFlags through Editor Renderer via MediaOptions to Media components
- [`84065cf60b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/84065cf60b) - ED-9652: Extract insert method from typeahed so it can be reused by element browser
- [`b3dad32cdd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3dad32cdd) - ED-9746: Add support to categories for quick insert items and extensions
- [`db1e7a477b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db1e7a477b) - ED-9684: Add match-case toggle in find/replace
- [`861d585ba8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/861d585ba8) - Changed mediaSingle to now render it's child adf nodes using nodeviews rather than directly with react
- [`b7cf6e5be1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7cf6e5be1) - ED-9145: Remove GASv2 event calls invoked by trackAndInvoke and commandWithAnalytics
- [`50b49e0eb9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50b49e0eb9) - [ED-9780] allow link mark inside bodied extension
- [`7abb7a2a51`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7abb7a2a51) - ED-9679: Add TTI measurements to editor-core
- [`d6efacb2a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6efacb2a3) - ED-9145: Remove GASv2 event calls invoked by analyticsService
- [`53d07c0c06`](https://bitbucket.org/atlassian/atlassian-frontend/commits/53d07c0c06) - ED-9652: Integrate Element browser with the editor

### Patch Changes

- [`4a1120b6a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a1120b6a8) - Fix quickInsert on mobile:

  - Fixed missing options on quickInsertPlugin + added tests
  - Mock `formatMessage` on Editor component on mobile bridge, to be able to not depend on i18n for now, and unblock native side work

- [`b185c79605`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b185c79605) - ED-9950 Add feature flag for upcoming predictable lists work
- [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the 'lodash' package instead of single-function 'lodash.\*' packages
- [`d2483f3d06`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2483f3d06) - EDM-930: Fix cursor appearing after selection for embeds and blocks
- [`9ef4fc596e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9ef4fc596e) - ED-9624: added a copy of CellSelection from prosemirror-tables
- [`1f3d2d4eda`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f3d2d4eda) - ED-9452: Ensure text is editable in Firefox when directly adjacent to uneditable dom nodes
- [`279ca8bd02`](https://bitbucket.org/atlassian/atlassian-frontend/commits/279ca8bd02) - ED-9447 Add keyboard navigation to ElementBrowser items
- [`6fbaccca68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6fbaccca68) - ED-7786 (ED-7785, ED-7786) fix table content overlow (e.g. dates) when columns widths are smaller than the content
- [`d91016d47e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d91016d47e) - ED-9652: Use quick insert search on element browser examples
- [`19c0061cd3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19c0061cd3) - [ED-9727] Adds track event for delete actions on list items.
- [`8fed75a7f1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8fed75a7f1) - ED-10091 fixed media linking drag and drop lost its link
- [`be55acf3c8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be55acf3c8) - ED-9652: Show a spinner while loading element browser
- [`178a5c4a90`](https://bitbucket.org/atlassian/atlassian-frontend/commits/178a5c4a90) - ED-9862: Check if longtask type is available in performance observer
- [`2bb4cb0f5f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2bb4cb0f5f) - CSS update to readd red delete border for media
- [`a6e1e11757`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a6e1e11757) - ED-9802: Prevent pasting negative numbers from converting into lists
- [`bd1b6db96a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bd1b6db96a) - ED-9651: Pass intl to plugin constructors
- [`a416fe8006`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a416fe8006) - ED-10134: Fixes issues when a non text selection would trigger autoformatting
- [`c4ced8f3e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c4ced8f3e8) - ED-9407:Fix forward delete bug of tasks and decisions inside table
- [`b6f6391797`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6f6391797) - Include fromCurrentDomain: boolean to link/smartlink create event
- [`fa96936872`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa96936872) - ElementBrowser Qa demo changes; Fix ElementItem icon width, add tooltip, escape to close inline dialog, update search placeholder font, replace / with Enter to insert icon, internationalise strings, and add initial EmptyState.
- [`aefd832e37`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aefd832e37) - Add empty paragraph after media group when inserted in layout column
- [`23aedc429a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/23aedc429a) - ED-9113 Reduce toolbar height to align with nav v3
- [`a0d36785a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a0d36785a0) - EDM-933: fix smart link replacement
- [`69ff62ba36`](https://bitbucket.org/atlassian/atlassian-frontend/commits/69ff62ba36) - ED-9788: Fix issue where bodied macros wouldn't update properly if cursor was inside
- [`889a2d9486`](https://bitbucket.org/atlassian/atlassian-frontend/commits/889a2d9486) - fix: updated error views for all Inline and Block links
- [`5013235947`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5013235947) - ED-9680 Fix not being able to search using IME input for composed languages eg. Japanese, Korean
- [`de5ee48f89`](https://bitbucket.org/atlassian/atlassian-frontend/commits/de5ee48f89) - fix: added icon prop on media-ui, InlineCardForbiddenView - moving to updated link framework for fforbidden view of Inline Smart Links.
- [`a203051a92`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a203051a92) - EDM-627 Fix typeover on media items
- [`50e8b99c3b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50e8b99c3b) - ED-9754: prevent typeahead crash from breaking synchrony
- Updated dependencies

## 127.0.3

### Patch Changes

- [`f3749628bb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3749628bb) - CEMS-1258: Fixing misaligned Sticky header cells on tables with merged cells

## 127.0.2

### Patch Changes

- [`64abcd247b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/64abcd247b) - CEMS-1231 make table contents align with row controls with sticky headers

## 127.0.1

### Patch Changes

- [`d03bff2147`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d03bff2147) - updated translations

## 127.0.0

### Major Changes

- [`6e5c32935a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e5c32935a) - Remove deprecated flag allowUnsupportedContent and enable by default
- [`35be24c587`](https://bitbucket.org/atlassian/atlassian-frontend/commits/35be24c587) - ED-9344: avoid toolbar layout shift in comment appearance

### Minor Changes

- [`86d3b209d2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/86d3b209d2) - ED-9576 Update emoji selection style to be more obvious
- [`760046f819`](https://bitbucket.org/atlassian/atlassian-frontend/commits/760046f819) - Add placeholder prop to Select, Date, String, Number, Custom field in ConfigPanel + display error message if promise returned from getFieldsDefinition rejects
- [`88adf1772e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/88adf1772e) - ED-9274 Fix block node selection in Safari
- [`6723d1e7c8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6723d1e7c8) - ED-9610: Use presets inside create plugins list
- [`2006639232`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2006639232) - ED-8880 Fire selection analytics events for: node, all & range selection

  More information on the events here: https://hello.atlassian.net/wiki/spaces/PData/pages/140331421/Minimum+Event+Spec+-+Editor#Selection-events

- [`b7c4fc3b08`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7c4fc3b08) - Preseve unsupported mark from getting lost
- [`f6204640c4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6204640c4) - ED-9638 Update "document selected", "document cut" & "document copied" analytics events to work with cell selections

  See in-depth info on the events here:

  - [Selection events](https://hello.atlassian.net/wiki/spaces/PData/pages/140331421/Minimum+Event+Spec+-+Editor#Selection-events)
  - [Clipboard events](https://hello.atlassian.net/wiki/spaces/PData/pages/140331421/Minimum+Event+Spec+-+Editor#Clipboard-events)

- [`be96983239`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be96983239) - ED-8881 Add analytics for cut and copy events in new clipboard plugin
- [`71c78f8719`](https://bitbucket.org/atlassian/atlassian-frontend/commits/71c78f8719) - EDM-642 Use new ActivityProvider and it's going to be a replacement of the existing `@atlaskit/activity`. The new ActivityProvider will use the new platform API instead of talking to the old Activity Service API.
- [`faf010cbc3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/faf010cbc3) - ED-9212: Add support for extension auto convert

  ## Breaking changes:

  Renamed the following exports from '@atlaskit/editor-common/extensions':

  - from `ExtensionModuleType` to `ExtensionQuickInsertModule`;
  - from `getItemsFromModule` to `getQuickInsertItemsFromModule`,

  Renamed the following exports from '@atlaskit/editor-common':

  - from `ExtensionModuleType` to `ExtensionQuickInsertModule`;

- [`584cd5c528`](https://bitbucket.org/atlassian/atlassian-frontend/commits/584cd5c528) - Add cardConfluencePayload in example-helpers
- [`6166ec91b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6166ec91b0) - ED-9126 Make unsupported node selection consistent
- [`9aa6146cdf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9aa6146cdf) - TYPH-106: Enable typing performance tracking on Mobile
- [`650bb09df1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/650bb09df1) - EDM-409: Comment Editor will now align media inserted to left by default

### Patch Changes

- [`722438cfcc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/722438cfcc) - ED-9557: fix table cell popup menu ignoring editor boundaries
- [`c962dfd3dd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c962dfd3dd) - ED-9574: Allow codeblock to be deleted via toolbar when codeblock node is selected
- [`d53d146e11`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d53d146e11) - ED-9646: Update inline comment validation to cover all nodes and smaller inline node cases
- [`e1cc8bcc74`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e1cc8bcc74) - ED-9570: Ensure find/replace onCancel fires strictly when toolbar is active/open
- [`d035bea822`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d035bea822) - chore: add integration tests for Smart Links lazy rendering
- [`ab83c61b08`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ab83c61b08) - Media analytics fixes involving copy pasting media groups, resizing medis singles and inserting media nodes.
- [`2179cf4e09`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2179cf4e09) - ED-9107: restore table column header controls on Safari
- [`03851d1e5c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/03851d1e5c) - ED-9339: fix macros overflowing expand container
- [`1c79549044`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1c79549044) - ED-9611: Fix issue with pasting a list with a list item starting with - or \*
- [`467ff2e758`](https://bitbucket.org/atlassian/atlassian-frontend/commits/467ff2e758) - ED-9563: Fix layout paste analytics content attribute to be layoutSection
- [`cde426961a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cde426961a) - Bumps Avatar and AvatarGroup depenedencies
- [`ae9b0d5086`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae9b0d5086) - ED-9310: Fix decisions positioning inside layout nodes and preserve layout selectable area padding
- [`1ae91e8167`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1ae91e8167) - ED-9388: Prevent selecting layout, codeblock, expand, decision nodes during drag release over padding
- [`09ec1c6758`](https://bitbucket.org/atlassian/atlassian-frontend/commits/09ec1c6758) - EDM-847: Add analytics to media and embed layout options
- [`7c6dc39447`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c6dc39447) - ED-9568 annotations are now preserved when copy/pasting; also updated general copy/paste behaviour to preserve formatting of the pasted content, so that e.g. copying italic text into bold will preserve both italic and bold.
- [`3245eaef0e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3245eaef0e) - UR-710 Add containerId, objectId, and childObjectId to mention selected event
- [`294e489427`](https://bitbucket.org/atlassian/atlassian-frontend/commits/294e489427) - ED-9381 Internationalising Element Browser
- [`df675606be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df675606be) - ED-9560: Restore existing codeblock selection when language changed via toolbar
- [`4557fa3ce4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4557fa3ce4) - Allow ConfigPanel to accept an empty error message
- [`2c641859a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c641859a8) - ED-9318: Ensures text matched from find/replace is accurately highlighted after document edits
- [`87c1557f7c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87c1557f7c) - ED-9319: Ensure find/replace selection highlights update correctly on match text removals
- [`f668a2f87c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f668a2f87c) - ED-9547: Fixes issue where the inline comment view wouldnt trigger after creating a comment
- [`e633e8da2f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e633e8da2f) - EDM-719 Fix linting error when checking the Edge version number
- [`370ef2dd3b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/370ef2dd3b) - Remove SVG from source and replace with inline SVG, using new empty-state renderImage prop
- [`1a6b7e205b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a6b7e205b) - NOISSUE: Use better emoji sprite selector in find-replace VR test
- [`bb1c337c11`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bb1c337c11) - ED-9412: Fix selected node and danger style interactions
- [`4476c0426a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4476c0426a) - ED-9453: Allow nodes directly adjacent to inline code marks to be selected
- [`eee5ec3f95`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eee5ec3f95) - Given user-recommendations-service now returns users and teams interspersed and ranked, the metric needs users and teams on the same event to reflect actual list (and with correct order) shown to the user in order to correctly quantify effectivity of mention recommendation.
- [`4a4c9ebf26`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a4c9ebf26) - ED-9667: Improve loading experience for Config
- [`04c8ad1423`](https://bitbucket.org/atlassian/atlassian-frontend/commits/04c8ad1423) - ED-9324: Ensure find/replace floating panel always stacks underneath other editor floating panels
- [`588c7e0115`](https://bitbucket.org/atlassian/atlassian-frontend/commits/588c7e0115) - ED-9481 Fix analytics for unsupported content GasV3
- [`3c09b35ce2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c09b35ce2) - Move Display text in link search dropdown up and tweak cosmetics
- [`e2f2b6497d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e2f2b6497d) - ED-9721: Do not show edit button if update method is not provided
- [`fd1a77c1b6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd1a77c1b6) - ED-9535: show toolbar menu if at least one option is allowed
- [`8855a71596`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8855a71596) - EDM-929: Fix width for embeds in container nodes like layouts
- [`c72502e22a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c72502e22a) - ED-9594: Remove cursor pointer from decision items in renderer
- [`d5c987637f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d5c987637f) - ED-9322: Ensures find text updates in find/replace do not cause stale replace text states to reappear/overwrite the current replace text
- [`8f2f2422a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f2f2422a1) - EDM-955: Fix error state height for embeds
- [`36e4b8e6c8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/36e4b8e6c8) - Fix width for media when wrapped width is not available
- Updated dependencies

## 126.0.1

### Patch Changes

- [`d218cac0a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d218cac0a3) - ED-9816 fix: create appropriate item for image upload

## 126.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 125.1.0

### Minor Changes

- [`64d75b8f7e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/64d75b8f7e) - Call getFieldsDefinition with extension parameters
- [`a602a1a359`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a602a1a359) - [FM-3814] Enables the mobile bridge to add two new blocks items: divider and expand

### Patch Changes

- [`029fe86668`](https://bitbucket.org/atlassian/atlassian-frontend/commits/029fe86668) - Fix browser freeze issue
- [`a614b880df`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a614b880df) - [FM-3627] Fix bug in editor-mobile-bridge where it required two taps to trigger the 'Toggle Expand' button. Now it works with a single tap, and is consistent with the desktop web experience.
- [`89d31dbb00`](https://bitbucket.org/atlassian/atlassian-frontend/commits/89d31dbb00) - Change card/pm-plugins to render as dumblink with queued inline card
- [`29ffa9c4d0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/29ffa9c4d0) - ED-9357 Fix links replacing text when text hasn't changed
- [`2c174200a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c174200a5) - Fix duplicate smart link and non-smart link analytics emitted from link typeahead menu
- [`5daf66df61`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5daf66df61) - ED-9439: Do not store node in the state - get it from selection to avoid stale data
- [`ea24b0ad90`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea24b0ad90) - ED-9341 restructured annotation plugin commands to avoid redundant dispatches
- [`b7ff890135`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7ff890135) - ED-9405 added adf viewer example for DAC
- [`c3729993fb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3729993fb) - Image singles now show selected state when selected in a range
- [`01c27cf8cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/01c27cf8cf) - ED-9552 Move SetAttrsStep into adf-schema
- [`b17d1c437a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b17d1c437a) - EDM-920: add required className to intersection observer loader
- [`73552b28ae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73552b28ae) - ED-8835 Use selection plugin to style smartlinks
- [`ba7242598f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba7242598f) - CEMS-378 load macro title from macroMetadata
- [`a1b1dc690e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1b1dc690e) - ED-9373 Fix panel being selected when clicking between paragraphs inside
- [`9136a3e011`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9136a3e011) - ED-9542 Change editor-core/plugins/{r-w} imports to comply with Atlassian conventions
- [`63ed17b2bf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63ed17b2bf) - ED-9343 close view comments component on delete
- [`7696db8259`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7696db8259) - EDM-834: Fix toolbar not moving with aligned embeds
- [`613b7549e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/613b7549e6) - Element browser smart component, adding unit tests, and replacing element items css grid container with flexbox
- [`770984852a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/770984852a) - add VR test to editor collab + add test-id to collab avatars
- [`d4220ca169`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d4220ca169) - ED-9315: Ensures find/replace picks up partially styled or marked text when determining text matches
- [`bf155d0aa7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf155d0aa7) - ED-9003 Use selection plugin to style block and bodied extensions
- [`b8d3690c47`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8d3690c47) - CEMS-1108: always match sticky header column widths from table
- [`363e3e6877`](https://bitbucket.org/atlassian/atlassian-frontend/commits/363e3e6877) - ED-9536 Add 'create' and 'delete' events to annotation event emitter
- [`1b69b8dc78`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1b69b8dc78) - ED-9579 Fix uncaught error issue inside extension
- [`b7a4b99d9c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7a4b99d9c) - ED-9546 Add option to disable annotatios on whitespace

  Adds the option to disable creation of annotations on whitespace nodes. Note, this is per provider (see example). It will prevent annotation creation if any node in the current user selection is empty.

  ```
  <FullPageExample
    annotationProviders={{
      inlineComment: {
        ...
        disallowOnWhitespace: true,
      },
    }}
  />
  ```

- [`62d2c116af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62d2c116af) - Fix width for media when wrapped width is not available
- Updated dependencies

## 125.0.1

### Patch Changes

- [`8566522867`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8566522867) - ED-9613 fix: prevent Android from closing keyboard when clicking placeholder-text

## 125.0.0

### Major Changes

- [`b0df4dc455`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0df4dc455) - NO-ISSUE refactor: make ContextPanel.visible required
  NO-ISSUE perf: do not trigger context panel state transition on textinput

### Minor Changes

- [`0ae829a4ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ae829a4ea) - EDM-648: Adds resizing and alignment to embed cards
- [`1315ce63a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1315ce63a0) - CEMS-720: add sticky table header support to editor
- [`28758c6c4d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/28758c6c4d) - ED-8812 Make code block selectable

### Patch Changes

- [`fe46facd37`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe46facd37) - ED-9124 Apply expand selection styles using the selection plugin, and update to use a blanket style rather than a background colour
- [`e37e0fb768`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e37e0fb768) - ED-9008: Allow images on select lists for Config Panel
- [`1508cc97c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1508cc97c9) - fix: lazy-rendering, React key, isFrameVisible in @atlaskit/renderer and click handlers for EmbedCard components.
- [`cdf049f462`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cdf049f462) - ED-9198: Pass keywords down from manifest to quick insert provider
- [`06a6b937ac`](https://bitbucket.org/atlassian/atlassian-frontend/commits/06a6b937ac) - perf: untangle avatars ui to avoid wasted render cycles
- [`6b50c37be9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b50c37be9) - perf: avoid insert-block items rerendering
- [`6113a602e1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6113a602e1) - ED-9343 Added onClose for annotation view component
- [`b506576a91`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b506576a91) - CEMS-1034: fix performance regression when interacting with table controls with sticky headers enabled
- [`0ccff66344`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ccff66344) - ED-9227 Adding Stateless Element Browser Component
- [`b498fe941e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b498fe941e) - ED-9123 ED-9129 Use selection plugin to generate selection styling for selected date & status nodes
- [`1ba62fffb2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1ba62fffb2) - Fix a bug where small image when aligned left changes to half line width in renderer
- [`9c6c6683bd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9c6c6683bd) - ED-9360: Fix toolbar to be at the head of selection not always anchor.
- [`92b9a96267`](https://bitbucket.org/atlassian/atlassian-frontend/commits/92b9a96267) - ED-9340 Add annotation shortcut to shortcut menu
- [`bbc2ea896d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bbc2ea896d) - ED-9151 Fixed issues with adding comments by selecting all content, and selecting the whole paragraph
- [`22130d8fce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22130d8fce) - ED-9301 Fix danger styling not appearing on parent when child nodes are selected
- [`23dcb270a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/23dcb270a1) - ED-9390 Remove unnecessary !important modifiers for danger styling
- [`0894ac2163`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0894ac2163) - ED-9375 Update internal logic of selection plugin, so its selected node class decorations are added in a new transaction, rather than just using the `onSelectionChange` method of the plugin state factory

  This fixes an issue where extensions would re-render when going from a gap cursor selection to a node selection in a way that still allows us to add the selected node class decorations to selected extension nodes

- [`6ce2418b54`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ce2418b54) - ED-9349 Remove hover state from decision item
- [`508b972baf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/508b972baf) - ED-9384 Corrections to inline comments analytics: added analytics event on resolve from consumer, changed comment added to insterted, changed overlap to start from 2 annotations.
- [`7c75ddf54f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c75ddf54f) - [EDM-704]: Fix EmbedCard UI issues
- [`996e045cc4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/996e045cc4) - EDM-776: add platform prop to @atlaskit/smart-card for rendering fallback on mobile (embed -> block)
- [`71a4de3370`](https://bitbucket.org/atlassian/atlassian-frontend/commits/71a4de3370) - ED-9524 Prevent right side shadow from overlapping product UI elements
- [`d8c2cecba5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d8c2cecba5) - ED-9411 Refactor selection of decisions, panels and layouts to use node selection util function
- [`3a006398d2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a006398d2) - Fix to avoid showing "create comment" toolbar right after an inline comment was created
- [`5d022f8b0c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d022f8b0c) - ED-9343 fixed comments box reopening on mouseup
- [`2589a3e4fc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2589a3e4fc) - EDM-713: fix copy-paste from Renderer to Editor on Firefox
- [`e557e359c4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e557e359c4) - ED-9227 Adding Modal and inline dialog examples for Element Browser
- [`3a675aaa4e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a675aaa4e) - ED-9305: Update annotation toolbar to only show on text selections

  ED-9359: Update annotation toolbar disabled message

- [`51a73b9961`](https://bitbucket.org/atlassian/atlassian-frontend/commits/51a73b9961) - ED-9308 Migrate Unsupported Content from GasV2 to GasV3 Analytics
- [`68f848b954`](https://bitbucket.org/atlassian/atlassian-frontend/commits/68f848b954) - EDM-891 fix selection crash
- [`d0dca5ab81`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0dca5ab81) - ED-9579 Fix uncaught error issue inside extension
- [`ea6dd76837`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea6dd76837) - ED-9128 Make divider selection use selection plugin to add selected styles

  Also increase click leniency to 4px above/below divider

  Export new line height const from editor-common `akEditorLineHeight`

- Updated dependencies

## 124.0.5

### Patch Changes

- [`fc83c36503`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc83c36503) - Update translation files via Traduki build

## 124.0.4

### Patch Changes

- [`859ad12010`](https://bitbucket.org/atlassian/atlassian-frontend/commits/859ad12010) - ED-9622: fix breakout tables that were appearing cut off when nested inside bodied elements (expand, layout, etc)

## 124.0.3

### Patch Changes

- [`455e383cda`](https://bitbucket.org/atlassian/atlassian-frontend/commits/455e383cda) - Use IntersectionObserver in smart-card to detect when a link enters the viewport

## 124.0.2

### Patch Changes

- [`2cfef4d0fa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2cfef4d0fa) - HOTFIX ED-9621 Forge extensions are not appearing in quick insert menu

## 124.0.1

### Patch Changes

- [`4560b65a4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4560b65a4f) - upgrade react-transition-group to latest

## 124.0.0

### Major Changes

- [`1543651ede`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1543651ede) - ED-9174: Take control of context panel when plugins need and add smooth enter/leave transition

  Products were trying to solve transition issues on their side and it was causing issues when plugins tried to open the context panel.
  This change will override any limitation we had before, taking control of the panel independent of existing panels.

  The breaking change here is that <ContextPanel> now needs a single child so having text nodes or a collection of nodes directly inside won't work. The simplest solution is to wrap the content on a <div> if required. There is nothing to change if you were passing a single node already.

- [`68baa7f1a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/68baa7f1a5) - ED-9246 Remove `pollingInterval` from annotation provider. Add meta for `replaceDocument` actions.

  This change removes the `pollingInterval` property from the `annotationProvider` editor prop. This changes as the annotation provider no longer uses an internal timer, but rather subscribes and listens to a provided `AnnotationEventEmitter`.

  ### Before

  ```
  <Editor
    annotationProviders={{
      inlineComment: {
        pollingInterval: 1000, // <==== This property is being removed
        createComponent: ExampleCreateInlineCommentComponent,
        viewComponent: ExampleViewInlineCommentComponent,
        getState: this.inlineCommentGetState,
      },
    }}
  />
  ```

  ### After

  ```
  <Editor
    annotationProviders={{
      inlineComment: {
        createComponent: ExampleCreateInlineCommentComponent,
        viewComponent: ExampleViewInlineCommentComponent,
        getState: this.inlineCommentGetState,
      },
    }}
  />
  ```

- [`d31f2fd85b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d31f2fd85b) - ED-8917 Update annotation provider to sync updates with an EventEmitter

  As part of the inflight work of building annotations within the editor, the annotation provider API is being updated to be event based. This is part of the work to make the annotation provider no longer rely on a timer, rather make it rely on pushed updates from the consumer.

  This change also includes

  - Renaming of the Editor Prop `AnnotationProvider` to `AnnotationProviders` (plural).
  - Coupling the UI component with the relevant annotation provider
  - Adding the `updateSubscriber` attribute

  ### Before

  ```
  <Editor
    annotationProvider: {
      createComponent: ExampleCreateInlineCommentComponent,
      viewComponent: ExampleViewInlineCommentComponent,
      providers: {
        inlineComment: {
        getState: getCommentState,
      },
    }
  >
  ```

  ### After

  ```
  <Editor
    annotationProviders: {
      inlineComment: {
        createComponent: ExampleCreateInlineCommentComponent,
        viewComponent: ExampleViewInlineCommentComponent,
        getState: getCommentState,
        updateSubscriber: updateEmitter
      },
    }
  >
  ```

  Where `updateEmitter` is an instance of `AnnotationUpdateEmitter` imported from `@atlaskit/editor-core`. It's a strongly typed `EventEmitter` that should only fire with `resolve` and `unresolve`, passing a single `annotationId`.

  ```
  import {AnnotationUpdateEmitter} from '@atlaskit/editor-core';

  const updateEmitter = new AnnotationUpdateEmitter();
  updateEmitter.emit('resolve', myAnnotationId);
  ```

### Minor Changes

- [`76160b5c71`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76160b5c71) - [FM-2506] added cursor selection location plugin
- [`fd90289419`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd90289419) - ED-8981 Make decision items selectable
- [`6706fd9eaa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6706fd9eaa) - ED-9076: Add participants count to performance related analytics events
- [`50c333ab3a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50c333ab3a) - EDM-216: Adds EmbedCards in the Editor under the flag - allowEmbeds in the UNSAFE_cards prop

### Patch Changes

- [`ce2f9b86fd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ce2f9b86fd) - Remove images from mixed content coming from Microsoft clipboard
- [`567df106ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/567df106ff) - fix: generate id internal to smart-card
- [`c9b68d377a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c9b68d377a) - refactor: restructure insert block for performance and clarity
- [`84a9ee0334`](https://bitbucket.org/atlassian/atlassian-frontend/commits/84a9ee0334) - ED-9296: Optimistic creation of inline comment on plugin state
- [`8731f7cde5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8731f7cde5) - remove dangerouslySetInnerHtml usage from quickinsert icons
- [`1d9826a065`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1d9826a065) - CEMS-720: unify how we calculate table row heights in editor

  This should cause less jank when interacting with table controls and resizing columns.

- [`1ba6ac892d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1ba6ac892d) - feat: pass IDs to Smart Link components for performance instrumentation
- [`8e63ad7ec7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8e63ad7ec7) - ED-9206: Auto focus on initial field and adjust spacing
- [`7682a09312`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7682a09312) - [ED-9142, ED-9342] Add consistent styling for annotations with hover cursor
- [`5d40d34b1b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d40d34b1b) - ED-9147 textSelection value is provided for annotation create and view components
- [`ae043f4cf2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae043f4cf2) - ED-9345 Migrate filter-steps analytics to GASv3
- [`9961ccddcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9961ccddcf) - EDM-665: fix error handling of Smart Links
- [`9265feff5a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9265feff5a) - ED-9087: inline comments - added analytics when viewing comments
- [`e30894b112`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e30894b112) - [FM-3716] First Inline Comments implementation for Renderer
- [`e1ce3614e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e1ce3614e3) - perf: avoid rerendering ReactEditorView children via editor dom element
- [`ef36de69ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ef36de69ad) - ED-8358 Change decision to use a grey background
- [`a1e343b428`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1e343b428) - CEMS-720: try to avoid using CSS transforms on nodes with breakout mark

  Sticky headers depend on `position: fixed`, which does not work when inside an Element that has a parent with the CSS `transform` property.

  We now calculate an appropriate `margin-left` value and use that instead, falling back to the `margin` + `transform` approach if the element has no width.

- [`f0b0035b51`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f0b0035b51) - ED-9002 fix: send analytics about synchrony errors
- [`e513ce3d8b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e513ce3d8b) - ED-9179: Enable missing providers for archv3 mobile bridge
- [`d65881c88f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d65881c88f) - Fix bug add file to existing MediaGroup when Gap cursor is next to a MediaGroup
- [`7add7519a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7add7519a0) - Various fixes around image re-sizing in different contexts (table cell, expand, layout column)
- [`ade794da52`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ade794da52) - redirected collab edit page to use adev
- [`ef36de69ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ef36de69ad) - ED-8358 Fix spacing of decisions in tables to not be touching
- [`8c5c924a13`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c5c924a13) - CEMS-720: use margin-left rather than CSS transforms on breakout tables
- [`1fd1022e87`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1fd1022e87) - perf: avoid rendering content area children
- [`32186203f5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/32186203f5) - ED-9146 fix issues of paste items copied from inside expand
- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove unused dependencies
- [`e2a04f74d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e2a04f74d7) - Fixes issue with presence badge positioning
- [`93daf076e4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93daf076e4) - fix: bugs with Block Links - floating menu placement, spacing, editing of link title or source, lazy loading.
- [`baaad91b65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/baaad91b65) - Updated to use the latest and more performant version of `@atlaskit/avatar`
- [`f7ee96b6c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7ee96b6c3) - Move sanitizeNode from editor-core to adf-utils so that it can be shared easier
- [`69d56a78b9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/69d56a78b9) - Standardise unsupported content node components between editor-core and editor-common. They now live in editor-common as a single source of truth.
- [`98f462e2aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/98f462e2aa) - Bumping use the latest version of @atlaskit/spinner
- [`3e2005299e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e2005299e) - ED-9302 Fix newline being inserted above pasted decision
- [`0ae0040df0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ae0040df0) - only render Embed appearance when FF is enabled
- Updated dependencies

## 123.0.5

### Patch Changes

- [`e1fae67451`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e1fae67451) - ED-9365 fix: fully feature-flag performance tracking

## 123.0.4

### Patch Changes

- [`649f69b6d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/649f69b6d7) - Patch all packages that are used by confluence that have a broken es2019 dist

## 123.0.3

### Patch Changes

- [`05aafbffcb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/05aafbffcb) - ED-9234 Fix date picker remaining open when date node moved or deleted

## 123.0.2

### Patch Changes

- [`176ac096a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/176ac096a8) - ED-9372 Fix issue where extensions would re-render when going from gap cursor selection to node selection

## 123.0.1

### Patch Changes

- Updated dependencies

## 123.0.0

### Major Changes

- [`e97f14eade`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e97f14eade) - ED-9155: Rename prop `extensionParams` to `node` in the extensions api v2

### Minor Changes

- [`d16adc8554`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d16adc8554) - ED-8988 Add new selection plugin which will be responsible for managing selection styles- [`ee0333aa64`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ee0333aa64) - ED-6318 Add (None) option to top of code block language list- [`fc3c659e87`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc3c659e87) - ED-9038 ED-9040 Add selection styles for mention & emoji nodes- [`c8e601e6fc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8e601e6fc) - ED-8814 Add selection to panel- [`8bc9f3e9af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8bc9f3e9af) - ED-8942: Changed default font size for full width editor and renderer

  - Previously default font size for full page editor was 14px. Now, when `allowDynamicTextSizing` is disabled it equals to 16px.
  - Font size in table was 14px, ignoring dynamic text sizing font size, after this change it follows the same rules as the rest of the editor, namely it will get updated font size.- [`5a7088d3c5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a7088d3c5) - ED-8782: Make layouts selectable

  - ED-9044: Add ProseMirror node selection for layouts
  - ED-9045: Add selection styles for layouts

### Patch Changes

- [`58b681e7f7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58b681e7f7) - ED-8648 fix converting indented paragraph to a list- [`bc0c95a066`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc0c95a066) - ED-9250: fix font size for chromeless editor- [`9dea617f4a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9dea617f4a) - Ed-9205: Prevent setting of localIds on task and decisions from being added to history. Also avoids unneccesary scrolling- [`63c5d6a1ac`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63c5d6a1ac) - ED-8279 Fixed adding status to action item from the main toolbar- [`0b596fcb22`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b596fcb22) - ED-9248 Fix bug where deleting from floating toolbar menu did not work for selected panel nodes- [`d1a056f303`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1a056f303) - ED-9254 Specify dark text colour for personal mentions selected state- [`ffa12f43b7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ffa12f43b7) - ED-8932: add logic to insert new task above when cursor is a the start of a task node- [`cd68434a24`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd68434a24) - Enable shouldOpenMediaViewer property for ReactRenderer in Kitchen Sink example- [`4b4a969816`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b4a969816) - ED-9140 validate inline comment selection only when entering draft mode- [`9b1a0d0033`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b1a0d0033) - ED-8358 Revert making decisions background grey- [`7cef5eb5dc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7cef5eb5dc) - ED-9253 Fix bug where panel was still selected if clicked and dragged from inside panel, releasing mouse on padding

  In this case it should select the text that was selected rather than the panel- [`4cac8c6496`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4cac8c6496) - ED-9093 Fix date picker not closing when selecting other nodes- [`3b84d87886`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b84d87886) - ED-9170 Provide an editor prop that allows the consumer to specify their own custom logo in the top right of the toolbar

  ````
  <Editor
    ...
    primaryToolbarIconBefore?: ReactElement;
  />
  ```- [`b07de6e3eb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b07de6e3eb) - ED-9250: Fix font size for chromeless appearance- [`02217f5945`](https://bitbucket.org/atlassian/atlassian-frontend/commits/02217f5945) - Perform normalizeUrl before md.normalizeLinkText in pm-plugins to resolve links with fullstops at end- [`37b447ff05`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37b447ff05) - ED-9255 Fix various issues with node selection on mobile

  - When mention/emoji nodes were selected, there were issues backspacing, for now we will not show the keyboard during selection
  - When panel nodes were selected, there were also issues backspacing, now we disable panel selection completely on mobile- [`56a7357c81`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56a7357c81) - ED-9197: upgrade prosemirror-transform to prevent cut and paste type errors

  It's important to make sure that there isn't any `prosemirror-transform` packages with version less than 1.2.5 in `yarn.lock`.- [`abc9b1df18`](https://bitbucket.org/atlassian/atlassian-frontend/commits/abc9b1df18) - ED-9116 inline-comments: draft comment analytics - fill in overlaps and inputMethod data- [`db7f76a26c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db7f76a26c) - ED-9144: Keep context panel open when cursor is inside a bodied extension- [`12cd8f8c1b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12cd8f8c1b) - ED-9048: Allow consumers to open the config after inserting an extension- Updated dependencies
  ````

## 122.0.0

### Minor Changes

- [minor][c8d0ce5b94](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8d0ce5b94):

  FM-3537: Whitelist quick insert items on bridge- [minor][cf41823165](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf41823165):

  ED-9049: Make post processing function async to allow for backend operations if need- [minor][aec7fbadcc](https://bitbucket.org/atlassian/atlassian-frontend/commits/aec7fbadcc):

  ED-8833 ED-8834 Make status and date selected styling consistent- [minor][e477132440](https://bitbucket.org/atlassian/atlassian-frontend/commits/e477132440):

  ED-8231 Implement keyboard accessible date picker

### Patch Changes

- [patch][7e4d4a7ed4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e4d4a7ed4):

  Adding `insertMentionQuery` and `insertEmojiQuery` for mobile to dispatch typeahead menus from native toolbar- [patch][999fbf849e](https://bitbucket.org/atlassian/atlassian-frontend/commits/999fbf849e):

  Refactor editor emoji to use HOC composition instead of duplication.- [patch][b202858f6c](https://bitbucket.org/atlassian/atlassian-frontend/commits/b202858f6c):

  ED-8389 fix: do not try to access columResizing plugin state if it is undefined- [patch][9cee2b03e8](https://bitbucket.org/atlassian/atlassian-frontend/commits/9cee2b03e8):

  ED-9065: stop tables from updating plugin state on each keystroke- [patch][26de083801](https://bitbucket.org/atlassian/atlassian-frontend/commits/26de083801):

  ED-9083 Fire analytics events on open close draft inline comments- [patch][d3cc97a424](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3cc97a424):

  Adding link-url testId to HyperlinkAddToolbar- [patch][00f64f4eb8](https://bitbucket.org/atlassian/atlassian-frontend/commits/00f64f4eb8):

  ED-9086 analytics for add inline comments- [patch][4f70380793](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f70380793):

  ED-8915: add global shortcut ctrl+alt+C for creating inline comments- [patch][5b301bcdf6](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b301bcdf6):

  ED-8970 Fix extensionProvider doesn't add items to slash menu when quickInsert provider is unavailable- [patch][729a4e4960](https://bitbucket.org/atlassian/atlassian-frontend/commits/729a4e4960):

  ED-8912 Added temporary highlight for inline comments- [patch][384791fb2b](https://bitbucket.org/atlassian/atlassian-frontend/commits/384791fb2b):

  ED-9089 analytics for inline comment resolve- [patch][c6b145978b](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6b145978b):

  ED-9066 Fix ContextPanel plugin updates on every keystroke- [patch][736507f8e0](https://bitbucket.org/atlassian/atlassian-frontend/commits/736507f8e0):

  ED-8909: inline-comments: fixed positioning of floating toolbar- [patch][9e3646b59e](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e3646b59e):

  Fix mediaGroup cards so that they show selected state when hilighting text around them- Updated dependencies [9b295386e7](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b295386e7):

- Updated dependencies [3b776be426](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b776be426):
- Updated dependencies [999fbf849e](https://bitbucket.org/atlassian/atlassian-frontend/commits/999fbf849e):
- Updated dependencies [62390c4755](https://bitbucket.org/atlassian/atlassian-frontend/commits/62390c4755):
- Updated dependencies [4d8d550d69](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d8d550d69):
- Updated dependencies [3940bd71f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/3940bd71f1):
- Updated dependencies [9e4b195732](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e4b195732):
- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [e95a8726e2](https://bitbucket.org/atlassian/atlassian-frontend/commits/e95a8726e2):
- Updated dependencies [92d04b5c28](https://bitbucket.org/atlassian/atlassian-frontend/commits/92d04b5c28):
- Updated dependencies [d6eb7bb49f](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6eb7bb49f):
- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [22704db5a3](https://bitbucket.org/atlassian/atlassian-frontend/commits/22704db5a3):
- Updated dependencies [f6667f2909](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6667f2909):
- Updated dependencies [f7f2068a76](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7f2068a76):
- Updated dependencies [acc12dba75](https://bitbucket.org/atlassian/atlassian-frontend/commits/acc12dba75):
- Updated dependencies [9a534d6a74](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a534d6a74):
- Updated dependencies [167a55fd7a](https://bitbucket.org/atlassian/atlassian-frontend/commits/167a55fd7a):
- Updated dependencies [1156536403](https://bitbucket.org/atlassian/atlassian-frontend/commits/1156536403):
- Updated dependencies [5f075c4fd2](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f075c4fd2):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [a4acc95793](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4acc95793):
- Updated dependencies [68ff159118](https://bitbucket.org/atlassian/atlassian-frontend/commits/68ff159118):
- Updated dependencies [1e7e54c20e](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e7e54c20e):
- Updated dependencies [6efb12e06d](https://bitbucket.org/atlassian/atlassian-frontend/commits/6efb12e06d):
- Updated dependencies [0059d26429](https://bitbucket.org/atlassian/atlassian-frontend/commits/0059d26429):
- Updated dependencies [a4d063330a](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4d063330a):
- Updated dependencies [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
- Updated dependencies [ca494abcd5](https://bitbucket.org/atlassian/atlassian-frontend/commits/ca494abcd5):
- Updated dependencies [cf41823165](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf41823165):
- Updated dependencies [7a2540821c](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a2540821c):
- Updated dependencies [aec7fbadcc](https://bitbucket.org/atlassian/atlassian-frontend/commits/aec7fbadcc):
  - @atlaskit/media-picker@54.1.1
  - @atlaskit/smart-card@13.2.0
  - @atlaskit/editor-common@45.1.0
  - @atlaskit/calendar@9.2.7
  - @atlaskit/media-card@67.2.1
  - @atlaskit/tooltip@15.2.6
  - @atlaskit/toggle@8.1.7
  - @atlaskit/button@13.3.11
  - @atlaskit/avatar-group@5.1.2
  - @atlaskit/adf-schema@9.0.1
  - @atlaskit/datetime-picker@9.4.0
  - @atlaskit/icon@20.1.1
  - @atlaskit/select@11.0.10
  - @atlaskit/logo@12.3.4
  - @atlaskit/code@11.1.5
  - @atlaskit/modal-dialog@10.5.7
  - @atlaskit/avatar@17.1.10
  - @atlaskit/adf-utils@9.2.0
  - @atlaskit/renderer@58.0.0
  - @atlaskit/droplist@10.0.4
  - @atlaskit/checkbox@10.1.11
  - @atlaskit/menu@0.4.1
  - @atlaskit/form@7.2.1
  - @atlaskit/lozenge@9.1.7
  - @atlaskit/webdriver-runner@0.3.4
  - @atlaskit/dropdown-menu@9.0.3
  - @atlaskit/task-decision@16.0.11
  - @atlaskit/editor-bitbucket-transformer@6.3.3
  - @atlaskit/editor-json-transformer@7.0.11
  - @atlaskit/editor-markdown-transformer@3.1.22
  - @atlaskit/editor-test-helpers@11.1.1

## 121.0.0

### Major Changes

- [major][823d80f31c](https://bitbucket.org/atlassian/atlassian-frontend/commits/823d80f31c):

  ED-8982 Split annotation UI component into two pieces

  Changed the Editor's `annotationProvider` interface to split the annotation component into two parts. A `createComponent` and `viewComponent`.

  ### Before

  ```
  <Editor
    annotationProvider={
      component: InlineCommentComponent,
      ...
    }
  />
  ```

  ### After

  See example use case at `packages/editor-core/examples/26-annotation-experiment.tsx`

  ```
  <Editor
    annotationProvider={
      createComponent: CreateInlineCommentComponent,
      viewComponent: ViewInlineCommentComponent,
      ...
    }
  />
  ```

  Where `CreateInlineCommentComponent` methods are

  ```
  /**
    * Creates an annotation mark in the document with the given id.
    */
  onCreate: (id: string) => void;

  /**
    * Indicates that a draft comment was discarded/cancelled
    */
  onClose?: () => void;
  ```

  Where `ViewInlineCommentComponent` methods are

  ```
  /**
    * Resolves an annotation with the given ID around the selection.
    */
  onResolve: (id: string) => void;

  /**
    * Removes the annotation from the document
    */
  onDelete?: (id: string) => void;
  ```

### Minor Changes

- [minor][5d430f7d37](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d430f7d37):

  ED-8517 Add localId support to Extension node

  **BREAKING CHANGE**
  `ExtensionContent` has been removed.- [minor][7e26fba915](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e26fba915):

  ED-8911 Add ability to create annotation on document from annotation component- [minor][5167f09a83](https://bitbucket.org/atlassian/atlassian-frontend/commits/5167f09a83):

  ED-3504 Add find/replace functionality into the editor

  To enable this set the editor prop `allowFindReplace={true}` and a new search button will appear in the right-hand side of the toolbar

  Click this to open a popup which can be used to find, find next, find previous, replace and replace all. While selection is inside the editor, you can also use the Cmd+f shortcut to open the popup.- [minor][05539b052e](https://bitbucket.org/atlassian/atlassian-frontend/commits/05539b052e):

  Introducing `id` for each quick insert item- [minor][a1ee397cbc](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1ee397cbc):

  Improve quick insert search results with Fuse.js- [minor][dc84dfa3bc](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc84dfa3bc):

  ED-8908 Add floating toolbar for creating inline comments in Editor- [minor][318a1a0f2f](https://bitbucket.org/atlassian/atlassian-frontend/commits/318a1a0f2f):

  EDM-454: Actions in block cards are now behind the flag: showActions- [minor][205b05851a](https://bitbucket.org/atlassian/atlassian-frontend/commits/205b05851a):

  ED-8693: Integrate Config Panel to editor- [minor][3644fc1afe](https://bitbucket.org/atlassian/atlassian-frontend/commits/3644fc1afe):

  Enable slash command on editor-mobile-bridge:

  - All changes under `enableQuickInsert` flag consumed from query parameters.
  - This PR introduces basic changes in order to test, _THIS IS NOT PRODUCTION READY!_
  - All quick insert items present under `/` command on web, will be sent to native. Following up with this PR we will implement an opt in approach to define which items will be enabled on mobile only.- [minor][62f1f218d9](https://bitbucket.org/atlassian/atlassian-frontend/commits/62f1f218d9):

  ED-8910 Add transition to open create comment dialogue from floating toolbar- [minor][6eb8c0799f](https://bitbucket.org/atlassian/atlassian-frontend/commits/6eb8c0799f):

  UX enhancements for Config Panel

### Patch Changes

- [patch][2a87a3bbc5](https://bitbucket.org/atlassian/atlassian-frontend/commits/2a87a3bbc5):

  Fix scrolling issue on ios when user clicks in a blank area bellow a paragraph- [patch][cf7a2d7506](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf7a2d7506):

  ED-9010 updated fixture for failing visual test- [patch][759f0a5ca7](https://bitbucket.org/atlassian/atlassian-frontend/commits/759f0a5ca7):

  Remove excluded nodes from quick insert and pass popupmountpoint to datepicker- [patch][bdb4da1fc0](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdb4da1fc0):

  CEMS-974: Fix quick insert not working when depending on editorActions after publlishing and returning to the editor- [patch][c51f0b4c70](https://bitbucket.org/atlassian/atlassian-frontend/commits/c51f0b4c70):

  ED-8775 ED-8777 added simple and complex changes to deleting within lists- [patch][7ec160c0e2](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ec160c0e2):

  ED-8718 reverted unnecessary fixes for ED-8718 we have added previously.- [patch][91ff8d36f0](https://bitbucket.org/atlassian/atlassian-frontend/commits/91ff8d36f0):

  ED-8933: added performance analytics to WithPluginState- [patch][550c4b5018](https://bitbucket.org/atlassian/atlassian-frontend/commits/550c4b5018):

  EDM-501: View Switcher now disabled in parents which cannot support block cards- [patch][03a83cb954](https://bitbucket.org/atlassian/atlassian-frontend/commits/03a83cb954):

  Fix smart link replacing text on insert for toolbar- [patch][e21800fd1c](https://bitbucket.org/atlassian/atlassian-frontend/commits/e21800fd1c):

  ED-8977 Update find/replace colours- [patch][109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):

  Deletes internal package @atlaskit/type-helpers and removes all usages. @atlaskit/type-helpers has been superseded by native typescript helper utilities.- [patch][41917f4c16](https://bitbucket.org/atlassian/atlassian-frontend/commits/41917f4c16):

  ED-8774 ED-8776 added simple and complex cases to backspacing within lists- [patch][91304da441](https://bitbucket.org/atlassian/atlassian-frontend/commits/91304da441):

  allow typeahead sources to always resolve to inline card when adding links from hyperlinktoolbar- [patch][971df84f45](https://bitbucket.org/atlassian/atlassian-frontend/commits/971df84f45):

  ED-8958 Fix hyperlink floating toolbar from being overridden by annotation by changing plugin loading order.- [patch][0ab75c545b](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ab75c545b):

  EDM-229 Fixed image disappearing on resize when cursor is placed above- [patch][67bc25bc3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/67bc25bc3f):

  Move WidthObserver from editor-common to width-detector

  WidthObserver is a more performant version of WidthDetector and should be used going forward.

  ````js
  import { WidthObserver } from '@atlaskit/width-detector';

  <WidthObserver
    setWidth={width => console.log(`width has changed to ${width}`)}
  />;
  ```- [patch] [5f75dd27c9](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f75dd27c9):

  ED-8943: added performance tracking for ReactNodeView- [patch] [f3587bae11](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3587bae11):

  chore: fix UI nits for block cards- [patch] [287be84065](https://bitbucket.org/atlassian/atlassian-frontend/commits/287be84065):

  EDM-501: Disable view switched when in an unsupported node- [patch] [fb8725beac](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb8725beac):

  Fix checking if the annotation plugin is enabled before accessing its state- Updated dependencies [17cc5dde5d](https://bitbucket.org/atlassian/atlassian-frontend/commits/17cc5dde5d):
  ````

- Updated dependencies [7e408e4037](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e408e4037):
- Updated dependencies [6a6a991904](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a6a991904):
- Updated dependencies [9b2570e7f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b2570e7f1):
- Updated dependencies [04e54bf405](https://bitbucket.org/atlassian/atlassian-frontend/commits/04e54bf405):
- Updated dependencies [af10890541](https://bitbucket.org/atlassian/atlassian-frontend/commits/af10890541):
- Updated dependencies [84f82f7015](https://bitbucket.org/atlassian/atlassian-frontend/commits/84f82f7015):
- Updated dependencies [9f43b9f0ca](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f43b9f0ca):
- Updated dependencies [c74cc954d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/c74cc954d8):
- Updated dependencies [b4326a7eba](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4326a7eba):
- Updated dependencies [6641c9c5b5](https://bitbucket.org/atlassian/atlassian-frontend/commits/6641c9c5b5):
- Updated dependencies [a81ce649c8](https://bitbucket.org/atlassian/atlassian-frontend/commits/a81ce649c8):
- Updated dependencies [e4076915c8](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4076915c8):
- Updated dependencies [6453c8de48](https://bitbucket.org/atlassian/atlassian-frontend/commits/6453c8de48):
- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
- Updated dependencies [e4dde0ad13](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4dde0ad13):
- Updated dependencies [16c193eb3e](https://bitbucket.org/atlassian/atlassian-frontend/commits/16c193eb3e):
- Updated dependencies [f061ed6c98](https://bitbucket.org/atlassian/atlassian-frontend/commits/f061ed6c98):
- Updated dependencies [4070d17415](https://bitbucket.org/atlassian/atlassian-frontend/commits/4070d17415):
- Updated dependencies [f5dcc0bc6a](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5dcc0bc6a):
- Updated dependencies [f5b654c328](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5b654c328):
- Updated dependencies [5d430f7d37](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d430f7d37):
- Updated dependencies [7e26fba915](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e26fba915):
- Updated dependencies [41760ea4a6](https://bitbucket.org/atlassian/atlassian-frontend/commits/41760ea4a6):
- Updated dependencies [49dbcfa64c](https://bitbucket.org/atlassian/atlassian-frontend/commits/49dbcfa64c):
- Updated dependencies [e9d555132d](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9d555132d):
- Updated dependencies [5d8fc8d0ec](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d8fc8d0ec):
- Updated dependencies [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies [05539b052e](https://bitbucket.org/atlassian/atlassian-frontend/commits/05539b052e):
- Updated dependencies [5f8e3caf72](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f8e3caf72):
- Updated dependencies [318a1a0f2f](https://bitbucket.org/atlassian/atlassian-frontend/commits/318a1a0f2f):
- Updated dependencies [9691bb8eb9](https://bitbucket.org/atlassian/atlassian-frontend/commits/9691bb8eb9):
- Updated dependencies [11ff95c0f0](https://bitbucket.org/atlassian/atlassian-frontend/commits/11ff95c0f0):
- Updated dependencies [c0b8c92b2e](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0b8c92b2e):
- Updated dependencies [971e294b1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/971e294b1e):
- Updated dependencies [fb2b3c8a3b](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb2b3c8a3b):
- Updated dependencies [684ee794d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/684ee794d6):
- Updated dependencies [ae426d5e97](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae426d5e97):
- Updated dependencies [692692ba24](https://bitbucket.org/atlassian/atlassian-frontend/commits/692692ba24):
- Updated dependencies [258a36b51f](https://bitbucket.org/atlassian/atlassian-frontend/commits/258a36b51f):
- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies [205b05851a](https://bitbucket.org/atlassian/atlassian-frontend/commits/205b05851a):
- Updated dependencies [1a48183584](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a48183584):
- Updated dependencies [845feddce2](https://bitbucket.org/atlassian/atlassian-frontend/commits/845feddce2):
- Updated dependencies [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies [823d80f31c](https://bitbucket.org/atlassian/atlassian-frontend/commits/823d80f31c):
- Updated dependencies [e5c869ee31](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5c869ee31):
- Updated dependencies [69b678b38c](https://bitbucket.org/atlassian/atlassian-frontend/commits/69b678b38c):
- Updated dependencies [de6548dae5](https://bitbucket.org/atlassian/atlassian-frontend/commits/de6548dae5):
- Updated dependencies [286770886d](https://bitbucket.org/atlassian/atlassian-frontend/commits/286770886d):
- Updated dependencies [9dd4b9088b](https://bitbucket.org/atlassian/atlassian-frontend/commits/9dd4b9088b):
- Updated dependencies [0b22d3b9ea](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b22d3b9ea):
- Updated dependencies [fd782b0705](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd782b0705):
- Updated dependencies [b4ef7fe214](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4ef7fe214):
- Updated dependencies [2c1b78027c](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c1b78027c):
- Updated dependencies [d80b8e8fdb](https://bitbucket.org/atlassian/atlassian-frontend/commits/d80b8e8fdb):
- Updated dependencies [3644fc1afe](https://bitbucket.org/atlassian/atlassian-frontend/commits/3644fc1afe):
- Updated dependencies [b2402fc3a2](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2402fc3a2):
- Updated dependencies [d38212e1be](https://bitbucket.org/atlassian/atlassian-frontend/commits/d38212e1be):
- Updated dependencies [ba8c2c4129](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba8c2c4129):
- Updated dependencies [17a46dd016](https://bitbucket.org/atlassian/atlassian-frontend/commits/17a46dd016):
- Updated dependencies [62f1f218d9](https://bitbucket.org/atlassian/atlassian-frontend/commits/62f1f218d9):
- Updated dependencies [67bc25bc3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/67bc25bc3f):
- Updated dependencies [89bf723567](https://bitbucket.org/atlassian/atlassian-frontend/commits/89bf723567):
- Updated dependencies [4aca202534](https://bitbucket.org/atlassian/atlassian-frontend/commits/4aca202534):
- Updated dependencies [0376c2f4fe](https://bitbucket.org/atlassian/atlassian-frontend/commits/0376c2f4fe):
- Updated dependencies [6eb8c0799f](https://bitbucket.org/atlassian/atlassian-frontend/commits/6eb8c0799f):
- Updated dependencies [48fb5a1b6b](https://bitbucket.org/atlassian/atlassian-frontend/commits/48fb5a1b6b):
- Updated dependencies [8c8f0099d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c8f0099d8):
- Updated dependencies [c28ff17fbd](https://bitbucket.org/atlassian/atlassian-frontend/commits/c28ff17fbd):
- Updated dependencies [fb3ca3a3b2](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb3ca3a3b2):
- Updated dependencies [7e363d5aba](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e363d5aba):
  - @atlaskit/smart-card@13.1.0
  - @atlaskit/menu@0.4.0
  - @atlaskit/media-test-helpers@27.2.0
  - @atlaskit/adf-schema@9.0.0
  - @atlaskit/adf-utils@9.1.0
  - @atlaskit/editor-common@45.0.0
  - @atlaskit/renderer@57.0.0
  - @atlaskit/docs@8.5.1
  - @atlaskit/emoji@62.7.2
  - @atlaskit/modal-dialog@10.5.6
  - @atlaskit/editor-test-helpers@11.1.0
  - @atlaskit/datetime-picker@9.3.0
  - @atlaskit/theme@9.5.3
  - @atlaskit/media-client@6.1.0
  - @atlaskit/analytics-listeners@6.3.0
  - @atlaskit/collab-provider@1.0.0
  - @atlaskit/media-picker@54.1.0
  - @atlaskit/analytics-next@6.3.6
  - @atlaskit/button@13.3.10
  - @atlaskit/textarea@2.2.7
  - @atlaskit/width-detector@2.1.0
  - @atlaskit/media-card@67.2.0
  - @atlaskit/media-filmstrip@38.0.1
  - @atlaskit/user-picker@4.2.3
  - @atlaskit/analytics-namespaced-context@4.2.0
  - @atlaskit/editor-bitbucket-transformer@6.3.2
  - @atlaskit/editor-json-transformer@7.0.10
  - @atlaskit/editor-markdown-transformer@3.1.21
  - @atlaskit/editor-extension-dropbox@0.1.5
  - @atlaskit/synchrony-test-helpers@1.0.6
  - @atlaskit/task-decision@16.0.10

## 120.1.2

### Patch Changes

- [patch][a93083ffe9](https://bitbucket.org/atlassian/atlassian-frontend/commits/a93083ffe9):

  Remove @atlaskit/menu as a dependency and list as a devDependency instead.

## 120.1.1

### Patch Changes

- [patch][78ef636956](https://bitbucket.org/atlassian/atlassian-frontend/commits/78ef636956):

  EDM-541: Fix media wrapping inside block nodes

## 120.1.0

### Minor Changes

- [minor][aa6805792a](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa6805792a):

  [ED-8685] Move Synchrony API calls from EditorState apply function to EditorView update

## 120.0.0

### Major Changes

- [major][aa4dc7f5d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa4dc7f5d6):

  ED-8658: Trigger onChange for collab/remote changes

  If you are relying on `onChange` to only be called when change is local, e.g. not coming from a collaborative editing
  session, your logic might be affected by this change. For this case we added second argument `{ source: 'local' | 'remote' }`.

  ````
  onChange(editorView: EditorView, meta: { source: 'local' | 'remote' }): void;
  ```- [major] [d63888b5e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63888b5e5):

  ED-9179: Add support to CQL-like fields

  NOTE: This feature requires the [AbortController|https://developer.mozilla.org/en-US/docs/Web/API/AbortController] which is not supported on IE11.
  Consumers of the editor supporting IE11 should ensure there is a polyfill in place.
  ````

### Minor Changes

- [minor][bc29fbc030](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc29fbc030):

  ED-8748 ED-8211: Update media linking UI experience in renderer, fixes other rendering issues and workarounds.- [minor][4c691c3b5f](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c691c3b5f):

  Add a bottom gutter to the chromeless editor to reduce floating UI overflows- [minor][22d9c96ed2](https://bitbucket.org/atlassian/atlassian-frontend/commits/22d9c96ed2):

  EDM-221: Adds a view switcher for cards behind the `allowBlockCards` feature flag- [minor][13a0e50f38](https://bitbucket.org/atlassian/atlassian-frontend/commits/13a0e50f38):

  # Expose useForgePlugins in media props

  You can pass `useForgePlugins: true` to make MediaPicker use the Forge plugins instead of the built-in ones.

  MediaPicker example:

  ```typescript
  import { MediaPicker } from '@atlaskit/media-picker';

  const picker = MediaPicker(config, {
    useForgePlugins: true,
  });
  ```

  Editor example:

  ````typescript
  import { Editor } from '@atlaskit/editor-core';

  <Editor
    media={{
      useForgePlugins: true,
    }}
  />;
  ```- [minor] [6dcad31e41](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dcad31e41):

  - Added Stargate integration to MediaPicker popup.
  - Added `useMediaPickerPopup` option to Editor which enables using MediaPicker popup even when userAuthProvider is not provided.

  ### Using Stargate Integration

  Stargate integration is enabled by default as long as an `userAuthProvider` is not provided to `MediaClient`.

  By default it uses the current domain as base URL. If you need to use a different base URL you can provide a `stargateBaseUrl` configuration:

  ````

  import { MediaClient } from '@atlaskit/media-client';
  const mediaClient = new MediaClient({ authProvider, stargateBaseUrl: 'http://stargate-url' });

  ```

  _Note_: Editor default behaviour is falling back to native file upload when `userAuthProvider` is not provided.
  In order to avoid that, and being able to use Stargate, you need to set Media option `useMediaPickerPopup` to true.
  ```

### Patch Changes

- [patch][9fd8ba7707](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fd8ba7707):

  ED-8175 Added media link validation- [patch][d63513575b](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63513575b):

  ED-8901 feat: track plugin.view.update execution times- [patch][48f0ecf23e](https://bitbucket.org/atlassian/atlassian-frontend/commits/48f0ecf23e):

  ED-8883 Refactor imports in plugin folder to use entry points- [patch][130b83ccba](https://bitbucket.org/atlassian/atlassian-frontend/commits/130b83ccba):

  ED-8767 Remove circular deps inside media and table editor plugin- [patch][5180a51c0d](https://bitbucket.org/atlassian/atlassian-frontend/commits/5180a51c0d):

  ED-7254 Fix pasting singluar inline nodes into action and decisions- [patch][067febb0a7](https://bitbucket.org/atlassian/atlassian-frontend/commits/067febb0a7):

  EDM-211: Default links to inline for block links v1- [patch][66cf61863f](https://bitbucket.org/atlassian/atlassian-frontend/commits/66cf61863f):

  ED-8821: fix typing performance related to changes in ED-8255 (keyline + context panel)- [patch][f83b67a761](https://bitbucket.org/atlassian/atlassian-frontend/commits/f83b67a761):

  EDM-407: Smart cards copy pasted from Renderer to Editor create mediaSingles- [patch][a9e9604c8e](https://bitbucket.org/atlassian/atlassian-frontend/commits/a9e9604c8e):

  ED-7567 Remove all circular deps in editor-core plugins folder- [patch][8126e7648c](https://bitbucket.org/atlassian/atlassian-frontend/commits/8126e7648c):

  Measure failures and successes in inserting emoji- [patch][b41beace3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/b41beace3f):

  ED-8855 perf: use width-observer over width-detector for ⚡- [patch][02425bf2d7](https://bitbucket.org/atlassian/atlassian-frontend/commits/02425bf2d7):

  Added a forceLoading flag to the media node, and ensured it's set when copying from another context- [patch][953cfadbe3](https://bitbucket.org/atlassian/atlassian-frontend/commits/953cfadbe3):

  ED-7567 Remove all circular dependencies from editor-core- [patch][29b0315dcb](https://bitbucket.org/atlassian/atlassian-frontend/commits/29b0315dcb):

  ED-7567 Extract media plugin state into an interface- [patch][0a0a54cb47](https://bitbucket.org/atlassian/atlassian-frontend/commits/0a0a54cb47):

  EDM-281: Fix broken image wrapping in Editor- [patch][6242ec17a2](https://bitbucket.org/atlassian/atlassian-frontend/commits/6242ec17a2):

  Ensure that pm node position is called at correct time in async function- [patch][6b65ae4f04](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b65ae4f04):

  ED-8869: change label of "Less colors" to "Fewer colors"- [patch][fad8a16962](https://bitbucket.org/atlassian/atlassian-frontend/commits/fad8a16962):

  ED-8799: feat: add InstrumentedPlugin API- [patch][cc54ca2490](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc54ca2490):

  [ED-8802] Reducer the number of dispatched transactions from WidthEmitter- Updated dependencies [81684c1847](https://bitbucket.org/atlassian/atlassian-frontend/commits/81684c1847):

- Updated dependencies [b3813fa945](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3813fa945):
- Updated dependencies [ed8d8dea65](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed8d8dea65):
- Updated dependencies [bc29fbc030](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc29fbc030):
- Updated dependencies [294c05bcdf](https://bitbucket.org/atlassian/atlassian-frontend/commits/294c05bcdf):
- Updated dependencies [7d80e44c09](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d80e44c09):
- Updated dependencies [1386afaecc](https://bitbucket.org/atlassian/atlassian-frontend/commits/1386afaecc):
- Updated dependencies [eb962d2c36](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb962d2c36):
- Updated dependencies [5f5b93071f](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f5b93071f):
- Updated dependencies [db2f869556](https://bitbucket.org/atlassian/atlassian-frontend/commits/db2f869556):
- Updated dependencies [584279e2ae](https://bitbucket.org/atlassian/atlassian-frontend/commits/584279e2ae):
- Updated dependencies [81ea791176](https://bitbucket.org/atlassian/atlassian-frontend/commits/81ea791176):
- Updated dependencies [9d2da865dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d2da865dd):
- Updated dependencies [4d3749c9e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d3749c9e6):
- Updated dependencies [f83b67a761](https://bitbucket.org/atlassian/atlassian-frontend/commits/f83b67a761):
- Updated dependencies [cf86087ae2](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf86087ae2):
- Updated dependencies [70b68943d1](https://bitbucket.org/atlassian/atlassian-frontend/commits/70b68943d1):
- Updated dependencies [0e0364181b](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e0364181b):
- Updated dependencies [8126e7648c](https://bitbucket.org/atlassian/atlassian-frontend/commits/8126e7648c):
- Updated dependencies [6b4fe5d0e0](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b4fe5d0e0):
- Updated dependencies [9a93eff8e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a93eff8e6):
- Updated dependencies [05494f2306](https://bitbucket.org/atlassian/atlassian-frontend/commits/05494f2306):
- Updated dependencies [f0af33ead6](https://bitbucket.org/atlassian/atlassian-frontend/commits/f0af33ead6):
- Updated dependencies [d49ebd7c7a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d49ebd7c7a):
- Updated dependencies [e57c4aa96d](https://bitbucket.org/atlassian/atlassian-frontend/commits/e57c4aa96d):
- Updated dependencies [53ebcdb974](https://bitbucket.org/atlassian/atlassian-frontend/commits/53ebcdb974):
- Updated dependencies [4bec09aa74](https://bitbucket.org/atlassian/atlassian-frontend/commits/4bec09aa74):
- Updated dependencies [d63888b5e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63888b5e5):
- Updated dependencies [13a0e50f38](https://bitbucket.org/atlassian/atlassian-frontend/commits/13a0e50f38):
- Updated dependencies [0a0a54cb47](https://bitbucket.org/atlassian/atlassian-frontend/commits/0a0a54cb47):
- Updated dependencies [6dcad31e41](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dcad31e41):
- Updated dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
- Updated dependencies [4955ff3d36](https://bitbucket.org/atlassian/atlassian-frontend/commits/4955ff3d36):
- Updated dependencies [bdf25b1c4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdf25b1c4c):
- Updated dependencies [89d35b919a](https://bitbucket.org/atlassian/atlassian-frontend/commits/89d35b919a):
- Updated dependencies [3cbc8a49a2](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cbc8a49a2):
- Updated dependencies [0e5d6da3d0](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e5d6da3d0):
- Updated dependencies [083cfbaeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/083cfbaeb4):
- Updated dependencies [645918eda6](https://bitbucket.org/atlassian/atlassian-frontend/commits/645918eda6):
- Updated dependencies [fad8a16962](https://bitbucket.org/atlassian/atlassian-frontend/commits/fad8a16962):
- Updated dependencies [715572f9e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/715572f9e5):
- Updated dependencies [cc54ca2490](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc54ca2490):
- Updated dependencies [46d95777ef](https://bitbucket.org/atlassian/atlassian-frontend/commits/46d95777ef):
- Updated dependencies [9b264df34d](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b264df34d):
  - @atlaskit/media-picker@54.0.0
  - @atlaskit/share@0.11.0
  - @atlaskit/menu@0.3.1
  - @atlaskit/adf-schema@8.0.0
  - @atlaskit/editor-common@44.1.0
  - @atlaskit/renderer@56.0.0
  - @atlaskit/form@7.2.0
  - @atlaskit/media-client@6.0.0
  - @atlaskit/code@11.1.4
  - @atlaskit/media-card@67.1.1
  - @atlaskit/datetime-picker@9.2.9
  - @atlaskit/modal-dialog@10.5.5
  - @atlaskit/collab-provider@0.1.1
  - @atlaskit/emoji@62.7.1
  - @atlaskit/pubsub@5.0.11
  - @atlaskit/radio@3.2.0
  - @atlaskit/media-test-helpers@27.1.0
  - @atlaskit/mention@18.18.0
  - @atlaskit/editor-test-helpers@11.0.0
  - @atlaskit/media-core@31.1.0
  - @atlaskit/docs@8.5.0
  - @atlaskit/media-integration-test-helpers@1.1.1
  - @atlaskit/adf-utils@9.0.0
  - @atlaskit/editor-bitbucket-transformer@6.3.1
  - @atlaskit/editor-json-transformer@7.0.9
  - @atlaskit/editor-markdown-transformer@3.1.20
  - @atlaskit/status@0.9.23
  - @atlaskit/media-filmstrip@38.0.0
  - @atlaskit/editor-extension-dropbox@0.1.4
  - @atlaskit/task-decision@16.0.9
  - @atlaskit/media-editor@37.0.9

## 119.0.1

### Patch Changes

- [patch][b367f19e51](https://bitbucket.org/atlassian/atlassian-frontend/commits/b367f19e51):

  ED-8821: fix typing performance related to changes in ED-8255 (keyline + context panel)

## 119.0.0

### Major Changes

- [major][de64f9373c](https://bitbucket.org/atlassian/atlassian-frontend/commits/de64f9373c):

  ED-8605 remove 'allowMediaLinkingInsideOfBlockNodes' from mediaOption

### Minor Changes

- [minor][cc0d9f6ede](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc0d9f6ede):

  EDM-336: Supporting smart links in BB- [minor][57096fc043](https://bitbucket.org/atlassian/atlassian-frontend/commits/57096fc043):

  ED-8549 Add context panel support for extensions- [minor][0732eedea7](https://bitbucket.org/atlassian/atlassian-frontend/commits/0732eedea7):

  Adding analytics for mention providers- [minor][21a1faf014](https://bitbucket.org/atlassian/atlassian-frontend/commits/21a1faf014):

  ED-8364 Treat Shift-Return in gap cursor as Return- [minor][94116c6018](https://bitbucket.org/atlassian/atlassian-frontend/commits/94116c6018):

  ED-8636: added keymap ctrl+k for triggering url edit toolbar from image- [minor][a41d2345eb](https://bitbucket.org/atlassian/atlassian-frontend/commits/a41d2345eb):

  ED-8798: fix editor focus issues after closing media linking toolbar- [minor][8cc5cc0603](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc5cc0603):

  ED-8225 Fix list behaviour when forward deleting at end of preceding task/decision

### Patch Changes

- [patch][bc380c30ce](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc380c30ce):

  New collab provider- [patch][6384746272](https://bitbucket.org/atlassian/atlassian-frontend/commits/6384746272):

  ED-8710 Refactor collab edit plugin to have a valid Preset signature- [patch][956a70b918](https://bitbucket.org/atlassian/atlassian-frontend/commits/956a70b918):

  ED-885 perf: avoid rerendering fullpage for ⚡- [patch][3494940acd](https://bitbucket.org/atlassian/atlassian-frontend/commits/3494940acd):

  Prevent table resizing from blindly calling setState on an interaction- [patch][ebee5c7429](https://bitbucket.org/atlassian/atlassian-frontend/commits/ebee5c7429):

  [ED-8677] Reduce the number of dispatch transaction when the mouse is moving in a focused table- [patch][680a61dc5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/680a61dc5a):

  EDM-286 handle copy internal image consistently- [patch][b17120e768](https://bitbucket.org/atlassian/atlassian-frontend/commits/b17120e768):

  Add allowNewConfigPanel to the list of feature flags- [patch][92e0b393f5](https://bitbucket.org/atlassian/atlassian-frontend/commits/92e0b393f5):

  ED-8718: prevent users from leaving editor by clicking on media wrapped with a link- [patch][ac8639dfd8](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac8639dfd8):

  [ED-8864] Fix table hover effects when working in a collab session- [patch][2f0df19890](https://bitbucket.org/atlassian/atlassian-frontend/commits/2f0df19890):

  Remove 50% of the internal circular dependencies of editor-core.- [patch][113d075684](https://bitbucket.org/atlassian/atlassian-frontend/commits/113d075684):

  ED-8103 ED-8675 fix delete behaviour for lists so they append the next lists or paragraphs- [patch][af8a3763dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/af8a3763dd):

  Wait for media to replace external blob url node before setting editor to a ready to publish state- [patch][9fadef064b](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fadef064b):

  Revert unnecessary render fix for extension provider- [patch][27fde59914](https://bitbucket.org/atlassian/atlassian-frontend/commits/27fde59914):

  ED-8626 Can click on "open link in a new tab" with `javascript:` links in editor.- [patch][f8ffc8320f](https://bitbucket.org/atlassian/atlassian-frontend/commits/f8ffc8320f):

  ED-7067 Fix hyperlink display text not being applied on initial insert- [patch][469e9a2302](https://bitbucket.org/atlassian/atlassian-frontend/commits/469e9a2302):

  ED-7586 Fix toolbar Date insert to include appended space, fix cursor vert alignment after Date in Chrome- [patch][4ef23b6a15](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ef23b6a15):

  ED-8692 Fix flaky hyperlink test- [patch][5d8a0d4f5f](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d8a0d4f5f):

  ED-8705: ensure table plugin doesn't block the blur event while resizing a column- [patch][faa96cee2a](https://bitbucket.org/atlassian/atlassian-frontend/commits/faa96cee2a):

  ED-8713 Use editor common entry point to import provider factory- [patch][535286e8c4](https://bitbucket.org/atlassian/atlassian-frontend/commits/535286e8c4):

  [ED-8885] Fixes resize handles tables when a CellSelection happens- [patch][93ac94a762](https://bitbucket.org/atlassian/atlassian-frontend/commits/93ac94a762):

  ED-8751 Remove 'export \*' from editor core- [patch][172a864d19](https://bitbucket.org/atlassian/atlassian-frontend/commits/172a864d19):

  [ED-8457] Avoid table re-render when the cursor is coming from a gapcursor- [patch][6a417f2e52](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a417f2e52):

  add custom collaburl support to the collab example- [patch][5e3aab8e77](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e3aab8e77):

  pass originalDimensions to media-card- [patch][fdf6c939e8](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdf6c939e8):

  ED-8624 Create example of scaled editor for testing- Updated dependencies [b408e050ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/b408e050ab):

- Updated dependencies [bc380c30ce](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc380c30ce):
- Updated dependencies [7602615cd4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7602615cd4):
- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [5bb23adac3](https://bitbucket.org/atlassian/atlassian-frontend/commits/5bb23adac3):
- Updated dependencies [dda84ee26d](https://bitbucket.org/atlassian/atlassian-frontend/commits/dda84ee26d):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [2475d1c9d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/2475d1c9d8):
- Updated dependencies [0732eedea7](https://bitbucket.org/atlassian/atlassian-frontend/commits/0732eedea7):
- Updated dependencies [c171660346](https://bitbucket.org/atlassian/atlassian-frontend/commits/c171660346):
- Updated dependencies [fe9d471b88](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe9d471b88):
- Updated dependencies [27fde59914](https://bitbucket.org/atlassian/atlassian-frontend/commits/27fde59914):
- Updated dependencies [4695ac5697](https://bitbucket.org/atlassian/atlassian-frontend/commits/4695ac5697):
- Updated dependencies [96ee7441fe](https://bitbucket.org/atlassian/atlassian-frontend/commits/96ee7441fe):
- Updated dependencies [08935ea653](https://bitbucket.org/atlassian/atlassian-frontend/commits/08935ea653):
- Updated dependencies [b18fc8a1b6](https://bitbucket.org/atlassian/atlassian-frontend/commits/b18fc8a1b6):
- Updated dependencies [196500df34](https://bitbucket.org/atlassian/atlassian-frontend/commits/196500df34):
- Updated dependencies [64fb94fb1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/64fb94fb1e):
- Updated dependencies [be57ca3829](https://bitbucket.org/atlassian/atlassian-frontend/commits/be57ca3829):
- Updated dependencies [9957801602](https://bitbucket.org/atlassian/atlassian-frontend/commits/9957801602):
- Updated dependencies [d7ed7b1513](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7ed7b1513):
- Updated dependencies [41a2496393](https://bitbucket.org/atlassian/atlassian-frontend/commits/41a2496393):
- Updated dependencies [7baff84f38](https://bitbucket.org/atlassian/atlassian-frontend/commits/7baff84f38):
- Updated dependencies [39ee28797d](https://bitbucket.org/atlassian/atlassian-frontend/commits/39ee28797d):
- Updated dependencies [28573f37a7](https://bitbucket.org/atlassian/atlassian-frontend/commits/28573f37a7):
- Updated dependencies [5ccd5d5712](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ccd5d5712):
- Updated dependencies [4dbce7330c](https://bitbucket.org/atlassian/atlassian-frontend/commits/4dbce7330c):
- Updated dependencies [bb06388705](https://bitbucket.org/atlassian/atlassian-frontend/commits/bb06388705):
- Updated dependencies [c7b205c83f](https://bitbucket.org/atlassian/atlassian-frontend/commits/c7b205c83f):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [703b72cdba](https://bitbucket.org/atlassian/atlassian-frontend/commits/703b72cdba):
- Updated dependencies [8b9598a760](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b9598a760):
- Updated dependencies [025842de1a](https://bitbucket.org/atlassian/atlassian-frontend/commits/025842de1a):
- Updated dependencies [bbf5eb8824](https://bitbucket.org/atlassian/atlassian-frontend/commits/bbf5eb8824):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [7a6e5f6e3d](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a6e5f6e3d):
- Updated dependencies [832fd6f4f7](https://bitbucket.org/atlassian/atlassian-frontend/commits/832fd6f4f7):
- Updated dependencies [cd662c7e4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd662c7e4c):
- Updated dependencies [695e1c1c31](https://bitbucket.org/atlassian/atlassian-frontend/commits/695e1c1c31):
- Updated dependencies [6b06a7baa9](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b06a7baa9):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [109c1a2c0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c1a2c0a):
- Updated dependencies [a5d0019a5e](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5d0019a5e):
- Updated dependencies [c57bb32f6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/c57bb32f6d):
- Updated dependencies [8b34c7371d](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b34c7371d):
- Updated dependencies [e981669ba5](https://bitbucket.org/atlassian/atlassian-frontend/commits/e981669ba5):
- Updated dependencies [5e3aab8e77](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e3aab8e77):
- Updated dependencies [395739b5ef](https://bitbucket.org/atlassian/atlassian-frontend/commits/395739b5ef):
- Updated dependencies [77474b6821](https://bitbucket.org/atlassian/atlassian-frontend/commits/77474b6821):
- Updated dependencies [2a6727a5ad](https://bitbucket.org/atlassian/atlassian-frontend/commits/2a6727a5ad):
  - @atlaskit/media-client@5.0.2
  - @atlaskit/collab-provider@0.1.0
  - @atlaskit/editor-common@44.0.2
  - @atlaskit/adf-schema@7.0.0
  - @atlaskit/adf-utils@8.0.0
  - @atlaskit/docs@8.4.0
  - @atlaskit/media-picker@53.0.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/logo@12.3.3
  - @atlaskit/renderer@55.0.0
  - @atlaskit/mention@18.17.0
  - @atlaskit/util-data-test@13.1.2
  - @atlaskit/media-test-helpers@27.0.0
  - @atlaskit/webdriver-runner@0.3.0
  - @atlaskit/media-card@67.1.0
  - @atlaskit/profilecard@12.4.0
  - @atlaskit/media-filmstrip@37.1.2
  - @atlaskit/smart-card@13.0.0
  - @atlaskit/avatar-group@5.1.1
  - @atlaskit/synchrony-test-helpers@1.0.5
  - @atlaskit/media-integration-test-helpers@1.1.0
  - @atlaskit/item@11.0.2
  - @atlaskit/menu@0.3.0
  - @atlaskit/editor-bitbucket-transformer@6.3.0
  - @atlaskit/editor-test-helpers@10.6.1
  - @atlaskit/share@0.10.0
  - @atlaskit/editor-json-transformer@7.0.8
  - @atlaskit/editor-markdown-transformer@3.1.19
  - @atlaskit/editor-extension-dropbox@0.1.2
  - @atlaskit/media-editor@37.0.8
  - @atlaskit/media-core@31.0.5
  - @atlaskit/avatar@17.1.9
  - @atlaskit/button@13.3.9
  - @atlaskit/calendar@9.2.6
  - @atlaskit/checkbox@10.1.10
  - @atlaskit/datetime-picker@9.2.8
  - @atlaskit/dropdown-menu@9.0.2
  - @atlaskit/droplist@10.0.3
  - @atlaskit/form@7.1.5
  - @atlaskit/lozenge@9.1.6
  - @atlaskit/modal-dialog@10.5.4
  - @atlaskit/radio@3.1.11
  - @atlaskit/section-message@4.1.7
  - @atlaskit/select@11.0.9
  - @atlaskit/spinner@12.1.6
  - @atlaskit/textarea@2.2.6
  - @atlaskit/textfield@3.1.9
  - @atlaskit/toggle@8.1.6
  - @atlaskit/tooltip@15.2.5
  - @atlaskit/task-decision@16.0.8

## 118.0.1

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/avatar@17.1.8
  - @atlaskit/button@13.3.8
  - @atlaskit/calendar@9.2.5
  - @atlaskit/checkbox@10.1.9
  - @atlaskit/datetime-picker@9.2.7
  - @atlaskit/dropdown-menu@9.0.1
  - @atlaskit/droplist@10.0.2
  - @atlaskit/form@7.1.4
  - @atlaskit/lozenge@9.1.5
  - @atlaskit/modal-dialog@10.5.3
  - @atlaskit/radio@3.1.10
  - @atlaskit/section-message@4.1.6
  - @atlaskit/select@11.0.8
  - @atlaskit/spinner@12.1.5
  - @atlaskit/textarea@2.2.5
  - @atlaskit/textfield@3.1.8
  - @atlaskit/toggle@8.1.5
  - @atlaskit/tooltip@15.2.4
  - @atlaskit/editor-common@44.0.1
  - @atlaskit/media-card@67.0.5
  - @atlaskit/media-picker@52.0.4

## 118.0.0

### Minor Changes

- [minor][9e90cb4336](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e90cb4336):

  ED-8301 `altTextValidator` prop is introduced in Editor for consumers to be able to add custom validation on alt text values.

  If the alt text become an invalid one based on what `altTextValidator` return, it will be not saved in prosemirror, and once the alt text
  panel is closed, it will keep the latest valid value entered.

  This way if the user leaves an invalid value, it will not be part of the adf when the document is saved/published.

  Check this file for more technical details on how to use this callback: `packages/editor/editor-core/src/plugins/media/index.tsx`- [minor][40359da294](https://bitbucket.org/atlassian/atlassian-frontend/commits/40359da294):

  ED-8546 Prevent unexpected list creation when pasting text containing marks or other nodes followed by '1.'- [minor][151240fce9](https://bitbucket.org/atlassian/atlassian-frontend/commits/151240fce9):

  ED-8492: Adding the extension configuration panel- [minor][9d6b02c04f](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d6b02c04f):

  ED-8005 Use the new provider types directly from provider factory entry point in editor-common- [minor][37a79cb1bc](https://bitbucket.org/atlassian/atlassian-frontend/commits/37a79cb1bc):

  EDM-238: Allow alignment of images in layouts- [minor][cedfb7766c](https://bitbucket.org/atlassian/atlassian-frontend/commits/cedfb7766c):

  ED-7461: fix bug where ToolbarTextColor icon would be enabled when toolbar is disabled- [minor][57ea6ea77a](https://bitbucket.org/atlassian/atlassian-frontend/commits/57ea6ea77a):

  ED-8255: Add initial internal API for context panel- [minor][ff6e928368](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff6e928368):

  ED-8703 Export presets on test utils entry point and allow presets on create editor helper- [minor][13f0bbc125](https://bitbucket.org/atlassian/atlassian-frontend/commits/13f0bbc125):

  ED-7138 Disable heading styles on actions and decisions

### Patch Changes

- [patch][6403a54812](https://bitbucket.org/atlassian/atlassian-frontend/commits/6403a54812):

  ED-5645: Fixes pressing right arrow on a date node to dismiss the picker- [patch][f46330c0ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/f46330c0ab):

  EDM-236: fix insertion of smart links through linking toolbar- [patch][d6f207a598](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f207a598):

  EDM-241: Fix tasks disappearing with non-text content on enter- [patch][8d09cd0408](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d09cd0408):

  CONFCLOUD-69327: Sorting texts formatted as headings- [patch][088f4f7d1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/088f4f7d1e):

  ED-8306: Fix sorting tables with empty cells- [patch][8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):

  Remove Karma tests - based on AFP-960- [patch][7aad7888b4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7aad7888b4):

  ED-8425: Improve types for editor presets- [patch][a5c3717d0b](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5c3717d0b):

  ED-8531 fixed an issue where emoji popup is not shown when user clicked on the typeahead item.- [patch][b924951169](https://bitbucket.org/atlassian/atlassian-frontend/commits/b924951169):

  ED-7713 Update styling of table sorting button in renderer- [patch][47d7b34f75](https://bitbucket.org/atlassian/atlassian-frontend/commits/47d7b34f75):

  ED-8647 fix runtime exception when indenting or outdenting paragraphs- [patch][5a0167db78](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a0167db78):

  ED-8646: Optimize slow input rule (italic)- [patch][b3b2f413c1](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3b2f413c1):

  ED-8639: Fixes an editor crash where initialising with a single media group throws an exception- [patch][8f41931365](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f41931365):

  ED-8421: Add ARCHV3 example to mobile bridge- [patch][d59113061a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d59113061a):

  ED-8692 Simplify createPluginState API- [patch][2361b8d044](https://bitbucket.org/atlassian/atlassian-frontend/commits/2361b8d044):

  ED-8328: Fixes removing all occurrences of text-color mark when you have a cell selection- [patch][1028ab4db3](https://bitbucket.org/atlassian/atlassian-frontend/commits/1028ab4db3):

  ED-8278: Only show status popup when we have a NodeSelection- [patch][4b3ced1d9f](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b3ced1d9f):

  EDM-182: Fix media group deletions- [patch][fdc0861682](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdc0861682):

  ED-8644 change mouse indicator to be more accessible- [patch][00ddcd52df](https://bitbucket.org/atlassian/atlassian-frontend/commits/00ddcd52df):

  ED-7184: fix Chrome deletion bug in multi-line task/decision items- [patch][e3a8052151](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3a8052151):

  ED-8415: Support ARCHV3 in VR and integration testing- [patch][198639cd06](https://bitbucket.org/atlassian/atlassian-frontend/commits/198639cd06):

  ED-8328: Fixes clearing all formatting when you have a CellSelection- [patch][d7749cb6ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7749cb6ab):

  ED-7989: Fixes clicking table contextual button twice to toggle the menu- [patch][c9842c9ada](https://bitbucket.org/atlassian/atlassian-frontend/commits/c9842c9ada):

  ED-8581: Fix UP/DOWN arrow navigation in code block- Updated dependencies [9e90cb4336](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e90cb4336):

- Updated dependencies [e9a14f945f](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9a14f945f):
- Updated dependencies [034ade712f](https://bitbucket.org/atlassian/atlassian-frontend/commits/034ade712f):
- Updated dependencies [e8a31c2714](https://bitbucket.org/atlassian/atlassian-frontend/commits/e8a31c2714):
- Updated dependencies [1f9c4f974a](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f9c4f974a):
- Updated dependencies [116cb9b00f](https://bitbucket.org/atlassian/atlassian-frontend/commits/116cb9b00f):
- Updated dependencies [eaad41d56c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eaad41d56c):
- Updated dependencies [151240fce9](https://bitbucket.org/atlassian/atlassian-frontend/commits/151240fce9):
- Updated dependencies [8d09cd0408](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d09cd0408):
- Updated dependencies [088f4f7d1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/088f4f7d1e):
- Updated dependencies [9d6b02c04f](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d6b02c04f):
- Updated dependencies [f709e92247](https://bitbucket.org/atlassian/atlassian-frontend/commits/f709e92247):
- Updated dependencies [8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):
- Updated dependencies [4859ceaa73](https://bitbucket.org/atlassian/atlassian-frontend/commits/4859ceaa73):
- Updated dependencies [a1bc1e6637](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1bc1e6637):
- Updated dependencies [b924951169](https://bitbucket.org/atlassian/atlassian-frontend/commits/b924951169):
- Updated dependencies [9e87af4685](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e87af4685):
- Updated dependencies [c12ba5eb3e](https://bitbucket.org/atlassian/atlassian-frontend/commits/c12ba5eb3e):
- Updated dependencies [79cabaee0c](https://bitbucket.org/atlassian/atlassian-frontend/commits/79cabaee0c):
- Updated dependencies [ded54f7b9f](https://bitbucket.org/atlassian/atlassian-frontend/commits/ded54f7b9f):
- Updated dependencies [eeaa647c31](https://bitbucket.org/atlassian/atlassian-frontend/commits/eeaa647c31):
- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
- Updated dependencies [a4ddcbf7e2](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4ddcbf7e2):
- Updated dependencies [91a1eb05db](https://bitbucket.org/atlassian/atlassian-frontend/commits/91a1eb05db):
- Updated dependencies [a065689858](https://bitbucket.org/atlassian/atlassian-frontend/commits/a065689858):
- Updated dependencies [e3a8052151](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3a8052151):
- Updated dependencies [c1992227dc](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1992227dc):
- Updated dependencies [02b2a2079c](https://bitbucket.org/atlassian/atlassian-frontend/commits/02b2a2079c):
  - @atlaskit/editor-common@44.0.0
  - @atlaskit/avatar-group@5.1.0
  - @atlaskit/share@0.9.2
  - @atlaskit/adf-schema@6.2.0
  - @atlaskit/menu@0.2.7
  - @atlaskit/datetime-picker@9.2.6
  - @atlaskit/form@7.1.3
  - @atlaskit/renderer@54.0.0
  - @atlaskit/editor-test-helpers@10.6.0
  - @atlaskit/smart-card@12.7.0
  - @atlaskit/adf-utils@7.4.3
  - @atlaskit/editor-bitbucket-transformer@6.2.16
  - @atlaskit/editor-json-transformer@7.0.7
  - @atlaskit/editor-markdown-transformer@3.1.18
  - @atlaskit/synchrony-test-helpers@1.0.4
  - @atlaskit/dropdown-menu@9.0.0
  - @atlaskit/media-card@67.0.4
  - @atlaskit/icon@20.0.2
  - @atlaskit/textfield@3.1.7
  - @atlaskit/emoji@62.7.0
  - @atlaskit/checkbox@10.1.8
  - @atlaskit/analytics-listeners@6.2.4
  - @atlaskit/editor-extension-dropbox@0.1.1
  - @atlaskit/task-decision@16.0.7
  - @atlaskit/media-picker@52.0.3
  - @atlaskit/media-test-helpers@26.1.2

## 117.0.2

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/avatar-group@5.0.4
  - @atlaskit/avatar@17.1.7
  - @atlaskit/button@13.3.7
  - @atlaskit/calendar@9.2.4
  - @atlaskit/code@11.1.3
  - @atlaskit/dropdown-menu@8.2.4
  - @atlaskit/droplist@10.0.1
  - @atlaskit/icon@20.0.1
  - @atlaskit/item@11.0.1
  - @atlaskit/logo@12.3.2
  - @atlaskit/lozenge@9.1.4
  - @atlaskit/modal-dialog@10.5.2
  - @atlaskit/section-message@4.1.5
  - @atlaskit/select@11.0.7
  - @atlaskit/spinner@12.1.4
  - @atlaskit/textarea@2.2.4
  - @atlaskit/theme@9.5.1
  - @atlaskit/toggle@8.1.4
  - @atlaskit/tooltip@15.2.3
  - @atlaskit/type-helpers@4.2.3
  - @atlaskit/width-detector@2.0.10
  - @atlaskit/adf-schema@6.1.1
  - @atlaskit/adf-utils@7.4.2
  - @atlaskit/editor-bitbucket-transformer@6.2.15
  - @atlaskit/editor-common@43.4.1
  - @atlaskit/editor-json-transformer@7.0.6
  - @atlaskit/editor-markdown-transformer@3.1.17
  - @atlaskit/editor-test-helpers@10.5.1
  - @atlaskit/renderer@53.2.7
  - @atlaskit/synchrony-test-helpers@1.0.3
  - @atlaskit/analytics-gas-types@4.0.13
  - @atlaskit/analytics-listeners@6.2.3
  - @atlaskit/analytics-namespaced-context@4.1.11
  - @atlaskit/date@0.7.10
  - @atlaskit/emoji@62.6.3
  - @atlaskit/mention@18.16.2
  - @atlaskit/pubsub@5.0.10
  - @atlaskit/share@0.9.1
  - @atlaskit/status@0.9.22
  - @atlaskit/task-decision@16.0.6
  - @atlaskit/user-picker@4.2.2
  - @atlaskit/util-data-test@13.1.1
  - @atlaskit/util-service-support@5.0.1
  - @atlaskit/media-card@67.0.3
  - @atlaskit/media-client@5.0.1
  - @atlaskit/media-core@31.0.4
  - @atlaskit/media-editor@37.0.7
  - @atlaskit/media-filmstrip@37.1.1
  - @atlaskit/media-picker@52.0.2
  - @atlaskit/media-test-helpers@26.1.1
  - @atlaskit/smart-card@12.6.5
  - @atlaskit/profilecard@12.3.7

## 117.0.1

### Patch Changes

- [patch][4d1d3fc64e](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d1d3fc64e):

  CEMS-773: Support external images in media-group

## 117.0.0

### Major Changes

- [major][b01fc0ceef](https://bitbucket.org/atlassian/atlassian-frontend/commits/b01fc0ceef):

  ED-8151 Alt text is promoted to full schema. Feature flag and MediaOptions property UNSAFE_allowAltTextOnImages was renamed to allowAltTextOnImages.

### Minor Changes

- [minor][6f16f46632](https://bitbucket.org/atlassian/atlassian-frontend/commits/6f16f46632):

  ED-8505 Fix placeholder text on alignment UI- [minor][43e03f1c58](https://bitbucket.org/atlassian/atlassian-frontend/commits/43e03f1c58):

  ED-8437 Placeholder disappears when editor is out of focus- [minor][710897f340](https://bitbucket.org/atlassian/atlassian-frontend/commits/710897f340):

  ED-8444 Improve insert toolbar, replace ToolbarItem with MenuItem- [minor][3b37ec4c28](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b37ec4c28):

  ED-8029 Add new analytics event when an extension is inserted via quick insert

### Patch Changes

- [patch][06cd97123e](https://bitbucket.org/atlassian/atlassian-frontend/commits/06cd97123e):

  ED-7957: Fix race condition where upload error would be called before preview-update- [patch][07b5311cb9](https://bitbucket.org/atlassian/atlassian-frontend/commits/07b5311cb9):

  ED-8595: avoid using global ".hidden" classname for context panel visibility- [patch][a4ded5368c](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4ded5368c):

  EM-32: Single files pasted in Editor will be handled and uploaded by the Media Clipboard Picker- [patch][a1f50e6a54](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1f50e6a54):

  ED-8264: fixed shift-tab on table cells regression- [patch][31558e1872](https://bitbucket.org/atlassian/atlassian-frontend/commits/31558e1872):

  ED-8659: Fix case where external images inside tables would be inserted twice- [patch][63fe41d5c2](https://bitbucket.org/atlassian/atlassian-frontend/commits/63fe41d5c2):

  ED-7950: added analytics for expands being expanded/collapsed in editor- [patch][d085ab4419](https://bitbucket.org/atlassian/atlassian-frontend/commits/d085ab4419):

  [ED-8109] Enable media link inside of block contents like layoutColumn and expand- [patch][64752f2827](https://bitbucket.org/atlassian/atlassian-frontend/commits/64752f2827):

  ED-8594: reduce padding on context panel to 16px; no bottom padding- [patch][f67dc5ae22](https://bitbucket.org/atlassian/atlassian-frontend/commits/f67dc5ae22):

  ED-8311: fixed toggle of bullet/ordered lists in last column of tables- [patch][e40acffdfc](https://bitbucket.org/atlassian/atlassian-frontend/commits/e40acffdfc):

  ED-8500 change the sentry instance- [patch][0709d95a8a](https://bitbucket.org/atlassian/atlassian-frontend/commits/0709d95a8a):

  ED-8565 Include enabled feature flags within editor started analytics event payload.- [patch][28dcebde63](https://bitbucket.org/atlassian/atlassian-frontend/commits/28dcebde63):

  ED-8571 getState no longer passes duplicated IDs- [patch][b8da779506](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8da779506):

  ED-8607 fixed invalid spread usage for i18n messages in expand- [patch][bbbe360b71](https://bitbucket.org/atlassian/atlassian-frontend/commits/bbbe360b71):

  update MediaGroup attrs for copy/paste so it works on the destination page- [patch][655599414e](https://bitbucket.org/atlassian/atlassian-frontend/commits/655599414e):

  ED-8438 Prevent page scrolling while editing expand- Updated dependencies [5181c5d368](https://bitbucket.org/atlassian/atlassian-frontend/commits/5181c5d368):

- Updated dependencies [3b19e30129](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b19e30129):
- Updated dependencies [6ca6aaa1d7](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ca6aaa1d7):
- Updated dependencies [fe4eaf06fc](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe4eaf06fc):
- Updated dependencies [b01fc0ceef](https://bitbucket.org/atlassian/atlassian-frontend/commits/b01fc0ceef):
- Updated dependencies [d085ab4419](https://bitbucket.org/atlassian/atlassian-frontend/commits/d085ab4419):
- Updated dependencies [cf39b8a2a9](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf39b8a2a9):
- Updated dependencies [16b4549bdd](https://bitbucket.org/atlassian/atlassian-frontend/commits/16b4549bdd):
- Updated dependencies [28edbccc0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/28edbccc0a):
- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies [555818c33a](https://bitbucket.org/atlassian/atlassian-frontend/commits/555818c33a):
- Updated dependencies [0e439590a3](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e439590a3):
- Updated dependencies [02882e7d38](https://bitbucket.org/atlassian/atlassian-frontend/commits/02882e7d38):
- Updated dependencies [b8da779506](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8da779506):
- Updated dependencies [b9dc265bc9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9dc265bc9):
  - @atlaskit/smart-card@12.6.4
  - @atlaskit/editor-test-helpers@10.5.0
  - @atlaskit/editor-common@43.4.0
  - @atlaskit/media-test-helpers@26.1.0
  - @atlaskit/adf-schema@6.1.0
  - @atlaskit/adf-utils@7.4.1
  - @atlaskit/renderer@53.2.6
  - @atlaskit/share@0.9.0
  - @atlaskit/media-picker@52.0.1
  - @atlaskit/droplist@10.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/item@11.0.0
  - @atlaskit/media-filmstrip@37.1.0
  - @atlaskit/editor-extension-dropbox@0.1.0
  - @atlaskit/avatar@17.1.6
  - @atlaskit/editor-bitbucket-transformer@6.2.14
  - @atlaskit/editor-json-transformer@7.0.5
  - @atlaskit/editor-markdown-transformer@3.1.16
  - @atlaskit/dropdown-menu@8.2.3
  - @atlaskit/avatar-group@5.0.3
  - @atlaskit/emoji@62.6.2
  - @atlaskit/user-picker@4.2.1
  - @atlaskit/logo@12.3.1
  - @atlaskit/modal-dialog@10.5.1
  - @atlaskit/media-card@67.0.2
  - @atlaskit/section-message@4.1.4
  - @atlaskit/media-editor@37.0.6
  - @atlaskit/pubsub@5.0.9
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/calendar@9.2.3
  - @atlaskit/select@11.0.6
  - @atlaskit/tooltip@15.2.2
  - @atlaskit/mention@18.16.1
  - @atlaskit/status@0.9.21
  - @atlaskit/task-decision@16.0.5
  - @atlaskit/profilecard@12.3.6

## 116.2.1

### Patch Changes

- [patch][489dd1b0dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/489dd1b0dd):

  Revert ED-8520 as it introduced a more significant regression with table resizing

## 116.2.0

### Minor Changes

- [minor][06f4f74d88](https://bitbucket.org/atlassian/atlassian-frontend/commits/06f4f74d88):

  ED-8422: Repalce shared context plugin with feature flags plugin- [minor][c64c471564](https://bitbucket.org/atlassian/atlassian-frontend/commits/c64c471564):

  ED-8387 Add intermittent polling for annotation state. Made `getState()` async.

  The polling interval can be set as part of the `providers` objects in the `annotationProvider` editor prop. Default value is 10,000ms.

  ````
  annotationProvider={{
    providers: {
      pollingInterval: 10000,
      inlineComment: {
        getState: (annotationIds: string[]) => { ... }
      },
    },
  }}
  ```- [minor] [5b8daf1843](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b8daf1843):

  ED-8385 Implements getState calls and toggling of inlineComment highlighting- [minor] [7d2c702223](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d2c702223):

  ED-8443: added Editor prop onEditorReady() when editor is ready for editing- [minor] [2108ee74db](https://bitbucket.org/atlassian/atlassian-frontend/commits/2108ee74db):

  (ED-8368) A/B testing experiment: show more text color options, toggle on or off using Editor.editorProps.EXPERIMENTAL_allowMoreTextColors- [minor] [cfcd27b2e4](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfcd27b2e4):

  ED-8384 Extending the annotationProvider prop with a provider object

  **`providers` is for experimental purposes only and is not designed for use in production as of now**

  It is an _optional_ attribute of the `annotationProvider` `EditorProp`. Providing the prop will enable fetching of the state for all inline comments for the current document. Not providing it will disable this feature. By default, there is nothing provided.

  ````

  interface AnnotationProvider {
  providers: {
  inlineComment: { getState: (annotationIds: string[]) => AnnotationState<'inlineComment', InlineCommentState>[] },
  ... // other providers, eg Reaction
  }
  }

  ```

  The intention behind this is to allow consumers to provide a way for the Editor to check the current state of _all_ annotations of a _single type_ in the current document. The `getState` is provided with a list of `annotationId`s of _one_ type (eg, `inlineComment`, `reaction`). It should return a list of associated annotations (eg, comment) and any state (eg, comment is resolved).

  The return type is of an array `AnnotationState` specific to the type. For example,

  ```

  ExampleInlineCommentStates: AnnotationState<
  'inlineComment',
  InlineCommentState

  > [] = [
  > {

      annotationType: 'inlineComment',
      id: 'cd0a8588-f7cd-b50c-53a3-f424ee1b3474',
      state: { resolved: false },

  },

  {
  annotationType: 'inlineComment',
  id: 'a31d8b16-7c67-5d01-9eaa-f5504f48bd69',
  state: { resolved: true },
  },
  ];

  ```

  See packages/editor/editor-core/src/plugins/annotation/types.ts for types.- [minor] [ec929ab10e](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec929ab10e):

  ED-8535 Add onResolve to component for inline comments experiment.

  Moved the `pollingInterval` to be coupled with the relevant provider call.

  **Before**

  ```

  annotationProvider={{
    component: ...,
    providers: {
      pollingInterval: 15000,
      inlineComment: {
        getState: () => { ... }
      },
    },
  }}

  ```

  **Now**

  ```

  annotationProvider={{
    component: ...,
    providers: {
      inlineComment: {
        pollingInterval: 15000,
        getState: () => { ... }
      },
    },
  }}

  ```

  ```

### Patch Changes

- [patch][80c1eaa275](https://bitbucket.org/atlassian/atlassian-frontend/commits/80c1eaa275):

  add the cursor indicator to vr tests in editor-core- [patch][2b4ebaf2ed](https://bitbucket.org/atlassian/atlassian-frontend/commits/2b4ebaf2ed):

  [ED-8127] Standardize keys shortcuts and UI buttons to add rows commands- [patch][c55f8e0284](https://bitbucket.org/atlassian/atlassian-frontend/commits/c55f8e0284):

  ED-8519 change unhandledErrorCaught error from ui to operational event- [patch][b4ad0a502a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4ad0a502a):

  (ED-8365) added analytics for text colour palette experiment- [patch][6421a97672](https://bitbucket.org/atlassian/atlassian-frontend/commits/6421a97672):

  Fix an issue when typing text on the alt text panel, where the page scrolls up and down continuously- [patch][0eb8c5ff5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/0eb8c5ff5a):

  ED-8433 Move implicit insert attributes to be part of attributes object- [patch][3160e15523](https://bitbucket.org/atlassian/atlassian-frontend/commits/3160e15523):

  fix margin top on paragraphs so it has a unit by default- [patch][3f1d129a79](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f1d129a79):

  ED-8385 Abstract inlineComment plugin from annotation editor plugin- [patch][baa887053d](https://bitbucket.org/atlassian/atlassian-frontend/commits/baa887053d):

  ED-8501 Extension updateExtension doesn't set properly after switching between Confluence and Forge extension- [patch][f3727d3830](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3727d3830):

  ED-8524 Send through error message in "editor unhandledErrorCaught" analytics event- [patch][dc48763970](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc48763970):

  ED-8520: improve table performance by limiting the number of re-renders- [patch][909676b9de](https://bitbucket.org/atlassian/atlassian-frontend/commits/909676b9de):

  ED-5510: fix crashing safari when deleting last character in a paragraph- [patch][312feb4a6a](https://bitbucket.org/atlassian/atlassian-frontend/commits/312feb4a6a):

  ED-8416: Extract mobile appearance into a common component for archv3- [patch][cf9858fa09](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf9858fa09):

  [ED-8189] Allow resizing media inside of native expand using the breakout container size- [patch][26dbe7be6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/26dbe7be6d):

  ED-8470: removed unecessary borderColorPalette, made Palette.Color border a required prop- Updated dependencies [5504a7da8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/5504a7da8c):

- Updated dependencies [966622bd45](https://bitbucket.org/atlassian/atlassian-frontend/commits/966622bd45):
- Updated dependencies [3002c015cc](https://bitbucket.org/atlassian/atlassian-frontend/commits/3002c015cc):
- Updated dependencies [0aa121c69e](https://bitbucket.org/atlassian/atlassian-frontend/commits/0aa121c69e):
- Updated dependencies [b52f2be5d9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b52f2be5d9):
- Updated dependencies [9d8752351f](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d8752351f):
- Updated dependencies [4794f8d527](https://bitbucket.org/atlassian/atlassian-frontend/commits/4794f8d527):
- Updated dependencies [3e87f5596a](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e87f5596a):
- Updated dependencies [3160e15523](https://bitbucket.org/atlassian/atlassian-frontend/commits/3160e15523):
- Updated dependencies [894aa4ea8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/894aa4ea8c):
- Updated dependencies [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
- Updated dependencies [cf9858fa09](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf9858fa09):
- Updated dependencies [26dbe7be6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/26dbe7be6d):
- Updated dependencies [cfcd27b2e4](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfcd27b2e4):
- Updated dependencies [6ee177aeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ee177aeb4):
- Updated dependencies [e0f0654d4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0f0654d4c):
- Updated dependencies [ec929ab10e](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec929ab10e):
  - @atlaskit/media-card@67.0.1
  - @atlaskit/media-test-helpers@26.0.0
  - @atlaskit/smart-card@12.6.3
  - @atlaskit/share@0.8.0
  - @atlaskit/code@11.1.2
  - @atlaskit/adf-utils@7.4.0
  - @atlaskit/media-picker@52.0.0
  - @atlaskit/adf-schema@6.0.0
  - @atlaskit/editor-common@43.3.1
  - @atlaskit/renderer@53.2.5
  - @atlaskit/docs@8.3.0
  - @atlaskit/editor-test-helpers@10.4.3
  - @atlaskit/media-client@5.0.0
  - @atlaskit/media-core@31.0.3
  - @atlaskit/media-editor@37.0.5
  - @atlaskit/media-filmstrip@37.0.1
  - @atlaskit/editor-bitbucket-transformer@6.2.13
  - @atlaskit/editor-json-transformer@7.0.4
  - @atlaskit/editor-markdown-transformer@3.1.15
  - @atlaskit/emoji@62.6.1

## 116.1.2

### Patch Changes

- [patch][f97e248127](https://bitbucket.org/atlassian/atlassian-frontend/commits/f97e248127):

  ED-8578: always consume Tab-related events inside actions in full page- Updated dependencies [f97e248127](https://bitbucket.org/atlassian/atlassian-frontend/commits/f97e248127):

  - @atlaskit/editor-test-helpers@10.4.2

## 116.1.1

### Patch Changes

- [patch][6d7fb3ee9c](https://bitbucket.org/atlassian/atlassian-frontend/commits/6d7fb3ee9c):

  CERN-298: Remove MutationObs that handles resizing table columns for breakout content as it can cause infinite loops and is generally problematic

## 116.1.0

### Minor Changes

- [minor][faccb537d0](https://bitbucket.org/atlassian/atlassian-frontend/commits/faccb537d0):

  ED-8167: Re-worked GapCursor implementation; alignment should be more consistent- [minor][a753b0d6da](https://bitbucket.org/atlassian/atlassian-frontend/commits/a753b0d6da):

  ED-8253: add support for context panel in full page editor

  Adds a new `contextPanel` prop, that accepts React components. You will likely want to pass it the `ContextPanel` React component and place your content inside that component instead of passing content directly.

  The `packages/editor/editor-core/examples/5-full-page-template-context-panel.tsx` example provides a somewhat fleshed out example on how to integrate the context panel.- [minor][edc4a4a7ae](https://bitbucket.org/atlassian/atlassian-frontend/commits/edc4a4a7ae):

  ED-8316 Add async support to the Extension v2 insert API

### Patch Changes

- [patch][761dcd6d19](https://bitbucket.org/atlassian/atlassian-frontend/commits/761dcd6d19):

  ED-7675: promote nested taskLists from stage-0 schema to full- [patch][5816cb91e0](https://bitbucket.org/atlassian/atlassian-frontend/commits/5816cb91e0):

  ED-8395: colocate editor archv3 lifecycle events- [patch][642b2f93ea](https://bitbucket.org/atlassian/atlassian-frontend/commits/642b2f93ea):

  ED-8294 added overriding undo redo by pm history for alt text- [patch][4898d64f46](https://bitbucket.org/atlassian/atlassian-frontend/commits/4898d64f46):

  ED-8372 Add more displayName's to React components to help with debugging issues on prod- [patch][8cf20f37ae](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cf20f37ae):

  Add link domain to document pasted analytics events- [patch][a23aa4e4a8](https://bitbucket.org/atlassian/atlassian-frontend/commits/a23aa4e4a8):

  ED-8242 Fix exception "NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node."

  This is a race condition which occurs when ProseMirror removes the parent container of a ReactNodeView before React removes the child when unmounting- [patch][b1ce12dffb](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1ce12dffb):

  ED-7953 Show keyboard shortcut `//` for Date in Insert menu dropdown
  ED-7954 Show keyboard shortcut `>` for Quote in Insert menu dropdown
  ED-7955 Show keyboard shortcut " ``` " for Code snippet in Insert menu dropdown- [patch][4c4ae93de7](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c4ae93de7):

  ED-8024 Insert menu items should be sorted alphabetically- [patch][e4f0ab434f](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4f0ab434f):

  improve PickerFacade typings + use onEnd instead of onProcessing to know when media upload finish- [patch][3da54e6146](https://bitbucket.org/atlassian/atlassian-frontend/commits/3da54e6146):

  ED-8436 Place View More and Onboarding items at the end of the menu. Support non string augmentation.- [patch][94ea01d1d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/94ea01d1d6):

  No longer swallow errors when the error doesn't have a fileId- [patch][01dc5ed14b](https://bitbucket.org/atlassian/atlassian-frontend/commits/01dc5ed14b):

  ED-8380 Fix exception "Cannot read property 'nodeSize' of undefined"

  This is one of our top exceptions in the editor, and there were 2 causes which have been fixed:

  1. Pasting with cmd+shift+v when text formatting (eg. bold) is selected
  2. During collab editing when one user's change matched the other user's selection, and their selection was not mapped to the new document after the change- [patch][fdaac966f4](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdaac966f4):

  ED-7523 Fix layout columns that have been re-inserted due to schema restrictions, by giving them a valid width- [patch][54a499fb7b](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a499fb7b):

  ED-8454 fixed issues with select all and copypaste in alt text editor- Updated dependencies [761dcd6d19](https://bitbucket.org/atlassian/atlassian-frontend/commits/761dcd6d19):

- Updated dependencies [faccb537d0](https://bitbucket.org/atlassian/atlassian-frontend/commits/faccb537d0):
- Updated dependencies [90e2c5dd0c](https://bitbucket.org/atlassian/atlassian-frontend/commits/90e2c5dd0c):
- Updated dependencies [8c7f8fcf92](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c7f8fcf92):
- Updated dependencies [6e55ab88df](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e55ab88df):
- Updated dependencies [45cb48558f](https://bitbucket.org/atlassian/atlassian-frontend/commits/45cb48558f):
- Updated dependencies [edc4a4a7ae](https://bitbucket.org/atlassian/atlassian-frontend/commits/edc4a4a7ae):
- Updated dependencies [d60a382185](https://bitbucket.org/atlassian/atlassian-frontend/commits/d60a382185):
- Updated dependencies [a47d750b5d](https://bitbucket.org/atlassian/atlassian-frontend/commits/a47d750b5d):
- Updated dependencies [8d2685f45c](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d2685f45c):
- Updated dependencies [eb50389200](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb50389200):
  - @atlaskit/adf-schema@5.0.0
  - @atlaskit/adf-utils@7.3.2
  - @atlaskit/media-picker@51.0.0
  - @atlaskit/media-client@4.3.0
  - @atlaskit/select@11.0.5
  - @atlaskit/status@0.9.20
  - @atlaskit/editor-common@43.3.0
  - @atlaskit/editor-test-helpers@10.4.1
  - @atlaskit/editor-bitbucket-transformer@6.2.12
  - @atlaskit/editor-json-transformer@7.0.3
  - @atlaskit/editor-markdown-transformer@3.1.14
  - @atlaskit/renderer@53.2.4
  - @atlaskit/media-test-helpers@25.2.7

## 116.0.1

### Patch Changes

- [patch][9a8127fc08](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a8127fc08):

  [ED-8439] Extract height css rule from WidthProvider and move to Editor wrapper- Updated dependencies [9a8127fc08](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a8127fc08):

  - @atlaskit/editor-common@43.2.1

## 116.0.0

### Major Changes

- [major][e5dd37f7a4](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5dd37f7a4):

  ED-7966: Promote expand to full schema, update flag and add appropriate tests

### Minor Changes

- [minor][6042417190](https://bitbucket.org/atlassian/atlassian-frontend/commits/6042417190):

  FM-2731 FM-2704 Scroll selection into view when show keyboard on mobile

- [minor][46e6693eb3](https://bitbucket.org/atlassian/atlassian-frontend/commits/46e6693eb3):

  ED-8149 Provides an "update" method on the node manifest to deal with the edit button.- [minor][d1c470507c](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1c470507c):

  ED-7657 Align styles for task/decision lists so that they line up with bullet/number lists- [minor][fc1678c70d](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc1678c70d):

  ED-8323 Adding support to placeholder hints on empty lines- [minor][5abcab3f7e](https://bitbucket.org/atlassian/atlassian-frontend/commits/5abcab3f7e):

  Propagate disabled prop change in arch v3 editor- [minor][1d421446bc](https://bitbucket.org/atlassian/atlassian-frontend/commits/1d421446bc):

  ED-8325 Add bracket placeholder hint

### Patch Changes

- [patch][26942487d1](https://bitbucket.org/atlassian/atlassian-frontend/commits/26942487d1):

  FM-2810 fix: avoid authProvider() calls before file has uploaded- [patch][8db35852ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/8db35852ab):

  ED-7965 corrected selecting image with shift+click while text is selected- [patch][2ffdeb5a48](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ffdeb5a48):

  [ED-6984] Fix timestamp convert dates to use UTC and implements proper internationalization- [patch][9219b332cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/9219b332cb):

  ED-8176 fixed intermittent vr test failures for alt text- [patch][99fc6250f9](https://bitbucket.org/atlassian/atlassian-frontend/commits/99fc6250f9):

  trim image alt-text label when user triggers onBlur() event- [patch][4cd37dd052](https://bitbucket.org/atlassian/atlassian-frontend/commits/4cd37dd052):

  ED-8153 ED-8302: Styling fixes for expands including: increasing the hit area for expand titles in the renderer, better hover transitions and lowered spacing between expands.- [patch][1f84cf7583](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f84cf7583):

  ED-7712 Fix issue where actions/decisions could be deleted when trying to convert a single item to the other type in lists with > 1 item- [patch][218fe01736](https://bitbucket.org/atlassian/atlassian-frontend/commits/218fe01736):

  ED-7113 Action gap cursor is been placed in the right place- [patch][985db883ac](https://bitbucket.org/atlassian/atlassian-frontend/commits/985db883ac):

  (ED-7985) tweak alt-text editor UI to be more consistent with edit link UI- [patch][bed9c11960](https://bitbucket.org/atlassian/atlassian-frontend/commits/bed9c11960):

  Use contextId instead of collectionName to know when to copy a media node- [patch][a30fe6c66e](https://bitbucket.org/atlassian/atlassian-frontend/commits/a30fe6c66e):

  Fix type errors found during bazel spike- [patch][fdf30da2db](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdf30da2db):

  ED-7083 Improve selection when opening typahead queries to select the top element first- [patch][2edd170a68](https://bitbucket.org/atlassian/atlassian-frontend/commits/2edd170a68):

  (ED-7755) limit length of image alt-text input to be 510 characters- [patch][5d13d33a60](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d13d33a60):

  ED-8219: fix bug that converted decimal numbers to lists- Updated dependencies [28f8f0e089](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f8f0e089):

- Updated dependencies [6dccb16bfc](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dccb16bfc):
- Updated dependencies [d1055e0e50](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1055e0e50):
- Updated dependencies [e0daa78402](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0daa78402):
- Updated dependencies [98a904dd02](https://bitbucket.org/atlassian/atlassian-frontend/commits/98a904dd02):
- Updated dependencies [2ffdeb5a48](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ffdeb5a48):
- Updated dependencies [97d1245875](https://bitbucket.org/atlassian/atlassian-frontend/commits/97d1245875):
- Updated dependencies [4eefd368a8](https://bitbucket.org/atlassian/atlassian-frontend/commits/4eefd368a8):
- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies [29643d4593](https://bitbucket.org/atlassian/atlassian-frontend/commits/29643d4593):
- Updated dependencies [486a5aec29](https://bitbucket.org/atlassian/atlassian-frontend/commits/486a5aec29):
- Updated dependencies [46e6693eb3](https://bitbucket.org/atlassian/atlassian-frontend/commits/46e6693eb3):
- Updated dependencies [4cd37dd052](https://bitbucket.org/atlassian/atlassian-frontend/commits/4cd37dd052):
- Updated dependencies [dfb3b76a4b](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfb3b76a4b):
- Updated dependencies [03c917044e](https://bitbucket.org/atlassian/atlassian-frontend/commits/03c917044e):
- Updated dependencies [83300f0b6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/83300f0b6d):
- Updated dependencies [d3f4c97f6a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3f4c97f6a):
- Updated dependencies [e5dd37f7a4](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5dd37f7a4):
- Updated dependencies [81897eb2e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/81897eb2e6):
- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/icon@19.1.0
  - @atlaskit/toggle@8.1.3
  - @atlaskit/editor-common@43.2.0
  - @atlaskit/status@0.9.19
  - @atlaskit/renderer@53.2.3
  - @atlaskit/adf-schema@4.4.0
  - @atlaskit/theme@9.5.0
  - @atlaskit/media-card@67.0.0
  - @atlaskit/editor-test-helpers@10.4.0
  - @atlaskit/media-filmstrip@37.0.0
  - @atlaskit/util-data-test@13.1.0
  - @atlaskit/button@13.3.5
  - @atlaskit/code@11.1.1
  - @atlaskit/lozenge@9.1.3
  - @atlaskit/section-message@4.1.3
  - @atlaskit/select@11.0.4
  - @atlaskit/spinner@12.1.3
  - @atlaskit/tooltip@15.2.1
  - @atlaskit/editor-bitbucket-transformer@6.2.11
  - @atlaskit/editor-json-transformer@7.0.2
  - @atlaskit/editor-markdown-transformer@3.1.13
  - @atlaskit/media-client@4.2.2
  - @atlaskit/media-core@31.0.2
  - @atlaskit/media-editor@37.0.4
  - @atlaskit/media-picker@50.0.5
  - @atlaskit/media-test-helpers@25.2.6
  - @atlaskit/dropdown-menu@8.2.2

## 115.2.2

### Patch Changes

- [patch][1b5cb65fd7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b5cb65fd7):

  Use contextId instead of collectionName to know when to copy a media node

## 115.2.1

### Patch Changes

- [patch][36f6e99c5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36f6e99c5b):

  Fix type errors caused when generating declaration files- Updated dependencies [36f6e99c5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36f6e99c5b):

  - @atlaskit/calendar@9.2.2
  - @atlaskit/editor-test-helpers@10.3.2
  - @atlaskit/renderer@53.2.2
  - @atlaskit/date@0.7.9
  - @atlaskit/media-client@4.2.1

## 115.2.0

### Minor Changes

- [minor][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  ED-8080 Add provider factory to editor arch V3

- [minor][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  ED-8132: Stop passing props to EditorPlugin factories- [minor][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  ED-8078 Sending invalid nodes instead of whole node on dispatch invalid transaction analytis- [minor][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  FM-2744 Implement native side for Hybrid Editor/Renderer Analytics events

### Patch Changes

- [patch][7ee2d3281f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ee2d3281f):

  ED-7957 Disable save button on Comment appearance

- [patch][7ee2d3281f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ee2d3281f):

  FEF-9891 Fix being unable to click inside and type in placeholders

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  ED-8191 fix expand button position when disabled- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  ED-8213 Remove unused macroProvider usage- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  ED-7945: fix number column alignment on first load- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  ED-7901 Added analytics for media alt text- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  ED-8129 Fix bug where table throws an exception when try to delete it when the contextual menu is open- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Make GenericCard Component instead of PureComponent to react on context updates- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  ED-7992: Prevent creating new style tags on every resize of media single- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  ED-8187 Update cursor on expand to represent user actions- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  ED-8162: Prevent the editor from locking up when navigating from gap-cursor to an expand title- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  ED-7927: Transform status text uppercase- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  ED-7977: when cursor is after a collapsed expand, pressing Backspace focus the title- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  [ED-8159] Add flag to disable the open|close events from Expand- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  ED-7967 Add location and selection information on insertion analytics events- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  ED-8177: Change animation style of the gap-cursor to avoid a high amount of style recalc- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Make @atlaskit/smart-card a peerDependency of editor/renderer- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/renderer@53.2.1
  - @atlaskit/user-picker@4.2.0
  - @atlaskit/adf-schema@4.3.2
  - @atlaskit/adf-utils@7.3.1
  - @atlaskit/editor-common@43.1.0
  - @atlaskit/tooltip@15.2.0
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/media-picker@50.0.3
  - @atlaskit/media-client@4.2.0
  - @atlaskit/select@11.0.3
  - @atlaskit/share@0.7.3
  - @atlaskit/modal-dialog@10.5.0
  - @atlaskit/smart-card@12.6.2
  - @atlaskit/avatar-group@5.0.2
  - @atlaskit/avatar@17.1.5
  - @atlaskit/media-card@66.1.2
  - @atlaskit/item@10.2.0
  - @atlaskit/textarea@2.2.3
  - @atlaskit/status@0.9.18

## 115.1.0

### Minor Changes

- [minor][7519b2a816](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7519b2a816):

  FM-2694 Scroll user's selection (cursor) into view whenever they insert/delete nodes, format text, undo/redo or paste content

  Add new editor plugin: `ScrollIntoView`
  This hooks into each transaction applied and calls ProseMirror's [scrollIntoView](https://prosemirror.net/docs/ref/#state.Transaction.scrollIntoView) if the transaction is a primary action from the user that updates the document
  This behaviour is on by default and should be opted out of on a per-transaction basis, initially we have opted out of any interactions with the floating toolbar or breakout buttons and resizing, as to perform these actions you are in the context of what you are editing already

### Patch Changes

- [patch][768bac6d81](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/768bac6d81):

  Convert editor error boundary from GasV2 to GasV3 analytics. Support graceful recovery for intermittent issues.- [patch][7bf6a29563](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7bf6a29563):

  ED-8217: Prevent unnecessery re-renders in a status node- [patch][fbff0b7e41](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fbff0b7e41):

  [ED-8286] Fix analytics configuration to AltText- [patch][9902932114](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9902932114):

  ED-7480: fix contextual menu position when enabling numbered column- Updated dependencies [768bac6d81](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/768bac6d81):

- Updated dependencies [139ab68e90](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/139ab68e90):
- Updated dependencies [768bac6d81](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/768bac6d81):
  - @atlaskit/editor-test-helpers@10.3.1
  - @atlaskit/media-card@66.1.1
  - @atlaskit/analytics-next@6.3.2

## 115.0.0

### Major Changes

- [major][5e4d1feec3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e4d1feec3):

  Removed deprecated props from editor core

  Following props have been removed from `@atlaskit/editor-core`:

  - mediaProvider –> Use `media={{ provider }}` instead
  - cardProvider -> Use `UNSAFE_cards={{ provider }}` instead
  - allowPlaceholderCursor -> Enabled by default
  - addonToolbarComponents -> Not supported anymore (and according to sourcegraph not used anywhere)
  - allowCodeBlocks -> Enabled by default
  - allowLists -> Enabled by default
  - allowHelpDialog -> Is enabled by default, pass `false` to disabled it

### Minor Changes

- [minor][10425b84b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10425b84b4):

  Add support to extensions v2 (using manifests and extension providers)

- [minor][0ea0587ac5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ea0587ac5):

  ED-8130: Update expand feature flag to seperate rendering from insertion- [minor][926798632e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926798632e):

  ED-7962: Build ADF node from actions - remove "insert" from node

### Patch Changes

- [patch][a6663b9325](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6663b9325):

  ED-8026: Prevent infinite transactions being dispatched when focusing on an expands title during collab

- [patch][0f8d5df4cf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f8d5df4cf):

  ED-7975: fix copy-pasting tables that contain nestedExpand

- [patch][ecfbe83dfb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecfbe83dfb):

  [ED-7903] Implement alt text update on UI- [patch][ea0e619cc7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea0e619cc7):

  ED-8017: Fix expand overflow issues with tables and text

- [patch][93b445dcdc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93b445dcdc):

  ED-8134: Adding /help command to quick insert

- [patch][ded174361e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ded174361e):

  ED-7993: Stop toolbar insert block from re-rendering when typing inside code block, etc

- [patch][80eb127904](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80eb127904):

  ED-8068: Fixes an issues where wrapped media could end up on top of one another inside an Expand.

- [patch][8c84ed470e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c84ed470e):

  ED-7957 Disable save button on Comment appearance- [patch][6e4b678428](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e4b678428):

  ED-8077: Fixes pasting expands into a table that is inside an expand

- [patch][40bec82851](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40bec82851):

  ED-7850 Fix bug where card inserted by paste (but intercepted by macro) wasn't replacing the content

- [patch][8b652147a5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b652147a5):

  ED-8099: Disables resize grid lines when media is inside an expand

- [patch][0603c2fbf7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0603c2fbf7):

  FEF-9891 Fix being unable to click inside and type in placeholders- [patch][72d4c3298d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d4c3298d):

  ED-7934: keyboard navigation for expand

- [patch][5ef337766c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ef337766c):

  ED-8069: Fixes expand toggling syncing between sessions in collab mode.

- [patch][dc0999afc2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc0999afc2):

  ED-7995: Performance enchancements when editor transitions between disabled to enabled state

- [patch][6764e83801](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6764e83801):

  ED-8131 Fix not passing analyticsHandler to createPMPlugins

- [patch][553915553f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/553915553f):

  [ED-8081] Improve tab navigation on native expand

- [patch][4700477bbe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4700477bbe):

  ED-8094: Fix cursor issues relating to mobile and toolbar insertion issues

- [patch][3a7c0bfa32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a7c0bfa32):

  Fixes minor keymap issues within expand, with type-ahead and backspace- [patch][5455e35bc0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5455e35bc0):

  ED-8171 Remove disable save button on comment appearance when upload has no finished- [patch][cc1b89d310](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc1b89d310):

  ED-8162: Prevent the editor from locking up when navigating from gap-cursor to an expand title- [patch][2bb3af2382](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2bb3af2382):

  ED-8178: Disable media alignment options and extension layout options when inside an expand- [patch][611dbe68ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/611dbe68ff):

  [ED-8159] Add flag to disable the open|close events from Expand- [patch][938f1c2902](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/938f1c2902):

  ED-8186: Fix incorrect mark filtering when toggling lists- Updated dependencies [271945fd08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/271945fd08):

- Updated dependencies [161a30be16](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/161a30be16):
- Updated dependencies [2d1aee3e47](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d1aee3e47):
- Updated dependencies [ea0e619cc7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea0e619cc7):
- Updated dependencies [4427e6c8cf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4427e6c8cf):
- Updated dependencies [5b8a074ce6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b8a074ce6):
- Updated dependencies [49fbe3d3bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49fbe3d3bf):
- Updated dependencies [c1d4898af5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1d4898af5):
- Updated dependencies [579779f5aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/579779f5aa):
- Updated dependencies [df2280531d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df2280531d):
- Updated dependencies [ef2ba36d5c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef2ba36d5c):
- Updated dependencies [6e4b678428](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e4b678428):
- Updated dependencies [bb164fbd1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb164fbd1e):
- Updated dependencies [3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):
- Updated dependencies [b3fd0964f2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3fd0964f2):
- Updated dependencies [1b8e3a1412](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b8e3a1412):
- Updated dependencies [7540cdff80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7540cdff80):
- Updated dependencies [b4fda095ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b4fda095ef):
- Updated dependencies [10425b84b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10425b84b4):
- Updated dependencies [4700477bbe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4700477bbe):
- Updated dependencies [7f8de51c36](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f8de51c36):
- Updated dependencies [f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):
- Updated dependencies [9a261337b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a261337b5):
- Updated dependencies [cc1b89d310](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc1b89d310):
- Updated dependencies [938f1c2902](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/938f1c2902):
- Updated dependencies [926798632e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926798632e):
  - @atlaskit/editor-common@43.0.0
  - @atlaskit/adf-schema@4.3.1
  - @atlaskit/emoji@62.6.0
  - @atlaskit/media-picker@50.0.2
  - @atlaskit/smart-card@12.6.1
  - @atlaskit/mention@18.16.0
  - @atlaskit/icon@19.0.11
  - @atlaskit/media-client@4.1.1
  - @atlaskit/renderer@53.2.0
  - @atlaskit/theme@9.3.0
  - @atlaskit/media-editor@37.0.3
  - @atlaskit/editor-test-helpers@10.3.0
  - @atlaskit/date@0.7.8
  - @atlaskit/profilecard@12.3.5
  - @atlaskit/editor-bitbucket-transformer@6.2.10
  - @atlaskit/editor-json-transformer@7.0.1
  - @atlaskit/editor-markdown-transformer@3.1.12
  - @atlaskit/synchrony-test-helpers@1.0.2
  - @atlaskit/task-decision@16.0.4

## 114.1.4

### Patch Changes

- [patch][3a20e9a596](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a20e9a596):

  Make PopupSelect correctly pass props. Forcing update of @atlaskit/select for all other packages- Updated dependencies [3a20e9a596](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a20e9a596):

  - @atlaskit/select@11.0.2
  - @atlaskit/user-picker@4.1.5
  - @atlaskit/media-test-helpers@25.2.5

## 114.1.3

### Patch Changes

- [patch][aed7d2a980](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aed7d2a980):

  ED-8042 upgrade prosemirror-markdown to remove ES modules workaround- Updated dependencies [aed7d2a980](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aed7d2a980):

  - @atlaskit/editor-bitbucket-transformer@6.2.9
  - @atlaskit/editor-markdown-transformer@3.1.11

## 114.1.2

### Patch Changes

- [patch][f4b7363a8e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f4b7363a8e):

  ED-8137: Fix rendering of hyperlink toolbar without any activity provider set

## 114.1.1

### Patch Changes

- [patch][a76c0e3081](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a76c0e3081):

  ED-8042 fix: bump markdown-it and prosemirror-markdown to avoid ReDoS vulnerability

## 114.1.0

### Minor Changes

- [minor][166dd996a8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/166dd996a8):

  ED-7949: Migrate expand react component to renderer from common to avoid extra deps being added to common

- [minor][292651c91c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/292651c91c):

  [ED-7739] UI for add or edit alt text in media

- [minor][f68c80d51a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68c80d51a):

  FM-2211 Implement scrolling improvements to prevent user typing behind keyboard on iOS

  New editor plugin IOSScroll is added into the plugins list for users on iOS mobile devices
  This works with a new native-to-web bridge method `setKeyboardControlsHeight` to add an extra buffer to the bottom of the page when the on-screen keyboard is showing

- [minor][3a4aa18da6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a4aa18da6):

  ED-7878 Add expand analytics v1

- [minor][f1a06fc2fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a06fc2fd):

  ED-7876 Implement expand and nestedExpand in Editor and Renderer

  A **work in progress** implementation of the new `expand` and `nestedExpand` nodes. These are currently **disabled** by default, but can be tested by enabling an editor prop.

  `UNSAFE_allowExpand={true}`

  Note, `expand` and `nestedExpand` are only in the `stage-0` ADF schema (as of this changeset).

- [minor][041306acf5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/041306acf5):

  ED-7494: split plain text by linebreaks into paragraphs on paste, convert text bullet into lists

  When pasting plain text with "paragraphs" separated by line breaks, we now paste those as
  multiple, real, paragraphs instead.

  When pasting plain text that contains Markdown-looking numbered or unordered lists, or lines
  that start with Unicode bullets, we now convert those to an actual list.

  This fixes pasting from Google Keep, or something like Notepad.

- [minor][b3b743040b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3b743040b):

  ED-7911: Uploads new external media to media services

- [minor][ae42b1ba1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae42b1ba1e):

  Adf schema changes (for stage-0) to support alt text on media nodes.
  `editor-core` changes are wrapped under the editor prop `UNSAFE_allowAltTextOnImages`. There is no alt text implementation yet, so the user won't be able to add alt text to images just yet.

- [minor][1377a45225](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1377a45225):

  ED-7492 add support to indent actions

  This version adds support for indenting actions using the keyboard shortcuts Tab and Shift-Tab. You can also unindent items by backspacing them at the start, or deleting forwards within the task.

  There is no new behaviour if the feature flag (`allowNestedTasks`) is turned off.

- [minor][40efe6f043](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40efe6f043):

  ED-7792: Add performance analytics to new arch editor

### Patch Changes

- [patch][c20e926a6c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c20e926a6c):

  ED-7971: fix deleting of nested task lists

  Upgrades prosemirror-view to 1.1.6.

  See (this discussion)[https://discuss.prosemirror.net/t/collapsing-empty-nodes-on-delete/2306/4] for more details and screenshots of the behaviour it fixes.

- [patch][c276ecfa22](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c276ecfa22):

  Check for optional values when using WithProviders component

- [patch][60e2652dc7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60e2652dc7):

  Use media-picker types entry poin

- [patch][b7c432e8b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b7c432e8b9):

  FM-2353 Fix issue where links copied from iOS Safari share button were not pasted

- [patch][e76d2904b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e76d2904b4):

  Adding support for alt text on editor and renderer

- [patch][a01023d4b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a01023d4b3):

  ED-7938: allow pasting tasks within task lists

- [patch][d51d5cabc6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d51d5cabc6):

  ED-7867 Prevent infinite loop on table trying to apply bold mark

- [patch][e93cb269a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e93cb269a9):

  ED-8036 Prevent plugin conflicts in insert menu

- [patch][e3e615b10e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e3e615b10e):

  ED-8002: Remove types of nodes from performance analytics

- [patch][5b2c89203e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b2c89203e):

  Fix linting errors from prettier upgrade

- [patch][e283b821f0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e283b821f0):

  ED-7980: Fixes styling of expands inside layouts (also caters for gap cursor navigation)

- [patch][583d344097](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/583d344097):

  ED-7677 Pick color with best contrast for color palette checkmarks

- Updated dependencies [6d9c8a9073](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d9c8a9073):
- Updated dependencies [70e1055b8f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70e1055b8f):
- Updated dependencies [ae6408e1e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae6408e1e4):
  - @atlaskit/adf-schema@4.3.0
  - @atlaskit/editor-common@42.0.0
  - @atlaskit/renderer@53.1.0
  - @atlaskit/editor-json-transformer@7.0.0
  - @atlaskit/editor-bitbucket-transformer@6.2.7
  - @atlaskit/editor-markdown-transformer@3.1.9
  - @atlaskit/editor-test-helpers@10.2.0
  - @atlaskit/synchrony-test-helpers@1.0.1
  - @atlaskit/task-decision@16.0.3
  - @atlaskit/media-test-helpers@25.2.4
  - @atlaskit/media-picker@50.0.0

## 114.0.4

### Patch Changes

- [patch][30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):

  @atlaskit/select has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 114.0.3

- Updated dependencies [4e487b59a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e487b59a1):
  - @atlaskit/share@0.7.0

## 114.0.2

### Patch Changes

- [patch][dba498a7b0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dba498a7b0):

  Prevent updating MediaSingle node if new attrs are the same as current ones

## 114.0.1

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

## 114.0.0

### Major Changes

- [major][f28c191f4a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f28c191f4a):

  BREAKING: remove viewContext and uploadContext from Editor mediaProvider api

  A few months ago we introduced the ability to pass either `viewContext` `uploadContext` or `viewMediaClientConfig` `uploadMediaClientConfig`, in order to help with the transition of media-client > media-core.

  Now we are getting rid of the old `viewContext` + `uploadContext` and just keep `viewMediaClientConfig` + `uploadMediaClientConfig`.

  ### Before

  ```typescript
  import {Editor} from '@atlaskit/editor-core`
  import {ContextFactory} from '@atlaskit/media-core'

  const mediaProvider = Promise.resolve({
    viewContext: ContextFactory.create({
      authProvider: () => Promise.resolve()
    }),
    uploadContext: ContextFactory.create({
      authProvider: () => Promise.resolve()
    }),
  })

  <Editor
    mediaProvider={mediaProvider}
  />

  ```

  ### Now

  ```typescript
  import {Editor} from '@atlaskit/editor-core`

  const mediaProvider = Promise.resolve({
    viewMediaClientConfig: {
      authProvider: () => Promise.resolve()
    },
    uploadMediaClientConfig: {
      authProvider: () => Promise.resolve()
    }
  })

  <Editor
    mediaProvider={mediaProvider}
  />

  ```

### Minor Changes

- [minor][6e46da0e7f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e46da0e7f):

  ED-7847 Adding option to connect atlaskit example page to synchrony server on development- [minor][628fc6fa34](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/628fc6fa34):

  [ED-7738] Introducing `UNSAFE_allowAltTextOnImages` editor prop.
  DO NOT USE THIS IN PRODUCTION!

  There is no implementation delivered as part of this change. But we will use it to wrap all the UI changes.

### Patch Changes

- [patch][b16f92a4c9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b16f92a4c9):

  ED-7904: Enabling input typing performance sampling - send time taken for every 100th keypressed- [patch][e47220a6b2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e47220a6b2):

  ED-5450: remove most of ts-ignores from editor packages- [patch][79997ae8a8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79997ae8a8):

  Implement missing parts of dispatchTransaction for labs/next editor- [patch][66701534af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66701534af):

  ED-7883 [v3] Add ability to override plugin preset similar to babel- [patch][29f6a0bf45](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29f6a0bf45):

  [ED-7771] Add resize handler on tables when the first row is merged- [patch][c98b85f9cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c98b85f9cd):

  ED-7882 Optimise and minimise SVG asset for feedback- [patch][cc32fa0427](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc32fa0427):

  remove ! from Toolbar Annotation component to prevent runtime exception

- Updated dependencies [24b8ea2667](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24b8ea2667):
  - @atlaskit/editor-test-helpers@10.1.3
  - @atlaskit/renderer@53.0.0
  - @atlaskit/emoji@62.5.6
  - @atlaskit/media-client@4.0.0
  - @atlaskit/media-picker@49.0.0
  - @atlaskit/media-filmstrip@36.0.0
  - @atlaskit/media-test-helpers@25.2.2
  - @atlaskit/editor-bitbucket-transformer@6.2.6
  - @atlaskit/editor-json-transformer@6.3.5
  - @atlaskit/editor-markdown-transformer@3.1.8
  - @atlaskit/task-decision@16.0.2
  - @atlaskit/editor-common@41.2.1
  - @atlaskit/media-card@66.0.1
  - @atlaskit/media-editor@37.0.1
  - @atlaskit/media-core@31.0.0

## 113.2.2

### Patch Changes

- [patch][b1cdbefb71](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1cdbefb71):

  ED-7951 Update correct link attribute

## 113.2.1

- Updated dependencies [42a92cad4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42a92cad4e):
  - @atlaskit/emoji@62.5.5
  - @atlaskit/mention@18.15.7
  - @atlaskit/pubsub@5.0.7
  - @atlaskit/share@0.6.14
  - @atlaskit/util-data-test@13.0.1
  - @atlaskit/task-decision@16.0.1
  - @atlaskit/util-service-support@5.0.0

## 113.2.0

### Minor Changes

- [minor][4585681e3d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4585681e3d):

  ED-7631: removed containerAri for task-decisions components- [minor][1a0fe670f9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1a0fe670f9):

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

- [patch][2806d52400](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2806d52400):

  Update i18n strings with latest translations- [patch][cc28419139](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc28419139):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.- [patch][a69129b69f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a69129b69f):

  ED-7772 Enabled heading anchor in kitchen sink- [patch][b37ede79c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b37ede79c8):

  ED-7799 Refactor analytics to prevent splitting history

  - Use analytics step direct into the same transaction instead of setting on meta and appending a different transaction afterwards.
  - Add current selection position into analytics step to create step map base on current position. This makes that all of the following steps can be appended.

- [patch][037956f1fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/037956f1fa):

  ED-7673: Using hooks for new architecture components- [patch][2e24e120cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e24e120cd):

  ED-7602 Fixed Smart Links having lost their selection state.

- [patch][f3bae65674](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f3bae65674):

  [ED-7319] Fix table lock problem when resizing columns is happening in a collab session- [patch][8daae7e09e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8daae7e09e):

  ED-7750 Deduped i18n ids. Pulled latest i18n translations.

- [patch][77553f37a3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/77553f37a3):

  ED-7840: use DOMParser rather than using innerHTML to avoid executing content from clipboard- [patch][c0a0df0729](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c0a0df0729):

  ED-7806: Re throwing errors from componentDidCatch- [patch][e712df24c0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e712df24c0):

  MS-2416: Adding package info in analytics GASv3 payload

- Updated dependencies [c3e65f1b9e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3e65f1b9e):
- Updated dependencies [bd94b1d552](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd94b1d552):
- Updated dependencies [e7b5c917de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7b5c917de):
  - @atlaskit/editor-common@41.2.0
  - @atlaskit/renderer@52.0.0
  - @atlaskit/media-client@3.0.0
  - @atlaskit/media-core@30.0.17
  - @atlaskit/media-test-helpers@25.2.0
  - @atlaskit/media-card@66.0.0
  - @atlaskit/media-editor@37.0.0
  - @atlaskit/media-filmstrip@35.0.0
  - @atlaskit/media-picker@48.0.0
  - @atlaskit/editor-bitbucket-transformer@6.2.5
  - @atlaskit/editor-json-transformer@6.3.4
  - @atlaskit/editor-markdown-transformer@3.1.7
  - @atlaskit/emoji@62.5.4
  - @atlaskit/mention@18.15.5
  - @atlaskit/share@0.6.12
  - @atlaskit/user-picker@4.1.3
  - @atlaskit/task-decision@16.0.0
  - @atlaskit/util-data-test@13.0.0

## 113.1.6

### Patch Changes

- [patch][d17bb8cf2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d17bb8cf2d):

  ED-7730: Hyperlink enchancements

## 113.1.5

### Patch Changes

- [patch][ca88f616e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca88f616e4):

  ED-7730: Hyperlink improvements

## 113.1.4

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 113.1.3

- Updated dependencies [8c725d46ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c725d46ec):
  - @atlaskit/calendar@9.0.0

## 113.1.2

### Patch Changes

- [patch][dbd86d9542](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dbd86d9542):

  MS-2397 Fix bug where media with same ids haven't been updating attributes

## 113.1.1

### Patch Changes

- [patch][8af8f8ec2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8af8f8ec2a):

  ED-7768 Fixed regression where you cannot click inside a block macro

## 113.1.0

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

- [minor][b7f541d0ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b7f541d0ea):

  ED-7737: Fix icons import in editor core to reduce bundle size- [minor][79c69ed5cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79c69ed5cd):

  ED-7449 Implement sorting inline cards inside tables base on resolved title- [minor][380c643806](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/380c643806):

  https://product-fabric.atlassian.net/browse/ED-7503

  New insertion behaviour comes into place, making it consistent no matter how supported nodes are inserted (more detailed info in the ticket).
  These changes only covers Horizontal rule and Media Single nodes, only when they are inserted at the beginning or at the end of an specific node.

  Examples:

  - Insert a horizontal rule when the cursor is at the begining of a paragraph, it will insert the node above the paragraph. Same with media single.
  - Insert a horizontal rule when the cursor is at the end of a paragraph, it will insert the node bellow the paragraph. Same with media single.

  All of these cases should behave consistently regardless if the node was inserted usng the toolbar, with the `/divider` command, or the `---`/`***` shortcut (for the horizontal rule case).

  All this new behaviour is wrapp around a new EditorProp named `allowNewInsertionBehaviour` which is `true` by default.
  Turning this prop to `false` will always fallback to previous behaviour.

- [minor][98ad94c69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98ad94c69c):

  FM-2393 Expose undo/redo methods on mobile bridge

  native-to-web: undo/redo methods which will hook directly into prosemirror-history's
  web-to-native: undoRedoBridge.stateChange which informs native whether undo and redo are currently available so they can enable/disable their buttons accordingly

### Patch Changes

- [patch][7345e92cc2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7345e92cc2):

  [ED-7736] Reduce the number of crashs when resizing a table in a collab session- [patch][0a4a4b8781](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4a4b8781):

  ED-7599: Fix sending transactions to synchrony before collab plugin is ready- [patch][f3f51ad634](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f3f51ad634):

  ED-7680 Prevent insert row or column when selection is not over a table- [patch][c678549a36](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c678549a36):

  FM-1752 Fix issue where correct text colour was not selected in toolbar when user had a range selection on coloured text in a nested node eg. a paragraph inside a panel

- [patch][b88a5c5716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b88a5c5716):

  ED-7318 - Refactor solution for discarding stale PM transactions.- [patch][47bd9ffc0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/47bd9ffc0f):

  ED-7726: Pass emojiProvider to EmojiTypeAhead item, fixes not loading emojis in typeahead- [patch][0545e69ee6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0545e69ee6):

  call MediaNodeUpdater.updateFileAtts on any prop changes in MediaSingle- [patch][1063a8fb26](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1063a8fb26):

  ED-7679 Fix bug where pasting table with picture from External document, paste image outside the table- [patch][1dd58c65ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1dd58c65ca):

  ED-7218: Implement excludes and experimental for CXHTML preset- [patch][dac3a85916](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dac3a85916):

  ED-7318 Prevent manipulating the DOM after the editor has been destroyed- [patch][715cb9854e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/715cb9854e):

  Improve dev feedback when logging a failed ADF document parsing. Ensure the reason is shown before the JSON to prevent truncation of the reason on large documents.- [patch][34dd8edf58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/34dd8edf58):

  [ED-7690] Fix controls markers on tables showing up when allowControls is false

## 113.0.0

### Major Changes

- [major][166eb02474](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/166eb02474):

**Editor Bombazine Release**

**BREAKING CHANGES**

**Renderer**

- Change in contract for `eventHandlers.smartCard.onClick` prop:
  - Old: onClick(url): void
  - New: onClick(event, url): void

​**ADF Schema**

- Remove applicationCard node and action mark
- Remove exposed `tableBackgroundBorderColors` in favour of `tableBackgroundBorderColor`

**Affected editor components:**

Tables, Media, Headings, Copy and Paste, Mobile

**Anchor Links**

- Headings in the renderer now show an anchor link on hover
  - Feature Flag:
    - allowHeadingAnchorLinks - [default: false]
  - https://product-fabric.atlassian.net/browse/ED-5137

**Copy and Paste**

    - Fixed a bug where right click for copy image failed the second time that is pasted
      - https://product-fabric.atlassian.net/browse/MS-2324

**Media**

    - Resizing/Aligning media inside Table
      - Feature Flag:
        - allowResizingInTables - [default: false]
      - https://product-fabric.atlassian.net/browse/ED-6359
    - You can now insert same file from MediaPicker twice
      - https://product-fabric.atlassian.net/browse/MS-2080
    - Implement media link in renderer
      - https://product-fabric.atlassian.net/browse/ED-7244

**Tables**

    - Implement table sorting in renderer - [NEW BIG FEATURE][not enabled]
      - Feature Flag:
        - allowColumnSorting – [default: false]
      - https://product-fabric.atlassian.net/browse/ED-7392
    - Expanded table cell background color palette
      - https://product-fabric.atlassian.net/browse/ED-7201

**Mobile**

    - Provide method for scrolling to actions, decisions and mentions
      - https://product-fabric.atlassian.net/browse/FM-2261
      - https://product-fabric.atlassian.net/browse/FM-2055
    - Improve Hybrid Editor Scrolling
      - https://product-fabric.atlassian.net/browse/FM-2212

**Notable Bug fixes**

    - Fixed an issue where you couldn't split merged cells when a cell contained a media item
      - https://product-fabric.atlassian.net/browse/ED-6898
    - Pasting content with an emoji no longer duplicates the emoji as an image
      - https://product-fabric.atlassian.net/browse/ED-7513
    - Content inside of a table cell no longer overflows if table looses focus
      - https://product-fabric.atlassian.net/browse/ED-7529
    - Fixed an issue when adding rows and cols at the same time start adding infinite columns
      - https://product-fabric.atlassian.net/browse/ED-7700- [major] [80adfefba2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80adfefba2):

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

  ED-7201 Add new background cell colors and improve text color- [minor][520db7fe02](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/520db7fe02):

  ED-6359 Enable image resize and alignment within tables

  This feature needs to be enabled with the new optional prop `media.allowResizingInTables`. By default, this is set to `false`, but will likely be promoted to default `true` in future, and then removed as an option. _Resizing_ and _alignment_ of media within tables are both tied to this prop.

### Patch Changes

- [patch][1739779ad2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1739779ad2):

  [ED-7475] Fix rows controls height after sorting table by column- [patch][9908666d1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9908666d1e):

  Bump prosemirror-tables from 0.9.1 to 0.9.2- [patch][c7dd52d435](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c7dd52d435):

  pass occurenceKey when uploading external media- [patch][9fb705e807](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9fb705e807):

  FM-2212: Refactor Mobile Bridge CSS to improve body scrolling. FM-2024: Improve Mobile Editing UX when tapping beneath Tables, Layouts, Columns.- [patch][0e537cf0fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e537cf0fe):

  ED-7700: prevent collab plugin from sending fixTable appended transaction- [patch][799d72f043](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/799d72f043):

  ED-7347 Fix paste col widths when we allowColumnResizig is disabled- [patch][367e6d2cf4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/367e6d2cf4):

  [ED-7720] Fix tables exceptions when allowColumnResizing is false- [patch][7321d0a95f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7321d0a95f):

  ED-7600: fix forEach in IE11- [patch][7d57dc2ffa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d57dc2ffa):

  ED-6940 fixed an issue where text is copied partly when there is some elements inside

- [patch][dea143f9cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dea143f9cd):

  prioritize media metadata from external files and copy them on the backend, instead of re upload them- [patch][bbb4f9463d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbb4f9463d):

  CEMS-234 Prioritize media single over media group

  This solves issue where pasting images with text from third party applications into a table ends adding an error image.- [patch][1976df2d1f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1976df2d1f):

  [ED-7722] Fix frozen selection when there is a broken table on ADF- [patch][477d8d8017](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/477d8d8017):

  [ED-7477] Fix table looses focus on adding rows|columns when using Safari- [patch][90a6171e9e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/90a6171e9e):

  ED-7501: fix firing transactions on mouseover during resizing- [patch][d4081fed44](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d4081fed44):

  ED-7335: fix table controls being cut off in comment editor- [patch][6a65910fb2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6a65910fb2):

  dont upload external images to media- [patch][9a521ca2e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a521ca2e0):

  ED-7694 ReplaceDocument should restore text selection (and scroll position on some browsers/platforms) to start of the document, instead of the end.- [patch][229a888884](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/229a888884):

  ED-7513: added unit tests for emoji paste from renderer (as sprite and as image)

- [patch][fea463dee9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fea463dee9):

  Fixes initialisation of annatation mark- [patch][d80580866b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d80580866b):

  pass contextId to MediaNodeUpdater.updateFileAttrs to make sure is available on paste event- [patch][113a08075f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/113a08075f):

  ED-6898 Fix regression where I cannot split a merged cell with media single- [patch][4b2afcc09d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b2afcc09d):

  ED-7533: Fixes issue where in certain scenarios selecting text wouldnt populate the hyperlink toolbar- [patch][7b794e7cea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7b794e7cea):

  ED-2774 Fix pasting of superscript and subscript from google docs by allowing sup/sub script to be described with `vertical-align`

- [patch][a8cedf4f6a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a8cedf4f6a):

  [ED-7651] Fix request for classList on SVGElements when trying to add new row or column on tables (IE11 patch)- [patch][922ec81fe7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/922ec81fe7):

  ED-7710: Only show annotation highlight if we have a provider- [patch][3f1c7dd26a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f1c7dd26a):

  [ED-7392] Add sort table by column on renderer behind allowColumnSorting feature flag
  [ED-7392] Extract common methods to sort table

- [patch][468be2920e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/468be2920e):

  ED-7447: Fixes issue in Firefox where navigating lists would cause you to immediately jump outside the list on first keystroke.- [patch][79f23a5035](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79f23a5035):

  ED-7385: Update container width on update in FullPage appearance

  This prevents certain nodes from disappearing when transitioning from preview mode to edit mode.- [patch][3c0009a38c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0009a38c):

  ED-7345 Fix bug where allow paste cell with background when is disable- [patch][07796abde3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07796abde3):

  ED-7529: make sure content doesn't overflow inside table cells- [patch][9cddedc62f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cddedc62f):

  ED-7244 refactor hardcoded media single class name using a constant- [patch][eba491e793](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eba491e793):

  Fix bug where resize handler is been shown when column resizing is disabled

- Updated dependencies [1194ad5eb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1194ad5eb3):
- Updated dependencies [40ead387ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40ead387ef):
  - @atlaskit/adf-utils@7.0.0
  - @atlaskit/editor-common@41.0.0
  - @atlaskit/editor-bitbucket-transformer@6.2.4
  - @atlaskit/editor-json-transformer@6.3.3
  - @atlaskit/editor-test-helpers@10.0.0
  - @atlaskit/editor-markdown-transformer@3.1.6
  - @atlaskit/renderer@51.0.0
  - @atlaskit/adf-schema@4.0.0
  - @atlaskit/task-decision@15.3.4

## 112.44.8

### Patch Changes

- [patch][2b158873d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b158873d1):

  Add linting rule to prevent unsafe usage of setTimeout within React components.

## 112.44.7

### Patch Changes

- [patch][40bda8f796](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40bda8f796):

  @atlaskit/avatar-group has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 112.44.6

### Patch Changes

- [patch][3bc91f34b0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3bc91f34b0):

  ED-7573: fix resizing merged columns in the first row- [patch][35e541a607](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35e541a607):

  Fix bug where resize handler is been shown when column resizing is disabled

## 112.44.5

- Updated dependencies [8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):
  - @atlaskit/avatar-group@4.0.13
  - @atlaskit/dropdown-menu@8.1.1
  - @atlaskit/item@10.1.5
  - @atlaskit/modal-dialog@10.2.1
  - @atlaskit/renderer@50.0.2
  - @atlaskit/mention@18.15.1
  - @atlaskit/task-decision@15.3.2
  - @atlaskit/avatar@17.0.0
  - @atlaskit/theme@9.2.2
  - @atlaskit/user-picker@4.0.23

## 112.44.4

### Patch Changes

- [patch][c19165aec0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c19165aec0):

  Fix non-critical exception when updating media nodes

  `contextIdentifierProvider` is an optional provider for consumers of the Editor. Some code assumed that this was always provided. Some tests, for example, did not pass this, so they would blow up.

## 112.44.3

- Updated dependencies [af72468517](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af72468517):
  - @atlaskit/editor-common@40.0.1
  - @atlaskit/renderer@50.0.1
  - @atlaskit/media-client@2.1.2
  - @atlaskit/media-core@30.0.14
  - @atlaskit/media-filmstrip@34.3.6
  - @atlaskit/media-editor@36.3.1
  - @atlaskit/media-picker@47.1.2
  - @atlaskit/media-test-helpers@25.1.1
  - @atlaskit/media-card@65.0.0
  - @atlaskit/analytics-listeners@6.2.0

## 112.44.2

- Updated dependencies [08ec269915](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/08ec269915):
  - @atlaskit/editor-bitbucket-transformer@6.2.3
  - @atlaskit/editor-json-transformer@6.3.2
  - @atlaskit/editor-markdown-transformer@3.1.5
  - @atlaskit/editor-test-helpers@9.11.13
  - @atlaskit/task-decision@15.3.1
  - @atlaskit/editor-common@40.0.0
  - @atlaskit/renderer@50.0.0

## 112.44.1

### Patch Changes

- [patch][a05133283c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a05133283c):

  Add missing dependency in package.json

## 112.44.0

### Minor Changes

- [minor][e5c3f6ae3e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e5c3f6ae3e):

  ED-6216: External images will now be uploaded to media services if possible

## 112.43.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 112.42.4

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 112.42.3

### Patch Changes

- [patch][0d7d459f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7d459f1a):

  Fixes type errors which were incompatible with TS 3.6

## 112.42.2

### Patch Changes

- [patch][9cafd2de3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cafd2de3c):

  Editor now listens to Media Picker upload-end events and treats them the same as upload-processing finishing the insert progress and enabling Save

## 112.42.1

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 112.42.0

### Minor Changes

- [minor][d438397a89](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d438397a89):

  **Editor Azlon Release**

  **Affected editor components:**

  Tables, Media, Smart Cards, Extensions, Analytics, Copy and Paste, Code Block, Undo, Emoji

  **Performance**

  - Reduce number of wrapping nodes in table cells. – [table][affects: wrapping, overflow, resizing]
    - https://product-fabric.atlassian.net/browse/ED-7288
  - Cache resizeState in pluginState to avoid expensive DOM operations. – [table][affects: resizing]
    - https://product-fabric.atlassian.net/browse/ED-7343
  - Delay MutationObserver initialization in table. – [table][affects: initial table rendering, size adjustment on initial render]
    - https://product-fabric.atlassian.net/browse/ED-7436
  - Improve the way we handle mouse events in table – [table][affects: column drag handlers, table controls, resizing]
    - https://product-fabric.atlassian.net/browse/ED-7342

  **SmartCards**

  - Pending and error states do not pass onClick prop
    - https://product-fabric.atlassian.net/browse/SL-359
  - Make toolbars consistent between blue link and smart link – [affects: link and smart link]
    - https://product-fabric.atlassian.net/browse/ED-7157

  **Mention Highlights**

  Not clear how to test. – [affects: all type aheads, mention type ahead]

  **Copy and Paste**

  - Copying text & images from Google doc changes formatting on paste [affects: media]
    - https://product-fabric.atlassian.net/browse/ED-7338
  - Pasted code block does not persist selected language – [affects: code block]
    - https://product-fabric.atlassian.net/browse/ED-7050
  - Copy and paste media

  **Tables**

  - Table add 40+ blank columns
    - https://product-fabric.atlassian.net/browse/ED-7031
  - Implement Table Sorting in Edit Mode – [NEW BIG FEATURE][not enabled]
    - Feature flag:
      - allowColumnSorting – [default: false]
    - https://product-fabric.atlassian.net/browse/ED-7391

  **Analytics**

  - Fire undo events – [affects: undo]
    - https://product-fabric.atlassian.net/browse/ED-7276
  - Make all insert events set analytics meta
    - https://product-fabric.atlassian.net/browse/ED-7277

  **Notable Bug fixes**

  - Issue with ctrl+z [affects: undo on different languages, e.g. Russian keyboard]
    - https://product-fabric.atlassian.net/browse/ED-7310

---

**All changes**

- [minor][eb79a83696](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eb79a83696):

  BENTO-4437 allow ToolbarHelp position and title to be customised- [minor][e7e1b26b78](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7e1b26b78):

  ED-7276 Send undo/redo analytics events

  Note that this will only work for events which are currently using the approach where we setMeta on a transaction using the analytics plugin key, it will be updated to cover _all_ insert events in ED-7277

- [minor][9636c78eb4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9636c78eb4):

  Delay MutationObserver in tables- [minor][c0058c2aab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c0058c2aab):

  [ED-7312] Add sorting table by column- [minor][66c5c88f4a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66c5c88f4a):

  Refactor emoji to use typeahead plugin- [minor][69d048577c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69d048577c):

  ED-7277 Update way of firing insert analytics events so that they automatically work for undo/redo events- [minor][ef7bf9c388](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef7bf9c388):

  ED-7217: Remove references to editor appearance from plugins in favor of plugin options- [minor][bdee736f14](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bdee736f14):

  ED-7175: unify smart link and hyperlink toolbars

  Also updates the toDOM and parseDOM on ADF nodes, making `url` optional.

  Smart cards can now optionally be passed an onResolve callback, of the shape:

      onResolve?: (data: { url?: string; title?: string }) => void;

  This gets fired when the view resolves a smart card from JSON-LD, either via the client or the `data` prop.- [minor][ff9f82137b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff9f82137b):

  ED-7149: Report the jankiness in the Editor- [minor][263e4bc7d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/263e4bc7d1):

  [ED-6897] Add new rows do not expand the previous rowspan anymore, but we are copying the background-color from previous cells

### Patch Changes

- [patch][2b3c62db98](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b3c62db98):

  Update i18n translations for editor-core- [patch][79e7405fae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79e7405fae):

  ED-7031: prevent table plugin from appending unnecessary transactions- [patch][2d7fab179d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d7fab179d):

  ED-7050 Fixed pasting of codeblock so that selected language persists- [patch][8b9bdbc0ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b9bdbc0ea):

  [ED-7450] Group content by type when ordering the table- [patch][ec33aa6b22](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec33aa6b22):

  prevent infinite loop while trying to render smart link- [patch][a93cd5686c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a93cd5686c):

  ED-6972 Fix inconsistent behaviour with opening/closing text colour & align dropdowns

  Clicking the button when a menu is open will now close the menu, this matches the behaviour of other dropdowns in the editor

- [patch][6e3a0038fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e3a0038fc):

  ED-7288: reduces the number of DOM nodes in table cells, changes the way resize handles are positioned- [patch][a0a3fa7aac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a0a3fa7aac):

  Ensure mediagroup nodes are copied to destination collection when pasted in different documents- [patch][a9b6e9afb6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a9b6e9afb6):

  Adding missing file data attributes in media single to help fix copy/paste issues

- [patch][10c0f68fc0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10c0f68fc0):

  ED-7328 Handle pasting a list inside an empty panel, previously the panel would be deleted- [patch][c3f7d81030](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3f7d81030):

  [ED-7398] Fix floating insert button position when first columns has rowSpan- [patch][670e897285](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/670e897285):

  ED-7343: improve performance of calculating resizeState- [patch][02bd8e3fdb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/02bd8e3fdb):

  ED-7474: update resize handle on resize- [patch][b738f4f661](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b738f4f661):

  ED-7344: trigger mutation observer callback only when new DIV nodes are inserted into table cells- [patch][ef5106b641](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef5106b641):

  Fix typings and regex- [patch][5360ec9385](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5360ec9385):

  ED-7342: when handling mouse events, make sure table is in focus and event handlers are debounced- [patch][473dac237b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/473dac237b):

  Increasing the typing input time considering synchrony adds an overhead in typing- [patch][4549780c6c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4549780c6c):

  [ED-7448] Mention will be case insensitive for sorting in table columns- [patch][7a926db3f2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7a926db3f2):

  Add domain name to hyperlink analytics events- [patch][a82d6088e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a82d6088e2):

  ED-4807 Use right cell type when spliting merged header cells- [patch][62b5fc3b6b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/62b5fc3b6b):

  ED-7338 Fix Google Docs copy/paste bug where the order of text & images were not being preserved correctly

- [patch][f696c87eaa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f696c87eaa):

  ED-7217: Remove mention workaround for composition on mobile.- [patch][53da0eb314](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/53da0eb314):

  ED-7357 - Refactor scroll gutter plugin to use ProseMirror scrolling hooks, FM-2210 - Enable scroll gutter plugin for mobile appearance.

## 112.41.9

- Updated dependencies [3624730f44](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3624730f44):
  - @atlaskit/editor-common@39.17.4
  - @atlaskit/renderer@49.7.10
  - @atlaskit/media-client@2.0.2
  - @atlaskit/media-core@30.0.11
  - @atlaskit/media-editor@36.2.10
  - @atlaskit/media-filmstrip@34.3.3
  - @atlaskit/media-picker@47.0.2
  - @atlaskit/media-test-helpers@25.0.2
  - @atlaskit/media-card@64.0.0

## 112.41.8

- Updated dependencies [6879d7d01e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6879d7d01e):
  - @atlaskit/media-test-helpers@25.0.1
  - @atlaskit/media-picker@47.0.0

## 112.41.7

### Patch Changes

- [patch][926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):

  Analytics-next has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No behavioural changes.

  **Breaking changes**

  - `withAnalyticsForSumTypeProps` alias has been removed, please use `withAnalyticsEvents`
  - `AnalyticsContextWrappedComp` alias has been removed, please use `withAnalyticsContext`

  **Breaking changes to TypeScript annotations**

  - `withAnalyticsEvents` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
  - `withAnalyticsContext` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
  - Type `WithAnalyticsEventProps` has been renamed to `WithAnalyticsEventsProps` to match source code
  - Type `CreateUIAnalyticsEventSignature` has been renamed to `CreateUIAnalyticsEvent` to match source code
  - Type `UIAnalyticsEventHandlerSignature` has been renamed to `UIAnalyticsEventHandler` to match source code
  - Type `AnalyticsEventsPayload` has been renamed to `AnalyticsEventPayload`
  - Type `ObjectType` has been removed, please use `Record<string, any>` or `[key: string]: any`
  - Type `UIAnalyticsEventInterface` has been removed, please use `UIAnalyticsEvent`
  - Type `AnalyticsEventInterface` has been removed, please use `AnalyticsEvent`
  - Type `CreateAndFireEventFunction` removed and should now be inferred by TypeScript
  - Type `AnalyticsEventUpdater` removed and should now be inferred by TypeScript

## 112.41.6

- Updated dependencies [69586b5353](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69586b5353):
  - @atlaskit/editor-test-helpers@9.11.6
  - @atlaskit/renderer@49.7.8
  - @atlaskit/media-card@63.3.11
  - @atlaskit/media-client@2.0.1
  - @atlaskit/media-core@30.0.10
  - @atlaskit/media-editor@36.2.9
  - @atlaskit/media-filmstrip@34.3.2
  - @atlaskit/media-picker@46.0.9
  - @atlaskit/media-test-helpers@25.0.0

## 112.41.5

### Patch Changes

- [patch][98dc5f3a6a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98dc5f3a6a):

  CEMS-201: Fix gadget name in block header extension

## 112.41.4

### Patch Changes

- [patch][c3618f9775](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3618f9775):

  CEMS-201: Remove image for block extenions

## 112.41.3

### Patch Changes

- [patch][af9fb044da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af9fb044da):

  CEMS-201: Fix icon sizes in block extension headers

## 112.41.2

- Updated dependencies [ee804f3eeb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee804f3eeb):
  - @atlaskit/editor-common@39.17.2
  - @atlaskit/renderer@49.7.7
  - @atlaskit/media-card@63.3.9
  - @atlaskit/media-core@30.0.9
  - @atlaskit/media-editor@36.2.7
  - @atlaskit/media-filmstrip@34.3.1
  - @atlaskit/media-picker@46.0.3
  - @atlaskit/media-test-helpers@24.3.5
  - @atlaskit/media-client@2.0.0

## 112.41.1

- Updated dependencies [4e8f6f609f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e8f6f609f):
  - @atlaskit/media-picker@46.0.0
  - @atlaskit/media-test-helpers@24.3.4

## 112.41.0

### Minor Changes

- [minor][9b83fdea35](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b83fdea35):

  TEAMS-618 : Rename Team mention spotlight to Team Mention Highlight

## 112.40.2

### Patch Changes

- [patch][fe1a882fbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fe1a882fbb):

  TEAMS-602 : Can pass the team creation link from confluence as an optional parameter to the Team Mention Spotlight

## 112.40.1

### Patch Changes

- [patch][7515b0b50f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7515b0b50f):

  ED-7054: Adding border to block extension

## 112.40.0

### Minor Changes

- [minor][cda47d4480](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cda47d4480):

  TEAMS-623 : Before this fix, when Spotlight was being rendered for the 5th time, it briefly appeared and then disappeared. This change fixes that.

## 112.39.16

### Patch Changes

- [patch][2703a8e39e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2703a8e39e):

  ED-7310: Add work-around for Russian keyboard layouts where undo wouldn't fire correctly.

## 112.39.15

### Patch Changes

- [patch][696c032471](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/696c032471):

  Import editor-core dependencies via module name

## 112.39.14

### Patch Changes

- [patch][ce4419f491](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce4419f491):

  ED-7142: Prevent block extensions from being re-mounted during a layout change.

## 112.39.13

### Patch Changes

- [patch][64874a4740](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64874a4740):

  Update i18n strings with latest translations

## 112.39.12

### Patch Changes

- [patch][688f2957ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/688f2957ca):

  Fixes various TypeScript errors which were previously failing silently

## 112.39.11

### Patch Changes

- [patch][51e0d438ce](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/51e0d438ce):

  Make ReactNodeView and SelectionBasedNodeView generic

## 112.39.10

### Patch Changes

- [patch][690e0a151d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/690e0a151d):

  [ED-7324] Fix table selected columns controls colors

## 112.39.9

### Patch Changes

- [patch][6874801bc0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6874801bc0):

  ED-7314 Added test helpers for comparing selections. Includes new builders for gap cursors.

## 112.39.8

### Patch Changes

- [patch][060752953d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/060752953d):

  ED-7297: Fixes missing `popupsScrollableElement` prop not being passed down correctly

## 112.39.7

### Patch Changes

- [patch][87719d77c7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87719d77c7):

  ED-7308: added performance measurements of ProseMirror document updates

## 112.39.6

### Patch Changes

- [patch][8c50c8731b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c50c8731b):

  [ED-5195] Fix red borders when the user hover the remove column button on tables with merged cells

## 112.39.5

- Updated dependencies [6164bc2629](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6164bc2629):
  - @atlaskit/adf-utils@6.1.3
  - @atlaskit/editor-bitbucket-transformer@6.1.3
  - @atlaskit/editor-json-transformer@6.2.3
  - @atlaskit/editor-markdown-transformer@3.1.3
  - @atlaskit/editor-test-helpers@9.11.3
  - @atlaskit/adf-schema@3.0.0
  - @atlaskit/editor-common@39.17.0
  - @atlaskit/renderer@49.7.5

## 112.39.4

### Patch Changes

- [patch][25d1a4dd68](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d1a4dd68):

  ED-6300: fix pasting lists in tables where pasted slice has openStart > openEnd

## 112.39.3

### Patch Changes

- [patch][a892339c19](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a892339c19):

  Give all editor decorations a key to prevent ProseMirror from re-rendering decorations constantly.

  Enables YAML language for codeblocks

## 112.39.2

### Patch Changes

- [patch][c68c5119c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c68c5119c8):

  Fixes regression where pasting a plain text link wouldnt convert to link

## 112.39.1

### Patch Changes

- [patch][2d5136732c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d5136732c):

  ED-7315 Ensure text selection remains inside inserted action/decision item when inserting into an empty paragraph below another paragraph

## 112.39.0

### Minor Changes

- [minor][ec66d3c646](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec66d3c646):

  Improve performance of pages with smart cards

## 112.38.0

### Minor Changes

- [minor][e81d32fe9a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e81d32fe9a):

  TEAMS-588 : Refactors the Team Spotlight ( which is used in mention typeahead for Fabric Editor and TinyMCE editor). Now can close the spotlight from Fabric Editor by clicking on the x button.

## 112.37.0

### Minor Changes

- [minor][4fc000749a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4fc000749a):

  ED-7216: Internal: Align plugin initialisation

## 112.36.1

### Patch Changes

- [patch][3d94fcc7d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d94fcc7d8):

  [ED-7128] Fix table split when copy from a table cell with a hard break at the end

## 112.36.0

### Minor Changes

- [minor][06cfea0870](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06cfea0870):

  TEAMS-549 : Adding capability to show a spotlight in Fabric Editor

## 112.35.3

### Patch Changes

- [patch][b62ca2126a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b62ca2126a):

  ED-7304 Fix bug where column keep selection UI when you select a cell

## 112.35.2

### Patch Changes

- [patch][0bb88234e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0bb88234e6):

  Upgrade prosemirror-view to 1.9.12

## 112.35.1

### Patch Changes

- [patch][f6ea3777ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f6ea3777ff):

  Upgrade media editor in editor core

## 112.35.0

### Minor Changes

- [minor][d4218e8388](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d4218e8388):

  [ED-7018] Improve table performance moving the column controls from external divs to Prosemirror Decorations inside of the table cells.

## 112.34.2

- Updated dependencies [bc0d3bf0b2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bc0d3bf0b2):
  - @atlaskit/share@0.6.0

## 112.34.1

### Patch Changes

- [patch][ec8066a555](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec8066a555):

  Upgrade `@types/prosemirror-view` Typescript definitions to latest 1.9.x API

## 112.34.0

### Minor Changes

- [minor][8ea4c1d314](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8ea4c1d314):

  ED-6382 Added quick insert option to open the feedback modal dialog in editor

  **Interface Changes**
  There are also changes in the interface of `Editor` component and `ToolbarFeedback` component.

  **`Editor`**
  For `Editor` component, a property called `feedbackInfo` is added contains the following properties:

  - `product`
  - `packageName`
  - `packageVersion`
  - `labels`

  The above properties will provide environmental context for the feedback dialog.

  Note that `feedbackInfo` is required to enable editor quick insert option for the feedback dialog.

  **`ToolbarFeedback`**
  For `ToolbarFeedback` component, the following feedback related properties are deprecated in favour of using the `feedbackInfo` property on Editor.

  - `packageName`
  - `packageVersion`
  - `labels`

  **Compatibility**
  Existing code using the `ToolbarFeedback` component will still work, there will be not no changes on the feedback dialog behavior. However, in order to enable opening feedback dialog from quick insert menu, you need to add `feedbackInfo` property on `Editor`.

  If you have put different value for `packageName`, `packageVersion` and `labels` in both `Editor` and `ToolbarFeedback`, depends on how you opening the feedback dialog, it will use different properties.
  For example, if a user opens the feedback dialog using the quick insert menu, the feedback modal will use relevant properties from `Editor` component, otherwise opening from toolbar feedback button will bring up a dialog uses relevant properties from `ToolbarFeedback` component.

  **Explanation**
  In order to enable opening feedback dialog from the quick insert menu, we need to move the feedback dialog code from ToolbarFeedback to Editor itself, because initialize editor plugin from a UI component is not ideal, and it would be very difficult to get properties from an UI component.

## 112.33.35

### Patch Changes

- [patch][d5444d841f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5444d841f):

  Upgrade media-editor in to pull in latest cjs change

## 112.33.34

### Patch Changes

- [patch][926ca90f35](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926ca90f35):

  Update i18n strings with latest translations

## 112.33.33

### Patch Changes

- [patch][31a61bf470](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/31a61bf470):

  ED-6379 Prevent layout trashing on table resizing/update.

## 112.33.32

- Updated dependencies [7e9d653278](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e9d653278):
  - @atlaskit/avatar@16.0.8
  - @atlaskit/avatar-group@4.0.7
  - @atlaskit/share@0.5.15
  - @atlaskit/media-card@63.3.7
  - @atlaskit/media-picker@45.0.6
  - @atlaskit/toggle@8.0.0

## 112.33.31

### Patch Changes

- [patch][0c43589d06](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c43589d06):

  fix: 🐛 ED-4920: set GapCursor selection after pasting mediaSingle in a table cell

## 112.33.30

### Patch Changes

- [patch][51fa352bef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/51fa352bef):

  ED-7275 Fix bug where inserting a new column in a merged column, add the column at the beggining.

## 112.33.29

### Patch Changes

- [patch][846f0e72ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/846f0e72ba):

  ED-7280: Editor shouldnt attempt to apply focus while it isnt editable. If our disabled flag changes to false and we have the prop shouldFocus, attempt to apply focus at this point.

## 112.33.28

### Patch Changes

- [patch][a1b3b85cf4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1b3b85cf4):

  ED-6475 Show overflow shadow when table is not selected

## 112.33.27

### Patch Changes

- [patch][7b5254402e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7b5254402e):

  ED-7268 Fix regression where table insert button is not shown when a cell is selected

## 112.33.26

### Patch Changes

- [patch][8b3bf71af7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b3bf71af7):

  ED-7274: Applying text colour over a range should only apply to text nodes

## 112.33.25

### Patch Changes

- [patch][ba223c9878](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ba223c9878):

  ED-7267: Validate URLs passing through smart links- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 112.33.24

### Patch Changes

- [patch][ee02cca952](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee02cca952):

  ED-6152: Fixes previous inline cursor regression where you couldnt type after the inline cursor

## 112.33.23

### Patch Changes

- [patch][92419b2ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92419b2ad8):

  ED-7116 Update logic for image sizing when changing layout to/from aligned

  - If an image is smaller than 50% of line length the image will preserve its original size when aligned, else it will be capped at 50% line length
  - When returning to a centred image after aligning the image will use its most recent resized size (whether that happened when aligned or when it was previously centred) or, if never resized, fall back to its original size

## 112.33.22

### Patch Changes

- [patch][2588afa0a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2588afa0a7):

  ED-6864: fix pasting tables with cells without content

## 112.33.21

### Patch Changes

- [patch][c0ba9ee289](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c0ba9ee289):

  set viewMediaClientConfig when properties change in MediaSingle node

  This fixes [ED-7269] + [FEF-8938]: issue with images not loading when the page transition from view to edit mode

## 112.33.20

### Patch Changes

- [patch][41dce81d89](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/41dce81d89):

  ED-6985 Avoid overflow when table change to a bigger layout

## 112.33.19

### Patch Changes

- [patch][00c8b76ccc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/00c8b76ccc):

  ED-7259 Fix Table Insert Menu rerender for each table change

## 112.33.18

### Patch Changes

- [patch][1ddb0c3fef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ddb0c3fef):

  ED-6152: Fix cursor alignment after emoji

## 112.33.17

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 112.33.16

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 112.33.15

### Patch Changes

- [patch][e0ebde5385](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e0ebde5385):

  ED-7257: Disable breakout for extensions in Full Width mode. Minor fixes for extension selection and spacing

## 112.33.14

### Patch Changes

- [patch][979464019f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/979464019f):

  ED-7073: fixed table clear cell not working (caused by `prosemirror-utils@0.9.3`)

## 112.33.13

### Patch Changes

- [patch][030ead1ffa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/030ead1ffa):

  ED-7262: Fix text color dropdown alignment on smaller viewports (it would appear outside the viewport)

## 112.33.12

### Patch Changes

- [patch][d0db01b410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0db01b410):

  TypeScript users of withAnalyticsEvents and withAnalyticsContext are now required to provide props as a generic type. This is so that TypeScript can correctly calculate the props and defaultProps of the returned component.

  Before:

  ```typescript
  withAnalyticsEvents()(Button) as ComponentClass<Props>;
  ```

  After:

  ```typescript
  withAnalyticsEvents<Props>()(Button);
  ```

## 112.33.11

### Patch Changes

- [patch][5ca03a3267](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ca03a3267):

  ED-7242 Use calculated offset to position table InsertButton (Use allowOutOfBound from popup)

## 112.33.10

### Patch Changes

- [patch][64868b4e0e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64868b4e0e):

  ED-7249 Fix regression where table Insert Column button doesn't hide.

## 112.33.9

- Updated dependencies [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
  - @atlaskit/button@13.0.11
  - @atlaskit/logo@12.1.1
  - @atlaskit/modal-dialog@10.0.10
  - @atlaskit/share@0.5.9
  - @atlaskit/user-picker@4.0.13
  - @atlaskit/media-picker@45.0.1
  - @atlaskit/media-test-helpers@24.3.1
  - @atlaskit/select@10.0.0

## 112.33.8

### Patch Changes

- [patch][eaebe8551f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eaebe8551f):

  Update i18n strings with latest translations.

## 112.33.7

### Patch Changes

- [patch][95c6536030](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/95c6536030):

  ED-7247 Fix regression where table insert button is not shown when hover on numbered controls.

## 112.33.6

### Patch Changes

- [patch][f37cdc770c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f37cdc770c):

  [ED-7243] Improve table decorations architecture

## 112.33.5

### Patch Changes

- [patch][66809023e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66809023e3):

  ED-7210: Fire link insertion event when exiting from floating toolbar

## 112.33.4

### Patch Changes

- [patch][e14708091e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e14708091e):

  ED-7211: Handle paste events with only an anchor tag

## 112.33.3

### Patch Changes

- [patch][5f09ffcf70](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f09ffcf70):

  ED-7097 Improve table performance, extract the DeleteButton from Table controls as a Floating element.

## 112.33.2

### Patch Changes

- [patch][4b27187d8e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b27187d8e):

  [ED-7215] Improve table performance moving the column line markers from React Component to CSS only

## 112.33.1

### Patch Changes

- [patch][fabee8bd0e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fabee8bd0e):

  ED-7238: refactor test to use EditorProps over importing mentionPlugin

## 112.33.0

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

## 112.32.0

### Minor Changes

- [minor][f60618b0f0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f60618b0f0):

  ED-5844 Adding media link UI to editor

## 112.31.2

### Patch Changes

- [patch][96bb8c8f70](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/96bb8c8f70):

  Create viewMediaClientConfig & uploadMediaClientConfig on Editor if they are missing

## 112.31.1

### Patch Changes

- [patch][428874c03b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/428874c03b):

  ED-7166: Lists can now be toggled inside panels

## 112.31.0

### Minor Changes

- [minor][e9cdfa5aed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e9cdfa5aed):

  ED-7188: Full width mode is now centre aligned.

## 112.30.0

### Minor Changes

- [minor][4a22a774a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a22a774a6):

  AUX-36 Add update support for extension handler

## 112.29.0

### Minor Changes

- [minor][e754b5f85e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e754b5f85e):

  Media Picker Dropone component is now migrated to React.

  - Previous vanilla js API:

  ```
  // instantiation
  const dropzone = await new MediaPicker('dropzone', context, pickerConfig).init();

  // subscribe to upload events
  dropzone.on('uploads-start', onUploadsStart);
  dropzone.on('upload-preview-update', onUploadPreviewUpdate);
  dropzone.on('upload-status-update', onUploadStatusUpdate);
  dropzone.on('upload-processing', onUploadProcessing);
  dropzone.on('upload-end', onUploadEnd);
  dropzone.on('upload-error', onUploadError);
  ```

  // activate/deactivate dropone
  dropzone.activate();
  dropzone.deactivate();

  // cancel ongoing upload
  dropzone.cancel(uploadId);

  // when we want to dispose the component
  dropzone.teardown();

  ```

  - New React API:

  ```

  class DropzoneConsumer extends React.Component {
  render() {
  return (
  <Dropzone
            config={config}
            context={context}
            onProcessing={onProcessing}
            onError={onError}
            onPreviewUpdate={onPreviewUpdate}
          />
  )
  }
  }

  ```

  Notes on new API:

  - old `MediaPicker` constructor does not recieve `pickerType` as first parameter anymore, since the only component left to migrate to react is `popup`.
  Meaning that if before we were doing:
  ```

  new MediaPicker('popup', context, config)

  ```
  now we will need to just do
  ```

  new MediaPicker(context, config)

  ```

  - No need to explicitly teardown the component. Unmounting the component will do the work

  - `onCancelFn` is a workaround to cancel an ongoing upload. Refer to its type definitions for more info. Before we were saving a ref and calling `ref.cancel()`.

  Basically if we render `Dropzone` component in isolation (meaning, not inside another react component), we will need to do something like:

  ```

  const saveCancelUploadFn = (cancel) => this.cancelUpload = cancel;

  ...

  <Dropzone
  onCancelFn={(cancel) => saveCancelUploadFn(cancel)}
  config={config}
  context={context}
  onProcessing={onProcessing}
  onError={onError}
  onPreviewUpdate={onPreviewUpdate}
  />

  ```

  At a later point we will just need to call `this.cancelUpload` function in that example, in order to cancel an ongoing upload if needed.
  ```

## 112.28.2

### Patch Changes

- [patch][216a679624](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/216a679624):

  ED-7212 Add cleanup to the macroProvider such that it unsubscribes on destroy

## 112.28.1

### Patch Changes

- [patch][6504d78bf2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6504d78bf2):

  [ED-7167] Improve table performance, extracting the InsertButton position logic from row & column controls to prosemirror event handles

## 112.28.0

### Minor Changes

- [minor][efb8f04952](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/efb8f04952):

  ED-5657 Add keyboard shortcuts for lists on Windows (number & bullet)

## 112.27.1

### Patch Changes

- [patch][e80e60b358](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e80e60b358):

  FM-2123: fixed double @ insertion on mention composition (Android)

## 112.27.0

### Minor Changes

- [minor][d217a12e31](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d217a12e31):

  ED-7056: Update prosemirror-utils, this enables us to replace selected nodes while inserting
  ED-6668: Adds a selected ring to all extensions

## 112.26.2

### Patch Changes

- [patch][278a1cbdae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/278a1cbdae):

  ED-7195 Change messages to sentence case instead of Title Case. Clarify wording of some quick insert messages.

## 112.26.1

### Patch Changes

- [patch][2714c80a0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2714c80a0b):

  ED-7191 Fix regression where cell popup is not place on the correct horizontal place

## 112.26.0

### Minor Changes

- [minor][143dcb8704](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/143dcb8704):

  ED-2362 Add keyboard shortcuts for headings and normal text

## 112.25.3

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/avatar@16.0.6
  - @atlaskit/avatar-group@4.0.6
  - @atlaskit/button@13.0.9
  - @atlaskit/calendar@8.0.3
  - @atlaskit/dropdown-menu@8.0.8
  - @atlaskit/droplist@9.0.8
  - @atlaskit/item@10.0.5
  - @atlaskit/modal-dialog@10.0.7
  - @atlaskit/section-message@4.0.5
  - @atlaskit/select@9.1.8
  - @atlaskit/toggle@7.0.3
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/editor-common@39.13.2
  - @atlaskit/editor-test-helpers@9.5.2
  - @atlaskit/renderer@49.4.1
  - @atlaskit/emoji@62.2.1
  - @atlaskit/mention@18.6.2
  - @atlaskit/share@0.5.4
  - @atlaskit/status@0.9.3
  - @atlaskit/task-decision@15.1.1
  - @atlaskit/user-picker@4.0.12
  - @atlaskit/media-card@63.3.1
  - @atlaskit/media-editor@36.2.1
  - @atlaskit/media-filmstrip@34.2.2
  - @atlaskit/media-picker@44.0.1
  - @atlaskit/media-test-helpers@24.1.2
  - @atlaskit/smart-card@12.2.3
  - @atlaskit/icon@19.0.0

## 112.25.2

### Patch Changes

- [patch][4c0fcec857](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4c0fcec857):

  ED-7059: fix trailing slashes for hyperlinks being removed, and smart links resolving

## 112.25.1

### Patch Changes

- [patch][5aece1fc5c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5aece1fc5c):

  [ED-7126] Improve table performance, reducing the number of re-renders on LayoutButton and FloatingContextualButton

## 112.25.0

### Minor Changes

- [minor][9f3daa0d1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f3daa0d1e):

  ED-7190 Update style of keybard shortcuts in toolbar & context menus

## 112.24.0

### Minor Changes

- [minor][b2deccb03d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b2deccb03d):

  FS-4051 Add editor prop to configure either nickName or name to use for the mention name when inserted

## 112.23.3

### Patch Changes

- [patch][3dd3d45b66](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3dd3d45b66):

  ED-7100: Ensure Breakout buttons dont use stale state when trying to change or remove breakout modes.

## 112.23.2

### Patch Changes

- [patch][53995e1bc9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/53995e1bc9):

  Use explicits imports for importing Headings Icons

## 112.23.1

### Patch Changes

- [patch][1a0451f225](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1a0451f225):

  ED-5972: Media should correctly render when pasting mixed text and images

## 112.23.0

### Minor Changes

- [minor][241a14694e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/241a14694e):

  Add RUM to renderer

## 112.22.3

### Patch Changes

- [patch][b8acca53b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8acca53b9):

  ED-6447 make heading 6 compliant with the ADG h100 styling

## 112.22.2

### Patch Changes

- [patch][f6be43668f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f6be43668f):

  ED-7159 Add i18n translations for Comment appearance Save and Cancel buttons

## 112.22.1

### Patch Changes

- [patch][a99d463b7d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a99d463b7d):

  FS-4043 - Fix @ prefix from doc being stored in mention name cache

## 112.22.0

### Minor Changes

- [minor][d6c31deacf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d6c31deacf):

  ED-6701 Upgrade prosemirror-view to 1.9.10 and prosemirror-inputrules to 1.0.4 for composition input improvements

## 112.21.1

### Patch Changes

- [patch][3511ec9566](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3511ec9566):

  [ED-7108] Fix table row & column header state syncing when applied from toolbar

## 112.21.0

### Minor Changes

- [minor][6f12bd05c7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6f12bd05c7):

  ED-6811 Added headings to the quick insert menu. Amended heading anayltics to also show previousHeadingLevel

## 112.20.0

### Minor Changes

- [minor][bb64fcedcb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb64fcedcb):

  uploadContext and viewContext fields of MediaProvider (part of Editor and Renderer props) are deprecated. New fields uploadMediaClientConfig and viewMediaClientConfig should be used from now on.

## 112.19.1

### Patch Changes

- [patch][e4943e98e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e4943e98e0):

  Fix breaking change in editorActions#getValue

## 112.19.0

### Minor Changes

- [minor][0202c1d464](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0202c1d464):

  [ED-7076] Improve table performance reducing the number of React elements on ColumnControl, moving out InsertButton component.

## 112.18.1

### Patch Changes

- [patch][5f4afa52a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f4afa52a9):

  Media Picker Browser component is now migrated to React.

  ## Previous vanilla js API:

  ```
  // instantiation
  const browser = await new MediaPicker('browser', context, pickerConfig).init();

  // subscribe to upload events
  this.mpBrowser.on('uploads-start', onUploadsStart);
  this.mpBrowser.on('upload-preview-update', onUploadPreviewUpdate);
  this.mpBrowser.on('upload-status-update', onUploadStatusUpdate);
  this.mpBrowser.on('upload-processing', onUploadProcessing);
  this.mpBrowser.on('upload-end', onUploadEnd);
  this.mpBrowser.on('upload-error', onUploadError);

  // open the native file browser
  browser.browse();

  // cancel ongoing upload
  browse.cancel(uploadId);

  // when we want to dispose the component
  browser.teardown();
  ```

  ## New React API:

  ```
  class BrowserConsumer etends React.Component {
    render() {
      return (
        <Browser
          isOpen={this.props.isOpen}
          config={config}
          context={context}
          onProcessing={onProcessing}
          onError={onError}
          onPreviewUpdate={onPreviewUpdate}
        />
      )
    }
  }
  ```

  Notes on new API:

  - No need to explicitly teardown the component. Unmounting the component will do the work
  - `onBrowseFn` and `onCancelFn` are workarounds to open the file browser and cancel an ongoing upload. Refer to its type definitions for more info.
    Before we were saving a ref and call `ref.browse()` or `ref.cancel()`.
  - In some cases you will need to provide either `onBrowserFn` or `onCancelFn` in order to open the file browser or to cancel an ongoing upload programatically.
    Typically this will be needed when this component is being rendered outside a react component, and we cannot take advantage of using `isOpen` directly.
    A good example of this can be seen in -> https://bitbucket.org/atlassian/atlaskit-mk-2/src/d7a2e4a8fb8e35b841d751f5ecccff188c955c7a/packages/editor/editor-core/src/plugins/media/index.tsx#lines-178 where `BrowserMediaPickerWrapper` is rendered.

  Basically if we render `Browser` component in isolation (meaning, not inside another react component), we will need to do something like:

  ```
  const saveOpenBrowserFunction = (browse) => this.openBrowser = browse;

  ...

  <Browser
    onBrowseFn={(browse) => saveOpenBrowserFunction(browse)}
    config={config}
    context={context}
    onProcessing={onProcessing}
    onError={onError}
    onPreviewUpdate={onPreviewUpdate}
  />
  ```

  At a later point we will just need to call `this.openBrowser` function in that example, in order to open the native File browser. Same applies to `onCancelFn`.

## 112.18.0

### Minor Changes

- [minor][e40e9ca1d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e40e9ca1d8):

  Adds basic real user metrics, e.g. time to render prosemirror, etc...

## 112.17.0

### Minor Changes

- [minor][58dd589a04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58dd589a04):

  Update TeamMentionResource to accept teamLinkResolver option which is used to construct a team link.
  Fix missing userId of user mentions in analytics in editor-core

## 112.16.2

### Patch Changes

- [patch][b229885814](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b229885814):

  ED-7125 Fix composition input within Action and Decision list items for the first word entered.

## 112.16.1

### Patch Changes

- [patch][2526630b84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2526630b84):

  ED-6405 The shortcuts in editor tooltips are now highlighted.

## 112.16.0

### Minor Changes

- [minor][86bf524679](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/86bf524679):

  ED-7117, ED-7087: Fix copy pasting smart links out of editor. Fallback to HTML anchor tag if errors occur during rendering (e.g. no provider found).

## 112.15.5

### Patch Changes

- [patch][d348e409ed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d348e409ed):

  ED-7127: Toggling between modes no longer destroys plugin states, they are maintained while accepting new plugins and re-creating nodeviews.

## 112.15.4

### Patch Changes

- [patch][0438f37f2c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0438f37f2c):

  ED-7105 Fix issue where images in full-width mode page could be a different size between the editor and renderer

## 112.15.3

- Updated dependencies [dc965edbe6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc965edbe6):
  - @atlaskit/share@0.5.0

## 112.15.2

### Patch Changes

- [patch][9459224125](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9459224125):

  ED-7104 Fix issue where h scroll would appear on page when long text was inside code snippet inside layouts in full-width mode

## 112.15.1

### Patch Changes

- [patch][7e9c4f03c9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e9c4f03c9):

  ED-7015 Fix issue where double digits were cut off in long ordered lists

## 112.15.0

### Minor Changes

- [minor][fec7d4576f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fec7d4576f):

  Bump new version of @atlaskit/mention to other AK packages to get correct i18n strings

## 112.14.1

### Patch Changes

- [patch][ca1b98b16f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca1b98b16f):

  ED-7070: Dont skip filtering nodes if a content transformer is present while getting the editors value.

## 112.14.0

### Minor Changes

- [minor][393fb6acd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/393fb6acd2):

  refactor @atlaskit/smart-card front-end: simplification. BREAKING CHANGE: Client no longer accepts configuration options as first argument; deprecated in favour of new state management layer.

## 112.13.9

- Updated dependencies [ff85c1c706](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff85c1c706):
  - @atlaskit/task-decision@15.0.4
  - @atlaskit/renderer@49.0.0

## 112.13.8

### Patch Changes

- [patch][fee6d77243](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fee6d77243):

  ED-7090 Fix issue where popups could appear off screen

  Editor popups are now positioned so that they are always contained within the parent element - this prevents them being cut off when they are too far left or right

## 112.13.7

### Patch Changes

- [patch][2ea937724b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2ea937724b):

  ED-7029 Reduce number of re-renders in floating toolbar

## 112.13.6

### Patch Changes

- [patch][32dfaf75c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/32dfaf75c8):

  ED-7092: Fixes types inside gap cursor that assumed elements always existed, handle these cases better.

## 112.13.5

### Patch Changes

- [patch][1740216342](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1740216342):

  ED-6999 Fix issue where horizontal scroll would appear when large media items were inside layouts in full-width mode

## 112.13.4

### Patch Changes

- [patch][8a45ef38a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a45ef38a9):

  Update i18n strings with latest translations.

## 112.13.3

### Patch Changes

- [patch][8ed2b257d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8ed2b257d0):

  ED-7085: Fixes duplicate dropzone in full width mode. When the editor is reconfigured ensure that all pickers are destroyed.

## 112.13.2

### Patch Changes

- [patch][ec0197518f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec0197518f):

  Fix incorrect date import path

## 112.13.1

### Patch Changes

- [patch][2a7ae6c5c9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2a7ae6c5c9):

  ED-6968 Clicking numbered columns does nothing if table is not selecte

## 112.13.0

### Minor Changes

- [minor][16875546e9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/16875546e9):

  Add support to resolving mention names externally for collaborative editing

### Patch Changes

- [patch][a8d95a6f8d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a8d95a6f8d):

  - remove mention text if CollabEditOptions.sanitizePrivateContent is true during copy/paste

## 112.12.5

### Patch Changes

- [patch][0c438f1b71](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c438f1b71):

  ED-7081: Fixes floating toolbars not displaying when switching to Full Width mode.

## 112.12.4

### Patch Changes

- [patch][d036b887d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d036b887d6):

  ED-7060: Fix console error when adding hyperlink and show empty text in toolbar when hyperlink text is not set

## 112.12.3

### Patch Changes

- [patch][45e08e8e11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/45e08e8e11):

  ED-6996: Move initialised state to collab plugin state instead of inline variables

## 112.12.2

### Patch Changes

- [patch][f75e638261](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f75e638261):

  ED-6982: Fix auto conversion of code mark to not apply marks to non text nodes.

## 112.12.1

### Patch Changes

- [patch][cf6efdbfa8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cf6efdbfa8):

  ED-7023: removed mouseMove and mouseLeave handlers from columns resizing plugin

## 112.12.0

### Minor Changes

- [minor][11a8112851](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11a8112851):

  ED-6991 Fire analytics event for renderer started

  Set up analytics v3 in renderer

## 112.11.21

- Updated dependencies [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/avatar@16.0.4
  - @atlaskit/avatar-group@4.0.4
  - @atlaskit/dropdown-menu@8.0.5
  - @atlaskit/droplist@9.0.5
  - @atlaskit/icon@18.0.1
  - @atlaskit/item@10.0.3
  - @atlaskit/select@9.1.6
  - @atlaskit/emoji@62.1.7
  - @atlaskit/mention@18.3.2
  - @atlaskit/media-editor@36.1.2
  - @atlaskit/tooltip@15.0.0

## 112.11.20

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/avatar@16.0.3
  - @atlaskit/avatar-group@4.0.3
  - @atlaskit/button@13.0.8
  - @atlaskit/calendar@8.0.1
  - @atlaskit/dropdown-menu@8.0.4
  - @atlaskit/droplist@9.0.4
  - @atlaskit/item@10.0.2
  - @atlaskit/modal-dialog@10.0.4
  - @atlaskit/section-message@4.0.2
  - @atlaskit/select@9.1.5
  - @atlaskit/toggle@7.0.1
  - @atlaskit/tooltip@14.0.3
  - @atlaskit/editor-common@39.7.2
  - @atlaskit/editor-test-helpers@9.3.9
  - @atlaskit/renderer@48.7.3
  - @atlaskit/emoji@62.1.6
  - @atlaskit/mention@18.3.1
  - @atlaskit/status@0.9.2
  - @atlaskit/task-decision@15.0.3
  - @atlaskit/media-card@63.1.5
  - @atlaskit/media-editor@36.1.1
  - @atlaskit/media-filmstrip@34.2.1
  - @atlaskit/media-picker@43.1.1
  - @atlaskit/media-test-helpers@24.0.3
  - @atlaskit/smart-card@11.1.6
  - @atlaskit/icon@18.0.0

## 112.11.19

### Patch Changes

- [patch][8cfa40f406](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8cfa40f406):

  ED-6990 Fix wrapping of dates nodes in tables, panels and other nodes. Previously they would run-on and overflow from their container.

## 112.11.18

### Patch Changes

- [patch][29c90d3e9f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29c90d3e9f):

  ED-7042 Fix issue where table row controls were slightly cut off in full-width mode

## 112.11.17

### Patch Changes

- [patch][4541cc112c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4541cc112c):

  Making textarea devDep a caret range

## 112.11.16

### Patch Changes

- [patch][8d54773dea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d54773dea):

  Remove meridian time in parseInputValue in TimePicker

## 112.11.15

### Patch Changes

- [patch][b6428ea8bb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b6428ea8bb):

  ED-6996: Ensure listeners for the collab plugin are removed at the correct time, not all the time.

## 112.11.14

### Patch Changes

- [patch][e2c4d19e7a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e2c4d19e7a):

  ED-6998: fix inserting emoji after changing between full width mode

## 112.11.13

### Patch Changes

- [patch][9503b9d220](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9503b9d220):

  Bump prosemirror table to latest version where performance improvement applies, related to celsInRect helper

## 112.11.12

### Patch Changes

- [patch][a726d9fff4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a726d9fff4):

  ED-6049: Fix regression in tables when resizing is off

## 112.11.11

### Patch Changes

- [patch][9886f4afa1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9886f4afa1):

  - [ED-7017] Improve table performance removing cellView from table

## 112.11.10

### Patch Changes

- [patch][349c4354c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/349c4354c6):

  ED-6999 Fix issues where horizontal scroll bar could appear on page in full-width mode when using tables or code blocks

## 112.11.9

### Patch Changes

- [patch][65dbd23b3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65dbd23b3c):

  - ED-6996: Memoise calling initialise on the collab plugin, this will prevent race conditions when toggling between full width mode and full page quickly.

## 112.11.8

### Patch Changes

- [patch][7ac7d494de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ac7d494de):

  - ED-6995 Scale down tables created in full-width mode correctly

## 112.11.7

### Patch Changes

- [patch][9631b66aa0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9631b66aa0):

  - ED-6997: When transitioning between modes (Full Width -> Full Page) while having a selection over React nodes, ProseMirror will try to re-apply the selection during the view update to detached nodes that are no longer rendered.

  Now before we apply an update we remove focus from the editor to avoid ProseMirror trying to apply any sort of selection.

## 112.11.6

### Patch Changes

- [patch][28cd9ab082](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/28cd9ab082):

  - ED-7019 Fix Scroll Gutter Plugin to only be added in full-page appearance

## 112.11.5

### Patch Changes

- [patch][936c9775ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/936c9775ca):

  - [ED-7012] Move header column/row state to pluginState to avoid duplicate logic and increase performance

## 112.11.4

- [patch][c59bd5d01e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c59bd5d01e):

  ED-6349: fix external images (often via copy paste) not having correct dimensions

## 112.11.3

- [patch][b567c44b93](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b567c44b93):

  ED-6986: put cursor after smart link insertion if skipping macro

## 112.11.2

- [patch][d7aa377982](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7aa377982):

  - ED-6958: fix navigating using arrow keys around images in comment editors

  Specifically, the "gap cursor" on the right hand side of images in the comment editor would appear floating oddly on the left hand side.

  This patch puts it correctly on the right hand side.

## 112.11.1

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 112.11.0

- [patch][a67181ef07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a67181ef07):

  ED-6293: Fixes copy pasting a media group file card into the Editor

- [minor][08d79c58e7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/08d79c58e7):

  ED-6748: add inviteToEditComponent to allow custom React components in collab share

- [minor][9cbd059bfa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cbd059bfa):

  - Put `media-editor` into separate editor plugin, update `@atlaskit/media-editor` API

  ### Breaking change for `@atlaskit/media-editor`

  - Make `onUploadStart`, `onFinish` optional
  - Add new `onClose` callback for when the user closes the dialog (escape, cancel, error)
  - `onFinish` now only called when the upload itself finishes, not overloaded for other purposes

    - now also passes the `FileIdentifier` of the completed upload

  ### Editor changes

  Adds a new `media-editor` plugin that is enabled if the media plugin is enabled and `allowAnnotation` is enabled on the `media` prop.

  This replaces the implementation inside the existing `media` plugin. The new `media-editor` plugin is _not_ dependent on the `media` plugin.

- [minor][58e3a9a2e1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58e3a9a2e1):

  - [ED-6305] Adds mass formatting on selected cells in a table

- Updated dependencies [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
- Updated dependencies [06c5cccf9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c5cccf9d):
- Updated dependencies [9ecfef12ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ecfef12ac):
- Updated dependencies [97bfe81ec8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97bfe81ec8):
  - @atlaskit/button@13.0.4
  - @atlaskit/droplist@9.0.2
  - @atlaskit/select@9.1.2
  - @atlaskit/emoji@62.1.4
  - @atlaskit/task-decision@15.0.1
  - @atlaskit/media-card@63.1.0
  - @atlaskit/media-editor@36.0.0
  - @atlaskit/media-picker@43.0.2
  - @atlaskit/spinner@12.0.0
  - @atlaskit/icon@17.1.2
  - @atlaskit/modal-dialog@10.0.0
  - @atlaskit/editor-test-helpers@9.3.4
  - @atlaskit/renderer@48.7.0
  - @atlaskit/media-core@30.0.3
  - @atlaskit/media-filmstrip@34.1.2
  - @atlaskit/media-test-helpers@24.0.0
  - @atlaskit/docs@8.1.0
  - @atlaskit/avatar-group@4.0.2
  - @atlaskit/logo@12.0.1
  - @atlaskit/section-message@4.0.1
  - @atlaskit/code@11.0.0

## 112.10.10

- [patch][7318619da7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7318619da7):

  - Revert [ED-5734] to reduce memory leak caused by getBoundingClientRect

## 112.10.9

- [patch][1a1ea182d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1a1ea182d6):

  - Fix an infinite loop in typeahead plugin

## 112.10.8

- Updated dependencies [ed41cac6ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed41cac6ac):
  - @atlaskit/dropdown-menu@8.0.2
  - @atlaskit/item@10.0.1
  - @atlaskit/theme@9.0.3
  - @atlaskit/mention@18.2.1
  - @atlaskit/pubsub@5.0.1
  - @atlaskit/status@0.9.1
  - @atlaskit/lozenge@9.0.0

## 112.10.7

- Updated dependencies [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/avatar@16.0.2
  - @atlaskit/icon@17.1.1
  - @atlaskit/theme@9.0.2
  - @atlaskit/emoji@62.1.1
  - @atlaskit/section-message@4.0.0

## 112.10.6

- [patch][7eca61edf0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7eca61edf0):

  - ED-6965: bump prosemirror-utils to allow safeInsert replacing selected nodes when it conforms to schema

## 112.10.5

- [patch][7ce86bae14](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ce86bae14):

  - Shift selection for rows and columns

## 112.10.4

- [patch][ca1f019d62](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca1f019d62):

  - ED-6976: fix recovering from overflow when table has number column and all columns are selected

## 112.10.3

- [patch][f823890888](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f823890888):

  - ED-6970: Fix backspacing inside a layout removing all content.

## 112.10.2

- [patch][54b40d9757](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/54b40d9757):

  - ED-6832 Refactor ReactMediaSingleNodeView to remove usage of media plugin state private methods.

## 112.10.1

- [patch][f3334a7083](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f3334a7083):

  - ED-6918: fix deleting table rows inside bodied extensions

## 112.10.0

- [minor][21f5217343](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21f5217343):

  - consume emoji new entrypoints in AK

## 112.9.1

- [patch][56356b17a3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/56356b17a3):

  - ED-6880: added even column widths on resize handle double-click and bulk resizing of columns

## 112.9.0

- [minor][4969df0716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4969df0716):

  - fix lazy rendering bugs in Smart Links.

## 112.8.1

- [patch][5973916c23](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5973916c23):

  - [ED-6344] Remove scrollbar overlap from the last table row

## 112.8.0

- [minor][7089d49f61](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7089d49f61):

  - consume the new mention entrypoints

## 112.7.0

- [minor][f120090dfe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f120090dfe):

  - Add GASv3 analytics to Emoji TypeAhead.

## 112.6.0

- [minor][9a1b2075e8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a1b2075e8):

  - consume new Status entrypoints

## 112.5.2

- [patch][6a65053272](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6a65053272):

  - ED-6929: avoid having a negative rowspan after merging cells

## 112.5.1

- [patch][a511611473](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a511611473):

  - ED-6808: Fix issue where toggling the same mark but different attributes would just remove the mark.

## 112.5.0

- [minor][9be684e931](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9be684e931):

  - ED-5782 Replace text-color button with more easily identifiable A icon with colored bar.

## 112.4.0

- [minor][d9f8b4d43d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d9f8b4d43d):

  - [ED-5505] Apply strong mark by default on table headers

## 112.3.1

- Updated dependencies [4b07b57640](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b07b57640):
  - @atlaskit/button@13.0.2
  - @atlaskit/icon@17.0.2
  - @atlaskit/select@9.1.1
  - @atlaskit/logo@12.0.0

## 112.3.0

- [minor][f53003a5ed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f53003a5ed):

  - ED-6741 Add 'appearance' to all editor analytics events

## 112.2.10

- [patch][051800806c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/051800806c):

  -

  - MediaPicker Clipboard component is now a React Component

  These changes provide a new React api for Clipboard component. First one to be delivered, coming next we are going to ship Browser, Dropzone and Popup.

  Previous plain javascript API usage:

  ```typescript
  // instanciate MediaPicker clipboard
  const clipboardMediaPicker = await new MediaPicker(
    'clipboard'
    context,
    config,
  );

  // usage
  clipboardMediaPicker.on('uploads-start', onUploadsStart);
  clipboardMediaPicker.on('upload-preview-update', onUploadPreviewUpdate);
  clipboardMediaPicker.on('upload-status-update', onUploadStatusUpdate);
  clipboardMediaPicker.on('upload-processing', onUploadProcessing);
  clipboardMediaPicker.on('upload-end', onUploadEnd);
  clipboardMediaPicker.on('upload-error', onUploadError);

  // activation / deactivation programatically
  clipboardMediaPicker.activate();
  clipboardMediaPicker.deactivate();
  ```

  With the new React API we benefit from:

  - No need to programatically activate/deactivate. We will just render the Clipboard component or not.
  - Event handlers are provided by react props
  - We don't need to use a MediaPicker constructor and specifiy which flavour we want (in this case 'clipboard'). We can basically `import { Clipboard } from '@atlaskit/media-picker'` directly and use it right away.

  Example of new API:

  ```typescript
  import { Clipboard } from '@atlaskit/media-picker';

  <Clipboard
    context={context}
    config={config}
    onError={handleUploadError}
    onPreviewUpdate={handleUploadPreviewUpdate}
    onProcessing={handleReady}
  />;
  ```

  This is the first component we migrate fully and integrates seamlessly with the Editor. Follow up on this ticket to see what will be the next steps on this new API:
  https://product-fabric.atlassian.net/browse/MS-1942

## 112.2.9

- [patch][be2df0f8e7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/be2df0f8e7):

  - ED-6833: improve columns scaling by preventing table from going to overflow state

## 112.2.8

- [patch][ab278c83e1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab278c83e1):

  - Fix issue where multiple layouts in a document copy attributes from one another in an appendTransaction.

## 112.2.7

- [patch][ed02efdb94](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed02efdb94):

  - [ED-6817] Extract the current toggleHeader logic to prosemirror-table 0.8.0

## 112.2.6

- [patch][8bdff125fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8bdff125fb):

  - ED-6818 Scroll cursor into view after pasting rich text or text inside a code block

## 112.2.5

- [patch][85328a0d76](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85328a0d76):

  - ED-6466: (ED-6599) fix undo with cmd+z after scaling table columns by applying new widths to cells in one go

## 112.2.4

- [patch][12aa76d5b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12aa76d5b5):

  - ED-6814: fixed rendering mediaSingle without collection

## 112.2.3

- [patch][5fd9727f51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5fd9727f51):

  - Remove duplicate isEmptyNode function from same code path, to prevent compilation errors

## 112.2.2

- [patch][dc5b953c49](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc5b953c49):

  - Fix issue where attempting to fix layouts would reference a stale layout type

## 112.2.1

- [patch][3c1c5165b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c1c5165b3):

  - ED-6815: fix resizing images to line length (100% width) after fix for ED-6467

## 112.2.0

- [minor][79f0ef0601](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79f0ef0601):

  - Use strict tsconfig to compile editor packages

## 112.1.1

- [patch][ad5128f63c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ad5128f63c):

  - ED-5844 Refactor media floating toolbar into little pieces

## 112.1.0

- [minor][0ed8ea77ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ed8ea77ab):

  - ED-6049: New hyperlink experience, add text to display in the toolbar, refer spec in the ticket

## 112.0.3

- [patch][74b05d57c4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/74b05d57c4):

  - Fix slowness after "fix regression where multiple cell context menu dropdowns would appear when adding rows"

## 112.0.2

- [patch][1f276f95d4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1f276f95d4):

  - ED-6871 Remove unused duplicate functions from table commands

## 112.0.1

- [patch][5ad66b6d1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ad66b6d1a):

  - [ED-6860] Revert prosemirror-view 1.8.9 bumps, this version was making the cursor typing slowly. this version is recreating all plugins when we use `EditorView.setProps`

## 112.0.0

- [major][5e4ff01e4c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e4ff01e4c):

  - Fix typeahead re-rendering when moving mouse

  Breaking change -> TypeAheadItem:

  ```ts
  export type TypeAheadItemRenderProps = {
    onClick: () => void;

    // BREAKING CHANGE
    // onMouseMove -> onHover
    onHover: () => void;

    isSelected: boolean;
  };

  export type TypeAheadItem = {
    /*...*/
    render?: (
      props: TypeAheadItemRenderProps,
    ) => React.ReactElement<TypeAheadItemRenderProps> | null;
    /*...*/
  };
  ```

  Items returned from `QuickInsertProvider#getItems` method that have custom `render` function will now get `onHover` instead of `onMouseMove`.

## 111.1.4

- [patch][c5b70ffbdb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c5b70ffbdb):

  - fix regression where multiple cell context menu dropdowns would appear when adding rows

## 111.1.3

- [patch][897c83c32a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/897c83c32a):

  - ED-6849: Prevent the collab plugin from re-initing on a reconfigure, also maintains previous state when reconfiguring

## 111.1.2

- [patch][6a52b3d258](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6a52b3d258):

  - fix for clicking behaviour in view/edit mode for Inline Smart Links.

## 111.1.1

- [patch][287036e319](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/287036e319):

  - ED-6765: workaround for mediaSingle deletion on Android

## 111.1.0

- [minor][9626153146](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9626153146):

  - ED-6564: improve typing performance, especially in tables

  Be more selective about when to re-render certain nodes. In particular, only re-render table cells when selecting in/out of them, or their contents change. This applies to:

  - tables
  - images
  - emojis
  - mentions
  - tasks and decisions

  Also prevents a number of plugins from notifying about status changes when nothing has changed. In particular:

  - breakout
  - emoji
  - hyperlink
  - table

## 111.0.6

- [patch][1c88068498](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c88068498):

  - Fix re-rendering FullPage appearance on every scroll

## 111.0.5

- [patch][2b85ca535a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b85ca535a):

  - ED-6828: fix smart link selection inside lists

## 111.0.4

- [patch][a3264821d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3264821d0):

  - ED-6129 Refactor table plugin state to use pluginFactory

## 111.0.3

- [patch][519046cd9b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/519046cd9b):

  - ED-6789: improve table column stacking when resizing columns to the right by going to overflown state only when all resized columns are minWidths

## 111.0.2

- Updated dependencies [ed3f034232](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed3f034232):
  - @atlaskit/editor-test-helpers@9.1.3
  - @atlaskit/renderer@48.1.1
  - @atlaskit/media-card@63.0.2
  - @atlaskit/media-core@30.0.1
  - @atlaskit/media-editor@35.0.1
  - @atlaskit/media-filmstrip@34.1.1
  - @atlaskit/media-picker@42.0.1
  - @atlaskit/media-test-helpers@23.0.0

## 111.0.1

- [patch][58948126ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58948126ef):

  - ED-6073: fix cursor selection and prevent jumping around inline smart links

## 111.0.0

- [major][154372926b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/154372926b):

  - Remove insertFileFromDataUrl action

  If you want to upload a dataUrl to media, you should instead use **context.file.upload** from **@atlaskit/media-core**

  ```typescript
  import { ContextFactory } from '@atlaskit/media-core';

  const mediaContext = ContextFactory.create();

  mediaContext.file.upload({
    content: 'some-external-url',
    name: 'some-file-name.png',
    collection: 'destination-collection',
  });
  ```

  For more info check `atlaskit-mk-2/packages/media/media-client/src/client/file-fetcher.ts`

- Updated dependencies [59cce82fd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59cce82fd1):
  - @atlaskit/media-test-helpers@22.0.1
  - @atlaskit/media-picker@42.0.0

## 110.4.0

- [minor][a8e3fc91ae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a8e3fc91ae):

  - Remove react from panel node view

## 110.3.6

- [patch][72fc33f8e7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72fc33f8e7):

  - FS-3243 - Refactor status plugin to use new architecture

## 110.3.5

- [patch][284e2d0b0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/284e2d0b0b):

  - ED-6841 Fix inconsistent integration tests for inline card and table layout

## 110.3.4

- [patch][d1741c1f40](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d1741c1f40):

  - ED-6788: refactor columns resize actions to commands

## 110.3.3

- [patch][d9eccd861e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d9eccd861e):

  - ED-6804: pasting URLs with spaces properly convert to smart links

## 110.3.2

- [patch][47273cabd4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/47273cabd4):

  - ED-6803: Added bridge.clearContent() method for Android

## 110.3.1

- [patch][7890fa64fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7890fa64fc):

  - ED-6723 Fix code block to be indented, if it's created using auto formating.

## 110.3.0

- [minor][652ef1e6be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/652ef1e6be):

  - ED-6774: Adds a FF to priortize smart links resolution over Jira Issue Macro

## 110.2.0

- [minor][5a49043dac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5a49043dac):

  - Enable strictPropertyInitialization in tsconfig.base

## 110.1.1

- [patch][6614c81995](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6614c81995):

  - ED-6792: refactor column resizing classes to helper functions

## 110.1.0

- [minor][85d8a0831b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85d8a0831b):

  - ED-6725 Add new "Three columns with sidebars" layout

## 110.0.3

- [patch][80cf1c1e82](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80cf1c1e82):

  - [ED-6654] Update prosemirror-view to 1.8.9 that fixes a few issues with mouse selections on prosemirror like click on table and the controls doesn't show up

## 110.0.2

- [patch][e88b52e27c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e88b52e27c):

  - ED-6130 Refactor table actions

## 110.0.1

- [patch][52846a2537](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/52846a2537):

  - ED-6633 Fix issue with size of table controls in new sidebar layouts

## 110.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

- Updated dependencies [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - @atlaskit/adf-utils@6.0.5
  - @atlaskit/editor-markdown-transformer@3.0.6
  - @atlaskit/analytics-gas-types@4.0.4
  - @atlaskit/util-service-support@4.0.3
  - @atlaskit/adf-schema@2.5.5
  - @atlaskit/editor-common@39.0.0
  - @atlaskit/renderer@48.0.0
  - @atlaskit/emoji@62.0.0
  - @atlaskit/media-card@63.0.0
  - @atlaskit/media-editor@35.0.0
  - @atlaskit/media-filmstrip@34.0.0
  - @atlaskit/media-picker@41.0.0
  - @atlaskit/docs@8.0.0
  - @atlaskit/visual-regression@0.1.0
  - @atlaskit/analytics-next@5.0.0
  - @atlaskit/avatar-group@4.0.0
  - @atlaskit/avatar@16.0.0
  - @atlaskit/button@13.0.0
  - @atlaskit/calendar@8.0.0
  - @atlaskit/code@10.0.0
  - @atlaskit/dropdown-menu@8.0.0
  - @atlaskit/droplist@9.0.0
  - @atlaskit/icon@17.0.0
  - @atlaskit/item@10.0.0
  - @atlaskit/logo@11.0.0
  - @atlaskit/lozenge@8.0.0
  - @atlaskit/modal-dialog@9.0.0
  - @atlaskit/section-message@3.0.0
  - @atlaskit/select@9.0.0
  - @atlaskit/spinner@11.0.0
  - @atlaskit/textarea@2.0.0
  - @atlaskit/theme@9.0.0
  - @atlaskit/toggle@7.0.0
  - @atlaskit/tooltip@14.0.0
  - @atlaskit/width-detector@2.0.0
  - @atlaskit/editor-bitbucket-transformer@6.0.0
  - @atlaskit/editor-json-transformer@6.0.0
  - @atlaskit/editor-test-helpers@9.0.0
  - @atlaskit/analytics-listeners@6.0.0
  - @atlaskit/analytics-namespaced-context@4.0.0
  - @atlaskit/date@0.7.0
  - @atlaskit/mention@18.0.0
  - @atlaskit/pubsub@5.0.0
  - @atlaskit/status@0.9.0
  - @atlaskit/task-decision@15.0.0
  - @atlaskit/util-data-test@12.0.0
  - @atlaskit/media-core@30.0.0
  - @atlaskit/media-test-helpers@22.0.0
  - @atlaskit/smart-card@11.0.0

## 109.0.0

- Updated dependencies [a1192ef860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1192ef860):
  - @atlaskit/editor-common@38.0.0
  - @atlaskit/renderer@47.0.0
  - @atlaskit/emoji@61.0.0
  - @atlaskit/media-card@62.0.0
  - @atlaskit/media-editor@34.0.0
  - @atlaskit/media-filmstrip@33.0.0
  - @atlaskit/media-picker@40.0.0
  - @atlaskit/editor-bitbucket-transformer@5.0.5
  - @atlaskit/editor-json-transformer@5.0.4
  - @atlaskit/editor-markdown-transformer@3.0.5
  - @atlaskit/editor-test-helpers@8.0.8
  - @atlaskit/task-decision@14.0.9
  - @atlaskit/util-data-test@11.1.9
  - @atlaskit/media-test-helpers@21.4.0
  - @atlaskit/media-core@29.3.0

## 108.0.4

- [patch][cc47b65340](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc47b65340):

  - ED-6738: Table scaling is now less aggressive, we will only attempt to 'scale to fix' when neccessary.

## 108.0.3

- [patch][553c7e4fed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/553c7e4fed):

  - ED-6779: Update CollabProvider types to cater for removing event listeners.

## 108.0.2

- [patch][55925d8946](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/55925d8946):

  - Fix flickering in media annotation modal

## 108.0.1

- [patch][312076749f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/312076749f):

  - [ED-6784] Fixes resize bar position when the mouse comes from a paragraph

## 108.0.0

- Updated dependencies [e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):
  - @atlaskit/editor-common@37.0.0
  - @atlaskit/renderer@46.0.0
  - @atlaskit/emoji@60.0.0
  - @atlaskit/media-card@61.0.0
  - @atlaskit/media-editor@33.0.0
  - @atlaskit/media-filmstrip@32.0.0
  - @atlaskit/media-picker@39.0.0
  - @atlaskit/editor-bitbucket-transformer@5.0.4
  - @atlaskit/editor-json-transformer@5.0.3
  - @atlaskit/editor-markdown-transformer@3.0.4
  - @atlaskit/editor-test-helpers@8.0.7
  - @atlaskit/task-decision@14.0.8
  - @atlaskit/util-data-test@11.1.8
  - @atlaskit/media-test-helpers@21.3.0
  - @atlaskit/media-core@29.2.0

## 107.24.4

- [patch][5bebbeb98e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5bebbeb98e):

  - [ED-6367] Fixes table header row toggle when there is cells with column span, preventing it from being adding new cells wrongly

## 107.24.3

- [patch][a6fb248987](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6fb248987):

  - ED-6639 Align lists styles between editor & renderer

## 107.24.2

- [patch][1e37f1bfc2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e37f1bfc2):

  - ED-6535: fix fallback for images without dimensions on upload

## 107.24.1

- [patch][a2e9e69a6a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2e9e69a6a):

  - ED-6745 Fix and prevent bad floating bar configuration

## 107.24.0

- [minor][6ab657abdc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ab657abdc):

  - ED-6644 Fire analytics event when full-width mode changes

## 107.23.1

- [patch][86975facf8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/86975facf8):

  - ED-6664 Fix i18n messages generation, replacing all const enum to just enums inside editor-core

## 107.23.0

- [minor][69d92c210f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69d92c210f):

  - ED-6582 Add Analytcs GAS V3 for insert SmartLinks

## 107.22.2

- Updated dependencies [87f0209201](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87f0209201):
- Updated dependencies [dd95622388](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd95622388):
  - @atlaskit/editor-common@36.2.1
  - @atlaskit/width-detector@1.0.0
  - @atlaskit/smart-card@10.4.2
  - @atlaskit/textarea@1.0.0

## 107.22.1

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

- [patch][0ac39bd2dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ac39bd2dd):

  - Bump tslib to 1.9

## 107.22.0

- [minor][229cb05e26](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/229cb05e26):

  - ED-6722 Rename 'Columns' to 'Layouts' in toolbar and quick insert menu

## 107.21.1

- Updated dependencies [cd67ae87f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cd67ae87f8):
  - @atlaskit/textarea@0.4.5

## 107.21.0

- [minor][f005175d25](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f005175d25):

  - ED-6710: Replace UNSAFE_fullWidthMode with full-width appearance to match renderer API

## 107.20.0

- [minor][ce8ac59383](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce8ac59383):

  - ED-6635: You can now resize media inside columns

## 107.19.0

- [minor][ee71c90037](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee71c90037):

  - ED-6601: When toggling between Full Width appearance and Full Page appearance, resized tables now scale their sizes accordingly.

## 107.18.0

- [minor][272b64139f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/272b64139f):

  - ED-5108 Adding padding in the bottom of full page editor appearance

## 107.17.1

- [patch][16290b0448](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/16290b0448):

  - ED-6715 Fix issue with gap cursor + breakout + full-width mode where editor would crash

## 107.17.0

- [minor][d6886fe651](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d6886fe651):

  - ED-6649 Add analytics events for layout toolbar buttons - changing layouts and deleting layouts

- [patch][77936321cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/77936321cd):

  - [ED-4898] Fixes the Backspace event for empty codeBlocks when triggered from inside of tables or columns

## 107.16.0

- [minor][5d9455978b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5d9455978b):

  - ED-5292: add support for custom autoformatting

  You can now use the `customAutoformatting` prop to provide a custom autoformatting handler that replaces on particular regex strings.

  See (Editor RFC 131: Injectable auto-formatting rules, AutoformattingProvider)[https://product-fabric.atlassian.net/wiki/spaces/E/pages/881141566/Editor+RFC+131+Injectable+auto-formatting+rules+AutoformattingProvider] for more details on how this works.

  An example provider `autoformattingProvider` that is used in the storybook example is exported from the `@atlaskit/editor-test-helpers` package. Try typing ED-123.

  A simplified provider might look like:

      export const autoformattingProvider: AutoformattingProvider = {
        getRules: () =>
          Promise.resolve({
            '[Ee][Dd]-(\\d+)': (match: string[]): Promise<ADFEntity> => {
              const ticketNumber = match[1];
              return new Promise.resolve({
                type: 'inlineCard',
                attrs: {
                  url: 'https://www.atlassian.com/',
                },
              });
            },
          }),
      };

  At the moment, only text or `inlineCard` nodes are permitted to be replaced.

## 107.15.1

- [patch][9210783b0e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9210783b0e):

  - [ED-6432] Fix remove table after cut event happen on the entire table

## 107.15.0

- [minor][af359aa8d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af359aa8d1):

  - ED-6602: Disable breakout for full width mode

## 107.14.0

- [minor][799b7daf70](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/799b7daf70):

  - ED-6600: Adding full-width mode to media

## 107.13.4

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/avatar@15.0.4
  - @atlaskit/avatar-group@3.0.4
  - @atlaskit/button@12.0.3
  - @atlaskit/calendar@7.0.22
  - @atlaskit/code@9.0.1
  - @atlaskit/dropdown-menu@7.0.6
  - @atlaskit/droplist@8.0.5
  - @atlaskit/icon@16.0.9
  - @atlaskit/item@9.0.1
  - @atlaskit/logo@10.0.4
  - @atlaskit/lozenge@7.0.2
  - @atlaskit/modal-dialog@8.0.7
  - @atlaskit/section-message@2.0.3
  - @atlaskit/select@8.1.1
  - @atlaskit/spinner@10.0.7
  - @atlaskit/textarea@0.4.4
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/editor-common@36.1.12
  - @atlaskit/renderer@45.6.1
  - @atlaskit/date@0.6.4
  - @atlaskit/emoji@59.2.3
  - @atlaskit/mention@17.6.7
  - @atlaskit/pubsub@4.0.4
  - @atlaskit/status@0.8.3
  - @atlaskit/task-decision@14.0.5
  - @atlaskit/media-card@60.0.3
  - @atlaskit/media-editor@32.0.6
  - @atlaskit/media-filmstrip@31.0.4
  - @atlaskit/media-picker@38.1.6
  - @atlaskit/smart-card@10.2.4
  - @atlaskit/theme@8.1.7

## 107.13.3

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next supplied from itself.

## 107.13.2

- [patch][8e86c7c9d4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8e86c7c9d4):

  - Use isImagePreview util to know if file is an image or not

## 107.13.1

- [patch][351e23aeb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/351e23aeb5):

  - ED-6102: fixed inline node deletion on Android

## 107.13.0

- [minor][a16ea57a8c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a16ea57a8c):

  - ED-6623 Add new layout options "Left Sidebar" and "Right Sidebar" in addition to current layouts "Two Columns" and "Three Columns"

  To get access to the new layouts, configure the `allowLayouts` prop eg. `allowLayouts={ allowBreakout: true, UNSAFE_addSidebarLayouts: true }`

## 107.12.7

- Updated dependencies [cf018d7630](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cf018d7630):
  - @atlaskit/textarea@0.4.2

## 107.12.6

- [patch][6695367885](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6695367885):

  - Revert emoji refactor

## 107.12.5

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/avatar@15.0.3
  - @atlaskit/avatar-group@3.0.3
  - @atlaskit/calendar@7.0.21
  - @atlaskit/dropdown-menu@7.0.4
  - @atlaskit/droplist@8.0.3
  - @atlaskit/icon@16.0.8
  - @atlaskit/logo@10.0.3
  - @atlaskit/modal-dialog@8.0.6
  - @atlaskit/section-message@2.0.2
  - @atlaskit/select@8.0.5
  - @atlaskit/spinner@10.0.5
  - @atlaskit/textarea@0.4.1
  - @atlaskit/theme@8.1.6
  - @atlaskit/tooltip@13.0.3
  - @atlaskit/renderer@45.4.3
  - @atlaskit/analytics-listeners@5.0.3
  - @atlaskit/emoji@59.2.1
  - @atlaskit/pubsub@4.0.3
  - @atlaskit/task-decision@14.0.3
  - @atlaskit/media-card@60.0.1
  - @atlaskit/media-core@29.1.4
  - @atlaskit/media-editor@32.0.5
  - @atlaskit/media-filmstrip@31.0.3
  - @atlaskit/media-picker@38.1.4
  - @atlaskit/smart-card@10.2.2
  - @atlaskit/button@12.0.0

## 107.12.4

- [patch][068ecc926f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/068ecc926f):

  - Reverting column resize fix from ED-6627

## 107.12.3

- [patch][247cc39577](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/247cc39577):

  - ED-2152 Remove any selection when pressing ` and completing inlinecode

## 107.12.2

- [patch][24612aced0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24612aced0):

  - [ED-6467] Fixes alignments (left and right) for images, making them keep on the half of lineLength

## 107.12.1

- [patch][098e5197b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/098e5197b6):

  - ED-6197 Provide fallback for image resizing snapTo. Set media resizing to be based on bounding box instead of chained parent offsets.

## 107.12.0

- [minor][049ff62abf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/049ff62abf):

  - ED-6624: Add layout button to main toolbar

## 107.11.0

- [minor][b81d427d5c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b81d427d5c):

  - ED-5373: Refactor emoji plugin to use new type ahead

## 107.10.2

- [patch][55e47676aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/55e47676aa):

  - revert update status code splits in Renderer/Editor which causes component dist to be broken

## 107.10.1

- [patch][64dd2ab46f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64dd2ab46f):

  - ED-6558 Fix clicking to set the cursor placement after an inline node that's at the end of a line. Set the default style attribute of Status nodes to be empty instead of 'null'.

## 107.10.0

- [minor][969915d261](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/969915d261):

  - update status import entrypoints in Renderer/editor

## 107.9.6

- [patch][0ff405bd0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ff405bd0f):

  - Removed CardView and CardViewLoader from public APIs and replaced it with light-weight and stateless CardLoading and CardError components. Handling of external images is now done by Card component itself using ExternalImageIdentifier interface.

  If you’ve been using CardView for loading:

  ```js
  <CardView status="loading" mediaItemType="file" dimensions={cardDimensions} />
  ```

  Now you can use new component:

  ```js
  <CardLoading dimensions={cardDimensions} />
  ```

  If you were using CardView to show an error

  ```js
  <CardView status="error" mediaItemType={type} dimensions={cardDimensions} />
  ```

  Now you can use new component:

  ```js
  <CardError dimensions={cardDimensions} />
  ```

  In case you were using CardView to show image with known external URI:

  ```js
  <CardView status="complete" dataURI={dataURI} metadata={metadata} />
  ```

  You will have to find a way to switch to using Card component using ExternalImageIdentifier interface:

  ```js
  <Card identifier={identifier} context={context} />
  ```

## 107.9.5

- [patch][97e555c168](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97e555c168):

  - Revert "[ED-5259 - ED-6200] adds defaultMarks on tableNode (pull request #5259)"

## 107.9.4

- [patch][09a90e4af1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/09a90e4af1):

  - ED-6319 Supporting select media using gap cursor, fix behaviour of backspace key and gap cursor in media single with layout wrap-right.

## 107.9.3

- [patch][a15643ba92](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a15643ba92):

  - Nodeviews now re-render without a view re-create

## 107.9.2

- [patch][823d44ebb0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/823d44ebb0):

  - ED-6667 Enfoce consistent whitespace between renderer & editor

## 107.9.1

- [patch][c976e9355c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c976e9355c):

  - ED-6320: support replacing smart links from Recent Items list via Cmd+K menu

## 107.9.0

- [minor][2558e53738](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2558e53738):

  - ED-6665 Rename 'Panel' to 'Info Panel' (frontend text only)

## 107.8.3

- [patch][b425ea772b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b425ea772b):

  - Revert "ED-5505 add strong as default mark to table header (pull request #5291)"

## 107.8.2

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 107.8.1

- [patch][dfc4c5da7f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dfc4c5da7f):

  - Fix odd cursor selection going inside the inline smart links

## 107.8.0

- [minor][02dd1f7287](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/02dd1f7287):

  - [ED-5505] Persists formatting to table cells and headers when toggling header row, column or applying any text formatting to empty cells.

## 107.7.12

- [patch][44b14dba84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/44b14dba84):

  - ED-6651: fix cell borders when table has merged cells

## 107.7.11

- [patch][2e5b1c9783](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e5b1c9783):

  - ED-6535: fix fallback for images without dimensions on upload

## 107.7.10

- [patch][acfd88ba22](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acfd88ba22):

  - ED-6639 Align lists styles between editor & renderer

## 107.7.9

- [patch][513fb8a1a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/513fb8a1a9):

  - ED-6640: fix resizing not focused table

## 107.7.8

- [patch][eaf2f72de1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eaf2f72de1):

  - ED-6650 Table doesn’t respond on inserting widget with min-width set

## 107.7.7

- [patch][ce8caf29d5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce8caf29d5):

  - ED-6463: fix contextual menu vertical position

## 107.7.6

- [patch][eea996dac5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eea996dac5):

  - ED-6598: Toggling `fullWidthMode` now re-creates `EditorView` instead of only re-creating `EditorState`

  This enables us to call updates on contentComponents and nodeViews

## 107.7.5

- [patch][29d10e3d60](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29d10e3d60):

  - ED-6626 Table doesn’t respond on inserting widget with min-width set

  _Test steps:_

  - Insert a `table`
  - Insert an widget macro with an YouTube video url
  - The `table` should resize the column accordingly

## 107.7.4

- [patch][e80a553a6e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e80a553a6e):

  - ED-6478: upskip VR tests for numbered column

## 107.7.3

- [patch][71c1a888f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/71c1a888f7):

  - ED-6479: upskip table floating toolbar VR tests

## 107.7.2

- [patch][41b940325e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/41b940325e):

  - ED-5948: added mass alignment on a range of selected cells

## 107.7.1

- [patch][c4aedc236e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c4aedc236e):

  - ED-6613 Clear Action & Decision lists instead of wrapping them around floated content. Corrects gap cursor position when adjacent to floated content.

## 107.7.0

- [minor][9df8755c0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9df8755c0b):

  - ED-6603: Disable dynamic text sizing in full width mode

## 107.6.5

- [patch][e125d7d78a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e125d7d78a):

  - ED-6627: fix re-rendering table controls when table is nested inside Columns or bodied extensions

## 107.6.4

- [patch][0f0c06f787](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f0c06f787):

  - ED-5850 Visual tweak to ensure icons are tightly bound by their borders

## 107.6.3

- [patch][1b0b718266](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b0b718266):

  - ED-6474: fix resizing last table column when table is nested inside Columns node

## 107.6.2

- [patch][6110c666c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6110c666c6):

  - ED-6619: scale table when deleting or adding columns

## 107.6.1

- [patch][e0d04f321c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e0d04f321c):

  - ED-6376: fix rendering row controls when table has nested Jira macro (rendered as a nested table)

## 107.6.0

- [minor][13d53eb7c9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/13d53eb7c9):

  - ED-6604 Animate transition from default -> full-width mode and vice versa

## 107.5.1

- [patch][d26570e3b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d26570e3b5):

  - Update i18n for team mention
  - Fix a bug in team mention: missing https protocol in team link

## 107.5.0

- [minor][81491bbc4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/81491bbc4e):

  - ED-5850 Add fallback icon and fix SVG ids

## 107.4.0

- [minor][60a89f843f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60a89f843f):

  - ED-6598: Add initial prop for 'Full Width Mode'

  You may now enable our new experimental feature 'Full Width Mode' by passing a new `fullWidthMode` prop.

  This prop only takes effect on full-width appearence and this initial implementation is extremely raw as most nodes don't reflect their desired behaviour.

  Example:

  ```
  <Editor appearence="full-width" fullWidthMode={true} />
  ```

## 107.3.3

- [patch][92c8c14019](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92c8c14019):

  - ED-6492: Fixed media single without dimensions not rendering on mobile

## 107.3.2

- [patch][3d0da81a4b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d0da81a4b):

  - ED-6583 Add analytics v3 for link inserts

## 107.3.1

- [patch][9f08142085](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f08142085):

  - ED-6618: Fixes the exception thrown when trying to apply the delete decoration.

  Occurs on a position where a node was recently deleted. We now re-map the decorations position on state change to verify if it's still valid to draw or simply delete it.

## 107.3.0

- [minor][936f12e761](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/936f12e761):

  - ED-5850 Add descriptions, richer icons and keyboard shortcuts to the quick insert menu

## 107.2.0

- [minor][fb7a25ec0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fb7a25ec0b):

  - ED-6221 Fire v3 analytics events when insert media

## 107.1.1

- [patch][67e5bfeb72](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67e5bfeb72):

  - ED-6181 Add analytics to paste event

## 107.1.0

- [minor][e36f791fd6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e36f791fd6):

  - Improve types

## 107.0.0

- Updated dependencies [c2c36de22b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c36de22b):
  - @atlaskit/editor-common@36.0.0
  - @atlaskit/renderer@45.0.0
  - @atlaskit/emoji@59.0.0
  - @atlaskit/media-card@59.0.0
  - @atlaskit/media-editor@32.0.0
  - @atlaskit/media-filmstrip@31.0.0
  - @atlaskit/media-picker@38.0.0
  - @atlaskit/editor-bitbucket-transformer@5.0.2
  - @atlaskit/editor-json-transformer@5.0.2
  - @atlaskit/editor-markdown-transformer@3.0.2
  - @atlaskit/editor-test-helpers@8.0.3
  - @atlaskit/task-decision@14.0.1
  - @atlaskit/util-data-test@11.1.5
  - @atlaskit/media-test-helpers@21.1.0
  - @atlaskit/media-core@29.1.0

## 106.7.9

- [patch][495738bcd8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/495738bcd8):

  - Enable UI for links inside headings

## 106.7.8

- [patch][2d7ff51814](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d7ff51814):

  - ED-6595 Remove layout marks when pasting images inside a list

## 106.7.7

- Updated dependencies [9c316bd8aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c316bd8aa):
  - @atlaskit/editor-common@35.1.3
  - @atlaskit/renderer@44.4.3
  - @atlaskit/media-core@29.0.2
  - @atlaskit/media-editor@31.0.3
  - @atlaskit/media-filmstrip@30.0.2
  - @atlaskit/media-picker@37.0.3
  - @atlaskit/media-test-helpers@21.0.3
  - @atlaskit/media-card@58.0.0

## 106.7.6

- [patch][acaf2abb57](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acaf2abb57):

  - ED-6146 Fix bug where gap cursor did not display to right of first node

## 106.7.5

- [patch][298bfed4e1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/298bfed4e1):

  - ED-6580 Media in editor is sized incorrectly in firefox

## 106.7.4

- [patch][5320e1bdb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5320e1bdb5):

  - ED-6476 Columns should show border when inactive in the Editor.

## 106.7.3

- Updated dependencies [eb4323c388](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eb4323c388):
  - @atlaskit/renderer@44.4.2
  - @atlaskit/util-data-test@11.1.4
  - @atlaskit/task-decision@14.0.0

## 106.7.2

- Updated dependencies [97abf5e006](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97abf5e006):
  - @atlaskit/renderer@44.4.1
  - @atlaskit/status@0.8.0

## 106.7.1

- [patch][b3c60e3c9c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3c60e3c9c):

  - Update media-editor dependency

## 106.7.0

- [minor][b32008359a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b32008359a):

  - ED-5823 Add red styling for document elements when they are selected for removal

## 106.6.3

- [patch][97eeac260b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97eeac260b):

  - ED-6137 GAS v3 Analytics events for action subject Table

## 106.6.2

- [patch][56766ce748](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/56766ce748):

  - ED-6407: improve table information density by reducing cells padding from 10px to 8px

## 106.6.1

- [patch][92452e9323](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92452e9323):

  - ED-5734: render table column control buttons for each column regardless of merged cells

## 106.6.0

- [minor][0781a7068c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0781a7068c):

  - ED-6222 Add insertMenu insert events for: emoji picker, image picker, link typeahead, mention typeahead

## 106.5.0

- [minor][ea6b08700c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea6b08700c):

  - ED-6245: Ensure extensions scroll + overflow when they may break out of their parent container.

## 106.4.0

- [minor][7e164b5a6b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e164b5a6b):

  - ED-6547 Add GAS v3 analytics for smartLink

## 106.3.3

- [patch][aa117f5341](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aa117f5341):

  - fix alignment and UI for inline Smart Links.

## 106.3.2

- [patch][8187471d39](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8187471d39):

  - ED-4650 Allow inline code to render after a parentheses

## 106.3.1

- [patch][2f4594a876](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2f4594a876):

  - ED-6526: Resize a table with breakout content

## 106.3.0

- [minor][1affe17dc4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1affe17dc4):

  - add analytics events for team mention

## 106.2.3

- [patch][08940b66c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/08940b66c1):

  - ED-6561 Ignore empty transactions from collab provider

## 106.2.2

- [patch][2ac4f3bf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2ac4f3bf30):

  - fix deleting multiple rows in table

## 106.2.1

- [patch][8ea5466017](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8ea5466017):

  - ED-6438 Fix bg in codeblock gutter

## 106.2.0

- [minor][7bd786fd4d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7bd786fd4d):

  - TEAMS-323 : Send additional information for teams when a team is selected in a mention

## 106.1.2

- Updated dependencies [f504850fe2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f504850fe2):
  - @atlaskit/smart-card@10.1.1
  - @atlaskit/textarea@0.4.0

## 106.1.1

- [patch][c604b1eb64](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c604b1eb64):

  - Fix ED-6522 & ED-6046. Remove z-index from images to ensure they doesn't overlap adjacent content. Ensure floated images remain clickable when adjacent a list.

## 106.1.0

- [minor][0672369fc8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0672369fc8):

  - Integrate TeamMentionResource in editor-core

## 106.0.6

- [patch][2f953a0738](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2f953a0738):

  - ED-6362: add analytics for media annotation button

## 106.0.5

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 106.0.4

- [patch][205b101e2b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/205b101e2b):

  - ED-6230: bump prosemirror-view to 1.8.3; workaround Chrome bug with copy paste multiple images

## 106.0.3

- Updated dependencies [b684722884](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b684722884):
  - @atlaskit/renderer@44.0.1
  - @atlaskit/date@0.6.0
  - @atlaskit/emoji@58.1.0
  - @atlaskit/mention@17.1.0
  - @atlaskit/status@0.7.0
  - @atlaskit/task-decision@13.1.0
  - @atlaskit/util-data-test@11.1.0

## 106.0.2

- [patch][8f1f21dd3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8f1f21dd3a):

  - ED-6275: drop size and alignment when pasting images into page columns or a table

## 106.0.1

- Updated dependencies [90a14be594](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/90a14be594):
  - @atlaskit/button@11.0.1
  - @atlaskit/textarea@0.3.1
  - @atlaskit/analytics-next-types@4.0.1

## 106.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/avatar@15.0.1
  - @atlaskit/avatar-group@3.0.1
  - @atlaskit/calendar@7.0.20
  - @atlaskit/dropdown-menu@7.0.1
  - @atlaskit/droplist@8.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/logo@10.0.1
  - @atlaskit/modal-dialog@8.0.2
  - @atlaskit/section-message@2.0.1
  - @atlaskit/select@8.0.3
  - @atlaskit/spinner@10.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/tooltip@13.0.1
  - @atlaskit/editor-common@35.0.0
  - @atlaskit/renderer@44.0.0
  - @atlaskit/emoji@58.0.0
  - @atlaskit/media-card@57.0.0
  - @atlaskit/media-editor@31.0.0
  - @atlaskit/media-filmstrip@30.0.0
  - @atlaskit/media-picker@37.0.0
  - @atlaskit/i18n-tools@0.5.0
  - @atlaskit/button@11.0.0
  - @atlaskit/textarea@0.3.0
  - @atlaskit/adf-schema@2.0.0
  - @atlaskit/adf-utils@6.0.0
  - @atlaskit/editor-bitbucket-transformer@5.0.0
  - @atlaskit/editor-json-transformer@5.0.0
  - @atlaskit/editor-markdown-transformer@3.0.0
  - @atlaskit/editor-test-helpers@8.0.0
  - @atlaskit/analytics-gas-types@4.0.0
  - @atlaskit/analytics-listeners@5.0.0
  - @atlaskit/analytics-namespaced-context@3.0.0
  - @atlaskit/analytics-next-types@4.0.0
  - @atlaskit/date@0.5.0
  - @atlaskit/mention@17.0.0
  - @atlaskit/pubsub@4.0.0
  - @atlaskit/status@0.6.0
  - @atlaskit/task-decision@13.0.0
  - @atlaskit/util-data-test@11.0.0
  - @atlaskit/util-service-support@4.0.0
  - @atlaskit/media-core@29.0.0
  - @atlaskit/media-test-helpers@21.0.0
  - @atlaskit/smart-card@10.0.0

## 105.4.2

- [patch][57fdb39e20](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/57fdb39e20):

  - ED-6512 Fix subscript

## 105.4.1

- [patch][fb679d390f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fb679d390f):

  - Add a new TeamMenioResource for @atlaskit/mention package. That allows to fetch teams data for mention from a team service (Legion service)

## 105.4.0

- [minor][f6345bba88](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f6345bba88):

  - Ed-4131 Fix text decorations to respect the selected text colour

## 105.3.2

- [patch][b849dcb1e7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b849dcb1e7):

  - bump smart cards version to include patches.

## 105.3.1

- [patch][3f6501c569](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f6501c569):

  - ED-6518: Fixes mark overflowing to the left

## 105.3.0

- [minor][5b226754b8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b226754b8):

  - ED-5939: Replace SizeDetector with WidthDetector in all editor components

## 105.2.1

- Updated dependencies [1b952c437d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b952c437d):
  - @atlaskit/textarea@0.2.6

## 105.2.0

- [minor][b2c1f96b0d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b2c1f96b0d):

  - Allow text formatting marks only on text nodes.

## 105.1.0

- [minor][804597a281](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/804597a281):

  - ED-6482 Add GAS v3 analytics for panel

## 105.0.0

- Updated dependencies [7ab3e93996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ab3e93996):
  - @atlaskit/editor-common@34.0.0
  - @atlaskit/editor-test-helpers@7.0.6
  - @atlaskit/renderer@43.0.0
  - @atlaskit/emoji@57.0.0
  - @atlaskit/media-card@56.0.0
  - @atlaskit/media-editor@30.0.0
  - @atlaskit/media-filmstrip@29.0.0
  - @atlaskit/media-picker@36.0.0
  - @atlaskit/media-test-helpers@20.1.8
  - @atlaskit/editor-bitbucket-transformer@4.2.5
  - @atlaskit/editor-json-transformer@4.3.5
  - @atlaskit/editor-markdown-transformer@2.2.5
  - @atlaskit/task-decision@12.0.1
  - @atlaskit/util-data-test@10.2.5
  - @atlaskit/media-core@28.0.0

## 104.1.1

- Updated dependencies [72c6f68226](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72c6f68226):
  - @atlaskit/renderer@42.0.1
  - @atlaskit/util-data-test@10.2.4
  - @atlaskit/task-decision@12.0.0

## 104.1.0

- [minor][55eb63afac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/55eb63afac):

  - ED-6239 Add Analytics GAS V3 to autosubstituted

## 104.0.0

- [major][4d17df92f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d17df92f8):

  - ED-6484: Remove the 'inline-comment' appearance from Editor.

## 103.4.4

- [patch][65acb722e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65acb722e3):

  - ED-6412: Prevent inserting links containing 'javascript:'

## 103.4.3

- [patch][7641ec96cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7641ec96cd):

  - ED-5998: improve cell selection with merged cells, deleting columns and rows

## 103.4.2

- [patch][6380484429](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6380484429):

  - ED-6485 Support breakout mark on layout-section. Retain breakout mark when toggling list nested within columns.

## 103.4.1

- [patch][5e319bb725](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e319bb725):

  - ED-6286: fix post-PR for media upload on mobile

## 103.4.0

- [minor][6739aea208](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6739aea208):

  - Update editor-common and editor-core types

## 103.3.0

- [minor][738f58ef9e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/738f58ef9e):

  - ED-5019 Panels are no longer cleared by clear-formatting

## 103.2.0

- [minor][08a09ae767](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/08a09ae767):

  - ED-6377 Add Analytics GAS V3 for numbered/bulleted list format

## 103.1.4

- [patch][be479e2335](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/be479e2335):

  - fix link opening logic for view and edit mode.

## 103.1.3

- [patch][ed6ef51cfe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed6ef51cfe):

  - ED-6158: added a shortcut to contextual menu for insertRow and insertColumn

## 103.1.2

- [patch][abb200b0b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abb200b0b4):

  - ED-6374: Switch to MutationObserver instead of rAF + nodeview update for handling breakout content inside a table cell.

## 103.1.1

- [patch][109158320c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/109158320c):

  - Make more avatar colors available to the collab plugin

## 103.1.0

- [minor][58932a27f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58932a27f4):

  - ED-6220 Fire v3 analytics events when insert actions or decisions

## 103.0.3

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/calendar@7.0.18
  - @atlaskit/icon@16.0.4
  - @atlaskit/textarea@0.2.5
  - @atlaskit/adf-utils@5.7.2
  - @atlaskit/editor-bitbucket-transformer@4.2.3
  - @atlaskit/editor-json-transformer@4.3.3
  - @atlaskit/editor-markdown-transformer@2.2.3
  - @atlaskit/renderer@41.2.1
  - @atlaskit/analytics-gas-types@3.2.5
  - @atlaskit/analytics-listeners@4.2.1
  - @atlaskit/analytics-namespaced-context@2.2.1
  - @atlaskit/date@0.4.1
  - @atlaskit/emoji@56.2.1
  - @atlaskit/mention@16.2.2
  - @atlaskit/pubsub@3.0.8
  - @atlaskit/status@0.5.1
  - @atlaskit/task-decision@11.3.1
  - @atlaskit/util-data-test@10.2.3
  - @atlaskit/util-service-support@3.1.1
  - @atlaskit/media-card@55.0.2
  - @atlaskit/media-core@27.2.3
  - @atlaskit/media-editor@29.1.2
  - @atlaskit/media-filmstrip@28.0.1
  - @atlaskit/media-picker@35.0.1
  - @atlaskit/smart-card@9.11.3
  - @atlaskit/media-test-helpers@20.1.7
  - @atlaskit/editor-common@33.0.3
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics-next@4.0.0
  - @atlaskit/avatar-group@3.0.0
  - @atlaskit/avatar@15.0.0
  - @atlaskit/code@9.0.0
  - @atlaskit/dropdown-menu@7.0.0
  - @atlaskit/droplist@8.0.0
  - @atlaskit/item@9.0.0
  - @atlaskit/logo@10.0.0
  - @atlaskit/lozenge@7.0.0
  - @atlaskit/modal-dialog@8.0.0
  - @atlaskit/section-message@2.0.0
  - @atlaskit/select@8.0.0
  - @atlaskit/size-detector@7.0.0
  - @atlaskit/spinner@10.0.0
  - @atlaskit/theme@8.0.0
  - @atlaskit/tooltip@13.0.0

## 103.0.2

- [patch][44f4d1293a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/44f4d1293a):

  - ED-6219: Use TableMap to get column index over dom children index

## 103.0.1

- [patch][b346b44c05](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b346b44c05):

  - ED-6411: Fix resizing the last column with dynamic text sizing enabled

## 103.0.0

- [major][60f0ad9a7e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60f0ad9a7e):

  - ED-6286: remove StateManager from media plugin and provider

## 102.2.2

- [patch][06c4a70a2e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c4a70a2e):

  - ED-6031: Dont reset selection if editor still has focus.

## 102.2.1

- [patch][c427333c46](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c427333c46):

  - ED-6008 Dim telepointers that overlaps the cursor.

## 102.2.0

- [minor][4a9a7487f1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a9a7487f1):

  - ED-6240 Add Analytics GAS V3 for insert new line

## 102.1.10

- Updated dependencies [4072865c1c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4072865c1c):
  - @atlaskit/renderer@41.1.1
  - @atlaskit/date@0.4.0
  - @atlaskit/emoji@56.2.0
  - @atlaskit/status@0.5.0
  - @atlaskit/task-decision@11.3.0

## 102.1.9

- [patch][9b0f6671ae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b0f6671ae):

  - ED-6244: Fix Resizable Media to allow images go smaller size than videos

## 102.1.8

- [patch][97a9ca095b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97a9ca095b):

  - ED-6452: Put collab document validation behind a flag

## 102.1.7

- [patch][2e48ec26ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e48ec26ba):

  - Changes to support new version of media-editor

## 102.1.6

- [patch][59fcd0bbc9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59fcd0bbc9):

  - FM-1618: fixed media upload on mobile

## 102.1.5

- [patch][2b4b290610](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b4b290610):

  - ED-6461: Fix placement start when scrolling for Popup

## 102.1.4

- [patch][7a8d8ba656](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7a8d8ba656):

  - ED-6452: Validate documents on init through collab-editing

  * Add unsupportedInline and unsupportedBlock to test-helpers.

## 102.1.3

- [patch][1c00bd6268](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c00bd6268):

  - ED-6409: set minWidth to 140px for all new columns in resized table

## 102.1.2

- [patch][f86078d629](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f86078d629):

  - ED-6327: highlight smart cards when selecting backwards in document

## 102.1.1

- Updated dependencies [36bb743af0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36bb743af0):
  - @atlaskit/renderer@41.0.1
  - @atlaskit/date@0.3.0
  - @atlaskit/emoji@56.1.0
  - @atlaskit/status@0.4.0

## 102.1.0

- [minor][d18b085e2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d18b085e2a):

  - Integrating truly upfront ID

## 102.0.2

- [patch][4d0c196597](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d0c196597):

  - ED-6232 Fix copy-pasting a table with numbered column drops one column

## 102.0.1

- [patch][2787c79b6a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2787c79b6a):

  - ED-6296: Scale down table sizes when parent layout changes

## 102.0.0

- Updated dependencies [4aee5f3cec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aee5f3cec):
  - @atlaskit/editor-common@33.0.0
  - @atlaskit/renderer@41.0.0
  - @atlaskit/emoji@56.0.0
  - @atlaskit/media-card@55.0.0
  - @atlaskit/media-filmstrip@28.0.0
  - @atlaskit/media-picker@35.0.0
  - @atlaskit/editor-bitbucket-transformer@4.2.1
  - @atlaskit/editor-json-transformer@4.3.1
  - @atlaskit/editor-markdown-transformer@2.2.1
  - @atlaskit/editor-test-helpers@7.0.2
  - @atlaskit/task-decision@11.2.3
  - @atlaskit/util-data-test@10.2.2
  - @atlaskit/media-test-helpers@20.1.6
  - @atlaskit/media-core@27.2.0

## 101.7.0

- [minor][d4afa2713d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d4afa2713d):

  - ED-6212 Fire v3 analytics events when insert table or emojis

## 101.6.3

- Updated dependencies [0de1251ad1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0de1251ad1):
  - @atlaskit/editor-common@32.4.3
  - @atlaskit/renderer@40.1.1
  - @atlaskit/size-detector@6.0.0

## 101.6.2

- [patch][4eb1af2892](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4eb1af2892):

  - ED-6265 fix external image call to media for dimensions

## 101.6.1

- [patch][3f4a4e4f49](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f4a4e4f49):

  - [ED-6351] Fix table insert columns/row UI positions

## 101.6.0

- [minor][8e407b5a24](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8e407b5a24):

  - ED-6289 Add analytics GAS V3 for color text formatting

## 101.5.3

- [patch][37ca429b01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/37ca429b01):

  - ED-6374: Fixes handling breakout content more efficiently.

## 101.5.2

- [patch][1ede48ac5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ede48ac5b):

  - ED-6381: Gather max layout sizes based on dynamic text sizing

## 101.5.1

- [patch][42b78a6133](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42b78a6133):

  - ED-6278: a complete rewrite of mergeCells, deleteColumns and deleteRows

## 101.5.0

- [minor][bab8f06b0a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bab8f06b0a):

  - ED-6285 When catch an invalid transaction, send the new & prev document structures

## 101.4.3

- [patch][06f8fd872b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06f8fd872b):

  - [ED-6342] Fix remove bodied extension when it is selected

## 101.4.2

- [patch][27189951b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/27189951b5):

  - ED-5967: added API to enable links on hybrid editor

## 101.4.1

- [patch][c2360c53b2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2360c53b2):

  - fixed status selection loss when dragging and drop

## 101.4.0

- [minor][30b4e99377](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30b4e99377):

  - ED-5888 Add editor dark mode

## 101.3.3

- [patch][e08b35abef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e08b35abef):

  - StatusPicker event listeners cleaned up

## 101.3.2

- [patch][f5e8437365](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f5e8437365):

  - ED-6373: Fix position of breakout controls while scrolling

## 101.3.1

- [patch][7308d1e0e9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7308d1e0e9):

  - ED-6061: support image annotations in editor

## 101.3.0

- [minor][3672ec23ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3672ec23ef):

  - [ED-5788] Add new layout Breakout button for CodeBlock and Layout

## 101.2.0

- [minor][d5856900a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5856900a1):

  - ED-6338: Dont allow nested nodes to be inserted with a non default layout.

## 101.1.0

- [minor][e142e966c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e142e966c2):

  - ED-6238, ED-5684 Add Analytcs GAS v3 to clear formatting and fix clear formatting on heading elements

## 101.0.6

- [patch][60ea09b0cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60ea09b0cc):

  - ED-6246 Add more metadata to Unsupported Node logging

## 101.0.5

- [patch][c5683f8422](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c5683f8422):

  - ED-4998 Fix highlighting and disabling of meatball menu items in different contexts

## 101.0.4

- [patch][bd0f7a69ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd0f7a69ac):

  - ED-5964: Remove marks from inline nodes that are not text

## 101.0.3

- [patch][7a7cd4c491](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7a7cd4c491):

  - make smart links open in same window.

## 101.0.2

- [patch][6773e958ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6773e958ab):

  - ED-5738: fix resize handles for merged cells

## 101.0.1

- [patch][b832f0f57c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b832f0f57c):

  - ED-6320: inserting links via CMD+K can also insert smart links

## 101.0.0

- [major][4a84fc40e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a84fc40e0):

  - ED-5766 Remove the deprecated 'message' appearance from Editor

## 100.2.0

- [minor][af5572cf8e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af5572cf8e):

  - ED-6284 Filter out invalid transactions before they are applied and send an analytics event

## 100.1.0

- [minor][5dc1e046b2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5dc1e046b2):

  - Apply stricture typings to elements related editor code

## 100.0.0

- [major][4af5bd2a58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4af5bd2a58):

  - Remove linkCreateContext from MediaProvider

## 99.0.1

- [patch][7f93e282b8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f93e282b8):

  - ED-6257: Handle applying header column with a rowspan

## 99.0.0

- [patch][5b5ae91921](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b5ae91921):

  - Require Identifier type from media-core instead of media-card

- Updated dependencies [fc6164c8c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc6164c8c2):
- Updated dependencies [190c4b7bd3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/190c4b7bd3):
  - @atlaskit/editor-common@32.0.0
  - @atlaskit/renderer@39.0.0
  - @atlaskit/emoji@55.0.0
  - @atlaskit/media-card@54.0.0
  - @atlaskit/media-filmstrip@27.0.0
  - @atlaskit/media-picker@34.0.0
  - @atlaskit/editor-bitbucket-transformer@4.1.11
  - @atlaskit/editor-json-transformer@4.1.10
  - @atlaskit/editor-markdown-transformer@2.1.10
  - @atlaskit/editor-test-helpers@6.3.22
  - @atlaskit/task-decision@11.2.1
  - @atlaskit/util-data-test@10.2.1
  - @atlaskit/media-test-helpers@20.1.5
  - @atlaskit/media-core@27.1.0

## 98.13.6

- [patch][f500b2c81e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f500b2c81e):

  - ED-6252 Change table floating toolbar to say 'Table options' instead of icon

## 98.13.5

- [patch][bc340694d2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bc340694d2):

  - ED-6247: fix resizing with merged cells

## 98.13.4

- Updated dependencies [46dfcfbeca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/46dfcfbeca):
  - @atlaskit/editor-common@31.1.1
  - @atlaskit/renderer@38.0.7
  - @atlaskit/media-core@27.0.2
  - @atlaskit/media-filmstrip@26.1.2
  - @atlaskit/media-picker@33.0.4
  - @atlaskit/media-test-helpers@20.1.4
  - @atlaskit/media-card@53.0.0

## 98.13.3

- [patch][0a13188647](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a13188647):

  - ED-6133: Fix scaling up going into overflow

## 98.13.2

- [patch][cebfee91b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cebfee91b3):

  - ED-6231 Fixes RangeError when deleting last column in full-width mode

## 98.13.1

- [patch][7316e316bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7316e316bc):

  - ED-6209: remove internal legacy event subscription model from media plugin

## 98.13.0

- [minor][be86cbebc3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/be86cbebc3):

  - enable noImplicitAny for task-decision, and related changes

## 98.12.1

- [patch][a3161a7927](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3161a7927):

  - ED-6264 Fix examples page not been loaded when code is compiled

## 98.12.0

- [minor][4d8d759bf9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d8d759bf9):

  - [ED-6255] Migrate ADFNode type to ADFEntity

## 98.11.1

- [patch][ea423a619f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea423a619f):

  - Fixed the call to the /check endpoint

## 98.11.0

- [minor][448b9946cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/448b9946cc):

  - ED-6195 Add Analytics GAS V3 for identation

## 98.10.5

- [patch][36986d383b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36986d383b):

  - ED-6010 Rename "Block Quote" to "Quote", and "Code Block" to "Code snippet" in the insert menu
  - Update i18n translations

## 98.10.4

- [patch][cf7fd7d3be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cf7fd7d3be):

  - Render external images in editor

## 98.10.3

- Updated dependencies [06713e0a0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06713e0a0c):
  - @atlaskit/logo@9.2.7
  - @atlaskit/media-picker@33.0.3
  - @atlaskit/media-test-helpers@20.1.3
  - @atlaskit/modal-dialog@7.2.3
  - @atlaskit/select@7.0.0

## 98.10.2

- [patch][45e3fffa9e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/45e3fffa9e):

  - suppress enter and tab keys events in the status node to prevent bugs

## 98.10.1

- [patch][4cc0b47f6a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4cc0b47f6a):

  - ED-6233: Use minCellWith over wrapWidth to determine free space in a column

## 98.10.0

- [minor][e6daf79012](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6daf79012):

  - ED-6135 Fire analytics v3 events when insert panel, code block or horizontal rule

## 98.9.5

- [patch][026d4424c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/026d4424c2):

  - ED-6226 Fix row delete button displacement after many rows in a table

## 98.9.4

- [patch][e04c61dc55](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e04c61dc55):

  - ED-6183 fix image wrapping, revert createDOMRef chang

## 98.9.3

- [patch][8788a98286](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8788a98286):

  - [FS-3589] Fix re-rendering on status element after apply decoration

## 98.9.2

- [patch][c81737b526](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c81737b526):

  - ED-6098: simplify internal state changes for completed media uploads

## 98.9.1

- [patch][ebb0a98051](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebb0a98051):

  - remove empty status before publishing document

## 98.9.0

- [minor][59ae46e1cf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59ae46e1cf):

  - ED-5061: migrate media toolbar to new internal architecture

## 98.8.2

- [patch][19a823bf2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/19a823bf2a):

  - delete empty status node when user selects another node

## 98.8.1

- [patch][0a304a48f6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a304a48f6):

  - ED-6218: fix repair table logic

## 98.8.0

- [minor][cde3ff657f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cde3ff657f):

  - ED-6134 Add analytics GAS V3 for text formatting, headers and blockQuotes

## 98.7.2

- [patch][6981b6d25a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6981b6d25a):

  - ED-6214: Fix resizing when rowspan exists in non last column

## 98.7.1

- [patch][a22478c227](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a22478c227):

  - ED-6133: Re-draw resized columns in collab, cater for overflow tables when resizing

## 98.7.0

- [minor][44a42d5eb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/44a42d5eb3):

  - ED-5846: Refactoring new hyperlink toolbar and adding typeahead to the new floating toolbar

## 98.6.0

- [minor][fa435d11f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa435d11f7):

  - ED-6155 Fire analytics v3 events for general editor UI events

## 98.5.1

- [patch][4bead4dd64](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4bead4dd64):

  - Fix cursor bug between Panel and Status when moved with arrowkeys

## 98.5.0

- [minor][5a6071d7f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5a6071d7f5):

  - [ED-6159] Changes tooltip for the add contextual button on tables

## 98.4.6

- [patch][09696170ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/09696170ec):

  - ED-6177 Deleting a range of rows/columns deletes only a subset of selected rows/columns

## 98.4.5

- [patch][c61aaebd2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c61aaebd2d):

  - ED-6172: Apply table layout based on total width for autoSize tables.

## 98.4.4

- [patch][18dffaa5fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dffaa5fd):

  - ED-6192: Bail out of column resizing if the table has changed via other means (e.g. collab)

## 98.4.3

- [patch][66a5bd2f70](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66a5bd2f70):

  - ED-6027 update ADF when image dimensions are missing

## 98.4.2

- [patch][2487368a7e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2487368a7e):

  - ED-6170: repair the table by removing invisible columns

## 98.4.1

- [patch][47970c78b1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/47970c78b1):

  - ED-5976 Maintain text alignment when hit return

## 98.4.0

- [minor][1bc4b69b08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bc4b69b08):

  - ED-6171 Adding feature flag for Analytics GAS V3

## 98.3.0

- [minor][0f3f9f0992](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f3f9f0992):

  - Fix context identifiers not being passed to mention provider's calls. MentionProvider interface was updated to include the optional contextIdentifier parameter in filter and recordMentionSelection methods.

## 98.2.6

- [patch][3305886b5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3305886b5a):

  - ED-6167: Handle extraneous column widths

## 98.2.5

- [patch][b11848ebf8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b11848ebf8):

  - [ED-6165] Fix table cell options chevron overflow.

## 98.2.4

- [patch][65b73cc466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65b73cc466):

  - Code split media-picker: make MediaPicker factory async and make editor use it

## 98.2.3

- [patch][14fe1381ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/14fe1381ba):

  - ED-6118: ensure media dimensions are always integers, preventing invalid ADF

## 98.2.2

- [patch][86dcb6f814](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/86dcb6f814):

  - updated native status icon in Fabric editor

## 98.2.1

- [patch][17107bdfb0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/17107bdfb0):

  - ED-6141: remove broken tables if its not fixable

## 98.2.0

- [minor][3fecea2975](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3fecea2975):

  - ED-5933 Add analytics plugin to facilitate working with @atlaskit/analytics-next package

## 98.1.13

- [patch][7ce3cc56ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ce3cc56ff):

  - FS-3500 Fix missing call to recordMentionSelection() when a selection is made in the mention typeahead

## 98.1.12

- [patch][1c62bcce7d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c62bcce7d):

  - Fix a problem with smart cards not appearing sometimes when lazy rendered and lazy loaded after code-split.

## 98.1.11

- [patch][be706e55f6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/be706e55f6):

  - Fixes tableRow validation failure

## 98.1.10

- [patch][e7dcb7ef15](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7dcb7ef15):

  - Revert table resizing collab change

## 98.1.9

- [patch][1ee84815dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ee84815dd):

  - ED-6133: Visually apply column resize changes in collab editing

## 98.1.8

- [patch][e83a20575b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e83a20575b):

  - ED-6148: Prevent autoSize tables from being in an endless loop, integrate with new resizing

## 98.1.7

- [patch][69e29bab6c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69e29bab6c):

  - ED-5860 Prevent invalid steps from being applied in the editor

## 98.1.6

- [patch][406cbf0a4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/406cbf0a4e):

  - ED-6092: allow passing undefined context to media filmstrip

## 98.1.5

- [patch][b2b0a00d6a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b2b0a00d6a):

  - Fix table creation without rows

## 98.1.4

- [patch][3b9236fb74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3b9236fb74):

  - MS-1455, MS-1456: Fix max width for the surrounding element for the inline smart cards so that they don't overflow and positioning within li elements

## 98.1.3

- [patch][af3918bc89](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af3918bc89):

  - The url part of the unauthorized link is now grey

## 98.1.2

- [patch][557a2b5734](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/557a2b5734):

  - ED-5788: bump prosemirror-view and prosemirror-model

## 98.1.1

- [patch][2d14c5dae1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d14c5dae1):

  - ED-5730 Allow attachment to be inserted after list

## 98.1.0

- [minor][a26d644414](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a26d644414):

  - ED-5845, ED-6072: support resizing in multiple editors on page, fix snapping images in lists

## 98.0.3

- [patch][5ae645d661](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ae645d661):

  - Fixing analytics in smart-cards

## 98.0.2

- [patch][4437882a9a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4437882a9a):

  - ED-6107: don't act on destroyed EditorView during cleanup in media plugin

## 98.0.1

- [patch][2035bef8fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2035bef8fb):

  - Fix inline extractor priority preventing @type arrays in some cases.

## 98.0.0

- [patch][4e82fedc90](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e82fedc90):

  - Expose real id upfront for remote files in MediaPicker

- Updated dependencies [9d881f1eb8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d881f1eb8):
- Updated dependencies [69c8d0c19c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c8d0c19c):
  - @atlaskit/media-test-helpers@20.1.0
  - @atlaskit/media-picker@32.0.0
  - @atlaskit/editor-common@31.0.0
  - @atlaskit/editor-test-helpers@6.3.17
  - @atlaskit/renderer@38.0.0
  - @atlaskit/emoji@54.0.0
  - @atlaskit/media-card@52.0.0
  - @atlaskit/media-filmstrip@26.0.0
  - @atlaskit/editor-bitbucket-transformer@4.1.8
  - @atlaskit/editor-json-transformer@4.1.8
  - @atlaskit/editor-markdown-transformer@2.1.8
  - @atlaskit/task-decision@11.1.8
  - @atlaskit/util-data-test@10.0.36
  - @atlaskit/media-core@27.0.0

## 97.1.9

- [patch][4552e804d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4552e804d3):

  - dismiss StatusPicker if status node is not selected

## 97.1.8

- [patch][adff2caed7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/adff2caed7):

  - Improve typings

## 97.1.7

- [patch][7c497c2de6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c497c2de6):

  - ED-5810 Fix issue where numbered table rows flickered when hovering on the edge of row controls

## 97.1.6

- [patch][cbc601aed3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbc601aed3):

  - Added missing type of events for Confluence

## 97.1.5

- [patch][bfe22480d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bfe22480d0):

  - ED-6056: fix zero width columns in renderer for migration tables

## 97.1.4

- [patch][f77cd3fb66](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f77cd3fb66):

  - fixed reactjs warning on FieldBase.onBlur and prevent breaking line when inserting Status via enter key

## 97.1.3

- Updated dependencies [07a187bb30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07a187bb30):
  - @atlaskit/editor-test-helpers@6.3.14
  - @atlaskit/renderer@37.0.2
  - @atlaskit/media-card@51.0.2
  - @atlaskit/media-core@26.2.1
  - @atlaskit/media-filmstrip@25.0.2
  - @atlaskit/media-picker@31.0.2
  - @atlaskit/media-test-helpers@20.0.0

## 97.1.2

- [patch][5132bc24a5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5132bc24a5):

  - Fix codeblock enter-press inside lists

## 97.1.1

- [patch][478a86ae8a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/478a86ae8a):

  - avoid using the same localId when pasting status

## 97.1.0

- [minor][2db7577588](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2db7577588):

  - ED-5924: Fixes handling of node deletion for composition events.

## 97.0.3

- [patch][a5714ccc17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a5714ccc17):

  - Fixed table column not selectable (regression in prosemirror-view@1.6.8)

## 97.0.2

- [patch][8dc4a35361](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8dc4a35361):

  - enable status and date components to be pasted into a task component

## 97.0.1

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/avatar@14.1.8
  - @atlaskit/avatar-group@2.1.10
  - @atlaskit/button@10.1.2
  - @atlaskit/calendar@7.0.17
  - @atlaskit/dropdown-menu@6.1.26
  - @atlaskit/droplist@7.0.18
  - @atlaskit/item@8.0.15
  - @atlaskit/modal-dialog@7.2.1
  - @atlaskit/section-message@1.0.16
  - @atlaskit/select@6.1.19
  - @atlaskit/tooltip@12.1.15
  - @atlaskit/editor-common@30.0.1
  - @atlaskit/editor-test-helpers@6.3.13
  - @atlaskit/renderer@37.0.1
  - @atlaskit/emoji@53.0.1
  - @atlaskit/mention@16.0.1
  - @atlaskit/status@0.3.2
  - @atlaskit/task-decision@11.1.7
  - @atlaskit/media-card@51.0.1
  - @atlaskit/media-filmstrip@25.0.1
  - @atlaskit/media-picker@31.0.1
  - @atlaskit/media-test-helpers@19.1.1
  - @atlaskit/smart-card@9.4.1
  - @atlaskit/icon@16.0.0

## 97.0.0

- [minor][b1627a5837](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1627a5837):

  - Enable inline video player in Editor and Renderer

- Updated dependencies [85d5d168fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85d5d168fd):
  - @atlaskit/editor-common@30.0.0
  - @atlaskit/renderer@37.0.0
  - @atlaskit/emoji@53.0.0
  - @atlaskit/media-card@51.0.0
  - @atlaskit/media-filmstrip@25.0.0
  - @atlaskit/media-picker@31.0.0
  - @atlaskit/editor-bitbucket-transformer@4.1.7
  - @atlaskit/editor-json-transformer@4.1.7
  - @atlaskit/editor-markdown-transformer@2.1.7
  - @atlaskit/editor-test-helpers@6.3.12
  - @atlaskit/task-decision@11.1.6
  - @atlaskit/util-data-test@10.0.34
  - @atlaskit/media-test-helpers@19.1.0
  - @atlaskit/media-core@26.2.0

## 96.0.2

- [patch][4e764a26d4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e764a26d4):

  - ED-6070: Don't render proper mediaCard on mobile until we have a valid collection

## 96.0.1

- [patch][af85018](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af85018):

  - ED-6064: always undo smart cards to links

## 96.0.0

- Updated dependencies [dadef80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dadef80):
- Updated dependencies [3ad16f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ad16f3):
  - @atlaskit/editor-common@29.0.0
  - @atlaskit/renderer@36.0.0
  - @atlaskit/emoji@52.0.0
  - @atlaskit/media-card@50.0.0
  - @atlaskit/media-filmstrip@24.0.0
  - @atlaskit/media-picker@30.0.0
  - @atlaskit/editor-bitbucket-transformer@4.1.6
  - @atlaskit/editor-json-transformer@4.1.6
  - @atlaskit/editor-markdown-transformer@2.1.6
  - @atlaskit/editor-test-helpers@6.3.11
  - @atlaskit/task-decision@11.1.5
  - @atlaskit/util-data-test@10.0.33
  - @atlaskit/media-test-helpers@19.0.0
  - @atlaskit/media-core@26.1.0

## 95.1.0

- [minor][2d6d5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d6d5b6):

  - ED-5379: rework selecting media under the hood; maintain size and layout when copy-pasting

## 95.0.21

- [patch][6c81bca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c81bca):

  - ED-6041: fix converting encoded URLs (e.g. URLs with spaces as %20) to smart cards

## 95.0.20

- [patch][9d3f48c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d3f48c):

  - ED-4501 Wrap placeholder text onto new line

## 95.0.19

- [patch][967f631](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/967f631):

  - ED-4732: Fixed preserving marks when pasting text into paragraph

## 95.0.18

- [patch][8158fe0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8158fe0):

  - ED-6059: Extension and inlineExtension should read their content from attrs not the PMNode.

## 95.0.17

- [patch][37b7edf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/37b7edf):

  - ED-6062: fix deleting last character inside a node with breakout mark

## 95.0.16

- [patch][23d298e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/23d298e):

  - ED-5950: fix merging rows

## 95.0.15

- [patch][a8d8855](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a8d8855):

  - fixed StatusPicker analytics firing when user clicks in two Status instances, one after another

## 95.0.14

- [patch][be6313e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/be6313e):

  - ED-5477 Support rendering of inline code together with other marks

## 95.0.13

- [patch][c5ee0c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c5ee0c8):

  - Added Annotation mark to ADF, editor & renderer

## 95.0.12

- [patch][888e563](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/888e563):

  - Fixes an issue with ClickAreaBlock that wouldn't allow focus textareas

## 95.0.11

- [patch][ec9ed50](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec9ed50):

  - ED-5814 Fix issue where numbered columns' styling was off on small screens

## 95.0.10

- [patch][060f2da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/060f2da):

  - ED-5991: bumped prosemirror-view to 1.6.8

## 95.0.9

- [patch][6514dda](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6514dda):

  - ED-5415, ED-6020: don't create broken document after sequential media insertion; always try to insert an empty paragraph after images, even in tables

## 95.0.8

- [patch][fc9a884](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc9a884):

  - ED-5543: fix backspacing after hardbreak node

## 95.0.7

- [patch][5f8b151](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f8b151):

  - Open date picker on enter when date node is selected

## 95.0.6

- [patch][6855bec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6855bec):

  - Updated internal use of ModalDialog to use new composition API

## 95.0.5

- [patch][844feea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/844feea):

  - ED-6039 Fixed extension toolbar remove action

## 95.0.4

- [patch][e082366](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e082366):

  - ED-6045: fixed unable to select table row

## 95.0.3

- [patch][61ce3c5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/61ce3c5):

  - ED-6015 Fix bug where cursor would jump to start of mention after hitting backspace after a mention

## 95.0.2

- [patch][6866eba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6866eba):

  - ED-5638: insert a space after pasting links that turn into inline cards to help avoid refreshing them

## 95.0.1

- [patch][df30c63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df30c63):

  - ED-5723: Enables typeahead support for mobile editor

  * Added a new bridge `typeAheadBridge`, which contains `typeAheadQuery()` and `dismissTypeAhead()`
    - `typeAheadQuery(query: string, trigger: string)` - This will notify integrators when a user is attempting to filter down a list.
    - `dismissTypeAhead` - Call this to dismiss any typeahead related content.
  * Added bridge function `insertTypeAheadItem()`, which currently only supports inserting mentions.
    - `insertTypeAheadItem(type: 'mention', payload: string)` - Payload is a stringified JSON blob containing the information to insert a mention in this scenario.
  * Added bridge function `setFocus()` to handle returning the focus to the editor after a native interaction.
  * Added new promise `getAccountId`, which is used to highlight the current user's mention.

## 95.0.0

- [major][0c116d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c116d6):

  - Removed client-side indexed cache of mention results. Also removed method 'getUsersInContext' from MentionResourceConfig, 'remoteSearch' from MentionStats and 'weight' from MentionDescription. If you used to use them, simply remove any references to them.

## 94.1.5

- [patch][c0dc7e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c0dc7e3):

  - FS-3360 - Support state analytics attribute with values new or existing. Implement for web, and mobile support via mobile-bridge.

## 94.1.4

- [patch][7d9ccd7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d9ccd7):

  - fixed copy/paste status from renderer to editor

## 94.1.3

- [patch][323b457](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/323b457):

  - trimmed status text so now the placeholder appears correctly when user types spaces in the status picker

## 94.1.2

- [patch][c8a5e65](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8a5e65):

  - ED-6023: fix scaling a table when deleting column

## 94.1.1

- [patch][9b0341d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b0341d):

  - ED-5871 Fix issue where user had to click twice to focus cursor in editor on full page editor in Firefox

## 94.1.0

- [minor][58e30bb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58e30bb):

  - deduped i18n key fabric.editor.orderedList

## 94.0.0

- Updated dependencies [cbb8cb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbb8cb5):
  - @atlaskit/editor-common@28.0.0
  - @atlaskit/editor-test-helpers@6.3.7
  - @atlaskit/renderer@35.0.0
  - @atlaskit/emoji@51.0.0
  - @atlaskit/media-card@49.0.0
  - @atlaskit/media-filmstrip@23.0.0
  - @atlaskit/media-picker@29.0.0
  - @atlaskit/media-test-helpers@18.9.1
  - @atlaskit/editor-bitbucket-transformer@4.1.4
  - @atlaskit/editor-json-transformer@4.1.4
  - @atlaskit/editor-markdown-transformer@2.1.4
  - @atlaskit/task-decision@11.1.4
  - @atlaskit/util-data-test@10.0.31
  - @atlaskit/media-core@26.0.0

## 93.0.0

- Updated dependencies [72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):
  - @atlaskit/editor-common@27.0.0
  - @atlaskit/editor-test-helpers@6.3.6
  - @atlaskit/renderer@34.0.0
  - @atlaskit/emoji@50.0.0
  - @atlaskit/media-card@48.0.0
  - @atlaskit/media-filmstrip@22.0.0
  - @atlaskit/media-picker@28.0.0
  - @atlaskit/editor-bitbucket-transformer@4.1.3
  - @atlaskit/editor-json-transformer@4.1.3
  - @atlaskit/editor-markdown-transformer@2.1.3
  - @atlaskit/task-decision@11.1.3
  - @atlaskit/util-data-test@10.0.30
  - @atlaskit/media-core@25.0.0
  - @atlaskit/media-test-helpers@18.9.0

## 92.0.21

- [patch][e930505](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e930505):

  - Added plugin state factory: createPluginState

## 92.0.20

- [patch][ababb4a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ababb4a):

  - ED-5999: fix padding between Columns in renderer

## 92.0.19

- [patch][e858305](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e858305):

  - ED-5805: Popup to support being sticky with alignX=top

## 92.0.18

- [patch][5d4527e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5d4527e):

  - Fix issue where date was not respecting user's local date for initial date selection in quick insert

## 92.0.17

- [patch][561f6cb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/561f6cb):

  - ED-5336 Disallow nesting lists past 6 levels

## 92.0.16

- [patch][e251065](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e251065):

  - ED-5894: fix table controls disappearing while dragging resize handle

## 92.0.15

- [patch][4b1567c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b1567c):

  - ED-5991: fixed Position NaN out of range when resizing tables

## 92.0.14

- [patch][88a8605](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/88a8605):

  - ED-5958: fix "getBoundingClientRect" errors

## 92.0.13

- [patch][e79f8b0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e79f8b0):

  - Disable alignment when editor is disabled

## 92.0.12

- [patch][80cadc7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80cadc7):

  - ED-5861 - Fix panel style in order to render telepointers properly

## 92.0.11

- [patch][53c513c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/53c513c):

  - ED-5947: fix preserving CellSelection when clicking on context menu

## 92.0.10

- [patch][6d435cf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d435cf):

  - Fix issue where table contextual menu had incorrect styling when using a popups mount point outside of the editor

## 92.0.9

- Updated dependencies [00c648e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/00c648e):
- Updated dependencies [a17bb0e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a17bb0e):
- Updated dependencies [99f08a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/99f08a0):
  - @atlaskit/renderer@33.0.3
  - @atlaskit/status@0.3.0

## 92.0.8

- [patch][4611d97](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4611d97):

  - Remove hardcoded "unknown" value for mention's analytics 'source' attribute. In general the 'source' attribute is not meant to be set by components and are supposed to be populated by products.

- [patch][551696e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/551696e):

  - FS-3398 Fix incorrect event type for mention's "rendered" analytics event, ui -> operational

- [patch][77b3be7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/77b3be7):

  - FS-3398 Fix case typo in actionSubject of mention's "rendered" analytics event, mentionTypeAhead -> mentionTypeahead

- [patch][f6a1b31](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f6a1b31):

  - Remove 'query' attribute from mention's "rendered" analytics event. This attribute basically contains UGC and should not have been captured in the first place. It seems like it was added by accident as it wasn't part of the original specs.

- [patch][551696e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/551696e):

  - FS-3398 Fix incorrect event type for mention's "rendered" analytics event, ui -> operational

## 92.0.7

- [patch][7c10292](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c10292):

  - ED-5923: don't grow page while using resize handles on images

## 92.0.6

- Updated dependencies [135ed00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/135ed00):
  - @atlaskit/editor-common@25.0.3
  - @atlaskit/renderer@33.0.1
  - @atlaskit/media-core@24.7.2
  - @atlaskit/media-filmstrip@21.0.2
  - @atlaskit/media-picker@27.0.2
  - @atlaskit/media-test-helpers@18.7.2
  - @atlaskit/media-card@47.0.0

## 92.0.5

- [patch][50d9b26](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50d9b26):

  - ED-5806 Fix disappearing language in code block language picker

## 92.0.4

- [patch][be12a8e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/be12a8e):

  - Fix popup picker dismiss on escape for Jira

## 92.0.3

- [patch][88c8373](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/88c8373):

  - ED-5704: filtering out invalid marks from JSON output of editorActions.getValue()

## 92.0.2

- [patch][dc39f5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc39f5b):

  - ED-5956: don't close the typeaheads when calling getValue from EditorActions

## 92.0.1

- [patch][a83bedb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a83bedb):

  - Fix codeblock input rules inside unsupported blocks

## 92.0.0

- Updated dependencies [b3738ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3738ea):
- Updated dependencies [6cb6696](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6cb6696):
  - @atlaskit/editor-common@25.0.0
  - @atlaskit/renderer@33.0.0
  - @atlaskit/emoji@49.0.0
  - @atlaskit/media-card@46.0.0
  - @atlaskit/media-filmstrip@21.0.0
  - @atlaskit/media-picker@27.0.0
  - @atlaskit/editor-bitbucket-transformer@4.1.1
  - @atlaskit/editor-json-transformer@4.1.1
  - @atlaskit/editor-markdown-transformer@2.1.1
  - @atlaskit/editor-test-helpers@6.3.4
  - @atlaskit/task-decision@11.1.1
  - @atlaskit/util-data-test@10.0.28
  - @atlaskit/media-test-helpers@18.7.0
  - @atlaskit/media-core@24.7.0

## 91.2.2

- [patch][af32972](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af32972):

  - ED-5880: disable media layout buttons

## 91.2.1

- [patch][e714e7a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e714e7a):

  - ED-5667 Added hyperlink to quick insert

## 91.2.0

- [minor][b9f8a8f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9f8a8f):

  - Adding alignment options to media

## 91.1.4

- [patch][3780be2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3780be2):

  - Fix extension delete when media is selected

## 91.1.3

- [patch][462b70f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/462b70f):

  - ED-5819: Enables support for text color on mobile

## 91.1.2

- [patch][8be04eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8be04eb):

  - Remove option to change appearance mode on Smart Cards.

## 91.1.1

- [patch][9f444e9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f444e9):

  - ED-5882: fixed delayed scroll to top after page load

## 91.1.0

- [minor][1205725](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1205725):

  - Move schema to its own package

## 91.0.0

- [patch][8ae67fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8ae67fc):

  - Use stretchy-fit resizeMode for media card components instead of full-fit or undefined values;

- Updated dependencies [80f765b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80f765b):
  - @atlaskit/editor-common@23.0.0
  - @atlaskit/renderer@32.0.0
  - @atlaskit/emoji@48.0.0
  - @atlaskit/media-card@45.0.0
  - @atlaskit/media-filmstrip@20.0.0
  - @atlaskit/media-picker@26.0.0
  - @atlaskit/adf-utils@5.3.4
  - @atlaskit/editor-bitbucket-transformer@4.0.23
  - @atlaskit/editor-json-transformer@4.0.25
  - @atlaskit/editor-markdown-transformer@2.0.23
  - @atlaskit/editor-test-helpers@6.3.2
  - @atlaskit/task-decision@11.0.9
  - @atlaskit/util-data-test@10.0.26
  - @atlaskit/media-test-helpers@18.6.2
  - @atlaskit/media-core@24.6.0

## 90.4.7

- [patch][f621523](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f621523):

  - fix MediaMocker router

## 90.4.6

- [patch][feb276c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/feb276c):

  - Don't scroll cursor into view on remote transactions

## 90.4.5

- [patch][6beeada](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6beeada):

  - Don't hide media-picker on initialisation

## 90.4.4

- [patch][f083737](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f083737):

  - Fix copy-paste of external images

## 90.4.3

- [patch][4e483e7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e483e7):

  - ED-5900: store resize handle always as a number

## 90.4.2

- [patch][ebd73f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebd73f4):

  - ED-5880: allow breakout mode only in full-page editor

## 90.4.1

- Updated dependencies [67d563a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67d563a):
  - @atlaskit/date@0.2.0

## 90.4.0

- [minor][e06b553](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e06b553):

  - ED-5702: default new table resizing

## 90.3.18

- [patch][d3f3e19](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d3f3e19):

  - restored StatusContainer to editor-core, avoid re-rendering on event handlers, removed unused props in the renderer

- [patch][44cc61d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/44cc61d):

  - added native status analytics

## 90.3.17

- [patch][b81da9b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b81da9b):

  - Fix typescript types to support strictFunctionTypes

## 90.3.16

- [patch][43501db](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/43501db):

  - ED-5812: Fixes some regressions in the mobile editor

  Including:

  - Disables mediaGoup lazy loading.
  - Fixes unsupported emoji content.
  - Fixes missed call to Android bridge for block state.

## 90.3.15

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/avatar@14.1.7
  - @atlaskit/avatar-group@2.1.9
  - @atlaskit/button@10.1.1
  - @atlaskit/calendar@7.0.16
  - @atlaskit/code@8.2.2
  - @atlaskit/dropdown-menu@6.1.25
  - @atlaskit/droplist@7.0.17
  - @atlaskit/icon@15.0.2
  - @atlaskit/item@8.0.14
  - @atlaskit/logo@9.2.6
  - @atlaskit/lozenge@6.2.4
  - @atlaskit/modal-dialog@7.1.1
  - @atlaskit/section-message@1.0.14
  - @atlaskit/select@6.1.13
  - @atlaskit/size-detector@5.0.9
  - @atlaskit/spinner@9.0.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/tooltip@12.1.13
  - @atlaskit/adf-utils@5.3.2
  - @atlaskit/editor-bitbucket-transformer@4.0.21
  - @atlaskit/editor-json-transformer@4.0.24
  - @atlaskit/editor-markdown-transformer@2.0.22
  - @atlaskit/renderer@31.1.3
  - @atlaskit/analytics-gas-types@3.2.3
  - @atlaskit/analytics-namespaced-context@2.1.5
  - @atlaskit/date@0.1.9
  - @atlaskit/emoji@47.0.7
  - @atlaskit/mention@15.1.8
  - @atlaskit/pubsub@3.0.7
  - @atlaskit/status@0.2.10
  - @atlaskit/task-decision@11.0.8
  - @atlaskit/util-data-test@10.0.25
  - @atlaskit/util-service-support@3.0.5
  - @atlaskit/media-card@44.1.3
  - @atlaskit/media-core@24.5.2
  - @atlaskit/media-filmstrip@19.0.3
  - @atlaskit/media-picker@25.0.6
  - @atlaskit/smart-card@9.0.4
  - @atlaskit/docs@6.0.0

## 90.3.14

- [patch][b22d7e9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b22d7e9):

  - FS-3309 - Include native status in insert menu when enabled

## 90.3.13

- [patch][9a1dbaa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a1dbaa):

  - Fixed toolbar being positioned over a panel at the bottom of the page

## 90.3.12

- [patch][85b71a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85b71a9):

  - ED-5704: Fixed invalid ADF sent when saving and mention/quickInsert/emoji is active

## 90.3.11

- [patch][e0c91b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e0c91b6):

  - FS-3310 Fix handling of duplicate users in mention typeahead causing HOT-85672

## 90.3.10

- [patch][fa596d9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa596d9):

  - display videos as mediaGroup for now

## 90.3.9

- [patch][7190767](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7190767):

  - Fixes empty collection name and API naming mismatches

## 90.3.8

- [patch][7fdfac1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7fdfac1):

  - FS-3269 - Ensure status attributes are read even if in mark

## 90.3.7

- [patch][f0398a5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f0398a5):

  - Display media singles with video inside as inline video player

## 90.3.6

- [patch][a60d8cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a60d8cd):

  - FS-3278 - Prevent overflow of status in a table cell.

## 90.3.5

- [patch][ef1df96](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef1df96):

  - Remove unused deps

## 90.3.4

- [patch][3c2c367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c2c367):

  - FS-3261 - Fix status selection growing as font size increases

## 90.3.3

- [patch][5390041](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5390041):

  - FS-3160 - Prevent editor crash in some deletion use cases for status

## 90.3.2

- [patch][48640fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48640fb):

  - FS-3227 - Prevent status popup focus from scrolling editor

## 90.3.1

- [patch][dcd8f90](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dcd8f90):

  - Fix bug where gap cursor would remove previous node on backspace

## 90.3.0

- [minor][a1b03d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1b03d0):

  - ED-3890 Adds Indentation support on paragraphs and headings

  **New Feature: Indentation**

  Use the new `allowIndentation` prop to enable this feature.

  ```
  // Enable indentation support for `heading` and `paragraph`
  allowIndentation?: boolean;
  ```

  **Minor bug fixes**

  - ED-5841 Alignment is getting removed inside Table on load
  - ED-5842 Alignment mark aligns empty placeholder
  - ED-5843 Remove block marks on backspace when document is empty
  - ED-5846 Fix React warning in renderer
  - ED-5863 Fix alignment copy-paste
  - ED-5865 Alignment shouldn't be disabled when Cmd + A

## 90.2.2

- [patch][1668ce3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1668ce3):

  - Wrap kitchen sink in smart card provider.

## 90.2.1

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/avatar-group@2.1.8
  - @atlaskit/button@10.0.4
  - @atlaskit/calendar@7.0.15
  - @atlaskit/code@8.2.1
  - @atlaskit/dropdown-menu@6.1.24
  - @atlaskit/droplist@7.0.16
  - @atlaskit/icon@15.0.1
  - @atlaskit/item@8.0.13
  - @atlaskit/logo@9.2.5
  - @atlaskit/modal-dialog@7.0.14
  - @atlaskit/section-message@1.0.13
  - @atlaskit/select@6.1.10
  - @atlaskit/spinner@9.0.12
  - @atlaskit/tooltip@12.1.12
  - @atlaskit/editor-common@22.2.3
  - @atlaskit/renderer@31.0.7
  - @atlaskit/date@0.1.8
  - @atlaskit/emoji@47.0.6
  - @atlaskit/mention@15.1.7
  - @atlaskit/pubsub@3.0.6
  - @atlaskit/status@0.2.8
  - @atlaskit/task-decision@11.0.7
  - @atlaskit/smart-card@9.0.2
  - @atlaskit/theme@7.0.0
  - @atlaskit/avatar@14.1.6
  - @atlaskit/lozenge@6.2.3

## 90.2.0

- [minor][94094fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/94094fe):

  - Adds support for links around images

## 90.1.0

- [minor][fef6755](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fef6755):

  - Change the way we deal with transactions in collab edit

## 90.0.0

- [major][3a7224a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a7224a):

  - ED-5677: enabled quickInsert and gapCursor by default (quickInsert: except for mobile appearance)

## 89.1.3

- [patch][0e72eb6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e72eb6):

  - Revert box-sizing change for node views

## 89.1.2

- [patch][cf4e304](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cf4e304):

  - Fixed toolbar being positioned over a panel at the bottom of the page

## 89.1.1

- [patch][3061b52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3061b52):

  - AK-5723 - adjust files in package.json to ensure correct publishing of dist/package.json

## 89.1.0

- [minor][7c9dcba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c9dcba):

  - Responsive wide breakout mode

## 89.0.8

- [patch][6c90bb9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c90bb9):

  - Fix mention plugin state in plugin

## 89.0.7

- Updated dependencies [df32968](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df32968):
  - @atlaskit/editor-test-helpers@6.2.22
  - @atlaskit/renderer@31.0.4
  - @atlaskit/smart-card@9.0.0

## 89.0.6

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/smart-card@8.8.5
  - @atlaskit/docs@5.2.2
  - @atlaskit/avatar@14.1.5
  - @atlaskit/avatar-group@2.1.7
  - @atlaskit/button@10.0.1
  - @atlaskit/calendar@7.0.14
  - @atlaskit/dropdown-menu@6.1.23
  - @atlaskit/droplist@7.0.14
  - @atlaskit/item@8.0.12
  - @atlaskit/modal-dialog@7.0.13
  - @atlaskit/section-message@1.0.12
  - @atlaskit/select@6.1.9
  - @atlaskit/tooltip@12.1.11
  - @atlaskit/editor-common@22.0.2
  - @atlaskit/editor-test-helpers@6.2.21
  - @atlaskit/renderer@31.0.3
  - @atlaskit/emoji@47.0.2
  - @atlaskit/mention@15.1.3
  - @atlaskit/status@0.2.6
  - @atlaskit/task-decision@11.0.6
  - @atlaskit/media-card@44.0.2
  - @atlaskit/media-filmstrip@19.0.2
  - @atlaskit/media-picker@25.0.3
  - @atlaskit/media-test-helpers@18.3.1
  - @atlaskit/icon@15.0.0

## 89.0.5

- [patch][2db96d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2db96d3):

  - Adjust min-width nodes to support table resizing

## 89.0.4

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/avatar@14.1.4
  - @atlaskit/avatar-group@2.1.6
  - @atlaskit/calendar@7.0.13
  - @atlaskit/dropdown-menu@6.1.22
  - @atlaskit/droplist@7.0.13
  - @atlaskit/icon@14.6.1
  - @atlaskit/logo@9.2.4
  - @atlaskit/modal-dialog@7.0.12
  - @atlaskit/section-message@1.0.11
  - @atlaskit/select@6.1.8
  - @atlaskit/spinner@9.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/tooltip@12.1.10
  - @atlaskit/renderer@31.0.2
  - @atlaskit/emoji@47.0.1
  - @atlaskit/pubsub@3.0.5
  - @atlaskit/task-decision@11.0.5
  - @atlaskit/media-card@44.0.1
  - @atlaskit/media-core@24.5.1
  - @atlaskit/media-filmstrip@19.0.1
  - @atlaskit/media-picker@25.0.2
  - @atlaskit/smart-card@8.8.4
  - @atlaskit/button@10.0.0
  - @atlaskit/analytics-next-types@3.1.2

## 89.0.3

- [patch][1e8d316](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e8d316):

  - ED-5819: Fixes emitting text color plugin state on every key stroke, without the state changing.

## 89.0.2

- [patch][a2cae0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2cae0c):

  - Fix conversion of pasted urls via macroPlugin with html in clipboard (ED-5786)

## 89.0.1

- [patch][086f816](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/086f816):

  - FS-3150 - Support status in the editor-mobile-bridge

## 89.0.0

- Updated dependencies [7e8b4b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e8b4b9):
  - @atlaskit/editor-common@22.0.0
  - @atlaskit/renderer@31.0.0
  - @atlaskit/emoji@47.0.0
  - @atlaskit/media-card@44.0.0
  - @atlaskit/media-filmstrip@19.0.0
  - @atlaskit/media-picker@25.0.0
  - @atlaskit/adf-utils@5.1.9
  - @atlaskit/editor-bitbucket-transformer@4.0.19
  - @atlaskit/editor-json-transformer@4.0.22
  - @atlaskit/editor-markdown-transformer@2.0.20
  - @atlaskit/editor-test-helpers@6.2.19
  - @atlaskit/task-decision@11.0.4
  - @atlaskit/util-data-test@10.0.21
  - @atlaskit/media-test-helpers@18.3.0
  - @atlaskit/media-core@24.5.0

## 88.5.3

- [patch][dfcb816](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dfcb816):

  - ED-5818: Add support for inserting block nodes

  Bridge API now supports inserting:

  - Tables
  - Panels
  - Codeblocks
  - Block Quotes
  - Actions
  - Decisions

## 88.5.2

- [patch][b73607f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b73607f):

  - ED-5770: fix resizer for media @ 0 and non-dynamic text sizes

- [patch][7a9f647](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7a9f647):

  - ensure toolbar always appears even if media re-renders (e.g. resizer)

## 88.5.1

- [patch][ab6d96b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab6d96b):

  - ED-5710: Fixes calling media upfront.

  We now only call for the media auth, when rendering / loading a media item.

## 88.5.0

- [minor][cfba914](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfba914):

  - ED-5771: fix wide and full-width images in renderer

## 88.4.4

- [patch][416fbb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/416fbb3):

  - ED-3298: codeBlocks inside lists

## 88.4.3

- [patch][96c125b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/96c125b):

  - Fixes an issue where using arrow keys to navigate between mention nodes would put the cursor in unexpected locations.

## 88.4.2

- [patch][6e4570d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e4570d):

  - Add height check when rendering images

## 88.4.1

- [patch][8974838](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8974838):

  - Do not wrap in breakout a paragraph inserted after code block

## 88.4.0

- [minor][6d6522b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d6522b):

  - Refactor mentions to use TypeAhead plugin

## 88.3.0

- [patch][43f178a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/43f178a):

  - ED-5813: Added type safety to width plugin.

- [minor][1e5cd32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e5cd32):

  - Make layouts stack on small screens

## 88.2.14

- [patch][1ac6286](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ac6286):

  - Fixes width plugin continuing without valid transaction state

## 88.2.13

- [patch][37313f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/37313f8):

  - Remove preprocessDoc because it was removing empty tasks & decisionItems

## 88.2.12

- [patch][1358f62](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1358f62):

  - ED-5717: deduped quick insert provided items

## 88.2.11

- [patch][a706ffd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a706ffd):

  ED-4427 Editor disabled state applies to floating toolbars and task decision checkboxes

## 88.2.10

- [patch][368e858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/368e858):

  - ED-5570 Fixed long URLs wrapping in editor panel

## 88.2.9

- [patch][70a104dc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70a104dc):

  - ED-5802: fix merging rows when rowspan > 1 in neighbour columns

## 88.2.8

- [patch][04abea3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/04abea3):

  - ED-5186: Always show scroll bar, to avoid page shift.

## 88.2.7

- [patch][4e2a3b1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e2a3b1):

  - ED-5809 Fixes code mark getting removed from document

## 88.2.6

- [patch][899b377](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/899b377):

  - ED-5750: fix selection for merged cells when its created by dragging mouse across table cells

## 88.2.5

- [patch][4ad840a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4ad840a):

  - Adds resize property to fix media without dimensions

## 88.2.4

- [patch][a458d03](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a458d03):

  - ED-5713: Quick insert aliases

## 88.2.3

- [patch][8d30d62](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d30d62):

  - ED-5774: add breakout for Columns

## 88.2.2

- [patch][9a66a9b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a66a9b):

  - Add Confluence cards in Editor example.

## 88.2.1

- [patch][16ff8d2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/16ff8d2):

  - Add jira card editor example.

## 88.2.0

- [minor][14477fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/14477fa):

  - Adding text alignment to editor and renderer

## 88.1.14

- [patch][380928b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/380928b):

  - ED-5293: fix merging cells

## 88.1.13

- [patch][f9d1245](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9d1245):

  - Fixes pasting from Microsoft & Apple office products (ED-5694, ED-5575)

## 88.1.12

- [patch][cc78d09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc78d09):

  - ED-5196: For a block as first node in a document, up and left arrow should show a gap cursor

## 88.1.11

- [patch][4897ebf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4897ebf):

  - ED-4777 Toggling list no longer selects previous text

## 88.1.10

- [patch][ac02f46](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ac02f46):

  - ED-5499 ToolbarFeedback now accepts metadata that appears in feedback ticket

## 88.1.9

- [patch][6cb44c4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6cb44c4):

  - ED-5162: fix table selection for merged cells

## 88.1.8

- [patch][e151c1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e151c1a):

  - Removes dependency on @atlaskit/layer-manager

  As of component versions:

  - \`@atlaskit/modal-dialog@7.0.0\`
  - \`@atlaskit/tooltip@12.0.2\`
  - \`@atlaskit/flag@9.0.6\`
  - \`@atlaskit/onboarding@6.0.0\`

  No component requires \`LayerManager\` to layer correctly.

  You can safely remove this dependency and stop rendering \`LayerManager\` in your apps.

## 88.1.7

- [patch][8262781](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8262781):

  - Fix floating toolbars overlaping with main editor toolbar

## 88.1.6

- [patch][50aa9d2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50aa9d2):

  - Refactor transform-to-code command

## 88.1.5

- [patch][60087ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60087ec):

  - Remove decorators

## 88.1.4

- [patch][5c148c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5c148c8):

  - ED-5739: fix updating cells DOM attributes when deleting rows/columns

## 88.1.3

- [patch][68f3e01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/68f3e01):

  - ED-5687: add full-width grid lines and other resizing fixes

## 88.1.2

- [patch][93e576a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93e576a):

  - ED-5651: Typing // causes editor to disregard text

## 88.1.1

- [patch][9072682](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9072682):

  - Fix emoticons alignment

## 88.1.0

- [minor][b440439](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b440439):

  - Add breakout mark to editor, renderer and adf-utils

## 88.0.11

- [patch][6ef824b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ef824b):

  - Fix import of re-resizable

## 88.0.10

- [patch][d518ce0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d518ce0):

  - FS-3118 - Only focus status input field on initial insertion. FS-3158 - Fix focus flicker in status input field.

## 88.0.9

- [patch][6efc73e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6efc73e):

  - allow Fabric status plugin to be enabled but be hidden in the editor menu

## 88.0.8

- [patch][9390a7e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9390a7e):

  - ED-5685: add grid ruler marks

## 88.0.7

- [patch][c64c174](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c64c174):

  - Fix multiple papercuts in quick insert

## 88.0.6

- [patch][82ad72d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/82ad72d):

  - Timestamp on date node must always be a string

## 88.0.5

- [patch][beefae2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/beefae2):

  - Updated type definitions for prosemirror packages

## 88.0.4

- [patch][2e1b194](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e1b194):

  - Revert collab changes

## 88.0.3

- [patch][222082a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/222082a):

  - Fix incorrect import of PanelType

## 88.0.2

- [patch][ffcaedd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ffcaedd):

  - FS-2964 Implement status node placeholder support. Handle removing if no content in node

## 88.0.1

- [patch][8059325](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8059325):

  - Fix delete doing nothing

## 88.0.0

- Updated dependencies [2c21466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c21466):
  - @atlaskit/editor-common@21.0.0
  - @atlaskit/renderer@30.0.0
  - @atlaskit/emoji@46.0.0
  - @atlaskit/media-card@43.0.0
  - @atlaskit/media-filmstrip@18.0.0
  - @atlaskit/media-picker@24.0.0
  - @atlaskit/adf-utils@5.0.1
  - @atlaskit/editor-bitbucket-transformer@4.0.18
  - @atlaskit/editor-json-transformer@4.0.21
  - @atlaskit/editor-markdown-transformer@2.0.19
  - @atlaskit/editor-test-helpers@6.2.16
  - @atlaskit/task-decision@11.0.2
  - @atlaskit/util-data-test@10.0.20
  - @atlaskit/media-test-helpers@18.2.12
  - @atlaskit/media-core@24.4.0

## 87.9.5

- [patch][e1db106](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e1db106):

  - ED-5696 Allow private properties in adf-validator

  `table` with `__autoSize`, `link` with `__confluenceMetadata` will render properly.

## 87.9.4

- [patch][bce23bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bce23bc):

  - Change style of status selection

## 87.9.3

- [patch][e6c4231](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6c4231):

  - ED-5639: fix deleting columns in Safari

## 87.9.2

- Updated dependencies [04c7192](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/04c7192):
  - @atlaskit/editor-common@20.3.7
  - @atlaskit/renderer@29.5.1
  - @atlaskit/media-core@24.3.1
  - @atlaskit/media-filmstrip@17.0.2
  - @atlaskit/media-picker@23.2.2
  - @atlaskit/media-test-helpers@18.2.11
  - @atlaskit/media-card@42.0.0

## 87.9.1

- [patch][676a586](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/676a586):

  - ED-5024 Quick insert improvements

## 87.9.0

- [minor][2cc9764](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2cc9764):

  - Change the way we deal with transactions in collab edit

## 87.8.2

- [patch][a9eb99f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a9eb99f):

  - ED-5510: fix deleting last character in a cell in Safari

## 87.8.1

- [patch][1764e1c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1764e1c):

  - ED-5215: don't insert paragraph when inserting rule if another follows

## 87.8.0

- [minor][f17f0a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f17f0a6):

  - ED-5448: support macro autoconversion in actions

## 87.7.5

- [patch][fb6b89b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fb6b89b):

  - Revert "Add buffer to the bottom of fullpage editor"

## 87.7.4

- [patch][8f1073c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8f1073c):

  - ED-5572 Fixes copying 2+ lines from vs-code pastes as inline code

## 87.7.3

- [patch][825d4e9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/825d4e9):

  Fix copying codeblock from renderer

- [patch][9489ed2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9489ed2):

  ED-4544 Added integration tests for panel

## 87.7.2

- [patch][c032914](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c032914):

  - ED-2043: Added table keyboard shortcut

## 87.7.1

- [patch][e8afbf1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8afbf1):

  - ED-5310: fix inline code background appearing when wrapping

## 87.7.0

- [minor][abef80b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abef80b):

  - ED-5527: apply max-width: 100% and pass container size to Card as dimension

## 87.6.18

- [patch][9f26f82](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f26f82):

  - Removing extra padding inside the comment editor

## 87.6.17

- [patch][aef4235](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aef4235):

  - Fix range selection

## 87.6.16

- [patch][7bc4461](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7bc4461):

  - ED-5565: support connecting external React.Context to nodeviews

## 87.6.15

- [patch][e8052e1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8052e1):

  - Add main field to adf-utils package.json

## 87.6.14

- [patch][7787595](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7787595):

  - ED-4359: don't change selection when deleting filmstrip item

## 87.6.13

- [patch][71b59ae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/71b59ae):

  - Fixed Datepicker showing rendering outside viewport

## 87.6.12

- [patch][12855b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12855b9):

  - ED-5511: tweaked quickInsert so that query can match space-separated items

## 87.6.11

- [patch][0e0a126](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e0a126):

  - Fixed cursor when adding hyperlink on existing piece of text using Cmd-K

## 87.6.10

- [patch][941a687](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/941a687):

  Bump i18n-tools and refactor to support babel-plugin-transform-typescript

## 87.6.9

- [patch][31653d9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/31653d9):

  - Fixed clicking between date pickers doesn't show correct date

## 87.6.8

- [patch][8b084d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b084d0):

  - Fix unsupported node event name

## 87.6.7

- [patch][6a0a6f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6a0a6f8):

  - ED-5448, ED-5613, ED-5582: smart card UX improvements; allow blockCard in tableCell

## 87.6.6

- [patch][c39507e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c39507e):

  - ED-5561 Single media honors scale factor from media-picker

## 87.6.5

- [patch][f713993](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f713993):

  - ED-5537: table ux improvements

## 87.6.4

- [patch][2dd9ae3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2dd9ae3):

  - ED-4979 When in the an unindentable list item, tab should do nothing

## 87.6.3

- [patch][563c4da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563c4da):

  - ED-5149 Fixed DatePicker calendar shadow in table

## 87.6.2

- [patch][7459970](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7459970):

  - ED-5263: handle rows and columns shift selection

## 87.6.1

- [patch][bdc9961" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bdc9961"
  d):

  - Fixes the codeblock insert rules

## 87.6.0

- [minor][bb3336a" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb3336a"
  d):

  - Make text formatting toolbar account for different item titles legnths

## 87.5.0

- [minor][d182ad9" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d182ad9"
  d):

  - Add <-> to ↔︎ convertion rule

## 87.4.3

- [patch][8fb4b1e" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fb4b1e"
  d):

  - ED-5274 Fixes tables have excessive margin above

## 87.4.2

- [patch][4cc767e" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4cc767e"
  d):

  - ED-5030: Fixed gap-cursor on nodeviews in breakout mode.

## 87.4.1

- [patch][abd19cd" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abd19cd"
  d):

  - ED-5616: fix inline cursor navigation

## 87.4.0

- [minor][5981cec" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5981cec"
  d):

  - TypeAhead to preserve marks

## 87.3.2

- [patch][14d581b" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/14d581b"
  d):

  - Disable clear formatting menu when there is no formatting

## 87.3.1

- [patch][52f5b51" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/52f5b51"
  d):

  - ED-4366: fix text selection inside table cell on triple click

## 87.3.0

- [minor][b911028" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b911028"
  d):

  - Show selected color in a table contextual menu

## 87.2.0

- [minor][746c927" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/746c927"
  d):

  - Add buffer to the bottom fullpage editor

## 87.1.13

- [patch][f3d067d" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f3d067d"
  d):

  - Fix font size for numbered column in tables with dynamic text sizing

## 87.1.12

- [patch][534f6ab" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/534f6ab"
  d):

  - ED-5615: Fix block element padding inside table cells.

## 87.1.11

- [patch][cb4168f" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cb4168f"
  d):

  - ED-5307: make text white for selected heading menu item

## 87.1.10

- [patch][db65837" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/db65837"
  d):

  - ED-3762: fix setting text cursor when clicking on editor gutter

## 87.1.9

- [patch][25cdb93](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25cdb93):

  Fix copying codeblock from renderer

## 87.1.8

- [patch][3c505aa" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c505aa"
  d):

  - Adds Danish and Romanian translations

## 87.1.7

- [patch][fc20259](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc20259):

  ED-4544 Added integration tests for panel

## 87.1.6

- [patch][6201223" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6201223"
  d):

  - Add examples.

## 87.1.5

- [patch][1662ae0" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1662ae0"
  d):

  - ED-5440 convert sections to use percentages

## 87.1.4

- [patch][d00326b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d00326b):

  Prevent delete-button from disappearing when the mouse is moved

## 87.1.3

- [patch][f271431](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f271431):

  ED-5179: fix context menu when table has scroll

## 87.1.2

- [patch] Fix floating number validation [ea027b8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea027b8)

## 87.1.1

- [patch] ED-5439: add block smart cards, toolbar switcher [5f8bdfe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f8bdfe)

## 87.1.0

- [minor] Wrap invalid node with unsupported node [fb60e39](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fb60e39)

## 87.0.6

- [patch] ED-5564 Fix wrong ADF for code block when language is selected [5db3cfe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5db3cfe)

## 87.0.5

- [patch] Fixes cursor position between mention nodes [2748f31](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2748f31)

## 87.0.4

- [patch] ED-5521: permit undo when pasting macro [c429e3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c429e3c)

## 87.0.3

- [patch] ED-5375 Improved typing to reduce noImplictAny errors (not yet enabled) [62da999](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/62da999)

## 87.0.2

- [patch] Async load datepicker [c38e5a5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c38e5a5)

## 87.0.1

- [patch] Updated dependencies [9add3a4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9add3a4)
  - @atlaskit/media-picker@23.0.0

## 87.0.0

- [major] Media refactor and fileID upfront [052ce89](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/052ce89)
- [patch] Updated dependencies [2f9d14d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2f9d14d)
  - @atlaskit/media-card@41.1.0
  - @atlaskit/media-picker@22.0.0
  - @atlaskit/media-filmstrip@17.0.1
  - @atlaskit/media-test-helpers@18.2.9

## 86.0.10

- [patch] Show color and initial of collab-participants in overflow menu [900ccb8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/900ccb8)

## 86.0.9

- [patch] Lock typeahead to cursor position [81e28c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/81e28c8)

## 86.0.8

- [patch] New translations (Task & Decisions) [03addbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/03addbd)

## 86.0.7

- [patch] ED-5410: handle rows/columns cutting [b792d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b792d04)

## 86.0.6

- [patch] Scroll selection into view when navigating with arrows [01edbc7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/01edbc7)

## 86.0.5

- [patch] Fix race condition in size detector that sometimes leads to width being always 0 [ce97910](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce97910)

## 86.0.4

- [patch] Change breakpoints for dynamic text sizing [f660016](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f660016)

## 86.0.3

- [patch] Async load the help dialog. The help dialog shouldn't be on the critical path to rendering as it's infrequently used. It's also the only consumer of ak/modal-dialog(9kb gzipped) [5d6333d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5d6333d)

## 86.0.2

- [patch] ED-5533: fix insert line decorations on merged cells [d421f39](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d421f39)

## 86.0.1

- [patch] Async load the floating toolbar. This remove @atlaskit/select & react-select from the critical path of rendering the editor [e55dcde](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e55dcde)

## 86.0.0

- [major] Updated dependencies [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)
  - @atlaskit/editor-common@20.0.0
  - @atlaskit/renderer@29.0.0
  - @atlaskit/emoji@45.0.0
  - @atlaskit/media-card@41.0.0
  - @atlaskit/media-filmstrip@17.0.0
  - @atlaskit/media-picker@21.0.0
  - @atlaskit/editor-bitbucket-transformer@4.0.16
  - @atlaskit/editor-json-transformer@4.0.18
  - @atlaskit/editor-markdown-transformer@2.0.17
  - @atlaskit/editor-test-helpers@6.2.7
  - @atlaskit/task-decision@11.0.1
  - @atlaskit/util-data-test@10.0.16
  - @atlaskit/media-core@24.3.0
  - @atlaskit/media-test-helpers@18.2.8

## 85.6.0

- [minor] FS-1311 - i18n support for task-decsions. task-decisions now require the placeholder text to be passed in. [8a1ccf2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a1ccf2)

## 85.5.3

- [patch] ED-5524: fix insert column button when numbered column is on [555079c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/555079c)

## 85.5.2

- [patch] ED-5366: fix scrolling when media is pasted inside table cell [eef51cf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eef51cf)

## 85.5.1

- [patch] Updated dependencies [6e510d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e510d8)
  - @atlaskit/task-decision@10.0.3
  - @atlaskit/editor-common@19.3.2
  - @atlaskit/media-core@24.2.2
  - @atlaskit/media-filmstrip@16.0.1
  - @atlaskit/media-picker@20.0.1
  - @atlaskit/media-test-helpers@18.2.7
  - @atlaskit/renderer@28.0.0
  - @atlaskit/media-card@40.0.0

## 85.5.0

- [minor] Deprecate quickInsert prop [c595e8d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c595e8d)

## 85.4.2

- [patch] ED-5494: fix nested breakout nodes [1eaf1f1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1eaf1f1)

## 85.4.1

- [patch] ED-5289 add toolbar for inline smart card [25d7af7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d7af7)

## 85.4.0

- [minor] FS-2901 - Move action toolbar icon to insert group [57502ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/57502ac)

## 85.3.1

- [patch] Updated dependencies [17afe04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/17afe04)
  - @atlaskit/media-picker@20.0.0

## 85.3.0

- [minor] Replaces util-shared-styles with theme. ED-5351 [55a4f00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/55a4f00)

## 85.2.3

- [patch] ED-2644 Fixes panels merging incorrectly when deleting empty paragraph [967edcc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/967edcc)

## 85.2.2

- [patch] ED-5468: simplify floating toolbar config resolution [1c795f2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c795f2)

## 85.2.1

- [patch] Fix popups are placed incorrectly in modals [2dde31d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2dde31d)

## 85.2.0

- [minor] Summary: Deprecate props, add support for new API. ED-5201 [00e4bb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/00e4bb3)

## 85.1.0

- [minor] ED-5370 refactor legacy image-upload plugin [fb10ad4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fb10ad4)

## 85.0.1

- [patch] ED-5453: implement table scroll shadow in CSS [4f21dac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4f21dac)

## 85.0.0

- [major] Updated dependencies [2afa60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2afa60d)
  - @atlaskit/editor-common@19.0.0
  - @atlaskit/renderer@27.0.0
  - @atlaskit/emoji@44.0.0
  - @atlaskit/media-card@39.0.0
  - @atlaskit/media-filmstrip@16.0.0
  - @atlaskit/media-picker@19.0.0
  - @atlaskit/editor-bitbucket-transformer@4.0.15
  - @atlaskit/editor-json-transformer@4.0.17
  - @atlaskit/editor-markdown-transformer@2.0.16
  - @atlaskit/editor-test-helpers@6.2.6
  - @atlaskit/task-decision@10.0.2
  - @atlaskit/util-data-test@10.0.14
  - @atlaskit/media-test-helpers@18.2.5
  - @atlaskit/media-core@24.2.0

## 84.1.0

- [minor] ED-3889 use color and error-reporter from @atlaskit/editor-core [f924735](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f924735)

## 84.0.1

- [patch] Upgrade markdown-it to reduce duplicate dependencies [a27ace1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a27ace1)

## 84.0.0

- [major] Updated dependencies [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [major] Updated dependencies [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)
  - @atlaskit/editor-common@18.0.0
  - @atlaskit/renderer@26.0.0
  - @atlaskit/emoji@43.0.0
  - @atlaskit/media-card@38.0.0
  - @atlaskit/media-filmstrip@15.0.0
  - @atlaskit/media-picker@18.0.0
  - @atlaskit/editor-bitbucket-transformer@4.0.14
  - @atlaskit/editor-json-transformer@4.0.16
  - @atlaskit/editor-markdown-transformer@2.0.14
  - @atlaskit/editor-test-helpers@6.2.5
  - @atlaskit/task-decision@10.0.1
  - @atlaskit/util-data-test@10.0.12
  - @atlaskit/media-core@24.1.0
  - @atlaskit/media-test-helpers@18.2.3

## 83.0.0

- [major] Upgrade task and decisions and editor to use @atlaskit/analytics-next. Remove usage of @atlaskit/analytics. [23c7eca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/23c7eca)

## 82.5.6

- [patch] ED-5291 Quick insert search now only matches from the start of words [ea8237d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea8237d)

## 82.5.5

- [patch] ED-5454: only render insert row/column buttons when needed [16d17e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/16d17e3)

## 82.5.4

- [patch] change grey to gray to keep consistent across editor pkgs [1b2a0b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b2a0b3)

## 82.5.3

- [patch] Support custom rendering for typeahead items [8e0925d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8e0925d)

## 82.5.2

- [patch] center media toolbar; be more selective when resize is enabled [98ca1de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98ca1de)

## 82.5.1

- [patch] ED-5471 Fix show media single without height or width [a352169](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a352169)

## 82.5.0

- [minor] Allow empty content under doc [47d50ad](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/47d50ad)

## 82.4.2

- [patch] ED-5457: moving table css classnames to a const [2e1f627](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e1f627)

## 82.4.1

- [patch] ED-5452: Dynamically add/remove decorations in tables [04b0fde](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/04b0fde)

## 82.4.0

- [minor] ED-5246 support image resizing [111d02f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/111d02f)

## 82.3.1

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/avatar@14.0.11
  - @atlaskit/avatar-group@2.1.3
  - @atlaskit/button@9.0.13
  - @atlaskit/calendar@7.0.9
  - @atlaskit/dropdown-menu@6.1.17
  - @atlaskit/droplist@7.0.10
  - @atlaskit/item@8.0.8
  - @atlaskit/layer-manager@5.0.13
  - @atlaskit/modal-dialog@7.0.2
  - @atlaskit/select@6.0.2
  - @atlaskit/tooltip@12.1.1
  - @atlaskit/editor-common@17.0.7
  - @atlaskit/renderer@24.2.1
  - @atlaskit/emoji@42.0.1
  - @atlaskit/mention@15.0.10
  - @atlaskit/status@0.2.1
  - @atlaskit/task-decision@9.0.1
  - @atlaskit/media-card@37.0.1
  - @atlaskit/media-filmstrip@14.0.3
  - @atlaskit/media-picker@17.0.2
  - @atlaskit/media-test-helpers@18.2.1
  - @atlaskit/icon@14.0.0

## 82.3.0

- [minor] ED-5060 Code blocks now use new floating toolbar [756184e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/756184e)

## 82.2.12

- [patch] ED-5331 Fixed code-block gap cursor bug and editor crashing after several quick blurs [203eb2c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/203eb2c)

## 82.2.11

- [patch] Update i18n example to not load all locales [0c66f75](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c66f75)

## 82.2.10

- [patch] ED-5424: fix telepointers in collab editing [643a860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/643a860)

## 82.2.9

- [patch] Better positioning of hyperlink edit popups [f247b16](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f247b16)

## 82.2.8

- [patch] New translations [e4730b0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e4730b0)

## 82.2.7

- [patch] Updated copy in Butbucket feedback prompt [533e624](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/533e624)

## 82.2.6

- [patch] Updated dependencies [dae7792](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dae7792)
  - @atlaskit/editor-common@17.0.5
  - @atlaskit/renderer@24.1.1
  - @atlaskit/media-core@24.0.2
  - @atlaskit/media-filmstrip@14.0.2
  - @atlaskit/media-picker@17.0.1
  - @atlaskit/smart-card@8.2.2
  - @atlaskit/media-card@37.0.0
  - @atlaskit/media-test-helpers@18.2.0

## 82.2.5

- [patch] Fix image markdown tip in help dialog [79465ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79465ec)

## 82.2.4

- [patch] Add translations for help-dialog and colors [42a2916](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42a2916)

## 82.2.3

- [patch] Add translation for quick insert [d6c438c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d6c438c)

## 82.2.2

- [patch] ED-5421: avoid adding PM history record for simple table interactions [c6cb409](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6cb409)

## 82.2.1

- [patch] ED-5357: getting rid of ak components in table controls [83ca3e9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/83ca3e9)

## 82.2.0

- [minor] FS-2963 When inserting a status, I can pick a colour from a predefined colour picker [a633d77](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a633d77)
- [minor] FS-2963 Change status color [547b3d9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/547b3d9)

## 82.1.2

- [patch] Numbered column in table should be able to fit number > 100 [7a43676](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7a43676)

## 82.1.1

- [patch] ED-5151 Editor i18n: Floating toolbars [403b547](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/403b547)

## 82.1.0

- [minor] FS-2893 - Creation use cases for full page actions and decisions [c8aa5f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8aa5f5)

## 82.0.3

- [patch] ED-5243 add grid plugin [4e5ef5c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e5ef5c)

## 82.0.2

- [patch] ED-5356: getting rid of styled-components in tables [5bc39da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5bc39da)

## 82.0.1

- [patch] updated 'actionSubject' of mention typeahead's analytics events to be 'mentionTypeahead' [3147456](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3147456)

## 82.0.0

- [major] ED-5150 Editor i18n: Main toolbar [ef76f1f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef76f1f)

## 81.0.0

- [major] Updated dependencies [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
  - @atlaskit/editor-common@17.0.0
  - @atlaskit/util-data-test@10.0.10
  - @atlaskit/editor-test-helpers@6.1.2
  - @atlaskit/renderer@24.0.0
  - @atlaskit/emoji@42.0.0
  - @atlaskit/media-card@36.0.0
  - @atlaskit/media-filmstrip@14.0.0
  - @atlaskit/media-picker@17.0.0
  - @atlaskit/editor-bitbucket-transformer@4.0.11
  - @atlaskit/editor-json-transformer@4.0.12
  - @atlaskit/editor-markdown-transformer@2.0.10
  - @atlaskit/media-core@24.0.0
  - @atlaskit/media-test-helpers@18.0.0
  - @atlaskit/task-decision@9.0.0

## 80.5.3

- [patch] ED-5346: prosemirror upgrade [5bd4432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5bd4432)

## 80.5.2

- [patch] Fix floating toolbar position in a table with scroll [8da7574](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8da7574)

## 80.5.1

- [patch] Updated dependencies [1be4bb8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1be4bb8)
  - @atlaskit/editor-common@16.2.1
  - @atlaskit/renderer@23.0.1
  - @atlaskit/media-core@23.2.1
  - @atlaskit/media-filmstrip@13.0.2
  - @atlaskit/media-picker@16.0.6
  - @atlaskit/media-card@35.0.0

## 80.5.0

- [minor] Add dynamic text sizing support to renderer and editor [2a6410f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2a6410f)

## 80.4.14

- [patch] Fixing floating toolbar always showing top left in comments editor. ED-5348 [f36ae3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f36ae3c)

## 80.4.13

- [patch] fix styles for nested tables [11267a8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11267a8)

## 80.4.12

- [patch] reverting table style change [b829ab9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b829ab9)

## 80.4.11

- [patch] ED-5335: fix table when it has nested extension that renders another table [21f315b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21f315b)

## 80.4.10

- [patch] Fixes text selection that ends at the start of the next cell. ED-5050 [f5c365d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f5c365d)

## 80.4.9

- [patch] Removing underline active in code mark selection [e54422a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e54422a)

## 80.4.8

- [patch] Updated dependencies [4194aa4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4194aa4)
  - @atlaskit/logo@9.2.2
  - @atlaskit/smart-card@8.1.2
  - @atlaskit/select@6.0.0

## 80.4.7

- [patch] Fixing the mobile appearance height [b0f6402](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0f6402)

## 80.4.6

- [patch] Adding renderer to the mobile bridge [3b4c276](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3b4c276)

## 80.4.5

- [patch] ED-5017 Toolbar buttons no longer steal focus when tabbing into editor [e656038](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e656038)

## 80.4.4

- [patch] bump media-picker [9411569](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9411569)

## 80.4.3

- [patch] Fix the empty progress bar inside tables [1beaf5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1beaf5b)

## 80.4.2

- [patch] Show mediaSingle with default width when no width is defined in ADF [03af1bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/03af1bd)

## 80.4.1

- [patch] Fixing the scroll after setting content on Mobile [0a03e2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a03e2d)

## 80.4.0

- [minor] Add new experimental table resizing, behind flag. ED-4679 [b66227e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b66227e)
- [none] Updated dependencies [b66227e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b66227e)

## 80.3.1

- [patch] Fixes remapping a table cell pos on collab modes changes and ensure its an element node. ED-5305 [dacbc18](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dacbc18)

## 80.3.0

- [minor] Adds ability to load document snapshot from collab service [3708304](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3708304)

## 80.2.1

- [patch] Fix popup positioning when inside overflow:auto containers [affe5df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/affe5df)

## 80.2.0

- [minor] FS-2961 Introduce status component and status node in editor [7fe2b0a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7fe2b0a)

## 80.1.0

- [minor] Add analytics events for pasting from different sources [486963b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/486963b)

## 80.0.1

- [patch] Handle the fact that remoteUploadId may not exist and not break cloud uploads [c2317af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2317af)

## 80.0.0

- [major] Updated dependencies [6e1d642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e1d642)
  - @atlaskit/editor-common@16.0.0
  - @atlaskit/renderer@22.0.0
  - @atlaskit/emoji@41.0.0
  - @atlaskit/media-card@34.0.0
  - @atlaskit/media-filmstrip@13.0.0
  - @atlaskit/media-picker@16.0.0
  - @atlaskit/editor-bitbucket-transformer@4.0.10
  - @atlaskit/editor-json-transformer@4.0.11
  - @atlaskit/editor-markdown-transformer@2.0.9
  - @atlaskit/editor-test-helpers@6.0.9
  - @atlaskit/task-decision@8.1.9
  - @atlaskit/util-data-test@10.0.9
  - @atlaskit/media-core@23.2.0
  - @atlaskit/media-test-helpers@17.1.0

## 79.0.14

- [patch] Show cell background menu on the left if no available space remains. ED-5155 [ef1c98d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef1c98d)

## 79.0.13

- [patch] ED-5165, fixing issue with inline code autoformatting removing other formattings in line. [9a7f8b2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a7f8b2)

## 79.0.12

- [patch] Update TS to 3.0 [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
- [none] Updated dependencies [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
  - @atlaskit/media-test-helpers@17.0.2
  - @atlaskit/media-picker@15.1.2
  - @atlaskit/media-filmstrip@12.0.1
  - @atlaskit/media-core@23.1.1
  - @atlaskit/emoji@40.0.2
  - @atlaskit/mention@15.0.9
  - @atlaskit/editor-json-transformer@4.0.10
  - @atlaskit/editor-common@15.0.7
  - @atlaskit/media-card@33.0.2
  - @atlaskit/renderer@21.0.7
  - @atlaskit/editor-test-helpers@6.0.8

## 79.0.11

- [patch] Renamed labelling of horizontal rule to divider [ef248cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef248cc)

## 79.0.10

- [patch] Fixes changing a tables position in collab mode which throws an error as it loses its dom reference. ED-5305 [b64e86e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b64e86e)

## 79.0.9

- [patch] Fixes toolbar config resolution when node is an atom or a leaf. ED-5301 [e937aa0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e937aa0)

## 79.0.8

- [patch] Save async loaded modules on static field to save a rerender [5b3f37f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b3f37f)

## 79.0.7

- [patch] Updated dependencies [d5a043a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5a043a)
  - @atlaskit/icon@13.8.1
  - @atlaskit/layer-manager@5.0.12
  - @atlaskit/select@5.0.17
  - @atlaskit/media-picker@15.0.2
  - @atlaskit/tooltip@12.0.14
  - @atlaskit/modal-dialog@7.0.0

## 79.0.6

- [patch] Updated dependencies [9c66d4d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c66d4d)
  - @atlaskit/layer-manager@5.0.10
  - @atlaskit/select@5.0.16
  - @atlaskit/editor-common@15.0.5
  - @atlaskit/media-picker@15.0.1
  - @atlaskit/webdriver-runner@0.1.0

## 79.0.5

- [patch] "userAuthProvider" property removed from all the media-picker configs; Optional "shouldCopyFileToRecents" property added to all media-picker configs; "tenantUploadParams" is removed since "uploadParams" is already a tenant one; "copyFileToRecents" is removed from UploadParams; [048f488](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/048f488)

## 79.0.4

- [patch] ED-4680 add smart card plugin, enable for inline smart cards [b9529e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9529e6)

## 79.0.3

- [patch] propagate sessionId to the mentionTypeahead rendered event and service endpoints [0c37666](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c37666)

## 79.0.2

- [patch] ED-3919: Fix typography and other styles, align styles between editor and renderer [d0f9293](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0f9293)

## 79.0.1

- [patch] Append timestamp in image files for Clipboard component [da65dec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da65dec)
- [patch] Updated dependencies [da65dec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da65dec)
  - @atlaskit/media-picker@14.0.1
  - @atlaskit/renderer@21.0.1
  - @atlaskit/editor-common@15.0.1

## 79.0.0

- [major] Updated dependencies [7545979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7545979)
  - @atlaskit/editor-common@15.0.0
  - @atlaskit/renderer@21.0.0
  - @atlaskit/emoji@40.0.0
  - @atlaskit/media-card@33.0.0
  - @atlaskit/media-filmstrip@12.0.0
  - @atlaskit/media-picker@14.0.0
  - @atlaskit/editor-bitbucket-transformer@4.0.9
  - @atlaskit/editor-json-transformer@4.0.8
  - @atlaskit/editor-markdown-transformer@2.0.8
  - @atlaskit/editor-test-helpers@6.0.6
  - @atlaskit/task-decision@8.1.7
  - @atlaskit/util-data-test@10.0.8
  - @atlaskit/media-core@23.1.0

## 78.0.8

- [patch] Fix broken import blocking confluence [5545403](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5545403)

## 78.0.7

- [patch] ED-5280: Revert 68a0978 due to issues with Confluence. The IntlProviders were clashing and preventing Confluence from internationalising the elements inside the editor. [ab71cd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab71cd1)

## 78.0.6

- [patch] ED-5101, align z-index of all floating things inside editor. [52ad431](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/52ad431)
- [none] Updated dependencies [52ad431](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/52ad431)
  - @atlaskit/editor-common@14.0.14

## 78.0.5

- [patch] move tests under src [fd063e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fd063e3)

## 78.0.4

- [patch] Stop Grammarly from attempting to hook into the editor [e9db931](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e9db931)

## 78.0.3

- [patch] Update Page Layout sizing to be more compact, fix quick-insert icon, fix issue with Popup not centering toolbar in certain situations [1effb83](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1effb83)

## 78.0.2

- [patch] ED-5172 pressing enter after media single in list no longer deletes list [74824f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/74824f8)

## 78.0.1

- [patch] "update dependencies" [9ab9471](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ab9471)

## 78.0.0

- [major] Remove new upload service feature flag (useNewUploadService). Now new upload service will be used by default. [911a570](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/911a570)
- [patch] Updated dependencies [911a570](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/911a570)
  - @atlaskit/media-test-helpers@17.0.0
  - @atlaskit/media-picker@13.0.0
  - @atlaskit/media-filmstrip@11.0.2
  - @atlaskit/media-core@23.0.2
  - @atlaskit/editor-json-transformer@4.0.7
  - @atlaskit/editor-bitbucket-transformer@4.0.8
  - @atlaskit/editor-markdown-transformer@2.0.7
  - @atlaskit/media-card@32.0.6
  - @atlaskit/renderer@20.1.1
  - @atlaskit/editor-test-helpers@6.0.5

## 77.2.3

- [patch] Adding support for telepointers in new collab provider [cc35c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc35c67)
- [none] Updated dependencies [cc35c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc35c67)

## 77.2.2

- [patch] ED-5153, add react-intl to editor and expose locale support. [68a0978](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/68a0978)
- [patch] Updated dependencies [68a0978](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/68a0978)

## 77.2.1

- [patch] Check current selected nodes before change node selection when interacting with extensions. ED-5199 [bb15908](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb15908)

## 77.2.0

- [minor] Disable table context menu if advanced table features aren't enabled. ED-5252 [5ad6057](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ad6057)
- [none] Updated dependencies [5ad6057](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ad6057)

## 77.1.5

- [patch] New floating toolbar for extensions [23437c0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/23437c0)
- [none] Updated dependencies [23437c0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/23437c0)

## 77.1.4

- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/renderer@20.0.11
  - @atlaskit/task-decision@8.1.6
  - @atlaskit/util-data-test@10.0.7
  - @atlaskit/editor-common@14.0.11
  - @atlaskit/editor-test-helpers@6.0.3
  - @atlaskit/editor-markdown-transformer@2.0.6
  - @atlaskit/mention@15.0.6
  - @atlaskit/emoji@39.1.1
  - @atlaskit/editor-json-transformer@4.0.6
  - @atlaskit/editor-bitbucket-transformer@4.0.7
  - @atlaskit/media-card@32.0.5
  - @atlaskit/media-picker@12.1.2
  - @atlaskit/media-filmstrip@11.0.1

## 77.1.3

- [patch] Updated dependencies [dd91bcf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd91bcf)
  - @atlaskit/emoji@39.1.0
  - @atlaskit/renderer@20.0.10
  - @atlaskit/editor-common@14.0.10

## 77.1.2

- [patch] Minor changes to collab plugin [02cef16](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/02cef16)
- [none] Updated dependencies [02cef16](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/02cef16)

## 77.1.1

- [patch] Fixes renderer tables for Mobile [7f1ef74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f1ef74)
- [none] Updated dependencies [7f1ef74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f1ef74)
  - @atlaskit/editor-common@14.0.9

## 77.1.0

- [minor] Rename UNSAFE_allowLayouts to allowLayouts. ED-4198 [b0e9bcb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0e9bcb)
- [none] Updated dependencies [b0e9bcb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0e9bcb)

## 77.0.17

- [patch] Allow simple text elements in the block type insert menu. ED-5225 [3836740](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3836740)
- [none] Updated dependencies [3836740](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3836740)

## 77.0.16

- [patch] Fixed input-rule em and strong markdown regex matching to correctly match words with a prefix before a later pair found [5350da0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5350da0)
- [none] Updated dependencies [5350da0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5350da0)

## 77.0.15

- [patch] ED-4411, fix for smartinsert of single quotes. [c452857](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c452857)
- [patch] Updated dependencies [c452857](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c452857)

## 77.0.14

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/task-decision@8.1.5
  - @atlaskit/emoji@39.0.4
  - @atlaskit/date@0.1.2
  - @atlaskit/renderer@20.0.7
  - @atlaskit/tooltip@12.0.9
  - @atlaskit/spinner@9.0.6
  - @atlaskit/select@5.0.9
  - @atlaskit/modal-dialog@6.0.9
  - @atlaskit/lozenge@6.1.5
  - @atlaskit/layer-manager@5.0.6
  - @atlaskit/item@8.0.5
  - @atlaskit/icon@13.2.5
  - @atlaskit/droplist@7.0.7
  - @atlaskit/code@8.0.1
  - @atlaskit/calendar@7.0.5
  - @atlaskit/button@9.0.6
  - @atlaskit/avatar-group@2.1.1
  - @atlaskit/avatar@14.0.8
  - @atlaskit/docs@5.0.6

## 77.0.13

- [patch] ED-5178: added card node to default schema [51e7446](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/51e7446)
- [none] Updated dependencies [51e7446](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/51e7446)
  - @atlaskit/editor-test-helpers@6.0.2
  - @atlaskit/editor-common@14.0.8

## 77.0.12

- [patch] Updated dependencies [f9c0cdb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c0cdb)
  - @atlaskit/code@8.0.0
  - @atlaskit/renderer@20.0.6
  - @atlaskit/logo@9.0.4
  - @atlaskit/avatar-group@2.0.8
  - @atlaskit/docs@5.0.5

## 77.0.11

- [patch] ED-5190: fixed mediaSingle styles in renderer [4f09dea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4f09dea)
- [none] Updated dependencies [4f09dea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4f09dea)
  - @atlaskit/renderer@20.0.5
  - @atlaskit/editor-common@14.0.6

## 77.0.10

- [patch] When removing a media group with a code block below it, prevent the editor from crashing when it references an invalid pos. ED-5207 [4b11a78](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b11a78)
- [none] Updated dependencies [4b11a78](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b11a78)

## 77.0.9

- [patch] Fix bug in CodeBlocks where indenting with a selection at the start of the document would change your cursor-selection, to a range-selection for the purpose of indenting [4cd8ae6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4cd8ae6)
- [none] Updated dependencies [4cd8ae6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4cd8ae6)

## 77.0.8

- [patch] If datepicker is open, close on enter. ED-5210 [1b16711](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b16711)
- [none] Updated dependencies [1b16711](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b16711)

## 77.0.7

- [patch] Updated dependencies [79f780a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79f780a)
  - @atlaskit/media-picker@12.1.1
  - @atlaskit/editor-common@14.0.2

## 77.0.6

- [patch] FS-2819 use aria-label as selector rather than closest [84a7235](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84a7235)
- [none] Updated dependencies [84a7235](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84a7235)
  - @atlaskit/emoji@39.0.3

## 77.0.5

- [patch] Fixing editor blowing up when code mark is disabled [968da74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/968da74)
- [none] Updated dependencies [968da74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/968da74)

## 77.0.4

- [patch] FS-2815 - Only close emoji picker when disabled (in case pending open state changes) [4f5d786](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4f5d786)
- [patch] Ensure emoji picker doesn't reopen after toolbar reenabled, if previously open. [5d2c0c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5d2c0c6)
- [none] Updated dependencies [4f5d786](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4f5d786)
- [none] Updated dependencies [5d2c0c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5d2c0c6)

## 77.0.3

- [patch] Remove items from toolbar if the prop is disabled [7c46965](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c46965)
- [none] Updated dependencies [7c46965](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c46965)

## 77.0.2

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [patch] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/media-card@32.0.1
  - @atlaskit/media-picker@12.0.1
  - @atlaskit/task-decision@8.1.4
  - @atlaskit/util-data-test@10.0.4
  - @atlaskit/mention@15.0.5
  - @atlaskit/emoji@39.0.1
  - @atlaskit/editor-common@14.0.1
  - @atlaskit/date@0.1.1
  - @atlaskit/analytics-next-types@3.0.1
  - @atlaskit/tooltip@12.0.5
  - @atlaskit/select@5.0.8
  - @atlaskit/logo@9.0.3
  - @atlaskit/modal-dialog@6.0.6
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/calendar@7.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/lozenge@6.1.4
  - @atlaskit/code@7.0.3
  - @atlaskit/spinner@9.0.5
  - @atlaskit/size-detector@5.0.4
  - @atlaskit/layer@5.0.4
  - @atlaskit/analytics@4.0.4
  - @atlaskit/layer-manager@5.0.5
  - @atlaskit/item@8.0.4
  - @atlaskit/icon@13.2.4
  - @atlaskit/droplist@7.0.5
  - @atlaskit/avatar-group@2.0.7
  - @atlaskit/avatar@14.0.6

## 77.0.1

- [patch] Stop editor from blowing up inside dispatchTransaction if editorView is undefined [49b0733](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49b0733)
- [none] Updated dependencies [49b0733](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49b0733)

## 77.0.0

- [none] Updated dependencies [597e0bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/597e0bd)
  - @atlaskit/renderer@20.0.0
  - @atlaskit/task-decision@8.1.3
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/emoji@39.0.0
  - @atlaskit/editor-json-transformer@4.0.4
  - @atlaskit/editor-bitbucket-transformer@4.0.6
  - @atlaskit/editor-test-helpers@6.0.0
  - @atlaskit/editor-markdown-transformer@2.0.5
  - @atlaskit/editor-common@14.0.0
- [none] Updated dependencies [61df453](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/61df453)
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/editor-common@14.0.0
  - @atlaskit/editor-test-helpers@6.0.0
  - @atlaskit/editor-markdown-transformer@2.0.5
  - @atlaskit/task-decision@8.1.3
  - @atlaskit/emoji@39.0.0
  - @atlaskit/renderer@20.0.0
  - @atlaskit/editor-json-transformer@4.0.4
  - @atlaskit/editor-bitbucket-transformer@4.0.6
- [none] Updated dependencies [812a39c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/812a39c)
  - @atlaskit/renderer@20.0.0
  - @atlaskit/task-decision@8.1.3
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/emoji@39.0.0
  - @atlaskit/editor-json-transformer@4.0.4
  - @atlaskit/editor-bitbucket-transformer@4.0.6
  - @atlaskit/editor-test-helpers@6.0.0
  - @atlaskit/editor-markdown-transformer@2.0.5
  - @atlaskit/editor-common@14.0.0
- [none] Updated dependencies [c8eb097](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8eb097)
  - @atlaskit/renderer@20.0.0
  - @atlaskit/task-decision@8.1.3
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/editor-common@14.0.0
  - @atlaskit/editor-test-helpers@6.0.0
  - @atlaskit/editor-markdown-transformer@2.0.5
  - @atlaskit/emoji@39.0.0
  - @atlaskit/editor-json-transformer@4.0.4
  - @atlaskit/editor-bitbucket-transformer@4.0.6
- [major] Updated dependencies [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
  - @atlaskit/media-test-helpers@16.0.0
  - @atlaskit/media-picker@12.0.0
  - @atlaskit/media-filmstrip@11.0.0
  - @atlaskit/media-core@23.0.0
  - @atlaskit/emoji@39.0.0
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/task-decision@8.1.3
  - @atlaskit/editor-json-transformer@4.0.4
  - @atlaskit/editor-bitbucket-transformer@4.0.6
  - @atlaskit/editor-common@14.0.0
  - @atlaskit/editor-markdown-transformer@2.0.5
  - @atlaskit/media-card@32.0.0
  - @atlaskit/renderer@20.0.0
  - @atlaskit/editor-test-helpers@6.0.0

## 76.4.11

- [patch] ED-5023 Quick insert now appears in help dialog when it is enabled [93c9b37](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93c9b37)
- [none] Updated dependencies [93c9b37](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93c9b37)

## 76.4.10

- [patch] fixed broken tests and added test for util/analytics [57b9d1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/57b9d1e)

* [none] Updated dependencies [8eced90](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8eced90)
  - @atlaskit/mention@15.0.3
* [none] Updated dependencies [57b9d1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/57b9d1e)
  - @atlaskit/mention@15.0.3
* [none] Updated dependencies [0bc5732](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0bc5732)
  - @atlaskit/mention@15.0.3
* [none] Updated dependencies [c536e60](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c536e60)
  - @atlaskit/mention@15.0.3

## 76.4.9

- [patch] Updated dependencies [59ccb09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59ccb09)
  - @atlaskit/media-card@31.3.0
  - @atlaskit/media-picker@11.2.2
  - @atlaskit/media-filmstrip@10.2.2
  - @atlaskit/renderer@19.2.7
  - @atlaskit/editor-common@13.2.8

## 76.4.8

- [patch] Prevents editor from crashing when hitting backspace on selected date node. ED-5168 [c360f18](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c360f18)
- [none] Updated dependencies [c360f18](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c360f18)

## 76.4.7

- [patch] Adding conditional controls render [0ed8bcf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ed8bcf)
- [none] Updated dependencies [0ed8bcf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ed8bcf)

## 76.4.6

- [patch] isOpen never renders the menu, check if we have an appropriate selection before rendering [f72ad6c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f72ad6c)
- [none] Updated dependencies [f72ad6c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f72ad6c)

## 76.4.5

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/select@5.0.7
  - @atlaskit/media-card@31.2.1
  - @atlaskit/media-picker@11.2.1
  - @atlaskit/media-filmstrip@10.2.1
  - @atlaskit/renderer@19.2.6
  - @atlaskit/task-decision@8.1.2
  - @atlaskit/util-data-test@10.0.2
  - @atlaskit/mention@15.0.2
  - @atlaskit/emoji@38.0.5
  - @atlaskit/editor-json-transformer@4.0.3
  - @atlaskit/editor-bitbucket-transformer@4.0.5
  - @atlaskit/editor-common@13.2.7
  - @atlaskit/editor-test-helpers@5.1.2
  - @atlaskit/editor-markdown-transformer@2.0.3
  - @atlaskit/logo@9.0.2
  - @atlaskit/tooltip@12.0.4
  - @atlaskit/layer-manager@5.0.4
  - @atlaskit/item@8.0.3
  - @atlaskit/icon@13.2.2
  - @atlaskit/calendar@7.0.3
  - @atlaskit/button@9.0.4
  - @atlaskit/media-core@22.2.1
  - @atlaskit/media-test-helpers@15.2.1
  - @atlaskit/theme@5.1.2
  - @atlaskit/lozenge@6.1.3
  - @atlaskit/code@7.0.2
  - @atlaskit/spinner@9.0.4
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/analytics-gas-types@3.1.2
  - @atlaskit/size-detector@5.0.3
  - @atlaskit/layer@5.0.3
  - @atlaskit/analytics@4.0.3
  - @atlaskit/droplist@7.0.4
  - @atlaskit/avatar-group@2.0.4
  - @atlaskit/avatar@14.0.5
  - @atlaskit/modal-dialog@6.0.5

## 76.4.4

- [patch] FS-2131 add date element [b026429](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b026429)
- [patch] Updated dependencies [b026429](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b026429)
  - @atlaskit/date@0.1.0

## 76.4.3

- [patch] ED-4825, copying single line of code should create inline code mark. [c99642b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c99642b)
- [patch] Updated dependencies [c99642b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c99642b)

## 76.4.2

- [patch] Bump prosemirror-model to 1.6 in order to use toDebugString on Text node spec [fdd5c5d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd5c5d)
- [none] Updated dependencies [fdd5c5d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd5c5d)
  - @atlaskit/renderer@19.2.5
  - @atlaskit/editor-common@13.2.6
  - @atlaskit/editor-test-helpers@5.1.1
  - @atlaskit/editor-markdown-transformer@2.0.2
  - @atlaskit/editor-json-transformer@4.0.2
  - @atlaskit/editor-bitbucket-transformer@4.0.4

## 76.4.1

- [patch] Make typeahead keymap work in a list [a7d7421](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a7d7421)
- [none] Updated dependencies [a7d7421](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a7d7421)

## 76.4.0

- [minor] MediaPicker Popup now supports passing of optional parent react context as a parameter [25ef2e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25ef2e4)
- [minor] Updated dependencies [25ef2e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25ef2e4)
  - @atlaskit/media-picker@11.2.0
  - @atlaskit/editor-test-helpers@5.1.0

## 76.3.6

- [patch] When you select Date from the quick insert menu, we now auto open the date picker. ED-5016 [f85d035](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f85d035)
- [none] Updated dependencies [f85d035](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f85d035)

## 76.3.5

- [patch] ED-5147: do not render context menu if its closed [633f27a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/633f27a)
- [none] Updated dependencies [633f27a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/633f27a)

## 76.3.4

- [patch] Fixed ToolbarButton to respond to spacing prop [ec1595e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec1595e)
- [none] Updated dependencies [ec1595e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec1595e)

## 76.3.3

- [patch] Clone previous rows colspan and cell attrs if any. ED-4991 [a5f1c5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a5f1c5b)
- [none] Updated dependencies [a5f1c5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a5f1c5b)

## 76.3.2

- [patch] When copying a table respect the table layout and cell attributes. ED-4947 [d25b42c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d25b42c)
- [none] Updated dependencies [d25b42c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d25b42c)
  - @atlaskit/editor-common@13.2.5

## 76.3.1

- [patch] Updated dependencies [7fa84a2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7fa84a2)
  - @atlaskit/media-filmstrip@10.2.0
  - @atlaskit/renderer@19.2.4
  - @atlaskit/media-card@31.2.0

## 76.3.0

- [minor] Add priority for quick search menu items and improve search [eaa974b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eaa974b)
- [none] Updated dependencies [eaa974b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eaa974b)

## 76.2.13

- [patch] Cleaning up plugin ranks [ce2a71b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce2a71b)
- [none] Updated dependencies [ce2a71b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce2a71b)

## 76.2.12

- [patch] ED-5147: set targetCellRef to undefined when table looses focus [d805071](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d805071)
- [none] Updated dependencies [d805071](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d805071)

## 76.2.11

- [patch] ED-4995: added support for the rest of the page layout types in the renderer [9d9acfa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d9acfa)
- [none] Updated dependencies [9d9acfa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d9acfa)
  - @atlaskit/renderer@19.2.3
  - @atlaskit/editor-common@13.2.4

## 76.2.10

- [patch] Updated dependencies [3485c00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3485c00)
  - @atlaskit/media-picker@11.1.2
  - @atlaskit/editor-common@13.2.3
  - @atlaskit/media-core@22.2.0
  - @atlaskit/media-card@31.1.1

## 76.2.9

- [patch] ED-5126: fix codeblock language picker is loosing focus on click [6a3ca70](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6a3ca70)
- [none] Updated dependencies [6a3ca70](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6a3ca70)

## 76.2.8

- [patch] Internal refactor of hyperlink plugin to not contain direct references to the view in plugin state. ED-4962 [dda4cab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dda4cab)
- [none] Updated dependencies [dda4cab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dda4cab)

## 76.2.7

- [patch] FS-2020 add session id to typeahead plugin inside editor [5ae463f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ae463f)
- [none] Updated dependencies [5ae463f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ae463f)
  - @atlaskit/mention@15.0.1
  - @atlaskit/analytics-gas-types@3.1.1

## 76.2.6

- [patch] ED-4977 Fixed extra newline after blockquote in Firefox [ac47c1c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ac47c1c)
- [none] Updated dependencies [ac47c1c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ac47c1c)

## 76.2.5

- [patch] ED-5090: added contextual menu [2cb70d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2cb70d8)
- [none] Updated dependencies [2cb70d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2cb70d8)

## 76.2.4

- [patch] ED-5033, fixes for multiple date related issues. [c9911e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c9911e0)
- [patch] Updated dependencies [c9911e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c9911e0)
  - @atlaskit/renderer@19.2.2
  - @atlaskit/editor-common@13.2.2

## 76.2.3

- [patch] Updated dependencies [fad25ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fad25ec)
  - @atlaskit/media-test-helpers@15.2.0
  - @atlaskit/media-picker@11.1.1
  - @atlaskit/media-core@22.1.0
  - @atlaskit/editor-common@13.2.1
  - @atlaskit/media-card@31.1.0
  - @atlaskit/renderer@19.2.1
  - @atlaskit/editor-test-helpers@5.0.3

## 76.2.2

- [patch] Change tab-size to 4 spaces wide inside a code-block. [d089d0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d089d0f)
- [patch] Support backspacing an entire intent level inside code-block. ED-4864 [86998f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/86998f3)
- [patch] Fix issue where bracket-autocompletion would work for any closing bracket even when it didn't match the opening bracket. [952eab1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/952eab1)
- [none] Updated dependencies [d089d0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d089d0f)
- [none] Updated dependencies [86998f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/86998f3)
- [none] Updated dependencies [952eab1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/952eab1)

## 76.2.1

- [patch] ED-5043: only disable dropzone for popup picker [9878d57](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9878d57)
- [none] Updated dependencies [9878d57](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9878d57)

## 76.2.0

- [patch] Updated dependencies [fa6f865](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa6f865)
  - @atlaskit/media-card@31.0.0
  - @atlaskit/media-picker@11.1.0
  - @atlaskit/media-filmstrip@10.1.0
  - @atlaskit/renderer@19.2.0
  - @atlaskit/editor-common@13.2.0
  - @atlaskit/media-test-helpers@15.1.0
- [none] Updated dependencies [fdd03d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd03d8)
  - @atlaskit/media-card@31.0.0
  - @atlaskit/media-picker@11.1.0
  - @atlaskit/media-filmstrip@10.1.0
  - @atlaskit/renderer@19.2.0
  - @atlaskit/editor-common@13.2.0
  - @atlaskit/media-test-helpers@15.1.0
- [patch] Updated dependencies [49c8425](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49c8425)
  - @atlaskit/media-card@31.0.0
  - @atlaskit/media-picker@11.1.0
  - @atlaskit/media-filmstrip@10.1.0
  - @atlaskit/renderer@19.2.0
  - @atlaskit/editor-common@13.2.0
  - @atlaskit/media-test-helpers@15.1.0
- [minor] Updated dependencies [3476e01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3476e01)
  - @atlaskit/media-card@31.0.0
  - @atlaskit/media-picker@11.1.0
  - @atlaskit/media-filmstrip@10.1.0
  - @atlaskit/renderer@19.2.0
  - @atlaskit/editor-common@13.2.0

## 76.1.0

- [minor] Updated dependencies [f6bf6c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f6bf6c8)
  - @atlaskit/mention@15.0.0
  - @atlaskit/util-data-test@10.0.1
  - @atlaskit/renderer@19.1.0
  - @atlaskit/editor-common@13.1.0

## 76.0.25

- [patch] Corrected gap size between more and italic icons in editor toolbar [92cf9d4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92cf9d4)
- [none] Updated dependencies [92cf9d4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92cf9d4)

## 76.0.24

- [patch] Fixing the Mobile appearance height [a79b962](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a79b962)
- [none] Updated dependencies [a79b962](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a79b962)

## 76.0.23

- [patch] ED-4961 refactor block-type plugin [b88ca64](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b88ca64)
- [none] Updated dependencies [b88ca64](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b88ca64)

## 76.0.22

- [patch] ED-5022, quick insert should not be triggered for key combination (/. [5588225](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5588225)
- [patch] Updated dependencies [5588225](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5588225)

## 76.0.21

- [patch] Allow empty alt tags, add better support for titles. ED-4751 [37fc5af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/37fc5af)
- [none] Updated dependencies [37fc5af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/37fc5af)

## 76.0.20

- [patch] ED-5089, fixing styling of items in block-type dropdown menu. [65683ed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65683ed)
- [patch] Updated dependencies [65683ed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65683ed)

## 76.0.19

- [patch] ED-4954 Fixed toolbar button hight to be consistant with icons [8f1d665](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8f1d665)
- [none] Updated dependencies [8f1d665](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8f1d665)

## 76.0.18

- [patch] Update icons for Layouts to reflect new design [fc59e6b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc59e6b)
- [none] Updated dependencies [fc59e6b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc59e6b)

## 76.0.17

- [patch] Refactor text-color plugin to new architecture. ED-4965 [f21bea7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f21bea7)
- [none] Updated dependencies [f21bea7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f21bea7)

## 76.0.16

- [patch] ED-4960, refactoring text formatting plugin. [f4a0996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f4a0996)
- [none] Updated dependencies [f4a0996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f4a0996)

## 76.0.15

- [patch] Add support for switching between different layout styles via the toolbar. ED-4196 [ab7dcd4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab7dcd4)
- [none] Updated dependencies [ab7dcd4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab7dcd4)

## 76.0.14

- [patch] Make sure we linkify slice when pasting into task and decision. ED-4728 [e37b5ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e37b5ea)
- [none] Updated dependencies [e37b5ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e37b5ea)

## 76.0.13

- [patch] FS-2816 - Prevent clicks in pop ups from triggering focus of the message editor [247855f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/247855f)
- [none] Updated dependencies [247855f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/247855f)
  - @atlaskit/editor-common@13.0.8

## 76.0.12

- [patch] Fix floating toolbar dropdown poisitoning [9f8dd6a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8dd6a)
- [none] Updated dependencies [9f8dd6a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8dd6a)

## 76.0.11

- [patch] Fix issue where we would not show code block toolbar when inserting code block via insert-menu. ED-4982 [8260943](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8260943)
- [none] Updated dependencies [8260943](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8260943)

## 76.0.10

- [patch] Updated dependencies [b1e8a47](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1e8a47)
  - @atlaskit/layer@5.0.1
  - @atlaskit/renderer@19.0.5
  - @atlaskit/editor-common@13.0.7

## 76.0.9

- [patch] Fix some decisionItem, taskItem, and panel nodeViews [af33ec7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af33ec7)
- [none] Updated dependencies [af33ec7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af33ec7)

## 76.0.8

- [patch] Choose to re-render entire task item when empty or if TODO/DONE state has changed [10cb299](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10cb299)
- [none] Updated dependencies [10cb299](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10cb299)

## 76.0.7

- [patch] FS-2800 - Fix selection when changing between actions and decisions [685abd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/685abd1)
- [none] Updated dependencies [685abd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/685abd1)

## 76.0.6

- [patch] Obfuscate internal editor class-name "content-area" to prevent clashes with product css [7ddf1eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ddf1eb)
- [none] Updated dependencies [7ddf1eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ddf1eb)

## 76.0.5

- [patch] New floating toolbar for Panel [4d528ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d528ab)
- [none] Updated dependencies [4d528ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d528ab)
  - @atlaskit/renderer@19.0.3
  - @atlaskit/editor-common@13.0.5

## 76.0.4

- [patch] Fallback to use containerId from MentionResourceConfig if ContextIdentifier promise fails [5ecb9a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ecb9a7)
- [patch] add support for childObjectId in ContextIdentifiers and pass it to the mention service endpoints [6e31eb6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e31eb6)
- [none] Updated dependencies [5ecb9a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ecb9a7)
  - @atlaskit/mention@14.0.2
  - @atlaskit/editor-test-helpers@5.0.2
  - @atlaskit/editor-common@13.0.4
- [patch] Updated dependencies [6e31eb6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e31eb6)
  - @atlaskit/mention@14.0.2
  - @atlaskit/editor-test-helpers@5.0.2
  - @atlaskit/editor-common@13.0.4

## 76.0.3

- [patch] Improves type coverage by removing casts to any [8928280](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8928280)
- [none] Updated dependencies [8928280](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8928280)
  - @atlaskit/editor-common@13.0.3

## 76.0.2

- [patch] ED-4956, moving decision menu item to insert menu drop-down. [4e11c66](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e11c66)
- [none] Updated dependencies [4e11c66](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e11c66)

## 76.0.1

- [patch] Updated dependencies [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/tooltip@12.0.0
  - @atlaskit/media-card@30.0.1
  - @atlaskit/mention@14.0.1
  - @atlaskit/emoji@38.0.1
  - @atlaskit/select@5.0.1
  - @atlaskit/layer-manager@5.0.1
  - @atlaskit/item@8.0.1
  - @atlaskit/icon@13.1.1
  - @atlaskit/droplist@7.0.1
  - @atlaskit/avatar-group@2.0.1
  - @atlaskit/avatar@14.0.1

## 76.0.0

- [minor] Add styles for all different page-layout options. Add appendTransaction handler to ensure that only validate page-layouts ever get added to the document. ED-4197 [25353c3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25353c3)
- [major] ED-3701: editor exports cleanup [38c0543](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/38c0543)
- [none] Updated dependencies [25353c3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25353c3)
  - @atlaskit/editor-test-helpers@5.0.1
  - @atlaskit/editor-markdown-transformer@2.0.1
  - @atlaskit/editor-json-transformer@4.0.1
  - @atlaskit/editor-bitbucket-transformer@4.0.1
- [none] Updated dependencies [38c0543](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/38c0543)
  - @atlaskit/editor-test-helpers@5.0.1
  - @atlaskit/editor-markdown-transformer@2.0.1
  - @atlaskit/editor-json-transformer@4.0.1
  - @atlaskit/editor-bitbucket-transformer@4.0.1

## 75.0.3

- [patch] ED-5004: unwrap content from table on paste [0ab457a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ab457a)
- [none] Updated dependencies [0ab457a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ab457a)

## 75.0.2

- [patch] ED-5064: disable layout options when table is nested [efda6f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/efda6f5)
- [none] Updated dependencies [efda6f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/efda6f5)

## 75.0.1

- [patch] ED-4665: fix rows/cols selection in IE 11 [2e37e7a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e37e7a)
- [none] Updated dependencies [2e37e7a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e37e7a)

## 75.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/media-card@30.0.0
  - @atlaskit/media-picker@11.0.0
  - @atlaskit/media-filmstrip@10.0.0
  - @atlaskit/renderer@19.0.0
  - @atlaskit/task-decision@8.0.0
  - @atlaskit/util-data-test@10.0.0
  - @atlaskit/editor-json-transformer@4.0.0
  - @atlaskit/editor-bitbucket-transformer@4.0.0
  - @atlaskit/editor-common@13.0.0
  - @atlaskit/editor-test-helpers@5.0.0
  - @atlaskit/editor-markdown-transformer@2.0.0
  - @atlaskit/mention@14.0.0
  - @atlaskit/emoji@38.0.0
  - @atlaskit/select@5.0.0
  - @atlaskit/logo@9.0.0
  - @atlaskit/modal-dialog@6.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/calendar@7.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/media-core@22.0.0
  - @atlaskit/media-test-helpers@15.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/lozenge@6.0.0
  - @atlaskit/code@7.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/analytics-gas-types@3.0.0
  - @atlaskit/size-detector@5.0.0
  - @atlaskit/layer@5.0.0
  - @atlaskit/analytics@4.0.0
  - @atlaskit/layer-manager@5.0.0
  - @atlaskit/item@8.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/droplist@7.0.0
  - @atlaskit/avatar-group@2.0.0
  - @atlaskit/avatar@14.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/media-card@30.0.0
  - @atlaskit/media-picker@11.0.0
  - @atlaskit/media-filmstrip@10.0.0
  - @atlaskit/renderer@19.0.0
  - @atlaskit/task-decision@8.0.0
  - @atlaskit/util-data-test@10.0.0
  - @atlaskit/mention@14.0.0
  - @atlaskit/emoji@38.0.0
  - @atlaskit/editor-json-transformer@4.0.0
  - @atlaskit/editor-bitbucket-transformer@4.0.0
  - @atlaskit/editor-test-helpers@5.0.0
  - @atlaskit/editor-markdown-transformer@2.0.0
  - @atlaskit/editor-common@13.0.0
  - @atlaskit/media-test-helpers@15.0.0
  - @atlaskit/media-core@22.0.0
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/select@5.0.0
  - @atlaskit/logo@9.0.0
  - @atlaskit/modal-dialog@6.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/calendar@7.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/lozenge@6.0.0
  - @atlaskit/code@7.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/analytics-gas-types@3.0.0
  - @atlaskit/size-detector@5.0.0
  - @atlaskit/layer@5.0.0
  - @atlaskit/analytics@4.0.0
  - @atlaskit/layer-manager@5.0.0
  - @atlaskit/item@8.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/droplist@7.0.0
  - @atlaskit/avatar-group@2.0.0
  - @atlaskit/avatar@14.0.0

## 74.0.18

- [patch] Updated dependencies [daf6227](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/daf6227)
  - @atlaskit/media-picker@10.0.0

## 74.0.17

- [patch] Refactor existing 'paste' slice handling code, to use common utilities. Remove unused linkifySlice export from editor-common. [5958588](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5958588)
- [none] Updated dependencies [5f6ec84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f6ec84)
  - @atlaskit/editor-test-helpers@4.2.4
  - @atlaskit/renderer@18.2.18
  - @atlaskit/task-decision@7.1.14
  - @atlaskit/editor-common@12.0.0
  - @atlaskit/editor-markdown-transformer@1.2.8
  - @atlaskit/editor-json-transformer@3.1.8
  - @atlaskit/editor-bitbucket-transformer@3.2.9
- [patch] Updated dependencies [5958588](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5958588)
  - @atlaskit/editor-test-helpers@4.2.4
  - @atlaskit/renderer@18.2.18
  - @atlaskit/task-decision@7.1.14
  - @atlaskit/editor-common@12.0.0
  - @atlaskit/editor-markdown-transformer@1.2.8
  - @atlaskit/editor-json-transformer@3.1.8
  - @atlaskit/editor-bitbucket-transformer@3.2.9

## 74.0.16

- [patch] code improvements and MentionContextIdentifier attributes made mandatory to sync with editor-common ContextIdentifier [8a125a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a125a7)

- [patch] Updated dependencies [c98857e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c98857e)
  - @atlaskit/mention@13.1.10
  - @atlaskit/util-data-test@9.1.19
  - @atlaskit/renderer@18.2.17
  - @atlaskit/editor-test-helpers@4.2.3
  - @atlaskit/editor-common@11.4.6
- [patch] Updated dependencies [8a125a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a125a7)
  - @atlaskit/mention@13.1.10
  - @atlaskit/util-data-test@9.1.19
  - @atlaskit/renderer@18.2.17
  - @atlaskit/editor-test-helpers@4.2.3
  - @atlaskit/editor-common@11.4.6
- [none] Updated dependencies [cacfb53](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cacfb53)
  - @atlaskit/mention@13.1.10
  - @atlaskit/util-data-test@9.1.19
  - @atlaskit/renderer@18.2.17
  - @atlaskit/editor-test-helpers@4.2.3
  - @atlaskit/editor-common@11.4.6

## 74.0.15

- [patch] Rename deindent to outdent, reword analytic event to be consistent ED-4865 [33ab33b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/33ab33b)
- [none] Updated dependencies [33ab33b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/33ab33b)

## 74.0.14

- [patch] Split out non-core style and minor refactors in anticipation of hyperlink refactor [d1c7461](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d1c7461)
- [none] Updated dependencies [d1c7461](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d1c7461)

## 74.0.13

- [patch] ED-4914: extracted flash to a separate component [ea16bf8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea16bf8)
- [none] Updated dependencies [ea16bf8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea16bf8)

## 74.0.12

- [patch] ED-5029, fix padding in comment editor. [a38f1e9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a38f1e9)
- [patch] Updated dependencies [a38f1e9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a38f1e9)

## 74.0.11

- [patch] FS-2093 add mention insert analytics event [30bbe5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30bbe5a)
- [none] Updated dependencies [30bbe5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30bbe5a)
  - @atlaskit/mention@13.1.8

## 74.0.10

- [patch] Updated dependencies [6f51fdb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6f51fdb)
  - @atlaskit/media-picker@9.0.1
  - @atlaskit/renderer@18.2.16
  - @atlaskit/editor-common@11.4.5

## 74.0.9

- [patch] Updated dependencies [f897c79](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f897c79)
  - @atlaskit/util-data-test@9.1.17
  - @atlaskit/editor-common@11.4.4
  - @atlaskit/emoji@37.0.0
- [none] Updated dependencies [cacf096](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cacf096)
  - @atlaskit/emoji@37.0.0
  - @atlaskit/util-data-test@9.1.17
  - @atlaskit/editor-common@11.4.4

## 74.0.8

- [none] Updated dependencies [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)
  - @atlaskit/button@8.2.5
  - @atlaskit/media-card@29.1.10
  - @atlaskit/task-decision@7.1.12
  - @atlaskit/mention@13.1.7
  - @atlaskit/item@7.0.8
  - @atlaskit/modal-dialog@5.2.8
  - @atlaskit/avatar-group@1.0.2
  - @atlaskit/avatar@13.0.0
- [patch] Updated dependencies [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
  - @atlaskit/avatar@13.0.0
  - @atlaskit/media-card@29.1.10
  - @atlaskit/task-decision@7.1.12
  - @atlaskit/mention@13.1.7
  - @atlaskit/button@8.2.5
  - @atlaskit/modal-dialog@5.2.8
  - @atlaskit/item@7.0.8
  - @atlaskit/avatar-group@1.0.2

## 74.0.7

- [patch] FS-2092 add mention typeahead cancel analytics event [40bd3fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40bd3fb)
- [none] Updated dependencies [40bd3fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40bd3fb)
  - @atlaskit/mention@13.1.6

## 74.0.6

- [patch] Updated dependencies [9a1b6a2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a1b6a2)
  - @atlaskit/media-card@29.1.9
  - @atlaskit/editor-common@11.4.2

## 74.0.5

- [patch] Refactor Panel Plugin [0bdfa19](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0bdfa19)
- [none] Updated dependencies [0bdfa19](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0bdfa19)

## 74.0.4

- [patch] ED-1718: improve lists styles [570c4fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/570c4fb)
- [none] Updated dependencies [570c4fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/570c4fb)

## 74.0.3

- [patch] ED-4851: merge hover selection with main plugin [7eb5bdf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7eb5bdf)
- [none] Updated dependencies [7eb5bdf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7eb5bdf)

## 74.0.2

- [patch] Fix analytics wrapper [dc40093](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc40093)
- [none] Updated dependencies [dc40093](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc40093)

## 74.0.1

- [patch] ED-4964: refactor lists state [81f1a95](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/81f1a95)
- [none] Updated dependencies [81f1a95](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/81f1a95)

## 74.0.0

- [major] Remove deprecated APIs [af0cde6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af0cde6)
- [none] Updated dependencies [af0cde6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af0cde6)
  - @atlaskit/editor-test-helpers@4.2.2
  - @atlaskit/editor-markdown-transformer@1.2.7
  - @atlaskit/editor-json-transformer@3.1.7
  - @atlaskit/editor-bitbucket-transformer@3.2.8

## 73.10.0

- [minor] New floating toolbar plugin [d3cedbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d3cedbd)
- [none] Updated dependencies [d3cedbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d3cedbd)

## 73.9.29

- [patch] Revert usage of createPortal in favour of unstable_renderSubtreeIntoContainer to improve perf [d520a6f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d520a6f)
- [none] Updated dependencies [40095d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40095d6)
- [none] Updated dependencies [d520a6f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d520a6f)

## 73.9.28

- [patch] Updated dependencies [17b638b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/17b638b)
  - @atlaskit/editor-common@11.3.14
  - @atlaskit/renderer@18.2.13

## 73.9.27

- [patch] ED-4420: added unsupported nodes [f33ac3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f33ac3c)
- [none] Updated dependencies [f33ac3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f33ac3c)
  - @atlaskit/editor-common@11.3.13

## 73.9.26

- [patch] Updated dependencies [8c711bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c711bd)
  - @atlaskit/media-picker@9.0.0
  - @atlaskit/editor-test-helpers@4.2.1
  - @atlaskit/renderer@18.2.12
  - @atlaskit/emoji@36.0.2
  - @atlaskit/editor-common@11.3.12
- [patch] Updated dependencies [42ee1ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42ee1ea)
  - @atlaskit/media-test-helpers@14.0.6
  - @atlaskit/media-picker@9.0.0
  - @atlaskit/media-filmstrip@9.0.7
  - @atlaskit/media-core@21.0.0
  - @atlaskit/emoji@36.0.2
  - @atlaskit/editor-common@11.3.12
  - @atlaskit/media-card@29.1.8
  - @atlaskit/renderer@18.2.12
  - @atlaskit/editor-test-helpers@4.2.1

## 73.9.25

- [patch] remove all the empty lines after last valid doc [a877895](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a877895)
- [none] Updated dependencies [a877895](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a877895)
  - @atlaskit/editor-bitbucket-transformer@3.2.7

## 73.9.24

- [patch] Ensure mention state changes are notified on changes via applyTr [13d423c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/13d423c)
- [none] Updated dependencies [13d423c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/13d423c)

## 73.9.23

- [patch] Fixing the cursor disappear issue for Mobile [8c0ee26](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c0ee26)
- [none] Updated dependencies [8c0ee26](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c0ee26)

## 73.9.22

- [patch] Fixing the empty list copy [0955a27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0955a27)
- [none] Updated dependencies [0955a27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0955a27)

## 73.9.21

- [patch] Export QuickInsert types [912c8ae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/912c8ae)
- [none] Updated dependencies [912c8ae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/912c8ae)

## 73.9.20

- [patch] ED-4912: move styles to plugins [623b406](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/623b406)
- [none] Updated dependencies [623b406](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/623b406)

## 73.9.19

- [patch] Updated dependencies [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)
  - @atlaskit/avatar@12.0.0
  - @atlaskit/media-card@29.1.7
  - @atlaskit/task-decision@7.1.10
  - @atlaskit/mention@13.1.5
  - @atlaskit/modal-dialog@5.2.7
  - @atlaskit/item@7.0.7
  - @atlaskit/avatar-group@1.0.0

## 73.9.18

- [patch] ED-5005: fix editing nested inlineExtensions inside bodiedExtensions [6fd79a8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6fd79a8)
- [none] Updated dependencies [6fd79a8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6fd79a8)

## 73.9.17

- [patch] 5012 fix quick insert char duplication [6b7f320](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6b7f320)
- [none] Updated dependencies [6b7f320](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6b7f320)

## 73.9.16

- [patch] ED-4956, add toolbar option for decision item. [c353a5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c353a5a)
- [patch] Updated dependencies [c353a5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c353a5a)

## 73.9.15

- [patch] Support markdown style horizontal rules. ED-4820 [3d33ed4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d33ed4)
- [none] Updated dependencies [3d33ed4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d33ed4)

## 73.9.14

- [patch] Track indent, deindent and language selection to gauge what is being used. ED-4865 [d511301](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d511301)
- [none] Updated dependencies [d511301](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d511301)

## 73.9.13

- [patch] Codeblocks were capturing preceeding content when started in the middle/end of a paragraph. ED-4677 [78a9e6e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/78a9e6e)
- [none] Updated dependencies [78a9e6e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/78a9e6e)

## 73.9.12

- [patch] Set overflow to auto so we're not showing scrollbars by default in code blocks. ED-4992 [19aec32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/19aec32)
- [none] Updated dependencies [19aec32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/19aec32)

## 73.9.11

- [patch] ED-4462, in comment editor clicking below content should create a new paragraph at bottom. [e196df9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e196df9)
- [patch] Updated dependencies [e196df9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e196df9)

## 73.9.10

- [patch] Updated dependencies [d7dca64](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7dca64)
  - @atlaskit/mention@13.1.4
  - @atlaskit/util-data-test@9.1.16
  - @atlaskit/renderer@18.2.10
  - @atlaskit/editor-common@11.3.10

## 73.9.9

- [patch] Set initial collab selection to the start of the document. ED-4759 [db5345a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/db5345a)
- [none] Updated dependencies [db5345a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/db5345a)

## 73.9.8

- [patch][refactor] Updated paste plugin to remove old/buggy handling of specific node types. No longer have complex logic around code-block detection on paste. If PM parses it as a code-block, we respect that. [e3c6479](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e3c6479)
- [patch][refactor] Use ParseRule->context to prevent pasting layoutColumn/layoutSections inside each other. [541341e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/541341e)
- [patch][refactor] Use ParseRule->context to prevent nesting bodiedExtensions on paste. [fe383b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fe383b4)
- [none] Updated dependencies [2625ade](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2625ade)
  - @atlaskit/editor-test-helpers@4.2.0
  - @atlaskit/editor-common@11.3.9
- [none] Updated dependencies [e3c6479](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e3c6479)
  - @atlaskit/editor-test-helpers@4.2.0
  - @atlaskit/editor-common@11.3.9
- [none] Updated dependencies [541341e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/541341e)
  - @atlaskit/editor-test-helpers@4.2.0
  - @atlaskit/editor-common@11.3.9
- [none] Updated dependencies [fe383b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fe383b4)
  - @atlaskit/editor-test-helpers@4.2.0
  - @atlaskit/editor-common@11.3.9

## 73.9.7

- [patch] Fixing extension breakout on edit [91c015e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/91c015e)
- [none] Updated dependencies [91c015e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/91c015e)

## 73.9.6

- [patch] ED-4927: disable gap cursor for lists [1bdae46](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bdae46)
- [none] Updated dependencies [1bdae46](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bdae46)

## 73.9.5

- [patch] Updated dependencies [8d5053e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d5053e)
  - @atlaskit/media-picker@8.1.6
  - @atlaskit/emoji@36.0.1
  - @atlaskit/util-data-test@9.1.15
  - @atlaskit/task-decision@7.1.8
  - @atlaskit/mention@13.1.3
  - @atlaskit/renderer@18.2.9
  - @atlaskit/editor-json-transformer@3.1.5
  - @atlaskit/editor-bitbucket-transformer@3.2.6
  - @atlaskit/editor-common@11.3.8
  - @atlaskit/editor-test-helpers@4.1.9
  - @atlaskit/editor-markdown-transformer@1.2.6

## 73.9.4

- [patch] Updated dependencies [eee2d45](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eee2d45)
  - @atlaskit/code@6.0.0
  - @atlaskit/renderer@18.2.8
  - @atlaskit/logo@8.1.3
  - @atlaskit/docs@4.2.1

## 73.9.3

- [patch] Dismiss quick insert type ahead if query starts with a space [ffee2ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ffee2ef)
- [none] Updated dependencies [ffee2ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ffee2ef)

## 73.9.2

- [patch] Updated dependencies [0cf2f52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0cf2f52)
  - @atlaskit/emoji@36.0.0
  - @atlaskit/util-data-test@9.1.14
  - @atlaskit/task-decision@7.1.7
  - @atlaskit/mention@13.1.2
  - @atlaskit/renderer@18.2.7
  - @atlaskit/editor-json-transformer@3.1.4
  - @atlaskit/editor-bitbucket-transformer@3.2.5
  - @atlaskit/editor-test-helpers@4.1.8
  - @atlaskit/editor-markdown-transformer@1.2.5
  - @atlaskit/editor-common@11.3.7

## 73.9.1

- [patch] ED-3801: fix table typing performance [e70bf05](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e70bf05)
- [none] Updated dependencies [216b20d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/216b20d)
  - @atlaskit/icon@12.5.1
- [none] Updated dependencies [e70bf05](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e70bf05)

## 73.9.0

- [minor] Add QuickInsert provider [948e6e1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/948e6e1)
- [none] Updated dependencies [948e6e1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/948e6e1)

## 73.8.22

- [patch] ED-4971, ED-4852: fix gap cursor and number column styles [10cc9e1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10cc9e1)
- [none] Updated dependencies [10cc9e1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10cc9e1)

## 73.8.21

- [patch] ED-4974: fix updating tableNode in table plugin state [ca61638](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca61638)
- [none] Updated dependencies [ca61638](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca61638)

## 73.8.20

- [patch] Make code blocks and actions have opaque backgrounds [5b79a19](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b79a19)
- [patch] ED-4641, fix issue in splitting merged cell when cursor is inside cell but cell is not selected. [d708792](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d708792)
- [patch] Updated dependencies [5b79a19](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b79a19)
  - @atlaskit/task-decision@7.1.6
- [patch] Updated dependencies [d708792](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d708792)
  - @atlaskit/task-decision@7.1.6

## 73.8.19

- [patch] Updated dependencies [c57e9c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c57e9c1)
  - @atlaskit/media-test-helpers@14.0.4
  - @atlaskit/media-filmstrip@9.0.5
  - @atlaskit/media-card@29.1.5
  - @atlaskit/editor-common@11.3.5
  - @atlaskit/emoji@35.1.4
  - @atlaskit/renderer@18.2.6
  - @atlaskit/editor-test-helpers@4.1.7
  - @atlaskit/media-picker@8.1.4
  - @atlaskit/media-core@20.0.0

## 73.8.18

- [patch] Fix test [0973ab5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0973ab5)
- [patch] Remove parenthesis from action tooltips [1b1eea7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b1eea7)
- [none] Updated dependencies [0973ab5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0973ab5)
- [patch] Updated dependencies [1b1eea7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b1eea7)

## 73.8.17

- [patch] ED-4923: stop table columns and selection resetting on toolbar actions [56fa89e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/56fa89e)
- [none] Updated dependencies [56fa89e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/56fa89e)

## 73.8.16

- [patch] Fixing the cursor navigation between inline nodes [b9e3213](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9e3213)
- [none] Updated dependencies [b9e3213](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9e3213)
  - @atlaskit/editor-common@11.3.3

## 73.8.15

- [patch] Fix issue where clicking on table controls inside an editor in a form, would submit the form (ED-4744) [5cd03c5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5cd03c5)
- [none] Updated dependencies [5cd03c5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5cd03c5)

## 73.8.14

- [patch] ED-4909: fix overflow shadow rendering + visual resize performance on tables [69a8c78](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69a8c78)
- [none] Updated dependencies [69a8c78](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69a8c78)

## 73.8.13

- [patch] ED-4736, fix size of font in inline code mark in editor core. [9b80e35](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b80e35)
- [patch] Updated dependencies [9b80e35](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b80e35)

## 73.8.12

- [patch] Added support for blocks and lists [b5a920b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5a920b)
- [none] Updated dependencies [b5a920b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5a920b)

## 73.8.11

- [patch] Introduce regression tests for pasting content from 3rd-party vendors into the editor. `dispatchPasteEvent` now returns the event that was fired when successful, to allow consumers to tell whether it was modified by ProseMirror. (ED-3726) [e358e9f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e358e9f)
- [none] Updated dependencies [e358e9f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e358e9f)
  - @atlaskit/editor-test-helpers@4.1.6

## 73.8.10

- [patch] ED-4520, date renderer should render UTC value of date. [28e3c31](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/28e3c31)
- [patch] Updated dependencies [28e3c31](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/28e3c31)
  - @atlaskit/editor-common@11.3.2

## 73.8.9

- [patch] ED-4750, adding information to help dialog. [a3f696c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3f696c)
- [patch] Updated dependencies [a3f696c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3f696c)

## 73.8.8

- [patch] Updated dependencies [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
  - @atlaskit/spinner@8.0.0
  - @atlaskit/media-picker@8.1.3
  - @atlaskit/media-card@29.1.4
  - @atlaskit/task-decision@7.1.3
  - @atlaskit/emoji@35.1.2
  - @atlaskit/droplist@6.2.1
  - @atlaskit/button@8.2.3

## 73.8.7

- [patch] ED-4924: fix table control styles [377ebeb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/377ebeb)
- [none] Updated dependencies [377ebeb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/377ebeb)
  - @atlaskit/editor-common@11.3.1

## 73.8.6

- [patch] Remove pinned prosemirror-model@1.4.0 and move back to caret ranges for prosemirror-model@^1.5.0 [4faccc0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4faccc0)
- [patch] Updated dependencies [4faccc0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4faccc0)
  - @atlaskit/renderer@18.2.5
  - @atlaskit/task-decision@7.1.2
  - @atlaskit/editor-common@11.3.0
  - @atlaskit/editor-test-helpers@4.1.5
  - @atlaskit/editor-markdown-transformer@1.2.4
  - @atlaskit/editor-json-transformer@3.1.3
  - @atlaskit/editor-bitbucket-transformer@3.2.4

## 73.8.5

- [patch] Bump prosemirror-markdown to 1.1.0 and treat new lines when pasting as <br> [5c28782](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5c28782)
- [none] Updated dependencies [5c28782](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5c28782)
  - @atlaskit/editor-markdown-transformer@1.2.3
  - @atlaskit/editor-bitbucket-transformer@3.2.3

## 73.8.4

- [patch] ED-4803, it should be possible to create nested rule. [9b25a8e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b25a8e)
- [patch] Updated dependencies [9b25a8e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b25a8e)

## 73.8.3

- [patch] Bump prosemirror-view to 1.3.3 to fix issue where newlines in code-blocks would vanish in IE11. (ED-4830) [fc5a082](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc5a082)
- [none] Updated dependencies [fc5a082](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc5a082)
  - @atlaskit/editor-test-helpers@4.1.4
  - @atlaskit/editor-common@11.2.10

## 73.8.2

- [patch] Updated dependencies [74a0d46](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/74a0d46)
  - @atlaskit/media-card@29.1.3
  - @atlaskit/media-filmstrip@9.0.4
  - @atlaskit/renderer@18.2.3
  - @atlaskit/editor-common@11.2.8
- [patch] Updated dependencies [6c6f078](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c6f078)
  - @atlaskit/media-card@29.1.3
  - @atlaskit/media-filmstrip@9.0.4
  - @atlaskit/renderer@18.2.3
  - @atlaskit/editor-common@11.2.8
- [patch] Updated dependencies [5bb26b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5bb26b4)
  - @atlaskit/media-card@29.1.3
  - @atlaskit/media-filmstrip@9.0.4
  - @atlaskit/renderer@18.2.3
  - @atlaskit/editor-common@11.2.8

## 73.8.1

- [patch] ED-4744, ED-4749: autoinserts break other inline marks. [34b660c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/34b660c)
- [none] Updated dependencies [34b660c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/34b660c)

## 73.8.0

- [minor] Design updates for /QuickInsert™️ menu [4e4825e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e4825e)
- [none] Updated dependencies [4e4825e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e4825e)
  - @atlaskit/editor-common@11.2.6

## 73.7.12

- [patch] ED-4899 fix finding parent node for popups (specifically hyperlink) in IE11 [b801e42](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b801e42)
- [none] Updated dependencies [b801e42](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b801e42)

## 73.7.11

- [patch] Add Table breakout mode in renderer [0d3b375](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d3b375)
- [none] Updated dependencies [0d3b375](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d3b375)
  - @atlaskit/renderer@18.2.1
  - @atlaskit/editor-common@11.2.5

## 73.7.10

- [patch] ED-4846,ED-4816: refactor tables [269abf0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/269abf0)
- [none] Updated dependencies [269abf0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/269abf0)

## 73.7.9

- [patch] Do not call render inside a constructor of a ReactNodeView [7e60aa8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e60aa8)
- [none] Updated dependencies [7e60aa8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e60aa8)

## 73.7.8

- [patch] ED-4489 Fix can't submit with enter using Korean and Japanese IME [0274524](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0274524)
- [none] Updated dependencies [0274524](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0274524)
  - @atlaskit/editor-test-helpers@4.1.3
  - @atlaskit/editor-common@11.2.3

## 73.7.7

- [patch] Fixing extension select and refactor [eca44eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eca44eb)
- [none] Updated dependencies [eca44eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eca44eb)
  - @atlaskit/editor-common@11.2.2

## 73.7.6

- [patch] Add name field to make getInitial happy [e267dc7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e267dc7)
- [patch] Update telepointer test cases [2644031](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2644031)
- [patch] Ghost telepointer fix by checking participants [eee943d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eee943d)
- [none] Updated dependencies [e267dc7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e267dc7)
- [none] Updated dependencies [2644031](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2644031)
- [none] Updated dependencies [eee943d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eee943d)

## 73.7.5

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/media-card@29.1.2
  - @atlaskit/media-picker@8.1.2
  - @atlaskit/emoji@35.1.1
  - @atlaskit/util-data-test@9.1.13
  - @atlaskit/task-decision@7.1.1
  - @atlaskit/mention@13.1.1
  - @atlaskit/editor-json-transformer@3.1.2
  - @atlaskit/editor-bitbucket-transformer@3.2.2
  - @atlaskit/media-filmstrip@9.0.3
  - @atlaskit/renderer@18.1.2
  - @atlaskit/editor-test-helpers@4.1.2
  - @atlaskit/editor-markdown-transformer@1.2.2
  - @atlaskit/editor-common@11.2.1
  - @atlaskit/media-test-helpers@14.0.3
  - @atlaskit/media-core@19.1.3
  - @atlaskit/tooltip@10.2.1
  - @atlaskit/select@4.2.3
  - @atlaskit/modal-dialog@5.2.2
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/lozenge@5.0.4
  - @atlaskit/code@5.0.4
  - @atlaskit/size-detector@4.1.2
  - @atlaskit/layer@4.0.3
  - @atlaskit/spinner@7.0.2
  - @atlaskit/logo@8.1.2
  - @atlaskit/calendar@6.1.2
  - @atlaskit/layer-manager@4.2.1
  - @atlaskit/item@7.0.5
  - @atlaskit/icon@12.1.2
  - @atlaskit/droplist@6.1.2

## 73.7.4

- [patch] ED-4654 add minimum 128px column width to tables [6ee43d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ee43d8)
- [none] Updated dependencies [6ee43d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ee43d8)
  - @atlaskit/editor-common@11.2.0

## 73.7.3

- [patch] ED-4840: bump pm-utils to 0.5.1 [37992bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/37992bf)
- [none] Updated dependencies [37992bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/37992bf)

## 73.7.2

- [patch] ED-4438, text from google docs should not be pasted as inline code. [2a0fd85](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2a0fd85)
- [patch] Updated dependencies [2a0fd85](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2a0fd85)

## 73.7.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/media-card@29.1.1
  - @atlaskit/media-picker@8.1.1
  - @atlaskit/util-data-test@9.1.12
  - @atlaskit/editor-json-transformer@3.1.1
  - @atlaskit/editor-bitbucket-transformer@3.2.1
  - @atlaskit/media-filmstrip@9.0.2
  - @atlaskit/renderer@18.1.1
  - @atlaskit/editor-test-helpers@4.1.1
  - @atlaskit/editor-markdown-transformer@1.2.1
  - @atlaskit/editor-common@11.1.2
  - @atlaskit/media-test-helpers@14.0.2
  - @atlaskit/media-core@19.1.2
  - @atlaskit/theme@4.0.3
  - @atlaskit/layer-manager@4.1.1
  - @atlaskit/spinner@7.0.1
  - @atlaskit/select@4.2.1
  - @atlaskit/modal-dialog@5.1.1
  - @atlaskit/lozenge@5.0.3
  - @atlaskit/item@7.0.4
  - @atlaskit/icon@12.1.1
  - @atlaskit/logo@8.1.1
  - @atlaskit/droplist@6.1.1
  - @atlaskit/code@5.0.3
  - @atlaskit/calendar@6.1.1
  - @atlaskit/button@8.1.1
  - @atlaskit/avatar@11.1.1
  - @atlaskit/docs@4.1.1
  - @atlaskit/size-detector@4.1.1
  - @atlaskit/layer@4.0.2
  - @atlaskit/analytics@3.0.5

## 73.7.0

- [minor] Introduce support for Tab / Shift-Tab to indent / unindent text in a code block (ED-4638) [e6df77b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6df77b)
- [none] Updated dependencies [e6df77b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6df77b)

## 73.6.2

- [patch] ED-4856: fix resize border in Firefox [b8577e7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8577e7)
- [none] Updated dependencies [b8577e7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8577e7)

## 73.6.1

- [patch] Fix issue where mentions were not selectable in IE11 [2126e1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2126e1e)
- [none] Updated dependencies [2126e1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2126e1e)

## 73.6.0

- [minor] ED-3474 add redesigned table numbering column, fix table styling regressions [1bef41a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bef41a)
- [none] Updated dependencies [1bef41a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bef41a)
  - @atlaskit/editor-common@11.1.1

## 73.5.2

- [patch] WIP [57d5f4a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/57d5f4a)
- [none] Updated dependencies [57d5f4a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/57d5f4a)

## 73.5.1

- [patch] ED-4816: fix removing columns/rows when outside of the content area [789e640](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/789e640)
- [none] Updated dependencies [789e640](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/789e640)

## 73.5.0

- [patch] Set selection at the start of the document when editing a document in the full-page appearance. (ED-4759) [7217164](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7217164)
- [none] Updated dependencies [7217164](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7217164)
  - @atlaskit/editor-test-helpers@4.1.0
  - @atlaskit/renderer@18.1.0
  - @atlaskit/task-decision@7.1.0
  - @atlaskit/util-data-test@9.1.11
  - @atlaskit/mention@13.1.0
  - @atlaskit/emoji@35.1.0
  - @atlaskit/editor-common@11.1.0
  - @atlaskit/editor-markdown-transformer@1.2.0
  - @atlaskit/editor-json-transformer@3.1.0
  - @atlaskit/editor-bitbucket-transformer@3.2.0

## 73.4.7

- [patch] Updated dependencies [2de7ce7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2de7ce7)
  - @atlaskit/media-card@29.0.3
  - @atlaskit/renderer@18.0.4
  - @atlaskit/editor-common@11.0.7

## 73.4.6

- [patch] Fix a regression in task-decision in editor after NodeView's PR [b7a4fd5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b7a4fd5)
- [none] Updated dependencies [b7a4fd5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b7a4fd5)

## 73.4.5

- [patch] Fixes the image toolbar [05f69d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/05f69d1)
- [none] Updated dependencies [05f69d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/05f69d1)

## 73.4.4

- [patch] Update and lock prosemirror-model version to 1.4.0 [febf753](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febf753)
- [none] Updated dependencies [febf753](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febf753)
  - @atlaskit/renderer@18.0.3
  - @atlaskit/editor-common@11.0.6
  - @atlaskit/editor-test-helpers@4.0.7
  - @atlaskit/editor-markdown-transformer@1.1.1
  - @atlaskit/editor-json-transformer@3.0.11
  - @atlaskit/editor-bitbucket-transformer@3.1.7

## 73.4.3

- [patch] Adding breakout to extensions [3d1b0ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d1b0ab)
- [none] Updated dependencies [3d1b0ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d1b0ab)
  - @atlaskit/editor-test-helpers@4.0.6
  - @atlaskit/editor-common@11.0.5

## 73.4.2

- [patch] Fix issue where clicking over empty space in a code-block would not select the end of the line. ED-4637 [8120815](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8120815)
- [patch] Code-block toolbar refactored to rely less on view state. This also fixes issues with the code-block in IE11. [9249525](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9249525)
- [none] Updated dependencies [8120815](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8120815)
- [none] Updated dependencies [9249525](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9249525)

## 73.4.1

- [patch] Fix issue where mention-picker when two users would have a mention picker open at the same time in collaborative editing. [5974137](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5974137)
- [none] Updated dependencies [5974137](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5974137)

## 73.4.0

- [minor] ED-4657: unbreak table copy-paste [38b5ce7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/38b5ce7)
- [none] Updated dependencies [38b5ce7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/38b5ce7)

## 73.3.10

- [patch] ED-4823: added card provider [583ae09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/583ae09)
- [none] Updated dependencies [583ae09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/583ae09)
  - @atlaskit/editor-test-helpers@4.0.5

## 73.3.9

- [patch] Adds support for auto-closing brackets inside code-blocks [9d69d58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d69d58)
- [none] Updated dependencies [9d69d58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d69d58)

## 73.3.8

- [patch] Fix onComponentUpdate sometimes being undefined in tables node views [57225fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/57225fd)
- [none] Updated dependencies [57225fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/57225fd)

## 73.3.7

- [patch] ED-4818: add inlineCard to schema [a303cbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a303cbd)
- [none] Updated dependencies [a303cbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a303cbd)
  - @atlaskit/editor-test-helpers@4.0.4
  - @atlaskit/editor-common@11.0.4

## 73.3.6

- [patch] Fix PortalProvider performance [a157f3b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a157f3b)
- [none] Updated dependencies [a157f3b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a157f3b)

## 73.3.5

- [patch] ED-4722, fix for mention and emoji floating toolbar hidden behind table floating toolbar. [a13c9f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a13c9f5)
- [patch] Updated dependencies [a13c9f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a13c9f5)

## 73.3.4

- [patch] SDK-5812 Fix unsupported content after editing media only doc [25baf0a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25baf0a)
- [none] Updated dependencies [25baf0a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25baf0a)

## 73.3.3

- [patch] ED-4758, fix for confluence issue media single toolbar not visible for saved media. [730b047](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/730b047)
- [patch] Updated dependencies [730b047](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/730b047)

## 73.3.2

- [patch] Updated dependencies [823caef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/823caef)
  - @atlaskit/media-card@29.0.2
  - @atlaskit/renderer@18.0.2
  - @atlaskit/editor-common@11.0.3

## 73.3.1

- [patch] Convert special/smart subtitution characters back to the plain-text ascii counterparts when formatted in inline-code (ED-4635) [76fdbf3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76fdbf3)
- [none] Updated dependencies [76fdbf3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76fdbf3)

## 73.3.0

- [minor] Pass context to node views [e3d2802](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e3d2802)
- [none] Updated dependencies [e3d2802](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e3d2802)

## 73.2.0

- [minor] Updated dependencies [cad95fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cad95fa)
  - @atlaskit/editor-markdown-transformer@1.1.0

## 73.1.4

- [patch] Updated dependencies [732d2f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/732d2f5)
  - @atlaskit/media-card@29.0.1
  - @atlaskit/renderer@18.0.1
  - @atlaskit/editor-common@11.0.2

## 73.1.3

- [patch] ED-4799, fixing vertical alignment of separators in toolbar. [4146e4f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4146e4f)
- [patch] Updated dependencies [4146e4f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4146e4f)

## 73.1.2

- [patch] ED-4190, fix for scroll of editor to top when adding date or clicking date. [90ece93](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/90ece93)
- [patch] Updated dependencies [90ece93](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/90ece93)

## 73.1.1

- [patch] ED-4742: fix removing rows inside bodied ext [4ad8738](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4ad8738)
- [none] Updated dependencies [4ad8738](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4ad8738)

## 73.1.0

- [minor] Add support for indent/outdenting text inside a code-block via the `Mod-[` / `Mod-]` shortcuts. `Enter` will now persist the indentation of the previous line, and `Tab` will insert the appropriate indentation. This can be enabled via the `enableKeybindingsForIDE` option that can now be passed through to `allowCodeBlocks` option. This is hidden behind an option only until we are confident with the implementation, at which point it will likely become default behaviour. [ED-4638][c02281b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c02281b)
- [none] Updated dependencies [c02281b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c02281b)

## 73.0.1

- [patch] ED-4716, smart replacements should not work inside mention query. [a5c5a5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a5c5a5e)
- [patch] Updated dependencies [a5c5a5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a5c5a5e)

## 73.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/media-card@29.0.0
  - @atlaskit/media-picker@8.0.0
  - @atlaskit/emoji@35.0.7
  - @atlaskit/util-data-test@9.1.10
  - @atlaskit/task-decision@7.0.0
  - @atlaskit/mention@13.0.0
  - @atlaskit/editor-json-transformer@3.0.9
  - @atlaskit/editor-bitbucket-transformer@3.1.4
  - @atlaskit/media-filmstrip@9.0.0
  - @atlaskit/renderer@18.0.0
  - @atlaskit/editor-test-helpers@4.0.3
  - @atlaskit/editor-markdown-transformer@1.0.0
  - @atlaskit/editor-common@11.0.0
  - @atlaskit/media-test-helpers@14.0.0
  - @atlaskit/media-core@19.0.0
  - @atlaskit/tooltip@10.0.0
  - @atlaskit/layer-manager@4.0.0
  - @atlaskit/modal-dialog@5.0.0
  - @atlaskit/item@7.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/single-select@5.0.0
  - @atlaskit/logo@8.0.0
  - @atlaskit/calendar@6.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/lozenge@5.0.0
  - @atlaskit/code@5.0.0
  - @atlaskit/spinner@6.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/size-detector@4.0.0
  - @atlaskit/layer@4.0.0
  - @atlaskit/analytics@3.0.2
  - @atlaskit/droplist@6.0.0
  - @atlaskit/avatar@11.0.0

## 72.2.5

- [patch] SPS-426 Fix editing action, decision and media in FF [ab783c5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab783c5)
- [none] Updated dependencies [ab783c5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab783c5)

## 72.2.4

- [patch] ED-4714: fix table jumping on hover over resize handles [b52a82e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b52a82e)
- [none] Updated dependencies [b52a82e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b52a82e)

## 72.2.3

- [patch] Fix Code Block appearance showing gray border in IE (ED-4766) [5e1313c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e1313c)
- [none] Updated dependencies [5e1313c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e1313c)

## 72.2.2

- [patch] Updated dependencies [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/media-card@28.0.6
  - @atlaskit/media-picker@7.0.6
  - @atlaskit/emoji@35.0.6
  - @atlaskit/util-data-test@9.1.9
  - @atlaskit/task-decision@6.0.9
  - @atlaskit/mention@12.0.3
  - @atlaskit/editor-json-transformer@3.0.8
  - @atlaskit/editor-bitbucket-transformer@3.1.3
  - @atlaskit/media-filmstrip@8.0.9
  - @atlaskit/renderer@17.0.9
  - @atlaskit/editor-test-helpers@4.0.2
  - @atlaskit/editor-markdown-transformer@0.2.23
  - @atlaskit/editor-common@10.1.9

## 72.2.1

- [patch] Updated dependencies [5ee48c4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ee48c4)
  - @atlaskit/media-picker@7.0.5
  - @atlaskit/emoji@35.0.5
  - @atlaskit/editor-common@10.1.8
  - @atlaskit/media-core@18.1.2

## 72.2.0

- [minor] Quick Insert menu for internal editor things [370344f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/370344f)
- [none] Updated dependencies [370344f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/370344f)
  - @atlaskit/editor-common@10.1.7

## 72.1.17

- [patch] ED-4765 fix bad import with @atlastkit/theme, restores divider styling [5c7f741](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5c7f741)
- [none] Updated dependencies [5c7f741](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5c7f741)

## 72.1.16

- [patch] ED-4727, selection not set correctly when creating task item from toolbar. [c5d64df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c5d64df)
- [patch] Updated dependencies [c5d64df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c5d64df)

## 72.1.15

- [patch] ED-4582, fix for hyperlink floating toolbar not closing in bitbucket even after content is saved. [899b395](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/899b395)
- [patch] Updated dependencies [899b395](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/899b395)

## 72.1.14

- [patch] ED-4768 handle null ref callback on full-page scroll container [73bff15](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/73bff15)
- [none] Updated dependencies [73bff15](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/73bff15)

## 72.1.13

- [patch] Fix issue where Code Block numbering would be mis-aligned in Firefox [6436efd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6436efd)
- [none] Updated dependencies [6436efd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6436efd)

## 72.1.12

- [patch] ED-4715, fix for weird borders around toolbar in full page editor. [942b5f1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/942b5f1)
- [patch] Updated dependencies [942b5f1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/942b5f1)

## 72.1.11

- [patch] Fixes the unncessary copy of private attributes to media node [154535b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/154535b)
- [none] Updated dependencies [154535b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/154535b)

## 72.1.10

- [patch] Fixing the extension title [04b010d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/04b010d)
- [none] Updated dependencies [04b010d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/04b010d)

## 72.1.9

- [patch] Updated dependencies [35d547f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d547f)
  - @atlaskit/media-card@28.0.5
  - @atlaskit/renderer@17.0.8
  - @atlaskit/editor-common@10.1.4

## 72.1.8

- [patch] Updated dependencies [639ae5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/639ae5e)
  - @atlaskit/mention@12.0.2
  - @atlaskit/util-data-test@9.1.7
  - @atlaskit/renderer@17.0.4
  - @atlaskit/editor-common@10.1.1

## 72.1.7

- [patch] ED-3180 unify scroll styles with Atlaskit style [49b2c12](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49b2c12)
- [none] Updated dependencies [49b2c12](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49b2c12)

## 72.1.6

- [patch][f87724e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f87724e)
- [none] Updated dependencies [f87724e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f87724e)
  - @atlaskit/media-test-helpers@13.0.2
  - @atlaskit/task-decision@6.0.8
  - @atlaskit/mention@12.0.1
  - @atlaskit/media-picker@7.0.3
  - @atlaskit/media-filmstrip@8.0.8
  - @atlaskit/media-card@28.0.4

## 72.1.5

- [patch] Fix toolbar alignment being incorrectly offset due to the change in the Code Block UI [ED-4637][6db7a9f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6db7a9f)
- [none] Updated dependencies [6db7a9f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6db7a9f)

## 72.1.4

- [patch] Fixing the toolbar for extensions [ef9ccca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef9ccca)
- [none] Updated dependencies [ef9ccca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef9ccca)
  - @atlaskit/editor-test-helpers@4.0.1

## 72.1.3

- [patch] Fixing up the paste of images [3ab13a5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ab13a5)
- [none] Updated dependencies [3ab13a5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ab13a5)

## 72.1.2

- [patch] FS-1206 remove AtlassianEmojiMigrationResource [0edc6c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0edc6c8)
- [none] Updated dependencies [0edc6c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0edc6c8)
  - @atlaskit/emoji@35.0.3
  - @atlaskit/renderer@17.0.3

## 72.1.1

- [patch] ED-4696, fixing adding multiple task items from toolbar button. [9b54e67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b54e67)
- [patch] Updated dependencies [9b54e67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b54e67)

## 72.1.0

- [minor] The code block UI component has been updated to the latest design. It now has line numbers and corrected padding. 🎉 [6945723](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6945723)
- [none] Updated dependencies [6945723](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6945723)

## 72.0.7

- [patch] Updated dependencies [758b342](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/758b342)
  - @atlaskit/task-decision@6.0.7
  - @atlaskit/renderer@17.0.2

## 72.0.6

- [none] Updated dependencies [ba702bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ba702bc)
  - @atlaskit/mention@12.0.0
  - @atlaskit/util-data-test@9.1.6
  - @atlaskit/renderer@17.0.1
  - @atlaskit/editor-common@10.0.3

## 72.0.5

- [patch] ED-4221 Fix toolbar style inconsistencies [f3fb6b8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f3fb6b8)
- [none] Updated dependencies [f3fb6b8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f3fb6b8)
  - @atlaskit/editor-common@10.0.2

## 72.0.4

- [patch] FS-1904 add support for emoji with ascii starting with ( [c83d567](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c83d567)
- [none] Updated dependencies [c83d567](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c83d567)
  - @atlaskit/util-data-test@9.1.5
  - @atlaskit/emoji@35.0.2

## 72.0.3

- [patch] Addding the file swap in processing state [ed40161](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed40161)
- [none] Updated dependencies [ed40161](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed40161)

## 72.0.2

- [patch] ED-4652, fixing issue with input of multiple \* in editor. [b026738](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b026738)
- [patch] Updated dependencies [b026738](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b026738)

## 72.0.1

- [patch] Updated dependencies [bd26d3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd26d3c)
  - @atlaskit/media-picker@7.0.1
  - @atlaskit/emoji@35.0.1
  - @atlaskit/editor-common@10.0.1
  - @atlaskit/media-core@18.1.1
  - @atlaskit/media-test-helpers@13.0.1
  - @atlaskit/media-card@28.0.1

## 72.0.0

- [patch] ED-4087: fix table controls in IE11 [febc44d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febc44d)

- [major] media-picker: <All but popup picker>.emitUploadEnd second argument shape has changed from MediaFileData to FileDetails; `upload-end` event payload body shape changed from MediaFileData to FileDetails; All the media pickers config now have new property `useNewUploadService: boolean` (false by default); popup media-picker .cancel can't be called with no argument, though types does allow for it; `File` is removed; --- media-store: MediaStore.createFile now has a required argument of type MediaStoreCreateFileParams; MediaStore.copyFileWithToken new method; uploadFile method result type has changed from just a promise to a UploadFileResult type; --- media-test-helpers: mediaPickerAuthProvider argument has changed from a component instance to just a boolean authEnvironment; [84f6f91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84f6f91)

- [none] Updated dependencies [febc44d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febc44d)
  - @atlaskit/editor-test-helpers@4.0.0
  - @atlaskit/renderer@17.0.0
  - @atlaskit/task-decision@6.0.6
  - @atlaskit/util-data-test@9.1.4
  - @atlaskit/emoji@35.0.0
  - @atlaskit/editor-common@10.0.0
  - @atlaskit/editor-markdown-transformer@0.2.22
  - @atlaskit/editor-json-transformer@3.0.7
  - @atlaskit/editor-bitbucket-transformer@3.1.1

## 71.4.7

- [patch] ED-2400: only show fullpage toolbar border on scroll [a01cad0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a01cad0)
- [patch] Updated dependencies [a01cad0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a01cad0)

## 71.4.6

- [patch] ED-4647, table should be highlighted in red when hovering over delete icon. [7814224](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7814224)
- [patch] Updated dependencies [7814224](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7814224)

## 71.4.5

- [patch] ED-4520, Date lozenge should save UTC timestamp value. [ee98470](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee98470)
- [patch] Updated dependencies [ee98470](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee98470)

## 71.4.4

- [patch] SPS-1155: enable action mark with allowInlineAction flag [db6e13a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/db6e13a)
- [none] Updated dependencies [db6e13a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/db6e13a)

## 71.4.3

- [patch] ED-4643: added support for "wide" layout for tables [8c146ee](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c146ee)
- [none] Updated dependencies [8c146ee](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c146ee)
  - @atlaskit/editor-common@9.3.10

## 71.4.2

- [patch] Allow disabling smart-autocompletion (capitalising of Atlassian products, em-dash insert, smart-quotes) via prop `textFormatting={{ disableSmartAutoCompletion: true }}` [cee7a4a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cee7a4a)
- [none] Updated dependencies [cee7a4a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cee7a4a)
  - @atlaskit/editor-test-helpers@3.1.9

## 71.4.1

- [patch] Fix broken custom dropzone example [c49c76b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c49c76b)
- [none] Updated dependencies [c49c76b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c49c76b)

## 71.4.0

- [minor] Support external media in bitbucket transformer and image uploader [8fd4dd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fd4dd1)

- [patch] Prevent breakout-mode inside of page layouts [92cdf83](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92cdf83)
- [patch] Allow removing an empty heading at the start of a document by backspacing [4151cc5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4151cc5)
- [none] Updated dependencies [8fd4dd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fd4dd1)
  - @atlaskit/editor-test-helpers@3.1.8
  - @atlaskit/renderer@16.2.6
  - @atlaskit/task-decision@6.0.5
  - @atlaskit/util-data-test@9.1.3
  - @atlaskit/mention@11.1.4
  - @atlaskit/emoji@34.2.0
  - @atlaskit/editor-json-transformer@3.0.6
  - @atlaskit/editor-markdown-transformer@0.2.21
  - @atlaskit/editor-common@9.3.9
  - @atlaskit/editor-bitbucket-transformer@3.1.0

## 71.3.34

- [patch] ED-4087: fix table interaction in IE11 [8c5f6f9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c5f6f9)
- [none] Updated dependencies [8c5f6f9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c5f6f9)

## 71.3.33

- [patch] ED-4498: enable gap cursor for comment editor, fixed and refactored table styles [26fd3ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/26fd3ac)
- [none] Updated dependencies [26fd3ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/26fd3ac)

## 71.3.32

- [patch] ED-4591: fix paragraph alignment in comment editor [c420ef0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c420ef0)
- [none] Updated dependencies [c420ef0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c420ef0)

## 71.3.31

- [patch] ED-4629: fix replacing inline extensions [ed1eb59](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed1eb59)
- [none] Updated dependencies [62bacf6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/62bacf6)
  - @atlaskit/theme@3.2.1
- [none] Updated dependencies [ed1eb59](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed1eb59)

## 71.3.30

- [patch] ED-4567 add help dialog tip and undo/redo shortcuts to help dialog [a82ead4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a82ead4)
- [patch] Updated dependencies [a82ead4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a82ead4)

## 71.3.29

- [patch] ED-4606 Fix table floating toolbar [118785e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/118785e)
- [none] Updated dependencies [118785e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/118785e)

## 71.3.28

- [patch] ED-4614: fix weird toolbar buttons highlighting when page is disabled [0cd49f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0cd49f4)
- [none] Updated dependencies [0cd49f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0cd49f4)

## 71.3.27

- [patch] ED-4604 make headings always set, not toggle [8c88cd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c88cd1)
- [patch] Updated dependencies [8c88cd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c88cd1)

## 71.3.26

- [patch] Fix bug where code-block lines would be soft-wrapped [0d08e1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d08e1a)
- [none] Updated dependencies [0d08e1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d08e1a)

## 71.3.25

- [patch] Pasting a link will now generate a new undo step, allowing you to undo only the pasted content. Previously, if you were typing rapidly typing and then pasted content, undo would remove the pasted content AND the text you had typed before it. [c6252d2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6252d2)

- [none] Updated dependencies [c6252d2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6252d2)
- [none] Updated dependencies [2363d14](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2363d14)
  - @atlaskit/button@7.2.3

## 71.3.24

- [patch] Fixing the media group scroll [14c17ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/14c17ba)
- [none] Updated dependencies [14c17ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/14c17ba)

## 71.3.23

- [patch] Updated dependencies [82bd4c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/82bd4c6)
  - @atlaskit/editor-markdown-transformer@0.2.20

## 71.3.22

- [patch] ED-4603: fix emptyCell on Backspace [06a52c9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06a52c9)
- [none] Updated dependencies [06a52c9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06a52c9)

## 71.3.21

- [patch] Escape now closes the link toolbar when activity provider is disabled [b060a5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b060a5a)
- [none] Updated dependencies [b060a5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b060a5a)

## 71.3.20

- [patch] Fixing the hyperlink height [da3e35f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da3e35f)
- [none] Updated dependencies [da3e35f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da3e35f)

## 71.3.19

- [patch] Adding borders for colors in color picker [dc842ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc842ac)
- [none] Updated dependencies [dc842ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc842ac)
  - @atlaskit/editor-common@9.3.7

## 71.3.18

- [patch] Align font sizes for inline code, mentions and dates [d2ef1af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d2ef1af)
- [none] Updated dependencies [d2ef1af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d2ef1af)
  - @atlaskit/mention@11.1.2
  - @atlaskit/code@4.0.3

## 71.3.17

- [patch] Updated Tooltip format for toolbar buttons. [82ba018](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/82ba018)
- [none] Updated dependencies [82ba018](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/82ba018)

## 71.3.16

- [patch] Remove horizontal scroll in an empty table [44caac1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/44caac1)
- [none] Updated dependencies [44caac1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/44caac1)

## 71.3.15

- [patch] internal changes to ContentNodeView to support mocking around contentDOM in tests [d6f88f1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d6f88f1)
- [patch] Updated dependencies [d6f88f1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d6f88f1)

## 71.3.14

- [patch] ED-4628: fixed list button group styles [ca01876](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca01876)
- [none] Updated dependencies [ca01876](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca01876)

## 71.3.13

- [patch] ED-4152: added clear formatting to help dialog [9cc835a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cc835a)
- [none] Updated dependencies [9cc835a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cc835a)

## 71.3.12

- [patch] ED-4591: fix responsive toolbar alignment to match content area left padding [1ccb6e9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ccb6e9)
- [none] Updated dependencies [1ccb6e9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ccb6e9)

## 71.3.11

- [patch] ED-4633: updated placeholder text [498e7a2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/498e7a2)
- [none] Updated dependencies [498e7a2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/498e7a2)

## 71.3.10

- [patch] Adding nested ul support [ce87690](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce87690)
- [none] Updated dependencies [ce87690](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce87690)
  - @atlaskit/renderer@16.2.4

## 71.3.9

- [patch] Fixing the link dialog url heights [7268bef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7268bef)
- [none] Updated dependencies [7268bef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7268bef)

## 71.3.8

- [patch] Don't wrap date [759c194](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/759c194)
- [none] Updated dependencies [759c194](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/759c194)

## 71.3.7

- [patch] Fix size of delete button for code block [92b0e26](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92b0e26)
- [none] Updated dependencies [92b0e26](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92b0e26)

## 71.3.6

- [patch] Prevent link-edit dialog from jumping [5ea20fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ea20fa)
- [none] Updated dependencies [5ea20fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ea20fa)

## 71.3.5

- [patch] ED-4631: fix list padding [16ef82c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/16ef82c)
- [none] Updated dependencies [16ef82c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/16ef82c)

## 71.3.4

- [patch] FeedbackToolbar item now renders correctly in IE11. Additionally, components rendered via `primaryToolbarComponents` will now be vertically-centered in the toolbar. [02ad242](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/02ad242)
- [none] Updated dependencies [02ad242](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/02ad242)

## 71.3.3

- [patch] Disable overlay for mediaSingle [147bc84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/147bc84)
- [none] Updated dependencies [147bc84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/147bc84)
  - @atlaskit/renderer@16.2.3
  - @atlaskit/editor-common@9.3.6

## 71.3.2

- [patch] ED-4523 implement contexual delete [9591127](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9591127)
- [none] Updated dependencies [3ef21cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ef21cd)
  - @atlaskit/editor-common@9.3.4
  - @atlaskit/renderer@16.2.1

## 71.3.1

- [patch] Proper cursor type for lists [2d6deaa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d6deaa)
- [none] Updated dependencies [2d6deaa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d6deaa)

## 71.3.0

- [minor] Set line-height based on appearance [b21cd55](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b21cd55)
- [none] Updated dependencies [b21cd55](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b21cd55)
  - @atlaskit/renderer@16.2.0

## 71.2.7

- [patch] ED-4299, fix selection after code block and code mark pasting. [72c8ecf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72c8ecf)

## 71.2.6

- [patch] Fix issue with tables in IE with the Comment appearance where it would show a gray resize box that would interfere with the plugin causing unexpected behaviour [1a280e5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1a280e5)

## 71.2.5

- [patch] ED-4564, Replacing invite team member icon in collab editor. [bfe8ffc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bfe8ffc)

## 71.2.3

- [patch] Fix issue with Filmstrip cutting Cards [c5b18db](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c5b18db)

## 71.2.2

- [patch] Showing up title in place of macro name [296c3e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/296c3e3)

## 71.2.1

## 71.2.0

- [minor] Adding support for external images [9935105](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9935105)

## 71.1.7

- [patch] ED-4542 Fix replacing media at the end of the doc [a3c6c3b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3c6c3b)

## 71.1.6

- [patch] Fix issue where autoformatting of links that ended in punctuation like '?' would incorrectly include the punctuation in the link itself (and omit the first character). ED-4288 [352f5c4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/352f5c4)

## 71.1.5

- [patch] Adding progress loader for cloud pickers [e22266c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e22266c)
- [patch] Adding cloud picker support for full-page [2a2269e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2a2269e)

## 71.1.4

- [patch] ED-4529: fix insertRow/insertColumn setting selection [784b529](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/784b529)

## 71.1.2

- [patch] Fixing the bodiless extension cursor issue [224281e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/224281e)

## 71.1.1

- [patch] Fix for cursor possition in tables in collab editor [3f155e8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f155e8)

## 71.1.0

- [patch] Support clicking in and out of an inline code mark. [767a8b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/767a8b5)
- [minor] Support exiting inline-code via clicking to the right of the marked text [7ff302b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ff302b)
- [patch] Bump to prosemirror-view@1.3.0 [faea319](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/faea319)

## 71.0.25

- [patch] Fix hover-control spacing gap in Comment appearance [1119be5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1119be5)

## 71.0.24

- [patch] fix: bump pm-utils to 0.2.19 [b77cb78](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b77cb78)

## 71.0.23

- [patch] ED-4336 support loading dynamic/"auto" tables from confluence to fixed-width tables [0c2f72a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c2f72a)

## 71.0.22

- [patch] ED-4315, Image layout should be disabled inside bodied extension. [a0ed280](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a0ed280)

## 71.0.21

- [patch] Fixes adding the task/decision below the selected extension inside tables [6dc92f9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dc92f9)

## 71.0.20

- [patch] ED-4451: added click handler for gap cursor [d89f397](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d89f397)

## 71.0.18

- [patch] Fix cursor on collapsed editor [ca12d9f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca12d9f)

## 71.0.17

- [patch] ED-4428: fix insertiong of task and decisions [ff1b023](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff1b023)

## 71.0.16

- [patch] ED-4022 new list backspace behaviour [e6f2d97](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6f2d97)

## 71.0.15

- [patch] ED-4235 Fix node selection inside node view on load [4be5c46](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4be5c46)

## 71.0.14

- [patch] Fix toolbar's shouldComponentUpdate was ignoring changes in popupsMountPoint [6a820dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6a820dd)

## 71.0.13

- [patch] Update `editorActions.focus()` to scroll the page to the user's current selection when called [821249b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/821249b)

## 71.0.12

- [patch] Expose table plugin config interface [584c085](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/584c085)

## 71.0.11

- [patch] ED-4296, fix for scrollbars always visible in recent search for hyperlink in windows. [5b39e02](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b39e02)

## 71.0.10

- [patch] ED-4270, changing font of inline code according to ADG3 guidelines. [805d02a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/805d02a)

## 71.0.9

- [patch] Outdent list item on enter if it doesn't have any visible content [4deb043](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4deb043)

## 71.0.8

- [patch][fix] Support action/decision '[]' and '<>' autocompletion inside of bodiedExtensions and column layouts [ad7169c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ad7169c)

## 71.0.7

- [patch] ED-4363, replacing peperclip icon with image icon in top toolbar in editor. [e5cb9b8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e5cb9b8)

## 71.0.6

- [patch] ED-4235 Fix node selection inside node view on load [468bb65](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/468bb65)

## 71.0.5

- [patch] ED-4078 Fix single image layout around headings and lists [3f230a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f230a1)

## 71.0.4

- [patch] Fix WithEditorActions depends on where it's renderer. [9de70c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9de70c6)

## 71.0.3

- [patch] ED-4324 clear selection after doing text replacement [d4a3f3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d4a3f3c)

## 71.0.2

- [patch] ED-4082, fixing position for hyperlink floating toolbar. [c5bfedd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c5bfedd)

## 71.0.1

- [patch] added gap cursor [5d81c8b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5d81c8b)

## 71.0.0

- [major] For media-picker: fetchMetadata and autoFinalize options are removed from UploadParams and replaced with always "true" in the code. For editor-core: "unfinalized" status is removed from MediaStateStatus and finalizeCb from MediaState. [a41759a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a41759a)

## 70.5.2

- [patch] Fix inserting media inside blocks that don't support media [d2458b8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d2458b8)

## 70.5.1

- [patch] Fixing the expand macro copy [ef01bbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef01bbd)

## 70.5.0

- [minor] The editor now only allows ordered list creation via autoformatting that starts with `1`. e.g. `1) Content` or `1. Content`. Using a number other than `1` will no longer trigger the input rules (ED-4344) [9c543c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c543c8)

## 70.4.3

- [patch] ED-4228 adding icons for table floating toolbar advance options. [b466410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b466410)

## 70.4.2

- [patch] Prevent 'Enter' from splitting a code-block that ends in a new-line, when the cursor is not at the end of the code-block. [140c76c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/140c76c)

## 70.4.1

- [patch] Fix vertical positioning of table floating toolbar. [3c96ad5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c96ad5)

## 70.4.0

- [minor] Handle pasting of page-layouts to prevent unpredictable node-splitting behaviour. Will now 'unwrap' the contents of a layout if the slice is a partial range across page layouts, or if we are attempting to paste a layout inside a layout. We now always handle dispatching the transaction to handle paste ourselves (instead of falling back to PM). [f4ca7ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f4ca7ac)

## 70.3.1

- [patch] Adding tooltips for header icons [555a750](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/555a750)

## 70.3.0

- [minor] Media APIs exposed to mobile clients and can be used by native media components [31c66f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/31c66f4)

## 70.2.18

- [patch] ED-4407: bumping pm-utils [7b76b7c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7b76b7c)

## 70.2.17

- [patch] ED-4348 unbreak table rendering [ee4c378](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee4c378)

## 70.2.16

- [patch] ED-4381 add space guards around product and endash autoformat rules [729a77c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/729a77c)

## 70.2.15

- [patch] ED-4220 Shift + Enter on selected media card in editor clears out the collection/id properties from the media node [e002c18](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e002c18)

## 70.2.14

- [patch] ED-4348 fix tables built from transformers [0c2a88a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c2a88a)

## 70.2.13

- [patch] ED-4293, click on left and right of editor in confluence should not scroll editor to bottom. [0476a78](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0476a78)

## 70.2.12

- [patch] ED-4183: added invite to edit button [c0ccb58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c0ccb58)

## 70.2.11

- [patch] Fix issue where attempting to edit copied link on editor would throw error [12146b2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12146b2)

## 70.2.9

- [patch] ED-4341 fix compositions in autoformatting [fdacc32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdacc32)

## 70.2.7

- [patch] ED-4249, Table icon should not be highlighted if current selection is inside table. [a7b5597](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a7b5597)

## 70.2.6

- [patch] FS-1693 added integration tests for task-decision [85867ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85867ea)

## 70.2.5

- [patch] ED-4333 fix handleSave callback [9071629](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9071629)

## 70.2.4

- [patch] Fix MediaCard loading state inside editor [5262ad6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5262ad6)

## 70.2.3

- [patch] ED-4287: fix scroll to the bottom of the page when checking a task item [0905309](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0905309)

## 70.2.2

- [patch] Fix Markdown-it dependency to be the same version that prosemirror-markdown uses internally to prevent unnecessary bundle size increase [9abf097](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9abf097)

## 70.2.1

- [patch] Fixing the selection of table just after an image [20a90cb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/20a90cb)

## 70.2.0

- [patch] Rename allowLayouts props to UNSAFE_allowLayouts to prevent accidental use by consumers [f4098d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f4098d8)
- [minor] Add initial Page Layouts supports for Confluence. Doesn't currently support different layout types / enforcing column constraints in the editor. [ec8f6d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec8f6d8)

## 70.1.0

- [minor] Add a generic type ahead plugin [445c66b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/445c66b)

## 70.0.4

- [patch] ED-4063 fix placeholder not diappearing on Android Chrome [27debe2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/27debe2)

## 70.0.3

- [patch] work around short document content not saving in Android Chrome [11cf48c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11cf48c)

## 70.0.2

- [patch] ED-4294: fix editing bodiedExtension nodes [35d2648](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2648)

## 70.0.1

- [patch] fix deletion of lists and other elements placed after tables; bump prosemirror-commands to 1.0.7 [162960f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/162960f)

## 69.0.0

- [major] CHANGESET: Revert "CFE-1004 macroProvider to extensionProvider (pull request #1308)" [33cb5fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/33cb5fe)

## 68.1.3

- [patch] ED-4283 Fix broken scroll behavior in full-page appearance [8110aa0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8110aa0)

## 68.1.2

- [patch] Use media-core context in MediaPicker constructor [6cc9f55](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6cc9f55)

## 68.1.0

- [patch] Added missing dependencies and added lint rule to catch them all [0672503](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0672503)

## 68.0.3

- [patch] Upgrading PM transform [d3ec47d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d3ec47d)

## 68.0.2

- [patch] Fixing the popup height for recent activity [760d798](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/760d798)

## 68.0.1

- [patch] ED-4175, table toolbar should always be centally aligned. [5d98a75](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5d98a75)

## 68.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 67.0.2

- [patch] enable rule toolbar button if rule is enabled [c3be6b2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3be6b2)

## 67.0.1

- [patch] change table node builder constructor for tests, remove tableWithAttrs [cf43535](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cf43535)

## 67.0.0

- [major] CFE-1004: Rename anything "macro" to "extension" (i.e: MacroProvider to ExtensionProvider) [453aa52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/453aa52)

## 66.1.7

- [patch] refactor tables plugin [47b4e3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/47b4e3a)

## 66.1.6

- [patch] tidy up padding and font-size around collapsed editor [260e744](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/260e744)

## 66.1.5

- [patch] Adding Media inside lists [07d3dff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07d3dff)

## 66.1.3

- [patch] ED-3476 add table breakout mode [7cd4dfa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7cd4dfa)

## 66.1.1

- [patch] Update TaskItem NodeView to fix issue in Collab Editing where task-check would not replicate across sessions [9e331a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9e331a6)

## 66.0.0

- [major] use local preview in MediaCard when available [b33788b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b33788b)

## 65.1.31

- [patch] ED-4184. fixing date picker in full page editor. [efa907c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/efa907c)

## 65.1.29

- [patch] ED-4139, fix selection when empty paragraph is inserted terminally in the node. [8c93c6e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c93c6e)

## 65.1.28

- [patch] Move types/interfaces for ExtensionHandlers to editor-common [3d26cab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d26cab)

## 65.1.27

- [patch] Show upload button during recents load in media picker. + Inprove caching for auth provider used in examples [929731a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/929731a)

## 65.1.26

- [patch] Upgrading ProseMirror Libs [35d14d5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d14d5)

## 65.1.25

- [patch] ED-4119: Add draft async CollapsedEditor support to the Labs for feedback [eb2f891](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eb2f891)

## 65.1.23

- [patch] FEF-730 Fix initial media rendering. [4aa9745](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aa9745)

## 65.1.22

- [patch] FEF-730 Update NodeViews DOM attributes on initial render. [0b8a0f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0b8a0f8)

## 65.1.21

- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)

## 65.1.20

- [patch] ED-4170, in full page editor paragraph should not be created when clicked inside editor. [125d1dc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/125d1dc)
- [patch] ED-4126, Fixing scroll of full page editor. [8ef459d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8ef459d)

## 65.1.18

- [patch] change double hyphen to replace with endash not emdash [2e94bed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e94bed)

## 65.1.17

- [patch] table cell/header attributes in the Confluence transformer [9415aaa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9415aaa)

## 65.1.16

- [patch] ED-4088 fixing selection of mention in macros bug in IE11. [10a016b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10a016b)

## 65.1.15

- [patch] ED-4092: disabling smart code detection on paste [1e8e8da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e8e8da)

## 65.1.14

- [patch] ED-4030 Don't reload Image cards again after upload is done [9aff937](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9aff937)

## 65.1.13

- [patch] ED-4084 fixing layout of recent search select. [423da3e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/423da3e)

## 65.1.12

- [patch] Fix extension edit after introducing createParagraphAtEnd [6a1749a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6a1749a)

## 65.1.11

- [patch] Should save as localId not as taskId [d997fc7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d997fc7)

## 65.1.9

- [patch] Don't lose taskId when task is marked completed [fefee23](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fefee23)

## 65.1.7

- [patch] ED-4064,ED-4065, refactor extensions, codeblock, panel [eb09dcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eb09dcd)

## 65.1.6

- [patch] Making UX nice for user by adding an empty paragraph terminally in the editor. [3cc4930](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3cc4930)

## 65.1.5

- [patch] Add device and browser informatio to jira collector in feedback component. [6f5d172](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6f5d172)

## 65.1.4

- [patch] fix(editor-core): add media mock controls [31e0a7a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/31e0a7a)

## 65.1.1

- [patch] fix mention query regression [ed015a3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed015a3)

## 65.1.0

- [minor] Add full width and wide layout support for single image [ae72acf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae72acf)

## 65.0.5

- [patch] CFE-846: Add support to extension handlers (lite version) [4ea9ffe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4ea9ffe)

## 65.0.4

- [patch] Update appearance to show the buttons on the outside of the Editor [d59ad61](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d59ad61)

## 65.0.3

- [patch] restrict nested bodiedExtensions [2583534](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2583534)

## 65.0.2

- [patch] feature(media-test-helpers): http mocks for media-picker [982085f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/982085f)

## 65.0.1

- [patch] remove mention mark when @ prefix disappears [d62ca26](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d62ca26)

## 65.0.0

- [patch] Fix autoformating in editor after hardbreak. [21712d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21712d6)
- [major] icons are now assignable to card actions, which will cause media cards to render upto 2 icon buttons, or a dropdown menu if more than 2 actions are set [649871c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/649871c)

## 64.1.2

- [patch] Merge old plugins with new plugins [cd02d6b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cd02d6b)

## 64.1.1

- [patch] ED-3914: fix table errors when table looses focus [711e733](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/711e733)

## 64.1.0

- [minor] editor-mobile-bridge module introduced [4a338f6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a338f6)

## 64.0.0

- [major] Use media-core as peerDependency [c644812](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c644812)

## 63.1.0

- [minor] Makes WithPluginState work inside EditorContext [f572201](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f572201)

## 63.0.0

- [major] Re-introduce code-splitting in editor-core [028efda](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/028efda)

## 62.8.0

- [minor] Add width plugin [66128a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66128a0)

## 62.7.16

- [patch] add horizontal rule toolbar item [48c36f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48c36f4)

## 62.7.15

- [patch] fix button spacing on toolbars and panel edit toolbar [23ca4d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/23ca4d0)

## 62.7.13

- [patch] Fix lifecycle issue where we wouldn't call EditorView.destroy on a lifecycle change (i.e. switching from one appearance to another) potentially causing a memory leak. Also fixes an error where Prosemirror would append itself into the child of the <div /> container, rather than using the node as the root of the Editor. [9d0da7a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d0da7a)

## 62.7.12

- [patch] Fix the media group when there is a mix of images and non images [d7f4f67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7f4f67)

## 62.7.11

- [patch] Fix the backspace in table cells in IE11 [4e58321](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e58321)

## 62.7.10

- [patch] Table columns should not resize when typing [59728cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59728cc)

## 62.7.8

- [patch] Adding link in blockquote should not split it. [13dd62e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/13dd62e)

## 62.7.5

- [patch] Fix for styled-components types to support v1.4.x [75a2375](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75a2375)

## 62.7.4

- [patch] fix: prevent autoformatting for formatted-text across hard-breaks [84da82e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84da82e)

## 62.7.2

- [patch] Fix the cursor inside a tablecell with Media group [1f97e8e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1f97e8e)

## 62.7.1

- [patch] JSON encoding results in invalid ADF for table nodes [8a8d663](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a8d663)

## 62.7.0

- [minor] Support dynamically changing the Editor's appearance prop to enable switching between different appearances. Changing props that affect features, e.g. `allowTables` is not supported and won't cause the supported nodes/marks of the editor to change. This support is currently experimental and subject to change. The prop `contentComponents` is no longer rendered inside the ProseMirror contenteditable, instead it is rendered directly before the ProseMirror component. [4497ea8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4497ea8)

## 62.6.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 62.5.3

- [patch] fix nodeViews with multiline content [af4d057](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af4d057)

## 62.5.2

- [patch] ED-3873 fix horizontal rule and codeblock in help [6a3161e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6a3161e)

## 62.5.1

- [patch] Remove keymap for link from help dialog in message editor. [0a47f8e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a47f8e)

## 62.5.0

- [minor] Make textFormatting and hyperlink plugins default [689aa8d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/689aa8d)

## 62.4.3

- [patch] Add autoformatting of atlassian product [2173e92](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2173e92)

## 62.4.2

- [patch] Expose more types for confluence [f95ce9f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f95ce9f)

## 62.4.1

- [patch] Fix: arrow down in nested list which is last item in editor should create a paragraph at depth 0. [9670417](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9670417)

## 62.4.0

- [minor] Disable save button until media finishes upload [aeb54bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aeb54bf)

## 62.3.2

- [patch] Fix issue where removing placeholder-text on typing wouldn't trigger a collab transaction. Also fixed local collaborative editing storybook to not dispatch transactions to the same editor that fired them. [4567ab2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4567ab2)

## 62.3.0

- [minor] Multiline behaviour for Message editor [3f61a6a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f61a6a)

## 62.2.2

- [patch] Fix image disappears after set to left-aligned [0c79fc3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c79fc3)

## 62.2.1

- [patch] Enforce minimum version of w3c-keyname to be >= 1.1.8 [dc120b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc120b9)

## 62.2.0

- [minor] replaceSelection with empty string removes selection [a764af6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a764af6)

## 62.1.2

- [patch] fixes RangeError bug when shouldFocus=true [adbd055](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/adbd055)

## 62.1.1

- [patch] fix prosemirror-view when collab editing tables [111cc6a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/111cc6a)

## 62.1.0

- [minor] advanced features for tables [e0bac20](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e0bac20)

## 62.0.23

- [patch] Fix Insert Toolbar throws error about context if not placed inside EditorContext [dca4821](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dca4821)

## 62.0.22

- [patch][smrt-156] Start tracking the containerId, objectId & mentioned user when a Mention is inserted into the Editor [36c1b22](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36c1b22)

## 62.0.21

- [patch] FS-1461 objectAri and containerAri are optional in RendererContext [1b20296](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b20296)

## 62.0.19

- [patch] Adding opt out instructions for bitbucket users. [14cc50f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/14cc50f)
- [patch] Changes in inline autoformatting rules to make then more well defined. [e6a5a14](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6a5a14)

## 62.0.18

- [patch] Fix the Floating toolbar styling - Bradleys wishlist [fe45969](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fe45969)

## 62.0.17

- [patch] Hide the 'Insert Placeholder Text' menu item by default [1274a31](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1274a31)

## 62.0.14

- [patch] Fix toolbar style in editor [ebe7265](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebe7265)

## 62.0.13

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 62.0.12

- [patch] Don't block getValue untill media is ready [2440642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2440642)

## 62.0.11

- [patch] Fix issue with having multiple Dropzone elements listening at the same time with Editor and MediaPicker [d37de20](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d37de20)

## 62.0.10

- [patch] fix setting selection inside of the content nodeView [5beb385](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5beb385)

## 62.0.9

- [patch] Show fake cursor when inserting a placeholder text element [ca557d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca557d0)

## 62.0.7

- [patch] Allow width/height for placeholder and polish rendering [6d9f809](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d9f809)

## 62.0.6

- [patch] fix date when inserting from + menu [8f6bd7c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8f6bd7c)

## 62.0.5

- [patch] ED-3270: Allow arbitrary items to be added to the plus menu [a88b921](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a88b921)

## 62.0.4

- [patch] Fix an issue where Shift-Enter shortcuts would not be properly handled by the Editor. Refactored the BlockType and Tables shortcut handlers to better support the updated editor architecture. [a78626e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a78626e)
- [patch] Minor fixes for the placeholder node to improve experience. We now highlight the node when selected, and fixed a bug where clicking on the span in a list would not trigger a selection change [a9576d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a9576d8)
- [patch] Add support for inserting custom placeholder-text via the Insert Block menu [dfc41ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dfc41ea)

## 62.0.2

- [patch] Fix editor getValue action is giving old doc while using with waitForMediaUpload [14010c3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/14010c3)

## 62.0.0

- [major] Move media provider and state manager to editor-core [0601da7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0601da7)

## 61.9.0

- [minor] Add replaceSelection method to EditorActions [e0da0dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e0da0dd)

## 61.8.2

- [patch] Removes @atlaskit/profilecard dependency from editor-core [5a0555e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5a0555e)

## 61.8.0

- [patch] Refactor PlaceholderText to use a NodeView to improve selection behaviour across browsers [47e4b88](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/47e4b88)
- [minor] Support the `allowTemplatePlaceholders` prop to enable placeholder text elements. [70dbde2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70dbde2)

## 61.7.16

- [patch] Autoformatting should work for single character. [70e44af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70e44af)

## 61.7.15

- [patch] Handle Media.getDomElement when node has no child nodes [618b0c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/618b0c1)

## 61.7.13

- [patch] Allow macro provider to handle auto conversion during paste [b2c83f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b2c83f8)

## 61.7.12

- [patch] When adding blockquote from toolbar cursor is not visible. [c7c4780](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c7c4780)

## 61.7.11

- [patch] fix space after mention [b47f480](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b47f480)

## 61.7.9

- [patch] bump mention to 9.1.1 to fix mention autocomplete bug [c7708c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c7708c6)

## 61.7.8

- [patch] Adding product detail to JIRA collector feedback form. [81a9fd3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/81a9fd3)

## 61.7.6

- [patch] fix table controls on crazy fast resize [ad93c0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ad93c0b)

## 61.7.5

- [patch] Add ToolbarFeedback export back [8525bb2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8525bb2)

## 61.7.4

- [patch] fix cursor pos on table controls hover [76bfa3f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76bfa3f)

## 61.7.3

- [patch] cket-transformer/**tests**/\_schema-builder.ts [a6e77ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6e77ff)
- [patch] move MediaItem to renderer, bump icons [5e71725](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e71725)

## 61.7.2

- [patch] Clear formatting advance option should remove panel, blockquote and code block node types. [966a444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/966a444)

## 61.7.1

- [patch] added ContentNodeView class to fix nodeViews that has contentDOM ref [53f2a38](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/53f2a38)

## 61.7.0

- [minor] The allowPlaceholderCursor prop has been removed in favour of always showing the (now renamed) fake text-cursor. [c5da217](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c5da217)

## 61.6.4

- [patch] Removes components, examples, and tests, for old arch editor [9fd0649](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9fd0649)

## 61.6.3

- [patch] Reducing min-width of comment editor to 272px. [c71ff58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c71ff58)

## 61.6.2

- [patch] Fix uploading a big image causes many duplicated uploading [27b6510](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/27b6510)

## 61.6.0

- [minor] added table column resizing plugin [c61e092](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c61e092)

## 61.5.2

- [patch] Adding support for heading6. [147cd8e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/147cd8e)

## 61.5.0

- [minor] FS-1624 Add new popupsScrollableElement props to editor to handle case when mountPoint is different than the scrollable element. [7d669bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d669bc)

## 61.4.12

- [patch] Code block in JIRA has no formatting and not distinguishable from normal text. [5bdb48f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5bdb48f)

## 61.4.11

- [patch] Insert media group instead of single image inside table [5b4aaa0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b4aaa0)

## 61.4.9

- [patch] Backtick should be removed at paste if its followed by code. [d74188d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d74188d)

## 61.4.8

- [patch] Add timestamp with filename on paste [18b1108](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18b1108)

## 61.4.7

- [patch] Fixes hyperlink popup positioning when popupMountPount is provided [ff2c8c9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff2c8c9)

## 61.4.6

- [patch] use new MediaPicker package [c652ed4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c652ed4)

## 61.4.5

- [patch] Add image upload icon back [768c601](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/768c601)

## 61.4.4

- [patch] fix extension replacement with empty content [e151446](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e151446)

## 61.4.3

- [patch] fixed extension node content field [41c7958](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/41c7958)
- [patch] Add analytics for hyperlink autocomplete [345b082](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/345b082)

## 61.4.2

- [patch] fixed typescript error [19630c5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/19630c5)
- [patch] added mention picker space analytics [05fa937](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/05fa937)

## 61.4.1

- [patch] fixed typescript validation error in the EmojiTypeAhread test [c56d564](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c56d564)
- [patch] added analytics for EmojiTypeAhead component [021d6f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/021d6f8)

## 61.4.0

- [minor] added new panelType [9f693b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f693b9)

## 61.3.12

- [patch] Fix list shortcuts [c25601a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c25601a)

## 61.3.11

- [patch] Fixes nodeviews becoming empty after some transactions [c8ba47c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8ba47c)

## 61.3.10

- [patch] Change line length in Full Screen editor from 600px to 680px [6dacbbe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dacbbe)

## 61.3.8

- [patch] Keymaps not supported on windows should not be visible in help dialog on windows. [6872f52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6872f52)

## 61.3.7

- [patch] Improvements in code block. [da0fee1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da0fee1)

## 61.3.6

- [patch] Fix link dialog styling issues with recent items search [667aaa7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/667aaa7)

## 61.3.4

- [patch] Remove placeholderBaseUrl config option from the Confluence Macro Provider [1583960](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1583960)
- [patch] Fix Extension Header img height to 24px, center elements vertically [49f48bb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49f48bb)

## 61.3.3

- [patch] Addes in editor-markdown-transformer package [10042be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10042be)

## 61.3.2

- [patch] Fix cursor position after mention and emoji [330b8d2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/330b8d2)

## 61.3.1

- [patch] Fix spacing and toolbar alignment for message editor [98b961e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98b961e)

## 61.3.0

- [minor] added date plugin [f7b8a33](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f7b8a33)
- [patch] fixed insertion of a table when selection has a mark [3d8226e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d8226e)

## 61.2.1

- [patch] Fix accessing clipboardData.types in Edge (fixes paste) [91b921b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/91b921b)
- [patch] Updates in responsive editor [353c5d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/353c5d6)

## 61.2.0

- [minor] Grid layout for Single Image [59a8e22](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59a8e22)

## 61.1.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 61.0.3

- [patch] Fix update single image toolbar state on selection change [bea78aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bea78aa)

## 61.0.1

- [patch] Fix analytics event name for strikethrough button. [ac96c66](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ac96c66)

## 61.0.0

- [patch] cleanup tables [372ac9b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/372ac9b)
- [major] FS-1461 added TaskDecisionProvider and ContextIdentifierProvider to editor props [62fca1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/62fca1e)

## 60.20.2

- [patch] added createStep to collab provider [139e70d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/139e70d)
- [patch] Revert change os enter keypress in stride. [4eac0d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4eac0d8)

## 60.20.1

- [patch] Autoformatting for task and decision items should work inside tables. [13c90ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/13c90ff)

## 60.20.0

- [minor] Add horizontal rule support in full-page editor [9cefb57](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cefb57)

## 60.19.0

- [patch] Remove duplicate implementation of ProviderFactory from @atlaskit/editor-core, in favour of only one implementation in @atlaskit/editor-common [535cb8c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/535cb8c)
- [minor] bump prosemirror-tables to 0.5.2 [32b6bbe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/32b6bbe)
- [minor] added tasks/actions to full-page editor [49d3343](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d3343)
- [patch] Horizontal rule autoformatting should work after shift+enter. [f600f0e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f600f0e)

## 60.18.1

- [patch] Fix insert single image from 3rd party integration [a337df1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a337df1)

## 60.18.0

- [minor] add version to editor.start analytics [3b4c21b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3b4c21b)
- [minor] add name and version to editor.start analytics [d8d2388](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d8d2388)

## 60.17.6

- [patch] Improve emoji and mention providers in editor's examples [bd68138](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd68138)

## 60.17.5

- [patch] Fixing text padding in message editor. [a4af16c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4af16c)
- [patch] In message editor pasting content more in size than max allowed limit should show warning and insert toolbar options should be disabled once max size is reached. [7078916](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7078916)

## 60.17.4

- [patch] Fix issue with some of autoformatting using markdown syntax failing for links. [6e5ed2b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e5ed2b)

## 60.17.3

- [patch] Mod-Enter should submit editor content for all products. [65ede03](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65ede03)
- [patch] Fix for issue that panel toolbar is not visible when cursor is inside a list in panel. [dce5d66](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dce5d66)

## 60.17.1

- [patch] validate incoming ADF node inserted from macro browser [e9d0af2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e9d0af2)

## 60.17.0

- [minor] Added floating toolbar to media single [46fdd15](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/46fdd15)

## 60.16.1

- [patch] Add support for single image wrap left/right layout [59d9a74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59d9a74)

## 60.16.0

- [minor] Enter keypress should always submit in stride. [51020fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/51020fe)

## 60.15.8

- [patch] Update dependencies [623f8ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/623f8ca)

## 60.15.7

- [patch] Support old plugins in WithPluginState helper [194bc9c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/194bc9c)

## 60.15.6

- [patch] Fixed stand alone file and link card rendering [d851bfc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d851bfc)

## 60.15.5

- [patch] Collaborative editing telepointers 2.0 [297afbf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/297afbf)

## 60.15.4

- [patch] Fixes Firefox rendering bug, missing attrs in transformer, new selection [f59e8c4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f59e8c4)

## 60.15.3

- [patch] Fix hyperlink edit to close on esc keypress [8245c10](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8245c10)

## 60.15.2

- [patch] Duplicate imageUploadPlugin paste/drop tests into editor-core. Add ProviderFactory.create({ name: provider }) helper function to reduce boilerplate. [a5a36cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a5a36cc)
- [patch] Setting new mediaProvider will close any existing media picker window [cf4785d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cf4785d)
- [patch] Support breakout mode for block nodes [538fa77](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/538fa77)
- [patch] Fixing language picker in full-page editor. [9720b28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9720b28)

## 60.15.1

- [patch] replaced inlineMacro node with inlineExtension node [a43f891](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a43f891)

## 60.15.0

- [patch] Bumped emoji to v31 [c4365e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c4365e4)
- [patch] Fix editor scrolling and initial telepointer issue in collab mode [efba71b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/efba71b)
- [patch] Bumped emoji to v31 [207e0fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/207e0fc)
- [patch] Added new AppCardView v1.5 designs behind a feature flag. [92bc6c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92bc6c8)
- [minor] FS-1461 taskDecisionProvider and contextIdentifierProvider added to task props [eaa9bfc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eaa9bfc)

## 60.14.16

- [patch] Add Serializer for Single image [03405bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/03405bf)

## 60.14.15

- [patch] Auto-formatting for blocks should work after shift-enter. [12c93ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12c93ca)

## 60.14.14

- [patch] Fix Single Image margin [54d4681](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/54d4681)

## 60.14.13

- [patch] Temporarily hiding tooltips for headings. [ac7d6bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ac7d6bd)

## 60.14.12

- [patch] Fixes issues where an incorrect object comparison would cause cascading telepointer events to fire on each transaction. [c3263c9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3263c9)

## 60.14.11

- [patch] Fix single image temporary placeholder alignment [0a891be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a891be)

## 60.14.10

- [patch] Add default center layout support for single image [6113e02](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6113e02)

## 60.14.6

- [patch] Fix issue where focusing in the editor would not work as expected in Safari when the editor has a placeholder [ac96315](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ac96315)

## 60.14.5

- [patch] Display telepointer of existing users when joining a collaboration session [a6441ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6441ff)

## 60.14.4

- [patch] Bumped task decision version [1180bbe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1180bbe)

## 60.14.2

- [patch] Fix issue where disabled state was not being set correctly for the new-arch editors [79095b1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79095b1)
- [patch] Fix comments editor paddings [c8a57cf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8a57cf)
- [patch] Rename singleImage to mediaSingle. Replaced alignment and display attributes with layout. [0b97f0a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0b97f0a)
- [patch] Updated map of ac:emoticons to new emojis [f7f214e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f7f214e)

## 60.14.1

- [patch] Unskipping jest tests [54d88f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/54d88f7)

## 60.13.0

- [minor] Remove marks on change to empty document [b5eec07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5eec07)

## 60.12.0

- [minor] replaced deprecated mention toolbar analytic with new one [cf2dd95](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cf2dd95)
- [patch] replaced deprecated mention analytics with the new ones [8a9070c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a9070c)
- [patch] fixed typescript build errors [0d5baaa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d5baaa)
- [minor] code improvements for mention analytics and tests added [35bd176](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35bd176)
- [minor] added analytic events for mentions [1f7019a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1f7019a)

## 60.11.0

- [minor] Add rule plugin [caf2ac0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/caf2ac0)

## 60.10.0

- [minor] Remove support for images with data URI's for Bitbucket's image node in the editor [e055dee](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e055dee)
- [patch] Fixed an issue with drag-and-dropping images in Firefox where dropping an image on the padding of the parent container of Prosemirror's contenteditable would cause the image to be added to the editor via an InputEvent rather than trigger a DragEvent. [9b69d97](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b69d97)

## 60.9.3

- [patch] fix inline comments marker name in schema [966f9c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/966f9c2)

## 60.9.2

- [patch] split extension node [4303d49](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4303d49)

## 60.9.1

- [patch] Provide an option to disable subscript/superscript in new arch [264db1f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/264db1f)

## 60.9.0

- [patch] Fixes table controls styles for firefox and chrome [3f0a783](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f0a783)

## 60.8.4

- [patch] Add default inline code styles [d5d8e5f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5d8e5f)

## 60.8.3

- [patch] Fix getValue() action resolving too early with media in-flight. [d31fafe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d31fafe)

## 60.8.2

- [patch] added extension node [ec73cb8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec73cb8)

## 60.8.0

- [patch] Fix dependencies [9f9de42](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f9de42)
- [patch] Fix dependencies [5a4d799](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5a4d799)
- [minor] ED-2864, adding fake cursor to links. [4655eac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4655eac)

## 60.7.1

- [patch] Adding more unit test coverage for responsive editor changes. [0b35f50](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0b35f50)

## 60.7.0

- [patch] Move docs to be a dev dependency for editor-core [65ada60](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65ada60)
- [minor] Adding separate transformer packages. [f734c01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f734c01)

## 60.6.0

- [minor] Change in collapse order of responsive editor toolbar. [14448bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/14448bd)

## 60.5.3

- [patch] FS-1366 fix selection in action/decision [854c137](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/854c137)

## 60.5.2

- [patch] moved table plugins methods to utils [90e6b2b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/90e6b2b)

## 60.5.1

- [patch] fixed pasting links [847d51b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/847d51b)

## 60.5.0

- [minor] Added single image to schema; insertFile renamed to insertFiles. [1c6b005](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c6b005)

## 60.4.6

- [patch] Make tables 100% width in full page editor [a28ac19](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a28ac19)

## 60.4.5

- [patch] @atlaskit/emoji bumped to ^30.3.3 for big emoji scrolling bugfix [095d6ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/095d6ba)

## 60.4.4

- [patch] Pasting multiple markdown links should create multiple links in the editor. [829b312](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/829b312)

## 60.4.3

- [patch] bump icon dependency [da14956](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da14956)

## 60.4.2

- [patch] Add documentation to editor core; introduce code formatting method to docs [a1c7e56](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1c7e56)

## 60.4.1

- [patch] Fixing height of message editor to 32px height and 2px border. [251b2f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/251b2f5)

## 60.4.0

- [minor] Rename monospace to code in toolbar. [6600999](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6600999)

## 60.3.3

- [patch] Fixing textColor toolbar component for IE11. [d095fc2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d095fc2)

## 60.3.1

- [patch] Collaborative editing telepointers 2.0 [297afbf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/297afbf)

## 60.3.0

- [minor] Fix panel node view and floating toolbars of full page editor in new architecture. [7db53e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7db53e6)

## 60.2.5

- [patch] Fixed stand alone file and link card rendering [d851bfc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d851bfc)

## 60.2.3

- [patch] Upgrade mention to ^8.1.0 in editor and renderer [48b5af4](48b5af4)

## 60.2.1

- [patch] Restore accessLevel attribute for mention node [a83619f](a83619f)

## 60.2.0

- [minor] allow consumers of BB Transformer to disable BB link stripping [96424fa](96424fa)

## 60.1.0

- [minor] ED-2146, when pasting link inline style marks should be cleared from position after link. [bfdcb66](bfdcb66)

## 60.0.0

- [major] Use correct dependencies [7b178b1](7b178b1)
- [major] Adding responsive behavior to the editor. [e0d9867](e0d9867)

## 59.6.0

- [minor] Added big emoji render logic to editor-core [5bf750f](5bf750f)

## 59.5.0

- [minor] Upgrade Media Editor packages [193c8a0](193c8a0)
