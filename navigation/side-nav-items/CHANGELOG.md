# @atlaskit/side-nav-items

## 1.2.0

### Minor Changes

- [`d06bf7b1c35dd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d06bf7b1c35dd) -
  Added back event firing analytics for flyout menu opening, and flyout menu closing upon trigger
  click. Added back tests for flyout menu open and close analytics.

## 1.1.0

### Minor Changes

- [`4b1149e96b0e1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4b1149e96b0e1) -
  Add five new entry points (/command, /command-creator, /singleton, /client-types, /bridge-api) to
  enable granular imports for better tree-shaking and performance. Existing barrel imports continue
  to work; this is a foundational change that enables future debarreling work.

## 1.0.1

### Patch Changes

- [`e4b717d8304e8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e4b717d8304e8) -
  Add @atlassian/a11y-jest-testing to devDependencies.
