import React from 'react';

import { SimpleTag as Tag } from '@atlaskit/tag';

export default (): React.JSX.Element => (
	<div>
		<Tag text="Non-interactive tag (hovered)" color="blue" testId="nonInteractive-hovered" />
		<Tag text="Non-interactive tag (focused)" color="blue" testId="nonInteractive-focused" />
	</div>
);
