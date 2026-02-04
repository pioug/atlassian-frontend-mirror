# @atlaskit/jql-editor-autocomplete-rest

## 3.0.3

### Patch Changes

- [`eb7f33162d948`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/eb7f33162d948) -
  Fixes a bug where no autocompleted suggestions were being shown for fields with special characters
  (such as "&") in the name.

## 3.0.2

### Patch Changes

- [`6cf4b64a5d781`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6cf4b64a5d781) -
  Update team JQl to show rich text node (and hydrate)
- Updated dependencies

## 3.0.1

### Patch Changes

- [`92b1368d9607d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/92b1368d9607d) -
  Sorted type and interface props to improve Atlaskit docs
- Updated dependencies

## 3.0.0

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

## 2.2.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 2.1.1

### Patch Changes

- [#136861](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136861)
  [`d640bacacaa13`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d640bacacaa13) -
  bumped react-magnetic-di to 3.1.4

## 2.1.0

### Minor Changes

- [#136871](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136871)
  [`c663f9f8a9171`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c663f9f8a9171) -
  Add support for React 18

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 2.0.0

### Major Changes

- [#39978](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39978)
  [`978cfcda881`](https://bitbucket.org/atlassian/atlassian-frontend/commits/978cfcda881) - Migrate
  `jql-editor-autocomplete-rest` package to the `@atlaskit` namespace. Any consumers should update
  their imports to `@atlaskit/jql-editor-autocomplete-rest`.

### Patch Changes

- Updated dependencies

## 1.1.7

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json

## 1.1.6

### Patch Changes

- [#37925](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37925)
  [`f01deb5e6ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f01deb5e6ab) - Use
  injected env vars instead of version.json

## 1.1.5

### Patch Changes

