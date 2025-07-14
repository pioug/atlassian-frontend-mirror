import React from 'react';

import { SnippetBlock } from '../../src';
import { SmartLinkStatus } from '../../src/constants';
import { FlexibleCardContext } from '../../src/state/flexible-ui-context';

import ExampleContainer from './example-container';

export default () => (
	<ExampleContainer>
		<FlexibleCardContext.Provider value={{ status: SmartLinkStatus.Resolving }}>
			<SnippetBlock text="This is text that overrides the default null description in a non resolved view." />
		</FlexibleCardContext.Provider>
	</ExampleContainer>
);
