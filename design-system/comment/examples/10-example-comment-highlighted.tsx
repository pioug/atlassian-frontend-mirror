import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import { CommentAction } from '@atlaskit/comment/action-item';
import { CommentAuthor } from '@atlaskit/comment/author';
import Comment from '@atlaskit/comment/comment';
import { CommentEdited } from '@atlaskit/comment/edited';
import { CommentTime } from '@atlaskit/comment/time';
import Link from '@atlaskit/link/link';

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
