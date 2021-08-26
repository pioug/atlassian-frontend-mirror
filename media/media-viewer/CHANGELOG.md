# @atlaskit/media-viewer

## 45.8.8

### Patch Changes

- [`6947b4a26ca`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6947b4a26ca) - Remove newgen folder from media-viewer src, move files up a level
- [`4777a174e6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4777a174e6d) - Added analytics support for customMediaPlayer + screen event + entrypoint for locales
- [`5fe6e21a9a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5fe6e21a9a0) - [ux] Upgrade to the latest version of @atlaskit/modal-dialog. This change includes shifting the primary button in the footer of the modal to be on the right instead of the left.
- [`b90c0237824`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b90c0237824) - Update package.jsons to remove unused dependencies.
- Updated dependencies

## 45.8.7

### Patch Changes

- Updated dependencies

## 45.8.6

### Patch Changes

- [`ce9b9a7f44a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ce9b9a7f44a) - Fixed errorDetail on failures of type "archiveviewer-docviewer-onerror"
- [`10932f6ae07`](https://bitbucket.org/atlassian/atlassian-frontend/commits/10932f6ae07) - SPFE-561: Remove the URLSearchParams polyfill
- Updated dependencies

## 45.8.5

### Patch Changes

- [`8cba1694b5e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cba1694b5e) - Remove pollingMaxFailuresExceeded error from implementation and feature flags
- Updated dependencies

## 45.8.4

### Patch Changes

- [`3cd9ee2d15b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cd9ee2d15b) - Added RxJS compatiblity notice in Media docs
- Updated dependencies

## 45.8.3

### Patch Changes

- [`611e08796a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/611e08796a4) - fix minor bugs with media-viewer::CodeViewer
- Updated dependencies

## 45.8.2

### Patch Changes

- [`277ed9667b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/277ed9667b2) - Fixed media bundle names following atlassian-frontend linting rules
- [`7ba7af04db8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ba7af04db8) - Type fixes related to consumption of `@atlaskit/code`
- Updated dependencies

## 45.8.1

### Patch Changes

