# @atlaskit/media-card

## 79.0.7

### Patch Changes

- [#123539](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/123539)
  [`7d7e4ceeebc70`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7d7e4ceeebc70) -
  Fixed error logging payload - added more info from underlying errors
- Updated dependencies

## 79.0.6

### Patch Changes

- Updated dependencies

## 79.0.5

### Patch Changes

- Updated dependencies

## 79.0.4

### Patch Changes

- [#121036](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121036)
  [`bcc65151d39a7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bcc65151d39a7) -
  Removed unused mediaCardRender screen event

## 79.0.3

### Patch Changes

- [#117537](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/117537)
  [`1aafb49d776e0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1aafb49d776e0) -
  Integrated Media Viewer with internal DS Portal (removed feature flag)
- Updated dependencies

## 79.0.2

### Patch Changes

- [#120533](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120533)
  [`f1bec731e278f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1bec731e278f) -
  Adds a `sideEffects` field to ensure this package does not have Compiled styles tree-shaken in the
  future to avoid an accidental regression.

  This is related to
  https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953

## 79.0.1

### Patch Changes

- [#115525](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115525)
  [`f3846b2639942`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f3846b2639942) -
  Migrated Media Card to compiled behind a featureflag
- Updated dependencies

## 79.0.0

### Major Changes

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

## 78.19.7

### Patch Changes

- [#113412](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113412)
  [`bb782d3c9d9ee`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bb782d3c9d9ee) -
  Removed unused code
- Updated dependencies

## 78.19.6

### Patch Changes

- Updated dependencies

## 78.19.5

### Patch Changes

- [#112360](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112360)
  [`39bbbe14a6632`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/39bbbe14a6632) -
  Fixed styles for disabled download buttons

## 78.19.4

### Patch Changes

- [#108452](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108452)
  [`47669ab510c09`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/47669ab510c09) -
  Handle errors from SVG blob to Dara URI conversion
- Updated dependencies

## 78.19.3

### Patch Changes

- Updated dependencies

## 78.19.2

### Patch Changes

- Updated dependencies

## 78.19.1

### Patch Changes

- [#108375](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108375)
  [`e8c31d714c7f5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e8c31d714c7f5) -
  Replaced internal Feature Gate

## 78.19.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 78.18.6

### Patch Changes

- [#107675](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107675)
  [`0dcf1e05a2c8d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0dcf1e05a2c8d) -
  Updated Media Viewer with DS Portal import
- [#107798](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107798)
  [`dd36286da62e8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dd36286da62e8) -
  Fixed Card Action Disabled Button Style
- Updated dependencies

## 78.18.5

### Patch Changes

- [#105231](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105231)
  [`832aac2f4725a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/832aac2f4725a) -
  Sample 5% of media card UFOv1 events

## 78.18.4

### Patch Changes

- Updated dependencies

## 78.18.3

### Patch Changes

- [#102527](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102527)
  [`a90d34cd14faf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a90d34cd14faf) -
  Updated ErrorFileState deserialisation and error logging
- Updated dependencies

## 78.18.2

### Patch Changes

- [#103673](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103673)
  [`41cc17bdee600`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/41cc17bdee600) -
  Replaced feature gate "platform_media_copy_and_paste_v2" with "platform_media_cross_client_copy"
  to avoid releasing to users with broken versions in cache
- Updated dependencies

## 78.18.1

### Patch Changes

- Updated dependencies

## 78.18.0

### Minor Changes

- [#97492](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97492)
  [`5195c4fd974a3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5195c4fd974a3) -
  Integrated warning modal dialog to prevent against abuse-classified file downloads.

  Integrated with MediaViewerWithPortal replacing React Potal (behind feature flag)

### Patch Changes

- Updated dependencies

## 78.17.3

### Patch Changes

- [#100086](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100086)
  [`3eb4ae69a3687`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3eb4ae69a3687) -
  Fixed media card hiding selection / highlighting styles

## 78.17.2

### Patch Changes

- [#99141](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99141)
  [`ea40627d37ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ea40627d37ed3) -
  Fixed meida card hiding selection / highlighting styles

## 78.17.1

### Patch Changes

- [#98553](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98553)
  [`d3cdb7e8e6bfb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d3cdb7e8e6bfb) -
  Fixed Media Card Actions click through. Media Viewer opens correctly

## 78.17.0

### Minor Changes

- [#98696](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98696)
  [`396ff0958321d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/396ff0958321d) -
  Adding the ability to register copy intents to enable cross site / product copy and paste for
  media by forwarding the ref from useCopyIntent / useFilePreview

### Patch Changes

- Updated dependencies

## 78.16.1

### Patch Changes

- [#181001](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/181001)
  [`6108eab3b6a57`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6108eab3b6a57) -
  Fixed positioning when Action Bar items add a tooltip

## 78.16.0

### Minor Changes

- [#179931](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/179931)
  [`9ecf438a10ba5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9ecf438a10ba5) -
  Disable Media downloads based on Product security policy. Option added to Media Client Config

### Patch Changes

- [#179934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/179934)
  [`be121b1cf4f54`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/be121b1cf4f54) -
  Internal changes to typography font family style definitions.
- Updated dependencies

## 78.15.4

### Patch Changes

- [#178053](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/178053)
  [`cb318c8c28c26`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cb318c8c28c26) -
  Internal changes to typography.

## 78.15.3

### Patch Changes

- [#177625](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/177625)
  [`5c74bd54645e7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c74bd54645e7) -
  Add data-vc prop to track TTVC mutation of media-card

## 78.15.2

### Patch Changes

- Updated dependencies

## 78.15.1

### Patch Changes

- Updated dependencies

## 78.15.0

### Minor Changes

- [#170821](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170821)
  [`52532d238c0b6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/52532d238c0b6) -
  Enabled the deduplication of files in media-filmstrip by passing includeHashForDuplicateFiles flag
  to /items

### Patch Changes

- Updated dependencies

## 78.14.2

### Patch Changes

- [#166250](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166250)
  [`cfa981b21fead`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cfa981b21fead) -
  Media Performance Obsever logs all the metrics through React UFO
- [#165609](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165609)
  [`b29c0cc4fef46`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b29c0cc4fef46) -
  Cleaned up media card perf observer feature flag
- [#169329](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/169329)
  [`1333f96f0c802`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1333f96f0c802) -
  Removed SVG for Media Group Feature Gate
- Updated dependencies

## 78.14.1

### Patch Changes

- Updated dependencies

## 78.14.0

### Minor Changes

- [#162568](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/162568)
  [`bdec058ec8fe8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bdec058ec8fe8) -
  Added support for navite SVG rendering when overlay is enabled (Media Group)

### Patch Changes

- Updated dependencies

## 78.13.0

### Minor Changes

- [#163838](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/163838)
  [`c3fcf9a7c2028`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c3fcf9a7c2028) -
  Logging good/bad events from file downloads

### Patch Changes

- Updated dependencies

## 78.12.1

### Patch Changes

- [#162388](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/162388)
  [`95e70f4e28842`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/95e70f4e28842) -
  Move `@atlaskit/ufo-interaction-ignore` to `@atlaskit/react-ufo`

## 78.12.0

### Minor Changes

- [`6099ac032dd30`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6099ac032dd30) -
  Added viewerOptions to override file preview renderer in media components

### Patch Changes

- Updated dependencies

## 78.11.0

### Minor Changes

- [#160884](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/160884)
  [`52e16a1e398bf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/52e16a1e398bf) -
  Media Card integrates with React UFO VC Media Wrapper

### Patch Changes

- Updated dependencies

## 78.10.4

### Patch Changes

- [#159175](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159175)
  [`3d950b640ad0c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3d950b640ad0c) -
  Replace @atlassian/react-ufo imports with @atlaskit/react-ufo

## 78.10.3

### Patch Changes

- [#158851](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/158851)
  [`f5c5983855cae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f5c5983855cae) -
  Used new @atlaskit/media-client-react functions for verifying MediaFileStateError type and
  extracting error reason
- [#159313](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159313)
  [`d9195e7bfb522`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d9195e7bfb522) -
  Removed unused mediaCardRender commenced event
- Updated dependencies

## 78.10.2

### Patch Changes

- [#156157](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156157)
  [`8d23a2a1568fe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d23a2a1568fe) -
  fix React 18 strict mode issues

## 78.10.1

### Patch Changes

- [#158161](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/158161)
  [`f092b9d2f949d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f092b9d2f949d) -
  clean up LD Media CDN FFs

## 78.10.0

### Minor Changes

- [#158522](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/158522)
  [`d5002484a701c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d5002484a701c) -
  Created React UFO Segment for Media Card

## 78.9.3

### Patch Changes

- Updated dependencies

## 78.9.2

### Patch Changes

- [#155914](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155914)
  [`664c7065b5496`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/664c7065b5496) -
  Fixed media card showing perpetual spinner for failed processing videos

## 78.9.1

### Patch Changes

- [#156328](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156328)
  [`91ea9df3f02c3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/91ea9df3f02c3) -
  migrate media CDN FFs to Statsig

## 78.9.0

### Minor Changes

- [#156360](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156360)
  [`411b348673f6b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/411b348673f6b) -
  [ux] Replace "Preview currently unavailable" messaging for media card rate limit errors with
  standard "Preview unavailable" messaging. `@atlaskit/media-ui` requires a major version bump as
  the "Preview currently unavailable" messaging has been removed, this messaging is only used by the
  `@atlaskit/media-card` component however.

### Patch Changes

- Updated dependencies

## 78.8.1

### Patch Changes

- Updated dependencies

## 78.8.0

### Minor Changes

- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`e5a96535fa143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e5a96535fa143) -
  Media Card sends custom network metrics using React UFO

### Patch Changes

- Updated dependencies

## 78.7.1

### Patch Changes

- Updated dependencies

## 78.7.0

### Minor Changes

- [#152851](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152851)
  [`caba4b5434f99`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/caba4b5434f99) -
  CardLoading component accepts interactionName for the underlying spinner. This is to idenfity the
  experience in Performance Portal.

## 78.6.0

### Minor Changes

- [#152007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152007)
  [`02bbd6c761bcc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/02bbd6c761bcc) -
  [ux] Tickbox size fix for new icons (https://product-fabric.atlassian.net/browse/DSP-20944)

## 78.5.5

### Patch Changes

- Updated dependencies

## 78.5.4

### Patch Changes

- [#147531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147531)
  [`8ae1e110621b7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8ae1e110621b7) -
  Internal changes to feature flag used to toggle new icons

## 78.5.3

### Patch Changes

- [`9ec2d0a84a183`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9ec2d0a84a183) -
  add initiatorType and responseEnd to mediaCardPerfObserver event

## 78.5.2

### Patch Changes

- Updated dependencies

## 78.5.1

### Patch Changes

- Updated dependencies

## 78.5.0

### Minor Changes

- [#142249](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/142249)
  [`40949f8ce34cf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40949f8ce34cf) -
  [ux] Enable new icons behind a feature flag.

## 78.4.1

### Patch Changes

- [#141583](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/141583)
  [`ba6def6b9d3ce`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ba6def6b9d3ce) -
  Updated Media card and UI to avoid contributing to TTVC metrics

  - Media card will always render the `img`, even while it is still loading (in that case, the `img`
    will just be hidden). It will also use a custom loading spinner with no interaction context.
  - Media image will allow a null value for the image source. It will also always render the `img`
    tag and switch the css prop `display` according to the `src` value.

- Updated dependencies

## 78.4.0

### Minor Changes

- [#140915](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140915)
  [`36b5acc412af5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/36b5acc412af5) -
  Design system typography uplift

### Patch Changes

- Updated dependencies

## 78.3.0

### Minor Changes

- [#139803](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139803)
  [`573e2dccbc940`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/573e2dccbc940) -
  Render SVG Images natively when overlay is disabled (no longer behind a featue flag)

### Patch Changes

- Updated dependencies

## 78.2.4

### Patch Changes

- [#139885](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139885)
  [`e135d3c606ebc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e135d3c606ebc) -
  Added feature flag status to performance analytics event

## 78.2.3

### Patch Changes

- [#139310](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139310)
  [`3037eb69f8dbc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3037eb69f8dbc) -
  Updated Media card and UI to avoid unnecessary re-renders to avoid contributing to TTVC metrics

## 78.2.2

### Patch Changes

- Updated dependencies

## 78.2.1

### Patch Changes

- [#136583](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136583)
  [`2f48f0fb0c9f5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2f48f0fb0c9f5) -
  Fixed analytics firing for single domain cdn

## 78.2.0

### Minor Changes

- [#134978](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134978)
  [`3dabd40fd0af7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3dabd40fd0af7) -
  Updates media-card to support React 18

### Patch Changes

- [`84c0869e8c5c6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/84c0869e8c5c6) -
  remove unused cardview refactor FF and components
- Updated dependencies

## 78.1.2

### Patch Changes

- [`eaacfc7b03414`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eaacfc7b03414) -
  Changed the feature flag used for analytics publishing to prevent spamming due to cached clients
  using bugged versions of Card

## 78.1.1

### Patch Changes

- [#132917](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132917)
  [`c940f8ae45182`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c940f8ae45182) -
  Include additional attributes in the mediaCardPerfObserver metrics: `contentDownloadTime`,
  `nextHopProtocol`, `userAgent`

  And remove the `url` attribute.

## 78.1.0

### Minor Changes

- [#130787](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130787)
  [`64a680780dc57`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/64a680780dc57) -
  Add performance observer metrics for Media Card to assist investigation into hot-110955

### Patch Changes

- Updated dependencies

## 78.0.15

### Patch Changes

- Updated dependencies

## 78.0.14

### Patch Changes

- Updated dependencies

## 78.0.13

### Patch Changes

- Updated dependencies

## 78.0.12

### Patch Changes

- Updated dependencies

## 78.0.11

### Patch Changes

- Updated dependencies

## 78.0.10

### Patch Changes

- [#122514](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122514)
  [`7012015c2cc2d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7012015c2cc2d) -
  Introduced a preload static function to the CardLoader component. This function allows for
  asynchronously loading the component ahead of time. Useful for optimising performance by
  preloading the component when needed.

## 78.0.9

### Patch Changes

- [#121438](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/121438)
  [`6fc64e2707215`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6fc64e2707215) -
  Added more accurate SVG status in DOM
- [#121438](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/121438)
  [`6fc64e2707215`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6fc64e2707215) -
  Replaced Analytics event generator HOC by Analytics Hook event generator
- Updated dependencies

## 78.0.8

### Patch Changes

- [#120561](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120561)
  [`5bcb6ac107e75`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5bcb6ac107e75) -
  Removed unused code in Media Card

## 78.0.7

### Patch Changes

- [#120680](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120680)
  [`ea8de83d2efa4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ea8de83d2efa4) -
  Small CSS rule fix
- Updated dependencies

## 78.0.6

### Patch Changes

- [#118216](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118216)
  [`b2f8064faf92d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b2f8064faf92d) -
  Fixed logging of error events from file preview hook
- Updated dependencies

## 78.0.5

### Patch Changes

- [#119322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119322)
  [`2f435f37f33e0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2f435f37f33e0) -
  Allow alt text on image to be empty on decorative images to improve accessibility
- Updated dependencies

## 78.0.4

### Patch Changes

- Updated dependencies

## 78.0.3

### Patch Changes

- [#116684](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116684)
  [`72f1da4341a27`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/72f1da4341a27) -
  Fixes sizing modes for SVG native rendering integration

## 78.0.2

### Patch Changes

- [`fc2ed679e4540`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fc2ed679e4540) -
  Sanitise UGC from fileId in `media-card-render` UFO experience

## 78.0.1

### Patch Changes

- Updated dependencies

## 78.0.0

### Major Changes

- [#115862](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115862)
  [`be4b79682f52b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/be4b79682f52b) -
  Removing mediacardV2 feature flag making the default experience the refactored one which may
  result in tests failing where consumers test the internals of media components

## 77.12.4

### Patch Changes

- Updated dependencies

## 77.12.3

### Patch Changes

- [`cd38da52e02b7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cd38da52e02b7) -
  Media Card handles SVG errors and logs extra info for monitoring

## 77.12.2

### Patch Changes

- [#113192](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113192)
  [`80dfa651ba955`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/80dfa651ba955) -
  Migration of native HTML buttons to new Pressable primitive.
- [#113192](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113192)
  [`80dfa651ba955`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/80dfa651ba955) -
  Migration of native HTML buttons to new Pressable primitive.

## 77.12.1

### Patch Changes

- [#109692](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109692)
  [`e947830ffb91c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e947830ffb91c) -
  Updated feature flag key for SVG rendering

## 77.12.0

### Minor Changes

- [#105003](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105003)
  [`bfeca76e5015`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bfeca76e5015) -
  [ux] Added support for native SVG rendering (currently behind a feature flag)

### Patch Changes

- Updated dependencies

## 77.11.3

### Patch Changes

- [#106551](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/106551)
  [`5b4127cba6c4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5b4127cba6c4) -
  Fixed CardV2 regression of not using DateOverride for Jira

## 77.11.2

### Patch Changes

- Updated dependencies

## 77.11.1

### Patch Changes

- [#90872](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/90872)
  [`ac8e7b44549a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ac8e7b44549a) -
  The internal composition of this package has changed. There is no expected change in behavior.

## 77.11.0

### Minor Changes

- [#88895](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88895)
  [`a48b908e2bf6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a48b908e2bf6) -
  Add integration of React UFO to not hold react-ufo measurement when media is not in viewport

### Patch Changes

- Updated dependencies

## 77.10.12

### Patch Changes

- [#89247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89247)
  [`a65b4a0870d8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a65b4a0870d8) -
  The internal composition of this package has changed. There is no expected change in behavior.

## 77.10.11

### Patch Changes

- [#88354](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88354)
  [`4c87d9b4f0c2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4c87d9b4f0c2) -
  The internal composition of this component has changed. There is no expected change in behavior.
- Updated dependencies

## 77.10.10

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 77.10.9

### Patch Changes

- Updated dependencies

## 77.10.8

### Patch Changes

- [#80866](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80866)
  [`5f63192be3ab`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5f63192be3ab) -
  Sanitise file id before logging to prevent PII/UGC leaks
- Updated dependencies

## 77.10.7

### Patch Changes

- [#80085](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80085)
  [`7febfed958dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7febfed958dd) -
  Update usage of `React.FC` to explicity include `children`

## 77.10.6

### Patch Changes

- [#79344](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/79344)
  [`b6bc418abde3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b6bc418abde3) -
  CXP-3050 Enforced design tokens and primitives on media-card

## 77.10.5

### Patch Changes

- [#79378](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/79378)
  [`1292c9f03c9f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1292c9f03c9f) -
  Apply spacing token to media-ui

## 77.10.4

### Patch Changes

- [#77619](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77619)
  [`019721a3386a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/019721a3386a) -
  Fixed issue with keyboard focused card actions not being visible
- Updated dependencies

## 77.10.3

### Patch Changes

- [#69454](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69454)
  [`41f49439d5da`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/41f49439d5da) -
  [ux] ECA11Y-198: Add Shift + F10 shortcut to focus play/pause button when video is selected
- Updated dependencies

## 77.10.2

### Patch Changes

- [#74855](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74855)
  [`60e3eb23093b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/60e3eb23093b) -
  Fixed accessiblity issue where passing label was not adding an accessible aria-label tag

## 77.10.1

### Patch Changes

- Updated dependencies

## 77.10.0

### Minor Changes

- [#72258](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72258)
  [`31cecb8f314b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/31cecb8f314b) -
  ECA11Y-78: removed feature flag

## 77.9.0

### Minor Changes

- [#71201](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71201)
  [`1b48cdd3c074`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1b48cdd3c074) -
  ED-21767 export inline image analytic function.

## 77.8.0

### Minor Changes

- [#69045](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69045)
  [`c181471c1afb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c181471c1afb) -
  Made media card keyboard accessible when media viewer is enabled

### Patch Changes

- Updated dependencies

## 77.7.7

### Patch Changes

- [#70446](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70446)
  [`f5cf78271e82`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f5cf78271e82) -
  Card v2 updates use of return value from Hook
- Updated dependencies

## 77.7.6

### Patch Changes

- [#70361](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70361)
  [`00f64ae9f383`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/00f64ae9f383) -
  Added failed-processing as error primary reason in Card v2

## 77.7.5

### Patch Changes

- [#70034](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70034)
  [`0cf829b2ca1f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0cf829b2ca1f) -
  Updated prop names from Preview Hook
- Updated dependencies

## 77.7.4

### Patch Changes

- [#69809](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69809)
  [`8c7fda062747`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8c7fda062747) -
  Unskip MediaCardV2 tests for processing status

## 77.7.3

### Patch Changes

- [#69372](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69372)
  [`c5868970426f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c5868970426f) -
  Simplified status set in Card v2
- Updated dependencies

## 77.7.2

### Patch Changes

- [#65817](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65817)
  [`3be0ec786219`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3be0ec786219) -
  Added data test preview source
- Updated dependencies

## 77.7.1

### Patch Changes

- [#67886](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67886)
  [`18c0c2f52a54`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/18c0c2f52a54) -
  CXP-2880 remove isBannedLocalPreview state from fileCard

## 77.7.0

### Minor Changes

- [#66422](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66422)
  [`e26fc35ce110`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e26fc35ce110) -
  [CXP-2840] Added `DateOverrideContext` to fix inconsistent creation time in film strip
  (JRACLOUD-77568)

## 77.6.7

### Patch Changes

- [#65749](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65749)
  [`1b2e73df14b4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1b2e73df14b4) -
  Updated Preview Hook usage
- Updated dependencies

## 77.6.6

### Patch Changes

- [#62664](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62664)
  [`d9ad2c26fedf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d9ad2c26fedf) -
  Media Card uses preview hook from public package

## 77.6.5

### Patch Changes

- [#61878](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61878)
  [`7392ec59e8d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7392ec59e8d7) -
  Reorganised preview resolution logic in preview hook

## 77.6.4

### Patch Changes

- [#61611](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61611)
  [`fd753abb6b83`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fd753abb6b83) -
  [ED-21557] Add optional chaining in the unsubscribe to avoid tests cases failing in React 18

## 77.6.3

### Patch Changes

- [#61545](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61545)
  [`7eff3f03b521`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7eff3f03b521) -
  Reorganised logic of Previe Hook

## 77.6.2

### Patch Changes

- [#60690](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60690)
  [`4a6ece928910`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4a6ece928910) -
  [ux] Media Inline Card displays the file name when failed to process and enables Media Viewer to
  download it

## 77.6.1

### Patch Changes

- [#60393](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60393)
  [`7f40d5c65a95`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7f40d5c65a95) -
  Isolated analytics resources for preview hook

## 77.6.0

### Minor Changes

- [#60120](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60120)
  [`90b15e5dd475`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/90b15e5dd475) -
  Extract CardView logic into individual "view" components

### Patch Changes

- [#60464](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60464)
  [`a30f9a5f3e0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a30f9a5f3e0d) -
  Removing unused dependencies

## 77.5.2

### Patch Changes

- Updated dependencies

## 77.5.1

### Patch Changes

- [#59746](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59746)
  [`8412c1b3563d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8412c1b3563d) -
  isolated dependencies of usePreviewHook (not includes analytics)

## 77.5.0

### Minor Changes

- [#59081](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59081)
  [`ddeb216a6c03`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ddeb216a6c03) -
  remove extra react loadable breakdown as it is unnecessary

## 77.4.10

### Patch Changes

- [#58827](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58827)
  [`d0041df63a34`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d0041df63a34) -
  Small code refactor

## 77.4.9

### Patch Changes

- [#57473](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57473)
  [`100f90575744`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/100f90575744) -
  Remove legacy theming logic from @atlaskit/media-avatar-picker, @atlaskit/media-card,
  @atlaskit/media-ui and @atlaskit/media-viewer.

## 77.4.8

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147)
  [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) -
  Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).
- [#58813](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58813)
  [`28b2b3f41843`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/28b2b3f41843) -
  Internal components use useMediaClient hook
- [#56822](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/56822)
  [`77f4fbf44e93`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/77f4fbf44e93) -
  ECA11Y-78: Added announce for the selected file
- [#58473](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58473)
  [`7c4103bcdc2c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7c4103bcdc2c) -
  refactored use of card dimensions and requested dimensions in card V2

## 77.4.7

### Patch Changes

- [#57119](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57119)
  [`c64d6ef23ba4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c64d6ef23ba4) -
  Replaces the return type of internal preview hook to include the attributes for the ssr script
- Updated dependencies

## 77.4.6

### Patch Changes

- [#56636](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/56636)
  [`eb1b7736ff9d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb1b7736ff9d) - Moved
  preview fetch logic from internal component into an internal hook

## 77.4.5

### Patch Changes

- [#43072](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43072)
  [`4c4278b7415`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c4278b7415) - [ux]
  CXP-2744 Bug fix preventing an infinite loop from occurring when an error occurs in inline player
- Updated dependencies

## 77.4.4

### Patch Changes

- Updated dependencies

## 77.4.3

### Patch Changes

- [#43248](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43248)
  [`38b1f08a5da`](https://bitbucket.org/atlassian/atlassian-frontend/commits/38b1f08a5da) - [ux]
  CXP-2748 Bug fix in CardV2 so that the card correctly updates the file preview when a new
  identifier is passed to the component

## 77.4.2

### Patch Changes

- [#43093](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43093)
  [`ccba4cddc23`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ccba4cddc23) - [ux]
  CXP-2736 Bug fix to ensure that a poster attribute is provided to videos for CardV2.

## 77.4.1

### Patch Changes

- Updated dependencies

## 77.4.0

### Minor Changes

- [#43014](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43014)
  [`f021d31543e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f021d31543e) - create
  useFileState hook versions of header and itemviewer, create list-v2, refactor MediaFileStateError
  to media-client-react

### Patch Changes

- [#42702](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42702)
  [`79e5ed8fac7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79e5ed8fac7) - ED-19543
  remove unused FF check
- Updated dependencies

## 77.3.0

### Minor Changes

- [#41419](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41419)
  [`251e86f3c28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/251e86f3c28) - MEX-2633
  Convert CardBase to a functional component

## 77.2.3

### Patch Changes

- Updated dependencies

## 77.2.2

### Patch Changes

- [#41659](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41659)
  [`a0c97a19dba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a0c97a19dba) - Remove
  unused utils and depreciated exports in mediaClient.
- Updated dependencies

## 77.2.1

### Patch Changes

- [#41932](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41932)
  [`756dd90f1a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/756dd90f1a3) - 1.
  Deprecate withMediaClient HOC in media-client and migrated it to media-client-react 2. clean up
  deprecated imports from media-client
- Updated dependencies

## 77.2.0

### Minor Changes

- [#41358](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41358)
  [`80f2161f1bb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/80f2161f1bb) - MEX-2581
  Convert inline player base to functional component

## 77.1.2

### Patch Changes

- [#41371](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41371)
  [`a5766038a35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5766038a35) - Fix TS
  errors in AFM
- [#41070](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41070)
  [`d86446f88c8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d86446f88c8) - The UFO
  experience is aborted if it hasn't completed when Card is unmounted
- Updated dependencies

## 77.1.1

### Patch Changes

- [#41101](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41101)
  [`eeafdcc5924`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eeafdcc5924) - fix
  platform FF not working for mediaCardV2 in SSR

## 77.1.0

### Minor Changes

- [#41033](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41033)
  [`812baef40e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/812baef40e8) - MEX-2574
  convert CardView to functional component

## 77.0.3

### Patch Changes

- [#40560](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40560)
  [`25252788c18`](https://bitbucket.org/atlassian/atlassian-frontend/commits/25252788c18) - Give the
  progress bar in media card a "progressbar" role.

## 77.0.2

### Patch Changes

- [#40353](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40353)
  [`78b51d6134c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78b51d6134c) - Fixed
  issue with media card lazy loading not working during SSR hydration

## 77.0.1

### Patch Changes

- [#39320](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39320)
  [`ec4867e1376`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec4867e1376) - Removed
  captions flag and replaced with a new media prop `allowCaptions`. `allowCaptions` is set to
  `false` by default and products will need to opt in to be able to use captions from now on.

## 77.0.0

### Major Changes

- [#39427](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39427)
  [`e6122bf1c9a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6122bf1c9a) - MEX-2481
  revert and re-introduce a new fix for media border gap issue

### Patch Changes

- Updated dependencies

## 76.2.1

### Patch Changes

- [#39787](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39787)
  [`6900f89eb0e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6900f89eb0e) - Internal
  changes to use space tokens. There is no expected visual or behaviour change.

## 76.2.0

### Minor Changes

- [#38532](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38532)
  [`7b6a2c6671b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7b6a2c6671b) -
  Introducing 'media-state' for handling media internal file state. Introducing 'media-client-react'
  to provide hooks for seamless media-client integration with React. Introducing 'MediaCardV2' with
  a feature flag to replace rxjs based fileState subscription with 'useFileState' hook. Removed
  unused feature flags APIs from 'media-client' and its helper functions from 'media-common'.

### Patch Changes

- Updated dependencies

## 76.1.2

### Patch Changes

- Updated dependencies

## 76.1.1

### Patch Changes

- [#37897](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37897)
  [`ed81e630547`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed81e630547) - MEX-2089
  Remove timestamp feature flag on AFP
- Updated dependencies

## 76.1.0

### Minor Changes

- [#36498](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36498)
  [`f486dbd535c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f486dbd535c) - MEX-2481
  Fix minor gap between image and border

### Patch Changes

- Updated dependencies

## 76.0.6

### Patch Changes

- [#35798](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35798)
  [`4807883cf8e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4807883cf8e) -
  [MEX-2468] Disable Tooltip in Media Card in Hybrid Renderer

## 76.0.5

### Patch Changes

- [#33728](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33728)
  [`48e4a655534`](https://bitbucket.org/atlassian/atlassian-frontend/commits/48e4a655534) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 76.0.4

### Patch Changes

- [#34914](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34914)
  [`8b83c75ef6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b83c75ef6d) - MEX-2382
  Fixed a bug in media card so that the card preview updates when the provided file identifier is
  different

## 76.0.3

### Patch Changes

- [#34912](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34912)
  [`5dcaf51b269`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5dcaf51b269) - removed
  unused memory cache logs
- Updated dependencies

## 76.0.2

### Patch Changes

- [#34887](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34887)
  [`bb442ced942`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bb442ced942) - Remove
  newCardExperience feature flag
- Updated dependencies

## 76.0.1

### Patch Changes

- [#34644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34644)
  [`501218d4044`](https://bitbucket.org/atlassian/atlassian-frontend/commits/501218d4044) - MEX-2393
  fix error setting in subscribe method in media-inline

## 76.0.0

### Major Changes

- [#34192](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34192)
  [`9fe30b8ca24`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fe30b8ca24) - Removed
  classic experience
- [`3247424b653`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3247424b653) - Removed
  the classname 'fileCardImageViewSelectedSelector' since it is no longer being used

### Minor Changes

- [`3239a550cb6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3239a550cb6) - Add
  analytics succeeded and failed render event for mediaInlineCard.

### Patch Changes

- [`e725edbb0d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e725edbb0d9) - Card
  goes to ‘processing’ status instead of ‘completed’ when a file is in processing and it is
  identified as non previewable (removed feature flag to make it a permanent change)
- Updated dependencies

## 75.0.1

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 75.0.0

### Major Changes

- [#33771](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33771)
  [`8c6a6cf4bc4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c6a6cf4bc4) - Media
  Card now only accepts a list of items for Media Viewer, no longer collection name

### Patch Changes

- [`6fd9d7aeaec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6fd9d7aeaec) - Fixed
  Inline Card file state handling
- [`eb4991f04b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb4991f04b4) - Removed
  unused util
- Updated dependencies

## 74.8.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 74.8.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 74.7.4

### Patch Changes

- [#33004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33004)
  [`5c6e8f7b846`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c6e8f7b846) - -
  refactored card file states example
  - added inline card file states example
- [`e8bb5592bf8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e8bb5592bf8) - MEX-2140
  Refactor error boundary of media inline card
- Updated dependencies

## 74.7.3

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils
- [`0f99ed9df35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0f99ed9df35) - Updated
  example
- Updated dependencies

## 74.7.2

### Patch Changes

- [#31891](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31891)
  [`31717a1fe63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/31717a1fe63) - Fix the
  bug when clicking on media inline files in Hybrid Renderer, viewer is not opening.

## 74.7.1

### Patch Changes

- [#31299](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31299)
  [`b37723f2cfa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b37723f2cfa) - The
  component now logs the full provided feature flags object
- Updated dependencies

## 74.7.0

### Minor Changes

- [#30248](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30248)
  [`8a0a92b2885`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a0a92b2885) - MEX-2210
  improve inconsistent behaviour on timestampOnVideo playback
- [`c3eba8c788d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3eba8c788d) -
  Deprecation notice: Media Card and Inline Card no longer accept a collection name as a data source
  for Media Viewer. Integrators should pass the full list of files to browse through the new
  "mediaViewerItems" property.

### Patch Changes

- Updated dependencies

## 74.6.1

### Patch Changes

- [#30963](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30963)
  [`489f7b32ff6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/489f7b32ff6) - Fixed
  broken SSR error handling logic when the preview url fails to load

## 74.6.0

### Minor Changes

- [#29470](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29470)
  [`dbd7cd19fe6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dbd7cd19fe6) - Media
  Card now fetch the preview immediately after mounting, without waiting for file state to be ready

### Patch Changes

- [`337bec022b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/337bec022b4) - Fixes
  logic for upfront preview
- Updated dependencies

## 74.5.2

### Patch Changes

- Updated dependencies

## 74.5.1

### Patch Changes

- [#29227](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29227)
  [`4ee60bafc6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ee60bafc6d) -
  ED-16603: Remove tooltips from VR tests and make them opt in. To opt-in, add `allowedSideEffects`
  when loading the page.

## 74.5.0

### Minor Changes

- [#28932](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28932)
  [`2b3859896cc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2b3859896cc) - Added
  new Feature Flag to control internal Media Client behaviour

### Patch Changes

- [`9b6f1d2a9c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b6f1d2a9c3) - Fix
  compatility issue of Intersection Observer API in old browser versions
- [`925df13094d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/925df13094d) - Card
  goes to ‘processing’ status instead of ‘completed’ when a file is in processing and it is
  identified as non previewable
- Updated dependencies

## 74.4.1

### Patch Changes

- [#28374](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28374)
  [`6adc56f320d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6adc56f320d) -
  [MEX-2003] Fix dark mode regression in new card experience
- Updated dependencies

## 74.4.0

### Minor Changes

- [#28090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28090)
  [`81573c1dfa7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81573c1dfa7) - Media
  Card logs metadata trace Id
- [`0bccac57db6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0bccac57db6) - remove
  mediaUploadApiV2 Feature flag

### Patch Changes

- [`5f36954436c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f36954436c) - Ensure
  all secondary errors from backend responses are logged in media card
- [`2b5f5a740d3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2b5f5a740d3) - [ux]
  catch unexpected error in media card error boundary with a fallback error component and fire
  analytics event
- [`8b373447406`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b373447406) - Updated
  names for Media card examples and updated their references.
- [`f36a3d972cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f36a3d972cf) - Updated
  Media-Card documentation with new tab structure and simpler usage example
- [`3d40d5e9b37`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3d40d5e9b37) - Adopt
  updated version of getRandomHex function for generating traceId
- Updated dependencies

## 74.3.2

### Patch Changes

- Updated dependencies

## 74.3.1

### Patch Changes

- Updated dependencies

## 74.3.0

### Minor Changes

- [#26712](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26712)
  [`6de3a9494a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6de3a9494a8) - [ux]
  Instrumented `@atlaskit/media-card` with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in
  alpha). These changes are intended to be interoperable with the legacy theme implementation.
  Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- [`5eb06146a4e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5eb06146a4e) - Added
  support traceContext to be supplied to all request endpoint points.
- Updated dependencies

## 74.2.0

### Minor Changes

- [#25860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25860)
  [`2c402e87213`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c402e87213) -
  [Experimental] Add traceId in media card get image request.

### Patch Changes

- [`bf8302c838a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf8302c838a) -
  Implemented internal functionality to create local video preview.
- Updated dependencies

## 74.1.9

### Patch Changes

- [#26241](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26241)
  [`d2cde0ebdfd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2cde0ebdfd) - fix
  editor cypress tests and delete media cypress tests

## 74.1.8

### Patch Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710)
  [`153829bfcb3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/153829bfcb3) - Upgrade
  caching algorithm library lru-fast to lru_map.
- [`09464edc105`](https://bitbucket.org/atlassian/atlassian-frontend/commits/09464edc105) - ⚠️ Big
  Folder Structure Refactor
- [`60fb320493e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/60fb320493e) - Fixed
  circular imports
- [`9f23fe7478e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f23fe7478e) - Fixed
  Card Actions Dropdown Menu positioning
- [`2f2daf58c20`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2f2daf58c20) - Add
  `testId` to components to help with testing. No change in behaviour.
- Updated dependencies

## 74.1.7

### Patch Changes

- [#25642](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25642)
  [`ca22e26cd7c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ca22e26cd7c) - Fix
  image refetch logic when image dimensions change.

## 74.1.5

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 74.1.4

### Patch Changes

- [#25450](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25450)
  [`80a1ca7b589`](https://bitbucket.org/atlassian/atlassian-frontend/commits/80a1ca7b589) - Fix
  compatility issue of Intersection Observer API in old browser versions

## 74.1.3

### Patch Changes

- [#24818](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24818)
  [`46059beebbf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/46059beebbf) - -
  include **tests_external** in build
  - replace usage of @local-cypress package with @cypress
  - bump @cypress from ^6.4.0 to ^7.7.0
  - import cypress types into @atlaskit/in-product-testing tsconfig

## 74.1.2

### Patch Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004)
  [`f9fee1fbf49`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f9fee1fbf49) - Use
  react lazy to avoid pulling InlinePlayer component code if it is not being used on a page
- Updated dependencies

## 74.1.1

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 74.1.0

### Minor Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`a332288b5ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a332288b5ea) - Added
  analytics for media-card memoryCacheLogging and added relevant featureFlag keys for media-common
  package.

### Patch Changes

- [`baece961cdd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/baece961cdd) - Add
  media-card example for use by media-pollinator-test
- [`2285a60dc65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2285a60dc65) - Logs
  events when status is error, even if there is no error data
- [`196bfa84bfd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/196bfa84bfd) - Removed
  custom anchors from ViewportObserver in favour of IntersectionObserver's rootMargin
- Updated dependencies

## 74.0.0

### Major Changes

- [#22642](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22642)
  [`13d807ed06f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/13d807ed06f) -
  [MEX-1027] Migrate to @emotion/react in Media-card

### Minor Changes

- [`974e87d133a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/974e87d133a) -
  [MEX-1574] Updated fetching for caching images

### Patch Changes

- [`e3d4c39b20c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3d4c39b20c) - Remove
  version.json file. Use injected package name and version from environment variable instead.
- Updated dependencies

## 73.8.0

### Minor Changes

- [#22029](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22029)
  [`01203d58916`](https://bitbucket.org/atlassian/atlassian-frontend/commits/01203d58916) - Removed
  Unnecessary semicolon found in media-card
- [`1a76e2839e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a76e2839e6) - Default
  value for mediaUploadApiV2 Media feature flag set to true.

### Patch Changes

- [`cccc7370667`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cccc7370667) -
  [MEX-1633] Removed unused Loading Rate Limited Component
- Updated dependencies

## 73.7.0

### Minor Changes

- [#21570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21570)
  [`bfde909c9b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bfde909c9b4) - Add new
  feature flag mediaUploadApiV2
- [`ed6cdd2d397`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed6cdd2d397) - added
  onfullscreenchange property to media to avoid triggering table resizing when media is in full
  screen mode

### Patch Changes

- [`35e43fcc798`](https://bitbucket.org/atlassian/atlassian-frontend/commits/35e43fcc798) - Minor
  bug fix for feature flag names in experience parameters
- [`83036ef87f1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/83036ef87f1) - fix
  mouse cursor style when hovered over linked image
- [`c3d85388bc6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3d85388bc6) - fix
  media card titlebox cursor
- [`c2ede50a80a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2ede50a80a) - Add
  media region and environment returned from media API response into failed analytic events.
- [`e21e5c271b7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e21e5c271b7) - Enabled
  UFO logger for all examples of Media-Card
- Updated dependencies

## 73.6.0

### Minor Changes

- [#20721](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20721)
  [`b4fd2a59367`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4fd2a59367) - Attach
  media environment and region to the media-card UFO events
- [`7e767393469`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e767393469) - Add ufo
  feature flag logging to `media-card`
- [`ade1a5c3e23`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ade1a5c3e23) - Flagged
  events with file states processing and uploading for UFO payload

### Patch Changes

- [`bf0e7c8e46b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf0e7c8e46b) -
  [MEX-1413] Hot fix for remove useMediaPickerAuthProvider flag
- [`79c431ca1a6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c431ca1a6) - Removed
  "Creating Preview" message for files already processed
- [`f87afac53b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f87afac53b3) - Add ufo
  logging for media-card
- Updated dependencies

## 73.5.1

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4
- Updated dependencies

## 73.5.0

### Minor Changes

- [#20033](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20033)
  [`02fb8e78fb9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/02fb8e78fb9) -
  Implement media card render UFO experience

### Patch Changes

- [`3ef794dc11f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3ef794dc11f) - Removed
  emoji and media packages dependencies from renderer initial load.
- [`7948702bf56`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7948702bf56) - Fixing a
  bug where sometimes the media card pre-load indicator is given 100% height and renders over other
  components. It now has a max height of 0 and is not a click target
- [`065ae19cb44`](https://bitbucket.org/atlassian/atlassian-frontend/commits/065ae19cb44) - Enforced
  "up to date" logged feature flags via type checks
- Updated dependencies

## 73.4.2

### Patch Changes

- [#20471](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20471)
  [`c102bb59f41`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c102bb59f41) - Viewport
  detector needs to have absolute positioning so that it does not cause scroll bars in firefox when
  rendered in a table with a link.

## 73.4.1

### Patch Changes

- [#20369](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20369)
  [`de7e2ff674e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/de7e2ff674e) - Applies
  a fix to ensure that the media card viewport detector is never a click target

## 73.4.0

### Minor Changes

- [#19618](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19618)
  [`e7581c27aff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7581c27aff) - Removed
  unused dev dependencies
- [`f862d5ae7aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f862d5ae7aa) - remove
  RxJs peer dependency
- [`118f3af101f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/118f3af101f) - Media
  Client APIs has been updated to use MediaSubscribable which provides subscription functionality
  (similar to RxJs observables). It exposes subscribe method that is called with MediaObserver as an
  argument and returns MediaSubscription. MediaSubscription exposes unsubscribe method.

  getFileState: The returned type of this function has changed from RxJs ReplaySubject to
  MediaSubscribable.

  ```
  import { MediaClient, MediaObserver, MediaSubscribable, MediaSubscription } from '@atlaskit/media-client';

  const mediaClient = new MediaClient({ authProvider });

  const fileStateSubscribable: MediaSubscribable<FileState> = mediaClient.file.getFileState(id);

  const mediaObserver: MediaObserver<FileState> = {
    next: (fileState) => {
      nextCallback(fileState)
    },
    error: (error) => {
      errorCallback(error)
    },
  };

  const subscription: MediaSubscription = fileStateSubscribable.subscribe(mediaObserver);

  subscription.unsubscribe();
  ```

  upload: The returned type of this function has changed from RxJs ReplaySubject to
  MediaSubscribable.

  ```
  import { MediaClient, MediaObserver, MediaSubscribable, MediaSubscription } from '@atlaskit/media-client';

  const mediaClient = new MediaClient({ authProvider });

  const uploadFileSubscribable: MediaSubscribable<FileState> = mediaClient.file.upload(uploadableFile);

  const mediaObserver: MediaObserver<FileState> = {
    next: (fileState) => {
      nextCallback(fileState)
    },
    error: (error) => {
      errorCallback(error)
    },
  };

  const subscription: MediaSubscription = uploadFileSubscribable.subscribe(mediaObserver);

  subscription.unsubscribe();
  ```

  getItems: The returned type of this function has changed from RxJs ReplaySubject to
  MediaSubscribable.

  ```
  import { MediaClient, MediaObserver, MediaSubscribable, MediaSubscription } from '@atlaskit/media-client';

  const mediaClient = new MediaClient({ authProvider });

  const collectionItemsSubscribable: MediaSubscribable<MediaCollectionItem[]> = mediaClient.collection.getItems(collectionName);

  const mediaObserver: MediaObserver<MediaCollectionItem[]> = {
    next: (items) => {
      nextCallback(items)
    },
    error: (error) => {
      errorCallback(error)
    },
  };

  const subscription: MediaSubscription = collectionItemsSubscribable.subscribe(mediaObserver);

  subscription.unsubscribe();
  ```

### Patch Changes

- Updated dependencies

## 73.3.2

### Patch Changes

- [#19796](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19796)
  [`4f97dd898fc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f97dd898fc) -
  EDM-2995: fix media inline icon, use mimeType to render a better icon type
- Updated dependencies

## 73.3.1

### Patch Changes

- [#19569](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19569)
  [`9671dfa12b1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9671dfa12b1) - Revert
  [MEX-1276] fix vertical scroll for firefox when media link is wrapped

## 73.3.0

### Minor Changes

- [#19019](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19019)
  [`7d8e24c4dcd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d8e24c4dcd) - Log
  reliability of Media Card SSR

### Patch Changes

- Updated dependencies

## 73.2.0

### Minor Changes

- [#18526](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18526)
  [`3ad0bbf0f93`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3ad0bbf0f93) - Log
  media ssr getImageURLSync error in global variable ssr data.
- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`1dcf16cb69e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1dcf16cb69e) - Reuse
  image url from server when hydrates and refetch if dimensions in client are bigger
- [`a5cabf7f670`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5cabf7f670) - Made
  InlinePlayer compatible with SSR

### Patch Changes

- [`46cd0dfed6f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/46cd0dfed6f) - Removed
  duplicated commenced event
- [`5571b079998`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5571b079998) - Added
  example using FileState Factory helper
- [`116ae9cd4fe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/116ae9cd4fe) - Update
  SSR example with media single in stretchy-fit mode.
- [`42485996554`](https://bitbucket.org/atlassian/atlassian-frontend/commits/42485996554) - vr tests
  for ssr cases
- [`a31422c7a74`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a31422c7a74) - MEX-1194
  introduce cursor states to media card
- [`af3fcc847ce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/af3fcc847ce) - Improved
  filestate simulations example
- [`8fd03048678`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8fd03048678) - Added
  example and test for media ssr usage in renderer
- Updated dependencies

## 73.1.1

### Patch Changes

- [#18528](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18528)
  [`9ca8f7e9d74`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9ca8f7e9d74) - Revert
  extra image visibility style for media card

## 73.1.0

### Minor Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - [ux]
  Displaying the control bar including the timestamp by default for videos that have been processed.

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - fix
  percent width on media-card
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Refactor
  solution for fixing media card images overlaps with creating preview message
- [`e221ee215e7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e221ee215e7) - fix
  vertical scroll for firefox when media link is wrapped
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Improved
  card lazy offset
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Add
  media node updater to media inline node
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - show
  progress bar for inline player when videos is uploading
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Adding a
  feature flag for TimestampOnVideo
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Fix
  cardview issue with creating preview text overlaps with image in safari"
- Updated dependencies

## 73.0.0

### Major Changes

- [#14810](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14810)
  [`47f58da5946`](https://bitbucket.org/atlassian/atlassian-frontend/commits/47f58da5946) -
  ED-13322, ED-13324, ED-13326, ED-13323, ED-13204: Upgrade and support react-intl@^5.18.1 including
  breaking API changes, types and tests in atlassian-frontend packages

  What changed: Upgraded our react-intl support from ^2.6.0 to ^5.18.1. This means editor packages
  now rely on consumers installing ^5.18.1, otherwise editor usage of react-intl will mismatch with
  actual installed react-intl APIs. Why change was made: As part of a coordinated upgrade effort
  across AF packages, as react-intl v2 is quite dated. How consumer should update their code: Ensure
  react-intl ^5.18.1 is installed in consuming applications.

  Upgrade guide: To consume atlassian-frontend packages that use react-intl5 setup a second provider
  for the new version, using an npm alias

  ```js
  "react-intl": "^2.6.0",
  "react-intl-next": "npm:react-intl@^5.18.1",
  ```

  ```js
  import { IntlProvider } from 'react-intl';
  import { IntlProvider as IntlNextProvider } from 'react-intl-next';

  return (
  	<IntlProvider
  		key={locale}
  		data-test-language={locale}
  		locale={locale}
  		defaultLocale={DEFAULT_LOCALE}
  		messages={messages}
  	>
  		<IntlNextProvider
  			key={locale}
  			data-test-language={locale}
  			locale={locale}
  			defaultLocale={DEFAULT_LOCALE}
  			messages={messages}
  		>
  			{children}
  		</IntlNextProvider>
  	</IntlProvider>
  );
  ```

### Patch Changes

- Updated dependencies

## 72.1.0

### Minor Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`1724e1b8277`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1724e1b8277) - Added
  SSR capabilities to Media Card
- [`ca519a86b1d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ca519a86b1d) - Add new
  prop forceSyncDisplay in MediaImage to provide an option of always showing images. Enable
  MediaCard to turn on forceSyncDisplay when server side rendering is enabled.
- [`ac4846d0f3f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac4846d0f3f) - Added
  native lazy load support

### Patch Changes

- [`fc70978492a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc70978492a) - Using
  type for SSR prop to reduce dependency on media-common
- [`dc1f9d42903`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc1f9d42903) - Fixed
  error message logic
- [`27c61b8cdd8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/27c61b8cdd8) - revert
  CardSSRView component
- [`12bfc09a21e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12bfc09a21e) - Fixing
  internal prop calls for testId and removing references to the old DropdownMenuStateless export
  when using the new default export.
- [`2b24fcc59f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2b24fcc59f2) - Removed
  Code Viewer and Zip Previews Feature Flags
- [`bccde8a4127`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bccde8a4127) - Update
  dependency of dropdown menu to the lite mode version. Update all usages to cater to the new API.
  The padding within dropdown menu items is 8px more, which makes the menu look bigger.
- [`3a56ce8792b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a56ce8792b) - [ux]
  Show selected for mediaInline in other states
- [`f461edcfd05`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f461edcfd05) - Update
  CardLoader to use react-loadable Add SSR feature prop to be passed in renderer and media card
- Updated dependencies

## 72.0.0

### Major Changes

- [#14777](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14777)
  [`b3606652fa1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3606652fa1) - [ux]
  Editor integration for Media Inline component

### Minor Changes

- [`269ee940b87`](https://bitbucket.org/atlassian/atlassian-frontend/commits/269ee940b87) - redesign
  error UI on new media card experience

### Patch Changes

- [`a81fdad4b7b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a81fdad4b7b) -
  Refactored the internal status logic based on file processing status and preview render outcome
- [`b51fc0a9062`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b51fc0a9062) -
  Refactored internal helpers to match common type definitions from Media Client
- [`ebad8bc86e5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ebad8bc86e5) - Moved
  analytics from image renderer to root component
- [`fe9ced0cd70`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe9ced0cd70) - Removed
  feature flags for polling settings
- Updated dependencies

## 71.0.0

### Major Changes

- [#14319](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14319)
  [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - [ux]
  Updated and refreshed media inline component

### Minor Changes

- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - [ux]
  Skip forward and backward buttons are added to inline media player
- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - Added
  analytics event to track total impressions of successfully rendered mediacards

### Patch Changes

- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - Adding
  lazy loading as the default for the SSR media card
- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - fix
  modification for media card flow example
- [`f3547c79d81`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3547c79d81) - Updated
  in-code comment
- Updated dependencies

## 70.11.0

### Minor Changes

- [#13864](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13864)
  [`5559b9ca1b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5559b9ca1b4) - Media
  CardView component renders consistent views in error and failed-processing status regardless of
  thumbnail image.
- [`9ecd471f124`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9ecd471f124) - Adding a
  dedicated server side media card
- [`ab905c0e924`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ab905c0e924) - [ux]
  EDM-1641: add floating toolbar to media card and view switcher for inline view
- [`46d9d2872b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/46d9d2872b4) - Video
  Analytics - Add UI events for CustomMediaPlayer

### Patch Changes

- [`d0357a98b97`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0357a98b97) - Small
  code refactor
- [`4777a174e6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4777a174e6d) - Added
  analytics support for customMediaPlayer + screen event + entrypoint for locales
- [`b77bfe8e99c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b77bfe8e99c) - Add
  performance attributes to Commenced, Succeeded, Failed events for media card
- [`2debd2fdf3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2debd2fdf3d) - Remove
  the default type icon rendered in media card background
- [`26ef709f133`](https://bitbucket.org/atlassian/atlassian-frontend/commits/26ef709f133) -
  Refactored Copy & Commenced Analytics events
- [`b90c0237824`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b90c0237824) - Update
  package.jsons to remove unused dependencies.
- [`493b1b43d50`](https://bitbucket.org/atlassian/atlassian-frontend/commits/493b1b43d50) - Modify
  file card flow example
- [`e7d1eb5cd0a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7d1eb5cd0a) - handle
  loading-preview status for card view
- Updated dependencies

## 70.10.0

### Minor Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302)
  [`710e03c4b58`](https://bitbucket.org/atlassian/atlassian-frontend/commits/710e03c4b58) - Revert
  Image Render Analytics Refactoring
- [`8e6a1034cfd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8e6a1034cfd) -
  EDM-1730: added in-product Cypress tests for Smart Links

### Patch Changes

- [`6869256538b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6869256538b) - Handling
  card preview fetch from a separated internal module
- Updated dependencies

## 70.9.0

### Minor Changes

- [#12837](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12837)
  [`fb1ca71dd2c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb1ca71dd2c) - Render a
  spinner in the background of CardView component when card status is loading

### Patch Changes

- [`254c7ae04bc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/254c7ae04bc) - Refactor
  CardView in Media Card to group UI elements by status
- [`8f76b747198`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f76b747198) - fix:
  default return for internal render config function
- Updated dependencies

## 70.8.1

### Patch Changes

- [#12328](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12328)
  [`99d444aac1b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/99d444aac1b) - Replaced
  metadata object for fileState in Card internal state.
- [`99411613963`](https://bitbucket.org/atlassian/atlassian-frontend/commits/99411613963) - Render
  spinner while waiting for card component to mount
- Updated dependencies

## 70.8.0

### Minor Changes

- [#11649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11649)
  [`42c7f13ac31`](https://bitbucket.org/atlassian/atlassian-frontend/commits/42c7f13ac31) - export
  inlinePlayerClassName export newFileExperienceClassName

### Patch Changes

- [`8cba1694b5e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cba1694b5e) - Remove
  pollingMaxFailuresExceeded error from implementation and feature flags
- Updated dependencies

## 70.7.3

### Patch Changes

- [#11778](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11778)
  [`9e09b407b43`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e09b407b43) - Exclude
  `__tests_external__` from the `build/tsconfig.json`. Add `local-cypress` and remove types export.

## 70.7.2

### Patch Changes

- [#11723](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11723)
  [`070261ec304`](https://bitbucket.org/atlassian/atlassian-frontend/commits/070261ec304) - Fix
  Cypress types for packages

## 70.7.1

### Patch Changes

- [#11113](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11113)
  [`3cd9ee2d15b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cd9ee2d15b) - Added
  RxJS compatiblity notice in Media docs
- [`6be6879ef6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6be6879ef6d) - Added
  Media Feature Flags control in examples
- [`47ebd02a8d1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/47ebd02a8d1) - Removed
  lazy load logic from root component
- Updated dependencies

## 70.7.0

### Minor Changes

- [#10569](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10569)
  [`edafe75c2c0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/edafe75c2c0) - Expose
  new InlineMediaCard component
- [`6acd8953267`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6acd8953267) - [ux]
  Removed Retry Button from Classic Experience
- [`219ec9b60d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/219ec9b60d9) - Disable
  tooltip for images and videos without overlay

### Patch Changes

- Updated dependencies

## 70.6.0

### Minor Changes

- [#10230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10230)
  [`d575abf3498`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d575abf3498) -
  EDM-1640: Introduce Cypress in-product tests in Atlassian Frontend

  Example test:

  ```
  import { editorFundamentalsTestCollection } from '@atlaskit/editor-common/in-product';

  //code to navigate to the page

  editorFundamentalsTestCollection({}).test(cy);

  ```

### Patch Changes

- [`277ed9667b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/277ed9667b2) - Fixed
  media bundle names following atlassian-frontend linting rules
- Updated dependencies

## 70.5.1

### Patch Changes

- [#9510](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9510)
  [`859f4e95fb7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/859f4e95fb7) - Fires
  analytics events from an internal module
- [`a8c69bc44f9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a8c69bc44f9) - Log
  analytics events for errors thrown from preview fetch
- [`abc38bc9990`](https://bitbucket.org/atlassian/atlassian-frontend/commits/abc38bc9990) - Added
  request metadata to failed frontend SLIs
- Updated dependencies

## 70.5.0

### Minor Changes

- [#9083](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9083)
  [`56104b9cc12`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56104b9cc12) - add
  data-testid="media-card-play-button" for video files on preview mode

### Patch Changes

- [`d933aa659a2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d933aa659a2) - Removed
  feature that integrates processing times in the uploading progress bar for a reduced amount of
  file types
- Updated dependencies

## 70.4.0

### Minor Changes

- [#8644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8644)
  [`f0a900eb563`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f0a900eb563) - [ux]
  Added option for products to enable download button MediaCard when a user hovers over a card.
- [`ceb8a18d7dd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ceb8a18d7dd) -
  Filtering Feature Flags when attaching them to Analytics Context through the HOC
- [`e66ffd11ac6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e66ffd11ac6) -
  Refactored Analytics Events. Slight differences in payloads and contexts

### Patch Changes

- [`a0dcbc9b0a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a0dcbc9b0a3) - Media
  Card now logs "unsupported" amalytics events accordingly, instead of "succeeded" events
- [`f7f301ec851`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7f301ec851) - Media
  Card logs errors regardless of the existence of a preview to display
- [`19302000a1a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19302000a1a) - Reverted
  "unsupported" analytics events
- [`0d0e72f74bb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0d0e72f74bb) - Included
  feature flag "captions" in analytics events
- [`e62066560fb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e62066560fb) - Removed
  fileSource attributes from operational SLIs
- [`cf080faf650`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf080faf650) -
  Refactored fail reasons and error constants in render analytics events
- [`37d4add135f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37d4add135f) - Use of
  Media Client Errors test helpers
- Updated dependencies

## 70.3.3

### Patch Changes

- [#8178](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8178)
  [`5380459f37b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5380459f37b) - [ux]
  Play icon on media video player has been adjusted in size to better match ADG
- Updated dependencies

## 70.3.2

### Patch Changes

- [#7425](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7425)
  [`1f4d55e86a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f4d55e86a) - Minor
  syntax fix
- [`7e990a036d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e990a036d) - Removed
  Feature Flag Control from Card View Matrix example
- [`63bff65641`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63bff65641) - [ux]
  Making the VidPlayButton bigger
- Updated dependencies

## 70.3.1

### Patch Changes

- [#7170](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7170)
  [`758aa08653`](https://bitbucket.org/atlassian/atlassian-frontend/commits/758aa08653) - Polling
  Fuction throws the inner error instead of wrapping it
- [`0553f6db92`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0553f6db92) - Styled
  components code refactor
- [`b37190888c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b37190888c) - ensure
  polling errors trigger more graceful UX
- [`bacab2338b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bacab2338b) - Updated
  error message displayed when a Polling Error has been thrown
- [`a26afbd493`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a26afbd493) - Added
  getMediaClientFailReason() helper
- [`7c44d1e585`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c44d1e585) - Fixed
  cards with non web-friendly MP4/MOV videos not mounting
- [`8dfcc55dce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8dfcc55dce) - Refactored
  error enums to be types for code clarity
- [`ab48ad8249`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ab48ad8249) - Better
  segmentation on file uri fail reason analytics event
- [`19b3e0f0a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19b3e0f0a0) - ensure
  card renders empty files correctly
- [`9a8ea15989`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a8ea15989) -
  Standarized Icon Message for Rate Limited Error
- Updated dependencies

## 70.3.0

### Minor Changes

- [#6930](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6930)
  [`56693486a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56693486a3) - [ux] Rate
  Limited UI for the MediaViewer. Also moved a MediaCard function into MediaClient so that that
  functionality can be used across multiple packages

### Patch Changes

- [`2b7746c631`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2b7746c631) - Disable
  progress bar while processing in classic card
- [`4c699cc1cb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c699cc1cb) - Adding VR
  tests for Rate Limited UI states
- Updated dependencies

## 70.2.0

### Minor Changes

- [#6571](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6571)
  [`11d6640e9c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/11d6640e9c) - [ux] New
  UI states for when a card is rate limited
- [`48995f73b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/48995f73b2) - Create
  entry points to export internal API isolated from UI changes.

### Patch Changes

- [`7736346d88`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7736346d88) - Added
  strongly typed errors to Media Client
- [`aac5527ec8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aac5527ec8) -
  standardise data test attributes for media-card classic/new UX
- Updated dependencies

## 70.1.1

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 70.1.0

### Minor Changes

- [#6228](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6228)
  [`aac7ffcb97`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aac7ffcb97) - [ux] While
  a file has a 'processing' filestate, we now alert the user that we are creating the preview. This
  signifies to the user that they can download & view a file while the preview is being generated
  (i.e they don't have to wait). Also added a 'Failed Processing' UI state, for when a preview
  cannot be generated and is thus unavailable

### Patch Changes

- [`b124464476`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b124464476) - Fixing
  bug. Text should be "Preview unavailable" not "Preview Unavailable"
- [`a1c2bf2e45`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1c2bf2e45) - pass
  originalDimensions to inline video player
- Updated dependencies

## 70.0.0

### Major Changes

- [#5860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5860)
  [`dc8f998c1c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc8f998c1c) - Added
  visual regression tests for media-cards. Also created a new examples page specifically for these
  VR tests
- [`f4a2c533f4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f4a2c533f4) - Fix wrong
  dependency

### Patch Changes

- Updated dependencies

## 69.5.0

### Minor Changes

- [#5516](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5516)
  [`669b5e4240`](https://bitbucket.org/atlassian/atlassian-frontend/commits/669b5e4240) - Add
  support for specifying background colour and icon for the title box

### Patch Changes

- [`3f0dd38c9d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f0dd38c9d) - BMPT-626
  Fixed fetching remote preview for non-supported documents in classic Media Card experience
- [`bf98a47a0f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf98a47a0f) - Enhance
  polling strategy to limit to finite attempts with timing backoff
- Updated dependencies

## 69.4.2

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 69.4.1

### Patch Changes

- Updated dependencies

## 69.4.0

### Minor Changes

- [#4749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4749)
  [`ae50a98f18`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae50a98f18) - ED-9125
  ED-8837 Update styles for selected media cards

  - Use editor selection styles from @atlaskit/editor-shared-styles
  - Update UI for selected items in media group to no longer set blue background and tick in corner
  - No longer set set text selection over filename, filesize etc. for media group cards when
    selected with Cmd + A or via a range selection

- [`7d831363d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d831363d9) - Migrated
  to declarative entry points

### Patch Changes

- Updated dependencies

## 69.3.3

### Patch Changes

- [#5076](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5076)
  [`56eff9f60d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56eff9f60d) - Fixed card
  previews failing in new Jira attachments experience (affects @atlaskit/media-card@69.2.2 onwards)

## 69.3.2

### Patch Changes

- [#4647](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4647)
  [`631412a7f6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/631412a7f6) - Revert
  usage of flex for media card UI

## 69.3.1

### Patch Changes

- Updated dependencies

## 69.3.0

### Minor Changes

- [#4424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4424)
  [`a106c17833`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a106c17833) - Adds
  support for Intl in Media Card Date
- [`8fc5fe20df`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8fc5fe20df) - Inline
  video player as part of the card and video player in media-viewer will now store last viewed
  position between sessions for given media id

### Patch Changes

- [`0caa7daade`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0caa7daade) - Ensurer
  MediaCard passes featureFlags to MediaViewer
- [`a7a0a8ea67`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a7a0a8ea67) - Adds tests
  for TitleBox component
- [`21b9d3d336`](https://bitbucket.org/atlassian/atlassian-frontend/commits/21b9d3d336) - Fixed
  RAR/non-ZIP files not recognised as archives
- [`e5d5875710`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5d5875710) - Fixes
  attach of default IntlProvider
- Updated dependencies

## 69.2.1

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 69.2.0

### Minor Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823)
  [`65652ba165`](https://bitbucket.org/atlassian/atlassian-frontend/commits/65652ba165) - Added 15
  new icons based on the mimetype (.sketch, .gif, ect). Previously, we only had 6 icons based on the
  mediaType (doc/audio/unknown/image/video). Also created a dedicated examples page for icons
- [`48f416a9d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/48f416a9d9) - Exporting
  new css class name for cardImageView: fileCardImageViewSelector
- [`6faafb144c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6faafb144c) - Introduce
  MediaFeatureFlags. Refactor components to use.
- [`861d585ba8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/861d585ba8) - Changed
  mediaSingle to now render it's child adf nodes using nodeviews rather than directly with react
- [`2202870181`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2202870181) - Added
  support for zip previews in media viewer

### Patch Changes

- [`54ba7a137a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54ba7a137a) - Use
  IntersectionObserver when isLazy is true in media-card
- [`3a188fc905`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a188fc905) - Fixed
  error when using empty mimeType in media examples
- [`c026e59e68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c026e59e68) - Move
  truncateText helper from media-card to media-ui and expose entry point. Export optional NameCell
  component from MediaTable.
- [`bfaa99bb5d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bfaa99bb5d) - Fixed
  responsiveness for Failed To Load message (i18n)
- [`878d4126c2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/878d4126c2) - Added mime
  types supported by Media API file preview
- [`fa6fb5dfbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa6fb5dfbb) - Removing
  unused code to be published
- [`d9ca530258`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9ca530258) - Retry
  button stops propagation of the event
- [`caf46c7c45`](https://bitbucket.org/atlassian/atlassian-frontend/commits/caf46c7c45) - Improved
  remote preview functionality for media-card redesign. Breaking change: renamed type of argument
  "SourceFile" to "CopySourceFile" in the method "copyFile" of media-client.
- [`87434f6a18`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87434f6a18) - Removed
  unneeded styles
- [`838f711196`](https://bitbucket.org/atlassian/atlassian-frontend/commits/838f711196) - fix
  blanket styles to ensure is visible
- [`4f70769fe1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f70769fe1) - Minor CSS
  update to vertically center image in media-card
- [`89a1c63251`](https://bitbucket.org/atlassian/atlassian-frontend/commits/89a1c63251) - Add the
  rowProps property, which enables consumers to apply properties to the underlying row component.
  Move truncateText helper from media-card to media-ui and expose entry point. Export optional
  NameCell component from MediaTable.
- [`16f000d172`](https://bitbucket.org/atlassian/atlassian-frontend/commits/16f000d172) - Set
  isCardVisible to true if local cache is available from the beginning
- [`367c2fd66d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/367c2fd66d) - Fixed
  example
- [`87459b57ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87459b57ba) - Fixed
  insertion failure of processing file from recent files into Editor
- [`2b1ad94f17`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2b1ad94f17) - Hides
  Titlebox when Media Single uploads
- Updated dependencies

## 69.1.0

### Minor Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`50d947cdae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50d947cdae) - Added
  Media Card New Experience behind a feature flag
- [`8502dcbdaa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8502dcbdaa) - Adding
  icons for media-card new experiences
- [`f98a7a056b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f98a7a056b) - Add action
  buttons to the new media card experience
- [`34be68ad22`](https://bitbucket.org/atlassian/atlassian-frontend/commits/34be68ad22) -
  Ellipsifying the titlebox name if the length of the name overflows the mediacard width
- [`c9f617fdeb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c9f617fdeb) - Adding
  tooltip showing full file name on new media card experience

### Patch Changes

- [`8c4210797a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c4210797a) - MPT-475:
  Showing upload progress during processing of non-natively supported files
- [`7e2c17eb4a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e2c17eb4a) - Fixed
  missing title in media-card overlay during selected upload
- [`4c06f345ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c06f345ec) - Fixing
  tooltip covering retry button and excessive padding on action bar
- [`4543f920b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4543f920b0) - Disabled
  previews for redesign; fixed not initially showing a doc icon when uploading a document
- [`46417e790a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/46417e790a) - Display
  error message when the image fails to render
- [`47f865f183`](https://bitbucket.org/atlassian/atlassian-frontend/commits/47f865f183) - add
  @atlaskit/spinner to media-card
- [`f5150a43c1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5150a43c1) - Add
  truncation to title box when card has failed to load
- [`c62d2c285f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c62d2c285f) - Added
  Failed To Load Error Message to New Experience
- [`1e37fff6cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e37fff6cf) - Removed
  TemporarySucceededEvent
- [`011324f3b1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/011324f3b1) - Temporary
  patch to Analytics Events
- [`e297a94160`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e297a94160) - Fixing
  another padding issue with new media card experience
- [`ce6c20e34b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ce6c20e34b) - Removed
  duplicated Actions Bar
- [`890992ee55`](https://bitbucket.org/atlassian/atlassian-frontend/commits/890992ee55) - fixed new
  upload not showing processing progress when inserted into Editor
- [`89df1041d5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/89df1041d5) - Attach
  Media Card Feature Flags to Analytics Events
- [`95c4be11d5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/95c4be11d5) - Fix
  Analytics Events for unpreviewable files
- [`cba906d181`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cba906d181) -
  Repositioning the spinner to match the mediatypeicon
- [`31a75d4431`](https://bitbucket.org/atlassian/atlassian-frontend/commits/31a75d4431) - Prevents
  plays on a processing unsupported video
- [`f8e73cc7da`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f8e73cc7da) - Fixing new
  media-card design issues
- [`e8d2230623`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e8d2230623) - Refactors
  Tooltip implementation

## 69.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 68.0.2

### Patch Changes

- [#2763](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2763)
  [`e04c837864`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e04c837864) -
  File-state-errors should only be fired when the filestate is Error OR failed-processing
- [`5989238f54`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5989238f54) - Reuse
  existing preview in InlineVideoPlayer to prevent re renders when video is uploading
- [`3879663f8b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3879663f8b) - Replace
  use of findDOMNode with React.Ref
- Updated dependencies

## 68.0.1

### Patch Changes

- [#2443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2443)
  [`eaade3e0e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eaade3e0e3) - Added
  Feature Flag placeholder: Media Card New Experience
- Updated dependencies

## 68.0.0

### Major Changes

- [#2137](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2137)
  [`4ffbda40ca`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ffbda40ca) - Rename
  OriginalCardDimensions TS interface to NumericalCardDimensions

### Minor Changes

- [`65ee549c4c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/65ee549c4c) - ED-8836
  Make media single selected styling consistent
- [`c3b799c7eb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3b799c7eb) - add
  optional createdAt field

### Patch Changes

- [`a2ffde361d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2ffde361d) - MPT-131:
  fetch remote preview for files not supported by the browser
- [`58de72f246`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58de72f246) - Updates
  properties documentation
- [`2b8e73b021`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2b8e73b021) - Cache
  dataURIs so that there is no flickering in image when table is resized
- [`b6003252e5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6003252e5) - Remove
  unneeded FileCard Component
- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove
  unused dependencies
- Updated dependencies

## 67.2.3

### Patch Changes

- Updated dependencies

## 67.2.2

### Patch Changes

- [#1868](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/1868)
  [`128b80c4ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/128b80c4ba) - Changing
  the way error analytics are fired for unpreviewable files, as an undefined mediatype is classified
  as 'unpreviewable'- Updated dependencies

## 67.2.1

### Patch Changes

- [patch][4d8d550d69](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d8d550d69):

  remove false positive 'failed' events in Media Card for unpreviewable files- Updated dependencies
  [3b776be426](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b776be426):

- Updated dependencies
  [9e4b195732](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e4b195732):
- Updated dependencies
  [dc3bade5f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc3bade5f1):
- Updated dependencies
  [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies
  [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies
  [acc12dba75](https://bitbucket.org/atlassian/atlassian-frontend/commits/acc12dba75):
- Updated dependencies
  [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies
  [68ff159118](https://bitbucket.org/atlassian/atlassian-frontend/commits/68ff159118):
- Updated dependencies
  [1b3a41f3ea](https://bitbucket.org/atlassian/atlassian-frontend/commits/1b3a41f3ea):
- Updated dependencies
  [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
- Updated dependencies
  [7a2540821c](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a2540821c):
  - @atlaskit/media-ui@12.2.0
  - @atlaskit/toggle@8.1.7
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/checkbox@10.1.11
  - @atlaskit/webdriver-runner@0.3.4
  - @atlaskit/dropdown-menu@9.0.3

## 67.2.0

### Minor Changes

- [minor][4aca202534](https://bitbucket.org/atlassian/atlassian-frontend/commits/4aca202534):

  New data-testid added: [data-testid="custom-media-player"] - Wrapper around custom media player-
  [minor][c28ff17fbd](https://bitbucket.org/atlassian/atlassian-frontend/commits/c28ff17fbd):

  Add new data-testid "data-test-media-name"

### Patch Changes

- [patch][109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):

  Deletes internal package @atlaskit/type-helpers and removes all usages. @atlaskit/type-helpers has
  been superseded by native typescript helper utilities.-
  [patch][e5c869ee31](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5c869ee31):

  Fix posision of tick in safari-
  [patch][69b678b38c](https://bitbucket.org/atlassian/atlassian-frontend/commits/69b678b38c):

  Refactor media analytics listener to properly include context data. Add and use new media
  namespace analytics context in MediaCard-
  [patch][d38212e1be](https://bitbucket.org/atlassian/atlassian-frontend/commits/d38212e1be):

  Make sure order of card status render is in sync with FileStates order. We should not render older
  card status on top of a newer one- Updated dependencies
  [f459d99f15](https://bitbucket.org/atlassian/atlassian-frontend/commits/f459d99f15):

- Updated dependencies
  [17cc5dde5d](https://bitbucket.org/atlassian/atlassian-frontend/commits/17cc5dde5d):
- Updated dependencies
  [6a6a991904](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a6a991904):
- Updated dependencies
  [84f82f7015](https://bitbucket.org/atlassian/atlassian-frontend/commits/84f82f7015):
- Updated dependencies
  [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
- Updated dependencies
  [3aedaac8c7](https://bitbucket.org/atlassian/atlassian-frontend/commits/3aedaac8c7):
- Updated dependencies
  [f061ed6c98](https://bitbucket.org/atlassian/atlassian-frontend/commits/f061ed6c98):
- Updated dependencies
  [49dbcfa64c](https://bitbucket.org/atlassian/atlassian-frontend/commits/49dbcfa64c):
- Updated dependencies
  [e9d555132d](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9d555132d):
- Updated dependencies
  [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies
  [5f8e3caf72](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f8e3caf72):
- Updated dependencies
  [d7b07a9ca4](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7b07a9ca4):
- Updated dependencies
  [318a1a0f2f](https://bitbucket.org/atlassian/atlassian-frontend/commits/318a1a0f2f):
- Updated dependencies
  [fd4b237ffe](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd4b237ffe):
- Updated dependencies
  [9691bb8eb9](https://bitbucket.org/atlassian/atlassian-frontend/commits/9691bb8eb9):
- Updated dependencies
  [11ff95c0f0](https://bitbucket.org/atlassian/atlassian-frontend/commits/11ff95c0f0):
- Updated dependencies
  [ae426d5e97](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae426d5e97):
- Updated dependencies
  [692692ba24](https://bitbucket.org/atlassian/atlassian-frontend/commits/692692ba24):
- Updated dependencies
  [5550919b98](https://bitbucket.org/atlassian/atlassian-frontend/commits/5550919b98):
- Updated dependencies
  [b5f17f0751](https://bitbucket.org/atlassian/atlassian-frontend/commits/b5f17f0751):
- Updated dependencies
  [51ddfebb45](https://bitbucket.org/atlassian/atlassian-frontend/commits/51ddfebb45):
- Updated dependencies
  [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies
  [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies
  [69b678b38c](https://bitbucket.org/atlassian/atlassian-frontend/commits/69b678b38c):
- Updated dependencies
  [e9044fbfa6](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9044fbfa6):
- Updated dependencies
  [fd782b0705](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd782b0705):
- Updated dependencies
  [050781f257](https://bitbucket.org/atlassian/atlassian-frontend/commits/050781f257):
- Updated dependencies
  [4635f8107b](https://bitbucket.org/atlassian/atlassian-frontend/commits/4635f8107b):
- Updated dependencies
  [d80b8e8fdb](https://bitbucket.org/atlassian/atlassian-frontend/commits/d80b8e8fdb):
- Updated dependencies
  [b2402fc3a2](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2402fc3a2):
- Updated dependencies
  [ba8c2c4129](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba8c2c4129):
- Updated dependencies
  [d3547279dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3547279dd):
- Updated dependencies
  [67bc25bc3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/67bc25bc3f):
- Updated dependencies
  [4aca202534](https://bitbucket.org/atlassian/atlassian-frontend/commits/4aca202534):
- Updated dependencies
  [f3587bae11](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3587bae11):
- Updated dependencies
  [8c8f0099d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c8f0099d8):
- Updated dependencies
  [7e363d5aba](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e363d5aba):
  - @atlaskit/media-ui@12.1.0
  - @atlaskit/media-test-helpers@27.2.0
  - @atlaskit/docs@8.5.1
  - @atlaskit/theme@9.5.3
  - @atlaskit/media-client@6.1.0
  - @atlaskit/analytics-listeners@6.3.0
  - @atlaskit/media-viewer@44.4.0
  - @atlaskit/analytics-next@6.3.6
  - @atlaskit/button@13.3.10
  - @atlaskit/analytics-namespaced-context@4.2.0

## 67.1.1

### Patch Changes

- [patch][9d2da865dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d2da865dd):

  ED-8868 Bring back media card sideEffects false in package.json-
  [patch][9a93eff8e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a93eff8e6):

  Fix bug where progressed bar is not shown in before first chunk- Updated dependencies
  [eb962d2c36](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb962d2c36):

- Updated dependencies
  [ac70ced922](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac70ced922):
- Updated dependencies
  [dae900bf82](https://bitbucket.org/atlassian/atlassian-frontend/commits/dae900bf82):
- Updated dependencies
  [f83b67a761](https://bitbucket.org/atlassian/atlassian-frontend/commits/f83b67a761):
- Updated dependencies
  [70b68943d1](https://bitbucket.org/atlassian/atlassian-frontend/commits/70b68943d1):
- Updated dependencies
  [d49ebd7c7a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d49ebd7c7a):
- Updated dependencies
  [6dcad31e41](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dcad31e41):
- Updated dependencies
  [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
- Updated dependencies
  [3cbc8a49a2](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cbc8a49a2):
  - @atlaskit/media-client@6.0.0
  - @atlaskit/media-viewer@44.3.0
  - @atlaskit/build-utils@2.6.4
  - @atlaskit/media-ui@12.0.1
  - @atlaskit/media-test-helpers@27.1.0
  - @atlaskit/media-core@31.1.0
  - @atlaskit/docs@8.5.0

## 67.1.0

### Minor Changes

- [minor][695e1c1c31](https://bitbucket.org/atlassian/atlassian-frontend/commits/695e1c1c31):

  # expose originalDimensions property

  > This property allows consumers to provide the original dimensions of the file instead of the
  > dimensions the card will have.

  As opposite to `cardDimensions` in where you can pass `string | number | undefined`, so
  integrators can provide things like `5%` or `10px` or only provide 1 of the values. In original
  dimensions, integrators need to provide both `width` + `height` in number type.

  ```
  interface OriginalCardDimensions {
    width: number;
    height: number;
  }
  ```

  ```
  import {Card} from '@atlaskit/media-card'

  <Card
    originalDimensions={{
      width: 50,
      height: 100
    }}
  />

  ```

### Patch Changes

- [patch][be57ca3829](https://bitbucket.org/atlassian/atlassian-frontend/commits/be57ca3829):

  pass contextId to MediaViewer-
  [patch][d7ed7b1513](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7ed7b1513):

  Remove export \* from media components-
  [patch][39ee28797d](https://bitbucket.org/atlassian/atlassian-frontend/commits/39ee28797d):

  Add MimeType to media-card analytics- Updated dependencies
  [b408e050ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/b408e050ab):

- Updated dependencies
  [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies
  [dda84ee26d](https://bitbucket.org/atlassian/atlassian-frontend/commits/dda84ee26d):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [196500df34](https://bitbucket.org/atlassian/atlassian-frontend/commits/196500df34):
- Updated dependencies
  [64fb94fb1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/64fb94fb1e):
- Updated dependencies
  [77474b6821](https://bitbucket.org/atlassian/atlassian-frontend/commits/77474b6821):
- Updated dependencies
  [d7ed7b1513](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7ed7b1513):
- Updated dependencies
  [41a2496393](https://bitbucket.org/atlassian/atlassian-frontend/commits/41a2496393):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [8b9598a760](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b9598a760):
- Updated dependencies
  [bbf5eb8824](https://bitbucket.org/atlassian/atlassian-frontend/commits/bbf5eb8824):
- Updated dependencies
  [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies
  [6b06a7baa9](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b06a7baa9):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [109c1a2c0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c1a2c0a):
- Updated dependencies
  [c57bb32f6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/c57bb32f6d):
- Updated dependencies
  [8b34c7371d](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b34c7371d):
- Updated dependencies
  [ef105eb49f](https://bitbucket.org/atlassian/atlassian-frontend/commits/ef105eb49f):
  - @atlaskit/media-client@5.0.2
  - @atlaskit/docs@8.4.0
  - @atlaskit/media-ui@12.0.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/media-test-helpers@27.0.0
  - @atlaskit/webdriver-runner@0.3.0
  - @atlaskit/media-viewer@44.2.0
  - @atlaskit/item@11.0.2
  - @atlaskit/field-radio-group@7.0.2
  - @atlaskit/field-range@8.0.2
  - @atlaskit/media-core@31.0.5
  - @atlaskit/button@13.3.9
  - @atlaskit/checkbox@10.1.10
  - @atlaskit/dropdown-menu@9.0.2
  - @atlaskit/spinner@12.1.6
  - @atlaskit/textfield@3.1.9
  - @atlaskit/toggle@8.1.6

## 67.0.5

### Patch Changes

- Updated dependencies
  [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/button@13.3.8
  - @atlaskit/checkbox@10.1.9
  - @atlaskit/dropdown-menu@9.0.1
  - @atlaskit/spinner@12.1.5
  - @atlaskit/textfield@3.1.8
  - @atlaskit/toggle@8.1.5
  - @atlaskit/media-viewer@44.1.5

## 67.0.4

### Patch Changes

- [patch][eeaa647c31](https://bitbucket.org/atlassian/atlassian-frontend/commits/eeaa647c31):

  Enable play button on video whilst no thumbnail is available yet- Updated dependencies
  [8c7f68d911](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c7f68d911):

- Updated dependencies
  [f709e92247](https://bitbucket.org/atlassian/atlassian-frontend/commits/f709e92247):
- Updated dependencies
  [0e562f2a4a](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e562f2a4a):
- Updated dependencies
  [9e87af4685](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e87af4685):
- Updated dependencies
  [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
- Updated dependencies
  [91a1eb05db](https://bitbucket.org/atlassian/atlassian-frontend/commits/91a1eb05db):
- Updated dependencies
  [c1992227dc](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1992227dc):
  - @atlaskit/media-ui@11.9.0
  - @atlaskit/dropdown-menu@9.0.0
  - @atlaskit/icon@20.0.2
  - @atlaskit/textfield@3.1.7
  - @atlaskit/checkbox@10.1.8
  - @atlaskit/analytics-listeners@6.2.4
  - @atlaskit/media-test-helpers@26.1.2

## 67.0.3

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/checkbox@10.1.7
  - @atlaskit/dropdown-menu@8.2.4
  - @atlaskit/field-radio-group@7.0.1
  - @atlaskit/field-range@8.0.1
  - @atlaskit/icon@20.0.1
  - @atlaskit/item@11.0.1
  - @atlaskit/spinner@12.1.4
  - @atlaskit/textfield@3.1.6
  - @atlaskit/theme@9.5.1
  - @atlaskit/toggle@8.1.4
  - @atlaskit/type-helpers@4.2.3
  - @atlaskit/analytics-gas-types@4.0.13
  - @atlaskit/analytics-listeners@6.2.3
  - @atlaskit/media-client@5.0.1
  - @atlaskit/media-core@31.0.4
  - @atlaskit/media-test-helpers@26.1.1
  - @atlaskit/media-ui@11.8.3
  - @atlaskit/media-viewer@44.1.4

## 67.0.2

### Patch Changes

- Updated dependencies
  [fe4eaf06fc](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe4eaf06fc):
- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies
  [555818c33a](https://bitbucket.org/atlassian/atlassian-frontend/commits/555818c33a):
  - @atlaskit/media-test-helpers@26.1.0
  - @atlaskit/field-radio-group@7.0.0
  - @atlaskit/field-range@8.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/item@11.0.0
  - @atlaskit/media-ui@11.8.2
  - @atlaskit/dropdown-menu@8.2.3
  - @atlaskit/media-viewer@44.1.3
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/checkbox@10.1.6
  - @atlaskit/textfield@3.1.5

## 67.0.1

### Patch Changes

- [patch][5504a7da8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/5504a7da8c):

  Improved types for type property of FileIcon-
  [patch][6ee177aeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ee177aeb4):

  Stream caches in media-client now use ReplaySubjects instead of Observables. For the most part,
  this is just the interface that's being updated, as under the hood ReplaySubject was already
  getting used. ReplaySubjects better suit our use case because they track 1 version of history of
  the file state. As a consumer, there shouldn't be any necessary code changes. ReplaySubjects
  extend Observable, so the current usage should continue to work.- Updated dependencies
  [966622bd45](https://bitbucket.org/atlassian/atlassian-frontend/commits/966622bd45):

- Updated dependencies
  [723c67cab5](https://bitbucket.org/atlassian/atlassian-frontend/commits/723c67cab5):
- Updated dependencies
  [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
- Updated dependencies
  [6ee177aeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ee177aeb4):
  - @atlaskit/media-test-helpers@26.0.0
  - @atlaskit/media-viewer@44.1.2
  - @atlaskit/docs@8.3.0
  - @atlaskit/media-client@5.0.0
  - @atlaskit/media-core@31.0.3
  - @atlaskit/media-ui@11.8.1

## 67.0.0

### Major Changes

- [major][03c917044e](https://bitbucket.org/atlassian/atlassian-frontend/commits/03c917044e):

  Remove `onChangeSelected` and `onLoadingChange` from `media-card` and `media-filmstrip` as they
  are unused. The behavior is now achieved with `mediaClient.file.getFileState`:

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

- [patch][486a5aec29](https://bitbucket.org/atlassian/atlassian-frontend/commits/486a5aec29):

  ED-7892: added alt text when the image fail to load-
  [patch][d3f4c97f6a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3f4c97f6a):

  Add media-card-file-name testId for cards file name and Add testId attribute to Ellipsify
  component.- Updated dependencies
  [28f8f0e089](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f8f0e089):

- Updated dependencies
  [6dccb16bfc](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dccb16bfc):
- Updated dependencies
  [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies
  [d3f4c97f6a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3f4c97f6a):
- Updated dependencies
  [149560f012](https://bitbucket.org/atlassian/atlassian-frontend/commits/149560f012):
- Updated dependencies
  [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
- Updated dependencies
  [6a8bc6f866](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a8bc6f866):
  - @atlaskit/icon@19.1.0
  - @atlaskit/toggle@8.1.3
  - @atlaskit/theme@9.5.0
  - @atlaskit/media-ui@11.8.0
  - @atlaskit/button@13.3.5
  - @atlaskit/checkbox@10.1.5
  - @atlaskit/spinner@12.1.3
  - @atlaskit/media-client@4.2.2
  - @atlaskit/media-core@31.0.2
  - @atlaskit/media-test-helpers@25.2.6
  - @atlaskit/media-viewer@44.1.1
  - @atlaskit/dropdown-menu@8.2.2

## 66.1.2

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Fix File Status in Media Card Analytics Events- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/media-viewer@44.1.0
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/media-client@4.2.0
  - @atlaskit/checkbox@10.1.4
  - @atlaskit/field-text@9.0.14
  - @atlaskit/item@10.2.0
  - @atlaskit/media-ui@11.7.2

## 66.1.1

### Patch Changes

- [patch][139ab68e90](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/139ab68e90):

  ED-4359 fix focus being reset on remove mediagroup- Updated dependencies
  [768bac6d81](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/768bac6d81):

  - @atlaskit/analytics-next@6.3.2

## 66.1.0

### Minor Changes

- [minor][c23ff56fb0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c23ff56fb0):

  Introduced new optional prop `testId` that will be applied to `data-testid` prop on top DOM
  element of Card

### Patch Changes

- [patch][5b2c89203e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b2c89203e):

  Fix linting errors from prettier upgrade

## 66.0.2

### Patch Changes

- [patch][d222c2b987](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d222c2b987):

  Theme has been converted to Typescript. Typescript consumers will now get static type safety. Flow
  types are no longer provided.

  ### Breaking

  ** getTokens props changes ** When defining the value function passed into a ThemeProvider, the
  getTokens parameter cannot be called without props; if no props are provided an empty object `{}`
  must be passed in:

  ```javascript
  <CustomTheme.Provider
    value={t => ({ ...t(), backgroundColor: '#333'})}
  >
  ```

  becomes:

  ```javascript
  <CustomTheme.Provider
    value={t => ({ ...t({}), backgroundColor: '#333'})}
  >
  ```

  ** Color palette changes ** Color palettes have been moved into their own file. Users will need to
  update imports from this:

  ```javascript
  import { colors } from '@atlaskit/theme';

  colors.colorPalette('8');
  ```

  to this:

  ```javascript
  import { colorPalette } from '@atlaskit/theme';

  colorPalette.colorPalette('8');
  ```

  or for multi entry-point users:

  ```javascript
  import * as colors from '@atlaskit/theme/colors';

  colors.colorPalette('8');
  ```

  to this:

  ```javascript
  import * as colorPalettes from '@atlaskit/theme/color-palette';

  colorPalettes.colorPalette('8');
  ```

## 66.0.1

### Patch Changes

- [patch][760bd84462](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/760bd84462):

  fixing analytics failed when user cancels file upload

- Updated dependencies
  [24b8ea2667](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24b8ea2667):
  - @atlaskit/media-client@4.0.0
  - @atlaskit/media-test-helpers@25.2.2
  - @atlaskit/media-viewer@44.0.1

## 66.0.0

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

const mediaClientConfig: MediaClientConfig = { authProvider: () => Promise.resolve({}) }

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

**FABDODGEM-13 Editor Damask Release**

- [Internal post](http://go.atlassian.com/damask-release)

**BREAKING CHANGES**

- **Media:** Removed deprecated "context" property from media components in favor of
  "mediaClientConfig". This affects all public media UI components.
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

Emit `media-viewed` event through `globalMediaEventEmitter` when media is viewed, played or
downloaded via media card or media viewer.-
[minor][550d260bfc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/550d260bfc):

Introducing support for alt-text in media.

- Updated dependencies
  [e7b5c917de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7b5c917de):
- @atlaskit/media-store@12.0.14
- @atlaskit/media-test-helpers@25.2.0
- @atlaskit/media-viewer@44.0.0
- @atlaskit/media-client@3.0.0

## 65.3.4

### Patch Changes

- [patch][c0bb2ebac5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c0bb2ebac5):

check if selection.containsNode is available before using it to fix issue with IE11

## 65.3.3

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 65.3.2

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 65.3.1

### Patch Changes

- [patch][9bac6fd58e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9bac6fd58e):

HOT-88731 don't send external image URL as a part of analytics

## 65.3.0

### Minor Changes

- [minor][e44b5324de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e44b5324de):

Card now sends "copied file" on card copy event in editor and renderer-
[minor][ab53f33dc5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab53f33dc5):

Adding operational events for media card component

## 65.2.1

- Updated dependencies
  [97bab7fd28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97bab7fd28):
- @atlaskit/button@13.3.1
- @atlaskit/media-ui@11.6.7
- @atlaskit/checkbox@10.0.0
- @atlaskit/docs@8.1.7

## 65.2.0

### Minor Changes

- [minor][b709292a5c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b709292a5c):

Add new "contextId?: string" property to Card, to retrieve auth from a given context

### Patch Changes

- [patch][ace05e438f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ace05e438f):

Dont release file preview from Card when an external file is passed

## 65.1.1

### Patch Changes

- [patch][fc79969f86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc79969f86):

Update all the theme imports in media to use multi entry points

## 65.1.0

### Minor Changes

- [minor][b95f6ba701](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b95f6ba701):

Added Analytics events for Media Card Action, Dropdown Menu and Retry buttons

## 65.0.1

### Patch Changes

- [patch][8e2cb88526](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8e2cb88526):

Adding Error boundary in Media Card

## 65.0.0

### Major Changes

- [major][af72468517](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af72468517):

Media card now emit analytics events which payload and context stuctures reflect GASv3 payload
specification. Media Analytics Listener merges Payload and Context data before sending it to the
backend. The merge is based on attributes.packageName equality Media Analytics Listener adds
packageHierarchy attribute to merged payload, the same way Atlaskit Listener does.

## 64.2.1

### Patch Changes

- [patch][9ce6986361](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ce6986361):

CEMS-244: Emit processed state when file gets copied

## 64.2.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

More information about the deprecation of lifecycles methods can be found here:
https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 64.1.0

### Minor Changes

- [minor][44202a6e9a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/44202a6e9a):

Analytics Event will be fired when InlinePlayer is being clicked

## 64.0.2

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative
imports as relative imports

## 64.0.1

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

Upgraded Typescript to 3.3.x

## 64.0.0

### Major Changes

- [major][3624730f44](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3624730f44):

Property `type` was removed from `CardViewAnalyticsContext` interface File size won't be displayed
if it was set to zero or not obtained

## 63.3.12

### Patch Changes

- [patch][926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):

Analytics-next has been converted to Typescript. Typescript consumers will now get static type
safety. Flow types are no longer provided. No behavioural changes.

**Breaking changes**

- `withAnalyticsForSumTypeProps` alias has been removed, please use `withAnalyticsEvents`
- `AnalyticsContextWrappedComp` alias has been removed, please use `withAnalyticsContext`

**Breaking changes to TypeScript annotations**

- `withAnalyticsEvents` now infers proptypes automatically, consumers no longer need to provide
  props as a generic type.
- `withAnalyticsContext` now infers proptypes automatically, consumers no longer need to provide
  props as a generic type.
- Type `WithAnalyticsEventProps` has been renamed to `WithAnalyticsEventsProps` to match source code
- Type `CreateUIAnalyticsEventSignature` has been renamed to `CreateUIAnalyticsEvent` to match
  source code
- Type `UIAnalyticsEventHandlerSignature` has been renamed to `UIAnalyticsEventHandler` to match
  source code
- Type `AnalyticsEventsPayload` has been renamed to `AnalyticsEventPayload`
- Type `ObjectType` has been removed, please use `Record<string, any>` or `[key: string]: any`
- Type `UIAnalyticsEventInterface` has been removed, please use `UIAnalyticsEvent`
- Type `AnalyticsEventInterface` has been removed, please use `AnalyticsEvent`
- Type `CreateAndFireEventFunction` removed and should now be inferred by TypeScript
- Type `AnalyticsEventUpdater` removed and should now be inferred by TypeScript

## 63.3.11

- Updated dependencies
  [69586b5353](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69586b5353):
- @atlaskit/media-client@2.0.1
- @atlaskit/media-store@12.0.8
- @atlaskit/media-viewer@43.2.10
- @atlaskit/media-ui@11.5.2
- @atlaskit/media-test-helpers@25.0.0

## 63.3.10

### Patch Changes

- [patch][6ad542fe85](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ad542fe85):

Adding try/catch in async imports for @atlaskit/media-avatar-picker, @atlaskit/media-card,
@atlaskit/media-editor, @atlaskit/media-viewer

## 63.3.9

- Updated dependencies
  [ee804f3eeb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee804f3eeb):
- @atlaskit/media-store@12.0.6
- @atlaskit/media-test-helpers@24.3.5
- @atlaskit/media-viewer@43.2.8
- @atlaskit/media-client@2.0.0

## 63.3.8

### Patch Changes

- [patch][8dbc8914cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8dbc8914cd):

Hide inline video player controls during inactivty

## 63.3.7

- Updated dependencies
  [7e9d653278](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e9d653278):
- @atlaskit/toggle@8.0.0

## 63.3.6

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

Consume analytics-next ts type definitions as an ambient declaration.

## 63.3.5

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

bugfix, fixes missing version.json file

## 63.3.4

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

In this PR, we are:

- Re-introducing dist build folders
- Adding back cjs
- Replacing es5 by cjs and es2015 by esm
- Creating folders at the root for entry-points
- Removing the generation of the entry-points at the root Please see this
  [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this
  [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points)
  for further details

## 63.3.3

### Patch Changes

- [patch][d0db01b410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0db01b410):

TypeScript users of withAnalyticsEvents and withAnalyticsContext are now required to provide props
as a generic type. This is so that TypeScript can correctly calculate the props and defaultProps of
the returned component.

Before:

```typescript
withAnalyticsEvents()(Button) as ComponentClass<Props>;
```

After:

```typescript
withAnalyticsEvents<Props>()(Button);
```

## 63.3.2

- Updated dependencies
  [87a2638655](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87a2638655):
  - @atlaskit/button@13.0.10
  - @atlaskit/media-ui@11.4.2
  - @atlaskit/checkbox@9.0.0

## 63.3.1

- Updated dependencies
  [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/checkbox@8.0.5
  - @atlaskit/dropdown-menu@8.0.8
  - @atlaskit/field-radio-group@6.0.4
  - @atlaskit/toggle@7.0.3
  - @atlaskit/media-test-helpers@24.1.2
  - @atlaskit/media-ui@11.4.1
  - @atlaskit/media-viewer@43.1.3
  - @atlaskit/icon@19.0.0

## 63.3.0

### Minor Changes

- [minor][53b1e6a783](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/53b1e6a783):

  Add a download button to inline video player to allow download of video binary

## 63.2.0

### Minor Changes

- [minor][09f094a7a2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/09f094a7a2):

  SL-259: bump react-lazily-render, remove react-lazily-render-scroll-parent.

## 63.1.5

- Updated dependencies
  [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/checkbox@8.0.2
  - @atlaskit/dropdown-menu@8.0.4
  - @atlaskit/field-radio-group@6.0.2
  - @atlaskit/toggle@7.0.1
  - @atlaskit/media-test-helpers@24.0.3
  - @atlaskit/media-ui@11.2.8
  - @atlaskit/media-viewer@43.1.1
  - @atlaskit/field-range@7.0.4
  - @atlaskit/icon@18.0.0

## 63.1.4

### Patch Changes

- [patch][b37dd8dc38](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b37dd8dc38):

  Use video binary artifact while video is processing

## 63.1.3

### Patch Changes

- [patch][0a313cd541](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a313cd541):

  - rename AsyncCardState

## 63.1.2

- Updated dependencies
  [70862830d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70862830d6):
  - @atlaskit/button@13.0.6
  - @atlaskit/media-ui@11.2.7
  - @atlaskit/checkbox@8.0.0
  - @atlaskit/icon@17.2.0
  - @atlaskit/theme@9.1.0

## 63.1.1

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull
    Request #5942 for details

## 63.1.0

- [minor][a02cbd46c0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a02cbd46c0):

  - Now you can provide `MediaClientConfig` as `mediaClientConfig` prop to a Card as an alternative
    to Context. This is preferential, since Context prop will be dropped very soon.

- Updated dependencies
  [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
- Updated dependencies
  [9ecfef12ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ecfef12ac):
  - @atlaskit/button@13.0.4
  - @atlaskit/media-ui@11.2.5
  - @atlaskit/media-viewer@43.0.2
  - @atlaskit/spinner@12.0.0
  - @atlaskit/media-client@1.2.0
  - @atlaskit/media-store@12.0.2
  - @atlaskit/media-test-helpers@24.0.0

## 63.0.4

- [patch][b91590107b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b91590107b):

  - ED-6178 Fix media wrapper having a transparent background for images

## 63.0.3

- [patch][a6f27f106a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6f27f106a):

  - use componentDidMount in CardLoader to make it SSR hydrate friendly

## 63.0.2

- Updated dependencies
  [ed3f034232](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed3f034232):
  - @atlaskit/media-core@30.0.1
  - @atlaskit/media-store@12.0.1
  - @atlaskit/media-ui@11.1.1
  - @atlaskit/media-viewer@43.0.1
  - @atlaskit/media-test-helpers@23.0.0

## 63.0.1

- [patch][cbc9ff5b6a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbc9ff5b6a):

  - Fix support for exif orientation when dropping a picture

## 63.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

- Updated dependencies
  [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - @atlaskit/media-viewer@43.0.0
  - @atlaskit/docs@8.0.0
  - @atlaskit/analytics-next@5.0.0
  - @atlaskit/button@13.0.0
  - @atlaskit/checkbox@7.0.0
  - @atlaskit/dropdown-menu@8.0.0
  - @atlaskit/field-radio-group@6.0.0
  - @atlaskit/field-range@7.0.0
  - @atlaskit/field-text@9.0.0
  - @atlaskit/icon@17.0.0
  - @atlaskit/spinner@11.0.0
  - @atlaskit/theme@9.0.0
  - @atlaskit/toggle@7.0.0
  - @atlaskit/media-core@30.0.0
  - @atlaskit/media-store@12.0.0
  - @atlaskit/media-test-helpers@22.0.0
  - @atlaskit/media-ui@11.0.0

## 62.0.0

- Updated dependencies
  [a1192ef860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1192ef860):
  - @atlaskit/media-viewer@42.0.0
  - @atlaskit/media-store@11.1.1
  - @atlaskit/media-test-helpers@21.4.0
  - @atlaskit/media-core@29.3.0

## 61.0.0

- Updated dependencies
  [e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):
  - @atlaskit/media-viewer@41.0.0
  - @atlaskit/media-store@11.1.0
  - @atlaskit/media-test-helpers@21.3.0
  - @atlaskit/media-core@29.2.0

## 60.0.6

- [patch][d3cad2622e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d3cad2622e):

  - Removes babel-runtime in favour of @babel/runtime

## 60.0.5

- [patch][8f17450f46](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8f17450f46):

  - Fix media-card code split from 82kB to 10kB

## 60.0.4

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 60.0.3

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/checkbox@6.0.4
  - @atlaskit/dropdown-menu@7.0.6
  - @atlaskit/field-radio-group@5.0.3
  - @atlaskit/field-range@6.0.4
  - @atlaskit/field-text@8.0.3
  - @atlaskit/icon@16.0.9
  - @atlaskit/spinner@10.0.7
  - @atlaskit/toggle@6.0.4
  - @atlaskit/media-ui@10.1.5
  - @atlaskit/media-viewer@40.1.10
  - @atlaskit/theme@8.1.7

## 60.0.2

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next
    supplied from itself.

## 60.0.1

- Updated dependencies
  [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/checkbox@6.0.3
  - @atlaskit/dropdown-menu@7.0.4
  - @atlaskit/field-radio-group@5.0.2
  - @atlaskit/field-text@8.0.2
  - @atlaskit/icon@16.0.8
  - @atlaskit/spinner@10.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/toggle@6.0.3
  - @atlaskit/media-core@29.1.4
  - @atlaskit/media-store@11.0.7
  - @atlaskit/media-ui@10.1.3
  - @atlaskit/media-viewer@40.1.5
  - @atlaskit/field-range@6.0.3
  - @atlaskit/button@12.0.0

## 60.0.0

- [major][0ff405bd0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ff405bd0f):

  - Removed CardView and CardViewLoader from public APIs and replaced it with light-weight and
    stateless CardLoading and CardError components. Handling of external images is now done by Card
    component itself using ExternalImageIdentifier interface.

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

  You will have to find a way to switch to using Card component using ExternalImageIdentifier
  interface:

  ```js
  <Card identifier={identifier} context={context} />
  ```

## 59.1.1

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 59.1.0

- [minor][e1c1fa454a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e1c1fa454a):

  - Support external image identifier in MediaViewer

## 59.0.0

- Updated dependencies
  [c2c36de22b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c36de22b):
  - @atlaskit/media-viewer@40.0.0
  - @atlaskit/media-store@11.0.3
  - @atlaskit/media-test-helpers@21.1.0
  - @atlaskit/media-core@29.1.0

## 58.0.1

- [patch][106d046114](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/106d046114):

  - Fix issue with media-viewer opening in CC on inline video player controlls clicked

## 58.0.0

- [major][9c316bd8aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c316bd8aa):

  - Exported MediaImage component is removed from media-card and moved to @atlaskit/media-ui

## 57.0.3

- [patch][d402fdb775](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d402fdb775):

  - FIX ED-6584: Keep card dataURI regardless of previus state

## 57.0.2

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 57.0.1

- [patch][9192df506a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9192df506a):

  - Do not call given onClick if it's a video file and inline video player is enabled

## 57.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

- Updated dependencies
  [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/checkbox@6.0.1
  - @atlaskit/dropdown-menu@7.0.1
  - @atlaskit/field-radio-group@5.0.1
  - @atlaskit/field-text@8.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/spinner@10.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/toggle@6.0.1
  - @atlaskit/media-viewer@39.0.0
  - @atlaskit/field-range@6.0.1
  - @atlaskit/button@11.0.0
  - @atlaskit/analytics-next-types@4.0.0
  - @atlaskit/media-core@29.0.0
  - @atlaskit/media-store@11.0.0
  - @atlaskit/media-test-helpers@21.0.0
  - @atlaskit/media-ui@10.0.0

## 56.0.0

- Updated dependencies
  [7ab3e93996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ab3e93996):
  - @atlaskit/media-test-helpers@20.1.8
  - @atlaskit/media-viewer@38.0.0
  - @atlaskit/media-core@28.0.0
  - @atlaskit/media-store@10.0.0

## 55.0.4

- [patch][ff3f40bc38](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff3f40bc38):

  - Fix remove from cache function, which fixes issue when user is deleting recent image in media
    picker

## 55.0.3

- [patch][3591859b2f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3591859b2f):

  - use ReactDOM.createPortal to render MediaViewer when shouldOpenMediaViewer=true

## 55.0.2

- Updated dependencies
  [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/icon@16.0.4
  - @atlaskit/media-core@27.2.3
  - @atlaskit/media-store@9.2.1
  - @atlaskit/media-ui@9.2.1
  - @atlaskit/media-viewer@37.0.1
  - @atlaskit/media-test-helpers@20.1.7
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics-next@4.0.0
  - @atlaskit/checkbox@6.0.0
  - @atlaskit/dropdown-menu@7.0.0
  - @atlaskit/field-radio-group@5.0.0
  - @atlaskit/field-range@6.0.0
  - @atlaskit/field-text@8.0.0
  - @atlaskit/spinner@10.0.0
  - @atlaskit/theme@8.0.0
  - @atlaskit/toggle@6.0.0

## 55.0.1

- [patch][d18b085e2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d18b085e2a):

  - Integrating truly upfront ID

## 55.0.0

- [patch][6bd4c428e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6bd4c428e2):

  - load image preview as soon representation is present instead of waiting for file status to be
    processed

- Updated dependencies
  [4aee5f3cec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aee5f3cec):
  - @atlaskit/media-test-helpers@20.1.6
  - @atlaskit/media-core@27.2.0
  - @atlaskit/media-store@9.2.0

## 54.1.0

- [minor][eda74c4dce](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eda74c4dce):

  - Add shouldOpenMediaViewer + mediaViewerDataSource optional props to Card api to simplify
    MediaViewer integration

## 54.0.0

- [major][190c4b7bd3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/190c4b7bd3):

  - Remove Identifier type + related utilities and use the one from media-core

- Updated dependencies
  [fc6164c8c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc6164c8c2):
  - @atlaskit/media-store@9.1.7
  - @atlaskit/media-test-helpers@20.1.5
  - @atlaskit/media-core@27.1.0

## 53.0.0

- [major][46dfcfbeca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/46dfcfbeca):

  - remove Link support from media-card

## 52.0.7

- [patch][ab6ba14cd3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab6ba14cd3):

  - Fix a bug where droping image with EXIF orientation >= 5 end up screwing up proportions for some
    of the cases

## 52.0.6

- [patch][05c5bf7a93](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/05c5bf7a93):

  - Dont user pointer cursor for external images in Cards

## 52.0.5

- [patch][c415876da9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c415876da9):

  - add selected state to InlinePlayer in media-card

## 52.0.4

- Updated dependencies
  [d5bce1ea15](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5bce1ea15):
  - @atlaskit/media-test-helpers@20.1.2
  - @atlaskit/media-ui@9.0.0

## 52.0.3

- [patch][ef469cbb0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef469cbb0b):

  - MS-357 replaced @atlaskit/util-shared-styles from media components by @atlaskit/theme

## 52.0.2

- [patch][0e164e542a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e164e542a):

  - MS-1465: Dont fetch file preview if we already have a local one

## 52.0.1

- [patch][1d3e336534](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d3e336534):

  - Show progress bar while file is uploading

## 52.0.0

- Updated dependencies
  [69c8d0c19c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c8d0c19c):
  - @atlaskit/media-test-helpers@20.1.0
  - @atlaskit/media-store@9.1.5
  - @atlaskit/media-core@27.0.0

## 51.0.3

- [patch][a3f8e527aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3f8e527aa):

  - Take into account if image is on it's side according to orientation tag when deciding how to
    crop/fit and image

## 51.0.2

- Updated dependencies
  [07a187bb30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07a187bb30):
  - @atlaskit/media-core@26.2.1
  - @atlaskit/media-store@9.1.4
  - @atlaskit/media-ui@8.2.6
  - @atlaskit/media-test-helpers@20.0.0

## 51.0.1

- Updated dependencies
  [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/dropdown-menu@6.1.26
  - @atlaskit/field-radio-group@4.0.15
  - @atlaskit/toggle@5.0.15
  - @atlaskit/media-test-helpers@19.1.1
  - @atlaskit/media-ui@8.2.5
  - @atlaskit/field-range@5.0.14
  - @atlaskit/icon@16.0.0

## 51.0.0

- [patch][b1627a5837](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1627a5837):

  - Enable inline video player in Editor and Renderer

- Updated dependencies
  [85d5d168fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85d5d168fd):
  - @atlaskit/media-store@9.1.3
  - @atlaskit/media-test-helpers@19.1.0
  - @atlaskit/media-core@26.2.0

## 50.0.0

- [patch][5b1e270](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b1e270):

  - Minor bug fixes

- Updated dependencies [dadef80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dadef80):
- Updated dependencies [3ad16f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ad16f3):
  - @atlaskit/media-test-helpers@19.0.0
  - @atlaskit/media-core@26.1.0
  - @atlaskit/media-ui@8.2.4

## 49.0.0

- Updated dependencies [cbb8cb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbb8cb5):
  - @atlaskit/media-test-helpers@18.9.1
  - @atlaskit/media-core@26.0.0

## 48.0.0

- [minor][72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):

  - Remove deprecated methods from media-core
  - Use context.collection methods in MediaViewer
  - Remove link support from media-card
  - Remove legacy services + providers from media-core
  - Remove link related methods from media-core
  - Remove axios dependency
  - Make context.getImage cancelable

- Updated dependencies [72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):
  - @atlaskit/media-core@25.0.0
  - @atlaskit/media-test-helpers@18.9.0

## 47.0.0

- [major][135ed00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/135ed00):

  - remove "small" appearance from media-card

## 46.0.1

- [patch][ca16fa9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca16fa9):

  - Add SSR support to media components

## 46.0.0

- Updated dependencies [b3738ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3738ea):
  - @atlaskit/media-test-helpers@18.7.0
  - @atlaskit/media-core@24.7.0

## 45.0.0

- [minor][b5ab1a5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5ab1a5):

  - Add stretch as a prop for CardContent and MediaImage; Convert new stretchy-fit resizeMode to
    stretch=true;

- Updated dependencies [80f765b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80f765b):
  - @atlaskit/media-test-helpers@18.6.2
  - @atlaskit/media-core@24.6.0

## 44.2.0

- [minor][34369e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/34369e4):

  - ED-5888 Add dark mode for media-card

## 44.1.4

- [patch][6f44079](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6f44079):

  - ED-5612: make image preview display correctly after replacing Card props

## 44.1.3

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/dropdown-menu@6.1.25
  - @atlaskit/field-radio-group@4.0.14
  - @atlaskit/field-range@5.0.12
  - @atlaskit/field-text@7.0.18
  - @atlaskit/icon@15.0.2
  - @atlaskit/spinner@9.0.13
  - @atlaskit/toggle@5.0.14
  - @atlaskit/media-core@24.5.2
  - @atlaskit/media-ui@8.1.2
  - @atlaskit/docs@6.0.0

## 44.1.2

- [patch][676257b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/676257b):

  - Prepare/fix card to be displayed as video inline player in renderer/editor contexts

## 44.1.1

- [patch][5de3574](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5de3574):

  - CustomVideoPlayer is now CustomMediaPlayer and supports audio through type property. Media
    Viewer now uses custom audio player for audio everywhere except IE11.

## 44.1.0

- [minor][c1ea81c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1ea81c):

  - use custom video player for inline video in media-card

## 44.0.2

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/dropdown-menu@6.1.23
  - @atlaskit/field-radio-group@4.0.12
  - @atlaskit/toggle@5.0.12
  - @atlaskit/media-test-helpers@18.3.1
  - @atlaskit/media-ui@7.6.2
  - @atlaskit/icon@15.0.0

## 44.0.1

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/dropdown-menu@6.1.22
  - @atlaskit/field-radio-group@4.0.11
  - @atlaskit/field-text@7.0.15
  - @atlaskit/icon@14.6.1
  - @atlaskit/spinner@9.0.11
  - @atlaskit/toggle@5.0.11
  - @atlaskit/media-core@24.5.1
  - @atlaskit/media-ui@7.6.1
  - @atlaskit/field-range@5.0.9
  - @atlaskit/button@10.0.0
  - @atlaskit/analytics-next-types@3.1.2

## 44.0.0

- Updated dependencies [7e8b4b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e8b4b9):
  - @atlaskit/media-test-helpers@18.3.0
  - @atlaskit/media-core@24.5.0

## 43.0.0

- [minor][2c21466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c21466):

  - Allow to inline play video files in media-card

- Updated dependencies [2c21466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c21466):
  - @atlaskit/media-test-helpers@18.2.12
  - @atlaskit/media-core@24.4.0

## 42.0.0

- [major][04c7192](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/04c7192):

  - remove CardList component from media-card

## 41.4.0

- [minor][abef80b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abef80b):

  - ED-5527: apply max-width: 100% and pass container size to Card as dimension

## 41.3.0

- [minor][4718333](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4718333):

  - Add play icon for video files in MediaCard

## 41.2.0

- [minor][439dde6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/439dde6" d):

  - rotate local image preview in cards based on the file orientation

## 41.1.2

- [patch] Updated dependencies
  [ced32d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ced32d0)
  - @atlaskit/media-test-helpers@18.2.10
  - @atlaskit/media-ui@7.0.0
  - @atlaskit/smart-card@8.4.1

## 41.1.1

- [patch] Override css rules for an image inside a cart
  [20a15ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/20a15ef)

## 41.1.0

- [minor] Cleanup media + editor integration 🔥
  [2f9d14d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2f9d14d)

## 41.0.2

- [patch] Make image in the card non-draggable
  [615a536](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/615a536)

## 41.0.1

- [patch] User img tag in cards instead of div with background
  [22ae8bb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/22ae8bb)

## 41.0.0

- [patch] Split Media + Editor cleanup part 1
  [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)
- [major] Updated dependencies
  [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)
  - @atlaskit/media-core@24.3.0
  - @atlaskit/media-test-helpers@18.2.8

## 40.0.1

- [patch] Code split media list
  [d101ce1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d101ce1)

## 40.0.0

- [major] Remove support for ApplicationCard
  [6e510d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e510d8)

## 39.0.1

- [patch] Fix bug with download binary
  [71ebe0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/71ebe0b)

## 39.0.0

- [minor] Media-card: allow to download binary when processing failed, add failed-processing to
  CardStatus; Media-core: add context.file.downloadBinary, add failed-processing to FileStatus;
  Media-store: add getFileBinaryURL;
  [2afa60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2afa60d)
- [major] Updated dependencies
  [2afa60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2afa60d)
  - @atlaskit/media-test-helpers@18.2.5
  - @atlaskit/media-core@24.2.0

## 38.0.1

- [patch] Add pagination to recents view in MediaPicker
  [4b3c1f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b3c1f5)

## 38.0.0

- [patch] Deprecate context.uploadFile & context.getFile. Instead context.file.upload &
  context.file.getFileState should be used; media-store's uploadFile function now takes MediaStore
  as a second argument, not MediaApiConfig
  [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [patch] Deprecate context.uploadFile & context.getFile. Instead context.file.upload &
  context.file.getFileState should be used; media-store's uploadFile function now takes MediaStore
  as a second argument, not MediaApiConfig
  [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)
- [major] Updated dependencies
  [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [major] Updated dependencies
  [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)
  - @atlaskit/media-core@24.1.0
  - @atlaskit/media-test-helpers@18.2.3

## 37.0.1

- [patch] Updated dependencies
  [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/avatar@14.0.11
  - @atlaskit/button@9.0.13
  - @atlaskit/dropdown-menu@6.1.17
  - @atlaskit/field-radio-group@4.0.8
  - @atlaskit/toggle@5.0.9
  - @atlaskit/tooltip@12.1.1
  - @atlaskit/media-test-helpers@18.2.1
  - @atlaskit/media-ui@6.0.1
  - @atlaskit/icon@14.0.0

## 37.0.0

- [major] Add I18n support to media-card
  [dae7792](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dae7792)

## 36.1.1

- [patch] Fix rxjs imports to only import what's needed
  [2e0ce2b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e0ce2b)

## 36.1.0

- [minor] Support external image identifiers in media-card
  [82c8bb9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/82c8bb9)

## 36.0.0

- [major] Update RXJS dependency to ^5.5.0
  [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
- [major] Updated dependencies
  [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
  - @atlaskit/media-core@24.0.0
  - @atlaskit/media-test-helpers@18.0.0

## 35.0.0

- [major] Fix CardView code split + remove private components from public api
  [1be4bb8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1be4bb8)

## 34.1.0

- [minor] Async load media-card modules by default
  [01416b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/01416b4)

## 34.0.4

- [patch] Refetch image when the dimensions change
  [a0475c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a0475c2)

## 34.0.3

- [patch] Revert fix for MS-667
  [43e601f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/43e601f)

## 34.0.2

- [patch] use new tsconfig for typechecking
  [09df171](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/09df171)

## 34.0.1

- [patch] Media-card now re-fetches the underlaying image when the dimensions prop changes
  [59fb6a4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59fb6a4)

## 34.0.0

- [major] Updated dependencies
  [6e1d642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e1d642)
  - @atlaskit/media-core@23.2.0
  - @atlaskit/media-test-helpers@17.1.0

## 33.0.2

- [patch] Update TS to 3.0 [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
- [none] Updated dependencies
  [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
  - @atlaskit/media-test-helpers@17.0.2
  - @atlaskit/media-core@23.1.1

## 33.0.1

- [patch] use media tsconfig in media-card
  [3417d76](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3417d76)

## 33.0.0

- [minor] Expose upfrontId in MediaPicker
  [7545979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7545979)
- [major] Updated dependencies
  [7545979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7545979)
  - @atlaskit/media-core@23.1.0

## 32.0.6

- [patch] Updated dependencies
  [911a570](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/911a570)
  - @atlaskit/media-test-helpers@17.0.0
  - @atlaskit/media-core@23.0.2

## 32.0.5

- [patch] Updated dependencies
  [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/badge@9.1.1
  - @atlaskit/media-ui@5.1.2
  - @atlaskit/smart-card@8.0.1

## 32.0.4

- [patch] Updated dependencies
  [48b95b0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48b95b0)
  - @atlaskit/smart-card@8.0.0
- [none] Updated dependencies
  [e9b1477](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e9b1477)
  - @atlaskit/smart-card@8.0.0

## 32.0.3

- [patch] ED-5222: bump react-lazily-render package
  [5844820](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5844820)
- [none] Updated dependencies
  [5844820](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5844820)
  - @atlaskit/smart-card@7.0.4

## 32.0.2

- [patch] Removing mutational rxjs imports and replace with explicit operators
  [353f9db](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/353f9db)
- [patch] Removing mutational rxjs imports and replace with explicit operators
  [56c2df9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/56c2df9)
- [none] Updated dependencies
  [353f9db](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/353f9db)
  - @atlaskit/media-core@23.0.1
- [none] Updated dependencies
  [56c2df9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/56c2df9)
  - @atlaskit/media-core@23.0.1

## 32.0.1

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions
  read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/analytics-next-types@3.0.1
  - @atlaskit/tooltip@12.0.5
  - @atlaskit/field-text@7.0.4
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/toggle@5.0.5
  - @atlaskit/button@9.0.5
  - @atlaskit/lozenge@6.1.4
  - @atlaskit/field-range@5.0.3
  - @atlaskit/badge@9.0.4
  - @atlaskit/spinner@9.0.5
  - @atlaskit/field-radio-group@4.0.4
  - @atlaskit/icon@13.2.4
  - @atlaskit/dropdown-menu@6.1.5
  - @atlaskit/avatar@14.0.6

## 32.0.0

- [patch] Synchronous property "serviceHost" as part of many Interfaces in media components (like
  MediaApiConfig) is removed and replaced with asynchronous "baseUrl" as part of Auth object.
  [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
- [major] Updated dependencies
  [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
  - @atlaskit/media-test-helpers@16.0.0
  - @atlaskit/media-core@23.0.0

## 31.3.0

- [minor] change file image cards background color to transparent
  [59ccb09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59ccb09)

## 31.2.1

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/smart-card@7.0.2
  - @atlaskit/media-ui@5.0.2
  - @atlaskit/tooltip@12.0.4
  - @atlaskit/icon@13.2.2
  - @atlaskit/toggle@5.0.4
  - @atlaskit/field-radio-group@4.0.3
  - @atlaskit/button@9.0.4
  - @atlaskit/media-core@22.2.1
  - @atlaskit/media-test-helpers@15.2.1
  - @atlaskit/lozenge@6.1.3
  - @atlaskit/field-range@5.0.2
  - @atlaskit/badge@9.0.3
  - @atlaskit/spinner@9.0.4
  - @atlaskit/field-text@7.0.3
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/dropdown-menu@6.1.4
  - @atlaskit/avatar@14.0.5

## 31.2.0

- [minor] expose smart Filmstrip from media-filmstrip
  [7fa84a2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7fa84a2)

## 31.1.1

- [patch] pass mimeType to files in uploads-start event in MediaPicker
  [3485c00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3485c00)
- [patch] Updated dependencies
  [3485c00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3485c00)
  - @atlaskit/media-core@22.2.0

## 31.1.0

- [minor] use context.getFile in media-card
  [fad25ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fad25ec)
- [minor] Updated dependencies
  [fad25ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fad25ec)
  - @atlaskit/media-test-helpers@15.2.0
  - @atlaskit/media-core@22.1.0

## 31.0.0

- [major] Implemented smart cards and common views for other cards
  [fa6f865](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa6f865)
- [minor] Implemented smart cards and common UI elements
  [fdd03d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd03d8)
- [major] Implement smart card
  [49c8425](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49c8425)
- [major] Smart cards implementation and moved UI elements into media-ui package
  [3476e01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3476e01)
- [major] Updated dependencies
  [fa6f865](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa6f865)
  - @atlaskit/smart-card@7.0.0
  - @atlaskit/media-ui@5.0.0
  - @atlaskit/media-test-helpers@15.1.0
- [minor] Updated dependencies
  [fdd03d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd03d8)
  - @atlaskit/smart-card@7.0.0
  - @atlaskit/media-ui@5.0.0
  - @atlaskit/media-test-helpers@15.1.0
- [major] Updated dependencies
  [49c8425](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49c8425)
  - @atlaskit/smart-card@7.0.0
  - @atlaskit/media-ui@5.0.0
  - @atlaskit/media-test-helpers@15.1.0
- [major] Updated dependencies
  [3476e01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3476e01)
  - @atlaskit/smart-card@7.0.0
  - @atlaskit/media-ui@5.0.0

## 30.0.1

- [patch] Updated dependencies
  [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/tooltip@12.0.0
  - @atlaskit/smart-card@6.0.1
  - @atlaskit/icon@13.1.1
  - @atlaskit/dropdown-menu@6.1.1
  - @atlaskit/avatar@14.0.1

## 30.0.0

- [major] Updates to React ^16.4.0
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/smart-card@6.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/toggle@5.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/media-ui@4.0.0
  - @atlaskit/media-core@22.0.0
  - @atlaskit/media-test-helpers@15.0.0
  - @atlaskit/lozenge@6.0.0
  - @atlaskit/field-range@5.0.0
  - @atlaskit/badge@9.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/field-radio-group@4.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/dropdown-menu@6.0.0
  - @atlaskit/avatar@14.0.0
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/smart-card@6.0.0
  - @atlaskit/media-ui@4.0.0
  - @atlaskit/media-test-helpers@15.0.0
  - @atlaskit/media-core@22.0.0
  - @atlaskit/analytics-next-types@3.0.0
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/toggle@5.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/lozenge@6.0.0
  - @atlaskit/field-range@5.0.0
  - @atlaskit/badge@9.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/field-radio-group@4.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/dropdown-menu@6.0.0
  - @atlaskit/avatar@14.0.0

## 29.1.11

- [patch] Use proper analytics-next types
  [a6ac341](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6ac341)
- [none] Updated dependencies
  [a6ac341](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6ac341)
  - @atlaskit/analytics-next-types@2.1.9

## 29.1.10

- [none] Updated dependencies
  [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)
  - @atlaskit/button@8.2.5
  - @atlaskit/smart-card@5.3.3
  - @atlaskit/dropdown-menu@5.2.3
  - @atlaskit/avatar@13.0.0
- [patch] Updated dependencies
  [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
  - @atlaskit/avatar@13.0.0
  - @atlaskit/smart-card@5.3.3
  - @atlaskit/button@8.2.5
  - @atlaskit/dropdown-menu@5.2.3

## 29.1.9

- [patch] Render empty component in CardList when there are no items in the collection
  [9a1b6a2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9a1b6a2)

## 29.1.8

- [patch] Updated dependencies
  [42ee1ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42ee1ea)
  - @atlaskit/media-test-helpers@14.0.6
  - @atlaskit/media-core@21.0.0

## 29.1.7

- [patch] Updated dependencies
  [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)
  - @atlaskit/avatar@12.0.0
  - @atlaskit/smart-card@5.3.2
  - @atlaskit/dropdown-menu@5.2.2

## 29.1.6

- [patch] Bitbucket images were displaying at 100% of the container, and not respect max-width of
  the image. ED-4946 [370c812](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/370c812)

## 29.1.5

- [patch] Updated dependencies
  [c57e9c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c57e9c1)
  - @atlaskit/media-test-helpers@14.0.4
  - @atlaskit/media-core@20.0.0

## 29.1.4

- [patch] Updated dependencies
  [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
  - @atlaskit/spinner@8.0.0
  - @atlaskit/smart-card@5.3.1
  - @atlaskit/button@8.2.3

## 29.1.3

- [patch] Updated dependencies
  [74a0d46](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/74a0d46)
  - @atlaskit/smart-card@5.3.0
- [patch] Updated dependencies
  [6c6f078](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c6f078)
  - @atlaskit/smart-card@5.3.0
- [patch] Updated dependencies
  [5bb26b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5bb26b4)
  - @atlaskit/smart-card@5.3.0

## 29.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/media-ui@3.1.2
  - @atlaskit/media-test-helpers@14.0.3
  - @atlaskit/media-core@19.1.3
  - @atlaskit/tooltip@10.2.1
  - @atlaskit/field-text@6.0.4
  - @atlaskit/button@8.1.2
  - @atlaskit/toggle@4.0.3
  - @atlaskit/lozenge@5.0.4
  - @atlaskit/field-range@4.0.3
  - @atlaskit/spinner@7.0.2
  - @atlaskit/field-radio-group@3.0.4
  - @atlaskit/icon@12.1.2
  - @atlaskit/dropdown-menu@5.0.4

## 29.1.1

- [patch] Update changelogs to remove duplicate
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/smart-card@5.2.1
  - @atlaskit/media-ui@3.1.1
  - @atlaskit/media-test-helpers@14.0.2
  - @atlaskit/media-core@19.1.2
  - @atlaskit/spinner@7.0.1
  - @atlaskit/lozenge@5.0.3
  - @atlaskit/icon@12.1.1
  - @atlaskit/analytics-next@2.1.8
  - @atlaskit/field-radio-group@3.0.3
  - @atlaskit/dropdown-menu@5.0.3
  - @atlaskit/button@8.1.1
  - @atlaskit/badge@8.0.3
  - @atlaskit/avatar@11.1.1
  - @atlaskit/docs@4.1.1

## 29.1.0

- [patch] Updated dependencies
  [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/spinner@7.0.0
  - @atlaskit/smart-card@5.2.0
  - @atlaskit/tooltip@10.2.0
  - @atlaskit/dropdown-menu@5.0.2
  - @atlaskit/avatar@11.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/media-ui@3.1.0
  - @atlaskit/toggle@4.0.2
  - @atlaskit/field-radio-group@3.0.2
  - @atlaskit/docs@4.1.0
  - @atlaskit/media-core@19.1.1
  - @atlaskit/media-test-helpers@14.0.1
  - @atlaskit/lozenge@5.0.2
  - @atlaskit/field-text@6.0.2
  - @atlaskit/field-range@4.0.2
  - @atlaskit/badge@8.0.2
  - @atlaskit/analytics-next@2.1.7
  - @atlaskit/button@8.1.0

## 29.0.3

- [patch] Updated dependencies
  [2de7ce7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2de7ce7)
  - @atlaskit/smart-card@5.1.1

## 29.0.2

- [patch] Updated dependencies
  [823caef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/823caef)
  - @atlaskit/smart-card@5.1.0

## 29.0.1

- [patch] Updated dependencies
  [732d2f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/732d2f5)
  - @atlaskit/smart-card@5.0.0

## 29.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to
  ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies
  [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/smart-card@4.0.0
  - @atlaskit/media-ui@3.0.0
  - @atlaskit/media-test-helpers@14.0.0
  - @atlaskit/media-core@19.0.0
  - @atlaskit/tooltip@10.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/toggle@4.0.0
  - @atlaskit/field-radio-group@3.0.0
  - @atlaskit/field-text@6.0.0
  - @atlaskit/analytics-next@2.1.4
  - @atlaskit/button@8.0.0
  - @atlaskit/lozenge@5.0.0
  - @atlaskit/field-range@4.0.0
  - @atlaskit/badge@8.0.0
  - @atlaskit/spinner@6.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/dropdown-menu@5.0.0
  - @atlaskit/avatar@11.0.0

## 28.0.6

- [patch] Updated dependencies
  [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/smart-card@3.0.4

## 28.0.5

- [patch] Updated dependencies
  [35d547f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d547f)
  - @atlaskit/smart-card@3.0.3

## 28.0.4

- [patch][f87724e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f87724e)
- [none] Updated dependencies
  [f87724e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f87724e)
  - @atlaskit/media-test-helpers@13.0.2

## 28.0.3

- [patch] Fix Card's defaultProps TS type
  [527bc9c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/527bc9c)

## 28.0.2

- [patch] Remove card's "shown" analytics event
  [7877ce6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7877ce6)

## 28.0.1

- [patch] Updated dependencies
  [bd26d3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd26d3c)
  - @atlaskit/media-core@18.1.1
  - @atlaskit/media-test-helpers@13.0.1

## 28.0.0

- [major] Updated dependencies
  [84f6f91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84f6f91)
  - @atlaskit/media-test-helpers@13.0.0
  - @atlaskit/media-core@18.1.0
- [patch] Updated dependencies
  [9041d71](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9041d71)
  - @atlaskit/media-test-helpers@13.0.0
  - @atlaskit/media-core@18.1.0

## 27.1.4

- [patch] Updated dependencies
  [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/smart-card@3.0.2
  - @atlaskit/media-ui@2.1.1
  - @atlaskit/tooltip@9.2.1
  - @atlaskit/toggle@3.0.2
  - @atlaskit/field-radio-group@2.0.3
  - @atlaskit/field-text@5.0.3
  - @atlaskit/media-test-helpers@12.0.4
  - @atlaskit/media-core@18.0.3
  - @atlaskit/analytics-next@2.1.1
  - @atlaskit/dropdown-menu@4.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/field-range@3.0.2
  - @atlaskit/badge@7.1.2
  - @atlaskit/spinner@5.0.2
  - @atlaskit/avatar@10.0.6
  - @atlaskit/docs@3.0.4
  - @atlaskit/lozenge@4.0.1

## 27.1.3

- [patch] Renamed smart card components and exposed inline smart card views
  [1094bb6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1094bb6)
- [patch] Updated dependencies
  [1094bb6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1094bb6)
  - @atlaskit/smart-card@3.0.0

## 27.1.2

- [patch] Move toHumanReadableMediaSize to media-ui
  [b36c763](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b36c763)
- [patch] Updated dependencies
  [b36c763](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b36c763)
  - @atlaskit/media-ui@2.1.0

## 27.1.0

- [minor] Added "disableOverlay" prop to Card and CardView public API
  [533d085](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/533d085)

## 27.0.4

- [patch] hide link items from CardList (Sidebard)
  [dd2c7e7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd2c7e7)

## 27.0.3

- [patch] Turn side effects to true due to rxjs operators imports
  [668f01c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/668f01c)
- [patch] Turn side effects to true due to rxjs operators imports
  [5eddd49](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5eddd49)

## 27.0.2

- [patch] remove polished dependency
  [0e54c69](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e54c69)

## 26.0.1

- [patch] Added missing dependencies and added lint rule to catch them all
  [0672503](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0672503)

## 26.0.0

- [major] Bump to React 16.3.
  [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 25.2.0

- [minor] use local preview in MediaCard when available
  [b33788b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b33788b)

## 25.1.6

- [patch] Fix typo and potential memory leak
  [6ecc601](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ecc601)

## 25.1.5

- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake
  [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)

## 25.1.3

- [patch] Fix/revert TS TDs in analytics-next
  [1284d32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1284d32)

## 25.1.2

- [patch] ED-4030 Don't reload Image cards again after upload is done
  [9aff937](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9aff937)

## 25.1.0

- [minor] Add analytics events for click and show actions of media-card
  [031d5da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/031d5da)
- [minor] Add analytics events for click and show actions of media-card
  [b361185](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b361185)

## 25.0.0

- [major] icons are now assignable to card actions, which will cause media cards to render upto 2
  icon buttons, or a dropdown menu if more than 2 actions are set
  [649871c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/649871c)

## 24.1.6

- [patch] added a cursor to application cards when the onClick property is passed
  [97cb9c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97cb9c2)

## 24.1.5

- [patch] Remove TS types that requires styled-components v3
  [836e53b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/836e53b)

## 24.1.3

- [patch] Add key as an optional parameter to applicationCard actions
  [28be081](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/28be081)

## 24.1.2

- [patch] fix issues with ellipsing of new smart-card designs
  [ec2bed9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec2bed9)

## 24.1.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3
  [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 24.0.6

- [patch] Introduce media-ui package
  [39579e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/39579e2)

## 24.0.5

- [patch] fix new smart-card design which is showing the dropdown below consecutive smart-cards
  [5574b67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5574b67)
- [patch] fix issue with smart-card dropdown being hidden behind successive cards in new designs
  [ff01687](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff01687)

## 24.0.4

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2
  [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 24.0.3

- [patch] fixed issue where clicking on smart-card try-again and cancel links would trigger onClick
  [1e575b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e575b3)

## 24.0.2

- [patch] added missing smart-card action states
  [3f7536e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f7536e)

## 23.2.2

- [patch] Migrate Navigation from Ak repo to ak mk 2 repo, Fixed flow typing inconsistencies in ak
  mk 2 [bdeef5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bdeef5b)

## 23.2.1

- [patch] added an offset to load lazily loaded cards earlier
  [d1d891c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d1d891c)

## 23.2.0

- [minor] Add React 16 support.
  [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 23.1.1

- [patch] Update dependencies
  [623f8ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/623f8ca)

## 23.1.0

- [minor] Added new AppCardView v1.5 designs behind a feature flag.
  [92bc6c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92bc6c8)

## 23.0.2

- [patch] Make Card to work with pixel units
  [dedba4f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dedba4f)

## 23.0.1

- [patch] Make Card to work properly with pixel units
  [69c6443](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c6443)
- [patch] Dont use default dimensions for link cards
  [ae94181](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae94181)

## 23.0.0

- [major] Bump media-core peer dependency to next major versoin (12)
  [0a84f90](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a84f90)

## 22.4.2

- [patch] fix z-index issue for app cards
  [d2e05ae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d2e05ae)

## 22.4.1

- [patch] Use default dimensions in CardView when dimensions are not provided
  [d07f3f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d07f3f8)

## 22.4.0

- [minor] make Card and CardView to work properly when percetanges are passed as dimensions
  [3178808](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3178808)

## 22.3.0

- [minor] Update signature onClick event on filmstrip (renderer)
  [30bdfcc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30bdfcc)
- [minor] Update signature onClick event on filmstrip (renderer)
  [dbced25](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dbced25)
- [minor] Update signature onClick event on filmstrip (renderer)
  [7ee4743](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ee4743)

## 22.2.7

- [patch] fix lazy-loading of cards when scrolling up
  [868505d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/868505d)

## 22.2.6

- [patch] Show static images for gifs in small cards
  [e2508f9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e2508f9)
- [patch] Show static images for gifs in small cards
  [e2508f9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e2508f9)

## 22.2.5

- [patch] Fixed hover state for link media-cards in renderer
  [05ae05d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/05ae05d)

## 22.2.3

- [patch] Bumping dependency on docs (from a failed build)
  [6949056](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6949056)

## 22.2.1

- [patch] Migrated to the new repo and updated dependencies
  [f76434e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f76434e)

## 2.1.1 (2017-09-18)

- bug fix; update media-core and media-test-helpers version
  ([00108cf](https://bitbucket.org/atlassian/atlaskit/commits/00108cf))

## 2.1.0 (2017-08-11)

- feature; bump :allthethings: ([f4b1375](https://bitbucket.org/atlassian/atlaskit/commits/f4b1375))

## 2.0.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps
  ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 1.0.0 (2017-06-07)

- feature; fix imgSrc property ([d2274ce](https://bitbucket.org/atlassian/atlaskit/commits/d2274ce))
- feature; mediaImage component skeleton
  ([5dd2f84](https://bitbucket.org/atlassian/atlaskit/commits/5dd2f84))
