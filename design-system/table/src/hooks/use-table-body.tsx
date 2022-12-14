import { createContext, useContext } from 'react';

import invariant from 'tiny-invariant';

const TableBodyContext = createContext(false);

/**
 * __Table body provider__
 * Ensures correct nesting of table elements.
 */
export const TableBodyProvider = TableBodyContext.Provider;

export const useTableBody = () => {
  const hasTableBody = useContext(TableBodyContext);
  invariant(hasTableBody, '<Row /> must be nested inside a <TableBody>');
};
