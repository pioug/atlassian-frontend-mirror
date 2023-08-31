# @atlaskit/eslint-plugin-platform

## 0.2.6

### Patch Changes

- [`7efeb93141c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7efeb93141c) - Add a rule to ensure critical packages are resolved to the correct versions

## 0.2.5

### Patch Changes

- [`e5f52093b2a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5f52093b2a) - Add a rule to ensure that publish config is correct for packages

## 0.2.4

### Patch Changes

- [`eb64cbdd681`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb64cbdd681) - Add a new rule to verify that the atlassian team is defined if the relevant section exists in the package.json

## 0.2.3

### Patch Changes

- [`0bf64fb3dd0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0bf64fb3dd0) - Update to support unary expressions like negation

## 0.2.2

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 0.2.1

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 0.2.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

## 0.1.8

### Patch Changes

- [`cb0e94d2ce4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb0e94d2ce4) - Fix prefixes for all flags being checked at any callsite, only the current flag will be checked from now on

## 0.1.7

### Patch Changes

- [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils

## 0.1.6

### Patch Changes

- [`e8a8808f299`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e8a8808f299) - Add a new eslint rule that enforces prefixes on platform feature flags. Ignore existing usages.

## 0.1.5

### Patch Changes

- [`b47e48ad163`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b47e48ad163) - Adds an eslint rule to confirm that storybooks only get passed an object - to ensure that codemods work correctly.

## 0.1.4

### Patch Changes

- [`971489f4ff4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/971489f4ff4) - Add test runner to identified calls that require registration of platform feature flags

## 0.1.3

### Patch Changes

- [`7facf919a4e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7facf919a4e) - Remove product specific rules and make it so the recommended set is used everywhere instead

## 0.1.2

### Patch Changes

- [`166815fbd8f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/166815fbd8f) - Add recommended set of flags for use in products

## 0.1.1

### Patch Changes

- [`7edd9e8b4b1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7edd9e8b4b1) - Add suggestion to change feature flag to the closest matching feature flag using fuzzy search

## 0.1.0

### Minor Changes

- [`6339334e3ac`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6339334e3ac) - Adds new rule to disallow pre/post install scripts in package.json.

## 0.0.7

### Patch Changes

- [`0cab60b90c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0cab60b90c3) - Add fix to eslint rule on the arguments of nested test runner

## 0.0.6

### Patch Changes

- [`99449cce7f5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/99449cce7f5) - Eslint rules around test runner arguments and limit on nested test runners

## 0.0.5

### Patch Changes

- [`aeb52cac34c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aeb52cac34c) - Split feature flag registration rule into two to more easily use it in products

## 0.0.4

### Patch Changes

- [`cd5b194f403`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd5b194f403) - Add check to ensure that there is only one feature flag call per expression

## 0.0.3

### Patch Changes

- [`11706c3e7c5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/11706c3e7c5) - Publish platform eslint rules to npm to be consumed in other products

## 0.0.2

### Patch Changes

- [`85dc0230439`](https://bitbucket.org/atlassian/atlassian-frontend/commits/85dc0230439) - Add eslint rule to allow for platform feature flag usage
