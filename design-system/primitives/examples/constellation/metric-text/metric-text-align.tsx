import React from 'react';

import { MetricText } from '@atlaskit/primitives/compiled/metric-text';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

export default (): React.JSX.Element => {
	return (
		<Stack space="space.100">
			<Stack space="space.0">
				<Text align="start">Text alignment:</Text>
				<MetricText size="small" align="start">
					Start
				</MetricText>
			</Stack>
			<Stack space="space.0">
				<Text align="center">Text alignment:</Text>
				<MetricText size="small" align="center">
					Center
				</MetricText>
			</Stack>
			<Stack space="space.0">
				<Text align="end">Text alignment:</Text>
				<MetricText size="small" align="end">
					End
				</MetricText>
			</Stack>
		</Stack>
	);
};
