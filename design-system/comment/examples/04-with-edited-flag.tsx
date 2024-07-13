import React from 'react';

import Avatar from '@atlaskit/avatar';
import Link from '@atlaskit/link';
import { Text } from '@atlaskit/primitives';

import Comment, { CommentAction, CommentAuthor, CommentEdited } from '../src';

import avatarImg from './images/avatar_400x400.jpg';

// hard coded for example to show how it looks with time
const getCommentEditTime = () => 'just now';

export default () => (
	<Comment
		avatar={<Avatar src={avatarImg} size="medium" />}
		author={<CommentAuthor>John Smith</CommentAuthor>}
		type="author"
		edited={<CommentEdited>Edited {getCommentEditTime()}</CommentEdited>}
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
