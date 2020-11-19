# @atlaskit/router

## 0.13.5

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 0.13.4

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 0.13.3

### Patch Changes

- [`f971bdab58`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f971bdab58) - Adds missing types field

## 0.13.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 0.13.1

### Patch Changes

- [`0c532edf6e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c532edf6e) - Use the 'lodash' package instead of single-function 'lodash.\*' packages

## 0.13.0

### Minor Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 0.12.1

### Patch Changes

- [`7624bb361c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7624bb361c) - deprecate atlaskit router

## 0.12.0

### Minor Changes

- [`77cc0c78a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/77cc0c78a8) - Fixing types for withRouter

## 0.11.0

### Minor Changes

- [`f02a65203a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f02a65203a) - Removed the transitionBlocker api from the router

## 0.10.0

### Minor Changes

- [`552331525e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/552331525e) - Documentation overhaul for clearer, more concise and generic docs

## 0.9.0

### Minor Changes

- [`cde7881ce0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cde7881ce0) - BREAKING CHANGE: remove mocks from the main entry point and export them from `/mocks`- [`75269bbcec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/75269bbcec) - Remove history listeners on unmount and bump react-sweet-state to 2.1.1

### Patch Changes

- [`70aeacd7e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70aeacd7e3) - Export `BrowserHistory` type from the router

## 0.8.2

### Patch Changes

- [patch][f45c19a96e](https://bitbucket.org/atlassian/atlassian-frontend/commits/f45c19a96e):

  Remove unused dependencies

## 0.8.1

### Patch Changes

- [patch][6b6c329996](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b6c329996):

  added flow type for createLegacyHistory

## 0.8.0

### Minor Changes

- [minor][85828e8502](https://bitbucket.org/atlassian/atlassian-frontend/commits/85828e8502):

  Updated RouteContext type of route to be required- [minor][719ba9d15d](https://bitbucket.org/atlassian/atlassian-frontend/commits/719ba9d15d):

  remove navigation and apdexIgnoreParams from Route type

### Patch Changes

- [patch][0d76bd9e0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/0d76bd9e0a):

  export createBrowserHistory and createMemoryHistory from history- [patch][178f142697](https://bitbucket.org/atlassian/atlassian-frontend/commits/178f142697):

  Replacing query-string with querystringify to better deal with invalid query strings

## 0.7.3

### Patch Changes

- [patch][907c9973d7](https://bitbucket.org/atlassian/atlassian-frontend/commits/907c9973d7):

  Updated mocked exports

## 0.7.2

### Patch Changes

- [patch][577093111c](https://bitbucket.org/atlassian/atlassian-frontend/commits/577093111c):

  Fixed bug in path utils

## 0.7.1

### Patch Changes

- [patch][831972f80f](https://bitbucket.org/atlassian/atlassian-frontend/commits/831972f80f):

  bump react-sweet-state to 2.0.2

## 0.7.0

### Minor Changes

- [minor][15237ae087](https://bitbucket.org/atlassian/atlassian-frontend/commits/15237ae087):

  Add unstable_batched updates fix to router and bump react-sweet-state to the latest version

## 0.6.4

### Patch Changes

- [patch][a1bc1e6637](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1bc1e6637):

  AFP-1437: Fix vulnerability issue for url-parse and bump to ^1.4.5.Packages.

## 0.6.3

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes

## 0.6.2

### Patch Changes

- [patch][025c587833](https://bitbucket.org/atlassian/atlassian-frontend/commits/025c587833):

  Add missing dependencies to router package.json

## 0.6.1

### Patch Changes

- [patch][230048242e](https://bitbucket.org/atlassian/atlassian-frontend/commits/230048242e):

  Update the atlaskit:src field in package.json to point to the correct TS file

## 0.6.0

### Minor Changes

- [minor][c8fabebfc1](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8fabebfc1):

  Downgrade react-sweet-state to 1.1.1

## 0.5.0

### Minor Changes

- [minor][a6b13b1965](https://bitbucket.org/atlassian/atlassian-frontend/commits/a6b13b1965):

  Add flow libdef for the @atlaskit/router

## 0.4.0

### Minor Changes

- [minor][5e371a9b0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e371a9b0a):

  Upgraded react-sweet-state dependency to v2.0.0

## 0.3.0

### Minor Changes

- [minor][1af44667cc](https://bitbucket.org/atlassian/atlassian-frontend/commits/1af44667cc):

  ResourceSubscriber component now uses a selector

## 0.2.0

### Minor Changes

- [minor][2cf354e4bf](https://bitbucket.org/atlassian/atlassian-frontend/commits/2cf354e4bf):

  useResource and ResourceSubscriber now take a function to update resources state rather than an object

## 0.1.1

### Patch Changes

- [patch][1676fb22f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/1676fb22f1):

  Change formatting of imports

## 0.1.0

### Minor Changes

- [minor][e89b1ede9b](https://bitbucket.org/atlassian/atlassian-frontend/commits/e89b1ede9b):

  Link will no longer gate keep props passed to its children

## 0.0.3

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Introducing the atlaskit router

## 0.0.2

### Patch Changes

- [patch][96404e7343](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/96404e7343):

  Small change to package.json to make the router public

## 0.0.1

### Patch Changes

- [patch][3bd51496d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3bd51496d3):

  Initial migration of the router package from Jira

- [patch][ff7a1e5828](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff7a1e5828):

  Migrated changes to resource-store and router-store from jira-frontend
