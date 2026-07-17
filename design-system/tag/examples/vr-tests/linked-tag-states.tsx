import React from 'react';

import Tag from '@atlaskit/tag';

export default (): React.JSX.Element => (
	<div>
		<Tag text="Linked Tag" testId="linkTag-hover" href="/components/tag" isRemovable={false} />
		<Tag text="Linked Tag" testId="linkTag-focus" href="/components/tag" isRemovable={false} />
	</div>
);
