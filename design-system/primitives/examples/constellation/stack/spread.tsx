import React, { useCallback, useState } from 'react';

import { Label } from '@atlaskit/form';
import { Inline, Stack } from '@atlaskit/primitives/compiled';
import Toggle from '@atlaskit/toggle';

import ExampleBox from '../shared/example-box';

export default function Example() {
	const [spread, setSpread] = useState<'space-between' | undefined>(undefined);
	const toggleSpread = useCallback(() => {
		setSpread(spread === 'space-between' ? undefined : 'space-between');
	}, [spread]);

	return (
		<Stack alignInline="start" space="space.500">
			<Inline alignBlock="center">
				<Label htmlFor="stack-toggle-spread">Toggle spread</Label>
				<Toggle id="stack-toggle-spread" onChange={toggleSpread} />
			</Inline>
			<Inline space="space.100" alignBlock="stretch">
				<Stack space="space.1000">
					<ExampleBox />
					<ExampleBox />
					<ExampleBox />
				</Stack>

				<Stack space="space.100" spread={spread}>
					<ExampleBox />
					<ExampleBox />
					<ExampleBox />
				</Stack>
			</Inline>
		</Stack>
	);
}
