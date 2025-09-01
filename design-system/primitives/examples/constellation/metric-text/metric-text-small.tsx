import React from 'react';

import { cssMap } from '@atlaskit/css';
import ChartPieIcon from '@atlaskit/icon/core/chart-pie';
import { Box, Inline, MetricText, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		width: '300px',
	},
	statsCard: {
		backgroundColor: token('elevation.surface'),
		borderWidth: token('border.width.outline'),
		borderColor: token('color.border'),
		borderStyle: 'solid',
		paddingTop: token('space.150'),
		paddingRight: token('space.150'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.150'),
		borderRadius: token('radius.small'),
	},
});

export default () => {
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
