/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { MetricText, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

export default (): JSX.Element => {
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
		borderInlineStartColor: token('color.border.accent.magenta'),
		borderInlineStartWidth: '32px',
		borderInlineEndColor: token('color.border.accent.lime'),
		borderInlineEndWidth: '32px',
		borderBlockStartColor: token('color.border.accent.orange'),
		borderBlockStartWidth: '32px',
		borderBlockEndColor: token('color.border.accent.teal'),
		borderBlockEndWidth: '32px',
		borderStyle: 'solid',
	},
});
