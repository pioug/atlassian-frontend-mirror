import { useContext, createContext } from 'react';
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
export { SmartCardProvider };
export type { ProviderProps, CardContext };
export default SmartCardContext;
