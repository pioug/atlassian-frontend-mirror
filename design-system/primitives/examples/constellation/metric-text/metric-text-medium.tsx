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
		borderInlineStartColor: token('color.border.accent.orange'),
		borderInlineStartWidth: '16px',
		borderInlineEndColor: token('color.border.accent.teal'),
		borderInlineEndWidth: '16px',
		borderBlockStartColor: token('color.border.accent.magenta'),
		borderBlockStartWidth: '16px',
		borderBlockEndColor: token('color.border.accent.lime'),
		borderBlockEndWidth: '16px',
		borderStyle: 'solid',
	},
});
