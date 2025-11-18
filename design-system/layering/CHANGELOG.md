# @atlaskit/layering

## 3.4.0

### Minor Changes

- [`8b3783c70ef57`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8b3783c70ef57) -
  The `useOpenLayerObserver` hook will no longer throw an error if there is no `OpenLayerObserver`
  in the component tree. Instead, it will return `null`.

## 3.3.0

### Minor Changes

- [`05dd9b7db95b7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/05dd9b7db95b7) -
  The open layer observer has been updated to support getting the count of open layers of a specific
  type, using `getCount` with a `type` parameter.

  This change was previously behind the FG `platform-dst-open-layer-observer-layer-type`, which has
  now been removed.

## 3.2.1

### Patch Changes

- Updated dependencies

## 3.2.0

### Minor Changes

- [`8a71ce992f8c8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8a71ce992f8c8) -
  The open layer observer now supports layers providing a `type` when registering, using
  `useNotifyOpenLayerObserver`.

  This is used for getting the count of open layers of a specific type, using `getCount`. Filtering
  by type is behind the FG `platform-dst-open-layer-observer-layer-type`.

  Currently only `modal` is supported as a type.

## 3.1.0

### Minor Changes

- [`2c8e6f2ebadef`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2c8e6f2ebadef) -
  Removes FG that migrates layering component to use tree structure

## 3.0.3

### Patch Changes

- Updated dependencies

