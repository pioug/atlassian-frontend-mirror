import React from 'react';

import Avatar from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import { cssMap, cx } from '@atlaskit/css';
import LinkIcon from '@atlaskit/icon/core/link';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type ContainerTypes } from '../../types';
import { LoomSpaceAvatar } from '../loom-avatar';

const styles = cssMap({
	linkIconWrapperSmall: {
		marginTop: token('space.025', '2px'),
		marginRight: token('space.025', '2px'),
		marginBottom: token('space.025', '2px'),
		marginLeft: token('space.025', '2px'),
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
