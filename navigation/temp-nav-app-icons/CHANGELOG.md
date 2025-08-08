# @atlaskit/temp-nav-app-icons

## 0.10.0

### Minor Changes

- [#198583](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/198583)
  [`eaabec48bbfdc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/eaabec48bbfdc) -
  Logo components now support an empty label, to remove the element from the accessibility tree. The
  icon components already supported this behavior.

## 0.9.3

### Patch Changes

- Updated dependencies

## 0.9.2

### Patch Changes

- [#188580](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188580)
  [`13f2094aaff70`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/13f2094aaff70) -
  New components changes to support `@atlaskit/logo`.

## 0.9.1

### Patch Changes

- [#185530](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185530)
  [`f62520039d23f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f62520039d23f) -
  Updated icon components to properly handle empty label prop. Removed default fallback values in
  icon components to allow empty strings to pass through to IconWrapper, enabling proper decorative
  behavior when label="" is provided.

## 0.9.0

### Minor Changes

- [#179339](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/179339)
  [`07f23f57c5118`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/07f23f57c5118) - -
  Temporary icon components are now deprecated; please use the equivalent components in
  `@atlaskit/logo`.
  - New components changes to support `@atlaskit/logo`.

## 0.8.5

### Patch Changes

- [#177235](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/177235)
  [`2a65921a913a1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2a65921a913a1) -
  Added Loom attribution logo to support logo migration

## 0.8.4

### Patch Changes

- Updated dependencies

## 0.8.3

### Patch Changes

- [#176906](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/176906)
  [`86b046c9bf641`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/86b046c9bf641) -
  Adds three new app logos and icons:
  - `BitbucketDataCenterLogo` and `BitbucketDataCenterIcon`
  - `JiraDataCenterLogo` and `JiraDataCenterIcon`
  - `ConfluenceDataCenterLogo` and `ConfluenceDataCenterIcon`

## 0.8.2

### Patch Changes

- Updated dependencies

## 0.8.1

### Patch Changes

- [#163522](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/163522)
  [`76358104532e5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/76358104532e5) -
  Changes to analytics and custom-link svgs to fix appearances
- Updated dependencies

## 0.8.0

### Minor Changes

- [#159181](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159181)
  [`c6e0c0ea860f1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c6e0c0ea860f1) -
  Added appearance and size variants for icons and logos

## 0.7.5

### Patch Changes

- [#158209](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/158209)
  [`ac61dd3cd2bb6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ac61dd3cd2bb6) -
  Added license entry to package.json

## 0.7.4

### Patch Changes

- [#156820](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/156820)
  [`59779a02f98cf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/59779a02f98cf) -
  Added encoded icon export

## 0.7.3

### Patch Changes

- [#155897](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155897)
  [`b2d56c87853af`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d56c87853af) -
  Added LICENSE file

## 0.7.2

### Patch Changes

- [#153281](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/153281)
  [`85cdfdd64c682`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/85cdfdd64c682) - -
  - Resolved a bug in wordmarks where SF pro was displaying rather than Atlassian Sans.
  - Minor optical adjustments made to glyph scale with App tiles
  - Added custom theming support to Assets icon

## 0.7.1

### Patch Changes

- [#137785](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/137785)
  [`45fedddb25d0b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/45fedddb25d0b) -
  Added new size options (12 and 16) to Icon components

## 0.7.0

### Minor Changes

- [#134670](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/134670)
  [`cfffaa5ad7fac`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cfffaa5ad7fac) -
  Slight sizing adjustments to icon designs, adds custom theming support to Bitbucket logo, and
  fixes bug where logo text was rendering with currentColor instead of a design token

## 0.6.0

### Minor Changes

- [#130720](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130720)
  [`a71a4d0c5409e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a71a4d0c5409e) -
  Adds custom theming support to Jira, Jira Service Management, Jira Product Discovery, Confluence
  and Trello logos

### Patch Changes

- [#130720](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130720)
  [`67549aa946404`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/67549aa946404) -
  Adds new logo to available set

## 0.5.1

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.
- Updated dependencies

## 0.5.0

### Minor Changes

- [#121522](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121522)
  [`c02a41ac34931`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c02a41ac34931) -
  Updated Assets icon and logo

## 0.4.0

### Minor Changes

- [#118543](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/118543)
  [`ce90c5caf1ffa`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ce90c5caf1ffa) -
  The parent element of logo SVGs now have the exact same size as their SVG element.

### Patch Changes

- Updated dependencies

## 0.3.1

### Patch Changes

- Updated dependencies

## 0.3.0

### Minor Changes

- [#116640](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116640)
  [`7ea30ca59b638`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7ea30ca59b638) -
  Labels have been added to icons and logos. For app icons, they are internally set as hardcoded
  English strings. For utility icons (currently just the app switcher-specific icons), they are
  exposed as a required `label` prop.

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#115597](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115597)
  [`a699b3f241286`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a699b3f241286) -
  Pattern for supporting theming in logo wordmarks has been added. Existing SVGs have been updated
  with the latest designs (border radius changes), and ran through an SVG optimiser.
