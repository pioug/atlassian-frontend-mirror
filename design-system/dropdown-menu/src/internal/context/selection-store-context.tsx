import React, { createContext } from 'react';

import noop from '@atlaskit/ds-lib/noop';

export type OptionsInGroup = {
	[key: string]: boolean | undefined;
};

export type SelectionStoreContextProps = {
	setItemState: (group: string, id: string, value: boolean | undefined) => void;
	getItemState: (group: string, id: string) => boolean | undefined;
	setGroupState: (group: string, value: OptionsInGroup) => void;
	getGroupState: (group: string) => OptionsInGroup;
};

/**
 * __Selection store context__
 *
 * A context that stores the selection state of the dropdown menu items.
 */
export const SelectionStoreContext: React.Context<SelectionStoreContextProps> =
	createContext<SelectionStoreContextProps>({
		setItemState: noop,
		getItemState: () => undefined,
		setGroupState: noop,
		getGroupState: () => ({}),
	});
