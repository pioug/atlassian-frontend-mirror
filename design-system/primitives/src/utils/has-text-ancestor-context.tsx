import { createContext, type Provider, useContext } from 'react';

const HasTextAncestorContext = createContext(false);
/**
 * @internal
 */
export const useHasTextAncestor = (): boolean => useContext(HasTextAncestorContext);
/**
 * @internal
 */
export const HasTextAncestorProvider: Provider<boolean> = HasTextAncestorContext.Provider;
