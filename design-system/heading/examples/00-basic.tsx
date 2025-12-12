import React from 'react';

import Heading from '@atlaskit/heading';
import { Stack } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => {
	return (
		<Stack testId="headings" space="space.100">
			<Heading size="xxlarge" testId="heading-xxlarge">
				xxlarge
			</Heading>
			<Heading size="xlarge">xlarge</Heading>
			<Heading size="large">large</Heading>
			<Heading size="medium">medium</Heading>
			<Heading size="small">small</Heading>
			<Heading size="xsmall">xsmall</Heading>
			<Heading size="xxsmall">xxsmall</Heading>
		</Stack>
	);
};
