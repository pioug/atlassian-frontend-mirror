import { createContext, useContext } from 'react';

const RowContext = createContext<number | undefined>(undefined);

/**
 * @internal
 */
export const useRowId: () => number | undefined = () => useContext(RowContext);

/**
 * __Row provider__
 * @internal
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const RowProvider: import('react').Provider<number | undefined> = RowContext.Provider;
