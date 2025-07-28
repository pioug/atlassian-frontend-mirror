import React from 'react';

import { Box } from '@atlaskit/primitives/compiled';
import { RemovableTag as Tag } from '@atlaskit/tag';

export default () => (
	<Box role="group" aria-label="Removable tag state examples">
		<Tag text="Removable button" removeButtonLabel="Remove" testId="removableTag" />
		<Tag
			text="Removable Tag"
			color="purpleLight"
			testId="removableTagColor"
			removeButtonLabel="Remove"
		/>
	</Box>
);
