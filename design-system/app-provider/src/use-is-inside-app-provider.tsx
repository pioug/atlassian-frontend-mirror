import { useContext } from 'react';

import { InsideAppProviderContext } from './inside-app-provider-context';

export const useIsInsideAppProvider: () => boolean = () => {
	return useContext(InsideAppProviderContext);
};
