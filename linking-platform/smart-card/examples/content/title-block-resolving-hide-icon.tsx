import React from 'react';

import { TitleBlock } from '../../src';
import { SmartLinkStatus } from '../../src/constants';

import ExampleContainer from './example-container';

export default () => (
	<ExampleContainer>
		<TitleBlock hideIcon={true} status={SmartLinkStatus.Resolving} />
	</ExampleContainer>
);
