# fhs-rollout

Allow apps to provide their own experiment or feature gate for the rollout of full height sidebar

## Usage

Platform components will query `IsFhsEnabledContext` (via `useIsFhsEnabled`) to determine if full
height sidebar is enabled or not. The default value of `IsFhsEnabledContext` is
`fg('navx-full-height-sidebar')`. Apps that wish to use the `navx-full-height-sidebar` feature gate
([Switcheroo](https://switcheroo.atlassian.com/ui/gates/dbbd9857-c111-4709-80a6-cac4b3656428/key/navx-full-height-sidebar))
to manage their full height sidebar rollout do not need to provide their own context value.

However, apps that wish to use a custom feature gate or experiment to manage their full height
sidebar rollout can provide their own context value with `IsFhsEnabledProvider`. When doing so
`IsFhsEnabledProvider` should be placed higher than any platform package that requires it.

```tsx
return (
	<IsFhsEnabledProvider value={fg('my-app-fhs-rollout')}>
		<Root>...</Root>
	</IsFhsEnabledProvider>
);
```

_Note, only zero or one `IsFhsEnabledProvider` should exist in an app._

If apps have components that need to know if full height sidebar is enabled or not, they can
reference the default feature gate or their own custom feature gate or experiment (depending on
which one they are using) directly. However, it may be safer to use `useIsFhsEnabled` instead in the
event the context value is set to something else.

_Note, if an app uses a custom feature gate or experiment, it should ensure `IsFhsEnabledProvider`
is placed above all usages of `useIsFhsEnabled`._

## Cleanup

### Phase 1

Apps that used a custom feature gate or experiment can remove it by replacing the value of
`IsFhsEnabledProvider` with `true`.

```tsx
return <IsFhsEnabledProvider value={true}>...</IsFhsEnabledProvider>;
```

### Phase 2

When all apps with a custom feature gate or experiment have set the value of `IsFhsEnabledProvider`
to `true`, platform packages can remove any references to `useIsFhsEnabled` in favour of `true`.

### Phase 3

When `useIsFhsEnabled` has been removed from platform packages, apps that used it can remove it as
well in favour of `true`. At this point `IsFhsEnabledProvider` can also be removed from apps that
have it.

### Phase 4

Once all references to `fhs-rollout` have been removed, it can be deleted.
