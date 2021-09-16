# @atlaskit/media-test-helpers

## 28.8.0

### Minor Changes

- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - Make `fakeIntl`'s `defaultMessage` member to be a `jest.fn` with default behvaiour returning provided `{defaultMessage}` argument with `fakeIntl[]` wrapping

### Patch Changes

- Updated dependencies

## 28.7.5

### Patch Changes

- [`4777a174e6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4777a174e6d) - Added analytics support for customMediaPlayer + screen event + entrypoint for locales
- Updated dependencies

## 28.7.4

### Patch Changes

- [`254c7ae04bc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/254c7ae04bc) - Refactor CardView in Media Card to group UI elements by status
- Updated dependencies

## 28.7.3

### Patch Changes

- [`6810728cd53`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6810728cd53) - Ehance test for new auth provider in media-image to prevent re-subscription
- Updated dependencies

## 28.7.2

### Patch Changes

- [`6be6879ef6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6be6879ef6d) - Added Media Feature Flags control in examples
- Updated dependencies

## 28.7.1

### Patch Changes

- [`f0ee7740f45`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f0ee7740f45) - fix fakeMediaClient
- Updated dependencies

## 28.7.0

### Minor Changes

- [`bfd2f542849`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bfd2f542849) - Add JestSpy and JestFunction members

### Patch Changes

- [`a8c69bc44f9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a8c69bc44f9) - Added missing mock function in fake Media Client implementation
- [`abc38bc9990`](https://bitbucket.org/atlassian/atlassian-frontend/commits/abc38bc9990) - Added request metadata to failed frontend SLIs
- Updated dependencies

## 28.6.0

### Minor Changes

- [`37d4add135f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37d4add135f) - Provide Media Client Error creators

### Patch Changes

- Updated dependencies

## 28.5.2

### Patch Changes

- [`a4e37d0df4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4e37d0df4) - Fix EDM-1636 again
- Updated dependencies

## 28.5.1

### Patch Changes

- Updated dependencies

## 28.5.0

### Minor Changes

- [`fa5ef18162`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa5ef18162) - Fixed media client's DataLoader error handling
- [`dfd440f4b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfd440f4b5) - [ux] New functionality to add and remove captions to images and videos. Select an image or video in the editor to start using it!
  editor-core now exports dedupe which aids in not having duplicate plugins added when initialising an editor

### Patch Changes

- [`4c6c92aee6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c6c92aee6) - Fix rendering of captions
- Updated dependencies

## 28.4.1

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 28.4.0

### Minor Changes

- [`d6f279ecaa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f279ecaa) - Add support for video files in MediaMock

### Patch Changes

- Updated dependencies

## 28.3.1

### Patch Changes

- Updated dependencies

## 28.3.0

### Minor Changes

- [`52b1353be9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/52b1353be9) - BMT-611 Added integration test for Giphy cloud files
- [`73613210d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73613210d4) - Adding support for Code and Email files so that they are now able to be previewed in the viewer.

### Patch Changes

- Updated dependencies

## 28.2.2

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 28.2.1

### Patch Changes

- [`b4cf0f9326`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4cf0f9326) - ED-10439 - Modify loadImageMockSetup to ensure media-ui mock is not hoisted

## 28.2.0

### Minor Changes

- [`821e8edaf8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/821e8edaf8) - Make MediaMock ApiRouter more realistic + replace tall image testing
- [`9c50fe8fd0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9c50fe8fd0) - Adding Browser integration tests that simulate a using dragging and dropping a folder
- [`7d831363d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d831363d9) - Migrated to declarative entry points

### Patch Changes

- Updated dependencies

## 28.1.4

### Patch Changes

- Updated dependencies

## 28.1.3

### Patch Changes

- Updated dependencies

## 28.1.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 28.1.1

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 28.1.0

### Minor Changes

- [`62eb1114c4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62eb1114c4) - Enable passing of MediaFeatureFlags through Editor Renderer via MediaOptions to Media components
- [`155125a472`](https://bitbucket.org/atlassian/atlassian-frontend/commits/155125a472) - Add flushPromise
- [`5d20188710`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d20188710) - Added all supported languages to I18NWrapper
- [`8cfc88423a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cfc88423a) - Added more zip examples and added error handling for zip previews
- [`2202870181`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2202870181) - Added support for zip previews in media viewer
- [`b8695823e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8695823e3) - Fixed Giphy images display as plain text when inserted into Editor

### Patch Changes

- [`3a188fc905`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a188fc905) - Fixed error when using empty mimeType in media examples
- [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the 'lodash' package instead of single-function 'lodash.\*' packages
- [`0c1bb3fa88`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c1bb3fa88) - Fixed mocked response for "/file/copy/withToken" in MediaMock. Added isMediaCollectionItemFullDetails() to media-client.
- [`fa6fb5dfbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa6fb5dfbb) - Removing unused code to be published
- [`7af030b047`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7af030b047) - Added example for broken external file Id
- Updated dependencies

## 28.0.1

### Patch Changes

- [`50d947cdae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50d947cdae) - Added Media Card New Experience behind a feature flag

## 28.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 27.2.3

### Patch Changes

- Updated dependencies

## 27.2.2

### Patch Changes

- [`eac08411a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eac08411a3) - Updated react-redux dependency to 5.1.0

## 27.2.1

### Patch Changes

- [`a2ffde361d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2ffde361d) - MPT-131: fetch remote preview for files not supported by the browser
- [`054e719497`](https://bitbucket.org/atlassian/atlassian-frontend/commits/054e719497) - Replace deprecated Media URLs with latest
- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove unused dependencies
- Updated dependencies

## 27.2.0

### Minor Changes

- [minor][7e363d5aba](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e363d5aba):

  Adding uploadFromDrag function in MediaMockControlsBackdoor

### Patch Changes

- [patch][6a6a991904](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a6a991904):

  Refactoring uploadImageFromDrag- [patch][84f82f7015](https://bitbucket.org/atlassian/atlassian-frontend/commits/84f82f7015):

  Change media-mock /file/copy/withToken to be more similar to real implementation- [patch][b2402fc3a2](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2402fc3a2):

  Change api-router logging- Updated dependencies [f459d99f15](https://bitbucket.org/atlassian/atlassian-frontend/commits/f459d99f15):

- Updated dependencies [17cc5dde5d](https://bitbucket.org/atlassian/atlassian-frontend/commits/17cc5dde5d):
- Updated dependencies [3aedaac8c7](https://bitbucket.org/atlassian/atlassian-frontend/commits/3aedaac8c7):
- Updated dependencies [f061ed6c98](https://bitbucket.org/atlassian/atlassian-frontend/commits/f061ed6c98):
- Updated dependencies [49dbcfa64c](https://bitbucket.org/atlassian/atlassian-frontend/commits/49dbcfa64c):
- Updated dependencies [e9d555132d](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9d555132d):
- Updated dependencies [5f8e3caf72](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f8e3caf72):
- Updated dependencies [d7b07a9ca4](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7b07a9ca4):
- Updated dependencies [318a1a0f2f](https://bitbucket.org/atlassian/atlassian-frontend/commits/318a1a0f2f):
- Updated dependencies [fd4b237ffe](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd4b237ffe):
- Updated dependencies [9691bb8eb9](https://bitbucket.org/atlassian/atlassian-frontend/commits/9691bb8eb9):
- Updated dependencies [11ff95c0f0](https://bitbucket.org/atlassian/atlassian-frontend/commits/11ff95c0f0):
- Updated dependencies [fb2b3c8a3b](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb2b3c8a3b):
- Updated dependencies [692692ba24](https://bitbucket.org/atlassian/atlassian-frontend/commits/692692ba24):
- Updated dependencies [5550919b98](https://bitbucket.org/atlassian/atlassian-frontend/commits/5550919b98):
- Updated dependencies [b5f17f0751](https://bitbucket.org/atlassian/atlassian-frontend/commits/b5f17f0751):
- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies [e5c869ee31](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5c869ee31):
- Updated dependencies [69b678b38c](https://bitbucket.org/atlassian/atlassian-frontend/commits/69b678b38c):
- Updated dependencies [e9044fbfa6](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9044fbfa6):
- Updated dependencies [fd782b0705](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd782b0705):
- Updated dependencies [050781f257](https://bitbucket.org/atlassian/atlassian-frontend/commits/050781f257):
- Updated dependencies [4635f8107b](https://bitbucket.org/atlassian/atlassian-frontend/commits/4635f8107b):
- Updated dependencies [d80b8e8fdb](https://bitbucket.org/atlassian/atlassian-frontend/commits/d80b8e8fdb):
- Updated dependencies [d38212e1be](https://bitbucket.org/atlassian/atlassian-frontend/commits/d38212e1be):
- Updated dependencies [ba8c2c4129](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba8c2c4129):
- Updated dependencies [d3547279dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3547279dd):
- Updated dependencies [67bc25bc3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/67bc25bc3f):
- Updated dependencies [4aca202534](https://bitbucket.org/atlassian/atlassian-frontend/commits/4aca202534):
- Updated dependencies [48fb5a1b6b](https://bitbucket.org/atlassian/atlassian-frontend/commits/48fb5a1b6b):
- Updated dependencies [f3587bae11](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3587bae11):
- Updated dependencies [8c8f0099d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c8f0099d8):
- Updated dependencies [c28ff17fbd](https://bitbucket.org/atlassian/atlassian-frontend/commits/c28ff17fbd):
  - @atlaskit/media-ui@12.1.0
  - @atlaskit/media-client@6.1.0
  - @atlaskit/media-picker@54.1.0
  - @atlaskit/media-card@67.2.0

## 27.1.0

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
  In order to avoid that, and being able to use Stargate, you need to set Media option `useMediaPickerPopup` to true.- [minor][3cbc8a49a2](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cbc8a49a2):

  Adding awaitUpload helper function

### Patch Changes

- [patch][d49ebd7c7a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d49ebd7c7a):

  remove export \* from media-test-helpers- Updated dependencies [81684c1847](https://bitbucket.org/atlassian/atlassian-frontend/commits/81684c1847):

- Updated dependencies [eb962d2c36](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb962d2c36):
- Updated dependencies [9d2da865dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d2da865dd):
- Updated dependencies [f83b67a761](https://bitbucket.org/atlassian/atlassian-frontend/commits/f83b67a761):
- Updated dependencies [70b68943d1](https://bitbucket.org/atlassian/atlassian-frontend/commits/70b68943d1):
- Updated dependencies [9a93eff8e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a93eff8e6):
- Updated dependencies [13a0e50f38](https://bitbucket.org/atlassian/atlassian-frontend/commits/13a0e50f38):
- Updated dependencies [6dcad31e41](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dcad31e41):
  - @atlaskit/media-picker@54.0.0
  - @atlaskit/media-client@6.0.0
  - @atlaskit/media-card@67.1.1
  - @atlaskit/media-ui@12.0.1
  - @atlaskit/media-core@31.1.0

## 27.0.0

### Major Changes

- [major][8b34c7371d](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b34c7371d):

  MediaPickerPageObject methods API has changed.

### Minor Changes

- [minor][41a2496393](https://bitbucket.org/atlassian/atlassian-frontend/commits/41a2496393):

  New API is introduced:
  _ `isMediaMockOptedIn` - you can use this in `examples` to check if user wants to use mocked media backend
  _ `mediaMockQueryOptInFlag` - add this flag to query string to opt-in to mocked media backend- [minor][bbf5eb8824](https://bitbucket.org/atlassian/atlassian-frontend/commits/bbf5eb8824):

  Add asMockFunction utility- [minor][6b06a7baa9](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b06a7baa9):

  Introduce a way to fail specific urls in media mock server via backdoor

### Patch Changes

- [patch][196500df34](https://bitbucket.org/atlassian/atlassian-frontend/commits/196500df34):

  move MockGlobalImage to media-test-helpers for reuse- [patch][d7ed7b1513](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7ed7b1513):

  Remove export \* from media components- Updated dependencies [b408e050ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/b408e050ab):

- Updated dependencies [dda84ee26d](https://bitbucket.org/atlassian/atlassian-frontend/commits/dda84ee26d):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [fe9d471b88](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe9d471b88):
- Updated dependencies [08935ea653](https://bitbucket.org/atlassian/atlassian-frontend/commits/08935ea653):
- Updated dependencies [196500df34](https://bitbucket.org/atlassian/atlassian-frontend/commits/196500df34):
- Updated dependencies [77474b6821](https://bitbucket.org/atlassian/atlassian-frontend/commits/77474b6821):
- Updated dependencies [be57ca3829](https://bitbucket.org/atlassian/atlassian-frontend/commits/be57ca3829):
- Updated dependencies [d7ed7b1513](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7ed7b1513):
- Updated dependencies [39ee28797d](https://bitbucket.org/atlassian/atlassian-frontend/commits/39ee28797d):
- Updated dependencies [bb06388705](https://bitbucket.org/atlassian/atlassian-frontend/commits/bb06388705):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [832fd6f4f7](https://bitbucket.org/atlassian/atlassian-frontend/commits/832fd6f4f7):
- Updated dependencies [695e1c1c31](https://bitbucket.org/atlassian/atlassian-frontend/commits/695e1c1c31):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
  - @atlaskit/media-client@5.0.2
  - @atlaskit/media-picker@53.0.0
  - @atlaskit/media-ui@12.0.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/media-card@67.1.0
  - @atlaskit/media-core@31.0.5
  - @atlaskit/dropdown-menu@9.0.2
  - @atlaskit/select@11.0.9

## 26.1.2

### Patch Changes

- Updated dependencies [8c7f68d911](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c7f68d911):
- Updated dependencies [f709e92247](https://bitbucket.org/atlassian/atlassian-frontend/commits/f709e92247):
- Updated dependencies [0e562f2a4a](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e562f2a4a):
- Updated dependencies [9e87af4685](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e87af4685):
- Updated dependencies [eeaa647c31](https://bitbucket.org/atlassian/atlassian-frontend/commits/eeaa647c31):
- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
  - @atlaskit/media-ui@11.9.0
  - @atlaskit/dropdown-menu@9.0.0
  - @atlaskit/media-card@67.0.4
  - @atlaskit/icon@20.0.2
  - @atlaskit/media-picker@52.0.3

## 26.1.1

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/dropdown-menu@8.2.4
  - @atlaskit/icon@20.0.1
  - @atlaskit/select@11.0.7
  - @atlaskit/media-card@67.0.3
  - @atlaskit/media-client@5.0.1
  - @atlaskit/media-core@31.0.4
  - @atlaskit/media-picker@52.0.2
  - @atlaskit/media-ui@11.8.3

## 26.1.0

### Minor Changes

- [minor][fe4eaf06fc](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe4eaf06fc):

  export testMediaGroupFileId and fakeImage

### Patch Changes

- Updated dependencies [16b4549bdd](https://bitbucket.org/atlassian/atlassian-frontend/commits/16b4549bdd):
- Updated dependencies [28edbccc0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/28edbccc0a):
- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies [555818c33a](https://bitbucket.org/atlassian/atlassian-frontend/commits/555818c33a):
  - @atlaskit/media-picker@52.0.1
  - @atlaskit/icon@20.0.0
  - @atlaskit/media-ui@11.8.2
  - @atlaskit/dropdown-menu@8.2.3
  - @atlaskit/media-card@67.0.2
  - @atlaskit/select@11.0.6

## 26.0.0

### Major Changes

- [major][6ee177aeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ee177aeb4):

  Stream caches in media-client now use ReplaySubjects instead of Observables.
  For the most part, this is just the interface that's being updated, as under the hood ReplaySubject was already getting used. ReplaySubjects better suit our use case because they track 1 version of history of the file state.
  As a consumer, there shouldn't be any necessary code changes. ReplaySubjects extend Observable, so the current usage should continue to work.

### Patch Changes

- [patch][966622bd45](https://bitbucket.org/atlassian/atlassian-frontend/commits/966622bd45):

  Stop (large) document load on modal close- Updated dependencies [5504a7da8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/5504a7da8c):

- Updated dependencies [4794f8d527](https://bitbucket.org/atlassian/atlassian-frontend/commits/4794f8d527):
- Updated dependencies [6ee177aeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ee177aeb4):
  - @atlaskit/media-card@67.0.1
  - @atlaskit/media-picker@52.0.0
  - @atlaskit/media-client@5.0.0
  - @atlaskit/media-core@31.0.3
  - @atlaskit/media-ui@11.8.1

## 25.2.7

### Patch Changes

- Updated dependencies [90e2c5dd0c](https://bitbucket.org/atlassian/atlassian-frontend/commits/90e2c5dd0c):
- Updated dependencies [8c7f8fcf92](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c7f8fcf92):
- Updated dependencies [6e55ab88df](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e55ab88df):
- Updated dependencies [d60a382185](https://bitbucket.org/atlassian/atlassian-frontend/commits/d60a382185):
- Updated dependencies [a47d750b5d](https://bitbucket.org/atlassian/atlassian-frontend/commits/a47d750b5d):
- Updated dependencies [8d2685f45c](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d2685f45c):
- Updated dependencies [eb50389200](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb50389200):
  - @atlaskit/media-picker@51.0.0
  - @atlaskit/media-client@4.3.0
  - @atlaskit/select@11.0.5

## 25.2.6

### Patch Changes

- Updated dependencies [28f8f0e089](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f8f0e089):
- Updated dependencies [486a5aec29](https://bitbucket.org/atlassian/atlassian-frontend/commits/486a5aec29):
- Updated dependencies [03c917044e](https://bitbucket.org/atlassian/atlassian-frontend/commits/03c917044e):
- Updated dependencies [d3f4c97f6a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3f4c97f6a):
- Updated dependencies [149560f012](https://bitbucket.org/atlassian/atlassian-frontend/commits/149560f012):
- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/icon@19.1.0
  - @atlaskit/media-card@67.0.0
  - @atlaskit/media-ui@11.8.0
  - @atlaskit/select@11.0.4
  - @atlaskit/media-client@4.2.2
  - @atlaskit/media-core@31.0.2
  - @atlaskit/media-picker@50.0.5
  - @atlaskit/dropdown-menu@8.2.2

## 25.2.5

### Patch Changes

- [patch][3a20e9a596](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a20e9a596):

  Make PopupSelect correctly pass props. Forcing update of @atlaskit/select for all other packages- Updated dependencies [3a20e9a596](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a20e9a596):

  - @atlaskit/select@11.0.2

## 25.2.4

### Patch Changes

- [patch][b967e41a6b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b967e41a6b):

  Add empty file example to media-viewer

- Updated dependencies [ae6408e1e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae6408e1e4):
  - @atlaskit/media-picker@50.0.0

## 25.2.3

- Updated dependencies [30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):
  - @atlaskit/select@11.0.0
  - @atlaskit/media-picker@49.0.1

## 25.2.2

- Updated dependencies [24b8ea2667](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24b8ea2667):
  - @atlaskit/media-client@4.0.0
  - @atlaskit/media-picker@49.0.0
  - @atlaskit/media-card@66.0.1
  - @atlaskit/media-core@31.0.0

## 25.2.1

### Patch Changes

- [patch][6ef4ae5768](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ef4ae5768):

  Bump kakapo, to fix Router instantiation: we now use only 'fetch' as strategy.

## 25.2.0

### Minor Changes

- [minor][ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):

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

- [minor][00c11ee352](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/00c11ee352):

  Add `addGlobalEventEmitterListeners` util to be used in examples to see `globalMediaEventEmitter` events in console.

- Updated dependencies [c3e65f1b9e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3e65f1b9e):
- Updated dependencies [e7b5c917de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7b5c917de):
  - @atlaskit/media-client@3.0.0
  - @atlaskit/media-core@30.0.17
  - @atlaskit/media-store@12.0.14
  - @atlaskit/media-card@66.0.0
  - @atlaskit/media-picker@48.0.0

## 25.1.3

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 25.1.2

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 25.1.1

- Updated dependencies [af72468517](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af72468517):
  - @atlaskit/media-client@2.1.2
  - @atlaskit/media-core@30.0.14
  - @atlaskit/media-picker@47.1.2
  - @atlaskit/media-store@12.0.12
  - @atlaskit/media-card@65.0.0

## 25.1.0

### Minor Changes

- [minor][e5c3f6ae3e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e5c3f6ae3e):

  ED-6216: External images will now be uploaded to media services if possible

## 25.0.4

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 25.0.3

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 25.0.2

- Updated dependencies [3624730f44](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3624730f44):
  - @atlaskit/media-client@2.0.2
  - @atlaskit/media-core@30.0.11
  - @atlaskit/media-picker@47.0.2
  - @atlaskit/media-store@12.0.9
  - @atlaskit/media-card@64.0.0

## 25.0.1

- Updated dependencies [6879d7d01e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6879d7d01e):
  - @atlaskit/media-picker@47.0.0

## 25.0.0

### Major Changes

- [major][69586b5353](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69586b5353):

  Remove following API members: `fakeContext()`, `getDefaultContextConfig()`, `createStorybookContext()`, `createUploadContext()`. You can use new methods introduced earlier: `fakeMediaClientConfig()`, `getDefaultMediaClientConfig()`, etc

## 24.3.5

- Updated dependencies [ee804f3eeb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee804f3eeb):
  - @atlaskit/media-card@63.3.9
  - @atlaskit/media-core@30.0.9
  - @atlaskit/media-picker@46.0.3
  - @atlaskit/media-store@12.0.6
  - @atlaskit/media-client@2.0.0

## 24.3.4

### Patch Changes

- [patch][4e8f6f609f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e8f6f609f):

  Remove three fields from MediaFile interface: upfrontId, userUpfrontId and userOccurrenceKey.

## 24.3.3

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

  bugfix, fixes missing version.json file

## 24.3.2

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 24.3.1

- Updated dependencies [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
  - @atlaskit/media-picker@45.0.1
  - @atlaskit/select@10.0.0

## 24.3.0

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

## 24.2.0

### Minor Changes

- [minor][a552f93596](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a552f93596):

  Increase image preview max height and width to 4096px

## 24.1.3

- Updated dependencies [e754b5f85e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e754b5f85e):
  - @atlaskit/media-picker@45.0.0

## 24.1.2

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/dropdown-menu@8.0.8
  - @atlaskit/select@9.1.8
  - @atlaskit/media-card@63.3.1
  - @atlaskit/media-picker@44.0.1
  - @atlaskit/media-ui@11.4.1
  - @atlaskit/icon@19.0.0

## 24.1.1

- Updated dependencies [5f4afa52a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f4afa52a9):
  - @atlaskit/media-picker@44.0.0

## 24.1.0

### Minor Changes

- [minor][10c2856bc0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10c2856bc0):

  include defaultMediaPickerCollectionName into collectionNames array to get auth from playgrond

## 24.0.3

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/dropdown-menu@8.0.4
  - @atlaskit/select@9.1.5
  - @atlaskit/media-card@63.1.5
  - @atlaskit/media-picker@43.1.1
  - @atlaskit/media-ui@11.2.8
  - @atlaskit/icon@18.0.0

## 24.0.2

### Patch Changes

- [patch][0f47d97c78](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f47d97c78):

  - fix getDefaultMediaClientConfig

## 24.0.1

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 24.0.0

- [major][9ecfef12ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ecfef12ac):

  - `createUserContext` was removed, with no alternatives to replace it. `asMockReturnValue` jest helper function was added to make it possible to be type safe.

## 23.1.1

- Updated dependencies [051800806c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/051800806c):
  - @atlaskit/media-picker@43.0.0

## 23.1.0

- [minor][12aa76d5b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12aa76d5b5):

  - ED-6814: fixed rendering mediaSingle without collection

## 23.0.0

- [major][ed3f034232](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed3f034232):

  - Changes to `MediaMock` signature: `MediaMock` constructor now takes an object where destination collection name is the key and the value is a list of `<MediaFile & {blob: Blob}>` objects that will be loaded directly into a database for the corresponding collections. MediaMock now also exports `generateFilesFromTestData` helper function which simplifies test data generation.

## 22.0.1

- Updated dependencies [59cce82fd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59cce82fd1):
  - @atlaskit/media-picker@42.0.0

## 22.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 21.4.0

- [minor][6f463c4d88](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6f463c4d88):

  - add new methods to fake context

- Updated dependencies [a1192ef860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1192ef860):
  - @atlaskit/media-card@62.0.0
  - @atlaskit/media-picker@40.0.0
  - @atlaskit/media-store@11.1.1
  - @atlaskit/media-core@29.3.0

## 21.3.0

- [minor][5489810e15](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5489810e15):

  - Add support for media-client objects: fakeMediaClient, getDefaultMediaClientConfig, createStorybookMediaClient, createStorybookMediaClientConfig, createUploadMediaClient, createUploadMediaClientConfig, createUserMediaClient

- Updated dependencies [e38d662f7d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e38d662f7d):
- Updated dependencies [e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):
  - @atlaskit/media-client@1.0.0
  - @atlaskit/media-card@61.0.0
  - @atlaskit/media-picker@39.0.0
  - @atlaskit/media-store@11.1.0
  - @atlaskit/media-core@29.2.0

## 21.2.3

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 21.2.2

- Updated dependencies [0ff405bd0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ff405bd0f):
  - @atlaskit/media-core@29.1.2
  - @atlaskit/media-store@11.0.5
  - @atlaskit/media-card@60.0.0
  - @atlaskit/media-picker@38.1.3

## 21.2.1

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 21.2.0

- [minor][e1c1fa454a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e1c1fa454a):

  - Support external image identifier in MediaViewer

## 21.1.0

- [minor][dd14a0a1f0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd14a0a1f0):

  - export getDefaultContextConfig

- Updated dependencies [c2c36de22b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c36de22b):
  - @atlaskit/media-card@59.0.0
  - @atlaskit/media-picker@38.0.0
  - @atlaskit/media-store@11.0.3
  - @atlaskit/media-core@29.1.0

## 21.0.3

- Updated dependencies [9c316bd8aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c316bd8aa):
  - @atlaskit/media-core@29.0.2
  - @atlaskit/media-picker@37.0.3
  - @atlaskit/media-store@11.0.2
  - @atlaskit/media-card@58.0.0

## 21.0.2

- [patch][1d09298688](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d09298688):

  - Remove axios dependency

## 21.0.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 21.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 20.1.8

- Updated dependencies [7ab3e93996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ab3e93996):
  - @atlaskit/media-card@56.0.0
  - @atlaskit/media-picker@36.0.0
  - @atlaskit/media-core@28.0.0
  - @atlaskit/media-store@10.0.0

## 20.1.7

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/icon@16.0.4
  - @atlaskit/media-card@55.0.2
  - @atlaskit/media-core@27.2.3
  - @atlaskit/media-picker@35.0.1
  - @atlaskit/media-store@9.2.1
  - @atlaskit/media-ui@9.2.1
  - @atlaskit/dropdown-menu@7.0.0
  - @atlaskit/select@8.0.0

## 20.1.6

- Updated dependencies [4aee5f3cec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aee5f3cec):
  - @atlaskit/media-card@55.0.0
  - @atlaskit/media-picker@35.0.0
  - @atlaskit/media-core@27.2.0
  - @atlaskit/media-store@9.2.0

## 20.1.5

- Updated dependencies [fc6164c8c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc6164c8c2):
- Updated dependencies [190c4b7bd3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/190c4b7bd3):
  - @atlaskit/media-card@54.0.0
  - @atlaskit/media-picker@34.0.0
  - @atlaskit/media-store@9.1.7
  - @atlaskit/media-core@27.1.0

## 20.1.4

- Updated dependencies [46dfcfbeca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/46dfcfbeca):
  - @atlaskit/media-core@27.0.2
  - @atlaskit/media-picker@33.0.4
  - @atlaskit/media-store@9.1.6
  - @atlaskit/media-card@53.0.0

## 20.1.3

- Updated dependencies [06713e0a0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06713e0a0c):
  - @atlaskit/media-picker@33.0.3
  - @atlaskit/select@7.0.0

## 20.1.2

- Updated dependencies [d5bce1ea15](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5bce1ea15):
  - @atlaskit/media-card@52.0.4
  - @atlaskit/media-picker@33.0.2
  - @atlaskit/media-ui@9.0.0

## 20.1.1

- Updated dependencies [65b73cc466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65b73cc466):
  - @atlaskit/media-picker@33.0.0

## 20.1.0

- [minor][4e82fedc90](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e82fedc90):

  - Expose real id upfront for remote files in MediaPicker

- Updated dependencies [9d881f1eb8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d881f1eb8):
- Updated dependencies [69c8d0c19c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c8d0c19c):
  - @atlaskit/media-picker@32.0.0
  - @atlaskit/media-card@52.0.0
  - @atlaskit/media-store@9.1.5
  - @atlaskit/media-core@27.0.0

## 20.0.1

- [patch][28353efea8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/28353efea8):

  - Fix expected/actual in expectToEqual utility

## 20.0.0

- [major][07a187bb30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07a187bb30):

  - Fetch cloud accounts only on cloud folder opening

## 19.1.1

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/dropdown-menu@6.1.26
  - @atlaskit/select@6.1.19
  - @atlaskit/media-card@51.0.1
  - @atlaskit/media-ui@8.2.5
  - @atlaskit/icon@16.0.0

## 19.1.0

- [minor][b1627a5837](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1627a5837):

  - Enable inline video player in Editor and Renderer

- Updated dependencies [85d5d168fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85d5d168fd):
  - @atlaskit/media-card@51.0.0
  - @atlaskit/media-picker@31.0.0
  - @atlaskit/media-store@9.1.3
  - @atlaskit/media-core@26.2.0

## 19.0.0

- [major][3ad16f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ad16f3):

  - More jest utilities has been added: expectToEqual, expectConstructorToHaveBeenCalledWith and expectFunctionToHaveBeenCalledWith to allow for typed jest assertions. mountWithIntlContext got generics types.

- Updated dependencies [dadef80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dadef80):
  - @atlaskit/media-card@50.0.0
  - @atlaskit/media-picker@30.0.0
  - @atlaskit/media-store@9.1.2
  - @atlaskit/media-core@26.1.0

## 18.10.0

- [minor][e6516fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6516fb):

  - Move media mocks into right location to prevent them to be included in dist

## 18.9.1

- Updated dependencies [cbb8cb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbb8cb5):
  - @atlaskit/media-card@49.0.0
  - @atlaskit/media-store@9.1.1
  - @atlaskit/media-core@26.0.0

## 18.9.0

- [minor][72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):

  - Remove deprecated methods from media-core
  - Use context.collection methods in MediaViewer
  - Remove link support from media-card
  - Remove legacy services + providers from media-core
  - Remove link related methods from media-core
  - Remove axios dependency
  - Make context.getImage cancelable

## 18.8.0

- [minor][6bc785d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6bc785d):

  - default to HD video if available in video viewer

## 18.7.3

- [patch][b677631](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b677631):

  - Add new example and ensure occurrenceKey is set for all copy/withToken calls

## 18.7.2

- Updated dependencies [135ed00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/135ed00):
  - @atlaskit/media-core@24.7.2
  - @atlaskit/media-store@9.0.2
  - @atlaskit/media-card@47.0.0

## 18.7.1

- [patch][ca16fa9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca16fa9):

  - Add SSR support to media components

## 18.7.0

- [minor][5c06476](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5c06476):

  - Add touch endpoint to mock server

- Updated dependencies [b3738ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3738ea):
- Updated dependencies [096f898](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/096f898):
  - @atlaskit/media-card@46.0.0
  - @atlaskit/media-store@9.0.0
  - @atlaskit/media-core@24.7.0

## 18.6.2

- Updated dependencies [80f765b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80f765b):
  - @atlaskit/media-card@45.0.0
  - @atlaskit/media-store@8.5.1
  - @atlaskit/media-core@24.6.0

## 18.6.1

- [patch][f621523](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f621523):

  - fix MediaMocker router

## 18.6.0

- [minor][0f42ec1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f42ec1):

  Use /items endpoint in media-core

## 18.5.2

- Updated dependencies [5de3574](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5de3574):
  - @atlaskit/media-card@44.1.1
  - @atlaskit/media-ui@8.0.0

## 18.5.1

- [patch][0a297ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a297ba):

  - Packages should not be shown in the navigation, search and overview

## 18.5.0

- [minor][c1ea81c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1ea81c):

  - use custom video player for inline video in media-card

## 18.4.0

- [minor][b02ffa7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b02ffa7):

  - add touch event helpers and canvas mocking

## 18.3.2

- [patch][5a6de24](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5a6de24):

  - translate component properties in media components

## 18.3.1

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/dropdown-menu@6.1.23
  - @atlaskit/select@6.1.9
  - @atlaskit/media-card@44.0.2
  - @atlaskit/media-ui@7.6.2
  - @atlaskit/icon@15.0.0

## 18.3.0

- [minor][fa7d4c5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa7d4c5):

  - asMock method was added; It can be used to convert any function into jest.Mock;

- Updated dependencies [7e8b4b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e8b4b9):
  - @atlaskit/media-card@44.0.0
  - @atlaskit/media-core@24.5.0

## 18.2.12

- Updated dependencies [2c21466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c21466):
  - @atlaskit/media-card@43.0.0
  - @atlaskit/media-core@24.4.0
  - @atlaskit/media-store@8.3.0

## 18.2.11

- Updated dependencies [04c7192](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/04c7192):
  - @atlaskit/media-core@24.3.1
  - @atlaskit/media-card@42.0.0

## 18.2.10

- [patch] Updated dependencies [ced32d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ced32d0)
  - @atlaskit/media-card@41.1.2
  - @atlaskit/media-ui@7.0.0

## 18.2.9

- [patch] Cleanup media + editor integration 🔥 [2f9d14d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2f9d14d)

## 18.2.8

- [patch] Split Media + Editor cleanup part 1 [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)

## 18.2.7

- [patch] Updated dependencies [6e510d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e510d8)
  - @atlaskit/media-core@24.2.2
  - @atlaskit/media-card@40.0.0

## 18.2.6

- [patch] Fix bug with download binary [71ebe0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/71ebe0b)

## 18.2.5

- [patch] Updated dependencies [2afa60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2afa60d)
  - @atlaskit/media-card@39.0.0
  - @atlaskit/media-core@24.2.0
  - @atlaskit/media-store@8.1.0

## 18.2.4

- [patch] Add pagination to recents view in MediaPicker [4b3c1f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b3c1f5)

## 18.2.3

- [patch] Deprecate context.uploadFile & context.getFile. Instead context.file.upload & context.file.getFileState should be used; media-store's uploadFile function now takes MediaStore as a second argument, not MediaApiConfig [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [patch] Deprecate context.uploadFile & context.getFile. Instead context.file.upload & context.file.getFileState should be used; media-store's uploadFile function now takes MediaStore as a second argument, not MediaApiConfig [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)

## 18.2.2

- [patch] Updated dependencies [2d848cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d848cd)
  - @atlaskit/media-core@24.0.3
  - @atlaskit/media-store@7.0.0

## 18.2.1

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/dropdown-menu@6.1.17
  - @atlaskit/select@6.0.2
  - @atlaskit/media-card@37.0.1
  - @atlaskit/media-ui@6.0.1
  - @atlaskit/icon@14.0.0

## 18.2.0

- [minor] Add I18n support to media-card [dae7792](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dae7792)

## 18.1.0

- [minor] Support external image identifiers in media-card [82c8bb9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/82c8bb9)

## 18.0.0

- [major] Update RXJS dependency to ^5.5.0 [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)

## 17.1.0

- [minor] expose new context.collection methods [6e1d642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e1d642)

## 17.0.2

- [patch] Update TS to 3.0 [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
- [none] Updated dependencies [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
  - @atlaskit/media-core@23.1.1

## 17.0.1

- [patch] fix media-test-helpers dist [20756c3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/20756c3)

## 17.0.0

- [major] Remove new upload service feature flag (useNewUploadService). Now new upload service will be used by default. [911a570](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/911a570)
- [none] Updated dependencies [911a570](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/911a570)
  - @atlaskit/media-store@6.0.1
  - @atlaskit/media-core@23.0.2

## 16.0.0

- [major] Synchronous property "serviceHost" as part of many Interfaces in media components (like MediaApiConfig) is removed and replaced with asynchronous "baseUrl" as part of Auth object. [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
- [major] Updated dependencies [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
  - @atlaskit/media-store@6.0.0
  - @atlaskit/media-core@23.0.0

## 15.2.1

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/media-core@22.2.1
  - @atlaskit/media-store@5.1.1

## 15.2.0

- [minor] use context.getFile in media-card [fad25ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fad25ec)
- [minor] Updated dependencies [fad25ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fad25ec)
  - @atlaskit/media-store@5.1.0
  - @atlaskit/media-core@22.1.0

## 15.1.0

- [patch] Implemented smart cards and common views for other cards [fa6f865](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa6f865)
- [patch] Implemented smart cards and common UI elements [fdd03d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd03d8)
- [minor] Implement smart card [49c8425](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49c8425)
- [patch] Updated dependencies [fa6f865](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa6f865)
- [patch] Updated dependencies [fdd03d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd03d8)
- [none] Updated dependencies [49c8425](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49c8425)

## 15.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/media-core@22.0.0
  - @atlaskit/media-store@5.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/media-store@5.0.0
  - @atlaskit/media-core@22.0.0

## 14.0.6

- [patch] Use media.tsconfig in MediaViewer [42ee1ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42ee1ea)
- [patch] Updated dependencies [42ee1ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42ee1ea)
  - @atlaskit/media-core@21.0.0

## 14.0.5

- [patch] Replace faker with lightweight internal functions [1c3352a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c3352a)
- [none] Updated dependencies [1c3352a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c3352a)

## 14.0.4

- [patch] Updated dependencies [c57e9c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c57e9c1)
  - @atlaskit/media-store@4.2.0
  - @atlaskit/media-core@20.0.0

## 14.0.3

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/media-store@4.1.1
  - @atlaskit/media-core@19.1.3

## 14.0.2

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/media-core@19.1.2

## 14.0.1

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/media-core@19.1.1

## 14.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/media-store@4.0.0
  - @atlaskit/media-core@19.0.0

## 13.3.1

- [patch] MSW-741 : handle unexpected media types without crashes [0353017](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0353017)
- [none] Updated dependencies [0353017](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0353017)

## 13.3.0

- [minor] Add new item to example items [602c46e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/602c46e)
- [none] Updated dependencies [602c46e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/602c46e)

## 13.2.0

- [minor] add custom video player under feature flag [9041109](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9041109)
- [none] Updated dependencies [9041109](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9041109)

## 13.1.0

- [minor] add media mocks [1754450](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1754450)
- [none] Updated dependencies [1754450](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1754450)
  - @atlaskit/media-store@3.1.0

## 13.0.2

- [patch][f87724e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f87724e)
- [none] Updated dependencies [f87724e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f87724e)

## 13.0.1

- [patch] Updated dependencies [bd26d3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd26d3c)
  - @atlaskit/media-core@18.1.1

## 13.0.0

- [major] media-picker: <All but popup picker>.emitUploadEnd second argument shape has changed from MediaFileData to FileDetails; `upload-end` event payload body shape changed from MediaFileData to FileDetails; All the media pickers config now have new property `useNewUploadService: boolean` (false by default); popup media-picker .cancel can't be called with no argument, though types does allow for it; `File` is removed; --- media-store: MediaStore.createFile now has a required argument of type MediaStoreCreateFileParams; MediaStore.copyFileWithToken new method; uploadFile method result type has changed from just a promise to a UploadFileResult type; --- media-test-helpers: mediaPickerAuthProvider argument has changed from a component instance to just a boolean authEnvironment; [84f6f91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84f6f91)
- [major] SUMMARY GOES HERE [9041d71](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9041d71)
- [none] Updated dependencies [84f6f91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84f6f91)
  - @atlaskit/media-core@18.1.0
- [major] Updated dependencies [9041d71](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9041d71)
  - @atlaskit/media-core@18.1.0

## 12.0.4

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/field-text@5.0.3
  - @atlaskit/media-core@18.0.3

## 12.0.1

- [patch] Added missing dependencies and added lint rule to catch them all [0672503](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0672503)

## 12.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 11.0.0

- [major] Show upload button during recents load in media picker. + Inprove caching for auth provider used in examples [929731a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/929731a)

## 10.0.6

- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)

## 10.0.2

- [patch] fix(media-test-helpers): bump xhr-mock and add error handling [304265f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/304265f)

## 10.0.1

- [patch] feature(media-test-helpers): http mocks for media-picker [982085f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/982085f)

## 9.0.5

- [patch] Remove TS types that requires styled-components v3 [836e53b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/836e53b)

## 9.0.4

- [patch] fix(media-test-helpers): configure fetch to send credentials and point calls to correct endpoint [8978f4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8978f4e)

## 9.0.3

- [patch] Pointing base urls to media-playground behind Stargate [4979dc5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4979dc5)

## 9.0.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 9.0.0

- [patch] use impersonation endpoint in authProvider [85cf404](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85cf404)

## 8.6.1

- [patch] Update atlassian.io domains [6ac1a8f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ac1a8f)

## 8.6.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 8.5.4

- [patch] Use media-test-helpers instead of hardcoded values [f2b92f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f2b92f8)

## 8.5.3

- [patch] Update dependencies [623f8ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/623f8ca)

## 8.5.2

- [patch] Added new AppCardView v1.5 designs behind a feature flag. [92bc6c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92bc6c8)

## 8.5.1

- [patch] Show static images for gifs in small cards [e2508f9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e2508f9)
- [patch] Show static images for gifs in small cards [e2508f9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e2508f9)

## 8.4.0 (2017-10-10)

- bug fix; fixed incompatible types between axioPromise and Promise. ([a227432](https://bitbucket.org/atlassian/atlaskit/commits/a227432))
- feature; created userAuthProvider for storybook ([31b2e96](https://bitbucket.org/atlassian/atlaskit/commits/31b2e96))

## 8.3.0 (2017-09-19)

- feature; new LinkCards UI ([06d49d2](https://bitbucket.org/atlassian/atlaskit/commits/06d49d2))

## 8.2.1 (2017-09-15)

- bug fix; fix bug where authProvider impl has wrong API ([f8fbeee](https://bitbucket.org/atlassian/atlaskit/commits/f8fbeee))

## 8.2.0 (2017-09-14)

- feature; add \`createStorybookContext\` default parameter ([6814e95](https://bitbucket.org/atlassian/atlaskit/commits/6814e95))

## 8.1.0 (2017-09-13)

- feature; bump media-core dep and introduce asap issuer way of auth ([f348ccb](https://bitbucket.org/atlassian/atlaskit/commits/f348ccb))
- breaking;
- `createStorybookContext` now takes 1 parameter object of type `AuthParameter`. It takes `serviceHost`
- and `authType`, that can be either `"client"` or `"asap"`, depending on what auth option you want to be used.
- Notice: `clientId` is not required anymore.
- breaking;
- `StoryBookTokenProvider` is gone. Instead `StoryBookAuthProvider` has new method `create`, it takes
- boolean `isAsapEnvironment` as first parameter and `scope` object as second.

## 7.2.0 (2017-08-08)

- feature; add password protected PDF ([5afbf6a](https://bitbucket.org/atlassian/atlaskit/commits/5afbf6a))

## 7.1.0 (2017-08-08)

- feature; add large pdf file ([695e4d1](https://bitbucket.org/atlassian/atlaskit/commits/695e4d1))
- feature; added link details ([ed1c4aa](https://bitbucket.org/atlassian/atlaskit/commits/ed1c4aa))

## 6.3.0 (2017-07-31)

- feature; added minimal link details which contain a smart card ([e016c4b](https://bitbucket.org/atlassian/atlaskit/commits/e016c4b))

## 6.2.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 6.2.0 (2017-06-29)

- feature; add new image id to mediaExamples ([5573611](https://bitbucket.org/atlassian/atlaskit/commits/5573611))

## 6.1.0 (2017-06-08)

- fix; use read/write access scope for all sample collections ([62380c2](https://bitbucket.org/atlassian/atlaskit/commits/62380c2))
- feature; cache token for custom scoped access ([c97cf14](https://bitbucket.org/atlassian/atlaskit/commits/c97cf14))

## 6.0.3 (2017-06-05)

- fix; updated link ids so they point to links that exist in their associated collections ([ce844c1](https://bitbucket.org/atlassian/atlaskit/commits/ce844c1))

## 6.0.2 (2017-05-22)

- fix; fix link id ([ae82433](https://bitbucket.org/atlassian/atlaskit/commits/ae82433))

## 6.0.1 (2017-05-19)

- fix; actualize media-test-helpers dependencies ([6ffff96](https://bitbucket.org/atlassian/atlaskit/commits/6ffff96))

## 5.0.0 (2017-05-19)

- feature; bumped version of media-core ([16674d9](https://bitbucket.org/atlassian/atlaskit/commits/16674d9))
- breaking; bumped version of media-core

## 4.8.5 (2017-05-15)

- fix; fixed the default fakeContextProvider with a more robust mock ([5b703f2](https://bitbucket.org/atlassian/atlaskit/commits/5b703f2))

## 4.8.4 (2017-05-09)

- fix; add missing dependency ([b998940](https://bitbucket.org/atlassian/atlaskit/commits/b998940))

## 4.8.2 (2017-05-05)

- fix; bumping media-core ([85f448f](https://bitbucket.org/atlassian/atlaskit/commits/85f448f))

## 4.8.1 (2017-05-01)

- fix; changed video url preview to one that is identified by endpoint with player attribut ([76f0895](https://bitbucket.org/atlassian/atlaskit/commits/76f0895))
- fix; update for media-test-helpers with updated context signature ([10ae6e2](https://bitbucket.org/atlassian/atlaskit/commits/10ae6e2))

## 4.8.0 (2017-04-27)

- feature; added data uri gif required by FIL-4001 ([e2ffb80](https://bitbucket.org/atlassian/atlaskit/commits/e2ffb80))

## 4.7.0 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 4.6.0 (2017-04-27)

- feature; add imageLinkId to examples ([64a48ad](https://bitbucket.org/atlassian/atlaskit/commits/64a48ad))
- feature; added file details required by FIL-4001 ([7586dfd](https://bitbucket.org/atlassian/atlaskit/commits/7586dfd))

## 4.5.2 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))
- fix; updated media packages key words and maintainers ([01bcbc5](https://bitbucket.org/atlassian/atlaskit/commits/01bcbc5))

## 4.5.1 (2017-04-26)

- fix; fixed typescript/validate errors by using explicit type ([d7e1639](https://bitbucket.org/atlassian/atlaskit/commits/d7e1639))

## 4.5.0 (2017-04-26)

- feature; added file and url preview identifiers ([5fd08f1](https://bitbucket.org/atlassian/atlaskit/commits/5fd08f1))

## 4.4.0 (2017-04-21)

- feature; added example details ([fbb8fc1](https://bitbucket.org/atlassian/atlaskit/commits/fbb8fc1))

## 4.3.0 (2017-04-19)

- fix; fix spotify URL ([395c9db](https://bitbucket.org/atlassian/atlaskit/commits/395c9db))
- feature; added a audio file changed video/youtube url previews ([5add9d6](https://bitbucket.org/atlassian/atlaskit/commits/5add9d6))

## 4.2.0 (2017-04-19)

- fix; fix example media item names and add collectionName (otherwise they don't work) ([9cd2b34](https://bitbucket.org/atlassian/atlaskit/commits/9cd2b34))
- fix; fix naming to be consistent ([e86740e](https://bitbucket.org/atlassian/atlaskit/commits/e86740e))
- feature; add createMouseEvent helper method ([794d681](https://bitbucket.org/atlassian/atlaskit/commits/794d681))
- feature; added example media item identifiers to media-test-helpers ([8554af2](https://bitbucket.org/atlassian/atlaskit/commits/8554af2))

## 4.1.0 (2017-04-11)

- feature; update storybook context with insert/update permissions ([3fcb6f0](https://bitbucket.org/atlassian/atlaskit/commits/3fcb6f0))

## 4.0.1 (2017-04-10)

- fix; return an expected value from default fake fetchImageDataUri ([c107164](https://bitbucket.org/atlassian/atlaskit/commits/c107164))

## 3.0.0 (2017-04-03)

- fix; moved media-core into peer dependency for media-test-helpers ([bc24c11](https://bitbucket.org/atlassian/atlaskit/commits/bc24c11))
- breaking; moved media-core to peer dependency for media-test-helpers

## 1.49.0 (2017-03-27)

- feature; bump media-test-helpers version ([2e390f9](https://bitbucket.org/atlassian/atlaskit/commits/2e390f9))
- feature; update dependency media-core to 3.0.0 ([f07416c](https://bitbucket.org/atlassian/atlaskit/commits/f07416c))

## 1.2.0 (2017-03-23)

- fix; fixing the build ([ba21a9d](https://bitbucket.org/atlassian/atlaskit/commits/ba21a9d))
- feature; added 'super' card component ([559579f](https://bitbucket.org/atlassian/atlaskit/commits/559579f))
- breaking; Card API, LinkCard API, FileCard API
- ISSUES CLOSED: FIL-3919
- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))
- fix; avoid UI flickering when showing an already loaded collection ([5637ffb](https://bitbucket.org/atlassian/atlaskit/commits/5637ffb))
- feature; allow media-api token generation with access ([d337480](https://bitbucket.org/atlassian/atlaskit/commits/d337480))
- feature; added application links to media-card and restructured ([618650e](https://bitbucket.org/atlassian/atlaskit/commits/618650e))
- feature; media Test Helpers portion of shipit/house_of_cards ([b9e6db9](https://bitbucket.org/atlassian/atlaskit/commits/b9e6db9))

## 1.1.0 (2017-03-09)

- feature; cleaned and updated link card ([5dcae43](https://bitbucket.org/atlassian/atlaskit/commits/5dcae43))
- feature; migrate FilmStrip component + create media-test-helpers ([8896543](https://bitbucket.org/atlassian/atlaskit/commits/8896543))
