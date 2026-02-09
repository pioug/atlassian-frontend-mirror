import React from 'react';

import { LozengeDropdownTrigger } from '@atlaskit/lozenge';
import { Stack } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => (
	<Stack space="space.100">
		<p>
			<LozengeDropdownTrigger appearance="success" trailingMetric="3">
				Success
			</LozengeDropdownTrigger>
		</p>
		<p>
			<LozengeDropdownTrigger
				appearance="neutral"
				trailingMetric="3"
				trailingMetricAppearance="danger"
			>
				Neutral + danger metric
			</LozengeDropdownTrigger>
		</p>
	</Stack>
);
