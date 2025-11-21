import React from 'react';

import Tag, { SimpleTag } from '@atlaskit/tag';
import TagGroup from '@atlaskit/tag-group';

export default (): React.JSX.Element => (
	<div>
		<h2 id="group-label">Tags with labels for remove button</h2>
		<TagGroup titleId="group-label" alignment="start">
			<SimpleTag text="Base Tag" />
			<SimpleTag text="Linked Tag" href="/components/tag" />
			<SimpleTag text="Rounded Tag" appearance="rounded" />
			<Tag text="Dog tag" removeButtonLabel="Delete" />
			<Tag text="Cat tag" removeButtonLabel="Delete" />
			<Tag text="Mouse tag" removeButtonLabel="Delete" />
		</TagGroup>
	</div>
);
