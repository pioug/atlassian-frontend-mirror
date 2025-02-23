import React from 'react';

import Heading from '@atlaskit/heading';
import { Box, Stack, xcss } from '@atlaskit/primitives';

import type { ItemData } from './ItemType';
import { ListButtonItem } from './ListButtonItem';

interface ListButtonGroupProps {
	id: string;
	label?: string;
	items: ItemData[];
	attributes?: { new?: boolean };
	onItemSelected?: (index: number, categoryId: string) => void;
}

const headingContainerStyles = xcss({
	paddingTop: 'space.0',
	paddingBottom: 'space.100',
	paddingLeft: 'space.200',
	paddingRight: 'space.200',
});

const ListButtonGroupBase = ({ id, label, items, onItemSelected }: ListButtonGroupProps) => {
	return (
		<Stack space="space.025">
			{label && (
				<Box xcss={[headingContainerStyles]}>
					<Heading size={'xsmall'}>{label}</Heading>
				</Box>
			)}
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
		</Stack>
	);
};

export const ListButtonGroupWithHeading = ({
	id,
	label,
	items,
	onItemSelected,
}: ListButtonGroupProps) => {
	return (
		<ListButtonGroupBase id={id} label={label} items={items} onItemSelected={onItemSelected} />
	);
};

export const ListButtonGroup = ({
	id,
	items,
	onItemSelected,
}: Omit<ListButtonGroupProps, 'label'>) => {
	return <ListButtonGroupBase id={id} items={items} onItemSelected={onItemSelected} />;
};
