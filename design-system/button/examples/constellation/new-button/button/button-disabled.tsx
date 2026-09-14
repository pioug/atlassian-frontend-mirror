import React from 'react';

import Button from '@atlaskit/button/default/button';

export default function ButtonDisabledExample(): React.JSX.Element {
	return (
		<Button appearance="primary" isDisabled>
			Disabled button
		</Button>
	);
}
