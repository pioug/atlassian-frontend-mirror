import React from 'react';

import { Stack, Text } from '@atlaskit/primitives';
import Skeleton from '@atlaskit/skeleton';

export default function All() {
	return (
		<Stack space="space.300" testId="skeleton-group">
			<Stack space="space.050" testId="skeleton-default">
				<Text>Default</Text>
				<Skeleton width="200px" height="16px" testId="skeleton" />
			</Stack>
			<Stack space="space.050">
				<Text>With animation</Text>
				<Skeleton width="200px" height="16px" isShimmering testId="skeleton-shimmering" />
			</Stack>
			<Stack space="space.050">
				<Text>With custom animation</Text>
				<Skeleton
					width="200px"
					height="16px"
					isShimmering
					testId="skeleton-shimmering"
					color="red"
					ShimmeringEndColor="blue"
				/>
			</Stack>
			<Stack space="space.050">
				<Text>Custom borderRadius</Text>
				<Skeleton width="200px" height="16px" borderRadius={3} testId="skeleton-border" />
			</Stack>
			<Stack space="space.050">
				<Text>Custom dimensions</Text>
				<Skeleton width="20px" height="20px" testId="skeleton-dimensions-avatar" />
				<Skeleton width="20px" height="20px" borderRadius={0} testId="skeleton-dimensions-icon" />
				<Skeleton width="130px" height="8px" testId="skeleton-dimensions-text" />
				<Skeleton width="400px" height="48px" borderRadius={3} testId="skeleton-dimensions-block" />
			</Stack>
		</Stack>
	);
}
