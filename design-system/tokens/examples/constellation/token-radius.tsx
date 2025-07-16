import React, { type ReactNode } from 'react';

import Heading, { HeadingContextProvider } from '@atlaskit/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const cardStyles = xcss({
	display: 'flex',
	gap: 'space.200',
	padding: 'space.200',
	backgroundColor: 'color.background.neutral',
	borderWidth: 'border.width',
	borderStyle: 'solid',
	borderColor: 'color.border',
});

const RadiusCard = ({
	heading,
	children,
}: {
	heading: Extract<
		Parameters<typeof token>[0],
		'border.radius.300' | 'border.radius.200' | 'border.radius'
	>;
	children?: ReactNode;
}) => {
	const radiusMap = {
		'border.radius.300': token('border.radius.300'),
		'border.radius.200': token('border.radius.200'),
		'border.radius': token('border.radius'),
	};

	return (
		<HeadingContextProvider>
			<Box xcss={cardStyles} style={{ borderRadius: radiusMap[heading] }}>
				<Heading size="xsmall">{heading}</Heading>
				{children}
			</Box>
		</HeadingContextProvider>
	);
};

const Cards = () => (
	<RadiusCard heading="border.radius.300">
		<RadiusCard heading="border.radius.200">
			<RadiusCard heading="border.radius" />
		</RadiusCard>
	</RadiusCard>
);

export default Cards;
