import React from 'react';

import Tag from '@atlaskit/tag';
import TagGroup from '@atlaskit/tag-group';

export default (): React.JSX.Element => (
	<div>
		<TagGroup label="Basic tags no alignment">
			<Tag text="Base Tag" testId="standard" isRemovable={false} />
			<Tag text="Linked Tag" href="/components/tag" isRemovable={false} />
			<Tag text="Rounded Tag" appearance="rounded" isRemovable={false} />
			<Tag text="Removable button" />
		</TagGroup>
		<TagGroup alignment="end" label="Basic tags with alignment">
			<Tag text="Base Tag" isRemovable={false} />
			<Tag text="Linked Tag" href="/components/tag" isRemovable={false} />
			<Tag text="Rounded Tag" appearance="rounded" isRemovable={false} />
			<Tag text="Removable button" />
		</TagGroup>
	</div>
);
