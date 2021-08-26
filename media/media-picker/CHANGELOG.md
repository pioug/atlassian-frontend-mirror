# @atlaskit/media-picker

## 58.1.0

### Minor Changes

- [`5e6fa1c70a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e6fa1c70a5) - fix unit tests for modal dialog
- [`9c0241362a6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9c0241362a6) - [ux] Upgrade to the latest version of @atlaskit/modal-dialog. This change includes shifting the primary button in the footer of the modal to be on the right instead of the left.

### Patch Changes

- Updated dependencies

## 58.0.0

### Patch Changes

- Updated dependencies

## 57.5.0

### Minor Changes

- [`f7ff2c84451`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7ff2c84451) - bump json-ld-types from 2.2.2 to ^2.3.0"
- [`2fd50f55028`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2fd50f55028) - Updating documentation to inform users that soon picker popup will no longer be available and also getting rid of picker popup references in examples and all the associated dependencies
- [`f7f652aaefb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7f652aaefb) - [ux] Removing sidebar items (googledrive/dropbox/giphy) from popup as popup is being deprecated

### Patch Changes

- [`3cd9ee2d15b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cd9ee2d15b) - Added RxJS compatiblity notice in Media docs
- [`fc415b7d346`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc415b7d346) - Removing deprecated documentation about mediapicker popup (authProvider)
- [`faaf4d29687`](https://bitbucket.org/atlassian/atlassian-frontend/commits/faaf4d29687) - Fixed Media Picker's Browser component not refreshing upload collection on props change
- Updated dependencies

## 57.4.0

### Minor Changes

- [`8bf3df4d99b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8bf3df4d99b) - Accept single fileId for Browser component uploads

### Patch Changes

- [`e1a0b97f790`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e1a0b97f790) - Exported missing types for Media Picker
- Updated dependencies

## 57.3.4

### Patch Changes

- [`277ed9667b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/277ed9667b2) - Fixed media bundle names following atlassian-frontend linting rules
- Updated dependencies

## 57.3.3

### Patch Changes

- [`153f5588cab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/153f5588cab) - VULN-328572 - Upgrade dateformat to address security vuln

## 57.3.2

### Patch Changes

- [`abc38bc9990`](https://bitbucket.org/atlassian/atlassian-frontend/commits/abc38bc9990) - Added request metadata to failed frontend SLIs
- Updated dependencies

## 57.3.1

### Patch Changes

- [`d6b31d9713d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6b31d9713d) - Fixed uncaught exceptions when uploading MP4/HEVC
- Updated dependencies

## 57.3.0

### Minor Changes

- [`0476f13a5ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0476f13a5ef) - Refactored media-picker analytics according to SLO streams standards

### Patch Changes

- [`7a0612cfe72`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a0612cfe72) - Added filter for FF returned in some Media Picker GASv3 events payloads
- [`9b356d9ff91`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b356d9ff91) - Refactored Media Picker failReasons to reflect actual operation, logging caught error in "error" attribute
- [`e62066560fb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e62066560fb) - Removed fileSource attributes from operational SLIs
- Updated dependencies

## 57.2.0

### Minor Changes

- [`52013ecdd24`](https://bitbucket.org/atlassian/atlassian-frontend/commits/52013ecdd24) - Add an ability to create Browser component with children using render props pattern to avoid passing state around in parent components.

### Patch Changes

- Updated dependencies

## 57.1.3

### Patch Changes

- [`a4e37d0df4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4e37d0df4) - Fix EDM-1636 again
- Updated dependencies

## 57.1.2

### Patch Changes

- [`7c44d1e585`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c44d1e585) - Fixed cards with non web-friendly MP4/MOV videos not mounting
- Updated dependencies

## 57.1.1

### Patch Changes

- Updated dependencies

## 57.1.0

### Minor Changes

- [`11d6640e9c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/11d6640e9c) - [ux] New UI states for when a card is rate limited

### Patch Changes

- Updated dependencies

## 57.0.1

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc
- Updated dependencies

## 57.0.0

### Patch Changes

- [`d152b2062a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d152b2062a) - Changing ineffective usage of data-testid on internal uploadButton to testId
- Updated dependencies

## 56.0.4

### Patch Changes

- [`52b1353be9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/52b1353be9) - BMT-611 Added integration test for Giphy cloud files
- [`3f0dd38c9d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f0dd38c9d) - BMPT-626 Fixed fetching remote preview for non-supported documents in classic Media Card experience
- [`bf98a47a0f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf98a47a0f) - Enhance polling strategy to limit to finite attempts with timing backoff
- Updated dependencies

## 56.0.3

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.
- Updated dependencies

## 56.0.2

### Patch Changes

- Updated dependencies

## 56.0.1

### Patch Changes

- [`2ac834240e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ac834240e) - Undo analytics-next file restructure to allow external ts definitions to continue working

## 56.0.0

### Minor Changes

- [`df3bf7f77f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df3bf7f77f) - Added support for uploading files from MediaPicker. Additionally, added support for browser detection.
- [`96ab8c45fc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/96ab8c45fc) - Changing the text in the picker in the UI so that users now know they can drag&drop folders
- [`7d831363d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d831363d9) - Migrated to declarative entry points
- [`b3e730ddde`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3e730ddde) - When a folder is uploaded, we are now tracking this and firing analytics for this event

### Patch Changes

- Updated dependencies

## 55.1.2

### Patch Changes

- [`8687140735`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8687140735) - [ux] Fix for file processing blocking pages and tickets from saving.
- Updated dependencies

## 55.1.1

### Patch Changes

- Updated dependencies

## 55.1.0

### Minor Changes

- [`4c3cc9c1d6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c3cc9c1d6) - add media feature flags to media-picker

### Patch Changes

- [`1434c4e094`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1434c4e094) - Fixed cloud files rendering when publishing page in CF
- [`506fb78f08`](https://bitbucket.org/atlassian/atlassian-frontend/commits/506fb78f08) - Bug-fix: emit upload-error on errors thrown in importFiles middleware
- Updated dependencies

## 55.0.4

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 55.0.3

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 55.0.2

### Patch Changes

- [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the 'lodash' package instead of single-function 'lodash.\*' packages
- [`fa6fb5dfbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa6fb5dfbb) - Removing unused code to be published
- [`caf46c7c45`](https://bitbucket.org/atlassian/atlassian-frontend/commits/caf46c7c45) - Improved remote preview functionality for media-card redesign.
  Breaking change: renamed type of argument "SourceFile" to "CopySourceFile" in the method "copyFile" of media-client.
- [`9dd7f8aa2e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9dd7f8aa2e) - Fixed media-picker not sending upload-end with Giphy images
- [`b8695823e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8695823e3) - Fixed Giphy images display as plain text when inserted into Editor
- [`87459b57ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87459b57ba) - Fixed insertion failure of processing file from recent files into Editor
- Updated dependencies

## 55.0.1

### Patch Changes

- Updated dependencies

## 55.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 54.2.3

### Patch Changes

- [`dfd656e4ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfd656e4ec) - MPT-503: fixed dragndrop of non-natively supported files in editor
- Updated dependencies

## 54.2.2

### Patch Changes

- [`81c6a2fcb2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81c6a2fcb2) - Fixed potential exception when synchronously accessing uninitialized RxJS subscription.

## 54.2.1

### Patch Changes

- [`eac08411a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eac08411a3) - Updated react-redux dependency to 5.1.0

## 54.2.0

### Minor Changes

- [`62269a3e45`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62269a3e45) - Added undefined links

### Patch Changes

- [`51aa5587ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/51aa5587ef) - bump media-client: Remove stack traces from media analytic events
- [`996e045cc4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/996e045cc4) - EDM-776: add platform prop to @atlaskit/smart-card for rendering fallback on mobile (embed -> block)
- [`b6e45d27f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6e45d27f0) - EDM-679: fixed 403 occurring when uploading a TIFF/HEIC image into media-picker
- Updated dependencies

## 54.1.4

### Patch Changes

- [`a2ffde361d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2ffde361d) - MPT-131: fetch remote preview for files not supported by the browser
- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove unused dependencies
- [`fce18ac290`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fce18ac290) - adding `createdAt` field for analytics upload event when user inserts a file'
- [`2d2012a993`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d2012a993) - Adding `mediaRegion` payload into analytics events payload
- [`98f462e2aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/98f462e2aa) - Bumping use the latest version of @atlaskit/spinner
- Updated dependencies

## 54.1.3

### Patch Changes

- Updated dependencies

## 54.1.2

### Patch Changes

- [`9848dca5c7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9848dca5c7) - Updated json-ld-types to 2.1.0- Updated dependencies

## 54.1.1

### Patch Changes

- [patch][9b295386e7](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b295386e7):

  Moved location of `file-added` event to fire only after an upload has succeeded- Updated dependencies [3b776be426](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b776be426):

- Updated dependencies [bf7a09790f](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf7a09790f):
- Updated dependencies [4d8d550d69](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d8d550d69):
- Updated dependencies [9e4b195732](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e4b195732):
- Updated dependencies [dc3bade5f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc3bade5f1):
- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [acc12dba75](https://bitbucket.org/atlassian/atlassian-frontend/commits/acc12dba75):
- Updated dependencies [9a534d6a74](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a534d6a74):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [68ff159118](https://bitbucket.org/atlassian/atlassian-frontend/commits/68ff159118):
- Updated dependencies [1b3a41f3ea](https://bitbucket.org/atlassian/atlassian-frontend/commits/1b3a41f3ea):
- Updated dependencies [6efb12e06d](https://bitbucket.org/atlassian/atlassian-frontend/commits/6efb12e06d):
- Updated dependencies [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
- Updated dependencies [7a2540821c](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a2540821c):
  - @atlaskit/media-ui@12.2.0
  - @atlaskit/flag@12.3.11
  - @atlaskit/media-card@67.2.1
  - @atlaskit/toggle@8.1.7
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/select@11.0.10
  - @atlaskit/modal-dialog@10.5.7
  - @atlaskit/checkbox@10.1.11
  - @atlaskit/webdriver-runner@0.3.4
  - @atlaskit/dropdown-menu@9.0.3

## 54.1.0

### Minor Changes

- [minor][fb2b3c8a3b](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb2b3c8a3b):

  Use Forge plugins for cloud providers in MediaPicker when useForgePlugins=true.

  When integrators initialize MediaPicker and pass **useForgePlugins: true**, MediaPicker will fetch the cloud providers coming from Forge instead of using the built-in ones (Google, Dropbox, Giphy)

### Patch Changes

- [patch][48fb5a1b6b](https://bitbucket.org/atlassian/atlassian-frontend/commits/48fb5a1b6b):

  Ensure we dispatch public events in the right order from MediaPicker- Updated dependencies [f459d99f15](https://bitbucket.org/atlassian/atlassian-frontend/commits/f459d99f15):

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
- Updated dependencies [ae426d5e97](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae426d5e97):
- Updated dependencies [692692ba24](https://bitbucket.org/atlassian/atlassian-frontend/commits/692692ba24):
- Updated dependencies [5550919b98](https://bitbucket.org/atlassian/atlassian-frontend/commits/5550919b98):
- Updated dependencies [b5f17f0751](https://bitbucket.org/atlassian/atlassian-frontend/commits/b5f17f0751):
- Updated dependencies [51ddfebb45](https://bitbucket.org/atlassian/atlassian-frontend/commits/51ddfebb45):
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
  - @atlaskit/analytics-listeners@6.3.0
  - @atlaskit/media-viewer@44.4.0
  - @atlaskit/analytics-next@6.3.6
  - @atlaskit/button@13.3.10
  - @atlaskit/media-card@67.2.0

## 54.0.0

### Minor Changes

- [minor][81684c1847](https://bitbucket.org/atlassian/atlassian-frontend/commits/81684c1847):

  # Expose MediaPicker plugin system

  Allow integrators to pass plugins to MediaPicker, which will appear on the MediaPicker Sidebar and their content will be rendered as part of MediaPicker

  ````
  import {MediaPicker, MediaPickerPlugin, PluginItemPayload} from '@atlaskit/media-picker'

  interface MyPluginMetadata {
    customPluginProperty: string;
  }

  class PluginView extends React.Component {

  }

  const customPlugin: MediaPickerPlugin = {
    name: 'my plugin',
    icon: <div>Some Icon</div>,
    render: (actions, selectedItems) => (
      <PluginView actions={actions} selectedItems={selectedItems} />
    ),
  };

  const popup = MediaPicker(mediaClientConfig, {
    plugins: [customPlugin],
  });

  popup.on('plugin-items-inserted', (items: PluginItemPayload[]) => {
    items.map(item => {
      const { pluginName } = item;
      if (pluginName === 'my plugin') {
        const metadata = item.pluginFile.metadata as MyPluginMetadata;

        return {
          src: metadata.customPluginProperty,
        };
      }
    });
  });

  ```- [minor] [13a0e50f38](https://bitbucket.org/atlassian/atlassian-frontend/commits/13a0e50f38):

  # Expose useForgePlugins in media props

  You can pass `useForgePlugins: true` to make MediaPicker use the Forge plugins instead of the built-in ones.

  MediaPicker example:

  ```typescript
  import { MediaPicker } from '@atlaskit/media-picker';

  const picker = MediaPicker(config, {
    useForgePlugins: true,
  });
  ````

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

- Updated dependencies [eb962d2c36](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb962d2c36):
- Updated dependencies [ac70ced922](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac70ced922):
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
  - @atlaskit/media-viewer@44.3.0
  - @atlaskit/media-card@67.1.1
  - @atlaskit/modal-dialog@10.5.5
  - @atlaskit/build-utils@2.6.4
  - @atlaskit/media-ui@12.0.1
  - @atlaskit/media-test-helpers@27.1.0
  - @atlaskit/media-core@31.1.0
  - @atlaskit/docs@8.5.0
  - @atlaskit/media-integration-test-helpers@1.1.1
  - @atlaskit/media-editor@37.0.9

## 53.0.0

### Major Changes

- [major][08935ea653](https://bitbucket.org/atlassian/atlassian-frontend/commits/08935ea653):

  UploadErrorEventPayload type (payload of `upload-error` event, as well as argument type of onError props) no longer has `file: MediaFile` property, but instead now has `fileId: string`.

### Minor Changes

- [minor][bb06388705](https://bitbucket.org/atlassian/atlassian-frontend/commits/bb06388705):

  New data-testid was added for cancel button

### Patch Changes

- [patch][dda84ee26d](https://bitbucket.org/atlassian/atlassian-frontend/commits/dda84ee26d):

  The Mediapicker did not give feedback before when there was a network error (Dropbox/Googledrive) but now it gives an error message for cloud fetching- [patch][fe9d471b88](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe9d471b88):

  fix wrong Button import in MediaPicker- [patch][d7ed7b1513](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7ed7b1513):

  Remove export \* from media components- [patch][832fd6f4f7](https://bitbucket.org/atlassian/atlassian-frontend/commits/832fd6f4f7):

  Remove proxy from media-picker. Internal implementation detail change- Updated dependencies [b408e050ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/b408e050ab):

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
- Updated dependencies [ef105eb49f](https://bitbucket.org/atlassian/atlassian-frontend/commits/ef105eb49f):
  - @atlaskit/media-client@5.0.2
  - @atlaskit/docs@8.4.0
  - @atlaskit/media-ui@12.0.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/media-test-helpers@27.0.0
  - @atlaskit/webdriver-runner@0.3.0
  - @atlaskit/media-card@67.1.0
  - @atlaskit/media-viewer@44.2.0
  - @atlaskit/media-integration-test-helpers@1.1.0
  - @atlaskit/media-editor@37.0.8
  - @atlaskit/media-core@31.0.5
  - @atlaskit/button@13.3.9
  - @atlaskit/dropdown-menu@9.0.2
  - @atlaskit/flag@12.3.10
  - @atlaskit/modal-dialog@10.5.4
  - @atlaskit/select@11.0.9
  - @atlaskit/spinner@12.1.6
  - @atlaskit/textfield@3.1.9
  - @atlaskit/toggle@8.1.6

## 52.0.4

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/button@13.3.8
  - @atlaskit/dropdown-menu@9.0.1
  - @atlaskit/flag@12.3.9
  - @atlaskit/modal-dialog@10.5.3
  - @atlaskit/select@11.0.8
  - @atlaskit/spinner@12.1.5
  - @atlaskit/textfield@3.1.8
  - @atlaskit/toggle@8.1.5
  - @atlaskit/media-card@67.0.5
  - @atlaskit/media-viewer@44.1.5

## 52.0.3

### Patch Changes

- Updated dependencies [8c7f68d911](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c7f68d911):
- Updated dependencies [f709e92247](https://bitbucket.org/atlassian/atlassian-frontend/commits/f709e92247):
- Updated dependencies [0e562f2a4a](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e562f2a4a):
- Updated dependencies [9e87af4685](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e87af4685):
- Updated dependencies [5ecbbaadb3](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ecbbaadb3):
- Updated dependencies [eeaa647c31](https://bitbucket.org/atlassian/atlassian-frontend/commits/eeaa647c31):
- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
- Updated dependencies [91a1eb05db](https://bitbucket.org/atlassian/atlassian-frontend/commits/91a1eb05db):
- Updated dependencies [c1992227dc](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1992227dc):
  - @atlaskit/media-ui@11.9.0
  - @atlaskit/dropdown-menu@9.0.0
  - @atlaskit/flag@12.3.8
  - @atlaskit/media-card@67.0.4
  - @atlaskit/icon@20.0.2
  - @atlaskit/textfield@3.1.7
  - @atlaskit/analytics-listeners@6.2.4
  - @atlaskit/media-test-helpers@26.1.2

## 52.0.2

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/dropdown-menu@8.2.4
  - @atlaskit/flag@12.3.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/modal-dialog@10.5.2
  - @atlaskit/select@11.0.7
  - @atlaskit/spinner@12.1.4
  - @atlaskit/textfield@3.1.6
  - @atlaskit/theme@9.5.1
  - @atlaskit/toggle@8.1.4
  - @atlaskit/analytics-gas-types@4.0.13
  - @atlaskit/analytics-listeners@6.2.3
  - @atlaskit/media-card@67.0.3
  - @atlaskit/media-client@5.0.1
  - @atlaskit/media-core@31.0.4
  - @atlaskit/media-editor@37.0.7
  - @atlaskit/media-test-helpers@26.1.1
  - @atlaskit/media-ui@11.8.3
  - @atlaskit/media-viewer@44.1.4

## 52.0.1

### Patch Changes

- [patch][16b4549bdd](https://bitbucket.org/atlassian/atlassian-frontend/commits/16b4549bdd):

  Fix layout issue for user with specific scrollbar OS settings- [patch][28edbccc0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/28edbccc0a):

  Fix layout issue for particular Mac OS scrollbar setting- Updated dependencies [fe4eaf06fc](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe4eaf06fc):

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies [555818c33a](https://bitbucket.org/atlassian/atlassian-frontend/commits/555818c33a):
  - @atlaskit/media-test-helpers@26.1.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/media-ui@11.8.2
  - @atlaskit/dropdown-menu@8.2.3
  - @atlaskit/flag@12.3.6
  - @atlaskit/modal-dialog@10.5.1
  - @atlaskit/media-card@67.0.2
  - @atlaskit/media-editor@37.0.6
  - @atlaskit/media-viewer@44.1.3
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/select@11.0.6
  - @atlaskit/textfield@3.1.5

## 52.0.0

### Major Changes

- [major][4794f8d527](https://bitbucket.org/atlassian/atlassian-frontend/commits/4794f8d527):

  Removed the following from the Media Picker public API:

  1.`upload-status-update` 2.`onStatusUpdate` 3.`UploadStatusUpdateEventPayload` 4.`MediaProgress`

  This functionality is now achieved through `getFileState()`:

  ```
  import {getMediaClient} from '@atlaskit/media-client'

  const mediaClient = getMediaClient({
    mediaClientConfig: {
      authProvider: () => Promise.resolve()
    }
  })

  mediaClient.file.getFileState('file-id', {
    next(state) {
      console.log(state)
    }
  })
  ```

### Patch Changes

- [patch][6ee177aeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ee177aeb4):

  Stream caches in media-client now use ReplaySubjects instead of Observables.
  For the most part, this is just the interface that's being updated, as under the hood ReplaySubject was already getting used. ReplaySubjects better suit our use case because they track 1 version of history of the file state.
  As a consumer, there shouldn't be any necessary code changes. ReplaySubjects extend Observable, so the current usage should continue to work.- Updated dependencies [5504a7da8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/5504a7da8c):

- Updated dependencies [966622bd45](https://bitbucket.org/atlassian/atlassian-frontend/commits/966622bd45):
- Updated dependencies [723c67cab5](https://bitbucket.org/atlassian/atlassian-frontend/commits/723c67cab5):
- Updated dependencies [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
- Updated dependencies [6ee177aeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ee177aeb4):
  - @atlaskit/media-card@67.0.1
  - @atlaskit/media-test-helpers@26.0.0
  - @atlaskit/media-viewer@44.1.2
  - @atlaskit/docs@8.3.0
  - @atlaskit/media-client@5.0.0
  - @atlaskit/media-core@31.0.3
  - @atlaskit/media-editor@37.0.5
  - @atlaskit/media-ui@11.8.1

## 51.0.0

### Major Changes

- [major][90e2c5dd0c](https://bitbucket.org/atlassian/atlassian-frontend/commits/90e2c5dd0c):

  remove upload-processing + onProcessing and unify upload-end event

### Patch Changes

- [patch][d60a382185](https://bitbucket.org/atlassian/atlassian-frontend/commits/d60a382185):

  (MS-2865) Fix race condition which caused upload-preview-update event to be sent twice, when it was only meant to be sent once.- [patch][8d2685f45c](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d2685f45c):

  Media picker inserted file cards are now displayed with an error state when copy with token requests fails- [patch][eb50389200](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb50389200):

  Replaces usages of the deprecated field-text component with textfield- Updated dependencies [8c7f8fcf92](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c7f8fcf92):

- Updated dependencies [6e55ab88df](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e55ab88df):
- Updated dependencies [a47d750b5d](https://bitbucket.org/atlassian/atlassian-frontend/commits/a47d750b5d):
  - @atlaskit/media-client@4.3.0
  - @atlaskit/select@11.0.5
  - @atlaskit/media-test-helpers@25.2.7

## 50.0.5

### Patch Changes

- Updated dependencies [28f8f0e089](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f8f0e089):
- Updated dependencies [6dccb16bfc](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dccb16bfc):
- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies [486a5aec29](https://bitbucket.org/atlassian/atlassian-frontend/commits/486a5aec29):
- Updated dependencies [03c917044e](https://bitbucket.org/atlassian/atlassian-frontend/commits/03c917044e):
- Updated dependencies [d3f4c97f6a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3f4c97f6a):
- Updated dependencies [149560f012](https://bitbucket.org/atlassian/atlassian-frontend/commits/149560f012):
- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/icon@19.1.0
  - @atlaskit/toggle@8.1.3
  - @atlaskit/theme@9.5.0
  - @atlaskit/media-card@67.0.0
  - @atlaskit/media-ui@11.8.0
  - @atlaskit/button@13.3.5
  - @atlaskit/flag@12.3.5
  - @atlaskit/select@11.0.4
  - @atlaskit/spinner@12.1.3
  - @atlaskit/media-client@4.2.2
  - @atlaskit/media-core@31.0.2
  - @atlaskit/media-editor@37.0.4
  - @atlaskit/media-test-helpers@25.2.6
  - @atlaskit/media-viewer@44.1.1
  - @atlaskit/dropdown-menu@8.2.2

## 50.0.4

### Patch Changes

- [patch][f09e2c2b33](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f09e2c2b33):

  Prevent emitting the same event multiple times from MediaPicker

## 50.0.3

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Browser should cleanup its value after close to allow picking the same file twice- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  use safeUnsubscribe to safely unsubscribe from RXJS Subscriptions- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

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
  - @atlaskit/media-viewer@44.1.0
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/media-client@4.2.0
  - @atlaskit/select@11.0.3
  - @atlaskit/field-text@9.0.14
  - @atlaskit/modal-dialog@10.5.0
  - @atlaskit/media-card@66.1.2
  - @atlaskit/media-ui@11.7.2

## 50.0.2

### Patch Changes

- [patch][4427e6c8cf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4427e6c8cf):

  bumping perf-marks to 1.5.0

- [patch][df2280531d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df2280531d):

  MS-2723 Adds source type into analytic event

- [patch][7540cdff80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7540cdff80):

  fixing types for cloud analytics success and failure events

- Updated dependencies [2e711adfa9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e711adfa9):
- Updated dependencies [c1d4898af5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1d4898af5):
- Updated dependencies [579779f5aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/579779f5aa):
- Updated dependencies [3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):
- Updated dependencies [1b8e3a1412](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b8e3a1412):
- Updated dependencies [f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):
  - @atlaskit/media-viewer@44.0.3
  - @atlaskit/icon@19.0.11
  - @atlaskit/media-client@4.1.1
  - @atlaskit/theme@9.3.0
  - @atlaskit/media-editor@37.0.3

## 50.0.1

### Patch Changes

- [patch][95ee5ed122](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/95ee5ed122):

  Touch endpoint is now called synchronously for every file which prevents race condition on copy while preserving card insert times in editor

## 50.0.0

### Major Changes

- [major][ae6408e1e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae6408e1e4):

  # Move public types to media-picker/types entry point

  We moved all the public types/interfaces into a new entry point **@atlaskit/media-picker/types**.
  This is a breaking change only if you are using Typescript in your project. To update:

  ## Before

  ```typescript
  import {
    PopupUploadEventPayloadMap,
    BrowserConfig,
    ClipboardConfig,
    DropzoneConfig,
    Popup,
    PopupConfig,
    PopupConstructor,
    UploadsStartEventPayload,
    UploadStatusUpdateEventPayload,
    UploadPreviewUpdateEventPayload,
    UploadProcessingEventPayload,
    UploadEndEventPayload,
    UploadErrorEventPayload,
    UploadEventPayloadMap,
    isImagePreview,
    MediaFile,
    MediaProgress,
    MediaError,
    ImagePreview,
    Preview,
    NonImagePreview,
    Popup,
    UploadParams,
    BrowserConfig,
    PopupConfig,
    ClipboardConfig,
    DropzoneConfig,
    PopupConstructor,
  } from '@atlaskit/media-picker';
  ```

  ## After

  ```typescript
  import {
    PopupUploadEventPayloadMap,
    BrowserConfig,
    ClipboardConfig,
    DropzoneConfig,
    Popup,
    PopupConfig,
    PopupConstructor,
    UploadsStartEventPayload,
    UploadStatusUpdateEventPayload,
    UploadPreviewUpdateEventPayload,
    UploadProcessingEventPayload,
    UploadEndEventPayload,
    UploadErrorEventPayload,
    UploadEventPayloadMap,
    isImagePreview,
    MediaFile,
    MediaProgress,
    MediaError,
    ImagePreview,
    Preview,
    NonImagePreview,
    Popup,
    UploadParams,
    BrowserConfig,
    PopupConfig,
    ClipboardConfig,
    DropzoneConfig,
    PopupConstructor,
  } from '@atlaskit/media-picker/types';
  ```

### Patch Changes

- [patch][a4517c2de6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4517c2de6):

  Pin perf-marks package, as it contains invalid es5 in latest release

- [patch][5b2c89203e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b2c89203e):

  Fix linting errors from prettier upgrade

## 49.0.1

### Patch Changes

- [patch][30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):

  @atlaskit/select has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 49.0.0

### Patch Changes

- [patch][46718eff4c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/46718eff4c):

  All components emit upload analytics events now, not only popup- [patch][e5945305be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e5945305be):

  adding user timing api to get operations spent time

- Updated dependencies [24b8ea2667](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24b8ea2667):
  - @atlaskit/media-client@4.0.0
  - @atlaskit/media-test-helpers@25.2.2
  - @atlaskit/media-viewer@44.0.1
  - @atlaskit/media-card@66.0.1
  - @atlaskit/media-editor@37.0.1
  - @atlaskit/media-core@31.0.0

## 48.0.0

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

- [minor][7015d48ba4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7015d48ba4):

MS-2145: added GASv3 events for media browser & clipboard

### Patch Changes

- [patch][1c6d97bbb1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c6d97bbb1):

Fix media-picker dialog min-height when downsizing- [patch][ee3d05ef82](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee3d05ef82):

Adding provider for selected items in media-picker when inserting files

- Updated dependencies [e7b5c917de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7b5c917de):
- @atlaskit/media-card@66.0.0
- @atlaskit/media-core@30.0.17
- @atlaskit/media-editor@37.0.0
- @atlaskit/media-store@12.0.14
- @atlaskit/media-test-helpers@25.2.0
- @atlaskit/media-viewer@44.0.0
- @atlaskit/media-client@3.0.0

## 47.1.7

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 47.1.6

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 47.1.5

### Patch Changes

- [patch][65ada7f318](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65ada7f318):

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

- [patch][3addfe526a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3addfe526a):

Adding provider for selected items in media-picker when inserting files

## 47.1.4

### Patch Changes

- [patch][b3d01a57df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3d01a57df):

Download max res image and prioritise existing preview over representations- [patch][c1eba314f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1eba314f4):

MS-2080 Fix inserting same file twice by removing observable piping as it makes a client's file observable emit new tenant's observable's events.- [patch][d886971e8a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d886971e8a):

Move objectToQueryString to media-client and use it from there

## 47.1.3

### Patch Changes

- [patch][fc79969f86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc79969f86):

Update all the theme imports in media to use multi entry points

## 47.1.2

- Updated dependencies [af72468517](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af72468517):
- @atlaskit/media-client@2.1.2
- @atlaskit/media-core@30.0.14
- @atlaskit/media-editor@36.3.1
- @atlaskit/media-store@12.0.12
- @atlaskit/media-test-helpers@25.1.1
- @atlaskit/media-viewer@43.4.1
- @atlaskit/media-card@65.0.0
- @atlaskit/analytics-listeners@6.2.0

## 47.1.1

### Patch Changes

- [patch][aa23bf2bc5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aa23bf2bc5):

Emit processed state when file gets copied

Fixes CEMS-244:

Currently some properties are missing after a file get’s copied (inserted from MediaPicker) and when the user tries to see on MediaViewer, the preview fails to load.

It happens for files that require artifacts, like documents or videos

## 47.1.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

More information about the deprecation of lifecycles methods can be found here:
https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 47.0.5

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 47.0.4

### Patch Changes

- [patch][0d7d459f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7d459f1a):

Fixes type errors which were incompatible with TS 3.6

## 47.0.3

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

Upgraded Typescript to 3.3.x

## 47.0.2

- Updated dependencies [3624730f44](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3624730f44):
- @atlaskit/media-client@2.0.2
- @atlaskit/media-core@30.0.11
- @atlaskit/media-editor@36.2.10
- @atlaskit/media-store@12.0.9
- @atlaskit/media-test-helpers@25.0.2
- @atlaskit/media-viewer@43.3.2
- @atlaskit/media-card@64.0.0

## 47.0.1

### Patch Changes

- [patch][adeb756c78](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/adeb756c78):

Changing async import to check for AnalyticsErrorBoundary integration

## 47.0.0

### Major Changes

- [major][6879d7d01e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6879d7d01e):

Removed `public` property from Media Picker's `upload-end` event. It has not been used by anything anyway and it's a legacy from the times where we didn't have upfront id so is now redundant.

## 46.0.10

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

## 46.0.9

- Updated dependencies [69586b5353](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69586b5353):
- @atlaskit/media-card@63.3.11
- @atlaskit/media-client@2.0.1
- @atlaskit/media-core@30.0.10
- @atlaskit/media-editor@36.2.9
- @atlaskit/media-store@12.0.8
- @atlaskit/media-viewer@43.2.10
- @atlaskit/media-ui@11.5.2
- @atlaskit/media-test-helpers@25.0.0

## 46.0.8

### Patch Changes

- [patch][1439241943](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1439241943):

Adding error boundary in media picker dropzone

## 46.0.7

### Patch Changes

- [patch][d3ccc2e47f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d3ccc2e47f):

Fix media picker's dropzone analytics event by including the necessary eventType key

## 46.0.6

### Patch Changes

- [patch][15290ac8ad](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/15290ac8ad):

Fix issue where popup media-picker doesn't throw upload-end event

## 46.0.5

### Patch Changes

- [patch][7c762529af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c762529af):

Move @types/bricks.js from dependencies to devDependencies.

## 46.0.4

### Patch Changes

- [patch][116236c249](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/116236c249):

Instrument analytics for media-picker's dropzone draggedInto, draggedOut and droppedInto actions

## 46.0.3

- Updated dependencies [ee804f3eeb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee804f3eeb):
- @atlaskit/media-card@63.3.9
- @atlaskit/media-core@30.0.9
- @atlaskit/media-editor@36.2.7
- @atlaskit/media-store@12.0.6
- @atlaskit/media-test-helpers@24.3.5
- @atlaskit/media-viewer@43.2.8
- @atlaskit/media-client@2.0.0

## 46.0.2

### Patch Changes

- [patch][da814b8ebc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da814b8ebc):

Bump media-picker to fix the master bbranch where bitbucket and npm are out of sync.

## 46.0.1

### Patch Changes

- [patch][6744fe7753](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6744fe7753):

Adding dispatch for failure errors in media picker

## 46.0.0

### Major Changes

- [major][4e8f6f609f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e8f6f609f):

Remove three fields from MediaFile interface: upfrontId, userUpfrontId and userOccurrenceKey.

## 45.0.9

### Patch Changes

- [patch][688f2957ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/688f2957ca):

Fixes various TypeScript errors which were previously failing silently

## 45.0.8

### Patch Changes

- [patch][a58828c9e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a58828c9e2):

Fix analytics for insert files button and annotate file button

## 45.0.7

### Patch Changes

- [patch][e29ffdb057](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e29ffdb057):

update docs to latest component state (React + Popup), improve information

## 45.0.6

- Updated dependencies [7e9d653278](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e9d653278):
- @atlaskit/media-card@63.3.7
- @atlaskit/toggle@8.0.0

## 45.0.5

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

Consume analytics-next ts type definitions as an ambient declaration.

## 45.0.4

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

bugfix, fixes missing version.json file

## 45.0.3

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

In this PR, we are:

- Re-introducing dist build folders
- Adding back cjs
- Replacing es5 by cjs and es2015 by esm
- Creating folders at the root for entry-points
- Removing the generation of the entry-points at the root
  Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 45.0.2

### Patch Changes

- [patch][6a072313bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6a072313bf):

Fixing analytics for upload handlers in media-picker- [patch][50d3fb94a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50d3fb94a6):

Fixing analytics for upload handlers in @atlaskit/media-picker

## 45.0.1

- Updated dependencies [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
- @atlaskit/button@13.0.11
- @atlaskit/modal-dialog@10.0.10
- @atlaskit/media-test-helpers@24.3.1
- @atlaskit/select@10.0.0

## 45.0.0

### Major Changes

- [major][e754b5f85e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e754b5f85e):

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

## 44.0.1

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
- @atlaskit/docs@8.1.3
- @atlaskit/button@13.0.9
- @atlaskit/dropdown-menu@8.0.8
- @atlaskit/flag@12.0.10
- @atlaskit/modal-dialog@10.0.7
- @atlaskit/select@9.1.8
- @atlaskit/toggle@7.0.3
- @atlaskit/media-card@63.3.1
- @atlaskit/media-editor@36.2.1
- @atlaskit/media-test-helpers@24.1.2
- @atlaskit/media-ui@11.4.1
- @atlaskit/media-viewer@43.1.3
- @atlaskit/icon@19.0.0

## 44.0.0

### Major Changes

- [major][5f4afa52a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f4afa52a9):

Media Picker Browser component is now migrated to React.

- Previous vanilla js API:

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

- New React API:

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

````

At a later point we will just need to call `this.openBrowser` function in that example, in order to open the native File browser. Same applies to `onCancelFn`.

## 43.1.2

### Patch Changes

- [patch][a964d9cfa5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a964d9cfa5):

Emit event in globalMediaEventListener as well

## 43.1.1

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
- @atlaskit/docs@8.1.2
- @atlaskit/button@13.0.8
- @atlaskit/dropdown-menu@8.0.4
- @atlaskit/flag@12.0.4
- @atlaskit/modal-dialog@10.0.4
- @atlaskit/select@9.1.5
- @atlaskit/toggle@7.0.1
- @atlaskit/media-card@63.1.5
- @atlaskit/media-editor@36.1.1
- @atlaskit/media-test-helpers@24.0.3
- @atlaskit/media-ui@11.2.8
- @atlaskit/media-viewer@43.1.1
- @atlaskit/icon@18.0.0

## 43.1.0

### Minor Changes

- [minor][86e884c38d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/86e884c38d):

MediaPicker constuctro suports mediaClientConfig as second argument

## 43.0.4

- [patch][e5c40a4a52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e5c40a4a52):

- use existing file state for tenant file if there is one

## 43.0.3

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

- This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 43.0.2

- Updated dependencies [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
- Updated dependencies [06c5cccf9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c5cccf9d):
- Updated dependencies [9ecfef12ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ecfef12ac):
- Updated dependencies [9cbd059bfa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cbd059bfa):
- @atlaskit/button@13.0.4
- @atlaskit/flag@12.0.2
- @atlaskit/select@9.1.2
- @atlaskit/media-card@63.1.0
- @atlaskit/media-editor@36.0.0
- @atlaskit/media-ui@11.2.5
- @atlaskit/media-viewer@43.0.2
- @atlaskit/spinner@12.0.0
- @atlaskit/icon@17.1.2
- @atlaskit/modal-dialog@10.0.0
- @atlaskit/media-core@30.0.3
- @atlaskit/media-store@12.0.2
- @atlaskit/media-test-helpers@24.0.0

## 43.0.1

- Updated dependencies [238b65171f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/238b65171f):
- @atlaskit/flag@12.0.0

## 43.0.0

- [major][051800806c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/051800806c):

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
````

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

## 42.0.2

- [patch][168df43047](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/168df43047):

  - Fix clipboard component deactivation logic when used in multiple contexts.

## 42.0.1

- Updated dependencies [ed3f034232](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed3f034232):
  - @atlaskit/media-card@63.0.2
  - @atlaskit/media-core@30.0.1
  - @atlaskit/media-editor@35.0.1
  - @atlaskit/media-store@12.0.1
  - @atlaskit/media-ui@11.1.1
  - @atlaskit/media-viewer@43.0.1
  - @atlaskit/media-test-helpers@23.0.0

## 42.0.0

- [major][59cce82fd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59cce82fd1):

  - Remove Binary component from MediaPicker

  If you want to upload a file (string or blob) to media, you should instead use **context.file.upload** from **@atlaskit/media-core**

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

## 41.0.1

- [patch][5cfa2ddf93](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5cfa2ddf93):

  - add clipboard support to MediaPicker

## 41.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

- Updated dependencies [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - @atlaskit/analytics-gas-types@4.0.4
  - @atlaskit/media-card@63.0.0
  - @atlaskit/media-editor@35.0.0
  - @atlaskit/media-viewer@43.0.0
  - @atlaskit/docs@8.0.0
  - @atlaskit/analytics-next@5.0.0
  - @atlaskit/button@13.0.0
  - @atlaskit/dropdown-menu@8.0.0
  - @atlaskit/field-text@9.0.0
  - @atlaskit/flag@11.0.0
  - @atlaskit/icon@17.0.0
  - @atlaskit/modal-dialog@9.0.0
  - @atlaskit/select@9.0.0
  - @atlaskit/spinner@11.0.0
  - @atlaskit/theme@9.0.0
  - @atlaskit/toggle@7.0.0
  - @atlaskit/analytics-listeners@6.0.0
  - @atlaskit/media-core@30.0.0
  - @atlaskit/media-store@12.0.0
  - @atlaskit/media-test-helpers@22.0.0
  - @atlaskit/media-ui@11.0.0

## 40.0.0

- [patch][6ffa3eaae9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ffa3eaae9):

  - Emit file-added events in the tenant context

- Updated dependencies [a1192ef860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1192ef860):
  - @atlaskit/media-card@62.0.0
  - @atlaskit/media-editor@34.0.0
  - @atlaskit/media-viewer@42.0.0
  - @atlaskit/media-store@11.1.1
  - @atlaskit/media-test-helpers@21.4.0
  - @atlaskit/media-core@29.3.0

## 39.0.0

- Updated dependencies [e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):
  - @atlaskit/media-card@61.0.0
  - @atlaskit/media-editor@33.0.0
  - @atlaskit/media-viewer@41.0.0
  - @atlaskit/media-store@11.1.0
  - @atlaskit/media-test-helpers@21.3.0
  - @atlaskit/media-core@29.2.0

## 38.1.6

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/dropdown-menu@7.0.6
  - @atlaskit/field-text@8.0.3
  - @atlaskit/flag@10.0.6
  - @atlaskit/icon@16.0.9
  - @atlaskit/modal-dialog@8.0.7
  - @atlaskit/select@8.1.1
  - @atlaskit/spinner@10.0.7
  - @atlaskit/toggle@6.0.4
  - @atlaskit/media-card@60.0.3
  - @atlaskit/media-editor@32.0.6
  - @atlaskit/media-ui@10.1.5
  - @atlaskit/media-viewer@40.1.10
  - @atlaskit/theme@8.1.7

## 38.1.5

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next supplied from itself.

## 38.1.4

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/dropdown-menu@7.0.4
  - @atlaskit/field-text@8.0.2
  - @atlaskit/flag@10.0.5
  - @atlaskit/icon@16.0.8
  - @atlaskit/modal-dialog@8.0.6
  - @atlaskit/select@8.0.5
  - @atlaskit/spinner@10.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/toggle@6.0.3
  - @atlaskit/analytics-listeners@5.0.3
  - @atlaskit/media-card@60.0.1
  - @atlaskit/media-core@29.1.4
  - @atlaskit/media-editor@32.0.5
  - @atlaskit/media-store@11.0.7
  - @atlaskit/media-ui@10.1.3
  - @atlaskit/media-viewer@40.1.5
  - @atlaskit/button@12.0.0

## 38.1.3

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

## 38.1.2

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 38.1.1

- [patch][60a89f843f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60a89f843f):

  - cleanup DOM elements on teardown and deactivate

## 38.1.0

- [minor][e36f791fd6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e36f791fd6):

  - Improve types

## 38.0.0

- Updated dependencies [c2c36de22b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c36de22b):
  - @atlaskit/media-card@59.0.0
  - @atlaskit/media-editor@32.0.0
  - @atlaskit/media-viewer@40.0.0
  - @atlaskit/media-store@11.0.3
  - @atlaskit/media-test-helpers@21.1.0
  - @atlaskit/media-core@29.1.0

## 37.0.3

- Updated dependencies [9c316bd8aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c316bd8aa):
  - @atlaskit/media-core@29.0.2
  - @atlaskit/media-editor@31.0.3
  - @atlaskit/media-store@11.0.2
  - @atlaskit/media-test-helpers@21.0.3
  - @atlaskit/media-viewer@39.0.2
  - @atlaskit/media-card@58.0.0

## 37.0.2

- [patch][b3c60e3c9c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3c60e3c9c):

  - Update media-editor dependency

## 37.0.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 37.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/dropdown-menu@7.0.1
  - @atlaskit/field-text@8.0.1
  - @atlaskit/flag@10.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/modal-dialog@8.0.2
  - @atlaskit/select@8.0.3
  - @atlaskit/spinner@10.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/toggle@6.0.1
  - @atlaskit/media-card@57.0.0
  - @atlaskit/media-editor@31.0.0
  - @atlaskit/media-viewer@39.0.0
  - @atlaskit/button@11.0.0
  - @atlaskit/analytics-gas-types@4.0.0
  - @atlaskit/analytics-listeners@5.0.0
  - @atlaskit/analytics-next-types@4.0.0
  - @atlaskit/media-core@29.0.0
  - @atlaskit/media-store@11.0.0
  - @atlaskit/media-test-helpers@21.0.0
  - @atlaskit/media-ui@10.0.0

## 36.0.0

- Updated dependencies [7ab3e93996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ab3e93996):
  - @atlaskit/media-card@56.0.0
  - @atlaskit/media-editor@30.0.0
  - @atlaskit/media-test-helpers@20.1.8
  - @atlaskit/media-viewer@38.0.0
  - @atlaskit/media-core@28.0.0
  - @atlaskit/media-store@10.0.0

## 35.0.2

- [patch][ff3f40bc38](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff3f40bc38):

  - Fix remove from cache function, which fixes issue when user is deleting recent image in media picker

## 35.0.1

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/icon@16.0.4
  - @atlaskit/analytics-gas-types@3.2.5
  - @atlaskit/analytics-listeners@4.2.1
  - @atlaskit/media-card@55.0.2
  - @atlaskit/media-core@27.2.3
  - @atlaskit/media-editor@29.1.2
  - @atlaskit/media-store@9.2.1
  - @atlaskit/media-ui@9.2.1
  - @atlaskit/media-viewer@37.0.1
  - @atlaskit/media-test-helpers@20.1.7
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics-next@4.0.0
  - @atlaskit/dropdown-menu@7.0.0
  - @atlaskit/field-text@8.0.0
  - @atlaskit/flag@10.0.0
  - @atlaskit/modal-dialog@8.0.0
  - @atlaskit/select@8.0.0
  - @atlaskit/spinner@10.0.0
  - @atlaskit/theme@8.0.0
  - @atlaskit/toggle@6.0.0

## 35.0.0

- [patch][6bd4c428e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6bd4c428e2):

  - load image preview as soon representation is present instead of waiting for file status to be processed

- Updated dependencies [4aee5f3cec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aee5f3cec):
  - @atlaskit/media-card@55.0.0
  - @atlaskit/media-editor@29.0.0
  - @atlaskit/media-viewer@37.0.0
  - @atlaskit/media-test-helpers@20.1.6
  - @atlaskit/media-core@27.2.0
  - @atlaskit/media-store@9.2.0

## 34.1.0

- [minor][f1b46bcb42](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1b46bcb42):

  - ED-6259 Enable stricter types for media packages

## 34.0.0

- [patch][2e676676ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e676676ba):

  - Use Identifier from media-core instead of media-card

- Updated dependencies [6e49c7c418](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e49c7c418):
- Updated dependencies [fc6164c8c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc6164c8c2):
- Updated dependencies [190c4b7bd3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/190c4b7bd3):
  - @atlaskit/media-viewer@36.0.0
  - @atlaskit/media-card@54.0.0
  - @atlaskit/media-editor@28.0.0
  - @atlaskit/media-store@9.1.7
  - @atlaskit/media-test-helpers@20.1.5
  - @atlaskit/media-core@27.1.0

## 33.0.4

- Updated dependencies [46dfcfbeca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/46dfcfbeca):
  - @atlaskit/media-core@27.0.2
  - @atlaskit/media-editor@27.0.4
  - @atlaskit/media-store@9.1.6
  - @atlaskit/media-test-helpers@20.1.4
  - @atlaskit/media-viewer@35.2.1
  - @atlaskit/media-card@53.0.0

## 33.0.3

- Updated dependencies [06713e0a0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06713e0a0c):
  - @atlaskit/media-test-helpers@20.1.3
  - @atlaskit/modal-dialog@7.2.3
  - @atlaskit/select@7.0.0

## 33.0.2

- Updated dependencies [d5bce1ea15](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5bce1ea15):
  - @atlaskit/media-card@52.0.4
  - @atlaskit/media-editor@27.0.3
  - @atlaskit/media-test-helpers@20.1.2
  - @atlaskit/media-viewer@35.2.0
  - @atlaskit/media-ui@9.0.0

## 33.0.1

- [patch][ef469cbb0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef469cbb0b):

  - MS-357 replaced @atlaskit/util-shared-styles from media components by @atlaskit/theme

## 33.0.0

- [major][65b73cc466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65b73cc466):

  - Code split media-picker: make MediaPicker factory async and make editor use it

## 32.0.1

- [patch][6ead14f4eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ead14f4eb):

  - Move Async module loading of EditorView into media-editor component.

- Updated dependencies [79e21779d4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79e21779d4):
  - @atlaskit/media-editor@27.0.0

## 32.0.0

- [minor][4e82fedc90](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e82fedc90):

  - Expose real id upfront for remote files in MediaPicker

- [major][9d881f1eb8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d881f1eb8):

  - Use real id upfront for remote files + remove PublicMediaFile interface + now integrators can just use file.id from public events

- Updated dependencies [69c8d0c19c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c8d0c19c):
  - @atlaskit/media-card@52.0.0
  - @atlaskit/media-editor@26.0.0
  - @atlaskit/media-test-helpers@20.1.0
  - @atlaskit/media-viewer@35.0.0
  - @atlaskit/media-store@9.1.5
  - @atlaskit/media-core@27.0.0

## 31.0.2

- [patch][07a187bb30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07a187bb30):

  - Fetch cloud accounts only on cloud folder opening

## 31.0.1

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/dropdown-menu@6.1.26
  - @atlaskit/flag@9.1.9
  - @atlaskit/modal-dialog@7.2.1
  - @atlaskit/select@6.1.19
  - @atlaskit/toggle@5.0.15
  - @atlaskit/media-card@51.0.1
  - @atlaskit/media-editor@25.0.1
  - @atlaskit/media-test-helpers@19.1.1
  - @atlaskit/media-ui@8.2.5
  - @atlaskit/media-viewer@34.0.1
  - @atlaskit/icon@16.0.0

## 31.0.0

- Updated dependencies [85d5d168fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85d5d168fd):
  - @atlaskit/media-card@51.0.0
  - @atlaskit/media-editor@25.0.0
  - @atlaskit/media-viewer@34.0.0
  - @atlaskit/media-store@9.1.3
  - @atlaskit/media-test-helpers@19.1.0
  - @atlaskit/media-core@26.2.0

## 30.0.0

- [patch][6da174b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6da174b):

  - Implementation of MediaEditor is partially moved to media-editor

- Updated dependencies [dadef80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dadef80):
- Updated dependencies [3ad16f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ad16f3):
- Updated dependencies [f9796df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9796df):
  - @atlaskit/media-card@50.0.0
  - @atlaskit/media-editor@24.0.0
  - @atlaskit/media-viewer@33.0.0
  - @atlaskit/media-store@9.1.2
  - @atlaskit/media-test-helpers@19.0.0
  - @atlaskit/media-core@26.1.0
  - @atlaskit/media-ui@8.2.4

## 29.0.3

- [patch][e6516fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6516fb):

  - Move media mocks into right location to prevent them to be included in dist

## 29.0.2

- [patch][a55e4e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a55e4e6):

  - Remove Axios dependency from media-picker

## 29.0.1

- [patch][c91adfe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c91adfe):

  - remove customVideoPlayer featureFlag prop and enable by default

## 29.0.0

- [patch][cbb8cb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbb8cb5):

  - Remove redundant fileStreamCache createKey() method and replace the cache key with id everywhere

- Updated dependencies [cbb8cb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbb8cb5):
  - @atlaskit/media-card@49.0.0
  - @atlaskit/media-editor@23.0.0
  - @atlaskit/media-test-helpers@18.9.1
  - @atlaskit/media-viewer@31.0.0
  - @atlaskit/media-store@9.1.1
  - @atlaskit/media-core@26.0.0

## 28.0.0

- Updated dependencies [72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):
  - @atlaskit/media-card@48.0.0
  - @atlaskit/media-editor@22.0.0
  - @atlaskit/media-core@25.0.0
  - @atlaskit/media-store@9.1.0
  - @atlaskit/media-test-helpers@18.9.0

## 27.0.5

- [patch][8314694](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8314694):

  - Support uploading + processing files in MediaViewer

## 27.0.4

- [patch][442821a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/442821a):

  - Fix the issue with being unable to save image inserted into the editor: pass collection to tenant auth for file polling

## 27.0.3

- [patch][b677631](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b677631):

  - Add new example and ensure occurrenceKey is set for all copy/withToken calls

## 27.0.2

- Updated dependencies [135ed00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/135ed00):
  - @atlaskit/media-core@24.7.2
  - @atlaskit/media-store@9.0.2
  - @atlaskit/media-test-helpers@18.7.2
  - @atlaskit/media-card@47.0.0

## 27.0.1

- [patch][ca16fa9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca16fa9):

  - Add SSR support to media components

## 27.0.0

- [major][6cb6696](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6cb6696):

  - All file ids returned in any of the triggered events (including syncronouse one like uploads-start) are real file IDs and not a temp. one;

- Updated dependencies [b3738ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3738ea):
- Updated dependencies [096f898](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/096f898):
  - @atlaskit/media-card@46.0.0
  - @atlaskit/media-editor@21.0.0
  - @atlaskit/media-store@9.0.0
  - @atlaskit/media-test-helpers@18.7.0
  - @atlaskit/media-core@24.7.0

## 26.0.0

- Updated dependencies [80f765b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80f765b):
  - @atlaskit/media-card@45.0.0
  - @atlaskit/media-editor@20.0.0
  - @atlaskit/media-store@8.5.1
  - @atlaskit/media-test-helpers@18.6.2
  - @atlaskit/media-core@24.6.0

## 25.0.8

- [patch][ff8b31d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff8b31d):

  - Pass uploadParams to createStore when initializing MediaPicker popup. This fixes an issue when calling /copy/withToken endpoint

## 25.0.7

- [patch][5f12909](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f12909):

  - remove tenant property from MediaPicker + make show() faster

## 25.0.6

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/dropdown-menu@6.1.25
  - @atlaskit/field-text@7.0.18
  - @atlaskit/flag@9.1.8
  - @atlaskit/icon@15.0.2
  - @atlaskit/modal-dialog@7.1.1
  - @atlaskit/spinner@9.0.13
  - @atlaskit/toggle@5.0.14
  - @atlaskit/analytics-gas-types@3.2.3
  - @atlaskit/analytics-listeners@4.1.4
  - @atlaskit/media-card@44.1.3
  - @atlaskit/media-core@24.5.2
  - @atlaskit/media-editor@19.0.2
  - @atlaskit/media-ui@8.1.2
  - @atlaskit/docs@6.0.0

## 25.0.5

- [patch][92a6240](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92a6240):

  - Picking video file will now send dimensions same way as image would

## 25.0.4

- Updated dependencies [5de3574](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5de3574):
  - @atlaskit/media-test-helpers@18.5.2
  - @atlaskit/media-card@44.1.1
  - @atlaskit/media-ui@8.0.0

## 25.0.3

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/dropdown-menu@6.1.23
  - @atlaskit/flag@9.1.6
  - @atlaskit/modal-dialog@7.0.13
  - @atlaskit/toggle@5.0.12
  - @atlaskit/media-card@44.0.2
  - @atlaskit/media-editor@19.0.1
  - @atlaskit/media-test-helpers@18.3.1
  - @atlaskit/media-ui@7.6.2
  - @atlaskit/icon@15.0.0

## 25.0.2

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/dropdown-menu@6.1.22
  - @atlaskit/field-text@7.0.15
  - @atlaskit/flag@9.1.5
  - @atlaskit/icon@14.6.1
  - @atlaskit/modal-dialog@7.0.12
  - @atlaskit/spinner@9.0.11
  - @atlaskit/toggle@5.0.11
  - @atlaskit/analytics-listeners@4.1.1
  - @atlaskit/media-card@44.0.1
  - @atlaskit/media-core@24.5.1
  - @atlaskit/media-ui@7.6.1
  - @atlaskit/button@10.0.0
  - @atlaskit/analytics-next-types@3.1.2

## 25.0.1

- [patch][b9d9e9a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9d9e9a):

  - Support advanced i18n mode in MediaPicker

## 25.0.0

- [minor][801fd18](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/801fd18):

  - Ability to delete file from recents has been added; MediaFile now has optional fields userUpfrontId and userOccurrenceKey;

- Updated dependencies [7e8b4b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e8b4b9):
  - @atlaskit/media-card@44.0.0
  - @atlaskit/media-editor@19.0.0
  - @atlaskit/media-test-helpers@18.3.0
  - @atlaskit/media-core@24.5.0

## 24.0.1

- [patch][e151c1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e151c1a):

  - Removes dependency on @atlaskit/layer-manager

  As of component versions:

  - \`@atlaskit/modal-dialog@7.0.0\`
  - \`@atlaskit/tooltip@12.0.2\`
  - \`@atlaskit/flag@9.0.6\`
  - \`@atlaskit/onboarding@6.0.0\`

  No component requires \`LayerManager\` to layer correctly.

  You can safely remove this dependency and stop rendering \`LayerManager\` in your apps.

## 24.0.0

- Updated dependencies [2c21466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c21466):
  - @atlaskit/media-card@43.0.0
  - @atlaskit/media-editor@18.0.0
  - @atlaskit/media-test-helpers@18.2.12
  - @atlaskit/media-core@24.4.0
  - @atlaskit/media-store@8.3.0

## 23.2.2

- Updated dependencies [04c7192](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/04c7192):
  - @atlaskit/media-core@24.3.1
  - @atlaskit/media-test-helpers@18.2.11
  - @atlaskit/media-card@42.0.0

## 23.2.1

- [patch] Updated dependencies [ced32d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ced32d0)
  - @atlaskit/media-card@41.1.2
  - @atlaskit/media-test-helpers@18.2.10
  - @atlaskit/media-ui@7.0.0

## 23.2.0

- [minor] pass scaleFactor from media-picker upload-preview-update event [e23a078](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e23a078)

## 23.1.0

- [minor] add scaleFactor to ImagePreview type [605eff0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/605eff0)

## 23.0.0

- [major] Add i18n support to MediaPicker [9add3a4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9add3a4)

## 22.0.0

- [major] Cleanup media + editor integration 🔥 [2f9d14d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2f9d14d)

## 21.0.0

- [patch] Split Media + Editor cleanup part 1 [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)
- [major] Updated dependencies [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)
  - @atlaskit/media-card@41.0.0
  - @atlaskit/media-editor@17.0.0
  - @atlaskit/media-core@24.3.0
  - @atlaskit/media-store@8.2.0
  - @atlaskit/media-test-helpers@18.2.8

## 20.0.1

- [patch] Updated dependencies [6e510d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e510d8)
  - @atlaskit/media-core@24.2.2
  - @atlaskit/media-test-helpers@18.2.7
  - @atlaskit/media-card@40.0.0

## 20.0.0

- [major] Remove hardcoded 'source' field from all events which will avoid overriding the value provided by integrating products. When upgrading, make sure you also upgrade the analytics-listener package which is now responsible for setting the default 'source' value if not set. [17afe04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/17afe04)

## 19.0.0

- [major] Updated dependencies [2afa60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2afa60d)
  - @atlaskit/media-card@39.0.0
  - @atlaskit/media-editor@16.0.0
  - @atlaskit/media-test-helpers@18.2.5
  - @atlaskit/media-core@24.2.0
  - @atlaskit/media-store@8.1.0

## 18.1.0

- [minor] Add pagination to recents view in MediaPicker [4b3c1f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b3c1f5)

## 18.0.0

- [patch] Deprecate context.uploadFile & context.getFile. Instead context.file.upload & context.file.getFileState should be used; media-store's uploadFile function now takes MediaStore as a second argument, not MediaApiConfig [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [patch] Deprecate context.uploadFile & context.getFile. Instead context.file.upload & context.file.getFileState should be used; media-store's uploadFile function now takes MediaStore as a second argument, not MediaApiConfig [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)
- [major] Updated dependencies [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [major] Updated dependencies [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)
  - @atlaskit/media-card@38.0.0
  - @atlaskit/media-editor@15.0.0
  - @atlaskit/media-core@24.1.0
  - @atlaskit/media-store@8.0.0
  - @atlaskit/media-test-helpers@18.2.3

## 17.0.4

- [patch] use Card instead of CardView in MediaPicker recents [081f4c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/081f4c6)

## 17.0.3

- [patch] Updated dependencies [2d848cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d848cd)
  - @atlaskit/media-core@24.0.3
  - @atlaskit/media-test-helpers@18.2.2
  - @atlaskit/media-store@7.0.0

## 17.0.2

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/dropdown-menu@6.1.17
  - @atlaskit/flag@9.0.11
  - @atlaskit/layer-manager@5.0.13
  - @atlaskit/modal-dialog@7.0.2
  - @atlaskit/toggle@5.0.9
  - @atlaskit/media-card@37.0.1
  - @atlaskit/media-editor@14.0.1
  - @atlaskit/media-test-helpers@18.2.1
  - @atlaskit/icon@14.0.0

## 17.0.1

- [patch] Updated dependencies [dae7792](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dae7792)
  - @atlaskit/media-core@24.0.2
  - @atlaskit/media-card@37.0.0
  - @atlaskit/media-test-helpers@18.2.0

## 17.0.0

- [major] Update RXJS dependency to ^5.5.0 [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
- [major] Updated dependencies [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
  - @atlaskit/media-card@36.0.0
  - @atlaskit/media-editor@14.0.0
  - @atlaskit/media-store@6.2.1
  - @atlaskit/media-core@24.0.0
  - @atlaskit/media-test-helpers@18.0.0

## 16.0.6

- [patch] Updated dependencies [1be4bb8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1be4bb8)
  - @atlaskit/media-core@23.2.1
  - @atlaskit/media-card@35.0.0

## 16.0.5

- [patch] Introduce media analytics listener [e7d7ab1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7d7ab1)

## 16.0.4

- [patch] Add className to headless dropzone [96be52e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/96be52e)

## 16.0.3

- [patch] use context.collection.getItems in MediaPicker [1486ca4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1486ca4)

## 16.0.2

- [patch] Use stricter tsconfig [3e3a10d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3e3a10d)

## 16.0.1

- [patch] Handle the fact that remoteUploadId may not exist and not break cloud uploads [c2317af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2317af)

## 16.0.0

- [major] Updated dependencies [6e1d642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e1d642)
  - @atlaskit/media-card@34.0.0
  - @atlaskit/media-editor@13.0.0
  - @atlaskit/media-core@23.2.0
  - @atlaskit/media-store@6.2.0
  - @atlaskit/media-test-helpers@17.1.0

## 15.1.2

- [patch] Update TS to 3.0 [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
- [none] Updated dependencies [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
  - @atlaskit/media-test-helpers@17.0.2
  - @atlaskit/media-core@23.1.1
  - @atlaskit/media-card@33.0.2

## 15.1.1

- [patch] Fix app not dispatching dropzone actions [34f69df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/34f69df)

## 15.1.0

- [minor] Instrument media-picker with analytics [d5f093b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5f093b)

## 15.0.2

- [patch] Updated dependencies [d5a043a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5a043a)
  - @atlaskit/icon@13.8.1
  - @atlaskit/flag@9.0.10
  - @atlaskit/modal-dialog@7.0.0

## 15.0.1

- [patch] Updated dependencies [9c66d4d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c66d4d)
  - @atlaskit/webdriver-runner@0.1.0

## 15.0.0

- [major] "userAuthProvider" property removed from all the media-picker configs; Optional "shouldCopyFileToRecents" property added to all media-picker configs; "tenantUploadParams" is removed since "uploadParams" is already a tenant one; "copyFileToRecents" is removed from UploadParams; [048f488](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/048f488)

## 14.0.1

- [patch] Append timestamp in image files for Clipboard component [da65dec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da65dec)

## 14.0.0

- [minor] Expose upfrontId in MediaPicker [7545979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7545979)
- [major] Updated dependencies [7545979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7545979)
  - @atlaskit/media-card@33.0.0
  - @atlaskit/media-editor@12.0.0
  - @atlaskit/media-core@23.1.0
  - @atlaskit/media-store@6.1.0

## 13.0.0

- [major] Remove new upload service feature flag (useNewUploadService). Now new upload service will be used by default. [911a570](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/911a570)
- [patch] Updated dependencies [911a570](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/911a570)
  - @atlaskit/media-test-helpers@17.0.0
  - @atlaskit/media-store@6.0.1
  - @atlaskit/media-editor@11.0.1
  - @atlaskit/media-core@23.0.2
  - @atlaskit/media-card@32.0.6

## 12.1.2

- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/media-card@32.0.5

## 12.1.1

- [patch] Fix MediaPicker Dropzone UI on IE11 [79f780a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79f780a)

## 12.1.0

- [minor] New option "singleSelect" allows to limit number of selected files to just 1. [4ac210e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4ac210e)

## 12.0.1

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/media-card@32.0.1
  - @atlaskit/modal-dialog@6.0.6
  - @atlaskit/field-text@7.0.4
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/toggle@5.0.5
  - @atlaskit/flag@9.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/spinner@9.0.5
  - @atlaskit/icon@13.2.4
  - @atlaskit/dropdown-menu@6.1.5

## 12.0.0

- [major] Synchronous property "serviceHost" as part of many Interfaces in media components (like MediaApiConfig) is removed and replaced with asynchronous "baseUrl" as part of Auth object. [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
- [major] Updated dependencies [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
  - @atlaskit/media-test-helpers@16.0.0
  - @atlaskit/media-store@6.0.0
  - @atlaskit/media-editor@11.0.0
  - @atlaskit/media-core@23.0.0
  - @atlaskit/media-card@32.0.0

## 11.2.2

- [patch] Updated dependencies [59ccb09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59ccb09)
  - @atlaskit/media-card@31.3.0

## 11.2.1

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/media-card@31.2.1
  - @atlaskit/flag@9.0.3
  - @atlaskit/icon@13.2.2
  - @atlaskit/media-editor@10.0.1
  - @atlaskit/toggle@5.0.4
  - @atlaskit/button@9.0.4
  - @atlaskit/media-core@22.2.1
  - @atlaskit/media-test-helpers@15.2.1
  - @atlaskit/media-store@5.1.1
  - @atlaskit/spinner@9.0.4
  - @atlaskit/field-text@7.0.3
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/dropdown-menu@6.1.4
  - @atlaskit/modal-dialog@6.0.5

## 11.2.0

- [minor] MediaPicker Popup now supports passing of optional parent react context as a parameter [25ef2e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25ef2e4)

## 11.1.2

- [patch] pass mimeType to files in uploads-start event in MediaPicker [3485c00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3485c00)
- [patch] Updated dependencies [3485c00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3485c00)
  - @atlaskit/media-core@22.2.0
  - @atlaskit/media-card@31.1.1

## 11.1.1

- [patch] use context.getFile in media-card [fad25ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fad25ec)
- [patch] Updated dependencies [fad25ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fad25ec)
  - @atlaskit/media-test-helpers@15.2.0
  - @atlaskit/media-store@5.1.0
  - @atlaskit/media-core@22.1.0
  - @atlaskit/media-card@31.1.0

## 11.1.0

- [patch] Updated dependencies [fa6f865](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa6f865)
  - @atlaskit/media-card@31.0.0
  - @atlaskit/media-test-helpers@15.1.0
- [none] Updated dependencies [fdd03d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd03d8)
  - @atlaskit/media-card@31.0.0
  - @atlaskit/media-test-helpers@15.1.0
- [patch] Updated dependencies [49c8425](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49c8425)
  - @atlaskit/media-card@31.0.0
  - @atlaskit/media-test-helpers@15.1.0
- [minor] Updated dependencies [3476e01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3476e01)
  - @atlaskit/media-card@31.0.0

## 11.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/media-card@30.0.0
  - @atlaskit/modal-dialog@6.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/toggle@5.0.0
  - @atlaskit/flag@9.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/media-core@22.0.0
  - @atlaskit/media-test-helpers@15.0.0
  - @atlaskit/media-store@5.0.0
  - @atlaskit/media-editor@10.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/dropdown-menu@6.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/media-card@30.0.0
  - @atlaskit/media-test-helpers@15.0.0
  - @atlaskit/media-store@5.0.0
  - @atlaskit/media-editor@10.0.0
  - @atlaskit/media-core@22.0.0
  - @atlaskit/modal-dialog@6.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/toggle@5.0.0
  - @atlaskit/flag@9.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/dropdown-menu@6.0.0

## 10.0.0

- [major] Remove old analytics client, context and tracker code [daf6227](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/daf6227)

## 9.0.1

- [patch][msw-847 ] Fix Safari issue with not selecting files in MediaPicker recents [6f51fdb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6f51fdb)

## 9.0.0

- [major] Use more strict type for MediaArtifacts [8c711bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c711bd)
- [patch] Use media.tsconfig in MediaViewer [42ee1ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42ee1ea)
- [patch] Updated dependencies [42ee1ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42ee1ea)
  - @atlaskit/media-test-helpers@14.0.6
  - @atlaskit/media-editor@9.1.4
  - @atlaskit/media-core@21.0.0
  - @atlaskit/media-card@29.1.8

## 8.1.6

- [patch] Safely handle paste handler for clipboard to avoid error noise in unsupported browsers [8d5053e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d5053e)

## 8.1.5

- [patch] re-enable usage of file id upfront in new MediaPicker uploader [3fb464b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3fb464b)
- [patch] Updated dependencies [3fb464b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3fb464b)
  - @atlaskit/media-store@4.2.1

## 8.1.4

- [patch] merge getFile and uploadFile + update MediaPicker NewUploadService + expose UploadController from MediaStore [c57e9c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c57e9c1)
- [patch] Updated dependencies [c57e9c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c57e9c1)
  - @atlaskit/media-store@4.2.0
  - @atlaskit/media-test-helpers@14.0.4
  - @atlaskit/media-editor@9.1.3
  - @atlaskit/media-card@29.1.5
  - @atlaskit/media-core@20.0.0

## 8.1.3

- [patch] Updated dependencies [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
  - @atlaskit/spinner@8.0.0
  - @atlaskit/media-card@29.1.4
  - @atlaskit/flag@8.1.3
  - @atlaskit/button@8.2.3

## 8.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/media-card@29.1.2
  - @atlaskit/media-test-helpers@14.0.3
  - @atlaskit/media-store@4.1.1
  - @atlaskit/media-editor@9.1.2
  - @atlaskit/media-core@19.1.3
  - @atlaskit/modal-dialog@5.2.2
  - @atlaskit/field-text@6.0.4
  - @atlaskit/button@8.1.2
  - @atlaskit/toggle@4.0.3
  - @atlaskit/spinner@7.0.2
  - @atlaskit/flag@8.1.1
  - @atlaskit/icon@12.1.2
  - @atlaskit/dropdown-menu@5.0.4

## 8.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/media-card@29.1.1
  - @atlaskit/media-test-helpers@14.0.2
  - @atlaskit/media-editor@9.1.1
  - @atlaskit/media-core@19.1.2
  - @atlaskit/spinner@7.0.1
  - @atlaskit/modal-dialog@5.1.1
  - @atlaskit/icon@12.1.1
  - @atlaskit/analytics-next@2.1.8
  - @atlaskit/dropdown-menu@5.0.3
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1

## 8.1.0

- [patch] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)

  - @atlaskit/spinner@7.0.0
  - @atlaskit/media-card@29.1.0
  - @atlaskit/modal-dialog@5.1.0
  - @atlaskit/dropdown-menu@5.0.2
  - @atlaskit/icon@12.1.0
  - @atlaskit/media-editor@9.1.0
  - @atlaskit/toggle@4.0.2
  - @atlaskit/docs@4.1.0
  - @atlaskit/media-core@19.1.1
  - @atlaskit/media-test-helpers@14.0.1
  - @atlaskit/field-text@6.0.2
  - @atlaskit/analytics-next@2.1.7
  - @atlaskit/flag@8.1.0
  - @atlaskit/button@8.1.0

## 8.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/media-card@29.0.0
  - @atlaskit/media-test-helpers@14.0.0
  - @atlaskit/media-store@4.0.0
  - @atlaskit/media-core@19.0.0
  - @atlaskit/media-editor@9.0.0
  - @atlaskit/modal-dialog@5.0.0
  - @atlaskit/flag@8.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/toggle@4.0.0
  - @atlaskit/field-text@6.0.0
  - @atlaskit/analytics-next@2.1.4
  - @atlaskit/button@8.0.0
  - @atlaskit/spinner@6.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/dropdown-menu@5.0.0

## 7.0.6

- [patch] Updated dependencies [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/media-card@28.0.6

## 7.0.5

- [patch] Updated dependencies [5ee48c4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ee48c4)
  - @atlaskit/media-store@3.1.1
  - @atlaskit/media-core@18.1.2
  - @atlaskit/media-editor@8.0.2

## 7.0.4

- [patch] add media mocks [1754450](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1754450)
- [none] Updated dependencies [1754450](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1754450)
  - @atlaskit/media-test-helpers@13.1.0
  - @atlaskit/media-store@3.1.0

## 7.0.3

- [patch][f87724e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f87724e)
- [none] Updated dependencies [f87724e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f87724e)
  - @atlaskit/media-test-helpers@13.0.2
  - @atlaskit/media-card@28.0.4

## 7.0.2

- [patch] remove browse + dropzone logic from UploadService [02a72e8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/02a72e8)

## 7.0.1

- [patch] Updated dependencies [bd26d3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd26d3c)
  - @atlaskit/media-store@3.0.1
  - @atlaskit/media-core@18.1.1
  - @atlaskit/media-test-helpers@13.0.1
  - @atlaskit/media-editor@8.0.1
  - @atlaskit/media-card@28.0.1

## 7.0.0

- [major] media-picker: <All but popup picker>.emitUploadEnd second argument shape has changed from MediaFileData to FileDetails; `upload-end` event payload body shape changed from MediaFileData to FileDetails; All the media pickers config now have new property `useNewUploadService: boolean` (false by default); popup media-picker .cancel can't be called with no argument, though types does allow for it; `File` is removed; --- media-store: MediaStore.createFile now has a required argument of type MediaStoreCreateFileParams; MediaStore.copyFileWithToken new method; uploadFile method result type has changed from just a promise to a UploadFileResult type; --- media-test-helpers: mediaPickerAuthProvider argument has changed from a component instance to just a boolean authEnvironment; [84f6f91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84f6f91)
- [major] SUMMARY GOES HERE [9041d71](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9041d71)
- [major] Updated dependencies [84f6f91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84f6f91)
  - @atlaskit/media-test-helpers@13.0.0
  - @atlaskit/media-store@3.0.0
  - @atlaskit/media-core@18.1.0
  - @atlaskit/media-editor@8.0.0
  - @atlaskit/media-card@28.0.0
- [major] Updated dependencies [9041d71](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9041d71)
  - @atlaskit/media-test-helpers@13.0.0
  - @atlaskit/media-store@3.0.0
  - @atlaskit/media-core@18.1.0
  - @atlaskit/media-editor@8.0.0
  - @atlaskit/media-card@28.0.0

## 6.0.6

- [patch] change media picker image src to static assets served on dt-static [a5a740b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a5a740b)

## 6.0.5

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/media-editor@7.0.2
  - @atlaskit/media-card@27.1.4
  - @atlaskit/toggle@3.0.2
  - @atlaskit/modal-dialog@4.0.5
  - @atlaskit/flag@7.0.3
  - @atlaskit/field-text@5.0.3
  - @atlaskit/media-test-helpers@12.0.4
  - @atlaskit/media-core@18.0.3
  - @atlaskit/analytics-next@2.1.1
  - @atlaskit/dropdown-menu@4.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/spinner@5.0.2
  - @atlaskit/docs@3.0.4

## 6.0.4

- [patch] Media Picker Popup modal dialog now has a fixed size unwanted wrapping behaviour of cards in the Upload view and jumping of the dialog when switching to the GIPHY view. [814e505](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/814e505)

## 6.0.2

- [patch] Add rating "PG" parameter to GIPHY url strings [9cb61d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cb61d3)

## 6.0.1

- [patch] Remove classnames + domready dependencies from MediaPicker [44f94f6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/44f94f6)

## 6.0.0

- [major] For media-picker: fetchMetadata and autoFinalize options are removed from UploadParams and replaced with always "true" in the code. For editor-core: "unfinalized" status is removed from MediaStateStatus and finalizeCb from MediaState. [a41759a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a41759a)

## 4.0.0

- [major] Use media-core context in MediaPicker constructor [6cc9f55](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6cc9f55)

## 3.0.1

- [patch] Added missing dependencies and added lint rule to catch them all [0672503](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0672503)

## 3.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 2.2.0

- [minor] show local previews for video files [6b24c51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6b24c51)

## 2.1.6

- [patch] Show upload button during recents load in media picker. + Inprove caching for auth provider used in examples [929731a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/929731a)

## 2.1.5

- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)

## 2.1.2

- [patch] Add analytics events for click and show actions of media-card [031d5da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/031d5da)

## 2.1.0

- [minor] code split MediaEditor in MediaPicker [bdc395a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bdc395a)

## 2.0.2

- [patch] add icon to annotate card action [e982c4b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e982c4b)

## 2.0.0

- [major] icons are now assignable to card actions, which will cause media cards to render upto 2 icon buttons, or a dropdown menu if more than 2 actions are set [649871c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/649871c)

## 1.1.4

- [patch] Remove TS types that requires styled-components v3 [836e53b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/836e53b)

## 1.1.1

- [patch] Emit 100% upload progress when last file chunk has been uploaded [db24bed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/db24bed)

## 1.1.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 1.0.10

- [patch] Bump Rusha version to 0.8.13 [67a6312](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67a6312)

## 1.0.7

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 1.0.6

- [patch] Fix issue with having multiple Dropzone elements listening at the same time with Editor and MediaPicker [d37de20](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d37de20)

## 1.0.5

- [patch] delay call to /recents and /accounts in MediaPicker and improve overall performance [8f2b541](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8f2b541)

## 1.0.4

- [patch] Move media provider and state manager to editor-core [0601da7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0601da7)

## 1.0.3

- [patch] Replaced heavy placeholder image for GIPHY view error state. This will reduce the page weight of media-picker by ~160kb [e4cb2a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e4cb2a0)

## 1.0.2

- [patch] update link account handling redirect url from custom s3 location to media picker api [bd3e22f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd3e22f)

## 1.0.0

- [major] make MediaPicker stable [fd3f3ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fd3f3ec)

## 0.2.2

- [patch] Migrate Navigation from Ak repo to ak mk 2 repo, Fixed flow typing inconsistencies in ak mk 2 [bdeef5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bdeef5b)

## 0.2.0

- [minor] Added GIPHY file picking support to Media Picker Popup [d6be99c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d6be99c)

## 0.1.2

- [patch] Fixed header styles in Popup [48555ce](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48555ce)

## 0.1.1

- [patch] Fix data URI generation crashing/lagging the browser for large files. data URIs are only generated for local uploaded files when the type of the file [2dd1728](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2dd1728)

## 0.1.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 0.0.2

- [patch] Migrate MediaPicker into new repo [494c424](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/494c424)
