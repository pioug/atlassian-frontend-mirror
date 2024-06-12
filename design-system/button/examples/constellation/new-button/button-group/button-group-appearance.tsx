import React from 'react';

import { ButtonGroup } from '../../../../src';
import Button from '../../../../src/new';

const ButtonGroupAppearanceExample = () => {
	return (
		<ButtonGroup appearance="primary">
			<Button>First button</Button>
			<Button>Second button</Button>
			<Button>Third button</Button>
		</ButtonGroup>
	);
};

export default ButtonGroupAppearanceExample;
