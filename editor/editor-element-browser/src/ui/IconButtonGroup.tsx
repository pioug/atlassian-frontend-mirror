import React from 'react';

import Heading from '@atlaskit/heading';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

import { IconButtonItem } from './IconButtonItem';
import type { GroupData } from './ItemType';

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

export interface IconButtonGroupProps extends GroupData {
	xcss?: ReturnType<typeof xcss>;
	onItemSelected?: (index: number, categoryId: string) => void;
}

export const IconButtonGroup = ({
	id,
	label,
	items,
	onItemSelected,
	xcss: xcssStyles,
}: IconButtonGroupProps) => {
	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
		<Stack space="space.025" xcss={xcssStyles}>
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
