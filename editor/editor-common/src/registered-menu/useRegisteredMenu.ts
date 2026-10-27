import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import { getComponentIdentity } from '@atlaskit/editor-ui-control-model/surface-renderer';
import type {
	RegisterMenuItem,
	RegisterMenuSection,
} from '@atlaskit/editor-ui-control-model/types';

import { getRegisteredMenuRows } from './getRegisteredMenuRows';
import type { RegisteredMenuModel } from './types';
import { useRegisteredMenuSelection } from './useRegisteredMenuSelection';

type ItemActivation = {
	itemKey: string;
	model: RegisteredMenuModel;
	resetKey?: string | number | symbol;
	source: 'keyboard' | 'pointer';
};

type Options = {
	model: RegisteredMenuModel;
	resetKey?: string | number | symbol;
};

export type RegisteredMenuState = {
	activeItemKey?: string;
	onItemBlur: (itemKey: string) => void;
	onItemFocus: (index: number, itemKey?: string) => void;
	onItemHover: (index: number, itemKey?: string) => void;
	onItemLeave: (itemKey: string) => void;
	onItemVisibilityChange: (itemKey: string, isVisible: boolean) => void;
	rows: Array<RegisterMenuItem | RegisterMenuSection>;
	select: (index: number) => void;
	selectableItems: RegisterMenuItem[];
	selectedItemIndex: number;
	selectNext: () => void;
	selectPrevious: () => void;
};

/**
 * Connects menu rows to keyboard selection and tracks which item is active through
 * keyboard, pointer and focus events. Selection controls navigation; activation lets
 * the caller show item-specific feedback, such as a preview. A changed reset key
 * starts navigation again and clears the active item.
 */
export const useRegisteredMenu = ({ model, resetKey }: Options): RegisteredMenuState => {
	const { rows, selectableItems, selectableItemIdentities } = useMemo(() => {
		const rows = getRegisteredMenuRows(model);
		const selectableItems: RegisterMenuItem[] = [];
		const selectableItemIdentities: string[] = [];
		rows.forEach((row) => {
			if (row.type === 'menu-item') {
				selectableItems.push(row);
				selectableItemIdentities.push(getComponentIdentity(row));
			}
		});
		// The footer participates in navigation but is rendered outside the scrolling rows.
		if (model.footer) {
			selectableItemIdentities.push(getComponentIdentity(model.footer));
		}
		return { rows, selectableItems, selectableItemIdentities };
	}, [model]);
	const selection = useRegisteredMenuSelection({ identities: selectableItemIdentities, resetKey });
	const { selectedIndex: selectedItemIndex, select } = selection;
	const [activation, setItemActivation] = useState<ItemActivation | undefined>();
	const activeItemKey =
		activation?.model === model && activation.resetKey === resetKey
			? activation.itemKey
			: undefined;

	useLayoutEffect(() => {
		setItemActivation(undefined);
	}, [model, resetKey]);

	const activateKeyboardItem = useCallback(
		(index: number) => {
			const item = selectableItems[index];
			setItemActivation(
				item ? { itemKey: item.key, model, resetKey, source: 'keyboard' } : undefined,
			);
		},
		[model, resetKey, selectableItems],
	);
	const selectNext = useCallback(() => {
		activateKeyboardItem(selection.selectNext());
	}, [selection.selectNext, activateKeyboardItem]);
	const selectPrevious = useCallback(() => {
		activateKeyboardItem(selection.selectPrevious());
	}, [selection.selectPrevious, activateKeyboardItem]);
	const onItemHover = useCallback(
		(index: number, itemKey?: string) => {
			select(index);
			setItemActivation((current) => {
				if (
					itemKey &&
					current?.itemKey === itemKey &&
					current.model === model &&
					current.resetKey === resetKey &&
					current.source === 'pointer'
				) {
					return current;
				}
				return itemKey ? { itemKey, model, resetKey, source: 'pointer' } : undefined;
			});
		},
		[model, resetKey, select],
	);
	const onItemFocus = useCallback(
		(index: number, itemKey?: string) => {
			select(index);
			setItemActivation((current) => {
				if (
					itemKey &&
					current?.itemKey === itemKey &&
					current.model === model &&
					current.resetKey === resetKey
				) {
					return current;
				}
				return itemKey ? { itemKey, model, resetKey, source: 'keyboard' } : undefined;
			});
		},
		[model, resetKey, select],
	);
	const onItemLeave = useCallback((itemKey: string) => {
		setItemActivation((current) =>
			current?.source === 'pointer' && current.itemKey === itemKey ? undefined : current,
		);
	}, []);
	const onItemBlur = useCallback((itemKey: string) => {
		setItemActivation((current) => (current?.itemKey === itemKey ? undefined : current));
	}, []);
	const onItemVisibilityChange = useCallback((itemKey: string, isVisible: boolean) => {
		if (!isVisible) {
			setItemActivation((current) =>
				current?.source === 'pointer' && current.itemKey === itemKey ? undefined : current,
			);
		}
	}, []);

	return {
		rows,
		selectableItems,
		selectedItemIndex,
		select,
		selectNext,
		selectPrevious,
		activeItemKey,
		onItemHover,
		onItemFocus,
		onItemLeave,
		onItemBlur,
		onItemVisibilityChange,
	};
};
