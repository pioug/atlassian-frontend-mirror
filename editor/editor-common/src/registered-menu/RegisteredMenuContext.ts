import { createContext, useContext, type Context } from 'react';

import type { RegisteredMenuContextValue } from './types';

export const RegisteredMenuContext: Context<RegisteredMenuContextValue | null> =
	createContext<RegisteredMenuContextValue | null>(null);

export const useRegisteredMenuContext = (): RegisteredMenuContextValue => {
	const context = useContext(RegisteredMenuContext);
	if (!context) {
		throw new Error('useRegisteredMenuContext must be used within RegisteredMenuContext.Provider');
	}
	return context;
};
