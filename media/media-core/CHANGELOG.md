# @atlaskit/media-core

## 32.2.0

### Minor Changes

- [`531dcf9459d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/531dcf9459d) - Updated MediaClientConfig to accept Auth object for sync operation (see Media Client logs for more info)

## 32.1.3

### Patch Changes

- [`3cd9ee2d15b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cd9ee2d15b) - Added RxJS compatiblity notice in Media docs

## 32.1.2

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 32.1.1

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 32.1.0

### Minor Changes

- [`7d831363d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d831363d9) - Migrated to declarative entry points

## 32.0.3

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 32.0.2

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 32.0.1

### Patch Changes

- [`fa6fb5dfbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa6fb5dfbb) - Removing unused code to be published

## 32.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 31.1.1

### Patch Changes

- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove unused dependencies

## 31.1.0

### Minor Changes

- [minor][6dcad31e41](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dcad31e41):

  - Added Stargate integration to MediaPicker popup.
  - Added `useMediaPickerPopup` option to Editor which enables using MediaPicker popup even when userAuthProvider is not provided.

  ### Using Stargate Integration

  Stargate integration is enabled by default as long as an `userAuthProvider` is not provided to `MediaClient`.

  By default it uses the current domain as base URL. If you need to use a different base URL you can provide a `stargateBaseUrl` configuration:

  ```
  import { MediaClient } from '@atlaskit/media-client';
  const mediaClient = new MediaClient({ authProvider, stargateBaseUrl: 'http://stargate-url' });
  ```

  _Note_: Editor default behaviour is falling back to native file upload when `userAuthProvider` is not provided.
  In order to avoid that, and being able to use Stargate, you need to set Media option `useMediaPickerPopup` to true.

### Patch Changes

