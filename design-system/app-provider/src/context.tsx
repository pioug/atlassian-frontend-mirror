import { createContext, useContext } from 'react';

/**
 * __Inside app provider context__
 *
 * A context that indicates if the current component is inside an AppProvider.
 */
export const InsideAppProviderContext: import("react").Context<boolean> = createContext(false);

export const useIsInsideAppProvider: () => boolean = () => {
	return useContext(InsideAppProviderContext);
};
