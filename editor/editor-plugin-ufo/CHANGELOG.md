# @atlaskit/editor-plugin-ufo

## 3.1.3

### Patch Changes

- Updated dependencies

## 3.1.2

### Patch Changes

- Updated dependencies

## 3.1.1

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [#183937](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/183937)
  [`5826fd37730ab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5826fd37730ab) -
  Triggers traceUFOInteraction on first editor interaction to avoid vc90 blindspots

## 3.0.0

### Major Changes

- [#181024](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/181024)
  [`8e80c487ca307`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8e80c487ca307) - ##
  Make `@atlaskit/editor-common` a peer dependency

  **WHAT:** `@atlaskit/editor-common` has been moved from `dependencies` to `peerDependencies` in
  all editor plugin packages.

  **WHY:** This change ensures that only a single version of `@atlaskit/editor-common` is used in
  consuming applications, preventing issues caused by multiple versions of singleton libraries (such
  as context mismatches or duplicated state). This is especially important for packages that rely on
  shared context or singletons.

  **HOW TO ADJUST:**

  - Consumers must now explicitly install `@atlaskit/editor-common` in their own project if they use
    any of these editor plugins.
  - Ensure the version you install matches the version required by the plugins.
  - You can use the
    [`check-peer-dependencies`](https://www.npmjs.com/package/check-peer-dependencies) package to
    verify that all required peer dependencies are installed and compatible.
  - Example install command:
    ```
    npm install @atlaskit/editor-common
    ```
    or
    ```
    yarn add @atlaskit/editor-common
    ```

  **Note:** This is a breaking change. If `@atlaskit/editor-common` is not installed at the
  application level, you may see errors or unexpected behavior.

### Patch Changes

- Updated dependencies

## 2.1.1

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [#168414](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/168414)
  [`c160484f9e220`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c160484f9e220) -
  Cleaned up ufo plugin fg

## 2.0.7

### Patch Changes

- Updated dependencies

## 2.0.6

### Patch Changes

- Updated dependencies

## 2.0.5

### Patch Changes

- Updated dependencies

## 2.0.4

### Patch Changes

- Updated dependencies

## 2.0.3

### Patch Changes

- [#124151](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/124151)
  [`b3127c28123c4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b3127c28123c4) -
  AFO-3441 make editor plugin ufo only abort ufo when event is user initiated (isTrusted)
- Updated dependencies

## 2.0.2

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- Updated dependencies

## 2.0.0

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

## 1.1.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 1.0.6

### Patch Changes

- Updated dependencies

## 1.0.5

### Patch Changes

- Updated dependencies

## 1.0.4

### Patch Changes

- [#101320](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101320)
  [`ad1da3dec7ebe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ad1da3dec7ebe) -
  [ED-25272] Replace optional chain when checking the SSR variable

## 1.0.3

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- [#180148](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/180148)
  [`15b8dada9a3cf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15b8dada9a3cf) -
  [ED-26066] Disable the plugin for SSR enviroments

## 1.0.0

### Major Changes

- [#178022](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/178022)
  [`34c30d3598c59`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/34c30d3598c59) -
  [ED-25936] Editor Plugin to abort UFO TTVC on user interaction
