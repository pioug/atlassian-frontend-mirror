# @atlaskit/ds-lib

## 5.3.0

### Minor Changes

- [`8ced6a00eae26`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8ced6a00eae26) -
  Improving typing and ergonomics of `mergeRefs`.
  - `mergeRefs` will now correctly return the type of the refs passed in
  - `mergeRefs` will now return a `React.RefCallback<T>` (`T` being the value of the refs passed in)
  - `mergeRefs` now accepts `null`, `undefined` and `false` values, making it easier to work with
    when you have refs that may not exist

  _Examples_

  **Better type inference:**

  ```tsx
  const buttonRef = createRef<HTMLButtonElement | null>();
  const mergedRef = mergeRefs([buttonRef, null, undefined, false]);
  // mergedRef is now typed as RefCallback<HTMLButtonElement | null>
  ```

  **Explicit generic typing:**

  ```tsx
  const callback = mergeRefs<HTMLButtonElement | null>([buttonRef, null, undefined, false]);
  // Explicitly specify the element type for better type safety
  ```

  **Flexible ref handling:**

  ```tsx
  // Now supports falsy values without TypeScript errors
  const optionalRef = condition ? someRef : false;
  const mergedRef = mergeRefs([requiredRef, optionalRef]); // ✅ Works!
  ```

## 5.2.0

### Minor Changes

- [`07ee26a0f6e1a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/07ee26a0f6e1a) -
  Cleaned platform_only_attach_escape_handler_on_view FG. After cleaning this gate, keydown and
  keyup event listeners wont be attached in useCloseOnEscapePress if it is disabled in all products.

## 5.1.1

### Patch Changes

- [`39e543109ec09`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/39e543109ec09) -
  add type info to forwardRef components

## 5.1.0

### Minor Changes

- [`332393d8d236d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/332393d8d236d) -
  Add `forwardRefWithGeneric` as a util to the `ds-lib` package so it is available for all of the
  Design System.

## 5.0.1

### Patch Changes

- [`23868361e470e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/23868361e470e) -
  Behind feature gates 'platform-dst-react-18-use-id' and
  'platform-dst-react-18-use-id-selector-safe' makes the `useId()` function return a selector-safe
  version of `React.useId()` matching React 19.x functionality per
  https://github.com/facebook/react/pull/33422

## 5.0.0

### Major Changes

- [#190351](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/190351)
  [`c7fc5282f52c6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c7fc5282f52c6) -
  Removing `.clear()` from `once` result functions (`once` was only recently added). This was done
  to prevent accidental exposure of `.clear()` to consumers when it would not be safe to clear the
  `once` cache (for example, with `cleanup` functions where we always want to prevent double
  calling). If we need a `once` variant in the future that requires the onced function cache to be
  clearable, we can create a new `onceWithClear` utility for that.

  ```tsx
  import once from '@atlaskit/ds-lib/once';

  function getGreeting(name: string): string {
  	return `Hello ${name}`;
  }
  const getGreetingOnce = once(getGreeting);

  // ❌ Can no longer call `.clear()` on onced functions
  getGreetingOnce.clear();
  ```

## 4.2.0

### Minor Changes

