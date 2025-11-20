import React from 'react';

import { TitleBlock } from '../../src';

import ExampleContainer from './example-container';

export default (): React.JSX.Element => (
	<ExampleContainer>
		<TitleBlock anchorTarget="_self" />
	</ExampleContainer>
);
