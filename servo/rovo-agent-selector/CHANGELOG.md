# @atlaskit/rovo-agent-selector

## 2.0.0

### Major Changes

- [`d2e14ba5ae9fc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d2e14ba5ae9fc) -
  Removed `react-intl-next` alias and replaced all usages with `react-intl` directly.

  What changed: The `react-intl-next` npm alias (which resolved to `react-intl@^5`) has been
  removed. All imports now reference `react-intl` directly, and `peerDependencies` have been updated
  to `"^5.25.1 || ^6.0.0 || ^7.0.0"`.

  How consumer should update their code: Ensure `react-intl` is installed at a version satisfying
  `^5.25.1 || ^6.0.0 || ^7.0.0`. If your application was using `react-intl-next` as an npm alias, it
  can be safely removed. Replace any remaining `react-intl-next` imports with `react-intl`.

## 1.4.2

### Patch Changes

- Updated dependencies

## 1.4.1

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [`ebdb0137330d9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ebdb0137330d9) -
  Support REMOTE_A2A agent exposing isForgeAgentByCreatorType to public repo and deprecating
  isForgeAgent from private repo

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [`b601d3eda7f8b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b601d3eda7f8b) -
  Fix the rest of the crossPackageBarrelFileReferences for above platform packages. Part of
  de-barreling effort TREX-67

## 1.2.1

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [`22b91941f29b0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/22b91941f29b0) -
  Remove the permission check and entitlement check from the package

## 1.1.2

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [`c196a0a0bad45`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c196a0a0bad45) -
  [ux] add rovo entitlement check
