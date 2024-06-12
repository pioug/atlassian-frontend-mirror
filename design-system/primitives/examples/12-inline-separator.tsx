import React from 'react';

import { Box, Inline } from '../src';

export default () => (
	<Box testId="inline-example" padding="space.100">
		<Inline space="space.150" separator="/">
			<a href="/">breadcrumbs</a>
			<a href="/">for</a>
			<a href="/">some</a>
			<a href="/">sub</a>
			<a href="/">page</a>
		</Inline>
	</Box>
);
