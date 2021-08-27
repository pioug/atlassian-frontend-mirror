# @atlaskit/analytics-next

## 8.3.0

### Minor Changes

- [`37fd554209e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37fd554209e) - Add instance checks for analytics events in analytics-next. Update check in mpt-analytics for events too.

## 8.2.1

### Patch Changes

- [`a4420ad5104`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4420ad5104) - Improves referential stability of analytics-next wrapped callbacks

## 8.2.0

### Minor Changes

- [`0dbf0427287`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0dbf0427287) - [ux] Added new optional props to allow executing on catching error and rendering an error screen on error

## 8.1.4

### Patch Changes

- [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates to development dependency `storybook-addon-performance`

## 8.1.3

### Patch Changes

- [`5a9b102eef0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a9b102eef0) - Add optional actionSubject parameter to usePlatformLeafHandlerHook

## 8.1.2

### Patch Changes

- [`b290f591719`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b290f591719) - Add process type check in analytics next

## 8.1.1

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 8.1.0

### Minor Changes

- [`4eb71695b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4eb71695b5) - Added usePlatformLeafSyntheticEventHandler, which acts similarly to usePlatformLeafEventHandler but is used for synthetic events where the event handler takes no `value` prop

## 8.0.2

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 8.0.1

### Patch Changes

- [`b6af9198dd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6af9198dd) - Restructure back to original lite mode file structure

## 8.0.0

### Major Changes

- [`b485472340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b485472340) - Export WithContextProps type to prevent deep import path references in dependent packages declaration output.

  Released as a major to prevent existing Atlaskit dependencies that use analytics-next from breaking when analytics-next file structure changes in the future.

## 7.1.1

### Patch Changes

- [`2ac834240e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ac834240e) - Undo analytics-next file restructure to allow external ts definitions to continue working

## 7.1.0

### Minor Changes

