import React, { useState } from 'react';

import Toggle from '@atlaskit/toggle';

import { Label } from './label';

export default function Example(): React.JSX.Element {
	const [isChecked, setIsChecked] = useState(false);

	return (
		<>
			<Label htmlFor="toggle-controlled">Allow pull requests</Label>

			<Toggle
				id="toggle-controlled"
				onChange={() => setIsChecked((prev) => !prev)}
				isChecked={isChecked}
			/>
		</>
	);
}
