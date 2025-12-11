import React from 'react';

import Button, { ButtonGroup } from '@atlaskit/button';

const ButtonGroupDefaultExample = (): React.JSX.Element => {
	return (
		<ButtonGroup label="Default button group">
			<Button appearance="primary">Submit</Button>
			<Button>Cancel</Button>
		</ButtonGroup>
	);
};

export default ButtonGroupDefaultExample;
