# @atlaskit/editor-common

## 60.0.0

### Major Changes

- [`b95863772be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b95863772be) - Support external observers.
  Use better naming for refNode (refNode => reference).
  In favor of further work (supporting multiple references) pass array of references to Extension component.
  Expand node with localId for extentions.

### Minor Changes

- [`71bb1bb3cd0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/71bb1bb3cd0) - [ED-12933] Create TypeAhead common constant for mobile-bridge and editor-core
- [`2a6a10f9c5f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2a6a10f9c5f) - CETI-29 Updated emoji picker toolbar icon for custom panels
- [`d1a58a7a520`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1a58a7a520) - [ux] ED-12460 Implement collab scroll-to-telepointer: a user can now click on a collab avatar and be scrolled to another user's position in the document

### Patch Changes

- [`53d81fa08ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/53d81fa08ee) - CETI-14 added functionality to hide emoji from custom panel
- [`bd510f46bff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bd510f46bff) - CETI-30 added functionality to add custom panel via the slash command
- [`099e8495f3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/099e8495f3d) - CETI-37 - Fixed custom panel icon sizing and alignment
- [`b90c0237824`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b90c0237824) - Update package.jsons to remove unused dependencies.
- Updated dependencies

## 59.1.0

### Minor Changes

- [`ea1cb28fb03`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea1cb28fb03) - CETI-3 User is able to change emoji and background color when selected
- [`c796dfa0ae4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c796dfa0ae4) - [ME-1589] Rearchitect the adaptive toolbar solution for the editor mobile bridge.

  - Add a new plugin to editor-core that allows you to subscribe to events when the editor view is updated.
  - Created a subscription that allows you to listen to toolbar and picker plugin updates.

- [`6de7ba8ca3b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6de7ba8ca3b) - ED-12424 Add scrollTo function to extension api
- [`8e6a1034cfd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8e6a1034cfd) - EDM-1730: added in-product Cypress tests for Smart Links

### Patch Changes

- Updated dependencies

## 59.0.0

### Minor Changes

- [`adccfcdafd8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/adccfcdafd8) - [ux] ED-13043 Add experimental `__hideFrame` option in extension manifest for extension nodes. This removes the border in edit mode to bring it closer to WYSIWYG. This cannot be opted into for the 'mobile' appearance & frames will continue to always show.
- [`5e55b55d035`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e55b55d035) - [ux][ed-9961] Remove the predictable lists feature flag and the legacy lists plugin so that predictable lists is default.

  Doing this by removing the lists plugin, removing the predictableLists feature flag, renaming lists-predictable to just list, refactoring any areas of the code that used the feature flag or the legacy lists still.

  This is a breaking change but has been thoroughly tested locally & with a team blitz on the branch deploy, on both web & mobile.

