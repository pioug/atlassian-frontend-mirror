import React from 'react';

import Avatar from '@atlaskit/avatar';
import Comment, {
	CommentAction,
	CommentAuthor,
	CommentEdited,
	CommentTime,
} from '@atlaskit/comment';
import Link from '@atlaskit/link';
import { Text } from '@atlaskit/primitives/compiled';

import avatarImg from './images/avatar_400x400.jpg';

export default () => (
	<Comment
		avatar={
			<Avatar src={avatarImg} name="JohnSmithReallllllllyLongName@atlassian.com" size="medium" />
		}
		author={<CommentAuthor>JohnSmithReallllllllyLongName@atlassian.com</CommentAuthor>}
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
	/>
);
