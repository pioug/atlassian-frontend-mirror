import React from 'react';

import Avatar from '@atlaskit/avatar';
import { cssMap } from '@atlaskit/css';
import LinkIcon from '@atlaskit/icon/core/link';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type ContainerTypes } from '../../types';
import { LoomSpaceAvatar } from '../loom-avatar';

const styles = cssMap({
	linkIconWrapperMedium: {
		width: '34px',
		height: '34px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: token('border.radius.100', '8px'),
		outlineColor: token('color.border'),
		outlineStyle: 'solid',
		backgroundColor: token('elevation.surface.sunken'),
	},
	linkIconWrapperSmall: {
		width: '24px',
		height: '24px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: token('space.025', '2px'),
		marginRight: token('space.025', '2px'),
		marginBottom: token('space.025', '2px'),
		marginLeft: token('space.025', '2px'),
		borderRadius: token('border.radius.050', '4px'),
		outlineColor: token('color.border'),
		outlineStyle: 'solid',
		backgroundColor: token('elevation.surface.sunken'),
	},
});

export interface ContainerIconProps {
	containerType: ContainerTypes;
	title: string;
	containerIcon?: string;
	size?: 'small' | 'medium';
	testId?: string;
}

export const ContainerIcon = ({
	containerType,
	title,
	containerIcon,
	size = 'medium',
}: ContainerIconProps) => {
	if (containerType === 'LoomSpace') {
		return <LoomSpaceAvatar spaceName={title} size={size === 'medium' ? 'large' : size} />;
	}

	if (containerType === 'WebLink' && !containerIcon) {
		return (
			<Box xcss={size === 'medium' ? styles.linkIconWrapperMedium : styles.linkIconWrapperSmall}>
				<LinkIcon label="" testId="linked-container-WebLink-icon" />
			</Box>
		);
	}

	return (
		<Avatar
			appearance="square"
			size={size}
			src={containerIcon}
			testId={`linked-container-${containerType}-icon`}
		/>
	);
};
