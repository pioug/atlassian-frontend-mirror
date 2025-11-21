# @atlaskit/form

## 14.3.0

### Minor Changes

- [`cdecdf6402143`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cdecdf6402143) -
  Adds `aria-required` to input fields when `isRequired` is used on field.

### Patch Changes

- Updated dependencies

## 14.2.7

### Patch Changes

- Updated dependencies

## 14.2.6

### Patch Changes

- Updated dependencies

## 14.2.5

### Patch Changes

- Updated dependencies

## 14.2.4

### Patch Changes

- [`6928afcd12672`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6928afcd12672) -
  Typescript fixes

## 14.2.3

### Patch Changes

- Updated dependencies

## 14.2.2

### Patch Changes

- Updated dependencies

## 14.2.1

### Patch Changes

- Updated dependencies

## 14.2.0

### Minor Changes

- [`10985771cb1e5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/10985771cb1e5) -
  Add props to form component for more transparent prop application to underlying HTML form element.

## 14.1.0

### Minor Changes

- [`ba5410321550c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ba5410321550c) -
  Add new streamlined field implementation through the usage of the `component` prop and it's
  associated `*Message` props. This accounts for the majority of field implementations in products
  and will increase velocity in releasing accessibility improvements to all insteances using this
  implementation.

## 14.0.0

### Major Changes

- [`a225bfa035441`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a225bfa035441) -
  Adds simplified rendering pattern for the form component. When rendering with JSX as chilren and
  not a function as children, the HTML `form` element will be implicitly rendered with props passed
  down from the ADS form component.

#### New streamlined form

The majority of uses of our form component look like the following:

```tsx
<Form onSubmit={(data) => console.log(data)}>
	{({ formProps }) => (
		<form {...formProps} name="form" id="form" data-attribute="abc">
			{/* form contents */}
		</form>
	)}
</Form>
```

We've provided a way to simplify these use cases. You can move the attributes on the HTML `<form>`
element up to the form component. If they aren't a top-level prop, you can use the `formProps` prop
on the form component. All of the contents will be wrapped within an HTML `<form>` element that
includes all necessary props, including those provided on the form component.

```tsx
<Form
	onSubmit={(data) => console.log(data)}
	name="form"
	id="form"
	formProps={{
		'data-attribute': 'abc',
	}}
>
	{/* form contents */}
</Form>
```

The original implementation still exists and works as it did previously.

### Patch Changes

- Updated dependencies

## 13.0.0

### Major Changes

- [`2eb0f5a39acd6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2eb0f5a39acd6) -
  Spread props have been removed from the checkbox field and range field components to improve
  maintenance and consistency of experience for makers.

### Patch Changes

- Updated dependencies

## 12.7.0

### Minor Changes

- [`edef4ab21e5c5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/edef4ab21e5c5) -
  We are testing a new streamlined implementation of the field component behind a feature flag. If
  this fix is successful it will be available in a later release.

## 12.6.2

### Patch Changes

- [`2f220beaedb7a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2f220beaedb7a) -
  Remove unused dependency.

## 12.6.1

### Patch Changes

- [`2e9c49d200b1d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2e9c49d200b1d) -
  Added resetFieldState to Form children props
- Updated dependencies

## 12.6.0

### Minor Changes

- [`27fa43b33e35e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/27fa43b33e35e) -
  Add optional testId prop that applies a data-testid attribute to the underlying form element

## 12.5.4

### Patch Changes

- [`281cc603f5925`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/281cc603f5925) -
  Improve typing within checkbox field

## 12.5.3

### Patch Changes

- Updated dependencies

## 12.5.2

### Patch Changes

- [`020fb99d98aff`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/020fb99d98aff) -
  Simplified screenreader logic for message components when MessageWrapper is present

## 12.5.1

### Patch Changes

- Updated dependencies

## 12.5.0

### Minor Changes

- [`c22bdb7c0b0f8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c22bdb7c0b0f8) -
  [ux] Added support for focusing error fields containing react-select when submitting with errors

## 12.4.1

### Patch Changes

- Updated dependencies

## 12.4.0

### Minor Changes

- [`84cea20e778c3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/84cea20e778c3) -
  We are testing removing spread props for range field behind a feature flag. If this fix is
  successful it will be implemented in a later release.

## 12.3.0

### Minor Changes

- [`c247b696ec62a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c247b696ec62a) -
  We are testing removing spread props for checkbox field behind a feature flag. If this fix is
  successful it will be implemented in a later release.

## 12.2.2

### Patch Changes

- [`543068f818b30`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/543068f818b30) -
  Remove unused internal invariant for the field component.

## 12.2.1

### Patch Changes

- Updated dependencies

## 12.2.0

### Minor Changes

- [`07de46497864a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/07de46497864a) -
  We are testing a new way to render the Form component behind a feature flag. Rendering a `Form`
  component with direct JSX elements instead of a function as `children` will render an HTML `form`
  element internally, reducing the boilerplate required for most use cases. If this fix is
  successful it will be available in a later release.

## 12.1.1

### Patch Changes

- Updated dependencies

## 12.1.0

### Minor Changes

- [`a32c90b3928be`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a32c90b3928be) -
  We are testing a fix to message components behind a feature flag. There was an issue with messages
  that made them not announce when using screenreaders, this has been fixed by adding a slight delay
  to render message content. If this fix is successful it will be available in a later release.

## 12.0.16

### Patch Changes

- [`67eaf0a522c17`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/67eaf0a522c17) -
  Update internal css usage from compiled/react to atlaskit/css

## 12.0.15

### Patch Changes

- Updated dependencies

## 12.0.14

### Patch Changes

- Updated dependencies

## 12.0.13

### Patch Changes

- [#188952](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188952)
  [`1a88e6e2601ae`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1a88e6e2601ae) -
  Migrated usage of renamed/deprecated icons
- Updated dependencies

## 12.0.12

### Patch Changes

- [#182760](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/182760)
  [`971d04b4835b3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/971d04b4835b3) -
  Remove React.FC from all form components.

## 12.0.11

### Patch Changes

- Updated dependencies

## 12.0.10

### Patch Changes

- Updated dependencies

## 12.0.9

### Patch Changes

- Updated dependencies

## 12.0.8

### Patch Changes

- Updated dependencies

## 12.0.7

### Patch Changes

- Updated dependencies

## 12.0.6

### Patch Changes

