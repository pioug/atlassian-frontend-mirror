import { useContext } from 'react';

import { AppProviderThemingEnabledContext } from './app-provider-theming-enabled-context';
import { InsideAppProviderContext } from './inside-app-provider-context';

export const useIsInsideAppProvider: () => boolean = () => {
	return useContext(InsideAppProviderContext);
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const useIsAppProviderThemingEnabled: () => boolean = () => {
	return useContext(AppProviderThemingEnabledContext);
};
