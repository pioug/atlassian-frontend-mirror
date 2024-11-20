import React from 'react';

import Tag, { SimpleTag } from '@atlaskit/tag';
import TagGroup from '@atlaskit/tag-group';

export default () => (
	<div>
		<TagGroup label="Basic tags no alignment">
			<SimpleTag text="Base Tag" testId="standard" />
			<SimpleTag text="Linked Tag" href="/components/tag" />
			<SimpleTag text="Rounded Tag" appearance="rounded" />
			<Tag text="Removable button" />
		</TagGroup>
		<TagGroup alignment="end" label="Basic tags with alignment">
			<SimpleTag text="Base Tag" />
			<SimpleTag text="Linked Tag" href="/components/tag" />
			<SimpleTag text="Rounded Tag" appearance="rounded" />
			<Tag text="Removable button" />
		</TagGroup>
	</div>
);
