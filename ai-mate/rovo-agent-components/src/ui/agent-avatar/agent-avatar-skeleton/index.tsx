/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { AVATAR_SIZES, type SizeType } from '@atlaskit/avatar';
import { Box } from '@atlaskit/primitives/compiled';
import Skeleton from '@atlaskit/skeleton';

// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { AGENT_AVATAR_CLIP_PATH } from '../index';

type AgentAvatarSkeletonProps = {
	/**
	 * Size of the skeleton.
	 */
	size?: SizeType;
	/**
	 * Enables the shimmering animation.
	 */
	isShimmering?: boolean;
	/**
	 * Overrides the default color of skeleton.
	 */
	color?: string;
	/**
	 * Overrides the default shimmering ending color of skeleton.
	 */
	shimmeringEndColor?: string;
	/**
	 * Applied as a data-attribute for testing.
	 */
	testId?: string;
};

/**
 * Skeleton wrapper with hexagon clip-path to match the AgentAvatar component shape.
 * Uses the same clip-path as AgentAvatar to provide a consistent loading experience.
 */
export const AgentAvatarSkeleton = ({
	size = 'medium',
	isShimmering = true,
	color,
	shimmeringEndColor,
	testId,
}: AgentAvatarSkeletonProps) => {
	return (
		<Box
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values
				width: AVATAR_SIZES[size],
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values
				height: AVATAR_SIZES[size],
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-unsafe-values
				clipPath: AGENT_AVATAR_CLIP_PATH,
			}}
			testId={testId ? `${testId}-wrapper` : 'agent-avatar-skeleton-wrapper'}
		>
			<Skeleton
				width="100%"
				height="100%"
				borderRadius={0}
				isShimmering={isShimmering}
				color={color}
				ShimmeringEndColor={shimmeringEndColor}
				testId={testId ?? 'agent-avatar-skeleton'}
			/>
		</Box>
	);
};
