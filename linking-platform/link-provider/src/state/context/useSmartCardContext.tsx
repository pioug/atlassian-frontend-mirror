import React, { useContext, useMemo } from 'react';

import { SmartCardContext } from './index';
import { type CardContext } from './types';

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

export const useSmartCardContext = (): {
	Consumer: React.Consumer<CardContext | undefined>;
	Provider: React.Provider<CardContext | undefined>;
	value: CardContext | undefined;
} => useContextMemoized(SmartCardContext);
