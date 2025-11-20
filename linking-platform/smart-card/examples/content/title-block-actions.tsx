import React from 'react';

import { ActionName, TitleBlock } from '../../src';

import ExampleContainer from './example-container';

export default (): React.JSX.Element => (
	<ExampleContainer>
		<TitleBlock actions={[{ name: ActionName.EditAction, onClick: () => {} }]} />
	</ExampleContainer>
);
