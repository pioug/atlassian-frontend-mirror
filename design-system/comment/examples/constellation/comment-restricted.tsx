import React from 'react';

import Avatar from '@atlaskit/avatar';
import Comment, { CommentAuthor } from '@atlaskit/comment';

import sampleAvatar from '../images/avatar_400x400.jpg';

const CommentDefaultExample = (): React.JSX.Element => {
	return (
		<Comment
			restrictedTo="Restricted to Admins"
			avatar={<Avatar name="Scott Farquhar" src={sampleAvatar} />}
			author={<CommentAuthor>Scott Farquhar</CommentAuthor>}
			content={
				<p>
					I’ve seen first-hand how making it easy for employees to volunteer builds a stronger
					culture. It’s a great way to invest in your company and your community at the same time.
				</p>
			}
		/>
	);
};

export default CommentDefaultExample;
