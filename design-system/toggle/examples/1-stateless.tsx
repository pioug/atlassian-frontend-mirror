import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { Label } from '@atlaskit/form';
import { Stack } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import Toggle from '../src';

const StatelessExample = () => {
	const [isChecked, toggle] = useState(false);

	return (
		<div>
			<Stack>
				<p id="toggle-description">Interacting will not do anything by default</p>

				<Label htmlFor="toggle">Toggle</Label>
				<Toggle id="toggle" isChecked={isChecked} descriptionId="toggle-description" />
			</Stack>
			<p
				id="button-description"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={{ marginBottom: token('space.100', '8px') }}
			>
				Can use this button to trigger a toggle
			</p>
			<Button
				appearance="primary"
				onClick={() => toggle(!isChecked)}
				aria-describedby="button-description"
			>
				Trigger
			</Button>
		</div>
	);
};
export default StatelessExample;
