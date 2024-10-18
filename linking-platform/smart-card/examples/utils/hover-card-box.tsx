import { Box, xcss } from '@atlaskit/primitives';
import React from 'react';

const boxStyles = xcss({
	backgroundColor: 'color.background.information',
	borderColor: 'color.border.information',
	borderStyle: 'solid',
	borderRadius: '3px',
	borderWidth: 'border.width',
	padding: 'space.100',
	textAlign: 'center',
	'::before': {
		content: '"✨"',
		paddingInlineEnd: 'space.050',
	},
	'::after': {
		content: '"✨"',
		paddingInlineStart: 'space.050',
	},
});

export default ({ content = 'Hover over me' }) => <Box xcss={boxStyles}>{content}</Box>;
