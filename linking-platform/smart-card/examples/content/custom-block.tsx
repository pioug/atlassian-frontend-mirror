import React from 'react';

import { Box } from '@atlaskit/primitives/compiled';

import { CustomBlock } from '../../src';

import ExampleContainer from './example-container';

export default () => {
	return (
		<ExampleContainer>
			<CustomBlock>
				<Box>Block 1</Box>
				<Box>Block 2</Box>
				<Box>Block 3</Box>
			</CustomBlock>
		</ExampleContainer>
	);
};
