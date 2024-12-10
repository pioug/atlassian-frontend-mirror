import React, { useContext, createContext, useMemo } from 'react';
import { type CardContext } from './types';
import { SmartCardProvider, type ProviderProps } from '../../provider';

export const SmartCardContext = createContext<CardContext | undefined>(undefined);

export function useSmartLinkContext() {
	const context = useContext(SmartCardContext);
	if (!context) {
		throw Error('useSmartCard() must be wrapped in <SmartCardProvider>');
	}

	return context;
}

export const useSmartCardContext = () => useContextMemoized(SmartCardContext);

export const EditorSmartCardProviderValueGuard = ({ children }: React.PropsWithChildren<{}>) => {
	const cardContext = useSmartCardContext();

	if (!cardContext?.value) {
		return null;
	}
	return <>{children}</>;
};

function useContextMemoized<T>(reactContext: React.Context<T>) {
	const value = useContext(reactContext);
	const context = useMemo(
		() => ({
			Provider: reactContext.Provider,
			Consumer: reactContext.Consumer,
			value,
		}),
		[value, reactContext],
	);
	return context;
}

export const EditorSmartCardProvider = ({ children }: React.PropsWithChildren<{}>) => {
	const cardContext = useSmartCardContext();
	const Provider = cardContext.Provider;

	return <Provider value={cardContext.value}>{children}</Provider>;
};

export { SmartCardProvider };
export type { ProviderProps, CardContext };
export default SmartCardContext;
