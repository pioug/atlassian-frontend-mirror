import React, { useState } from 'react';

import Toggle from '@atlaskit/toggle';
import Tooltip from '@atlaskit/tooltip';

export default (): React.JSX.Element => {
	const [isChecked, handleOnchange] = useState(false);
	const checkedText = 'Allow pull requests';
	const uncheckedText = 'Disable pull requests';
	const getContent = () => (isChecked ? uncheckedText : checkedText);
	return (
		<div>
			<label htmlFor="Some_ID">Allow pull requests</label>
			<Tooltip content={getContent()} position="right">
				<Toggle size="large" onChange={() => handleOnchange(!isChecked)} id="Some_ID" />
			</Tooltip>
		</div>
	);
};
