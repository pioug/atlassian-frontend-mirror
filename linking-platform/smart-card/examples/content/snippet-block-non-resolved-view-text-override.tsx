import React from 'react';
import { SnippetBlock } from '../../src';
import ExampleContainer from './example-container';
import { SmartLinkStatus } from '../../src/constants';

export default () => (
	<ExampleContainer>
		<SnippetBlock
			status={SmartLinkStatus.Resolving}
			text="This is text that overrides the default null description in a non resolved view."
		/>
	</ExampleContainer>
);
