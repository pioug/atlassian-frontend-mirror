import React, { memo, useState } from 'react';

import { Section } from '@atlaskit/menu';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Stack, xcss } from '@atlaskit/primitives';

import type { ItemData } from './ItemType';
import { ListButtonItem, ViewAllButtonItem } from './ListButtonItem';
import { ExpandableNavButton } from './NavigationButton';

const headingContainerStyles = xcss({
	paddingTop: 'space.100',
	paddingBottom: 'space.075',
	paddingLeft: 'space.300',
	paddingRight: 'space.300',
});

const itemsContainerStyles = xcss({
	paddingTop: 'space.0',
	paddingBottom: 'space.150',
	paddingLeft: 'space.200',
	paddingRight: 'space.200',
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

export const ExpandablePanel = memo(
	({
		id,
		label,
		items,
		hasSeparator,
		attributes,
		onItemSelected,
		onViewAllSelected,
	}: ExpandablePanelProps) => {
		const [isExpanded, setIsExpanded] = useState(true);

		// Dirty fix for AI label
		const shortAIlabel = label === 'Atlassian Intelligence';

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
					<Stack space="space.025" xcss={[itemsContainerStyles]}>
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
							label={`View all ${shortAIlabel ? 'AI' : label.toLocaleLowerCase()} options`}
							onClick={() => onViewAllSelected?.(id)}
						/>
					</Stack>
				)}
			</Section>
		);
	},
);
