import { createContext, useContext } from 'react';

/**
 * __Inside app provider context__
 *
 * A context that indicates if the current component is inside an AppProvider.
 */
export const InsideAppProviderContext = createContext(false);

export const useIsInsideAppProvider = () => {
	return useContext(InsideAppProviderContext);
};
