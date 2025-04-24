import React from 'react';

import { Inline } from '@atlaskit/primitives/compiled';

import { DeleteAction, EditAction } from '../../src/view/FlexibleCard/components/actions';

import ExampleContainer from './example-container';

export default () => (
	<ExampleContainer>
		<Inline space="space.100">
			<EditAction onClick={() => {}} />
			<DeleteAction onClick={() => {}} />
		</Inline>
	</ExampleContainer>
);
