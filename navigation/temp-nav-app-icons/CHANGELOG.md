# @atlaskit/temp-nav-app-icons

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
