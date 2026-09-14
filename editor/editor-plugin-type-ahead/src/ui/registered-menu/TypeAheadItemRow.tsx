import React, { useCallback } from 'react';

import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

import { getTypeAheadItemId } from './getTypeAheadItemId';
import type { TypeAheadItemComponent } from './typeAheadMenuTypes';

export const TypeAheadItemRow = ({
	isSelected,
	itemIndex,
	Item,
	listId,
	onItemHover,
	registration,
	rowIndex,
}: {
	isSelected: boolean;
	Item: TypeAheadItemComponent;
	itemIndex: number;
	listId: string;
	onItemHover: (itemIndex: number) => void;
	registration: RegisterMenuItem;
	rowIndex: number;
}): React.JSX.Element => {
	const onMouseMove = useCallback(() => onItemHover(itemIndex), [itemIndex, onItemHover]);

	return (
		<div onMouseMove={onMouseMove}>
			<Item
				id={getTypeAheadItemId(listId, rowIndex)}
				isSelected={isSelected}
				registration={registration}
			/>
		</div>
	);
};
