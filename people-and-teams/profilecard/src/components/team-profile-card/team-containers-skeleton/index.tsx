import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import type { TeamContainersSkeletonProps } from '@atlaskit/teams-public';
import { token } from '@atlaskit/tokens';

import { LinkedContainerCardSkeleton } from './linked-container-card-skeleton';

const styles = cssMap({
	showMoreButtonSkeleton: {
		borderRadius: '1rem',
		width: '64px',
		paddingBlock: token('space.050'),
	},
	containerSkeletonWrapper: {
		paddingInlineStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
	},
});

export const TeamContainersSkeleton = ({
	numberOfContainers,
}: TeamContainersSkeletonProps): React.JSX.Element => {
	return (
		<Box xcss={styles.containerSkeletonWrapper}>
			<Stack space="space.200" testId="profile-card-team-containers-skeleton">
				<Stack space="space.100">
					{[...Array(numberOfContainers)].map((_, index) => (
						<LinkedContainerCardSkeleton key={index} />
					))}
				</Stack>
				<Box backgroundColor="color.background.neutral" xcss={styles.showMoreButtonSkeleton} />
			</Stack>
		</Box>
	);
};
