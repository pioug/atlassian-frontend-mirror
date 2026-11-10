import React, { useCallback, useContext, useLayoutEffect } from 'react';

import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

import { PreviewItemIndexContext } from './PreviewItemIndexContext';
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
	onItemBlur: (itemIndex: number) => void;
	onItemFocus: (itemIndex: number) => void;
	onItemHover: (itemIndex: number) => void;
	onItemLeave: (itemIndex: number) => void;
	onItemVisibilityChange: (itemIndex: number, isVisible: boolean) => void;
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
	const previewItemIndex = useContext(PreviewItemIndexContext);
	useLayoutEffect(() => {
		onItemVisibilityChange(itemIndex, isVisible);
		return () => onItemVisibilityChange(itemIndex, false);
	}, [isVisible, itemIndex, onItemVisibilityChange]);

	const onBlur = useCallback(
		(event: React.FocusEvent<HTMLDivElement>) => {
			if (!event.currentTarget.contains(event.relatedTarget)) {
				onItemBlur(itemIndex);
			}
		},
		[itemIndex, onItemBlur],
	);

	return (
		<div
			onBlur={onBlur}
			onFocus={() => onItemFocus(itemIndex)}
			onMouseLeave={() => onItemLeave(itemIndex)}
			onMouseMove={() => onItemHover(itemIndex)}
		>
			<Item
				id={getItemId({ itemIndex, rowIndex })}
				isActive={previewItemIndex === itemIndex}
				isSelected={itemIndex === selectedItemIndex}
				registration={registration}
			/>
		</div>
	);
};
