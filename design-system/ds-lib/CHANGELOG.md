# @atlaskit/ds-lib

## 1.1.0

### Minor Changes

- [`e56d6be0379`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e56d6be0379) - A new utility to calculate scrollbar width is added for re-use.
- [`a2924ae3e4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2924ae3e4f) - **Add DS lib package with reusable utils and hooks**

  - We are introducing a new package which contains reusable utils and hooks specific to design system.

  - Following **hooks** are available:

    - `useLazyRef`: Which will only run passed expensive function once and save the result into the returned `ref`.

  - Following **utils** are available:

    - `noop`: An empty function which returns nothing.

- [`14396cae929`](https://bitbucket.org/atlassian/atlassian-frontend/commits/14396cae929) - Add warnOnce helper function
- [`27570643ef2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/27570643ef2) - Adds use lazy callback and use state ref hooks.
