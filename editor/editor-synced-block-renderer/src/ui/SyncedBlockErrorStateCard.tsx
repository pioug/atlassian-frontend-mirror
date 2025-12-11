import React from 'react';

import { cssMap } from '@atlaskit/css';
import WarningOutlineIcon from '@atlaskit/icon-lab/core/warning-outline';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	wrapper: {
		paddingTop: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.200'),
		paddingRight: token('space.200'),
		display: 'flex',
		justifyContent: 'start',
		alignItems: 'center',
		gap: token('space.200'),
	},
});

interface SyncedBlockErrorStateCardProps {
	children?: React.ReactNode;
	description: string;
}

export const SyncedBlockErrorStateCard = ({
	children,
	description,
}: SyncedBlockErrorStateCardProps): React.JSX.Element => {
	return (
		<Box xcss={styles.wrapper}>
			<WarningOutlineIcon color={token("color.icon.subtle")} label=""/>
			<Text color="color.text.subtle">{description}</Text>
			{children}
		</Box>
	);
};
