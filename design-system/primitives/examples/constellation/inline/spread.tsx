import React, { useCallback, useState } from 'react';

import { Label } from '@atlaskit/form/label/default';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import Toggle from '@atlaskit/toggle';

import ExampleBox from '../shared/example-box';

export default function Example(): React.JSX.Element {
	const [spread, setSpread] = useState<'space-between' | undefined>(undefined);
	const toggleSpread = useCallback(() => {
		setSpread(spread === 'space-between' ? undefined : 'space-between');
	}, [spread]);

	return (
		<Stack alignInline="start" space="space.500">
			<Inline alignBlock="center">
				<Label htmlFor="inline-toggle-spread">Toggle spread</Label>
				<Toggle id="inline-toggle-spread" onChange={toggleSpread} />
			</Inline>
			<Inline space="space.100" grow="fill" spread={spread}>
				<ExampleBox />
				<ExampleBox />
				<ExampleBox />
			</Inline>
		</Stack>
	);
}
