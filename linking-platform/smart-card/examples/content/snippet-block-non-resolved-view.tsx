import React from 'react';

import { SnippetBlock } from '../../src';
import { SmartLinkStatus } from '../../src/constants';

import ExampleContainer from './example-container';

export default () => (
	<ExampleContainer>
		<SnippetBlock status={SmartLinkStatus.Resolving} />
	</ExampleContainer>
);
