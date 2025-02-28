import React, { memo } from 'react';

import Heading from '@atlaskit/heading';
import { Section } from '@atlaskit/menu';
import { Box, Inline, xcss } from '@atlaskit/primitives';

import { IconButtonItem } from './IconButtonItem';
import type { GroupData } from './ItemType';

const headingContainerStyles = xcss({
	paddingTop: 'space.0',
	paddingBottom: 'space.075',
	paddingLeft: 'space.300',
	paddingRight: 'space.300',
});

const buttonsContainerStyles = xcss({
	paddingTop: 'space.150',
	paddingBottom: 'space.200',
	paddingLeft: 'space.300',
	paddingRight: 'space.300',
});

export interface IconButtonGroupProps extends GroupData {
	hasSeparator?: boolean;
	onItemSelected?: (index: number, categoryId: string) => void;
}

export const IconButtonGroup = memo(
	({ id, label, items, hasSeparator, onItemSelected }: IconButtonGroupProps) => {
		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
			<Section hasSeparator={hasSeparator}>
				{label && (
					<Box xcss={[headingContainerStyles]}>
						<Heading size={'xsmall'} as="span">
							{label}
						</Heading>
					</Box>
				)}

				<Box xcss={[buttonsContainerStyles]}>
					<Inline
						as="span"
						spread="space-between"
						alignBlock="center"
						space="space.050"
						rowSpace="space.150"
						grow="fill"
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
			</Section>
		);
	},
);