- [#160530](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/160530)
  [`3d97095c489a5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3d97095c489a5) -
  Internal change to align styling solutions.
- Updated dependencies

## 12.0.5

### Patch Changes

- [#155802](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155802)
  [`08019848e3eab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/08019848e3eab) -
  Refreshed "issue" terminology.
- Updated dependencies

## 12.0.4

### Patch Changes

- Updated dependencies

## 12.0.3

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.
- Updated dependencies

## 12.0.2

### Patch Changes

- Updated dependencies

## 12.0.1

### Patch Changes

- Updated dependencies

## 12.0.0

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

## 11.2.0

### Minor Changes

- [#116138](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116138)
  [`b50c5d5d65ae2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b50c5d5d65ae2) -
  Bump to the latest version of @compiled/react

### Patch Changes

- Updated dependencies

## 11.1.2

### Patch Changes

- Updated dependencies

## 11.1.1

### Patch Changes

- Updated dependencies

## 11.1.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 11.0.3

### Patch Changes

- [#107240](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107240)
  [`5255a1a097bad`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5255a1a097bad) -
  Update dependencies and remove unused internal exports.

## 11.0.2

### Patch Changes

- [#103999](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103999)
  [`9f62ecec4d422`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f62ecec4d422) -
  Update dependencies.

## 11.0.1

### Patch Changes

- Updated dependencies

## 11.0.0

### Major Changes

- [#166027](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166027)
  [`7dc9e1f2a2cb7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7dc9e1f2a2cb7) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR.Please note, in order to
  use this version of `@atlaskit/form`, you will need to ensure that your bundler is configured to
  handle `.css` imports correctly.Most bundlers come with built-in support for `.css` imports, so
  you may not need to do anything. If you are using a different bundler, please refer to the
  documentation for that bundler to understand how to handle `.css` imports.For more information on
  the migration, please refer to [RFC-73 Migrating our components to Compiled
  CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/859

## 10.6.3

### Patch Changes

- [#174905](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/174905)
  [`450cbe9dbf8ff`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/450cbe9dbf8ff) -
  Upgrade from react-router-dom v4 to v6.

## 10.6.2

### Patch Changes

- Updated dependencies

## 10.6.1

### Patch Changes

- Updated dependencies

## 10.6.0

### Minor Changes

- [#168743](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168743)
  [`b27dba8a5f3cd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b27dba8a5f3cd) -
  Update types to improve compatibility with React 18.

### Patch Changes

- Updated dependencies

## 10.5.12

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 10.5.11

### Patch Changes

- Updated dependencies

## 10.5.10

### Patch Changes

- Updated dependencies

## 10.5.9

### Patch Changes

- Updated dependencies

## 10.5.8

### Patch Changes

- [#153024](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/153024)
  [`f2ca7201459b1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f2ca7201459b1) -
  Change `react-uid` to use ID generator that is compatible with React16 and React 18; Strict React
  18 behind a flag.

## 10.5.7

### Patch Changes

- [#152429](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152429)
  [`5d414827c3394`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5d414827c3394) -
  Removes usages of deprecated CustomThemeButton in favor of the new Button

## 10.5.6

### Patch Changes

- [#149694](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149694)
  [`770bc26d556f7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/770bc26d556f7) -
  Migrate to new icons behind a feature flag
- Updated dependencies

## 10.5.5

### Patch Changes

- [#143559](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143559)
  [`56dfbfe361f96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/56dfbfe361f96) -
  Upgrade react-select from 5.4 to 5.8 and replace it with internal atlaskit/react-select

## 10.5.4

### Patch Changes

- Updated dependencies

## 10.5.3

### Patch Changes

- [`34d8c0a75098e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/34d8c0a75098e) -
  [ux] accessibility improvements to the error validation

## 10.5.2

### Patch Changes

- [#129726](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/129726)
  [`778c15c1d279a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/778c15c1d279a) -
  [ux] Removed feature flag `platform.design-system-team.form-header-typography-updates_4f1g6` and
  `platform.design-system-team.form-label-typography-updates` feature flags resulting in minor
  visual changes to typography.

## 10.5.1

### Patch Changes

- Updated dependencies

## 10.5.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 10.4.8

### Patch Changes

- Updated dependencies

## 10.4.7

### Patch Changes

- Updated dependencies

## 10.4.6

### Patch Changes

- [#118734](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118734)
  [`f9641d1cfa4bd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f9641d1cfa4bd) -
  Remove remnants of `extract-react-types`.

## 10.4.5

### Patch Changes

- Updated dependencies

## 10.4.4

### Patch Changes

- Updated dependencies

## 10.4.3

### Patch Changes

- [#114683](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114683)
  [`ff0815316ab38`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ff0815316ab38) -
  Removes usage of custom theme button in places where its API is not being used and the default
  button is able to be used instead. This should give a slight performance (runtime) improvement.

## 10.4.2

### Patch Changes

- [#105813](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105813)
  [`f2f51e7a24d00`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f2f51e7a24d00) -
  Internal change only. Update typography to use typography tokens.
- Updated dependencies

## 10.4.1

### Patch Changes

- Updated dependencies

## 10.4.0

### Minor Changes

- [#110670](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110670)
  [`c733254a2dd6e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c733254a2dd6e) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

### Patch Changes

- Updated dependencies

## 10.3.1

### Patch Changes

- Updated dependencies

## 10.3.0

### Minor Changes

- [#106664](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/106664)
  [`a791a005eaec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a791a005eaec) -
  [ux] We are testing a visual change behind a feature flag. The font weight and color of form
  labels changes. If this change is successful it will be available in a later release.

## 10.2.0

### Minor Changes

- [#99625](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99625)
  [`f60a622d5890`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f60a622d5890) -
  FormHeader refactor to follow new typography system behind a feature flag. FormHeader title does
  not truncate any more.

## 10.1.1

### Patch Changes

- [#100993](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100993)
  [`cb7514abb833`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cb7514abb833) -
  Typography tokens for form labels.

## 10.1.0

### Minor Changes

- [#98612](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98612)
  [`7a11b97d325a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7a11b97d325a) -
  Add support for React 18 in non-strict mode.

### Patch Changes

- Updated dependencies

## 10.0.0

### Major Changes

- [#95117](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/95117)
  [`34507dd83e5e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/34507dd83e5e) -
  Typography changes to form section titles. Form section titles don't truncate content anymore.

### Patch Changes

- Updated dependencies

## 9.3.1

### Patch Changes

- Updated dependencies

## 9.3.0

### Minor Changes

- [#92853](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92853)
  [`e241d0c95e65`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e241d0c95e65) -
  Typography tokenisation and improvements for form messages.

## 9.2.0

### Minor Changes

- [#89977](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89977)
  [`4922acfee53b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4922acfee53b) -
  Typography tokens for RequiredAsterisk.

## 9.1.2

### Patch Changes

- [#68248](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68248)
  [`22e0fd4f6694`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/22e0fd4f6694) -
  Move the onBlur event from the input to the input container in `DatePicker`. Add the type
  `aria-describedby` in to Field component.

## 9.1.1

### Patch Changes

- [#88354](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88354)
  [`4c87d9b4f0c2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4c87d9b4f0c2) -
  The internal composition of this component has changed. There is no expected change in behavior.

## 9.1.0

### Minor Changes

- [#83175](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83175)
  [`03e4aaa5a468`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/03e4aaa5a468) -
  Adds ability to subscribe to form state using the useFormState hook. This can be helpful in
  situations such as forms with conditional fields, or for previewing a form response.
  [Read the docs here.](https://atlassian.design/components/form/examples#listening-to-form-state-with-useformstate)

## 9.0.12

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 9.0.11

### Patch Changes

- Updated dependencies

## 9.0.10

### Patch Changes

- Updated dependencies

## 9.0.9

### Patch Changes

- Updated dependencies

## 9.0.8

### Patch Changes

- [#76686](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/76686)
  [`8eba69714ea6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8eba69714ea6) -
  The internal composition of this component has changed. There is no expected change in behaviour.

## 9.0.7

### Patch Changes

- [#70460](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70460)
  [`2f37600156ae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2f37600156ae) -
  The internal composition of a component in this package has changed. There is no expected change
  in behaviour.

## 9.0.6

### Patch Changes

- [#68013](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68013)
  [`a23882ab49f8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a23882ab49f8) -
  Upgrade depdendency `final-form` for bugfix.

## 9.0.5

### Patch Changes

- [#61141](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61141)
  [`57a79a328287`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57a79a328287) -
  Revert the solution with the hidden span in the Label which was merged in scope of DST-11061.

## 9.0.4

### Patch Changes

- [#60029](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60029)
  [`b9826ea49c47`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b9826ea49c47) -
  Update dependencies that were impacted by HOT-106483 to latest.

## 9.0.3

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147)
  [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) -
  Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 9.0.2

### Patch Changes

- [#58458](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58458)
  [`536478cdcf0b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/536478cdcf0b) -
  Updated Form messages to have a small gap between the icon and message text.

## 9.0.1

### Patch Changes

- Updated dependencies

## 9.0.0

### Major Changes

- [#41791](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41791)
  [`ec7c2a38247`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec7c2a38247) - Removed
  all remaining legacy theming logic from the Calendar, Form, InlineDialog, InlineEdit and
  InlineMessage components.

## 8.11.13

### Patch Changes

- [#40650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40650)
  [`07aa588c8a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07aa588c8a4) - Reverts
  the fix to text descender cut-off, due to incompatibilities with Firefox and Safari.

## 8.11.12

### Patch Changes

- [#38209](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38209)
  [`56b444b56a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56b444b56a8) - Fix a
  bug where text descenders were cut off at high zoom levels on Windows

## 8.11.11

### Patch Changes

- [#38386](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38386)
  [`02b609f1447`](https://bitbucket.org/atlassian/atlassian-frontend/commits/02b609f1447) - Form now
  onboarded onto the product push model for Jira.

## 8.11.10

### Patch Changes

- [#37900](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37900)
  [`7c7704ad529`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c7704ad529) - Imports
  from @atlaskit/form/Messages will no longer pull react-final-form and Field in the bundle.

## 8.11.9

### Patch Changes

- [#37515](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37515)
  [`85935c8cde4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/85935c8cde4) - [ux]
  Denoting live region of form messages using aria-live attribute instead of alert role.

## 8.11.8

### Patch Changes

- [#35295](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35295)
  [`421b74bf0f9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/421b74bf0f9) - Combines
  stylings of label and legend for simpler maintenance.
- [`215b4b5df50`](https://bitbucket.org/atlassian/atlassian-frontend/commits/215b4b5df50) - Removes
  redundant label from legend in fieldset.

## 8.11.7

### Patch Changes

- [#32979](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32979)
  [`ddb4e858a79`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ddb4e858a79) - Removes
  usage of deprecated theme mixins in favor of static token / color usage.

## 8.11.6

### Patch Changes

- [#33652](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33652)
  [`e7ea6832ad2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7ea6832ad2) - Bans the
  use of React.FC/React.FunctionComponent type in ADS components as part of the React 18 migration
  work. The change is internal only and should not introduce any changes for the component
  consumers.

## 8.11.5

### Patch Changes

- [#32935](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32935)
  [`b1bdec7cce2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1bdec7cce2) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 8.11.4

### Patch Changes

- [#34051](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34051)
  [`49b08bfdf5f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/49b08bfdf5f) - Migrated
  use of `gridSize` to space tokens where possible. There is no expected visual or behaviour change.

## 8.11.3

### Patch Changes

- [#33584](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33584)
  [`e8dbb0a281b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e8dbb0a281b) - add a11y
  support for alert messages

## 8.11.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 8.11.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 8.11.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 8.10.0

### Minor Changes

- [#32350](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32350)
  [`c71b0ac8222`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c71b0ac8222) - Added
  testId prop to the Field component for better testing.

## 8.9.1

### Patch Changes

- [#32437](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32437)
  [`eb179f0c089`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb179f0c089) - Migrates
  unit tests from enzyme to RTL.

## 8.9.0

### Minor Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`824851f3580`](https://bitbucket.org/atlassian/atlassian-frontend/commits/824851f3580) - [ux]
  Gives added affordance to sighted users to get information on meaning of asterisk symbol on
  required fields.

### Patch Changes

- [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils

## 8.8.8

### Patch Changes

- [#32294](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32294)
  [`e0460d5d989`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0460d5d989) - Usages
  of `process` are now guarded by a `typeof` check.

## 8.8.7

### Patch Changes

- [#31891](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31891)
  [`1c6c493447f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1c6c493447f) - [ux]
  Place label and message fields in correct aria attributes.

## 8.8.6

### Patch Changes

- [#31206](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31206)
  [`261420360ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/261420360ec) - Upgrades
  component types to support React 18.
- Updated dependencies

## 8.8.5

### Patch Changes

- [#31338](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31338)
  [`74c1b81a476`](https://bitbucket.org/atlassian/atlassian-frontend/commits/74c1b81a476) - Replaces
  use of `gridSize` with space tokens. There is no expected visual change.

## 8.8.4

### Patch Changes

- Updated dependencies

## 8.8.3

### Patch Changes

- [#28090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28090)
  [`1b8e257525f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1b8e257525f) - [ux]
  Message content now preserves whitespace between elements.
- [`ea1ad1d867f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea1ad1d867f) - Message
  typings have been corrected, removing a number of props. These props existed only in the type and
  had no effect when used.

  The props which were removed from the typings are:
  - `error`
  - `fieldId`
  - `valid`

- [`b96e69cdf36`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b96e69cdf36) - [ux]
  DSP-6625: Updated Form label text color token to match the design.

## 8.8.2

### Patch Changes

- Updated dependencies

## 8.8.1

### Patch Changes

- Updated dependencies

## 8.8.0

### Minor Changes

- [#26712](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26712)
  [`f2d39d67a70`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f2d39d67a70) - Fixed
  the issue where field's value was reset on the component re-mount.

## 8.7.1

### Patch Changes

- Updated dependencies

## 8.7.0

### Minor Changes

- [#25860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25860)
  [`500a96aa7de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/500a96aa7de) - Add
  elementAfterLabel prop to form Field.

### Patch Changes

- [`001c650e983`](https://bitbucket.org/atlassian/atlassian-frontend/commits/001c650e983) - Add
  ds-lib devDependency. No behaviour change.

## 8.6.0

### Minor Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710)
  [`ae87a1a6d39`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae87a1a6d39) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

### Patch Changes

- Updated dependencies

## 8.5.9

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 8.5.8

### Patch Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004)
  [`0fbb2840aba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0fbb2840aba) - Add
  isInvalid prop to `@atlastkit/Select`. The prop indicates whether if the component is in the error
  state. If true, it visually shows a red border around the input.

  This replaces validationState to make Select more consistent like other components that uses
  isInvalid prop.

- Updated dependencies

## 8.5.7

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 8.5.6

### Patch Changes

- [#23485](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23485)
  [`f2b8ca863a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f2b8ca863a0) - [ux]
  Updates to slightly darken fallback colors for field messages

## 8.5.5

### Patch Changes

- Updated dependencies

## 8.5.4

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 8.5.3

### Patch Changes

- Updated dependencies

## 8.5.2

### Patch Changes

- Updated dependencies

## 8.5.1

### Patch Changes

- Updated dependencies

## 8.5.0

### Minor Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`c987bb60a89`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c987bb60a89) - Exposes
  an additional Label component in `@atlaskit/form` - this component is designed to be wrapped by
  the Field component but there are certain use cases that require a Label on its own. This is to
  fulfill those use cases.

### Patch Changes

- [`58884c2f6c1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58884c2f6c1) - Internal
  code change turning on a new linting rule.

## 8.4.8

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Updates
  usage of deprecated token names so they're aligned with the latest naming conventions. No UI or
  visual changes
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Bump
  dependency tiny-invariant to latest"
- Updated dependencies

## 8.4.7

### Patch Changes

- Updated dependencies

## 8.4.6

### Patch Changes

- [#17475](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17475)
  [`c55c736ecea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c55c736ecea) - Patch
  VULN AFP-3486 AFP-3487 AFP-3488 AFP-3489

## 8.4.5

### Patch Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving bundle size.
- Updated dependencies

## 8.4.4

### Patch Changes

- Updated dependencies

## 8.4.3

### Patch Changes

- [#15981](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15981)
  [`2cf338dd802`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2cf338dd802) - Added
  homepage to package.json

## 8.4.2

### Patch Changes

- [#15632](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15632)
  [`34282240102`](https://bitbucket.org/atlassian/atlassian-frontend/commits/34282240102) - Adds
  explicit type to button usages components.

## 8.4.1

### Patch Changes

- [#15148](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15148)
  [`b9b3ab10494`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9b3ab10494) - There
  was a bug in 8.4.0 where the props in FormSection were not recognized. This has now been fixed.

## 8.4.0

### Minor Changes

- [#14319](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14319)
  [`4e3c853e85f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e3c853e85f) - This
  change removes the dependency `styled-components`. It has been refactored to use `@emotion/core`
  instead and entrypoints have been updated. Some examples have also been updated. There should be
  no UI or UX change.

### Patch Changes

- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - Internal
  changes to remove `@atlaskit/theme/math` usage.
- Updated dependencies

## 8.3.1

### Patch Changes

- Updated dependencies

## 8.3.0

### Minor Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302)
  [`4cab1a3d163`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4cab1a3d163) - Form is
  now instrumented with the new tokens theme implementation. This change is interoperable with the
  previous theme implementation.

### Patch Changes

- Updated dependencies

## 8.2.4

### Patch Changes

- [#12837](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12837)
  [`f701489305f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f701489305f) - Export
  Field directly for types to be exported explicitly.
- Updated dependencies

## 8.2.3

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 8.2.2

### Patch Changes

- [#8644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8644)
  [`c50a63f9f72`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c50a63f9f72) - Upgrade
  `@types/react-select` to `v3.1.2` and fix type breaks
- Updated dependencies

## 8.2.1

### Patch Changes

- [#8478](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8478)
  [`5af85edf960`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5af85edf960) - Internal
  code style change of default exports

## 8.2.0

### Minor Changes

- [#6930](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6930)
  [`fa4256f9b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa4256f9b0) - Add
  getState to FormProps for inspecting internal Form state (errors, values, et al)
- [`9552363cb7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9552363cb7) - [ux] Added
  a RangeField component to address issues surrounding Range having a different interface to other
  kinds of inputs. Use a RangeField instead of a Field when using a Range inside of a Form. You must
  provide a `defaultValue`.

## 8.1.7

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 8.1.6

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 8.1.5

### Patch Changes

- Updated dependencies

## 8.1.4

### Patch Changes

- [#4707](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4707)
  [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable
  integration tests for Edge browser

## 8.1.3

### Patch Changes

- [#4424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4424)
  [`741e4240d0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/741e4240d0) - Final form
  dependencies have been upgraded to their latest versions
- [`3773e0ad4e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3773e0ad4e) - There was
  an issue where the validate function in Field would return an incorrect value or even go
  unresponsive when mixing async and sync validators. This has been fixed by updating the version of
  `final-form`. The test that validates this is working has been re-enabled.
- Updated dependencies

## 8.1.2

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 8.1.1

### Patch Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823)
  [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the
  'lodash' package instead of single-function 'lodash.\*' packages
- [`e99262c6f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e99262c6f0) - All form
  elements now have a default font explicitly set

## 8.1.0

### Minor Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`694fee4dcc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/694fee4dcc) - Adding
  validating status to meta for async validations, and make sure the default value of error in form
  is a string

### Patch Changes

- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all
  the theme imports to be tree-shakable

## 8.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 7.4.1

### Patch Changes

- [#2763](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2763)
  [`2e4000e57b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e4000e57b) - Form now
  fully supports object and array field names.

## 7.4.0

### Minor Changes

- [#2443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2443)
  [`fc690a7dd4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc690a7dd4) -
  HelperMessage, ErrorMessage and ValidMessage now have an optional prop testId that will set the
  attribute value data-testid.

## 7.3.1

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 7.3.0

### Minor Changes

- [#2137](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2137)
  [`56d6259cf5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56d6259cf5) - Change
  FormHeader and FormSection to use h2 and h3 respectively for headings instead of h1 and h2.

### Patch Changes

- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove
  unused dependencies

## 7.2.2

### Patch Changes

- Updated dependencies

## 7.2.1

### Patch Changes

- [patch][0059d26429](https://bitbucket.org/atlassian/atlassian-frontend/commits/0059d26429):

  Change imports to comply with Atlassian conventions- Updated dependencies
  [62390c4755](https://bitbucket.org/atlassian/atlassian-frontend/commits/62390c4755):

- Updated dependencies
  [3940bd71f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/3940bd71f1):
- Updated dependencies
  [9e4b195732](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e4b195732):
- Updated dependencies
  [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies
  [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies
  [9a534d6a74](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a534d6a74):
- Updated dependencies
  [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies
  [a4acc95793](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4acc95793):
- Updated dependencies
  [68ff159118](https://bitbucket.org/atlassian/atlassian-frontend/commits/68ff159118):
- Updated dependencies
  [6efb12e06d](https://bitbucket.org/atlassian/atlassian-frontend/commits/6efb12e06d):
- Updated dependencies
  [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
- Updated dependencies
  [ca494abcd5](https://bitbucket.org/atlassian/atlassian-frontend/commits/ca494abcd5):
- Updated dependencies
  [7a2540821c](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a2540821c):
  - @atlaskit/calendar@9.2.7
  - @atlaskit/tooltip@15.2.6
  - @atlaskit/toggle@8.1.7
  - @atlaskit/button@13.3.11
  - @atlaskit/datetime-picker@9.4.0
  - @atlaskit/icon@20.1.1
  - @atlaskit/select@11.0.10
  - @atlaskit/modal-dialog@10.5.7
  - @atlaskit/droplist@10.0.4
  - @atlaskit/checkbox@10.1.11
  - @atlaskit/webdriver-runner@0.3.4
  - @atlaskit/dropdown-menu@9.0.3

## 7.2.0

### Minor Changes

- [minor][294c05bcdf](https://bitbucket.org/atlassian/atlassian-frontend/commits/294c05bcdf):

  Form now exposes a `setFieldValue` command which enables the ability to imperatively change field
  values. For example, if you have an input field whos value is concatinated to the next of the next
  input.

### Patch Changes

- Updated dependencies
  [4d3749c9e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d3749c9e6):
- Updated dependencies
  [dae900bf82](https://bitbucket.org/atlassian/atlassian-frontend/commits/dae900bf82):
- Updated dependencies
  [f0af33ead6](https://bitbucket.org/atlassian/atlassian-frontend/commits/f0af33ead6):
- Updated dependencies
  [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
  - @atlaskit/datetime-picker@9.2.9
  - @atlaskit/modal-dialog@10.5.5
  - @atlaskit/build-utils@2.6.4
  - @atlaskit/radio@3.2.0
  - @atlaskit/docs@8.5.0

## 7.1.5

### Patch Changes

- Updated dependencies
  [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [64fb94fb1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/64fb94fb1e):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [109c1a2c0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c1a2c0a):
- Updated dependencies
  [c57bb32f6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/c57bb32f6d):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/webdriver-runner@0.3.0
  - @atlaskit/field-radio-group@7.0.2
  - @atlaskit/field-range@8.0.2
  - @atlaskit/button@13.3.9
  - @atlaskit/calendar@9.2.6
  - @atlaskit/checkbox@10.1.10
  - @atlaskit/datetime-picker@9.2.8
  - @atlaskit/dropdown-menu@9.0.2
  - @atlaskit/droplist@10.0.3
  - @atlaskit/modal-dialog@10.5.4
  - @atlaskit/radio@3.1.11
  - @atlaskit/section-message@4.1.7
  - @atlaskit/select@11.0.9
  - @atlaskit/textarea@2.2.6
  - @atlaskit/textfield@3.1.9
  - @atlaskit/toggle@8.1.6
  - @atlaskit/tooltip@15.2.5

## 7.1.4

### Patch Changes

- Updated dependencies
  [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/button@13.3.8
  - @atlaskit/calendar@9.2.5
  - @atlaskit/checkbox@10.1.9
  - @atlaskit/datetime-picker@9.2.7
  - @atlaskit/dropdown-menu@9.0.1
  - @atlaskit/droplist@10.0.2
  - @atlaskit/modal-dialog@10.5.3
  - @atlaskit/radio@3.1.10
  - @atlaskit/section-message@4.1.6
  - @atlaskit/select@11.0.8
  - @atlaskit/textarea@2.2.5
  - @atlaskit/textfield@3.1.8
  - @atlaskit/toggle@8.1.5
  - @atlaskit/tooltip@15.2.4

## 7.1.3

### Patch Changes

- [patch][eaad41d56c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eaad41d56c):

  Fixes form typing to a form event - widens the type to allow no event to be passed.-
  [patch][c12ba5eb3e](https://bitbucket.org/atlassian/atlassian-frontend/commits/c12ba5eb3e):

  Fixed an ambigous type definition for FormApi- Updated dependencies
  [116cb9b00f](https://bitbucket.org/atlassian/atlassian-frontend/commits/116cb9b00f):

- Updated dependencies
  [9e87af4685](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e87af4685):
- Updated dependencies
  [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
- Updated dependencies
  [91a1eb05db](https://bitbucket.org/atlassian/atlassian-frontend/commits/91a1eb05db):
- Updated dependencies
  [c1992227dc](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1992227dc):
  - @atlaskit/datetime-picker@9.2.6
  - @atlaskit/dropdown-menu@9.0.0
  - @atlaskit/icon@20.0.2
  - @atlaskit/textfield@3.1.7
  - @atlaskit/checkbox@10.1.8

## 7.1.2

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):
  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/button@13.3.7
  - @atlaskit/calendar@9.2.4
  - @atlaskit/checkbox@10.1.7
  - @atlaskit/datetime-picker@9.2.5
  - @atlaskit/dropdown-menu@8.2.4
  - @atlaskit/droplist@10.0.1
  - @atlaskit/field-radio-group@7.0.1
  - @atlaskit/field-range@8.0.1
  - @atlaskit/icon@20.0.1
  - @atlaskit/modal-dialog@10.5.2
  - @atlaskit/multi-select@14.0.1
  - @atlaskit/radio@3.1.9
  - @atlaskit/section-message@4.1.5
  - @atlaskit/select@11.0.7
  - @atlaskit/single-select@9.0.1
  - @atlaskit/textarea@2.2.4
  - @atlaskit/textfield@3.1.6
  - @atlaskit/theme@9.5.1
  - @atlaskit/toggle@8.1.4
  - @atlaskit/tooltip@15.2.3

## 7.1.1

### Patch Changes

- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/droplist@10.0.0
  - @atlaskit/field-radio-group@7.0.0
  - @atlaskit/field-range@8.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/multi-select@14.0.0
  - @atlaskit/single-select@9.0.0
  - @atlaskit/dropdown-menu@8.2.3
  - @atlaskit/datetime-picker@9.2.4
  - @atlaskit/modal-dialog@10.5.1
  - @atlaskit/section-message@4.1.4
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/calendar@9.2.3
  - @atlaskit/checkbox@10.1.6
  - @atlaskit/radio@3.1.8
  - @atlaskit/select@11.0.6
  - @atlaskit/textfield@3.1.5
  - @atlaskit/tooltip@15.2.2

## 7.1.0

### Minor Changes

- [minor][ff32b3db47](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff32b3db47):

  Adds the ability to reset a form to it's default state. This is useful for cases where a user
  might want to manually clear their information.

### Patch Changes

- Updated dependencies
  [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
  - @atlaskit/docs@8.3.0

## 7.0.1

### Patch Changes

- [patch][ec76622d34](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec76622d34):

  Adds missing type definition for name to fieldProps, which are passed down to children components-
  [patch][d93de8e56e](https://bitbucket.org/atlassian/atlassian-frontend/commits/d93de8e56e):

  Fix clearing for Selects. Fix defaultValue for non-primitive values.- Updated dependencies
  [e20d7996ca](https://bitbucket.org/atlassian/atlassian-frontend/commits/e20d7996ca):

- Updated dependencies
  [6e55ab88df](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e55ab88df):
  - @atlaskit/radio@3.1.7
  - @atlaskit/select@11.0.5

## 7.0.0

### Major Changes

- [major][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Form has been converted to Typescript. TypeScript consumers will now get static type safety. Flow
  types are no longer provided. No API changes.

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Fix internal use of `props.name` property which could cause the internal fieldId to be incorrectly
  set- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/tooltip@15.2.0
  - @atlaskit/select@11.0.3
  - @atlaskit/checkbox@10.1.4
  - @atlaskit/field-text-area@6.0.15
  - @atlaskit/field-text@9.0.14
  - @atlaskit/modal-dialog@10.5.0
  - @atlaskit/radio@3.1.5
  - @atlaskit/textfield@3.1.4
  - @atlaskit/textarea@2.2.3
  - @atlaskit/datetime-picker@9.2.3

## 6.3.2

- Updated dependencies
  [30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):
  - @atlaskit/calendar@9.2.1
  - @atlaskit/modal-dialog@10.3.6
  - @atlaskit/select@11.0.0
  - @atlaskit/button@13.3.4
  - @atlaskit/datetime-picker@9.2.1

## 6.3.1

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 6.3.0

### Minor Changes

- [minor][32c55df1d2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/32c55df1d2):

  Add align prop for FormFooter

## 6.2.5

- Updated dependencies
  [d1444cc6ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d1444cc6ef):
  - @atlaskit/datetime-picker@9.0.0

## 6.2.4

- Updated dependencies
  [8c725d46ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c725d46ec):
  - @atlaskit/datetime-picker@8.1.1
  - @atlaskit/calendar@9.0.0

## 6.2.3

- Updated dependencies
  [97bab7fd28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97bab7fd28):
  - @atlaskit/button@13.3.1
  - @atlaskit/modal-dialog@10.3.1
  - @atlaskit/radio@3.0.18
  - @atlaskit/select@10.1.1
  - @atlaskit/checkbox@10.0.0
  - @atlaskit/docs@8.1.7

## 6.2.2

### Patch Changes

- [patch][2deee10c17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2deee10c17):

  Bugfix - DS-6661 - The componentWillUnmount method is not overridden properly in Form component as
  it has been misspelled as 'componenWillUnmount'.

## 6.2.1

### Patch Changes

- [patch][5ccdfaeef2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ccdfaeef2):

  Fixes bug where onSubmit function in Form may not be called if reference changes

## 6.2.0

### Minor Changes

- [minor][1f2c548ffa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1f2c548ffa):

  Fixes an issue where Select inside a Form would not be clearable

## 6.1.12

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 6.1.11

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 6.1.10

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 6.1.9

### Patch Changes

- [patch][abee1a5f4f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abee1a5f4f):

  Bumping internal dependency (memoize-one) to latest version (5.1.0). memoize-one@5.1.0 has full
  typescript support so it is recommended that typescript consumers use it also.

## 6.1.8

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 6.1.7

- Updated dependencies
  [84887b940c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84887b940c):
  - @atlaskit/icon@19.0.2
  - @atlaskit/modal-dialog@10.1.2
  - @atlaskit/textfield@3.0.0

## 6.1.6

### Patch Changes

- [patch][d905cbc0ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d905cbc0ac):

  Adding a condition to check if the component are referenced in tests running in CI. It reduces the
  noise and help reading the CI log.

## 6.1.5

- Updated dependencies
  [7e9d653278](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e9d653278):
  - @atlaskit/toggle@8.0.0

## 6.1.4

- Updated dependencies
  [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
  - @atlaskit/button@13.0.11
  - @atlaskit/datetime-picker@8.0.9
  - @atlaskit/modal-dialog@10.0.10
  - @atlaskit/select@10.0.0

## 6.1.3

- Updated dependencies
  [19d9d0f13f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/19d9d0f13f):
  - @atlaskit/datetime-picker@8.0.8

## 6.1.2

- Updated dependencies
  [87a2638655](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87a2638655):
  - @atlaskit/button@13.0.10
  - @atlaskit/modal-dialog@10.0.8
  - @atlaskit/radio@3.0.7
  - @atlaskit/select@9.1.10
  - @atlaskit/checkbox@9.0.0

## 6.1.1

- Updated dependencies
  [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/calendar@8.0.3
  - @atlaskit/checkbox@8.0.5
  - @atlaskit/datetime-picker@8.0.7
  - @atlaskit/dropdown-menu@8.0.8
  - @atlaskit/droplist@9.0.8
  - @atlaskit/field-radio-group@6.0.4
  - @atlaskit/modal-dialog@10.0.7
  - @atlaskit/multi-select@13.0.7
  - @atlaskit/radio@3.0.6
  - @atlaskit/section-message@4.0.5
  - @atlaskit/select@9.1.8
  - @atlaskit/single-select@8.0.6
  - @atlaskit/textfield@2.0.3
  - @atlaskit/toggle@7.0.3
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/icon@19.0.0

## 6.1.0

### Minor Changes

- [minor][7bbf303d01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7bbf303d01):
  - Improved form validation user experience when field validation and submission validation used
    together on the same field
  - Improved form validation docs

## 6.0.7

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 6.0.6

- Updated dependencies
  [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/dropdown-menu@8.0.5
  - @atlaskit/droplist@9.0.5
  - @atlaskit/icon@18.0.1
  - @atlaskit/select@9.1.6
  - @atlaskit/tooltip@15.0.0

## 6.0.5

- Updated dependencies
  [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/calendar@8.0.1
  - @atlaskit/checkbox@8.0.2
  - @atlaskit/datetime-picker@8.0.5
  - @atlaskit/dropdown-menu@8.0.4
  - @atlaskit/droplist@9.0.4
  - @atlaskit/field-radio-group@6.0.2
  - @atlaskit/modal-dialog@10.0.4
  - @atlaskit/multi-select@13.0.5
  - @atlaskit/radio@3.0.3
  - @atlaskit/section-message@4.0.2
  - @atlaskit/select@9.1.5
  - @atlaskit/single-select@8.0.4
  - @atlaskit/textfield@2.0.1
  - @atlaskit/toggle@7.0.1
  - @atlaskit/tooltip@14.0.3
  - @atlaskit/field-range@7.0.4
  - @atlaskit/icon@18.0.0

## 6.0.4

- Updated dependencies
  [70862830d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70862830d6):
  - @atlaskit/button@13.0.6
  - @atlaskit/modal-dialog@10.0.2
  - @atlaskit/radio@3.0.2
  - @atlaskit/select@9.1.4
  - @atlaskit/checkbox@8.0.0
  - @atlaskit/icon@17.2.0
  - @atlaskit/theme@9.1.0

## 6.0.3

- Updated dependencies
  [06c5cccf9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c5cccf9d):
- Updated dependencies
  [1da5351f72](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1da5351f72):
  - @atlaskit/datetime-picker@8.0.3
  - @atlaskit/icon@17.1.2
  - @atlaskit/select@9.1.2
  - @atlaskit/modal-dialog@10.0.0
  - @atlaskit/radio@3.0.0

## 6.0.2

- Updated dependencies
  [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/checkbox@7.0.1
  - @atlaskit/field-radio-group@6.0.1
  - @atlaskit/field-range@7.0.1
  - @atlaskit/field-text@9.0.1
  - @atlaskit/field-text-area@6.0.1
  - @atlaskit/icon@17.1.1
  - @atlaskit/multi-select@13.0.2
  - @atlaskit/single-select@8.0.1
  - @atlaskit/theme@9.0.2
  - @atlaskit/section-message@4.0.0

## 6.0.1

- [patch][19bbcb44ed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/19bbcb44ed):
  - Upgrade final-form dependency. No behavioural or API changes.

## 6.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 5.2.10

- Updated dependencies
  [dd95622388](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd95622388):
- Updated dependencies
  [6cdf11238d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6cdf11238d):
  - @atlaskit/textarea@1.0.0
  - @atlaskit/modal-dialog@8.0.9
  - @atlaskit/textfield@1.0.0

## 5.2.9

- Updated dependencies
  [6c4e41ff36](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c4e41ff36):
  - @atlaskit/radio@1.0.0

## 5.2.8

- [patch][cb7ec50eca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cb7ec50eca):
  - Internal changes only. Form is compatible with SSR.

## 5.2.7

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/calendar@7.0.22
  - @atlaskit/checkbox@6.0.4
  - @atlaskit/datetime-picker@7.0.4
  - @atlaskit/dropdown-menu@7.0.6
  - @atlaskit/droplist@8.0.5
  - @atlaskit/field-radio-group@5.0.3
  - @atlaskit/field-range@6.0.4
  - @atlaskit/field-text@8.0.3
  - @atlaskit/field-text-area@5.0.4
  - @atlaskit/icon@16.0.9
  - @atlaskit/modal-dialog@8.0.7
  - @atlaskit/multi-select@12.0.3
  - @atlaskit/radio@0.5.3
  - @atlaskit/section-message@2.0.3
  - @atlaskit/select@8.1.1
  - @atlaskit/single-select@7.0.3
  - @atlaskit/textarea@0.4.4
  - @atlaskit/textfield@0.4.4
  - @atlaskit/toggle@6.0.4
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/theme@8.1.7

## 5.2.6

- [patch][9b0bdd73c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b0bdd73c2):
  - Remove unused inline edit dependency from package

## 5.2.5

- Updated dependencies
  [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/calendar@7.0.21
  - @atlaskit/checkbox@6.0.3
  - @atlaskit/datetime-picker@7.0.3
  - @atlaskit/dropdown-menu@7.0.4
  - @atlaskit/droplist@8.0.3
  - @atlaskit/field-radio-group@5.0.2
  - @atlaskit/field-text@8.0.2
  - @atlaskit/field-text-area@5.0.3
  - @atlaskit/icon@16.0.8
  - @atlaskit/inline-edit@8.0.2
  - @atlaskit/modal-dialog@8.0.6
  - @atlaskit/multi-select@12.0.2
  - @atlaskit/radio@0.5.2
  - @atlaskit/section-message@2.0.2
  - @atlaskit/select@8.0.5
  - @atlaskit/single-select@7.0.2
  - @atlaskit/textarea@0.4.1
  - @atlaskit/textfield@0.4.3
  - @atlaskit/theme@8.1.6
  - @atlaskit/toggle@6.0.3
  - @atlaskit/tooltip@13.0.3
  - @atlaskit/field-range@6.0.3
  - @atlaskit/button@12.0.0

## 5.2.4

- Updated dependencies
  [f504850fe2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f504850fe2):
  - @atlaskit/textarea@0.4.0

## 5.2.3

- Updated dependencies
  [8eff47cacb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8eff47cacb):
  - @atlaskit/modal-dialog@8.0.3
  - @atlaskit/textfield@0.4.0

## 5.2.2

- [patch][a1217df379](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1217df379):
  - Internal changes only. Form is now compatible with ssr.

## 5.2.1

- Updated dependencies
  [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/calendar@7.0.20
  - @atlaskit/checkbox@6.0.1
  - @atlaskit/datetime-picker@7.0.1
  - @atlaskit/dropdown-menu@7.0.1
  - @atlaskit/droplist@8.0.1
  - @atlaskit/field-radio-group@5.0.1
  - @atlaskit/field-text@8.0.1
  - @atlaskit/field-text-area@5.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/inline-edit@8.0.1
  - @atlaskit/modal-dialog@8.0.2
  - @atlaskit/multi-select@12.0.1
  - @atlaskit/radio@0.5.1
  - @atlaskit/section-message@2.0.1
  - @atlaskit/select@8.0.3
  - @atlaskit/single-select@7.0.1
  - @atlaskit/textfield@0.3.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/toggle@6.0.1
  - @atlaskit/tooltip@13.0.1
  - @atlaskit/field-range@6.0.1
  - @atlaskit/button@11.0.0
  - @atlaskit/textarea@0.3.0

## 5.2.0

- [minor][fe7683f9d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fe7683f9d6):
  - Feature: Submit form on Cmd + Enter on Mac and Ctrl + Enter on Mac and Windows

## 5.1.8

- [patch][76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - Drop ES5 from all the flow modules

  ### Dropping CJS support in all @atlaskit packages

  As a breaking change, all @atlaskit packages will be dropping cjs distributions and will only
  distribute esm. This means all distributed code will be transpiled, but will still contain
  `import` and `export` declarations.

  The major reason for doing this is to allow us to support multiple entry points in packages, e.g:

  ```js
  import colors from `@atlaskit/theme/colors`;
  ```

  Previously this was sort of possible for consumers by doing something like:

  ```js
  import colors from `@atlaskit/theme/dist/esm/colors`;
  ```

  This has a couple of issues. 1, it treats the file system as API making internal refactors harder,
  we have to worry about how consumers might be using things that aren't _actually_ supposed to be
  used. 2. We are unable to do this _internally_ in @atlaskit packages. This leads to lots of
  packages bundling all of theme, just to use a single color, especially in situations where tree
  shaking fails.

  To support being able to use multiple entrypoints internally, we unfortunately cannot have
  multiple distributions as they would need to have very different imports from of their own
  internal dependencies.

  ES Modules are widely supported by all modern bundlers and can be worked around in node
  environments.

  We may choose to revisit this solution in the future if we find any unintended condequences, but
  we see this as a pretty sane path forward which should lead to some major bundle size decreases,
  saner API's and simpler package architecture.

  Please reach out to #fabric-build (if in Atlassian) or create an issue in
  [Design System Support](https://ecosystem.atlassian.net/secure/CreateIssue.jspa?pid=24670) (for
  external) if you have any questions or queries about this.

## 5.1.7

- Updated dependencies
  [e9b824bf86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e9b824bf86):
  - @atlaskit/modal-dialog@7.2.4
  - @atlaskit/textfield@0.2.0

## 5.1.6

- [patch][887c85ffdc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/887c85ffdc):
  - Form now provides a `getValues` function to it's child render function. The `getValues` function
    returns an object containing the current value of all fields.

## 5.1.5

- Updated dependencies
  [06713e0a0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06713e0a0c):
  - @atlaskit/datetime-picker@6.5.1
  - @atlaskit/modal-dialog@7.2.3
  - @atlaskit/select@7.0.0

## 5.1.4

- [patch][0c0f20c9cf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c0f20c9cf):
  - Fix typo in Field.js

## 5.1.3

- [patch][a360a3d2b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a360a3d2b6):
  - Bugfix: field entry in form state gets deleted when Field is unmounted
  - Bugfix: Shallow equal check in Field works correctly across different types

## 5.1.2

- Updated dependencies
  [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/calendar@7.0.17
  - @atlaskit/checkbox@5.0.11
  - @atlaskit/datetime-picker@6.3.25
  - @atlaskit/dropdown-menu@6.1.26
  - @atlaskit/droplist@7.0.18
  - @atlaskit/field-radio-group@4.0.15
  - @atlaskit/inline-edit@7.1.8
  - @atlaskit/modal-dialog@7.2.1
  - @atlaskit/multi-select@11.0.14
  - @atlaskit/radio@0.4.6
  - @atlaskit/section-message@1.0.16
  - @atlaskit/select@6.1.19
  - @atlaskit/single-select@6.0.12
  - @atlaskit/toggle@5.0.15
  - @atlaskit/tooltip@12.1.15
  - @atlaskit/field-range@5.0.14
  - @atlaskit/icon@16.0.0

## 5.1.1

- [patch][58e7bc1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58e7bc1):
  - Added example of Form use within a ModalDialog - no changes required

## 5.1.0

- [minor][b36a82f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b36a82f):
  - **feature:** Uses context to automatically assosiate a message to field. No upgrade changes
    required. Can remove fieldId prop on Message components if you are using that prop currently.

## 5.0.0

- [major][647a46f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/647a46f):
  - **Breaking:** this version is a major overhaul of the package.
    - **Conceptual changes:** The `Form` component must be the source of truth for the form state.
      This means you keep track of far less state in your application.
    - **API changes:** `Form`, `Field` and `CheckboxField` components use render props. This was
      done to maximise the flexiblity of the what can be rendered inside `Form` or `Field`s.
    - **Accessibility:** Creating accessible forms is easier than ever with this release. It is
      straight forward to link validation messages or helper text with a field. See the examples for
      details.

## 4.0.21

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/button@10.1.1
  - @atlaskit/calendar@7.0.16
  - @atlaskit/checkbox@5.0.9
  - @atlaskit/datetime-picker@6.3.21
  - @atlaskit/dropdown-menu@6.1.25
  - @atlaskit/droplist@7.0.17
  - @atlaskit/field-radio-group@4.0.14
  - @atlaskit/field-range@5.0.12
  - @atlaskit/field-text@7.0.18
  - @atlaskit/field-text-area@4.0.14
  - @atlaskit/icon@15.0.2
  - @atlaskit/inline-edit@7.1.7
  - @atlaskit/modal-dialog@7.1.1
  - @atlaskit/multi-select@11.0.13
  - @atlaskit/radio@0.4.4
  - @atlaskit/section-message@1.0.14
  - @atlaskit/select@6.1.13
  - @atlaskit/single-select@6.0.11
  - @atlaskit/theme@7.0.1
  - @atlaskit/toggle@5.0.14
  - @atlaskit/tooltip@12.1.13
  - @atlaskit/docs@6.0.0

## 4.0.20

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/calendar@7.0.15
  - @atlaskit/checkbox@5.0.8
  - @atlaskit/datetime-picker@6.3.20
  - @atlaskit/dropdown-menu@6.1.24
  - @atlaskit/droplist@7.0.16
  - @atlaskit/field-radio-group@4.0.13
  - @atlaskit/field-range@5.0.11
  - @atlaskit/field-text@7.0.16
  - @atlaskit/field-text-area@4.0.13
  - @atlaskit/icon@15.0.1
  - @atlaskit/inline-edit@7.1.6
  - @atlaskit/modal-dialog@7.0.14
  - @atlaskit/multi-select@11.0.12
  - @atlaskit/radio@0.4.3
  - @atlaskit/section-message@1.0.13
  - @atlaskit/select@6.1.10
  - @atlaskit/single-select@6.0.10
  - @atlaskit/toggle@5.0.13
  - @atlaskit/tooltip@12.1.12
  - @atlaskit/theme@7.0.0

## 4.0.19

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/calendar@7.0.14
  - @atlaskit/checkbox@5.0.7
  - @atlaskit/datetime-picker@6.3.19
  - @atlaskit/dropdown-menu@6.1.23
  - @atlaskit/droplist@7.0.14
  - @atlaskit/field-radio-group@4.0.12
  - @atlaskit/inline-edit@7.1.5
  - @atlaskit/modal-dialog@7.0.13
  - @atlaskit/multi-select@11.0.11
  - @atlaskit/radio@0.4.2
  - @atlaskit/section-message@1.0.12
  - @atlaskit/select@6.1.9
  - @atlaskit/single-select@6.0.9
  - @atlaskit/toggle@5.0.12
  - @atlaskit/tooltip@12.1.11
  - @atlaskit/icon@15.0.0

## 4.0.18

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/calendar@7.0.13
  - @atlaskit/checkbox@5.0.6
  - @atlaskit/datetime-picker@6.3.18
  - @atlaskit/dropdown-menu@6.1.22
  - @atlaskit/droplist@7.0.13
  - @atlaskit/field-radio-group@4.0.11
  - @atlaskit/field-text@7.0.15
  - @atlaskit/field-text-area@4.0.12
  - @atlaskit/icon@14.6.1
  - @atlaskit/inline-edit@7.1.4
  - @atlaskit/modal-dialog@7.0.12
  - @atlaskit/multi-select@11.0.10
  - @atlaskit/radio@0.4.1
  - @atlaskit/section-message@1.0.11
  - @atlaskit/select@6.1.8
  - @atlaskit/single-select@6.0.8
  - @atlaskit/theme@6.2.1
  - @atlaskit/toggle@5.0.11
  - @atlaskit/tooltip@12.1.10
  - @atlaskit/field-range@5.0.9
  - @atlaskit/button@10.0.0

## 4.0.17

- Updated dependencies [b42680b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b42680b):
  - @atlaskit/radio@0.4.0

## 4.0.16

- Updated dependencies [8199088](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8199088):
  - @atlaskit/radio@0.3.0

## 4.0.15

- [patch][e6d3f57](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6d3f57):
  - Check that content children of FormSection are valid elements before cloning

## 4.0.14

- [patch][c8d935f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8d935f" d):
  - Fixing form header styles

## 4.0.13

- [patch] Fixed rendering of FieldGroup legends
  [af05f8e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af05f8e)

## 4.0.12

- [patch] Adds missing implicit @babel/runtime dependency
  [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 4.0.11

- [patch] Empty form headings and sections no longer result in extra spacing
  [ac537db](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ac537db)

## 4.0.10

- [patch] Updated dependencies
  [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/calendar@7.0.9
  - @atlaskit/checkbox@5.0.2
  - @atlaskit/datetime-picker@6.3.11
  - @atlaskit/dropdown-menu@6.1.17
  - @atlaskit/droplist@7.0.10
  - @atlaskit/field-radio-group@4.0.8
  - @atlaskit/inline-edit@7.1.1
  - @atlaskit/modal-dialog@7.0.2
  - @atlaskit/multi-select@11.0.7
  - @atlaskit/section-message@1.0.8
  - @atlaskit/select@6.0.2
  - @atlaskit/single-select@6.0.6
  - @atlaskit/toggle@5.0.9
  - @atlaskit/tooltip@12.1.1
  - @atlaskit/icon@14.0.0

## 4.0.9

- [patch] Updated dependencies
  [4194aa4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4194aa4)
  - @atlaskit/datetime-picker@6.3.10
  - @atlaskit/select@6.0.0

## 4.0.8

- [patch] Pulling the shared styles from @atlaskit/theme and removed dependency on
  util-shraed-styles [7d51a09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d51a09)

## 4.0.7

- [patch] Deprecates field-radio-group from form components. Adds @atlaskit/radio to field
  components [dcdb61b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dcdb61b)

## 4.0.6

- [patch] Fix isRequired applied to all fields
  [cb73e27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cb73e27)

## 4.0.5

- [patch] Updated dependencies
  [80e1925](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80e1925)
  - @atlaskit/button@9.0.9
  - @atlaskit/modal-dialog@7.0.1
  - @atlaskit/select@5.0.18
  - @atlaskit/checkbox@5.0.0

## 4.0.4

- [patch] Form validate now correctly returns fieldState & checks isRequired
  [87cea82](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87cea82)

## 4.0.3

- [patch] Updated dependencies
  [d5a043a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5a043a)
  - @atlaskit/datetime-picker@6.3.7
  - @atlaskit/icon@13.8.1
  - @atlaskit/select@5.0.17
  - @atlaskit/tooltip@12.0.14
  - @atlaskit/modal-dialog@7.0.0

## 4.0.2

- [patch] Updated dependencies
  [9c66d4d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c66d4d)
  - @atlaskit/datetime-picker@6.3.6
  - @atlaskit/select@5.0.16
  - @atlaskit/webdriver-runner@0.1.0

## 4.0.1

- [patch] Adds sideEffects: false to allow proper tree shaking
  [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 4.0.0

- [major] Removed required prop, consolidated the logic into the isRequired prop.
  [d8d8107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d8d8107)

## 3.1.8

- [patch] Fix Form submit handlers being called when no onSubmit prop is passed
  [1086a6b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1086a6b)

## 3.1.6

- [patch] Updated dependencies
  [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/tooltip@12.0.9
  - @atlaskit/toggle@5.0.6
  - @atlaskit/single-select@6.0.4
  - @atlaskit/select@5.0.9
  - @atlaskit/section-message@1.0.5
  - @atlaskit/multi-select@11.0.5
  - @atlaskit/modal-dialog@6.0.9
  - @atlaskit/inline-edit@7.0.6
  - @atlaskit/icon@13.2.5
  - @atlaskit/field-text-area@4.0.6
  - @atlaskit/field-text@7.0.6
  - @atlaskit/field-range@5.0.4
  - @atlaskit/field-radio-group@4.0.5
  - @atlaskit/droplist@7.0.7
  - @atlaskit/dropdown-menu@6.1.8
  - @atlaskit/datetime-picker@6.3.2
  - @atlaskit/checkbox@4.0.4
  - @atlaskit/calendar@7.0.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 3.1.5

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions
  read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/tooltip@12.0.5
  - @atlaskit/select@5.0.8
  - @atlaskit/modal-dialog@6.0.6
  - @atlaskit/multi-select@11.0.4
  - @atlaskit/inline-edit@7.0.4
  - @atlaskit/field-text-area@4.0.4
  - @atlaskit/field-text@7.0.4
  - @atlaskit/toggle@5.0.5
  - @atlaskit/checkbox@4.0.3
  - @atlaskit/calendar@7.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/field-range@5.0.3
  - @atlaskit/section-message@1.0.4
  - @atlaskit/field-radio-group@4.0.4
  - @atlaskit/datetime-picker@6.1.1
  - @atlaskit/icon@13.2.4
  - @atlaskit/droplist@7.0.5
  - @atlaskit/dropdown-menu@6.1.5

## 3.1.4

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/select@5.0.7
  - @atlaskit/tooltip@12.0.4
  - @atlaskit/icon@13.2.2
  - @atlaskit/toggle@5.0.4
  - @atlaskit/single-select@6.0.3
  - @atlaskit/section-message@1.0.3
  - @atlaskit/multi-select@11.0.3
  - @atlaskit/inline-edit@7.0.3
  - @atlaskit/field-radio-group@4.0.3
  - @atlaskit/checkbox@4.0.2
  - @atlaskit/calendar@7.0.3
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/field-range@5.0.2
  - @atlaskit/field-text-area@4.0.3
  - @atlaskit/field-text@7.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/droplist@7.0.4
  - @atlaskit/dropdown-menu@6.1.4
  - @atlaskit/modal-dialog@6.0.5
  - @atlaskit/datetime-picker@6.0.3

## 3.1.3

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/tooltip@12.0.3
  - @atlaskit/select@5.0.6
  - @atlaskit/modal-dialog@6.0.4
  - @atlaskit/inline-edit@7.0.2
  - @atlaskit/field-text-area@4.0.2
  - @atlaskit/field-text@7.0.2
  - @atlaskit/toggle@5.0.3
  - @atlaskit/checkbox@4.0.1
  - @atlaskit/calendar@7.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/field-range@5.0.1
  - @atlaskit/section-message@1.0.2
  - @atlaskit/field-radio-group@4.0.2
  - @atlaskit/datetime-picker@6.0.2
  - @atlaskit/icon@13.2.1
  - @atlaskit/droplist@7.0.3
  - @atlaskit/dropdown-menu@6.1.3

## 3.1.2

- [patch] Removed incorrect min-height for forms. Fixed select dev dep range for form.
  [186a2ee](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/186a2ee)
- [none] Updated dependencies
  [186a2ee](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/186a2ee)
  - @atlaskit/select@5.0.5

## 3.1.1

- [patch] Update docs, change dev deps
  [25d6e48](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d6e48)
- [none] Updated dependencies
  [25d6e48](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d6e48)
  - @atlaskit/single-select@6.0.2
  - @atlaskit/select@5.0.4
  - @atlaskit/multi-select@11.0.2

## 3.1.0

- [minor] Improvements & fixes for Form validation & state management
  [e33f19d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e33f19d)
- [minor] Updated dependencies
  [e33f19d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e33f19d)
  - @atlaskit/select@5.0.3

## 3.0.1

- [patch] Updated dependencies
  [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/tooltip@12.0.0
  - @atlaskit/select@5.0.1
  - @atlaskit/icon@13.1.1
  - @atlaskit/droplist@7.0.1
  - @atlaskit/dropdown-menu@6.1.1

## 3.0.0

- [major] Updates to React ^16.4.0
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/select@5.0.0
  - @atlaskit/modal-dialog@6.0.0
  - @atlaskit/single-select@6.0.0
  - @atlaskit/multi-select@11.0.0
  - @atlaskit/inline-edit@7.0.0
  - @atlaskit/field-text-area@4.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/toggle@5.0.0
  - @atlaskit/checkbox@4.0.0
  - @atlaskit/calendar@7.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/field-range@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/field-radio-group@4.0.0
  - @atlaskit/datetime-picker@6.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/droplist@7.0.0
  - @atlaskit/dropdown-menu@6.0.0
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/select@5.0.0
  - @atlaskit/modal-dialog@6.0.0
  - @atlaskit/single-select@6.0.0
  - @atlaskit/multi-select@11.0.0
  - @atlaskit/inline-edit@7.0.0
  - @atlaskit/field-text-area@4.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/toggle@5.0.0
  - @atlaskit/checkbox@4.0.0
  - @atlaskit/calendar@7.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/field-range@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/field-radio-group@4.0.0
  - @atlaskit/datetime-picker@6.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/droplist@7.0.0
  - @atlaskit/dropdown-menu@6.0.0

## 2.1.5

- [patch] fix styled-components syntax error
  [60c715f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60c715f)
- [none] Updated dependencies
  [60c715f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60c715f)
  - @atlaskit/select@4.3.5

## 2.1.4

- [patch] Fix Field validator error on empty strings
  [470a1fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/470a1fb)
- [patch] Updated dependencies
  [470a1fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/470a1fb)
  - @atlaskit/select@4.3.2

## 2.1.3

- [patch] Fix \$FlowFixMe and release packages
  [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [none] Updated dependencies
  [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/tooltip@10.3.1
  - @atlaskit/select@4.3.1
  - @atlaskit/modal-dialog@5.2.5
  - @atlaskit/single-select@5.2.1
  - @atlaskit/multi-select@10.2.1
  - @atlaskit/field-text-area@3.1.2
  - @atlaskit/button@8.2.2
  - @atlaskit/checkbox@3.1.2
  - @atlaskit/calendar@6.1.3
  - @atlaskit/field-radio-group@3.1.2
  - @atlaskit/icon@12.3.1

## 2.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/tooltip@10.2.1
  - @atlaskit/select@4.2.3
  - @atlaskit/modal-dialog@5.2.2
  - @atlaskit/single-select@5.1.2
  - @atlaskit/multi-select@10.1.2
  - @atlaskit/inline-edit@6.1.3
  - @atlaskit/field-text-area@3.1.1
  - @atlaskit/field-text@6.0.4
  - @atlaskit/button@8.1.2
  - @atlaskit/toggle@4.0.3
  - @atlaskit/theme@4.0.4
  - @atlaskit/field-range@4.0.3
  - @atlaskit/checkbox@3.0.6
  - @atlaskit/calendar@6.1.2
  - @atlaskit/field-radio-group@3.0.4
  - @atlaskit/datetime-picker@5.2.1
  - @atlaskit/icon@12.1.2
  - @atlaskit/droplist@6.1.2
  - @atlaskit/dropdown-menu@5.0.4

## 2.1.1

- [patch] Update changelogs to remove duplicate
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/single-select@5.1.1
  - @atlaskit/select@4.2.1
  - @atlaskit/multi-select@10.1.1
  - @atlaskit/modal-dialog@5.1.1
  - @atlaskit/inline-edit@6.1.2
  - @atlaskit/icon@12.1.1
  - @atlaskit/field-radio-group@3.0.3
  - @atlaskit/droplist@6.1.1
  - @atlaskit/dropdown-menu@5.0.3
  - @atlaskit/checkbox@3.0.5
  - @atlaskit/calendar@6.1.1
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1

## 2.1.0

- [none] Updated dependencies
  [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/single-select@5.1.0
  - @atlaskit/modal-dialog@5.1.0
  - @atlaskit/select@4.2.0
  - @atlaskit/tooltip@10.2.0
  - @atlaskit/dropdown-menu@5.0.2
  - @atlaskit/inline-edit@6.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/toggle@4.0.2
  - @atlaskit/field-radio-group@3.0.2
  - @atlaskit/checkbox@3.0.4
  - @atlaskit/calendar@6.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/field-text-area@3.0.3
  - @atlaskit/field-text@6.0.2
  - @atlaskit/field-range@4.0.2
  - @atlaskit/datetime-picker@5.2.0
  - @atlaskit/multi-select@10.1.0
  - @atlaskit/droplist@6.1.0
  - @atlaskit/button@8.1.0

## 2.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies
  [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/tooltip@10.0.1
  - @atlaskit/modal-dialog@5.0.1
  - @atlaskit/select@4.0.1
  - @atlaskit/datetime-picker@5.0.1
  - @atlaskit/icon@12.0.1
  - @atlaskit/toggle@4.0.1
  - @atlaskit/inline-edit@6.0.1
  - @atlaskit/field-radio-group@3.0.1
  - @atlaskit/field-text-area@3.0.1
  - @atlaskit/field-text@6.0.1
  - @atlaskit/checkbox@3.0.1
  - @atlaskit/calendar@6.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/field-range@4.0.1
  - @atlaskit/docs@4.0.1
  - @atlaskit/droplist@6.0.1
  - @atlaskit/dropdown-menu@5.0.1

## 2.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to
  ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies
  [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/tooltip@10.0.0
  - @atlaskit/modal-dialog@5.0.0
  - @atlaskit/select@4.0.0
  - @atlaskit/datetime-picker@5.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/toggle@4.0.0
  - @atlaskit/single-select@5.0.0
  - @atlaskit/multi-select@10.0.0
  - @atlaskit/inline-edit@6.0.0
  - @atlaskit/field-radio-group@3.0.0
  - @atlaskit/field-text-area@3.0.0
  - @atlaskit/field-text@6.0.0
  - @atlaskit/checkbox@3.0.0
  - @atlaskit/calendar@6.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/field-range@4.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/droplist@6.0.0
  - @atlaskit/dropdown-menu@5.0.0

## 1.0.4

- [patch] Updated dependencies
  [6859cf6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6859cf6)
  - @atlaskit/field-text@5.1.0
  - @atlaskit/field-text-area@2.1.0

## 1.0.3

- [patch] Fix pinned field-text dep
  [050ad7b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/050ad7b)

## 1.0.2

- [patch] Updated dependencies
  [d05b9e5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d05b9e5)
  - @atlaskit/select@3.0.0
  - @atlaskit/datetime-picker@4.0.0

## 1.0.0

- [patch] Form developer preview
  [d8b2b03](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d8b2b03)
- [major] Form package developer preview release
  [9b28847](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b28847)
