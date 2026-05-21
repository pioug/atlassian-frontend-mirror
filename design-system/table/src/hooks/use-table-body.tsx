import { createContext, useContext } from 'react';

import invariant from 'tiny-invariant';

const TableBodyContext = createContext(false);

/**
 * __Table body provider__
 * Ensures correct nesting of table elements.
 */
export const TableBodyProvider: import('react').Provider<boolean> = TableBodyContext.Provider;

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const useTableBody: () => void = (): void => {
	const hasTableBody = useContext(TableBodyContext);
	invariant(hasTableBody, '<Row /> must be nested inside a <TableBody>');
};
