# @atlaskit/link-analytics

## 8.0.5

### Patch Changes

- [`3b393e53508`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b393e53508) - Updates events triggered from link picker source event to have method of linkpicker_none if the link picker analytic event has no input method for the url field. This means if the link picker was mounted with a url and submitted without any change the method for an updated event will have updateMethod of linkpicker_none instead of having no updateMethod.

## 8.0.4

### Patch Changes

- [`438b90799c4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/438b90799c4) - Removes urlHash from linking platform events.

## 8.0.3

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8
- Updated dependencies

## 8.0.2

### Patch Changes

- [`65392e23be5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/65392e23be5) - Fetch for resolved attributes regardless of displayCategory (i.e. when it is 'link')

## 8.0.1

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`
- Updated dependencies

## 8.0.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 7.0.5

### Patch Changes

- [`0624df1ffe1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0624df1ffe1) - Bump json-ld-types dependency
- Updated dependencies

## 7.0.4

### Patch Changes

- [`3c287cb61c4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c287cb61c4) - Updates callbacks to source creationMethod and updateMethod attribute from link picker form submission event when provided as sourceEvent.

## 7.0.3

### Patch Changes

- [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils
- Updated dependencies

## 7.0.2

### Patch Changes

- [`0ee9370595a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ee9370595a) - Update json-ld-types
- Updated dependencies

## 7.0.1

### Patch Changes

- [`8aa0ed775f3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8aa0ed775f3) - Updates resolve attributes to return displayCategory as link instead of smartLink when handling ResolveUnsupportedError.

## 7.0.0

### Major Changes

- [`d2703b479a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2703b479a1) - Removes extraneous exports from /resolved-attributes entry point.

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

- [`0af4a6b6426`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0af4a6b6426) - Dependency update json-ld-types@3.4.0
- Updated dependencies

## 6.0.0

### Patch Changes

- Updated dependencies

## 5.0.3

### Patch Changes

- [`8ed1b29ab37`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8ed1b29ab37) - Defer analytics event firing with `window.requestIdleCallback()`, with `window.requestAnimationFrame()` as fallback

## 5.0.2

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- Updated dependencies

## 5.0.0

### Major Changes

- [`d17a6d964ac`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d17a6d964ac) - Removes `getAnalyticsAttributes` from main entrypoint.

### Patch Changes

- [`69b42fc04b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/69b42fc04b8) - Package size optimisation

## 4.1.0

### Minor Changes

- [`2159e1814fc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2159e1814fc) - Adds getAnalyticsAttributes as single mechanism to access resolved metada for analytics attributes

### Patch Changes

- Updated dependencies

## 4.0.0

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [`78913286eca`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78913286eca) - - Add support for resolved metadata
  - It is now a requirement for Link Analytics to be wrapped with the SmartCardProvider, else it will catastrophically break

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [`06a9ae91ce0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/06a9ae91ce0) - Add nonPrivacySafeAttributes.domainName to event payload

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- [`e48301ec460`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e48301ec460) - Adds support for confluence-style analytic events.

## 1.1.0

### Minor Changes

- [`d107fd8bd93`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d107fd8bd93) - Adds callbacks for tracking link updates and link deletions.

## 1.0.0

### Major Changes

- [`e7c31586ebe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7c31586ebe) - Add support for deriving create link attributes from another event.

## 0.1.1

### Patch Changes

- [`69136bc61f3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/69136bc61f3) - Initial release
