import React from 'react';

import { Stack } from '@atlaskit/primitives/compiled';
import Tag from '@atlaskit/tag';

export default (): React.JSX.Element => (
	<Stack space="space.100">
		<Tag text="This is a tag with a very long text that will be truncated" />
		<Tag text="This is a tag with a very long text that will be truncated" maxWidth="300px" />
		<Tag text="This is a tag with a very long text that will be truncated" maxWidth="100px" />
	</Stack>
);
