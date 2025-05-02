import React from 'react';

import Avatar from '@atlaskit/avatar';
import Comment, {
	CommentAction,
	CommentAuthor,
	CommentEdited,
	CommentTime,
} from '@atlaskit/comment';
import Link from '@atlaskit/link';
import { Box, xcss } from '@atlaskit/primitives';
import { Text } from '@atlaskit/primitives/compiled';

import avatarImg from './images/avatar_400x400.jpg';

const containerStyles = xcss({
	width: '300px',
});

export default () => (
	<Box xcss={containerStyles}>
		<Comment
			avatar={<Avatar src={avatarImg} name="John Smith" size="medium" />}
			author={<CommentAuthor>John Smith</CommentAuthor>}
			type="author"
			edited={<CommentEdited>Edited</CommentEdited>}
			restrictedTo="Restricted to Admins Only"
			time={<CommentTime>30 August, 2016</CommentTime>}
			content={
				<Text as="p">
					Content goes here. This can include <Link href="/link">links</Link> and other content.
				</Text>
			}
			actions={[
				<CommentAction>Reply</CommentAction>,
				<CommentAction>Edit</CommentAction>,
				<CommentAction>Like</CommentAction>,
			]}
			shouldHeaderWrap
		/>
	</Box>
);
