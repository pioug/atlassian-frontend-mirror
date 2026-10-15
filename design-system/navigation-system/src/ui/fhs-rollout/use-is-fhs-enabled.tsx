/**
 * __Use is fhs enabled__
 *
 * @deprecated Full height sidebar (FHS) has been rolled back. This hook always returns `false`.
 * Remove usages of it (treat it as `false`); it will be deleted in a future major release.
 *
 * See https://hello.atlassian.net/wiki/spaces/navx/pages/7189669176/Full+Height+Sidebar+FHS+Rollback+Plan
 */
export const useIsFhsEnabled = (): boolean => false;
