import React from 'react';

import Tag from '@atlaskit/tag';

export default (): React.JSX.Element => (
	<div>
		<Tag text="Base Tag" testId="standard" isRemovable={false} />
		<Tag text="Linked Tag" testId="linkTag" href="/components/tag" isRemovable={false} />
	</div>
);
