import React from 'react';

import Comment from '@atlaskit/comment';

const Example = (): React.JSX.Element => (
	<Comment
		author="Bob Johnson"
		time="30 minutes ago"
		content="Another comment in the thread"
		avatar="https://picsum.photos/32/32"
	/>
);
export default Example;