- [#189855](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/189855)
  [`75f651c9b221b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/75f651c9b221b) -
  Adding a `once` function. `once` creates a new `function` that only allows an existing `function`
  to be called once.

  ```tsx
  import once from '@atlaskit/ds-lib/once';

  function getGreeting(name: string): string {
  	return `Hello ${name}`;
  }
  const getGreetingOnce = once(getGreeting);

  getGreetingOnce('Alex');
  // getGreeting called and "Hello Alex" is returned
  // "Hello Alex" is put into the cache.
  // returns "Hello Alex"

  getGreetingOnce('Sam');
  // getGreeting is not called
  // "Hello Alex" is returned from the cache.

  getGreetingOnce('Greg');
  // getGreeting is not called
  // "Hello Alex" is returned from the cache.
  ```

## 4.1.0

### Minor Changes

- [#186591](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/186591)
  [`4568f6d3493c7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4568f6d3493c7) -
  Adding `withResolvers` util which has the same behaviour as `Promise.withResolvers()`

  ```ts
  import { withResolvers } from '@atlaskit/ds-lib/with-resolvers';

  const { promise, resolve, reject } = withResolvers();
  ```

## 4.0.1

### Patch Changes

- [#169976](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/169976)
  [`5b16bcc8996da`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5b16bcc8996da) -
  Avoid adding document event listeners unless the components are visible

## 4.0.0

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

- [#117946](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117946)
  [`bb1b731800871`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bb1b731800871) -
  Rename underlying feature gate to turn it on internally.

## 3.5.1

### Patch Changes

- Updated dependencies

## 3.5.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

## 3.4.0

### Minor Changes

- [#108333](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108333)
  [`7d910859d8b6f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7d910859d8b6f) -
  Introduce new util for apple device and safari browser check

## 3.3.0

### Minor Changes

- [#168743](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168743)
  [`f7e6b20c99795`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f7e6b20c99795) -
  Update IdProvider to improve compatibility with React 18: wrapped the returned children in a
  Fragment to ensure a single root element is always returned.

## 3.2.2

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 3.2.1

### Patch Changes

- [#165086](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165086)
  [`472d72ec74eab`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/472d72ec74eab) -
  Minor TS fix

## 3.2.0

### Minor Changes

- [`be6f923511512`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/be6f923511512) -
  Adding new hook: `useStableRef` which is helpful to store the latest values of `state` or `props`
  for usage in effects or event listeners without needing to create new effects or event listeners
  functions.

  ```tsx
  import useStableRef from '@atlaskit/ds-lib/use-stable-ref';

  function Component({ canShow }: { canShow: () => boolean }) {
  	const stableRef = useStableRef({ canShow });

  	useEffect(
  		() => {
  			stableRef.current.canShow();
  		},
  		// Able to use the last render value of `canShow` without needing
  		// to invalidate the effect. Useful for lazy usage of props.
  		[],
  	);

  	return null;
  }
  ```

## 3.1.0

### Minor Changes

- [#150983](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/150983)
  [`a06534942509c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a06534942509c) -
  Export a react-uid helper for class components to access 'useId' via 'UseId' wrapping component

## 3.0.0

### Major Changes

- [#149152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149152)
  [`92cf54d8ca959`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/92cf54d8ca959) -
  This major bump exists only to make the previous version's react-uid export rename easier to
  consume. There are no changes in this release. See v2.7.0 for previous changes.

## 2.7.0

### Minor Changes

- [#148281](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/148281)
  [`3c4de48168ffe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3c4de48168ffe) -
  Rename export of react-uid to use-id to fix import errors due to naming conflict

## 2.6.0

### Minor Changes

- [#143323](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143323)
  [`4fdf6347eb506`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4fdf6347eb506) -
  Add new entrypoint called "use-layout-effect" to ds-lib and use it inside primitives pkg.

## 2.5.0

### Minor Changes

- [#131099](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/131099)
  [`d0ed540a6bc17`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d0ed540a6bc17) -
  Add a new hook userUniqueId

## 2.4.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

## 2.3.1

### Patch Changes

- [#94316](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94316)
  [`35fd5ed8e1d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/35fd5ed8e1d7) -
  Upgrading internal dependency `bind-event-listener` to `@^3.0.0`

## 2.3.0

### Minor Changes

- [#91155](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91155)
  [`4d208db71d4c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4d208db71d4c) -
  Add support for React 18 in non-strict mode.

## 2.2.5

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 2.2.4

### Patch Changes

- [#70573](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70573)
  [`03bbd8a15b22`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/03bbd8a15b22) -
  Added keycodes for tab, enter and space keys.

## 2.2.3

### Patch Changes

- [#32935](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32935)
  [`b1bdec7cce2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1bdec7cce2) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 2.2.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 2.2.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 2.2.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

## 2.1.3

### Patch Changes

- [#32294](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32294)
  [`e0460d5d989`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0460d5d989) - Usages
  of `process` are now guarded by a `typeof` check.

## 2.1.2

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 2.1.1

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 2.1.0

### Minor Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`620c24e72b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/620c24e72b4) -
  Introduces `propDeprecationWarning` function.

### Patch Changes

- [`cd1a2f64027`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd1a2f64027) - Internal
  code change turning on new linting rules.

## 2.0.1

### Patch Changes

- [#22614](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22614)
  [`8a5bdb3c844`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a5bdb3c844) -
  Upgrading internal dependency (bind-event-listener) for improved internal types

## 2.0.0

### Major Changes

- [#22029](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22029)
  [`347fd703ce0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/347fd703ce0) - Removing
  useDocumentEvent, useWindowEvent, useElementEvent and useKeydownEvent and replacing usages with
  bind-event-listener

## 1.4.2

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 1.4.1

### Patch Changes

- [#20033](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20033)
  [`b3e5a62a9e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3e5a62a9e3) - Adds
  `static` techstack to package, enforcing stricter style linting. In this case the package already
  satisfied this requirement so there have been no changes to styles.

## 1.4.0

### Minor Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`9f8f2b902bb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f8f2b902bb) - Adds a
  new utility function for standardised deprecation warnings.

## 1.3.0

### Minor Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302)
  [`5b5bffe8f58`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b5bffe8f58) - - Adds
  two new methods: `useKeyDownEvent` and `useFocusEvent`.
  - Adds keycodes as constants.

## 1.2.0

### Minor Changes

- [#10230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10230)
  [`742b9d82cdc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/742b9d82cdc) - Added
  `useControlled` hook which can be used to be handle controlled & uncontrolled behaviour of a
  componenent.
- [`e1d9004d5ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e1d9004d5ee) - Adds new
  utility to merge refs.
- [`40d5bb8a2f4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/40d5bb8a2f4) - New
  `useAutoFocus` hook to be used when wanting to focus on an element during initial mount.
- [`c60505b8a38`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c60505b8a38) - Adds new
  `useCloseOnEscapePress` hook, to be used exclusively for closing layered components.
- [`cade298437d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cade298437d) - Adds
  three new hooks (`useElementEvent`, `useDocumentEvent`, `useWindowEvent`) for listening to native
  browser events.
- [`2d996ae3869`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d996ae3869) - Adds new
  hook `usePreviousValue`.

## 1.1.0

### Minor Changes

- [#9756](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9756)
  [`e56d6be0379`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e56d6be0379) - A new
  utility to calculate scrollbar width is added for re-use.
- [`a2924ae3e4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2924ae3e4f) - **Add DS
  lib package with reusable utils and hooks**
  - We are introducing a new package which contains reusable utils and hooks specific to design
    system.

  - Following **hooks** are available:
    - `useLazyRef`: Which will only run passed expensive function once and save the result into the
      returned `ref`.

  - Following **utils** are available:
    - `noop`: An empty function which returns nothing.

- [`14396cae929`](https://bitbucket.org/atlassian/atlassian-frontend/commits/14396cae929) - Add
  warnOnce helper function
- [`27570643ef2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/27570643ef2) - Adds use
  lazy callback and use state ref hooks.
