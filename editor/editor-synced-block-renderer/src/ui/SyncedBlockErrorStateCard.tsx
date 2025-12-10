import React from 'react';

import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import Image from '@atlaskit/image';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	wrapper: {
		paddingTop: token('space.250'),
		paddingBottom: token('space.250'),
		paddingLeft: token('space.400'),
		paddingRight: token('space.250'),
		backgroundColor: token('color.background.disabled'),
		display: 'flex',
		justifyContent: 'start',
		alignItems: 'center',
		borderRadius: token('radius.small'),
		gap: token('space.100'),
	},
	textWrapper: {
		marginLeft: token('space.100'),
	},
});

interface SyncedBlockErrorStateCardProps {
	children?: React.ReactNode;
	imageAltText?: string;
	imageSrc: string;
	primaryMessage?: string;
	secondaryMessage?: string;
}

export const SyncedBlockErrorStateCard = ({
	children,
	imageAltText,
	imageSrc,
	primaryMessage,
	secondaryMessage,
}: SyncedBlockErrorStateCardProps): React.JSX.Element => {
	return (
		<Box xcss={styles.wrapper}>
			<Image src={imageSrc} alt={imageAltText} width="48" height="48" />
			<Stack space="space.100" alignInline="start" xcss={styles.textWrapper}>
				{primaryMessage && <Heading size="xsmall">{primaryMessage}</Heading>}
				{secondaryMessage && <Text color="color.text.subtle">{secondaryMessage}</Text>}
				{children}
			</Stack>
		</Box>
	);
};
