# @atlaskit/collab-provider

## 7.1.0

### Minor Changes

- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - COLLAB-411-change-to-metadata: 'setTitle' and 'setEditorWidth' are deprecated, going to be removed in the next release, use 'setMetadata' instead.
- [`10d7bc384aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/10d7bc384aa) - COLLAB-933: add disconnected event

### Patch Changes

- Updated dependencies

## 7.0.1

### Patch Changes

- [`2f5b81920af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2f5b81920af) - Refactor the provider class in collab provider
- [`0ec1c930f96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ec1c930f96) - NONE: tuning catchup trigger
- Updated dependencies

## 7.0.0

### Major Changes

- [`6090cc1cf57`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6090cc1cf57) - COLLAB-820: use `permissionTokenRefresh` for custom JWT token

### Patch Changes

- [`66404f5a168`](https://bitbucket.org/atlassian/atlassian-frontend/commits/66404f5a168) - NONE: only proactively catchup after offline enough
- Updated dependencies

## 6.5.0

### Minor Changes

- [`91a481d1b7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/91a481d1b7d) - Add analytics for catchup

### Patch Changes

- [`ae79161f6dc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae79161f6dc) - COLLAB-808: fix error handle
- [`bea14ccfb27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bea14ccfb27) - NONE: fix throttledCommit and error counter
- Updated dependencies

## 6.4.2

### Patch Changes

- [`ae910a43cf9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae910a43cf9) - COLLAB-537: fix reconnect fail to trigger
- Updated dependencies

## 6.4.1

### Patch Changes

- [`a87567a24b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a87567a24b3) - fix catchup
- Updated dependencies

## 6.4.0

### Minor Changes

- [`8efef26a27e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8efef26a27e) - [COLLAB-683] Removed debounce and throttle from Collab Provider due to sync delay on Confluence

## 6.3.1

### Patch Changes

- Updated dependencies

## 6.3.0

### Minor Changes

- [`8734a8b70a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8734a8b70a8) - allow consumers to circumvent hard editor coupling

### Patch Changes

- Updated dependencies

## 6.2.0

### Minor Changes

- [`e6cc5277203`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6cc5277203) - COLLAB-388: emit 404 error event when document not found in Collab Service

### Patch Changes

- [`a2d14a3865e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2d14a3865e) - VULN-304542: bump socket.io client to V4, it's major but no breaking change.
- [`6f0c71a2a95`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6f0c71a2a95) - put collab-provider logger under flag, set `window.COLLAB_PROVIDER_LOGGER` to true to see the logs.
- Updated dependencies

## 6.1.0

### Minor Changes

- [`15d11ecc623`](https://bitbucket.org/atlassian/atlassian-frontend/commits/15d11ecc623) - COLLAB-482: change no permission error code to 403

## 6.0.0

### Major Changes

- [`b010a665e13`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b010a665e13) - Bump socket IO to version 3 for collab provider

### Minor Changes

- [`29746d1123e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/29746d1123e) - Emit errors to consumers

### Patch Changes

- [`b74caaa43e9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b74caaa43e9) - add reserveCursor option to init event
- [`c54aacca521`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c54aacca521) - getFinalAcknowledgedState ensure unconfirmed steps confirmed
- [`cff5c406985`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cff5c406985) - Fix issue with socket io client v3 not attaching cookies into request
- [`226fce80d0d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/226fce80d0d) - Fix: potential race condition for catchup
- [`09040efc1a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/09040efc1a4) - pauseQueue should always reset
- Updated dependencies

## 5.2.0

### Minor Changes

- [`360a14b1d2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/360a14b1d2) - fix issue with empty string for title and editor width
- [`2ef9970ee2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ef9970ee2) - add analytics for collab provider
- [`1c0473e050`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1c0473e050) - Collab provider to support custom share token for embedded confluence page

## 5.1.0

### Minor Changes

- [`3f6006306a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f6006306a) - add stepVersion into getFinalAcknowledgedState

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- [`f9cd884b7e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f9cd884b7e) - Fix issue with emitting noisy empty presence events.
- Updated dependencies

## 5.0.0

### Major Changes

- [`da77198e43`](https://bitbucket.org/atlassian/atlassian-frontend/commits/da77198e43) - Rename title:changed to metadata:changed in collab provider, editor common and mobile bridge

### Patch Changes

- Updated dependencies

## 4.1.1

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 4.1.0

### Minor Changes

- [`c3ce422cd4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3ce422cd4) - COLLAB-11-trigger-catchup-5s
- [`474b09e4c0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/474b09e4c0) - COLLAB-11 steps rejected error handler

### Patch Changes

- Updated dependencies

## 4.0.0

### Major Changes

- [`e3b2251f29`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3b2251f29) - Breaking change for collab provider as userId has been removed from constructor. Mobile bridge and editor demo app require an upgrade too

### Patch Changes

- [`19a4732268`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19a4732268) - use reconnect to trigger catchup
- [`703752d487`](https://bitbucket.org/atlassian/atlassian-frontend/commits/703752d487) - ED-10647 Remove caret from prosemirror-model, prosemirror-keymap, prosemirror-state, prosemirror-transform to lock them down to an explicit version
- Updated dependencies

## 3.3.2

### Patch Changes

- [`ac54a7870c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac54a7870c) - Remove extraneous dependencies rule suppression