- [`0e2a914932`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e2a914932) - ### Additions

  - Added a new hook `useAnalyticsEventHandler` for sole use in Atlaskit components

  ### Removals

  - Removed some entry points that were unintentionally exposed
    - `AnalyticsContextConsumer`
    - `withAnalyticsHook`
    - `usePatchedProps`
    - `cleanProps`
    - `AnalyticsReactContext`
    - `AnalyticsEventMap`

  ### Improvements

  - Optimization of components to prevent unnecessary re-renders via inline callbacks or jsons
  - Conversion to Function Components where possible
  - Preparation for dropping legacy React context in a future major release (see note below)
  - Documentation improvements
  - Improved directory structure
  - Adoption of new standards

  ### IMPORTANT: Note on React Context changes

  (Legacy React context)[https://reactjs.org/docs/legacy-context.html] will be removed in a future version of React.

  In addition its presence can be (problematic for performance)[https://twitter.com/dan_abramov/status/1064559184010723330].

  As a result, we have taken steps to migrate away from it and use the new (React Context API)[https://reactjs.org/docs/context.html].

  To achieve this we are rolling the drop out in 2 phases:

  #### Phase I (this release)

  We have changed analytics components to receive modern context. Listeners and the Context layer will provide both modern and legacy context by default.

  At their own risk, package consumers can opt in to no longer supply legacy context by using the environment variable
  ANALYTICS_NEXT_MODERN_CONTEXT=true.

  When doing so, any analytics consumers that rely on legacy context will not receive any, and events may be lost! This would happen when using old atlaskit packages that consume a version of @atlaskit/analytics-next before this version.

  #### Phase II (future major)

  In a future release (TBA) we will remove all legacy context support and clean up the branching around ANALYTICS_NEXT_MODERN_CONTEXT.
  After this point, @atlaskit/analytics-next will not work with components that use a version prior to this one.

### Patch Changes

- [`967279b3f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/967279b3f8) - Fix for type names that ship with new hook

## 7.0.3

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

- Updated dependencies

## 7.0.2

### Patch Changes

- [`723a322186`](https://bitbucket.org/atlassian/atlassian-frontend/commits/723a322186) - Hotfix to have a stable react context across multiple versions of @atlaskit/analytics-next

## 7.0.1

### Patch Changes

- [`bff2f273bf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bff2f273bf) - useAnalyticsEvents will no longer log errors when used without an AnalyticsListerner or AnalyticsContext

## 7.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 6.3.6

### Patch Changes

- [patch][109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):

  Deletes internal package @atlaskit/type-helpers and removes all usages. @atlaskit/type-helpers has been superseded by native typescript helper utilities.- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):

- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
  - @atlaskit/docs@8.5.1
  - @atlaskit/button@13.3.10

## 6.3.5

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/button@13.3.7
  - @atlaskit/textfield@3.1.6
  - @atlaskit/type-helpers@4.2.3

## 6.3.4

### Patch Changes

- [patch][6940a2107f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6940a2107f):

  Removes cycle in internal components.

## 6.3.3

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Fixes useAnalyticsEvents() not having a stable function reference.- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Fixes data type to Object- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  - @atlaskit/field-text@9.0.14

## 6.3.2

### Patch Changes

- [patch][768bac6d81](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/768bac6d81):

  Remove redundant object check (which was previously required to appease type checking)

## 6.3.1

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 6.3.0

### Minor Changes

- [minor][2252a7a999](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2252a7a999):

  Bug fix for using the hook with nested contexts, performance improvements, new `useAnalyticsEventsCallback` hook to provide a performance enhanced-abstraction for firing events with a callback.

## 6.2.0

### Minor Changes

- [minor][42fd897e16](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42fd897e16):

  - Introduces a new custom React hook, `useAnalyticsEvents_experimental`, for creating analytics events within functional components. This hook replaces the need for the `withAnalyticsEvents` HOC. See the [Reference documentation](https://atlaskit.atlassian.com/packages/core/analytics-next/docs/reference) for details on how to use this new hook.

## 6.1.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 6.0.3

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 6.0.2

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 6.0.1

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 6.0.0

### Major Changes

- [major][926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):

  Analytics-next has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No behavioural changes.

  **Breaking changes**

  - `withAnalyticsForSumTypeProps` alias has been removed, please use `withAnalyticsEvents`
  - `AnalyticsContextWrappedComp` alias has been removed, please use `withAnalyticsContext`

  **Breaking changes to TypeScript annotations**

  - `withAnalyticsEvents` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
  - `withAnalyticsContext` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
  - Type `WithAnalyticsEventProps` has been renamed to `WithAnalyticsEventsProps` to match source code
  - Type `CreateUIAnalyticsEventSignature` has been renamed to `CreateUIAnalyticsEvent` to match source code
  - Type `UIAnalyticsEventHandlerSignature` has been renamed to `UIAnalyticsEventHandler` to match source code
  - Type `AnalyticsEventsPayload` has been renamed to `AnalyticsEventPayload`
  - Type `ObjectType` has been removed, please use `Record<string, any>` or `[key: string]: any`
  - Type `UIAnalyticsEventInterface` has been removed, please use `UIAnalyticsEvent`
  - Type `AnalyticsEventInterface` has been removed, please use `AnalyticsEvent`
  - Type `CreateAndFireEventFunction` removed and should now be inferred by TypeScript
  - Type `AnalyticsEventUpdater` removed and should now be inferred by TypeScript

## 5.4.1

### Patch Changes

- [patch][1439241943](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1439241943):

  Adding error boundary in media picker dropzone

## 5.4.0

### Minor Changes

- [minor][e1f8aaf33b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e1f8aaf33b):

  - Adding entry point for `AnalyticsErrorBoundary` package

  ```
  // How to use

  // Import via entry point
  import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
  import AnalyticsErrorBoundary from '@atlaskit/analytics-next/AnalyticsErrorBoundary';

  // Wrapping your component with the component
  class ButtonWithAnalyticsErrorBoundary extends React.Component {
    handleEvent = (analyticsEvent) => {
      const { payload, context } = analyticsEvent;
      console.log('Received event:', analyticsEvent, { payload, context });
    };

    render() {
      return (
        <AnalyticsListener channel="atlaskit" onEvent={this.handleEvent}>
          <AnalyticsErrorBoundary
            channel="atlaskit"
            data={{
              componentName: 'button',
              packageName: '@atlaskit/button',
              componentVersion: '999.9.9',
            }}
          >
            <Button>Click me</Button>
          </AnalyticsErrorBoundary>
        </AnalyticsListener>
      )
    }
  }
  ```

  Notes on new API:

  - Plug-and-play component. As soon and it's wrapping a component it's fully integrated.
  - It has Analytics context and events integrated already. Keep in mind it requires `AnalyticsListener` as a top level component to work properly, otherwise it won't trigger analytics events.

## 5.3.1

### Patch Changes

- [patch][281451e6dc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/281451e6dc):

  Republishing package to export AnalyticsErrorBoundaryProps

## 5.3.0

### Minor Changes

- [minor][ed9ae90c94](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed9ae90c94):

  Adding Analytics Error Boundary component

## 5.2.0

### Minor Changes

- [minor][8fcbe23ec6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fcbe23ec6):

  Updated types for analytics-next and buttons to make them easier to consume

## 5.1.3

### Patch Changes

- [patch][c6ad66d326](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6ad66d326):

  The types property in package.json now points to the correct file"

## 5.1.2

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 5.1.1

### Patch Changes

- [patch][6ea9bb7873](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ea9bb7873):

  analytics-next now exports an ambient module declaration which resolves an issue with types being required via relative imports

## 5.1.0

### Minor Changes

- [minor][d0db01b410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0db01b410):

  TypeScript users of withAnalyticsEvents and withAnalyticsContext are now required to provide props as a generic type. This is so that TypeScript can correctly calculate the props and defaultProps of the returned component.

  Before:

  ```typescript
  withAnalyticsEvents()(Button) as ComponentClass<Props>;
  ```

  After:

  ```typescript
  withAnalyticsEvents<Props>()(Button);
  ```

## 5.0.2

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 5.0.1

### Patch Changes

- [patch][47acb57783](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/47acb57783):

  - Avoid unnecessary re-renders on components that use withAnalytics

## 5.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 4.0.5

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next supplied from itself.

## 4.0.4

- [patch][9321da655d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9321da655d):

  - Update AnalyticsEventMap, as per major inline edit rewrite

## 4.0.3

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/field-text@8.0.2
  - @atlaskit/button@12.0.0

## 4.0.2

- [patch][98e11001ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98e11001ff):

  - Removes duplicate babel-runtime dependency

## 4.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/field-text@8.0.1
  - @atlaskit/button@11.0.0

## 4.0.0

- [major][76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):

  - Drop ES5 from all the flow modules

  ### Dropping CJS support in all @atlaskit packages

  As a breaking change, all @atlaskit packages will be dropping cjs distributions and will only distribute esm. This means all distributed code will be transpiled, but will still contain `import` and
  `export` declarations.

  The major reason for doing this is to allow us to support multiple entry points in packages, e.g:

  ```js
  import colors from `@atlaskit/theme/colors`;
  ```

  Previously this was sort of possible for consumers by doing something like:

  ```js
  import colors from `@atlaskit/theme/dist/esm/colors`;
  ```

  This has a couple of issues. 1, it treats the file system as API making internal refactors harder, we have to worry about how consumers might be using things that aren't _actually_ supposed to be used. 2. We are unable to do this _internally_ in @atlaskit packages. This leads to lots of packages bundling all of theme, just to use a single color, especially in situations where tree shaking fails.

  To support being able to use multiple entrypoints internally, we unfortunately cannot have multiple distributions as they would need to have very different imports from of their own internal dependencies.

  ES Modules are widely supported by all modern bundlers and can be worked around in node environments.

  We may choose to revisit this solution in the future if we find any unintended condequences, but we see this as a pretty sane path forward which should lead to some major bundle size decreases, saner API's and simpler package architecture.

  Please reach out to #fabric-build (if in Atlassian) or create an issue in [Design System Support](https://ecosystem.atlassian.net/secure/CreateIssue.jspa?pid=24670) (for external) if you have any questions or queries about this.

## 3.2.1

- [patch][8de4c3f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8de4c3f):

  - Added missing export

## 3.2.0

- [minor][c3fa0b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3fa0b6):

  - Added support for props of Sum type

## 3.1.2

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/button@10.1.1
  - @atlaskit/field-text@7.0.18
  - @atlaskit/docs@6.0.0

## 3.1.1

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/field-text@7.0.15
  - @atlaskit/button@10.0.0

## 3.1.0

- [minor][cffeed0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cffeed0):

  - Type `withAnalyticsEvents` and `withAnalyticsContext` HOCs so that they do not lose flow types of the components they wrap when chained together.

    This will fix flow types not flowing through all of the components that we have instrumented with analytics as they are typically wrapped with both HOCs. To get flow types flowing
    through your components again, upgrade them to the latest version and also update their @atlaskit/analytics-next dependency to the latest version.

    We also now export `AnalyticsContextWrappedComp` and `AnalyticsEventsWrappedComp` parameterised types that allow you to explicitly type components wrapped with these HOCs which is necessary in cases where the HOC wrapping is extracted into another function.

## 3.0.11

- [patch][d903ab5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d903ab5):

  - Updates list of instrumented components

## 3.0.10

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 3.0.9

- [patch] adds missing babel-runtime dependency to package json [93b031a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93b031a)

## 3.0.8

- [patch] Fixing analytics events for checkbox/radio/select [3e428e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3e428e3)

## 3.0.7

- [patch] Loosen AnalyticsEventPayload type to cater for Screen events [2d4b52e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d4b52e)

## 3.0.5

- [patch] Loosen AnalyticsEventCreator return type [f7432a2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f7432a2)
- [none] Updated dependencies [f7432a2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f7432a2)

## 3.0.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/field-text@7.0.4
  - @atlaskit/button@9.0.5

## 3.0.3

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/button@9.0.4
  - @atlaskit/field-text@7.0.3
  - @atlaskit/docs@5.0.2

## 3.0.2

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/field-text@7.0.2
  - @atlaskit/button@9.0.3

## 3.0.1

- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/field-text@7.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/docs@5.0.1

## 3.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/field-text@7.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/docs@5.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/field-text@7.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/docs@5.0.0

## 2.1.9

- [patch] removes requirement of children to be a single React node [53cba6b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/53cba6b)
- [none] Updated dependencies [53cba6b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/53cba6b)

## 2.1.8

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1

## 2.1.7

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/docs@4.1.0
  - @atlaskit/field-text@6.0.2
  - @atlaskit/button@8.1.0

## 2.1.6

- [patch] Unpublish fake TS declaration file [ec9f11f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec9f11f)
- [none] Updated dependencies [ec9f11f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec9f11f)

## 2.1.5

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/field-text@6.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/docs@4.0.1

## 2.1.4

- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/field-text@6.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/docs@4.0.0

## 2.1.3

- [patch] Removed ambient typescript type declaration file from analytics-next - this may be a breaking change for typescript consumers [290d804](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/290d804)
- [none] Updated dependencies [290d804](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/290d804)

## 2.1.2

- [patch] Fix prop callbacks specified in the create event map to not change reference values each render and instead only update when the original prop callback changes [586a80c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/586a80c)
- [none] Updated dependencies [586a80c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/586a80c)

## 2.1.1

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/field-text@5.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/docs@3.0.4

## 2.1.0

- [minor] Export cleanProps function that can be used to strip analytics props provided by our HOCs, useful when spreading props to a child element [973d6ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/973d6ea)

## 2.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 1.1.10

- [patch] Adjusted exports to prevent attempted exporting of flow types in built code. [183ee96](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/183ee96)

## 1.1.9

- [patch] Updates flow types of withAnalyticsEvents and withAnalyticsContext HOCs [26778bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/26778bc)
- [patch] Uses element config flow type with button deprecation warnings hoc [a9aa90a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a9aa90a)

## 1.1.8

- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)

## 1.1.7

- [patch] Fix/revert TS TDs in analytics-next [1284d32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1284d32)

## 1.1.6

- [patch] Fix analytics-next TS type definition [9faaa5f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9faaa5f)
- [patch] Fix analytics-next TS type definition [7e26229](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e26229)

## 1.1.5

- [patch] Add analytics events for click and show actions of media-card [031d5da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/031d5da)
- [patch] Add analytics events for click and show actions of media-card [b361185](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b361185)

## 1.1.4

- [patch] fixes problem with withAnalyticsEvents HOC passing old function props to wrapped component [c88b030](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c88b030)

## 1.1.3

- [patch] adds displayName to analytics HOCs [f69ccad](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f69ccad)

## 1.1.2

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 1.1.1

- [patch] Remove min requirement of node 8 for analytics-next [c864671](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c864671)

## 1.1.0

- [minor] adds createAndFireEvent utility method and updates docs [24a93fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24a93fc)

## 1.0.3

- [patch] fixes flow type problem with wrapping stateless functional components in withAnalyticsEvents [8344ffb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8344ffb)

## 1.0.2

- [patch] Adds action key to analytics payload type [7deeaef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7deeaef)

## 1.0.1

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 1.0.0

- [major] release @atlaskit/analytics-next package [80695ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80695ea)
