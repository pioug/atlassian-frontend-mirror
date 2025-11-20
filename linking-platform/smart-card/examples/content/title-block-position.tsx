import React from 'react';

import { SmartLinkPosition, TitleBlock } from '../../src';

import ExampleContainer from './example-container';

export default (): React.JSX.Element => (
	<ExampleContainer>
		<TitleBlock position={SmartLinkPosition.Center} />
	</ExampleContainer>
);