## 3.3.1

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 3.3.0

### Minor Changes

- [`9a39500244`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a39500244) - Bump ProseMirror packages

  Read more: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1671956531/2020-08

- [`4ea3c66256`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ea3c66256) - optimize-title-sync

### Patch Changes

- [`3e9f1f6b57`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e9f1f6b57) - CS-3100: Fix for fast keystrokes issue on collab-provider
- Updated dependencies

## 3.2.3

### Patch Changes

- Updated dependencies

## 3.2.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 3.2.1

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 3.2.0

### Minor Changes

- [`4809ed1b20`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4809ed1b20) - fix many infinite heartbeats

### Patch Changes

- [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the 'lodash' package instead of single-function 'lodash.\*' packages
- Updated dependencies

## 3.1.0

### Minor Changes

- [`90a0d166b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/90a0d166b3) - fix: pass the correct path to resolve the conflict with http
- [`372494e25b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/372494e25b) - add path to collab provider

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 2.0.0

### Major Changes

- [`3eb98cd820`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3eb98cd820) - ED-9367 Add required config argument to `createSocket`

### Minor Changes

- [`f90d5a351e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f90d5a351e) - ED-9367 Create entry point with a collab provider factory pre-configured with SocketIO
- [`f80f07b072`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f80f07b072) - ED-9451 Support lifecycle emitter on configuration
- [`8814c0a119`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8814c0a119) - ED-9451 Support for custom storage interface

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- [`473504379b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/473504379b) - ED-9367 Use collab entry point on editor-common
- [`0d43df75cb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0d43df75cb) - Add unit tests for channel.ts
- Updated dependencies

## 1.0.1

### Patch Changes

- [`56a7357c81`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56a7357c81) - ED-9197: upgrade prosemirror-transform to prevent cut and paste type errors

  It's important to make sure that there isn't any `prosemirror-transform` packages with version less than 1.2.5 in `yarn.lock`.- Updated dependencies

## 1.0.0

### Major Changes

- [major][c0b8c92b2e](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0b8c92b2e):

  catchup if behind the server

### Patch Changes

- Updated dependencies [c74cc954d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/c74cc954d8):
- Updated dependencies [b4326a7eba](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4326a7eba):
- Updated dependencies [e4076915c8](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4076915c8):
- Updated dependencies [05539b052e](https://bitbucket.org/atlassian/atlassian-frontend/commits/05539b052e):
- Updated dependencies [205b05851a](https://bitbucket.org/atlassian/atlassian-frontend/commits/205b05851a):
- Updated dependencies [0b22d3b9ea](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b22d3b9ea):
- Updated dependencies [b4ef7fe214](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4ef7fe214):
- Updated dependencies [67bc25bc3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/67bc25bc3f):
- Updated dependencies [6eb8c0799f](https://bitbucket.org/atlassian/atlassian-frontend/commits/6eb8c0799f):
  - @atlaskit/editor-common@45.0.0

## 0.1.1

### Patch Changes

- [patch][cf86087ae2](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf86087ae2):

  ED-8751 Remove 'export \*' from collab-provider- [patch][4955ff3d36](https://bitbucket.org/atlassian/atlassian-frontend/commits/4955ff3d36):

  Minor package.json config compliance updates- Updated dependencies [bc29fbc030](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc29fbc030):

- Updated dependencies [7d80e44c09](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d80e44c09):
- Updated dependencies [d63888b5e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63888b5e5):
- Updated dependencies [0a0a54cb47](https://bitbucket.org/atlassian/atlassian-frontend/commits/0a0a54cb47):
- Updated dependencies [fad8a16962](https://bitbucket.org/atlassian/atlassian-frontend/commits/fad8a16962):
- Updated dependencies [cc54ca2490](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc54ca2490):
  - @atlaskit/editor-common@44.1.0

## 0.1.0

### Minor Changes

- [minor][bc380c30ce](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc380c30ce):

  New collab provider

### Patch Changes

- Updated dependencies [bc380c30ce](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc380c30ce):
- Updated dependencies [5bb23adac3](https://bitbucket.org/atlassian/atlassian-frontend/commits/5bb23adac3):
- Updated dependencies [025842de1a](https://bitbucket.org/atlassian/atlassian-frontend/commits/025842de1a):
- Updated dependencies [395739b5ef](https://bitbucket.org/atlassian/atlassian-frontend/commits/395739b5ef):
  - @atlaskit/editor-common@44.0.2
