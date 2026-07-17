import React, { type FC, type ReactNode } from 'react';

import Heading from '@atlaskit/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { type BackgroundColor, Box, xcss } from '@atlaskit/primitives';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- TODO: migrate to @atlaskit/primitives/compiled
import Inline from '@atlaskit/primitives/inline';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- TODO: migrate to @atlaskit/primitives/compiled
import Stack from '@atlaskit/primitives/stack';

import Card from './94-card';

const boxStyles = xcss({
	flexShrink: 0,
	borderRadius: 'radius.small',
	width: 'size.500',
	height: 'size.500',
});

const JSMCard: FC<{
	title: string;
	iconColor: BackgroundColor;
	children?: ReactNode;
}> = ({
	iconColor = 'color.background.discovery',
	children = 'Wow, finally after so many years, we have an amazing portal with a long description to top up the lorem ipsum',
	title = 'Title',
}) => {
	return (
		<Card>
			<Inline space="space.200">
				<Box backgroundColor={iconColor} xcss={boxStyles} />
				<Stack space="space.100">
					<Heading as="h3" size="medium">
						{title}
					</Heading>
					<span>{children}</span>
				</Stack>
			</Inline>
		</Card>
	);
};

export default JSMCard;
