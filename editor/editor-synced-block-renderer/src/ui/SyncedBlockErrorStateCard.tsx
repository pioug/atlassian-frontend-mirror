import React, { type ReactNode } from 'react';

import { cssMap } from '@atlaskit/css';
import WarningOutlineIcon from '@atlaskit/icon-lab/core/warning-outline';
import type { NewCoreIconProps } from '@atlaskit/icon/types';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	wrapper: {
		paddingBlock: token('space.075'),
		paddingInlineStart: token('space.200'),
		display: 'flex',
		justifyContent: 'start',
		alignItems: 'center',
		gap: token('space.200'),
	},
	container: {
		display: 'flex',
	},
});

interface SyncedBlockErrorStateCardProps {
	children?: ReactNode;
	description: ReactNode;
	icon?: (props: NewCoreIconProps) => JSX.Element;
}

export const SyncedBlockErrorStateCard = ({
	children,
	description,
	icon,
}: SyncedBlockErrorStateCardProps): React.JSX.Element => {
	const Icon = icon ?? WarningOutlineIcon;
	return (
		<Box xcss={styles.container}>
			<Box xcss={styles.wrapper}>
				<Icon color={token('color.icon.subtle')} label="" />
				<Text color="color.text.subtle">{description}</Text>
			</Box>
			{children}
		</Box>
	);
};
