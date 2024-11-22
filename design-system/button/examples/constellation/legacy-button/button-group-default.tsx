import React from 'react';

import Button, { ButtonGroup } from '@atlaskit/button';

const ButtonGroupDefaultExample = () => {
	return (
		<ButtonGroup label="Default button group">
			<Button appearance="primary">Submit</Button>
			<Button>Cancel</Button>
		</ButtonGroup>
	);
};

export default ButtonGroupDefaultExample;
