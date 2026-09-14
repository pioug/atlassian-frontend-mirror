import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import { Box } from '@atlaskit/primitives/compiled';
import Tag from '@atlaskit/tag/removable-tag';

export default (): React.JSX.Element => (
	<Box role="group" aria-label="Removable avatar tag examples">
		<Tag
			appearance="rounded"
			text="Avatar Before"
			testId="avatarTag"
			elemBefore={<Avatar borderColor="transparent" size="xxsmall" />}
		/>
		<Tag
			appearance="rounded"
			text="Avatar Before Focused"
			testId="avatarTag-focused"
			elemBefore={<Avatar borderColor="transparent" size="xxsmall" />}
		/>
	</Box>
);
