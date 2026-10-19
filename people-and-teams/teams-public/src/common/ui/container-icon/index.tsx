import React, { useEffect } from 'react';

import LinkIcon from '@atlaskit/icon/core/link';
import { Box } from '@atlaskit/primitives/compiled/box';
import Tile from '@atlaskit/tile/tile';

import { type ContainerTypes } from '../../types';
import { LoomSpaceAvatar } from '../loom-avatar/main';

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
}: ContainerIconProps): React.JSX.Element => {
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
		return (
			<Tile label="" size={size} testId="linked-container-WebLink-new-icon" hasBorder>
				<LinkIcon label="" />
			</Tile>
		);
	}

	return (
		<Tile
			label=""
			size={size}
			testId={`linked-container-${containerType}-icon`}
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
};
