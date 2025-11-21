import React from 'react';

import Avatar from '@atlaskit/avatar';
import Tag from '@atlaskit/tag';

export default (): React.JSX.Element => (
	<Tag
		appearance="rounded"
		removeButtonLabel="Remove"
		text="Round removable link"
		href="/components/tag"
		elemBefore={<Avatar borderColor="transparent" size="xsmall" />}
	/>
);
