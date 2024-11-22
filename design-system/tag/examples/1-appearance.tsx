import React from 'react';

import Avatar from '@atlaskit/avatar';
import { Box } from '@atlaskit/primitives';
import { RemovableTag, SimpleTag as Tag } from '@atlaskit/tag';

export default () => (
	<Box id="appearance" role="group" aria-label="Appearance examples">
		<Tag text="Base Tag" appearance="rounded" />
		<Tag
			appearance="rounded"
			text="Avatar Before"
			elemBefore={<Avatar borderColor="transparent" size="xsmall" />}
		/>
		<RemovableTag
			appearance="rounded"
			text="Avatar Before"
			testId="avatarTag"
			elemBefore={<Avatar borderColor="transparent" size="xsmall" />}
		/>
		<Tag text="Linked Tag" href="/components/tag" appearance="rounded" />
	</Box>
);
