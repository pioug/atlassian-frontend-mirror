# @atlaskit/media-file-preview

## 0.15.3

### Patch Changes

- [`71b895a2fd401`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/71b895a2fd401) -
  Fix SSR preview generation to only be attempted in SSR and not in client if the ssr="client" prop
  is sent
- Updated dependencies

## 0.15.2

### Patch Changes

- [`5e282b606cfbf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5e282b606cfbf) -
  Fixing the inline script to be injected correctly without susception to minification

## 0.15.1

### Patch Changes

- [`99bce197cbf4e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/99bce197cbf4e) -
  Fixing the script to correctly reference mediaCountSSR string
- Updated dependencies

## 0.15.0

### Minor Changes

- [`2060fe01f7695`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2060fe01f7695) -
  Optimise the lazy loading of images by removing native lazy attribute from first 6 media

### Patch Changes

- Updated dependencies

## 0.14.1

### Patch Changes

- [`a0a262f68a1ec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a0a262f68a1ec) -
  Fixed the issue with SSR previews not refeching higher resolution images when the SSR preview is
  less wide then the hydration dimensions

## 0.14.0

### Minor Changes

- [`0fca09ae4fa6d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0fca09ae4fa6d) -
  Removing the blob URL conversion and fixing the unnecessary dual fetching of images when VC fixes
  are active

## 0.13.0

### Minor Changes

- [`7ecc830bdd14e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7ecc830bdd14e) -
  Fixed the srcset 2x to include the correct scaled height param if provided and added resize mode
  to SSR cache param to avoid reusing incorrect image due to caching

## 0.12.0

### Minor Changes

- [`dee4c84f3e878`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dee4c84f3e878) -
  Fixes media card loading during SSR fallback for items without a preview image

## 0.11.9

### Patch Changes

- [`9630c61136f9b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9630c61136f9b) -
  Fixed the resolution of feature flag in SSR script

## 0.11.8

### Patch Changes

- [`eec573b4a7a6a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/eec573b4a7a6a) -
  Added srcset for Media to remove dual fetching and implememted invisible image along blob
  converison during SSR phase prior to hydration to avoid VC offenses
- Updated dependencies

## 0.11.7

### Patch Changes

- [`e0cc5dd07934c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e0cc5dd07934c) -
  Fixed perpetual loading of Media Card when SSR failed or when an unsupported media file was
  requested.
- Updated dependencies

## 0.11.6

### Patch Changes

