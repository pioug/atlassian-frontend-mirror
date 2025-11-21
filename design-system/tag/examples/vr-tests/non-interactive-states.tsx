import React from 'react';

import { SimpleTag as Tag } from '@atlaskit/tag';

export default (): React.JSX.Element => (
	<div>
		<Tag text="Non-interactive tag (hovered)" color="standard" testId="nonInteractive-hovered" />
		<Tag text="Non-interactive tag (focused)" color="standard" testId="nonInteractive-focused" />
	</div>
);
