import React from 'react';

import Button from '@atlaskit/button/button';
import ButtonGroup from '@atlaskit/button/button-group';

const ButtonGroupDefaultExample = (): React.JSX.Element => {
	return (
		<ButtonGroup label="Default button group">
			<Button appearance="primary">Submit</Button>
			<Button>Cancel</Button>
		</ButtonGroup>
	);
};

export default ButtonGroupDefaultExample;
