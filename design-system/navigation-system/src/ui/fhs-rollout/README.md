# fhs-rollout

> **Deprecated.** Full height sidebar (FHS) has been rolled back. See the
> [FHS Rollback Plan](https://hello.atlassian.net/wiki/spaces/navx/pages/7189669176/Full+Height+Sidebar+FHS+Rollback+Plan).

Everything exported from `@atlaskit/navigation-system/fhs-rollout` is now a no-op:

- `useIsFhsEnabled()` always returns `false`.
- `IsFhsEnabledProvider` renders its children and ignores `value`.
- `IsFhsEnabledContext` is no longer read by any platform component.

Platform components no longer contain any full height sidebar code paths, and the
`navx-full-height-sidebar` feature gate is no longer read.

## Cleanup

1. Apps remove `IsFhsEnabledProvider`, and replace `useIsFhsEnabled()` with `false` (removing the
   code that was only used when it returned `true`).
2. Once no app references `fhs-rollout`, it will be deleted in a major release of
   `@atlaskit/navigation-system`.
