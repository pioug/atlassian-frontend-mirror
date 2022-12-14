import { createContext, useContext } from 'react';

const RowContext = createContext<number | undefined>(undefined);

/**
 * @internal
 */
export const useRowId = () => useContext(RowContext);

/**
 * __Row provider__
 * @internal
 */
export const RowProvider = RowContext.Provider;
