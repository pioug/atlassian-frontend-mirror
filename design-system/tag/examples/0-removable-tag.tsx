import React from 'react';

import { Box } from '@atlaskit/primitives';
import { RemovableTag as Tag } from '@atlaskit/tag';

export default () => (
	<Box role="group" aria-label="Removable tag examples">
		<Tag text="Removable button" removeButtonLabel="Remove" testId="removableTag" />
		<Tag
			text="Removal halted"
			removeButtonLabel="Remove"
			onBeforeRemoveAction={() => {
				console.log('Removal halted');
				return false;
			}}
		/>
		<Tag
			text="Post Removal Hook"
			removeButtonLabel="Remove"
			onBeforeRemoveAction={() => {
				console.log('Before removal');
				return true;
			}}
			onAfterRemoveAction={(e) => console.log('After removal', e)}
		/>
		<Tag
			text="Removable Tag"
			color="purpleLight"
			testId="removableTagColor"
			removeButtonLabel="Remove"
		/>
	</Box>
);
