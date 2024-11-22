import React from 'react';

import { ButtonGroup } from '@atlaskit/button';
import Button from '@atlaskit/button/new';

const ButtonSpacingExample = () => {
	return (
		<ButtonGroup>
			<Button appearance="primary">Default</Button>
			<Button appearance="primary" spacing="compact">
				Compact
			</Button>
		</ButtonGroup>
	);
};

export default ButtonSpacingExample;
