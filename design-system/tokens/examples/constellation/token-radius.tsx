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
	heading: Extract<Parameters<typeof token>[0], 'radius.xlarge' | 'radius.large' | 'radius.small'>;
	children?: ReactNode;
}) => {
	const radiusMap = {
		'radius.xlarge': token('radius.xlarge'),
		'radius.large': token('radius.large'),
		'radius.small': token('radius.small'),
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
	<RadiusCard heading="radius.xlarge">
		<RadiusCard heading="radius.large">
			<RadiusCard heading="radius.small" />
		</RadiusCard>
	</RadiusCard>
);

export default Cards;
