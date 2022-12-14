import React, { createContext, FC, useContext } from 'react';

import useSelectionReducer from './use-selectable';

const SelectionContext = createContext<ReturnType<typeof useSelectionReducer>>([
  {
    checked: [],
    allChecked: false,
    anyChecked: false,
    maxChecked: 0,
    selectionStart: -1,
    previousSelection: [],
  },
  {} as any,
]);

/**
 * __Selection provider__
 *
 * A selection provider injects selection specific state into the table.
 *
 * - [Examples](https://atlassian.design/components/{packageName}/examples)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 * - [Usage](https://atlassian.design/components/{packageName}/usage)
 */
const SelectionProvider: FC = ({ children }) => {
  const reducer = useSelectionReducer();

  return (
    <SelectionContext.Provider value={reducer}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  return useContext(SelectionContext);
};

export default SelectionProvider;
