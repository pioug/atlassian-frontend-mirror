import React from 'react';

import Heading from '@atlaskit/heading';
import { Section } from '@atlaskit/menu';
import { Box, xcss } from '@atlaskit/primitives';

import type { GroupData } from './ItemType';
import { ListButtonItem } from './ListButtonItem';

const headingContainerStyles = xcss({
	paddingTop: 'space.0',
	paddingBottom: 'space.100',
	paddingLeft: 'space.200',
	paddingRight: 'space.200',
});

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

interface ListButtonGroupProps extends Optional<GroupData, 'label'> {
	hasSeparator?: boolean;
	onItemSelected?: (index: number, categoryId: string) => void;
}

const ListButtonGroupBase = ({
	id,
	label,
	items,
	hasSeparator,
	onItemSelected,
}: ListButtonGroupProps) => {
	return (
		<Section hasSeparator={hasSeparator}>
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
		</Section>
	);
};

export const ListButtonGroupWithHeading = ({
	id,
	label,
	items,
	hasSeparator,
	onItemSelected,
}: ListButtonGroupProps) => {
	return (
		<ListButtonGroupBase
			id={id}
			label={label}
			items={items}
			hasSeparator={hasSeparator}
			onItemSelected={onItemSelected}
		/>
	);
};

export const ListButtonGroup = ({
	id,
	items,
	hasSeparator,
	onItemSelected,
}: Omit<ListButtonGroupProps, 'label'>) => {
	return (
		<ListButtonGroupBase
			id={id}
			items={items}
			hasSeparator={hasSeparator}
			onItemSelected={onItemSelected}
		/>
	);
};
