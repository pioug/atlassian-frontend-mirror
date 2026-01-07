import { useContext } from 'react';

import { IsFhsEnabledContext } from './is-fhs-enabled-context';

/**
 * __Use is fhs enabled__
 *
 * Retrieves is FHS enabled.
 */
export const useIsFhsEnabled = (): boolean => {
	const isFhsEnabled = useContext(IsFhsEnabledContext);

	return typeof isFhsEnabled === 'boolean' ? isFhsEnabled : isFhsEnabled();
};
