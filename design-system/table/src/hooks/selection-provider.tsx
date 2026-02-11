import React, { createContext, type FC, type ReactNode, useContext } from 'react';

import useSelectionReducer, {
	defaultSelectableState,
	type SelectableActions,
	type SelectableState,
} from './use-selectable';

type SelectionContext = [
	SelectableState,
	/**
	 * Context actions will be undefined without a `SelectionProvider` mounted.
	 */
	SelectableActions | Partial<SelectableActions>,
];

const SelectionContext = createContext<SelectionContext>([defaultSelectableState, {}]);

/**
 * __Selection provider__
 *
 * A selection provider injects selection specific state into the table.
 */
const SelectionProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const reducer = useSelectionReducer();

	return <SelectionContext.Provider value={reducer}>{children}</SelectionContext.Provider>;
};

export const useSelection: () => SelectionContext = () => {
	return useContext(SelectionContext);
};

export default SelectionProvider;
