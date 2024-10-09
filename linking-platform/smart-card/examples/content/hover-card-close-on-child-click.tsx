import { Box, xcss } from '@atlaskit/primitives';
import React from 'react';

import { Client, Provider } from '../../src';
import { HoverCard } from '../../src/hoverCard';
import ExampleContainer from './example-container';

const boxStyles = xcss({
	backgroundColor: 'color.background.discovery',
	borderColor: 'color.border.discovery',
	borderStyle: 'solid',
	borderRadius: '3px',
	borderWidth: 'border.width',
	padding: 'space.100',
	'::before': {
		content: '"✨"',
		paddingInlineEnd: 'space.050',
	},
	'::after': {
		content: '"✨"',
		paddingInlineStart: 'space.050',
	},
});

export default () => (
	<ExampleContainer>
		<Provider client={new Client('staging')}>
			<HoverCard url="https://www.atlassian.com/" closeOnChildClick={true}>
				<Box xcss={boxStyles}>Hover over me</Box>
			</HoverCard>
		</Provider>
	</ExampleContainer>
);
