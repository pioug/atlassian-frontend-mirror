import React from 'react';

import ImageIcon from '@atlaskit/icon/core/image';
import { LozengeDropdownTrigger } from '@atlaskit/lozenge';
import { Stack } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => (
	<Stack>
		<p>
			<LozengeDropdownTrigger appearance="information">Default</LozengeDropdownTrigger>
		</p>
		<p>
			<LozengeDropdownTrigger appearance="information" spacing="spacious">
				Spacious
			</LozengeDropdownTrigger>
		</p>
		<p>
			<LozengeDropdownTrigger appearance="information" spacing="spacious" iconBefore={ImageIcon}>
				Spacious with icon
			</LozengeDropdownTrigger>
		</p>
	</Stack>
);
