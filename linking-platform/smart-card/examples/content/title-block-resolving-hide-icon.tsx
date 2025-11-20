import React from 'react';

import { TitleBlock } from '../../src';
import { SmartLinkStatus } from '../../src/constants';
import { FlexibleCardContext } from '../../src/state/flexible-ui-context';

import ExampleContainer from './example-container';

export default (): React.JSX.Element => (
	<ExampleContainer>
		<FlexibleCardContext.Provider value={{ status: SmartLinkStatus.Resolving }}>
			<TitleBlock hideIcon={true} />
		</FlexibleCardContext.Provider>
	</ExampleContainer>
);
