import React, { useState } from 'react';

import { Section } from '@atlaskit/menu';
import { Box, Stack, xcss } from '@atlaskit/primitives';

import type { ItemData } from './ItemType';
import { ListButtonItem, ViewAllButtonItem } from './ListButtonItem';
import { ExpandableNavButton } from './NavigationButton';

const headingContainerStyles = xcss({
	paddingTop: 'space.0',
	paddingBottom: 'space.025',
	paddingLeft: 'space.100',
	paddingRight: 'space.100',
});

export interface ExpandablePanelProps {
	id: string;
	label: string;
	items: ItemData[];
	hasSeparator?: boolean;
	attributes?: { new?: boolean };
	onItemSelected?: (index: number, categoryId: string) => void;
	onViewAllSelected?: (categoryId: string) => void;
}

export const ExpandablePanel = ({
	id,
	label,
	items,
	hasSeparator,
	attributes,
	onItemSelected,
	onViewAllSelected,
}: ExpandablePanelProps) => {
	const [isExpanded, setIsExpanded] = useState(true);

	return (
		<Section hasSeparator={hasSeparator}>
			{label && (
				<Box xcss={[headingContainerStyles]}>
					<ExpandableNavButton
						id={id}
						label={label}
						isExpanded={isExpanded}
						attributes={attributes}
						onClick={() => setIsExpanded(!isExpanded)}
					/>
				</Box>
			)}
			{isExpanded && (
				<Stack space="space.025">
					{items.map((item) => {
						return (
							<ListButtonItem
								key={item.index}
								index={item.index}
								title={item.title}
								description={item.description}
								showDescription={item.showDescription}
								attributes={item.attributes}
								keyshortcut={item.keyshortcut}
								renderIcon={item.renderIcon}
								onItemSelected={(index) => onItemSelected?.(index, id)}
							/>
						);
					})}
					<ViewAllButtonItem
						label={`View all ${label.toLocaleLowerCase()} options`}
						onClick={() => onViewAllSelected?.(id)}
					/>
				</Stack>
			)}
		</Section>
	);
};
