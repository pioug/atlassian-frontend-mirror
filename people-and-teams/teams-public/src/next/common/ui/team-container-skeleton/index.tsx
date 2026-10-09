import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Grid } from '@atlaskit/primitives/compiled/grid';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import Skeleton from '@atlaskit/skeleton';
import { token } from '@atlaskit/tokens';

import type { TeamContainersSkeletonProps } from '../../../../common/ui/team-containers-skeleton';

const styles = cssMap({
	containerSkeleton: {
		paddingTop: token('space.100'),
		paddingBottom: token('space.100'),
		alignItems: 'center',
	},
	iconSkeleton: {
		marginRight: token('space.100'),
	},
});

const ContainerSkeleton = () => {
	return (
		<Inline xcss={styles.containerSkeleton}>
			<Box xcss={styles.iconSkeleton}>
				<Skeleton width={'24px'} height={'24px'} isShimmering />
			</Box>
			<Skeleton width={'151px'} height={'20px'} isShimmering />
		</Inline>
	);
};

export const TeamContainerSkeleton = ({
	numberOfContainers,
}: TeamContainersSkeletonProps): React.JSX.Element => {
	return (
		<Stack space="space.200" testId="team-containers-skeleton">
			<Grid gap="space.100" autoFlow="row">
				{[...Array(numberOfContainers)].map((_, index) => (
					<ContainerSkeleton key={index} />
				))}
			</Grid>
		</Stack>
	);
};
