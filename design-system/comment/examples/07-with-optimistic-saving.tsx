import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import { CommentAction } from '@atlaskit/comment/action-item';
import { CommentAuthor } from '@atlaskit/comment/author';
import Comment from '@atlaskit/comment/comment';
import { CommentTime } from '@atlaskit/comment/time';

import avatarImg from './images/avatar_400x400.jpg';

export default (): React.JSX.Element => (
	<Comment
		author={<CommentAuthor>John Smith</CommentAuthor>}
		avatar={<Avatar src={avatarImg} />}
		time={<CommentTime>30, August 2016</CommentTime>}
		type="Author"
		isSaving
		content={
			<div>
				<p>The time permalink should be replaced</p>
				<p>You should not be able to see my actions</p>
				<p>Also, this text should be grey!</p>
			</div>
		}
		restrictedTo="Restricted to atlassian-staff"
		actions={[<CommentAction>Like</CommentAction>]}
	/>
);
