# @atlaskit/renderer

## 81.1.1

### Patch Changes

- [`b85e7ce12cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b85e7ce12cd) - Internal upgrade of memoize-one to 6.0.0

## 81.1.0

### Minor Changes

- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - CETI-72 Web: Copy from renderer loses custom panel attributes
- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - AK-279 Moved copy button outside of heading, that made heading accessible
- [`6840e64d105`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6840e64d105) - CETI-124: Revert panel content wrapper from span to div

### Patch Changes

- Updated dependencies

## 81.0.0

### Minor Changes

- [`511f07f7f7b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/511f07f7f7b) - allow enabling download for media card via enableDownloadButton feature prop

### Patch Changes

- [`5fe6e21a9a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5fe6e21a9a0) - [ux] Upgrade to the latest version of @atlaskit/modal-dialog. This change includes shifting the primary button in the footer of the modal to be on the right instead of the left.
- [`b90c0237824`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b90c0237824) - Update package.jsons to remove unused dependencies.
- [`b95863772be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b95863772be) - Support external observers.
  Use better naming for refNode (refNode => reference).
  In favor of further work (supporting multiple references) pass array of references to Extension component.
  Expand node with localId for extentions.
- [`0bbd13a9a9c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0bbd13a9a9c) - Temporarily disabling VR tests (ED-13530)
- Updated dependencies

## 80.0.0

### Minor Changes

- [`ea1cb28fb03`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea1cb28fb03) - CETI-3 User is able to change emoji and background color when selected
- [`86aeb07cae3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/86aeb07cae3) - EDM-2264: allow embed resize events from all domains

  **Note:**

  The breaking change in this commit is a rename from `IframelyResizeMessageListener` to `EmbedResizeMessageListener`. The functionality of the component itself remains the same for all consumers.

### Patch Changes

- Updated dependencies

## 79.0.1

### Patch Changes

- [`21618e887d2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/21618e887d2) - Updates puppeteer to v10.

## 79.0.0

### Minor Changes

- [`450a8582760`](https://bitbucket.org/atlassian/atlassian-frontend/commits/450a8582760) - Added editor re-render analytics event.
- [`797ffbdcd7f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/797ffbdcd7f) - Update focus style for expand button, change aria-label to aria-labelled by

### Patch Changes

- [`db4a92b9e61`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db4a92b9e61) - ED-11460: Add Renderer Error Boundary
- Updated dependencies

## 78.0.0

### Minor Changes

- [`f3ccd83b464`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3ccd83b464) - [ux] AK-271 - Implement a separate focusable button for sorting table columns
- [`1075019cefe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1075019cefe) - Add NodeProps to Caption

### Patch Changes

- [`a3718b3de35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a3718b3de35) - AK-280 - Expand - Fix collapsed content is announced by screen readers
- Updated dependencies

## 77.1.0

### Minor Changes

- [`9fef23ee77c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fef23ee77c) - ED-12477 Add unsupported node capability to Media Group
- [`b847a71298d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b847a71298d) - ED-8245 added optional ability to render placeholder text in renderer
- [`9088388ab19`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9088388ab19) - [ux] ED-13080 revert implement a separate button for sorting table columns

### Patch Changes

- [`d05cb164f3f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d05cb164f3f) - NO-ISSUE dereference default export of async imported modules for better interop
- Updated dependencies

## 77.0.1

### Patch Changes

- Updated dependencies

## 77.0.0

### Minor Changes

- [`084abc13201`](https://bitbucket.org/atlassian/atlassian-frontend/commits/084abc13201) - ED-12265 Add unsupport content support to media single
  ED-12265 Remove `caption` from default schema - Renderer

### Patch Changes

- [`88a1b60b052`](https://bitbucket.org/atlassian/atlassian-frontend/commits/88a1b60b052) - ED-12789 fixed chart macro doesn't respect width adjustment
- [`f582254da39`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f582254da39) - [ME-1434] Set max font size on Hybrid Editor and Renderer.
  [ME-1450] Fix decision panel overlap.
- Updated dependencies

## 76.3.0

### Minor Changes

- [`50deb33bb0d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50deb33bb0d) - Make code block scale to device font size in the Hybrid Renderer.
- [`4c05694bca8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c05694bca8) - Changed componentName to renderer in AnalyticsContext.

### Patch Changes

- Updated dependencies

## 76.2.0

### Minor Changes

- [`eb2ccccfa14`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb2ccccfa14) - ED-12514: Add sampling rate controls to unsupported content levels tracking

### Patch Changes

- [`fda67081c09`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fda67081c09) - ED-12408 Fix annotation selection over links and other text with regex-like syntax
- [`ac2eeccc60b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac2eeccc60b) - Update internal use of code block selector in editor packages.
- [`7ba7af04db8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ba7af04db8) - Type fixes related to consumption of `@atlaskit/code`
- Updated dependencies

## 76.1.1

### Patch Changes

- [`c2c0160f566`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2c0160f566) - Bump editor-shared-styles to pick up relativeFontSizeToBase16
- Updated dependencies

## 76.1.0

### Minor Changes

- [`23de387a004`](https://bitbucket.org/atlassian/atlassian-frontend/commits/23de387a004) - ED-12183 - add top margin to extension wrapper

### Patch Changes

- [`5c835144ef0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c835144ef0) - [ME-741][me-743] Remove PX references in editor packages and modify code block font size.
- Updated dependencies

## 76.0.0

### Patch Changes

- [`e2260ead0c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e2260ead0c9) - [ME-1099] Fix image spacing in tables in the mobile renderer.
- [`58b170725be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58b170725be) - Renamed @atlaskit/editor-test-helpers/schema-builder to @atlaskit/editor-test-helpers/doc-builder
- [`2a8ef3203cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2a8ef3203cf) - Fix event handlers for fallback card
- Updated dependencies

## 75.0.0

### Minor Changes

- [`ada3c26e788`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ada3c26e788) - Add text rendering support for inlineCard node
- [`6d748ea5140`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6d748ea5140) - New stage-0 data consumer mark in ADF schema
- [`efdcfff1c0b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/efdcfff1c0b) - Add text rendering support for date node
- [`b5065367a66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b5065367a66) - Improve rendering of the status node in plain text: done -> [ DONE ]

### Patch Changes

- [`e6bd5669a53`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6bd5669a53) - ED-10888 Deduplicate AJV initialization from our codebase
- [`d2e70ebaaa9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2e70ebaaa9) - NO-ISSUE: updated editor tests to use 'doc: DocBuilder' instead of 'doc: any'
- [`fe1c96a3d28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe1c96a3d28) - added DocBuilder type to @atlaskit/editor-test-helpers, replaced duplicate definitions and DocumentType
- Updated dependencies

## 74.1.1

### Patch Changes

- [`1330382a0af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1330382a0af) - Fix event handlers for fallback card

## 74.1.0

### Minor Changes

- [`4f08f25ebfe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f08f25ebfe) - NO-ISSUE pass through feature flags into renderer

### Patch Changes

- [`1f0d35a781f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f0d35a781f) - Links on images now open in the same tab
- [`ef16937952e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ef16937952e) - CCP-853 Remove react-dom/server from client-side
- [`695ce4fe717`](https://bitbucket.org/atlassian/atlassian-frontend/commits/695ce4fe717) - Adds additional request access metadata to forbidden urls if avalible
- Updated dependencies

## 74.0.1

### Patch Changes

- [`cf929eb9816`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf929eb9816) - ED-10336 Add unique ID on renderer performance mark

## 74.0.0

### Minor Changes

- [`848d9fb54a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/848d9fb54a3) - ED-11875 align renderer to editor tab size in code-block

### Patch Changes

- [`a2d44651925`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2d44651925) - ED-11161: Track unsupported content levels severity in renderer
- Updated dependencies

## 73.2.0

### Minor Changes

- [`7ddbf962bd9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ddbf962bd9) - [ux] Updated and added new translations

### Patch Changes

- [`32613148067`](https://bitbucket.org/atlassian/atlassian-frontend/commits/32613148067) - Move DisableActions, DisableMediaLinking, allowAnnotaions, allowHeadingAnchorLinks feature flags from query param to rendererConfiguration
- [`5857b17788b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5857b17788b) - Change the way kitchen sink shows ADF errors
- [`6616714be75`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6616714be75) - Fix renderer-bridge configuration changes not occuring
- [`9d1bc4dde94`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d1bc4dde94) - [ux] As part of the bump to @atlaskit/code, the codeBlock element's visual appearance has been modified in renderer and editor-core. Specifically the fontSize and lineHeight have been made more consistent with the DS parent package.
- Updated dependencies

## 73.1.0

### Minor Changes

- [`949c7174a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/949c7174a4) - [ux] ED-11625: scope select all to renderer document

### Patch Changes

- Updated dependencies

## 73.0.0

### Major Changes

- [`52003c2c47`](https://bitbucket.org/atlassian/atlassian-frontend/commits/52003c2c47) - [ED-10690][renderer] Remove bodied extension analytics event and renderNodes function.

### Patch Changes

- [`4acc86197e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4acc86197e) - [TWISTA-535] Removed unused isAnnotationAllowed boolean from bridge communication, it's breaking change but not used on both iOS & Android
- [`73d5cb22dd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73d5cb22dd) - Ensure gap cursor ignores a click on a caption node
- [`e797f23ec3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e797f23ec3) - ED-10441: ensure code-block is WYSIWYG
- Updated dependencies

## 72.0.0

### Minor Changes

- [`c7e408f3c8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c7e408f3c8) - [ux] Embed smart cart resizing now can dynamically change height when content is coming from a public resolver powered by iframe.

### Patch Changes

- [`81a5e08f06`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81a5e08f06) - Fix divider not visible in dark mode
- Updated dependencies

## 71.0.0

### Minor Changes

- [`dfd440f4b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfd440f4b5) - [ux] New functionality to add and remove captions to images and videos. Select an image or video in the editor to start using it!
  editor-core now exports dedupe which aids in not having duplicate plugins added when initialising an editor
- [`e2c3b5cf75`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e2c3b5cf75) - [TWISTA-429] Prevents useLoadAnnotations requesting annotations states when there is an empty array of Annotations received from actions"

### Patch Changes

