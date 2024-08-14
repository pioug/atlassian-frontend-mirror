import React from 'react';

import { ButtonGroup } from '../../../../src';
import Button from '../../../../src/new';

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
