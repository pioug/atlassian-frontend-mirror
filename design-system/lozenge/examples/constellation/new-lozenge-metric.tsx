import React from 'react';

import ArrowDownRightIcon from '@atlaskit/icon/core/arrow-down-right';
import Lozenge from '@atlaskit/lozenge';
import { Stack } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => (
	<Stack space="space.100">
		<p>
			<Lozenge appearance="success" trailingMetric="0.8">
				Completed
			</Lozenge>
		</p>
		<p>
			<Lozenge
				appearance="danger"
				spacing="spacious"
				trailingMetric="0.3"
				iconBefore={ArrowDownRightIcon}
			>
				Off track
			</Lozenge>
		</p>
	</Stack>
);
