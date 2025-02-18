import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box, Grid, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { LinkedContainerCardSkeleton } from './linked-container-card-skeleton';

const styles = cssMap({
	containers: {
		gridTemplateColumns: '1fr 1fr',
	},
	showMoreButtonSkeleton: {
		borderRadius: token('border.radius.400'),
		width: '64px',
		paddingBlock: token('space.050'),
	},
});
interface TeamContainersSkeletonProps {
	numberOfContainers: number;
}

export const TeamContainersSkeleton = ({ numberOfContainers }: TeamContainersSkeletonProps) => {
	return (
		<Stack space="space.200" testId="team-containers-skeleton">
			<Grid xcss={styles.containers} gap="space.100" autoFlow="row">
				{[...Array(numberOfContainers)].map((_, index) => (
					<LinkedContainerCardSkeleton key={index} />
				))}
			</Grid>
			<Box backgroundColor="color.background.neutral" xcss={styles.showMoreButtonSkeleton} />
		</Stack>
	);
};
