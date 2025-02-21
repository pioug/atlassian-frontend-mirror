import React from 'react';

import { Box } from '@atlaskit/primitives/compiled';

const SSRTestingExample = () => {
	return (
		<Box id="ssr-example">
			<Box id="ssr"></Box>
			<Box id="hydrated"></Box>
		</Box>
	);
};

export default SSRTestingExample;
