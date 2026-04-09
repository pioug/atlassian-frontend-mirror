# @atlaskit/teams-app-internal-navigation

## 1.8.0

### Minor Changes

- [`f2ae85938fde5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f2ae85938fde5) -
  Made the navigate prop optional and the whole TeamsNavigationProvider optional.

### Patch Changes

- [`bcca5482f4ea4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bcca5482f4ea4) -
  Add loom to atlassian domains

## 1.7.0

### Minor Changes

- [`ac9844d3efdb0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ac9844d3efdb0) -
  Nested providers now resolve contextEntryPoint by using the closest ancestor with a valid value. A
  provider's own contextEntryPoint takes priority; if absent, the nearest ancestor's value is
  inherited.

## 1.6.2

### Patch Changes

- [`73c1948914bd5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/73c1948914bd5) -
  Fixed staging links being treated as external and updated classifyNavigationIntent tests.

## 1.6.1

### Patch Changes

- [`cc97d87696c48`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cc97d87696c48) -
  Revamped examples file to better reflect component use

## 1.6.0

### Minor Changes

- [`6314532348ebc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6314532348ebc) -
  Updated URL navigation intent classification utility to recognise FEDRAMP and Isolated Cloud
  environments.

### Patch Changes

- Updated dependencies

## 1.5.1

### Patch Changes

- [`2732080e75eb8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2732080e75eb8) -
  Updated Teams Link components to use the href returned by getNavigationProps, moved the onClick
  handling to getNavigationProps and did a cleanup of the Link component props.

## 1.5.0

### Minor Changes

- [`03592ef49b37f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/03592ef49b37f) -
  Removed cloudId/orgId props from TeamsNavigationProvider and updated package export paths

## 1.4.0

### Minor Changes

- [`b60167a9835e4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b60167a9835e4) -
  Add support for prefixing links

## 1.3.0

### Minor Changes

- [`5675f51636ecb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5675f51636ecb) -
  Introduces the TeamsLink, TeamsLinkItem and TeamsLinkButton components & relevant test.

## 1.2.1

### Patch Changes

- [`da9ca9e7a3c2d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/da9ca9e7a3c2d) -
  Fixes bug where previewPanelProps isn't optional when intent is 'action'

## 1.2.0

### Minor Changes

- [`d684c04042ee3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d684c04042ee3) -
  Added unit tests

## 1.1.0

### Minor Changes

- [`1dac42a3f7c43`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1dac42a3f7c43) -
  Implemented getNavigationProps base functionality

## 1.0.1

### Patch Changes

- [`fbb54a7a40ade`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fbb54a7a40ade) -
  Added a URL intent classification utility
- Updated dependencies
