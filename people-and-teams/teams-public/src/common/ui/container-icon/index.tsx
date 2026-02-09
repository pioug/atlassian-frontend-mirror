import React from 'react';

import { isFedRamp } from '@atlaskit/atlassian-context';
import Avatar from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import { cssMap, cx } from '@atlaskit/css';
import GlobeIcon from '@atlaskit/icon/core/globe';
import LinkIcon from '@atlaskit/icon/core/link';
import { fg } from '@atlaskit/platform-feature-flags';
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
		minWidth: '24px',
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
	linkIconWrapperSmall: {
		marginTop: token('space.025', '2px'),
		marginRight: token('space.025', '2px'),
		marginBottom: token('space.025', '2px'),
		marginLeft: token('space.025', '2px'),
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
}: ContainerIconProps): React.JSX.Element => {
	const isMedium = size === 'medium';

	const isNewTeamProfilePageEnabled = !isFedRamp() || fg('new_team_profile_fedramp');

	if (containerType === 'LoomSpace') {
		return (
			<LoomSpaceAvatar
				spaceName={title}
				size={isMedium ? 'large' : size}
				testId={`linked-container-${containerType}-icon`}
			/>
		);
	}

	// This is a fallback icon for WebLink if the containerIcon is not present
	if (containerType === 'WebLink' && !containerIcon) {
		if (isNewTeamProfilePageEnabled) {
			return (
				<Box xcss={cx(!isMedium && styles.linkIconWrapperSmall)}>
					<IconButton
						label=""
						spacing={isMedium ? 'default' : 'compact'}
						appearance="default"
						aria-hidden="true" // Keeping this to be double sure icon isn't going to be focused
						tabIndex={-1} // This is to prevent the icon from being focused
						testId="linked-container-WebLink-new-icon"
						icon={() => <LinkIcon label="" size={isMedium ? 'medium' : 'small'} />}
					/>
				</Box>
			);
		}
		if (iconsLoading || !iconHasLoaded) {
			return <IconSkeleton size={size} />;
		}

		return (
			<Box xcss={isMedium ? styles.globeIconWrapperMedium : styles.globeIconWrapperSmall}>
				<GlobeIcon label="" testId="linked-container-WebLink-icon" />
			</Box>
		);
	}

	return (
		<Avatar
			appearance="square"
			borderColor="transparent"
			size={size}
			src={containerIcon}
			testId={`linked-container-${containerType}-icon`}
		/>
	);
};
