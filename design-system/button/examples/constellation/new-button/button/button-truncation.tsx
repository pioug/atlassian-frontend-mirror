import React from 'react';

import Button from '@atlaskit/button/new';
import { Box, xcss } from '@atlaskit/primitives';

const containerStyles = xcss({
	maxWidth: 'size.1000',
});

const ButtonTruncationExample = () => {
	return (
		<Box xcss={containerStyles}>
			<Button>This text is truncated to fit within the container</Button>
		</Box>
	);
};

export default ButtonTruncationExample;
