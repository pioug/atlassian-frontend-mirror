/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import { MetricText, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

export default (): JSX.Element => {
	return (
		<Stack space="space.100">
			<div css={styles.innerCircle}>
				<MetricText size="medium">93%</MetricText>
				<Text size="small" color="color.text.subtle">
					complete
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
		width: '140px',
		height: '140px',
		borderRadius: token('radius.full'),
		backgroundColor: token('elevation.surface'),
		borderLeftColor: token('color.border.accent.orange'),
		borderLeftWidth: '16px',
		borderRightColor: token('color.border.accent.teal'),
		borderRightWidth: '16px',
		borderTopColor: token('color.border.accent.magenta'),
		borderTopWidth: '16px',
		borderBottomColor: token('color.border.accent.lime'),
		borderBottomWidth: '16px',
		borderStyle: 'solid',
	},
});
