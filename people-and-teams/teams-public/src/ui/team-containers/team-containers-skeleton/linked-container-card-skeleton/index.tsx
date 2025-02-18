import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		outlineWidth: token('border.width'),
		outlineColor: token('color.border'),
		outlineStyle: 'solid',
		borderRadius: token('border.radius.100'),
		borderColor: token('color.border.accent.gray'),
		color: token('color.text'),
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
	avatarSkeleton: {
		borderRadius: token('border.radius'),
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
	firstLineSkeleton: {
		borderRadius: token('border.radius.400'),
		paddingBlock: token('space.050'),
	},
	secondLineSkeleton: {
		borderRadius: token('border.radius.400'),
		paddingBlock: token('space.050'),
		width: '144px',
	},
});

export const LinkedContainerCardSkeleton = () => {
	return (
		<Box xcss={styles.container}>
			<Inline space="space.100" alignBlock="center">
				<Box backgroundColor="color.background.neutral" xcss={styles.avatarSkeleton} />
				<Stack space="space.100" grow="fill">
					<Box backgroundColor="color.background.neutral" xcss={styles.firstLineSkeleton} />
					<Box backgroundColor="color.background.neutral" xcss={styles.secondLineSkeleton} />
				</Stack>
			</Inline>
		</Box>
	);
};
