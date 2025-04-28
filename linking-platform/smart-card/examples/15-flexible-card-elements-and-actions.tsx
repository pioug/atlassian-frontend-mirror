import React from 'react';

import CustomExample from '../docs/utils/custom-example';

import ExampleContainer from './utils/example-container';

export default () => (
	<ExampleContainer title="FlexibleCard elements and actions">
		<CustomExample
			Component={require('./content/ui-options-remove-block-restriction').default}
			source={require('!!raw-loader!./content/ui-options-remove-block-restriction')}
		/>
	</ExampleContainer>
);
