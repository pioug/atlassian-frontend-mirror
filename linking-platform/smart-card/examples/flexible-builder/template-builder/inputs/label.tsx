import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';
const excludeStyles = xcss({
	color: 'color.text.disabled',
});

const Label = ({ content, exclude }: { content?: string; exclude?: boolean }) => (
	<Box xcss={exclude && excludeStyles}>{content}</Box>
);

export default Label;
