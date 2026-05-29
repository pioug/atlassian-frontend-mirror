import { useContext } from 'react';

import { AppProviderThemingEnabledContext } from './app-provider-theming-enabled-context';

export const useIsAppProviderThemingEnabled: () => boolean = () => {
	return useContext(AppProviderThemingEnabledContext);
};
