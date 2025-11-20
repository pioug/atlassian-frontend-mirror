import React from 'react';

import { SnippetBlock } from '../../src';

import ExampleContainer from './example-container';

export default (): React.JSX.Element => (
	<ExampleContainer>
		<SnippetBlock text="This is text that overrides the default link description." />
	</ExampleContainer>
);
