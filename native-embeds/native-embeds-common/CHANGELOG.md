# @atlaskit/native-embeds-common

## 1.0.0

### Major Changes

- [`4b920b03625a1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4b920b03625a1) -
  Removed `react-intl-next` alias and replaced all usages with `react-intl` directly.

  What changed: The `react-intl-next` npm alias (which resolved to `react-intl@^5`) has been
  removed. All imports now reference `react-intl` directly, and `peerDependencies` have been updated
  to `"^5.25.1 || ^6.0.0 || ^7.0.0"`.

  How consumer should update their code: Ensure `react-intl` is installed at a version satisfying
  `^5.25.1 || ^6.0.0 || ^7.0.0`. If your application was using `react-intl-next` as an npm alias, it
  can be safely removed. Replace any remaining `react-intl-next` imports with `react-intl`.

### Patch Changes

- Updated dependencies

## 0.2.4

### Patch Changes

- [`89e32bffb1383`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/89e32bffb1383) -
  [ux] Add support to consume the editor AI plugin summarise functionality in other editor plugins.
- Updated dependencies

## 0.2.3

### Patch Changes

- Updated dependencies

## 0.2.2

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [`6c3e67fec342f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6c3e67fec342f) -
  Add BUILTIN_TOOLBAR_KEYS.COPY for copying native-embed nodes. COPY_LINK is now a deprecated alias
  for COPY. Add onCopyClick handler alongside deprecated onCopyLinkClick alias.

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- [`71180287b9fed`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/71180287b9fed) -
  pen inline prompt when ask rovo is clicked on a maui app and send the context to the api
- Updated dependencies
