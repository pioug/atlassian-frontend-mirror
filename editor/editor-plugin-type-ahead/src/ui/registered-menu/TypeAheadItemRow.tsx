import React, { useCallback, useLayoutEffect } from 'react';

import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

import { getTypeAheadItemId } from './getTypeAheadItemId';
import type { TypeAheadItemComponent } from './typeAheadMenuTypes';

export const TypeAheadItemRow = ({
	isSelected,
	itemIndex,
	Item,
	listId,
	onItemHover,
	onItemLeave,
	onItemVisibilityChange,
	registration,
	rowIndex,
	isVisible,
}: {
	isSelected: boolean;
	isVisible: boolean;
	Item: TypeAheadItemComponent;
	itemIndex: number;
	listId: string;
	onItemHover: (itemIndex: number, itemKey: string) => void;
	onItemLeave: (itemKey: string) => void;
	onItemVisibilityChange: (itemKey: string, isVisible: boolean) => void;
	registration: RegisterMenuItem;
	rowIndex: number;
}): React.JSX.Element => {
	const onMouseMove = useCallback(
		() => onItemHover(itemIndex, registration.key),
		[itemIndex, onItemHover, registration.key],
	);
	const onMouseLeave = useCallback(
		() => onItemLeave(registration.key),
		[onItemLeave, registration.key],
	);
	const onBlur = useCallback(
		(event: React.FocusEvent<HTMLDivElement>) => {
			if (!event.currentTarget.contains(event.relatedTarget)) {
				onItemLeave(registration.key);
			}
		},
		[onItemLeave, registration.key],
	);

	useLayoutEffect(() => {
		onItemVisibilityChange(registration.key, isVisible);
		return () => onItemVisibilityChange(registration.key, false);
	}, [isVisible, onItemVisibilityChange, registration.key]);

	return (
		<div onBlur={onBlur} onMouseLeave={onMouseLeave} onMouseMove={onMouseMove}>
			<Item
				id={getTypeAheadItemId(listId, rowIndex)}
				isSelected={isSelected}
				registration={registration}
			/>
		</div>
	);
};
