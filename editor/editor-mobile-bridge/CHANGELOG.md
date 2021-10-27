# @atlaskit/editor-mobile-bridge

## 29.0.12

### Patch Changes

- Updated dependencies

## 29.0.11

### Patch Changes

- Updated dependencies

## 29.0.10

### Patch Changes

- Updated dependencies

## 29.0.9

### Patch Changes

- Updated dependencies

## 29.0.8

### Patch Changes

- Updated dependencies

## 29.0.7

### Patch Changes

- Updated dependencies

## 29.0.6

### Patch Changes

- Updated dependencies

## 29.0.5

### Patch Changes

- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - COLLAB-411-change-to-metadata: 'setTitle' and 'setEditorWidth' are deprecated, going to be removed in the next release, use 'setMetadata' instead.
- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - Internal changes to remove `@atlaskit/theme/math` usage.
- Updated dependencies

## 29.0.4

### Patch Changes

- Updated dependencies

## 29.0.3

### Patch Changes

- Updated dependencies

## 29.0.2

### Patch Changes

- Updated dependencies

## 29.0.1

### Patch Changes

- Updated dependencies

## 29.0.0

### Major Changes

- [`c79e5921417`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c79e5921417) - ME-1521: introduced a method to invoke async functions and submit a cross platfrom promise on completion. Made the scrollToNode method itself async to prevent some rare race conditions if other bridge methods where invoked before completion.

### Minor Changes

- [`ed9720f8046`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed9720f8046) - CETI-48: Added renderer configurations to support custom panels
- [`ebcba6baa2a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ebcba6baa2a) - Added API for getting the stepVersion from collab provider and passing it via the mobile bridge
- [`71bb1bb3cd0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/71bb1bb3cd0) - [ED-12933] Replace TypeAhead internal tools for tools function

  # Why

  Before mobile bridge was using internal editor logic. That would make our life harder
  to add feature flags, bug fixing or code refactoring.

### Patch Changes

- [`2f5b81920af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2f5b81920af) - Refactor the provider class in collab provider
- [`4f4769d0176`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f4769d0176) - Updated unit tests (unmocked helper function)
- [`363971afa29`](https://bitbucket.org/atlassian/atlassian-frontend/commits/363971afa29) - [ux][ed-13574] Resolving a regression in the quick insert in mobile. A hotfix was merged to master a week ago to fix mobile feature flags, which seems to have clashed with changes in develop resulting in quick insert no longer working on mobile and a bunch of mobile integration tests failing.

  This change includes making quick insert work on mobile again by making sure the tracker isn’t reset every time CC @Sean Chamberlain

  All tests with configureEditor now have a way to refocus the editor after the config is set and before any document changes are made.

  New mobile integration tests have been added for feature flags to ensure we don't have any further regressions with mobile feature flags.

- [`924fe5fd6a9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/924fe5fd6a9) - Use the allowCollabProvider flag in editor configuration to turn collab edit on and off in bridge. Kept url param option there for backwards compatibility.
- Updated dependencies

## 28.1.0

### Minor Changes

- [`c796dfa0ae4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c796dfa0ae4) - [ME-1589] Rearchitect the adaptive toolbar solution for the editor mobile bridge.

  - Add a new plugin to editor-core that allows you to subscribe to events when the editor view is updated.
  - Created a subscription that allows you to listen to toolbar and picker plugin updates.

- [`86503f6d38f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/86503f6d38f) - [ux] Fixup the divider being inserted below the cursor on mobile using quick insert and when using shortcuts in web editor
- [`e2e02bf0bd7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e2e02bf0bd7) - Removed mobile auto scrolling as it has been fixed elsewhere and renamed the mobile scroll plugin to mobile dimensions plugin to better represent its purpose.
- [`dc859557c47`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc859557c47) - Add allowCustomPanel configuration option to editor-mobile-bridge

### Patch Changes

- [`aa6f29f8c3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa6f29f8c3d) - Setting up empty string value for alt attribute (images) by default
- [`2aef13b22d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2aef13b22d8) - ED-12604: add localId for tables and dataConsumer mark for extensions in full schema
- [`bbe08522556`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bbe08522556) - Fix some failing editor-mobile-bridge tests
- [`501650d5d6c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/501650d5d6c) - Change type of emoji-picker to select with selectType of emoji
- Updated dependencies

## 28.0.6

### Patch Changes

- [`12d2ef24248`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12d2ef24248) - [ux][me-1713] Remove setting focus in editorReady lifecycle.

## 28.0.5

### Patch Changes

- Updated dependencies

## 28.0.4

### Patch Changes

- [`f987b3578a6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f987b3578a6) - Address an issue with schema related feature flags conflicting with mobile bridge re-configuration

## 28.0.3

### Patch Changes

- Updated dependencies

## 28.0.2

### Patch Changes

- Updated dependencies

## 28.0.1

### Patch Changes

- Updated dependencies

## 28.0.0

### Minor Changes

- [`5e55b55d035`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e55b55d035) - [ux][ed-9961] Remove the predictable lists feature flag and the legacy lists plugin so that predictable lists is default.

  Doing this by removing the lists plugin, removing the predictableLists feature flag, renaming lists-predictable to just list, refactoring any areas of the code that used the feature flag or the legacy lists still.

  This is a breaking change but has been thoroughly tested locally & with a team blitz on the branch deploy, on both web & mobile.

### Patch Changes

- [`9dd40e58f82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9dd40e58f82) - Allow beautiful panel customisation on android
- Updated dependencies

## 27.0.4

### Patch Changes

- Updated dependencies

## 27.0.3

### Patch Changes

- Updated dependencies

## 27.0.2

### Patch Changes

- Updated dependencies

## 27.0.1

### Patch Changes

- Updated dependencies

## 27.0.0

### Major Changes

- [`fef8103dc44`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fef8103dc44) - [ux] Media inserted now defaults to left aligned on the mobile editor

### Minor Changes

- [`dc5951fa724`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc5951fa724) - Allows the editor mobile bridge plugin subscription listeners to optionally only update once the dom has been rendered. Also adds fix for inserting a date not triggering a toolbar update.

### Patch Changes

- [`97d8dd0e3a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/97d8dd0e3a3) - [ux] Fix hybrid renderer selection issue where selection is cleared on mouseup
- [`fd2b3ba4574`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd2b3ba4574) - ED-13032 Add Focus after editor loads
- Updated dependencies

## 26.5.5

### Patch Changes

- Updated dependencies

## 26.5.4

### Patch Changes

- Updated dependencies

## 26.5.3

### Patch Changes

- Updated dependencies

## 26.5.2

### Patch Changes

- Updated dependencies

## 26.5.1

### Patch Changes

- Updated dependencies

## 26.5.0

### Minor Changes

- [`a8c2596ed8e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a8c2596ed8e) - Add smartLinks prop to Editor and mark UNSAFE_cards as deprecated
- [`cc42416c77d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc42416c77d) - [ME-1514] Add generic bridge API to insert a node in the Hybrid Editor.
  This specific change inserts a 'status' node.
- [`5783530b152`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5783530b152) - Added a new DSL in the mobile bridge to interpret a FloatingToolbarDatePicker. This extends from the FloatingToolbarSelectType.
- [`fa236537b70`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa236537b70) - Allow the mobile bridge to insert a date node
- [`19568bf5587`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19568bf5587) - Updated floating toolbar types to reflect new changes.Some of the floating toolbar types are adjusted and new ones are added. This was done to scale better and be more flexible to support the mobile editor.

      - FloatingToolbarInput now has id, title and description. These are used to generate a proper UI.
      - FloatingToolbarCustom has a mandatory fallback field. This is needed to support to mobile. Custom type uses a react render which has no metadata for the mobile. This is mandatory because we always want to have a fallback. For now, existing usages has an empty array but we will update them later on. Note that it is an array because fallback could be multiple items.
      - FloatingToolbarSelect has an additional type parameter for the options. FloatingToolbarSelect is extended to support different pickers. i.e. Color picker, emoji picker. In addition to the new type parameter, selectType and title fields are added. selectType is used to determine which type of UI needs to be used. color, emoji, date or list. Default one is list.
      - A new type is added. FloatingToolbarColorPicker. It extends select and selectType is color.

### Patch Changes

- [`781ef939b83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/781ef939b83) - [ME-1519] Update font size bridge method definition.
- Updated dependencies

## 26.4.0

### Minor Changes

- [`0e54a14becf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e54a14becf) - ED-13199 added localIdGenerationOnTables and dataConsumerMark flags to the mobile bridge

## 26.3.8

### Patch Changes

- Updated dependencies

## 26.3.7

### Patch Changes

- Updated dependencies

## 26.3.6

### Patch Changes

- Updated dependencies

## 26.3.5

### Patch Changes

- Updated dependencies

## 26.3.4

### Patch Changes

- Updated dependencies

## 26.3.3

### Patch Changes

- Updated dependencies

## 26.3.2

### Patch Changes

- Updated dependencies

## 26.3.1

### Patch Changes

- Updated dependencies

## 26.3.0

### Minor Changes

- [`4b1e5c75a6e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b1e5c75a6e) - Track font size analytics for the Hybrid Editor and Renderer.
- [`2fd50f55028`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2fd50f55028) - Updating documentation to inform users that soon picker popup will no longer be available and also getting rid of picker popup references in examples and all the associated dependencies
- [`f582254da39`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f582254da39) - [ME-1434] Set max font size on Hybrid Editor and Renderer.
  [ME-1450] Fix decision panel overlap.

### Patch Changes

- Updated dependencies

## 26.2.3

### Patch Changes

- Updated dependencies

## 26.2.2

### Patch Changes

- Updated dependencies

## 26.2.1

### Patch Changes

- Updated dependencies

## 26.2.0

### Minor Changes

- [`272aae086cb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/272aae086cb) - [ME-740] Read in user device font settings
- [`3cd8ee5491b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cd8ee5491b) - ED-12790 Disable the indentation for compact editor

### Patch Changes

- [`50deb33bb0d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50deb33bb0d) - Make code block scale to device font size in the Hybrid Renderer.
- [`e90db7597b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e90db7597b2) - [ED-12772] This PR adds the feature flag for 'useUnpredictableInputRules' to the mobile bridge. When set to false, the new predictable input rules code will be used for auto-formatting.
- Updated dependencies

## 26.1.0

### Minor Changes

- [`9532245d3bb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9532245d3bb) - [ux] Allow for quick insert to work with both typeahead toolbar and with /link + enter
- [`5c6fbdb545d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c6fbdb545d) - ME-1163 When a content is set, onContentRendered event is invoked in the mobile bridge. It uses measureRender utility method to fire an event for the first rendered frame.

  In mobile, WebView is reused, therefore in the native side an empty content is set on each WebView stop. This causes issues if measureRender is invoked again. Therefore, this changeset prevents to use measureRender when the content is empty. Content is set properly, but there won't be any onContentRendered invocation.

### Patch Changes

