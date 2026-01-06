import React from 'react';

import Avatar from '@atlaskit/avatar';

const Examples = (): React.JSX.Element => (
	<>
		<Avatar src="https://example.com/avatar.jpg" name="John Doe" />
		<Avatar name="Jane Smith" appearance="hexagon" size="large" status="locked" />
		<Avatar
			name="Bob Wilson"
			appearance="square"
			size="small"
			presence="online"
			status="approved"
		/>
	</>
);
export default Examples;