- [`6e055f5d3c8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e055f5d3c8) - [ux] Fixing a UI bug where the header covered the first 3 lines of a text/codeviewer file for Jira specifically
- [`341311b4eb4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/341311b4eb4) - Fix double events firing for media-viewer when errorMessage is rendered twice
- [`abc38bc9990`](https://bitbucket.org/atlassian/atlassian-frontend/commits/abc38bc9990) - Added request metadata to failed frontend SLIs
- Updated dependencies

## 45.8.0

### Minor Changes

- [`0a8ad595765`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0a8ad595765) - Further restrict primary and secondary error reasons in media-viewer

### Patch Changes

- [`8a83bcb9db7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a83bcb9db7) - Ensure external image reports success/failure for media-viewer
- Updated dependencies

## 45.7.0

### Minor Changes

- [`1d09c9ed549`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1d09c9ed549) - refactor media-viewer for better analytics and error handling

### Patch Changes

- [`ae804618521`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae804618521) - ensure media-viewer sends correct primary and secondary error details
- [`0e276537fe1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e276537fe1) - improve media-viewer primary fail reasons
- [`221f6b88d1d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/221f6b88d1d) - bump media-viewer to use @atlaskit/code@13.2.1
- [`e5413204ba8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5413204ba8) - Add optional errorDetail to FailAttributes for extra debugging context
- [`168cbf7cd32`](https://bitbucket.org/atlassian/atlassian-frontend/commits/168cbf7cd32) - Remove actionSubjectId from media-viewer analytics
- [`e62066560fb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e62066560fb) - Removed fileSource attributes from operational SLIs
- Updated dependencies

## 45.6.0

### Minor Changes

- [`56693486a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56693486a3) - [ux] Rate Limited UI for the MediaViewer. Also moved a MediaCard function into MediaClient so that that functionality can be used across multiple packages

### Patch Changes

- Updated dependencies

## 45.5.3

### Patch Changes

- [`a67513394d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a67513394d) - Fixed media-viewer leaking JWT in Analytics
- Updated dependencies

## 45.5.2

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 45.5.1

### Patch Changes

- [`b130ee1234`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b130ee1234) - handle non-200 responses for codeViewer
- Updated dependencies

## 45.5.0

### Minor Changes

- [`1e59fd65c5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e59fd65c5) - ED-8720 Add OnUnhandledClickHandler for Renderer

### Patch Changes

- [`1a446e580d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a446e580d) - [ux] Transparent box on arrow buttons removed
- [`6689df691c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6689df691c) - [ux] fixed bugs where the unknown icon was rendered instead of the codeIcon
- Updated dependencies

## 45.4.0

### Minor Changes

- [`f2308ddb6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f2308ddb6d) - COREX-2800 Fixed sidebar opening
- [`73613210d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73613210d4) - Adding support for Code and Email files so that they are now able to be previewed in the viewer.

### Patch Changes

- Updated dependencies

## 45.3.2

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 45.3.1

### Patch Changes

- Updated dependencies

## 45.3.0

### Minor Changes

- [`7d831363d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d831363d9) - Migrated to declarative entry points

### Patch Changes

- Updated dependencies

## 45.2.1

### Patch Changes

- Updated dependencies

## 45.2.0

### Minor Changes

- [`f3ec9a3f14`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3ec9a3f14) - Added analytics to zip previews
- [`8fc5fe20df`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8fc5fe20df) - Inline video player as part of the card and video player in media-viewer will now store last viewed position between sessions for given media id
- [`0837e7611b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0837e7611b) - Adding spinner to ArchiveViewer entry preview section

### Patch Changes

- Updated dependencies

## 45.1.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 45.1.1

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 45.1.0

### Minor Changes

- [`65652ba165`](https://bitbucket.org/atlassian/atlassian-frontend/commits/65652ba165) - Added 15 new icons based on the mimetype (.sketch, .gif, ect). Previously, we only had 6 icons based on the mediaType (doc/audio/unknown/image/video). Also created a dedicated examples page for icons
- [`6faafb144c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6faafb144c) - Introduce MediaFeatureFlags. Refactor components to use.
- [`af4a8c4262`](https://bitbucket.org/atlassian/atlassian-frontend/commits/af4a8c4262) - Added custom error message for encrypted zip file previews
- [`8cfc88423a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cfc88423a) - Added more zip examples and added error handling for zip previews
- [`2202870181`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2202870181) - Added support for zip previews in media viewer

### Patch Changes

- [`fa6fb5dfbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa6fb5dfbb) - Removing unused code to be published
- [`caf46c7c45`](https://bitbucket.org/atlassian/atlassian-frontend/commits/caf46c7c45) - Improved remote preview functionality for media-card redesign.
  Breaking change: renamed type of argument "SourceFile" to "CopySourceFile" in the method "copyFile" of media-client.
- [`b90eb38044`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b90eb38044) - Fix bug with MediaViewer when panning image in Firefox
- [`7742cd3db2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7742cd3db2) - Fixing wrong import
- [`ff10574de9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff10574de9) - Centering error in zip preview
- [`8295b0648e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8295b0648e) - Fixing archive entry bug
- [`3a38fe4afd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a38fe4afd) - Fixing sidebar UI
- Updated dependencies

## 45.0.1

### Patch Changes

- [`9e63f0070f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e63f0070f) - Fix HD Button (zooming on images bigger then 4K)
- [`6bcdf043ae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6bcdf043ae) - Fixed flaky Media-Viewer integration tests

## 45.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 44.4.4

### Patch Changes

- [`b8b8a16490`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8b8a16490) - added action and actionSubject to mediaViewerModal event, so that it won't be filtered out and will fire
- Updated dependencies

## 44.4.3

### Patch Changes

- [`51aa5587ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/51aa5587ef) - bump media-client: Remove stack traces from media analytic events
- Updated dependencies

## 44.4.2

### Patch Changes

- [`a2ffde361d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2ffde361d) - MPT-131: fetch remote preview for files not supported by the browser
- [`cc5935bf4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc5935bf4f) - Use MediaTypeIcon from media-ui
- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove unused dependencies
- [`98f462e2aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/98f462e2aa) - Bumping use the latest version of @atlaskit/spinner
- Updated dependencies

## 44.4.1

### Patch Changes

- Updated dependencies

## 44.4.0

### Minor Changes

- [minor][4aca202534](https://bitbucket.org/atlassian/atlassian-frontend/commits/4aca202534):

  New data-testid added: [data-testid="custom-media-player"] - Wrapper around custom media player

### Patch Changes

- [patch][51ddfebb45](https://bitbucket.org/atlassian/atlassian-frontend/commits/51ddfebb45):

  add dedicated empty file example for testing to media-viewer examples- Updated dependencies [f459d99f15](https://bitbucket.org/atlassian/atlassian-frontend/commits/f459d99f15):

- Updated dependencies [17cc5dde5d](https://bitbucket.org/atlassian/atlassian-frontend/commits/17cc5dde5d):
- Updated dependencies [6a6a991904](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a6a991904):
- Updated dependencies [84f82f7015](https://bitbucket.org/atlassian/atlassian-frontend/commits/84f82f7015):
- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
- Updated dependencies [3aedaac8c7](https://bitbucket.org/atlassian/atlassian-frontend/commits/3aedaac8c7):
- Updated dependencies [f061ed6c98](https://bitbucket.org/atlassian/atlassian-frontend/commits/f061ed6c98):
- Updated dependencies [f5b654c328](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5b654c328):
- Updated dependencies [49dbcfa64c](https://bitbucket.org/atlassian/atlassian-frontend/commits/49dbcfa64c):
- Updated dependencies [e9d555132d](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9d555132d):
- Updated dependencies [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies [5f8e3caf72](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f8e3caf72):
- Updated dependencies [d7b07a9ca4](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7b07a9ca4):
- Updated dependencies [318a1a0f2f](https://bitbucket.org/atlassian/atlassian-frontend/commits/318a1a0f2f):
- Updated dependencies [fd4b237ffe](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd4b237ffe):
- Updated dependencies [9691bb8eb9](https://bitbucket.org/atlassian/atlassian-frontend/commits/9691bb8eb9):
- Updated dependencies [11ff95c0f0](https://bitbucket.org/atlassian/atlassian-frontend/commits/11ff95c0f0):
- Updated dependencies [692692ba24](https://bitbucket.org/atlassian/atlassian-frontend/commits/692692ba24):
- Updated dependencies [5550919b98](https://bitbucket.org/atlassian/atlassian-frontend/commits/5550919b98):
- Updated dependencies [b5f17f0751](https://bitbucket.org/atlassian/atlassian-frontend/commits/b5f17f0751):
- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies [e5c869ee31](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5c869ee31):
- Updated dependencies [69b678b38c](https://bitbucket.org/atlassian/atlassian-frontend/commits/69b678b38c):
- Updated dependencies [e9044fbfa6](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9044fbfa6):
- Updated dependencies [fd782b0705](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd782b0705):
- Updated dependencies [050781f257](https://bitbucket.org/atlassian/atlassian-frontend/commits/050781f257):
- Updated dependencies [4635f8107b](https://bitbucket.org/atlassian/atlassian-frontend/commits/4635f8107b):
- Updated dependencies [d80b8e8fdb](https://bitbucket.org/atlassian/atlassian-frontend/commits/d80b8e8fdb):
- Updated dependencies [b2402fc3a2](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2402fc3a2):
- Updated dependencies [d38212e1be](https://bitbucket.org/atlassian/atlassian-frontend/commits/d38212e1be):
- Updated dependencies [ba8c2c4129](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba8c2c4129):
- Updated dependencies [d3547279dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3547279dd):
- Updated dependencies [67bc25bc3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/67bc25bc3f):
- Updated dependencies [89bf723567](https://bitbucket.org/atlassian/atlassian-frontend/commits/89bf723567):
- Updated dependencies [4aca202534](https://bitbucket.org/atlassian/atlassian-frontend/commits/4aca202534):
- Updated dependencies [f3587bae11](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3587bae11):
- Updated dependencies [8c8f0099d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c8f0099d8):
- Updated dependencies [c28ff17fbd](https://bitbucket.org/atlassian/atlassian-frontend/commits/c28ff17fbd):
- Updated dependencies [7e363d5aba](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e363d5aba):
  - @atlaskit/media-ui@12.1.0
  - @atlaskit/media-test-helpers@27.2.0
  - @atlaskit/docs@8.5.1
  - @atlaskit/modal-dialog@10.5.6
  - @atlaskit/theme@9.5.3
  - @atlaskit/media-client@6.1.0
  - @atlaskit/analytics-next@6.3.6
  - @atlaskit/button@13.3.10
  - @atlaskit/media-card@67.2.0

## 44.3.0

### Minor Changes

- [minor][ac70ced922](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac70ced922):

  Original image (if bigger then 4096px in size) is loaded automatically when zoomed in media viewer.

### Patch Changes

- Updated dependencies [eb962d2c36](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb962d2c36):
- Updated dependencies [9d2da865dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d2da865dd):
- Updated dependencies [4d3749c9e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d3749c9e6):
- Updated dependencies [dae900bf82](https://bitbucket.org/atlassian/atlassian-frontend/commits/dae900bf82):
- Updated dependencies [f83b67a761](https://bitbucket.org/atlassian/atlassian-frontend/commits/f83b67a761):
- Updated dependencies [70b68943d1](https://bitbucket.org/atlassian/atlassian-frontend/commits/70b68943d1):
- Updated dependencies [9a93eff8e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a93eff8e6):
- Updated dependencies [d49ebd7c7a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d49ebd7c7a):
- Updated dependencies [6dcad31e41](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dcad31e41):
- Updated dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
- Updated dependencies [4955ff3d36](https://bitbucket.org/atlassian/atlassian-frontend/commits/4955ff3d36):
- Updated dependencies [3cbc8a49a2](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cbc8a49a2):
  - @atlaskit/media-client@6.0.0
  - @atlaskit/media-card@67.1.1
  - @atlaskit/modal-dialog@10.5.5
  - @atlaskit/build-utils@2.6.4
  - @atlaskit/media-ui@12.0.1
  - @atlaskit/media-test-helpers@27.1.0
  - @atlaskit/media-core@31.1.0
  - @atlaskit/docs@8.5.0
  - @atlaskit/media-integration-test-helpers@1.1.1

## 44.2.0

### Minor Changes

- [minor][ef105eb49f](https://bitbucket.org/atlassian/atlassian-frontend/commits/ef105eb49f):

  Expose contextId prop and use it for copy/paste.

  ```
  contextId?: string
  ```

  You can use it like:

  ```
  import {MediaViewer} from '@atlaskit/media-viewer'

  <MediaViewer contextId="jira-ticket-1234" />
  ```

### Patch Changes

- [patch][d7ed7b1513](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7ed7b1513):

  Remove export \* from media components- Updated dependencies [b408e050ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/b408e050ab):

- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [dda84ee26d](https://bitbucket.org/atlassian/atlassian-frontend/commits/dda84ee26d):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [196500df34](https://bitbucket.org/atlassian/atlassian-frontend/commits/196500df34):
- Updated dependencies [64fb94fb1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/64fb94fb1e):
- Updated dependencies [77474b6821](https://bitbucket.org/atlassian/atlassian-frontend/commits/77474b6821):
- Updated dependencies [be57ca3829](https://bitbucket.org/atlassian/atlassian-frontend/commits/be57ca3829):
- Updated dependencies [d7ed7b1513](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7ed7b1513):
- Updated dependencies [41a2496393](https://bitbucket.org/atlassian/atlassian-frontend/commits/41a2496393):
- Updated dependencies [39ee28797d](https://bitbucket.org/atlassian/atlassian-frontend/commits/39ee28797d):
- Updated dependencies [4dbce7330c](https://bitbucket.org/atlassian/atlassian-frontend/commits/4dbce7330c):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [bbf5eb8824](https://bitbucket.org/atlassian/atlassian-frontend/commits/bbf5eb8824):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [695e1c1c31](https://bitbucket.org/atlassian/atlassian-frontend/commits/695e1c1c31):
- Updated dependencies [6b06a7baa9](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b06a7baa9):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [109c1a2c0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c1a2c0a):
- Updated dependencies [c57bb32f6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/c57bb32f6d):
- Updated dependencies [8b34c7371d](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b34c7371d):
  - @atlaskit/media-client@5.0.2
  - @atlaskit/docs@8.4.0
  - @atlaskit/media-ui@12.0.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/media-test-helpers@27.0.0
  - @atlaskit/webdriver-runner@0.3.0
  - @atlaskit/media-card@67.1.0
  - @atlaskit/media-integration-test-helpers@1.1.0
  - @atlaskit/field-range@8.0.2
  - @atlaskit/media-core@31.0.5
  - @atlaskit/button@13.3.9
  - @atlaskit/modal-dialog@10.5.4
  - @atlaskit/spinner@12.1.6

## 44.1.5

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/button@13.3.8
  - @atlaskit/modal-dialog@10.5.3
  - @atlaskit/spinner@12.1.5
  - @atlaskit/media-card@67.0.5

## 44.1.4

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/field-range@8.0.1
  - @atlaskit/icon@20.0.1
  - @atlaskit/modal-dialog@10.5.2
  - @atlaskit/spinner@12.1.4
  - @atlaskit/theme@9.5.1
  - @atlaskit/analytics-gas-types@4.0.13
  - @atlaskit/media-card@67.0.3
  - @atlaskit/media-client@5.0.1
  - @atlaskit/media-core@31.0.4
  - @atlaskit/media-test-helpers@26.1.1
  - @atlaskit/media-ui@11.8.3

## 44.1.3

### Patch Changes

- Updated dependencies [fe4eaf06fc](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe4eaf06fc):
- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies [555818c33a](https://bitbucket.org/atlassian/atlassian-frontend/commits/555818c33a):
  - @atlaskit/media-test-helpers@26.1.0
  - @atlaskit/field-range@8.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/media-ui@11.8.2
  - @atlaskit/modal-dialog@10.5.1
  - @atlaskit/media-card@67.0.2
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6

## 44.1.2

### Patch Changes

- [patch][966622bd45](https://bitbucket.org/atlassian/atlassian-frontend/commits/966622bd45):

  Stop (large) document load on modal close- [patch][723c67cab5](https://bitbucket.org/atlassian/atlassian-frontend/commits/723c67cab5):

  Update MediaViewer sidebar fixed width and overflow-y rule- [patch][6ee177aeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ee177aeb4):

  Stream caches in media-client now use ReplaySubjects instead of Observables.
  For the most part, this is just the interface that's being updated, as under the hood ReplaySubject was already getting used. ReplaySubjects better suit our use case because they track 1 version of history of the file state.
  As a consumer, there shouldn't be any necessary code changes. ReplaySubjects extend Observable, so the current usage should continue to work.- Updated dependencies [5504a7da8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/5504a7da8c):

- Updated dependencies [966622bd45](https://bitbucket.org/atlassian/atlassian-frontend/commits/966622bd45):
- Updated dependencies [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
- Updated dependencies [6ee177aeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ee177aeb4):
  - @atlaskit/media-card@67.0.1
  - @atlaskit/media-test-helpers@26.0.0
  - @atlaskit/docs@8.3.0
  - @atlaskit/media-client@5.0.0
  - @atlaskit/media-core@31.0.3
  - @atlaskit/media-ui@11.8.1

## 44.1.1

### Patch Changes

- Updated dependencies [28f8f0e089](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f8f0e089):
- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies [486a5aec29](https://bitbucket.org/atlassian/atlassian-frontend/commits/486a5aec29):
- Updated dependencies [03c917044e](https://bitbucket.org/atlassian/atlassian-frontend/commits/03c917044e):
- Updated dependencies [d3f4c97f6a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3f4c97f6a):
- Updated dependencies [149560f012](https://bitbucket.org/atlassian/atlassian-frontend/commits/149560f012):
- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/icon@19.1.0
  - @atlaskit/theme@9.5.0
  - @atlaskit/media-card@67.0.0
  - @atlaskit/media-ui@11.8.0
  - @atlaskit/button@13.3.5
  - @atlaskit/spinner@12.1.3
  - @atlaskit/media-client@4.2.2
  - @atlaskit/media-core@31.0.2
  - @atlaskit/media-test-helpers@25.2.6

## 44.1.0

### Minor Changes

- [minor][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Expose new property: extensions.sidebar.renderer to allow Sidebar integration

  > MediaViewer will call sidebarRenderer each time a navigation happens, and will provide the selected identifier.

  **New api**

  The new addition has been the, extensions field, which looks like:

  ```typescript
  interface MediaViewerExtensions {
    sidebar?: {
      icon: ReactNode;
      renderer: (selectedIdentifier: Identifier) => ReactNode;
    };
  }
  ```

  **Usage**

  ```typescript
  import { MediaViewer } from '@atlaskit/media-viewer';
  import { Identifier } from '@atlaskit/media-client';
  import EditorPanelIcon from '@atlaskit/icon/glyph/editor/panel';

  const sidebarRenderer = (selectedIdentifier: Identifier) => {
    return <div>{selectedIdentifier.id}</div>;
  };

  <MediaViewer
    extensions={{
      sidebar: {
        icon: <EditorPanelIcon />,
        renderer: sidebarRenderer,
      },
    }}
  />;
  ```

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Fix testid properties on Media Viewer's components

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  fixed media client retrying aborted request- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  update pdfjs-dist to 2.2.228- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/media-client@4.2.0
  - @atlaskit/modal-dialog@10.5.0
  - @atlaskit/media-card@66.1.2
  - @atlaskit/media-ui@11.7.2

## 44.0.3

### Patch Changes

- [patch][2e711adfa9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e711adfa9):

  bumping perf-marks to 1.5.0

- Updated dependencies [c1d4898af5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1d4898af5):
- Updated dependencies [579779f5aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/579779f5aa):
- Updated dependencies [3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):
- Updated dependencies [f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):
  - @atlaskit/icon@19.0.11
  - @atlaskit/media-client@4.1.1
  - @atlaskit/theme@9.3.0

## 44.0.2

### Patch Changes

- [patch][a4517c2de6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4517c2de6):

  Pin perf-marks package, as it contains invalid es5 in latest release

- [patch][b967e41a6b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b967e41a6b):

  Add empty file example to media-viewer

- [patch][82b76468de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/82b76468de):

  Rename all data-test-id attributes to data-testid

## 44.0.1

### Patch Changes

- [patch][39291ce416](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/39291ce416):

  Removing unnecessary `preventRaceCondition` method in MVNG- [patch][1e4b33e998](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e4b33e998):

  Fix analytic error reporting for aborted requests in MV- [patch][bae3b3e06d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bae3b3e06d):

  Add analytic events to DocViewer in MediaViewer- [patch][e35dfc7b5f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e35dfc7b5f):

  adding user timing api to get operations spent time

- Updated dependencies [24b8ea2667](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24b8ea2667):
  - @atlaskit/media-client@4.0.0
  - @atlaskit/media-test-helpers@25.2.2
  - @atlaskit/media-card@66.0.1
  - @atlaskit/media-core@31.0.0

## 44.0.0

### Major Changes

- [major][c3e65f1b9e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3e65f1b9e):

  ## Breaking change

  > remove deprecated "context" property from media components in favor of "mediaClientConfig"

  This affects all public media UI components:

  - Card
  - Filmstrip
  - SmartMediaEditor
  - MediaImage
  - Dropzone
  - Clipboard
  - Browser
  - MediaPicker
  - MediaViewer

  **Before**:

  ```
  import {ContextFactory} from '@atlaskit/media-core';
  import {Card} from '@atlaskit/media-card'
  import {SmartMediaEditor} from '@atlaskit/media-editor'
  import {Filmstrip} from '@atlaskit/media-filmstrip'
  import {MediaImage} from '@atlaskit/media-image'
  import {MediaViewer} from '@atlaskit/media-viewer'
  import {Dropzone, Clipboard, Browser, MediaPicker} from '@atlaskit/media-picker';

  const context = ContextFactory.creat({
    authProvider: () => Promise.resolve({})
  })

  const mediaPicker = MediaPicker(context);

  <Card context={context}>
  <SmartMediaEditor context={context}>
  <Filmstrip context={context}>
  <MediaImage context={context}>
  <Dropzone context={context}>
  <Clipboard context={context}>
  <Browser context={context}>
  <MediaViewer context={context}>
  ```

  **Now**:

  ```
  import {MediaClientConfig} from '@atlaskit/media-core';
  import {Card} from '@atlaskit/media-card'
  import {SmartMediaEditor} from '@atlaskit/media-editor'
  import {Filmstrip} from '@atlaskit/media-filmstrip'
  import {MediaImage} from '@atlaskit/media-image'
  import {MediaViewer} from '@atlaskit/media-viewer'
  import {Dropzone, Clipboard, Browser, MediaPicker} from '@atlaskit/media-picker';
  ```

const mediaClientConfig: MediaClientConfig = {
authProvider: () => Promise.resolve({})
}

const mediaPicker = MediaPicker(mediaClientConfig);

  <Card mediaClientConfig={mediaClientConfig}>
  <SmartMediaEditor mediaClientConfig={mediaClientConfig}>
  <Filmstrip mediaClientConfig={mediaClientConfig}>
  <MediaImage mediaClientConfig={mediaClientConfig}>
  <Dropzone mediaClientConfig={mediaClientConfig}>
  <Clipboard mediaClientConfig={mediaClientConfig}>
  <Browser mediaClientConfig={mediaClientConfig}>
  <MediaViewer mediaClientConfig={mediaClientConfig}>
  ```

- [major][ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):

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

- [minor][eeb47666dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eeb47666dd):

Emit `media-viewed` event through `globalMediaEventEmitter` when media is viewed, played or downloaded via media card or media viewer.

### Patch Changes

- [patch][38e5144a42](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/38e5144a42):

Add failedProcessing error event + fix passing file attributes to mediaPreviewFailedEvent

- Updated dependencies [e7b5c917de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7b5c917de):
- @atlaskit/media-card@66.0.0
- @atlaskit/media-core@30.0.17
- @atlaskit/media-store@12.0.14
- @atlaskit/media-test-helpers@25.2.0
- @atlaskit/media-client@3.0.0

## 43.4.5

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 43.4.4

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 43.4.3

### Patch Changes

- [patch][b3d01a57df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3d01a57df):

Download max res image and prioritise existing preview over representations

## 43.4.2

### Patch Changes

- [patch][fc79969f86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc79969f86):

Update all the theme imports in media to use multi entry points

## 43.4.1

- Updated dependencies [af72468517](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af72468517):
- @atlaskit/media-client@2.1.2
- @atlaskit/media-core@30.0.14
- @atlaskit/media-store@12.0.12
- @atlaskit/media-test-helpers@25.1.1
- @atlaskit/media-card@65.0.0

## 43.4.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

More information about the deprecation of lifecycles methods can be found here:
https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 43.3.4

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 43.3.3

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

Upgraded Typescript to 3.3.x

## 43.3.2

- Updated dependencies [3624730f44](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3624730f44):
- @atlaskit/media-client@2.0.2
- @atlaskit/media-core@30.0.11
- @atlaskit/media-store@12.0.9
- @atlaskit/media-test-helpers@25.0.2
- @atlaskit/media-card@64.0.0

## 43.3.1

### Patch Changes

- [patch][adeb756c78](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/adeb756c78):

Changing async import to check for AnalyticsErrorBoundary integration

## 43.3.0

### Minor Changes

- [minor][97768e61e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97768e61e2):

Adding Error Boundary for MediaViewer component

## 43.2.11

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

## 43.2.10

- Updated dependencies [69586b5353](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69586b5353):
- @atlaskit/media-card@63.3.11
- @atlaskit/media-client@2.0.1
- @atlaskit/media-core@30.0.10
- @atlaskit/media-store@12.0.8
- @atlaskit/media-ui@11.5.2
- @atlaskit/media-test-helpers@25.0.0

## 43.2.9

### Patch Changes

- [patch][6ad542fe85](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ad542fe85):

Adding try/catch in async imports for @atlaskit/media-avatar-picker, @atlaskit/media-card, @atlaskit/media-editor, @atlaskit/media-viewer

## 43.2.8

- Updated dependencies [ee804f3eeb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee804f3eeb):
- @atlaskit/media-card@63.3.9
- @atlaskit/media-core@30.0.9
- @atlaskit/media-store@12.0.6
- @atlaskit/media-test-helpers@24.3.5
- @atlaskit/media-client@2.0.0

## 43.2.7

### Patch Changes

- [patch][e5acd6d0d5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e5acd6d0d5):

Hardcode color in MediaViewer loader to reduce initial bundle size

## 43.2.6

### Patch Changes

- [patch][82a76462a4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/82a76462a4):

Pinning pdfjs version to known good

## 43.2.5

### Patch Changes

- [patch][0b662ba2e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0b662ba2e0):

Use Inactivity Detector component for hiding controls

## 43.2.4

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

Consume analytics-next ts type definitions as an ambient declaration.

## 43.2.3

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

bugfix, fixes missing version.json file- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

Fixes bug, missing version.json file

## 43.2.2

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

In this PR, we are:

- Re-introducing dist build folders
- Adding back cjs
- Replacing es5 by cjs and es2015 by esm
- Creating folders at the root for entry-points
- Removing the generation of the entry-points at the root
  Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 43.2.1

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

## 43.2.0

### Minor Changes

- [minor][a552f93596](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a552f93596):

  Increase image preview max height and width to 4096px

## 43.1.4

### Patch Changes

- [patch][79d79bf098](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79d79bf098):

  Remove constructAuthTokenURL and replace with mediaClient

## 43.1.3

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/modal-dialog@10.0.7
  - @atlaskit/media-card@63.3.1
  - @atlaskit/media-test-helpers@24.1.2
  - @atlaskit/media-ui@11.4.1
  - @atlaskit/icon@19.0.0

## 43.1.2

### Patch Changes

- [patch][4a9ea62c07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a9ea62c07):

  Fix selected state on arrow navigation buttons in MV

## 43.1.1

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/modal-dialog@10.0.4
  - @atlaskit/media-card@63.1.5
  - @atlaskit/media-test-helpers@24.0.3
  - @atlaskit/media-ui@11.2.8
  - @atlaskit/field-range@7.0.4
  - @atlaskit/icon@18.0.0

## 43.1.0

### Minor Changes

- [minor][7b48b319a3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7b48b319a3):

  - Remove media-core dependency and allow to pass mediaClientConfig as part of public api

## 43.0.3

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 43.0.2

- Updated dependencies [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
- Updated dependencies [06c5cccf9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c5cccf9d):
- Updated dependencies [9ecfef12ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ecfef12ac):
  - @atlaskit/button@13.0.4
  - @atlaskit/media-card@63.1.0
  - @atlaskit/media-ui@11.2.5
  - @atlaskit/spinner@12.0.0
  - @atlaskit/icon@17.1.2
  - @atlaskit/modal-dialog@10.0.0
  - @atlaskit/media-core@30.0.3
  - @atlaskit/media-store@12.0.2
  - @atlaskit/media-test-helpers@24.0.0

## 43.0.1

- Updated dependencies [ed3f034232](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed3f034232):
  - @atlaskit/media-card@63.0.2
  - @atlaskit/media-core@30.0.1
  - @atlaskit/media-store@12.0.1
  - @atlaskit/media-ui@11.1.1
  - @atlaskit/media-test-helpers@23.0.0

## 43.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

- Updated dependencies [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - @atlaskit/analytics-gas-types@4.0.4
  - @atlaskit/media-card@63.0.0
  - @atlaskit/docs@8.0.0
  - @atlaskit/analytics-next@5.0.0
  - @atlaskit/button@13.0.0
  - @atlaskit/field-range@7.0.0
  - @atlaskit/icon@17.0.0
  - @atlaskit/modal-dialog@9.0.0
  - @atlaskit/spinner@11.0.0
  - @atlaskit/theme@9.0.0
  - @atlaskit/media-core@30.0.0
  - @atlaskit/media-store@12.0.0
  - @atlaskit/media-test-helpers@22.0.0
  - @atlaskit/media-ui@11.0.0

## 42.0.0

- Updated dependencies [a1192ef860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1192ef860):
  - @atlaskit/media-card@62.0.0
  - @atlaskit/media-store@11.1.1
  - @atlaskit/media-test-helpers@21.4.0
  - @atlaskit/media-core@29.3.0

## 41.0.0

- Updated dependencies [e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):
  - @atlaskit/media-card@61.0.0
  - @atlaskit/media-store@11.1.0
  - @atlaskit/media-test-helpers@21.3.0
  - @atlaskit/media-core@29.2.0

## 40.1.11

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 40.1.10

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/field-range@6.0.4
  - @atlaskit/icon@16.0.9
  - @atlaskit/modal-dialog@8.0.7
  - @atlaskit/spinner@10.0.7
  - @atlaskit/media-card@60.0.3
  - @atlaskit/media-ui@10.1.5
  - @atlaskit/theme@8.1.7

## 40.1.9

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next supplied from itself.

## 40.1.8

- [patch][8bdebe02f1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8bdebe02f1):

  - Remove tests from MediaViewer dist

## 40.1.7

- [patch][bee4101a63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bee4101a63):

  - instrument analytics for audio and video play and error events

## 40.1.6

- [patch][caf134141e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/caf134141e):

  - Fix incorrect MediaButton imports

## 40.1.5

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/icon@16.0.8
  - @atlaskit/modal-dialog@8.0.6
  - @atlaskit/spinner@10.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/media-card@60.0.1
  - @atlaskit/media-core@29.1.4
  - @atlaskit/media-store@11.0.7
  - @atlaskit/media-ui@10.1.3
  - @atlaskit/field-range@6.0.3
  - @atlaskit/button@12.0.0

## 40.1.4

- [patch][4e1138a13a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e1138a13a):

  - add close event to MVNG

## 40.1.3

- [patch][32317ff8f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/32317ff8f3):

  - MS-1633 Renderer passes a list of files and external images to a Card to be opened with Media Viewer

## 40.1.2

- Updated dependencies [0ff405bd0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ff405bd0f):
  - @atlaskit/media-core@29.1.2
  - @atlaskit/media-store@11.0.5
  - @atlaskit/media-test-helpers@21.2.2
  - @atlaskit/media-card@60.0.0

## 40.1.1

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 40.1.0

- [minor][e1c1fa454a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e1c1fa454a):

  - Support external image identifier in MediaViewer

## 40.0.0

- Updated dependencies [c2c36de22b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c36de22b):
  - @atlaskit/media-card@59.0.0
  - @atlaskit/media-store@11.0.3
  - @atlaskit/media-test-helpers@21.1.0
  - @atlaskit/media-core@29.1.0

## 39.0.2

- Updated dependencies [9c316bd8aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c316bd8aa):
  - @atlaskit/media-core@29.0.2
  - @atlaskit/media-store@11.0.2
  - @atlaskit/media-test-helpers@21.0.3
  - @atlaskit/media-card@58.0.0

## 39.0.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 39.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/modal-dialog@8.0.2
  - @atlaskit/spinner@10.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/media-card@57.0.0
  - @atlaskit/field-range@6.0.1
  - @atlaskit/button@11.0.0
  - @atlaskit/analytics-gas-types@4.0.0
  - @atlaskit/analytics-next-types@4.0.0
  - @atlaskit/media-core@29.0.0
  - @atlaskit/media-store@11.0.0
  - @atlaskit/media-test-helpers@21.0.0
  - @atlaskit/media-ui@10.0.0

## 38.0.0

- Updated dependencies [7ab3e93996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ab3e93996):
  - @atlaskit/media-card@56.0.0
  - @atlaskit/media-test-helpers@20.1.8
  - @atlaskit/media-core@28.0.0
  - @atlaskit/media-store@10.0.0

## 37.0.1

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/icon@16.0.4
  - @atlaskit/analytics-gas-types@3.2.5
  - @atlaskit/media-card@55.0.2
  - @atlaskit/media-core@27.2.3
  - @atlaskit/media-store@9.2.1
  - @atlaskit/media-ui@9.2.1
  - @atlaskit/media-test-helpers@20.1.7
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics-next@4.0.0
  - @atlaskit/field-range@6.0.0
  - @atlaskit/modal-dialog@8.0.0
  - @atlaskit/spinner@10.0.0
  - @atlaskit/theme@8.0.0

## 37.0.0

- [patch][6bd4c428e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6bd4c428e2):

  - load image preview as soon representation is present instead of waiting for file status to be processed

- Updated dependencies [4aee5f3cec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aee5f3cec):
  - @atlaskit/media-card@55.0.0
  - @atlaskit/media-test-helpers@20.1.6
  - @atlaskit/media-core@27.2.0
  - @atlaskit/media-store@9.2.0

## 36.1.0

- [minor][f1b46bcb42](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1b46bcb42):

  - ED-6259 Enable stricter types for media packages

## 36.0.0

- [major][6e49c7c418](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e49c7c418):

  - Remove custom MediaViewerItem + Identifier types and use the one from media-core as part of public api

- Updated dependencies [fc6164c8c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc6164c8c2):
- Updated dependencies [190c4b7bd3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/190c4b7bd3):
  - @atlaskit/media-card@54.0.0
  - @atlaskit/media-store@9.1.7
  - @atlaskit/media-test-helpers@20.1.5
  - @atlaskit/media-core@27.1.0

## 35.2.1

- Updated dependencies [46dfcfbeca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/46dfcfbeca):
  - @atlaskit/media-core@27.0.2
  - @atlaskit/media-store@9.1.6
  - @atlaskit/media-test-helpers@20.1.4
  - @atlaskit/media-card@53.0.0

## 35.2.0

- [minor][fde1cf51e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fde1cf51e0):

  - Code split component

- Updated dependencies [d5bce1ea15](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5bce1ea15):
  - @atlaskit/media-card@52.0.4
  - @atlaskit/media-test-helpers@20.1.2
  - @atlaskit/media-ui@9.0.0

## 35.1.2

- [patch][05d5d28e5d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/05d5d28e5d):

  - cleanup MVNG analytics as part of MS-1184

## 35.1.1

- [patch][ef469cbb0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef469cbb0b):

  - MS-357 replaced @atlaskit/util-shared-styles from media components by @atlaskit/theme

## 35.1.0

- [minor][a74d635f1c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a74d635f1c):

  - Remove feedback button

## 35.0.0

- Updated dependencies [69c8d0c19c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c8d0c19c):
  - @atlaskit/media-card@52.0.0
  - @atlaskit/media-test-helpers@20.1.0
  - @atlaskit/media-store@9.1.5
  - @atlaskit/media-core@27.0.0

## 34.0.2

- Updated dependencies [07a187bb30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07a187bb30):
  - @atlaskit/media-card@51.0.2
  - @atlaskit/media-core@26.2.1
  - @atlaskit/media-store@9.1.4
  - @atlaskit/media-ui@8.2.6
  - @atlaskit/media-test-helpers@20.0.0

## 34.0.1

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/modal-dialog@7.2.1
  - @atlaskit/media-card@51.0.1
  - @atlaskit/media-test-helpers@19.1.1
  - @atlaskit/media-ui@8.2.5
  - @atlaskit/field-range@5.0.14
  - @atlaskit/icon@16.0.0

## 34.0.0

- Updated dependencies [85d5d168fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85d5d168fd):
  - @atlaskit/media-card@51.0.0
  - @atlaskit/media-store@9.1.3
  - @atlaskit/media-test-helpers@19.1.0
  - @atlaskit/media-core@26.2.0

## 33.0.0

- Updated dependencies [dadef80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dadef80):
- Updated dependencies [3ad16f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ad16f3):
  - @atlaskit/media-card@50.0.0
  - @atlaskit/media-store@9.1.2
  - @atlaskit/media-test-helpers@19.0.0
  - @atlaskit/media-core@26.1.0
  - @atlaskit/media-ui@8.2.4

## 32.1.0

- [minor][2dc7a74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2dc7a74):

  - Remember video quality in video player in MediaViewer

## 32.0.1

- [patch][3cc69de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3cc69de):

  - only apply css pixelation to zoomed in images

## 32.0.0

- [major][c91adfe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c91adfe):

  - remove customVideoPlayer featureFlag prop and enable by default

## 31.0.0

- Updated dependencies [cbb8cb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbb8cb5):
  - @atlaskit/media-card@49.0.0
  - @atlaskit/media-test-helpers@18.9.1
  - @atlaskit/media-store@9.1.1
  - @atlaskit/media-core@26.0.0

## 30.0.0

- [patch][72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):

  - Remove deprecated methods from media-core
  - Use context.collection methods in MediaViewer
  - Remove link support from media-card
  - Remove legacy services + providers from media-core
  - Remove link related methods from media-core
  - Remove axios dependency
  - Make context.getImage cancelable

- Updated dependencies [72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):
  - @atlaskit/media-card@48.0.0
  - @atlaskit/media-core@25.0.0
  - @atlaskit/media-store@9.1.0
  - @atlaskit/media-test-helpers@18.9.0

## 29.2.0

- [minor][8314694](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8314694):

  - Support uploading + processing files in MediaViewer

## 29.1.0

- [minor][6bc785d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6bc785d):

  - default to HD video if available in video viewer

## 29.0.2

- Updated dependencies [135ed00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/135ed00):
  - @atlaskit/media-core@24.7.2
  - @atlaskit/media-store@9.0.2
  - @atlaskit/media-test-helpers@18.7.2
  - @atlaskit/media-card@47.0.0

## 29.0.1

- [patch][ca16fa9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca16fa9):

  - Add SSR support to media components

## 29.0.0

- Updated dependencies [b3738ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3738ea):
- Updated dependencies [096f898](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/096f898):
  - @atlaskit/media-card@46.0.0
  - @atlaskit/media-store@9.0.0
  - @atlaskit/media-test-helpers@18.7.0
  - @atlaskit/media-core@24.7.0

## 28.0.0

- Updated dependencies [80f765b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80f765b):
  - @atlaskit/media-card@45.0.0
  - @atlaskit/media-store@8.5.1
  - @atlaskit/media-test-helpers@18.6.2
  - @atlaskit/media-core@24.6.0

## 27.1.1

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/field-range@5.0.12
  - @atlaskit/icon@15.0.2
  - @atlaskit/modal-dialog@7.1.1
  - @atlaskit/spinner@9.0.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/analytics-gas-types@3.2.3
  - @atlaskit/media-card@44.1.3
  - @atlaskit/media-core@24.5.2
  - @atlaskit/media-ui@8.1.2
  - @atlaskit/docs@6.0.0

## 27.1.0

- [minor][5de3574](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5de3574):

  - CustomVideoPlayer is now CustomMediaPlayer and supports audio through type property. Media Viewer now uses custom audio player for audio everywhere except IE11.

## 27.0.6

- [patch][01697a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/01697a6):

  - CustomVideoPlayer improvements: fix currentTime origin + apply custom theme

## 27.0.5

- [patch][c1ea81c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1ea81c):

  - use custom video player for inline video in media-card

## 27.0.4

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/field-range@5.0.11
  - @atlaskit/icon@15.0.1
  - @atlaskit/modal-dialog@7.0.14
  - @atlaskit/spinner@9.0.12
  - @atlaskit/media-ui@7.8.2
  - @atlaskit/theme@7.0.0

## 27.0.3

- [patch][5a6de24](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5a6de24):

  - translate component properties in media components

## 27.0.2

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/modal-dialog@7.0.13
  - @atlaskit/media-card@44.0.2
  - @atlaskit/media-test-helpers@18.3.1
  - @atlaskit/media-ui@7.6.2
  - @atlaskit/icon@15.0.0

## 27.0.1

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/icon@14.6.1
  - @atlaskit/modal-dialog@7.0.12
  - @atlaskit/spinner@9.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/media-card@44.0.1
  - @atlaskit/media-core@24.5.1
  - @atlaskit/media-ui@7.6.1
  - @atlaskit/field-range@5.0.9
  - @atlaskit/button@10.0.0
  - @atlaskit/analytics-next-types@3.1.2

## 27.0.0

- Updated dependencies [7e8b4b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e8b4b9):
  - @atlaskit/media-card@44.0.0
  - @atlaskit/media-test-helpers@18.3.0
  - @atlaskit/media-core@24.5.0

## 26.0.1

- [patch][8584c5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8584c5a):

  - Fix zoom not sorting numerical values correctly

## 26.0.0

- Updated dependencies [2c21466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c21466):
  - @atlaskit/media-card@43.0.0
  - @atlaskit/media-test-helpers@18.2.12
  - @atlaskit/media-core@24.4.0
  - @atlaskit/media-store@8.3.0

## 25.0.3

- Updated dependencies [04c7192](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/04c7192):
  - @atlaskit/media-core@24.3.1
  - @atlaskit/media-test-helpers@18.2.11
  - @atlaskit/media-card@42.0.0

## 25.0.2

- [patch][714f6ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/714f6ba):

  - Add analytics for navigation events in MediaViewer

## 25.0.1

- [patch][74c9cd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/74c9cd1):

  - Add analytics for zoom controls

## 25.0.0

- [major][023cb45" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/023cb45"
  d):

  - Add i18n support to MediaViewer

## 24.1.11

- [patch][12afe80" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12afe80"
  d):

  - Move mocks directory structure to fix dist build issues

## 24.1.10

- [patch][4b84e8b" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b84e8b"
  d):

  - Avoid unnecessary render cycle in ItemViewer

## 24.1.9

- [patch][a787ee9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a787ee9):

  Add analytics for downloads

## 24.1.8

- [patch] Make DocViewer inherit from BaseViewer [a2ee570](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2ee570)

## 24.1.7

- [patch] Make VideoViewer inherit from BaseViewer [2faedda](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2faedda)

## 24.1.6

- [patch] Make AudioViewer inherit from BaseViewer [5f7e58b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f7e58b)

## 24.1.5

- [patch] Add analytics for the header download button [4e8cacc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e8cacc)

## 24.1.4

- [patch] MS-1032: get rid of risky lifecycle hooks in ImageViewer [0795871](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0795871)

## 24.1.3

- [patch] Updated dependencies [ced32d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ced32d0)
  - @atlaskit/media-card@41.1.2
  - @atlaskit/media-test-helpers@18.2.10
  - @atlaskit/media-ui@7.0.0

## 24.1.2

- [patch] use latest onLoad prop in ImageViewer init [de72be8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de72be8)

## 24.1.1

- [patch] Pass the proper context object when reinitializing the BaseViewer" [215ea6c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215ea6c)

## 24.1.0

- [minor] Add analytics to MVNG (and reset ImageViewer when collectionName changes) [d60bf6d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d60bf6d)

## 24.0.1

- [patch] Fix MediaViewer showing the spinner when it should show the error view [914bdb2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/914bdb2)

## 24.0.0

- [major] Updated dependencies [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)
  - @atlaskit/media-card@41.0.0
  - @atlaskit/media-core@24.3.0
  - @atlaskit/media-store@8.2.0
  - @atlaskit/media-test-helpers@18.2.8

## 23.0.2

- [patch] Updated dependencies [6e510d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e510d8)
  - @atlaskit/media-core@24.2.2
  - @atlaskit/media-test-helpers@18.2.7
  - @atlaskit/media-card@40.0.0

## 23.0.1

- [patch] Prevent images from being smoothed when scaled up [5f1a429](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f1a429)

## 23.0.0

- [patch] Media-card: allow to download binary when processing failed, add failed-processing to CardStatus; Media-core: add context.file.downloadBinary, add failed-processing to FileStatus; Media-store: add getFileBinaryURL; [2afa60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2afa60d)
- [major] Updated dependencies [2afa60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2afa60d)
  - @atlaskit/media-card@39.0.0
  - @atlaskit/media-test-helpers@18.2.5
  - @atlaskit/media-core@24.2.0
  - @atlaskit/media-store@8.1.0

## 22.0.0

- [patch] Deprecate context.uploadFile & context.getFile. Instead context.file.upload & context.file.getFileState should be used; media-store's uploadFile function now takes MediaStore as a second argument, not MediaApiConfig [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [patch] Deprecate context.uploadFile & context.getFile. Instead context.file.upload & context.file.getFileState should be used; media-store's uploadFile function now takes MediaStore as a second argument, not MediaApiConfig [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)
- [major] Updated dependencies [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [major] Updated dependencies [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)
  - @atlaskit/media-card@38.0.0
  - @atlaskit/media-core@24.1.0
  - @atlaskit/media-store@8.0.0
  - @atlaskit/media-test-helpers@18.2.3

## 21.0.5

- [patch] Bumping dependency on media-store [f28fb3e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f28fb3e)

## 21.0.4

- [patch] Use context.getFile in MediaViewer NG [0056ef8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0056ef8)

## 21.0.3

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/modal-dialog@7.0.2
  - @atlaskit/media-test-helpers@18.2.1
  - @atlaskit/media-ui@6.0.1
  - @atlaskit/icon@14.0.0

## 21.0.2

- [patch] Updated dependencies [dae7792](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dae7792)
  - @atlaskit/media-core@24.0.2
  - @atlaskit/media-test-helpers@18.2.0
  - @atlaskit/media-ui@6.0.0

## 21.0.1

- [patch] Fix rxjs imports to only import what's needed [2e0ce2b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e0ce2b)

## 21.0.0

- [major] Update RXJS dependency to ^5.5.0 [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
- [major] Updated dependencies [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
  - @atlaskit/media-core@24.0.0
  - @atlaskit/media-test-helpers@18.0.0

## 20.0.0

- [major] Updated dependencies [6e1d642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e1d642)
  - @atlaskit/media-core@23.2.0
  - @atlaskit/media-test-helpers@17.1.0

## 19.0.1

- [patch] Update TS to 3.0 [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
- [none] Updated dependencies [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
  - @atlaskit/media-test-helpers@17.0.2
  - @atlaskit/media-core@23.1.1

## 19.0.0

- [major] remove jquery dep and mediaviewer classic support [02dee16](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/02dee16)

## 18.0.2

- [patch] Updated dependencies [d5a043a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5a043a)
  - @atlaskit/icon@13.8.1
  - @atlaskit/modal-dialog@7.0.0

## 18.0.1

- [patch] Fix feedback button in MVNG [44bfc3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/44bfc3a)

## 18.0.0

- [major] Updated dependencies [7545979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7545979)
  - @atlaskit/media-core@23.1.0

## 17.0.8

- [patch] Updated dependencies [911a570](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/911a570)
  - @atlaskit/media-test-helpers@17.0.0
  - @atlaskit/media-core@23.0.2

## 17.0.7

- [patch] List datasource takes priority to be consistent with the old behaviour MS-410 [31fafe6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/31fafe6)

## 17.0.6

- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/media-ui@5.1.2

## 17.0.5

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/media-ui@5.1.1
  - @atlaskit/spinner@9.0.6
  - @atlaskit/modal-dialog@6.0.9
  - @atlaskit/icon@13.2.5
  - @atlaskit/field-range@5.0.4
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 17.0.4

- [patch] Use Camera class in avatar picker [335ab1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/335ab1e)
- [patch] Updated dependencies [335ab1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/335ab1e)
  - @atlaskit/media-ui@5.1.0

## 17.0.3

- [patch] Chore: improve the Outcome data type [1feeedb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1feeedb)

## 17.0.2

- [patch] MSW-885 : add dragging to image viewer [989801b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/989801b)

## 17.0.1

- [patch] MSW-880: resize fitted images when window resizes [4d1f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d1f5b6)

## 17.0.0

- [major] Bumping to latest version of of media-core [5811ed4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5811ed4)
- [minor] Synchronous property "serviceHost" as part of many Interfaces in media components (like MediaApiConfig) is removed and replaced with asynchronous "baseUrl" as part of Auth object. [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
- [minor] Updated dependencies [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
  - @atlaskit/media-test-helpers@16.0.0
  - @atlaskit/media-core@23.0.0

## 16.1.4

- [patch] Fixes MSW-767 and MSW-895 [8102852](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8102852)

## 16.1.3

- [patch] Upgrade to webpack 4 [ea8a4bb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea8a4bb)
- [none] Updated dependencies [ea8a4bb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea8a4bb)

## 16.1.2

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/media-ui@5.0.2
  - @atlaskit/icon@13.2.2
  - @atlaskit/button@9.0.4
  - @atlaskit/media-core@22.2.1
  - @atlaskit/media-test-helpers@15.2.1
  - @atlaskit/theme@5.1.2
  - @atlaskit/field-range@5.0.2
  - @atlaskit/spinner@9.0.4
  - @atlaskit/docs@5.0.2
  - @atlaskit/modal-dialog@6.0.5

## 16.1.1

- [patch] MSW-701: zoom into viewport center, not image center [c2c8fdd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c8fdd)

## 16.1.0

- [patch] Updated dependencies [fa6f865](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa6f865)
  - @atlaskit/media-ui@5.0.0
  - @atlaskit/media-test-helpers@15.1.0
- [patch] Updated dependencies [fdd03d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd03d8)
  - @atlaskit/media-ui@5.0.0
  - @atlaskit/media-test-helpers@15.1.0
- [patch] Updated dependencies [49c8425](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49c8425)
  - @atlaskit/media-ui@5.0.0
  - @atlaskit/media-test-helpers@15.1.0
- [minor] Updated dependencies [3476e01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3476e01)
  - @atlaskit/media-ui@5.0.0

## 16.0.8

- [patch] MSW-799: Implement zooming and panning without transforms [974c89a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/974c89a)

## 16.0.7

- [patch] Smaller chores and cleanup work for MVNG [3a91267](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a91267)

## 16.0.6

- [patch] Add ellipsis and truncate main and sub text if needed [06bee17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06bee17)

## 16.0.5

- [patch] Handle the case where no audio or video artifacts were found [c83dda5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c83dda5)

## 16.0.4

- [patch] Fix navigation buttons style [2deabc2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2deabc2)

## 16.0.3

- [patch] Open MediaViewer in top of the modal dialog [49683a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49683a6)

## 16.0.2

- [patch] Prevent image from being selectable [63650bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/63650bc)

## 16.0.1

- [patch] Fix constructAuthTokenUrl [f435228](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f435228)

## 16.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/button@9.0.0
  - @atlaskit/media-ui@4.0.0
  - @atlaskit/media-core@22.0.0
  - @atlaskit/media-test-helpers@15.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/field-range@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/media-ui@4.0.0
  - @atlaskit/media-test-helpers@15.0.0
  - @atlaskit/media-core@22.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/field-range@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0

## 15.1.15

- [patch] Add error views to MediaViewer NG [66ac5d4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66ac5d4)

## 15.1.14

- [patch] Fancy video player improvements 3.0 [bb2b947](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb2b947)

## 15.1.13

- [patch] allow dev override to override feature flag [468bbfe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/468bbfe)

## 15.1.12

- [patch] Use media.tsconfig in MediaViewer [42ee1ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42ee1ea)
- [patch] Updated dependencies [42ee1ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42ee1ea)
  - @atlaskit/media-test-helpers@14.0.6
  - @atlaskit/media-core@21.0.0

## 15.1.11

- [patch] Fix passing feature flags down the List component [ae107ed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae107ed)

## 15.1.10

- [patch] Autoplay video and audio files when they are the selected media items [99c6b85](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/99c6b85)

## 15.1.9

- [patch] CHANGESET: Use theme/layers's z-index for the Blanket component [186ff55](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/186ff55)

- [none] Updated dependencies [216b20d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/216b20d)
  - @atlaskit/icon@12.5.1

## 15.1.8

- [patch] Updated dependencies [c57e9c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c57e9c1)
  - @atlaskit/media-test-helpers@14.0.4
  - @atlaskit/media-core@20.0.0

## 15.1.7

- [patch] MSW-776: allow selection of top and bottom of documents [d62c079](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d62c079)

## 15.1.6

- [patch] MSW-777: position navigation arrows differently, so that they no longer overlap the content area [0334e5c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0334e5c)

## 15.1.5

- [patch] Updated dependencies [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
  - @atlaskit/spinner@8.0.0
  - @atlaskit/button@8.2.3

## 15.1.4

- [patch] MSW-774 : adjust zoom levels [a6369ce](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6369ce)

## 15.1.3

- [patch] Better toolbar UX for MediaViewer NG [66abc9a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66abc9a)

## 15.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/media-ui@3.1.2
  - @atlaskit/media-test-helpers@14.0.3
  - @atlaskit/media-core@19.1.3
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/spinner@7.0.2
  - @atlaskit/icon@12.1.2

## 15.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/media-ui@3.1.1
  - @atlaskit/media-test-helpers@14.0.2
  - @atlaskit/media-core@19.1.2
  - @atlaskit/theme@4.0.3
  - @atlaskit/spinner@7.0.1
  - @atlaskit/icon@12.1.1
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1

## 15.1.0

- [patch] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/spinner@7.0.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/media-ui@3.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/media-core@19.1.1
  - @atlaskit/media-test-helpers@14.0.1
  - @atlaskit/theme@4.0.2
  - @atlaskit/button@8.1.0

## 15.0.10

- [patch] MSW-710 : add shadow to footer component [ea0ab01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea0ab01)

## 15.0.9

- [patch] introduce zoom level domain [29dcff3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29dcff3)

## 15.0.8

- [patch] MSW-630: properly render PDF annotations and text layer [0682c53](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0682c53)

## 15.0.7

- [patch] MSW-744 : let header background disappear together with controls [f4cda94](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f4cda94)

## 15.0.6

- [patch] Add document loading spinner [ff372e1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff372e1)

## 15.0.5

- [patch] Chores for document viewer [fefa35c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fefa35c)

## 15.0.4

- [patch] More consistent zoom experience [905f1b0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/905f1b0)

## 15.0.3

- [patch] MSW-700 : Clicking on the background of the MVNG ImageViewer should close it [a57a058](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a57a058)

## 15.0.2

- [patch] Better image resizing in MediaViewer NG [29f6f90](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29f6f90)

## 15.0.1

- [patch] Filter links from collections in MediaViewer NG [2ac8912](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2ac8912)

## 15.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/media-ui@3.0.0
  - @atlaskit/media-test-helpers@14.0.0
  - @atlaskit/media-core@19.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/spinner@6.0.0
  - @atlaskit/docs@4.0.0

## 14.6.2

- [patch] MSW-741 : handle unexpected media types without crashes [0353017](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0353017)
- [none] Updated dependencies [0353017](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0353017)
  - @atlaskit/media-test-helpers@13.3.1

## 14.6.1

- [patch] Updated dependencies [5ee48c4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ee48c4)
  - @atlaskit/media-core@18.1.2

## 14.6.0

- [minor] improve VideoViewer experience [50475df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50475df)

- [none] Updated dependencies [602c46e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/602c46e)
  - @atlaskit/media-test-helpers@13.3.0

## 14.5.1

- [patch] Add issue collector to MVNG [15e0ced](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/15e0ced)

## 14.5.0

- [minor] add custom video player under feature flag [9041109](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9041109)
- [none] Updated dependencies [9041109](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9041109)
  - @atlaskit/media-test-helpers@13.2.0

## 14.4.1

- [patch] Centering navigation arrows vertically in MVNG [d506235](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d506235)

## 14.4.0

- [patch] Fix pageSize in MediaViewer NG [4eac436](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4eac436)
- [minor] show controls when navigation happen in MediaViewer [3917aa6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3917aa6)

## 14.3.1

- [patch] MSW-720 : pass collectionName to all the places for correct auth [f7fa512](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f7fa512)

## 14.3.0

- [minor] Add zoom level for image and document viewer [856dfae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/856dfae)

## 14.2.0

- [minor] Add keyboard shortcuts to MediaViewer NG [52c56c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/52c56c1)

## 14.1.0

- [minor] dont hide controls if user is hovering them [f9c7a29](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c7a29)

## 14.0.2

- [patch] remove TS casting from MediaViewer [df4da61](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df4da61)

## 14.0.1

- [patch] Updated dependencies [bd26d3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd26d3c)
  - @atlaskit/media-core@18.1.1
  - @atlaskit/media-test-helpers@13.0.1

## 14.0.0

- [major] Updated dependencies [84f6f91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84f6f91)
  - @atlaskit/media-test-helpers@13.0.0
  - @atlaskit/media-core@18.1.0
- [patch] Updated dependencies [9041d71](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9041d71)
  - @atlaskit/media-test-helpers@13.0.0
  - @atlaskit/media-core@18.1.0

## 13.8.4

- [patch] Adjust default audio cover [2f37539](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2f37539)

## 13.8.3

- [patch] Add zooming to document viewer [f76e5d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f76e5d3)

## 13.8.2

- [patch] Fix new case of SC component interpolation [accec74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/accec74)

## 13.8.1

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/media-test-helpers@12.0.4
  - @atlaskit/media-core@18.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/spinner@5.0.2
  - @atlaskit/docs@3.0.4

## 13.8.0

- [minor] show cover for audio files [f830d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f830d51)

## 13.7.1

- [patch] Remove component interpolation to be able to integrate with an older version of SC [401db67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/401db67)

## 13.7.0

- [minor] Add basic zooming to MV [6bd0af4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6bd0af4)

## 13.6.1

- [patch] Use SC style() instead of extend [cc35663](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc35663)

## 13.6.0

- [minor] add download button to MediaViewer [ed4ad47](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed4ad47)

## 13.5.2

- [patch] Fix media-ui dependency version [60f61c5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60f61c5)

## 13.5.1

- [patch] Add media type metadata to audio in MVNG [8dec6fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8dec6fb)

## 13.5.0

- [minor] Add header metadata to MVNG [8aa7812](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8aa7812)

## 13.4.0

- [minor] MediaViewer: toggle UI controls on mouse move [36ec198](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36ec198)

## 13.3.2

- [patch] Always show MediaViewer close button [9ddeec0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ddeec0)

## 13.3.1

- [patch] use proper collectionName property in MVNG [7815256](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7815256)

## 13.3.0

- [minor] Add collection support to Media Viewer NGwq [6baa5d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6baa5d0)

## 13.2.2

- [patch] Bump z-index of MVNG [7d1f8fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d1f8fb)

## 13.2.1

- [patch] Fix issues with "selectedItem" not being part of the list. [f542262](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f542262)

## 13.2.0

- [minor] General fixes and improvements on MVNG (internal) [117cfc6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/117cfc6)

## 13.1.3

- [patch] update Media Viewer UI to reflect latest designs [fd284c9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fd284c9)

## 13.1.2

- [patch] Fix dynamic import in PDF viewer (next gen) [2e37250](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e37250)

## 13.1.0

- [minor] Add PDF viewer to MVNG [f4dbaa0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f4dbaa0)

## 12.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 11.0.7

- [patch] Show upload button during recents load in media picker. + Inprove caching for auth provider used in examples [929731a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/929731a)

## 11.0.6

- [patch] Release first version of image viewer for Media Viewer Next Generation [dd1893a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd1893a)

- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)

## 11.0.1

- [patch] Wire up MVNG with Media Providers [d80c743](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d80c743)

## 10.1.0

- [minor] Add Media Viewer Next Gen Feature Flag [5ecb889](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ecb889)

## 10.0.4

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 10.0.2

- [patch] Expose analyticsBackend in Media Viewer configuration [3984d91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3984d91)

- [patch] Make MediaListViewer resilient to errors and provide proper view for processing items MSW-25 MSW-348 [1d102d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d102d1)

## 9.1.1

- [patch] Fixes being unable to close Media Viewer when we open a file that is processing [5f63f6c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f63f6c)

## 9.1.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 9.0.6

- [patch] Use media-test-helpers instead of hardcoded values [f2b92f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f2b92f8)

## 9.0.5

- [patch] Add max-age parameter to media queries in Media Viewer - MSW-328 [4ad5d09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4ad5d09)

## 9.0.3

- [patch] pass pageSize property down from MediaViewer to MediaCollectionViewer [6fd7dae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6fd7dae)

## 9.0.2

- [patch] media-core version has changed [9865149](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9865149)

## 9.0.1

- [patch] Migrate MediaViewer to new AK repo [a0bc467](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a0bc467)

## 9.0.0 (2017-11-23)

- breaking; New component introduced: MediaViewer. ([f080bf1](https://bitbucket.org/atlassian/atlaskit/commits/f080bf1))
- breaking; MSW-289 - unify API and exposing a single MediaViewer component (issues closed: msw-289) ([f080bf1](https://bitbucket.org/atlassian/atlaskit/commits/f080bf1))

## 8.1.0 (2017-11-17)

- feature; expand media-viewer peer dependencies range on media-core ([075b97f](https://bitbucket.org/atlassian/atlaskit/commits/075b97f))
- feature; upgrade version of mediapicker to 11.1.6 and media-core to 11.0.0 across packages ([aaa7aa0](https://bitbucket.org/atlassian/atlaskit/commits/aaa7aa0))

## 8.0.0 (2017-09-18)

- breaking; media-core peer dependency has changed to strictly v 10 ([ba73022](https://bitbucket.org/atlassian/atlaskit/commits/ba73022))
- breaking; update media-core and media-test-helpers version ([ba73022](https://bitbucket.org/atlassian/atlaskit/commits/ba73022))

## 7.0.0 (2017-09-18)

- breaking; media-core peer dependency has changed to strictly v 10 ([ba73022](https://bitbucket.org/atlassian/atlaskit/commits/ba73022))
- breaking; update media-core and media-test-helpers version ([ba73022](https://bitbucket.org/atlassian/atlaskit/commits/ba73022))

## 6.1.1 (2017-09-05)

- bug fix; correctly publish type declaration files ([85a5ad2](https://bitbucket.org/atlassian/atlaskit/commits/85a5ad2))

## 6.1.0 (2017-08-11)

- feature; bump :allthethings: ([f4b1375](https://bitbucket.org/atlassian/atlaskit/commits/f4b1375))

## 6.0.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 6.0.0 (2017-05-26)

- fix; fix typo in API: 'occurrenceKey' ([bf68d9a](https://bitbucket.org/atlassian/atlaskit/commits/bf68d9a))
- breaking; 'occurenceKey' renamed to 'occurrenceKey'

## 5.1.0 (2017-05-25)

- feature; add custom configuration to media-viewer ([4a1ad37](https://bitbucket.org/atlassian/atlaskit/commits/4a1ad37))

## 5.0.0 (2017-05-22)

- fix; fix tests ([9d80311](https://bitbucket.org/atlassian/atlaskit/commits/9d80311))
- feature; use media-core 8.0.0 ([0387a76](https://bitbucket.org/atlassian/atlaskit/commits/0387a76))
- breaking; Bump media-core to 8.0.0

## 4.3.1 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 4.3.0 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))
- fix; updated media packages key words and maintainers ([01bcbc5](https://bitbucket.org/atlassian/atlaskit/commits/01bcbc5))
- feature; use /image endpoint for images ([c4fdea5](https://bitbucket.org/atlassian/atlaskit/commits/c4fdea5))

## 4.2.0 (2017-04-13)

- feature; add media file list viewer ([c6185c8](https://bitbucket.org/atlassian/atlaskit/commits/c6185c8))

## 4.1.0 (2017-04-12)

- feature; add lazy loading to media collection viewer ([9394310](https://bitbucket.org/atlassian/atlaskit/commits/9394310))

## 4.0.0 (2017-04-11)

- feature; move media-core to peerDependency ([00de0dc](https://bitbucket.org/atlassian/atlaskit/commits/00de0dc))
- breaking; Move media-core to peerDependency in media-viewer

## 3.0.0 (2017-04-10)

- fix; refreshing token in query string no longer modifies other params ([a2d5030](https://bitbucket.org/atlassian/atlaskit/commits/a2d5030))
- refactor media viewer adapters to inject media viewer constructor instead of us ([7b578a8](https://bitbucket.org/atlassian/atlaskit/commits/7b578a8))
- feature; integrate media collection viewer with artifact mapper ([27e2580](https://bitbucket.org/atlassian/atlaskit/commits/27e2580))
- breaking; MediaViewer adapter API changes: now requires MediaViewerConstructor.

## 2.1.0 (2017-04-06)

- fix; fix media file attributes download url ([6012fc3](https://bitbucket.org/atlassian/atlaskit/commits/6012fc3))
- feature; add id to media file model ([b606427](https://bitbucket.org/atlassian/atlaskit/commits/b606427))
- feature; add media viewer artifact format media item mapping ([adad23b](https://bitbucket.org/atlassian/atlaskit/commits/adad23b))
- feature; add media viewer file artifact mapping ([104abe1](https://bitbucket.org/atlassian/atlaskit/commits/104abe1))
- feature; use file attribute mapper inside MediaFileViewer ([5a0e3cd](https://bitbucket.org/atlassian/atlaskit/commits/5a0e3cd))

## 1.0.0 (2017-04-04)

- feature; add media-viewer adapters ([5aee637](https://bitbucket.org/atlassian/atlaskit/commits/5aee637))
