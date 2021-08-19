# @atlaskit/ds-lib

## 1.3.0

### Minor Changes

- [`5b5bffe8f58`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b5bffe8f58) - - Adds two new methods: `useKeyDownEvent` and `useFocusEvent`.
  - Adds keycodes as constants.

## 1.2.0

### Minor Changes

- [`742b9d82cdc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/742b9d82cdc) - Added `useControlled` hook which can be used to be handle controlled & uncontrolled behaviour of a componenent.
- [`e1d9004d5ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e1d9004d5ee) - Adds new utility to merge refs.
- [`40d5bb8a2f4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/40d5bb8a2f4) - New `useAutoFocus` hook to be used when wanting to focus on an element during initial mount.
- [`c60505b8a38`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c60505b8a38) - Adds new `useCloseOnEscapePress` hook, to be used exclusively for closing layered components.
- [`cade298437d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cade298437d) - Adds three new hooks (`useElementEvent`, `useDocumentEvent`, `useWindowEvent`) for listening to native browser events.
- [`2d996ae3869`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d996ae3869) - Adds new hook `usePreviousValue`.

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