## 3.0.2

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- [#172990](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/172990)
  [`72746250a3966`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/72746250a3966) -
  Implemented tree graph for ADS Layering and removed old FG

## 3.0.0

### Major Changes

- [#168600](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/168600)
  [`ec7295f858434`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ec7295f858434) -
  The `useOpenLayerObserverBehindFG` has been removed. It was only created to support the feature
  flag rollout. You should use the `useOpenLayerObserver` hook instead.

## 2.2.1

### Patch Changes

- [#168502](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/168502)
  [`9b40fe768e1a6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9b40fe768e1a6) -
  The `useOpenLayerObserverBehindFG` hook has been reintroduced with a null return value to resolve
  build issues. It will be removed in a following major release.

## 2.2.0

### Minor Changes

- [#157650](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157650)
  [`3696befec09c1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3696befec09c1) -
  The feature flag for updating the experimental OpenLayerObserver to support closing and grouping
  layers has now been cleaned up.

  The `useNotifyOpenLayerObserverBehindFG` hook has been removed along with it, as it was only
  created to support the feature flag rollout.

## 2.1.1

### Patch Changes

- [#141383](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141383)
  [`5b44229081f06`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5b44229081f06) -
  Extract type of NotifyOpenLayerObserverProps

## 2.1.0

### Minor Changes

- [#134955](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/134955)
  [`eff111bcc88a5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/eff111bcc88a5) -
  The experimental OpenLayerObserver now supports:
  - Closing layers - the `useNotifyOpenLayerObserver` hook now requires an `onClose` callback.
  - Grouping layers within a namespace. This allows observers to check the number of open layers
    within a specific "namespace", and narrow their onChange listeners to only be called when the
    layer count within that namespace has been changed.

  These changes are behind a feature flag.

  The `isOpen` parameter of the `useNotifyOpenLayerObserver` hook is now required to remove any
  ambiguity.

## 2.0.1

### Patch Changes

- [#119066](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119066)
  [`dfea81db22b81`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dfea81db22b81) -
  Removed setTimeout from layering useEffect cleanup to avoid race condition

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

## 1.1.3

### Patch Changes

- [#116482](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116482)
  [`521b94c157089`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/521b94c157089) -
  Use setTimeout to correctly set top layer when closing multiple layers

## 1.1.2

### Patch Changes

- [#109887](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109887)
  [`8091548cf0254`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8091548cf0254) -
  Update dependencies.

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [#175453](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/175453)
  [`6e2a886fe4874`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6e2a886fe4874) -
  Launch the first major version of the layering package and make it official on atlassian.design
  website.

## 0.8.0

### Minor Changes

- [#166626](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166626)
  [`2e47aa97dd435`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2e47aa97dd435) -
  Re-releasing this as a minor update to address an issue with the incorrect version (^0.7.0) of
  `@atlaskit/layering` being included in dependent packages.

## 0.7.4

### Patch Changes

- [#166026](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166026)
  [`962b5e77810fb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/962b5e77810fb) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 0.7.3

### Patch Changes

- [#161638](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/161638)
  [`d2e5e5ce0053d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d2e5e5ce0053d) -
  Use Layering and useLayering API and remove setTimeout when updating layer context.

## 0.7.2

### Patch Changes

- [`a18bf674fd76b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a18bf674fd76b) -
  Export layering without UNSAFE prefix

## 0.7.1

### Patch Changes

- [#157176](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157176)
  [`3d03c4f1002ab`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3d03c4f1002ab) -
  Bind key event listeners on window instead of document for useCloseOnEscapePress

## 0.7.0

### Minor Changes

- [#154110](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154110)
  [`4daa6146379d2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4daa6146379d2) -
  The layer observer is no longer behind a feature flag.

## 0.6.0

### Minor Changes

- [#151707](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151707)
  [`a2a509ab13335`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a2a509ab13335) -
  The `useOpenLayerCount` hook has been removed.

  It has been replaced by a new `useOpenLayerObserver` hook, which returns an object with the
  functions:
  - `getCount`: returns the curent count of open layers under the observer
  - `onChange`: allows you to subscribe to changes in the layer count.

## 0.5.1

### Patch Changes

- Updated dependencies

## 0.5.0

### Minor Changes

- [#147187](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147187)
  [`f3fc0c5bb919d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f3fc0c5bb919d) -
  Adds a new experimental open-layer-observer entrypoint. It contains:
  - OpenLayerObserver: a context provider that contains a ref that tracks the number of open layered
    components underneath it in the React DOM.
  - useNotifyOpenLayerObserver: a hook for use within layering components (e.g. popup) that will
    notify its ancestor `OpenLayerObserver`s.
    - This hook is behind a feature flag.
  - useOpenLayerCount: a hook to be used within a `OpenLayerObserver`, that will return the layer
    count ref.

  The use case for this entrypoint is enabling wrapper components to determine if there are any open
  layering components contained within them. For example, the nav4 side nav will need to know if
  there are any popups or dropdown menus currently open within the side nav, so that if it is in
  flyout mode, it will stay locked open until the layered components are hidden or unmounted.

## 0.4.1

### Patch Changes

- [#132554](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132554)
  [`bdc51b8c87640`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bdc51b8c87640) -
  Only set top level when the value is larger

## 0.4.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 0.3.0

### Minor Changes

- [#93670](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93670)
  [`a8edc4e904bc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a8edc4e904bc) -
  Add support for React 18 in non-strict mode.

## 0.2.5

### Patch Changes

- [#94316](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94316)
  [`35fd5ed8e1d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/35fd5ed8e1d7) -
  Upgrading internal dependency `bind-event-listener` to `@^3.0.0`

## 0.2.4

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 0.2.3

### Patch Changes

- [#41628](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41628)
  [`6d9ac32e548`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6d9ac32e548) - Use
  disabled props to toggle layering instead of feature flag

## 0.2.2

### Patch Changes

- [#41184](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41184)
  [`5700fc01a25`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5700fc01a25) - Update
  UNSAFE_LAYERING type to include children type

## 0.2.1

### Patch Changes

- [#40400](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40400)
  [`53444bfd55a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/53444bfd55a) - Use 0
  timeout to delay clean up after layering unmounted

## 0.2.0

### Minor Changes

- [#39726](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39726)
  [`f355884a4aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f355884a4aa) - [ux]
  Support to press escape key and only close the top layer

## 0.1.2

### Patch Changes

- [#39642](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39642)
  [`41d96a34cc4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41d96a34cc4) - Make
  layering package public

## 0.1.1

### Patch Changes

- [#39503](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39503)
  [`da7f4fd98fc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/da7f4fd98fc) - Set top
  layer outside of effect

## 0.1.0

### Minor Changes

- [#39444](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39444)
  [`de929373742`](https://bitbucket.org/atlassian/atlassian-frontend/commits/de929373742) - Init
  layering package to provide layering experience
