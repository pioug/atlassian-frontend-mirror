import React from 'react';

import { Stack } from '@atlaskit/primitives';

import Heading from '../../src';

export default () => {
	return (
		<Stack testId="headings" space="space.100">
			<Heading size="xxlarge">Heading XXLarge</Heading>
			<Heading size="xlarge">Heading XLarge</Heading>
			<Heading size="large">Heading Large</Heading>
			<Heading size="medium">Heading Medium</Heading>
			<Heading size="small">Heading Small</Heading>
			<Heading size="xsmall">Heading XSmall</Heading>
			<Heading size="xxsmall">Heading XXSmall</Heading>
		</Stack>
	);
};