- [`71cdf0a5a2f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/71cdf0a5a2f) - [ME-742] Change default font size for iOS and Android Hybrid Editor and Renderer.
- [`a575b6e860e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a575b6e860e) - [ME-742] Update default font size for iOS and Android.
- [`581d587fade`](https://bitbucket.org/atlassian/atlassian-frontend/commits/581d587fade) - ED-12410 prevent renderer cancels highlight when tapping
- [`8342001ec9b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8342001ec9b) - Update Android media snapshots.
- [`8efee2de0c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8efee2de0c3) - Add more media test
- Updated dependencies

## 26.0.2

### Patch Changes

- Updated dependencies

## 26.0.1

### Patch Changes

- Updated dependencies

## 26.0.0

### Major Changes

- [`864bae0214b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/864bae0214b) - Removed old methods for inserting a link as they were only being used by mobile. Fix hyperlink text removal on editor mobile bridge.

### Minor Changes

- [`865761dd8f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/865761dd8f8) - ME-1154 Introduced an allowed list API to filter adaptive toolbar capabilities.
  Native mobile can use this new bridge API to provide an allowed list.
  When allowed is set, floating toolbar items will be filtered out based on the given list.
  This will prevent to have capabilities enabled on the native side accidently.

### Patch Changes

- [`48de89b4b54`](https://bitbucket.org/atlassian/atlassian-frontend/commits/48de89b4b54) - Add smart-link mobile test cases
- [`9e0d05b6e6b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e0d05b6e6b) - reuse MediaMock from media-test-helpers
- [`7513497739b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7513497739b) - fixed a bug where the native bridge wasn't being notified when user taps on a smartlink
- [`44414d3dd1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/44414d3dd1e) - Adds media group test
- Updated dependencies

## 25.5.5

### Patch Changes

- [`97264580c25`](https://bitbucket.org/atlassian/atlassian-frontend/commits/97264580c25) - Use blank image for mobile media expand test

## 25.5.4

### Patch Changes

- Updated dependencies

## 25.5.3

### Patch Changes

- Updated dependencies

## 25.5.2

### Patch Changes

- Updated dependencies

## 25.5.1

### Patch Changes

- Updated dependencies

## 25.5.0

### Minor Changes

- [`3cbac8569d2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cbac8569d2) - MOBILE-1643 Disabled image resizing on mobile by default and put it behind a feature toggle.
  It can be enabled via query param.`enableMediaResize` is they query param key.
- [`5fff41bad66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5fff41bad66) - Enable Predictable List on Editor

### Patch Changes

- [`baec4c0c383`](https://bitbucket.org/atlassian/atlassian-frontend/commits/baec4c0c383) - add smart-links mobile VR tests
- [`72d4113483d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/72d4113483d) - ED-12462 Add a wrapper for mobile-editor to fix - ios height not adjusting for compact and full editor
- [`e2260ead0c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e2260ead0c9) - [ME-1099] Fix image spacing in tables in the mobile renderer.
- [`58b170725be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58b170725be) - Renamed @atlaskit/editor-test-helpers/schema-builder to @atlaskit/editor-test-helpers/doc-builder
- Updated dependencies

## 25.4.1

### Patch Changes

- Updated dependencies

## 25.4.0

### Minor Changes

- [`5a02668a6f1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a02668a6f1) - ED-12169 Hook predictableLists feature flag to predictableLists functions in editor-core

### Patch Changes

- [`d2e70ebaaa9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2e70ebaaa9) - NO-ISSUE: updated editor tests to use 'doc: DocBuilder' instead of 'doc: any'
- [`38ce6d21b07`](https://bitbucket.org/atlassian/atlassian-frontend/commits/38ce6d21b07) - EDM-1841: media video file mobile vr tests
- [`7baf62daafb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7baf62daafb) - EDM-1638: add media mobile VR test for captions
- Updated dependencies

## 25.3.7

### Patch Changes

- [`98b1799faaf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/98b1799faaf) - Bumps devDependency to resolve security vulnerability

## 25.3.6

### Patch Changes

- Updated dependencies

## 25.3.5

### Patch Changes

- Updated dependencies

## 25.3.4

### Patch Changes

- [`3feef06e39e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3feef06e39e) - EDM-1381: Match Confluence's stage0 prop on the Mobile renderer

## 25.3.3

### Patch Changes

- Updated dependencies

## 25.3.2

### Patch Changes

- Updated dependencies

## 25.3.1

### Patch Changes

- [`3a1ba537b1b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a1ba537b1b) - Unify test file into single file

## 25.3.0

### Minor Changes

- [`49bf29ce37b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/49bf29ce37b) - - Adding a type decleration as a temporary fix to subdue a type error being raised in editor-mobile-bridge component caused due to @visx/responsive.
  - @visx/responsive is a charting library we are using for our new Charts module.
  - @visx/responsive has a global declaration of the ResizeObserver type and is responsible for type type errors in the editor-mobile-bridge file.
  - Without this additional decleration editor-mobile-bridge/src/document-reflow-detector.ts will pull in the incorrect global decleration.
  - We filed an issue at https://github.com/airbnb/visx/issues/1104.
  - Will remove the additional type declaration once we get a fix in on the Visx side.

## 25.2.1

### Patch Changes

- [`1782690487b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1782690487b) - Group mobile integration test by file to reduce parallelism

## 25.2.0

### Minor Changes

- [`5d37f7fc1f9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d37f7fc1f9) - Revert ED-9960. UNSAFE_predictableLists no longer defaulted to enabled.
- [`761283d9f4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/761283d9f4f) - Removed arch-v3 files
- [`1bf9a0ebc55`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1bf9a0ebc55) - EDM-1615: implement typeAheadItemSelected(quickInsertItem: string)

### Patch Changes

- Updated dependencies

## 25.1.6

### Patch Changes

- [`b99097f3b1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b99097f3b1e) - EDM-1630: Add MediaGroup mobile VR test

## 25.1.5

### Patch Changes

- [`058e1ec668d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/058e1ec668d) - Add media layout mobile VR tests

## 25.1.4

### Patch Changes

- [`6494628658a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6494628658a) - Adds helper for media upload

## 25.1.3

### Patch Changes

- [`ca4c76f79dc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ca4c76f79dc) - ME-1061 Fix editor-mobile-bridge webpack_base_config for 25.0.0

## 25.1.2

### Patch Changes

- Updated dependencies

## 25.1.1

### Patch Changes

- Updated dependencies

## 25.1.0

### Minor Changes

- [`cfd20c34074`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfd20c34074) - Add ability to run mobile VR tests

## 25.0.0

### Major Changes

- [`709a28ee803`](https://bitbucket.org/atlassian/atlassian-frontend/commits/709a28ee803) - Add setContentPayload / resolvePromisePayload methods to speed up native to bridge data transportation by fetching the json payload from a predefined url.
- [`3d81784c978`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3d81784c978) - ED-12005 Added API to check if ADF is empty or only has whitespace

### Minor Changes

- [`f89a714e454`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f89a714e454) - ED-11940 remove unused query params - Locale and Enable-Quick-Insert for the editor
- [`b0e8a310624`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0e8a310624) - Remove background-color from renderer and editor html templates. This to fix an issue with page flashing when in dark mode.
- [`5142c23bfea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5142c23bfea) - [ED-11864] Add allowIndentation to TRUE for mobile editor

### Patch Changes

- [`afa1378d22e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/afa1378d22e) - Remove unsused query-param methods which are transitioned to Renderer Configurations
- Updated dependencies

## 24.0.5

### Patch Changes

- Updated dependencies

## 24.0.4

### Patch Changes

- Updated dependencies

## 24.0.3

### Patch Changes

- Updated dependencies

## 24.0.2

### Patch Changes

- Updated dependencies

## 24.0.1

### Patch Changes

- Updated dependencies

## 24.0.0

### Major Changes

- [`43f44a3fb3e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/43f44a3fb3e) - [ED-11244] Change Bridge API - configureEditor to configure

### Minor Changes

- [`b4acdadd949`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4acdadd949) - [ED-11244] Use locale from renderer bridge configuration
- [`3f428e4b778`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f428e4b778) - [ME-769] Fix codeblock language change for mobile when used in adaptive toolbar
- [`a3cf6026e33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a3cf6026e33) - [ME-303](https://product-fabric.atlassian.net/browse/ME-303) Enable expand to be inserted in mobile
- [`b552334459c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b552334459c) - [ME-302](https://product-fabric.atlassian.net/browse/ME-302) Introduce table cell options in the floating toolbar for mobile.

  By default table cell options are disabled and hidden for the web.

- [`e06b893e288`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e06b893e288) - [ED-11470] - Adding automation tests to validate Block and inline node lozenges and tooltips
- [`67fd55dd3f1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/67fd55dd3f1) - ME-893 Added a new mobile editor configuration for placeholder text
- [`4d65f8a67f4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d65f8a67f4) - [ED-11699] Persist scroll gutter for mobile COMPACT appearance and change mobile scroll gutter to 50px
- [`84e096e6ac9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/84e096e6ac9) - ME-304 Enabled some editing capabilities for adaptive toolbar in mobile

### Patch Changes

- [`32613148067`](https://bitbucket.org/atlassian/atlassian-frontend/commits/32613148067) - Move DisableActions, DisableMediaLinking, allowAnnotaions, allowHeadingAnchorLinks feature flags from query param to rendererConfiguration
- Updated dependencies

## 23.0.2

### Patch Changes

- [`d361f290d63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d361f290d63) - NO-ISSUE avoid bundling test data for development
- Updated dependencies

## 23.0.1

### Patch Changes

- Updated dependencies

## 23.0.0

### Major Changes

- [`658184c615`](https://bitbucket.org/atlassian/atlassian-frontend/commits/658184c615) - [ED-11630] Removes the usage of Query Parameter for Predictable List and Makes the Predictable List reconfigurable via the bridge.configureEditor method. All the clients setting allowPredictableList from query parameter should use bridge.configureEditor and pass in the allowPredictableList flag.
  Example: bridge.configureEditor("{\"allowPredictableList\": true}")

### Minor Changes

- [`2fe88ab389`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2fe88ab389) - [ED-11642] Remove "window.resize" listner and "ClickArea" for compact editor. Include padding calculation in onRenderedContentHeightChanged.
- [`7d8f1facfc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d8f1facfc) - [ME-300](https://product-fabric.atlassian.net/browse/ME-300) Introduced a toolbarBridge to support data-driven editing capabilities.

  By default, implementation is not required and native side won't be impacted. Once the implementation is done
  on the native side, this will work out of the box. Data-driven approach listens the floating toolbar state
  changes and relay the editing capabilities to the native side. Native mobile displays these capabilities with
  the native widgets in the main toolbar. Once the user performs an action, responsibility of the execution is
  delegated to the editor-core which is the shared components across all platforms. Native mobile doesn't know
  about the details of how to perform an action.

- [`2181a4c181`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2181a4c181) - ED-11468 - 1. Introduced new folder structure with POM and fragments. 2. Added tests for validating quick insert related features.
- [`92bf38166c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/92bf38166c) - [ED-11634] Removes the usage of Query Parameter for editorType and renames it to editorAppearance. editorAppearance is now reconfigurable via the bridge.configureEditor method.
  All the clients setting editorType from query parameter should use bridge.configureEditor and pass in the editorAppearance flag with either 'compact' or 'full'(Default).
  Example: bridge.configureEditor("{\"editorAppearance\": \"compact\"}")

### Patch Changes

- [`7a66ee7c88`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a66ee7c88) - Add url params support for captions in mobile bridge
- [`9da08b115a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9da08b115a) - Revert fix for TWISTA-638
- Updated dependencies

## 22.0.3

### Patch Changes

- Updated dependencies

## 22.0.2

### Patch Changes

- Updated dependencies

## 22.0.1

### Patch Changes

- Updated dependencies

## 22.0.0

### Major Changes

- [`4ec622ea6a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ec622ea6a) - ED-10856 - Added `configure` bridge method to change the Renderer Configurations.
  Mobile Clients need to use `configre` bridge method to set
  `disableMediaLinking`, `allowHeadingAnchorLinks`, `allowAnnotations`, `disableActions`
  and remove them from query params while initial load of the renderer.

### Minor Changes

- [`c6cf6c1520`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6cf6c1520) - [ED-11472][renderer] Introduce onContentRendered performance event in mobile content bridge
- [`22c89bff23`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22c89bff23) - [ED-11493][twista-405] Add predictable list at the mobile bridge plugin subscription
- [`385e3de61b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/385e3de61b) - Remove the scroll gutter for compact mobile editor.
- [`130e6adc9c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/130e6adc9c) - ED-11241 Moves `enableQuickInsert` and `allowPredictableList` feature flags into MobileEditorConfiguration.
  Mobile Clients needs to use `configureEditor` bridge method to set `enableQuickInsert` and `allowPredictableList` and remove usage of these parameters from query params while initial load of the editor.

  Changes on mobile(android/IOS) which are addressed as part of different stories.

  - Passing of Feature Flags, mode and locale using Query Params is broken in Hybrid Editor because of `unpkg`, which is used to load other versions of bridge other than the bundled bridge.

- [`0fcc95cce9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0fcc95cce9) - Enabled performance tracking prop for mobile editor. Only typing performance is enabled at this stage.
- [`db36b264ca`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db36b264ca) - [ED-11242][editor] Fix broken feature flags for locale

### Patch Changes

- Updated dependencies

## 21.1.0

### Minor Changes

- [`622ae0dc66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/622ae0dc66) - [ux] added macros and dark theme support with query params configuration
- [`9d91ea2859`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d91ea2859) - ED-11455 Enable useSpecvalidator flag for hybrid renderer
- [`2d80d6e283`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d80d6e283) - [ED-11464][editor] Introduce onContentRendered method in content bridge. It is called when content is rendered which is set by bridge.setContent

### Patch Changes

- Updated dependencies

## 21.0.2

### Patch Changes

- [`b8cf033738`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8cf033738) - Bumped react-dev-server to fix DoS issue

## 21.0.1

### Patch Changes

- Updated dependencies

## 21.0.0

### Major Changes

- [`e984b12c67`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e984b12c67) - ED-10835 - Added new `configureEditor` bridge method to change the Editorsettings. Mobile Clients needs to use `configureEditor` bridge method to set `mode` and remove `mode` parameter usage from query params while initial load of the editor.
  Relevant changes on mobile should be completed as part of below stories.
  ED-11271 https://product-fabric.atlassian.net/browse/ED-11271
  ED-11270 https://product-fabric.atlassian.net/browse/ED-11270

### Minor Changes

- [`da77198e43`](https://bitbucket.org/atlassian/atlassian-frontend/commits/da77198e43) - Rename title:changed to metadata:changed in collab provider, editor common and mobile bridge

### Patch Changes

- Updated dependencies

## 20.2.2

### Patch Changes

- Updated dependencies

## 20.2.1

### Patch Changes

- [`fe84dc9b3a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe84dc9b3a) - - Add first editor media mobile test
  - Created a new webpack config to build the test bundle so we can run mobile integration tests. Now we have:
    - webpack.config.js
    - webpack.test.config.js
    - build/webpack_base_config.js

## 20.2.0

### Minor Changes

- [`b1a610f36e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1a610f36e) - ED-11214 Fix quick insert translations on mobile bridge

## 20.1.2

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc
- Updated dependencies

## 20.1.1

### Patch Changes

- Updated dependencies

## 20.1.0

### Minor Changes

- [`277c2d52d3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/277c2d52d3) - [ux] ED-10815 Enable localization in hybrid renderer
- [`474b09e4c0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/474b09e4c0) - COLLAB-11 steps rejected error handler
- [`28e97db5a7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/28e97db5a7) - TWISTA-407 Expose the Confluence index match API to native. On applying draft mode, the bridge will call `annotationIndexMatch` with the `numMatch`, `matchIndex`, `originalSelection` tuple that is required by Confluence.

### Patch Changes

- Updated dependencies

## 20.0.2

### Patch Changes

- Updated dependencies

## 20.0.1

### Patch Changes

- Updated dependencies

## 20.0.0

### Major Changes

- [`f73b500ffa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f73b500ffa) - ED-10681 API for dismiss typeahead

### Minor Changes

- [`491b3ce869`](https://bitbucket.org/atlassian/atlassian-frontend/commits/491b3ce869) - ED-10672 Add a feature flag for the predictable lists in mobile-bridge
- [`e3b2251f29`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3b2251f29) - Breaking change for collab provider as userId has been removed from constructor. Mobile bridge and editor demo app require an upgrade too

### Patch Changes

- [`703752d487`](https://bitbucket.org/atlassian/atlassian-frontend/commits/703752d487) - ED-10647 Remove caret from prosemirror-model, prosemirror-keymap, prosemirror-state, prosemirror-transform to lock them down to an explicit version
- [`6dc9db6e15`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dc9db6e15) - TWISTA-438 Fix bug where PageTitle bridge was not been enabled
- Updated dependencies

## 19.1.2

### Patch Changes

- Updated dependencies

## 19.1.1

### Patch Changes

- Updated dependencies

## 19.1.0

### Minor Changes

- [`7056ac94b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7056ac94b0) - TWISTA-4 Enabling I18N on mobile editor
- [`8c13867014`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c13867014) - TWISTA-438 Add new PageTitle bridge. This bridge will serve as a middle ware between collab provider and native side.

### Patch Changes

- [`56fe4bb199`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56fe4bb199) - TWISTA-367 Add new method for annotation bounding rect for mobile bridge renderer
- Updated dependencies

## 19.0.15

### Patch Changes

- Updated dependencies

## 19.0.14

### Patch Changes

- [`a2092945b1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2092945b1) - [ux] ED-10813 Disable heading link buttons (copy link to clipboard) on mobile.

  Nested header links is enabled using the `allowHeadingAnchorLinks` editor prop. This prop is overloaded because it also opts into using the new UI/UX for the copy link button.

  On mobile this is controled via a url query string `?allowHeadingAnchorLinks=true` which maps to the matching editor prop.

  > This feature is only used by Confluence.

  Previous mobile releases had heading anchor links disabled because the ability to scroll to a heading wasn't coupled to displaying the copy link button.

  Unfortunately it's now linked, but the copy link button UX isn't fully functional on mobile yet.

  This change hides the copy link button on mobile to effectively decouple the features despite sharing the same feature flag.

## 19.0.13

### Patch Changes

- Updated dependencies

## 19.0.12

### Patch Changes

- Updated dependencies

## 19.0.11

### Patch Changes

- Updated dependencies

## 19.0.10

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.
- Updated dependencies

## 19.0.9

### Patch Changes

- Updated dependencies

## 19.0.8

### Patch Changes

- [`f990181fb2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f990181fb2) - TWISTA-430 Add debounce to webview page resize to prevent renderer sometimes being cut off

## 19.0.7

### Patch Changes

- Updated dependencies

## 19.0.6

### Patch Changes

- [`9a055964a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a055964a3) - ED-10628 Re-enable single click selection on mobile

  Long press selection is temporarily blocked, so we will re-enable single click selection for now

- Updated dependencies

## 19.0.5

### Patch Changes

- Updated dependencies

## 19.0.4

### Patch Changes

- Updated dependencies

## 19.0.3

### Patch Changes

- [`295377267b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/295377267b) - TWISTA-434 Fix bridge not being called correctly

## 19.0.2

### Patch Changes

- Updated dependencies

## 19.0.1

### Patch Changes

- Updated dependencies

## 19.0.0

### Major Changes

- [`225c901919`](https://bitbucket.org/atlassian/atlassian-frontend/commits/225c901919) - ED-10351 add API to delete the annotation
- [`9a39500244`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a39500244) - Bump ProseMirror packages

  Read more: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1671956531/2020-08

### Minor Changes

- [`8fec06060e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8fec06060e) - ED-10350 add delete annotation api in editor mobile bridge
- [`9ce8981d27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9ce8981d27) - TWISTA-322 Add startWebBundle and editorError lifecycle events to mobile bridge
- [`21b56a787d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/21b56a787d) - ED-10475 Throttling change event on mobile editor

### Patch Changes

- [`2d4bbe5e2e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d4bbe5e2e) - [ED-10503] Fix prosemirror-view version at 1.15.4 without carret
- [`5d7d34025a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d7d34025a) - TWISTA-413 Change editorError lifecycle event to send string error messages to match Android compatibility
- [`c90f346430`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c90f346430) - Remove @ts-ignores/@ts-expect-errors
- [`ea22cf8a31`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea22cf8a31) - TWISTA-376 Provide node and mark details on mobile selection plugin
- Updated dependencies

## 18.0.4

### Patch Changes

- Updated dependencies

## 18.0.3

### Patch Changes

- Updated dependencies

## 18.0.2

### Patch Changes

- Updated dependencies

## 18.0.1

### Patch Changes

- Updated dependencies

## 18.0.0

### Major Changes

- [`c8cf7f9419`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8cf7f9419) - ED-9623:

  This piece of work includes:

  - Adopting the api changes on `Renderer` to be able to open an expand that wraps a header that the user want to scroll to. This will change the bridge methods in order to have the expand opened beforehand:

    - `getContentNodeScrollOffset` -> Api is unchanged, but if the header is inside an expand, it will open the expand asynchronously.
    - **BREAKING CHANGE**: `scrollToContentNode` -> will return `void` instead of a boolean value as before, and if the header is inside an expand, it will scroll to the header once the expand is opened in such case.

  - Creating a query param `allowHeadingAnchorLinks` to enable/disable the entire feature on `Renderer`:
    - `allowHeadingAnchorLinks=false` -> will disable everything regarding headings
    - `allowHeadingAnchorLinks=true` -> will enable new nested header behaviour but the UI will not be enabled for mobile (see point bellow)
  - Disable UI for `mobile`/`comment` appearance: we need to enable the new expand behaviour but we don’t want to render the copy link button on those appearances.

### Minor Changes

- [`39985e61d0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/39985e61d0) - TYPH-236 Add new Lifecycle Bridge for the Renderer
- [`0100b2c907`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0100b2c907) - [TWISTA-157] changed the reflow detector to use resize observer if available and also refactored where this API lives as it was in the wrong place.

### Patch Changes

- [`dbfbe282e5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dbfbe282e5) - ED-10248 fixed renderer content being cut off in the bottom when using resize observer
- [`bef7ead91b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bef7ead91b) - TWISTA-357 fixed renderer not displayed in full height on iOS below 13.4
- [`78de49291b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78de49291b) - [TWISTA-130] Fixes Annotation onClick sending only one Annotation id
- [`fba7eda75d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fba7eda75d) - [TWISTA-344] Fixes remove annotation focus on Renderer
- Updated dependencies

## 17.1.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

- Updated dependencies

## 17.1.1

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release
- Updated dependencies

## 17.1.0

### Minor Changes

- [`41596c1581`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41596c1581) - EDM-925: fix cmd + k behaviour of Smart Links; respect user's display text
- [`564cdfc7e1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/564cdfc7e1) - TYPH-236 Adding lifecycle bridge to editor
- [`a93d423be6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a93d423be6) - [TWISTA-218] Implements the Mobile Bridge API methods to works with Inline Comments on Renderer
  [TWISTA-146] Remove previous annotation highlight before focus in another one

### Patch Changes

- [`4a1120b6a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a1120b6a8) - Fix quickInsert on mobile:

  - Fixed missing options on quickInsertPlugin + added tests
  - Mock `formatMessage` on Editor component on mobile bridge, to be able to not depend on i18n for now, and unblock native side work

- [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the 'lodash' package instead of single-function 'lodash.\*' packages
- [`3273454e19`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3273454e19) - TYPH-236 Refactor mobile bridge integration into Hooks
- [`bd1b6db96a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bd1b6db96a) - ED-9651: Pass intl to plugin constructors
- [`aa8db6bc1a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa8db6bc1a) - TYPH-236 Refactor annotations into hooks and some fixes related to rules of hooks
- Updated dependencies

## 17.0.4

### Patch Changes

- Updated dependencies

## 17.0.3

### Patch Changes

- Updated dependencies

## 17.0.2

### Patch Changes

- Updated dependencies

## 17.0.1

### Patch Changes

- Updated dependencies

## 17.0.0

### Major Changes

- [`f378057777`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f378057777) - [FM-2967] height too big on hybrid editor on mobile view

### Minor Changes

- [`c435b74d88`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c435b74d88) - [FM-3825] new bridge methods added to enable change of quick insert whitelist

  ***

  getQuickInsertAllowList(): string {}

  returns a JSON string array with current allowed list

  ***

  setQuickInsertAllowList(newList: string): void {}

  accepts a JSON string array "['item1', 'item2']"

  will overwrite the current allowlist

  ***

  addQuickInsertAllowListItem(listItems: string): void {}

  accepts a JSON string array "['item1', 'item2']"

  will add to current allow list

  ***

  removeQuickInsertAllowListItem(listItems: string): void {}

  accepts a JSON string array "['item1', 'item2']"

  will remove from the current allow list

### Patch Changes

- [`6dae48e3b7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dae48e3b7) - TWISTA-4 Refactor mobile editor to prevent unnecesary renders after an update happens
- [`df4f83320d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df4f83320d) - TWISTA-4 Replace EditorState for respective props in Editor
- Updated dependencies

## 16.0.3

### Patch Changes

- Updated dependencies

## 16.0.2

### Patch Changes

- Updated dependencies

## 16.0.1

### Patch Changes

- [`6ced984cdc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ced984cdc) - TWISTA-248 Fix bug where emoji were not ben loaded on iOS

## 16.0.0

### Patch Changes

- Updated dependencies

## 15.1.2

### Patch Changes

- Updated dependencies

## 15.1.1

### Patch Changes

- Updated dependencies

## 15.1.0

### Minor Changes

- [`2725c8ba93`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2725c8ba93) - ED-9451 Pass lifecycle event emitter to colalb provider
- [`cbf6bfb3cb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cbf6bfb3cb) - ED-9367 Implement bridge integration to new collab service
- [`4921566a4e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4921566a4e) - [FM-3943] change tsx compiler options in webpack config to support older browsers
- [`df5ac71588`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df5ac71588) - ED-9451 Create and pass Native Storage into collab provider
- [`a4948958c4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4948958c4) - [FM-3820] Implements to set annotation state event on Renderer
- [`a602a1a359`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a602a1a359) - [FM-3814] Enables the mobile bridge to add two new blocks items: divider and expand
- [`ea81ff42a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea81ff42a0) - [FM-3819] Implements a subscriber API to allows set focus in an specific annotation

### Patch Changes

- [`29fa2d4985`](https://bitbucket.org/atlassian/atlassian-frontend/commits/29fa2d4985) - Improve global types for editor mobile bridge. Minor refactoring of sendToBridge method to utilise updated types. There shouldn't be any functional change.
- [`7524d31817`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7524d31817) - ED-9367 Prevent from emitting an event with invalid payload
- Updated dependencies

## 15.0.1

### Patch Changes

- Updated dependencies

## 15.0.0

### Major Changes

- [`c3d0c7ab9e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3d0c7ab9e) - [FM-3823] Modify onAnnotationClick on AnnotationBridge to support multiple types

  Breaking change:

  Before

  ```
  const annotationClickPayload = {
    annotationIds: ['AnnotationId'],
    annotationType: AnnotationTypes.INLINE_COMENT,
  }

  sendToBridge('annotationBridge', 'onAnnotationClick', {
    payload: JSON.stringify(annotationClickPayload),
  });

  ```

  After

  ```
  const annotationPayloadsByType = [
    {
      annotationIds: ['AnnotationId'],
      annotationType: AnnotationTypes.INLINE_COMENT,
    },
    {
      annotationIds: ['AnnotationId'],
      annotationType: AnnotationTypes.ANY_FUTURE_TYPE,
    },
  ]

  sendToBridge('annotationBridge', 'onAnnotationClick', {
    payload: JSON.stringify(annotationPayloadsByType),
  });

  ```

- [`ab56d26400`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ab56d26400) - [FM-2506] added query param for cusor position plugin

### Minor Changes

- [`fb1a9c8009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb1a9c8009) - [FM-3726] Call onAnnotationClick when user taps in inline comment on Renderer

### Patch Changes

- [`50616efe51`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50616efe51) - FM-3957 Prevent FetchProxy from mock android fetch requests
- [`10d143b2df`](https://bitbucket.org/atlassian/atlassian-frontend/commits/10d143b2df) - ED-9367 Refactor fetch mock to use a generic FetchProxy
- [`095d365eb2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/095d365eb2) - Allow Embeds and Blocks in the Mobile Editor
- [`07d3b6667d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07d3b6667d) - [FM-3865] Fix: Starts to listen the setContent event before the react component be mounted
- Updated dependencies

## 14.1.5

### Patch Changes

- Updated dependencies

## 14.1.4

### Patch Changes

- Updated dependencies

## 14.1.3

### Patch Changes

- Updated dependencies

## 14.1.2

### Patch Changes

- Updated dependencies

## 14.1.1

### Patch Changes

- Updated dependencies

## 14.1.0

### Minor Changes

- [`d425f7f6c7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d425f7f6c7) - [TYPH-113] fix webpack config for tsx for older browser

### Patch Changes

- Updated dependencies

## 14.0.3

### Patch Changes

- Updated dependencies

## 14.0.2

### Patch Changes

- [`a5815adf37`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5815adf37) - Fixed es2019 distributable missing a version.json file

## 14.0.1

### Patch Changes

- Updated dependencies

## 14.0.0

### Major Changes

- [`76160b5c71`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76160b5c71) - [FM-2506] added cursor selection location plugin
- [`e30894b112`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e30894b112) - [FM-3716] First Inline Comments implementation for Renderer
- [`3fdfbc0db1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fdfbc0db1) - [FM-3678] Enable Renderer Inline Comments on mobile bridge
- [`319fc073ae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/319fc073ae) - [FM-3670] placeholder text showing in editor
- [`28df29aa39`](https://bitbucket.org/atlassian/atlassian-frontend/commits/28df29aa39) - [FM-3579] shadow on table in editor not aligned correctly

### Minor Changes

- [`0964848b95`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0964848b95) - [FM-3505] Add support for inline comments in the renderer mobile bridge getElementScrollOffsetByNodeType function

### Patch Changes

- [`e513ce3d8b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e513ce3d8b) - ED-9179: Enable missing providers for archv3 mobile bridge
- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove unused dependencies
- Updated dependencies

## 13.0.6

### Patch Changes

- Updated dependencies

## 13.0.5

### Patch Changes

- Updated dependencies

## 13.0.4

### Patch Changes

- [`0ea959ff19`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ea959ff19) - Disable mobile bridge translations (not currently in use) to fix editor focus problem

## 13.0.3

### Patch Changes

- Updated dependencies

## 13.0.2

### Patch Changes

- Updated dependencies

## 13.0.1

### Patch Changes

- Updated dependencies

## 13.0.0

### Major Changes

- [`f64040d049`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f64040d049) - FM-3657 Disable zooming in Hybrid Renderer

### Minor Changes

- [`e7f20b8b8f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7f20b8b8f) - Adding support for `locale` provided through query params and loading proper translations in hybrid editor- [`02a2790b28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/02a2790b28) - Introduce new `getElementScrollOffset` method that supports heading and returns x/y offset coordinates as a string.
  Old method `getElementScrollOffsetY` is now deprecated.

### Patch Changes

- Updated dependencies

## 12.2.0

### Minor Changes

- [minor][7e4d4a7ed4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e4d4a7ed4):

  Adding `insertMentionQuery` and `insertEmojiQuery` for mobile to dispatch typeahead menus from native toolbar- [minor][c8d0ce5b94](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8d0ce5b94):

  FM-3537: Whitelist quick insert items on bridge- [minor][2ea981c813](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ea981c813):

  Adding `disableActions` query param to be used to disable actions all together on renderer

### Patch Changes

- [patch][b6a2e6a389](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6a2e6a389):

  ED-9035 Add disableMediaLinking query param for mobile bridge- Updated dependencies [7e4d4a7ed4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e4d4a7ed4):

- Updated dependencies [3b776be426](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b776be426):
- Updated dependencies [999fbf849e](https://bitbucket.org/atlassian/atlassian-frontend/commits/999fbf849e):
- Updated dependencies [b202858f6c](https://bitbucket.org/atlassian/atlassian-frontend/commits/b202858f6c):
- Updated dependencies [9cee2b03e8](https://bitbucket.org/atlassian/atlassian-frontend/commits/9cee2b03e8):
- Updated dependencies [26de083801](https://bitbucket.org/atlassian/atlassian-frontend/commits/26de083801):
- Updated dependencies [d3cc97a424](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3cc97a424):
- Updated dependencies [00f64f4eb8](https://bitbucket.org/atlassian/atlassian-frontend/commits/00f64f4eb8):
- Updated dependencies [4f70380793](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f70380793):
- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [d6eb7bb49f](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6eb7bb49f):
- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [5b301bcdf6](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b301bcdf6):
- Updated dependencies [729a4e4960](https://bitbucket.org/atlassian/atlassian-frontend/commits/729a4e4960):
- Updated dependencies [22704db5a3](https://bitbucket.org/atlassian/atlassian-frontend/commits/22704db5a3):
- Updated dependencies [acc12dba75](https://bitbucket.org/atlassian/atlassian-frontend/commits/acc12dba75):
- Updated dependencies [1156536403](https://bitbucket.org/atlassian/atlassian-frontend/commits/1156536403):
- Updated dependencies [5f075c4fd2](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f075c4fd2):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [c8d0ce5b94](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8d0ce5b94):
- Updated dependencies [384791fb2b](https://bitbucket.org/atlassian/atlassian-frontend/commits/384791fb2b):
- Updated dependencies [6efb12e06d](https://bitbucket.org/atlassian/atlassian-frontend/commits/6efb12e06d):
- Updated dependencies [0059d26429](https://bitbucket.org/atlassian/atlassian-frontend/commits/0059d26429):
- Updated dependencies [c6b145978b](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6b145978b):
- Updated dependencies [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
- Updated dependencies [736507f8e0](https://bitbucket.org/atlassian/atlassian-frontend/commits/736507f8e0):
- Updated dependencies [cf41823165](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf41823165):
- Updated dependencies [9e3646b59e](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e3646b59e):
- Updated dependencies [aec7fbadcc](https://bitbucket.org/atlassian/atlassian-frontend/commits/aec7fbadcc):
- Updated dependencies [e477132440](https://bitbucket.org/atlassian/atlassian-frontend/commits/e477132440):
  - @atlaskit/editor-core@122.0.0
  - @atlaskit/smart-card@13.2.0
  - @atlaskit/editor-common@45.1.0
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/select@11.0.10
  - @atlaskit/adf-utils@9.2.0
  - @atlaskit/renderer@58.0.0
  - @atlaskit/form@7.2.1
  - @atlaskit/webdriver-runner@0.3.4
  - @atlaskit/task-decision@16.0.11
  - @atlaskit/editor-json-transformer@7.0.11
  - @atlaskit/editor-test-helpers@11.1.1

## 12.1.1

### Patch Changes

- [patch][66c5bd52fb](https://bitbucket.org/atlassian/atlassian-frontend/commits/66c5bd52fb):

  EDM-597: fix block cards disappearing on mobile

## 12.1.0

### Minor Changes

- [minor][3644fc1afe](https://bitbucket.org/atlassian/atlassian-frontend/commits/3644fc1afe):

  Enable slash command on editor-mobile-bridge:

  - All changes under `enableQuickInsert` flag consumed from query parameters.
  - This PR introduces basic changes in order to test, _THIS IS NOT PRODUCTION READY!_
  - All quick insert items present under `/` command on web, will be sent to native. Following up with this PR we will implement an opt in approach to define which items will be enabled on mobile only.

### Patch Changes

- Updated dependencies [17cc5dde5d](https://bitbucket.org/atlassian/atlassian-frontend/commits/17cc5dde5d):
- Updated dependencies [2a87a3bbc5](https://bitbucket.org/atlassian/atlassian-frontend/commits/2a87a3bbc5):
- Updated dependencies [6a6a991904](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a6a991904):
- Updated dependencies [9b2570e7f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b2570e7f1):
- Updated dependencies [04e54bf405](https://bitbucket.org/atlassian/atlassian-frontend/commits/04e54bf405):
- Updated dependencies [af10890541](https://bitbucket.org/atlassian/atlassian-frontend/commits/af10890541):
- Updated dependencies [cf7a2d7506](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf7a2d7506):
- Updated dependencies [759f0a5ca7](https://bitbucket.org/atlassian/atlassian-frontend/commits/759f0a5ca7):
- Updated dependencies [84f82f7015](https://bitbucket.org/atlassian/atlassian-frontend/commits/84f82f7015):
- Updated dependencies [c74cc954d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/c74cc954d8):
- Updated dependencies [b4326a7eba](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4326a7eba):
- Updated dependencies [6641c9c5b5](https://bitbucket.org/atlassian/atlassian-frontend/commits/6641c9c5b5):
- Updated dependencies [a81ce649c8](https://bitbucket.org/atlassian/atlassian-frontend/commits/a81ce649c8):
- Updated dependencies [e4076915c8](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4076915c8):
- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
- Updated dependencies [bdb4da1fc0](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdb4da1fc0):
- Updated dependencies [c51f0b4c70](https://bitbucket.org/atlassian/atlassian-frontend/commits/c51f0b4c70):
- Updated dependencies [16c193eb3e](https://bitbucket.org/atlassian/atlassian-frontend/commits/16c193eb3e):
- Updated dependencies [7ec160c0e2](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ec160c0e2):
- Updated dependencies [f061ed6c98](https://bitbucket.org/atlassian/atlassian-frontend/commits/f061ed6c98):
- Updated dependencies [4070d17415](https://bitbucket.org/atlassian/atlassian-frontend/commits/4070d17415):
- Updated dependencies [f5dcc0bc6a](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5dcc0bc6a):
- Updated dependencies [5d430f7d37](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d430f7d37):
- Updated dependencies [7e26fba915](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e26fba915):
- Updated dependencies [49dbcfa64c](https://bitbucket.org/atlassian/atlassian-frontend/commits/49dbcfa64c):
- Updated dependencies [e9d555132d](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9d555132d):
- Updated dependencies [5167f09a83](https://bitbucket.org/atlassian/atlassian-frontend/commits/5167f09a83):
- Updated dependencies [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies [91ff8d36f0](https://bitbucket.org/atlassian/atlassian-frontend/commits/91ff8d36f0):
- Updated dependencies [05539b052e](https://bitbucket.org/atlassian/atlassian-frontend/commits/05539b052e):
- Updated dependencies [a1ee397cbc](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1ee397cbc):
- Updated dependencies [5f8e3caf72](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f8e3caf72):
- Updated dependencies [dc84dfa3bc](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc84dfa3bc):
- Updated dependencies [318a1a0f2f](https://bitbucket.org/atlassian/atlassian-frontend/commits/318a1a0f2f):
- Updated dependencies [550c4b5018](https://bitbucket.org/atlassian/atlassian-frontend/commits/550c4b5018):
- Updated dependencies [9691bb8eb9](https://bitbucket.org/atlassian/atlassian-frontend/commits/9691bb8eb9):
- Updated dependencies [11ff95c0f0](https://bitbucket.org/atlassian/atlassian-frontend/commits/11ff95c0f0):
- Updated dependencies [03a83cb954](https://bitbucket.org/atlassian/atlassian-frontend/commits/03a83cb954):
- Updated dependencies [ae426d5e97](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae426d5e97):
- Updated dependencies [e21800fd1c](https://bitbucket.org/atlassian/atlassian-frontend/commits/e21800fd1c):
- Updated dependencies [692692ba24](https://bitbucket.org/atlassian/atlassian-frontend/commits/692692ba24):
- Updated dependencies [258a36b51f](https://bitbucket.org/atlassian/atlassian-frontend/commits/258a36b51f):
- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies [205b05851a](https://bitbucket.org/atlassian/atlassian-frontend/commits/205b05851a):
- Updated dependencies [1a48183584](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a48183584):
- Updated dependencies [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies [823d80f31c](https://bitbucket.org/atlassian/atlassian-frontend/commits/823d80f31c):
- Updated dependencies [41917f4c16](https://bitbucket.org/atlassian/atlassian-frontend/commits/41917f4c16):
- Updated dependencies [69b678b38c](https://bitbucket.org/atlassian/atlassian-frontend/commits/69b678b38c):
- Updated dependencies [de6548dae5](https://bitbucket.org/atlassian/atlassian-frontend/commits/de6548dae5):
- Updated dependencies [9dd4b9088b](https://bitbucket.org/atlassian/atlassian-frontend/commits/9dd4b9088b):
- Updated dependencies [0b22d3b9ea](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b22d3b9ea):
- Updated dependencies [fd782b0705](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd782b0705):
- Updated dependencies [91304da441](https://bitbucket.org/atlassian/atlassian-frontend/commits/91304da441):
- Updated dependencies [b4ef7fe214](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4ef7fe214):
- Updated dependencies [d80b8e8fdb](https://bitbucket.org/atlassian/atlassian-frontend/commits/d80b8e8fdb):
- Updated dependencies [3644fc1afe](https://bitbucket.org/atlassian/atlassian-frontend/commits/3644fc1afe):
- Updated dependencies [b2402fc3a2](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2402fc3a2):
- Updated dependencies [971df84f45](https://bitbucket.org/atlassian/atlassian-frontend/commits/971df84f45):
- Updated dependencies [ba8c2c4129](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba8c2c4129):
- Updated dependencies [17a46dd016](https://bitbucket.org/atlassian/atlassian-frontend/commits/17a46dd016):
- Updated dependencies [0ab75c545b](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ab75c545b):
- Updated dependencies [62f1f218d9](https://bitbucket.org/atlassian/atlassian-frontend/commits/62f1f218d9):
- Updated dependencies [67bc25bc3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/67bc25bc3f):
- Updated dependencies [0376c2f4fe](https://bitbucket.org/atlassian/atlassian-frontend/commits/0376c2f4fe):
- Updated dependencies [6eb8c0799f](https://bitbucket.org/atlassian/atlassian-frontend/commits/6eb8c0799f):
- Updated dependencies [5f75dd27c9](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f75dd27c9):
- Updated dependencies [f3587bae11](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3587bae11):
- Updated dependencies [8c8f0099d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c8f0099d8):
- Updated dependencies [287be84065](https://bitbucket.org/atlassian/atlassian-frontend/commits/287be84065):
- Updated dependencies [fb8725beac](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb8725beac):
- Updated dependencies [7e363d5aba](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e363d5aba):
  - @atlaskit/smart-card@13.1.0
  - @atlaskit/editor-core@121.0.0
  - @atlaskit/media-test-helpers@27.2.0
  - @atlaskit/adf-utils@9.1.0
  - @atlaskit/editor-common@45.0.0
  - @atlaskit/renderer@57.0.0
  - @atlaskit/docs@8.5.1
  - @atlaskit/emoji@62.7.2
  - @atlaskit/editor-test-helpers@11.1.0
  - @atlaskit/theme@9.5.3
  - @atlaskit/media-client@6.1.0
  - @atlaskit/analytics-listeners@6.3.0
  - @atlaskit/button@13.3.10
  - @atlaskit/textarea@2.2.7
  - @atlaskit/editor-json-transformer@7.0.10
  - @atlaskit/task-decision@16.0.10

## 12.0.3

### Patch Changes

- Updated dependencies [a93083ffe9](https://bitbucket.org/atlassian/atlassian-frontend/commits/a93083ffe9):
  - @atlaskit/editor-core@120.1.2

## 12.0.2

### Patch Changes

- Updated dependencies [78ef636956](https://bitbucket.org/atlassian/atlassian-frontend/commits/78ef636956):
  - @atlaskit/editor-core@120.1.1

## 12.0.1

### Patch Changes

- Updated dependencies [aa6805792a](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa6805792a):
  - @atlaskit/editor-core@120.1.0

## 12.0.0

### Minor Changes

- [minor][21a51d03d7](https://bitbucket.org/atlassian/atlassian-frontend/commits/21a51d03d7):

  Decouple renderer from editor-core package

### Patch Changes

- Updated dependencies [9fd8ba7707](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fd8ba7707):
- Updated dependencies [bc29fbc030](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc29fbc030):
- Updated dependencies [294c05bcdf](https://bitbucket.org/atlassian/atlassian-frontend/commits/294c05bcdf):
- Updated dependencies [7d80e44c09](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d80e44c09):
- Updated dependencies [4c691c3b5f](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c691c3b5f):
- Updated dependencies [d63513575b](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63513575b):
- Updated dependencies [eb962d2c36](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb962d2c36):
- Updated dependencies [48f0ecf23e](https://bitbucket.org/atlassian/atlassian-frontend/commits/48f0ecf23e):
- Updated dependencies [130b83ccba](https://bitbucket.org/atlassian/atlassian-frontend/commits/130b83ccba):
- Updated dependencies [5180a51c0d](https://bitbucket.org/atlassian/atlassian-frontend/commits/5180a51c0d):
- Updated dependencies [067febb0a7](https://bitbucket.org/atlassian/atlassian-frontend/commits/067febb0a7):
- Updated dependencies [66cf61863f](https://bitbucket.org/atlassian/atlassian-frontend/commits/66cf61863f):
- Updated dependencies [f83b67a761](https://bitbucket.org/atlassian/atlassian-frontend/commits/f83b67a761):
- Updated dependencies [22d9c96ed2](https://bitbucket.org/atlassian/atlassian-frontend/commits/22d9c96ed2):
- Updated dependencies [70b68943d1](https://bitbucket.org/atlassian/atlassian-frontend/commits/70b68943d1):
- Updated dependencies [a9e9604c8e](https://bitbucket.org/atlassian/atlassian-frontend/commits/a9e9604c8e):
- Updated dependencies [8126e7648c](https://bitbucket.org/atlassian/atlassian-frontend/commits/8126e7648c):
- Updated dependencies [b41beace3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/b41beace3f):
- Updated dependencies [02425bf2d7](https://bitbucket.org/atlassian/atlassian-frontend/commits/02425bf2d7):
- Updated dependencies [953cfadbe3](https://bitbucket.org/atlassian/atlassian-frontend/commits/953cfadbe3):
- Updated dependencies [29b0315dcb](https://bitbucket.org/atlassian/atlassian-frontend/commits/29b0315dcb):
- Updated dependencies [d49ebd7c7a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d49ebd7c7a):
- Updated dependencies [53ebcdb974](https://bitbucket.org/atlassian/atlassian-frontend/commits/53ebcdb974):
- Updated dependencies [4bec09aa74](https://bitbucket.org/atlassian/atlassian-frontend/commits/4bec09aa74):
- Updated dependencies [aa4dc7f5d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa4dc7f5d6):
- Updated dependencies [d63888b5e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63888b5e5):
- Updated dependencies [13a0e50f38](https://bitbucket.org/atlassian/atlassian-frontend/commits/13a0e50f38):
- Updated dependencies [0a0a54cb47](https://bitbucket.org/atlassian/atlassian-frontend/commits/0a0a54cb47):
- Updated dependencies [6dcad31e41](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dcad31e41):
- Updated dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
- Updated dependencies [bdf25b1c4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdf25b1c4c):
- Updated dependencies [3cbc8a49a2](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cbc8a49a2):
- Updated dependencies [6242ec17a2](https://bitbucket.org/atlassian/atlassian-frontend/commits/6242ec17a2):
- Updated dependencies [6b65ae4f04](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b65ae4f04):
- Updated dependencies [645918eda6](https://bitbucket.org/atlassian/atlassian-frontend/commits/645918eda6):
- Updated dependencies [fad8a16962](https://bitbucket.org/atlassian/atlassian-frontend/commits/fad8a16962):
- Updated dependencies [715572f9e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/715572f9e5):
- Updated dependencies [cc54ca2490](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc54ca2490):
  - @atlaskit/editor-core@120.0.0
  - @atlaskit/editor-common@44.1.0
  - @atlaskit/renderer@56.0.0
  - @atlaskit/form@7.2.0
  - @atlaskit/media-client@6.0.0
  - @atlaskit/emoji@62.7.1
  - @atlaskit/media-test-helpers@27.1.0
  - @atlaskit/mention@18.18.0
  - @atlaskit/editor-test-helpers@11.0.0
  - @atlaskit/media-core@31.1.0
  - @atlaskit/docs@8.5.0
  - @atlaskit/adf-utils@9.0.0
  - @atlaskit/editor-json-transformer@7.0.9
  - @atlaskit/status@0.9.23
  - @atlaskit/task-decision@16.0.9

## 11.3.2

### Patch Changes

- Updated dependencies [b367f19e51](https://bitbucket.org/atlassian/atlassian-frontend/commits/b367f19e51):
  - @atlaskit/editor-core@119.0.1

## 11.3.1

### Patch Changes

- Updated dependencies [1dd42d3002](https://bitbucket.org/atlassian/atlassian-frontend/commits/1dd42d3002):
  - @atlaskit/theme@9.5.2

## 11.3.0

### Minor Changes

- [minor][575bc3b816](https://bitbucket.org/atlassian/atlassian-frontend/commits/575bc3b816):

  ED-8010: Add archv3 bundle to editor-mobile-bridge

### Patch Changes

- [patch][e8a462b4a7](https://bitbucket.org/atlassian/atlassian-frontend/commits/e8a462b4a7):

  allowAltTextForImages prop enabled in mobile bridge for proper support- [patch][4b10e22042](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b10e22042):

  ED-8804: Remove unused code from editor-mobile-bridge bundle- Updated dependencies [b408e050ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/b408e050ab):

- Updated dependencies [bc380c30ce](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc380c30ce):
- Updated dependencies [cc0d9f6ede](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc0d9f6ede):
- Updated dependencies [6384746272](https://bitbucket.org/atlassian/atlassian-frontend/commits/6384746272):
- Updated dependencies [7602615cd4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7602615cd4):
- Updated dependencies [956a70b918](https://bitbucket.org/atlassian/atlassian-frontend/commits/956a70b918):
- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [3494940acd](https://bitbucket.org/atlassian/atlassian-frontend/commits/3494940acd):
- Updated dependencies [5bb23adac3](https://bitbucket.org/atlassian/atlassian-frontend/commits/5bb23adac3):
- Updated dependencies [ebee5c7429](https://bitbucket.org/atlassian/atlassian-frontend/commits/ebee5c7429):
- Updated dependencies [680a61dc5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/680a61dc5a):
- Updated dependencies [57096fc043](https://bitbucket.org/atlassian/atlassian-frontend/commits/57096fc043):
- Updated dependencies [b17120e768](https://bitbucket.org/atlassian/atlassian-frontend/commits/b17120e768):
- Updated dependencies [92e0b393f5](https://bitbucket.org/atlassian/atlassian-frontend/commits/92e0b393f5):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [ac8639dfd8](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac8639dfd8):
- Updated dependencies [2f0df19890](https://bitbucket.org/atlassian/atlassian-frontend/commits/2f0df19890):
- Updated dependencies [2475d1c9d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/2475d1c9d8):
- Updated dependencies [0732eedea7](https://bitbucket.org/atlassian/atlassian-frontend/commits/0732eedea7):
- Updated dependencies [113d075684](https://bitbucket.org/atlassian/atlassian-frontend/commits/113d075684):
- Updated dependencies [af8a3763dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/af8a3763dd):
- Updated dependencies [21a1faf014](https://bitbucket.org/atlassian/atlassian-frontend/commits/21a1faf014):
- Updated dependencies [94116c6018](https://bitbucket.org/atlassian/atlassian-frontend/commits/94116c6018):
- Updated dependencies [9fadef064b](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fadef064b):
- Updated dependencies [27fde59914](https://bitbucket.org/atlassian/atlassian-frontend/commits/27fde59914):
- Updated dependencies [f8ffc8320f](https://bitbucket.org/atlassian/atlassian-frontend/commits/f8ffc8320f):
- Updated dependencies [4695ac5697](https://bitbucket.org/atlassian/atlassian-frontend/commits/4695ac5697):
- Updated dependencies [96ee7441fe](https://bitbucket.org/atlassian/atlassian-frontend/commits/96ee7441fe):
- Updated dependencies [196500df34](https://bitbucket.org/atlassian/atlassian-frontend/commits/196500df34):
- Updated dependencies [64fb94fb1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/64fb94fb1e):
- Updated dependencies [469e9a2302](https://bitbucket.org/atlassian/atlassian-frontend/commits/469e9a2302):
- Updated dependencies [a41d2345eb](https://bitbucket.org/atlassian/atlassian-frontend/commits/a41d2345eb):
- Updated dependencies [4ef23b6a15](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ef23b6a15):
- Updated dependencies [d7ed7b1513](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7ed7b1513):
- Updated dependencies [41a2496393](https://bitbucket.org/atlassian/atlassian-frontend/commits/41a2496393):
- Updated dependencies [7baff84f38](https://bitbucket.org/atlassian/atlassian-frontend/commits/7baff84f38):
- Updated dependencies [8cc5cc0603](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc5cc0603):
- Updated dependencies [5d8a0d4f5f](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d8a0d4f5f):
- Updated dependencies [faa96cee2a](https://bitbucket.org/atlassian/atlassian-frontend/commits/faa96cee2a):
- Updated dependencies [535286e8c4](https://bitbucket.org/atlassian/atlassian-frontend/commits/535286e8c4):
- Updated dependencies [c7b205c83f](https://bitbucket.org/atlassian/atlassian-frontend/commits/c7b205c83f):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [703b72cdba](https://bitbucket.org/atlassian/atlassian-frontend/commits/703b72cdba):
- Updated dependencies [025842de1a](https://bitbucket.org/atlassian/atlassian-frontend/commits/025842de1a):
- Updated dependencies [bbf5eb8824](https://bitbucket.org/atlassian/atlassian-frontend/commits/bbf5eb8824):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [cd662c7e4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd662c7e4c):
- Updated dependencies [6b06a7baa9](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b06a7baa9):
- Updated dependencies [de64f9373c](https://bitbucket.org/atlassian/atlassian-frontend/commits/de64f9373c):
- Updated dependencies [93ac94a762](https://bitbucket.org/atlassian/atlassian-frontend/commits/93ac94a762):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [109c1a2c0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c1a2c0a):
- Updated dependencies [172a864d19](https://bitbucket.org/atlassian/atlassian-frontend/commits/172a864d19):
- Updated dependencies [c57bb32f6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/c57bb32f6d):
- Updated dependencies [6a417f2e52](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a417f2e52):
- Updated dependencies [8b34c7371d](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b34c7371d):
- Updated dependencies [5e3aab8e77](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e3aab8e77):
- Updated dependencies [fdf6c939e8](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdf6c939e8):
- Updated dependencies [395739b5ef](https://bitbucket.org/atlassian/atlassian-frontend/commits/395739b5ef):
- Updated dependencies [77474b6821](https://bitbucket.org/atlassian/atlassian-frontend/commits/77474b6821):
  - @atlaskit/media-client@5.0.2
  - @atlaskit/editor-common@44.0.2
  - @atlaskit/editor-core@119.0.0
  - @atlaskit/adf-utils@8.0.0
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/renderer@55.0.0
  - @atlaskit/mention@18.17.0
  - @atlaskit/util-data-test@13.1.2
  - @atlaskit/media-test-helpers@27.0.0
  - @atlaskit/webdriver-runner@0.3.0
  - @atlaskit/smart-card@13.0.0
  - @atlaskit/editor-test-helpers@10.6.1
  - @atlaskit/editor-json-transformer@7.0.8
  - @atlaskit/media-core@31.0.5
  - @atlaskit/button@13.3.9
  - @atlaskit/form@7.1.5
  - @atlaskit/select@11.0.9
  - @atlaskit/textarea@2.2.6
  - @atlaskit/textfield@3.1.9
  - @atlaskit/task-decision@16.0.8

## 11.2.2

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/button@13.3.8
  - @atlaskit/form@7.1.4
  - @atlaskit/select@11.0.8
  - @atlaskit/textarea@2.2.5
  - @atlaskit/textfield@3.1.8
  - @atlaskit/editor-common@44.0.1
  - @atlaskit/editor-core@118.0.1

## 11.2.1

### Patch Changes

- Updated dependencies [f196b7ce66](https://bitbucket.org/atlassian/atlassian-frontend/commits/f196b7ce66):
  - @atlaskit/renderer@54.0.1

## 11.2.0

### Minor Changes

- [minor][9d448fb488](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d448fb488):

  FM-2504 enable pinch to zoom in hybrid editor.- [minor][9d6b02c04f](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d6b02c04f):

  ED-8005 Use the new provider types directly from provider factory entry point in editor-common

### Patch Changes

- [patch][8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):

  Remove Karma tests - based on AFP-960- [patch][8f41931365](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f41931365):

  ED-8421: Add ARCHV3 example to mobile bridge- [patch][f67ddfd83c](https://bitbucket.org/atlassian/atlassian-frontend/commits/f67ddfd83c):

  ED-8666 fix: skip mediaNode updates for mobile appearance- [patch][f2c93ba4b5](https://bitbucket.org/atlassian/atlassian-frontend/commits/f2c93ba4b5):

  Pin internal atlaskit dependencies to specific versions so that any upgrades to those packages trigger a release of mobile-bridge- Updated dependencies [6403a54812](https://bitbucket.org/atlassian/atlassian-frontend/commits/6403a54812):

- Updated dependencies [9e90cb4336](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e90cb4336):
- Updated dependencies [f46330c0ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/f46330c0ab):
- Updated dependencies [d6f207a598](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f207a598):
- Updated dependencies [40359da294](https://bitbucket.org/atlassian/atlassian-frontend/commits/40359da294):
- Updated dependencies [eaad41d56c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eaad41d56c):
- Updated dependencies [151240fce9](https://bitbucket.org/atlassian/atlassian-frontend/commits/151240fce9):
- Updated dependencies [8d09cd0408](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d09cd0408):
- Updated dependencies [088f4f7d1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/088f4f7d1e):
- Updated dependencies [9d6b02c04f](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d6b02c04f):
- Updated dependencies [f709e92247](https://bitbucket.org/atlassian/atlassian-frontend/commits/f709e92247):
- Updated dependencies [8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):
- Updated dependencies [7aad7888b4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7aad7888b4):
- Updated dependencies [a1bc1e6637](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1bc1e6637):
- Updated dependencies [a5c3717d0b](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5c3717d0b):
- Updated dependencies [b924951169](https://bitbucket.org/atlassian/atlassian-frontend/commits/b924951169):
- Updated dependencies [37a79cb1bc](https://bitbucket.org/atlassian/atlassian-frontend/commits/37a79cb1bc):
- Updated dependencies [47d7b34f75](https://bitbucket.org/atlassian/atlassian-frontend/commits/47d7b34f75):
- Updated dependencies [c12ba5eb3e](https://bitbucket.org/atlassian/atlassian-frontend/commits/c12ba5eb3e):
- Updated dependencies [79cabaee0c](https://bitbucket.org/atlassian/atlassian-frontend/commits/79cabaee0c):
- Updated dependencies [5a0167db78](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a0167db78):
- Updated dependencies [ded54f7b9f](https://bitbucket.org/atlassian/atlassian-frontend/commits/ded54f7b9f):
- Updated dependencies [b3b2f413c1](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3b2f413c1):
- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
- Updated dependencies [8f41931365](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f41931365):
- Updated dependencies [a4ddcbf7e2](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4ddcbf7e2):
- Updated dependencies [d59113061a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d59113061a):
- Updated dependencies [91a1eb05db](https://bitbucket.org/atlassian/atlassian-frontend/commits/91a1eb05db):
- Updated dependencies [cedfb7766c](https://bitbucket.org/atlassian/atlassian-frontend/commits/cedfb7766c):
- Updated dependencies [2361b8d044](https://bitbucket.org/atlassian/atlassian-frontend/commits/2361b8d044):
- Updated dependencies [1028ab4db3](https://bitbucket.org/atlassian/atlassian-frontend/commits/1028ab4db3):
- Updated dependencies [a065689858](https://bitbucket.org/atlassian/atlassian-frontend/commits/a065689858):
- Updated dependencies [57ea6ea77a](https://bitbucket.org/atlassian/atlassian-frontend/commits/57ea6ea77a):
- Updated dependencies [ff6e928368](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff6e928368):
- Updated dependencies [4b3ced1d9f](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b3ced1d9f):
- Updated dependencies [fdc0861682](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdc0861682):
- Updated dependencies [00ddcd52df](https://bitbucket.org/atlassian/atlassian-frontend/commits/00ddcd52df):
- Updated dependencies [e3a8052151](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3a8052151):
- Updated dependencies [c1992227dc](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1992227dc):
- Updated dependencies [198639cd06](https://bitbucket.org/atlassian/atlassian-frontend/commits/198639cd06):
- Updated dependencies [13f0bbc125](https://bitbucket.org/atlassian/atlassian-frontend/commits/13f0bbc125):
- Updated dependencies [d7749cb6ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7749cb6ab):
- Updated dependencies [c9842c9ada](https://bitbucket.org/atlassian/atlassian-frontend/commits/c9842c9ada):
- Updated dependencies [02b2a2079c](https://bitbucket.org/atlassian/atlassian-frontend/commits/02b2a2079c):
  - @atlaskit/editor-core@118.0.0
  - @atlaskit/editor-common@44.0.0
  - @atlaskit/form@7.1.3
  - @atlaskit/renderer@54.0.0
  - @atlaskit/editor-test-helpers@10.6.0
  - @atlaskit/smart-card@12.7.0
  - @atlaskit/adf-utils@7.4.3
  - @atlaskit/editor-json-transformer@7.0.7
  - @atlaskit/icon@20.0.2
  - @atlaskit/textfield@3.1.7
  - @atlaskit/emoji@62.7.0
  - @atlaskit/analytics-listeners@6.2.4
  - @atlaskit/task-decision@16.0.7
  - @atlaskit/media-test-helpers@26.1.2

## 11.1.8

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/button@13.3.7
  - @atlaskit/form@7.1.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/select@11.0.7
  - @atlaskit/textarea@2.2.4
  - @atlaskit/textfield@3.1.6
  - @atlaskit/theme@9.5.1
  - @atlaskit/adf-utils@7.4.2
  - @atlaskit/editor-common@43.4.1
  - @atlaskit/editor-core@117.0.2
  - @atlaskit/editor-json-transformer@7.0.6
  - @atlaskit/editor-test-helpers@10.5.1
  - @atlaskit/renderer@53.2.7
  - @atlaskit/analytics-gas-types@4.0.13
  - @atlaskit/analytics-listeners@6.2.3
  - @atlaskit/emoji@62.6.3
  - @atlaskit/mention@18.16.2
  - @atlaskit/status@0.9.22
  - @atlaskit/task-decision@16.0.6
  - @atlaskit/util-data-test@13.1.1
  - @atlaskit/media-client@5.0.1
  - @atlaskit/media-core@31.0.4
  - @atlaskit/media-test-helpers@26.1.1
  - @atlaskit/smart-card@12.6.5

## 11.1.7

### Patch Changes

- [patch][3041e6b464](https://bitbucket.org/atlassian/atlassian-frontend/commits/3041e6b464):

  ED-8666 fix: skip mediaNode updates for mobile appearance- [patch][f2d043bc0f](https://bitbucket.org/atlassian/atlassian-frontend/commits/f2d043bc0f):

  fix: remove and prevent circular imports [FM-2985]- Updated dependencies [06cd97123e](https://bitbucket.org/atlassian/atlassian-frontend/commits/06cd97123e):

- Updated dependencies [07b5311cb9](https://bitbucket.org/atlassian/atlassian-frontend/commits/07b5311cb9):
- Updated dependencies [a4ded5368c](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4ded5368c):
- Updated dependencies [5181c5d368](https://bitbucket.org/atlassian/atlassian-frontend/commits/5181c5d368):
- Updated dependencies [3b19e30129](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b19e30129):
- Updated dependencies [6f16f46632](https://bitbucket.org/atlassian/atlassian-frontend/commits/6f16f46632):
- Updated dependencies [a1f50e6a54](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1f50e6a54):
- Updated dependencies [31558e1872](https://bitbucket.org/atlassian/atlassian-frontend/commits/31558e1872):
- Updated dependencies [6ca6aaa1d7](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ca6aaa1d7):
- Updated dependencies [fe4eaf06fc](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe4eaf06fc):
- Updated dependencies [43e03f1c58](https://bitbucket.org/atlassian/atlassian-frontend/commits/43e03f1c58):
- Updated dependencies [63fe41d5c2](https://bitbucket.org/atlassian/atlassian-frontend/commits/63fe41d5c2):
- Updated dependencies [b01fc0ceef](https://bitbucket.org/atlassian/atlassian-frontend/commits/b01fc0ceef):
- Updated dependencies [d085ab4419](https://bitbucket.org/atlassian/atlassian-frontend/commits/d085ab4419):
- Updated dependencies [64752f2827](https://bitbucket.org/atlassian/atlassian-frontend/commits/64752f2827):
- Updated dependencies [f67dc5ae22](https://bitbucket.org/atlassian/atlassian-frontend/commits/f67dc5ae22):
- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies [555818c33a](https://bitbucket.org/atlassian/atlassian-frontend/commits/555818c33a):
- Updated dependencies [e40acffdfc](https://bitbucket.org/atlassian/atlassian-frontend/commits/e40acffdfc):
- Updated dependencies [0709d95a8a](https://bitbucket.org/atlassian/atlassian-frontend/commits/0709d95a8a):
- Updated dependencies [28dcebde63](https://bitbucket.org/atlassian/atlassian-frontend/commits/28dcebde63):
- Updated dependencies [710897f340](https://bitbucket.org/atlassian/atlassian-frontend/commits/710897f340):
- Updated dependencies [b8da779506](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8da779506):
- Updated dependencies [bbbe360b71](https://bitbucket.org/atlassian/atlassian-frontend/commits/bbbe360b71):
- Updated dependencies [3b37ec4c28](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b37ec4c28):
- Updated dependencies [655599414e](https://bitbucket.org/atlassian/atlassian-frontend/commits/655599414e):
  - @atlaskit/editor-core@117.0.0
  - @atlaskit/smart-card@12.6.4
  - @atlaskit/editor-test-helpers@10.5.0
  - @atlaskit/editor-common@43.4.0
  - @atlaskit/media-test-helpers@26.1.0
  - @atlaskit/adf-utils@7.4.1
  - @atlaskit/renderer@53.2.6
  - @atlaskit/icon@20.0.0
  - @atlaskit/editor-json-transformer@7.0.5
  - @atlaskit/form@7.1.1
  - @atlaskit/emoji@62.6.2
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/select@11.0.6
  - @atlaskit/textfield@3.1.5
  - @atlaskit/mention@18.16.1
  - @atlaskit/status@0.9.21
  - @atlaskit/task-decision@16.0.5

## 11.1.6

### Patch Changes

- [patch][6866aa5a89](https://bitbucket.org/atlassian/atlassian-frontend/commits/6866aa5a89):

  fix: handle string and object responses for getAccountId [FM-2007]- [patch][6ee177aeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ee177aeb4):

  Stream caches in media-client now use ReplaySubjects instead of Observables.
  For the most part, this is just the interface that's being updated, as under the hood ReplaySubject was already getting used. ReplaySubjects better suit our use case because they track 1 version of history of the file state.
  As a consumer, there shouldn't be any necessary code changes. ReplaySubjects extend Observable, so the current usage should continue to work.- Updated dependencies [06f4f74d88](https://bitbucket.org/atlassian/atlassian-frontend/commits/06f4f74d88):

- Updated dependencies [80c1eaa275](https://bitbucket.org/atlassian/atlassian-frontend/commits/80c1eaa275):
- Updated dependencies [2b4ebaf2ed](https://bitbucket.org/atlassian/atlassian-frontend/commits/2b4ebaf2ed):
- Updated dependencies [c64c471564](https://bitbucket.org/atlassian/atlassian-frontend/commits/c64c471564):
- Updated dependencies [966622bd45](https://bitbucket.org/atlassian/atlassian-frontend/commits/966622bd45):
- Updated dependencies [5b8daf1843](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b8daf1843):
- Updated dependencies [3002c015cc](https://bitbucket.org/atlassian/atlassian-frontend/commits/3002c015cc):
- Updated dependencies [c55f8e0284](https://bitbucket.org/atlassian/atlassian-frontend/commits/c55f8e0284):
- Updated dependencies [b4ad0a502a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4ad0a502a):
- Updated dependencies [7d2c702223](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d2c702223):
- Updated dependencies [6421a97672](https://bitbucket.org/atlassian/atlassian-frontend/commits/6421a97672):
- Updated dependencies [0eb8c5ff5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/0eb8c5ff5a):
- Updated dependencies [3160e15523](https://bitbucket.org/atlassian/atlassian-frontend/commits/3160e15523):
- Updated dependencies [ff32b3db47](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff32b3db47):
- Updated dependencies [3f1d129a79](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f1d129a79):
- Updated dependencies [baa887053d](https://bitbucket.org/atlassian/atlassian-frontend/commits/baa887053d):
- Updated dependencies [2108ee74db](https://bitbucket.org/atlassian/atlassian-frontend/commits/2108ee74db):
- Updated dependencies [f3727d3830](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3727d3830):
- Updated dependencies [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
- Updated dependencies [dc48763970](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc48763970):
- Updated dependencies [909676b9de](https://bitbucket.org/atlassian/atlassian-frontend/commits/909676b9de):
- Updated dependencies [312feb4a6a](https://bitbucket.org/atlassian/atlassian-frontend/commits/312feb4a6a):
- Updated dependencies [cf9858fa09](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf9858fa09):
- Updated dependencies [26dbe7be6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/26dbe7be6d):
- Updated dependencies [cfcd27b2e4](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfcd27b2e4):
- Updated dependencies [6ee177aeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ee177aeb4):
- Updated dependencies [e0f0654d4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0f0654d4c):
- Updated dependencies [ec929ab10e](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec929ab10e):
  - @atlaskit/editor-core@116.2.0
  - @atlaskit/media-test-helpers@26.0.0
  - @atlaskit/smart-card@12.6.3
  - @atlaskit/editor-common@43.3.1
  - @atlaskit/renderer@53.2.5
  - @atlaskit/form@7.1.0
  - @atlaskit/docs@8.3.0
  - @atlaskit/editor-test-helpers@10.4.3
  - @atlaskit/media-client@5.0.0
  - @atlaskit/media-core@31.0.3
  - @atlaskit/editor-json-transformer@7.0.4
  - @atlaskit/emoji@62.6.1

## 11.1.5

### Patch Changes

- [patch][eaec6879c8](https://bitbucket.org/atlassian/atlassian-frontend/commits/eaec6879c8):

  fix: avoid issues around emojiProvider singleton [FM-2985]

## 11.1.4

### Patch Changes

- [patch][f6b927182a](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6b927182a):

  fix: prevent artifact sizes from ballooning [FM-2948]

## 11.1.3

### Patch Changes

- [patch][337f849c7a](https://bitbucket.org/atlassian/atlassian-frontend/commits/337f849c7a):

  fix: improve reflow detection [ED-8327]

## 11.1.2

### Patch Changes

- [patch][26942487d1](https://bitbucket.org/atlassian/atlassian-frontend/commits/26942487d1):

  FM-2810 fix: avoid authProvider() calls before file has uploaded- Updated dependencies [28f8f0e089](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f8f0e089):

- Updated dependencies [6042417190](https://bitbucket.org/atlassian/atlassian-frontend/commits/6042417190):
- Updated dependencies [26942487d1](https://bitbucket.org/atlassian/atlassian-frontend/commits/26942487d1):
- Updated dependencies [d1055e0e50](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1055e0e50):
- Updated dependencies [e0daa78402](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0daa78402):
- Updated dependencies [8db35852ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/8db35852ab):
- Updated dependencies [98a904dd02](https://bitbucket.org/atlassian/atlassian-frontend/commits/98a904dd02):
- Updated dependencies [2ffdeb5a48](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ffdeb5a48):
- Updated dependencies [97d1245875](https://bitbucket.org/atlassian/atlassian-frontend/commits/97d1245875):
- Updated dependencies [9219b332cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/9219b332cb):
- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies [29643d4593](https://bitbucket.org/atlassian/atlassian-frontend/commits/29643d4593):
- Updated dependencies [99fc6250f9](https://bitbucket.org/atlassian/atlassian-frontend/commits/99fc6250f9):
- Updated dependencies [46e6693eb3](https://bitbucket.org/atlassian/atlassian-frontend/commits/46e6693eb3):
- Updated dependencies [4cd37dd052](https://bitbucket.org/atlassian/atlassian-frontend/commits/4cd37dd052):
- Updated dependencies [1f84cf7583](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f84cf7583):
- Updated dependencies [218fe01736](https://bitbucket.org/atlassian/atlassian-frontend/commits/218fe01736):
- Updated dependencies [dfb3b76a4b](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfb3b76a4b):
- Updated dependencies [985db883ac](https://bitbucket.org/atlassian/atlassian-frontend/commits/985db883ac):
- Updated dependencies [bed9c11960](https://bitbucket.org/atlassian/atlassian-frontend/commits/bed9c11960):
- Updated dependencies [a30fe6c66e](https://bitbucket.org/atlassian/atlassian-frontend/commits/a30fe6c66e):
- Updated dependencies [fdf30da2db](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdf30da2db):
- Updated dependencies [83300f0b6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/83300f0b6d):
- Updated dependencies [d1c470507c](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1c470507c):
- Updated dependencies [fc1678c70d](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc1678c70d):
- Updated dependencies [2edd170a68](https://bitbucket.org/atlassian/atlassian-frontend/commits/2edd170a68):
- Updated dependencies [e5dd37f7a4](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5dd37f7a4):
- Updated dependencies [5abcab3f7e](https://bitbucket.org/atlassian/atlassian-frontend/commits/5abcab3f7e):
- Updated dependencies [5d13d33a60](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d13d33a60):
- Updated dependencies [81897eb2e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/81897eb2e6):
- Updated dependencies [1d421446bc](https://bitbucket.org/atlassian/atlassian-frontend/commits/1d421446bc):
- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/icon@19.1.0
  - @atlaskit/editor-core@116.0.0
  - @atlaskit/editor-common@43.2.0
  - @atlaskit/status@0.9.19
  - @atlaskit/renderer@53.2.3
  - @atlaskit/theme@9.5.0
  - @atlaskit/editor-test-helpers@10.4.0
  - @atlaskit/util-data-test@13.1.0
  - @atlaskit/button@13.3.5
  - @atlaskit/select@11.0.4
  - @atlaskit/editor-json-transformer@7.0.2
  - @atlaskit/media-client@4.2.2
  - @atlaskit/media-core@31.0.2
  - @atlaskit/media-test-helpers@25.2.6

## 11.1.1

### Patch Changes

- [patch][36f6e99c5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36f6e99c5b):

  Fix type errors caused when generating declaration files- Updated dependencies [36f6e99c5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36f6e99c5b):

  - @atlaskit/editor-core@115.2.1
  - @atlaskit/editor-test-helpers@10.3.2
  - @atlaskit/renderer@53.2.2
  - @atlaskit/media-client@4.2.1

## 11.1.0

### Minor Changes

- [minor][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  FM-2744 Implement native side for Hybrid Editor/Renderer Analytics events- [minor][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  FM-2593 feat: expose getVersion to renderer bridge

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Elevate parsing exceptions in cross platform promises- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [7ee2d3281f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ee2d3281f):
- Updated dependencies [7ee2d3281f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ee2d3281f):
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
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/renderer@53.2.1
  - @atlaskit/editor-common@43.1.0
  - @atlaskit/editor-core@115.2.0
  - @atlaskit/media-client@4.2.0
  - @atlaskit/select@11.0.3
  - @atlaskit/form@7.0.0
  - @atlaskit/textfield@3.1.4
  - @atlaskit/smart-card@12.6.2
  - @atlaskit/textarea@2.2.3
  - @atlaskit/status@0.9.18

## 11.0.2

### Patch Changes

- [patch][f9f9b6bf1b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9f9b6bf1b):

  ED-8290 fix: avoid sending superfluous arguments to remote when args is undefined- Updated dependencies [768bac6d81](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/768bac6d81):

- Updated dependencies [768bac6d81](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/768bac6d81):
- Updated dependencies [7bf6a29563](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7bf6a29563):
- Updated dependencies [fbff0b7e41](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fbff0b7e41):
- Updated dependencies [7519b2a816](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7519b2a816):
- Updated dependencies [9902932114](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9902932114):
  - @atlaskit/editor-test-helpers@10.3.1
  - @atlaskit/editor-core@115.1.0

## 11.0.1

### Patch Changes

- Updated dependencies [271945fd08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/271945fd08):
- Updated dependencies [a6663b9325](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6663b9325):
- Updated dependencies [5e4d1feec3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e4d1feec3):
- Updated dependencies [0f8d5df4cf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f8d5df4cf):
- Updated dependencies [2d1aee3e47](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d1aee3e47):
- Updated dependencies [ecfbe83dfb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecfbe83dfb):
- Updated dependencies [ea0e619cc7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea0e619cc7):
- Updated dependencies [5b8a074ce6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b8a074ce6):
- Updated dependencies [93b445dcdc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93b445dcdc):
- Updated dependencies [49fbe3d3bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49fbe3d3bf):
- Updated dependencies [c1d4898af5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1d4898af5):
- Updated dependencies [579779f5aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/579779f5aa):
- Updated dependencies [ded174361e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ded174361e):
- Updated dependencies [80eb127904](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80eb127904):
- Updated dependencies [ef2ba36d5c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef2ba36d5c):
- Updated dependencies [8c84ed470e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c84ed470e):
- Updated dependencies [6e4b678428](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e4b678428):
- Updated dependencies [bb164fbd1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb164fbd1e):
- Updated dependencies [3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):
- Updated dependencies [40bec82851](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40bec82851):
- Updated dependencies [8b652147a5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b652147a5):
- Updated dependencies [b4fda095ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b4fda095ef):
- Updated dependencies [0603c2fbf7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0603c2fbf7):
- Updated dependencies [72d4c3298d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d4c3298d):
- Updated dependencies [10425b84b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10425b84b4):
- Updated dependencies [5ef337766c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ef337766c):
- Updated dependencies [dc0999afc2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc0999afc2):
- Updated dependencies [6764e83801](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6764e83801):
- Updated dependencies [553915553f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/553915553f):
- Updated dependencies [4700477bbe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4700477bbe):
- Updated dependencies [7f8de51c36](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f8de51c36):
- Updated dependencies [f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):
- Updated dependencies [3a7c0bfa32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a7c0bfa32):
- Updated dependencies [5455e35bc0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5455e35bc0):
- Updated dependencies [cc1b89d310](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc1b89d310):
- Updated dependencies [2bb3af2382](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2bb3af2382):
- Updated dependencies [611dbe68ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/611dbe68ff):
- Updated dependencies [0ea0587ac5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ea0587ac5):
- Updated dependencies [938f1c2902](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/938f1c2902):
- Updated dependencies [926798632e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926798632e):
  - @atlaskit/editor-common@43.0.0
  - @atlaskit/editor-core@115.0.0
  - @atlaskit/emoji@62.6.0
  - @atlaskit/smart-card@12.6.1
  - @atlaskit/mention@18.16.0
  - @atlaskit/icon@19.0.11
  - @atlaskit/media-client@4.1.1
  - @atlaskit/renderer@53.2.0
  - @atlaskit/theme@9.3.0
  - @atlaskit/editor-test-helpers@10.3.0
  - @atlaskit/editor-json-transformer@7.0.1
  - @atlaskit/task-decision@16.0.4

## 11.0.0

### Major Changes

- [major][9adaeccdc5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9adaeccdc5):

  build: avoid duplicate uglification of output bundles

  Replaces `UglifyjsWebpackPlugin` with webpack's default `TerserPlugin`.

  While there are no API changes caused by us there are diffable changes
  in the resulting output bundles, which might cause issues for consumers.

  Extensive testing is recommended.

### Minor Changes

- [minor][7dac756d06](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7dac756d06):

  Enable expand in mobile-bridge

- [minor][f68c80d51a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68c80d51a):

  FM-2211 Implement scrolling improvements to prevent user typing behind keyboard on iOS

  New editor plugin IOSScroll is added into the plugins list for users on iOS mobile devices
  This works with a new native-to-web bridge method `setKeyboardControlsHeight` to add an extra buffer to the bottom of the page when the on-screen keyboard is showing

### Patch Changes

- [patch][c07b9e3615](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c07b9e3615):

  ED-7890 refactor: remove parseLocationSearch in favor of URLSearchParams

- Updated dependencies [6d9c8a9073](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d9c8a9073):
- Updated dependencies [70e1055b8f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70e1055b8f):
  - @atlaskit/editor-common@42.0.0
  - @atlaskit/editor-core@114.1.0
  - @atlaskit/renderer@53.1.0
  - @atlaskit/editor-json-transformer@7.0.0
  - @atlaskit/editor-test-helpers@10.2.0
  - @atlaskit/task-decision@16.0.3

## 10.0.1

- Updated dependencies [30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):
  - @atlaskit/form@6.3.2
  - @atlaskit/media-test-helpers@25.2.3
  - @atlaskit/select@11.0.0
  - @atlaskit/button@13.3.4
  - @atlaskit/editor-core@114.0.4

## 10.0.0

### Patch Changes

- [patch][e47220a6b2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e47220a6b2):

  ED-5450: remove most of ts-ignores from editor packages- [patch][8e7cdd0642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8e7cdd0642):

  FM-2579: Added renderer bridge methods to be able to observe the height of rendered content changing

- Updated dependencies [f28c191f4a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f28c191f4a):
- Updated dependencies [24b8ea2667](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24b8ea2667):
  - @atlaskit/editor-json-transformer@6.3.5
  - @atlaskit/editor-test-helpers@10.1.3
  - @atlaskit/editor-core@114.0.0
  - @atlaskit/renderer@53.0.0
  - @atlaskit/emoji@62.5.6
  - @atlaskit/media-client@4.0.0
  - @atlaskit/media-test-helpers@25.2.2
  - @atlaskit/task-decision@16.0.2
  - @atlaskit/editor-common@41.2.1
  - @atlaskit/media-core@31.0.0

## 9.0.0

### Major Changes

- [major][bd94b1d552](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd94b1d552):

  ED-7631: removed deprecated code for actions/decisions component- [major][ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):

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

### Minor Changes

- [minor][80572c341d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80572c341d):

  FM-2502 Relay hybrid editor/renderer analytics to native

  Capture any analytics events within the editor/renderer and send them through `analyticsBridge.trackEvent` to allow native-side to process and fire the events

### Patch Changes

- [patch][cc28419139](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc28419139):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.- [patch][7f3b4e4ec1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f3b4e4ec1):

  FM-2370 Fix issue where renderBridge.onContentRendered was not being called when renderer was given invalid adf- [patch][c6835f9555](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6835f9555):

  Update "scroll to element" after changing DOM type for action in ED-7674

- Updated dependencies [4585681e3d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4585681e3d):
- Updated dependencies [e7b5c917de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7b5c917de):
  - @atlaskit/task-decision@16.0.0
  - @atlaskit/renderer@52.0.0
  - @atlaskit/editor-core@113.2.0
  - @atlaskit/emoji@62.5.4
  - @atlaskit/editor-common@41.2.0
  - @atlaskit/media-core@30.0.17
  - @atlaskit/media-test-helpers@25.2.0
  - @atlaskit/media-client@3.0.0

## 8.11.2

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 8.11.1

### Patch Changes

- [patch][a8162fcbb9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a8162fcbb9):

  FM-2539 Fix issue where scroll pos would jump when typing at bottom of document in iOS

## 8.11.0

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

- [minor][98ad94c69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98ad94c69c):

  FM-2393 Expose undo/redo methods on mobile bridge

  native-to-web: undo/redo methods which will hook directly into prosemirror-history's
  web-to-native: undoRedoBridge.stateChange which informs native whether undo and redo are currently available so they can enable/disable their buttons accordingly

## 8.10.2

### Patch Changes

- [patch][ff722f80a4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff722f80a4):

  ED-7760 Prevent scroll jumping when editing near the end of the document on iOS.

## 8.10.1

### Patch Changes

- [patch][5463e933e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5463e933e6):

  FM-2472 Fix issue where Android Recycled View height would grow indefinitely

## 8.10.0

### Minor Changes

- [minor][3458937c4c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3458937c4c):

  FM-2383 Enable Emoji Picker in native UI on iOS. Supports system and custom emojis via the type ahead flow when type a semicolon ':'- [minor][e171e3f38e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e171e3f38e):

  FM-2055, FM-2261: Expose mobile bridge API methods for scrolling to a mention, action, or decision item by ID. Add localId value into rendered action/decision list elements within the existing custom data attribute to allow scroll targetting.

### Patch Changes

- [patch][9fb705e807](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9fb705e807):

  FM-2212: Refactor Mobile Bridge CSS to improve body scrolling. FM-2024: Improve Mobile Editing UX when tapping beneath Tables, Layouts, Columns.- [patch][40ead387ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40ead387ef):

  ED-7532 Expose ability to cancel default browser behavior when clicking Smart Links- [patch][45ae9e1cc2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/45ae9e1cc2):

  ED-7201 Add new background cell colors and improve text color

- Updated dependencies [166eb02474](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/166eb02474):
- Updated dependencies [80adfefba2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80adfefba2):
  - @atlaskit/editor-json-transformer@6.3.3
  - @atlaskit/editor-test-helpers@10.0.0
  - @atlaskit/task-decision@15.3.4
  - @atlaskit/editor-core@113.0.0
  - @atlaskit/renderer@51.0.0
  - @atlaskit/emoji@62.5.1
  - @atlaskit/mention@18.15.2
  - @atlaskit/status@0.9.13
  - @atlaskit/editor-common@41.0.0

## 8.9.3

### Patch Changes

- [patch][07dd73fa12](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07dd73fa12):

  FM-2240 Fix issue where smart links would cause hybrid renderer to crash in Android

## 8.9.2

### Patch Changes

- [patch][08ec269915](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/08ec269915):

  ED-7532 Expose ability to cancel default browser behaviour when clicking Smart Links within the Mobile Renderer.

## 8.9.1

### Patch Changes

- [patch][9c28ef71fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c28ef71fe):

  Add missing peerDependency in package.json

## 8.9.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 8.8.21

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 8.8.20

### Patch Changes

- [patch][0d7d459f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7d459f1a):

  Fixes type errors which were incompatible with TS 3.6

## 8.8.19

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 8.8.18

### Patch Changes

- [patch][14ee438465](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/14ee438465):

  ED-6714: Re-enable editorActions.replaceDocument for mobile-bridge with better tolerance of invalid nodes

## 8.8.17

- Updated dependencies [69586b5353](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69586b5353):
  - @atlaskit/editor-core@112.41.6
  - @atlaskit/editor-test-helpers@9.11.6
  - @atlaskit/renderer@49.7.8
  - @atlaskit/media-client@2.0.1
  - @atlaskit/media-core@30.0.10
  - @atlaskit/media-test-helpers@25.0.0

## 8.8.16

- Updated dependencies [84887b940c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84887b940c):
  - @atlaskit/form@6.1.7
  - @atlaskit/smart-card@12.4.3
  - @atlaskit/textfield@3.0.0

## 8.8.15

- Updated dependencies [ee804f3eeb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee804f3eeb):
  - @atlaskit/editor-common@39.17.2
  - @atlaskit/editor-core@112.41.2
  - @atlaskit/renderer@49.7.7
  - @atlaskit/media-core@30.0.9
  - @atlaskit/media-test-helpers@24.3.5
  - @atlaskit/media-client@2.0.0

## 8.8.14

- Updated dependencies [688f2957ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/688f2957ca):
  - @atlaskit/multi-entry-tools@0.0.2
  - @atlaskit/button@13.1.1
  - @atlaskit/editor-core@112.39.12
  - @atlaskit/editor-test-helpers@9.11.5
  - @atlaskit/emoji@62.2.6
  - @atlaskit/status@0.9.8
  - @atlaskit/smart-card@12.4.1

## 8.8.13

### Patch Changes

- [patch][f34776be97](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f34776be97):

  Type definition files are now referenced in package.json

## 8.8.12

### Patch Changes

- [patch][0bb88234e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0bb88234e6):

  Upgrade prosemirror-view to 1.9.12

## 8.8.11

### Patch Changes

- [patch][ec8066a555](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec8066a555):

  Upgrade `@types/prosemirror-view` Typescript definitions to latest 1.9.x API

## 8.8.10

### Patch Changes

- [patch][66e3f954c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66e3f954c2):

  FM-2149 Disable default oauth2 flow when resolving smart links. Native to resolve auth on their side instead.

## 8.8.9

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 8.8.8

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 8.8.7

- Updated dependencies [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
  - @atlaskit/button@13.0.11
  - @atlaskit/form@6.1.4
  - @atlaskit/editor-core@112.33.9
  - @atlaskit/media-test-helpers@24.3.1
  - @atlaskit/select@10.0.0

## 8.8.6

### Patch Changes

- [patch][fabee8bd0e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fabee8bd0e):

  ED-7238: refactor test to use EditorProps over importing mentionPlugin

## 8.8.5

### Patch Changes

- [patch][29854703dc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29854703dc):

  ED-6896 Fix to ensure editor-mobile-bridge releases contain the precompiled app within ./dist

## 8.8.4

> **DON'T USE** - This release is missing a precompiled dist.

### Patch Changes

- [patch][f7d5a189ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f7d5a189ab):

  Release non-empty dist package 🤞

## 8.8.3

> **DON'T USE** - This release is missing a precompiled dist.

### Patch Changes

- [patch][ed1fd9801e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed1fd9801e):

  ED-6896 Leverage buid pipeline fix to ensure correct version number is compiled into dist

## 8.8.2

> **DON'T USE** - This release is missing a precompiled dist.

### Patch Changes

- [patch][e80e60b358](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e80e60b358):

  FM-2123: fixed double @ insertion on mention composition (Android)

## 8.8.1

### Patch Changes

- [patch][dfa96bfdcc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dfa96bfdcc):

  FM-2056 Expose mention tapping via renderer bridge so that iOS/Android can display a native profile card for the selected user

## 8.8.0

### Minor Changes

- [minor][d6c31deacf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d6c31deacf):

  ED-6701 Upgrade prosemirror-view to 1.9.10 and prosemirror-inputrules to 1.0.4 for composition input improvements

## 8.7.4

### Patch Changes

- [patch][c3e3421cb9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3e3421cb9):

  FM-2054: improved table rendering in Hybrid Editor for Mobile

## 8.7.3

### Patch Changes

- [patch][bb64fcedcb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb64fcedcb):

  uploadContext and viewContext fields of MediaProvider (part of Editor and Renderer props) are deprecated. New fields uploadMediaClientConfig and viewMediaClientConfig should be used from now on.

## 8.7.2

- Updated dependencies [393fb6acd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/393fb6acd2):
  - @atlaskit/editor-test-helpers@9.4.1
  - @atlaskit/renderer@49.0.1
  - @atlaskit/editor-core@112.14.0
  - @atlaskit/smart-card@12.0.0

## 8.7.1

- Updated dependencies [ff85c1c706](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff85c1c706):
  - @atlaskit/editor-core@112.13.9
  - @atlaskit/task-decision@15.0.4
  - @atlaskit/renderer@49.0.0

## 8.7.0

### Minor Changes

- [minor][2472de1af7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2472de1af7):

  ED-5671 Expose media tapping via renderer bridge so that iOS/Android apps can display the selected item in their native media viewers

## 8.6.4

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 8.6.3

- Updated dependencies [9ecfef12ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ecfef12ac):
  - @atlaskit/editor-core@112.11.0
  - @atlaskit/editor-test-helpers@9.3.4
  - @atlaskit/renderer@48.7.0
  - @atlaskit/media-client@1.2.0
  - @atlaskit/media-core@30.0.3
  - @atlaskit/media-test-helpers@24.0.0

## 8.6.2

- [patch][7d4010d923](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d4010d923):

  - ED-6765: fixed mediaSingle deletion issue on Android (no workaround)

## 8.6.1

- [patch][7936e9a2a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7936e9a2a9):

  - ED-6910: fixed a regression in webpack configuration

## 8.6.0

- [minor][21f5217343](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21f5217343):

  - consume emoji new entrypoints in AK

## 8.5.0

- [minor][7089d49f61](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7089d49f61):

  - consume the new mention entrypoints

## 8.4.0

- [minor][9a1b2075e8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a1b2075e8):

  - consume new Status entrypoints

## 8.3.2

- [patch][ec1d1861bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec1d1861bc):

  - ED-6910: disabled sourcemaps in production

## 8.3.1

- [patch][12aa76d5b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12aa76d5b5):

  - ED-6814: fixed rendering mediaSingle without collection

## 8.3.0

- [minor][79f0ef0601](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79f0ef0601):

  - Use strict tsconfig to compile editor packages

## 8.2.4

- [patch][5ad66b6d1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ad66b6d1a):

  - [ED-6860] Revert prosemirror-view 1.8.9 bumps, this version was making the cursor typing slowly. this version is recreating all plugins when we use `EditorView.setProps`

## 8.2.3

- Updated dependencies [5e4ff01e4c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e4ff01e4c):
  - @atlaskit/editor-json-transformer@6.0.2
  - @atlaskit/editor-test-helpers@9.1.4
  - @atlaskit/mention@18.1.0
  - @atlaskit/editor-core@112.0.0

## 8.2.2

- Updated dependencies [154372926b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/154372926b):
  - @atlaskit/editor-json-transformer@6.0.1
  - @atlaskit/editor-test-helpers@9.1.2
  - @atlaskit/editor-core@111.0.0

## 8.2.1

- [patch][72fc33f8e7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72fc33f8e7):

  - FS-3243 - Refactor status plugin to use new architecture

## 8.2.0

- [minor][47273cabd4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/47273cabd4):

  - ED-6803: Added bridge.clearContent() method for Android

## 8.1.0

- [minor][5a49043dac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5a49043dac):

  - Enable strictPropertyInitialization in tsconfig.base

## 8.0.1

- [patch][80cf1c1e82](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80cf1c1e82):

  - [ED-6654] Update prosemirror-view to 1.8.9 that fixes a few issues with mouse selections on prosemirror like click on table and the controls doesn't show up

## 8.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 7.6.3

- Updated dependencies [a1192ef860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1192ef860):
  - @atlaskit/editor-common@38.0.0
  - @atlaskit/editor-core@109.0.0
  - @atlaskit/renderer@47.0.0
  - @atlaskit/emoji@61.0.0
  - @atlaskit/editor-json-transformer@5.0.4
  - @atlaskit/editor-test-helpers@8.0.8
  - @atlaskit/task-decision@14.0.9
  - @atlaskit/media-core@29.3.0

## 7.6.2

- Updated dependencies [e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):
  - @atlaskit/editor-common@37.0.0
  - @atlaskit/editor-core@108.0.0
  - @atlaskit/renderer@46.0.0
  - @atlaskit/emoji@60.0.0
  - @atlaskit/editor-json-transformer@5.0.3
  - @atlaskit/editor-test-helpers@8.0.7
  - @atlaskit/task-decision@14.0.8
  - @atlaskit/media-core@29.2.0

## 7.6.1

- [patch][3ffe0451d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ffe0451d1):

  - ED-6486: fixed version number obtained from editor-mobile-bridge

## 7.6.0

- [minor][089eae03fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/089eae03fd):

  - ED-6486: added method for getting current editor bridge version

## 7.5.1

- Updated dependencies [6cdf11238d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6cdf11238d):
  - @atlaskit/form@5.2.10
  - @atlaskit/smart-card@10.4.2
  - @atlaskit/textfield@1.0.0

## 7.5.0

- [minor][8fb796b610](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fb796b610):

  - ED-6728: Added scrollToSelection() method to bridge

## 7.4.4

- [patch][f224fa19d5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f224fa19d5):

  - ED-6716 Enables allowConfluenceInlineComment for mobile editor bridge so inline comments are now no longer unsupported content

## 7.4.3

- [patch][83014a7395](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/83014a7395):

  - ED-6716 Prevent mobile-bridge from deleting invalid marks. Temporary fix for inline comments being removed in the document.

## 7.4.2

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/form@5.2.7
  - @atlaskit/select@8.1.1
  - @atlaskit/textfield@0.4.4
  - @atlaskit/editor-common@36.1.12
  - @atlaskit/editor-core@107.13.4
  - @atlaskit/renderer@45.6.1
  - @atlaskit/emoji@59.2.3
  - @atlaskit/mention@17.6.7
  - @atlaskit/status@0.8.3
  - @atlaskit/task-decision@14.0.5
  - @atlaskit/smart-card@10.2.4
  - @atlaskit/theme@8.1.7

## 7.4.1

- [patch][351e23aeb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/351e23aeb5):

  - ED-6102: fixed inline node deletion on Android

## 7.4.0

- [minor][7964240a6a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7964240a6a):

  - ED-6698: Adding smart cards to the renderer and on document load

## 7.3.2

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/form@5.2.5
  - @atlaskit/select@8.0.5
  - @atlaskit/textfield@0.4.3
  - @atlaskit/theme@8.1.6
  - @atlaskit/editor-core@107.12.5
  - @atlaskit/renderer@45.4.3
  - @atlaskit/emoji@59.2.1
  - @atlaskit/task-decision@14.0.3
  - @atlaskit/media-core@29.1.4
  - @atlaskit/smart-card@10.2.2
  - @atlaskit/button@12.0.0

## 7.3.1

- [patch][55e47676aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/55e47676aa):

  - revert update status code splits in Renderer/Editor which causes component dist to be broken

## 7.3.0

- [minor][db29d1eca9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/db29d1eca9):

  - ED-6357: bridge.currentSelection() provides rectangle coords of selected link

## 7.2.0

- [minor][969915d261](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/969915d261):

  - update status import entrypoints in Renderer/editor

## 7.1.10

- [patch][97e555c168](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97e555c168):

  - Revert "[ED-5259 - ED-6200] adds defaultMarks on tableNode (pull request #5259)"

## 7.1.9

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 7.1.8

- [patch][92c8c14019](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92c8c14019):

  - ED-6492: Fixed media single without dimensions not rendering on mobile

## 7.1.7

- Updated dependencies [c2c36de22b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c36de22b):
  - @atlaskit/editor-common@36.0.0
  - @atlaskit/editor-core@107.0.0
  - @atlaskit/renderer@45.0.0
  - @atlaskit/emoji@59.0.0
  - @atlaskit/editor-json-transformer@5.0.2
  - @atlaskit/editor-test-helpers@8.0.3
  - @atlaskit/task-decision@14.0.1
  - @atlaskit/media-core@29.1.0

## 7.1.6

- Updated dependencies [eb4323c388](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eb4323c388):
  - @atlaskit/editor-core@106.7.3
  - @atlaskit/renderer@44.4.2
  - @atlaskit/task-decision@14.0.0

## 7.1.5

- Updated dependencies [97abf5e006](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97abf5e006):
  - @atlaskit/editor-core@106.7.2
  - @atlaskit/renderer@44.4.1
  - @atlaskit/status@0.8.0

## 7.1.4

- [patch][9e97d4186b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9e97d4186b):

  - ED-6488 Fix dark mode editor in mobile bridge

## 7.1.3

- Updated dependencies [8eff47cacb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8eff47cacb):
  - @atlaskit/form@5.2.3
  - @atlaskit/textfield@0.4.0

## 7.1.2

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 7.1.1

- [patch][205b101e2b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/205b101e2b):

  - ED-6230: bump prosemirror-view to 1.8.3; workaround Chrome bug with copy paste multiple images

## 7.1.0

- [minor][ce221ff69e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce221ff69e):

  - Add smart cards to the mobile bridge

## 7.0.1

- Updated dependencies [b684722884](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b684722884):
  - @atlaskit/editor-core@106.0.3
  - @atlaskit/renderer@44.0.1
  - @atlaskit/emoji@58.1.0
  - @atlaskit/mention@17.1.0
  - @atlaskit/status@0.7.0
  - @atlaskit/task-decision@13.1.0

## 7.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 6.15.0

- [minor][29870e89f2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29870e89f2):

  - Enable noImplicitAny for mobile bridge

## 6.14.2

- Updated dependencies [7ab3e93996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ab3e93996):
  - @atlaskit/editor-common@34.0.0
  - @atlaskit/editor-core@105.0.0
  - @atlaskit/editor-test-helpers@7.0.6
  - @atlaskit/renderer@43.0.0
  - @atlaskit/emoji@57.0.0
  - @atlaskit/editor-json-transformer@4.3.5
  - @atlaskit/task-decision@12.0.1
  - @atlaskit/media-core@28.0.0

## 6.14.1

- Updated dependencies [72c6f68226](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72c6f68226):
  - @atlaskit/editor-core@104.1.1
  - @atlaskit/renderer@42.0.1
  - @atlaskit/task-decision@12.0.0

## 6.14.0

- [minor][efc3cdd52e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/efc3cdd52e):

  - ED-6354: added bridge for sending JS errors to native

## 6.13.7

- Updated dependencies [4d17df92f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d17df92f8):
  - @atlaskit/editor-json-transformer@4.3.4
  - @atlaskit/editor-test-helpers@7.0.5
  - @atlaskit/task-decision@11.3.2
  - @atlaskit/editor-core@104.0.0
  - @atlaskit/renderer@42.0.0

## 6.13.6

- [patch][5e319bb725](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e319bb725):

  - ED-6286: fix post-PR for media upload on mobile

## 6.13.5

- [patch][4bb4f46a6f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4bb4f46a6f):

  - ED-5603: fixed updating links on mobile

## 6.13.4

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/editor-core@103.0.3
  - @atlaskit/editor-json-transformer@4.3.3
  - @atlaskit/renderer@41.2.1
  - @atlaskit/emoji@56.2.1
  - @atlaskit/mention@16.2.2
  - @atlaskit/status@0.5.1
  - @atlaskit/task-decision@11.3.1
  - @atlaskit/media-core@27.2.3
  - @atlaskit/editor-common@33.0.3
  - @atlaskit/docs@7.0.0
  - @atlaskit/form@5.1.8
  - @atlaskit/select@8.0.0
  - @atlaskit/textfield@0.3.0
  - @atlaskit/theme@8.0.0

## 6.13.3

- Updated dependencies [60f0ad9a7e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60f0ad9a7e):
  - @atlaskit/editor-json-transformer@4.3.2
  - @atlaskit/editor-core@103.0.0
  - @atlaskit/editor-test-helpers@7.0.4

## 6.13.2

- Updated dependencies [4072865c1c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4072865c1c):
  - @atlaskit/editor-core@102.1.10
  - @atlaskit/renderer@41.1.1
  - @atlaskit/emoji@56.2.0
  - @atlaskit/status@0.5.0
  - @atlaskit/task-decision@11.3.0

## 6.13.1

- [patch][59fcd0bbc9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59fcd0bbc9):

  - FM-1618: fixed media upload on mobile

## 6.13.0

- [minor][6032a39f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6032a39f1a):

  - ED-6189: registered insertBlockType() on mobile bridge

## 6.12.2

- Updated dependencies [e9b824bf86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e9b824bf86):
  - @atlaskit/form@5.1.7
  - @atlaskit/textfield@0.2.0

## 6.12.1

- Updated dependencies [36bb743af0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36bb743af0):
  - @atlaskit/editor-core@102.1.1
  - @atlaskit/renderer@41.0.1
  - @atlaskit/emoji@56.1.0
  - @atlaskit/status@0.4.0

## 6.12.0

- [minor][d18b085e2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d18b085e2a):

  - Integrating truly upfront ID

## 6.11.1

- Updated dependencies [4aee5f3cec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aee5f3cec):
  - @atlaskit/editor-common@33.0.0
  - @atlaskit/editor-core@102.0.0
  - @atlaskit/renderer@41.0.0
  - @atlaskit/emoji@56.0.0
  - @atlaskit/editor-json-transformer@4.3.1
  - @atlaskit/editor-test-helpers@7.0.2
  - @atlaskit/task-decision@11.2.3
  - @atlaskit/media-core@27.2.0

## 6.11.0

- [minor][27189951b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/27189951b5):

  - ED-5967: added API to enable links on hybrid editor

## 6.10.0

- [minor][30b4e99377](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30b4e99377):

  - ED-5888 Add editor dark mode

## 6.9.1

- Updated dependencies [4a84fc40e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a84fc40e0):
  - @atlaskit/editor-json-transformer@4.1.12
  - @atlaskit/editor-test-helpers@7.0.1
  - @atlaskit/task-decision@11.2.2
  - @atlaskit/editor-core@101.0.0
  - @atlaskit/renderer@40.0.0

## 6.9.0

- [minor][5dc1e046b2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5dc1e046b2):

  - Apply stricture typings to elements related editor code

## 6.8.2

- Updated dependencies [4af5bd2a58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4af5bd2a58):
  - @atlaskit/editor-json-transformer@4.1.11
  - @atlaskit/editor-common@32.0.2
  - @atlaskit/renderer@39.0.2
  - @atlaskit/emoji@55.0.1
  - @atlaskit/mention@16.2.1
  - @atlaskit/status@0.3.6
  - @atlaskit/editor-core@100.0.0
  - @atlaskit/editor-test-helpers@7.0.0

## 6.8.1

- Updated dependencies [fc6164c8c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc6164c8c2):
  - @atlaskit/editor-common@32.0.0
  - @atlaskit/editor-core@99.0.0
  - @atlaskit/renderer@39.0.0
  - @atlaskit/emoji@55.0.0
  - @atlaskit/editor-json-transformer@4.1.10
  - @atlaskit/editor-test-helpers@6.3.22
  - @atlaskit/task-decision@11.2.1
  - @atlaskit/media-core@27.1.0

## 6.8.0

- [minor][e609e6d78c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e609e6d78c):

  - FM-1464: Add callback to ReactRenderer.onComplete to notify native renderBridge

## 6.7.13

- Updated dependencies [06713e0a0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06713e0a0c):
  - @atlaskit/form@5.1.5
  - @atlaskit/editor-core@98.10.3
  - @atlaskit/select@7.0.0

## 6.7.12

- [patch][334d2db5df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/334d2db5df):

  - ED-6206: fixed media card issue on mobile editor

## 6.7.11

- [patch][7ad6037cca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ad6037cca):

  - ED-6048: fixed bullet point not showing up until text inserted

## 6.7.10

- [patch][557a2b5734](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/557a2b5734):

  - ED-5788: bump prosemirror-view and prosemirror-model

## 6.7.9

- [patch][01935688f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/01935688f8):

  - FM-1494: turned off CSS properties overflow and overflow-scrolling

## 6.7.8

- Updated dependencies [69c8d0c19c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c8d0c19c):
  - @atlaskit/editor-common@31.0.0
  - @atlaskit/editor-core@98.0.0
  - @atlaskit/editor-test-helpers@6.3.17
  - @atlaskit/renderer@38.0.0
  - @atlaskit/emoji@54.0.0
  - @atlaskit/editor-json-transformer@4.1.8
  - @atlaskit/task-decision@11.1.8
  - @atlaskit/media-core@27.0.0

## 6.7.7

- [patch][e2eca7e6d5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e2eca7e6d5):

  - ED-6111: fixed renderer rendering unsupported content with some ADF

## 6.7.6

- [patch][4a52fa0b89](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a52fa0b89):

  - ED-6050: enabled layouts (mobile editor)

## 6.7.5

- [patch][2db7577588](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2db7577588):

  - ED-5924: Fixes handling of node deletion for composition events.

## 6.7.4

- Updated dependencies [85d5d168fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85d5d168fd):
  - @atlaskit/editor-common@30.0.0
  - @atlaskit/editor-core@97.0.0
  - @atlaskit/renderer@37.0.0
  - @atlaskit/emoji@53.0.0
  - @atlaskit/editor-json-transformer@4.1.7
  - @atlaskit/editor-test-helpers@6.3.12
  - @atlaskit/task-decision@11.1.6
  - @atlaskit/media-core@26.2.0

## 6.7.3

- [patch][4e764a26d4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e764a26d4):

  - ED-6070: Don't render proper mediaCard on mobile until we have a valid collection

## 6.7.2

- Updated dependencies [dadef80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dadef80):
  - @atlaskit/editor-common@29.0.0
  - @atlaskit/editor-core@96.0.0
  - @atlaskit/renderer@36.0.0
  - @atlaskit/emoji@52.0.0
  - @atlaskit/editor-json-transformer@4.1.6
  - @atlaskit/editor-test-helpers@6.3.11
  - @atlaskit/task-decision@11.1.5
  - @atlaskit/media-core@26.1.0

## 6.7.1

- [patch][060f2da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/060f2da):

  - ED-5991: bumped prosemirror-view to 1.6.8

## 6.7.0

- [minor][df30c63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df30c63):

  - ED-5723: Enables typeahead support for mobile editor

  * Added a new bridge `typeAheadBridge`, which contains `typeAheadQuery()` and `dismissTypeAhead()`
    - `typeAheadQuery(query: string, trigger: string)` - This will notify integrators when a user is attempting to filter down a list.
    - `dismissTypeAhead` - Call this to dismiss any typeahead related content.
  * Added bridge function `insertTypeAheadItem()`, which currently only supports inserting mentions.
    - `insertTypeAheadItem(type: 'mention', payload: string)` - Payload is a stringified JSON blob containing the information to insert a mention in this scenario.
  * Added bridge function `setFocus()` to handle returning the focus to the editor after a native interaction.
  * Added new promise `getAccountId`, which is used to highlight the current user's mention.

## 6.6.1

- Updated dependencies [0c116d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c116d6):
  - @atlaskit/editor-json-transformer@4.1.5
  - @atlaskit/editor-test-helpers@6.3.8
  - @atlaskit/editor-common@28.0.2
  - @atlaskit/renderer@35.0.1
  - @atlaskit/editor-core@95.0.0
  - @atlaskit/mention@16.0.0

## 6.6.0

- [minor][c0dc7e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c0dc7e3):

  - FS-3360 - Support state analytics attribute with values new or existing. Implement for web, and mobile support via mobile-bridge.

## 6.5.6

- Updated dependencies [cbb8cb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbb8cb5):
  - @atlaskit/editor-common@28.0.0
  - @atlaskit/editor-core@94.0.0
  - @atlaskit/editor-test-helpers@6.3.7
  - @atlaskit/renderer@35.0.0
  - @atlaskit/emoji@51.0.0
  - @atlaskit/editor-json-transformer@4.1.4
  - @atlaskit/task-decision@11.1.4
  - @atlaskit/media-core@26.0.0

## 6.5.5

- Updated dependencies [72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):
  - @atlaskit/editor-common@27.0.0
  - @atlaskit/editor-core@93.0.0
  - @atlaskit/editor-test-helpers@6.3.6
  - @atlaskit/renderer@34.0.0
  - @atlaskit/emoji@50.0.0
  - @atlaskit/editor-json-transformer@4.1.3
  - @atlaskit/task-decision@11.1.3
  - @atlaskit/media-core@25.0.0

## 6.5.4

- Updated dependencies [e858305](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e858305):
  - @atlaskit/editor-json-transformer@4.1.2
  - @atlaskit/editor-test-helpers@6.3.5
  - @atlaskit/renderer@33.0.4
  - @atlaskit/task-decision@11.1.2
  - @atlaskit/editor-common@26.0.0
  - @atlaskit/editor-core@92.0.19

## 6.5.3

- Updated dependencies [00c648e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/00c648e):
- Updated dependencies [a17bb0e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a17bb0e):
- Updated dependencies [99f08a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/99f08a0):
  - @atlaskit/editor-core@92.0.9
  - @atlaskit/renderer@33.0.3
  - @atlaskit/status@0.3.0

## 6.5.2

- Updated dependencies [b3738ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3738ea):
  - @atlaskit/editor-common@25.0.0
  - @atlaskit/editor-core@92.0.0
  - @atlaskit/renderer@33.0.0
  - @atlaskit/emoji@49.0.0
  - @atlaskit/editor-json-transformer@4.1.1
  - @atlaskit/editor-test-helpers@6.3.4
  - @atlaskit/task-decision@11.1.1
  - @atlaskit/media-core@24.7.0

## 6.5.1

- Updated dependencies [647a46f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/647a46f):
  - @atlaskit/select@6.1.14
  - @atlaskit/textfield@0.1.5
  - @atlaskit/form@5.0.0

## 6.5.0

- [minor][462b70f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/462b70f):

  - ED-5819: Enables support for text color on mobile

## 6.4.10

- Updated dependencies [1205725](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1205725):
  - @atlaskit/task-decision@11.0.10
  - @atlaskit/editor-common@24.0.0
  - @atlaskit/editor-core@91.1.0
  - @atlaskit/editor-json-transformer@4.1.0
  - @atlaskit/editor-test-helpers@6.3.3
  - @atlaskit/renderer@32.1.0

## 6.4.9

- Updated dependencies [80f765b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80f765b):
  - @atlaskit/editor-common@23.0.0
  - @atlaskit/editor-core@91.0.0
  - @atlaskit/renderer@32.0.0
  - @atlaskit/emoji@48.0.0
  - @atlaskit/editor-json-transformer@4.0.25
  - @atlaskit/editor-test-helpers@6.3.2
  - @atlaskit/task-decision@11.0.9
  - @atlaskit/media-core@24.6.0

## 6.4.8

- [patch][f5d4e83](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f5d4e83):

  - ED-5866: Fixes incorrect return from Mocked Emoji provider.

## 6.4.7

- [patch][43501db](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/43501db):

  - ED-5812: Fixes some regressions in the mobile editor

  Including:

  - Disables mediaGoup lazy loading.
  - Fixes unsupported emoji content.
  - Fixes missed call to Android bridge for block state.

## 6.4.6

- [patch][e01ea01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e01ea01):

  - Bump to match @atlaskit/docs dep

## 6.4.5

- [patch][d3d0d67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d3d0d67):

  - Mobile bridge can be public and updated the description

## 6.4.4

- [patch][7190767](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7190767):

  - Fixes empty collection name and API naming mismatches

## 6.4.3

- [patch][7515804](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7515804):

  - Fixes requesting media auth for empty string collections.

## 6.4.2

- [patch][0a297ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a297ba):

  - Packages should not be shown in the navigation, search and overview

## 6.4.1

- [patch][232238c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/232238c):

  - ED-5866: Turn off lazy loading for images on mobile.

## 6.4.0

- [minor][008c694](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/008c694):

  - ED-5584: Capture emoji requests for native processing on iOS only.

## 6.3.4

- [patch][94094fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/94094fe):

  - Adds support for links around images

## 6.3.3

- [patch][3a7224a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a7224a):

  - ED-5677: enabled quickInsert and gapCursor by default (quickInsert: except for mobile appearance)

## 6.3.2

- [patch][3061b52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3061b52):

  - AK-5723 - adjust files in package.json to ensure correct publishing of dist/package.json

## 6.3.1

- [patch][345b45c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/345b45c):

  - Update @atlaskit/button inside @atlaskit/editor-mobile-bridge

## 6.3.0

- [minor][086f816](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/086f816):

  - FS-3150 - Support status in the editor-mobile-bridge

## 6.2.1

- Updated dependencies [7e8b4b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e8b4b9):
  - @atlaskit/editor-common@22.0.0
  - @atlaskit/editor-core@89.0.0
  - @atlaskit/renderer@31.0.0
  - @atlaskit/emoji@47.0.0
  - @atlaskit/editor-json-transformer@4.0.22
  - @atlaskit/editor-test-helpers@6.2.19
  - @atlaskit/task-decision@11.0.4
  - @atlaskit/media-core@24.5.0

## 6.2.0

- [minor][dfcb816](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dfcb816):

  - ED-5818: Add support for inserting block nodes

  Bridge API now supports inserting:

  - Tables
  - Panels
  - Codeblocks
  - Block Quotes
  - Actions
  - Decisions

## 6.1.0

- [minor][ab6d96b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab6d96b):

  - ED-5710: Fixes calling media upfront.

  We now only call for the media auth, when rendering / loading a media item.

## 6.0.0

- [major][6d6522b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d6522b):

  - Refactor mentions to use TypeAhead plugin

## 5.6.0

- [minor][d901563](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d901563):

  - FM-1388: Add bridge API to both editor and renderer to set padding

## 5.5.0

- [minor][586100b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/586100b):

  - ED-5584: Added Emoji support to the renderer.

## 5.4.1

- [patch][05a4cf3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/05a4cf3):

  - FM-1358: Fixes scrolling lag when encountering a shadow

## 5.4.0

- [minor][611d8a5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/611d8a5):

  - ED-5707 Enable pinch to zoom in Renderer

## 5.3.0

- [minor][13a108f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/13a108f):

  - Updated package bundle

## 5.2.4

- Updated dependencies [2c21466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c21466):
  - @atlaskit/editor-common@21.0.0
  - @atlaskit/editor-core@88.0.0
  - @atlaskit/renderer@30.0.0
  - @atlaskit/editor-json-transformer@4.0.21
  - @atlaskit/editor-test-helpers@6.2.16
  - @atlaskit/task-decision@11.0.2
  - @atlaskit/media-core@24.4.0

## 5.2.3

- [patch][f6c3f01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f6c3f01):

  - ED-5586: Removes padding from editor and renderer for mobile.

## 5.2.2

- [patch][3756327](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3756327):

  - ED-5588: Fixes font size changing when rotating viewport on iOS.

## 5.2.1

- [patch][a9eb99f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a9eb99f):

  - ED-5510: fix deleting last character in a cell in Safari

## 5.2.0

- [minor][f5696d5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f5696d5):

  - ED-5606: Added support for sending task update events to native for handling

## 5.1.0

- [minor][d793999](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d793999):

  - ED-5583: Pass all link events to native for handling

## 5.0.4

- [patch][e5e040c" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e5e040c"
  d):

  - Fixes passing null to renderer before we have content. ED-5587

## 5.0.3

- [patch] Fixed rendering media in the renderer. FM-1280 [00aaf8e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/00aaf8e)

## 5.0.2

- [patch] Fixes rendering elements on iOS before scrolling ends. FM-1277 [9d3029b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d3029b)

## 5.0.1

- [patch] ED-5513: render table that respects columns widths except on mobile [716bb9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/716bb9d)

## 5.0.0

- [major] Media refactor and fileID upfront [052ce89](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/052ce89)

## 4.0.15

- [patch] Fixing the padding and the renderer bridge content [e550390](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e550390)

## 4.0.14

- [patch] Updated dependencies [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)
  - @atlaskit/editor-common@20.0.0
  - @atlaskit/editor-core@86.0.0
  - @atlaskit/renderer@29.0.0
  - @atlaskit/editor-json-transformer@4.0.18
  - @atlaskit/editor-test-helpers@6.2.7
  - @atlaskit/task-decision@11.0.1
  - @atlaskit/media-core@24.3.0

## 4.0.13

- [patch] Updated dependencies [8a1ccf2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a1ccf2)
  - @atlaskit/renderer@28.0.1
  - @atlaskit/editor-core@85.6.0
  - @atlaskit/task-decision@11.0.0

## 4.0.12

- [patch] Updated dependencies [6e510d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e510d8)
  - @atlaskit/editor-core@85.5.1
  - @atlaskit/editor-common@19.3.2
  - @atlaskit/media-core@24.2.2
  - @atlaskit/renderer@28.0.0

## 4.0.11

- [patch] Updated dependencies [2afa60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2afa60d)
  - @atlaskit/editor-common@19.0.0
  - @atlaskit/editor-core@85.0.0
  - @atlaskit/renderer@27.0.0
  - @atlaskit/editor-json-transformer@4.0.17
  - @atlaskit/editor-test-helpers@6.2.6
  - @atlaskit/media-core@24.2.0

## 4.0.10

- [patch] Updated dependencies [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [patch] Updated dependencies [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)
  - @atlaskit/editor-common@18.0.0
  - @atlaskit/editor-core@84.0.0
  - @atlaskit/renderer@26.0.0
  - @atlaskit/editor-json-transformer@4.0.16
  - @atlaskit/editor-test-helpers@6.2.5
  - @atlaskit/media-core@24.1.0

## 4.0.9

- [patch] Updated dependencies [23c7eca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/23c7eca)
  - @atlaskit/editor-json-transformer@4.0.15
  - @atlaskit/editor-test-helpers@6.2.4
  - @atlaskit/editor-core@83.0.0
  - @atlaskit/renderer@25.0.0

## 4.0.8

- [patch] change grey to gray to keep consistent across editor pkgs [1b2a0b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b2a0b3)

## 4.0.7

- [patch] ED-5424: fix telepointers in collab editing [643a860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/643a860)

## 4.0.6

- [patch] Updated dependencies [ef76f1f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef76f1f)
  - @atlaskit/editor-json-transformer@4.0.13
  - @atlaskit/editor-common@17.0.1
  - @atlaskit/editor-core@82.0.0
  - @atlaskit/editor-test-helpers@6.1.3

## 4.0.5

- [patch] Updated dependencies [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
  - @atlaskit/editor-common@17.0.0
  - @atlaskit/editor-core@81.0.0
  - @atlaskit/editor-test-helpers@6.1.2
  - @atlaskit/renderer@24.0.0
  - @atlaskit/editor-json-transformer@4.0.12
  - @atlaskit/media-core@24.0.0

## 4.0.4

- [patch] Remove mention calls from the bridge [3b04be7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3b04be7)

## 4.0.3

- [patch] ED-5346: prosemirror upgrade [5bd4432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5bd4432)

## 4.0.2

- [patch] Updated dependencies [2a6410f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2a6410f)
  - @atlaskit/editor-common@16.2.0
  - @atlaskit/editor-core@80.5.0
  - @atlaskit/renderer@23.0.0

## 4.0.1

- [patch] Fix the flash bug on scroll in iOS webviews [6c047b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c047b4)

## 4.0.0

- [major] Adding renderer to the mobile bridge [3b4c276](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3b4c276)

## 3.0.11

- [patch] Fixing the android bridge change [6d5e0a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d5e0a9)

## 3.0.10

- [patch] Fixing the scroll after setting content on Mobile [0a03e2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a03e2d)

## 3.0.9

- [patch] Fix the tap hightlight and padding [ffd3b8a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ffd3b8a)

## 3.0.8

- [patch] Updated dependencies [6e1d642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e1d642)
  - @atlaskit/editor-core@80.0.0
  - @atlaskit/editor-json-transformer@4.0.11
  - @atlaskit/editor-test-helpers@6.0.9
  - @atlaskit/media-core@23.2.0

## 3.0.7

- [patch] Sending block formatting changes separately [96c9414](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/96c9414)

## 3.0.6

- [patch] Making the media resolution aysnc [c6bacea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6bacea)

## 3.0.5

- [patch] Updated dependencies [7545979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7545979)
  - @atlaskit/editor-core@79.0.0
  - @atlaskit/editor-json-transformer@4.0.8
  - @atlaskit/media-core@23.1.0

## 3.0.4

- [patch] Updated dependencies [911a570](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/911a570)
  - @atlaskit/media-core@23.0.2
  - @atlaskit/editor-json-transformer@4.0.7
  - @atlaskit/editor-core@78.0.0

## 3.0.3

- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/mention@15.0.6
  - @atlaskit/editor-json-transformer@4.0.6
  - @atlaskit/editor-core@77.1.4

## 3.0.2

- [patch] Allow all nodes and fix load time on Mobile [a9080a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a9080a7)

## 3.0.1

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/mention@15.0.5
  - @atlaskit/editor-core@77.0.2

## 3.0.0

- [patch] Synchronous property "serviceHost" as part of many Interfaces in media components (like MediaApiConfig) is removed and replaced with asynchronous "baseUrl" as part of Auth object. [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
- [none] Updated dependencies [597e0bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/597e0bd)
  - @atlaskit/editor-json-transformer@4.0.4
  - @atlaskit/editor-core@77.0.0
- [none] Updated dependencies [61df453](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/61df453)
  - @atlaskit/editor-json-transformer@4.0.4
  - @atlaskit/editor-core@77.0.0
- [none] Updated dependencies [812a39c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/812a39c)
  - @atlaskit/editor-json-transformer@4.0.4
  - @atlaskit/editor-core@77.0.0
- [none] Updated dependencies [c8eb097](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8eb097)
  - @atlaskit/editor-json-transformer@4.0.4
  - @atlaskit/editor-core@77.0.0
- [major] Updated dependencies [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
  - @atlaskit/media-core@23.0.0
  - @atlaskit/editor-json-transformer@4.0.4
  - @atlaskit/editor-core@77.0.0

## 2.0.7

- [patch] Upgrade to webpack 4 [ea8a4bb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea8a4bb)
- [none] Updated dependencies [ea8a4bb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea8a4bb)

## 2.0.6

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/mention@15.0.2
  - @atlaskit/editor-json-transformer@4.0.3
  - @atlaskit/editor-core@76.4.5
  - @atlaskit/media-core@22.2.1

## 2.0.5

- [patch] Updated dependencies [f6bf6c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f6bf6c8)
  - @atlaskit/mention@15.0.0
  - @atlaskit/editor-core@76.1.0

## 2.0.4

- [patch] ED-4961 refactor block-type plugin [b88ca64](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b88ca64)
- [patch] Updated dependencies [b88ca64](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b88ca64)
  - @atlaskit/editor-core@76.0.23

## 2.0.3

- [patch] ED-4960, refactoring text formatting plugin. [f4a0996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f4a0996)
- [none] Updated dependencies [f4a0996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f4a0996)
  - @atlaskit/editor-core@76.0.16

## 2.0.2

- [patch] Fixing CSS issues [93d3ccf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93d3ccf)

## 2.0.1

- [none] Updated dependencies [25353c3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25353c3)
  - @atlaskit/editor-core@76.0.0
  - @atlaskit/editor-json-transformer@4.0.1
- [patch] Updated dependencies [38c0543](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/38c0543)
  - @atlaskit/editor-core@76.0.0
  - @atlaskit/editor-json-transformer@4.0.1

## 2.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/editor-json-transformer@4.0.0
  - @atlaskit/mention@14.0.0
  - @atlaskit/editor-core@75.0.0
  - @atlaskit/media-core@22.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/mention@14.0.0
  - @atlaskit/editor-json-transformer@4.0.0
  - @atlaskit/editor-core@75.0.0
  - @atlaskit/media-core@22.0.0

## 1.0.8

- [patch] Updated dependencies [c98857e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c98857e)
  - @atlaskit/mention@13.1.10
  - @atlaskit/editor-core@74.0.16
- [patch] Updated dependencies [8a125a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a125a7)
  - @atlaskit/mention@13.1.10
  - @atlaskit/editor-core@74.0.16
- [patch] Updated dependencies [cacfb53](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cacfb53)
  - @atlaskit/mention@13.1.10
  - @atlaskit/editor-core@74.0.16

## 1.0.7

- [patch] ED-4964: refactor lists state [81f1a95](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/81f1a95)
- [none] Updated dependencies [81f1a95](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/81f1a95)
  - @atlaskit/editor-core@74.0.1

## 1.0.6

- [patch] Updated dependencies [af0cde6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af0cde6)
  - @atlaskit/editor-core@74.0.0
  - @atlaskit/editor-json-transformer@3.1.7

## 1.0.5

- [none] Updated dependencies [8c711bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c711bd)
  - @atlaskit/editor-core@73.9.26
- [patch] Updated dependencies [42ee1ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42ee1ea)
  - @atlaskit/media-core@21.0.0
  - @atlaskit/editor-core@73.9.26

## 1.0.4

- [patch] Updated dependencies [d7dca64](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7dca64)
  - @atlaskit/mention@13.1.4
  - @atlaskit/editor-core@73.9.10

## 1.0.3

- [patch] Updated dependencies [8d5053e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d5053e)
  - @atlaskit/mention@13.1.3
  - @atlaskit/editor-json-transformer@3.1.5
  - @atlaskit/editor-core@73.9.5

## 1.0.2

- [patch] Updated dependencies [0cf2f52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0cf2f52)
  - @atlaskit/mention@13.1.2
  - @atlaskit/editor-json-transformer@3.1.4
  - @atlaskit/editor-core@73.9.2

## 1.0.1

- [patch] Updated dependencies [c57e9c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c57e9c1)
  - @atlaskit/editor-core@73.8.19
  - @atlaskit/media-core@20.0.0

## 1.0.0

- [major] Added support for blocks and lists [b5a920b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5a920b)
- [none] Updated dependencies [b5a920b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5a920b)
  - @atlaskit/editor-core@73.8.12

## 0.2.4

- [patch] Bump prosemirror-view to 1.3.3 to fix issue where newlines in code-blocks would vanish in IE11. (ED-4830) [fc5a082](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc5a082)
- [none] Updated dependencies [fc5a082](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc5a082)
  - @atlaskit/editor-core@73.8.3

## 0.2.3

- [patch] ED-4489 Fix can't submit with enter using Korean and Japanese IME [0274524](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0274524)
- [none] Updated dependencies [0274524](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0274524)
  - @atlaskit/editor-core@73.7.8

## 0.2.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/mention@13.1.1
  - @atlaskit/editor-json-transformer@3.1.2
  - @atlaskit/editor-core@73.7.5
  - @atlaskit/media-core@19.1.3

## 0.2.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/editor-json-transformer@3.1.1
  - @atlaskit/editor-core@73.7.1
  - @atlaskit/media-core@19.1.2

## 0.2.0

- [none] Updated dependencies [7217164](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7217164)
  - @atlaskit/editor-core@73.5.0
  - @atlaskit/mention@13.1.0
  - @atlaskit/editor-json-transformer@3.1.0

## 0.1.9

- [patch] Provided bridge implementation to support Media on iOS. [43875e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/43875e6)

## 0.1.8

- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/mention@13.0.0
  - @atlaskit/editor-json-transformer@3.0.9
  - @atlaskit/editor-core@73.0.0
  - @atlaskit/media-core@19.0.0

## 0.1.7

- [patch] Updated dependencies [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/mention@12.0.3
  - @atlaskit/editor-json-transformer@3.0.8
  - @atlaskit/editor-core@72.2.2

## 0.1.6

- [patch] Updated dependencies [639ae5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/639ae5e)
  - @atlaskit/mention@12.0.2
  - @atlaskit/editor-core@72.1.8

## 0.1.5

- [none] Updated dependencies [ba702bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ba702bc)
  - @atlaskit/mention@12.0.0
  - @atlaskit/editor-core@72.0.6

## 0.1.4

- [none] Updated dependencies [febc44d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febc44d)
  - @atlaskit/editor-core@72.0.0
  - @atlaskit/editor-json-transformer@3.0.7

## 0.1.3

- [none] Updated dependencies [8fd4dd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fd4dd1)
  - @atlaskit/mention@11.1.4
  - @atlaskit/editor-json-transformer@3.0.6
  - @atlaskit/editor-core@71.4.0

## 0.1.2

- [patch] Bump to prosemirror-view@1.3.0 [faea319](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/faea319)

## 0.1.0

- [minor] Media APIs exposed to mobile clients and can be used by native media components [31c66f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/31c66f4)

## 0.0.17

- [patch] Added missing dependencies and added lint rule to catch them all [0672503](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0672503)

## 0.0.14

- [patch] enabled minimization @ mobile bridge [95703e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/95703e3)

## 0.0.13

- [patch] Implemented setContent for editor mobile native-to-web bridge [b5c150b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5c150b)

## 0.0.11

- [patch] Fix running 'run.if.package.changed' script in cases like master branch or package being dependent only [d90ab10](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d90ab10)

## 0.0.9

- [patch] Small changes in build process for editor-mobile-bridge [78d543a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/78d543a)

## 0.0.8

- [patch] Upgrading ProseMirror Libs [35d14d5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d14d5)

## 0.0.3

- [patch] Fix dependency [d4bcbf4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d4bcbf4)

## 0.0.2

- [patch] editor-mobile-bridge module introduced [4a338f6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a338f6)
