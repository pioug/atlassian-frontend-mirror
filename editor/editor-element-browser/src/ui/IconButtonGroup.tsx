import React from 'react';

import Heading from '@atlaskit/heading';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

import { IconButtonItem } from './IconButtonItem';
import type { ItemData } from './ItemType';

const headingContainerStyles = xcss({
	paddingTop: 'space.0',
	paddingBottom: 'space.100',
	paddingLeft: 'space.200',
	paddingRight: 'space.200',
});

const buttonsContainerStyles = xcss({
	paddingTop: 'space.0',
	paddingBottom: 'space.100',
	paddingLeft: 'space.200',
	paddingRight: 'space.200',
});

export interface IconButtonGroupProps {
	id: string;
	label: string;
	items: ItemData[];
	onItemSelected?: (index: number, categoryId: string) => void;
}

export const IconButtonGroup = ({ id, label, items, onItemSelected }: IconButtonGroupProps) => {
	return (
		<Stack space="space.025">
			<Box xcss={[headingContainerStyles]}>
				<Heading size={'xsmall'}>{label}</Heading>
			</Box>

			<Box xcss={[buttonsContainerStyles]}>
				<Inline
					as="span"
					// spread="space-between"
					alignBlock="center"
					space={'space.100'}
					// grow="fill"
					shouldWrap={true}
				>
					{items.map((item) => {
						return (
							<IconButtonItem
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
				</Inline>
			</Box>
		</Stack>
	);
};
