# @atlaskit/link-picker

## 1.47.12

### Patch Changes

- Updated dependencies

## 1.47.11

### Patch Changes

- Updated dependencies

## 1.47.10

### Patch Changes

- [#167504](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/167504)
  [`83a2ce1f5117e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/83a2ce1f5117e) -
  Replaced deprecated typography styles with new components and tokens.
- Updated dependencies

## 1.47.9

### Patch Changes

- [#170185](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170185)
  [`b49a8b5571579`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b49a8b5571579) -
  Convert typograhy to Heading

## 1.47.8

### Patch Changes

- [#167375](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/167375)
  [`ce85e442a7d6e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ce85e442a7d6e) -
  [ux] Use atlaskit primitives for typography

## 1.47.7

### Patch Changes

- [#167132](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/167132)
  [`a43e7708c667f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a43e7708c667f) -
  [ux] Migrate HTML heading tags to Heading AtlasKit component
- Updated dependencies

## 1.47.6

### Patch Changes

- Updated dependencies

## 1.47.5

### Patch Changes

- Updated dependencies

## 1.47.4

### Patch Changes

- Updated dependencies

## 1.47.3

### Patch Changes

- [#156396](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156396)
  [`0d51b154611bd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0d51b154611bd) -
  Fix a11y issue with aria-controls by setting aria-expanded true only when results are shown on
  input role=combobox
- Updated dependencies

## 1.47.2

### Patch Changes

- Updated dependencies

## 1.47.1

### Patch Changes

- Updated dependencies

## 1.47.0

### Minor Changes

- [#147531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147531)
  [`b599457543db5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b599457543db5) -
  Officially enables/uses the `emptyStateNoResults` option from plugins to render a custom empty
  state screen when there is no active query (via cleanup of
  platform.linking-platform.link-picker.enable-empty-state ff).

## 1.46.1

### Patch Changes

- Updated dependencies

## 1.46.0

### Minor Changes

- [#145714](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/145714)
  [`bf057f6cc9712`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bf057f6cc9712) -
  Updates the search results section to have a minimum height (by cleanup of ff
  platform.linking-platform.link-picker.fixed-height-search-results). Can be opt-ed out by using the
  newly added `adaptiveHeight` prop.

### Patch Changes

- Updated dependencies

## 1.45.1

### Patch Changes

- [#142271](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/142271)
  [`b6147e8a87a2d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b6147e8a87a2d) -
  Add try/catch around localStorage usages

## 1.45.0

### Minor Changes

- [#134720](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134720)
  [`d68e52d41458c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d68e52d41458c) -
  Add UFO performance monitoring support

## 1.44.1

### Patch Changes

- [#134101](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134101)
  [`1f36f8dc358de`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1f36f8dc358de) -
  [ux] Minor UI style and copy tweaks

## 1.44.0

### Minor Changes

- [#132649](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132649)
  [`b99bd2fb0aeeb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b99bd2fb0aeeb) -
  Fixes support for plugin empty state behind ff. If successful will be made available in future
  release.
- [#131548](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/131548)
  [`282ddb3575504`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/282ddb3575504) -
  [ux] Allow custom subtitle content in the link picker, and allow link item names to extend over
  multiple lines. Both changes are opt-in via a LinkPickerPlugin, so these new features will only
  appear if the plugin is changed to consume them.

## 1.43.0

### Minor Changes

- [#131465](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/131465)
  [`df8ea6dec9bdc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/df8ea6dec9bdc) -
  [ux] Added in a new temporary prop, UNSAFE_moveSubmitButton, to the LinkPicker. This prop moves
  the submit button below the input field and is only to be used in an experiment being run within
  Confluence.

## 1.42.5

### Patch Changes

- Updated dependencies

## 1.42.4

### Patch Changes

- [#128698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128698)
  [`0a846f1404337`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0a846f1404337) -
  Small css refactor. No expected observable changes.
- Updated dependencies

## 1.42.3

### Patch Changes

- [#131099](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/131099)
  [`9df8c5e6d9886`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9df8c5e6d9886) -
  Accessibility and minor UI bug fixes

## 1.42.2

### Patch Changes

- Updated dependencies

## 1.42.1

### Patch Changes

- Updated dependencies

## 1.42.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 1.41.5

### Patch Changes

- [#128837](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128837)
  [`4ed57a62dc3d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4ed57a62dc3d7) -
  Reverting Adding React 18 support

## 1.41.4

### Patch Changes

- Updated dependencies

## 1.41.3

### Patch Changes

- Updated dependencies

## 1.41.2

### Patch Changes

- [#126437](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/126437)
  [`272d94f729337`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/272d94f729337) -
  Updates typing of ConditionalSpotlightTargetWrapper to be compatible for React18
- Updated dependencies

## 1.41.1

### Patch Changes

- [#124870](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124870)
  [`6f1acda08a4f4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6f1acda08a4f4) -
  Removes internal usage of React.FC types
- Updated dependencies

## 1.41.0

### Minor Changes

- [#124114](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124114)
  [`0add97fe66134`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0add97fe66134) -
  A `/lazy` entrypoint has been added.

  Prefer the default export from the default entrypoint if you do not want a lazy-loaded version.

  ```tsx
  import LinkPicker from '@atlaskit/link-picker';
  ```

  Prefer the `LazyLinkPicker` export from the `/lazy` entrypoint if you want a lazy-loaded version.

  ```tsx
  import { LazyLinkPicker } from '@atlaskit/link-picker/lazy';
  ```

## 1.40.0

### Minor Changes

- [#117215](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117215)
  [`3f2423168897d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f2423168897d) -
  [ux] Updated components to use new iconography behind a feature flag

## 1.39.5

### Patch Changes

- Updated dependencies

## 1.39.4

### Patch Changes

- [#121030](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/121030)
  [`23d9b73dfcb67`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/23d9b73dfcb67) -
  Adding loading skeleton to issue goals and exporting the LoaderFallback in linking platform

## 1.39.3

### Patch Changes

- [#119779](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119779)
  [`1915b904e58c6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1915b904e58c6) -
  Improves the height of the suspense fallback when mounting the picker with a url prop (behind ff).
- Updated dependencies

## 1.39.2

### Patch Changes

- Updated dependencies

## 1.39.1

### Patch Changes

- [#118372](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118372)
  [`e25de82c2de31`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e25de82c2de31) -
  Cleans up ff platform.linking-platform.link-picker.translations-map. Internally changes
  translation imports to use an import map instead of dynamic imports.

## 1.39.0

### Minor Changes

- [`862ad2995ac6f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/862ad2995ac6f) -
  Update support form URL within error component for fedRAMP compliance

## 1.38.2

### Patch Changes

- Updated dependencies

## 1.38.1

### Patch Changes

- Updated dependencies

## 1.38.0

### Minor Changes

- [#114894](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114894)
  [`e20ce1f008cd8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e20ce1f008cd8) -
  Cleans up ff, no longer uses the `@atlaskit/empty-state` component and now directly leverages the
  Heading Provider from `@atlaskit/heading` to allow more flexibility of the heading levels
  rendered.

## 1.37.4

### Patch Changes

- Updated dependencies

## 1.37.3

### Patch Changes

- [#113192](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113192)
  [`80dfa651ba955`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/80dfa651ba955) -
  Migration of native HTML buttons to new Pressable primitive.
- [#113192](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113192)
  [`80dfa651ba955`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/80dfa651ba955) -
  Migration of native HTML buttons to new Pressable primitive.

## 1.37.2

### Patch Changes

- Updated dependencies

## 1.37.1

### Patch Changes

- Updated dependencies

## 1.37.0

### Minor Changes

- [#104975](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104975)
  [`2b5a07fc13f8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2b5a07fc13f8) -
  Add database and smart link to link picker search results

## 1.36.2

### Patch Changes

- Updated dependencies

## 1.36.1

### Patch Changes

- Updated dependencies

## 1.36.0

### Minor Changes

- [#94307](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94307)
  [`bf0df557b820`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bf0df557b820) -
  Adding the raw data-object of selected item to the onSubmit-callback. Also fixes a small alignment
  issue with list items.

## 1.35.2

### Patch Changes

- Updated dependencies

## 1.35.1

### Patch Changes

- [#92007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92007)
  [`85525725cb0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85525725cb0d) -
  Migrated to the new button component
- Updated dependencies

## 1.35.0

### Minor Changes

- [#91586](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91586)
  [`b3135ab49e16`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b3135ab49e16) -
  Updated `@atlaskit/tabs` dependency which removed baked-in horizontal padding. There may be some
  very slight difference in padding after this change.

### Patch Changes

- Updated dependencies

## 1.34.10

### Patch Changes

- [#91203](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91203)
  [`3c8348468618`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3c8348468618) -
  Minor Typescript changes to improve compatibility with React 18

## 1.34.9

### Patch Changes

- [#90153](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/90153)
  [`a679d89ed314`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a679d89ed314) -
  Converts lazy translations import from dynamic import to static map of imports, behind ff
  platform.linking-platform.link-picker.translations-map

## 1.34.8

### Patch Changes

- [#88354](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88354)
  [`4c87d9b4f0c2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4c87d9b4f0c2) -
  The internal composition of this component has changed. There is no expected change in behavior.
- Updated dependencies

## 1.34.7

### Patch Changes

- [#87202](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87202)
  [`fe89dc2c3c0a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fe89dc2c3c0a) -
  EDM-9608 Cleanup onSubmitCapture feature flag in link picker

## 1.34.6

### Patch Changes

- [#83188](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83188)
  [`cd5d06cd3329`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cd5d06cd3329) -
  Minor adjustments to improve compatibility with React 18

## 1.34.5

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.34.4

### Patch Changes

- [#81744](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81744)
  [`4bb803ce7129`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4bb803ce7129) -
  Internal changes. There is no expected visual change.
- Updated dependencies

## 1.34.3

### Patch Changes

- [#81158](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81158)
  [`d08a50c6d90b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d08a50c6d90b) -
  Updates empty states to no longer use the `@atlaskit/empty-state` component in order to leverage
  Heading Provider from `@atlaskit/heading`, behind ff

## 1.34.2

### Patch Changes

- [#80085](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80085)
  [`7febfed958dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7febfed958dd) -
  Update usage of `React.FC` to explicity include `children`

## 1.34.1

### Patch Changes

- [#77721](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77721)
  [`724546c920cf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/724546c920cf) -
  Changed some hard-coded px values and replaced with space tokens

## 1.34.0

### Minor Changes

- [#73644](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/73644)
  [`1826cabe2425`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1826cabe2425) -
  Cleans up platform.linking-platform.link-picker.lazy-intl-messages. Will now always attempt to
  lazy load translations.

## 1.33.1

### Patch Changes

- [#71135](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71135)
  [`88c865c6359d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/88c865c6359d) -
  Fix issues with screen readers detecting a list when no plugin is provided

## 1.33.0

### Minor Changes

- [#69577](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69577)
  [`fcd935281ee6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fcd935281ee6) -
  Updates onCancel prop to be optional. When not provided, cancel button is not displayed.

## 1.32.1

### Patch Changes

- [#66404](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66404)
  [`61ac6afc1d89`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/61ac6afc1d89) -
  EDM-9025 Add onSubmitCapture behind feature flag

## 1.32.0

### Minor Changes

- [#61981](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61981)
  [`0d7a20c43478`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0d7a20c43478) -
  [ux] Added a UI experience for when a submission is in progress

### Patch Changes

- [#64291](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64291)
  [`c44535acbea9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c44535acbea9) -
  remove platform.linking-platform.link-create.tmp-fix-translations to permanently return undefined
  in the loaderFn when dynamic import of locale messages fail.

## 1.31.0

### Minor Changes

- [#64242](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64242)
  [`066547c92554`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/066547c92554) -
  Add customMessages prop to link picker

## 1.30.14

### Patch Changes

- [#63626](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63626)
  [`e71c8f5f586e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e71c8f5f586e) -
  loaderFn returns undefined if failed to dynamicaly import locale messages - fixes issue in Jira
  where default English replaces languages chunk.
- Updated dependencies

## 1.30.13

### Patch Changes

- Updated dependencies

## 1.30.12

### Patch Changes

- [#61649](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61649)
  [`b3da85b3276a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b3da85b3276a) -
  Replaces internal lazy messages provider implementation with @atlaskit/intl-messages-provider with
  no expected functional change beyond now supporting inherting messages from parent intl provider.
  Use of lazy messages provider still is feature flagged behind
  'platform.linking-platform.link-picker.lazy-intl-messages'.

## 1.30.11

### Patch Changes

- Updated dependencies

## 1.30.10

### Patch Changes

- [#60029](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60029)
  [`b9826ea49c47`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b9826ea49c47) -
  Update dependencies that were impacted by HOT-106483 to latest.

## 1.30.9

### Patch Changes

- Updated dependencies

## 1.30.8

### Patch Changes

- [#43874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43874)
  [`71d228970ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/71d228970ef) - Enrol
  packages to push model in JFE
- Updated dependencies

## 1.30.7

### Patch Changes

- Updated dependencies

## 1.30.6

### Patch Changes

- Updated dependencies

## 1.30.5

### Patch Changes

- Updated dependencies

## 1.30.4

### Patch Changes

- [#43264](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43264)
  [`b4e3b6f54bd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4e3b6f54bd) -
  Explicitly set link picker to display block

## 1.30.3

### Patch Changes

- Updated dependencies

## 1.30.2

### Patch Changes

- Updated dependencies

## 1.30.1

### Patch Changes

- [#41114](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41114)
  [`f8efb1a7ce5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f8efb1a7ce5) - Add env
  var default and fix array iterable for local consumption typechecking

## 1.30.0

### Minor Changes

- [#39671](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39671)
  [`1e70dc014bf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e70dc014bf) - Adds
  support for `paddingLeft`, `paddingRight`, `paddingTop` and `paddingBottom` props that enable
  overriding the internal padding of the link picker.

## 1.29.1

### Patch Changes

- [#39787](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39787)
  [`6900f89eb0e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6900f89eb0e) - Internal
  changes to use space tokens. There is no expected visual or behaviour change.

## 1.29.0

### Minor Changes

- [#36656](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36656)
  [`96287a9f42a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/96287a9f42a) - Adds
  disableWidth prop to component to allow the link picker to fill the available space (width: 100%)

## 1.28.3

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json
- Updated dependencies

## 1.28.2

### Patch Changes

- [#38511](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38511)
  [`d2cf6a73817`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2cf6a73817) - Remove
  redundant aria-label from the input field

## 1.28.1

### Patch Changes

- [#37925](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37925)
  [`f01deb5e6ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f01deb5e6ab) - Use
  injected env vars instead of version.json

## 1.28.0

### Minor Changes

- [#37347](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37347)
  [`db2a42eb771`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db2a42eb771) - [ux]
  EDM-7273 Jira create feature discovery

## 1.27.2

### Patch Changes

- [#36677](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36677)
  [`fa3c0d93eae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa3c0d93eae) - Improves
  fixed height display of link picker when
  'platform.linking-platform.link-picker.fixed-height-search-results' is enabled.
- Updated dependencies

## 1.27.1

### Patch Changes

- [#36817](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36817)
  [`3bebfdcc3ae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3bebfdcc3ae) - [ux] Fix
  pt-BR messages

## 1.27.0

### Minor Changes

- [#36671](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36671)
  [`fa8b71abb1a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa8b71abb1a) - [ux] Add
  title to link picker results

## 1.26.0

### Minor Changes

- [#36197](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36197)
  [`ae65b485bca`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae65b485bca) - [ux]
  Better minimum height for link picker error and loading state

## 1.25.6

### Patch Changes

- [#36147](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36147)
  [`21f74cac9b6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/21f74cac9b6) -
  EDM-6818: Fixes bug where first item of link picker search results appear selected when there is
  no current selection and a search result is focused. Focus on link picker search results are now
  on the item that the user clicks/focuses on.

## 1.25.5

### Patch Changes

- [#36167](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36167)
  [`27f7faa992f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/27f7faa992f) - Minor
  internal refactor with no expected functional changes.

## 1.25.4

### Patch Changes

- [#35979](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35979)
  [`2d56ffa47b1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d56ffa47b1) - [ux]
  Removes the decorative search icon from the URL/search field.

## 1.25.3

### Patch Changes

- [#35951](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35951)
  [`ceaa8d259c2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ceaa8d259c2) - Minor
  internal refactors with no expected functional changes.

## 1.25.2

### Patch Changes

- Updated dependencies

## 1.25.1

### Patch Changes

- [#35741](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35741)
  [`e967d74f6f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e967d74f6f8) - Changes
  the link picker search results subtext color from 'color.text' to 'color.text.subtlest'.

## 1.25.0

### Minor Changes

- [#35199](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35199)
  [`bf9689fce97`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf9689fce97) - [ux]
  Modified behaviour to load to all plugins before Link Picker UI is loaded, introduces a isLoading
  attribute to indicate when a plugins have loaded

## 1.24.1

### Patch Changes

- [#35545](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35545)
  [`83a802f2806`](https://bitbucket.org/atlassian/atlassian-frontend/commits/83a802f2806) - Release
  translations

## 1.24.0

### Minor Changes

- [#33781](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33781)
  [`5a810cbc8c7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a810cbc8c7) - Adds
  internal MessagesProvider behind `platform.linking-platform.link-picker.lazy-intl-messages`
  feature flag which, when enabled, lazy loads and self-provides messages for the current locale (as
  defined by a parent `IntlProvider`).

## 1.23.2

### Patch Changes

- [#35058](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35058)
  [`44d226ae268`](https://bitbucket.org/atlassian/atlassian-frontend/commits/44d226ae268) - [ux]
  This adds support for Confluence Whiteboards in Link Picker search. This also adds a new scope in
  `@atlassian/search-client`, which contains pages, blogs and whiteboards.

## 1.23.1

### Patch Changes

- [#34282](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34282)
  [`1d9bcdf92d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1d9bcdf92d8) -
  EDM-5278: refactor timestamp in link-picker to remove string concatenation, to switch between
  relative and absolute time with correct display values and add new atlas kit example to test
  translations for link-picker

## 1.23.0

### Minor Changes

- [#34189](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34189)
  [`5b744a84924`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b744a84924) - [ux]
  Support for an empty state in LinkPicker, and implementation of empty state for the
  link-picker-atlassian-plugin

### Patch Changes

- Updated dependencies

## 1.22.2

### Patch Changes

- [#34443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34443)
  [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing
  unused dependencies and dev dependencies

## 1.22.1

### Patch Changes

- [#34463](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34463)
  [`ae5ac36af00`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae5ac36af00) - Updates
  analytics codegen to support screen events.

## 1.22.0

### Minor Changes

- [#34268](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34268)
  [`cd623c7a474`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd623c7a474) - [ux]
  Wrap search input with conditional spotlight target for better onboarding

## 1.21.0

### Minor Changes

- [#33811](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33811)
  [`63a3923d4cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63a3923d4cd) - Fix tab
  attribute analytics to display correct product on initial load

## 1.20.3

### Patch Changes

- [#33689](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33689)
  [`d86bc75af82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d86bc75af82) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 1.20.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 1.20.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 1.20.0

### Minor Changes

- [#33210](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33210)
  [`4bf861f02cc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4bf861f02cc) - Callback
  label now supports a string

## 1.19.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 1.18.4

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils
- Updated dependencies

## 1.18.3

### Patch Changes

- [#30834](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30834)
  [`ee4573b4721`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ee4573b4721) - [ux]
  Handle keyboard navigation as a listbox Updates focus style of link picker listbox

## 1.18.2

### Patch Changes

- [#32311](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32311)
  [`a02eed2974e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a02eed2974e) - Move
  codegen into @atlassian scope to publish it to private registry

## 1.18.1

### Patch Changes

- [#32170](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32170)
  [`b57c925587f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b57c925587f) - Migrated
  use of `gridSize` to space tokens where possible. There is no expected visual or behaviour change.

## 1.18.0

### Minor Changes

- [#30977](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30977)
  [`d7af47bbf65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7af47bbf65) - [ux]
  Adds new action button and updates the style of current cancel button

## 1.17.0

### Minor Changes

- [#30674](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30674)
  [`204e2a97119`](https://bitbucket.org/atlassian/atlassian-frontend/commits/204e2a97119) - Defines
  new LinkPickerPluginAction and new LinkInputType for Create

## 1.16.16

### Patch Changes

- [#30583](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30583)
  [`14363bff579`](https://bitbucket.org/atlassian/atlassian-frontend/commits/14363bff579) -
  Formatting change for i18n translations

## 1.16.15

### Patch Changes

- [#30237](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30237)
  [`d0c67f1cc2b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0c67f1cc2b) -
  Prettier-ignore added to i18n translations

## 1.16.14

### Patch Changes

- Updated dependencies

## 1.16.13

### Patch Changes

- Updated dependencies

## 1.16.12

### Patch Changes

- [#29330](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29330)
  [`9d9ee3fbc84`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d9ee3fbc84) - EDM-5557
  Reduce min height of link-picker

## 1.16.11

### Patch Changes

- [#29067](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29067)
  [`08de765c04b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/08de765c04b) - Moves
  dependency of user agent detection code to `@atlaskit/linking-common/user-agent`
- Updated dependencies

## 1.16.10

### Patch Changes

- Updated dependencies

## 1.16.9

### Patch Changes

- [#29227](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29227)
  [`4ee60bafc6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ee60bafc6d) -
  ED-16603: Remove tooltips from VR tests and make them opt in. To opt-in, add `allowedSideEffects`
  when loading the page.

## 1.16.8

### Patch Changes

- [#28294](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28294)
  [`5441fa9235d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5441fa9235d) - [ux]
  XPC3P-106 Fix recents not showing when switching tabs in new link picker
- Updated dependencies

## 1.16.7

### Patch Changes

- [#28362](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28362)
  [`10410539ac9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/10410539ac9) - Url
  utils added (normalizeURL and isSafeUrl). Available to export
- Updated dependencies

## 1.16.6

### Patch Changes

- [#28324](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28324)
  [`6455cf006b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6455cf006b3) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving performance.

## 1.16.5

### Patch Changes

- [#28090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28090)
  [`3a35da6c331`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a35da6c331) - DTR-825
  ED-9775: added jamfselfservice:// to whitelistedURLPatterns

## 1.16.4

### Patch Changes

- Updated dependencies

## 1.16.3

### Patch Changes

- Updated dependencies

## 1.16.2

### Patch Changes

- [#27972](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27972)
  [`998a9316ce3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/998a9316ce3) - EDM-4959
  update scrolling tabs to remain still for link picker when tabs are changed as a fix for a flakey
  vr test

## 1.16.1

### Patch Changes

- [#28114](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28114)
  [`f3aa608f0ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3aa608f0ba) - Update
  i18n translations from Traduki

## 1.16.0

### Minor Changes

- [#27732](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27732)
  [`e409fa726a9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e409fa726a9) - [ux]
  Disable the insert button when Link picker shows an error and hide buttons when user is
  unauthenticated to the active 3P tab

## 1.15.1

### Patch Changes

- [#27835](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27835)
  [`4a83c28f27b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a83c28f27b) - Add
  support for inline SVGs in ListItem by converting them to Base64 images

## 1.15.0

### Minor Changes

- [#27624](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27624)
  [`b7ace618362`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7ace618362) - [ux]
  EDM-3578: adding a prop hideDisplayText for link picker to allow support that stops rendering of
  the display text field in link picker if prop is set to true.

## 1.14.0

### Minor Changes

- [#26943](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26943)
  [`3cbd9b63e96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cbd9b63e96) - [ux]
  Added search for 1P tabs

## 1.13.3

### Patch Changes

- [#27298](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27298)
  [`b4ed4bb728b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4ed4bb728b) -
  EDM-4923: link picker display text label has been changed from Link description to Link display
  text

## 1.13.2

### Patch Changes

- Updated dependencies

## 1.13.1

### Patch Changes

- [#26522](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26522)
  [`2933e4ddeb0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2933e4ddeb0) - Add
  searchResults shown analytic event for pre-query and post-query results

## 1.13.0

### Minor Changes

- [#26718](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26718)
  [`91bd9e3193c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/91bd9e3193c) - add
  experimental support for UNSAFE_onActivation call for plugins

## 1.12.0

### Minor Changes

- [#25323](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25323)
  [`2ecb5e8a6d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ecb5e8a6d9) - [ux]
  introduce horizontal scrolling tabs

## 1.11.2

### Patch Changes

- [#26281](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26281)
  [`841110b3cf0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/841110b3cf0) - Adds tab
  attribute to analytics context

## 1.11.1

### Patch Changes

- [#20341](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20341)
  [`af6e73a1e17`](https://bitbucket.org/atlassian/atlassian-frontend/commits/af6e73a1e17) - Bumping
  dependencies via Renovate:

  - react-loosely-lazy

## 1.11.0

### Minor Changes

- [#25319](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25319)
  [`2cbf4131640`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2cbf4131640) - Make
  LinkPicker to accept a custom root component And now we offer a new useLinkPickerEditorProps hook
  useForgeSearchProviders hook will now get client from SmartCardContext

## 1.10.4

### Patch Changes

- [#25117](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25117)
  [`a3358adb9f1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a3358adb9f1) - Basic
  UFO Instrumentation for LinkPicker

## 1.10.3

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 1.10.2

### Patch Changes

- [#25059](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25059)
  [`8a538989c8d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a538989c8d) - [ux]
  Updated label and Placeholder messages

## 1.10.1

### Patch Changes

- [#25103](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25103)
  [`df6de875d71`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df6de875d71) - Adds
  operational logging for plugin resolve failures.

## 1.10.0

### Minor Changes

- [#25115](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25115)
  [`7dbc77d866a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7dbc77d866a) - Adds
  support for plugins providing metadata about resolved links.

## 1.9.4

### Patch Changes

- [#25101](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25101)
  [`81ac9ce10ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81ac9ce10ff) - Update
  error boundary implementation to replace analytic instrumentation for uncaught errors.

## 1.9.3

### Patch Changes

- [#24851](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24851)
  [`e3f8fb1f348`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f8fb1f348) - Adds
  tracking of how the input fields are populated ie paste vs manual vs search.

## 1.9.2

### Patch Changes

- [#25082](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25082)
  [`c37f08a275a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c37f08a275a) - Fix
  onClick event bubbling on text field clear button activation.

## 1.9.1

### Patch Changes

- [#25018](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25018)
  [`548071512ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/548071512ad) - [ux] Add
  truncating logic to metadata to be constrained to one line

## 1.9.0

### Minor Changes

- [#24791](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24791)
  [`26ca68a3993`](https://bitbucket.org/atlassian/atlassian-frontend/commits/26ca68a3993) - Add
  support for the onSubmit handler prop to receive a second argument, being a clone of the form
  submitted analytic event

## 1.8.5

### Patch Changes

- [#24725](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24725)
  [`47c9a0a3331`](https://bitbucket.org/atlassian/atlassian-frontend/commits/47c9a0a3331) - Improves
  spacing and reduced jitter of height when loading items.

## 1.8.4

### Patch Changes

- [#24595](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24595)
  [`e94f9f982b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e94f9f982b4) - Fixes
  link picker attempting to dispatch updates after being unmounted.

## 1.8.3

### Patch Changes

- [#24319](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24319)
  [`7e07778ec20`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e07778ec20) - Add
  linkState attribute to link picker analytics context

## 1.8.2

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 1.8.1

### Patch Changes

- [#24310](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24310)
  [`afd2368145a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/afd2368145a) - Added
  link picker mount/unmount analytic events

## 1.8.0

### Minor Changes

- [#24245](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24245)
  [`89fffde2a59`](https://bitbucket.org/atlassian/atlassian-frontend/commits/89fffde2a59) - Wrap
  link picker in native form element

## 1.7.1

### Patch Changes

- [#24242](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24242)
  [`e900714203d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e900714203d) - Add
  "form submitted" analytics event.

## 1.7.0

### Minor Changes

- [#23812](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23812)
  [`d0feee9b4ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0feee9b4ad) - [ux] Add
  a UI error message to display when the link picker plugin resolve throws an error

## 1.6.1

### Patch Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`e3f36b94557`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f36b94557) - Inlines
  svg assets directly into the UI

## 1.6.0

### Minor Changes

- [#23712](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23712)
  [`c9c0a119587`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c9c0a119587) - [ux]
  EDM-3881: add onContentRezise prop to allow callbacks after contents changed in items, plugin,
  tabs, etc.

## 1.5.1

### Patch Changes

- [#23753](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23753)
  [`99dba1b6364`](https://bitbucket.org/atlassian/atlassian-frontend/commits/99dba1b6364) - [ux] Fix
  the tab margin in Link Picker

## 1.5.0

### Minor Changes

- [#23410](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23410)
  [`e54051625bc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e54051625bc) - Convert
  Link Picker from class component to functional component to comply with tangerine guidelines.
  https://tangerine.staging.atl-paas.net/guides/components-and-hooks-patterns/prefer-functional-components-over-classes/

## 1.4.1

### Patch Changes

- [#23715](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23715)
  [`140453ba9f6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/140453ba9f6) - [ux]
  Move tabs to be below input fields

## 1.4.0

### Minor Changes

- [#23444](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23444)
  [`3b5e61f9b3b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b5e61f9b3b) - [ux]
  Adds in TAB UI support for Link Picker

## 1.3.0

### Minor Changes

- [#23186](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23186)
  [`0ddad39a369`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ddad39a369) - [ux]
  Lazy load the link-picker instead. The lazily loaded picker is now the default that's exported

## 1.2.1

### Patch Changes

- [#23253](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23253)
  [`d17b35d4c20`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d17b35d4c20) - Display
  validation message when submitting empty input

## 1.2.0

### Minor Changes

- [#22946](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22946)
  [`21b0c90e0d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/21b0c90e0d4) - Adds
  error boundary around the link picker to track errors and display an error message.

## 1.1.4

### Patch Changes

- [#22965](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22965)
  [`97cfed0aa0d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/97cfed0aa0d) - Add
  tests around how the link picker handles editing links

## 1.1.3

### Patch Changes

- [#23277](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23277)
  [`22e6401bf78`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22e6401bf78) - Inlines
  svg assets directly into the UI

## 1.1.2

### Patch Changes

- [#23149](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23149)
  [`28f54174eaf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f54174eaf) - Removes
  example-helpers from built distribution. Fixes missing /dist from previous patch.

## 1.1.1

### Patch Changes

- [#23111](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23111)
  [`780484d9518`](https://bitbucket.org/atlassian/atlassian-frontend/commits/780484d9518) - Fixes
  missing svg asset for no search results in version 1.1.0.

## 1.1.0

### Minor Changes

- [#22914](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22914)
  [`ba5d8ed23cc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba5d8ed23cc) - Adds
  search error message

## 1.0.0

### Major Changes

- [#22685](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22685)
  [`2e20b02bb2c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e20b02bb2c) - Initial
  major version release

## 0.11.0

### Minor Changes

- [#22793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22793)
  [`a2286b0746a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2286b0746a) - Added
  support for link picker plugins to resolve using a promise

## 0.10.0

### Minor Changes

- [#22633](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22633)
  [`dbc82a03866`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dbc82a03866) - Removed
  styled-components as a peer dependency in favor of @emotion/react

## 0.9.0

### Minor Changes

- [#22630](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22630)
  [`c1c010c8ada`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1c010c8ada) - Remove
  required container param

## 0.8.1

### Patch Changes

- [#22528](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22528)
  [`eef8c2da75b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eef8c2da75b) - [ux]
  Remove link-picker background color as it conflicts with floatingToobar borders

## 0.8.0

### Minor Changes

- [#22336](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22336)
  [`1e371fd8d23`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e371fd8d23) - Updates
  link picker to support array of plugins. Removes intl prop from LinkPickerProps type.

## 0.7.0

### Minor Changes

- [#21991](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21991)
  [`9cabbe5e920`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9cabbe5e920) - Convert
  to @atlaskit scope

## 0.6.2

### Patch Changes

- [#22155](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22155)
  [`3fb9dbd9f4e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fb9dbd9f4e) - [ux] Add
  buttons at the bottom of the form

## 0.6.1

### Patch Changes

- [#22215](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22215)
  [`93a77354b58`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93a77354b58) - Updated
  vr snapshots

## 0.6.0

### Minor Changes

- [#21604](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21604)
  [`91f2d091cfd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/91f2d091cfd) - Change
  link picker props and onSubmit API to better reflect intended usage and make breaking changes less
  likely.

## 0.5.3

### Patch Changes

- [#21673](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21673)
  [`3ef09836c04`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3ef09836c04) - [ux]
  Validates links within search text are not inserted

## 0.5.2

### Patch Changes

- [#22019](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22019)
  [`c1f3d82b994`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1f3d82b994) - Update
  to use the new V3 recents API in the Atlassian plugin

## 0.5.1

### Patch Changes

- [#22007](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22007)
  [`d90f1f42589`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d90f1f42589) - [ux]
  Shows subtitle with recently viewed if there’s no search text and results otherwise

## 0.5.0

### Minor Changes

- [#21956](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21956)
  [`7abf8824fec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7abf8824fec) - Migrate
  link picker atlassian plugin from picker package.

## 0.4.0

### Minor Changes

- [#21659](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21659)
  [`c926a95160b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c926a95160b) - Removes
  onEscape prop from the link picker.

## 0.3.2

### Patch Changes

- [#21603](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21603)
  [`08195fc6e43`](https://bitbucket.org/atlassian/atlassian-frontend/commits/08195fc6e43) - [ux] Add
  field validation error message to link input field

## 0.3.1

### Patch Changes

- Updated dependencies

## 0.3.0

### Minor Changes

- [#21515](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21515)
  [`3b3a7800978`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b3a7800978) - Export
  picker state and list item data types from picker package.

## 0.2.4

### Patch Changes

- [#21475](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21475)
  [`6d1dd7c5833`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6d1dd7c5833) - Increase
  test coverage

## 0.2.3

### Patch Changes

- [#21284](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21284)
  [`6f3a1f588e1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6f3a1f588e1) - Rewrites
  LinkSearchListItem as FC & Adds new Active state to support arrow navigation and Selected style

## 0.2.2

### Patch Changes

- [#20608](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20608)
  [`9598e13788a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9598e13788a) - [ux]
  Update token usage for better contrast

## 0.2.1

### Patch Changes

- [#21212](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21212)
  [`7fa34f27a1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7fa34f27a1f) - Displays
  a search icon inside link-picker search input when there is an active Plugin

## 0.2.0

### Minor Changes

- [#20290](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20290)
  [`1cb59c97d35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1cb59c97d35) - Adds
  AtlassianLinkPicker plugin and changes LinkPicker API to use plugins

## 0.1.1

### Patch Changes

- [#20841](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20841)
  [`df6e3bdd55f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df6e3bdd55f) -
  EDM-3088/Rewrite PanelTextInput as functional component and take advante of Atlaskit Textfield
  out-of-the-box features

## 0.1.0

### Minor Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb5997ed7af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb5997ed7af) - [ux]
  EDM-2977/change UI for link and title input fields

## 0.0.6

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4
- Updated dependencies

## 0.0.5

### Patch Changes

- Updated dependencies

## 0.0.4

### Patch Changes

- Updated dependencies

## 0.0.3

### Patch Changes

- [#19390](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19390)
  [`7f49f72e074`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f49f72e074) - copy
  existing editor component into @atlassian/link-picker
- Updated dependencies

## 0.0.2

### Patch Changes

- [#19335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19335)
  [`3deb6f44dd6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3deb6f44dd6) - create
  @atlaskit/link-picker

## 0.0.0
