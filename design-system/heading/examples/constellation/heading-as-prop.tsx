import React from 'react';

import { Stack } from '@atlaskit/primitives';

import Heading from '../../src';

export default () => {
	return (
		<Stack testId="headings" space="space.100">
			<Heading size="medium" as="h1">
				Medium heading that will render as a h1
			</Heading>
		</Stack>
	);
};
