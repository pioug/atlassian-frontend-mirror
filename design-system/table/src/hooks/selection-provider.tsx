import React, { createContext, FC, useContext } from 'react';

import useSelectionReducer, {
  defaultSelectableState,
  SelectableActions,
  SelectableState,
} from './use-selectable';

type SelectionContext = [
  SelectableState,
  /**
   * Context actions will be undefined without a `SelectionProvider` mounted.
   */
  SelectableActions | Partial<SelectableActions>,
];

const SelectionContext = createContext<SelectionContext>([
  defaultSelectableState,
  {},
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
