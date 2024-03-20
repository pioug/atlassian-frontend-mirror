# @atlaskit/ds-lib

## 2.2.5

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116) [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) - Upgrade Typescript from `4.9.5` to `5.4.2`

## 2.2.4

### Patch Changes

- [#70573](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70573) [`03bbd8a15b22`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/03bbd8a15b22) - Added keycodes for tab, enter and space keys.

## 2.2.3

### Patch Changes

- [#32935](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32935) [`b1bdec7cce2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1bdec7cce2) - Internal change to enforce token usage for spacing properties. There is no expected visual or behaviour change.

## 2.2.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793) [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 2.2.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649) [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 2.2.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258) [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

## 2.1.3

### Patch Changes

- [#32294](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32294) [`e0460d5d989`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0460d5d989) - Usages of `process` are now guarded by a `typeof` check.

## 2.1.2

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874) [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 2.1.1

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492) [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 2.1.0

### Minor Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381) [`620c24e72b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/620c24e72b4) - Introduces `propDeprecationWarning` function.

### Patch Changes

- [`cd1a2f64027`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd1a2f64027) - Internal code change turning on new linting rules.

## 2.0.1

### Patch Changes

- [#22614](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22614) [`8a5bdb3c844`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a5bdb3c844) - Upgrading internal dependency (bind-event-listener) for improved internal types

## 2.0.0

### Major Changes

- [#22029](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22029) [`347fd703ce0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/347fd703ce0) - Removing useDocumentEvent, useWindowEvent, useElementEvent and useKeydownEvent and replacing usages with bind-event-listener

## 1.4.2

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650) [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 1.4.1

### Patch Changes

- [#20033](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20033) [`b3e5a62a9e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3e5a62a9e3) - Adds `static` techstack to package, enforcing stricter style linting. In this case the package already satisfied this requirement so there have been no changes to styles.

## 1.4.0

### Minor Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752) [`9f8f2b902bb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f8f2b902bb) - Adds a new utility function for standardised deprecation warnings.

## 1.3.0

### Minor Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302) [`5b5bffe8f58`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b5bffe8f58) - - Adds two new methods: `useKeyDownEvent` and `useFocusEvent`.
  - Adds keycodes as constants.

## 1.2.0

### Minor Changes

- [#10230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10230) [`742b9d82cdc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/742b9d82cdc) - Added `useControlled` hook which can be used to be handle controlled & uncontrolled behaviour of a componenent.
- [`e1d9004d5ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e1d9004d5ee) - Adds new utility to merge refs.
- [`40d5bb8a2f4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/40d5bb8a2f4) - New `useAutoFocus` hook to be used when wanting to focus on an element during initial mount.
- [`c60505b8a38`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c60505b8a38) - Adds new `useCloseOnEscapePress` hook, to be used exclusively for closing layered components.
- [`cade298437d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cade298437d) - Adds three new hooks (`useElementEvent`, `useDocumentEvent`, `useWindowEvent`) for listening to native browser events.
- [`2d996ae3869`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d996ae3869) - Adds new hook `usePreviousValue`.

## 1.1.0

### Minor Changes

- [#9756](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9756) [`e56d6be0379`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e56d6be0379) - A new utility to calculate scrollbar width is added for re-use.
- [`a2924ae3e4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2924ae3e4f) - **Add DS lib package with reusable utils and hooks**

  - We are introducing a new package which contains reusable utils and hooks specific to design system.

  - Following **hooks** are available:

    - `useLazyRef`: Which will only run passed expensive function once and save the result into the returned `ref`.

  - Following **utils** are available:

    - `noop`: An empty function which returns nothing.

- [`14396cae929`](https://bitbucket.org/atlassian/atlassian-frontend/commits/14396cae929) - Add warnOnce helper function
- [`27570643ef2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/27570643ef2) - Adds use lazy callback and use state ref hooks.
