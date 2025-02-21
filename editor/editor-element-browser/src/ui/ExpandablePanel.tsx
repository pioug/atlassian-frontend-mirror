import React, { useState } from 'react';

import { Stack, xcss } from '@atlaskit/primitives';

import type { ItemData } from './ItemType';
import { ListButtonGroup } from './ListButtonGroup';
import { ViewAllButtonItem } from './ListButtonItem';
import { ExpandableNavButton } from './NavigationButton';

export interface ExpandablePanelProps {
	id: string;
	label: string;
	items: ItemData[];
	attributes?: { new?: boolean };
	onItemSelected?: (index: number, categoryId: string) => void;
	onViewAllSelected?: (categoryId: string) => void;
}

const itemContainerStyles = xcss({
	paddingTop: 'space.100',
	paddingBottom: 'space.100',
	paddingLeft: 'space.100',
	paddingRight: 'space.100',
});

export const ExpandablePanel = ({
	id,
	label,
	items,
	attributes,
	onItemSelected,
	onViewAllSelected,
}: ExpandablePanelProps) => {
	const [isExpanded, setIsExpanded] = useState(true);

	// ensure we always only show max 5 items
	// TODO should we leave it upto consumer to limit the items?
	const limitedItems = items.slice(0, 5);

	return (
		<Stack>
			<ExpandableNavButton
				id={id}
				label={label}
				isExpanded={isExpanded}
				attributes={attributes}
				onClick={() => setIsExpanded(!isExpanded)}
			/>
			{isExpanded && (
				<Stack space="space.025" xcss={[itemContainerStyles]}>
					<ListButtonGroup
						id={id}
						items={limitedItems}
						onItemSelected={onItemSelected}
					></ListButtonGroup>
					<ViewAllButtonItem
						label={`View all ${label.toLocaleLowerCase()} options`}
						onClick={() => onViewAllSelected?.(id)}
					/>
				</Stack>
			)}
		</Stack>
	);
};
