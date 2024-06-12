import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';
import Tag, { SimpleTag } from '@atlaskit/tag';
import TagGroup from '@atlaskit/tag-group';

const truncateStyles = xcss({
	width: '80px',
	borderWidth: 'border.width',
	borderStyle: 'solid',
	borderColor: 'color.border.accent.red',
});

export default () => (
	<Box xcss={truncateStyles}>
		<TagGroup>
			<SimpleTag text="Base Tag" testId="standard" />
			<SimpleTag text="Linked Tag" href="/components/tag" />
			<SimpleTag text="Rounded Tag" appearance="rounded" />
			<Tag text="Removable button" removeButtonLabel="Aria label" />
		</TagGroup>
		<TagGroup alignment="end">
			<SimpleTag text="Base Tag" />
			<SimpleTag text="Linked Tag" href="/components/tag" />
			<SimpleTag text="Rounded Tag" appearance="rounded" />
			<Tag text="Removable button" removeButtonLabel="Aria label" />
		</TagGroup>
	</Box>
);