- [#187759](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/187759)
  [`cb2080ec93b3c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cb2080ec93b3c) -
  Add UFO hold to reduce TTAI blindspot gap

## 0.11.5

### Patch Changes

- [#186676](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/186676)
  [`0fa7265b4e380`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0fa7265b4e380) -
  Cleanup remove media script after SSR feature gate

## 0.11.4

### Patch Changes

- Updated dependencies

## 0.11.3

### Patch Changes

- Updated dependencies

## 0.11.2

### Patch Changes

- Updated dependencies

## 0.11.1

### Patch Changes

- [#133477](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/133477)
  [`7e502ba2970b9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7e502ba2970b9) -
  Remove media script added during SSR to prevent hydrateRoot mismatch

## 0.11.0

### Minor Changes

- [#117363](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117363)
  [`10a0f7f6c2027`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10a0f7f6c2027) -
  This package's `peerDependencies` have been adjusted for `react` and/or `react-dom` to reflect the
  status of only supporting React 18 going forward. No explicit breaking change to React support has
  been made in this release, but this is to signify going forward, breaking changes for React 16 or
  React 17 may come via non-major semver releases.

  Please refer this community post for more details:
  https://community.developer.atlassian.com/t/rfc-78-dropping-support-for-react-16-and-rendering-in-a-react-18-concurrent-root-in-jira-and-confluence/87026

### Patch Changes

- Updated dependencies

## 0.10.1

### Patch Changes

- Updated dependencies

## 0.10.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 0.9.7

### Patch Changes

- Updated dependencies

## 0.9.6

### Patch Changes

- [#102527](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102527)
  [`a90d34cd14faf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a90d34cd14faf) -
  Updated ErrorFileState deserialisation and error logging
- Updated dependencies

## 0.9.5

### Patch Changes

- Updated dependencies

## 0.9.4

### Patch Changes

- [#165609](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165609)
  [`b29c0cc4fef46`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b29c0cc4fef46) -
  Cleaned up media card perf observer feature flag

## 0.9.3

### Patch Changes

- Updated dependencies

## 0.9.2

### Patch Changes

- [#158851](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/158851)
  [`f5c5983855cae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f5c5983855cae) -
  Used new @atlaskit/media-client-react functions for verifying MediaFileStateError type and
  extracting error reason
- Updated dependencies

## 0.9.1

### Patch Changes

- Updated dependencies

## 0.9.0

### Minor Changes

- [#140915](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140915)
  [`36b5acc412af5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/36b5acc412af5) -
  Design system typography uplift

### Patch Changes

- Updated dependencies

## 0.8.4

### Patch Changes

- Updated dependencies

## 0.8.3

### Patch Changes

- [`eaacfc7b03414`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eaacfc7b03414) -
  Changed the feature flag used for analytics publishing to prevent spamming due to cached clients
  using bugged versions of Card

## 0.8.2

### Patch Changes

- [#132917](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132917)
  [`c940f8ae45182`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c940f8ae45182) -
  Removed the additional `ssr` parameter to the image endpoint

## 0.8.1

### Patch Changes

- [#132551](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132551)
  [`19eb1d802c7f9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/19eb1d802c7f9) -
  Fixed the dual fetching of image when medaiBlobUrlAttributes change

## 0.8.0

### Minor Changes

- [#130787](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130787)
  [`64a680780dc57`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/64a680780dc57) -
  Add performance observer metrics for Media Card to assist investigation into hot-110955

### Patch Changes

- [#131947](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/131947)
  [`871136a343690`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/871136a343690) -
  Fixed issue with images being refetched if the items responded before upfront preview resolved
- Updated dependencies

## 0.7.0

### Minor Changes

- [#130406](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130406)
  [`2132e67c92d0f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2132e67c92d0f) -
  Updates media-file-preview to support React 18

## 0.6.0

### Minor Changes

- [#118216](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118216)
  [`b2f8064faf92d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b2f8064faf92d) -
  Added new export for verifying MediaFilePreviewError type

## 0.5.2

### Patch Changes

- Updated dependencies

## 0.5.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 0.5.0

### Minor Changes

- [#73279](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/73279)
  [`cdad00f21119`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cdad00f21119) -
  Create useMediaImage hook

## 0.4.2

### Patch Changes

- [#71793](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71793)
  [`26115be71855`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/26115be71855) -
  Added support for Error File State

## 0.4.1

### Patch Changes

- [#71409](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71409)
  [`5c76dfba92dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c76dfba92dd) -
  Pass trace context to global scope error

## 0.4.0

### Minor Changes

- [#70446](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70446)
  [`48eae199c6fa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/48eae199c6fa) -
  Breaking: return ref object ssrReliabilityRef is replaced by object ssrReliability

### Patch Changes

- [#70446](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70446)
  [`0ff07ca94009`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0ff07ca94009) -
  Better support for onImageError callback

## 0.3.1

### Patch Changes

- [#70361](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70361)
  [`6bcee8c57dac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6bcee8c57dac) -
  Support for files failed to process

## 0.3.0

### Minor Changes

- [#70034](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70034)
  [`0cf829b2ca1f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0cf829b2ca1f) -
  Breaking: renamed return value from getScriptProps to getSsrScriptProps

## 0.2.1

### Patch Changes

- [#69372](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69372)
  [`d719e8e81e2c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d719e8e81e2c) -
  Fixed status for processed files with no preview

## 0.2.0

### Minor Changes

- [#65817](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65817)
  [`de45ff7a33a9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/de45ff7a33a9) -
  Breaking: removed previewDidRender property

## 0.1.0

### Minor Changes

- [#65749](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65749)
  [`cf9674e67f0c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cf9674e67f0c) -
  Breaking: updated prop types
