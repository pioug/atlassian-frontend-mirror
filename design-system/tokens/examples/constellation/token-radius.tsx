/* eslint-disable @atlaskit/design-system/no-unsafe-design-token-usage */
import React, { type ReactNode } from 'react';

import Heading, { HeadingContextProvider } from '@atlaskit/heading';
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
		'border.radius.300': token('border.radius.300', '4px'),
		'border.radius.200': token('border.radius.200', '4px'),
		'border.radius': token('border.radius', '4px'),
	};

	return (
		<HeadingContextProvider>
			<Box xcss={cardStyles} style={{ borderRadius: radiusMap[heading] }}>
				<Heading level="h400">{heading}</Heading>
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
