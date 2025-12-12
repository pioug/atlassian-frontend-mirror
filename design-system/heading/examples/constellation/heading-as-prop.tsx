import React from 'react';

import Heading from '@atlaskit/heading';
import { Stack } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => {
	return (
		<Stack testId="headings" space="space.100">
			<Heading size="medium" as="h1">
				Medium heading that will render as a h1
			</Heading>
		</Stack>
	);
};
