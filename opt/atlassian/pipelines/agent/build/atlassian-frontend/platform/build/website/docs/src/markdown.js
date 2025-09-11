import React from 'react';
import defaultMD from 'react-markings';
import Code from '@atlaskit/code/inline';
import Heading from '@atlaskit/heading';
import { Box } from '@atlaskit/primitives/compiled';

// Tweak the styling
export const md = defaultMD.customize({
	renderers: {
		// Add a darker background to code elements
		code: (props) => <Code>{props.children}</Code>,

		// Improve the spacing for heading elements
		heading: ({ level, children }) => (
			<>
				<Box paddingBlock={levelToSpace[level]} />
				{/* Using this box as a margin (eeeeek)*/}
				<Heading size={levelToSize[level]}>{children}</Heading>
			</>
		),
	},
});

const levelToSize = ['xxlarge', 'xlarge', 'large', 'medium', 'small', 'xsmall', 'xxsmall'];
const levelToSpace = [
	'space.200',
	'space.200',
	'space.150',
	'space.100',
	'space.75',
	'space.50',
	'space.25',
];
