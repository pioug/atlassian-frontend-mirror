import React from 'react';

import { Card } from '@atlaskit/smart-card';

import CardViewExample from './card-view';
import ExampleContainer from './utils/example-container';

export default () => (
	<ExampleContainer title="BlockCard Views">
		<CardViewExample appearance="block" CardComponent={Card} />
	</ExampleContainer>
);
