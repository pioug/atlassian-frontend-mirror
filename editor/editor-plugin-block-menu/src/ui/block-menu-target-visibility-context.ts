import { createContext, useContext, type Provider } from 'react';

const BlockMenuTargetVisibilityContext = createContext<boolean | undefined>(undefined);

export const BlockMenuTargetVisibilityProvider: Provider<boolean | undefined> =
	BlockMenuTargetVisibilityContext.Provider;

export const useBlockMenuTargetVisibility = (): boolean | undefined =>
	useContext(BlockMenuTargetVisibilityContext);
