# @atlaskit/jql-editor-common

## 1.0.0

### Major Changes

- [`801e874de87`](https://bitbucket.org/atlassian/atlassian-frontend/commits/801e874de87) - Migrate `jql-editor-common` and `jql-editor-autocomplete-rest` packages to the `@atlaskit` namespace. Any consumers should update their imports to `@atlaskit/jql-editor-common` and `@atlaskit/jql-editor-autocomplete-rest`.

## 0.0.0

We are moving the `jql-editor-common` package from `@atlassiansox` and `@atlassianlabs` namespaces to `@atlaskit`. From now on,
there will be a single publish to the public npm registry, and any imports should be updated to `@atlaskit/jql-editor-common`.

We are keeping the changelog for older versions in the section below, for historical reasons.

---

#### 1.0.3

##### Patch Changes

- [`ef15cb77a2a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ef15cb77a2a) - Migrate `jql-autocomplete` package to the `@atlaskit` namespace. Any consumers should update their imports to `@atlaskit/jql-autocomplete`.
- Updated dependencies

#### 1.0.2

##### Patch Changes

- [`6081642ebe0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6081642ebe0) - Allow Forge/Connect JQL functions to correctly autocomplete for single value and list operators.

#### 1.0.1

[![Labs version](https://img.shields.io/badge/labs-1.0.0-blue)](https://www.npmjs.com/package/@atlassianlabs/jql-editor-common)

##### Patch Changes

- [`f04004ec277`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f04004ec277) - Extract common JQL editor types, constants and utilities to separate package.
