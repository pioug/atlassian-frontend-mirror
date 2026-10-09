import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import { CommentAction } from '@atlaskit/comment/action-item';
import { CommentAuthor } from '@atlaskit/comment/author';
import Comment from '@atlaskit/comment/comment';
import { CommentEdited } from '@atlaskit/comment/edited';
import Link from '@atlaskit/link/link';
import { Text } from '@atlaskit/primitives/compiled/text';

import avatarImg from './images/avatar_400x400.jpg';

// hard coded for example to show how it looks with time
const getCommentEditTime = () => 'just now';

export default (): React.JSX.Element => (
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
