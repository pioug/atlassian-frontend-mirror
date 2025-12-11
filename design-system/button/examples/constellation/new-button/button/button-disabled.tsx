import React from 'react';

import Button from '@atlaskit/button/new';

export default function ButtonDisabledExample(): React.JSX.Element {
	return (
		<Button appearance="primary" isDisabled>
			Disabled button
		</Button>
	);
}
