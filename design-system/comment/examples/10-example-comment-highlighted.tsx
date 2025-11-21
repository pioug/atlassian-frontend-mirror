import React from 'react';

import Avatar from '@atlaskit/avatar';
import Comment, {
	CommentAction,
	CommentAuthor,
	CommentEdited,
	CommentTime,
} from '@atlaskit/comment';
import Link from '@atlaskit/link';

import avatarImg from './images/avatar_400x400.jpg';

export default (): React.JSX.Element => (
	<Comment
		avatar={<Avatar src={avatarImg} size="medium" />}
		author={<CommentAuthor>John Smith</CommentAuthor>}
		type="author"
		highlighted
		edited={<CommentEdited>Edited</CommentEdited>}
		restrictedTo="Restricted to Admins Only"
		time={<CommentTime>30 August, 2016</CommentTime>}
		content={
			<p>
				Content goes here. This can include <Link href="/link">links</Link> and other content.
			</p>
		}
		actions={[
			<CommentAction>Reply</CommentAction>,
			<CommentAction>Edit</CommentAction>,
			<CommentAction>Like</CommentAction>,
		]}
	/>
);
