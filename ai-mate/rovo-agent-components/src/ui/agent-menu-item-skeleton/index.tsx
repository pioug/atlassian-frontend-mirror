import React from 'react';

import type { SizeType } from '@atlaskit/avatar';
import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import Skeleton from '@atlaskit/skeleton';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { AgentAvatarSkeleton } from '../agent-avatar/agent-avatar-skeleton';
const styles = cssMap({
	skeletonContainer: {
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		gap: token('space.075'),
	},
});

interface AgentMenuItemSkeletonProps {
	index: number;
	containerHeight?: number; // in px. This is the height of the container that contains the avatar and the text.
	skeletonTextHeight?: number; // in px
	skeletonTextWidth?: number; // in px
	skeletonAvatarSize?: SizeType;
	/**
	 * Horizontal padding for the skeleton container.
	 * @default 'space.075'.
	 */
	paddingHorizontal?: string;
}

export const AgentMenuItemSkeleton = ({
	index,
	containerHeight = 32,
	skeletonTextHeight = 16,
	skeletonTextWidth = 170,
	skeletonAvatarSize = 'small',
	paddingHorizontal = token('space.075'),
}: AgentMenuItemSkeletonProps) => {
	return (
		<Box
			key={`skeleton-container-${index}`}
			testId={`skeleton-container-${index}`}
			xcss={styles.skeletonContainer}
			style={{
				height: `${containerHeight}px`,
				paddingLeft: paddingHorizontal,
				paddingRight: paddingHorizontal,
			}}
		>
			<AgentAvatarSkeleton
				size={skeletonAvatarSize}
				isShimmering
				testId={`loading-agents-avatar-skeleton-${index}`}
			/>
			<Skeleton
				width={skeletonTextWidth}
				height={skeletonTextHeight}
				borderRadius={4}
				isShimmering
				testId={`loading-agents-text-skeleton-${index}`}
			/>
		</Box>
	);
};
