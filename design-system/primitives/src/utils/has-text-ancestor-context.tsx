import { createContext, useContext } from 'react';

const HasTextAncestorContext = createContext(false);
/**
 * @internal
 */
export const useHasTextAncestor = () => useContext(HasTextAncestorContext);
/**
 * @internal
 */
export const HasTextAncestorProvider = HasTextAncestorContext.Provider;
