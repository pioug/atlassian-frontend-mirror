import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { LozengeDropdownTrigger } from '@atlaskit/lozenge';
import { Stack } from '@atlaskit/primitives/compiled';

export default function LozengeDropdownTriggerLoadingExample(): React.JSX.Element {
	const [isLoading, setIsLoading] = useState(false);

	return (
		<Stack space="space.100">
			<Button onClick={() => setIsLoading((loading) => !loading)}>
				{isLoading ? 'Stop loading' : 'Start loading'}
			</Button>

			<p>
				<LozengeDropdownTrigger appearance="information" isLoading={isLoading}>
					In progress
				</LozengeDropdownTrigger>
			</p>
		</Stack>
	);
}
