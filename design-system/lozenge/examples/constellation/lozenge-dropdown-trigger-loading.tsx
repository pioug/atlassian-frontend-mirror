import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import LozengeDropdownTrigger from '@atlaskit/lozenge/lozenge-dropdown-trigger';
import { Stack } from '@atlaskit/primitives/compiled';

export default function LozengeDropdownTriggerLoadingExample(): React.JSX.Element {
	const [isLoading, setIsLoading] = useState(false);

	return (
		<Stack space="space.100">
			<p>
				<Button onClick={() => setIsLoading((loading) => !loading)}>
					{isLoading ? 'Stop loading' : 'Start loading'}
				</Button>
			</p>

			<p>
				<LozengeDropdownTrigger appearance="information" isLoading={isLoading}>
					In progress
				</LozengeDropdownTrigger>
			</p>
		</Stack>
	);
}
