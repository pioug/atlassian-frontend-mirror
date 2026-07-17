import React from 'react';

import Tag from '@atlaskit/tag';

export default (): React.JSX.Element => (
	<div>
		<Tag
			text="Non-interactive tag (hovered)"
			color="standard"
			testId="nonInteractive-hovered"
			isRemovable={false}
		/>
		<Tag
			text="Non-interactive tag (focused)"
			color="standard"
			testId="nonInteractive-focused"
			isRemovable={false}
		/>
	</div>
);
