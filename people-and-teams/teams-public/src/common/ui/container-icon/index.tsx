import React, { useEffect } from 'react';

import Avatar from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import { cssMap, cx } from '@atlaskit/css';
import LinkIcon from '@atlaskit/icon/core/link';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import Tile from '@atlaskit/tile';
import { token } from '@atlaskit/tokens';

import { type ContainerTypes } from '../../types';
import { LoomSpaceAvatar } from '../loom-avatar';

const styles = cssMap({
	linkIconWrapperSmall: {
		marginTop: token('space.025'),
		marginRight: token('space.025'),
		marginBottom: token('space.025'),
		marginLeft: token('space.025'),
	},
});
export interface ContainerIconProps {
	containerType: ContainerTypes;
	title: string;
	containerIcon?: string;
	size?: 'small' | 'medium';
	testId?: string;
	iconsLoading?: boolean;
	iconHasLoaded?: boolean;
}

export const ContainerIcon = ({
	containerType,
	title,
	containerIcon,
	size = 'medium',
}: ContainerIconProps): React.JSX.Element => {
	const isMedium = size === 'medium';
	const [remoteIconFailed, setRemoteIconFailed] = React.useState(false);

	useEffect(() => {
		setRemoteIconFailed(false);
	}, [containerIcon]);

	if (containerType === 'LoomSpace') {
		return (
			<LoomSpaceAvatar
				spaceName={title}
				size={size}
				testId={`linked-container-${containerType}-icon`}
			/>
		);
	}

	// This is a fallback icon for WebLink if the containerIcon is not present
	if ((containerType === 'WebLink' && !containerIcon) || remoteIconFailed) {
		if (fg('enable_teams_t26_design_drop_core_experiences')) {
			return (
				<Tile label="" size={size} testId="linked-container-WebLink-new-icon" hasBorder>
					<LinkIcon label="" />
				</Tile>
			);
		}

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

	if (fg('enable_teams_t26_design_drop_core_experiences')) {
		return (
			<Tile
				label=""
				size={size}
				testId="linked-container-WebLink-new-icon"
				isInset={false}
				backgroundColor="transparent"
			>
				<Box
					as="img"
					src={containerIcon}
					alt={title}
					onError={() => {
						setRemoteIconFailed(true);
					}}
				/>
			</Tile>
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
