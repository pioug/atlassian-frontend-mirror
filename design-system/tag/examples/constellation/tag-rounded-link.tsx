import React from 'react';

import Avatar from '@atlaskit/avatar';
import Tag from '@atlaskit/tag';

export default () => (
	<Tag
		appearance="rounded"
		removeButtonLabel="Remove"
		text="Round removable link"
		href="/components/tag"
		elemBefore={<Avatar borderColor="transparent" size="xsmall" />}
	/>
);
