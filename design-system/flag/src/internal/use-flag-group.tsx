import { useContext } from 'react';

import { FlagGroupContext, type FlagGroupAPI } from './flag-group-context';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export function useFlagGroup(): FlagGroupAPI {
	return useContext(FlagGroupContext);
}
