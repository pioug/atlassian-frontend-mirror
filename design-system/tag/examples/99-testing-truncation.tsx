import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import Tag from '@atlaskit/tag';
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
			<Tag text="Base Tag" testId="standard" isRemovable={false} />
			<Tag text="Linked Tag" href="/components/tag" isRemovable={false} />
			<Tag text="Rounded Tag" appearance="rounded" isRemovable={false} />
			<Tag text="Removable button" />
		</TagGroup>
		<TagGroup alignment="end" label="Tag types with alignment">
			<Tag text="Base Tag" isRemovable={false} />
			<Tag text="Linked Tag" href="/components/tag" isRemovable={false} />
			<Tag text="Rounded Tag" appearance="rounded" isRemovable={false} />
			<Tag text="Removable button" />
		</TagGroup>
	</Box>
);
