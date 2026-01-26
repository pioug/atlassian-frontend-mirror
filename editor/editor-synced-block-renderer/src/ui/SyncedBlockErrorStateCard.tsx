import React, { type ReactNode } from 'react';

import { cssMap } from '@atlaskit/css';
import WarningOutlineIcon from '@atlaskit/icon-lab/core/warning-outline';
import type { NewCoreIconProps } from '@atlaskit/icon/types';
import { fg } from '@atlaskit/platform-feature-flags';
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
	children?: ReactNode;
	closeButton?: ReactNode;
	description: ReactNode;
	icon?: (props: NewCoreIconProps) => JSX.Element;
}

export const SyncedBlockErrorStateCard = ({
	children,
	description,
	icon,
}: SyncedBlockErrorStateCardProps): React.JSX.Element => {
	const Icon = fg('platform_synced_block_dogfooding')
		? (icon ?? WarningOutlineIcon)
		: WarningOutlineIcon;
	return (
		<Box xcss={styles.wrapper}>
			<Icon color={token('color.icon.subtle')} label="" />
			<Text color="color.text.subtle">{description}</Text>
			{children}
		</Box>
	);
};
