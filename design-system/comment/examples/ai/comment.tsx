import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import Comment from '@atlaskit/comment/comment';

const Example = (): React.JSX.Element => (
	<Comment
		author="Bob Johnson"
		time="30 minutes ago"
		content="Another comment in the thread"
		avatar={<Avatar name="Bob Johnson" />}
	/>
);
export default Example;
