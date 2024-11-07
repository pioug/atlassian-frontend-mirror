import React from 'react';

import Avatar from '@atlaskit/avatar';
import Comment, { CommentAuthor, CommentTime } from '@atlaskit/comment';

import sampleAvatar from '../images/avatar_400x400.jpg';

const CommentHighlightedExample = () => {
	return (
		<Comment
			highlighted
			avatar={<Avatar name="Scott Farquhar" src={sampleAvatar} />}
			author={<CommentAuthor>Scott Farquhar</CommentAuthor>}
			time={<CommentTime>Mar 14, 2024</CommentTime>}
			content={
				<p>
					Atlassian employees choose everyday where and how they want to work - we call it Team
					Anywhere. This has been key for our continued growth.
				</p>
			}
		/>
	);
};

export default CommentHighlightedExample;