- Updated dependencies [9d2da865dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d2da865dd):
- Updated dependencies [dae900bf82](https://bitbucket.org/atlassian/atlassian-frontend/commits/dae900bf82):
- Updated dependencies [9a93eff8e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a93eff8e6):
- Updated dependencies [d49ebd7c7a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d49ebd7c7a):
- Updated dependencies [6dcad31e41](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dcad31e41):
- Updated dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
- Updated dependencies [3cbc8a49a2](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cbc8a49a2):
  - @atlaskit/media-card@67.1.1
  - @atlaskit/build-utils@2.6.4
  - @atlaskit/media-test-helpers@27.1.0
  - @atlaskit/docs@8.5.0

## 31.0.5

### Patch Changes

- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [196500df34](https://bitbucket.org/atlassian/atlassian-frontend/commits/196500df34):
- Updated dependencies [be57ca3829](https://bitbucket.org/atlassian/atlassian-frontend/commits/be57ca3829):
- Updated dependencies [d7ed7b1513](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7ed7b1513):
- Updated dependencies [41a2496393](https://bitbucket.org/atlassian/atlassian-frontend/commits/41a2496393):
- Updated dependencies [39ee28797d](https://bitbucket.org/atlassian/atlassian-frontend/commits/39ee28797d):
- Updated dependencies [bbf5eb8824](https://bitbucket.org/atlassian/atlassian-frontend/commits/bbf5eb8824):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [695e1c1c31](https://bitbucket.org/atlassian/atlassian-frontend/commits/695e1c1c31):
- Updated dependencies [6b06a7baa9](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b06a7baa9):
- Updated dependencies [8b34c7371d](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b34c7371d):
  - @atlaskit/docs@8.4.0
  - @atlaskit/media-test-helpers@27.0.0
  - @atlaskit/media-card@67.1.0
  - @atlaskit/button@13.3.9

## 31.0.4

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/button@13.3.7
  - @atlaskit/media-card@67.0.3
  - @atlaskit/media-test-helpers@26.1.1

## 31.0.3

### Patch Changes

- [patch][6ee177aeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ee177aeb4):

  Stream caches in media-client now use ReplaySubjects instead of Observables.
  For the most part, this is just the interface that's being updated, as under the hood ReplaySubject was already getting used. ReplaySubjects better suit our use case because they track 1 version of history of the file state.
  As a consumer, there shouldn't be any necessary code changes. ReplaySubjects extend Observable, so the current usage should continue to work.- Updated dependencies [5504a7da8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/5504a7da8c):

- Updated dependencies [966622bd45](https://bitbucket.org/atlassian/atlassian-frontend/commits/966622bd45):
- Updated dependencies [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
- Updated dependencies [6ee177aeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ee177aeb4):
  - @atlaskit/media-card@67.0.1
  - @atlaskit/media-test-helpers@26.0.0
  - @atlaskit/docs@8.3.0

## 31.0.2

### Patch Changes

- Updated dependencies [486a5aec29](https://bitbucket.org/atlassian/atlassian-frontend/commits/486a5aec29):
- Updated dependencies [03c917044e](https://bitbucket.org/atlassian/atlassian-frontend/commits/03c917044e):
- Updated dependencies [d3f4c97f6a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3f4c97f6a):
- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/media-card@67.0.0
  - @atlaskit/button@13.3.5
  - @atlaskit/media-test-helpers@25.2.6

## 31.0.1

### Patch Changes

- [patch][336c1084d9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/336c1084d9):

  remove media-client dependency to prevent circular dependency between media-core - media-client

## 31.0.0

### Major Changes

- [major][24b8ea2667](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24b8ea2667):

  ## Remove all interfaces and utils not related with auth or cache

### Removes

- Context / ContextFactory / ContextConfig
- MediaItemType / FileItem / FileProcessingStatus / MediaArtifact / Artifacts / FileDetails / FileFetcher / FileFetcherImpl
- UploadableFile / UploadFileCallbacks / UploadFileResult / UploadController / MediaType / isPreviewableType / TouchFileDescriptor / MediaFileArtifacts
- isImageRemote
- FileStatus / FilePreview / PreviewOptions / GetFileOptions / UploadingFileState / ProcessingFileState / ProcessedFileState / ProcessingFailedState / ErrorFileState / isErrorFileState / isImageRepresentationReady / mapMediaFileToFileState / mapMediaItemToFileState
- getMediaTypeFromMimeType
- FileState / StreamsCache
- getFileStreamsCache
- ImageResizeMode
- Identifier / FileIdentifier / ExternalImageIdentifier / isFileIdentifier / isExternalImageIdentifier / isDifferentIdentifier
- remove `cacheSize` from `ContextConfig` \ `MediaClientConfig`: This was used internally only by other media components and doesn't affect integrators

### Upgrading

Previously integrators were able to import any of the above interfaces from `@atlaskit/media-core` or from `@atlaskit/media-client`, now, it's only possible to import them from `@atlaskit/media-client`:

**before**

```
import {MediaItemType, FileItem, FileProcessingStatus} from '@atlaskit/media-core'
```

**after**

```
import {MediaItemType, FileItem, FileProcessingStatus} from '@atlaskit/media-client'
```

Also, `Context, ContextFactory, ContextConfig` has been removed completely, in order to make your components work with media now you have to:

**before**

```
import {Context, ContextFactory, ContextConfig} from '@atlaskit/media-core'

const config: ContextConfig = {
  authProvider: () => Promise.resolve({})
}

const context: Context = ContextFactory.create(config)
```

**after**

```
import {MediaClientConfig} from '@atlaskit/media-core'

const config: MediaClientConfig = {
  authProvider: () => Promise.resolve({})
}
```

## 30.0.17

- Updated dependencies [c3e65f1b9e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3e65f1b9e):
- Updated dependencies [ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):
- Updated dependencies [e7b5c917de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7b5c917de):
  - @atlaskit/media-client@3.0.0
  - @atlaskit/media-test-helpers@25.2.0
  - @atlaskit/media-card@66.0.0

## 30.0.16

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 30.0.15

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 30.0.14

- Updated dependencies [af72468517](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af72468517):
  - @atlaskit/media-client@2.1.2
  - @atlaskit/media-test-helpers@25.1.1
  - @atlaskit/media-card@65.0.0

## 30.0.13

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 30.0.12

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 30.0.11

- Updated dependencies [3624730f44](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3624730f44):
  - @atlaskit/media-client@2.0.2
  - @atlaskit/media-test-helpers@25.0.2
  - @atlaskit/media-card@64.0.0

## 30.0.10

- Updated dependencies [69586b5353](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69586b5353):
  - @atlaskit/media-card@63.3.11
  - @atlaskit/media-client@2.0.1
  - @atlaskit/media-test-helpers@25.0.0

## 30.0.9

- Updated dependencies [ee804f3eeb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee804f3eeb):
  - @atlaskit/media-card@63.3.9
  - @atlaskit/media-test-helpers@24.3.5
  - @atlaskit/media-client@2.0.0

## 30.0.8

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

  bugfix, fixes missing version.json file

## 30.0.7

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 30.0.6

### Patch Changes

- [patch][e69f28b637](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e69f28b637):

  add getAuthFromContext field into MediaClientConfig

  Now products can provide auth based on a `contextId` **ARI**

  ```
  import {MediaClientConfig} from '@atlaskit/media-core';

  const config: MediaClientConfig = {
    authProvider, // already exists
    getAuthFromContext(clientId: string): Promise<Auth> // new optional prop
  }
  ```

## 30.0.5

### Patch Changes

- [patch][6e6d36f3af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e6d36f3af):

  Add optional 'eventEmitter' into cache. This makes existing event emitter system of context compatible with mediaClient

## 30.0.4

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 30.0.3

- Updated dependencies [9ecfef12ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ecfef12ac):
  - @atlaskit/media-card@63.1.0
  - @atlaskit/media-client@1.2.0
  - @atlaskit/media-test-helpers@24.0.0

## 30.0.2

- [patch][af1cbd4ce4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af1cbd4ce4):

  - Removing unnecessary deps and dev deps in media-core and media-client

## 30.0.1

- Updated dependencies [ed3f034232](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed3f034232):
  - @atlaskit/media-card@63.0.2
  - @atlaskit/media-client@1.1.3
  - @atlaskit/media-test-helpers@23.0.0

## 30.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 29.3.0

- [minor][a1192ef860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1192ef860):

  - Add event emitter api to context + add first known event 'file-added'

  Integrators can now do:

  ```
  import {ContextFactory, FileState} from '@atlaskit/media-core'

  const context = ContextFactory.create();

  context.on('file-added', (file: FileState) => {
    console.log(file.id)
  })
  ```

  check the **FileState** for the all the properties included in the payload

## 29.2.0

- [minor][e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):

  - Export new media-store interfaces and methods: `ClientAltBasedAuth`, `MediaClientConfig` and `authToOwner`. Also introduce cache related members related to future migration to media-client: `mediaState`, `CachedMediaState`, `StateDeferredValue`.

## 29.1.5

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 29.1.4

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/media-card@60.0.1
  - @atlaskit/media-store@11.0.7
  - @atlaskit/button@12.0.0

## 29.1.3

- [patch][30a9a7177e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30a9a7177e):

  - [MS-1791] Make fileState.representations optional, since media api might not return that value in all cases and we want to prevent a runtime error

## 29.1.2

- Updated dependencies [0ff405bd0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ff405bd0f):
  - @atlaskit/media-store@11.0.5
  - @atlaskit/media-test-helpers@21.2.2
  - @atlaskit/media-card@60.0.0

## 29.1.1

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 29.1.0

- [minor][c2c36de22b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c36de22b):

  - Fix missing annotated images in recent uploads within media picker

## 29.0.2

- Updated dependencies [9c316bd8aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c316bd8aa):
  - @atlaskit/media-store@11.0.2
  - @atlaskit/media-test-helpers@21.0.3
  - @atlaskit/media-card@58.0.0

## 29.0.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 29.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 28.0.0

- [major][7ab3e93996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ab3e93996):

  - Move checkWebpSupport util from media-core to media-store and use it to request webp from backend

## 27.2.4

- [patch][ff3f40bc38](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff3f40bc38):

  - Fix remove from cache function, which fixes issue when user is deleting recent image in media picker

## 27.2.3

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/media-card@55.0.2
  - @atlaskit/media-store@9.2.1
  - @atlaskit/media-test-helpers@20.1.7
  - @atlaskit/docs@7.0.0

## 27.2.2

- [patch][9b0f6671ae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b0f6671ae):

  - ED-6244: Fix Resizable Media to allow images go smaller size than videos

## 27.2.1

- [patch][5a01d648a3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5a01d648a3):

  - Fixing download binary file content in Safari browsers due CORS issue "safari error [Error] Refused to display in a frame because it set 'X-Frame-Options' to 'SAMEORIGIN'."

## 27.2.0

- [patch][6bd4c428e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6bd4c428e2):

  - load image preview as soon representation is present instead of waiting for file status to be processed

- [minor][4aee5f3cec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aee5f3cec):

  - added representations to file metadata

## 27.1.0

- [minor][fc6164c8c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc6164c8c2):

  - Expose Identifier type and utilities from media-core instead of media-card

- Updated dependencies [190c4b7bd3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/190c4b7bd3):
  - @atlaskit/media-store@9.1.7
  - @atlaskit/media-test-helpers@20.1.5
  - @atlaskit/media-card@54.0.0

## 27.0.2

- Updated dependencies [46dfcfbeca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/46dfcfbeca):
  - @atlaskit/media-store@9.1.6
  - @atlaskit/media-test-helpers@20.1.4
  - @atlaskit/media-card@53.0.0

## 27.0.1

- [patch][a9dc1278c4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a9dc1278c4):

  - add error handling in CollectionFetcher for getItems call

## 27.0.0

- [major][69c8d0c19c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c8d0c19c):

  - Rename fileState.preview.blob to fileState.preview.value and support string + Blob as value

## 26.2.1

- Updated dependencies [07a187bb30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07a187bb30):
  - @atlaskit/media-card@51.0.2
  - @atlaskit/media-store@9.1.4
  - @atlaskit/media-test-helpers@20.0.0

## 26.2.0

- [minor][85d5d168fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85d5d168fd):

  - Expose new getCurrentState method to context

## 26.1.0

- [minor][dadef80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dadef80):

  - Introduce getImageUrl method and FileFetcher TS interface

- Updated dependencies [3ad16f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ad16f3):
  - @atlaskit/media-card@50.0.0
  - @atlaskit/media-store@9.1.2
  - @atlaskit/media-test-helpers@19.0.0

## 26.0.0

- [major][cbb8cb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbb8cb5):

  - Remove redundant fileStreamCache createKey() method and replace the cache key with id everywhere

## 25.0.0

- [major][72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):

  - Remove deprecated methods from media-core
  - Use context.collection methods in MediaViewer
  - Remove link support from media-card
  - Remove legacy services + providers from media-core
  - Remove link related methods from media-core
  - Remove axios dependency
  - Make context.getImage cancelable

## 24.7.2

- Updated dependencies [135ed00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/135ed00):
  - @atlaskit/media-store@9.0.2
  - @atlaskit/media-test-helpers@18.7.2
  - @atlaskit/media-card@47.0.0

## 24.7.1

- [patch][ca16fa9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca16fa9):

  - Add SSR support to media components

## 24.7.0

- [minor][b3738ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3738ea):

  - New method context.file.touchFiles is added; Optional third parameter is added to context.file.upload - loadableFileUpfrontIds where you can define file id, and promise of upload id upfront

- Updated dependencies [096f898](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/096f898):
  - @atlaskit/media-test-helpers@18.7.0
  - @atlaskit/media-store@9.0.0

## 24.6.0

- [minor][80f765b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80f765b):

  - Add stretchy-fit resize mode that acts as full-fit but scales up small image in big container

## 24.5.3

- [patch][0f42ec1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f42ec1):

  Use /items endpoint in media-core

## 24.5.2

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/button@10.1.1
  - @atlaskit/media-card@44.1.3
  - @atlaskit/docs@6.0.0

## 24.5.1

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/media-card@44.0.1
  - @atlaskit/button@10.0.0

## 24.5.0

- [minor][7e8b4b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e8b4b9):

  - Context.collection.removeFile has been added; occurrenceKey was added to all FileState flavours and filled as part of observable during upload;

## 24.4.1

- [patch][705dcf3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/705dcf3):

  - pass collectionName to MediaStore in order to use right auth token

## 24.4.0

- [minor][2c21466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c21466):

  - Allow to inline play video files in media-card

## 24.3.1

- Updated dependencies [04c7192](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/04c7192):
  - @atlaskit/media-test-helpers@18.2.11
  - @atlaskit/media-card@42.0.0

## 24.3.0

- [minor] Split Media + Editor cleanup part 1 [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)

## 24.2.2

- [patch] Updated dependencies [6e510d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e510d8)
  - @atlaskit/media-test-helpers@18.2.7
  - @atlaskit/media-card@40.0.0

## 24.2.1

- [patch] Fix bug with download binary [71ebe0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/71ebe0b)

## 24.2.0

- [minor] Media-card: allow to download binary when processing failed, add failed-processing to CardStatus; Media-core: add context.file.downloadBinary, add failed-processing to FileStatus; Media-store: add getFileBinaryURL; [2afa60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2afa60d)

## 24.1.1

- [patch] Add pagination to recents view in MediaPicker [4b3c1f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b3c1f5)

## 24.1.0

- [minor] Deprecate context.uploadFile & context.getFile. Instead context.file.upload & context.file.getFileState should be used; media-store's uploadFile function now takes MediaStore as a second argument, not MediaApiConfig [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [minor] Deprecate context.uploadFile & context.getFile. Instead context.file.upload & context.file.getFileState should be used; media-store's uploadFile function now takes MediaStore as a second argument, not MediaApiConfig [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)

## 24.0.3

- [patch] Updated dependencies [2d848cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d848cd)
  - @atlaskit/media-test-helpers@18.2.2
  - @atlaskit/media-store@7.0.0

## 24.0.2

- [patch] Updated dependencies [dae7792](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dae7792)
  - @atlaskit/media-card@37.0.0
  - @atlaskit/media-test-helpers@18.2.0

## 24.0.1

- [patch] Support external image identifiers in media-card [82c8bb9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/82c8bb9)

## 24.0.0

- [major] Update RXJS dependency to ^5.5.0 [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)

## 23.2.1

- [patch] Updated dependencies [1be4bb8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1be4bb8)
  - @atlaskit/media-card@35.0.0

## 23.2.0

- [minor] expose new context.collection methods [6e1d642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e1d642)

## 23.1.1

- [patch] Update TS to 3.0 [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
- [none] Updated dependencies [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
  - @atlaskit/media-test-helpers@17.0.2

## 23.1.0

- [minor] Expose upfrontId in MediaPicker [7545979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7545979)

## 23.0.2

- [patch] Updated dependencies [911a570](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/911a570)
  - @atlaskit/media-test-helpers@17.0.0
  - @atlaskit/media-store@6.0.1

## 23.0.1

- [patch] Removing mutational rxjs imports and replace with explicit operators [353f9db](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/353f9db)
- [patch] Removing mutational rxjs imports and replace with explicit operators [56c2df9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/56c2df9)
- [none] Updated dependencies [353f9db](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/353f9db)
- [none] Updated dependencies [56c2df9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/56c2df9)

## 23.0.0

- [major] Synchronous property "serviceHost" as part of many Interfaces in media components (like MediaApiConfig) is removed and replaced with asynchronous "baseUrl" as part of Auth object. [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
- [major] Updated dependencies [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
  - @atlaskit/media-test-helpers@16.0.0
  - @atlaskit/media-store@6.0.0

## 22.2.1

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/button@9.0.4
  - @atlaskit/media-test-helpers@15.2.1
  - @atlaskit/media-store@5.1.1
  - @atlaskit/docs@5.0.2

## 22.2.0

- [minor] pass mimeType to files in uploads-start event in MediaPicker [3485c00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3485c00)
- [minor] Updated dependencies [3485c00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3485c00)

## 22.1.0

- [minor] use context.getFile in media-card [fad25ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fad25ec)
- [minor] Updated dependencies [fad25ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fad25ec)
  - @atlaskit/media-test-helpers@15.2.0
  - @atlaskit/media-store@5.1.0

## 22.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/button@9.0.0
  - @atlaskit/media-test-helpers@15.0.0
  - @atlaskit/media-store@5.0.0
  - @atlaskit/docs@5.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/media-test-helpers@15.0.0
  - @atlaskit/media-store@5.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/docs@5.0.0

## 21.0.0

- [major] Use media.tsconfig in MediaViewer [42ee1ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42ee1ea)
- [none] Updated dependencies [42ee1ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42ee1ea)
  - @atlaskit/media-test-helpers@14.0.6

## 20.0.0

- [major] merge getFile and uploadFile + update MediaPicker NewUploadService + expose UploadController from MediaStore [c57e9c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c57e9c1)
- [major] Updated dependencies [c57e9c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c57e9c1)
  - @atlaskit/media-store@4.2.0
  - @atlaskit/media-test-helpers@14.0.4

## 19.1.3

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/media-test-helpers@14.0.3
  - @atlaskit/media-store@4.1.1
  - @atlaskit/button@8.1.2

## 19.1.2

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/media-test-helpers@14.0.2
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1

## 19.1.1

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/docs@4.1.0
  - @atlaskit/media-test-helpers@14.0.1
  - @atlaskit/button@8.1.0

## 19.1.0

- [minor] add context.getFile [4494d91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4494d91)
- [patch] Updated dependencies [2e66dab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e66dab)
  - @atlaskit/media-store@4.1.0
- [none] Updated dependencies [4494d91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4494d91)
  - @atlaskit/media-store@4.1.0

## 19.0.1

- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/button@8.0.1
  - @atlaskit/docs@4.0.1

## 19.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/media-store@4.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/docs@4.0.0

## 18.1.2

- [patch] Updated dependencies [5ee48c4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ee48c4)
  - @atlaskit/media-store@3.1.1

## 18.1.1

- [patch] Updated dependencies [bd26d3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd26d3c)
  - @atlaskit/media-store@3.0.1

## 18.1.0

- [minor] media-picker: <All but popup picker>.emitUploadEnd second argument shape has changed from MediaFileData to FileDetails; `upload-end` event payload body shape changed from MediaFileData to FileDetails; All the media pickers config now have new property `useNewUploadService: boolean` (false by default); popup media-picker .cancel can't be called with no argument, though types does allow for it; `File` is removed; --- media-store: MediaStore.createFile now has a required argument of type MediaStoreCreateFileParams; MediaStore.copyFileWithToken new method; uploadFile method result type has changed from just a promise to a UploadFileResult type; --- media-test-helpers: mediaPickerAuthProvider argument has changed from a component instance to just a boolean authEnvironment; [84f6f91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84f6f91)
- [minor] SUMMARY GOES HERE [9041d71](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9041d71)
- [patch] Updated dependencies [84f6f91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84f6f91)
  - @atlaskit/media-store@3.0.0
- [minor] Updated dependencies [9041d71](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9041d71)
  - @atlaskit/media-store@3.0.0

## 18.0.3

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/media-store@2.1.1
  - @atlaskit/button@7.2.5
  - @atlaskit/docs@3.0.4

## 18.0.2

- [patch] Turn side effects to true due to rxjs operators imports [668f01c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/668f01c)

## 18.0.0

- [major] FileDetails' `id` property is now mandatory\nAuth interfaces moves from media-core to media-store, though still exported from media-core\nNew Interfaces (UploadableFile, UploadFileCallbacks) are exported from media-store\nMediaStore calls fixed with collection supplied during auth-provider call [d7b5021](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7b5021)

## 17.0.0

- [major] MediaCollectionProvider now emits errors as next values in observable() [f22e2a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f22e2a0)

## 16.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 15.3.0

- [minor] use local preview in MediaCard when available [b33788b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b33788b)

## 15.2.0

- [minor] MSW-531: add cancelable methods to blobService [7f84f67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f84f67)

## 15.1.0

- [minor] Release first version of image viewer for Media Viewer Next Generation [dd1893a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd1893a)

## 15.0.1

- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)

## 15.0.0

- [major] icons are now assignable to card actions, which will cause media cards to render upto 2 icon buttons, or a dropdown menu if more than 2 actions are set [649871c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/649871c)

## 14.1.1

- [patch] fix(media-test-helpers): configure fetch to send credentials and point calls to correct endpoint [8978f4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8978f4e)

## 14.1.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 14.0.1

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 14.0.0

- [major] Move media provider and state manager to editor-core [0601da7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0601da7)

## 13.0.0

- [major] change thumbnail interface according to new MediaPicker one [5c889c4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5c889c4)

## 12.1.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 12.0.3

- [patch] Use media-test-helpers instead of hardcoded values [f2b92f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f2b92f8)

## 12.0.0

- [major] Show static images for gifs in small cards [e2508f9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e2508f9)

* breaking; Api for DataUriService has changed
* before:
* ```typescript
  ```

* interface fetchImageDataUri(
  mediaItem: MediaItem,
  width: number,
  height: number,
  mode?: ImageResizeMode,
  allowAnimated?: boolean): Promise<DataUri>;
* ```

  ```

* after:
* ```typescript
  ```

* interface FetchImageOptions {
* width: number;
* height: number;
* mode?: ImageResizeMode;
* allowAnimated?: boolean;
* ```}

  ```

* interface fetchImageDataUri(
  mediaItem: MediaItem,
  options: FetchImageOptions,
* ): Promise<DataUri>;
* ```

  ```

## 11.0.1

- [patch] Move media-core to mk2 biuld repo [379a8ad](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/379a8ad)

## 11.0.0 (2017-11-14)

- breaking; updated the interface of MediaState to reflect the changes on mediapicker ([cbee946](https://bitbucket.org/atlassian/atlaskit/commits/cbee946))
- breaking; updated the interface of MediaState to reflect the changes on mediapicker ([cbee946](https://bitbucket.org/atlassian/atlaskit/commits/cbee946))

## 10.2.0 (2017-10-10)

- feature; updated contextConfig to include userAuthProvider. ([3cfb5d0](https://bitbucket.org/atlassian/atlaskit/commits/3cfb5d0))
- feature; updated contextConfig to include userAuthProvider. ([03f200e](https://bitbucket.org/atlassian/atlaskit/commits/03f200e))

## 10.1.0 (2017-09-12)

- feature; support asap issuer in media-core context ([eff2b56](https://bitbucket.org/atlassian/atlaskit/commits/eff2b56))
- breaking;
- ContextConfig type has changed. `clientId` and `tokenProvider` are replaced with
- single `authProvider`. It's a function that takes `AuthContext` (currently object with `collectionName` key),
- and returns a `Promise` that resolved with `Auth` object. `Auth` object can have either `clientId` + `token`
- keys or `asapIssuer` + `token`. This also changed `MediaApiConfig`
- (type of an object returned from `context.apiConfig()`) - `tokenProvider` was replaces with `authProvider`.
- See `USAGE.md` for more details.
- breaking;
- Constructor arguments of `DataUriService` has changed. `clientId` and `tokenProvider` replaced with `authProvider`.
- breaking;
- `FileProvider.fromMediaApi` doesnt take `clientId` as 4th argument.<br/>
- `FileProvider.fromFileService` doesnt take `clientId` as 3rd argument.<br/>
- `LinkProvider.fromMediaApi` doesnt take `clientId` as 3rd argument.<br/>
- `LinkProvider.fromLinkService` doesnt take `clientId` as 3rd argument.<br/>
- `MediaItemProvider.fromMediaApi` doesnt take `clientId` as 5th argument.<br/>
- `MediaItemProvider.fromPool` doesnt take `clientId` as 6th argument.<br/>
- `MediaUrlPreviewProvider.fromMediaApi` doesnt take `clientId` as 3rd argument.<br/>
- `MediaUrlPreviewProvider.fromPool` doesnt take `clientId` as 4th argument.<br/>
- `RemoteMediaCollectionProvider.fromMediaAPI` doesnt take `clientId` as 3rd argument.<br/>
- `RemoteMediaCollectionProvider.fromPool` doesnt take `clientId` as 4th argument.<br/>
- `UrlPreviewProvider.fromMediaAPI` doesnt take `clientId` as 3rd argument.<br/>
- `UrlPreviewProvider.fromUrlPreviewService` doesnt take `clientId` as 3rd argument.<br/>

## 9.0.0 (2017-08-07)

- breaking; removed trello types ([ce181b4](https://bitbucket.org/atlassian/atlaskit/commits/ce181b4))
- breaking; remove trello app types and update to adhere to latest api signatures ([ce181b4](https://bitbucket.org/atlassian/atlaskit/commits/ce181b4))

## 8.4.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 8.4.0 (2017-07-19)

- feature; add support for smart-card links from the API ([ff95bc6](https://bitbucket.org/atlassian/atlaskit/commits/ff95bc6))

## 8.3.0 (2017-07-18)

- feature; added smart card payload ([3f1691e](https://bitbucket.org/atlassian/atlaskit/commits/3f1691e))

## 8.2.0 (2017-06-28)

- fix; use full-fit mode instead of crop for /image endpoint ([4de7d32](https://bitbucket.org/atlassian/atlaskit/commits/4de7d32))
- feature; allow to pass imageResizeMode to fetchImageDataUri ([379aade](https://bitbucket.org/atlassian/atlaskit/commits/379aade))

## 8.1.0 (2017-06-06)

- feature; allow createRequest method to prevent preflight requests ([3f50ebc](https://bitbucket.org/atlassian/atlaskit/commits/3f50ebc))
- feature; prevent preflight requests in CollectionService & LinkService ([25d87da](https://bitbucket.org/atlassian/atlaskit/commits/25d87da))

## 8.0.1 (2017-05-29)

- fix; export media state status from media-core ([fb8dcb5](https://bitbucket.org/atlassian/atlaskit/commits/fb8dcb5))

## 7.0.0 (2017-05-18)

- feature; changed CollectionProvider and its pooling behaviour ([ce4679c](https://bitbucket.org/atlassian/atlaskit/commits/ce4679c))
- breaking; changed CollectionProvider and its pooling behaviour
- ISSUES CLOSED: FIL-4226

## 6.1.1 (2017-05-11)

- fix; preventing unsubscribe from modifying array iterator, preventing 'unfinalized' statu ([26e42b8](https://bitbucket.org/atlassian/atlaskit/commits/26e42b8))

## 6.0.2 (2017-05-03)

- fix; add missing signature on interface ([009fe3a](https://bitbucket.org/atlassian/atlaskit/commits/009fe3a))
- fix; move editor-relate media components into media-core (defaultMediaProvider, mediaStat ([c85be66](https://bitbucket.org/atlassian/atlaskit/commits/c85be66))
- fix; use common mediaProvider for both renderer and editor-core ([7ed6650](https://bitbucket.org/atlassian/atlaskit/commits/7ed6650))
- feature; add Webp support to requests ([1239b33](https://bitbucket.org/atlassian/atlaskit/commits/1239b33))

## 6.0.0 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 5.5.2 (2017-04-27)

- fix; added a refresh() method on the collection controller" ([17c6b1f](https://bitbucket.org/atlassian/atlaskit/commits/17c6b1f))
- feature; added a refresh() method on the collection controller ([866c778](https://bitbucket.org/atlassian/atlaskit/commits/866c778))
- breaking; The complete callback is no longer called on the CollectionProvider

## 5.5.0 (2017-04-26)

- feature; added a refresh() method on the collection controller ([87b008b](https://bitbucket.org/atlassian/atlaskit/commits/87b008b))

## 5.4.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))
- fix; updated media packages key words and maintainers ([01bcbc5](https://bitbucket.org/atlassian/atlaskit/commits/01bcbc5))

## 5.4.0 (2017-04-18)

- fix; call function isIE() ([85a5f07](https://bitbucket.org/atlassian/atlaskit/commits/85a5f07))
- fix; call utility function ([0a7f1c1](https://bitbucket.org/atlassian/atlaskit/commits/0a7f1c1))
- fix; fix tests to run in IE ([62b4e00](https://bitbucket.org/atlassian/atlaskit/commits/62b4e00))
- feature; add utility function to detect if we need to specify crossorigin property for img e ([5536b7a](https://bitbucket.org/atlassian/atlaskit/commits/5536b7a))

## 5.3.0 (2017-04-10)

- feature; expose media collection provider interface ([9071b45](https://bitbucket.org/atlassian/atlaskit/commits/9071b45))

## 5.2.1 (2017-04-07)

- fix; fix unhandled promise error and broken test (which isn't actually failing) ([b213f0c](https://bitbucket.org/atlassian/atlaskit/commits/b213f0c))

## 5.2.0 (2017-04-06)

- fix; change nextInclusiveStartKey on RemoteCollectionItemsResponse to be optional ([8ee8039](https://bitbucket.org/atlassian/atlaskit/commits/8ee8039))
- feature; collection controller can load next page until given predicate ([1424c57](https://bitbucket.org/atlassian/atlaskit/commits/1424c57))

## 5.1.0 (2017-04-04)

- feature; export DataUriService ([1cd019c](https://bitbucket.org/atlassian/atlaskit/commits/1cd019c))

## 5.0.3 (2017-03-31)

- fix; make addLinkItem method send metadata properly ([21a0cc1](https://bitbucket.org/atlassian/atlaskit/commits/21a0cc1))
- fix; return an error when the URLPreview endpoint returns an error with a successful stat ([a85b1c0](https://bitbucket.org/atlassian/atlaskit/commits/a85b1c0))

## 5.0.1 (2017-03-29)

- fix; repush stories for broken releases ([9032923](https://bitbucket.org/atlassian/atlaskit/commits/9032923))

## 4.0.0 (2017-03-28)

- fix; bump media packages and fix ts errors ([dcc463d](https://bitbucket.org/atlassian/atlaskit/commits/dcc463d))
- fix; pass missing collectionName to createRequest ([5ea22d8](https://bitbucket.org/atlassian/atlaskit/commits/5ea22d8))
- feature; modified Context.getMediaItemProvider to use a MediaItem if provided ([a6128cd](https://bitbucket.org/atlassian/atlaskit/commits/a6128cd))
- breaking; Changed the CollectionService response to be similar to an array of MediaItems. Typed processingStatus.
- ISSUES CLOSED: FIL-3542

## 2.0.0 (2017-03-25)

- expose config on context ([256fde2](https://bitbucket.org/atlassian/atlaskit/commits/256fde2))
- feature; add collection action and event handler ([d6a07a3](https://bitbucket.org/atlassian/atlaskit/commits/d6a07a3))
- feature; add details support in collections service ([477ee0f](https://bitbucket.org/atlassian/atlaskit/commits/477ee0f))
- feature; add occurrence key to media collection item ([3705deb](https://bitbucket.org/atlassian/atlaskit/commits/3705deb))
- breaking; Context API changed
- breaking; MediaCollectionItem API changed
- breaking; CollectionService API changed

## 1.99.1 (2017-03-24)

- fix; refactor media-core services to use a common method for doing XHR ([80a3576](https://bitbucket.org/atlassian/atlaskit/commits/80a3576))

## 1.3.0 (2017-03-23)

- fix; fixing the build ([ba21a9d](https://bitbucket.org/atlassian/atlaskit/commits/ba21a9d))
- feature; added 'super' card component ([559579f](https://bitbucket.org/atlassian/atlaskit/commits/559579f))
- breaking; Card API, LinkCard API, FileCard API
- ISSUES CLOSED: FIL-3919
- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))
- feature; media core changes as part of shipit ([d13526e](https://bitbucket.org/atlassian/atlaskit/commits/d13526e))
- feature; added application links to media-card and restructured ([618650e](https://bitbucket.org/atlassian/atlaskit/commits/618650e))
- fix; add addLinkItem interface member to context ([b548257](https://bitbucket.org/atlassian/atlaskit/commits/b548257))
- feature; updated linkCard to take either a stored link or url ([704f16d](https://bitbucket.org/atlassian/atlaskit/commits/704f16d))
- fix; fix TS issues with media-card ([6fd3f27](https://bitbucket.org/atlassian/atlaskit/commits/6fd3f27))
- feature; add method 'addLinkItem' to the link service ([0b0d9d3](https://bitbucket.org/atlassian/atlaskit/commits/0b0d9d3))

## 1.2.2 (2017-03-06)

- fix; fix processing status (fixes card file caching) ([668780e](https://bitbucket.org/atlassian/atlaskit/commits/668780e))
- feature; migrate FilmStrip component + create media-test-helpers ([8896543](https://bitbucket.org/atlassian/atlaskit/commits/8896543))
- feature; move MediaKit into Atlaskit ([98de4f3](https://bitbucket.org/atlassian/atlaskit/commits/98de4f3))

## 1.2.1 (2017-03-06)

- fix; declare axios as dependency ([609768c](https://bitbucket.org/atlassian/atlaskit/commits/609768c))

## 1.2.0 (2017-03-02)

- fix; moved lru-fast to dependencies ([85f7f8f](https://bitbucket.org/atlassian/atlaskit/commits/85f7f8f))
- fix; specified lru-fast as a dependency within media-core instead of devDependency ([c505959](https://bitbucket.org/atlassian/atlaskit/commits/c505959))
- feature; migrated card from mediakit repo to atlaskit ([438a050](https://bitbucket.org/atlassian/atlaskit/commits/438a050))

## 1.1.0 (2017-02-27)

- empty commit to make components release themselves ([5511fbe](https://bitbucket.org/atlassian/atlaskit/commits/5511fbe))
- feature; move providers, services, and context to Atlaskit ([31ca242](https://bitbucket.org/atlassian/atlaskit/commits/31ca242))

## 1.0.0 (2017-02-12)

- feature; commits ([7f474ea](https://bitbucket.org/atlassian/atlaskit/commits/7f474ea))
- feature; add media-core models ([63f2d78](https://bitbucket.org/atlassian/atlaskit/commits/63f2d78))
