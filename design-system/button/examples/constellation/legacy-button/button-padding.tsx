import React from 'react';

import Button from '@atlaskit/button/button';
import ButtonGroup from '@atlaskit/button/button-group';

const ButtonPaddingExample = (): React.JSX.Element => {
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
