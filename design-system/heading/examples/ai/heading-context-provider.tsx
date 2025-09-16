import React from 'react';

import Heading, { HeadingContextProvider } from '@atlaskit/heading';

export default [
	<HeadingContextProvider>
		<Heading size="xxlarge">h1</Heading>
		<Heading size="medium">h2</Heading>
		<Heading size="large">h3</Heading>
	</HeadingContextProvider>,
];
