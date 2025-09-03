/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import { MetricText, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

export default () => {
	return (
		<Stack space="space.100">
			<div css={styles.innerCircle}>
				<MetricText size="large">$100</MetricText>
				<Text size="small" color="color.text.subtle">
					costs saved
				</Text>
			</div>
		</Stack>
	);
};

const styles = cssMap({
	innerCircle: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		width: '200px',
		height: '200px',
		borderRadius: token('radius.full'),
		backgroundColor: token('elevation.surface'),
		borderLeftColor: token('color.border.accent.magenta'),
		borderLeftWidth: '32px',
		borderRightColor: token('color.border.accent.lime'),
		borderRightWidth: '32px',
		borderTopColor: token('color.border.accent.orange'),
		borderTopWidth: '32px',
		borderBottomColor: token('color.border.accent.teal'),
		borderBottomWidth: '32px',
		borderStyle: 'solid',
	},
});
