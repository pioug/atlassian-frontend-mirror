import React, { type PropsWithChildren } from 'react';

/**
 * __Is fhs enabled provider__
 *
 * @deprecated Full height sidebar (FHS) has been rolled back. This provider is now a passthrough:
 * it renders its children and ignores `value`. Remove it from your app; it will be deleted in a
 * future major release.
 *
 * See https://hello.atlassian.net/wiki/spaces/navx/pages/7189669176/Full+Height+Sidebar+FHS+Rollback+Plan
 */
export const IsFhsEnabledProvider = ({
	children,
}: IsFhsEnabledProviderProps): React.JSX.Element => <>{children}</>;

/**
 * @deprecated Full height sidebar (FHS) has been rolled back. `value` is ignored.
 */
export type IsFhsEnabledProviderProps = PropsWithChildren<{
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	value: boolean;
}>;
