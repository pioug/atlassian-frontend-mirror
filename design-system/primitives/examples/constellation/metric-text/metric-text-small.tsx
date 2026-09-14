import React from 'react';

import { cssMap } from '@atlaskit/css';
import ChartPieIcon from '@atlaskit/icon/core/chart-pie';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { MetricText } from '@atlaskit/primitives/compiled/metric-text';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		width: '300px',
	},
	statsCard: {
		backgroundColor: token('elevation.surface'),
		borderWidth: token('border.width.selected'),
		borderColor: token('color.border'),
		borderStyle: 'solid',
		paddingBlockStart: token('space.150'),
		paddingInlineEnd: token('space.150'),
		paddingBlockEnd: token('space.150'),
		paddingInlineStart: token('space.150'),
		borderRadius: token('radius.small'),
	},
});

export default (): React.JSX.Element => {
	return (
		<Box xcss={styles.container}>
			<Inline space="space.200" xcss={styles.statsCard} grow="hug" alignBlock="center">
				<ChartPieIcon label="" color={token('color.icon.subtle')} />
				<Stack space="space.025">
					<MetricText size="small">3 in review</MetricText>
					<Text size="small" color="color.text.subtle">
						3/5 projects in review
					</Text>
				</Stack>
			</Inline>
		</Box>
	);
};
