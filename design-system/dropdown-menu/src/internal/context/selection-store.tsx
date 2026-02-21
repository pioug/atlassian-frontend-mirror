import React, { createContext, useMemo, useRef } from 'react';

import noop from '@atlaskit/ds-lib/noop';

type OptionsInGroup = {
	[key: string]: boolean | undefined;
};

type SelectionStoreContextProps = {
	setItemState: (group: string, id: string, value: boolean | undefined) => void;
	getItemState: (group: string, id: string) => boolean | undefined;
	setGroupState: (group: string, value: OptionsInGroup) => void;
	getGroupState: (group: string) => OptionsInGroup;
};

/**
 *
 * SelectionStoreContext maintains the state of the selected items
 * and getter setters.
 *
 */
export const SelectionStoreContext: React.Context<SelectionStoreContextProps> =
	createContext<SelectionStoreContextProps>({
		setItemState: noop,
		getItemState: () => undefined,
		setGroupState: noop,
		getGroupState: () => ({}),
	});

type SelectionStoreProps = {
	children: React.ReactNode;
};

type Entity = {
	[key: string]: OptionsInGroup;
};

/**
 * Selection store will persist data as long as it remains mounted.
 * It handles the uncontrolled story for dropdown menu when the menu
 * items can be mounted/unmounted depending if the menu is open or closed.
 */
const SelectionStore = (props: SelectionStoreProps): React.JSX.Element => {
	const { children } = props;
	const store = useRef<Entity>({});
	const context: SelectionStoreContextProps = useMemo(
		() => ({
			setItemState: (group: string, id: string, value: boolean | undefined) => {
				if (!store.current[group]) {
					store.current[group] = {};
				}

				store.current[group][id] = value;
			},
			getItemState: (group: string, id: string) => {
				if (!store.current[group]) {
					return undefined;
				}

				return store.current[group][id];
			},
			setGroupState: (group: string, value: OptionsInGroup) => {
				store.current[group] = value;
			},
			getGroupState: (group: string) => {
				return store.current[group] || {};
			},
		}),
		[],
	);

	return (
		<SelectionStoreContext.Provider value={context}>{children}</SelectionStoreContext.Provider>
	);
};

export default SelectionStore;
