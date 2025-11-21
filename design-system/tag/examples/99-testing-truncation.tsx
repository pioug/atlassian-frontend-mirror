import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import Tag, { SimpleTag } from '@atlaskit/tag';
import TagGroup from '@atlaskit/tag-group';

const truncateStyles = xcss({
	width: '80px',
	borderWidth: 'border.width',
	borderStyle: 'solid',
	borderColor: 'color.border.accent.red',
});

export default (): React.JSX.Element => (
	<Box xcss={truncateStyles} role="group" aria-label="Truncation examples">
		<TagGroup label="Tag types">
			<SimpleTag text="Base Tag" testId="standard" />
			<SimpleTag text="Linked Tag" href="/components/tag" />
			<SimpleTag text="Rounded Tag" appearance="rounded" />
			<Tag text="Removable button" />
		</TagGroup>
		<TagGroup alignment="end" label="Tag types with alignment">
			<SimpleTag text="Base Tag" />
			<SimpleTag text="Linked Tag" href="/components/tag" />
			<SimpleTag text="Rounded Tag" appearance="rounded" />
			<Tag text="Removable button" />
		</TagGroup>
	</Box>
);
