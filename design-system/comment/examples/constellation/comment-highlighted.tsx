import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import { CommentAuthor } from '@atlaskit/comment/author';
import Comment from '@atlaskit/comment/comment';
import { CommentTime } from '@atlaskit/comment/time';

import sampleAvatar from '../images/avatar_400x400.jpg';

const CommentHighlightedExample = (): React.JSX.Element => {
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
