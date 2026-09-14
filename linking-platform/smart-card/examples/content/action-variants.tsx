import React from 'react';

import { Inline } from '@atlaskit/primitives/compiled';

import { default as DeleteAction } from '../../src/view/FlexibleCard/components/actions/delete-action';
import { default as EditAction } from '../../src/view/FlexibleCard/components/actions/edit-action';

import ExampleContainer from './example-container';

export default (): React.JSX.Element => (
	<ExampleContainer>
		<Inline space="space.100">
			<EditAction onClick={() => {}} />
			<DeleteAction onClick={() => {}} />
		</Inline>
	</ExampleContainer>
);
