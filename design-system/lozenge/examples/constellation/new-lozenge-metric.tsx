import React from 'react';

import Lozenge from '@atlaskit/lozenge';
import { Stack } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => (
	<Stack space="space.100">
		<p>
			<Lozenge appearance="success" trailingMetric="3">
				Success
			</Lozenge>
		</p>
		<p>
			<Lozenge appearance="neutral" trailingMetric="3" trailingMetricAppearance="danger">
				Neutral + danger metric
			</Lozenge>
		</p>
	</Stack>
);
