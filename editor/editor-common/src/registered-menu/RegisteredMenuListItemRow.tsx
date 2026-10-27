import React, { useCallback, useContext, useLayoutEffect } from 'react';

import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

import { ActiveMenuItemKeyContext } from './ActiveMenuItemKeyContext';
import type { RegisteredMenuItemProps } from './types';

export type RegisteredMenuListItemIdParams = {
	itemIndex: number;
	rowIndex: number;
};

export type RegisteredMenuListItemRowProps = {
	getItemId: (params: RegisteredMenuListItemIdParams) => string;
	isVisible: boolean;
	Item: React.ComponentType<RegisteredMenuItemProps>;
	itemIndex: number;
	onItemBlur: (itemKey: string) => void;
	onItemFocus: (itemIndex: number, itemKey?: string) => void;
	onItemHover: (itemIndex: number, itemKey?: string) => void;
	onItemLeave: (itemKey: string) => void;
	onItemVisibilityChange: (itemKey: string, isVisible: boolean) => void;
	registration: RegisterMenuItem;
	rowIndex: number;
	selectedItemIndex: number;
};

/**
 * Connects a rendered item to the list's active state and interaction callbacks.
 * The list may reuse this row while scrolling, so context keeps its active styling
 * current. The wrapper handles events without requiring registered components to
 * forward them, and keeps the item active when focus moves between its children.
 */
export const RegisteredMenuListItemRow = ({
	Item,
	getItemId,
	itemIndex,
	isVisible,
	onItemBlur,
	onItemFocus,
	onItemHover,
	onItemLeave,
	onItemVisibilityChange,
	registration,
	rowIndex,
	selectedItemIndex,
}: RegisteredMenuListItemRowProps): React.JSX.Element => {
	const activeItemKey = useContext(ActiveMenuItemKeyContext);
	useLayoutEffect(() => {
		onItemVisibilityChange(registration.key, isVisible);
		return () => onItemVisibilityChange(registration.key, false);
	}, [isVisible, onItemVisibilityChange, registration.key]);

	const onBlur = useCallback(
		(event: React.FocusEvent<HTMLDivElement>) => {
			if (!event.currentTarget.contains(event.relatedTarget)) {
				onItemBlur(registration.key);
			}
		},
		[onItemBlur, registration.key],
	);

	return (
		<div
			onBlur={onBlur}
			onFocus={() => onItemFocus(itemIndex, registration.key)}
			onMouseLeave={() => onItemLeave(registration.key)}
			onMouseMove={() => onItemHover(itemIndex, registration.key)}
		>
			<Item
				id={getItemId({ itemIndex, rowIndex })}
				isActive={activeItemKey === registration.key}
				isSelected={itemIndex === selectedItemIndex}
				registration={registration}
			/>
		</div>
	);
};
