import React, { type PropsWithChildren, useContext } from 'react';

import { IsCustomIsFhsEnabledContext } from './is-custom-is-fhs-enabled-context';
import { IsFhsEnabledContext } from './is-fhs-enabled-context';

/**
 * __Is fhs enabled provider__
 *
 * Used to provide a custom value for is FHS enabled.
 */
export const IsFhsEnabledProvider = ({
	children,
	value,
}: IsFhsEnabledProviderProps): React.JSX.Element => {
	const isCustomIsFhsEnabled = useContext(IsCustomIsFhsEnabledContext);

	if (isCustomIsFhsEnabled) {
		throw new Error('A custom value for IsFhsEnabledContext has already been provided');
	}

	return (
		<IsCustomIsFhsEnabledContext.Provider value={true}>
			<IsFhsEnabledContext.Provider value={value}>{children}</IsFhsEnabledContext.Provider>
		</IsCustomIsFhsEnabledContext.Provider>
	);
};

export type IsFhsEnabledProviderProps = PropsWithChildren<{
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	value: boolean;
}>;
