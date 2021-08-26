# @atlaskit/smart-card

## 16.1.0

### Minor Changes

- [`978e9280610`](https://bitbucket.org/atlassian/atlassian-frontend/commits/978e9280610) - add support for platform in BlockCard component

### Patch Changes

- [`b90c0237824`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b90c0237824) - Update package.jsons to remove unused dependencies.
- Updated dependencies

## 16.0.0

### Major Changes

- [`86aeb07cae3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/86aeb07cae3) - EDM-2264: allow embed resize events from all domains

  **Note:**

  The breaking change in this commit is a rename from `IframelyResizeMessageListener` to `EmbedResizeMessageListener`. The functionality of the component itself remains the same for all consumers.

### Minor Changes

- [`b6aabf0bfe4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6aabf0bfe4) - Expose useSmartLinkEvents hook from smart-card
- [`00de5482a5a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/00de5482a5a) - # expose smart-link selectors

  Documentation with visual examples: https://hello.atlassian.net/wiki/spaces/~hzarcogarcia/pages/1250247546/How+to+use+smart+link+classnames

  ```
  import {
    contentFooterClassName,
    metadataListClassName,
    blockCardResolvingViewClassName,
    blockCardResolvedViewClassName,
    blockCardForbiddenViewClassName,
    blockCardIconImageClassName,
    loadingPlaceholderClassName
  } from '@atlaskit/smart-card';

  // Example usage:

  css`
    .${contentFooterClassName} {
      background-color: red;
    }
  `
  ```

- [`17776bda189`](https://bitbucket.org/atlassian/atlassian-frontend/commits/17776bda189) - - Improve Smart Links providers and batch requests mechanism
  - Remove non-functional props that impact reloading
- [`8e6a1034cfd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8e6a1034cfd) - EDM-1730: added in-product Cypress tests for Smart Links

### Patch Changes

- [`5c5f3cccdd0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c5f3cccdd0) - Revert changes to fix a regression CEMS-2063
- [`ab8f0df38a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ab8f0df38a0) - Replacing bottleneck library with p-throttle
- [`c0d4f38bf63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0d4f38bf63) - Fix regexp for Polaris (Jira Product Discovery) View links.
- Updated dependencies

## 15.5.0

### Minor Changes

- [`96b6fb1c6b9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/96b6fb1c6b9) - Add sandbox property to Smart Links embed
- [`c0fa45830e1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0fa45830e1) - Add sandbox prop to Smart Links block card preview iframe

### Patch Changes

- Updated dependencies

## 15.4.0

### Minor Changes

- [`3c79bfd15b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c79bfd15b4) - Add sideEffects false for better tree-shaking support

### Patch Changes

- Updated dependencies

## 15.3.1

### Patch Changes

- [`d9cfa5c45dc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9cfa5c45dc) - Render Polaris (Jira Product Discovery) view as an embed by default
- Updated dependencies

## 15.3.0

### Minor Changes

- [`f7ff2c84451`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7ff2c84451) - bump json-ld-types from 2.2.2 to ^2.3.0"
- [`c9dd0243320`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c9dd0243320) - [ux] prepend page title with emoji icon for smart link and block card

### Patch Changes

- Updated dependencies

## 15.2.1

### Patch Changes

- [`277ed9667b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/277ed9667b2) - Fixed media bundle names following atlassian-frontend linting rules
- Updated dependencies

## 15.2.0

### Minor Changes

- [`e494a28d544`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e494a28d544) - New exported member `embedHeaderHeight` is added. Also all the instances of `onResolve` callback now return an object that contains optional extra property `aspectRatio`.

### Patch Changes

- Updated dependencies

## 15.1.0

### Minor Changes

- [`dfbb0a86959`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfbb0a86959) - [ux] Add ability for avatars to be shown in card view through adding the extractBlockUsers method
- [`203e4021ada`](https://bitbucket.org/atlassian/atlassian-frontend/commits/203e4021ada) - [ux] Add support of .docx, .xlsx, .pptx, .rar mime types and folder; fix .doc and .ppt

### Patch Changes

- [`77cb0c11652`](https://bitbucket.org/atlassian/atlassian-frontend/commits/77cb0c11652) - Fix person avatar in block view
- [`9f46fd1bdc5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f46fd1bdc5) - EDM-1835: Slack message links will now be rendered as block by default
- Updated dependencies

## 15.0.1

### Patch Changes

- [`845dee52a4a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/845dee52a4a) - [ux] Adds additional request access metadata to forbidden urls if avalible
- [`8d6a82191ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d6a82191ab) - Removes unused props from icon usage.
- [`695ce4fe717`](https://bitbucket.org/atlassian/atlassian-frontend/commits/695ce4fe717) - Adds additional request access metadata to forbidden urls if avalible
- Updated dependencies

## 15.0.0

### Major Changes

- [`08c624ac7b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/08c624ac7b8) - [ux] `inlinePreloaderStyle` prop was added to SmartCard. It can be either `'on-left-with-skeleton'` or a `'on-right-without-skeleton'`

### Patch Changes

- [`5fb017ec308`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5fb017ec308) - feat: EDM-1692, add Smart Links showcase
- [`5216ebed3b6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5216ebed3b6) - Expose and use atlassian-icon, jira-icon entry points
- [`8f0196da8a2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f0196da8a2) - NO-ISSUE opimtise bottleneck import for size
- Updated dependencies

## 14.8.5

### Patch Changes

- [`e604c297faf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e604c297faf) - Prevent resolveUnsupported errors being sent as unresolved events to stop SLO pollution.

## 14.8.4

### Patch Changes

- [`d9d5322b260`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9d5322b260) - [ux] Render as a blue link in adf when there is a fatal error on smartcard
- Updated dependencies

## 14.8.3

### Patch Changes

- [`eda409bf20`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eda409bf20) - Handle network errors in smart-card client
- Updated dependencies

## 14.8.2

### Patch Changes

- [`965c783580`](https://bitbucket.org/atlassian/atlassian-frontend/commits/965c783580) - add override references for Trello only

## 14.8.1

### Patch Changes

- [`fae156831b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fae156831b) - Removed unused devDependency (was only used in one example, which has been refactored)
- [`df97510b77`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df97510b77) - handle backend errors in smart-link dataloader
- [`b4cd19ad66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4cd19ad66) - To allow jira roadmap link with query param to convert to embed view
- Updated dependencies

## 14.8.0

### Minor Changes

- [`6bef7adf66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6bef7adf66) - `Card` component expects optional `embedIframeRef` iframe ref. New `IframelyResizeMessageListener` HOC component export is introduced.

### Patch Changes

- [`c66e17de46`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c66e17de46) - Add CDN version of Iframely domain names for validation
- [`be5153bf8d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be5153bf8d) - dont access status of undefined responses
- Updated dependencies

## 14.7.0

### Minor Changes

- [`48995f73b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/48995f73b2) - Create entry points to export internal API isolated from UI changes.

### Patch Changes

- Updated dependencies

## 14.6.1

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 14.6.0

### Minor Changes

- [`950ed4f24c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/950ed4f24c) - [ux] The embed card will now fallback to a inlineCard instead of blockCard in mobile

### Patch Changes

- [`09394e2986`](https://bitbucket.org/atlassian/atlassian-frontend/commits/09394e2986) - EDM-668: exporting types for better typings support in Editor Core
- [`f5f91bc98d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5f91bc98d) - ED-10417 Unskip smart link hooks tests
- Updated dependencies

## 14.5.0

### Minor Changes

- [`09de4533b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/09de4533b0) - Make findPattern available to consumers
- [`3ae1d5929f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3ae1d5929f) - [ux] Jira roadmap of classic projects will now be an embedCard by default

### Patch Changes

- Updated dependencies

## 14.4.4

### Patch Changes

- [`676241b24e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/676241b24e) - HOT-93133: fix analytics for Smart Links

## 14.4.3

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 14.4.2

### Patch Changes

- Updated dependencies

## 14.4.1

### Patch Changes

- [`2ac834240e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ac834240e) - Undo analytics-next file restructure to allow external ts definitions to continue working

## 14.4.0

### Minor Changes

- [`22105274d2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22105274d2) - Only render smart-card when context.value is available
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

### Patch Changes

- [`595078d4ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/595078d4ea) - Fix allowing color of text for card/block view to be changed for undefined links.
- [`14fd36bb89`](https://bitbucket.org/atlassian/atlassian-frontend/commits/14fd36bb89) - chore: move from `exponential-backoff` to `async-retry` - package already part of mono-repo
- [`43154333ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/43154333ff) - Add Extensionkey to Analytics events
- Updated dependencies

## 14.3.0

### Minor Changes

- [`bc754bab5f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc754bab5f) - expose SmartCardContext from @atlaskit/smart-card

## 14.2.3

### Patch Changes

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

- [`fae131be3b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fae131be3b) - Improve frontend batching logic and timing by using 'bottleneck'
- Updated dependencies

## 14.2.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 14.2.1

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 14.2.0

### Minor Changes

- [`fae1f71b0f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fae1f71b0f) - Implement caching of duplicate URLs

### Patch Changes

- [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the 'lodash' package instead of single-function 'lodash.\*' packages
- [`fa6fb5dfbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa6fb5dfbb) - Removing unused code to be published
- [`fae15b52ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fae15b52ef) - Implement a delay queue between batch requests to the backend, to avoid flooding the backend with too many requests at once.
- [`889a2d9486`](https://bitbucket.org/atlassian/atlassian-frontend/commits/889a2d9486) - fix: updated error views for all Inline and Block links
- [`de5ee48f89`](https://bitbucket.org/atlassian/atlassian-frontend/commits/de5ee48f89) - fix: added icon prop on media-ui, InlineCardForbiddenView - moving to updated link framework for fforbidden view of Inline Smart Links.
- Updated dependencies

## 14.1.0

### Minor Changes

- [`4311cf9bf1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4311cf9bf1) - Add additional connectFailedEvent reasons for smartcards

### Patch Changes

- [`d035bea822`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d035bea822) - chore: add integration tests for Smart Links lazy rendering
- [`9fb8fb388d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fb8fb388d) - Include resourceType in instrumentation
- [`38322cbf9a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/38322cbf9a) - EDM-134: perform patterns check on front-end, remove unneeded loading complexity
- [`8f2f2422a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f2f2422a1) - EDM-955: Fix error state height for embeds
- Updated dependencies

## 14.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 13.5.1

### Patch Changes

- [`cd9c2500a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd9c2500a8) - EDM-834: Jira Roadmap embeds will now be an embedCard by default and also wide
- [`b17d1c437a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b17d1c437a) - EDM-920: add required className to intersection observer loader

## 13.5.0

### Minor Changes

- [`0ae829a4ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ae829a4ea) - EDM-648: Adds resizing and alignment to embed cards
- [`62269a3e45`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62269a3e45) - Added undefined links
- [`996e045cc4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/996e045cc4) - EDM-776: add platform prop to @atlaskit/smart-card for rendering fallback on mobile (embed -> block)

### Patch Changes

- [`4360fd6cd4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4360fd6cd4) - fix: performance for Smart Links to same URL (exponential) and different (extraneous re-renders).
- [`1508cc97c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1508cc97c9) - fix: lazy-rendering, React key, isFrameVisible in @atlaskit/renderer and click handlers for EmbedCard components.
- [`328902687e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/328902687e) - Remove stack traces from media analytic events
- Updated dependencies

## 13.4.1

### Patch Changes

- [`455e383cda`](https://bitbucket.org/atlassian/atlassian-frontend/commits/455e383cda) - Use IntersectionObserver in smart-card to detect when a link enters the viewport
- Updated dependencies

## 13.4.0

### Minor Changes

- [`50c333ab3a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50c333ab3a) - EDM-216: Adds EmbedCards in the Editor under the flag - allowEmbeds in the UNSAFE_cards prop

### Patch Changes

- [`567df106ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/567df106ff) - fix: generate id internal to smart-card
- [`9961ccddcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9961ccddcf) - EDM-665: fix error handling of Smart Links
- [`6d83e76a4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6d83e76a4f) - Add performance tracking to analytics events
- [`2e751e2a5b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e751e2a5b) - EDM-688: add error messages to Smart Link unresolved events.
- Updated dependencies

## 13.3.0

### Minor Changes

- [`9848dca5c7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9848dca5c7) - Updated json-ld-types to 2.1.0

### Patch Changes

- Updated dependencies

## 13.2.0

### Minor Changes

- [minor][d6eb7bb49f](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6eb7bb49f):

  Add support for embed cards- [minor][acc12dba75](https://bitbucket.org/atlassian/atlassian-frontend/commits/acc12dba75):

  fix: refactor of extractor logic in smart-card

### Patch Changes

- [patch][3b776be426](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b776be426):

  Change appearance of unauthorised inline cards- Updated dependencies [443bb984ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/443bb984ab):

- Updated dependencies [3b776be426](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b776be426):
- Updated dependencies [dc3bade5f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc3bade5f1):
- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [f6667f2909](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6667f2909):
- Updated dependencies [acc12dba75](https://bitbucket.org/atlassian/atlassian-frontend/commits/acc12dba75):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [68ff159118](https://bitbucket.org/atlassian/atlassian-frontend/commits/68ff159118):
- Updated dependencies [1b3a41f3ea](https://bitbucket.org/atlassian/atlassian-frontend/commits/1b3a41f3ea):
- Updated dependencies [0059d26429](https://bitbucket.org/atlassian/atlassian-frontend/commits/0059d26429):
- Updated dependencies [68e206c857](https://bitbucket.org/atlassian/atlassian-frontend/commits/68e206c857):
- Updated dependencies [91e6b95599](https://bitbucket.org/atlassian/atlassian-frontend/commits/91e6b95599):
  - @atlaskit/page@11.0.13
  - @atlaskit/media-ui@12.2.0
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/logo@12.3.4
  - @atlaskit/checkbox@10.1.11
  - @atlaskit/form@7.2.1
  - @atlaskit/inline-message@10.1.6
  - @atlaskit/table-tree@8.0.3

## 13.1.0

### Minor Changes

- [minor][17cc5dde5d](https://bitbucket.org/atlassian/atlassian-frontend/commits/17cc5dde5d):

  EDM-200: instrument metrics for preview mode- [minor][6641c9c5b5](https://bitbucket.org/atlassian/atlassian-frontend/commits/6641c9c5b5):

  Update the previewAction to add more rich detail- [minor][f061ed6c98](https://bitbucket.org/atlassian/atlassian-frontend/commits/f061ed6c98):

  EDM-199: add analytics for action invocations on Block links- [minor][49dbcfa64c](https://bitbucket.org/atlassian/atlassian-frontend/commits/49dbcfa64c):

  Implement actions in SmartCard component- [minor][318a1a0f2f](https://bitbucket.org/atlassian/atlassian-frontend/commits/318a1a0f2f):

  EDM-454: Actions in block cards are now behind the flag: showActions- [minor][8c8f0099d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c8f0099d8):

  fix: copy for block links, added not found view to match spec

### Patch Changes

- [patch][9b2570e7f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b2570e7f1):

  fix: blue links on error state- [patch][af10890541](https://bitbucket.org/atlassian/atlassian-frontend/commits/af10890541):

  fix: tests for i18n in media-ui- [patch][a81ce649c8](https://bitbucket.org/atlassian/atlassian-frontend/commits/a81ce649c8):

  fix: root extractor for object in block links- [patch][4070d17415](https://bitbucket.org/atlassian/atlassian-frontend/commits/4070d17415):

  Handle errors in SmartCard and report analytics event- [patch][e9d555132d](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9d555132d):

  fix: ui for block links- [patch][9691bb8eb9](https://bitbucket.org/atlassian/atlassian-frontend/commits/9691bb8eb9):

  Implement SmartLink actions- [patch][9dd4b9088b](https://bitbucket.org/atlassian/atlassian-frontend/commits/9dd4b9088b):

  EDM-563: Adding onClick handlers to BlockCard to Renderer handling- [patch][ba8c2c4129](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba8c2c4129):

  fix: icons for jira block links- [patch][0376c2f4fe](https://bitbucket.org/atlassian/atlassian-frontend/commits/0376c2f4fe):

  Pass display to anlytics attributes in SmartLinks- Updated dependencies [f459d99f15](https://bitbucket.org/atlassian/atlassian-frontend/commits/f459d99f15):

- Updated dependencies [17cc5dde5d](https://bitbucket.org/atlassian/atlassian-frontend/commits/17cc5dde5d):
- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
- Updated dependencies [3aedaac8c7](https://bitbucket.org/atlassian/atlassian-frontend/commits/3aedaac8c7):
- Updated dependencies [f061ed6c98](https://bitbucket.org/atlassian/atlassian-frontend/commits/f061ed6c98):
- Updated dependencies [49dbcfa64c](https://bitbucket.org/atlassian/atlassian-frontend/commits/49dbcfa64c):
- Updated dependencies [e9d555132d](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9d555132d):
- Updated dependencies [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies [d7b07a9ca4](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7b07a9ca4):
- Updated dependencies [318a1a0f2f](https://bitbucket.org/atlassian/atlassian-frontend/commits/318a1a0f2f):
- Updated dependencies [fd4b237ffe](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd4b237ffe):
- Updated dependencies [9691bb8eb9](https://bitbucket.org/atlassian/atlassian-frontend/commits/9691bb8eb9):
- Updated dependencies [5550919b98](https://bitbucket.org/atlassian/atlassian-frontend/commits/5550919b98):
- Updated dependencies [b5f17f0751](https://bitbucket.org/atlassian/atlassian-frontend/commits/b5f17f0751):
- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies [e9044fbfa6](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9044fbfa6):
- Updated dependencies [050781f257](https://bitbucket.org/atlassian/atlassian-frontend/commits/050781f257):
- Updated dependencies [4635f8107b](https://bitbucket.org/atlassian/atlassian-frontend/commits/4635f8107b):
- Updated dependencies [aff1210e19](https://bitbucket.org/atlassian/atlassian-frontend/commits/aff1210e19):
- Updated dependencies [ba8c2c4129](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba8c2c4129):
- Updated dependencies [d3547279dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3547279dd):
- Updated dependencies [67bc25bc3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/67bc25bc3f):
- Updated dependencies [f3587bae11](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3587bae11):
- Updated dependencies [8c8f0099d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c8f0099d8):
  - @atlaskit/media-ui@12.1.0
  - @atlaskit/docs@8.5.1
  - @atlaskit/theme@9.5.3
  - @atlaskit/analytics-next@6.3.6
  - @atlaskit/button@13.3.10
  - @atlaskit/textarea@2.2.7
  - @atlaskit/icon-file-type@5.0.4

## 13.0.0

### Major Changes

- [major][77474b6821](https://bitbucket.org/atlassian/atlassian-frontend/commits/77474b6821):

  ### The one with a new block card view

  For a long time, smart cards have had rumours of a new view, a block 'card' view that shows more information. This is the time to see it live! Cards in smart card are here.

  For now, integrating this is being managed by the editor-media team.

### Patch Changes

- [patch][d7ed7b1513](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7ed7b1513):

  Remove export \* from media components- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):

- Updated dependencies [dda84ee26d](https://bitbucket.org/atlassian/atlassian-frontend/commits/dda84ee26d):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [196500df34](https://bitbucket.org/atlassian/atlassian-frontend/commits/196500df34):
- Updated dependencies [77474b6821](https://bitbucket.org/atlassian/atlassian-frontend/commits/77474b6821):
- Updated dependencies [d7ed7b1513](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7ed7b1513):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
  - @atlaskit/docs@8.4.0
  - @atlaskit/media-ui@12.0.0
  - @atlaskit/icon-file-type@5.0.3
  - @atlaskit/icon-object@5.0.3
  - @atlaskit/icon@20.1.0
  - @atlaskit/table-tree@8.0.2
  - @atlaskit/button@13.3.9
  - @atlaskit/checkbox@10.1.10
  - @atlaskit/form@7.1.5
  - @atlaskit/inline-message@10.1.5
  - @atlaskit/radio@3.1.11
  - @atlaskit/textarea@2.2.6
  - @atlaskit/textfield@3.1.9

## 12.7.0

### Minor Changes

- [minor][f709e92247](https://bitbucket.org/atlassian/atlassian-frontend/commits/f709e92247):

  Adding an optional prop testId that will set the attribute value data-testid. It will help products to write better integration and end to end tests.

### Patch Changes

- Updated dependencies [8c7f68d911](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c7f68d911):
- Updated dependencies [eaad41d56c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eaad41d56c):
- Updated dependencies [f709e92247](https://bitbucket.org/atlassian/atlassian-frontend/commits/f709e92247):
- Updated dependencies [0e562f2a4a](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e562f2a4a):
- Updated dependencies [c12ba5eb3e](https://bitbucket.org/atlassian/atlassian-frontend/commits/c12ba5eb3e):
- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
- Updated dependencies [91a1eb05db](https://bitbucket.org/atlassian/atlassian-frontend/commits/91a1eb05db):
- Updated dependencies [c1992227dc](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1992227dc):
  - @atlaskit/media-ui@11.9.0
  - @atlaskit/form@7.1.3
  - @atlaskit/icon@20.0.2
  - @atlaskit/textfield@3.1.7
  - @atlaskit/checkbox@10.1.8

## 12.6.5

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/checkbox@10.1.7
  - @atlaskit/form@7.1.2
  - @atlaskit/icon-file-type@5.0.2
  - @atlaskit/icon-object@5.0.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/inline-message@10.1.3
  - @atlaskit/page@11.0.12
  - @atlaskit/radio@3.1.9
  - @atlaskit/table-tree@8.0.1
  - @atlaskit/textarea@2.2.4
  - @atlaskit/textfield@3.1.6
  - @atlaskit/theme@9.5.1
  - @atlaskit/analytics-gas-types@4.0.13
  - @atlaskit/media-ui@11.8.3
  - @atlaskit/outbound-auth-flow-client@2.0.9

## 12.6.4

### Patch Changes

- [patch][5181c5d368](https://bitbucket.org/atlassian/atlassian-frontend/commits/5181c5d368):

  Disable flaky tests- [patch][555818c33a](https://bitbucket.org/atlassian/atlassian-frontend/commits/555818c33a):

  EDM-237: fix wrapping for inline Smart Links- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):

- Updated dependencies [555818c33a](https://bitbucket.org/atlassian/atlassian-frontend/commits/555818c33a):
  - @atlaskit/icon@20.0.0
  - @atlaskit/table-tree@8.0.0
  - @atlaskit/media-ui@11.8.2
  - @atlaskit/form@7.1.1
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/checkbox@10.1.6
  - @atlaskit/inline-message@10.1.2
  - @atlaskit/radio@3.1.8
  - @atlaskit/textfield@3.1.5
  - @atlaskit/page@11.0.11

## 12.6.3

### Patch Changes

- [patch][3002c015cc](https://bitbucket.org/atlassian/atlassian-frontend/commits/3002c015cc):

  Attempt to fix landkid errors- [patch][e0f0654d4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0f0654d4c):

  EM-93: added support for pull request lozenge colours.- Updated dependencies [ff32b3db47](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff32b3db47):

- Updated dependencies [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
  - @atlaskit/form@7.1.0
  - @atlaskit/docs@8.3.0
  - @atlaskit/media-ui@11.8.1

## 12.6.2

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Form has been converted to Typescript. TypeScript consumers will now get static type safety. Flow types are no longer provided. No API changes.- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/form@7.0.0
  - @atlaskit/checkbox@10.1.4
  - @atlaskit/radio@3.1.5
  - @atlaskit/textfield@3.1.4
  - @atlaskit/media-ui@11.7.2
  - @atlaskit/textarea@2.2.3

## 12.6.1

### Patch Changes

- [patch][5b8a074ce6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b8a074ce6):

  ED-7848: Stop re-creating smart card's redux store on every render

- Updated dependencies [c1d4898af5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1d4898af5):
- Updated dependencies [3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):
- Updated dependencies [f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):
  - @atlaskit/icon@19.0.11
  - @atlaskit/theme@9.3.0

## 12.6.0

### Minor Changes

- [minor][2f5306772c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2f5306772c):

  Updated analytics events and changed error handling to better support fallback onto blue links

## 12.5.11

### Patch Changes

- [patch][47ff615517](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/47ff615517):

  Ensure smartlinks client handles errors batched with JsonLd- [patch][ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):

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

## 12.5.10

### Patch Changes

- [patch][666464508d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/666464508d):

  handle undefined meta

## 12.5.9

- Updated dependencies [f9b5e24662](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9b5e24662):
  - @atlaskit/icon-file-type@5.0.0
  - @atlaskit/icon-object@5.0.0
  - @atlaskit/icon@19.0.8

## 12.5.8

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 12.5.7

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 12.5.6

- Updated dependencies [97bab7fd28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97bab7fd28):
  - @atlaskit/button@13.3.1
  - @atlaskit/form@6.2.3
  - @atlaskit/radio@3.0.18
  - @atlaskit/media-ui@11.6.7
  - @atlaskit/checkbox@10.0.0
  - @atlaskit/docs@8.1.7

## 12.5.5

### Patch Changes

- [patch][fc79969f86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc79969f86):

  Update all the theme imports in media to use multi entry points

## 12.5.4

### Patch Changes

- [patch][b8fd0f0847](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8fd0f0847):

  hot-88372: fix css props breaking in layoutNG.

## 12.5.3

### Patch Changes

- [patch][07dd73fa12](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07dd73fa12):

  FM-2240 Fix issue where smart links would cause hybrid renderer to crash in Android

## 12.5.2

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 12.5.1

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 12.5.0

### Minor Changes

- [minor][bdee736f14](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bdee736f14):

  ED-7175: unify smart link and hyperlink toolbars

  Also updates the toDOM and parseDOM on ADF nodes, making `url` optional.

  Smart cards can now optionally be passed an onResolve callback, of the shape:

      onResolve?: (data: { url?: string; title?: string }) => void;

  This gets fired when the view resolves a smart card from JSON-LD, either via the client or the `data` prop.

### Patch Changes

- [patch][32a88ae6b7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/32a88ae6b7):

  SL-365: link target for smart link should come from props rather than JSON-LD

  This also reduces the possibility of XSS attacks. Implementors should still verify they're not passing invalid URLs to the `smart-card` components.- [patch][7f1bab3c93](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f1bab3c93):

  SL-359: pass onClick props to pending and error states

## 12.4.4

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

## 12.4.3

- Updated dependencies [84887b940c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84887b940c):
  - @atlaskit/form@6.1.7
  - @atlaskit/icon@19.0.2
  - @atlaskit/textfield@3.0.0

## 12.4.2

### Patch Changes

- [patch][77b09e36eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/77b09e36eb):

  fix: provide the correct url for the edge proxy to api-private.atlassian.com

## 12.4.1

### Patch Changes

- [patch][688f2957ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/688f2957ca):

  Fixes various TypeScript errors which were previously failing silently

## 12.4.0

### Minor Changes

- [minor][b19bf68c22](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b19bf68c22):

  fix: when environment is not provided then default to using the edge proxy instead

## 12.3.5

### Patch Changes

- [patch][6695dbd447](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6695dbd447):

  fix: ensure smartlinks render a not found view when the link resource isn't found

## 12.3.4

### Patch Changes

- [patch][19a83a0c7e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/19a83a0c7e):

  fixed issues with cards not updating after authentication

## 12.3.3

### Patch Changes

- [patch][8903a232f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8903a232f7):

  fix: fallback to blue links when resolve is unsupported

## 12.3.2

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 12.3.1

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

  bugfix, fixes missing version.json file

## 12.3.0

### Minor Changes

- [minor][602ab89822](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/602ab89822):

  SL-345 add property for disabling auth flow of Smart Links (for Mobile).

## 12.2.8

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 12.2.7

### Patch Changes

- [patch][b346bb2963](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b346bb2963):

  added support for batching of link resolve requests in Smart Card client.

## 12.2.6

### Patch Changes

- [patch][c95713b660](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c95713b660):

  fix lazy rendering offset to be more portable between devices

## 12.2.5

- Updated dependencies [87a2638655](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87a2638655):
  - @atlaskit/button@13.0.10
  - @atlaskit/form@6.1.2
  - @atlaskit/radio@3.0.7
  - @atlaskit/media-ui@11.4.2
  - @atlaskit/checkbox@9.0.0

## 12.2.4

### Patch Changes

- [patch][aed5ccba18](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aed5ccba18):

  SL-343 fix behaviour when using middle-click or clicking inside of iframes for inline Smart Links.

## 12.2.3

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/checkbox@8.0.5
  - @atlaskit/form@6.1.1
  - @atlaskit/inline-message@10.0.7
  - @atlaskit/radio@3.0.6
  - @atlaskit/table-tree@7.0.6
  - @atlaskit/textfield@2.0.3
  - @atlaskit/media-ui@11.4.1
  - @atlaskit/icon@19.0.0

## 12.2.2

### Patch Changes

- [patch][4258086c0d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4258086c0d):

  fix: some smartlinks with sourcecode artifacts were being incorrectly rendered

## 12.2.1

### Patch Changes

- [patch][b5eb352152](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5eb352152):

  SL-336: fix page crash when state is undefined.

## 12.2.0

### Minor Changes

- [minor][09f094a7a2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/09f094a7a2):

  SL-259: bump react-lazily-render, remove react-lazily-render-scroll-parent.

## 12.1.1

### Patch Changes

- [patch][8e50d00fc6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8e50d00fc6):

  SL-331: fix edit handler for smart-card.

## 12.1.0

### Minor Changes

- [minor][86bf524679](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/86bf524679):

  ED-7117, ED-7087: Fix copy pasting smart links out of editor. Fallback to HTML anchor tag if errors occur during rendering (e.g. no provider found).

## 12.0.0

### Major Changes

- [major][393fb6acd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/393fb6acd2):

  refactor @atlaskit/smart-card front-end: simplification. BREAKING CHANGE: Client no longer accepts configuration options as first argument; deprecated in favour of new state management layer.

## 11.1.6

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/checkbox@8.0.2
  - @atlaskit/form@6.0.5
  - @atlaskit/inline-message@10.0.3
  - @atlaskit/radio@3.0.3
  - @atlaskit/table-tree@7.0.4
  - @atlaskit/textfield@2.0.1
  - @atlaskit/media-ui@11.2.8
  - @atlaskit/icon@18.0.0

## 11.1.5

### Patch Changes

- [patch][1347760307](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1347760307):

  - fix pull request, branch and commit name formatting

## 11.1.4

- Updated dependencies [70862830d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70862830d6):
  - @atlaskit/button@13.0.6
  - @atlaskit/form@6.0.4
  - @atlaskit/radio@3.0.2
  - @atlaskit/media-ui@11.2.7
  - @atlaskit/checkbox@8.0.0
  - @atlaskit/icon@17.2.0
  - @atlaskit/theme@9.1.0

## 11.1.3

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 11.1.2

- Updated dependencies [66af32c013](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66af32c013):
- Updated dependencies [1da5351f72](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1da5351f72):
  - @atlaskit/inline-message@10.0.0
  - @atlaskit/form@6.0.3
  - @atlaskit/radio@3.0.0

## 11.1.1

- Updated dependencies [3af5a7e685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3af5a7e685):
  - @atlaskit/media-ui@11.2.4
  - @atlaskit/page@11.0.0

## 11.1.0

- [minor][4969df0716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4969df0716):

  - fix lazy rendering bugs in Smart Links.

## 11.0.5

- [patch][27f666ed85](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/27f666ed85):

  - Fixed example.

## 11.0.4

- [patch][94ffb3b638](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/94ffb3b638):

  - check for taskType icon in the json payload

## 11.0.3

- [patch][6a52b3d258](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6a52b3d258):

  - fix for clicking behaviour in view/edit mode for Inline Smart Links.

## 11.0.2

- [patch][7e18a6398b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e18a6398b):

  - improve type safety when defining smart-card environment

## 11.0.1

- [patch][b7687b9981](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b7687b9981):

  - Changed smart link functionality so that it will open in the same tab if clicked.

## 11.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 10.5.0

- [minor][593404cba8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/593404cba8):

  - add status lozenge to source code issue references.

## 10.4.2

- Updated dependencies [dd95622388](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd95622388):
- Updated dependencies [6cdf11238d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6cdf11238d):
  - @atlaskit/form@5.2.10
  - @atlaskit/textarea@1.0.0
  - @atlaskit/textfield@1.0.0

## 10.4.1

- [patch][3e4c4d7e2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3e4c4d7e2d):

  - fix: send 'Origin' header in resolve requests

## 10.4.0

- [minor][da5a7f3390](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da5a7f3390):

  - fix third-party link extractors to resolve URLs more accurately.

## 10.3.1

- Updated dependencies [6c4e41ff36](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c4e41ff36):
  - @atlaskit/form@5.2.9
  - @atlaskit/radio@1.0.0

## 10.3.0

- [minor][ce985861c3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce985861c3):

  - Added analytics for UI actions, and updated existing operational analytics events

## 10.2.4

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/checkbox@6.0.4
  - @atlaskit/form@5.2.7
  - @atlaskit/icon@16.0.9
  - @atlaskit/icon-file-type@3.0.8
  - @atlaskit/icon-object@3.0.8
  - @atlaskit/inline-message@8.0.3
  - @atlaskit/radio@0.5.3
  - @atlaskit/textarea@0.4.4
  - @atlaskit/textfield@0.4.4
  - @atlaskit/media-ui@10.1.5
  - @atlaskit/theme@8.1.7

## 10.2.3

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next supplied from itself.

## 10.2.2

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/checkbox@6.0.3
  - @atlaskit/form@5.2.5
  - @atlaskit/icon@16.0.8
  - @atlaskit/icon-file-type@3.0.7
  - @atlaskit/icon-object@3.0.7
  - @atlaskit/inline-message@8.0.2
  - @atlaskit/page@9.0.3
  - @atlaskit/radio@0.5.2
  - @atlaskit/textarea@0.4.1
  - @atlaskit/textfield@0.4.3
  - @atlaskit/theme@8.1.6
  - @atlaskit/media-ui@10.1.3
  - @atlaskit/button@12.0.0

## 10.2.1

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 10.2.0

- [minor][9b0dd21ce7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b0dd21ce7):

  - allow the appearance of lozenges within smart link tasks to be configured

## 10.1.2

- [patch][aa117f5341](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aa117f5341):

  - fix alignment and UI for inline Smart Links.

## 10.1.1

- Updated dependencies [f504850fe2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f504850fe2):
  - @atlaskit/form@5.2.4
  - @atlaskit/textarea@0.4.0

## 10.1.0

- [minor][11a6c98707](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11a6c98707):

  - refactor Smart Links frontend directory structure.

## 10.0.2

- Updated dependencies [8eff47cacb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8eff47cacb):
  - @atlaskit/form@5.2.3
  - @atlaskit/textfield@0.4.0

## 10.0.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 10.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 9.11.4

- [patch][8ed53a1cbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8ed53a1cbb):

  - fix padding, wrapping for inline smart links.

## 9.11.3

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/icon@16.0.4
  - @atlaskit/icon-file-type@3.0.4
  - @atlaskit/icon-object@3.0.4
  - @atlaskit/textarea@0.2.5
  - @atlaskit/analytics-gas-types@3.2.5
  - @atlaskit/media-ui@9.2.1
  - @atlaskit/outbound-auth-flow-client@1.0.4
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics-next@4.0.0
  - @atlaskit/checkbox@6.0.0
  - @atlaskit/form@5.1.8
  - @atlaskit/inline-message@8.0.0
  - @atlaskit/page@9.0.0
  - @atlaskit/radio@0.5.0
  - @atlaskit/textfield@0.3.0
  - @atlaskit/theme@8.0.0

## 9.11.2

- Updated dependencies [e9b824bf86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e9b824bf86):
  - @atlaskit/form@5.1.7
  - @atlaskit/textfield@0.2.0

## 9.11.1

- [patch][2cb8c44165](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2cb8c44165):

  - Fix environments mix-up

## 9.11.0

- [minor][41147bbc4c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/41147bbc4c):

  - Fix for links in editor

## 9.10.0

- [minor][ea423a619f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea423a619f):

  - Fixed the call to the /check endpoint

## 9.9.0

- [minor][7f70e97f98](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f70e97f98):

  - Added environments to client

## 9.8.0

- [minor][1594f351d9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1594f351d9):

  - added inline extractors for Bitbucket and Github.

## 9.7.1

- Updated dependencies [d5bce1ea15](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5bce1ea15):
  - @atlaskit/media-ui@9.0.0

## 9.7.0

- [minor][1c62bcce7d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c62bcce7d):

  - Fix a problem with smart cards not appearing sometimes when lazy rendered and lazy loaded after code-split.

## 9.6.8

- [patch][af3918bc89](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af3918bc89):

  - The url part of the unauthorized link is now grey

## 9.6.7

- [patch][abce6949c0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abce6949c0):

  - fix icon sizing and url key.

## 9.6.6

- [patch][5ae645d661](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ae645d661):

  - Fixing analytics in smart-cards

## 9.6.5

- [patch][2035bef8fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2035bef8fb):

  - Fix inline extractor priority preventing @type arrays in some cases.

## 9.6.4

- [patch][56c5a4b41f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/56c5a4b41f):

  - Fix "try again" should not be showing when there are no auth methods

## 9.6.3

- [patch][63e6f7d420](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/63e6f7d420):

  - Fix missing attributes for link view

## 9.6.2

- [patch][cbc601aed3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbc601aed3):

  - Added missing type of events for Confluence

## 9.6.1

- [patch][bef9abc8de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bef9abc8de):

  - added background colour to inline card views, fixed icon alignment.

## 9.6.0

- [minor][27b12fdfc6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/27b12fdfc6):

  - added support for rendering of icons in Jira links

## 9.5.0

- [minor][d664fc3d49](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d664fc3d49):

  - added support for rendering of icons with Confluence links

## 9.4.1

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/checkbox@5.0.11
  - @atlaskit/form@5.1.2
  - @atlaskit/inline-message@7.0.11
  - @atlaskit/radio@0.4.6
  - @atlaskit/media-ui@8.2.5
  - @atlaskit/icon@16.0.0

## 9.4.0

- [minor][8ff07c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8ff07c1):

  - Analytics, first attempt, validate the idea

- [minor][7777442](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7777442):

  - More analytics for smart links

- [minor][7302ea6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7302ea6):

  - Analytics for smart cards

## 9.3.0

- [minor][150626e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/150626e):

  - add support for source code repository urls (currently Bitbucket and Github) in smart-cards.

## 9.2.2

- Updated dependencies [647a46f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/647a46f):
  - @atlaskit/radio@0.4.5
  - @atlaskit/textfield@0.1.5
  - @atlaskit/form@5.0.0

## 9.2.1

- [patch][9c50550](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c50550):

  - Do not show connect button if there are no auth methods.

## 9.2.0

- [minor][95f98cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/95f98cc):

  - User can click on a smart card to open a new window/tab

## 9.1.0

- [minor][1175616](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1175616):

  - Simplified error state in inline cards: no red state anymore, just blue link

## 9.0.4

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/button@10.1.1
  - @atlaskit/checkbox@5.0.9
  - @atlaskit/field-range@5.0.12
  - @atlaskit/field-text@7.0.18
  - @atlaskit/field-text-area@4.0.14
  - @atlaskit/form@4.0.21
  - @atlaskit/icon@15.0.2
  - @atlaskit/icon-file-type@3.0.2
  - @atlaskit/icon-object@3.0.2
  - @atlaskit/inline-message@7.0.10
  - @atlaskit/page@8.0.12
  - @atlaskit/radio@0.4.4
  - @atlaskit/theme@7.0.1
  - @atlaskit/media-ui@8.1.2
  - @atlaskit/outbound-auth-flow-client@1.0.2
  - @atlaskit/docs@6.0.0

## 9.0.3

- Updated dependencies [5de3574](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5de3574):
  - @atlaskit/media-ui@8.0.0

## 9.0.2

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/checkbox@5.0.8
  - @atlaskit/field-range@5.0.11
  - @atlaskit/field-text@7.0.16
  - @atlaskit/field-text-area@4.0.13
  - @atlaskit/form@4.0.20
  - @atlaskit/icon@15.0.1
  - @atlaskit/icon-file-type@3.0.1
  - @atlaskit/icon-object@3.0.1
  - @atlaskit/inline-message@7.0.9
  - @atlaskit/radio@0.4.3
  - @atlaskit/media-ui@7.8.2
  - @atlaskit/theme@7.0.0

## 9.0.1

- [patch][4c0c2a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4c0c2a0):

  - Fix Cards throwing Error when client is not provided.

## 9.0.0

- [major][df32968](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df32968):

  - Introduced pending state (which is represented as a link) and a race between resolving state and the data fetch.

## 8.8.5

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/checkbox@5.0.7
  - @atlaskit/form@4.0.19
  - @atlaskit/inline-message@7.0.8
  - @atlaskit/radio@0.4.2
  - @atlaskit/media-ui@7.6.2
  - @atlaskit/icon-file-type@3.0.0
  - @atlaskit/icon-object@3.0.0
  - @atlaskit/icon@15.0.0

## 8.8.4

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/checkbox@5.0.6
  - @atlaskit/field-text@7.0.15
  - @atlaskit/field-text-area@4.0.12
  - @atlaskit/form@4.0.18
  - @atlaskit/icon@14.6.1
  - @atlaskit/icon-file-type@2.0.1
  - @atlaskit/icon-object@2.0.1
  - @atlaskit/inline-message@7.0.7
  - @atlaskit/page@8.0.11
  - @atlaskit/radio@0.4.1
  - @atlaskit/theme@6.2.1
  - @atlaskit/media-ui@7.6.1
  - @atlaskit/field-range@5.0.9
  - @atlaskit/button@10.0.0

## 8.8.3

- Updated dependencies [b42680b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b42680b):
  - @atlaskit/form@4.0.17
  - @atlaskit/radio@0.4.0

## 8.8.2

- [patch][b859e08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b859e08):

  - Update dependent versions

## 8.8.1

- Updated dependencies [8199088](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8199088):
  - @atlaskit/form@4.0.16
  - @atlaskit/radio@0.3.0

## 8.8.0

- [minor][93b31fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93b31fa):

  - Add support for nested <SmartCardProvider />

## 8.7.1

- [patch][00cd9a8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/00cd9a8):

  - Add tag support for inline task card.

## 8.7.0

- [minor][e89e244](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e89e244):

  - Implemented time-based caching for the client.

## 8.6.3

- [patch][4b989c3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b989c3):

  - Fix inline cards crashing after change to the format.

## 8.6.2

- [patch][a567cc9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a567cc9):

  - Improve rendering of Smart Cards.

## 8.6.1

- [patch][7bc4461](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7bc4461):

  - ED-5565: support connecting external React.Context to nodeviews

## 8.6.0

- [minor][1aa57ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1aa57ab):

  Clean up for media up and new task converter for smart cards

- [minor][d310628](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d310628):

  Added a converter for atlassian:task type

## 8.5.2

- [patch] ED-5439: add block smart cards, toolbar switcher [5f8bdfe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f8bdfe)

## 8.5.1

- [patch] fix cards being reloaded with the same definition id [b4b6a45](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b4b6a45)

## 8.5.0

- [minor] Added task converter [8678076](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8678076)

## 8.4.1

- [patch] Update blockcard and inline card exports to be compatible with tree shaking. Preperation for asyncloading parts of smart card [ced32d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ced32d0)

## 8.4.0

- [minor] Client to be extended [039c0ad](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/039c0ad)

## 8.3.3

- [patch] Replace @atlassian/outbound-auth-flow-client with @atlaskit/ [faff9c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/faff9c1)

## 8.3.2

- [patch] expose onClick handler for Card [3f5585c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f5585c)

## 8.3.1

- [patch] Additional test case [9b86661](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b86661)

## 8.3.0

- [minor] Refactored the rxjs set up for smart cards [026c96e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/026c96e)

## 8.2.4

- [patch] Removes usages of rxjs/Rx [d098f25](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d098f25)

## 8.2.3

- [patch] Fix rxjs and date-fns import in TS components [ab15cee](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab15cee)

## 8.2.2

- [patch] Updated dependencies [dae7792](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dae7792)
  - @atlaskit/media-ui@6.0.0

## 8.2.1

- [patch] Fix rxjs imports to only import what's needed [2e0ce2b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e0ce2b)

## 8.2.0

- [minor] Added `isSelected` to the `Card` component (inline resolved view) [6666d82](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6666d82)

## 8.1.2

- [patch] Updated dependencies [4194aa4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4194aa4)
  - @atlaskit/form@4.0.9
  - @atlaskit/select@6.0.0

## 8.1.1

- [patch] Updated dependencies [d8d8107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d8d8107)
  - @atlaskit/select@5.0.14
  - @atlaskit/form@4.0.0

## 8.1.0

- [minor] Switched to the amerizan way of spelling unauthorized [7c223f9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c223f9)

## 8.0.1

- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/media-ui@5.1.2

## 8.0.0

- [major] fix call to ORS by switching to fetch from XHR [48b95b0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48b95b0)
- [patch] Cleaner fetch function [e9b1477](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e9b1477)

## 7.0.6

- [patch] Updated dependencies [333a440](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/333a440)
  - @atlaskit/inline-message@7.0.0
- [none] Updated dependencies [1d9e75a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d9e75a)
  - @atlaskit/inline-message@7.0.0
- [none] Updated dependencies [a3109d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3109d3)
  - @atlaskit/inline-message@7.0.0
- [none] Updated dependencies [87d45d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87d45d3)
  - @atlaskit/inline-message@7.0.0
- [none] Updated dependencies [a08b0c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a08b0c2)
  - @atlaskit/inline-message@7.0.0

## 7.0.5

- [patch] ED-4824: added renderer support for smart cards [7cf0a78](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7cf0a78)

## 7.0.4

- [patch] ED-5222: bump react-lazily-render package [5844820](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5844820)

## 7.0.3

- [patch] Fix es5 exports of some of the newer modules [3f0cd7d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f0cd7d)

## 7.0.2

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/select@5.0.7
  - @atlaskit/page@8.0.2
  - @atlaskit/media-ui@5.0.2
  - @atlaskit/field-range@5.0.2
  - @atlaskit/field-text@7.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/inline-message@6.0.2
  - @atlaskit/form@3.1.4

## 7.0.1

- [patch] Fix CORS request in Smart Card [b0e2ce3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0e2ce3)

## 7.0.0

- [major] Implemented smart cards and common views for other cards [fa6f865](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa6f865)
- [major] Implemented smart cards and common UI elements [fdd03d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd03d8)
- [major] Implement smart card [49c8425](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49c8425)
- [major] Smart cards implementation and moved UI elements into media-ui package [3476e01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3476e01)
- [major] Updated dependencies [fa6f865](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa6f865)
  - @atlaskit/media-ui@5.0.0
- [major] Updated dependencies [fdd03d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd03d8)
  - @atlaskit/media-ui@5.0.0
- [major] Updated dependencies [49c8425](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49c8425)
  - @atlaskit/media-ui@5.0.0
- [major] Updated dependencies [3476e01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3476e01)
  - @atlaskit/media-ui@5.0.0

## 6.0.1

- [patch] Updated dependencies [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/tooltip@12.0.0
  - @atlaskit/icon@13.1.1
  - @atlaskit/dropdown-menu@6.1.1
  - @atlaskit/avatar-group@2.0.1
  - @atlaskit/avatar@14.0.1

## 6.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/inline-message@6.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/page@8.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/media-ui@4.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/lozenge@6.0.0
  - @atlaskit/field-range@5.0.0
  - @atlaskit/badge@9.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/dropdown-menu@6.0.0
  - @atlaskit/avatar-group@2.0.0
  - @atlaskit/avatar@14.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/page@8.0.0
  - @atlaskit/media-ui@4.0.0
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/inline-message@6.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/lozenge@6.0.0
  - @atlaskit/field-range@5.0.0
  - @atlaskit/badge@9.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/dropdown-menu@6.0.0
  - @atlaskit/avatar-group@2.0.0
  - @atlaskit/avatar@14.0.0

## 5.3.3

- [none] Updated dependencies [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)
  - @atlaskit/button@8.2.5
  - @atlaskit/dropdown-menu@5.2.3
  - @atlaskit/avatar-group@1.0.2
  - @atlaskit/avatar@13.0.0
- [patch] Updated dependencies [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
  - @atlaskit/avatar@13.0.0
  - @atlaskit/button@8.2.5
  - @atlaskit/dropdown-menu@5.2.3
  - @atlaskit/avatar-group@1.0.2

## 5.3.2

- [patch] Updated dependencies [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)
  - @atlaskit/avatar@12.0.0
  - @atlaskit/dropdown-menu@5.2.2
  - @atlaskit/avatar-group@1.0.0

## 5.3.1

- [patch] Updated dependencies [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
  - @atlaskit/spinner@8.0.0
  - @atlaskit/button@8.2.3

## 5.3.0

- [minor] Error view for inline smart card [74a0d46](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/74a0d46)
- [minor] Implemented auth error view for the inline card [6c6f078](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c6f078)
- [minor] Implemented auth error view for inline SC [5bb26b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5bb26b4)

## 5.2.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/media-ui@3.1.1
  - @atlaskit/theme@4.0.3
  - @atlaskit/spinner@7.0.1
  - @atlaskit/lozenge@5.0.3
  - @atlaskit/inline-message@5.1.1
  - @atlaskit/icon@12.1.1
  - @atlaskit/dropdown-menu@5.0.3
  - @atlaskit/button@8.1.1
  - @atlaskit/badge@8.0.3
  - @atlaskit/avatar@11.1.1
  - @atlaskit/docs@4.1.1

## 5.2.0

- [patch] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/spinner@7.0.0
  - @atlaskit/page@7.1.0
  - @atlaskit/tooltip@10.2.0
  - @atlaskit/dropdown-menu@5.0.2
  - @atlaskit/avatar@11.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/media-ui@3.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/lozenge@5.0.2
  - @atlaskit/field-text@6.0.2
  - @atlaskit/field-range@4.0.2
  - @atlaskit/badge@8.0.2
  - @atlaskit/inline-message@5.1.0
  - @atlaskit/button@8.1.0

## 5.1.1

- [patch] Fix UI issues with inline card resolving view [2de7ce7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2de7ce7)
- [patch] Fix for inline resolved card [97efb49](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97efb49)
- [patch] Fix the resolving view [f86d117](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f86d117)

## 5.1.0

- [minor] added the LinkView for inline cards in the resolving/errored state [823caef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/823caef)

## 5.0.0

- [major] Renamed and refactored the resolved for inline cards [732d2f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/732d2f5)

## 4.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/page@7.0.0
  - @atlaskit/media-ui@3.0.0
  - @atlaskit/tooltip@10.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/inline-message@5.0.0
  - @atlaskit/field-text@6.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/lozenge@5.0.0
  - @atlaskit/field-range@4.0.0
  - @atlaskit/badge@8.0.0
  - @atlaskit/spinner@6.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/dropdown-menu@5.0.0
  - @atlaskit/avatar@11.0.0

## 3.0.4

- [patch] Updated dependencies [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/page@6.0.4

## 3.0.3

- [patch] fix inline smart-cards to support styled-components v1 [35d547f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d547f)

## 3.0.2

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/media-ui@2.1.1
  - @atlaskit/tooltip@9.2.1
  - @atlaskit/page@6.0.3
  - @atlaskit/inline-message@4.0.2
  - @atlaskit/field-text@5.0.3
  - @atlaskit/dropdown-menu@4.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/badge@7.1.2
  - @atlaskit/spinner@5.0.2
  - @atlaskit/avatar@10.0.6
  - @atlaskit/docs@3.0.4
  - @atlaskit/lozenge@4.0.1

## 3.0.1

- [patch] add @types/prop-types to dependencies of smart-card [d558d2b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d558d2b)

## 3.0.0

- [major] Renamed smart card components and exposed inline smart card views [1094bb6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1094bb6)

## 2.0.2

- [patch] Implemented <InlineCardView /> for displaying a smart card inline with text. This view is NOT directly exported to consumers. [293b3a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/293b3a7)

## 2.0.1

- [patch] Added missing dependencies and added lint rule to catch them all [0672503](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0672503)

## 2.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 1.0.2

- [patch] fixed missing and inccorect versions of dependencies [7bfbb09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7bfbb09)
- [patch] fix dependencies [0e57cde](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e57cde)

## 1.0.1

- [patch] fix path for atkaskit in package.json [6ac9661](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ac9661)
