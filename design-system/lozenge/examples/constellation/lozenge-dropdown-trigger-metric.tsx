import React from 'react';

import ArrowDownRightIcon from '@atlaskit/icon/core/arrow-down-right';
import { LozengeDropdownTrigger } from '@atlaskit/lozenge';
import { Stack } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => (
	<Stack space="space.100">
		<p>
			<LozengeDropdownTrigger appearance="success" trailingMetric="0.8">
				Completed
			</LozengeDropdownTrigger>
		</p>
		<p>
			<LozengeDropdownTrigger
				iconBefore={ArrowDownRightIcon}
				spacing="spacious"
				appearance="danger"
				trailingMetric="0.3"
			>
				Off track
			</LozengeDropdownTrigger>
		</p>
	</Stack>
);