- [#37802](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37802)
  [`6081642ebe0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6081642ebe0) - Allow
  Forge/Connect JQL functions to correctly autocomplete for single value and list operators.

## 1.1.4

[![Labs version](https://img.shields.io/badge/labs-1.1.2-blue)](https://www.npmjs.com/package/@atlassianlabs/jql-editor-autocomplete-rest)

### Patch Changes

- [#36600](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36600)
  [`f04004ec277`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f04004ec277) - Extract
  common JQL editor types, constants and utilities to separate package.

## 1.1.3

[![Labs version](https://img.shields.io/badge/labs-1.1.0-blue)](https://www.npmjs.com/package/@atlassianlabs/jql-editor-autocomplete-rest)

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 1.1.2

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 1.1.1

### Patch Changes

- [#33285](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33285)
  [`5fbee461cc7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5fbee461cc7) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 1.1.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 1.0.14

### Patch Changes

- [#26392](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26392)
  [`fbd7a36e956`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fbd7a36e956) - Upgrade
  react-sweet-state from `2.5.2` to `2.6.5`

## 1.0.13

### Patch Changes

- Updated dependencies

## 1.0.12

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 1.0.11

[![Labs version](https://img.shields.io/badge/labs-1.0.1-blue)](https://www.npmjs.com/package/@atlassianlabs/jql-editor-autocomplete-rest)

### Patch Changes

- [#25232](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25232)
  [`b2e81642b07`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2e81642b07) - Use
  default import for version.json and specify fixed prosemirror-transform dependency version.

## 1.0.10

### Patch Changes

- cdd62ddf: Add deprecated field and deprecatedSearcherKey field to jql autocomplete

## 1.0.9

### Patch Changes

- Internal changes to rxjs imports to improve treeshaking and reduce bundle size

## 1.0.8

[![Labs version](https://img.shields.io/badge/labs-1.0.0-blue)](https://www.npmjs.com/package/@atlassianlabs/jql-editor-autocomplete-rest)

### Patch Changes

- 886bd63: Bump labs version.
- Updated dependencies [886bd63]
  - @atlassiansox/jql-editor@2.1.4

## 1.0.7

[![Labs version](https://img.shields.io/badge/labs-0.0.2-blue)](https://www.npmjs.com/package/@atlassianlabs/jql-editor-autocomplete-rest)

### Patch Changes

- 6c31f29: Migrate packages from tslint to eslint
- 0df8576: Move analytics hook into jql-editor package.
- Updated dependencies [80bebea]
- Updated dependencies [6c31f29]
- Updated dependencies [0df8576]
  - @atlassiansox/jql-editor@2.0.0

## 1.0.6

### Patch Changes

- 70e0706: Bump dependencies to patch vulnerabilities
- Updated dependencies [70e0706]
  - @atlassiansox/jql-analytics@1.0.3
  - @atlassiansox/jql-editor@1.4.2

## 1.0.5

### Patch Changes

- 52ad1a8: VULN-570232 - Bump lodash to 4.17.21
- Updated dependencies [99dde51]
- Updated dependencies [52ad1a8]
  - @atlassiansox/jql-editor@1.4.0

## 1.0.4

### Patch Changes

- f46b4ff: Use isolatedModules to fix Babel transpilation of type only exports.
- Updated dependencies [f46b4ff]
- Updated dependencies [5a27d1f]
- Updated dependencies [a9b1d6a]
  - @atlassiansox/jql-analytics@1.0.2
  - @atlassiansox/jql-editor@1.3.3

## 1.0.3

### Patch Changes

- bc19fe3: Update storybook and de-dupe babel dependencies.
- Updated dependencies [626bf63]
- Updated dependencies [bc19fe3]
- Updated dependencies [6bb97a9]
- Updated dependencies [f201504]
  - @atlassiansox/jql-editor@1.3.0
  - @atlassiansox/jql-analytics@1.0.1

## 1.0.2

### Patch Changes

- 66a923d: Remove WHERE and ORDER_BY constant re-exports.
- Updated dependencies [66a923d]
  - @atlassiansox/jql-editor@1.2.0

## 1.0.1

### Patch Changes

- 19d9d06: Improve autocomplete behavior for list functions
- Updated dependencies [f646f32]
- Updated dependencies [e1b9399]
- Updated dependencies [669d464]
- Updated dependencies [9bdef19]
- Updated dependencies [d6ad0b8]
- Updated dependencies [6d6996d]
- Updated dependencies [19d9d06]
- Updated dependencies [fe01952]
- Updated dependencies [c3cef8a]
  - @atlassiansox/jql-editor@1.1.0

## 1.0.0

### Major Changes

- 94c794c: Bump all TypeScript packages to 1.0.0 for release to production. From this point on,
  semver will be used in all packages.

### Patch Changes

- Updated dependencies [431d540]
- Updated dependencies [03134f0]
- Updated dependencies [20c94ed]
- Updated dependencies [e5e8ff2]
- Updated dependencies [f8937f6]
- Updated dependencies [72c3485]
- Updated dependencies [94c794c]
  - @atlassiansox/jql-editor@1.0.0
  - @atlassiansox/jql-analytics@1.0.0

## 0.2.0

### Minor Changes

- cf9e417: Add analyticsSource for analytic events.

### Patch Changes

- Updated dependencies [039e2b8]
- Updated dependencies [7420f37]
- Updated dependencies [48c4fb8]
- Updated dependencies [cf9e417]
- Updated dependencies [4cc2590]
  - @atlassiansox/jql-editor@0.13.0
  - @atlassiansox/jql-analytics@0.1.0

## 0.1.3

### Patch Changes

- 17f2a3c: Remove email from from user nodes on autocomplete insertion when data is provided by REST
  API
- Updated dependencies [17f2a3c]
  - @atlassiansox/jql-editor@0.12.0

## 0.1.2

### Patch Changes

- bed8a9f: Refactor autocomplete state logic and fix autocomplete positioning following operands
- a3b9113: User rich inline node UI
- Updated dependencies [04c6137]
- Updated dependencies [25c1cf0]
- Updated dependencies [04c6137]
- Updated dependencies [587e213]
- Updated dependencies [ab711f7]
- Updated dependencies [aadaabb]
- Updated dependencies [6f00e0d]
- Updated dependencies [d93a20d]
- Updated dependencies [155ac26]
- Updated dependencies [bed8a9f]
- Updated dependencies [a3b9113]
- Updated dependencies [fbf252f]
- Updated dependencies [6d76a16]
- Updated dependencies [629bda6]
- Updated dependencies [04c6137]
- Updated dependencies [96d6447]
- Updated dependencies [f9bbcd7]
- Updated dependencies [29a84e6]
- Updated dependencies [d4c7b04]
  - @atlassiansox/jql-editor@0.11.0
  - @atlassiansox/jql-analytics@0.0.3

## 0.1.1

### Patch Changes

- b8b07e5: Export sweet state container for testing.
- Updated dependencies [b8b07e5]
  - @atlassiansox/jql-editor@0.10.1

## 0.1.0

### Minor Changes

- 6f1a925: Update JQL editor API to accept autocompleteProvider prop.

### Patch Changes

- 3742dc5: Add package to enable REST API integration for JQL editor autocomplete.
- 6f1a925: Use Intl.Collator for string comparison.
- Updated dependencies [6f1a925]
- Updated dependencies [6f1a925]
- Updated dependencies [a71c3ac]
- Updated dependencies [20eb798]
- Updated dependencies [b7bed94]
- Updated dependencies [23ff3b9]
- Updated dependencies [0a4e249]
- Updated dependencies [8608c19]
- Updated dependencies [0a2125a]
- Updated dependencies [95d6d7f]
- Updated dependencies [e0835ee]
  - @atlassiansox/jql-editor@0.10.0
  - @atlassiansox/jql-analytics@0.0.2
