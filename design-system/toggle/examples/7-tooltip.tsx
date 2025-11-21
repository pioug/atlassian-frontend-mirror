import React, { useState } from 'react';

import Toggle from '@atlaskit/toggle';
import Tooltip from '@atlaskit/tooltip';

export default function Example(): React.JSX.Element {
	const [isAllowed, setIsAllowed] = useState(false);

	return (
		<>
			<label htmlFor="toggle-tooltip">Allow pull requests</label>

			<Tooltip content={isAllowed ? 'Disable pull requests' : 'Enable pull requests'}>
				<Toggle
					id="toggle-tooltip"
					isChecked={isAllowed}
					onChange={() => setIsAllowed((prev) => !prev)}
				/>
			</Tooltip>
		</>
	);
}
