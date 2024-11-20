import React, { useState } from 'react';

import Toggle from '@atlaskit/toggle';
import Tooltip from '@atlaskit/tooltip';

import { Label } from './label';

export default function Example() {
	const [isAllowed, setIsAllowed] = useState(false);

	return (
		<>
			<Label htmlFor="toggle-tooltip">Allow pull requests</Label>

			<Tooltip content={isAllowed ? 'Disable pull requests' : 'Enable pull requests'}>
				<Toggle id="toggle-tooltip" onChange={() => setIsAllowed((prev) => !prev)} />
			</Tooltip>
		</>
	);
}
