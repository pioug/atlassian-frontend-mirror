import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	containerWrapperSkeleton: {
		outlineWidth: token('border.width'),
		outlineColor: token('color.border'),
		outlineStyle: 'solid',
		borderRadius: token('radius.small'),
		borderColor: token('color.border.accent.gray'),
		color: token('color.text'),
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
	},
	containerIconSkeleton: {
		borderRadius: token('radius.small'),
		height: '24px',
		width: '24px',
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
	},
	firstLineSkeleton: {
		borderRadius: token('radius.full'),
		paddingBlock: token('space.050'),
	},
	secondLineSkeleton: {
		borderRadius: token('radius.full'),
		paddingBlock: token('space.050'),
		width: '144px',
	},
	containerTypeIconSkeleton: {
		borderRadius: token('radius.small'),
		height: '16px',
		width: '16px',
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
	},
});

export const LinkedContainerCardSkeleton = (): React.JSX.Element => {
	return (
		<Inline space="space.100" xcss={styles.containerWrapperSkeleton}>
			<Box xcss={styles.containerIconSkeleton} backgroundColor="color.background.neutral" />
			<Stack grow="fill" space="space.050">
				<Box xcss={styles.firstLineSkeleton} backgroundColor="color.background.neutral" />
				<Box xcss={styles.secondLineSkeleton} backgroundColor="color.background.neutral" />
			</Stack>
			<Box xcss={styles.containerTypeIconSkeleton} backgroundColor="color.background.neutral" />
		</Inline>
	);
};
