# @atlaskit/link-analytics

## 8.3.3

### Patch Changes

- [#40491](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40491) [`1fedffbd64b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1fedffbd64b) - Update json-ld-types dependencies to be compatible with version

## 8.3.2

### Patch Changes

- [#40380](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40380) [`d925ab8abef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d925ab8abef) - Added a new attribute 'canBeDatasource' to link created/updated/deleted events

## 8.3.1

### Patch Changes

- [#40127](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40127) [`2cd7af71b63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2cd7af71b63) - Bump json-ld-types 3.8.0 -> 3.9.1

## 8.3.0

### Minor Changes

- [#39265](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39265) [`8b8a309cb62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b8a309cb62) - Added datasource analytic CRUD events

### Patch Changes

- Updated dependencies

## 8.2.7

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162) [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete version.json

## 8.2.6

### Patch Changes

- [#37925](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37925) [`f01deb5e6ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f01deb5e6ab) - Use injected env vars instead of version.json

## 8.2.5

### Patch Changes

- [#37720](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37720) [`e74ae7f06d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e74ae7f06d4) - Update dependency json-ld-types@3.8.0

## 8.2.4

### Patch Changes

- [#37136](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37136) [`2811ef86faf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2811ef86faf) - Update to use 'getStatus' from '@atlaskit/linking-common'
- Updated dependencies

## 8.2.3

### Patch Changes

- [#37340](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37340) [`b9355830504`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9355830504) - Opt out of peer dependency enforcement

## 8.2.2

### Patch Changes

- Updated dependencies

## 8.2.1

### Patch Changes

- [#36757](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36757) [`3fb20c4aeba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fb20c4aeba) - Add postinstall check to enforce internal peer dependencies

## 8.2.0

### Minor Changes

- [#36322](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36322) [`4db1a942f14`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4db1a942f14) - Cleans up FF enableResolveMetadataForLinkAnalytics added in 3.0.0 — feature flag is is no longer required to enable "resolved attributes".

### Patch Changes

- Updated dependencies

## 8.1.0

### Minor Changes

- [#36198](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36198) [`c5a897eb81d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c5a897eb81d) - add statusDetails attribute

## 8.0.6

### Patch Changes

- Updated dependencies

## 8.0.5

### Patch Changes

- [#35183](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35183) [`3b393e53508`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b393e53508) - Updates events triggered from link picker source event to have method of linkpicker_none if the link picker analytic event has no input method for the url field. This means if the link picker was mounted with a url and submitted without any change the method for an updated event will have updateMethod of linkpicker_none instead of having no updateMethod.

## 8.0.4

### Patch Changes

- [#34396](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34396) [`438b90799c4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/438b90799c4) - Removes urlHash from linking platform events.

## 8.0.3

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793) [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8
- Updated dependencies

## 8.0.2

### Patch Changes

- [#33581](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33581) [`65392e23be5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/65392e23be5) - Fetch for resolved attributes regardless of displayCategory (i.e. when it is 'link')

## 8.0.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649) [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`
- Updated dependencies

## 8.0.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258) [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 7.0.5

### Patch Changes

- [#32541](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32541) [`0624df1ffe1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0624df1ffe1) - Bump json-ld-types dependency
- Updated dependencies

## 7.0.4

### Patch Changes

- [#32054](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32054) [`3c287cb61c4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c287cb61c4) - Updates callbacks to source creationMethod and updateMethod attribute from link picker form submission event when provided as sourceEvent.

## 7.0.3

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424) [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils
- Updated dependencies

## 7.0.2

### Patch Changes

- [#32360](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32360) [`0ee9370595a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ee9370595a) - Update json-ld-types
- Updated dependencies

## 7.0.1

### Patch Changes

- [#32035](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32035) [`8aa0ed775f3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8aa0ed775f3) - Updates resolve attributes to return displayCategory as link instead of smartLink when handling ResolveUnsupportedError.

## 7.0.0

### Major Changes

- [#31253](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31253) [`d2703b479a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2703b479a1) - Removes extraneous exports from /resolved-attributes entry point.

### Minor Changes

- [`13ea25a119c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/13ea25a119c) - Adds support to callbacks to provide `displayCategory` link detail.

  If firing an event for a link that is not yet (or is no longer) displayed as a smart link, provide the link details `displayCategory` field the value of `link`.

  ```ts
  const { linkCreated } = useSmartLinkLifecycleAnalytics();

  /**
   * If creating a link that won't be displayed as smart link
   * fire link created with displayCategory = link
   */
  linkCreated({ url: 'https://atlassian.com', displayCategory: 'link' });

  /**
   * If the user changes the appearance of the link so it will now be displayed
   * as a smart link, call linkUpdated but do not provide displayCategory field,
   * indicating the link is currently displayed as smart link
   */
  linkUpdated({ url: 'https://atlassian.com' });

  /**
   * If the user deletes a link that is currently being displayed as a smart link,
   * do not provide displayCategory field
   */
  linkDeleted({ url: 'https://atlassian.com' });
  ```

## 6.0.1

### Patch Changes

- [#31388](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31388) [`0af4a6b6426`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0af4a6b6426) - Dependency update json-ld-types@3.4.0
- Updated dependencies

## 6.0.0

### Patch Changes

- Updated dependencies

## 5.0.3

### Patch Changes

- [#30731](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30731) [`8ed1b29ab37`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8ed1b29ab37) - Defer analytics event firing with `window.requestIdleCallback()`, with `window.requestAnimationFrame()` as fallback

## 5.0.2

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- Updated dependencies

## 5.0.0

### Major Changes

- [#29477](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29477) [`d17a6d964ac`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d17a6d964ac) - Removes `getAnalyticsAttributes` from main entrypoint.

### Patch Changes

- [`69b42fc04b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/69b42fc04b8) - Package size optimisation

## 4.1.0

### Minor Changes

- [#29618](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29618) [`2159e1814fc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2159e1814fc) - Adds getAnalyticsAttributes as single mechanism to access resolved metada for analytics attributes

### Patch Changes

- Updated dependencies

## 4.0.0

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [#28234](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28234) [`78913286eca`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78913286eca) - - Add support for resolved metadata
  - It is now a requirement for Link Analytics to be wrapped with the SmartCardProvider, else it will catastrophically break

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [#28171](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28171) [`06a9ae91ce0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/06a9ae91ce0) - Add nonPrivacySafeAttributes.domainName to event payload

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- [#25164](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25164) [`e48301ec460`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e48301ec460) - Adds support for confluence-style analytic events.

## 1.1.0

### Minor Changes

- [#24967](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24967) [`d107fd8bd93`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d107fd8bd93) - Adds callbacks for tracking link updates and link deletions.

## 1.0.0

### Major Changes

- [#24791](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24791) [`e7c31586ebe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7c31586ebe) - Add support for deriving create link attributes from another event.

## 0.1.1

### Patch Changes

- [#24373](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24373) [`69136bc61f3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/69136bc61f3) - Initial release
