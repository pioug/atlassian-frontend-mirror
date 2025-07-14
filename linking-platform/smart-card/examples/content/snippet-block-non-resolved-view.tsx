import React from 'react';

import { SnippetBlock } from '../../src';
import { SmartLinkStatus } from '../../src/constants';
import { FlexibleCardContext } from '../../src/state/flexible-ui-context';

import ExampleContainer from './example-container';

export default () => (
	<ExampleContainer>
		<FlexibleCardContext.Provider value={{ status: SmartLinkStatus.Resolving }}>
			<SnippetBlock />
		</FlexibleCardContext.Provider>
	</ExampleContainer>
);
