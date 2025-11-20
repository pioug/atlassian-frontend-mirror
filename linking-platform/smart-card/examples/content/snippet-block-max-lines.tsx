import React from 'react';

import { SnippetBlock } from '../../src';

import ExampleContainer from './example-container';

export default (): React.JSX.Element => (
	<ExampleContainer>
		<SnippetBlock maxLines={1} />
	</ExampleContainer>
);