- [`f51a912369`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f51a912369) - CMB-2437: Added VR tests for the Date node in both Editor and Renderer packages
- [`291910c1db`](https://bitbucket.org/atlassian/atlassian-frontend/commits/291910c1db) - [ux] ED-10741 Remove legacy UI/UX for heading anchor links.

  Nested header links is enabled using the `allowHeadingAnchorLinks` editor prop.

  Recently it was converted from a boolean to an object to support heading links within nested containers such as tables, layouts, and expands.
  e.g. `allowHeadingAnchorLinks { allowNestedHeaderLinks: true }`

  Enabling this opted into a new, revised UI/UX for the copy link button adjacent to a heading.

  Now that this feature has been adopted by Confluence and rolled out to 100% of customers, this change removes the code for the legacy UI/UX
  since we have no desire to ever use it again. This will reduce the bundle size slightly.

- [`4c6c92aee6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c6c92aee6) - Fix rendering of captions
- [`3e825d3253`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e825d3253) - pass featureFlags to getMediaClient in MediaCard renderer node
- [`b4b07b8547`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4b07b8547) - [ux] ED-10847 Restore right aligned headings copy link button to flip to the left of the heading text.
- Updated dependencies

## 70.0.3

### Patch Changes

- [`cea22d0f03`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cea22d0f03) - pass featureFlags to media-client

## 70.0.2

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc
- Updated dependencies

## 70.0.1

### Patch Changes

- [`908990b928`](https://bitbucket.org/atlassian/atlassian-frontend/commits/908990b928) - Fix mobile link for media

## 70.0.0

### Minor Changes

- [`28e97db5a7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/28e97db5a7) - TWISTA-407 Expose the Confluence index match API to native. On applying draft mode, the bridge will call `annotationIndexMatch` with the `numMatch`, `matchIndex`, `originalSelection` tuple that is required by Confluence.
- [`d13ccbd6c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d13ccbd6c3) - [ux][twista-523] Fixed a bug in Safari/iOS where inline comment overlapping link would open url into current webView

### Patch Changes

- [`0175a00afc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0175a00afc) - [ED-10670] Update prosemirror-model type to use posAtIndex methods
- [`d6c23f1886`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6c23f1886) - Added dark mode support to table cell background colors
- [`7ba05e4164`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ba05e4164) - EDM-1372: Default to akEditorFullPageMaxWidth when WidthConsumer is 0
- [`be5392f4a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be5392f4a4) - EDM-1395: Update analytic subject names for image linking
- [`3c263cb2df`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c263cb2df) - Added error handling when calling media client getCurrentState()
- [`f50e5d16b1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f50e5d16b1) - CMB-2438: Added dark mode VR tests for tables in both Editor and Renderer
- Updated dependencies

## 69.1.0

### Minor Changes

- [`988bc9cfc9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/988bc9cfc9) - ED-10676: ADF scrub util

### Patch Changes

- Updated dependencies

## 69.0.0

### Minor Changes

- [`964b2be0e5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/964b2be0e5) - ED-9514 Fix Media in MediaSingle not rendererd on web and hybrid renderer when unsupported node attributes and/or unsupported marks are included.
- [`1e59fd65c5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e59fd65c5) - ED-8720 Add OnUnhandledClickHandler for Renderer
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

### Patch Changes

- [`ba19b25a11`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba19b25a11) - ED-8006 Prevent clicks on action checkboxes from triggering table header sorting
- [`b13e3991ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b13e3991ef) - ED-10723: severity for rendered event
- [`703752d487`](https://bitbucket.org/atlassian/atlassian-frontend/commits/703752d487) - ED-10647 Remove caret from prosemirror-model, prosemirror-keymap, prosemirror-state, prosemirror-transform to lock them down to an explicit version
- [`330da4d675`](https://bitbucket.org/atlassian/atlassian-frontend/commits/330da4d675) - Update translations via Traduki from issue/translation-2020-10-08T000543
- Updated dependencies

## 68.0.1

### Patch Changes

- [`240dd9bdbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/240dd9bdbb) - [ux] ED-10839 Revert RTL text to restore predictability of right aligned heading text

## 68.0.0

### Minor Changes

- [`b6b8b7ab25`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6b8b7ab25) - ED-10678 | Add analytics to bodiedExtension to determine if ADF content is passed to it
- [`1bd404254e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1bd404254e) - ED-10547 Analytics for delete annotations

### Patch Changes

- [`4b2c7ce81c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b2c7ce81c) - ED-10580: Fix duplicate i18n ids
- [`e4abda244e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4abda244e) - ED-9912: replace prosemirror-tables with editor-tables
- [`03d3e74853`](https://bitbucket.org/atlassian/atlassian-frontend/commits/03d3e74853) - [ux] ED-10540, ED-10149 Improve Heading Alignment when Heading Links are enabled.

  The following changes only apply when these feature flags are enabled:

  1. `confluence.frontend.fabric.renderer.heading.anchor` which shows copy anchor link buttons next to heading text within the renderer.
  2. `confluence.frontend.open.expand.when.following.link` which opts into the new copy anchor link UI/UX as well as supporting them within expand nodes.

  When a heading is **left aligned**:

  - No change.

  When a heading is **center aligned**:

  - The copy link button is now detached from the text so that it doesn't impact centering.
  - This respects the user's intention and resembles how it behaves in the legacy copy link button UI/UX.

  When a heading is **right aligned**:

  - The copy link button is now flipped to the left of the right aligned heading text.
  - The heading text is now flush against the edge of the content area.
  - This respects the user's intention and resembles how it behaves in the legacy copy link button UI/UX.

  When a heading is **inside a table header cell** and table _column sorting is enabled_:

  - Headings inside a table header cell now wrap once they reach the column sorting button instead of going behind it.

- [`d99590d680`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d99590d680) - [ux] ED-10376: added support for custom panels in renderer

  - convert Panel to functional component
  - added support for dark mode in renderer 99-testing.tsx

- [`02ea8214a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/02ea8214a0) - EDM-1320 fixed linked image overlaps table sorting button
- [`56fe4bb199`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56fe4bb199) - TWISTA-367 Add new method for annotation bounding rect for mobile bridge renderer
- Updated dependencies

## 67.0.3

### Patch Changes

- [`679a66bd92`](https://bitbucket.org/atlassian/atlassian-frontend/commits/679a66bd92) - Fix for renderer SSR inline script when server side bundle is minimized

## 67.0.2

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.
- Updated dependencies

## 67.0.1

### Patch Changes

- [`9798ad1405`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9798ad1405) - Remove deep import paths of dependencies in TS declaration files
- Updated dependencies

## 67.0.0

### Major Changes

- [`225c901919`](https://bitbucket.org/atlassian/atlassian-frontend/commits/225c901919) - ED-10351 add API to delete the annotation

### Minor Changes

- [`79fb301be8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79fb301be8) - ED_9523 add tooltip for unsupported content
- [`88922bed79`](https://bitbucket.org/atlassian/atlassian-frontend/commits/88922bed79) - ED-10173 added support of unsupportedNodeAttribute to renderer
- [`0d610ee228`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0d610ee228) - Adjust copy link icon size depending on the Header size
- [`c87260e582`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c87260e582) - ED-10071 localization support for renderer
- [`64b147b2f5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/64b147b2f5) - ED-10408 updated image linking style for renderer
- [`9a39500244`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a39500244) - Bump ProseMirror packages

  Read more: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1671956531/2020-08

### Patch Changes

- [`0ac3eff13b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ac3eff13b) - TWISTA-176 Added analytics for inline comments in renderer
- [`e639f4a7c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e639f4a7c9) - fix copy to clipboard button flickering
- [`3e2b7316c8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e2b7316c8) - Fix bug for Nested Header Links, inside a table header it does a table sort whenever you click the copy link
- [`e0876d4a03`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0876d4a03) - CSS fix to ensure consistency in image wrapping breaking to new line
- [`29125844ca`](https://bitbucket.org/atlassian/atlassian-frontend/commits/29125844ca) - CEMS-1173: fix content clipping behind sticky header on 90% zoom
- [`02ad57c335`](https://bitbucket.org/atlassian/atlassian-frontend/commits/02ad57c335) - Added theming and dark mode colors to the Expand node
- [`a0a287e01f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a0a287e01f) - ED-8001 fix copy table in renderer on firefox.
- [`d63f13033a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63f13033a) - [ux] ED-10055 Enable visually persistent Heading Anchor Links for the mobile renderer.

  - Refactors the `headingAnchorStyle` CSS styles relating to heading anchor links to remove hover effects by default.
  - It now uses feature detection to apply the hover effects to systems which support hover (e.g. Desktop)
  - Mobile uses the default styling resulting in always displays the link buttons.

- [`78b192acc9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78b192acc9) - ED-10169 Update imports for style constants from @atlaskit/editor-common to @atlaskit/editor-shared-styles
- [`686aea926c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/686aea926c) - [ED-10294] Renderer: Style list items by absolute indentation level
- [`9f21deb3bb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f21deb3bb) - Adding theming support and dark mode colors to table cell backgrounds
- [`efed95f82e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/efed95f82e) - [ux] TWISTA-366 disabled touch feedback on annotations
- Updated dependencies

## 66.0.0

### Patch Changes

- Updated dependencies

## 65.0.1

### Patch Changes

- Updated dependencies

## 65.0.0

### Major Changes

- [`78de49291b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78de49291b) - [TWISTA-130] Implements ViewComponent prop for AnnotationProviders

  # Breaking Change:

  ## WHAT

  AnnotationContext is not export anymore.

  before

  ```
  import { AnnotationContext } from '@atlaskit/renderer'

  ```

  ## WHY

  This was temporary until we defined the Provider.

  ## HOW

  The Annotation on Renderer was experimental. Probably, you were not using it.

  # Minor Change:

  ## WHAT

  AnnotationProvider can receive a ViewComponent. This component will be mounted when the user clicks into an inline comment.

- [`3711c0a754`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3711c0a754) - remove ADNode support from ExtensionRenderer

### Minor Changes

- [`5a14bab0bf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a14bab0bf) - ED-10112 Add analytics for unwrapped unsupported contents
- [`caae78bb98`](https://bitbucket.org/atlassian/atlassian-frontend/commits/caae78bb98) - Adds support for unsupportedBlock and unsupportedInline content analytics for Hybrid Editor and Hybrid Renderer.
- [`a66b0a0d44`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a66b0a0d44) - ED-9497 Adds analytics to track unsupported Marks and Mark Attributes in editor and renderer.
- [`c8cf7f9419`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8cf7f9419) - ED-9623:

  This piece of work includes:

  - Adopting the api changes on `Renderer` to be able to open an expand that wraps a header that the user want to scroll to. This will change the bridge methods in order to have the expand opened beforehand:

    - `getContentNodeScrollOffset` -> Api is unchanged, but if the header is inside an expand, it will open the expand asynchronously.
    - **BREAKING CHANGE**: `scrollToContentNode` -> will return `void` instead of a boolean value as before, and if the header is inside an expand, it will scroll to the header once the expand is opened in such case.

  - Creating a query param `allowHeadingAnchorLinks` to enable/disable the entire feature on `Renderer`:
    - `allowHeadingAnchorLinks=false` -> will disable everything regarding headings
    - `allowHeadingAnchorLinks=true` -> will enable new nested header behaviour but the UI will not be enabled for mobile (see point bellow)
  - Disable UI for `mobile`/`comment` appearance: we need to enable the new expand behaviour but we don’t want to render the copy link button on those appearances.

- [`e313fc34d3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e313fc34d3) - ED=9648-Update-Header implemeneted the new designs for the Nested Header Anchor Links. It is also backward compatible
- [`c4b1cbec82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c4b1cbec82) - ED-8344 Unsupported content type lozenge for block and inline in editor and renderer
- [`48f6497c39`](https://bitbucket.org/atlassian/atlassian-frontend/commits/48f6497c39) - [TWISTA-343] Fix annotation click event to send only the actived ids
- [`9096846553`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9096846553) - ED-10006: Added copy to clipboard functionality for the code block in renderer

### Patch Changes

- [`9c25171c24`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9c25171c24) - TWISTA-242 fixed validating full line selection for annotations
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

- [`35bf6c0738`](https://bitbucket.org/atlassian/atlassian-frontend/commits/35bf6c0738) - TWISTA-317 fixed issue with extra text highlighted when commenting on a link
- [`234df7a24a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/234df7a24a) - Rollback UI changes for Nested Headers + enable NHAL only in expands
- [`1b971d8e2c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1b971d8e2c) - [TWISTA-346] Fix font color on Annotation Draft mode
- [`8a2e5225d5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a2e5225d5) - Added theming and dark mode colors to the Date node
- [`05350d8f0c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/05350d8f0c) - TWISTA-276 added draft annotation styles in renderer
- [`9468594ef9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9468594ef9) - **Ticket:** EDM-1120

  **Changes:**

  - Refactored Card Link `view` tests to separate files to be more maintainable;
  - Added unit tests to all Card Link actions;
  - Added unit tests to Card Link PreviewAction;
  - Added `openPreviewState` and `waitForPreviewState` selectors for VR tests;
  - Added VR test in Editor for Preview State;
  - Added VR test in Renderer for Preview State.

- [`c4a9fdd4da`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c4a9fdd4da) - TYPH-236 Use innerRef property if passed instead of creating a new one
- [`11fd2197eb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/11fd2197eb) - ED-9933: Disable header links within tables even when nested header links are enabled via `{ allowHeadingAnchorLinks: { allowNestedHeaderLinks: true }}`
- [`21131ce6be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/21131ce6be) - [TWISTA-283, TWISTA-282, TWISTA-241] Normalizes and fixes Annotation range validator logic for Renderer and Editor

  @atlaskit/editor-common: It creates canApplyAnnotationOnRange function
  @atlaskit/editor-core: It moves current hasInvalidNodes logic to editor-common function
  @atlaskit/renderer: It replaces current logic to use the same as Editor

- [`227581c8f4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/227581c8f4) - [TWISTA-348] Fixes changing user range after a draft annotation starts
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

- [`7315203b80`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7315203b80) - Rename `AkCode` and `AkCodeBlock` exports to `Code` and `CodeBlock` for `@atlaskit/code`.
- [`fba7eda75d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fba7eda75d) - [TWISTA-344] Fixes remove annotation focus on Renderer
- [`335cc0e6cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/335cc0e6cd) - ED-9954 Fixed media link layout
- [`0100b2c907`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0100b2c907) - [TWISTA-157] changed the reflow detector to use resize observer if available and also refactored where this API lives as it was in the wrong place.
- [`59a31dbd73`](https://bitbucket.org/atlassian/atlassian-frontend/commits/59a31dbd73) - [TWISTA-349] Fixes creating annotation in nested marks
- Updated dependencies

## 64.0.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 64.0.1

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 64.0.0

### Minor Changes

- [`fe31ba459f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe31ba459f) - ED-8198 Include Spec based validator behind toggle for Renderer
- [`b932cbbc42`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b932cbbc42) - Added support for rendering image captions
- [`62eb1114c4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62eb1114c4) - Enable passing of MediaFeatureFlags through Editor Renderer via MediaOptions to Media components

### Patch Changes

- [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the 'lodash' package instead of single-function 'lodash.\*' packages
- [`6fbaccca68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6fbaccca68) - ED-7786 (ED-7785, ED-7786) fix table content overlow (e.g. dates) when columns widths are smaller than the content
- [`a93d423be6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a93d423be6) - [TWISTA-218] Implements the Mobile Bridge API methods to works with Inline Comments on Renderer
  [TWISTA-146] Remove previous annotation highlight before focus in another one
- Updated dependencies

## 63.0.0

### Minor Changes

- [`e6b946351c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6b946351c) - Prop `allowHeadingAnchorLinks` can now be boolean or a config object.
  When the prop is `true`, heading anchor links will be enabled only on the top level of the document.
  When the prop is set to `{ allowNestedHeaderLinks: true }` we will enable the new UI for heading anchor links,
  and they can be supported everywhere: in tables, panels, expands, etc.
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

- [`fe8d48c4d1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe8d48c4d1) - ED-9428 Updated UI and UX for Header Links. The new UI is used when the `allowNestedHeadingAnchorLinks` prop is enabled.

### Patch Changes

- [`dbe5030111`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dbe5030111) - CCCEM-1786 Unify panel styling between renderer and editor
- [`4f705f6468`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f705f6468) - Memoize getNodeRenderer in ExtensionRenderer to avoid unnecessary remounting of extensions
- [`ea8c96f505`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea8c96f505) - Adding support to scroll to headers inside expands, by providing a new prop `activeHeadingId` within
  the config object `allowHeadingAnchorLinks` in renderer props.
  When `activeHeadingId` is set to a valid heading id, then it will search for any expand that wraps it,
  and if any, it will open if before hand. This will give the ability for the consumer to scroll to the heading id properly.
- [`c72502e22a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c72502e22a) - ED-9594: Remove cursor pointer from decision items in renderer
- Updated dependencies

## 62.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 61.1.0

### Minor Changes

- [`a4948958c4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4948958c4) - [FM-3820] Implements to set annotation state event on Renderer
- [`ea81ff42a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea81ff42a0) - [FM-3819] Implements a subscriber API to allows set focus in an specific annotation

### Patch Changes

- [`82053beb2d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/82053beb2d) - ED-8944 fix: propagete width updates after scrolling
- [`b95b4f6374`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b95b4f6374) - CEMS-1067: fix breakout mode in mobile renderer appearance
- [`63aab9186d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63aab9186d) - CEMS-1099: fix positioning of sticky header when table would be outside viewport
- [`d8562972e4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d8562972e4) - CEMS-1131: allow animation on sticky headers

  `div[mode="stick"]` will receive a `top` CSS property only in sticky mode. When in `pin-bottom` mode, its `top` position is applied to its relatively positioned parent. When not in sticky mode, neither of these elements will receive a `top` value.

  This lets you animate any `offsetTop` changes using something like:

  ```
  div[mode="stick"] {
    transition: top 0.25s ease;
  }
  ```

- Updated dependencies

## 61.0.0

### Major Changes

- [`cd6af0a113`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd6af0a113) - CEMS-1040: rework sticky headers internally + match visual style to editor

  There is a breaking change to the `stickyHeaders.showStickyHeaders` prop. It has been renamed to `stickyHeaders.show`. You can also show sticky headers by passing a truthy value to `stickyHeaders`.

### Minor Changes

- [`fb1a9c8009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb1a9c8009) - [FM-3726] Call onAnnotationClick when user taps in inline comment on Renderer
- [`0ae829a4ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ae829a4ea) - EDM-648: Adds resizing and alignment to embed cards

### Patch Changes

- [`1508cc97c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1508cc97c9) - fix: lazy-rendering, React key, isFrameVisible in @atlaskit/renderer and click handlers for EmbedCard components.
- [`366dd3e743`](https://bitbucket.org/atlassian/atlassian-frontend/commits/366dd3e743) - CEMS-1103: fix sticky header row not aligning with content
- [`7c75ddf54f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c75ddf54f) - [EDM-704]: Fix EmbedCard UI issues
- [`996e045cc4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/996e045cc4) - EDM-776: add platform prop to @atlaskit/smart-card for rendering fallback on mobile (embed -> block)
- [`71a4de3370`](https://bitbucket.org/atlassian/atlassian-frontend/commits/71a4de3370) - ED-9524 Prevent right side shadow from overlapping product UI elements
- Updated dependencies

## 60.0.0

### Minor Changes

- [`c41b33f7af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c41b33f7af) - ED-9251: Add support to RendererActions for validating a range to apply an annotation to
- [`e30894b112`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e30894b112) - [FM-3716] First Inline Comments implementation for Renderer
- [`177421dd67`](https://bitbucket.org/atlassian/atlassian-frontend/commits/177421dd67) - ED-9207: Add ability to remove annotations from the renderer
- [`5f9c856055`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f9c856055) - ED-9221: Add support for adding annotations at deeper depths
- [`50c333ab3a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50c333ab3a) - EDM-216: Adds EmbedCards in the Editor under the flag - allowEmbeds in the UNSAFE_cards prop

### Patch Changes

- [`f82edca013`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f82edca013) - ED-9298: Fix media sizing when default conatiner width is 760
- [`3ce990ebd4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3ce990ebd4) - ED-9226: Fixes bug where having a Range end in the middle of an inline would create an incorrect annotation
- [`0964848b95`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0964848b95) - [FM-3505] Add support for inline comments in the renderer mobile bridge getElementScrollOffsetByNodeType function
- [`f82edca013`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f82edca013) - ED-9298: Fix media size after changing default container width to 760px in renderer
- [`8d91382fb1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d91382fb1) - ED-9214: When creating an annotation we can identify marks rather than guessing inline nodes.
- [`d9ef0a849a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9ef0a849a) - ED-9232: fix ssr rendering for tables after sticky headers change
- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove unused dependencies
- [`93daf076e4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93daf076e4) - fix: bugs with Block Links - floating menu placement, spacing, editing of link title or source, lazy loading.
- [`baaad91b65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/baaad91b65) - Updated to use the latest and more performant version of `@atlaskit/avatar`
- Updated dependencies

## 59.0.1

### Patch Changes

- Updated dependencies

## 59.0.0

### Major Changes

- [`e97f14eade`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e97f14eade) - ED-9155: Rename prop `extensionParams` to `node` in the extensions api v2

### Minor Changes

- [`8bc9f3e9af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8bc9f3e9af) - ED-8942: Changed default font size for full width editor and renderer

  - Previously default font size for full page editor was 14px. Now, when `allowDynamicTextSizing` is disabled it equals to 16px.
  - Font size in table was 14px, ignoring dynamic text sizing font size, after this change it follows the same rules as the rest of the editor, namely it will get updated font size.- [`403377ca1a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/403377ca1a) - ED-8997: Implements creating marks on basic text selections

### Patch Changes

- [`6c0647b10a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c0647b10a) - ED-9225: Ensure position counting naming is less generic (start -> renderer-start-pos)- [`9b1a0d0033`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b1a0d0033) - ED-8358 Revert making decisions background grey- [`331a030a54`](https://bitbucket.org/atlassian/atlassian-frontend/commits/331a030a54) - ED-9177: Block creation when selection contains nodes which cannot be annotated- [`56a7357c81`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56a7357c81) - ED-9197: upgrade prosemirror-transform to prevent cut and paste type errors

  It's important to make sure that there isn't any `prosemirror-transform` packages with version less than 1.2.5 in `yarn.lock`.- [`d895d21c49`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d895d21c49) - ED-9176: add annotations to task and decisions- Updated dependencies

## 58.0.0

### Minor Changes

- [minor][5f075c4fd2](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f075c4fd2):

  ED-9033: Add initial API for Renderer Actions

  You can access the new API via `@atlaskit/renderer/actions`.
  Available exports include: `RendererActionsContext`, and `WithRendererActions`

  Renderer Actions interface:

  ```
  interface RendererActionsOptions {
    annotate: (
      range: Range,
      annotationId: string,
      annotationType: 'inlineComment',
    ) =>
      | {
          step: Step;
          doc?: ADFDoc;
        }
      | undefined;
  }
  ```

  An example setup would look like:

  ```
  import {
   RendererActionsContext as RendererContext,
   WithRendererActions
  } from '@atlaskit/renderer/actions';
  ```

function App() {
return (
<RendererContext>
<WithRendererActions render={(actions) => {
// actions.annotate is available now
return (
<Renderer />
)
}}>
</RendererContext>
)
}

`````
### Patch Changes

- Updated dependencies [3b776be426](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b776be426):
- Updated dependencies [999fbf849e](https://bitbucket.org/atlassian/atlassian-frontend/commits/999fbf849e):
- Updated dependencies [4d8d550d69](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d8d550d69):
- Updated dependencies [3940bd71f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/3940bd71f1):
- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [92d04b5c28](https://bitbucket.org/atlassian/atlassian-frontend/commits/92d04b5c28):
- Updated dependencies [d6eb7bb49f](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6eb7bb49f):
- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [22704db5a3](https://bitbucket.org/atlassian/atlassian-frontend/commits/22704db5a3):
- Updated dependencies [f6667f2909](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6667f2909):
- Updated dependencies [f7f2068a76](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7f2068a76):
- Updated dependencies [acc12dba75](https://bitbucket.org/atlassian/atlassian-frontend/commits/acc12dba75):
- Updated dependencies [167a55fd7a](https://bitbucket.org/atlassian/atlassian-frontend/commits/167a55fd7a):
- Updated dependencies [1156536403](https://bitbucket.org/atlassian/atlassian-frontend/commits/1156536403):
- Updated dependencies [2e52d035cd](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e52d035cd):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [cf41823165](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf41823165):
- Updated dependencies [aec7fbadcc](https://bitbucket.org/atlassian/atlassian-frontend/commits/aec7fbadcc):
- @atlaskit/smart-card@13.2.0
- @atlaskit/editor-common@45.1.0
- @atlaskit/media-card@67.2.1
- @atlaskit/tooltip@15.2.6
- @atlaskit/button@13.3.11
- @atlaskit/adf-schema@9.0.1
- @atlaskit/icon@20.1.1
- @atlaskit/logo@12.3.4
- @atlaskit/code@11.1.5
- @atlaskit/avatar@17.1.10
- @atlaskit/adf-utils@9.2.0
- @atlaskit/navigation-next@8.0.4
- @atlaskit/task-decision@16.0.11
- @atlaskit/editor-json-transformer@7.0.11
- @atlaskit/editor-test-helpers@11.1.1

## 57.0.0

### Minor Changes

- [minor][c74cc954d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/c74cc954d8):

ED-8941: Add inline script to properly resize breakout nodes after ssr- [minor][16c193eb3e](https://bitbucket.org/atlassian/atlassian-frontend/commits/16c193eb3e):

FM-3455: New prop `disableActions` to disable all actions in renderer.- [minor][1a48183584](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a48183584):

ED-8986 feat: guard media links with media.allowLinking feature prop- [minor][0b22d3b9ea](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b22d3b9ea):

CEMS-889: add support for sticky headers in renderer

### Patch Changes

- [patch][258a36b51f](https://bitbucket.org/atlassian/atlassian-frontend/commits/258a36b51f):

pass props.document as adf document instead of window.document- [patch][109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):

Deletes internal package @atlaskit/type-helpers and removes all usages. @atlaskit/type-helpers has been superseded by native typescript helper utilities.- [patch][de6548dae5](https://bitbucket.org/atlassian/atlassian-frontend/commits/de6548dae5):

ED-8884 fixed alt text on external images in renderer- [patch][9dd4b9088b](https://bitbucket.org/atlassian/atlassian-frontend/commits/9dd4b9088b):

EDM-563: Adding onClick handlers to BlockCard to Renderer handling- [patch][17a46dd016](https://bitbucket.org/atlassian/atlassian-frontend/commits/17a46dd016):

CEMS-889: re-apply sticky styles to tables if renderer props change- [patch][67bc25bc3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/67bc25bc3f):

Move WidthObserver from editor-common to width-detector

WidthObserver is a more performant version of WidthDetector and should be used going forward.

````js
import { WidthObserver } from '@atlaskit/width-detector';

<WidthObserver
  setWidth={width => console.log(`width has changed to ${width}`)}
/>;
`````

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
- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
- Updated dependencies [f061ed6c98](https://bitbucket.org/atlassian/atlassian-frontend/commits/f061ed6c98):
- Updated dependencies [4070d17415](https://bitbucket.org/atlassian/atlassian-frontend/commits/4070d17415):
- Updated dependencies [5d430f7d37](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d430f7d37):
- Updated dependencies [7e26fba915](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e26fba915):
- Updated dependencies [49dbcfa64c](https://bitbucket.org/atlassian/atlassian-frontend/commits/49dbcfa64c):
- Updated dependencies [e9d555132d](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9d555132d):
- Updated dependencies [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies [05539b052e](https://bitbucket.org/atlassian/atlassian-frontend/commits/05539b052e):
- Updated dependencies [5f8e3caf72](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f8e3caf72):
- Updated dependencies [318a1a0f2f](https://bitbucket.org/atlassian/atlassian-frontend/commits/318a1a0f2f):
- Updated dependencies [9691bb8eb9](https://bitbucket.org/atlassian/atlassian-frontend/commits/9691bb8eb9):
- Updated dependencies [11ff95c0f0](https://bitbucket.org/atlassian/atlassian-frontend/commits/11ff95c0f0):
- Updated dependencies [ae426d5e97](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae426d5e97):
- Updated dependencies [692692ba24](https://bitbucket.org/atlassian/atlassian-frontend/commits/692692ba24):
- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies [205b05851a](https://bitbucket.org/atlassian/atlassian-frontend/commits/205b05851a):
- Updated dependencies [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies [823d80f31c](https://bitbucket.org/atlassian/atlassian-frontend/commits/823d80f31c):
- Updated dependencies [e5c869ee31](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5c869ee31):
- Updated dependencies [69b678b38c](https://bitbucket.org/atlassian/atlassian-frontend/commits/69b678b38c):
- Updated dependencies [9dd4b9088b](https://bitbucket.org/atlassian/atlassian-frontend/commits/9dd4b9088b):
- Updated dependencies [0b22d3b9ea](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b22d3b9ea):
- Updated dependencies [fd782b0705](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd782b0705):
- Updated dependencies [b4ef7fe214](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4ef7fe214):
- Updated dependencies [d80b8e8fdb](https://bitbucket.org/atlassian/atlassian-frontend/commits/d80b8e8fdb):
- Updated dependencies [3644fc1afe](https://bitbucket.org/atlassian/atlassian-frontend/commits/3644fc1afe):
- Updated dependencies [b2402fc3a2](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2402fc3a2):
- Updated dependencies [d38212e1be](https://bitbucket.org/atlassian/atlassian-frontend/commits/d38212e1be):
- Updated dependencies [ba8c2c4129](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba8c2c4129):
- Updated dependencies [62f1f218d9](https://bitbucket.org/atlassian/atlassian-frontend/commits/62f1f218d9):
- Updated dependencies [67bc25bc3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/67bc25bc3f):
- Updated dependencies [4aca202534](https://bitbucket.org/atlassian/atlassian-frontend/commits/4aca202534):
- Updated dependencies [0376c2f4fe](https://bitbucket.org/atlassian/atlassian-frontend/commits/0376c2f4fe):
- Updated dependencies [6eb8c0799f](https://bitbucket.org/atlassian/atlassian-frontend/commits/6eb8c0799f):
- Updated dependencies [8c8f0099d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c8f0099d8):
- Updated dependencies [c28ff17fbd](https://bitbucket.org/atlassian/atlassian-frontend/commits/c28ff17fbd):
- Updated dependencies [7e363d5aba](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e363d5aba):
  - @atlaskit/smart-card@13.1.0
  - @atlaskit/media-test-helpers@27.2.0
  - @atlaskit/adf-schema@9.0.0
  - @atlaskit/adf-utils@9.1.0
  - @atlaskit/editor-common@45.0.0
  - @atlaskit/docs@8.5.1
  - @atlaskit/editor-test-helpers@11.1.0
  - @atlaskit/theme@9.5.3
  - @atlaskit/media-client@6.1.0
  - @atlaskit/analytics-listeners@6.3.0
  - @atlaskit/analytics-next@6.3.6
  - @atlaskit/button@13.3.10
  - @atlaskit/width-detector@2.1.0
  - @atlaskit/media-card@67.2.0
  - @atlaskit/media-filmstrip@38.0.1
  - @atlaskit/analytics-namespaced-context@4.2.0
  - @atlaskit/editor-json-transformer@7.0.10
  - @atlaskit/task-decision@16.0.10

## 56.0.0

### Minor Changes

- [minor][bc29fbc030](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc29fbc030):

  ED-8748 ED-8211: Update media linking UI experience in renderer, fixes other rendering issues and workarounds.

### Patch Changes

- [patch][0a0a54cb47](https://bitbucket.org/atlassian/atlassian-frontend/commits/0a0a54cb47):

  EDM-281: Fix broken image wrapping in Editor- Updated dependencies [bc29fbc030](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc29fbc030):

- Updated dependencies [7d80e44c09](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d80e44c09):
- Updated dependencies [1386afaecc](https://bitbucket.org/atlassian/atlassian-frontend/commits/1386afaecc):
- Updated dependencies [eb962d2c36](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb962d2c36):
- Updated dependencies [5f5b93071f](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f5b93071f):
- Updated dependencies [584279e2ae](https://bitbucket.org/atlassian/atlassian-frontend/commits/584279e2ae):
- Updated dependencies [9d2da865dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d2da865dd):
- Updated dependencies [f83b67a761](https://bitbucket.org/atlassian/atlassian-frontend/commits/f83b67a761):
- Updated dependencies [70b68943d1](https://bitbucket.org/atlassian/atlassian-frontend/commits/70b68943d1):
- Updated dependencies [6b4fe5d0e0](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b4fe5d0e0):
- Updated dependencies [9a93eff8e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a93eff8e6):
- Updated dependencies [d49ebd7c7a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d49ebd7c7a):
- Updated dependencies [53ebcdb974](https://bitbucket.org/atlassian/atlassian-frontend/commits/53ebcdb974):
- Updated dependencies [4bec09aa74](https://bitbucket.org/atlassian/atlassian-frontend/commits/4bec09aa74):
- Updated dependencies [d63888b5e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63888b5e5):
- Updated dependencies [0a0a54cb47](https://bitbucket.org/atlassian/atlassian-frontend/commits/0a0a54cb47):
- Updated dependencies [6dcad31e41](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dcad31e41):
- Updated dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
- Updated dependencies [8f046e84f0](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f046e84f0):
- Updated dependencies [bdf25b1c4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdf25b1c4c):
- Updated dependencies [3cbc8a49a2](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cbc8a49a2):
- Updated dependencies [645918eda6](https://bitbucket.org/atlassian/atlassian-frontend/commits/645918eda6):
- Updated dependencies [fad8a16962](https://bitbucket.org/atlassian/atlassian-frontend/commits/fad8a16962):
- Updated dependencies [715572f9e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/715572f9e5):
- Updated dependencies [cc54ca2490](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc54ca2490):
  - @atlaskit/adf-schema@8.0.0
  - @atlaskit/editor-common@44.1.0
  - @atlaskit/media-client@6.0.0
  - @atlaskit/code@11.1.4
  - @atlaskit/media-card@67.1.1
  - @atlaskit/media-test-helpers@27.1.0
  - @atlaskit/mention@18.18.0
  - @atlaskit/editor-test-helpers@11.0.0
  - @atlaskit/media-core@31.1.0
  - @atlaskit/docs@8.5.0
  - @atlaskit/navigation-next@8.0.3
  - @atlaskit/adf-utils@9.0.0
  - @atlaskit/editor-json-transformer@7.0.9
  - @atlaskit/status@0.9.23
  - @atlaskit/media-filmstrip@38.0.0
  - @atlaskit/task-decision@16.0.9

## 55.0.0

### Patch Changes

- [patch][2475d1c9d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/2475d1c9d8):

  ED-6885 Fix hard break without text afterwards not showing in renderer- [patch][c7b205c83f](https://bitbucket.org/atlassian/atlassian-frontend/commits/c7b205c83f):

  ED-8637, ED-8783 Add visit analytics to links (including mediaLink ED-8637) in renderer- [patch][703b72cdba](https://bitbucket.org/atlassian/atlassian-frontend/commits/703b72cdba):

  EDM-356: Fix media size in comment renderer- [patch][cd662c7e4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd662c7e4c):

  Stop propagation of onClick event handlers inside any media node with a Link mark- [patch][5e3aab8e77](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e3aab8e77):

  pass originalDimensions to media-card- Updated dependencies [b408e050ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/b408e050ab):

- Updated dependencies [bc380c30ce](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc380c30ce):
- Updated dependencies [7602615cd4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7602615cd4):
- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [5bb23adac3](https://bitbucket.org/atlassian/atlassian-frontend/commits/5bb23adac3):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [0732eedea7](https://bitbucket.org/atlassian/atlassian-frontend/commits/0732eedea7):
- Updated dependencies [c171660346](https://bitbucket.org/atlassian/atlassian-frontend/commits/c171660346):
- Updated dependencies [27fde59914](https://bitbucket.org/atlassian/atlassian-frontend/commits/27fde59914):
- Updated dependencies [4695ac5697](https://bitbucket.org/atlassian/atlassian-frontend/commits/4695ac5697):
- Updated dependencies [96ee7441fe](https://bitbucket.org/atlassian/atlassian-frontend/commits/96ee7441fe):
- Updated dependencies [b18fc8a1b6](https://bitbucket.org/atlassian/atlassian-frontend/commits/b18fc8a1b6):
- Updated dependencies [196500df34](https://bitbucket.org/atlassian/atlassian-frontend/commits/196500df34):
- Updated dependencies [be57ca3829](https://bitbucket.org/atlassian/atlassian-frontend/commits/be57ca3829):
- Updated dependencies [9957801602](https://bitbucket.org/atlassian/atlassian-frontend/commits/9957801602):
- Updated dependencies [d7ed7b1513](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7ed7b1513):
- Updated dependencies [893886e05a](https://bitbucket.org/atlassian/atlassian-frontend/commits/893886e05a):
- Updated dependencies [41a2496393](https://bitbucket.org/atlassian/atlassian-frontend/commits/41a2496393):
- Updated dependencies [7baff84f38](https://bitbucket.org/atlassian/atlassian-frontend/commits/7baff84f38):
- Updated dependencies [39ee28797d](https://bitbucket.org/atlassian/atlassian-frontend/commits/39ee28797d):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [025842de1a](https://bitbucket.org/atlassian/atlassian-frontend/commits/025842de1a):
- Updated dependencies [bbf5eb8824](https://bitbucket.org/atlassian/atlassian-frontend/commits/bbf5eb8824):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [695e1c1c31](https://bitbucket.org/atlassian/atlassian-frontend/commits/695e1c1c31):
- Updated dependencies [6b06a7baa9](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b06a7baa9):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [a5d0019a5e](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5d0019a5e):
- Updated dependencies [8b34c7371d](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b34c7371d):
- Updated dependencies [e981669ba5](https://bitbucket.org/atlassian/atlassian-frontend/commits/e981669ba5):
- Updated dependencies [5e3aab8e77](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e3aab8e77):
- Updated dependencies [395739b5ef](https://bitbucket.org/atlassian/atlassian-frontend/commits/395739b5ef):
- Updated dependencies [77474b6821](https://bitbucket.org/atlassian/atlassian-frontend/commits/77474b6821):
  - @atlaskit/media-client@5.0.2
  - @atlaskit/editor-common@44.0.2
  - @atlaskit/adf-schema@7.0.0
  - @atlaskit/adf-utils@8.0.0
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/logo@12.3.3
  - @atlaskit/mention@18.17.0
  - @atlaskit/util-data-test@13.1.2
  - @atlaskit/media-test-helpers@27.0.0
  - @atlaskit/media-card@67.1.0
  - @atlaskit/profilecard@12.4.0
  - @atlaskit/media-filmstrip@37.1.2
  - @atlaskit/smart-card@13.0.0
  - @atlaskit/navigation-next@8.0.2
  - @atlaskit/field-range@8.0.2
  - @atlaskit/editor-test-helpers@10.6.1
  - @atlaskit/editor-json-transformer@7.0.8
  - @atlaskit/media-core@31.0.5
  - @atlaskit/avatar@17.1.9
  - @atlaskit/button@13.3.9
  - @atlaskit/tooltip@15.2.5
  - @atlaskit/task-decision@16.0.8

## 54.0.1

### Patch Changes

- [patch][f196b7ce66](https://bitbucket.org/atlassian/atlassian-frontend/commits/f196b7ce66):

  EDM-388 Fix rendering unsupported content when no expand or layout is present in the schema

## 54.0.0

### Major Changes

- [major][a4ddcbf7e2](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4ddcbf7e2):

  Remove deprecated legacy image node. It is superseded by the media single node.

### Patch Changes

- [patch][088f4f7d1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/088f4f7d1e):

  ED-8306: Fix sorting tables with empty cells- [patch][8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):

  Remove Karma tests - based on AFP-960- [patch][a1bc1e6637](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1bc1e6637):

  AFP-1437: Fix vulnerability issue for url-parse and bump to ^1.4.5.Packages.- [patch][b924951169](https://bitbucket.org/atlassian/atlassian-frontend/commits/b924951169):

  ED-7713 Update styling of table sorting button in renderer- [patch][02b2a2079c](https://bitbucket.org/atlassian/atlassian-frontend/commits/02b2a2079c):

  Fix image alignment in layouts in renderer + expose ClearNextSiblingMarginTop- Updated dependencies [9e90cb4336](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e90cb4336):

- Updated dependencies [e8a31c2714](https://bitbucket.org/atlassian/atlassian-frontend/commits/e8a31c2714):
- Updated dependencies [4c6b8024c8](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c6b8024c8):
- Updated dependencies [151240fce9](https://bitbucket.org/atlassian/atlassian-frontend/commits/151240fce9):
- Updated dependencies [8d09cd0408](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d09cd0408):
- Updated dependencies [088f4f7d1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/088f4f7d1e):
- Updated dependencies [9d6b02c04f](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d6b02c04f):
- Updated dependencies [f709e92247](https://bitbucket.org/atlassian/atlassian-frontend/commits/f709e92247):
- Updated dependencies [8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):
- Updated dependencies [79cabaee0c](https://bitbucket.org/atlassian/atlassian-frontend/commits/79cabaee0c):
- Updated dependencies [ded54f7b9f](https://bitbucket.org/atlassian/atlassian-frontend/commits/ded54f7b9f):
- Updated dependencies [eeaa647c31](https://bitbucket.org/atlassian/atlassian-frontend/commits/eeaa647c31):
- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
- Updated dependencies [e3a8052151](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3a8052151):
- Updated dependencies [c1992227dc](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1992227dc):
- Updated dependencies [02b2a2079c](https://bitbucket.org/atlassian/atlassian-frontend/commits/02b2a2079c):
  - @atlaskit/editor-common@44.0.0
  - @atlaskit/adf-schema@6.2.0
  - @atlaskit/navigation-next@8.0.0
  - @atlaskit/editor-test-helpers@10.6.0
  - @atlaskit/smart-card@12.7.0
  - @atlaskit/adf-utils@7.4.3
  - @atlaskit/editor-json-transformer@7.0.7
  - @atlaskit/media-card@67.0.4
  - @atlaskit/icon@20.0.2
  - @atlaskit/analytics-listeners@6.2.4
  - @atlaskit/task-decision@16.0.7
  - @atlaskit/media-test-helpers@26.1.2

## 53.2.7

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/avatar@17.1.7
  - @atlaskit/button@13.3.7
  - @atlaskit/code@11.1.3
  - @atlaskit/field-range@8.0.1
  - @atlaskit/icon@20.0.1
  - @atlaskit/logo@12.3.2
  - @atlaskit/navigation-next@7.3.7
  - @atlaskit/theme@9.5.1
  - @atlaskit/tooltip@15.2.3
  - @atlaskit/type-helpers@4.2.3
  - @atlaskit/adf-schema@6.1.1
  - @atlaskit/adf-utils@7.4.2
  - @atlaskit/editor-common@43.4.1
  - @atlaskit/editor-json-transformer@7.0.6
  - @atlaskit/editor-test-helpers@10.5.1
  - @atlaskit/analytics-listeners@6.2.3
  - @atlaskit/analytics-namespaced-context@4.1.11
  - @atlaskit/mention@18.16.2
  - @atlaskit/status@0.9.22
  - @atlaskit/task-decision@16.0.6
  - @atlaskit/util-data-test@13.1.1
  - @atlaskit/media-card@67.0.3
  - @atlaskit/media-client@5.0.1
  - @atlaskit/media-core@31.0.4
  - @atlaskit/media-filmstrip@37.1.1
  - @atlaskit/media-test-helpers@26.1.1
  - @atlaskit/smart-card@12.6.5
  - @atlaskit/profilecard@12.3.7

## 53.2.6

### Patch Changes

- [patch][b01fc0ceef](https://bitbucket.org/atlassian/atlassian-frontend/commits/b01fc0ceef):

  ED-8151 Alt text is promoted to full schema. Feature flag and MediaOptions property UNSAFE_allowAltTextOnImages was renamed to allowAltTextOnImages.- [patch][b8da779506](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8da779506):

  ED-8607 fixed invalid spread usage for i18n messages in expand- Updated dependencies [5181c5d368](https://bitbucket.org/atlassian/atlassian-frontend/commits/5181c5d368):

- Updated dependencies [3b19e30129](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b19e30129):
- Updated dependencies [6ca6aaa1d7](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ca6aaa1d7):
- Updated dependencies [fe4eaf06fc](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe4eaf06fc):
- Updated dependencies [b01fc0ceef](https://bitbucket.org/atlassian/atlassian-frontend/commits/b01fc0ceef):
- Updated dependencies [d085ab4419](https://bitbucket.org/atlassian/atlassian-frontend/commits/d085ab4419):
- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies [555818c33a](https://bitbucket.org/atlassian/atlassian-frontend/commits/555818c33a):
- Updated dependencies [0e439590a3](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e439590a3):
- Updated dependencies [b8da779506](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8da779506):
- Updated dependencies [b9dc265bc9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9dc265bc9):
  - @atlaskit/smart-card@12.6.4
  - @atlaskit/editor-test-helpers@10.5.0
  - @atlaskit/editor-common@43.4.0
  - @atlaskit/media-test-helpers@26.1.0
  - @atlaskit/adf-schema@6.1.0
  - @atlaskit/adf-utils@7.4.1
  - @atlaskit/field-range@8.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/media-filmstrip@37.1.0
  - @atlaskit/avatar@17.1.6
  - @atlaskit/editor-json-transformer@7.0.5
  - @atlaskit/navigation-next@7.3.5
  - @atlaskit/logo@12.3.1
  - @atlaskit/media-card@67.0.2
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/tooltip@15.2.2
  - @atlaskit/mention@18.16.1
  - @atlaskit/status@0.9.21
  - @atlaskit/task-decision@16.0.5
  - @atlaskit/profilecard@12.3.6

## 53.2.5

### Patch Changes

- [patch][3160e15523](https://bitbucket.org/atlassian/atlassian-frontend/commits/3160e15523):

  fix margin top on paragraphs so it has a unit by default- [patch][cf9858fa09](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf9858fa09):

  [ED-8189] Allow resizing media inside of native expand using the breakout container size- Updated dependencies [5504a7da8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/5504a7da8c):

- Updated dependencies [966622bd45](https://bitbucket.org/atlassian/atlassian-frontend/commits/966622bd45):
- Updated dependencies [3002c015cc](https://bitbucket.org/atlassian/atlassian-frontend/commits/3002c015cc):
- Updated dependencies [b52f2be5d9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b52f2be5d9):
- Updated dependencies [9d8752351f](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d8752351f):
- Updated dependencies [3e87f5596a](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e87f5596a):
- Updated dependencies [3160e15523](https://bitbucket.org/atlassian/atlassian-frontend/commits/3160e15523):
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
  - @atlaskit/code@11.1.2
  - @atlaskit/adf-utils@7.4.0
  - @atlaskit/adf-schema@6.0.0
  - @atlaskit/editor-common@43.3.1
  - @atlaskit/docs@8.3.0
  - @atlaskit/editor-test-helpers@10.4.3
  - @atlaskit/media-client@5.0.0
  - @atlaskit/media-core@31.0.3
  - @atlaskit/media-filmstrip@37.0.1
  - @atlaskit/editor-json-transformer@7.0.4

## 53.2.4

### Patch Changes

- Updated dependencies [761dcd6d19](https://bitbucket.org/atlassian/atlassian-frontend/commits/761dcd6d19):
- Updated dependencies [faccb537d0](https://bitbucket.org/atlassian/atlassian-frontend/commits/faccb537d0):
- Updated dependencies [8c7f8fcf92](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c7f8fcf92):
- Updated dependencies [45cb48558f](https://bitbucket.org/atlassian/atlassian-frontend/commits/45cb48558f):
- Updated dependencies [edc4a4a7ae](https://bitbucket.org/atlassian/atlassian-frontend/commits/edc4a4a7ae):
- Updated dependencies [a47d750b5d](https://bitbucket.org/atlassian/atlassian-frontend/commits/a47d750b5d):
  - @atlaskit/adf-schema@5.0.0
  - @atlaskit/adf-utils@7.3.2
  - @atlaskit/media-client@4.3.0
  - @atlaskit/status@0.9.20
  - @atlaskit/editor-common@43.3.0
  - @atlaskit/editor-test-helpers@10.4.1
  - @atlaskit/editor-json-transformer@7.0.3
  - @atlaskit/media-test-helpers@25.2.7

## 53.2.3

### Patch Changes

- [patch][98a904dd02](https://bitbucket.org/atlassian/atlassian-frontend/commits/98a904dd02):

  [ED-8307] Create an IframeWidthObserverFallbackWrapper when product does not given one to WidthObserver- [patch][2ffdeb5a48](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ffdeb5a48):

  [ED-6984] Fix timestamp convert dates to use UTC and implements proper internationalization- [patch][29643d4593](https://bitbucket.org/atlassian/atlassian-frontend/commits/29643d4593):

  ED-8025 Sort table tooltip renderer- [patch][4cd37dd052](https://bitbucket.org/atlassian/atlassian-frontend/commits/4cd37dd052):

  ED-8153 ED-8302: Styling fixes for expands including: increasing the hit area for expand titles in the renderer, better hover transitions and lowered spacing between expands.- [patch][dfb3b76a4b](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfb3b76a4b):

  ED-7781 Update anchor link text- Updated dependencies [28f8f0e089](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f8f0e089):

- Updated dependencies [d1055e0e50](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1055e0e50):
- Updated dependencies [e0daa78402](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0daa78402):
- Updated dependencies [2ffdeb5a48](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ffdeb5a48):
- Updated dependencies [97d1245875](https://bitbucket.org/atlassian/atlassian-frontend/commits/97d1245875):
- Updated dependencies [4eefd368a8](https://bitbucket.org/atlassian/atlassian-frontend/commits/4eefd368a8):
- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies [5a54e163a7](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a54e163a7):
- Updated dependencies [486a5aec29](https://bitbucket.org/atlassian/atlassian-frontend/commits/486a5aec29):
- Updated dependencies [46e6693eb3](https://bitbucket.org/atlassian/atlassian-frontend/commits/46e6693eb3):
- Updated dependencies [4cd37dd052](https://bitbucket.org/atlassian/atlassian-frontend/commits/4cd37dd052):
- Updated dependencies [03c917044e](https://bitbucket.org/atlassian/atlassian-frontend/commits/03c917044e):
- Updated dependencies [83300f0b6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/83300f0b6d):
- Updated dependencies [d3f4c97f6a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3f4c97f6a):
- Updated dependencies [e5dd37f7a4](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5dd37f7a4):
- Updated dependencies [81897eb2e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/81897eb2e6):
- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/icon@19.1.0
  - @atlaskit/editor-common@43.2.0
  - @atlaskit/status@0.9.19
  - @atlaskit/adf-schema@4.4.0
  - @atlaskit/theme@9.5.0
  - @atlaskit/navigation-next@7.3.1
  - @atlaskit/media-card@67.0.0
  - @atlaskit/editor-test-helpers@10.4.0
  - @atlaskit/media-filmstrip@37.0.0
  - @atlaskit/util-data-test@13.1.0
  - @atlaskit/button@13.3.5
  - @atlaskit/code@11.1.1
  - @atlaskit/tooltip@15.2.1
  - @atlaskit/editor-json-transformer@7.0.2
  - @atlaskit/media-client@4.2.2
  - @atlaskit/media-core@31.0.2
  - @atlaskit/media-test-helpers@25.2.6

## 53.2.2

### Patch Changes

- [patch][36f6e99c5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36f6e99c5b):

  Fix type errors caused when generating declaration files- Updated dependencies [36f6e99c5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36f6e99c5b):

  - @atlaskit/editor-test-helpers@10.3.2
  - @atlaskit/media-client@4.2.1

## 53.2.1

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  ED-8082 fixed click are for media link

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  ED-8191 fix expand button position when disabled- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

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
  - @atlaskit/adf-schema@4.3.2
  - @atlaskit/adf-utils@7.3.1
  - @atlaskit/editor-common@43.1.0
  - @atlaskit/tooltip@15.2.0
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/media-client@4.2.0
  - @atlaskit/smart-card@12.6.2
  - @atlaskit/avatar@17.1.5
  - @atlaskit/media-card@66.1.2
  - @atlaskit/navigation-next@7.3.0
  - @atlaskit/status@0.9.18

## 53.2.0

### Minor Changes

- [minor][10425b84b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10425b84b4):

  Add support to extensions v2 (using manifests and extension providers)

- [minor][7f8de51c36](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f8de51c36):

  Exposed the fadeOutHeight prop and passed the value through to the TruncatedWrapper when Renderer is rendering a truncated document

### Patch Changes

- [patch][ef2ba36d5c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef2ba36d5c):

  Add alt text support for renderer

- [patch][bb164fbd1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb164fbd1e):

  ED-8073 ED-8074: Align expand title to the left when it wraps and align the expand chevron to the top

- [patch][b4fda095ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b4fda095ef):

  ED-8018 fixed an issue when click on a linked media, it opens preview.

- [patch][f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):

  Corrects the type exports for typography, colors, elevation and layers. If you were doing any dynamic code it may break you. Refer to the [upgrade guide](/packages/core/theme/docs/upgrade-guide) for help upgrading.- Updated dependencies [271945fd08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/271945fd08):

- Updated dependencies [161a30be16](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/161a30be16):
- Updated dependencies [ea0e619cc7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea0e619cc7):
- Updated dependencies [5b8a074ce6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b8a074ce6):
- Updated dependencies [49fbe3d3bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49fbe3d3bf):
- Updated dependencies [c1d4898af5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1d4898af5):
- Updated dependencies [579779f5aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/579779f5aa):
- Updated dependencies [ef2ba36d5c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef2ba36d5c):
- Updated dependencies [6e4b678428](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e4b678428):
- Updated dependencies [bb164fbd1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb164fbd1e):
- Updated dependencies [3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):
- Updated dependencies [b3fd0964f2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3fd0964f2):
- Updated dependencies [10425b84b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10425b84b4):
- Updated dependencies [4700477bbe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4700477bbe):
- Updated dependencies [f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):
- Updated dependencies [9a261337b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a261337b5):
- Updated dependencies [cc1b89d310](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc1b89d310):
- Updated dependencies [938f1c2902](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/938f1c2902):
- Updated dependencies [926798632e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926798632e):
  - @atlaskit/editor-common@43.0.0
  - @atlaskit/adf-schema@4.3.1
  - @atlaskit/smart-card@12.6.1
  - @atlaskit/mention@18.16.0
  - @atlaskit/icon@19.0.11
  - @atlaskit/media-client@4.1.1
  - @atlaskit/theme@9.3.0
  - @atlaskit/editor-test-helpers@10.3.0
  - @atlaskit/profilecard@12.3.5
  - @atlaskit/editor-json-transformer@7.0.1
  - @atlaskit/task-decision@16.0.4

## 53.1.0

### Minor Changes

- [minor][166dd996a8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/166dd996a8):

  ED-7949: Migrate expand react component to renderer from common to avoid extra deps being added to common

- [minor][3a4aa18da6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a4aa18da6):

  ED-7878 Add expand analytics v1

- [minor][f1a06fc2fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a06fc2fd):

  ED-7876 Implement expand and nestedExpand in Editor and Renderer

  A **work in progress** implementation of the new `expand` and `nestedExpand` nodes. These are currently **disabled** by default, but can be tested by enabling an editor prop.

  `UNSAFE_allowExpand={true}`

  Note, `expand` and `nestedExpand` are only in the `stage-0` ADF schema (as of this changeset).

### Patch Changes

- [patch][e76d2904b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e76d2904b4):

  Adding support for alt text on editor and renderer

- [patch][5b2c89203e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b2c89203e):

  Fix linting errors from prettier upgrade

- Updated dependencies [6d9c8a9073](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d9c8a9073):
- Updated dependencies [70e1055b8f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70e1055b8f):
  - @atlaskit/adf-schema@4.3.0
  - @atlaskit/editor-common@42.0.0
  - @atlaskit/editor-json-transformer@7.0.0
  - @atlaskit/editor-test-helpers@10.2.0
  - @atlaskit/task-decision@16.0.3

## 53.0.0

### Patch Changes

- [patch][e47220a6b2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e47220a6b2):

  ED-5450: remove most of ts-ignores from editor packages- [patch][0e10be832e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e10be832e):

  ## Remove media-core Context usage from MediaCard node in order to use MediaClientConfig

  > this is not a breaking change

  Renderer public remains the same since the `ProviderFactory` type has not direct contract with media

- Updated dependencies [24b8ea2667](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24b8ea2667):
  - @atlaskit/editor-test-helpers@10.1.3
  - @atlaskit/media-client@4.0.0
  - @atlaskit/media-filmstrip@36.0.0
  - @atlaskit/media-test-helpers@25.2.2
  - @atlaskit/editor-json-transformer@6.3.5
  - @atlaskit/task-decision@16.0.2
  - @atlaskit/editor-common@41.2.1
  - @atlaskit/media-card@66.0.1
  - @atlaskit/media-core@31.0.0

## 52.0.1

### Patch Changes

- [patch][846d2fbcbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/846d2fbcbb):

  ED-7932 Fixed copy to clipboard in IE 11

## 52.0.0

### Major Changes

- [major][4585681e3d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4585681e3d):

  ED-7631: removed containerAri for task-decisions components- [major][ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):

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

- [minor][1a0fe670f9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1a0fe670f9):

  ED-7674: support nested actions in stage-0 schema; change DOM representation of actions

  ### Nested actions

  This changeset adds support for nesting actions _at the schema level_, currently only within the stage-0 ADF schema.

  The editor and renderer currently do nothing special to represent these nested actions. As of this release, they appear as as flat list.

  To enable this feature, use the new `allowNestedTasks` prop.

  ### DOM representation of actions in renderer + editor

  This release also changes the DOM representation of actions away from a `ol > li` structure, to a `div > div` one. That is, both the `taskList` and `taskItem` are wrapped in `div` elements.

  Because taskLists can now be allowed to nest themselves, this would otherwise have created an `ol > ol` structure, which is invalid.- [minor][7f3b4e4ec1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f3b4e4ec1):

  FM-2370 Add "onError" callback prop to Renderer element

  This is called when the provided ADF is invalid and does not load

- [minor][6936864261](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6936864261):

  Added shouldOpenMediaViewer property to Renderer to override the default behaviour.

  The new optional property will act according to the following:

  - **undefined**: (default behaviour) Media Card will open media viewer on click only if it's not in a mobile app and "on card click" event handler is not provided
  - **true**: Media Card will open media viewer regardless of the default conditions
  - **false**: Media Card will **not** open viewer regardless of the default conditions

### Patch Changes

- [patch][cc28419139](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc28419139):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.- [patch][3c1c4a4bed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c1c4a4bed):

  ED-7849 fixed issue for header anchor links can't be copied in Columns- [patch][a86ad00736](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a86ad00736):

  MS-2416: Adding package info in analytics GASv3 payload- [patch][e0a1c40a84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e0a1c40a84):

  make the text serializer for renderer to respect ADF mention attributes (text is not mandatory)- [patch][0a7a1e4995](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a7a1e4995):

  ED-7860 Fix empty heading ids caused by striping out all special characters

- [patch][03dea4c51a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/03dea4c51a):

  ED-7766 improve heading anchor link analytics

- Updated dependencies [c3e65f1b9e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3e65f1b9e):
- Updated dependencies [bd94b1d552](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd94b1d552):
- Updated dependencies [e7b5c917de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7b5c917de):
  - @atlaskit/editor-common@41.2.0
  - @atlaskit/media-client@3.0.0
  - @atlaskit/media-core@30.0.17
  - @atlaskit/media-test-helpers@25.2.0
  - @atlaskit/media-card@66.0.0
  - @atlaskit/media-filmstrip@35.0.0
  - @atlaskit/editor-json-transformer@6.3.4
  - @atlaskit/mention@18.15.5
  - @atlaskit/profilecard@12.3.3
  - @atlaskit/task-decision@16.0.0
  - @atlaskit/util-data-test@13.0.0

## 51.1.2

- Updated dependencies [4778521db3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4778521db3):
  - @atlaskit/navigation-next@7.0.0

## 51.1.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 51.1.0

### Minor Changes

- [minor][37af022ca2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/37af022ca2):

  Delay loading code blocks and task items- [minor][65ada7f318](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65ada7f318):

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

- [patch][92801136b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92801136b9):

  [ED-7727] Improve not allowed sorting message when the table has merged cells. Now the message will show up only on the sorting icon avoiding conflicts with confluence comments- [patch][e0edc768ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e0edc768ec):

  ED-7743 special chars in heading will gets removed.- [patch][1ea48d7fd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ea48d7fd1):

  ED-7244 Fixed flaky test- [patch][dac3a85916](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dac3a85916):

  ED-7318 Prevent manipulating the DOM after the editor has been destroyed

## 51.0.0

### Major Changes

- [major][166eb02474](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/166eb02474):

  **Editor Bombazine Release**

  **BREAKING CHANGES**

  ​ **Renderer**

  - Change in contract for `eventHandlers.smartCard.onClick` prop:
        Old: onClick(url): void
  New: onClick(event, url): void

  ​ **ADF Schema**

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
        - https://product-fabric.atlassian.net/browse/ED-7700- [major] [40ead387ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40ead387ef):

ED-7532 Expose ability to cancel default browser behavior when clicking Smart Links- [major][80adfefba2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80adfefba2):

Remove applicationCard node and action mark

### Minor Changes

- [minor][9cddedc62f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cddedc62f):

  ED-7244 added hover effects for media link in renderer- [minor][3f1c7dd26a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f1c7dd26a):

  [ED-7392] Add sort table by column on renderer behind allowColumnSorting feature flag
  [ED-7392] Extract common methods to sort table

- [minor][decd6fceea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/decd6fceea):

  ED-5137 added heading anchor link

  You can now use the `allowHeadingAnchorLinks` prop to display heading anchor links in renderer, next to all top level headings.
  There is also an existing property called `disableHeadingIDs`, when you set both `disableHeadingIDs` and `allowHeadingAnchorLinks` to false, the anchor link button will not display, however the heading anchor id will still be in the DOM.

  Note: This feature is only enabled for top level headings(e.g. not nested in other blocks like table).

### Patch Changes

- [patch][f9584ff209](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9584ff209):

  ED-7244 updated hover animation style- [patch][030e778af9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/030e778af9):

  pass contextId to media card

- Updated dependencies [1194ad5eb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1194ad5eb3):
  - @atlaskit/adf-utils@7.0.0
  - @atlaskit/editor-common@41.0.0
  - @atlaskit/editor-json-transformer@6.3.3
  - @atlaskit/editor-test-helpers@10.0.0
  - @atlaskit/adf-schema@4.0.0

## 50.0.2

- Updated dependencies [8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):
  - @atlaskit/navigation-next@6.6.2
  - @atlaskit/mention@18.15.1
  - @atlaskit/task-decision@15.3.2
  - @atlaskit/avatar@17.0.0
  - @atlaskit/theme@9.2.2
  - @atlaskit/profilecard@12.0.9

## 50.0.1

- Updated dependencies [af72468517](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af72468517):
  - @atlaskit/editor-common@40.0.1
  - @atlaskit/media-client@2.1.2
  - @atlaskit/media-core@30.0.14
  - @atlaskit/media-filmstrip@34.3.6
  - @atlaskit/media-test-helpers@25.1.1
  - @atlaskit/media-card@65.0.0
  - @atlaskit/analytics-listeners@6.2.0

## 50.0.0

### Major Changes

- [major][08ec269915](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/08ec269915):

  ED-7532 Expose ability to cancel default browser behaviour when clicking Smart Links within the Mobile Renderer.

## 49.9.3

### Patch Changes

- [patch][6b9ed8f471](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6b9ed8f471):

  Export and consume validator from editor-common

## 49.9.2

### Patch Changes

- [patch][b0804f563f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0804f563f):

  Fix default export of text serializer

## 49.9.1

### Patch Changes

- [patch][8b07822f8a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b07822f8a):

  Add entry-point for text-serializer

## 49.9.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 49.8.3

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 49.8.2

### Patch Changes

- [patch][0d7d459f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7d459f1a):

  Fixes type errors which were incompatible with TS 3.6

## 49.8.1

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 49.8.0

### Minor Changes

- [minor][d438397a89](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d438397a89):

  ## Editor Azlon Release

  ### Affected editor components:

  Tables, Media, Smart Cards, Extensions, Analytics, Copy and Paste, Code Block, Undo, Emoji

  ### Performance

  - Reduce number of wrapping nodes in table cells. – [table][affects: wrapping, overflow, resizing]
    - https://product-fabric.atlassian.net/browse/ED-7288
  - Cache resizeState in pluginState to avoid expensive DOM operations. – [table][affects: resizing]
    - https://product-fabric.atlassian.net/browse/ED-7343
  - Delay MutationObserver initialization in table. – [table][affects: initial table rendering, size adjustment on initial render]
    - https://product-fabric.atlassian.net/browse/ED-7436
  - Improve the way we handle mouse events in table – [table][affects: column drag handlers, table controls, resizing]
    - https://product-fabric.atlassian.net/browse/ED-7342

  ### SmartCards

  - Pending and error states do not pass onClick prop
    - https://product-fabric.atlassian.net/browse/SL-359
  - Make toolbars consistent between blue link and smart link – [affects: link and smart link]
    - https://product-fabric.atlassian.net/browse/ED-7157

  ### Mention Highlights

  Not clear how to test. – [affects: all type aheads, mention type ahead]

  ### Emoji Refactor

  Emoji has been rewritten to use common TypeAhead plugin (same as quick insert and mention). Need to thoroughly look at emoji typeahead, e.g. typing ":" and inserting emojis...

  - https://product-fabric.atlassian.net/browse/ED-5369

  ### Copy and Paste

  - Copying text & images from Google doc changes formatting on paste [affects: media]
    - https://product-fabric.atlassian.net/browse/ED-7338
  - Pasted code block does not persist selected language – [affects: code block]
    - https://product-fabric.atlassian.net/browse/ED-7050
  - Copy and paste media

  ### Tables

  - Table add 40+ blank columns
    - https://product-fabric.atlassian.net/browse/ED-7031
  - Implement Table Sorting in Edit Mode – [NEW BIG FEATURE][not enabled]
    - Feature flag:
      - allowColumnSorting – [default: false]
    - https://product-fabric.atlassian.net/browse/ED-7391

  ### Analytics

  - Fire undo events – [affects: undo]
    - https://product-fabric.atlassian.net/browse/ED-7276
  - Make all insert events set analytics meta
    - https://product-fabric.atlassian.net/browse/ED-7277

  ### Notable Bug fixes

  - Issue with ctrl+z [affects: undo on different languages, e.g. Russian keyboard]
    - https://product-fabric.atlassian.net/browse/ED-7310

- [minor][5ed73a70a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ed73a70a9):

  ## Editor Azlon Release

  TODO: RELEASE NOTES

### Patch Changes

- [patch][48de0e74ae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48de0e74ae):

  add missing attrs to MediaSingle node for copy and paste

## 49.7.10

- Updated dependencies [3624730f44](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3624730f44):
  - @atlaskit/editor-common@39.17.4
  - @atlaskit/media-client@2.0.2
  - @atlaskit/media-core@30.0.11
  - @atlaskit/media-filmstrip@34.3.3
  - @atlaskit/media-test-helpers@25.0.2
  - @atlaskit/media-card@64.0.0

## 49.7.9

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

## 49.7.8

- Updated dependencies [69586b5353](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69586b5353):
  - @atlaskit/editor-test-helpers@9.11.6
  - @atlaskit/media-card@63.3.11
  - @atlaskit/media-client@2.0.1
  - @atlaskit/media-core@30.0.10
  - @atlaskit/media-filmstrip@34.3.2
  - @atlaskit/media-test-helpers@25.0.0

## 49.7.7

- Updated dependencies [ee804f3eeb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee804f3eeb):
  - @atlaskit/editor-common@39.17.2
  - @atlaskit/media-card@63.3.9
  - @atlaskit/media-core@30.0.9
  - @atlaskit/media-filmstrip@34.3.1
  - @atlaskit/media-test-helpers@24.3.5
  - @atlaskit/media-client@2.0.0

## 49.7.6

### Patch Changes

- [patch][80a3f4224a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80a3f4224a):

  fix: ensure smart cards lazily load correctly

## 49.7.5

### Patch Changes

- [patch][6164bc2629](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6164bc2629):

  ED-6806 Move 'calcTableColumnWidths' from adf-schema into editor-common

  BREAKING CHANGE

  We move 'calcTableColumnWidths' helper from adf-schema into our helper library editor-common, you can use it from editor-common in the same way:

  Before:

  ```javascript
  import { calcTableColumnWidths } from '@atlaskit/adf-schema';
  ```

  Now:

  ````javascript
  import { calcTableColumnWidths } from '@atlaskit/editor-common';
  ```- [patch] [d4223be707](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d4223be707):

  ED-6805 Fix table column widths calculation (renderer/confluence-transformer)
  ````

## 49.7.4

### Patch Changes

- [patch][a892339c19](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a892339c19):

  Give all editor decorations a key to prevent ProseMirror from re-rendering decorations constantly.

  Enables YAML language for codeblocks

## 49.7.3

### Patch Changes

- [patch][ba223c9878](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ba223c9878):

  ED-7267: Validate URLs passing through smart links- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 49.7.2

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 49.7.1

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 49.7.0

### Minor Changes

- [minor][92dd3a8d58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92dd3a8d58):

  Add media attrs to MediaSingle node on renderer

  This ensures we populate the clipboard with enough media information, that can be
  used later on editor side on paste event, to copy the file to the destination
  collection.

## 49.6.1

### Patch Changes

- [patch][4aed452b1b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aed452b1b):

  ED-7041, SL-231: fix copying smart link from renderer to editor

## 49.6.0

### Minor Changes

- [minor][e9cdfa5aed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e9cdfa5aed):

  ED-7188: Full width mode is now centre aligned.

## 49.5.0

### Minor Changes

- [minor][4a22a774a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a22a774a6):

  AUX-36 Add update support for extension handler

## 49.4.2

### Patch Changes

- [patch][229335aab3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/229335aab3):

  ED-7192 Fix wrong version of @atlaskit/analytics-namespaced-context inside renderer

## 49.4.1

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/navigation-next@6.3.2
  - @atlaskit/editor-common@39.13.2
  - @atlaskit/editor-test-helpers@9.5.2
  - @atlaskit/mention@18.6.2
  - @atlaskit/status@0.9.3
  - @atlaskit/task-decision@15.1.1
  - @atlaskit/media-card@63.3.1
  - @atlaskit/media-filmstrip@34.2.2
  - @atlaskit/media-test-helpers@24.1.2
  - @atlaskit/smart-card@12.2.3
  - @atlaskit/profilecard@12.0.1
  - @atlaskit/icon@19.0.0

## 49.4.0

### Minor Changes

- [minor][1bc0c48926](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bc0c48926):

  uploadContext and viewContext fields of MediaProvider (part of Editor and Renderer props) are deprecated. New fields uploadMediaClientConfig and viewMediaClientConfig should be used from now on.

## 49.3.0

### Minor Changes

- [minor][241a14694e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/241a14694e):

  IMPORTANT! This release accidentally released breaking changes.
  MediaProvider's field `viewContext` was replaced with `uploadMediaClientConfig`.
  This was fixed in the following version 49.4.0.

  Minor change: Add RUM to renderer

## 49.2.0

### Minor Changes

- [minor][86bf524679](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/86bf524679):

  ED-7117, ED-7087: Fix copy pasting smart links out of editor. Fallback to HTML anchor tag if errors occur during rendering (e.g. no provider found).

## 49.1.2

- Updated dependencies [2b333a4c6d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b333a4c6d):
  - @atlaskit/editor-common@39.8.7
  - @atlaskit/profilecard@12.0.0

## 49.1.1

### Patch Changes

- [patch][0438f37f2c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0438f37f2c):

  ED-7105 Fix issue where images in full-width mode page could be a different size between the editor and renderer

## 49.1.0

### Minor Changes

- [minor][fec7d4576f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fec7d4576f):

  Bump new version of @atlaskit/mention to other AK packages to get correct i18n strings

## 49.0.1

- Updated dependencies [393fb6acd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/393fb6acd2):
  - @atlaskit/editor-test-helpers@9.4.1
  - @atlaskit/smart-card@12.0.0

## 49.0.0

### Major Changes

- [major][ff85c1c706](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff85c1c706):

  Extracted email renderer outside react renderer

## 48.8.2

- Updated dependencies [a40f54404e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a40f54404e):
  - @atlaskit/editor-common@39.8.2
  - @atlaskit/profilecard@11.0.0

## 48.8.1

### Patch Changes

- [patch][ec0197518f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec0197518f):

  Fix incorrect date import path

## 48.8.0

### Minor Changes

- [minor][11a8112851](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11a8112851):

  ED-6991 Fire analytics event for renderer started

  Set up analytics v3 in renderer

## 48.7.3

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/navigation-next@6.0.8
  - @atlaskit/editor-common@39.7.2
  - @atlaskit/editor-test-helpers@9.3.9
  - @atlaskit/mention@18.3.1
  - @atlaskit/status@0.9.2
  - @atlaskit/task-decision@15.0.3
  - @atlaskit/media-card@63.1.5
  - @atlaskit/media-filmstrip@34.2.1
  - @atlaskit/media-test-helpers@24.0.3
  - @atlaskit/smart-card@11.1.6
  - @atlaskit/profilecard@10.2.6
  - @atlaskit/field-range@7.0.4
  - @atlaskit/icon@18.0.0

## 48.7.2

### Patch Changes

- [patch][750b4819e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/750b4819e2):

  Email serializer can stub images to pass browser tests

## 48.7.1

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 48.7.0

- [minor][372235caca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/372235caca):

  - Email renderer now renders media node

- Updated dependencies [9ecfef12ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ecfef12ac):
- Updated dependencies [97bfe81ec8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97bfe81ec8):
  - @atlaskit/editor-test-helpers@9.3.4
  - @atlaskit/media-card@63.1.0
  - @atlaskit/media-core@30.0.3
  - @atlaskit/media-filmstrip@34.1.2
  - @atlaskit/media-test-helpers@24.0.0
  - @atlaskit/docs@8.1.0
  - @atlaskit/field-range@7.0.2
  - @atlaskit/code@11.0.0

## 48.6.0

- [minor][21f5217343](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21f5217343):

  - consume emoji new entrypoints in AK

## 48.5.0

- [minor][7089d49f61](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7089d49f61):

  - consume the new mention entrypoints

## 48.4.0

- [minor][9a1b2075e8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a1b2075e8):

  - consume new Status entrypoints

## 48.3.0

- [minor][79f0ef0601](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79f0ef0601):

  - Use strict tsconfig to compile editor packages

## 48.2.0

- [minor][8555107bfd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8555107bfd):

  - ensure that arbitary HTML does not get evaluated by email clients

## 48.1.4

- [patch][dfc7aaa563](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dfc7aaa563):

  - ED-6863: Fix the rendering of extensions in the renderer when they have breakout layouts.

## 48.1.3

- [patch][1ec6367e00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ec6367e00):

  - ED-6551 - Lists should correctly wrap adjacent floated content without overlapping

## 48.1.2

- [patch][5539fc187f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5539fc187f):

  - Email renderer - single-line codeBlock still has rounded corners

## 48.1.1

- Updated dependencies [ed3f034232](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed3f034232):
  - @atlaskit/editor-test-helpers@9.1.3
  - @atlaskit/media-card@63.0.2
  - @atlaskit/media-core@30.0.1
  - @atlaskit/media-filmstrip@34.1.1
  - @atlaskit/media-test-helpers@23.0.0

## 48.1.0

- [minor][5a49043dac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5a49043dac):

  - Enable strictPropertyInitialization in tsconfig.base

## 48.0.1

- [patch][8f2d13f0ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8f2d13f0ec):

  - Email renderer - nested lists do not have vertical margins

## 48.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

- Updated dependencies [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - @atlaskit/adf-utils@6.0.5
  - @atlaskit/adf-schema@2.5.5
  - @atlaskit/editor-common@39.0.0
  - @atlaskit/media-card@63.0.0
  - @atlaskit/media-filmstrip@34.0.0
  - @atlaskit/docs@8.0.0
  - @atlaskit/visual-regression@0.1.0
  - @atlaskit/button@13.0.0
  - @atlaskit/code@10.0.0
  - @atlaskit/field-range@7.0.0
  - @atlaskit/icon@17.0.0
  - @atlaskit/navigation-next@6.0.0
  - @atlaskit/theme@9.0.0
  - @atlaskit/editor-json-transformer@6.0.0
  - @atlaskit/editor-test-helpers@9.0.0
  - @atlaskit/analytics-listeners@6.0.0
  - @atlaskit/analytics-namespaced-context@4.0.0
  - @atlaskit/mention@18.0.0
  - @atlaskit/status@0.9.0
  - @atlaskit/task-decision@15.0.0
  - @atlaskit/util-data-test@12.0.0
  - @atlaskit/media-core@30.0.0
  - @atlaskit/media-test-helpers@22.0.0
  - @atlaskit/smart-card@11.0.0
  - @atlaskit/profilecard@10.0.0

## 47.1.0

- [minor][69a8870b4b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69a8870b4b):

  - adds support for line numbers in email renderer code blocks

## 47.0.0

- Updated dependencies [a1192ef860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1192ef860):
  - @atlaskit/editor-common@38.0.0
  - @atlaskit/media-card@62.0.0
  - @atlaskit/media-filmstrip@33.0.0
  - @atlaskit/editor-json-transformer@5.0.4
  - @atlaskit/editor-test-helpers@8.0.8
  - @atlaskit/task-decision@14.0.9
  - @atlaskit/util-data-test@11.1.9
  - @atlaskit/media-test-helpers@21.4.0
  - @atlaskit/media-core@29.3.0

## 46.0.1

- [patch][166ca915ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/166ca915ac):

  - ED-6737: Prevent default tables from going into overflow in the renderer straight away after publish.

  This issue was caused by dynamic sizing, a default table being created in 760 width and then being rendered in 680 width.

  Also included in this patch: Preventing the shadow appearing on the right hand side of the table, when there is no overflow.

## 46.0.0

- Updated dependencies [e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):
  - @atlaskit/editor-common@37.0.0
  - @atlaskit/media-card@61.0.0
  - @atlaskit/media-filmstrip@32.0.0
  - @atlaskit/editor-json-transformer@5.0.3
  - @atlaskit/editor-test-helpers@8.0.7
  - @atlaskit/task-decision@14.0.8
  - @atlaskit/util-data-test@11.1.8
  - @atlaskit/media-test-helpers@21.3.0
  - @atlaskit/media-core@29.2.0

## 45.6.5

- [patch][8eeac8c104](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8eeac8c104):

  - ED-6725: Update renderer nodes when appearances changes

## 45.6.4

- [patch][9047a1921a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9047a1921a):

  - Bugfix of email renderer list vertical indentation

## 45.6.3

- [patch][a6fb248987](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6fb248987):

  - ED-6639 Align lists styles between editor & renderer

## 45.6.2

- [patch][0d23e11834](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d23e11834):

  - ED-6736 Prevent extensions with specified width from overflowing between layout cols.

## 45.6.1

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/code@9.0.1
  - @atlaskit/field-range@6.0.4
  - @atlaskit/icon@16.0.9
  - @atlaskit/navigation-next@5.1.5
  - @atlaskit/editor-common@36.1.12
  - @atlaskit/mention@17.6.7
  - @atlaskit/status@0.8.3
  - @atlaskit/task-decision@14.0.5
  - @atlaskit/media-card@60.0.3
  - @atlaskit/media-filmstrip@31.0.4
  - @atlaskit/smart-card@10.2.4
  - @atlaskit/profilecard@9.0.2
  - @atlaskit/theme@8.1.7

## 45.6.0

- [minor][ca3c087624](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca3c087624):

  - ED-6606: Add 'full-width' appearance to renderer

  Example:

  ```js
  import Renderer from '@atlaskit/renderer';

  <Renderer document={...} appearance="full-width" />
  ```

## 45.5.1

- [patch][86d11a504b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/86d11a504b):

  - [ED-5837] Fix copy-paste table from renderer to editor to keep column widths

## 45.5.0

- [minor][3d34915d24](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d34915d24):

  - Fixed heading render for ADF->Email

## 45.4.3

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/icon@16.0.8
  - @atlaskit/navigation-next@5.1.4
  - @atlaskit/theme@8.1.6
  - @atlaskit/analytics-listeners@5.0.3
  - @atlaskit/task-decision@14.0.3
  - @atlaskit/media-card@60.0.1
  - @atlaskit/media-core@29.1.4
  - @atlaskit/media-filmstrip@31.0.3
  - @atlaskit/smart-card@10.2.2
  - @atlaskit/profilecard@9.0.1
  - @atlaskit/field-range@6.0.3
  - @atlaskit/button@12.0.0

## 45.4.2

- [patch][c01f9e1cc7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c01f9e1cc7):

  - Standardise code-block class between editor/renderer. Fix bg color when code-block is nested within a table heading.

## 45.4.1

- [patch][55e47676aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/55e47676aa):

  - revert update status code splits in Renderer/Editor which causes component dist to be broken

## 45.4.0

- [minor][969915d261](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/969915d261):

  - update status import entrypoints in Renderer/editor

## 45.3.3

- [patch][32317ff8f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/32317ff8f3):

  - MS-1633 Renderer passes a list of files and external images to a Card to be opened with Media Viewer

## 45.3.2

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

## 45.3.1

- [patch][823d44ebb0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/823d44ebb0):

  - ED-6667 Enfoce consistent whitespace between renderer & editor

## 45.3.0

- [minor][7a656ef460](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7a656ef460):

  - Email renderer - tables now honor table widths

## 45.2.4

- [patch][370476ca07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/370476ca07):

  - ED-6674: fix table shadow overlapping inline comments

## 45.2.3

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 45.2.2

- Updated dependencies [bfca144ea5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bfca144ea5):
  - @atlaskit/editor-common@36.1.1
  - @atlaskit/profilecard@9.0.0

## 45.2.1

- [patch][acfd88ba22](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acfd88ba22):

  - ED-6639 Align lists styles between editor & renderer

## 45.2.0

- [minor][b6f4afdec5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b6f4afdec5):

  - add date renderer

## 45.1.0

- [minor][827ed599a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/827ed599a0):

  - add placeholders for media nodes

## 45.0.0

- Updated dependencies [c2c36de22b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c36de22b):
  - @atlaskit/editor-common@36.0.0
  - @atlaskit/media-card@59.0.0
  - @atlaskit/media-filmstrip@31.0.0
  - @atlaskit/editor-json-transformer@5.0.2
  - @atlaskit/editor-test-helpers@8.0.3
  - @atlaskit/task-decision@14.0.1
  - @atlaskit/util-data-test@11.1.5
  - @atlaskit/media-test-helpers@21.1.0
  - @atlaskit/media-core@29.1.0

## 44.7.0

- [minor][001fa9a7d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/001fa9a7d0):

  - render adf - email actions and decisions

## 44.6.1

- [patch][106d046114](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/106d046114):

  - Fix issue with media-viewer opening in CC on inline video player controlls clicked

## 44.6.0

- [minor][1593822e4d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1593822e4d):

  - CS-857 Email renderer puts placeholders in place of extensions

## 44.5.0

- [minor][e6f58b1837](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6f58b1837):

  - Email renderer layout column and section support

## 44.4.3

- Updated dependencies [9c316bd8aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c316bd8aa):
  - @atlaskit/editor-common@35.1.3
  - @atlaskit/media-core@29.0.2
  - @atlaskit/media-filmstrip@30.0.2
  - @atlaskit/media-test-helpers@21.0.3
  - @atlaskit/media-card@58.0.0

## 44.4.2

- Updated dependencies [eb4323c388](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eb4323c388):
  - @atlaskit/util-data-test@11.1.4
  - @atlaskit/task-decision@14.0.0

## 44.4.1

- Updated dependencies [97abf5e006](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97abf5e006):
  - @atlaskit/status@0.8.0

## 44.4.0

- [minor][1b3c18ae43](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b3c18ae43):

  - CS-856: Create no-op nodes and marks for email renderer

## 44.3.0

- [minor][0fea11af41](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0fea11af41):

  - Email renderer supports numbered columns, adf-schema extended with colors

## 44.2.1

- [patch][ea6b08700c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea6b08700c):

  - ED-6245: Ensure extensions scroll + overflow when they may break out of their parent container.

## 44.2.0

- [minor][d91db66a8f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d91db66a8f):

  - add support for block and inline smart cards in ADF to email renderer

## 44.1.0

- [minor][b4ce89e3cb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b4ce89e3cb):

  - improve the display of info panels in email renderer

## 44.0.3

- [patch][abd1e85008](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abd1e85008):

  - ED-6536: Fixes non-resized tables accidently getting a width applied.

## 44.0.2

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 44.0.1

- Updated dependencies [b684722884](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b684722884):
  - @atlaskit/mention@17.1.0
  - @atlaskit/status@0.7.0
  - @atlaskit/task-decision@13.1.0
  - @atlaskit/util-data-test@11.1.0

## 44.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/profilecard@8.0.2
  - @atlaskit/docs@7.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/navigation-next@5.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/editor-common@35.0.0
  - @atlaskit/media-card@57.0.0
  - @atlaskit/media-filmstrip@30.0.0
  - @atlaskit/field-range@6.0.1
  - @atlaskit/button@11.0.0
  - @atlaskit/adf-schema@2.0.0
  - @atlaskit/editor-json-transformer@5.0.0
  - @atlaskit/editor-test-helpers@8.0.0
  - @atlaskit/analytics-listeners@5.0.0
  - @atlaskit/analytics-namespaced-context@3.0.0
  - @atlaskit/mention@17.0.0
  - @atlaskit/status@0.6.0
  - @atlaskit/task-decision@13.0.0
  - @atlaskit/util-data-test@11.0.0
  - @atlaskit/media-core@29.0.0
  - @atlaskit/media-test-helpers@21.0.0
  - @atlaskit/smart-card@10.0.0

## 43.1.0

- [minor][feec817d38](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/feec817d38):

  - add email renderer for status

## 43.0.1

- [patch][5b226754b8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b226754b8):

  - ED-5939: Replace SizeDetector with WidthDetector in all editor components

## 43.0.0

- Updated dependencies [7ab3e93996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ab3e93996):
  - @atlaskit/editor-common@34.0.0
  - @atlaskit/editor-test-helpers@7.0.6
  - @atlaskit/media-card@56.0.0
  - @atlaskit/media-filmstrip@29.0.0
  - @atlaskit/media-test-helpers@20.1.8
  - @atlaskit/editor-json-transformer@4.3.5
  - @atlaskit/task-decision@12.0.1
  - @atlaskit/util-data-test@10.2.5
  - @atlaskit/media-core@28.0.0

## 42.0.1

- Updated dependencies [72c6f68226](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72c6f68226):
  - @atlaskit/util-data-test@10.2.4
  - @atlaskit/task-decision@12.0.0

## 42.0.0

- [major][4d17df92f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d17df92f8):

  - ED-6484: Remove the 'inline-comment' appearance from Editor.

## 41.6.1

- [patch][8ed53a1cbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8ed53a1cbb):

  - fix padding, wrapping for inline smart links.

## 41.6.0

- [minor][345bc86152](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/345bc86152):

  - Email renderer does not underline links anymore

## 41.5.0

- [minor][8ec7dd4cb2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8ec7dd4cb2):

  - email rendering - fixed a bug with em

## 41.4.0

- [minor][3a2836d6d7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a2836d6d7):

  - move MediaViewer opening logic into Card by passing shouldOpenMediaViewer flag when there is no click handler defined

## 41.3.1

- Updated dependencies [dbff4fdcf9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dbff4fdcf9):
  - @atlaskit/editor-common@33.0.4
  - @atlaskit/profilecard@8.0.0

## 41.3.0

- [minor][b8d146fb27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8d146fb27):

  - CS-843 Email renderer codeblock support for outlook

## 41.2.1

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/icon@16.0.4
  - @atlaskit/editor-json-transformer@4.3.3
  - @atlaskit/analytics-listeners@4.2.1
  - @atlaskit/analytics-namespaced-context@2.2.1
  - @atlaskit/mention@16.2.2
  - @atlaskit/status@0.5.1
  - @atlaskit/task-decision@11.3.1
  - @atlaskit/util-data-test@10.2.3
  - @atlaskit/media-card@55.0.2
  - @atlaskit/media-core@27.2.3
  - @atlaskit/media-filmstrip@28.0.1
  - @atlaskit/smart-card@9.11.3
  - @atlaskit/media-test-helpers@20.1.7
  - @atlaskit/editor-common@33.0.3
  - @atlaskit/docs@7.0.0
  - @atlaskit/code@9.0.0
  - @atlaskit/field-range@6.0.0
  - @atlaskit/navigation-next@5.0.0
  - @atlaskit/size-detector@7.0.0
  - @atlaskit/theme@8.0.0
  - @atlaskit/profilecard@7.0.0

## 41.2.0

- [minor][bdde0f4f25](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bdde0f4f25):

  - CS-858: Alignment support for email html rendering

## 41.1.1

- Updated dependencies [4072865c1c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4072865c1c):
  - @atlaskit/status@0.5.0
  - @atlaskit/task-decision@11.3.0

## 41.1.0

- [minor][e385e90f31](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e385e90f31):

  - CS-840 Email renderer now supports indentations

## 41.0.1

- Updated dependencies [36bb743af0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36bb743af0):
  - @atlaskit/status@0.4.0

## 41.0.0

- Updated dependencies [4aee5f3cec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aee5f3cec):
  - @atlaskit/editor-common@33.0.0
  - @atlaskit/media-card@55.0.0
  - @atlaskit/media-filmstrip@28.0.0
  - @atlaskit/editor-json-transformer@4.3.1
  - @atlaskit/editor-test-helpers@7.0.2
  - @atlaskit/task-decision@11.2.3
  - @atlaskit/util-data-test@10.2.2
  - @atlaskit/media-test-helpers@20.1.6
  - @atlaskit/media-core@27.2.0

## 40.1.1

- Updated dependencies [0de1251ad1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0de1251ad1):
  - @atlaskit/editor-common@32.4.3
  - @atlaskit/size-detector@6.0.0

## 40.1.0

- [minor][09e8eb968f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/09e8eb968f):

  - ED-6256: render media items with occurenceKey; ignore link cards

## 40.0.0

- [major][4a84fc40e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a84fc40e0):

  - ED-5766 Remove the deprecated 'message' appearance from Editor

## 39.0.2

- Updated dependencies [4af5bd2a58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4af5bd2a58):
  - @atlaskit/editor-json-transformer@4.1.11
  - @atlaskit/adf-schema@1.5.4
  - @atlaskit/editor-common@32.0.2
  - @atlaskit/mention@16.2.1
  - @atlaskit/status@0.3.6
  - @atlaskit/editor-test-helpers@7.0.0

## 39.0.1

- [patch][ca17040178](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca17040178):

  - ED-6243: Dont use breakpoint width calculations for tables in renderer

## 39.0.0

- [patch][5b5ae91921](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b5ae91921):

  - Require Identifier type from media-core instead of media-card

- Updated dependencies [fc6164c8c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc6164c8c2):
- Updated dependencies [190c4b7bd3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/190c4b7bd3):
  - @atlaskit/editor-common@32.0.0
  - @atlaskit/media-card@54.0.0
  - @atlaskit/media-filmstrip@27.0.0
  - @atlaskit/editor-json-transformer@4.1.10
  - @atlaskit/editor-test-helpers@6.3.22
  - @atlaskit/task-decision@11.2.1
  - @atlaskit/util-data-test@10.2.1
  - @atlaskit/media-test-helpers@20.1.5
  - @atlaskit/media-core@27.1.0

## 38.0.8

- [patch][e609e6d78c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e609e6d78c):

  - FM-1464: Add callback to ReactRenderer.onComplete to notify native renderBridge

## 38.0.7

- Updated dependencies [46dfcfbeca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/46dfcfbeca):
  - @atlaskit/editor-common@31.1.1
  - @atlaskit/media-core@27.0.2
  - @atlaskit/media-filmstrip@26.1.2
  - @atlaskit/media-test-helpers@20.1.4
  - @atlaskit/media-card@53.0.0

## 38.0.6

- [patch][05c5bf7a93](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/05c5bf7a93):

  - Dont user pointer cursor for external images in Cards

## 38.0.5

- [patch][6ebe368d95](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ebe368d95):

  - Allow passing through renderer props

## 38.0.4

- [patch][fb61c590cf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fb61c590cf):

  - ED-6173: stop renderer from sending useInlinePlayer to mediaGroup

## 38.0.3

- [patch][a1ad76375d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1ad76375d):

  - ED-6123: scale down table columns by 15if table is bigger than renderer width

## 38.0.2

- [patch][557a2b5734](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/557a2b5734):

  - ED-5788: bump prosemirror-view and prosemirror-model

## 38.0.1

- [patch][fab72e17b1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fab72e17b1):

  - ED-6122: Handle TinyMCE migrated tables, where total table width is less than defined layout

## 38.0.0

- Updated dependencies [69c8d0c19c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c8d0c19c):
  - @atlaskit/editor-common@31.0.0
  - @atlaskit/editor-test-helpers@6.3.17
  - @atlaskit/media-card@52.0.0
  - @atlaskit/media-filmstrip@26.0.0
  - @atlaskit/media-test-helpers@20.1.0
  - @atlaskit/editor-json-transformer@4.1.8
  - @atlaskit/task-decision@11.1.8
  - @atlaskit/util-data-test@10.0.36
  - @atlaskit/media-core@27.0.0

## 37.0.3

- [patch][e2eca7e6d5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e2eca7e6d5):

  - ED-6111: fixed renderer rendering unsupported content with some ADF

## 37.0.2

- Updated dependencies [07a187bb30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07a187bb30):
  - @atlaskit/editor-test-helpers@6.3.14
  - @atlaskit/media-card@51.0.2
  - @atlaskit/media-core@26.2.1
  - @atlaskit/media-filmstrip@25.0.2
  - @atlaskit/media-test-helpers@20.0.0

## 37.0.1

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/navigation-next@4.1.2
  - @atlaskit/editor-common@30.0.1
  - @atlaskit/editor-test-helpers@6.3.13
  - @atlaskit/mention@16.0.1
  - @atlaskit/status@0.3.2
  - @atlaskit/task-decision@11.1.7
  - @atlaskit/media-card@51.0.1
  - @atlaskit/media-filmstrip@25.0.1
  - @atlaskit/media-test-helpers@19.1.1
  - @atlaskit/smart-card@9.4.1
  - @atlaskit/profilecard@6.1.5
  - @atlaskit/field-range@5.0.14
  - @atlaskit/icon@16.0.0

## 37.0.0

- [minor][b1627a5837](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1627a5837):

  - Enable inline video player in Editor and Renderer

- Updated dependencies [85d5d168fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85d5d168fd):
  - @atlaskit/editor-common@30.0.0
  - @atlaskit/media-card@51.0.0
  - @atlaskit/media-filmstrip@25.0.0
  - @atlaskit/editor-json-transformer@4.1.7
  - @atlaskit/editor-test-helpers@6.3.12
  - @atlaskit/task-decision@11.1.6
  - @atlaskit/util-data-test@10.0.34
  - @atlaskit/media-test-helpers@19.1.0
  - @atlaskit/media-core@26.2.0

## 36.0.0

- Updated dependencies [dadef80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dadef80):
- Updated dependencies [3ad16f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ad16f3):
  - @atlaskit/editor-common@29.0.0
  - @atlaskit/media-card@50.0.0
  - @atlaskit/media-filmstrip@24.0.0
  - @atlaskit/editor-json-transformer@4.1.6
  - @atlaskit/editor-test-helpers@6.3.11
  - @atlaskit/task-decision@11.1.5
  - @atlaskit/util-data-test@10.0.33
  - @atlaskit/media-test-helpers@19.0.0
  - @atlaskit/media-core@26.1.0

## 35.1.0

- [minor][be6313e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/be6313e):

  - ED-5477 Support rendering of inline code together with other marks

## 35.0.5

- [patch][c5ee0c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c5ee0c8):

  - Added Annotation mark to ADF, editor & renderer

## 35.0.4

- [patch][dfdfaf2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dfdfaf2):

  - ED-5493 Fix Media Cards bigger in renderer than editor

## 35.0.3

- [patch][48abc90](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48abc90):

  - Fixed date border radius in renderer

## 35.0.2

- [patch][609d32d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/609d32d):

  - ED-5966 Fix issue where renderer incorrectly displayed numbered tables without headers

## 35.0.1

- Updated dependencies [0c116d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c116d6):
  - @atlaskit/editor-json-transformer@4.1.5
  - @atlaskit/editor-test-helpers@6.3.8
  - @atlaskit/editor-common@28.0.2
  - @atlaskit/util-data-test@10.0.32
  - @atlaskit/mention@16.0.0

## 35.0.0

- Updated dependencies [cbb8cb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbb8cb5):
  - @atlaskit/editor-common@28.0.0
  - @atlaskit/editor-test-helpers@6.3.7
  - @atlaskit/media-card@49.0.0
  - @atlaskit/media-filmstrip@23.0.0
  - @atlaskit/media-test-helpers@18.9.1
  - @atlaskit/editor-json-transformer@4.1.4
  - @atlaskit/task-decision@11.1.4
  - @atlaskit/util-data-test@10.0.31
  - @atlaskit/media-core@26.0.0

## 34.0.0

- Updated dependencies [72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):
  - @atlaskit/editor-common@27.0.0
  - @atlaskit/editor-test-helpers@6.3.6
  - @atlaskit/media-card@48.0.0
  - @atlaskit/media-filmstrip@22.0.0
  - @atlaskit/editor-json-transformer@4.1.3
  - @atlaskit/task-decision@11.1.3
  - @atlaskit/util-data-test@10.0.30
  - @atlaskit/media-core@25.0.0
  - @atlaskit/media-test-helpers@18.9.0

## 33.0.7

- [patch][8db5ddc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8db5ddc):

  - ED-6002 Fixes overflowed layout column rendering in renderer

## 33.0.6

- [patch][38f3592](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/38f3592):

  - ED-5990 Fixes logic for merging marks

## 33.0.5

- [patch][f112576](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f112576):

  - ED-6001: fix react error "Maximum update depth exceeded" in renderer

## 33.0.4

- Updated dependencies [e858305](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e858305):
  - @atlaskit/editor-json-transformer@4.1.2
  - @atlaskit/editor-test-helpers@6.3.5
  - @atlaskit/task-decision@11.1.2
  - @atlaskit/editor-common@26.0.0

## 33.0.3

- Updated dependencies [00c648e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/00c648e):
- Updated dependencies [a17bb0e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a17bb0e):
- Updated dependencies [99f08a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/99f08a0):
  - @atlaskit/status@0.3.0

## 33.0.2

- [patch][40510b0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40510b0):

  - Add panel type to fix copy-paste

## 33.0.1

- Updated dependencies [135ed00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/135ed00):
  - @atlaskit/editor-common@25.0.3
  - @atlaskit/media-core@24.7.2
  - @atlaskit/media-filmstrip@21.0.2
  - @atlaskit/media-test-helpers@18.7.2
  - @atlaskit/media-card@47.0.0

## 33.0.0

- Updated dependencies [b3738ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3738ea):
  - @atlaskit/editor-common@25.0.0
  - @atlaskit/media-card@46.0.0
  - @atlaskit/media-filmstrip@21.0.0
  - @atlaskit/editor-json-transformer@4.1.1
  - @atlaskit/editor-test-helpers@6.3.4
  - @atlaskit/task-decision@11.1.1
  - @atlaskit/util-data-test@10.0.28
  - @atlaskit/media-test-helpers@18.7.0
  - @atlaskit/media-core@24.7.0

## 32.2.0

- [minor][b9f8a8f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9f8a8f):

  - Adding alignment options to media

## 32.1.2

- [patch][95f98cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/95f98cc):

  - User can click on a smart card to open a new window/tab

## 32.1.1

- [patch][d9815ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d9815ba):

  - ED-5888 Add dark mode for task-decision

## 32.1.0

- [minor][1205725](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1205725):

  - Move schema to its own package

## 32.0.0

- [patch][8ae67fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8ae67fc):

  - Use stretchy-fit resizeMode for media card components instead of full-fit or undefined values;

- Updated dependencies [80f765b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80f765b):
  - @atlaskit/editor-common@23.0.0
  - @atlaskit/media-card@45.0.0
  - @atlaskit/media-filmstrip@20.0.0
  - @atlaskit/editor-json-transformer@4.0.25
  - @atlaskit/editor-test-helpers@6.3.2
  - @atlaskit/task-decision@11.0.9
  - @atlaskit/util-data-test@10.0.26
  - @atlaskit/media-test-helpers@18.6.2
  - @atlaskit/media-core@24.6.0

## 31.1.4

- [patch][d3f3e19](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d3f3e19):

  - restored StatusContainer to editor-core, avoid re-rendering on event handlers, removed unused props in the renderer

- [patch][44cc61d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/44cc61d):

  - added native status analytics

## 31.1.3

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/button@10.1.1
  - @atlaskit/code@8.2.2
  - @atlaskit/field-range@5.0.12
  - @atlaskit/icon@15.0.2
  - @atlaskit/navigation-next@4.0.9
  - @atlaskit/size-detector@5.0.9
  - @atlaskit/theme@7.0.1
  - @atlaskit/editor-json-transformer@4.0.24
  - @atlaskit/analytics-listeners@4.1.4
  - @atlaskit/analytics-namespaced-context@2.1.5
  - @atlaskit/mention@15.1.8
  - @atlaskit/status@0.2.10
  - @atlaskit/task-decision@11.0.8
  - @atlaskit/util-data-test@10.0.25
  - @atlaskit/media-card@44.1.3
  - @atlaskit/media-core@24.5.2
  - @atlaskit/media-filmstrip@19.0.3
  - @atlaskit/smart-card@9.0.4
  - @atlaskit/profilecard@6.1.2
  - @atlaskit/docs@6.0.0

## 31.1.2

- [patch][0623610](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0623610):

  - Display media singles with video inside as inline video player

## 31.1.1

- [patch][232238c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/232238c):

  - ED-5866: Turn off lazy loading for images on mobile.

## 31.1.0

- [minor][a1b03d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1b03d0):

  - ED-3890 Adds Indentation support on paragraphs and headings

## 31.0.7

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/code@8.2.1
  - @atlaskit/field-range@5.0.11
  - @atlaskit/icon@15.0.1
  - @atlaskit/editor-common@22.2.3
  - @atlaskit/mention@15.1.7
  - @atlaskit/status@0.2.8
  - @atlaskit/task-decision@11.0.7
  - @atlaskit/smart-card@9.0.2
  - @atlaskit/profilecard@6.1.1
  - @atlaskit/theme@7.0.0

## 31.0.6

- [patch][3061b52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3061b52):

  - AK-5723 - adjust files in package.json to ensure correct publishing of dist/package.json

## 31.0.5

- [patch][4c0c2a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4c0c2a0):

  - Fix Cards throwing Error when client is not provided.

## 31.0.4

- Updated dependencies [df32968](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df32968):
  - @atlaskit/editor-test-helpers@6.2.22
  - @atlaskit/smart-card@9.0.0

## 31.0.3

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/smart-card@8.8.5
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/editor-common@22.0.2
  - @atlaskit/editor-test-helpers@6.2.21
  - @atlaskit/mention@15.1.3
  - @atlaskit/status@0.2.6
  - @atlaskit/task-decision@11.0.6
  - @atlaskit/media-card@44.0.2
  - @atlaskit/media-filmstrip@19.0.2
  - @atlaskit/media-test-helpers@18.3.1
  - @atlaskit/profilecard@6.0.3
  - @atlaskit/icon@15.0.0

## 31.0.2

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/icon@14.6.1
  - @atlaskit/theme@6.2.1
  - @atlaskit/analytics-listeners@4.1.1
  - @atlaskit/task-decision@11.0.5
  - @atlaskit/media-card@44.0.1
  - @atlaskit/media-core@24.5.1
  - @atlaskit/media-filmstrip@19.0.1
  - @atlaskit/smart-card@8.8.4
  - @atlaskit/profilecard@6.0.2
  - @atlaskit/field-range@5.0.9
  - @atlaskit/button@10.0.0

## 31.0.1

- [patch][1c42021](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c42021):

  - ED-5775: fix columns collapsing in renderer

## 31.0.0

- Updated dependencies [7e8b4b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e8b4b9):
  - @atlaskit/editor-common@22.0.0
  - @atlaskit/media-card@44.0.0
  - @atlaskit/media-filmstrip@19.0.0
  - @atlaskit/editor-json-transformer@4.0.22
  - @atlaskit/editor-test-helpers@6.2.19
  - @atlaskit/task-decision@11.0.4
  - @atlaskit/util-data-test@10.0.21
  - @atlaskit/media-test-helpers@18.3.0
  - @atlaskit/media-core@24.5.0

## 30.3.2

- [patch][030007e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/030007e):

  - ED-5776: fix number column when first column is resized

## 30.3.1

- [patch][f2cb9d9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f2cb9d9):

  - ED-5785: fix number column when header row is enabled

## 30.3.0

- [minor][1e5cd32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e5cd32):

  - Make layouts stack on small screens

## 30.2.1

- Updated dependencies [9c0844d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0844d):
  - @atlaskit/editor-common@21.2.2
  - @atlaskit/profilecard@6.0.0

## 30.2.0

- [minor][14477fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/14477fa):

  - Adding text alignment to editor and renderer

## 30.1.1

- [patch][b19b7bb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b19b7bb):

  - ED-5721 Adds support for rendering optional content

  Renderer can now handle empty headings, actions & decisions

## 30.1.0

- [minor][b440439](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b440439):

  - Add breakout mark to editor, renderer and adf-utils

## 30.0.1

- [patch][26027dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/26027dd):

  - Upgrade react syntax highlighter to version that ships its own async loaded languages and supports SSR

## 30.0.0

- Updated dependencies [2c21466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c21466):
  - @atlaskit/editor-common@21.0.0
  - @atlaskit/media-card@43.0.0
  - @atlaskit/media-filmstrip@18.0.0
  - @atlaskit/editor-json-transformer@4.0.21
  - @atlaskit/editor-test-helpers@6.2.16
  - @atlaskit/task-decision@11.0.2
  - @atlaskit/util-data-test@10.0.20
  - @atlaskit/media-test-helpers@18.2.12
  - @atlaskit/media-core@24.4.0

## 29.5.2

- [patch][f6c3f01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f6c3f01):

  - ED-5586: Removes padding from editor and renderer for mobile.

## 29.5.1

- Updated dependencies [04c7192](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/04c7192):
  - @atlaskit/editor-common@20.3.7
  - @atlaskit/media-core@24.3.1
  - @atlaskit/media-filmstrip@17.0.2
  - @atlaskit/media-test-helpers@18.2.11
  - @atlaskit/media-card@42.0.0

## 29.5.0

- [minor][ed15858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed15858):

  - ED-5552: Adds shadow to overflow elements in the renderer.

## 29.4.0

- [minor][abef80b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abef80b):

  - ED-5527: apply max-width: 100% and pass container size to Card as dimension

## 29.3.1

- Updated dependencies [a6dd6e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6dd6e3):
  - @atlaskit/editor-common@20.3.1
  - @atlaskit/profilecard@5.0.0

## 29.3.0

- [minor][d793999](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d793999):

  - ED-5583: Add support for more EventHandlers in the renderer

  * Added event handlers for `Link` mark, `BlockCard` node and `InlineCard` node.
  * Removed `applicationCard` event handlers as this node no longer exists in the renderer.

## 29.2.2

- [patch][f3d067d" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f3d067d"
  d):

  - Fix font size for numbered column in tables with dynamic text sizing

## 29.2.1

- [patch][8636991" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8636991"
  d):

  - ED-5518: fix numbered column with merged rows

## 29.2.0

- [minor] Don't open external links in new window [2bb95c0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2bb95c0)

## 29.1.0

- This versions seems to have not published correctly, so we are republishing at 29.2.0

## 29.0.6

- [patch] Inline code should wrap [f1d9a54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1d9a54)

## 29.0.5

- [patch] Fix label for panels [621bf75](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/621bf75)

## 29.0.4

- [patch] ED-5513: render table that respects columns widths except on mobile [716bb9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/716bb9d)

## 29.0.3

- [patch] Fix incorrect word-breaking for codeblocks in Safari. FM-1278 [9fef2a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9fef2a7)

## 29.0.2

- [patch] Change breakpoints for dynamic text sizing [f660016](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f660016)

## 29.0.1

- [patch] ED-5523: fix rendering number column table with header column [f74c658](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f74c658)

## 29.0.0

- [major] Updated dependencies [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)
  - @atlaskit/editor-common@20.0.0
  - @atlaskit/media-card@41.0.0
  - @atlaskit/media-filmstrip@17.0.0
  - @atlaskit/editor-json-transformer@4.0.18
  - @atlaskit/editor-test-helpers@6.2.7
  - @atlaskit/task-decision@11.0.1
  - @atlaskit/util-data-test@10.0.16
  - @atlaskit/media-core@24.3.0
  - @atlaskit/media-test-helpers@18.2.8

## 28.0.1

- [patch] Updated dependencies [8a1ccf2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a1ccf2)
  - @atlaskit/util-data-test@10.0.15
  - @atlaskit/task-decision@11.0.0

## 28.0.0

- [major] Remove support for ApplicationCard [6e510d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e510d8)

## 27.2.2

- [patch] ED-5494: fix nested breakout nodes [1eaf1f1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1eaf1f1)

## 27.2.1

- [patch] Fixes not rendering whitespace for empty paragraphs. ED-5500 [b7e5935](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b7e5935)

## 27.2.0

- [minor] Replaces util-shared-styles with theme. ED-5351 [55a4f00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/55a4f00)

## 27.1.1

- [patch] Move render document export into seperate file [e976cd8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e976cd8)

## 27.1.0

- [minor] Summary: Deprecate props, add support for new API. ED-5201 [00e4bb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/00e4bb3)

## 27.0.1

- [patch] Async load highlighter languages [9102fa2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9102fa2)

## 27.0.0

- [major] Updated dependencies [2afa60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2afa60d)
  - @atlaskit/editor-common@19.0.0
  - @atlaskit/media-card@39.0.0
  - @atlaskit/media-filmstrip@16.0.0
  - @atlaskit/editor-json-transformer@4.0.17
  - @atlaskit/editor-test-helpers@6.2.6
  - @atlaskit/task-decision@10.0.2
  - @atlaskit/util-data-test@10.0.14
  - @atlaskit/media-test-helpers@18.2.5
  - @atlaskit/media-core@24.2.0

## 26.0.1

- [patch] Upgrade react-syntax-highlighter again and use async loaded prism [260d66a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/260d66a)

## 26.0.0

- [major] Updated dependencies [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [major] Updated dependencies [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)
  - @atlaskit/editor-common@18.0.0
  - @atlaskit/media-card@38.0.0
  - @atlaskit/media-filmstrip@15.0.0
  - @atlaskit/editor-json-transformer@4.0.16
  - @atlaskit/editor-test-helpers@6.2.5
  - @atlaskit/task-decision@10.0.1
  - @atlaskit/util-data-test@10.0.12
  - @atlaskit/media-core@24.1.0
  - @atlaskit/media-test-helpers@18.2.3

## 25.0.0

- [major] Upgrade task and decisions and editor to use @atlaskit/analytics-next. Remove usage of @atlaskit/analytics. [23c7eca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/23c7eca)

## 24.3.2

- [patch] Upgraded react-syntax-highlighter to 8.0.2 [7cc7000](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7cc7000)

## 24.3.1

- [patch] ED-5457: moving table css classnames to a const [2e1f627](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e1f627)

## 24.3.0

- [minor] ED-5246 support image resizing [111d02f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/111d02f)

## 24.2.1

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/editor-common@17.0.7
  - @atlaskit/mention@15.0.10
  - @atlaskit/status@0.2.1
  - @atlaskit/task-decision@9.0.1
  - @atlaskit/media-card@37.0.1
  - @atlaskit/media-filmstrip@14.0.3
  - @atlaskit/media-test-helpers@18.2.1
  - @atlaskit/profilecard@4.0.10
  - @atlaskit/icon@14.0.0

## 24.2.0

- [minor] ED-5203 Added support for truncating the renderer with a fade out [bf07ac4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bf07ac4)

## 24.1.2

- [patch] Added code splits to the node types of the Renderer [8dd6e52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8dd6e52)

## 24.1.1

- [patch] Updated dependencies [dae7792](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dae7792)
  - @atlaskit/editor-common@17.0.5
  - @atlaskit/media-core@24.0.2
  - @atlaskit/media-filmstrip@14.0.2
  - @atlaskit/smart-card@8.2.2
  - @atlaskit/media-card@37.0.0
  - @atlaskit/media-test-helpers@18.2.0

## 24.1.0

- [minor] FS-2963 When inserting a status, I can pick a colour from a predefined colour picker [a633d77](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a633d77)
- [patch] Updated dependencies [547b3d9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/547b3d9)
  - @atlaskit/status@0.2.0

## 24.0.1

- [patch] Numbered column in table should be able to fit number > 100 [7a43676](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7a43676)

## 24.0.0

- [major] Updated dependencies [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
  - @atlaskit/editor-common@17.0.0
  - @atlaskit/util-data-test@10.0.10
  - @atlaskit/editor-test-helpers@6.1.2
  - @atlaskit/media-card@36.0.0
  - @atlaskit/media-filmstrip@14.0.0
  - @atlaskit/editor-json-transformer@4.0.12
  - @atlaskit/media-core@24.0.0
  - @atlaskit/media-test-helpers@18.0.0
  - @atlaskit/task-decision@9.0.0

## 23.0.1

- [patch] Updated dependencies [1be4bb8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1be4bb8)
  - @atlaskit/editor-common@16.2.1
  - @atlaskit/media-core@23.2.1
  - @atlaskit/media-filmstrip@13.0.2
  - @atlaskit/media-card@35.0.0

## 23.0.0

- [major] Add dynamic text sizing support to renderer and editor [2a6410f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2a6410f)

## 22.2.0

- [minor] Add support for tables with numbered columns. ED-4709 [cc19e25](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc19e25)

## 22.1.0

- [minor] FS-2961 Introduce status component and status node in editor [7fe2b0a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7fe2b0a)

## 22.0.0

- [major] Updated dependencies [6e1d642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e1d642)
  - @atlaskit/editor-common@16.0.0
  - @atlaskit/media-card@34.0.0
  - @atlaskit/media-filmstrip@13.0.0
  - @atlaskit/editor-json-transformer@4.0.11
  - @atlaskit/editor-test-helpers@6.0.9
  - @atlaskit/task-decision@8.1.9
  - @atlaskit/util-data-test@10.0.9
  - @atlaskit/media-core@23.2.0
  - @atlaskit/media-test-helpers@17.1.0

## 21.0.7

- [patch] Update TS to 3.0 [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
- [none] Updated dependencies [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
  - @atlaskit/media-test-helpers@17.0.2
  - @atlaskit/media-filmstrip@12.0.1
  - @atlaskit/media-core@23.1.1
  - @atlaskit/mention@15.0.9
  - @atlaskit/editor-json-transformer@4.0.10
  - @atlaskit/editor-common@15.0.7
  - @atlaskit/media-card@33.0.2
  - @atlaskit/editor-test-helpers@6.0.8

## 21.0.6

- [patch] MediaSingle image now has 100% max-width in table cells [9e5ae81](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9e5ae81)
- [patch] Updated dependencies [9e5ae81](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9e5ae81)
  - @atlaskit/editor-common@15.0.6

## 21.0.5

- [patch] move tests and add dev dependencies to help test [177a858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/177a858)

## 21.0.4

- [patch] Unique heading IDs [d312d25](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d312d25)

## 21.0.3

- [patch] Fix issue where BreakoutProvider would not import correctly in Typescript [6b95448](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6b95448)

## 21.0.2

- [patch] ED-3919: Fix typography and other styles, align styles between editor and renderer [d0f9293](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0f9293)

## 21.0.1

- [patch] Updated dependencies [da65dec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da65dec)
  - @atlaskit/editor-common@15.0.1

## 21.0.0

- [major] Updated dependencies [7545979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7545979)
  - @atlaskit/editor-common@15.0.0
  - @atlaskit/media-card@33.0.0
  - @atlaskit/media-filmstrip@12.0.0
  - @atlaskit/editor-json-transformer@4.0.8
  - @atlaskit/editor-test-helpers@6.0.6
  - @atlaskit/task-decision@8.1.7
  - @atlaskit/util-data-test@10.0.8
  - @atlaskit/media-core@23.1.0

## 20.1.2

- [patch] Update Page Layout sizing to be more compact, fix quick-insert icon, fix issue with Popup not centering toolbar in certain situations [1effb83](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1effb83)

## 20.1.1

- [patch] Updated dependencies [911a570](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/911a570)
  - @atlaskit/media-test-helpers@17.0.0
  - @atlaskit/media-filmstrip@11.0.2
  - @atlaskit/media-core@23.0.2
  - @atlaskit/editor-json-transformer@4.0.7
  - @atlaskit/media-card@32.0.6
  - @atlaskit/editor-test-helpers@6.0.5

## 20.1.0

- [minor] Adds option to disable heading ids in renderer, and disable them by default in conversations [efcca1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/efcca1a)

## 20.0.11

- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/smart-card@8.0.1
  - @atlaskit/task-decision@8.1.6
  - @atlaskit/util-data-test@10.0.7
  - @atlaskit/profilecard@4.0.8
  - @atlaskit/editor-common@14.0.11
  - @atlaskit/editor-test-helpers@6.0.3
  - @atlaskit/mention@15.0.6
  - @atlaskit/editor-json-transformer@4.0.6
  - @atlaskit/media-card@32.0.5
  - @atlaskit/media-filmstrip@11.0.1

## 20.0.10

- [patch] Updated dependencies [dd91bcf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd91bcf)
  - @atlaskit/editor-common@14.0.10

## 20.0.9

- [patch] Updated dependencies [48b95b0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48b95b0)
  - @atlaskit/smart-card@8.0.0
  - @atlaskit/media-card@32.0.4
- [none] Updated dependencies [e9b1477](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e9b1477)
  - @atlaskit/media-card@32.0.4

## 20.0.8

- [patch] Renderer now only renders double height emojis when appearance is 'message' [fa78199](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa78199)
- [none] Updated dependencies [fa78199](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa78199)

## 20.0.7

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/profilecard@4.0.7
  - @atlaskit/task-decision@8.1.5
  - @atlaskit/icon@13.2.5
  - @atlaskit/code@8.0.1
  - @atlaskit/docs@5.0.6

## 20.0.6

- [patch] Updated dependencies [f9c0cdb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c0cdb)
  - @atlaskit/code@8.0.0
  - @atlaskit/docs@5.0.5

## 20.0.5

- [patch] ED-5190: fixed mediaSingle styles in renderer [4f09dea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4f09dea)
- [none] Updated dependencies [4f09dea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4f09dea)
  - @atlaskit/editor-common@14.0.6

## 20.0.4

- [patch] ED-4824: added renderer support for smart cards [7cf0a78](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7cf0a78)
- [none] Updated dependencies [7cf0a78](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7cf0a78)
  - @atlaskit/smart-card@7.0.5
  - @atlaskit/editor-common@14.0.5

## 20.0.3

- [patch] ED-5218, extensions with default width should not be centre aligned. [d6bd53e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d6bd53e)
- [none] Updated dependencies [d6bd53e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d6bd53e)

## 20.0.2

- [patch] ED-5180: fix table columns collapse [2e0e5a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e0e5a1)
- [none] Updated dependencies [2e0e5a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e0e5a1)
  - @atlaskit/editor-json-transformer@4.0.5

## 20.0.1

- [patch] Fixes the examples in renderer [696acde](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/696acde)
- [none] Updated dependencies [696acde](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/696acde)

## 20.0.0

- [patch] ED-5170: fix table horizontal scroll in renderer [c8eb097](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8eb097)

- [none] Updated dependencies [597e0bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/597e0bd)
  - @atlaskit/profilecard@4.0.3
  - @atlaskit/task-decision@8.1.3
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/editor-json-transformer@4.0.4
  - @atlaskit/editor-test-helpers@6.0.0
  - @atlaskit/editor-common@14.0.0
- [none] Updated dependencies [61df453](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/61df453)
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/profilecard@4.0.3
  - @atlaskit/editor-common@14.0.0
  - @atlaskit/editor-test-helpers@6.0.0
  - @atlaskit/task-decision@8.1.3
  - @atlaskit/editor-json-transformer@4.0.4
- [none] Updated dependencies [812a39c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/812a39c)
  - @atlaskit/profilecard@4.0.3
  - @atlaskit/task-decision@8.1.3
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/editor-json-transformer@4.0.4
  - @atlaskit/editor-test-helpers@6.0.0
  - @atlaskit/editor-common@14.0.0
- [none] Updated dependencies [c8eb097](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8eb097)
  - @atlaskit/task-decision@8.1.3
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/profilecard@4.0.3
  - @atlaskit/editor-common@14.0.0
  - @atlaskit/editor-test-helpers@6.0.0
  - @atlaskit/editor-json-transformer@4.0.4
- [major] Updated dependencies [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
  - @atlaskit/media-test-helpers@16.0.0
  - @atlaskit/media-filmstrip@11.0.0
  - @atlaskit/media-core@23.0.0
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/profilecard@4.0.3
  - @atlaskit/task-decision@8.1.3
  - @atlaskit/editor-json-transformer@4.0.4
  - @atlaskit/editor-common@14.0.0
  - @atlaskit/media-card@32.0.0
  - @atlaskit/editor-test-helpers@6.0.0

## 19.2.8

- [patch] ED-5144, extensions breakout support for renderer. [071e7c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/071e7c2)
- [patch] Updated dependencies [071e7c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/071e7c2)

## 19.2.7

- [patch] Updated dependencies [59ccb09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59ccb09)
  - @atlaskit/media-card@31.3.0
  - @atlaskit/media-filmstrip@10.2.2
  - @atlaskit/editor-common@13.2.8

## 19.2.6

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/media-card@31.2.1
  - @atlaskit/media-filmstrip@10.2.1
  - @atlaskit/task-decision@8.1.2
  - @atlaskit/util-data-test@10.0.2
  - @atlaskit/profilecard@4.0.2
  - @atlaskit/mention@15.0.2
  - @atlaskit/editor-json-transformer@4.0.3
  - @atlaskit/editor-common@13.2.7
  - @atlaskit/editor-test-helpers@5.1.2
  - @atlaskit/icon@13.2.2
  - @atlaskit/media-core@22.2.1
  - @atlaskit/media-test-helpers@15.2.1
  - @atlaskit/theme@5.1.2
  - @atlaskit/code@7.0.2
  - @atlaskit/docs@5.0.2
  - @atlaskit/size-detector@5.0.3

## 19.2.5

- [patch] Bump prosemirror-model to 1.6 in order to use toDebugString on Text node spec [fdd5c5d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd5c5d)
- [none] Updated dependencies [fdd5c5d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd5c5d)
  - @atlaskit/editor-common@13.2.6
  - @atlaskit/editor-test-helpers@5.1.1
  - @atlaskit/editor-json-transformer@4.0.2

## 19.2.4

- [patch] Updated dependencies [7fa84a2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7fa84a2)
  - @atlaskit/media-filmstrip@10.2.0
  - @atlaskit/media-card@31.2.0

## 19.2.3

- [patch] ED-4995: added support for the rest of the page layout types in the renderer [9d9acfa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d9acfa)
- [none] Updated dependencies [9d9acfa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d9acfa)
  - @atlaskit/editor-common@13.2.4

## 19.2.2

- [patch] ED-5033, fixes for multiple date related issues. [c9911e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c9911e0)
- [patch] Updated dependencies [c9911e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c9911e0)
  - @atlaskit/editor-common@13.2.2

## 19.2.1

- [patch] Updated dependencies [fad25ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fad25ec)
  - @atlaskit/media-test-helpers@15.2.0
  - @atlaskit/media-core@22.1.0
  - @atlaskit/editor-common@13.2.1
  - @atlaskit/media-card@31.1.0
  - @atlaskit/editor-test-helpers@5.0.3

## 19.2.0

- [patch] Updated dependencies [fa6f865](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa6f865)
  - @atlaskit/media-card@31.0.0
  - @atlaskit/media-filmstrip@10.1.0
  - @atlaskit/editor-common@13.2.0
  - @atlaskit/media-test-helpers@15.1.0
- [none] Updated dependencies [fdd03d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd03d8)
  - @atlaskit/media-card@31.0.0
  - @atlaskit/media-filmstrip@10.1.0
  - @atlaskit/editor-common@13.2.0
  - @atlaskit/media-test-helpers@15.1.0
- [patch] Updated dependencies [49c8425](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49c8425)
  - @atlaskit/media-card@31.0.0
  - @atlaskit/media-filmstrip@10.1.0
  - @atlaskit/editor-common@13.2.0
  - @atlaskit/media-test-helpers@15.1.0
- [minor] Updated dependencies [3476e01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3476e01)
  - @atlaskit/media-card@31.0.0
  - @atlaskit/media-filmstrip@10.1.0
  - @atlaskit/editor-common@13.2.0

## 19.1.0

- [minor] Updated dependencies [f6bf6c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f6bf6c8)
  - @atlaskit/mention@15.0.0
  - @atlaskit/util-data-test@10.0.1
  - @atlaskit/editor-common@13.1.0

## 19.0.7

- [patch] ED-4199, Adding support for column layout in renderer. [51ccf5f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/51ccf5f)
- [patch] Updated dependencies [51ccf5f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/51ccf5f)
  - @atlaskit/editor-common@13.0.9

## 19.0.6

- [patch] ED-5123: fix getText util when passing ADNode [195e6e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/195e6e0)
- [none] Updated dependencies [195e6e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/195e6e0)

## 19.0.5

- [patch] Updated dependencies [b1e8a47](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1e8a47)
  - @atlaskit/editor-common@13.0.7

## 19.0.4

- [patch] Fixing issue with image wrapper class name in renderer. [635c686](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/635c686)
- [none] Updated dependencies [635c686](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/635c686)

## 19.0.3

- [patch] New floating toolbar for Panel [4d528ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d528ab)
- [none] Updated dependencies [4d528ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d528ab)
  - @atlaskit/editor-common@13.0.5

## 19.0.2

- [patch] ED-5046, fixing image rendering in renderer. [1c70502](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c70502)
- [none] Updated dependencies [1c70502](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c70502)

## 19.0.1

- [patch] Updated dependencies [4342d93](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4342d93)
  - @atlaskit/editor-common@13.0.1

## 19.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/media-card@30.0.0
  - @atlaskit/media-filmstrip@10.0.0
  - @atlaskit/task-decision@8.0.0
  - @atlaskit/util-data-test@10.0.0
  - @atlaskit/profilecard@4.0.0
  - @atlaskit/editor-json-transformer@4.0.0
  - @atlaskit/editor-common@13.0.0
  - @atlaskit/editor-test-helpers@5.0.0
  - @atlaskit/mention@14.0.0
  - @atlaskit/media-core@22.0.0
  - @atlaskit/media-test-helpers@15.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/code@7.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/size-detector@5.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/media-card@30.0.0
  - @atlaskit/media-filmstrip@10.0.0
  - @atlaskit/task-decision@8.0.0
  - @atlaskit/util-data-test@10.0.0
  - @atlaskit/profilecard@4.0.0
  - @atlaskit/mention@14.0.0
  - @atlaskit/editor-json-transformer@4.0.0
  - @atlaskit/editor-test-helpers@5.0.0
  - @atlaskit/editor-common@13.0.0
  - @atlaskit/media-test-helpers@15.0.0
  - @atlaskit/media-core@22.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/code@7.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/size-detector@5.0.0
  - @atlaskit/icon@13.0.0

## 18.2.18

- [none] Updated dependencies [5f6ec84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f6ec84)
  - @atlaskit/editor-test-helpers@4.2.4
  - @atlaskit/task-decision@7.1.14
  - @atlaskit/editor-common@12.0.0
  - @atlaskit/editor-json-transformer@3.1.8
- [patch] Updated dependencies [5958588](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5958588)
  - @atlaskit/editor-test-helpers@4.2.4
  - @atlaskit/task-decision@7.1.14
  - @atlaskit/editor-common@12.0.0
  - @atlaskit/editor-json-transformer@3.1.8

## 18.2.17

- [patch] Updated dependencies [c98857e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c98857e)
  - @atlaskit/mention@13.1.10
  - @atlaskit/util-data-test@9.1.19
  - @atlaskit/editor-test-helpers@4.2.3
  - @atlaskit/editor-common@11.4.6
- [patch] Updated dependencies [8a125a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a125a7)
  - @atlaskit/mention@13.1.10
  - @atlaskit/util-data-test@9.1.19
  - @atlaskit/editor-test-helpers@4.2.3
  - @atlaskit/editor-common@11.4.6
- [patch] Updated dependencies [cacfb53](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cacfb53)
  - @atlaskit/mention@13.1.10
  - @atlaskit/util-data-test@9.1.19
  - @atlaskit/editor-test-helpers@4.2.3
  - @atlaskit/editor-common@11.4.6

## 18.2.16

- [patch] Updated dependencies [6f51fdb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6f51fdb)
  - @atlaskit/editor-common@11.4.5

## 18.2.15

- [patch] ED-5037 don't render 0px column width if no size has been set [e1cb1c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e1cb1c6)
- [none] Updated dependencies [e1cb1c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e1cb1c6)

## 18.2.14

- [patch] add heading id [1f301cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1f301cc)

- [none] Updated dependencies [1f301cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1f301cc)
- [none] Updated dependencies [a973ac3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a973ac3)

## 18.2.13

- [patch] Updated dependencies [17b638b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/17b638b)
  - @atlaskit/editor-common@11.3.14

## 18.2.12

- [none] Updated dependencies [8c711bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c711bd)
  - @atlaskit/editor-test-helpers@4.2.1
  - @atlaskit/editor-common@11.3.12
- [patch] Updated dependencies [42ee1ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42ee1ea)
  - @atlaskit/media-test-helpers@14.0.6
  - @atlaskit/media-filmstrip@9.0.7
  - @atlaskit/media-core@21.0.0
  - @atlaskit/editor-common@11.3.12
  - @atlaskit/media-card@29.1.8
  - @atlaskit/editor-test-helpers@4.2.1

## 18.2.11

- [patch] Add missing dependencies to packages to get the website to build [99446e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/99446e3)

- [none] Updated dependencies [99446e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/99446e3)
  - @atlaskit/media-filmstrip@9.0.6
  - @atlaskit/profilecard@3.13.1
  - @atlaskit/docs@4.2.2
- [none] Updated dependencies [9bac948](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9bac948)
  - @atlaskit/media-filmstrip@9.0.6
  - @atlaskit/docs@4.2.2

## 18.2.10

- [patch] Updated dependencies [d7dca64](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7dca64)
  - @atlaskit/mention@13.1.4
  - @atlaskit/util-data-test@9.1.16
  - @atlaskit/editor-common@11.3.10

## 18.2.9

- [patch] Updated dependencies [8d5053e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d5053e)
  - @atlaskit/util-data-test@9.1.15
  - @atlaskit/task-decision@7.1.8
  - @atlaskit/mention@13.1.3
  - @atlaskit/editor-json-transformer@3.1.5
  - @atlaskit/editor-common@11.3.8
  - @atlaskit/editor-test-helpers@4.1.9

## 18.2.8

- [patch] Updated dependencies [eee2d45](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eee2d45)
  - @atlaskit/code@6.0.0
  - @atlaskit/docs@4.2.1

## 18.2.7

- [patch] Updated dependencies [0cf2f52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0cf2f52)
  - @atlaskit/util-data-test@9.1.14
  - @atlaskit/task-decision@7.1.7
  - @atlaskit/mention@13.1.2
  - @atlaskit/editor-json-transformer@3.1.4
  - @atlaskit/editor-test-helpers@4.1.8
  - @atlaskit/editor-common@11.3.7

## 18.2.6

- [patch] Updated dependencies [c57e9c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c57e9c1)
  - @atlaskit/media-test-helpers@14.0.4
  - @atlaskit/media-filmstrip@9.0.5
  - @atlaskit/media-card@29.1.5
  - @atlaskit/editor-common@11.3.5
  - @atlaskit/editor-test-helpers@4.1.7
  - @atlaskit/media-core@20.0.0

## 18.2.5

- [patch] Remove pinned prosemirror-model@1.4.0 and move back to caret ranges for prosemirror-model@^1.5.0 [4faccc0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4faccc0)
- [patch] Updated dependencies [4faccc0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4faccc0)
  - @atlaskit/task-decision@7.1.2
  - @atlaskit/editor-common@11.3.0
  - @atlaskit/editor-test-helpers@4.1.5
  - @atlaskit/editor-json-transformer@3.1.3

## 18.2.4

- [patch] ED-4741, adding support for date node in renderer. [2460f47](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2460f47)
- [none] Updated dependencies [2460f47](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2460f47)
  - @atlaskit/editor-common@11.2.9

## 18.2.3

- [patch] Updated dependencies [74a0d46](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/74a0d46)
  - @atlaskit/media-card@29.1.3
  - @atlaskit/media-filmstrip@9.0.4
  - @atlaskit/editor-common@11.2.8
- [patch] Updated dependencies [6c6f078](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c6f078)
  - @atlaskit/media-card@29.1.3
  - @atlaskit/media-filmstrip@9.0.4
  - @atlaskit/editor-common@11.2.8
- [patch] Updated dependencies [5bb26b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5bb26b4)
  - @atlaskit/media-card@29.1.3
  - @atlaskit/media-filmstrip@9.0.4
  - @atlaskit/editor-common@11.2.8

## 18.2.2

- [patch] Adds in proper task and decision support for text representation [e59b749](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e59b749)
- [none] Updated dependencies [e59b749](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e59b749)

## 18.2.1

- [patch] Add Table breakout mode in renderer [0d3b375](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d3b375)
- [none] Updated dependencies [0d3b375](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d3b375)
  - @atlaskit/editor-common@11.2.5

## 18.2.0

- [minor] Refactor text serializer a bit and adds in table support [7393dc3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7393dc3)
- [none] Updated dependencies [7393dc3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7393dc3)

## 18.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/media-card@29.1.2
  - @atlaskit/util-data-test@9.1.13
  - @atlaskit/task-decision@7.1.1
  - @atlaskit/mention@13.1.1
  - @atlaskit/editor-json-transformer@3.1.2
  - @atlaskit/media-filmstrip@9.0.3
  - @atlaskit/editor-test-helpers@4.1.2
  - @atlaskit/editor-common@11.2.1
  - @atlaskit/media-test-helpers@14.0.3
  - @atlaskit/media-core@19.1.3
  - @atlaskit/theme@4.0.4
  - @atlaskit/code@5.0.4
  - @atlaskit/size-detector@4.1.2
  - @atlaskit/icon@12.1.2

## 18.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/media-card@29.1.1
  - @atlaskit/util-data-test@9.1.12
  - @atlaskit/editor-json-transformer@3.1.1
  - @atlaskit/media-filmstrip@9.0.2
  - @atlaskit/editor-test-helpers@4.1.1
  - @atlaskit/editor-common@11.1.2
  - @atlaskit/media-test-helpers@14.0.2
  - @atlaskit/media-core@19.1.2
  - @atlaskit/theme@4.0.3
  - @atlaskit/icon@12.1.1
  - @atlaskit/code@5.0.3
  - @atlaskit/docs@4.1.1
  - @atlaskit/size-detector@4.1.1

## 18.1.0

- [none] Updated dependencies [7217164](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7217164)
  - @atlaskit/editor-test-helpers@4.1.0
  - @atlaskit/task-decision@7.1.0
  - @atlaskit/util-data-test@9.1.11
  - @atlaskit/mention@13.1.0
  - @atlaskit/editor-common@11.1.0
  - @atlaskit/editor-json-transformer@3.1.0

## 18.0.4

- [patch] Updated dependencies [2de7ce7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2de7ce7)
  - @atlaskit/media-card@29.0.3
  - @atlaskit/editor-common@11.0.7
- [patch] Updated dependencies [97efb49](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97efb49)
  - @atlaskit/media-card@29.0.3
  - @atlaskit/editor-common@11.0.7
- [patch] Updated dependencies [f86d117](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f86d117)
  - @atlaskit/media-card@29.0.3
  - @atlaskit/editor-common@11.0.7

## 18.0.3

- [patch] Update and lock prosemirror-model version to 1.4.0 [febf753](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febf753)
- [none] Updated dependencies [febf753](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febf753)
  - @atlaskit/editor-common@11.0.6
  - @atlaskit/editor-test-helpers@4.0.7
  - @atlaskit/editor-json-transformer@3.0.11

## 18.0.2

- [patch] Updated dependencies [823caef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/823caef)
  - @atlaskit/media-card@29.0.2
  - @atlaskit/editor-common@11.0.3

## 18.0.1

- [patch] Updated dependencies [732d2f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/732d2f5)
  - @atlaskit/media-card@29.0.1
  - @atlaskit/editor-common@11.0.2

## 18.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/media-card@29.0.0
  - @atlaskit/util-data-test@9.1.10
  - @atlaskit/task-decision@7.0.0
  - @atlaskit/mention@13.0.0
  - @atlaskit/editor-json-transformer@3.0.9
  - @atlaskit/media-filmstrip@9.0.0
  - @atlaskit/editor-test-helpers@4.0.3
  - @atlaskit/editor-common@11.0.0
  - @atlaskit/media-test-helpers@14.0.0
  - @atlaskit/media-core@19.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/code@5.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/size-detector@4.0.0

## 17.0.9

- [patch] Updated dependencies [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/media-card@28.0.6
  - @atlaskit/util-data-test@9.1.9
  - @atlaskit/task-decision@6.0.9
  - @atlaskit/mention@12.0.3
  - @atlaskit/editor-json-transformer@3.0.8
  - @atlaskit/media-filmstrip@8.0.9
  - @atlaskit/editor-test-helpers@4.0.2
  - @atlaskit/editor-common@10.1.9

## 17.0.8

- [patch] Updated dependencies [35d547f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d547f)
  - @atlaskit/media-card@28.0.5
  - @atlaskit/editor-common@10.1.4

## 17.0.7

- [patch] Fix mediaSingle [179332e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/179332e)
- [none] Updated dependencies [179332e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/179332e)

## 17.0.6

- [patch] Updated dependencies [41eb1c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/41eb1c1)
  - @atlaskit/editor-common@10.1.3

## 17.0.5

- [patch] ED-4447 Fix image breakout rendering [b73e05d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b73e05d)
- [none] Updated dependencies [b73e05d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b73e05d)
  - @atlaskit/editor-common@10.1.2

## 17.0.4

- [patch] Updated dependencies [639ae5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/639ae5e)
  - @atlaskit/mention@12.0.2
  - @atlaskit/util-data-test@9.1.7
  - @atlaskit/editor-common@10.1.1

## 17.0.3

- [patch] Updated dependencies [0edc6c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0edc6c8)

## 17.0.2

- [patch] Updated dependencies [758b342](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/758b342)
  - @atlaskit/task-decision@6.0.7

## 17.0.1

- [none] Updated dependencies [ba702bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ba702bc)
  - @atlaskit/mention@12.0.0
  - @atlaskit/util-data-test@9.1.6
  - @atlaskit/editor-common@10.0.3

## 17.0.0

- [patch] ED-4570, application card without icon should render properly. [714ab32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/714ab32)
- [none] Updated dependencies [febc44d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febc44d)
  - @atlaskit/editor-test-helpers@4.0.0
  - @atlaskit/task-decision@6.0.6
  - @atlaskit/util-data-test@9.1.4
  - @atlaskit/editor-common@10.0.0
  - @atlaskit/editor-json-transformer@3.0.7

## 16.3.0

- [minor] Adds support for adfStage [4b303ce](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b303ce)
- [none] Updated dependencies [4b303ce](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b303ce)

## 16.2.6

- [none] Updated dependencies [8fd4dd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fd4dd1)
  - @atlaskit/editor-test-helpers@3.1.8
  - @atlaskit/task-decision@6.0.5
  - @atlaskit/util-data-test@9.1.3
  - @atlaskit/mention@11.1.4
  - @atlaskit/editor-json-transformer@3.0.6
  - @atlaskit/editor-common@9.3.9

## 16.2.5

- [patch] Renamed smart card components and exposed inline smart card views [1094bb6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1094bb6)
- [patch] Updated dependencies [1094bb6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1094bb6)
  - @atlaskit/media-card@27.1.3

## 16.2.4

- [patch] Adding nested ul support [ce87690](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce87690)
- [none] Updated dependencies [ce87690](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce87690)

## 16.2.3

- [patch] Disable overlay for mediaSingle [147bc84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/147bc84)
- [none] Updated dependencies [147bc84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/147bc84)
  - @atlaskit/editor-common@9.3.6

## 16.2.2

- [patch] ED-4120 support placeholder text in renderer [616a6a5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/616a6a5)
- [patch] Updated dependencies [616a6a5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/616a6a5)
  - @atlaskit/editor-common@9.3.5

## 16.2.1

- [patch] Updated dependencies [3ef21cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ef21cd)
  - @atlaskit/editor-common@9.3.4

## 16.2.0

- [minor] Set line-height based on appearance [b21cd55](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b21cd55)
- [none] Updated dependencies [b21cd55](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b21cd55)

## 16.1.3

- [patch] Add a blank space between mention and text in text renderer [940ecc7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/940ecc7)

## 16.1.0

- [minor] Adding support for external images [9935105](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9935105)

## 16.0.8

- [patch] ED-4568, adding support for panel types success and error in renderer. [1aef8d2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1aef8d2)

## 16.0.5

- [patch] Fix rendering of multiple text nodes in inline code [9ee5612](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ee5612)

## 16.0.4

- [patch] CFE-1078: Add the type of extension to the call to extension handler [4db252c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4db252c)

## 16.0.2

- [patch] Use node type as fallback behavior for unsupported node [090d962](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/090d962)

## 16.0.1

- [patch] Always wrap text [bcd3361](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bcd3361)

## 15.0.1

- [patch] Added missing dependencies and added lint rule to catch them all [0672503](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0672503)

## 15.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 14.0.0

- [major] Generic Text Serializer [1549347](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1549347)

## 13.3.3

- [patch] support table colwidth in renderer, fix other table properties in email renderer [f78bef4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f78bef4)

## 13.2.0

- [minor] stop creating mediaContext in MediaCard component [ad8c3c0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ad8c3c0)

## 13.0.16

- [patch] Move types/interfaces for ExtensionHandlers to editor-common [3d26cab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d26cab)

## 13.0.14

- [patch] Prevent CodeBlocks from overflowing their container [50cc975](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50cc975)

## 13.0.13

- [patch] Upgrading ProseMirror Libs [35d14d5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d14d5)

## 13.0.11

- [patch] Adds styling for unknown blocks [5cdc63c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5cdc63c)

## 13.0.10

- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)

## 13.0.9

- [patch] Change Media Group resize mode to full-fit from crop [05575db](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/05575db)

## 13.0.6

- [patch] Add analytics events for click and show actions of media-card [031d5da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/031d5da)

## 13.0.2

- [patch] Adds margin-top to ApplicationCard, MediaGroup and CodeBlock in renderer content [f2ae5ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f2ae5ca)

## 12.2.0

- [minor] E-mail renderer [722657b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/722657b)

## 12.1.0

- [minor] Fixes Media Cards in renderer [064bfb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/064bfb5)

## 12.0.0

- [major] Use media-core as peerDependency [c644812](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c644812)

## 11.5.11

- [patch] Add key as an optional parameter to applicationCard actions [28be081](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/28be081)

## 11.5.6

- [patch] Fix missing styled-components dependency [64d89c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64d89c8)

## 11.5.5

- [patch] Remove margin from first headings [c8c342d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8c342d)

## 11.5.4

- [patch] add span and background attribs for table nodes in renderer [8af61df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8af61df)

## 11.5.1

- [patch] FS-1461 fixed rendererContext handling in TaskItem [6023540](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6023540)

## 11.5.0

- [minor] FS-1461 objectAri and containerAri are optional in RendererContext [1b20296](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b20296)

## 11.4.5

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 11.4.3

- [patch] added a prop to enable the new applicationCard designs [3057eb2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3057eb2)

## 11.4.1

- [patch] bump editor-common to 6.1.2 [bb7802e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb7802e)

## 11.4.0

- [minor] Support mediaSingle [400ff24](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/400ff24)

## 11.3.10

- [patch] bump mention to 9.1.1 to fix mention autocomplete bug [c7708c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c7708c6)

## 11.3.7

- [patch] move MediaItem to renderer, bump icons [5e71725](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e71725)

## 11.3.6

- [patch] Bump editor versions [afa6885](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/afa6885)

## 11.3.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 11.0.0

- [major] We now use ProseMirror Schema to validate document [d059d6a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d059d6a)

## 10.1.5

- [patch] FS-1581 decreased big emoji size [fe39b29](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fe39b29)

## 10.1.3

- [patch] Fixed stand alone file and link card rendering [9b467a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b467a6)

## 10.1.0

- [minor] Add ADF-Encoder utility to simplify using a transformer with the renderer [5b1ea37](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b1ea37)

## 10.0.5

- [patch] Only bodiedExtension has content [6d4caae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d4caae)

## 10.0.3

- [patch] Bumped task decision version [1180bbe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1180bbe)

## 10.0.0

- [major] Addes in extension node and modify ReactSerializer class construtor to accept an object. [e408698](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e408698)
- [major] Addes in extension node [e52d336](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e52d336)

## 9.0.0

- [major] Update signature onClick event on filmstrip (renderer) [30bdfcc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30bdfcc)

## 8.12.0

- [patch] Fix dependencies [9f9de42](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f9de42)

## 8.11.0

- [minor] Move validators from renderer to editor-common [3e2fd00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3e2fd00)

## 8.10.13

- [patch] Use styled-component for link mark to avoid cascading styles to affect media. [0c9475b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c9475b)

## 8.10.10

- [patch] bump icon dependency [da14956](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da14956)

## 8.10.4

- [patch] Fixed stand alone file and link card rendering [9b467a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b467a6)

## 8.10.2

- [patch] Upgrade mention to ^8.1.0 in editor and renderer [48b5af4](48b5af4)

## 8.10.0

- [minor] Adding 'image' node for bitbucket consumption; this is unstable and should not be used [590ce41](590ce41)

## 8.8.1

- [patch] Use correct dependencies [7b178b1](7b178b1)
- [patch] Adding responsive behavior to the editor. [e0d9867](e0d9867)

## 8.8.0

- [minor] Added big emoji rendering logic to renderer [f85c47a](f85c47a)

## 8.7.1

- [patch] Removing the attrs.language !== undefined validation check for codeBlock nodes [1c20b73](1c20b73)

## 8.7.0

- [minor] Upgrade Media Editor packages [193c8a0](193c8a0)
