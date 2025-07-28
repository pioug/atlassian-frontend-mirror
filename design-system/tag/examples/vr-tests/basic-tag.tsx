import React from 'react';

import { SimpleTag as Tag } from '@atlaskit/tag';

export default () => (
	<div>
		<Tag text="Base Tag" testId="standard" />
		<Tag text="Linked Tag" testId="linkTag" href="/components/tag" />
	</div>
);
