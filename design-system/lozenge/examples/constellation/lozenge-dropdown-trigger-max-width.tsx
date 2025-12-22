import React from 'react';

import { LozengeDropdownTrigger } from '@atlaskit/lozenge';
import { Stack } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => (
	<Stack>
		<p>
			<LozengeDropdownTrigger appearance="success">
				default max width with long text which truncates
			</LozengeDropdownTrigger>
		</p>
		<p>
			<LozengeDropdownTrigger appearance="success" maxWidth={100}>
				custom max width with long text which truncates
			</LozengeDropdownTrigger>
		</p>
	</Stack>
);
