# @atlaskit/progress-bar

## 0.2.8

### Patch Changes

- [`974d594a23`](https://bitbucket.org/atlassian/atlassian-frontend/commits/974d594a23) - Change imports to comply with Atlassian conventions

## 0.2.7

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/button@13.3.7
  - @atlaskit/theme@9.5.1

## 0.2.6

### Patch Changes

- [patch][557a8e2451](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/557a8e2451):

  Rebuilds package to fix typescript typing error.

## 0.2.5

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 0.2.4

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 0.2.3

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

  bugfix, fixes missing version.json file

## 0.2.2

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 0.2.1

### Patch Changes

- [patch][7fd8d40029](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7fd8d40029):

  Fix invalid "module" field. The package should expose _.js file instead of _.ts

## 0.2.0

- [minor][06e6dd5731](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06e6dd5731):

  - Initial release of Progress Bar component.

## 0.1.0

- [minor][b2eb85b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b2eb85b):

  - Initial release of Progress Bar component.
