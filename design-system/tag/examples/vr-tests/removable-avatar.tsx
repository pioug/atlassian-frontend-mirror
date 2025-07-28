import React from 'react';

import Avatar from '@atlaskit/avatar';
import { Box } from '@atlaskit/primitives/compiled';
import { RemovableTag } from '@atlaskit/tag';

export default () => (
	<Box role="group" aria-label="Removable avatar tag examples">
		<RemovableTag
			appearance="rounded"
			text="Avatar Before"
			testId="avatarTag"
			elemBefore={<Avatar borderColor="transparent" size="xsmall" />}
		/>
		<RemovableTag
			appearance="rounded"
			text="Avatar Before Focused"
			testId="avatarTag-focused"
			elemBefore={<Avatar borderColor="transparent" size="xsmall" />}
		/>
	</Box>
);
