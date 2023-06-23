# @atlaskit/platform-feature-flags

## 0.2.4

### Patch Changes

- [`d6a9413f008`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6a9413f008) - Store the Platform Feaature Flags booleanFeatureFlagResolver on the global so that it won't matter if multiple different versions of the library are installed

## 0.2.3

### Patch Changes

- [`71902efa32d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/71902efa32d) - Added logging for any feature flags that are called before the platform feature flags resolver is created

## 0.2.2

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 0.2.1

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 0.2.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

## 0.1.2

### Patch Changes

- [`49c6941535b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/49c6941535b) - This package is now declared as a singleton within its package.json file. Consumers should provide tooling to assist in deduplication and enforcement of the singleton pattern.

## 0.1.1

### Patch Changes

- [`bcbc0232ef1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bcbc0232ef1) - [ux] Update documentation around platform feature flag implementation and integration

## 0.1.0

### Minor Changes

- [`1d3a3683ed9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1d3a3683ed9) - Revamp platform feature flag package to allow deferral to outside client instead

## 0.0.12

### Patch Changes

- [`fdefe6037f9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdefe6037f9) - Add PFF to Jira push consumption model

## 0.0.11

### Patch Changes

- [`d603f6fb55b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d603f6fb55b) - Fix Platform Feature Flag overrides

## 0.0.10

### Patch Changes

- [`be91072734f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be91072734f) - Remove dynamic typegen - going with static analysis instead

## 0.0.9

### Patch Changes

- [`0ba3b02365e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ba3b02365e) - Fix postinstall hook and ship less dependencies

## 0.0.8

### Patch Changes

- [`7888ba61c3b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7888ba61c3b) - Add platform feature flag registration and dynamic type generation for platform feature flag client

## 0.0.7

### Patch Changes

- [`f81aa3efb8b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f81aa3efb8b) - Fix overriding platform FFs by Storybook and test's runners

## 0.0.6

### Patch Changes

- [`cfc66979dd1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfc66979dd1) - FLEX-78: Fix browser runtime compatibility

## 0.0.5

### Patch Changes

- [`1f19e1fe8c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f19e1fe8c9) - Fix running unit tests and Storybook when Platform FF are enabled

## 0.0.4

### Patch Changes

- [`d446d03215b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d446d03215b) - Add storybook enviornment variable for setting all platform feature flags to be true

## 0.0.3

### Patch Changes

- [`f366312e13a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f366312e13a) - Add support for toggling on all the Platform Feature Flags when running unit tests

## 0.0.2

### Patch Changes

- [`f9705321c00`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f9705321c00) - Update logs content

## 0.0.1

### Patch Changes

- [`a37abc471e9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a37abc471e9) - Add new platform FF package
