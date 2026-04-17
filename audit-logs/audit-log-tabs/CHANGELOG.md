# @atlaskit/audit-log-tabs

## 1.0.0

### Major Changes

- [`55c185530ce37`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/55c185530ce37) -
  Removed `react-intl-next` alias and replaced all usages with `react-intl` directly.

  What changed: The `react-intl-next` npm alias (which resolved to `react-intl@^5`) has been
  removed. All imports now reference `react-intl` directly, and `peerDependencies` have been updated
  to `"^5.25.1 || ^6.0.0 || ^7.0.0"`.

  How consumer should update their code: Ensure `react-intl` is installed at a version satisfying
  `^5.25.1 || ^6.0.0 || ^7.0.0`. If your application was using `react-intl-next` as an npm alias, it
  can be safely removed. Replace any remaining `react-intl-next` imports with `react-intl`.

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

- [`ebcfd2a0e7b2d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ebcfd2a0e7b2d) -
  Added a11y tests for ALC and made audit log usage singular

## 0.1.1

### Patch Changes

- Updated dependencies

## 0.1.0

### Minor Changes

- [`6dc673096c16f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6dc673096c16f) -
  [ux] Creating base platform package for tabs.
