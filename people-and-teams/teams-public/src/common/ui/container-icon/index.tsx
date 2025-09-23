import React from 'react';

import Avatar from '@atlaskit/avatar';
import { cssMap } from '@atlaskit/css';
import GlobeIcon from '@atlaskit/icon/core/globe';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type ContainerTypes } from '../../types';
import { LoomSpaceAvatar } from '../loom-avatar';

const styles = cssMap({
	globeIconWrapperMedium: {
		width: '34px',
		height: '34px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: token('radius.large', '8px'),
		outlineColor: token('color.border'),
		outlineStyle: 'solid',
		backgroundColor: token('elevation.surface.sunken'),
	},
	globeIconWrapperSmall: {
		width: '24px',
		height: '24px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: token('space.025', '2px'),
		marginRight: token('space.025', '2px'),
		marginBottom: token('space.025', '2px'),
		marginLeft: token('space.025', '2px'),
		borderRadius: token('radius.xsmall', '2px'),
		outlineColor: token('color.border'),
		outlineStyle: 'solid',
		backgroundColor: token('elevation.surface.sunken'),
	},
	skeletonMedium: {
		backgroundColor: token('color.skeleton'),
		width: '34px',
		height: '34px',
		borderRadius: token('radius.large', '8px'),
	},
	skeletonSmall: {
		backgroundColor: token('color.skeleton'),
		width: '24px',
		height: '24px',
		borderRadius: token('radius.xsmall', '2px'),
	},
});

interface IconSkeletonProps {
	size: 'small' | 'medium';
	testId?: string;
}

export interface ContainerIconProps {
	containerType: ContainerTypes;
	title: string;
	containerIcon?: string;
	size?: 'small' | 'medium';
	testId?: string;
	iconsLoading?: boolean;
	iconHasLoaded?: boolean;
}

const IconSkeleton = ({ size }: IconSkeletonProps) => {
	return (
		<Box
			xcss={size === 'medium' ? styles.skeletonMedium : styles.skeletonSmall}
			testId="container-icon-skeleton"
		/>
	);
};

export const ContainerIcon = ({
	containerType,
	title,
	containerIcon,
	size = 'medium',
	iconsLoading = false,
	iconHasLoaded = true,
}: ContainerIconProps) => {
	const isMedium = size === 'medium';

	if (containerType === 'LoomSpace') {
		return (
			<LoomSpaceAvatar
				spaceName={title}
				size={isMedium ? 'large' : size}
				testId={`linked-container-${containerType}-icon`}
			/>
		);
	}

	if (containerType === 'WebLink') {
		if (iconsLoading || !iconHasLoaded) {
			return <IconSkeleton size={size} />;
		}

		if (!containerIcon) {
			return (
				<Box xcss={isMedium ? styles.globeIconWrapperMedium : styles.globeIconWrapperSmall}>
					<GlobeIcon label="" testId="linked-container-WebLink-icon" />
				</Box>
			);
		}
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
