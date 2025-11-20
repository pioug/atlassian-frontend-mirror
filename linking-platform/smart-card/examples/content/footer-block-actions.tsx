import React from 'react';

import { ActionName, FooterBlock } from '../../src';

import ExampleContainer from './example-container';

export default (): React.JSX.Element => (
	<ExampleContainer>
		<FooterBlock actions={[{ name: ActionName.EditAction, onClick: () => {} }]} />
	</ExampleContainer>
);