- [`abf8b155d75`](https://bitbucket.org/atlassian/atlassian-frontend/commits/abf8b155d75) - [ME-1416] Remove multi dispatch occurance from the panels plugin. Make the floating toolbar items rely only on the node not what is in the plugin state.
- [`797ffbdcd7f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/797ffbdcd7f) - Update focus style for expand button, change aria-label to aria-labelled by

### Patch Changes

- [`3d363ebc5e7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3d363ebc5e7) - ED-13000: Capture browser extension usage in error analytics
- [`66ea628bcea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/66ea628bcea) - Add data-media-caption attribute to Caption
- [`a7d6732987f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a7d6732987f) - ED-13471 Fix nested list styles in table of contents extension being incorrect
- Updated dependencies

## 58.1.2

### Patch Changes

- [`414b6216adf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/414b6216adf) - Upgrade date-fns to ^2.17

## 58.1.1

### Patch Changes

- [`799eae9351d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/799eae9351d) - Updating BaseFieldDefiniton type to include isHidden on it.

## 58.1.0

### Minor Changes

- [`1075019cefe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1075019cefe) - Add NodeProps to Caption

### Patch Changes

- [`6720f568f2b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6720f568f2b) - EDM-983: Fix media max width when inside nested nodes
- Updated dependencies

## 58.0.0

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

### Minor Changes

- [`a8b65e3ec2d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a8b65e3ec2d) - [ux] ED-13083: fixed serialize() for Tabs and Expand fields

### Patch Changes

- [`55ebaf7010d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/55ebaf7010d) - ED-13023 do not override code-block background in editor
- Updated dependencies

## 57.2.0

### Minor Changes

- [`92c1a74eb2d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/92c1a74eb2d) - [ux] ED-13083: fixed serialize() for Tabs and Expand fields

## 57.1.3

### Patch Changes

- [`9e09b407b43`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e09b407b43) - Exclude `__tests_external__` from the `build/tsconfig.json`.
  Add `local-cypress` and remove types export.

## 57.1.2

### Patch Changes

- [`070261ec304`](https://bitbucket.org/atlassian/atlassian-frontend/commits/070261ec304) - Fix Cypress types for packages

## 57.1.1

### Patch Changes

- Updated dependencies

## 57.1.0

### Minor Changes

- [`e66cd2fe716`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e66cd2fe716) - ED-12655: added support for config panel tabs
- [`11b9305ca1b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/11b9305ca1b) - [ux] ED-12649 add ColorField definition and UI to ConfigPanel
- [`35645d7d1b7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/35645d7d1b7) - ED-12762 Prevent nesting of GroupingFields (for now)
  Added localization for expand field
- [`5d8e5bd7d50`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d8e5bd7d50) - [ux] Added support for dynamic getFieldsDefinition() in Editor Extensions.

  Made changes to the extension config panel fields so it triggers a submit only if the field is "dirty".

### Patch Changes

- [`cda36713f70`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cda36713f70) - ED-12738 Validator to wrap the entity into unsupported content for minimum content Length error
- Updated dependencies

## 57.0.0

### Major Changes

- [`713dcb9d058`](https://bitbucket.org/atlassian/atlassian-frontend/commits/713dcb9d058) - remove DataSourceField

### Minor Changes

- [`81a08ceb2e0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81a08ceb2e0) - ED-12653 added field definitions for GroupingField and ExpandField.

### Patch Changes

- [`1fbe305bf7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1fbe305bf7d) - ED-12273 Unsupported content support for Layout
- Updated dependencies

## 56.0.0

### Major Changes

- [`4befa7c039c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4befa7c039c) - ED-12593: rename ExtensionAPI.editInLegacyMacroBrowser() to \_editInLegacyMacroBrowser()

  Also cleaned up the options for createExtensionAPI() for easier use.

- [`e20ad95e07f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e20ad95e07f) - implemented ExtensionAPI.doc.insertAfter()

### Minor Changes

- [`eb2ccccfa14`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb2ccccfa14) - ED-12514: Add sampling rate controls to unsupported content levels tracking
- [`a6a270c4645`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a6a270c4645) - ED-12713 exposed extention module toolbar button type for usage in extension manifests
- [`d575abf3498`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d575abf3498) - EDM-1640: Introduce Cypress in-product tests in Atlassian Frontend

  Example test:

  ```
  import { editorFundamentalsTestCollection } from '@atlaskit/editor-common/in-product';

  //code to navigate to the page

  editorFundamentalsTestCollection({}).test(cy);

  ```

### Patch Changes

- [`ac2eeccc60b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac2eeccc60b) - Update internal use of code block selector in editor packages.
- [`b78cea62de8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b78cea62de8) - Table contextual panel flicker issue fixed.
- [`7ba7af04db8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ba7af04db8) - Type fixes related to consumption of `@atlaskit/code`
- Updated dependencies

## 55.5.2

### Patch Changes

- [`c2c0160f566`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2c0160f566) - Bump editor-shared-styles to pick up relativeFontSizeToBase16
- Updated dependencies

## 55.5.1

### Patch Changes

- [`df1da03ac3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df1da03ac3d) - define interface for api extension
- [`5a6e9efd99b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a6e9efd99b) - ED-12508 implement api stub
- [`5c835144ef0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c835144ef0) - [ME-741][me-743] Remove PX references in editor packages and modify code block font size.
- Updated dependencies

## 55.5.0

### Minor Changes

- [`769e10a40a7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/769e10a40a7) - ED-12108 Support duplicate named fields in config panel fieldset

  For a field to be allowed to have duplicates you must set `allowDuplicates: true` on the field definition

- [`f27507bc838`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f27507bc838) - ED-12237: add editor referentiality plugin

### Patch Changes

- [`58b170725be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58b170725be) - Renamed @atlaskit/editor-test-helpers/schema-builder to @atlaskit/editor-test-helpers/doc-builder
- [`2942644d694`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2942644d694) - Some improvements used in rendering embeds in renderer around use of aspectRatio
- Updated dependencies

## 55.4.3

### Patch Changes

- [`6d748ea5140`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6d748ea5140) - New stage-0 data consumer mark in ADF schema
- [`d2e70ebaaa9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2e70ebaaa9) - NO-ISSUE: updated editor tests to use 'doc: DocBuilder' instead of 'doc: any'
- [`ee188b01fc0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ee188b01fc0) - ED-12339 added adf information to be passed into extension button on click action
- [`b7e61c08ef5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7e61c08ef5) - [ux] ED-11916 Extended floating toolbars on table and exension nodes with buttons that can be provided by extensions
- Updated dependencies

## 55.4.2

### Patch Changes

- [`471e2431a7c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/471e2431a7c) - Downgrade back to date-fns 1.30.1
  We discovered big bundle size increases associated with the date-fns upgrade.
  We're reverting the upgarde to investigate

## 55.4.1

### Patch Changes

- [`70f0701c2e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70f0701c2e6) - Upgrade date-fns to 2.17

## 55.4.0

### Minor Changes

- [`b74caaa43e9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b74caaa43e9) - add reserveCursor option to init event
- [`4f08f25ebfe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f08f25ebfe) - NO-ISSUE pass through feature flags into renderer
- [`d33f17ed9b6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d33f17ed9b6) - ED-11153: additionally map tti values in editor tti event to severity strings

### Patch Changes

- [`0d2d52fc9a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0d2d52fc9a4) - ED-12207 fix emoji in panels overflow
- [`ffbe78153cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ffbe78153cf) - New stage0 ADF change: localId attribute on Table nodes
- [`e2bb7c1adbc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e2bb7c1adbc) - ED-9699 Fix codeblock in list within panel UI
- Updated dependencies

## 55.3.0

### Minor Changes

- [`2cde1293d9f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2cde1293d9f) - [ux] `useAlternativePreloader` prop was added to `CardOptions`, which is type of editor prop `UNSAFE_cards`. Default value is true (if not defined). When `useAlternativePreloader` is true preloader experience for smart link components in editor will be different: there won't be normal smart link skeleton (border and a shaddow) and spinner is located on the right (compare to left as before). Note: renderer experience won't change.

### Patch Changes

- [`ad4bc282c53`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad4bc282c53) - Fix media click issue for center layout images
- [`e07a815d377`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e07a815d377) - ED-11807 performance optimization for table sticky headers plugin
- [`89a358773d2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/89a358773d2) - Don't wrap unsupportedBlock again after an INVALID_CONTENT_LENGTH error
- [`a2d44651925`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2d44651925) - ED-11161: Track unsupported content levels severity in renderer
- Updated dependencies

## 55.2.1

### Patch Changes

- Updated dependencies

## 55.2.0

### Minor Changes

- [`8c90794239c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c90794239c) - ED-11587: quickInsert for placeholder-text plugin
- [`7ddbf962bd9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ddbf962bd9) - [ux] Updated and added new translations
- [`586040bf70b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/586040bf70b) - Ensure that all children are validated in new error path

### Patch Changes

- [`5857b17788b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5857b17788b) - Change the way kitchen sink shows ADF errors
- [`faf98b96883`](https://bitbucket.org/atlassian/atlassian-frontend/commits/faf98b96883) - Removed unused comments in src from package
- [`3df9d98ef8a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3df9d98ef8a) - [ux] As part of the bump to @atlaskit/code, the codeBlock element's visual appearance has been modified in renderer and editor-core. Specifically the fontSize, borderRadius, lineHeight and overflow behaviour have been made more consistent with the DS parent package.
- [`07868e5ddc9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07868e5ddc9) - remove unecessary function from getQuickInsertItemsFromModule()
- Updated dependencies

## 55.1.2

### Patch Changes

- [`549740c01d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/549740c01d) - Exported the validator errors map
  Convert nodes that are after an invalid length to be unsupported
- Updated dependencies

## 55.1.1

### Patch Changes

- Updated dependencies

## 55.1.0

### Minor Changes

- [`64281cda86`](https://bitbucket.org/atlassian/atlassian-frontend/commits/64281cda86) - ED-11151: Improve TTI measurements
- [`38e24bcc76`](https://bitbucket.org/atlassian/atlassian-frontend/commits/38e24bcc76) - ED-10832 Track unsupportedNode Attribute with null value explicitly

### Patch Changes

- [`9e76e3a5c5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e76e3a5c5) - [ux] Adding support to detect and render anchor links.
- Updated dependencies

## 55.0.0

### Major Changes

- [`0923d917ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0923d917ef) - `MediaSingle` prop 'blockLink' is removed and `width` becomes optional.
  `MediaSingleDimensionHelper` prop `ratio` is removed.

### Patch Changes

- [`81a5e08f06`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81a5e08f06) - Fix divider not visible in dark mode
- Updated dependencies

## 54.0.0

### Major Changes

- [`da77198e43`](https://bitbucket.org/atlassian/atlassian-frontend/commits/da77198e43) - Rename title:changed to metadata:changed in collab provider, editor common and mobile bridge
- [`cc9f374276`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc9f374276) - Remove unsupported API for includeGroups/includeTeams for Users in extension config, and stop setState after unmount

### Minor Changes

- [`5e68f04701`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e68f04701) - ED-11232 Make resolvers aware of other field values
- [`48995f73b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/48995f73b2) - Create entry points to export internal API isolated from UI changes.

### Patch Changes

- [`4bc26fee2e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4bc26fee2e) - [ux][twista-496] Adds drop shadow to focused state of annotation/Inline Comment
- [`4c6c92aee6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c6c92aee6) - Fix rendering of captions
- Updated dependencies

## 53.0.1

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc
- Updated dependencies

## 53.0.0

### Major Changes

- [`9f81260dd5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f81260dd5) - ED-10683 Serialize number fields to Number instead of String
- [`835810cac7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/835810cac7) - ED-10646 prevent nested Fieldset definitions

### Minor Changes

- [`318b6a8f52`](https://bitbucket.org/atlassian/atlassian-frontend/commits/318b6a8f52) - ED-10612 Use strategy as absolute to fix the inconsistency in tooltip position in ios for unsupported content.
- [`28e97db5a7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/28e97db5a7) - TWISTA-407 Expose the Confluence index match API to native. On applying draft mode, the bridge will call `annotationIndexMatch` with the `numMatch`, `matchIndex`, `originalSelection` tuple that is required by Confluence.

### Patch Changes

- [`0175a00afc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0175a00afc) - [ED-10670] Update prosemirror-model type to use posAtIndex methods
- [`09394e2986`](https://bitbucket.org/atlassian/atlassian-frontend/commits/09394e2986) - EDM-668: exporting types for better typings support in Editor Core
- [`d6c23f1886`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6c23f1886) - Added dark mode support to table cell background colors
- [`619b3234fa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/619b3234fa) - Improve the contrast of inline annotation styling in dark mode
- Updated dependencies

## 52.0.1

### Patch Changes

- Updated dependencies

## 52.0.0

### Major Changes

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

### Minor Changes

- [`74db598b97`](https://bitbucket.org/atlassian/atlassian-frontend/commits/74db598b97) - ED-10757 - Show Unsuppoted content message based on locale
- [`677744c680`](https://bitbucket.org/atlassian/atlassian-frontend/commits/677744c680) - Add UserSelect field for ConfigPanel, and expose types in SmartUserPicker
- [`1e59fd65c5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e59fd65c5) - ED-8720 Add OnUnhandledClickHandler for Renderer

### Patch Changes

- [`dfda163bf6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfda163bf6) - ED-10594: track severity for browserFreeze event and add getAnalyticsEventSeverity util
- [`eeedafee68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eeedafee68) - ED-10532: Add new UI element to pick a date range - for supporting the cql component
- [`b13e3991ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b13e3991ef) - ED-10723: severity for rendered event
- [`703752d487`](https://bitbucket.org/atlassian/atlassian-frontend/commits/703752d487) - ED-10647 Remove caret from prosemirror-model, prosemirror-keymap, prosemirror-state, prosemirror-transform to lock them down to an explicit version
- [`330da4d675`](https://bitbucket.org/atlassian/atlassian-frontend/commits/330da4d675) - Update translations via Traduki from issue/translation-2020-10-08T000543
- Updated dependencies

## 51.2.0

### Minor Changes

- [`848f187b49`](https://bitbucket.org/atlassian/atlassian-frontend/commits/848f187b49) - Extend CardProvider interface with findPattern
- [`0bbaa4a976`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0bbaa4a976) - ED-10553 added an option to enable analytics for synchrony entity

### Patch Changes

- [`4b2c7ce81c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b2c7ce81c) - ED-10580: Fix duplicate i18n ids
- [`7895bfa4f3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7895bfa4f3) - [ux] ED-10562 Update selection styles for unsupported content

  Use background colour instead of blanket styling
  Fix an issue on Safari where text inside unsupported content appeared selected when node was selected

- [`ef432e6288`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ef432e6288) - ED-10544: Remove type restrictions to keep api backwards compatible"
- [`d99590d680`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d99590d680) - [ux] ED-10376: added support for custom panels in renderer

  - convert Panel to functional component
  - added support for dark mode in renderer 99-testing.tsx

- [`15f7b4ae78`](https://bitbucket.org/atlassian/atlassian-frontend/commits/15f7b4ae78) - [ux] ED-10433 made custom icon and color applied on a panel based on node attributes (UI change). Changes are behind UNSAFE_allowCustomPanel feature flag.
- [`02ea8214a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/02ea8214a0) - EDM-1320 fixed linked image overlaps table sorting button
- [`56fe4bb199`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56fe4bb199) - TWISTA-367 Add new method for annotation bounding rect for mobile bridge renderer
- [`3d0b51445a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3d0b51445a) - ED-10544: Fix name collision between nested fields and top level fields
- Updated dependencies

## 51.1.3

### Patch Changes

- [`679a66bd92`](https://bitbucket.org/atlassian/atlassian-frontend/commits/679a66bd92) - Fix for renderer SSR inline script when server side bundle is minimized

## 51.1.2

### Patch Changes

- [`ac54a7870c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac54a7870c) - Remove extraneous dependencies rule suppression

## 51.1.1

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.
- Updated dependencies

## 51.1.0

### Minor Changes

- [`1c6b85ea41`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1c6b85ea41) - Export OverflowShadowState and ExpandStyleProps types to prevent deep import path references in dependent TS declaration files
- [`825273198f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/825273198f) - Migrate to declarative entry points

### Patch Changes

- Updated dependencies

## 51.0.0

### Major Changes

- [`8830f4d771`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8830f4d771) - ED-10170 Remove style constants from @atlaskit/editor-common - import these from @atlaskit/editor-shared-styles instead
- [`225c901919`](https://bitbucket.org/atlassian/atlassian-frontend/commits/225c901919) - ED-10351 add API to delete the annotation
- [`8de373491a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8de373491a) - Strengthen the Typescript rules for Enum fields per design guidelines

### Minor Changes

- [`79fb301be8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79fb301be8) - ED_9523 add tooltip for unsupported content
- [`c81f880916`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c81f880916) - Add style: multiline for string TextArea field type
- [`68f7feae92`](https://bitbucket.org/atlassian/atlassian-frontend/commits/68f7feae92) - (major) `isHidden` is only supported for String Field types
  (patch) Remove duplicate Option type from ExtensionManifest types (now uses FieldDefinition Option type)
  (patch) Extract FormContent render\* functions to function components
- [`64b147b2f5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/64b147b2f5) - ED-10408 updated image linking style for renderer
- [`9a39500244`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a39500244) - Bump ProseMirror packages

  Read more: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1671956531/2020-08

- [`558a213572`](https://bitbucket.org/atlassian/atlassian-frontend/commits/558a213572) - Add style: toggle as Field Definition option
- [`a5dad98e3f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5dad98e3f) - ED-10070 Locale based unsupported content/nodeType Lozenge
- [`47f0c4b221`](https://bitbucket.org/atlassian/atlassian-frontend/commits/47f0c4b221) - Add isCreatable property for CustomSelect field

### Patch Changes

- [`39d658f40c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/39d658f40c) - [ux] ED-9955 Style list items by absolute indentation level

  List items will now be styled according to the total indentation level of the list, instead of relative to their immediate parent list.

- [`2d4bbe5e2e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d4bbe5e2e) - [ED-10503] Fix prosemirror-view version at 1.15.4 without carret
- [`0ac3eff13b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ac3eff13b) - TWISTA-176 Added analytics for inline comments in renderer
- [`57c5a91b35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c5a91b35) - ED-10189: Show description at the top of config
- [`39b57c32e4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/39b57c32e4) - ED-10270 Prevent premature closure of color picker UI when clicking the More Colors button
- [`c024edd79d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c024edd79d) - ED-7832: Update Inline comments styling
- [`6e237a6753`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e237a6753) - Add optional caption to mediaSingle in adf schema for stage 0
- [`02ad57c335`](https://bitbucket.org/atlassian/atlassian-frontend/commits/02ad57c335) - Added theming and dark mode colors to the Expand node
- [`26ff0e5e9a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/26ff0e5e9a) - ED-10353 Added adf schema changes to support emoji panels
- Updated dependencies

## 50.0.1

### Patch Changes

- Updated dependencies

## 50.0.0

### Major Changes

- [`78de49291b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78de49291b) - [TWISTA-130] Changes on Annotation types

  # WHAT

  ## AnnotationState type changes

  Before:

  ```
  import { AnnotationTypes, AnnotationMarkStates } from '@atlaskit/adf-schema';

  type myAnnotationState = AnnotationState<AnnotationTypes.INLINE_COMMENT, AnnotationMarkStates>;
  ```

  Now:

  ```
  import { AnnotationTypes } from '@atlaskit/adf-schema';

  type myAnnotationState = AnnotationState<AnnotationTypes.INLINE_COMMENT>;
  ```

  # WHY

  We are normalizing this type to be used on Renderer, and later, on Editor.

  # HOW

  The Annotation feature is still an experiment on Renderer probably, you are not using it. So, no action requried.

- [`94ac6099e2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/94ac6099e2) - Rename FieldResolver to CustomFieldResolver
- [`3711c0a754`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3711c0a754) - remove ADNode support from ExtensionRenderer
- [`2914e9ec0a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2914e9ec0a) - Change EditorManifest generic to propagate instead of defaulting to any

### Minor Changes

- [`5a14bab0bf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a14bab0bf) - ED-10112 Add analytics for unwrapped unsupported contents
- [`caae78bb98`](https://bitbucket.org/atlassian/atlassian-frontend/commits/caae78bb98) - Adds support for unsupportedBlock and unsupportedInline content analytics for Hybrid Editor and Hybrid Renderer.
- [`a66b0a0d44`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a66b0a0d44) - ED-9497 Adds analytics to track unsupported Marks and Mark Attributes in editor and renderer.
- [`21131ce6be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/21131ce6be) - [TWISTA-283, TWISTA-282, TWISTA-241] Normalizes and fixes Annotation range validator logic for Renderer and Editor

  @atlaskit/editor-common: It creates canApplyAnnotationOnRange function
  @atlaskit/editor-core: It moves current hasInvalidNodes logic to editor-common function
  @atlaskit/renderer: It replaces current logic to use the same as Editor

- [`c4b1cbec82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c4b1cbec82) - ED-8344 Unsupported content type lozenge for block and inline in editor and renderer
- [`a28474f714`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a28474f714) - ED-10015 Analytics for unsupportedNodeAttribute and unsupportedNodeAttribute value
- [`44d287b640`](https://bitbucket.org/atlassian/atlassian-frontend/commits/44d287b640) - EDM-842: Adding support to the new search provider and activity provider
- [`d3a075b8ce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3a075b8ce) - ED-8345 Display text or text attribute value for unsupported content
- [`18f3f69ed9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18f3f69ed9) - ED-10110: Add support to featured quickinsert items
- [`e4114d7053`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4114d7053) - ED-9607 - Preserve Unsupported Node attributes

### Patch Changes

- [`351c595fbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/351c595fbb) - ED-9999: Fixes an issue where the collab provider would blindly remove all listeners instead of only its local ones.
- [`ee232d326d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ee232d326d) - ED-10210 Fixes user sensitive data that is being sent as part of analytics payload.
- [`5fb111ff42`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5fb111ff42) - ED-10021 ConfigPanel -> CustomSelect's fieldResolver now accepts an optional defaultValue parameter
- [`9dc913f0df`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9dc913f0df) - ED-9778: fix codeblock transparency in table header cells
- [`5c283c56e7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c283c56e7) - Fix pluginFactory ExtensionState types falling back to any
- Updated dependencies

## 49.0.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 49.0.1

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 49.0.0

### Major Changes

- [`6faafb144c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6faafb144c) - Introduce MediaFeatureFlags. Refactor components to use.

### Minor Changes

- [`fe31ba459f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe31ba459f) - ED-8198 Include Spec based validator behind toggle for Renderer
- [`b932cbbc42`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b932cbbc42) - Added support for rendering image captions
- [`0cddad271a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0cddad271a) - Move SearchProvider types to editor-common
- [`b3dad32cdd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3dad32cdd) - ED-9746: Add support to categories for quick insert items and extensions
- [`7abb7a2a51`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7abb7a2a51) - ED-9679: Add TTI measurements to editor-core

### Patch Changes

- [`6fbaccca68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6fbaccca68) - ED-7786 (ED-7785, ED-7786) fix table content overlow (e.g. dates) when columns widths are smaller than the content
- [`178a5c4a90`](https://bitbucket.org/atlassian/atlassian-frontend/commits/178a5c4a90) - ED-9862: Check if longtask type is available in performance observer
- [`861d585ba8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/861d585ba8) - Changed mediaSingle to now render it's child adf nodes using nodeviews rather than directly with react
- [`69ff62ba36`](https://bitbucket.org/atlassian/atlassian-frontend/commits/69ff62ba36) - ED-9788: Fix issue where bodied macros wouldn't update properly if cursor was inside
- Updated dependencies

## 48.0.0

### Major Changes

- [`faf010cbc3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/faf010cbc3) - ED-9212: Add support for extension auto convert

  ## Breaking changes:

  Renamed the following exports from '@atlaskit/editor-common/extensions':

  - from `ExtensionModuleType` to `ExtensionQuickInsertModule`;
  - from `getItemsFromModule` to `getQuickInsertItemsFromModule`,

  Renamed the following exports from '@atlaskit/editor-common':

  - from `ExtensionModuleType` to `ExtensionQuickInsertModule`;

### Minor Changes

- [`7649595644`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7649595644) - Add placeholder prop to Select, String, Number, Date and Custom fields in extension field definitions
- [`a70c826d0b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a70c826d0b) - [TWISTER-77] Creates Inline Comments on Renderer mode
- [`93829e7c90`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93829e7c90) - [TWISTER-162] Inline Comments on Renderer can have draft marks

  There is a new feature flag inside of the Annotation Providers. Hence, we can, for example, enable draft mode inside of the Inline Comments,
  like this:

  ```
  const annotationProviders = {
    allowDraftMode?: boolean;
    selectionComponent?: React.ComponentType<
      {
        [...]
        applyDraftMode: () => void;
        removeDraftMode: () => void;
      }
    >;
  };
  ```

  If the feature flag 'allowDraftMode' is true. You will be able to use the props `applyDraftMode` and `removeDraftMode` on your SelectionComponent. Nothing will happen if you Call those methods when the flag is `false` or undefined.

### Patch Changes

- [`36e4b8e6c8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/36e4b8e6c8) - Fix width for media when wrapped width is not available
- [`3a4c70dedd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a4c70dedd) - ED-9526: Fix date comparisons for dates in actions
- Updated dependencies

## 47.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 46.1.1

### Patch Changes

- [`050c9121ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/050c9121ab) - CEMS-1106: show sticky headers in editor when in expand

## 46.1.0

### Minor Changes

- [`64d75b8f7e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/64d75b8f7e) - Call getFieldsDefinition with extension parameters
- [`a4948958c4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4948958c4) - [FM-3820] Implements to set annotation state event on Renderer
- [`ea81ff42a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea81ff42a0) - [FM-3819] Implements a subscriber API to allows set focus in an specific annotation

### Patch Changes

- [`82053beb2d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/82053beb2d) - ED-8944 fix: propagete width updates after scrolling
- [`73552b28ae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73552b28ae) - ED-8835 Use selection plugin to style smartlinks
- [`234697357d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/234697357d) - ED-9541 Change editor-common imports to comply with Atlassian conventions
- [`62d2c116af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62d2c116af) - Fix width for media when wrapped width is not available
- Updated dependencies

## 46.0.0

### Major Changes

- [`0ae829a4ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ae829a4ea) - EDM-648: Adds resizing and alignment to embed cards

### Minor Changes

- [`fbb300c27a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fbb300c27a) - ED-9367 Create Entry point for collab types
- [`ada210d9ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ada210d9ad) - Expose common EmbedCard styles

### Patch Changes

- [`fe46facd37`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe46facd37) - ED-9124 Apply expand selection styles using the selection plugin, and update to use a blanket style rather than a background colour
- [`e37e0fb768`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e37e0fb768) - ED-9008: Allow images on select lists for Config Panel
- [`cdf049f462`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cdf049f462) - ED-9198: Pass keywords down from manifest to quick insert provider
- [`b498fe941e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b498fe941e) - ED-9123 ED-9129 Use selection plugin to generate selection styling for selected date & status nodes
- [`cd6af0a113`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd6af0a113) - CEMS-1040: rework sticky headers internally + match visual style to editor

  There is a breaking change to the `stickyHeaders.showStickyHeaders` prop. It has been renamed to `stickyHeaders.show`. You can also show sticky headers by passing a truthy value to `stickyHeaders`.

- [`22130d8fce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22130d8fce) - ED-9301 Fix danger styling not appearing on parent when child nodes are selected
- [`1315ce63a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1315ce63a0) - CEMS-720: add sticky table header support to editor
- [`71a4de3370`](https://bitbucket.org/atlassian/atlassian-frontend/commits/71a4de3370) - ED-9524 Prevent right side shadow from overlapping product UI elements
- [`ea6dd76837`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea6dd76837) - ED-9128 Make divider selection use selection plugin to add selected styles

  Also increase click leniency to 4px above/below divider

  Export new line height const from editor-common `akEditorLineHeight`

- Updated dependencies

## 45.3.0

### Minor Changes

- [`50c333ab3a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50c333ab3a) - EDM-216: Adds EmbedCards in the Editor under the flag - allowEmbeds in the UNSAFE_cards prop

### Patch Changes

- [`f82edca013`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f82edca013) - ED-9298: Fix media sizing when default conatiner width is 760
- [`7682a09312`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7682a09312) - [ED-9142, ED-9342] Add consistent styling for annotations with hover cursor
- [`f82edca013`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f82edca013) - ED-9298: Fix media size after changing default container width to 760px in renderer
- [`e30894b112`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e30894b112) - [FM-3716] First Inline Comments implementation for Renderer
- [`ef36de69ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ef36de69ad) - ED-8358 Change decision to use a grey background
- [`a1e343b428`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1e343b428) - CEMS-720: try to avoid using CSS transforms on nodes with breakout mark

  Sticky headers depend on `position: fixed`, which does not work when inside an Element that has a parent with the CSS `transform` property.

  We now calculate an appropriate `margin-left` value and use that instead, falling back to the `margin` + `transform` approach if the element has no width.

- [`1faf6937fd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1faf6937fd) - Add hardcoded case for Forge extension type in getExtensionKeyAndNodeKey
- [`ef36de69ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ef36de69ad) - ED-8358 Fix spacing of decisions in tables to not be touching
- [`8c5c924a13`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c5c924a13) - CEMS-720: use margin-left rather than CSS transforms on breakout tables
- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove unused dependencies
- [`93daf076e4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93daf076e4) - fix: bugs with Block Links - floating menu placement, spacing, editing of link title or source, lazy loading.
- [`69d56a78b9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/69d56a78b9) - Standardise unsupported content node components between editor-core and editor-common. They now live in editor-common as a single source of truth.
- Updated dependencies

## 45.2.1

### Patch Changes

- Updated dependencies

## 45.2.0

### Minor Changes

- [`dd84377963`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dd84377963) - ED-9038 ED-9040 Export class names to use for targetting mention and emoji nodes- [`e97f14eade`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e97f14eade) - ED-9155: Rename prop `extensionParams` to `node` in the extensions api v2- [`d16adc8554`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d16adc8554) - ED-8988 Export more selection style variables- [`c8e601e6fc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8e601e6fc) - ED-8814 Add selection to panel- [`8bc9f3e9af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8bc9f3e9af) - ED-8942: Changed default font size for full width editor and renderer

  - Previously default font size for full page editor was 14px. Now, when `allowDynamicTextSizing` is disabled it equals to 16px.
  - Font size in table was 14px, ignoring dynamic text sizing font size, after this change it follows the same rules as the rest of the editor, namely it will get updated font size.- [`403377ca1a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/403377ca1a) - ED-8997: Implements creating marks on basic text selections

### Patch Changes

- [`0b596fcb22`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b596fcb22) - ED-9248 Fix bug where deleting from floating toolbar menu did not work for selected panel nodes- [`9b1a0d0033`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b1a0d0033) - ED-8358 Revert making decisions background grey- [`331a030a54`](https://bitbucket.org/atlassian/atlassian-frontend/commits/331a030a54) - ED-9177: Block creation when selection contains nodes which cannot be annotated- [`56a7357c81`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56a7357c81) - ED-9197: upgrade prosemirror-transform to prevent cut and paste type errors

  It's important to make sure that there isn't any `prosemirror-transform` packages with version less than 1.2.5 in `yarn.lock`.- [`d895d21c49`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d895d21c49) - ED-9176: add annotations to task and decisions- [`12cd8f8c1b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12cd8f8c1b) - ED-9048: Allow consumers to open the config after inserting an extension- Updated dependencies

## 45.1.0

### Minor Changes

- [minor][22704db5a3](https://bitbucket.org/atlassian/atlassian-frontend/commits/22704db5a3):

  extend CardAppearance interface- [minor][cf41823165](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf41823165):

  ED-9049: Make post processing function async to allow for backend operations if need- [minor][aec7fbadcc](https://bitbucket.org/atlassian/atlassian-frontend/commits/aec7fbadcc):

  ED-8833 ED-8834 Make status and date selected styling consistent

### Patch Changes

- [patch][999fbf849e](https://bitbucket.org/atlassian/atlassian-frontend/commits/999fbf849e):

  Refactor editor emoji to use HOC composition instead of duplication.- Updated dependencies [9b295386e7](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b295386e7):

- Updated dependencies [4d8d550d69](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d8d550d69):
- Updated dependencies [92d04b5c28](https://bitbucket.org/atlassian/atlassian-frontend/commits/92d04b5c28):
- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [1156536403](https://bitbucket.org/atlassian/atlassian-frontend/commits/1156536403):
- Updated dependencies [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
  - @atlaskit/media-picker@54.1.1
  - @atlaskit/media-card@67.2.1
  - @atlaskit/adf-schema@9.0.1
  - @atlaskit/icon@20.1.1
  - @atlaskit/adf-utils@9.2.0
  - @atlaskit/webdriver-runner@0.3.4
  - @atlaskit/task-decision@16.0.11
  - @atlaskit/editor-json-transformer@7.0.11
  - @atlaskit/editor-test-helpers@11.1.1

## 45.0.0

### Major Changes

- [major][67bc25bc3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/67bc25bc3f):

  Move WidthObserver from editor-common to width-detector

  WidthObserver is a more performant version of WidthDetector and should be used going forward.

  ```js
  import { WidthObserver } from '@atlaskit/width-detector';

  <WidthObserver
    setWidth={(width) => console.log(`width has changed to ${width}`)}
  />;
  ```

### Minor Changes

- [minor][c74cc954d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/c74cc954d8):

  ED-8941: Add inline script to properly resize breakout nodes after ssr- [minor][05539b052e](https://bitbucket.org/atlassian/atlassian-frontend/commits/05539b052e):

  Introducing `id` for each quick insert item- [minor][205b05851a](https://bitbucket.org/atlassian/atlassian-frontend/commits/205b05851a):

  ED-8693: Integrate Config Panel to editor- [minor][0b22d3b9ea](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b22d3b9ea):

  CEMS-889: add support for sticky headers in renderer- [minor][6eb8c0799f](https://bitbucket.org/atlassian/atlassian-frontend/commits/6eb8c0799f):

  UX enhancements for Config Panel

### Patch Changes

- [patch][b4326a7eba](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4326a7eba):

  ED-8893 Fixed layout of media inside expand- [patch][e4076915c8](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4076915c8):

  CEMS-948: fix sticky cell borders in Chrome; only apply padding-box workaround in FF- [patch][b4ef7fe214](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4ef7fe214):

  ED-9103: fix regression where table borders disappear on Edge 18- Updated dependencies [04e54bf405](https://bitbucket.org/atlassian/atlassian-frontend/commits/04e54bf405):

- Updated dependencies [9f43b9f0ca](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f43b9f0ca):
- Updated dependencies [f5dcc0bc6a](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5dcc0bc6a):
- Updated dependencies [5d430f7d37](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d430f7d37):
- Updated dependencies [7e26fba915](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e26fba915):
- Updated dependencies [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies [5f8e3caf72](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f8e3caf72):
- Updated dependencies [11ff95c0f0](https://bitbucket.org/atlassian/atlassian-frontend/commits/11ff95c0f0):
- Updated dependencies [fb2b3c8a3b](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb2b3c8a3b):
- Updated dependencies [692692ba24](https://bitbucket.org/atlassian/atlassian-frontend/commits/692692ba24):
- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies [205b05851a](https://bitbucket.org/atlassian/atlassian-frontend/commits/205b05851a):
- Updated dependencies [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies [823d80f31c](https://bitbucket.org/atlassian/atlassian-frontend/commits/823d80f31c):
- Updated dependencies [e5c869ee31](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5c869ee31):
- Updated dependencies [69b678b38c](https://bitbucket.org/atlassian/atlassian-frontend/commits/69b678b38c):
- Updated dependencies [fd782b0705](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd782b0705):
- Updated dependencies [d80b8e8fdb](https://bitbucket.org/atlassian/atlassian-frontend/commits/d80b8e8fdb):
- Updated dependencies [3644fc1afe](https://bitbucket.org/atlassian/atlassian-frontend/commits/3644fc1afe):
- Updated dependencies [d38212e1be](https://bitbucket.org/atlassian/atlassian-frontend/commits/d38212e1be):
- Updated dependencies [62f1f218d9](https://bitbucket.org/atlassian/atlassian-frontend/commits/62f1f218d9):
- Updated dependencies [67bc25bc3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/67bc25bc3f):
- Updated dependencies [4aca202534](https://bitbucket.org/atlassian/atlassian-frontend/commits/4aca202534):
- Updated dependencies [6eb8c0799f](https://bitbucket.org/atlassian/atlassian-frontend/commits/6eb8c0799f):
- Updated dependencies [48fb5a1b6b](https://bitbucket.org/atlassian/atlassian-frontend/commits/48fb5a1b6b):
- Updated dependencies [c28ff17fbd](https://bitbucket.org/atlassian/atlassian-frontend/commits/c28ff17fbd):
  - @atlaskit/adf-schema@9.0.0
  - @atlaskit/adf-utils@9.1.0
  - @atlaskit/emoji@62.7.2
  - @atlaskit/editor-test-helpers@11.1.0
  - @atlaskit/theme@9.5.3
  - @atlaskit/media-client@6.1.0
  - @atlaskit/media-picker@54.1.0
  - @atlaskit/analytics-next@6.3.6
  - @atlaskit/width-detector@2.1.0
  - @atlaskit/media-card@67.2.0
  - @atlaskit/analytics-namespaced-context@4.2.0
  - @atlaskit/editor-json-transformer@7.0.10
  - @atlaskit/task-decision@16.0.10

## 44.1.0

### Minor Changes

- [minor][bc29fbc030](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc29fbc030):

  ED-8748 ED-8211: Update media linking UI experience in renderer, fixes other rendering issues and workarounds.- [minor][7d80e44c09](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d80e44c09):

  Memoised the styled-components theme object in BaseTheme to reduce re-renders- [minor][d63888b5e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63888b5e5):

  ED-9179: Add support to CQL-like fields

  NOTE: This feature requires the [AbortController|https://developer.mozilla.org/en-US/docs/Web/API/AbortController] which is not supported on IE11.
  Consumers of the editor supporting IE11 should ensure there is a polyfill in place.- [minor][cc54ca2490](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc54ca2490):

  [ED-8802] Reducer the number of dispatched transactions from WidthEmitter

### Patch Changes

- [patch][0a0a54cb47](https://bitbucket.org/atlassian/atlassian-frontend/commits/0a0a54cb47):

  EDM-281: Fix broken image wrapping in Editor- [patch][fad8a16962](https://bitbucket.org/atlassian/atlassian-frontend/commits/fad8a16962):

  ED-8799: feat: add InstrumentedPlugin API- Updated dependencies [81684c1847](https://bitbucket.org/atlassian/atlassian-frontend/commits/81684c1847):

- Updated dependencies [bc29fbc030](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc29fbc030):
- Updated dependencies [1386afaecc](https://bitbucket.org/atlassian/atlassian-frontend/commits/1386afaecc):
- Updated dependencies [eb962d2c36](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb962d2c36):
- Updated dependencies [584279e2ae](https://bitbucket.org/atlassian/atlassian-frontend/commits/584279e2ae):
- Updated dependencies [9d2da865dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d2da865dd):
- Updated dependencies [f83b67a761](https://bitbucket.org/atlassian/atlassian-frontend/commits/f83b67a761):
- Updated dependencies [70b68943d1](https://bitbucket.org/atlassian/atlassian-frontend/commits/70b68943d1):
- Updated dependencies [8126e7648c](https://bitbucket.org/atlassian/atlassian-frontend/commits/8126e7648c):
- Updated dependencies [6b4fe5d0e0](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b4fe5d0e0):
- Updated dependencies [9a93eff8e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a93eff8e6):
- Updated dependencies [53ebcdb974](https://bitbucket.org/atlassian/atlassian-frontend/commits/53ebcdb974):
- Updated dependencies [4bec09aa74](https://bitbucket.org/atlassian/atlassian-frontend/commits/4bec09aa74):
- Updated dependencies [d63888b5e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63888b5e5):
- Updated dependencies [13a0e50f38](https://bitbucket.org/atlassian/atlassian-frontend/commits/13a0e50f38):
- Updated dependencies [6dcad31e41](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dcad31e41):
- Updated dependencies [bdf25b1c4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdf25b1c4c):
- Updated dependencies [645918eda6](https://bitbucket.org/atlassian/atlassian-frontend/commits/645918eda6):
- Updated dependencies [fad8a16962](https://bitbucket.org/atlassian/atlassian-frontend/commits/fad8a16962):
- Updated dependencies [715572f9e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/715572f9e5):
  - @atlaskit/media-picker@54.0.0
  - @atlaskit/adf-schema@8.0.0
  - @atlaskit/media-client@6.0.0
  - @atlaskit/media-card@67.1.1
  - @atlaskit/emoji@62.7.1
  - @atlaskit/mention@18.18.0
  - @atlaskit/editor-test-helpers@11.0.0
  - @atlaskit/media-core@31.1.0
  - @atlaskit/adf-utils@9.0.0
  - @atlaskit/editor-json-transformer@7.0.9
  - @atlaskit/task-decision@16.0.9

## 44.0.2

### Patch Changes

- [patch][bc380c30ce](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc380c30ce):

  New collab provider- [patch][5bb23adac3](https://bitbucket.org/atlassian/atlassian-frontend/commits/5bb23adac3):

  Remove internal circular dependencies for editor-common- [patch][025842de1a](https://bitbucket.org/atlassian/atlassian-frontend/commits/025842de1a):

  ED-8751 Remove 'export \*' from editor common- [patch][395739b5ef](https://bitbucket.org/atlassian/atlassian-frontend/commits/395739b5ef):

  Set height of nested expand to be auto when is is nested inside another expand- Updated dependencies [b408e050ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/b408e050ab):

- Updated dependencies [7602615cd4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7602615cd4):
- Updated dependencies [dda84ee26d](https://bitbucket.org/atlassian/atlassian-frontend/commits/dda84ee26d):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [0732eedea7](https://bitbucket.org/atlassian/atlassian-frontend/commits/0732eedea7):
- Updated dependencies [c171660346](https://bitbucket.org/atlassian/atlassian-frontend/commits/c171660346):
- Updated dependencies [fe9d471b88](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe9d471b88):
- Updated dependencies [27fde59914](https://bitbucket.org/atlassian/atlassian-frontend/commits/27fde59914):
- Updated dependencies [4695ac5697](https://bitbucket.org/atlassian/atlassian-frontend/commits/4695ac5697):
- Updated dependencies [96ee7441fe](https://bitbucket.org/atlassian/atlassian-frontend/commits/96ee7441fe):
- Updated dependencies [08935ea653](https://bitbucket.org/atlassian/atlassian-frontend/commits/08935ea653):
- Updated dependencies [b18fc8a1b6](https://bitbucket.org/atlassian/atlassian-frontend/commits/b18fc8a1b6):
- Updated dependencies [64fb94fb1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/64fb94fb1e):
- Updated dependencies [be57ca3829](https://bitbucket.org/atlassian/atlassian-frontend/commits/be57ca3829):
- Updated dependencies [9957801602](https://bitbucket.org/atlassian/atlassian-frontend/commits/9957801602):
- Updated dependencies [d7ed7b1513](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7ed7b1513):
- Updated dependencies [7baff84f38](https://bitbucket.org/atlassian/atlassian-frontend/commits/7baff84f38):
- Updated dependencies [39ee28797d](https://bitbucket.org/atlassian/atlassian-frontend/commits/39ee28797d):
- Updated dependencies [bb06388705](https://bitbucket.org/atlassian/atlassian-frontend/commits/bb06388705):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [832fd6f4f7](https://bitbucket.org/atlassian/atlassian-frontend/commits/832fd6f4f7):
- Updated dependencies [695e1c1c31](https://bitbucket.org/atlassian/atlassian-frontend/commits/695e1c1c31):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [109c1a2c0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c1a2c0a):
- Updated dependencies [a5d0019a5e](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5d0019a5e):
- Updated dependencies [c57bb32f6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/c57bb32f6d):
- Updated dependencies [e981669ba5](https://bitbucket.org/atlassian/atlassian-frontend/commits/e981669ba5):
- Updated dependencies [5e3aab8e77](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e3aab8e77):
  - @atlaskit/media-client@5.0.2
  - @atlaskit/adf-schema@7.0.0
  - @atlaskit/adf-utils@8.0.0
  - @atlaskit/media-picker@53.0.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/mention@18.17.0
  - @atlaskit/util-data-test@13.1.2
  - @atlaskit/webdriver-runner@0.3.0
  - @atlaskit/media-card@67.1.0
  - @atlaskit/profilecard@12.4.0
  - @atlaskit/editor-test-helpers@10.6.1
  - @atlaskit/editor-json-transformer@7.0.8
  - @atlaskit/media-core@31.0.5
  - @atlaskit/task-decision@16.0.8

## 44.0.1

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/media-card@67.0.5
  - @atlaskit/media-picker@52.0.4

## 44.0.0

### Major Changes

- [major][ded54f7b9f](https://bitbucket.org/atlassian/atlassian-frontend/commits/ded54f7b9f):

  ED-8005 Improve provider factory types

  BREAKING CHANGE

  Provider factory is more restrictive:

  - We enforce correct type for all the known providers

### Minor Changes

- [minor][151240fce9](https://bitbucket.org/atlassian/atlassian-frontend/commits/151240fce9):

  ED-8492: Adding the extension configuration panel- [minor][02b2a2079c](https://bitbucket.org/atlassian/atlassian-frontend/commits/02b2a2079c):

  Fix image alignment in layouts in renderer + expose ClearNextSiblingMarginTop

### Patch Changes

- [patch][9e90cb4336](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e90cb4336):

  ED-8301 `altTextValidator` prop is introduced in Editor for consumers to be able to add custom validation on alt text values.

  If the alt text become an invalid one based on what `altTextValidator` return, it will be not saved in prosemirror, and once the alt text
  panel is closed, it will keep the latest valid value entered.

  This way if the user leaves an invalid value, it will not be part of the adf when the document is saved/published.

  Check this file for more technical details on how to use this callback: `packages/editor/editor-core/src/plugins/media/index.tsx`- [patch][8d09cd0408](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d09cd0408):

  CONFCLOUD-69327: Sorting texts formatted as headings- [patch][088f4f7d1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/088f4f7d1e):

  ED-8306: Fix sorting tables with empty cells- [patch][8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):

  Remove Karma tests - based on AFP-960- [patch][79cabaee0c](https://bitbucket.org/atlassian/atlassian-frontend/commits/79cabaee0c):

  ED-8270 Fixed an issue where user can click on `javascript:` links in renderer- [patch][e3a8052151](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3a8052151):

  ED-8415: Support ARCHV3 in VR and integration testing- Updated dependencies [e8a31c2714](https://bitbucket.org/atlassian/atlassian-frontend/commits/e8a31c2714):

- Updated dependencies [9d6b02c04f](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d6b02c04f):
- Updated dependencies [8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):
- Updated dependencies [eeaa647c31](https://bitbucket.org/atlassian/atlassian-frontend/commits/eeaa647c31):
- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
- Updated dependencies [a065689858](https://bitbucket.org/atlassian/atlassian-frontend/commits/a065689858):
  - @atlaskit/adf-schema@6.2.0
  - @atlaskit/editor-test-helpers@10.6.0
  - @atlaskit/adf-utils@7.4.3
  - @atlaskit/editor-json-transformer@7.0.7
  - @atlaskit/media-card@67.0.4
  - @atlaskit/icon@20.0.2
  - @atlaskit/emoji@62.7.0
  - @atlaskit/task-decision@16.0.7
  - @atlaskit/media-picker@52.0.3

## 43.4.1

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/icon@20.0.1
  - @atlaskit/theme@9.5.1
  - @atlaskit/width-detector@2.0.10
  - @atlaskit/adf-schema@6.1.1
  - @atlaskit/adf-utils@7.4.2
  - @atlaskit/editor-json-transformer@7.0.6
  - @atlaskit/editor-test-helpers@10.5.1
  - @atlaskit/analytics-namespaced-context@4.1.11
  - @atlaskit/emoji@62.6.3
  - @atlaskit/mention@18.16.2
  - @atlaskit/util-data-test@13.1.1
  - @atlaskit/media-card@67.0.3
  - @atlaskit/media-client@5.0.1
  - @atlaskit/media-core@31.0.4
  - @atlaskit/media-picker@52.0.2
  - @atlaskit/profilecard@12.3.7

## 43.4.0

### Minor Changes

- [minor][6ca6aaa1d7](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ca6aaa1d7):

  ED-8029 Expose extension type as a menu item property

### Patch Changes

- [patch][b01fc0ceef](https://bitbucket.org/atlassian/atlassian-frontend/commits/b01fc0ceef):

  ED-8151 Alt text is promoted to full schema. Feature flag and MediaOptions property UNSAFE_allowAltTextOnImages was renamed to allowAltTextOnImages.- [patch][b8da779506](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8da779506):

  ED-8607 fixed invalid spread usage for i18n messages in expand- Updated dependencies [3b19e30129](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b19e30129):

- Updated dependencies [fe4eaf06fc](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe4eaf06fc):
- Updated dependencies [b01fc0ceef](https://bitbucket.org/atlassian/atlassian-frontend/commits/b01fc0ceef):
- Updated dependencies [d085ab4419](https://bitbucket.org/atlassian/atlassian-frontend/commits/d085ab4419):
- Updated dependencies [16b4549bdd](https://bitbucket.org/atlassian/atlassian-frontend/commits/16b4549bdd):
- Updated dependencies [28edbccc0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/28edbccc0a):
- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/editor-test-helpers@10.5.0
  - @atlaskit/adf-schema@6.1.0
  - @atlaskit/adf-utils@7.4.1
  - @atlaskit/media-picker@52.0.1
  - @atlaskit/icon@20.0.0
  - @atlaskit/editor-json-transformer@7.0.5
  - @atlaskit/emoji@62.6.2
  - @atlaskit/media-card@67.0.2
  - @atlaskit/mention@18.16.1
  - @atlaskit/profilecard@12.3.6

## 43.3.2

### Patch Changes

- [patch][242a8ce22b](https://bitbucket.org/atlassian/atlassian-frontend/commits/242a8ce22b):

  ED-8270 Fixed an issue where user can click on `javascript:` links in renderer

## 43.3.1

### Patch Changes

- [patch][3160e15523](https://bitbucket.org/atlassian/atlassian-frontend/commits/3160e15523):

  fix margin top on paragraphs so it has a unit by default- [patch][cf9858fa09](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf9858fa09):

  [ED-8189] Allow resizing media inside of native expand using the breakout container size- Updated dependencies [5504a7da8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/5504a7da8c):

- Updated dependencies [9d8752351f](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d8752351f):
- Updated dependencies [4794f8d527](https://bitbucket.org/atlassian/atlassian-frontend/commits/4794f8d527):
- Updated dependencies [3e87f5596a](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e87f5596a):
- Updated dependencies [26dbe7be6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/26dbe7be6d):
- Updated dependencies [cfcd27b2e4](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfcd27b2e4):
- Updated dependencies [6ee177aeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ee177aeb4):
- Updated dependencies [ec929ab10e](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec929ab10e):
  - @atlaskit/media-card@67.0.1
  - @atlaskit/adf-utils@7.4.0
  - @atlaskit/media-picker@52.0.0
  - @atlaskit/adf-schema@6.0.0
  - @atlaskit/editor-test-helpers@10.4.3
  - @atlaskit/media-client@5.0.0
  - @atlaskit/media-core@31.0.3
  - @atlaskit/editor-json-transformer@7.0.4
  - @atlaskit/emoji@62.6.1

## 43.3.0

### Minor Changes

- [minor][edc4a4a7ae](https://bitbucket.org/atlassian/atlassian-frontend/commits/edc4a4a7ae):

  ED-8316 Add async support to the Extension v2 insert API

### Patch Changes

- Updated dependencies [761dcd6d19](https://bitbucket.org/atlassian/atlassian-frontend/commits/761dcd6d19):
- Updated dependencies [faccb537d0](https://bitbucket.org/atlassian/atlassian-frontend/commits/faccb537d0):
- Updated dependencies [90e2c5dd0c](https://bitbucket.org/atlassian/atlassian-frontend/commits/90e2c5dd0c):
- Updated dependencies [8c7f8fcf92](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c7f8fcf92):
- Updated dependencies [edc4a4a7ae](https://bitbucket.org/atlassian/atlassian-frontend/commits/edc4a4a7ae):
- Updated dependencies [d60a382185](https://bitbucket.org/atlassian/atlassian-frontend/commits/d60a382185):
- Updated dependencies [a47d750b5d](https://bitbucket.org/atlassian/atlassian-frontend/commits/a47d750b5d):
- Updated dependencies [8d2685f45c](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d2685f45c):
- Updated dependencies [eb50389200](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb50389200):
  - @atlaskit/adf-schema@5.0.0
  - @atlaskit/adf-utils@7.3.2
  - @atlaskit/media-picker@51.0.0
  - @atlaskit/media-client@4.3.0
  - @atlaskit/editor-test-helpers@10.4.1
  - @atlaskit/editor-json-transformer@7.0.3

## 43.2.1

### Patch Changes

- [patch][9a8127fc08](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a8127fc08):

  [ED-8439] Extract height css rule from WidthProvider and move to Editor wrapper

## 43.2.0

### Minor Changes

- [minor][d1055e0e50](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1055e0e50):

  [ED-8307] Add util function to get width size using ResizeObserver- [minor][2ffdeb5a48](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ffdeb5a48):

  [ED-6984] Fix timestamp convert dates to use UTC and implements proper internationalization- [minor][46e6693eb3](https://bitbucket.org/atlassian/atlassian-frontend/commits/46e6693eb3):

  ED-8149 Provides an "update" method on the node manifest to deal with the edit button.

### Patch Changes

- [patch][97d1245875](https://bitbucket.org/atlassian/atlassian-frontend/commits/97d1245875):

  ED-7929 Hide action placeholder on layout and table when overflow- [patch][4cd37dd052](https://bitbucket.org/atlassian/atlassian-frontend/commits/4cd37dd052):

  ED-8153 ED-8302: Styling fixes for expands including: increasing the hit area for expand titles in the renderer, better hover transitions and lowered spacing between expands.- Updated dependencies [28f8f0e089](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f8f0e089):

- Updated dependencies [4eefd368a8](https://bitbucket.org/atlassian/atlassian-frontend/commits/4eefd368a8):
- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies [486a5aec29](https://bitbucket.org/atlassian/atlassian-frontend/commits/486a5aec29):
- Updated dependencies [46e6693eb3](https://bitbucket.org/atlassian/atlassian-frontend/commits/46e6693eb3):
- Updated dependencies [03c917044e](https://bitbucket.org/atlassian/atlassian-frontend/commits/03c917044e):
- Updated dependencies [83300f0b6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/83300f0b6d):
- Updated dependencies [d3f4c97f6a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3f4c97f6a):
- Updated dependencies [e5dd37f7a4](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5dd37f7a4):
- Updated dependencies [81897eb2e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/81897eb2e6):
  - @atlaskit/icon@19.1.0
  - @atlaskit/adf-schema@4.4.0
  - @atlaskit/theme@9.5.0
  - @atlaskit/media-card@67.0.0
  - @atlaskit/editor-test-helpers@10.4.0
  - @atlaskit/util-data-test@13.1.0
  - @atlaskit/editor-json-transformer@7.0.2
  - @atlaskit/media-client@4.2.2
  - @atlaskit/media-core@31.0.2
  - @atlaskit/media-picker@50.0.5

## 43.1.0

### Minor Changes

- [minor][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  ED-8080 Export new entry point for ProviderFactory

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Relax text color mark validation to allow upper case characters

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  ED-8191 fix expand button position when disabled- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  ED-7992: Prevent creating new style tags on every resize of media single- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  ED-8187 Update cursor on expand to represent user actions- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/adf-schema@4.3.2
  - @atlaskit/adf-utils@7.3.1
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/media-picker@50.0.3
  - @atlaskit/media-client@4.2.0
  - @atlaskit/media-card@66.1.2

## 43.0.0

### Major Changes

- [major][271945fd08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/271945fd08):

  ED-8005 ProviderFactory now has types for mentionProvider and emojiProvider

  BREAKING CHANGE:

  Before:
  `ProviderFactory.mentionProvider` -> `any`
  `ProviderFactory.emojiProvider` -> `any`

  Now:
  `ProviderFactory.mentionProvider` -> `Promise<MentionProvider> | undefined`
  `ProviderFactory.emojiProvider` -> `Promise<EmojiProvider> | undefined`

### Minor Changes

- [minor][10425b84b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10425b84b4):

  Add support to extensions v2 (using manifests and extension providers)

- [minor][926798632e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926798632e):

  ED-7962: Build ADF node from actions - remove "insert" from node

### Patch Changes

- [patch][ea0e619cc7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea0e619cc7):

  ED-8017: Fix expand overflow issues with tables and text

- [patch][bb164fbd1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb164fbd1e):

  ED-8073 ED-8074: Align expand title to the left when it wraps and align the expand chevron to the top

- [patch][4700477bbe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4700477bbe):

  ED-8094: Fix cursor issues relating to mobile and toolbar insertion issues

- Updated dependencies [161a30be16](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/161a30be16):
- Updated dependencies [2d1aee3e47](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d1aee3e47):
- Updated dependencies [4427e6c8cf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4427e6c8cf):
- Updated dependencies [49fbe3d3bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49fbe3d3bf):
- Updated dependencies [c1d4898af5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1d4898af5):
- Updated dependencies [579779f5aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/579779f5aa):
- Updated dependencies [df2280531d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df2280531d):
- Updated dependencies [ef2ba36d5c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef2ba36d5c):
- Updated dependencies [6e4b678428](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e4b678428):
- Updated dependencies [3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):
- Updated dependencies [b3fd0964f2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3fd0964f2):
- Updated dependencies [7540cdff80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7540cdff80):
- Updated dependencies [10425b84b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10425b84b4):
- Updated dependencies [f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):
- Updated dependencies [9a261337b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a261337b5):
- Updated dependencies [cc1b89d310](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc1b89d310):
- Updated dependencies [938f1c2902](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/938f1c2902):
- Updated dependencies [926798632e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926798632e):
  - @atlaskit/adf-schema@4.3.1
  - @atlaskit/emoji@62.6.0
  - @atlaskit/media-picker@50.0.2
  - @atlaskit/mention@18.16.0
  - @atlaskit/icon@19.0.11
  - @atlaskit/media-client@4.1.1
  - @atlaskit/theme@9.3.0
  - @atlaskit/editor-test-helpers@10.3.0
  - @atlaskit/profilecard@12.3.5
  - @atlaskit/editor-json-transformer@7.0.1

## 42.0.0

### Major Changes

- [major][70e1055b8f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70e1055b8f):

  Remove remaining color utils in editor-common in favor of adf-schema

  ## Summary

  The color utility exports in `@atlaskit/editor-common` have been removed as they were duplicates of color utilities in `@atlaskit/adf-schema`.
  This also affects the secondary `@atlaskit/editor-common/color` entrypoint, which has been removed.
  Change your imports for the following functions to point to `@atlaskit/adf-schema`:

  - normalizeHexColor
  - hexToRgb
  - hexToRgba
  - rgbToHex
  - isRgb
  - isHex

  ## Example

  ```ts
  /* replace this */
  import { normalizeHexColor } from '@atlaskit/editor-common';

  /* with this */
  import { normalizeHexColor } from '@atlaskit/adf-schema';
  ```

### Minor Changes

- [minor][49703c574d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49703c574d):

  Make ProviderFactory interface to understand MediaProvider

- [minor][166dd996a8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/166dd996a8):

  ED-7949: Migrate expand react component to renderer from common to avoid extra deps being added to common

- [minor][3a4aa18da6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a4aa18da6):

  ED-7878 Add expand analytics v1

- [minor][f1a06fc2fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a06fc2fd):

  ED-7876 Implement expand and nestedExpand in Editor and Renderer

  A **work in progress** implementation of the new `expand` and `nestedExpand` nodes. These are currently **disabled** by default, but can be tested by enabling an editor prop.

  `UNSAFE_allowExpand={true}`

  Note, `expand` and `nestedExpand` are only in the `stage-0` ADF schema (as of this changeset).

- [minor][ae42b1ba1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae42b1ba1e):

  Adf schema changes (for stage-0) to support alt text on media nodes.
  `editor-core` changes are wrapped under the editor prop `UNSAFE_allowAltTextOnImages`. There is no alt text implementation yet, so the user won't be able to add alt text to images just yet.

- [minor][1377a45225](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1377a45225):

  ED-7492 add support to indent actions

  This version adds support for indenting actions using the keyboard shortcuts Tab and Shift-Tab. You can also unindent items by backspacing them at the start, or deleting forwards within the task.

  There is no new behaviour if the feature flag (`allowNestedTasks`) is turned off.

### Patch Changes

- [patch][c20e926a6c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c20e926a6c):

  ED-7971: fix deleting of nested task lists

  Upgrades prosemirror-view to 1.1.6.

  See (this discussion)[https://discuss.prosemirror.net/t/collapsing-empty-nodes-on-delete/2306/4] for more details and screenshots of the behaviour it fixes.

- [patch][e283b821f0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e283b821f0):

  ED-7980: Fixes styling of expands inside layouts (also caters for gap cursor navigation)

- Updated dependencies [6d9c8a9073](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d9c8a9073):
  - @atlaskit/adf-schema@4.3.0
  - @atlaskit/editor-json-transformer@7.0.0

## 41.2.1

### Patch Changes

- [patch][e47220a6b2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e47220a6b2):

  ED-5450: remove most of ts-ignores from editor packages

- Updated dependencies [24b8ea2667](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24b8ea2667):
  - @atlaskit/editor-test-helpers@10.1.3
  - @atlaskit/emoji@62.5.6
  - @atlaskit/media-client@4.0.0
  - @atlaskit/editor-json-transformer@6.3.5
  - @atlaskit/media-card@66.0.1

## 41.2.0

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

- Updated dependencies [c3e65f1b9e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3e65f1b9e):
- Updated dependencies [bd94b1d552](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd94b1d552):
- Updated dependencies [e7b5c917de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7b5c917de):
  - @atlaskit/media-client@3.0.0
  - @atlaskit/media-core@30.0.17
  - @atlaskit/media-card@66.0.0
  - @atlaskit/editor-json-transformer@6.3.4
  - @atlaskit/emoji@62.5.4
  - @atlaskit/mention@18.15.5
  - @atlaskit/profilecard@12.3.3
  - @atlaskit/util-data-test@13.0.0

## 41.1.2

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 41.1.1

### Patch Changes

- [patch][8af8f8ec2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8af8f8ec2a):

  ED-7768 Fixed regression where you cannot click inside a block macro

## 41.1.0

### Minor Changes

- [minor][79c69ed5cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79c69ed5cd):

  ED-7449 Implement sorting inline cards inside tables base on resolved title

## 41.0.0

### Major Changes

- [major][80adfefba2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80adfefba2):

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

  - `Popup` now supports an optional `rect` parameter to direct placement, rather than calculating the bounding client rect around a DOM node.- [minor][520db7fe02](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/520db7fe02):

  ED-6359 Enable image resize and alignment within tables

  This feature needs to be enabled with the new optional prop `media.allowResizingInTables`. By default, this is set to `false`, but will likely be promoted to default `true` in future, and then removed as an option. _Resizing_ and _alignment_ of media within tables are both tied to this prop.

### Patch Changes

- [patch][9cddedc62f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cddedc62f):

  ED-7244 exported class name for media single.- [patch][b60b6fa41e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b60b6fa41e):

  ED-7734 Fix layout rendering of adjacent lists on browsers which don't support `flow-root` (iOS)- [patch][7d57dc2ffa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d57dc2ffa):

  ED-6940 fixed an issue where text is copied partly when there is some elements inside

- [patch][43e6f89e70](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/43e6f89e70):

  ED-7706 Prevent media from overlapping itself within tables

  Additionally, brought media margins inline with wrap and aligned media modes.

- [patch][3f1c7dd26a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f1c7dd26a):

  [ED-7392] Add sort table by column on renderer behind allowColumnSorting feature flag
  [ED-7392] Extract common methods to sort table

- Updated dependencies [1194ad5eb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1194ad5eb3):
  - @atlaskit/editor-json-transformer@6.3.3
  - @atlaskit/editor-test-helpers@10.0.0
  - @atlaskit/adf-schema@4.0.0

## 40.0.1

- Updated dependencies [af72468517](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af72468517):
  - @atlaskit/media-client@2.1.2
  - @atlaskit/media-core@30.0.14
  - @atlaskit/media-card@65.0.0

## 40.0.0

### Major Changes

- [major][08ec269915](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/08ec269915):

  ED-7532 Expose ability to cancel default browser behaviour when clicking Smart Links within the Mobile Renderer.

## 39.21.0

### Minor Changes

- [minor][6b9ed8f471](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6b9ed8f471):

  Export and consume validator from editor-common

## 39.20.0

### Minor Changes

- [minor][73e0198ae4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/73e0198ae4):

  AK-6504: Fix MentionWithProfilecard for mentions in editor view mode

## 39.19.1

### Patch Changes

- [patch][9bd9cc7d25](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9bd9cc7d25):

  Avoid importing all of editor-common in jira-transformer

## 39.19.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 39.18.3

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 39.18.2

### Patch Changes

- [patch][22291c2373](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/22291c2373):

  ED-7531: Fixes copy and paste issue for mediaSingle from renderer to editor

## 39.18.1

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 39.18.0

### Minor Changes

- [minor][ff9f82137b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff9f82137b):

  ED-7149: Report the jankiness in the Editor

## 39.17.4

- Updated dependencies [3624730f44](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3624730f44):
  - @atlaskit/media-client@2.0.2
  - @atlaskit/media-core@30.0.11
  - @atlaskit/media-card@64.0.0

## 39.17.3

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

## 39.17.2

- Updated dependencies [ee804f3eeb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee804f3eeb):
  - @atlaskit/media-card@63.3.9
  - @atlaskit/media-core@30.0.9
  - @atlaskit/media-client@2.0.0

## 39.17.1

### Patch Changes

- [patch][87719d77c7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87719d77c7):

  ED-7308: added performance measurements of ProseMirror document updates

## 39.17.0

### Minor Changes

- [minor][6164bc2629](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6164bc2629):

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

### Patch Changes

- [patch][d4223be707](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d4223be707):

  ED-6805 Fix table column widths calculation (renderer/confluence-transformer)

## 39.16.7

### Patch Changes

- [patch][0bb88234e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0bb88234e6):

  Upgrade prosemirror-view to 1.9.12

## 39.16.6

### Patch Changes

- [patch][ec8066a555](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec8066a555):

  Upgrade `@types/prosemirror-view` Typescript definitions to latest 1.9.x API

## 39.16.5

### Patch Changes

- [patch][ba223c9878](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ba223c9878):

  ED-7267: Validate URLs passing through smart links- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 39.16.4

### Patch Changes

- [patch][404c2886f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/404c2886f8):

  fix MediaSingle styles for renderer

## 39.16.3

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 39.16.2

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 39.16.1

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

## 39.16.0

### Minor Changes

- [minor][4a22a774a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a22a774a6):

  AUX-36 Add update support for extension handler

## 39.15.0

### Minor Changes

- [minor][d217a12e31](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d217a12e31):

  ED-7056: Update prosemirror-utils, this enables us to replace selected nodes while inserting
  ED-6668: Adds a selected ring to all extensions

## 39.14.0

### Minor Changes

- [minor][2714c80a0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2714c80a0b):

  ED-7191 Fix regression where cell popup is not place on the correct horizontal place

## 39.13.2

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/editor-test-helpers@9.5.2
  - @atlaskit/emoji@62.2.1
  - @atlaskit/mention@18.6.2
  - @atlaskit/media-card@63.3.1
  - @atlaskit/profilecard@12.0.1
  - @atlaskit/icon@19.0.0

## 39.13.1

### Patch Changes

- [patch][752fad0061](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/752fad0061):

  Fix perfromance measure utils

## 39.13.0

### Minor Changes

- [minor][241a14694e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/241a14694e):

  Add RUM to renderer

## 39.12.0

### Minor Changes

- [minor][d6c31deacf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d6c31deacf):

  ED-6701 Upgrade prosemirror-view to 1.9.10 and prosemirror-inputrules to 1.0.4 for composition input improvements

## 39.11.0

### Minor Changes

- [minor][bb64fcedcb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb64fcedcb):

  uploadContext and viewContext fields of MediaProvider (part of Editor and Renderer props) are deprecated. New fields uploadMediaClientConfig and viewMediaClientConfig should be used from now on.

## 39.10.0

### Minor Changes

- [minor][0202c1d464](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0202c1d464):

  [ED-7076] Improve table performance reducing the number of React elements on ColumnControl, moving out InsertButton component.

## 39.9.0

### Minor Changes

- [minor][86bf524679](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/86bf524679):

  ED-7117, ED-7087: Fix copy pasting smart links out of editor. Fallback to HTML anchor tag if errors occur during rendering (e.g. no provider found).

## 39.8.7

- Updated dependencies [2b333a4c6d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b333a4c6d):
  - @atlaskit/profilecard@12.0.0

## 39.8.6

### Patch Changes

- [patch][0438f37f2c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0438f37f2c):

  ED-7105 Fix issue where images in full-width mode page could be a different size between the editor and renderer

## 39.8.5

### Patch Changes

- [patch][29f34ab448](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29f34ab448):

  Fix infinite loop of resizes with certain page hights and widths in renderer and editor

## 39.8.4

### Patch Changes

- [patch][7e9c4f03c9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e9c4f03c9):

  ED-7015 Fix issue where double digits were cut off in long ordered lists

## 39.8.3

### Patch Changes

- [patch][fee6d77243](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fee6d77243):

  ED-7090 Fix issue where popups could appear off screen

  Editor popups are now positioned so that they are always contained within the parent element - this prevents them being cut off when they are too far left or right

## 39.8.2

- Updated dependencies [a40f54404e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a40f54404e):
  - @atlaskit/profilecard@11.0.0

## 39.8.1

### Patch Changes

- [patch][ec0197518f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec0197518f):

  Fix incorrect date import path

## 39.8.0

### Minor Changes

- [minor][11a8112851](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11a8112851):

  ED-6991 Fire analytics event for renderer started

  Set up analytics v3 in renderer

## 39.7.2

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/editor-test-helpers@9.3.9
  - @atlaskit/emoji@62.1.6
  - @atlaskit/mention@18.3.1
  - @atlaskit/media-card@63.1.5
  - @atlaskit/profilecard@10.2.6
  - @atlaskit/icon@18.0.0

## 39.7.1

### Patch Changes

- [patch][9886f4afa1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9886f4afa1):

  - [ED-7017] Improve table performance removing cellView from table

## 39.7.0

- [minor][21f5217343](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21f5217343):

  - consume emoji new entrypoints in AK

## 39.6.1

- [patch][56356b17a3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/56356b17a3):

  - ED-6880: added even column widths on resize handle double-click and bulk resizing of columns

## 39.6.0

- [minor][4969df0716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4969df0716):

  - fix lazy rendering bugs in Smart Links.

## 39.5.0

- [minor][7089d49f61](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7089d49f61):

  - consume the new mention entrypoints

## 39.4.0

- [minor][d9f8b4d43d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d9f8b4d43d):

  - [ED-5505] Apply strong mark by default on table headers

## 39.3.0

- [minor][79f0ef0601](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79f0ef0601):

  - Use strict tsconfig to compile editor packages

## 39.2.3

- [patch][dfc7aaa563](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dfc7aaa563):

  - ED-6863: Fix the rendering of extensions in the renderer when they have breakout layouts.

## 39.2.2

- [patch][5ad66b6d1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ad66b6d1a):

  - [ED-6860] Revert prosemirror-view 1.8.9 bumps, this version was making the cursor typing slowly. this version is recreating all plugins when we use `EditorView.setProps`

## 39.2.1

- [patch][1ec6367e00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ec6367e00):

  - ED-6551 - Lists should correctly wrap adjacent floated content without overlapping

## 39.2.0

- [minor][a8e3fc91ae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a8e3fc91ae):

  - Remove react from panel node view

## 39.1.0

- [minor][5a49043dac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5a49043dac):

  - Enable strictPropertyInitialization in tsconfig.base

## 39.0.1

- [patch][80cf1c1e82](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80cf1c1e82):

  - [ED-6654] Update prosemirror-view to 1.8.9 that fixes a few issues with mouse selections on prosemirror like click on table and the controls doesn't show up

## 39.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

- Updated dependencies [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - @atlaskit/adf-schema@2.5.5
  - @atlaskit/emoji@62.0.0
  - @atlaskit/media-card@63.0.0
  - @atlaskit/visual-regression@0.1.0
  - @atlaskit/icon@17.0.0
  - @atlaskit/theme@9.0.0
  - @atlaskit/width-detector@2.0.0
  - @atlaskit/editor-json-transformer@6.0.0
  - @atlaskit/editor-test-helpers@9.0.0
  - @atlaskit/mention@18.0.0
  - @atlaskit/media-core@30.0.0
  - @atlaskit/profilecard@10.0.0

## 38.0.0

- Updated dependencies [a1192ef860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1192ef860):
  - @atlaskit/emoji@61.0.0
  - @atlaskit/media-card@62.0.0
  - @atlaskit/editor-json-transformer@5.0.4
  - @atlaskit/editor-test-helpers@8.0.8
  - @atlaskit/media-core@29.3.0

## 37.0.0

- Updated dependencies [e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):
  - @atlaskit/emoji@60.0.0
  - @atlaskit/media-card@61.0.0
  - @atlaskit/editor-json-transformer@5.0.3
  - @atlaskit/editor-test-helpers@8.0.7
  - @atlaskit/media-core@29.2.0

## 36.2.3

- [patch][a6fb248987](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6fb248987):

  - ED-6639 Align lists styles between editor & renderer

## 36.2.2

- [patch][0d23e11834](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d23e11834):

  - ED-6736 Prevent extensions with specified width from overflowing between layout cols.

## 36.2.1

- Updated dependencies [87f0209201](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87f0209201):
  - @atlaskit/width-detector@1.0.0

## 36.2.0

- [minor][799b7daf70](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/799b7daf70):

  - ED-6600: Adding full-width mode to media

## 36.1.12

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/icon@16.0.9
  - @atlaskit/emoji@59.2.3
  - @atlaskit/mention@17.6.7
  - @atlaskit/media-card@60.0.3
  - @atlaskit/profilecard@9.0.2
  - @atlaskit/theme@8.1.7

## 36.1.11

- [patch][0b5e0311af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0b5e0311af):

  - Ed-5849 Add check to popup to ensure it's target position is mounted

## 36.1.10

- [patch][c01f9e1cc7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c01f9e1cc7):

  - Standardise code-block class between editor/renderer. Fix bg color when code-block is nested within a table heading.

## 36.1.9

- [patch][63c00f3503](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/63c00f3503):

  - fix usage of entry point of @atlaskit/mention

## 36.1.8

- [patch][fc2b10e0cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc2b10e0cc):

  - HOT-86829 do not call setWidth with 0 nor undefined

## 36.1.7

- Updated dependencies [0ff405bd0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ff405bd0f):
  - @atlaskit/media-core@29.1.2
  - @atlaskit/media-card@60.0.0

## 36.1.6

- [patch][97e555c168](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97e555c168):

  - Revert "[ED-5259 - ED-6200] adds defaultMarks on tableNode (pull request #5259)"

## 36.1.5

- [patch][823d44ebb0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/823d44ebb0):

  - ED-6667 Enfoce consistent whitespace between renderer & editor

## 36.1.4

- [patch][b425ea772b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b425ea772b):

  - Revert "ED-5505 add strong as default mark to table header (pull request #5291)"

## 36.1.3

- [patch][6290d651d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6290d651d8):

  - Update editor-common to use Mention alternative entry point. This should reduce editor-common bundle size

## 36.1.2

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 36.1.1

- Updated dependencies [bfca144ea5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bfca144ea5):
  - @atlaskit/profilecard@9.0.0

## 36.1.0

- [minor][02dd1f7287](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/02dd1f7287):

  - [ED-5505] Persists formatting to table cells and headers when toggling header row, column or applying any text formatting to empty cells.

## 36.0.1

- [patch][acfd88ba22](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acfd88ba22):

  - ED-6639 Align lists styles between editor & renderer

## 36.0.0

- Updated dependencies [c2c36de22b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c36de22b):
  - @atlaskit/emoji@59.0.0
  - @atlaskit/media-card@59.0.0
  - @atlaskit/editor-json-transformer@5.0.2
  - @atlaskit/editor-test-helpers@8.0.3
  - @atlaskit/media-core@29.1.0

## 35.2.0

- [minor][63133d8704](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/63133d8704):

  - [ED-6200] Add defaultMarks attribute on tableCell schema

## 35.1.3

- Updated dependencies [9c316bd8aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c316bd8aa):
  - @atlaskit/media-core@29.0.2
  - @atlaskit/media-card@58.0.0

## 35.1.2

- [patch][298bfed4e1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/298bfed4e1):

  - ED-6580 Media in editor is sized incorrectly in firefox

## 35.1.1

- [patch][b32008359a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b32008359a):

  - ED-5823 Add red styling for document elements when they are selected for removal

## 35.1.0

- [minor][ea6b08700c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea6b08700c):

  - ED-6245: Ensure extensions scroll + overflow when they may break out of their parent container.

## 35.0.3

- [patch][c604b1eb64](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c604b1eb64):

  - Fix ED-6522 & ED-6046. Remove z-index from images to ensure they doesn't overlap adjacent content. Ensure floated images remain clickable when adjacent a list.

## 35.0.2

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 35.0.1

- [patch][205b101e2b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/205b101e2b):

  - ED-6230: bump prosemirror-view to 1.8.3; workaround Chrome bug with copy paste multiple images

## 35.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/profilecard@8.0.2
  - @atlaskit/icon@16.0.5
  - @atlaskit/theme@8.0.1
  - @atlaskit/emoji@58.0.0
  - @atlaskit/media-card@57.0.0
  - @atlaskit/adf-schema@2.0.0
  - @atlaskit/editor-json-transformer@5.0.0
  - @atlaskit/editor-test-helpers@8.0.0
  - @atlaskit/mention@17.0.0
  - @atlaskit/media-core@29.0.0

## 34.2.0

- [minor][f6345bba88](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f6345bba88):

  - Ed-4131 Fix text decorations to respect the selected text colour

## 34.1.0

- [minor][5b226754b8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b226754b8):

  - ED-5939: Replace SizeDetector with WidthDetector in all editor components

## 34.0.0

- Updated dependencies [7ab3e93996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ab3e93996):
  - @atlaskit/editor-test-helpers@7.0.6
  - @atlaskit/emoji@57.0.0
  - @atlaskit/media-card@56.0.0
  - @atlaskit/editor-json-transformer@4.3.5
  - @atlaskit/media-core@28.0.0

## 33.1.0

- [minor][6739aea208](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6739aea208):

  - Update editor-common and editor-core types

## 33.0.4

- Updated dependencies [dbff4fdcf9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dbff4fdcf9):
  - @atlaskit/profilecard@8.0.0

## 33.0.3

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/icon@16.0.4
  - @atlaskit/editor-json-transformer@4.3.3
  - @atlaskit/emoji@56.2.1
  - @atlaskit/mention@16.2.2
  - @atlaskit/media-card@55.0.2
  - @atlaskit/media-core@27.2.3
  - @atlaskit/size-detector@7.0.0
  - @atlaskit/theme@8.0.0
  - @atlaskit/profilecard@7.0.0

## 33.0.2

- [patch][2b4b290610](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b4b290610):

  - ED-6461: Fix placement start when scrolling for Popup

## 33.0.1

- [patch][1c00bd6268](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c00bd6268):

  - ED-6409: set minWidth to 140px for all new columns in resized table

## 33.0.0

- Updated dependencies [4aee5f3cec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aee5f3cec):
  - @atlaskit/emoji@56.0.0
  - @atlaskit/media-card@55.0.0
  - @atlaskit/editor-json-transformer@4.3.1
  - @atlaskit/editor-test-helpers@7.0.2
  - @atlaskit/media-core@27.2.0

## 32.4.3

- Updated dependencies [0de1251ad1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0de1251ad1):
  - @atlaskit/size-detector@6.0.0

## 32.4.2

- [patch][4eb1af2892](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4eb1af2892):

  - ED-6265 fix external image call to media for dimensions

## 32.4.1

- [patch][42b78a6133](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42b78a6133):

  - ED-6278: a complete rewrite of mergeCells, deleteColumns and deleteRows

## 32.4.0

- [minor][30b4e99377](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30b4e99377):

  - ED-5888 Add editor dark mode

## 32.3.1

- [patch][f5e8437365](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f5e8437365):

  - ED-6373: Fix position of breakout controls while scrolling

## 32.3.0

- [minor][b1ff16a33f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ff16a33f):

  - Improved typings for editor-common

## 32.2.0

- [minor][3672ec23ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3672ec23ef):

  - [ED-5788] Add new layout Breakout button for CodeBlock and Layout

## 32.1.0

- [minor][5dc1e046b2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5dc1e046b2):

  - Apply stricture typings to elements related editor code

## 32.0.2

- Updated dependencies [4af5bd2a58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4af5bd2a58):
  - @atlaskit/editor-json-transformer@4.1.11
  - @atlaskit/adf-schema@1.5.4
  - @atlaskit/emoji@55.0.1
  - @atlaskit/mention@16.2.1
  - @atlaskit/editor-test-helpers@7.0.0

## 32.0.1

- [patch][ca17040178](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca17040178):

  - ED-6243: Dont use breakpoint width calculations for tables in renderer

## 32.0.0

- [patch][5b5ae91921](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b5ae91921):

  - Require Identifier type from media-core instead of media-card

- Updated dependencies [fc6164c8c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc6164c8c2):
- Updated dependencies [190c4b7bd3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/190c4b7bd3):
  - @atlaskit/emoji@55.0.0
  - @atlaskit/media-card@54.0.0
  - @atlaskit/editor-json-transformer@4.1.10
  - @atlaskit/editor-test-helpers@6.3.22
  - @atlaskit/media-core@27.1.0

## 31.1.1

- Updated dependencies [46dfcfbeca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/46dfcfbeca):
  - @atlaskit/media-core@27.0.2
  - @atlaskit/media-card@53.0.0

## 31.1.0

- [minor][be86cbebc3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/be86cbebc3):

  - enable noImplicitAny for task-decision, and related changes

## 31.0.5

- [patch][aa164f77b8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aa164f77b8):

  - ED-6046: fix selecting wrapped image with list next to it

## 31.0.4

- [patch][44a42d5eb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/44a42d5eb3):

  - ED-5846: Refactoring new hyperlink toolbar and adding typeahead to the new floating toolbar

## 31.0.3

- [patch][50fb94a34f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50fb94a34f):

  - ED-6174: Breakout marks should be 100% of parent container

## 31.0.2

- [patch][c82c636533](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c82c636533):

  - ED-6156: limit breakout width to 1800px

## 31.0.1

- [patch][557a2b5734](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/557a2b5734):

  - ED-5788: bump prosemirror-view and prosemirror-model

## 31.0.0

- Updated dependencies [69c8d0c19c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c8d0c19c):
  - @atlaskit/editor-test-helpers@6.3.17
  - @atlaskit/emoji@54.0.0
  - @atlaskit/media-card@52.0.0
  - @atlaskit/editor-json-transformer@4.1.8
  - @atlaskit/media-core@27.0.0

## 30.0.2

- [patch][bfe22480d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bfe22480d0):

  - ED-6056: fix zero width columns in renderer for migration tables

## 30.0.1

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/editor-test-helpers@6.3.13
  - @atlaskit/emoji@53.0.1
  - @atlaskit/mention@16.0.1
  - @atlaskit/media-card@51.0.1
  - @atlaskit/profilecard@6.1.5
  - @atlaskit/icon@16.0.0

## 30.0.0

- Updated dependencies [85d5d168fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85d5d168fd):
  - @atlaskit/emoji@53.0.0
  - @atlaskit/media-card@51.0.0
  - @atlaskit/editor-json-transformer@4.1.7
  - @atlaskit/editor-test-helpers@6.3.12
  - @atlaskit/media-core@26.2.0

## 29.0.0

- Updated dependencies [dadef80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dadef80):
  - @atlaskit/emoji@52.0.0
  - @atlaskit/media-card@50.0.0
  - @atlaskit/editor-json-transformer@4.1.6
  - @atlaskit/editor-test-helpers@6.3.11
  - @atlaskit/media-core@26.1.0

## 28.1.0

- [minor][be6313e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/be6313e):

  - ED-5477 Support rendering of inline code together with other marks

## 28.0.4

- [patch][060f2da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/060f2da):

  - ED-5991: bumped prosemirror-view to 1.6.8

## 28.0.3

- [patch][61ce3c5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/61ce3c5):

  - ED-6015 Fix bug where cursor would jump to start of mention after hitting backspace after a mention

## 28.0.2

- Updated dependencies [0c116d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c116d6):
  - @atlaskit/editor-json-transformer@4.1.5
  - @atlaskit/editor-test-helpers@6.3.8
  - @atlaskit/mention@16.0.0

## 28.0.1

- [patch][0145eef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0145eef):

  - ED-5733 Update size styles for headers and paragraph to match typography document

## 28.0.0

- Updated dependencies [cbb8cb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbb8cb5):
  - @atlaskit/editor-test-helpers@6.3.7
  - @atlaskit/emoji@51.0.0
  - @atlaskit/media-card@49.0.0
  - @atlaskit/editor-json-transformer@4.1.4
  - @atlaskit/media-core@26.0.0

## 27.0.0

- Updated dependencies [72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):
  - @atlaskit/editor-test-helpers@6.3.6
  - @atlaskit/emoji@50.0.0
  - @atlaskit/media-card@48.0.0
  - @atlaskit/editor-json-transformer@4.1.3
  - @atlaskit/media-core@25.0.0

## 26.0.2

- [patch][8db5ddc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8db5ddc):

  - ED-6002 Fixes overflowed layout column rendering in renderer

## 26.0.1

- [patch][ababb4a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ababb4a):

  - ED-5999: fix padding between Columns in renderer

## 26.0.0

- [major][e858305](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e858305):

  - ED-5805: Popup to support being sticky with alignX=top

## 25.0.5

- [patch][5d4527e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5d4527e):

  - Fix issue where date was not respecting user's local date for initial date selection in quick insert

## 25.0.4

- [patch][80cadc7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80cadc7):

  - ED-5861 - Fix panel style in order to render telepointers properly

## 25.0.3

- Updated dependencies [135ed00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/135ed00):
  - @atlaskit/media-core@24.7.2
  - @atlaskit/media-card@47.0.0

## 25.0.2

- [patch][ce65803](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce65803):

  - Fix issue where panel icons were small in tables

## 25.0.1

- [patch][3585da7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3585da7):

  - Refactor Popup calculate position

## 25.0.0

- Updated dependencies [b3738ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3738ea):
  - @atlaskit/emoji@49.0.0
  - @atlaskit/media-card@46.0.0
  - @atlaskit/editor-json-transformer@4.1.1
  - @atlaskit/editor-test-helpers@6.3.4
  - @atlaskit/media-core@24.7.0

## 24.1.0

- [minor][b9f8a8f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9f8a8f):

  - Adding alignment options to media

## 24.0.0

- [major][1205725](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1205725):

  - Move schema to its own package

## 23.0.0

- Updated dependencies [80f765b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80f765b):
  - @atlaskit/emoji@48.0.0
  - @atlaskit/media-card@45.0.0
  - @atlaskit/editor-json-transformer@4.0.25
  - @atlaskit/editor-test-helpers@6.3.2
  - @atlaskit/media-core@24.6.0

## 22.4.2

- [patch][34df084](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/34df084):

  - Fix layout schema and enable breakout layouts in renderer

## 22.4.1

- [patch][a2ea6a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2ea6a7):

  - Use indexOf instead of bespoke/custom findIndex

## 22.4.0

- [minor][e06b553](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e06b553):

  - ED-5702: default new table resizing

## 22.3.2

- [patch][60a4609](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60a4609):

  - ED-5771: fix rendering of full-width resized images

## 22.3.1

- [patch][0a297ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a297ba):

  - Packages should not be shown in the navigation, search and overview

## 22.3.0

- [minor][a1b03d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1b03d0):

  - ED-3890 Adds Indentation support on paragraphs and headings

## 22.2.3

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/icon@15.0.1
  - @atlaskit/emoji@47.0.6
  - @atlaskit/mention@15.1.7
  - @atlaskit/profilecard@6.1.1
  - @atlaskit/theme@7.0.0

## 22.2.2

- [patch][755fd19](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/755fd19):

  - Fixing null state for task item copy

## 22.2.1

- [patch][126b7b0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/126b7b0):

  - fix: Inline marks do not match between editor and renderer

## 22.2.0

- [minor][94094fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/94094fe):

  - Adds support for links around images

## 22.1.1

- [patch][3061b52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3061b52):

  - AK-5723 - adjust files in package.json to ensure correct publishing of dist/package.json

## 22.1.0

- [minor][7c9dcba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c9dcba):

  - Responsive wide breakout mode

## 22.0.3

- [patch][52606a5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/52606a5):

  - ED-5560 Code block language in schema is now a string (ADF Change 33)

## 22.0.2

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/editor-test-helpers@6.2.21
  - @atlaskit/emoji@47.0.2
  - @atlaskit/mention@15.1.3
  - @atlaskit/media-card@44.0.2
  - @atlaskit/profilecard@6.0.3
  - @atlaskit/icon@15.0.0

## 22.0.1

- [patch][2db96d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2db96d3):

  - Adjust min-width nodes to support table resizing

## 22.0.0

- Updated dependencies [7e8b4b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e8b4b9):
  - @atlaskit/emoji@47.0.0
  - @atlaskit/media-card@44.0.0
  - @atlaskit/editor-json-transformer@4.0.22
  - @atlaskit/editor-test-helpers@6.2.19
  - @atlaskit/media-core@24.5.0

## 21.5.0

- [minor][cfba914](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfba914):

  - ED-5771: fix wide and full-width images in renderer

## 21.4.1

- [patch][416fbb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/416fbb3):

  - ED-3298: codeBlocks inside lists

## 21.4.0

- [minor][6d6522b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d6522b):

  - Refactor mentions to use TypeAhead plugin

## 21.3.2

- [patch][409e610](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/409e610):

  - Fix schema block marks name inconsistency

## 21.3.1

- [patch][37d6258](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/37d6258):

  - ED-5796: fix setting background color to white

## 21.3.0

- [minor][1e5cd32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e5cd32):

  - Make layouts stack on small screens

## 21.2.4

- [patch][df33a8b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df33a8b):

  - Fix block marks validation

## 21.2.3

- [patch][d3bb11f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d3bb11f):

  - Fixing validator for alignment marks

## 21.2.2

- Updated dependencies [9c0844d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0844d):
  - @atlaskit/profilecard@6.0.0

## 21.2.1

- [patch][c31aaf0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c31aaf0):

  - Fixing the first paragraph for alignment

## 21.2.0

- [minor][14477fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/14477fa):

  - Adding text alignment to editor and renderer

## 21.1.7

- [patch][380928b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/380928b):

  - ED-5293: fix merging cells

## 21.1.6

- [patch][a1fb551](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1fb551):

  - Fixed style attribute ADF error for Fabric Status

## 21.1.5

- [patch][aadaeb9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aadaeb9):

  - ED-5691 Allow unsupported block inside tableCell

## 21.1.4

- [patch][5c148c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5c148c8):

  - ED-5739: fix updating cells DOM attributes when deleting rows/columns

## 21.1.3

- [patch][fabc81f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fabc81f):

  - ED-5197: bold toolbar button is inverted in table header cells

## 21.1.2

- [patch][68f3e01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/68f3e01):

  - ED-5687: add full-width grid lines and other resizing fixes

## 21.1.1

- [patch][b19b7bb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b19b7bb):

  - ED-5721 Make content optional for all eligible nodes

## 21.1.0

- [minor][b440439](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b440439):

  - Add breakout mark to editor, renderer and adf-utils

## 21.0.1

- [patch][9390a7e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9390a7e):

  - ED-5685: add grid ruler marks

## 21.0.0

- Updated dependencies [2c21466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c21466):
  - @atlaskit/emoji@46.0.0
  - @atlaskit/media-card@43.0.0
  - @atlaskit/editor-json-transformer@4.0.21
  - @atlaskit/editor-test-helpers@6.2.16
  - @atlaskit/media-core@24.4.0

## 20.3.8

- [patch][1ec58fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ec58fb):

  - Fix bodied extension node blows up with unsupportedBlock

## 20.3.7

- Updated dependencies [04c7192](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/04c7192):
  - @atlaskit/media-core@24.3.1
  - @atlaskit/media-card@42.0.0

## 20.3.6

- [patch][a9eb99f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a9eb99f):

  - ED-5510: fix deleting last character in a cell in Safari

## 20.3.5

- [patch][ed15858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed15858):

  - ED-5552: Adds shadow to overflow elements in the renderer.

## 20.3.4

- [patch][8f1073c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8f1073c):

  - ED-5572 Fixes copying 2+ lines from vs-code pastes as inline code

## 20.3.3

- [patch][825d4e9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/825d4e9):

  Fix copying codeblock from renderer

## 20.3.2

- [patch][9f26f82](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f26f82):

  - Removing extra padding inside the comment editor

## 20.3.1

- Updated dependencies [a6dd6e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6dd6e3):
  - @atlaskit/profilecard@5.0.0

## 20.3.0

- [minor][4f5830f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4f5830f):

  - ED-4200: add page layout support to generator and ADF schema

## 20.2.5

- [patch][653b6a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/653b6a9):

  - removed optional attributes from adf-builder module for status node

- [patch][cd5471b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cd5471b):

  - added style attribute for Status node in ADF schema

## 20.2.4

- [patch][6a0a6f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6a0a6f8):

  - ED-5448, ED-5613, ED-5582: smart card UX improvements; allow blockCard in tableCell

## 20.2.3

- [patch][8fb4b1e" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fb4b1e"
  d):

  - ED-5274 Fixes tables have excessive margin above

## 20.2.2

- [patch][67325ee" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67325ee"
  d):

  - fixing image size inside tables

## 20.2.1

- [patch][534f6ab" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/534f6ab"
  d):

  - ED-5615: Fix block element padding inside table cells.

## 20.2.0

- [minor][03947b2" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/03947b2"
  d):

  - Change selected state for horizontal rule

## 20.1.9

- [patch][ef26075" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef26075"
  d):

  - ED-5622: fix table selection when adding columns/rows very fast

## 20.1.8

- [patch][08e6a0c" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/08e6a0c"
  d):

  - Fix panel icon shrinking when a lot of text in a panel

## 20.1.7

- [patch][25cdb93](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25cdb93):

  Fix copying codeblock from renderer

## 20.1.6

- [patch][1662ae0" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1662ae0"
  d):

  - ED-5440 convert sections to use percentages

## 20.1.5

- [patch][f271431](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f271431):

  ED-5179: fix context menu when table has scroll

## 20.1.4

- [patch] Wrap invalid node with unsupported node [fb60e39](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fb60e39)

## 20.1.3

- [patch] ED-5513: render table that respects columns widths except on mobile [716bb9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/716bb9d)

## 20.1.2

- [patch] Media refactor and fileID upfront [052ce89](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/052ce89)

## 20.1.1

- [patch] Fix race condition in size detector that sometimes leads to width being always 0 [ce97910](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce97910)

## 20.1.0

- [minor] Change breakpoints for dynamic text sizing [f660016](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f660016)

## 20.0.1

- [patch] ED-5487: fix popup when editor is initialised in the head of the page [0c3a2f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c3a2f3)

## 20.0.0

- [major] Updated dependencies [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)
  - @atlaskit/emoji@45.0.0
  - @atlaskit/media-card@41.0.0
  - @atlaskit/editor-json-transformer@4.0.18
  - @atlaskit/editor-test-helpers@6.2.7
  - @atlaskit/media-core@24.3.0

## 19.3.3

- [patch] ED-5529 Fix JSON Schema [d286ab3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d286ab3)

## 19.3.2

- [patch] Updated dependencies [6e510d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e510d8)
  - @atlaskit/media-core@24.2.2
  - @atlaskit/media-card@40.0.0

## 19.3.1

- [patch] ED-5494: fix nested breakout nodes [1eaf1f1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1eaf1f1)

## 19.3.0

- [minor] Dynamic font size for panels [ea3b522](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea3b522)

## 19.2.0

- [minor] Replaces util-shared-styles with theme. ED-5351 [55a4f00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/55a4f00)

## 19.1.1

- [patch] Fix popups are placed incorrectly in modals [2dde31d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2dde31d)

## 19.1.0

- [minor] Summary: Deprecate props, add support for new API. ED-5201 [00e4bb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/00e4bb3)

## 19.0.0

- [major] Updated dependencies [2afa60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2afa60d)
  - @atlaskit/emoji@44.0.0
  - @atlaskit/media-card@39.0.0
  - @atlaskit/editor-json-transformer@4.0.17
  - @atlaskit/editor-test-helpers@6.2.6
  - @atlaskit/media-core@24.2.0

## 18.0.0

- [major] Updated dependencies [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [major] Updated dependencies [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)
  - @atlaskit/emoji@43.0.0
  - @atlaskit/media-card@38.0.0
  - @atlaskit/editor-json-transformer@4.0.16
  - @atlaskit/editor-test-helpers@6.2.5
  - @atlaskit/media-core@24.1.0

## 17.1.1

- [patch] change grey to gray to keep consistent across editor pkgs [1b2a0b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b2a0b3)

## 17.1.0

- [minor] Allow empty content under doc [47d50ad](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/47d50ad)

## 17.0.9

- [patch] ED-5457: moving table css classnames to a const [2e1f627](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e1f627)

## 17.0.8

- [patch] ED-5246 support image resizing [111d02f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/111d02f)

## 17.0.7

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/emoji@42.0.1
  - @atlaskit/mention@15.0.10
  - @atlaskit/media-card@37.0.1
  - @atlaskit/profilecard@4.0.10
  - @atlaskit/icon@14.0.0

## 17.0.6

- [patch] ED-5424: fix telepointers in collab editing [643a860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/643a860)

## 17.0.5

- [patch] Updated dependencies [dae7792](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dae7792)
  - @atlaskit/media-core@24.0.2
  - @atlaskit/media-card@37.0.0

## 17.0.4

- [patch] ED-5313 add width to mediaSingle [3f8c0ee](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f8c0ee)

## 17.0.3

- [patch] Numbered column in table should be able to fit number > 100 [7a43676](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7a43676)

## 17.0.2

- [patch] ED-5299: added mediaSingle to jira transformer [d73f846](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d73f846)

## 17.0.1

- [patch] ED-5150 Editor i18n: Main toolbar [ef76f1f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef76f1f)

## 17.0.0

- [major] Updated dependencies [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
  - @atlaskit/editor-test-helpers@6.1.2
  - @atlaskit/emoji@42.0.0
  - @atlaskit/media-card@36.0.0
  - @atlaskit/editor-json-transformer@4.0.12
  - @atlaskit/media-core@24.0.0

## 16.2.3

- [patch] ED-5346: prosemirror upgrade [5bd4432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5bd4432)

## 16.2.2

- [patch] Fix floating toolbar position in a table with scroll [8da7574](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8da7574)

## 16.2.1

- [patch] Updated dependencies [1be4bb8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1be4bb8)
  - @atlaskit/media-core@23.2.1
  - @atlaskit/media-card@35.0.0

## 16.2.0

- [minor] Add dynamic text sizing support to renderer and editor [2a6410f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2a6410f)

## 16.1.6

- [patch] fix styles for nested tables [11267a8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11267a8)

## 16.1.5

- [patch] reverting table style change [b829ab9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b829ab9)

## 16.1.4

- [patch] ED-5335: fix table when it has nested extension that renders another table [21f315b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21f315b)

## 16.1.3

- [patch] use new tsconfig for typechecking [09df171](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/09df171)

## 16.1.2

- [patch] Fix generator to work with TS3 [4040b00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4040b00)

## 16.1.1

- [patch] Fix popup positioning when inside overflow:auto containers [affe5df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/affe5df)

## 16.1.0

- [minor] FS-2961 Introduce status component and status node in editor [7fe2b0a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7fe2b0a)

## 16.0.0

- [major] Updated dependencies [6e1d642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e1d642)
  - @atlaskit/emoji@41.0.0
  - @atlaskit/media-card@34.0.0
  - @atlaskit/editor-json-transformer@4.0.11
  - @atlaskit/editor-test-helpers@6.0.9
  - @atlaskit/media-core@23.2.0

## 15.0.7

- [patch] Update TS to 3.0 [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
- [none] Updated dependencies [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
  - @atlaskit/media-core@23.1.1
  - @atlaskit/emoji@40.0.2
  - @atlaskit/mention@15.0.9
  - @atlaskit/editor-json-transformer@4.0.10
  - @atlaskit/media-card@33.0.2
  - @atlaskit/editor-test-helpers@6.0.8
  - @atlaskit/json-schema-generator@1.1.1

## 15.0.6

- [patch] MediaSingle image now has 100% max-width in table cells [9e5ae81](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9e5ae81)
- [patch] Updated dependencies [9e5ae81](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9e5ae81)

## 15.0.5

- [patch] Updated dependencies [9c66d4d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c66d4d)
  - @atlaskit/webdriver-runner@0.1.0

## 15.0.4

- [patch] Wrap listItems and tableCell inline nodes with a block node to avoid renderer exceptions. ED-5283 [46eca8f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/46eca8f)

## 15.0.3

- [patch] Fix import error from css-color-names [ce50449](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce50449)

## 15.0.2

- [patch] ED-3919: Fix typography and other styles, align styles between editor and renderer [d0f9293](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0f9293)

## 15.0.1

- [patch] Updated dependencies [da65dec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da65dec)

## 15.0.0

- [major] Updated dependencies [7545979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7545979)
  - @atlaskit/emoji@40.0.0
  - @atlaskit/media-card@33.0.0
  - @atlaskit/editor-json-transformer@4.0.8
  - @atlaskit/editor-test-helpers@6.0.6
  - @atlaskit/media-core@23.1.0

## 14.0.14

- [patch] ED-5101, align z-index of all floating things inside editor. [52ad431](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/52ad431)
- [none] Updated dependencies [52ad431](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/52ad431)

## 14.0.13

- [patch] Update Page Layout sizing to be more compact, fix quick-insert icon, fix issue with Popup not centering toolbar in certain situations [1effb83](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1effb83)

## 14.0.12

- [patch] ED-5172 pressing enter after media single in list no longer deletes list [74824f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/74824f8)

## 14.0.11

- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/profilecard@4.0.8
  - @atlaskit/editor-test-helpers@6.0.3
  - @atlaskit/mention@15.0.6
  - @atlaskit/emoji@39.1.1
  - @atlaskit/editor-json-transformer@4.0.6
  - @atlaskit/media-card@32.0.5

## 14.0.10

- [patch] Updated dependencies [dd91bcf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd91bcf)
  - @atlaskit/emoji@39.1.0

## 14.0.9

- [patch] Fixes renderer tables for Mobile [7f1ef74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f1ef74)
- [none] Updated dependencies [7f1ef74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f1ef74)

## 14.0.8

- [patch] ED-5178: added card node to default schema [51e7446](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/51e7446)
- [none] Updated dependencies [51e7446](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/51e7446)
  - @atlaskit/editor-test-helpers@6.0.2

## 14.0.7

- [patch] Updated dependencies [16971e9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/16971e9)
  - @atlaskit/editor-test-helpers@6.0.1

## 14.0.6

- [patch] ED-5190: fixed mediaSingle styles in renderer [4f09dea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4f09dea)
- [none] Updated dependencies [4f09dea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4f09dea)

## 14.0.5

- [patch] ED-4824: added renderer support for smart cards [7cf0a78](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7cf0a78)
- [none] Updated dependencies [7cf0a78](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7cf0a78)

## 14.0.4

- [patch] ED-4421 ADF Validator [fd7e953](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fd7e953)
- [none] Updated dependencies [fd7e953](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fd7e953)
  - @atlaskit/json-schema-generator@1.1.0

## 14.0.3

- [patch] Fixed bodied-extension to not split when pressing enter in middle empty paragraph [4c0ecd7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4c0ecd7)
- [none] Updated dependencies [4c0ecd7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4c0ecd7)

## 14.0.2

- [patch] Updated dependencies [79f780a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79f780a)

## 14.0.1

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/media-card@32.0.1
  - @atlaskit/profilecard@4.0.4
  - @atlaskit/mention@15.0.5
  - @atlaskit/emoji@39.0.1
  - @atlaskit/icon@13.2.4

## 14.0.0

- [none] Updated dependencies [597e0bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/597e0bd)
  - @atlaskit/profilecard@4.0.3
  - @atlaskit/emoji@39.0.0
  - @atlaskit/editor-json-transformer@4.0.4
  - @atlaskit/editor-test-helpers@6.0.0
- [none] Updated dependencies [61df453](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/61df453)
  - @atlaskit/profilecard@4.0.3
  - @atlaskit/editor-test-helpers@6.0.0
  - @atlaskit/emoji@39.0.0
  - @atlaskit/editor-json-transformer@4.0.4
- [none] Updated dependencies [812a39c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/812a39c)
  - @atlaskit/profilecard@4.0.3
  - @atlaskit/emoji@39.0.0
  - @atlaskit/editor-json-transformer@4.0.4
  - @atlaskit/editor-test-helpers@6.0.0
- [none] Updated dependencies [c8eb097](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8eb097)
  - @atlaskit/profilecard@4.0.3
  - @atlaskit/editor-test-helpers@6.0.0
  - @atlaskit/emoji@39.0.0
  - @atlaskit/editor-json-transformer@4.0.4
- [major] Updated dependencies [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
  - @atlaskit/media-core@23.0.0
  - @atlaskit/emoji@39.0.0
  - @atlaskit/profilecard@4.0.3
  - @atlaskit/editor-json-transformer@4.0.4
  - @atlaskit/media-card@32.0.0
  - @atlaskit/editor-test-helpers@6.0.0

## 13.2.8

- [patch] Updated dependencies [59ccb09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59ccb09)
  - @atlaskit/media-card@31.3.0

## 13.2.7

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/media-card@31.2.1
  - @atlaskit/profilecard@4.0.2
  - @atlaskit/mention@15.0.2
  - @atlaskit/emoji@38.0.5
  - @atlaskit/editor-json-transformer@4.0.3
  - @atlaskit/editor-test-helpers@5.1.2
  - @atlaskit/icon@13.2.2
  - @atlaskit/media-core@22.2.1

## 13.2.6

- [patch] Bump prosemirror-model to 1.6 in order to use toDebugString on Text node spec [fdd5c5d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd5c5d)
- [none] Updated dependencies [fdd5c5d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd5c5d)
  - @atlaskit/editor-test-helpers@5.1.1
  - @atlaskit/editor-json-transformer@4.0.2

## 13.2.5

- [patch] When copying a table respect the table layout and cell attributes. ED-4947 [d25b42c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d25b42c)
- [none] Updated dependencies [d25b42c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d25b42c)

## 13.2.4

- [patch] ED-4995: added support for the rest of the page layout types in the renderer [9d9acfa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d9acfa)
- [none] Updated dependencies [9d9acfa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d9acfa)

## 13.2.3

- [patch] Updated dependencies [3485c00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3485c00)
  - @atlaskit/media-core@22.2.0
  - @atlaskit/media-card@31.1.1

## 13.2.2

- [patch] ED-5033, fixes for multiple date related issues. [c9911e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c9911e0)
- [patch] Updated dependencies [c9911e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c9911e0)

## 13.2.1

- [patch] Updated dependencies [fad25ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fad25ec)
  - @atlaskit/media-core@22.1.0
  - @atlaskit/media-card@31.1.0
  - @atlaskit/editor-test-helpers@5.0.3

## 13.2.0

- [patch] Updated dependencies [fa6f865](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa6f865)
  - @atlaskit/media-card@31.0.0
- [none] Updated dependencies [fdd03d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd03d8)
  - @atlaskit/media-card@31.0.0
- [patch] Updated dependencies [49c8425](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49c8425)
  - @atlaskit/media-card@31.0.0
- [minor] Updated dependencies [3476e01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3476e01)
  - @atlaskit/media-card@31.0.0

## 13.1.0

- [minor] Updated dependencies [f6bf6c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f6bf6c8)
  - @atlaskit/mention@15.0.0

## 13.0.11

- [patch] quick fix for invalid codeBlock throwing errors. We should handle it in a better way. Rifat is working on a proper solution [7d549c4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d549c4)
- [none] Updated dependencies [7d549c4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d549c4)

## 13.0.10

- [patch] Fix deleting the panel macro crashes the page [f0a4fb9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f0a4fb9)
- [none] Updated dependencies [f0a4fb9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f0a4fb9)

## 13.0.9

- [patch] ED-4199, Adding support for column layout in renderer. [51ccf5f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/51ccf5f)
- [none] Updated dependencies [51ccf5f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/51ccf5f)

## 13.0.8

- [patch] FS-2816 - Prevent clicks in pop ups from triggering focus of the message editor [247855f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/247855f)
- [none] Updated dependencies [247855f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/247855f)

## 13.0.7

- [patch] Updated dependencies [b1e8a47](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1e8a47)

## 13.0.6

- [patch] Fix popup reposition error on scroll and resize and karma test [aeec6b8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aeec6b8)
- [none] Updated dependencies [aeec6b8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aeec6b8)

## 13.0.5

- [patch] New floating toolbar for Panel [4d528ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d528ab)
- [none] Updated dependencies [4d528ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d528ab)

## 13.0.4

- [patch] Fallback to use containerId from MentionResourceConfig if ContextIdentifier promise fails [5ecb9a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ecb9a7)
- [patch] add support for childObjectId in ContextIdentifiers and pass it to the mention service endpoints [6e31eb6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e31eb6)
- [none] Updated dependencies [5ecb9a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ecb9a7)
  - @atlaskit/mention@14.0.2
  - @atlaskit/editor-test-helpers@5.0.2
- [patch] Updated dependencies [6e31eb6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e31eb6)
  - @atlaskit/mention@14.0.2
  - @atlaskit/editor-test-helpers@5.0.2

## 13.0.3

- [patch] Improves type coverage by removing casts to any [8928280](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8928280)
- [none] Updated dependencies [8928280](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8928280)

## 13.0.2

- [patch] ED-4676, text in table header should be bold y default. [1bf849c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bf849c)
- [patch] Updated dependencies [1bf849c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bf849c)

## 13.0.1

- [patch] ED-5063 always render tables to full width of container [4342d93](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4342d93)
- [none] Updated dependencies [4342d93](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4342d93)

## 13.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/media-card@30.0.0
  - @atlaskit/profilecard@4.0.0
  - @atlaskit/editor-json-transformer@4.0.0
  - @atlaskit/editor-test-helpers@5.0.0
  - @atlaskit/mention@14.0.0
  - @atlaskit/emoji@38.0.0
  - @atlaskit/media-core@22.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/media-card@30.0.0
  - @atlaskit/profilecard@4.0.0
  - @atlaskit/mention@14.0.0
  - @atlaskit/emoji@38.0.0
  - @atlaskit/editor-json-transformer@4.0.0
  - @atlaskit/editor-test-helpers@5.0.0
  - @atlaskit/media-core@22.0.0
  - @atlaskit/icon@13.0.0

## 12.0.0

- [major] Refactor existing 'paste' slice handling code, to use common utilities. Remove unused linkifySlice export from editor-common. [5958588](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5958588)
- [none] Updated dependencies [5f6ec84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f6ec84)
  - @atlaskit/editor-test-helpers@4.2.4
  - @atlaskit/editor-json-transformer@3.1.8
- [none] Updated dependencies [5958588](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5958588)
  - @atlaskit/editor-test-helpers@4.2.4
  - @atlaskit/editor-json-transformer@3.1.8

## 11.4.6

- [patch] Updated dependencies [c98857e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c98857e)
  - @atlaskit/mention@13.1.10
  - @atlaskit/editor-test-helpers@4.2.3
- [patch] Updated dependencies [8a125a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a125a7)
  - @atlaskit/mention@13.1.10
  - @atlaskit/editor-test-helpers@4.2.3
- [patch] Updated dependencies [cacfb53](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cacfb53)
  - @atlaskit/mention@13.1.10
  - @atlaskit/editor-test-helpers@4.2.3

## 11.4.5

- [patch] Updated dependencies [6f51fdb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6f51fdb)

## 11.4.4

- [patch] Updated dependencies [f897c79](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f897c79)
  - @atlaskit/emoji@37.0.0
- [none] Updated dependencies [cacf096](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cacf096)
  - @atlaskit/emoji@37.0.0

## 11.4.3

- [patch] ED-5034 unify full-width sizes of media, tables and extensions [dac304d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dac304d)
- [none] Updated dependencies [dac304d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dac304d)

## 11.4.2

- [patch] Updated dependencies [9a1b6a2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a1b6a2)
  - @atlaskit/media-card@29.1.9

## 11.4.1

- [patch] FS-1704 - Bug fix - copy and pasting of rendered actions/decisions into the editor [9d47846](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d47846)
- [none] Updated dependencies [9d47846](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d47846)

## 11.4.0

- [minor] Add @atlaskit/adf-utils package [dd2efd5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd2efd5)
- [none] Updated dependencies [dd2efd5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd2efd5)

## 11.3.14

- [patch] Replace Portal component with ReactDOM.createPortal [17b638b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/17b638b)
- [none] Updated dependencies [17b638b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/17b638b)

## 11.3.13

- [patch] ED-4420: added unsupported nodes [f33ac3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f33ac3c)
- [none] Updated dependencies [f33ac3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f33ac3c)

## 11.3.12

- [none] Updated dependencies [8c711bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c711bd)
  - @atlaskit/editor-test-helpers@4.2.1
  - @atlaskit/emoji@36.0.2
- [patch] Updated dependencies [42ee1ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42ee1ea)
  - @atlaskit/media-core@21.0.0
  - @atlaskit/emoji@36.0.2
  - @atlaskit/media-card@29.1.8
  - @atlaskit/editor-test-helpers@4.2.1

## 11.3.11

- [patch] Move removing nulls to the transformer instead of only in the tests. ED-4496 [617d8c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/617d8c1)
- [none] Updated dependencies [617d8c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/617d8c1)
  - @atlaskit/editor-json-transformer@3.1.6

## 11.3.10

- [patch] Updated dependencies [d7dca64](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7dca64)
  - @atlaskit/mention@13.1.4

## 11.3.9

- [patch][refactor] Use ParseRule->context to prevent pasting layoutColumn/layoutSections inside each other. [541341e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/541341e)
- [patch][refactor] Use ParseRule->context to prevent nesting bodiedExtensions on paste. [fe383b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fe383b4)
- [none] Updated dependencies [2625ade](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2625ade)
  - @atlaskit/editor-test-helpers@4.2.0
- [none] Updated dependencies [e3c6479](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e3c6479)
  - @atlaskit/editor-test-helpers@4.2.0
- [none] Updated dependencies [541341e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/541341e)
  - @atlaskit/editor-test-helpers@4.2.0
- [none] Updated dependencies [fe383b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fe383b4)
  - @atlaskit/editor-test-helpers@4.2.0

## 11.3.8

- [patch] Updated dependencies [8d5053e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d5053e)
  - @atlaskit/emoji@36.0.1
  - @atlaskit/mention@13.1.3
  - @atlaskit/editor-json-transformer@3.1.5
  - @atlaskit/editor-test-helpers@4.1.9

## 11.3.7

- [patch] Updated dependencies [0cf2f52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0cf2f52)
  - @atlaskit/emoji@36.0.0
  - @atlaskit/mention@13.1.2
  - @atlaskit/editor-json-transformer@3.1.4
  - @atlaskit/editor-test-helpers@4.1.8

## 11.3.6

- [patch] Bitbucket images were displaying at 100% of the container, and not respect max-width of the image. ED-4946 [370c812](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/370c812)
- [none] Updated dependencies [370c812](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/370c812)
  - @atlaskit/media-card@29.1.6

## 11.3.5

- [patch] Updated dependencies [c57e9c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c57e9c1)
  - @atlaskit/media-card@29.1.5
  - @atlaskit/emoji@35.1.4
  - @atlaskit/editor-test-helpers@4.1.7
  - @atlaskit/media-core@20.0.0

## 11.3.4

- [patch] ED-4934: fix table styles by avoiding circular imports [d1375ee](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d1375ee)
- [none] Updated dependencies [d1375ee](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d1375ee)

## 11.3.3

- [patch] Fixing the cursor navigation between inline nodes [b9e3213](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9e3213)
- [none] Updated dependencies [b9e3213](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9e3213)

## 11.3.2

- [patch] ED-4520, date renderer should render UTC value of date. [28e3c31](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/28e3c31)
- [none] Updated dependencies [28e3c31](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/28e3c31)

## 11.3.1

- [patch] ED-4924: fix table control styles [377ebeb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/377ebeb)
- [none] Updated dependencies [377ebeb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/377ebeb)

## 11.3.0

- [minor] Remove pinned prosemirror-model@1.4.0 and move back to caret ranges for prosemirror-model@^1.5.0 [4faccc0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4faccc0)
- [none] Updated dependencies [4faccc0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4faccc0)
  - @atlaskit/editor-test-helpers@4.1.5
  - @atlaskit/editor-json-transformer@3.1.3

## 11.2.11

- [patch] Removing unnecessary throw of error [bfa8b69](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bfa8b69)
- [none] Updated dependencies [bfa8b69](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bfa8b69)

## 11.2.10

- [patch] Bump prosemirror-view to 1.3.3 to fix issue where newlines in code-blocks would vanish in IE11. (ED-4830) [fc5a082](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc5a082)
- [none] Updated dependencies [fc5a082](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc5a082)
  - @atlaskit/editor-test-helpers@4.1.4

## 11.2.9

- [patch] ED-4741, adding support for date node in renderer. [2460f47](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2460f47)
- [none] Updated dependencies [2460f47](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2460f47)

## 11.2.8

- [patch] Updated dependencies [74a0d46](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/74a0d46)
  - @atlaskit/media-card@29.1.3
- [patch] Updated dependencies [6c6f078](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c6f078)
  - @atlaskit/media-card@29.1.3
- [patch] Updated dependencies [5bb26b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5bb26b4)
  - @atlaskit/media-card@29.1.3

## 11.2.7

- [patch] ED-4848: make wide table mode responsive [862ea96](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/862ea96)
- [none] Updated dependencies [862ea96](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/862ea96)

## 11.2.6

- [patch] Design updates for /QuickInsert™️ menu [4e4825e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e4825e)
- [none] Updated dependencies [4e4825e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e4825e)

## 11.2.5

- [patch] Add Table breakout mode in renderer [0d3b375](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d3b375)
- [none] Updated dependencies [0d3b375](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d3b375)

## 11.2.4

- [patch] ED-4713 Add stage 0 support in json-schema-generator [cce275f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cce275f)
- [none] Updated dependencies [cce275f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cce275f)
  - @atlaskit/json-schema-generator@1.0.1

## 11.2.3

- [patch] ED-4489 Fix can't submit with enter using Korean and Japanese IME [0274524](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0274524)
- [none] Updated dependencies [0274524](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0274524)
  - @atlaskit/editor-test-helpers@4.1.3

## 11.2.2

- [patch] Fixing extension select and refactor [eca44eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eca44eb)
- [none] Updated dependencies [eca44eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eca44eb)

## 11.2.1

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/media-card@29.1.2
  - @atlaskit/emoji@35.1.1
  - @atlaskit/mention@13.1.1
  - @atlaskit/editor-json-transformer@3.1.2
  - @atlaskit/editor-test-helpers@4.1.2
  - @atlaskit/media-core@19.1.3
  - @atlaskit/icon@12.1.2

## 11.2.0

- [minor] ED-4654 add minimum 128px column width to tables [6ee43d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ee43d8)
- [none] Updated dependencies [6ee43d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ee43d8)

## 11.1.2

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/media-card@29.1.1
  - @atlaskit/editor-json-transformer@3.1.1
  - @atlaskit/editor-test-helpers@4.1.1
  - @atlaskit/media-core@19.1.2
  - @atlaskit/icon@12.1.1

## 11.1.1

- [patch] ED-3474 add redesigned table numbering column, fix table styling regressions [1bef41a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bef41a)
- [none] Updated dependencies [1bef41a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bef41a)

## 11.1.0

- [none] Updated dependencies [7217164](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7217164)
  - @atlaskit/editor-test-helpers@4.1.0
  - @atlaskit/mention@13.1.0
  - @atlaskit/emoji@35.1.0
  - @atlaskit/editor-json-transformer@3.1.0

## 11.0.7

- [patch] Updated dependencies [2de7ce7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2de7ce7)
  - @atlaskit/media-card@29.0.3

## 11.0.6

- [patch] Update and lock prosemirror-model version to 1.4.0 [febf753](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febf753)
- [none] Updated dependencies [febf753](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febf753)
  - @atlaskit/editor-test-helpers@4.0.7
  - @atlaskit/editor-json-transformer@3.0.11

## 11.0.5

- [patch] Adding breakout to extensions [3d1b0ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d1b0ab)
- [none] Updated dependencies [3d1b0ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d1b0ab)
  - @atlaskit/editor-test-helpers@4.0.6

## 11.0.4

- [patch] ED-4818: add inlineCard to schema [a303cbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a303cbd)
- [none] Updated dependencies [a303cbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a303cbd)
  - @atlaskit/editor-test-helpers@4.0.4

## 11.0.3

- [patch] Updated dependencies [823caef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/823caef)
  - @atlaskit/media-card@29.0.2

## 11.0.2

- [patch] Updated dependencies [732d2f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/732d2f5)
  - @atlaskit/media-card@29.0.1

## 11.0.1

- [patch] Strip empty optional attributes from the link mark in editor-json-transformer [c3b3100](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b3100)
- [none] Updated dependencies [c3b3100](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b3100)
  - @atlaskit/editor-json-transformer@3.0.10

## 11.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/media-card@29.0.0
  - @atlaskit/emoji@35.0.7
  - @atlaskit/mention@13.0.0
  - @atlaskit/editor-json-transformer@3.0.9
  - @atlaskit/editor-test-helpers@4.0.3
  - @atlaskit/media-core@19.0.0
  - @atlaskit/icon@12.0.0

## 10.1.10

- [patch] ED-4789: fix sticky toolbars [6d09683](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d09683)
- [none] Updated dependencies [6d09683](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d09683)

## 10.1.9

- [patch] Updated dependencies [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/media-card@28.0.6
  - @atlaskit/emoji@35.0.6
  - @atlaskit/mention@12.0.3
  - @atlaskit/editor-json-transformer@3.0.8
  - @atlaskit/editor-test-helpers@4.0.2

## 10.1.8

- [patch] Updated dependencies [5ee48c4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ee48c4)
  - @atlaskit/emoji@35.0.5
  - @atlaskit/media-core@18.1.2

## 10.1.7

- [patch] Quick Insert menu for internal editor things [370344f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/370344f)
- [none] Updated dependencies [370344f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/370344f)

## 10.1.6

- [patch] ED-4689 add \_\_confluenceMetadata to link mark schema [e76e4b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e76e4b4)
- [none] Updated dependencies [e76e4b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e76e4b4)

## 10.1.5

- [patch] FEF-1329 Fix catastrophic failure when editing pages with images [da4d2d4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da4d2d4)
- [none] Updated dependencies [da4d2d4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da4d2d4)

## 10.1.4

- [patch] Updated dependencies [35d547f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d547f)
  - @atlaskit/media-card@28.0.5

## 10.1.3

- [patch] Add support for relative links [41eb1c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/41eb1c1)
- [none] Updated dependencies [41eb1c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/41eb1c1)

## 10.1.2

- [patch] ED-4447 Fix image breakout rendering [b73e05d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b73e05d)
- [none] Updated dependencies [b73e05d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b73e05d)

## 10.1.1

- [patch] Updated dependencies [639ae5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/639ae5e)
  - @atlaskit/mention@12.0.2

## 10.1.0

- [minor] Adds in adf traversor [450db2e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/450db2e)
- [minor] Updated dependencies [450db2e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/450db2e)

## 10.0.3

- [none] Updated dependencies [ba702bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ba702bc)
  - @atlaskit/mention@12.0.0

## 10.0.2

- [patch] ED-4221 Fix toolbar style inconsistencies [f3fb6b8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f3fb6b8)
- [none] Updated dependencies [f3fb6b8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f3fb6b8)

## 10.0.1

- [patch] Updated dependencies [bd26d3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd26d3c)
  - @atlaskit/emoji@35.0.1
  - @atlaskit/media-core@18.1.1
  - @atlaskit/media-card@28.0.1

## 10.0.0

- [patch] ED-4570, application card without icon should render properly. [714ab32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/714ab32)
- [none] Updated dependencies [febc44d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febc44d)
  - @atlaskit/editor-test-helpers@4.0.0
  - @atlaskit/emoji@35.0.0
  - @atlaskit/editor-json-transformer@3.0.7

## 9.4.0

- [minor] Add stage0 support to validator [1b5cc7f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b5cc7f)
- [none] Updated dependencies [1b5cc7f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b5cc7f)

## 9.3.10

- [patch] ED-4643: added support for "wide" layout for tables [8c146ee](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c146ee)
- [none] Updated dependencies [8c146ee](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c146ee)

## 9.3.9

- [patch] Support external media in bitbucket transformer and image uploader [8fd4dd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fd4dd1)
- [patch] ED-4656: enable extension inside bodiedExtension [74f84c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/74f84c6)
- [none] Updated dependencies [8fd4dd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fd4dd1)
  - @atlaskit/editor-test-helpers@3.1.8
  - @atlaskit/mention@11.1.4
  - @atlaskit/emoji@34.2.0
  - @atlaskit/editor-json-transformer@3.0.6

## 9.3.8

- [patch] ED-4569 Fix ADF schema issue for application card link pattern [fb831b1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fb831b1)
- [none] Updated dependencies [fb831b1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fb831b1)

## 9.3.7

- [patch] Adding borders for colors in color picker [dc842ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc842ac)
- [none] Updated dependencies [dc842ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc842ac)

## 9.3.6

- [patch] Disable overlay for mediaSingle [147bc84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/147bc84)
- [none] Updated dependencies [147bc84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/147bc84)

## 9.3.5

- [patch] ED-4120 support placeholder text in renderer [616a6a5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/616a6a5)
- [patch] Updated dependencies [616a6a5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/616a6a5)

## 9.3.4

- [patch] Fix validation for badge number [3ef21cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ef21cd)
- [patch] ED-4523 implement contexual delete [9591127](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9591127)
- [none] Updated dependencies [3ef21cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ef21cd)
- [patch] Updated dependencies [9591127](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9591127)

## 9.3.3

- [patch] Revert schema change [d6634bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d6634bc)

## 9.3.1

- [patch] Fixing up the re-rendering of tables on paste [31f28fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/31f28fa)

## 9.3.0

- [minor] Adding support for external images [9935105](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9935105)

## 9.2.14

- [patch] ED-4568, adding support for panel types success and error in renderer. [1aef8d2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1aef8d2)

## 9.2.13

- [patch] Adding progress loader for cloud pickers [e22266c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e22266c)

## 9.2.11

- [patch] ED-4431, selecting block extension creates a wrng selection. [c078cf2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c078cf2)

## 9.2.10

- [patch] Bump to prosemirror-view@1.3.0 [faea319](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/faea319)

## 9.2.8

- [patch] ED-4336 support loading dynamic/"auto" tables from confluence to fixed-width tables [0c2f72a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c2f72a)

## 9.2.7

- [patch] ED-4454: fix setting while bg color for table header cells [83aecb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/83aecb3)

## 9.2.5

- [patch] ED-4459, JIRA transformer should return unicode for emoji node. [107bf1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/107bf1e)

## 9.2.4

- [patch] added gap cursor [5d81c8b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5d81c8b)

## 9.2.2

- [patch] ED-3633, fixing paragarph margins inside table. [9d8c2a4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d8c2a4)

## 9.2.1

- [patch] ED-4334 fix column size calculation bug; don't emit default col/rowspan attrs [eb8f140](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eb8f140)

## 9.2.0

- [minor] Add initial Page Layouts supports for Confluence. Doesn't currently support different layout types / enforcing column constraints in the editor. [ec8f6d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec8f6d8)

## 9.1.0

- [minor] Add a generic type ahead plugin [445c66b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/445c66b)

## 9.0.1

- [patch] Unskipping the backwards compat test [1bbf22e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bbf22e)

## 8.1.27

- [patch] Removing redundant array item from schema [ab8533d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab8533d)

## 8.1.25

- [patch] Added missing dependencies and added lint rule to catch them all [0672503](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0672503)

## 8.1.24

- [patch] Fixing the nested link issue on paste [5d20a1f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5d20a1f)

## 8.1.22

- [patch] change table node builder constructor for tests, remove tableWithAttrs [cf43535](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cf43535)

## 8.1.20

- [patch] support table colwidth in renderer, fix other table properties in email renderer [f78bef4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f78bef4)

## 8.1.19

- [patch] make tableCell/tableHeader attrs object optional [a6e1882](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6e1882)

## 8.1.18

- [patch] ED-4094: fix ADF generation for inline code [ee9c394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee9c394)

## 8.1.17

- [patch] Adding Media inside lists [07d3dff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07d3dff)

## 8.1.16

- [patch] ED-3476 add table breakout mode [7cd4dfa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7cd4dfa)

## 8.1.14

- [patch] Remove dependency on prosemirror-schema-basic from editor-common [a1ed03a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1ed03a)

## 8.1.10

- [patch] Move types/interfaces for ExtensionHandlers to editor-common [3d26cab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d26cab)

## 8.1.9

- [patch] Upgrading ProseMirror Libs [35d14d5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d14d5)

## 8.1.8

- [patch] ED-3990: No longer allow bodiedExtensions in table cells in ADF [c02a81a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c02a81a)

## 8.1.5

- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)

## 8.1.4

- [patch] table cell/header attributes in the Confluence transformer [9415aaa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9415aaa)

## 8.1.3

- [patch] add additional confluence link metadata attributes [6ddf3d4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ddf3d4)

## 8.1.2

- [patch] ED-4030 Don't reload Image cards again after upload is done [9aff937](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9aff937)

## 8.1.1

- [patch] Use fab:adf to convert Macros and fallback [ece6c43](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ece6c43)

## 8.1.0

- [minor] Add analytics events for click and show actions of media-card [031d5da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/031d5da)

## 8.0.5

- [patch] Changing table cell schema to not allow nesting of bodied extensions in it. [bac680c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bac680c)

## 8.0.3

- [patch] Add full width and wide layout support for single image [ae72acf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae72acf)

## 8.0.0

- [major] updated media-core peer dependency, this requires dependents to install new media-core version [47b459a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/47b459a)

## 7.0.2

- [patch] support \_\_confluenceMetadata property on link mark [b17f847](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b17f847)

## 7.0.0

- [major] Use media-core as peerDependency [c644812](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c644812)

## 6.3.17

- [patch] make colwidth an array of numbers in schema [369b522](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/369b522)

## 6.3.16

- [patch] Add key as an optional parameter to applicationCard actions [28be081](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/28be081)

## 6.3.12

- [patch] Table columns should not resize when typing [59728cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59728cc)

## 6.3.8

- [patch] Fix for styled-components types to support v1.4.x [75a2375](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75a2375)

## 6.3.6

- [patch] JSON encoding results in invalid ADF for table nodes [8a8d663](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a8d663)

## 6.3.5

- [patch] fix tables in json schema [4b67c37](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b67c37)

## 6.3.3

- [patch] Adding support for reactions [1b74cff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b74cff)

## 6.3.2

- [patch] add span and background attribs for table nodes in renderer [8af61df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8af61df)

## 6.3.0

- [minor] Introduce the placeholder node to the ADF [2441f92](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2441f92)

## 6.2.0

- [minor] add support for <fab:adf> and confluence decision list transforms [e08eccc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e08eccc)
- [minor] add support for <fab:adf> and confluence decision list transforms [f43f928](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f43f928)
- [minor] advanced features for tables [e0bac20](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e0bac20)

## 6.1.9

- [patch] Encode and decode for Extension schemaVersion [0335988](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0335988)

## 6.1.8

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 6.1.3

- [patch] Move media provider and state manager to editor-core [0601da7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0601da7)

## 6.1.2

- [patch] Add the placeholder text node to the schema [330993f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/330993f

## 6.1.0

- [minor] Fixing content expression of bodiedExtension node. [38b81ad](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/38b81ad)

## 6.0.4

- [patch] bump mention to 9.1.1 to fix mention autocomplete bug [c7708c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c7708c6)

## 6.0.3

- [patch] Remove monospace font-style for code marks. [b92c81e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b92c81e)

## 6.0.2

- [patch] Removing SMB from URL-whitelist [dfe77d2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dfe77d2)

## 6.0.1

- [patch] Add additional inline nodes to unknownBlock [f330ca1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f330ca1)

## 6.0.0

- [patch] cket-transformer/**tests**/\_schema-builder.ts [a6e77ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6e77ff)
- [major] move MediaItem to renderer, bump icons [5e71725](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e71725)

## 5.10.3

- [patch] Change JSON schema to ensure that first child of list-item is always paragraph [9a36594](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a36594)

## 5.10.0

- [minor] FS-1624 Add new popupsScrollableElement props to editor to handle case when mountPoint is different than the scrollable element. [7d669bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d669bc)

## 5.9.4

- [patch] Insert media group instead of single image inside table [5b4aaa0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b4aaa0)

## 5.9.3

- [patch] Fix getValidDocument to wrap top level inline nodes [c82a941](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c82a941)
- [patch] Fix unknown node validator [419f4fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/419f4fc)

## 5.9.1

- [patch] fix extension replacement with empty content [e151446](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e151446)

## 5.9.0

- [minor] move table nodes from prosemirror-tables to editor-common [630c9ae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/630c9ae)
- [patch] fixed extension node content field [41c7958](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/41c7958)

## 5.8.1

- [patch] Fixing nesting of blocks in JSON schema. [ed5c5ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed5c5ca)

## 5.8.0

- [minor] added new panelType [9f693b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f693b9)

## 5.7.3

- [patch] Revert the change of block nesting in JSON schema. [dd19d0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd19d0f)

## 5.7.0

- [minor] Fixing JSON schema for block nesting. [92c8f93](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92c8f93)

## 5.6.0

- [minor] added date plugin [f7b8a33](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f7b8a33)

## 5.5.1

- [patch] Fix schema definition of mediaSingle node [ade0fc9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ade0fc9)

## 5.5.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 5.4.1

- [patch] Use media-test-helpers instead of hardcoded values [f2b92f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f2b92f8)

## 5.3.0

- [patch] Remove duplicate implementation of ProviderFactory from @atlaskit/editor-core, in favour of only one implementation in @atlaskit/editor-common [535cb8c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/535cb8c)
- [minor] bump prosemirror-tables to 0.5.2 [32b6bbe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/32b6bbe)
- [patch] FS-1601 Don't use async/await in mention-with-providers to allow usage of synchronous promise by consumer [e464412](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e464412)
- [minor] added tasks/actions to full-page editor [49d3343](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d3343)

## 5.1.10

- [patch] We now use ProseMirror Schema to validate document [d059d6a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d059d6a)

## 5.1.9

- [patch] Added floating toolbar to media single [46fdd15](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/46fdd15)

## 5.1.8

- [patch] Allow inline contents inside headings. [738631b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/738631b)

## 5.1.7

- [patch] Updated media-card Appearance type to include "auto" [e1f8390](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e1f8390)

## 5.1.4

- [patch] Support copy/pasting emoji from Bitbucket into the Editor [a8ca5d4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a8ca5d4)

## 5.1.3

- [patch] replaced inlineMacro node with inlineExtension node [a43f891](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a43f891)

## 5.1.2

- [patch] Bumped emoji to v31 [c4365e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c4365e4)
- [patch] Bumped emoji to v31 [207e0fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/207e0fc)
- [patch] Fix the issue where originalContent isn't passed down to extension handlers [c3cdea3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3cdea3)

## 5.1.1

- [patch] Add Serializer for Single image [03405bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/03405bf)

## 5.1.0

- [minor] FS-1461 added ContextIdentifierProvider interface to editor [0aeea41](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0aeea41)

## 5.0.6

- [patch] Add default center layout support for single image [6113e02](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6113e02)

## 5.0.3

- [patch] Only bodiedExtension has content [6d4caae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d4caae)

## 5.0.0

- [major] Rename singleImage to mediaSingle. Replaced alignment and display attributes with layout. [0b97f0a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0b97f0a)

## 4.4.0

- [minor] Addes in extension node [e52d336](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e52d336)

## 4.3.0

- [minor] Remove support for images with data URI's for Bitbucket's image node in the editor [e055dee](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e055dee)

## 4.2.0

- [minor] split extension node [4303d49](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4303d49)

## 4.1.0

- [patch] Remove singleImage from editor-cq schema [f5c1ecb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f5c1ecb)

## 4.0.1

- [patch] added extension node [ec73cb8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec73cb8)

## 4.0.0

- [major] Update signature onClick event on filmstrip (renderer) [30bdfcc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30bdfcc)
- [major] Update signature onClick event on filmstrip (renderer) [dbced25](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dbced25)
- [major] Update signature onClick event on filmstrip (renderer) [7ee4743](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ee4743)

## 3.12.0

- [patch] Fix dependencies [9f9de42](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f9de42)

## 3.11.2

- [patch] Adding separate transformer packages. [f734c01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f734c01)

## 3.11.0

- [minor] Move validators from renderer to editor-common [3e2fd00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3e2fd00)

## 3.10.0

- [minor] Added single image to schema; insertFile renamed to insertFiles. [1c6b005](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c6b005)

## 3.9.12

- [patch] @atlaskit/emoji bumped to ^30.3.3 for big emoji scrolling bugfix [095d6ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/095d6ba)

## 3.9.11

- [patch] bump icon dependency [da14956](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da14956)

## 3.9.6

- [patch] Updated media-card Appearance type to include "auto" [e1f8390](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e1f8390)

## 3.9.4

- [patch] re-enable backwards compatibility tests [32e0ccb](32e0ccb)

## 3.9.3

- [patch] Upgrade mention to ^8.1.0 in editor and renderer [48b5af4](48b5af4)

## 3.9.1

- [patch] Restore accessLevel attribute for mention node [a83619f](a83619f)

## 3.8.3

- [patch] Use correct dependencies [7b178b1](7b178b1)
- [patch] Adding responsive behavior to the editor. [e0d9867](e0d9867)

## 3.8.0

- [minor] Upgrade Media Editor packages [193c8a0](193c8a0)
