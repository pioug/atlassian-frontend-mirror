import React from 'react';

import Heading from '@atlaskit/heading';
import { Box, Stack, xcss } from '@atlaskit/primitives';

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
	xcss?: ReturnType<typeof xcss>;
	onItemSelected?: (index: number, categoryId: string) => void;
}

const ListButtonGroupBase = ({
	id,
	label,
	items,
	xcss: xcssStyles,
	onItemSelected,
}: ListButtonGroupProps) => {
	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
		<Stack space="space.025" xcss={xcssStyles}>
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
	xcss: xcssStyles,
	onItemSelected,
}: ListButtonGroupProps) => {
	return (
		<ListButtonGroupBase
			id={id}
			label={label}
			items={items}
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
			xcss={xcssStyles}
			onItemSelected={onItemSelected}
		/>
	);
};

export const ListButtonGroup = ({
	id,
	items,
	onItemSelected,
	xcss: xcssStyles,
}: Omit<ListButtonGroupProps, 'label'>) => {
	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
		<ListButtonGroupBase id={id} items={items} xcss={xcssStyles} onItemSelected={onItemSelected} />
	);
};
