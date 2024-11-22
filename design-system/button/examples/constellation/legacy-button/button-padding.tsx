import React from 'react';

import Button, { ButtonGroup } from '@atlaskit/button';

const ButtonPaddingExample = () => {
	return (
		<ButtonGroup>
			<Button appearance="primary">Default</Button>
			<Button appearance="primary" spacing="compact">
				Compact
			</Button>
			<Button spacing="none" appearance="subtle-link">
				None
			</Button>
		</ButtonGroup>
	);
};

export default ButtonPaddingExample;
