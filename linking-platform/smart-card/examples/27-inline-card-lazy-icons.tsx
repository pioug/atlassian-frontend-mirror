import React from 'react';

import { Stack } from '@atlaskit/primitives/compiled';
import { Card } from '@atlaskit/smart-card';

import ExampleContainer from './utils/example-container';
import { InlineCardIcons } from './utils/inline-card-icons';

export default (): React.JSX.Element => (
	<ExampleContainer title="InlineCard Lazy Icons">
		<Stack>
			<InlineCardIcons CardComponent={Card} />
		</Stack>
	</ExampleContainer>
);
