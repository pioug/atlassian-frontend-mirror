import React from 'react';

import { Stack } from '@atlaskit/primitives';

import Heading from '../../src';

export default () => {
	return (
		<Stack testId="headings" space="space.100">
			<Heading size="xxlarge">XXLarge (I'm h1)</Heading>
			<Heading size="xlarge">Xarge (I'm h1)</Heading>
			<Heading size="large">Large (I'm h2)</Heading>
			<Heading size="medium">Medium (I'm h3)</Heading>
			<Heading size="small">Small (I'm h4)</Heading>
			<Heading size="xsmall">XSmall (I'm h5)</Heading>
			<Heading size="xxsmall">XXSmall (I'm h6)</Heading>
		</Stack>
	);
};
