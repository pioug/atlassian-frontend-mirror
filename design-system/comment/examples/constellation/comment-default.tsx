import React from 'react';

import Avatar from '@atlaskit/avatar';
import Comment, { CommentAuthor, CommentEdited, CommentTime } from '@atlaskit/comment';

import sampleAvatar from '../images/avatar_400x400.jpg';

const CommentDefaultExample = (): React.JSX.Element => {
	return (
		<Comment
			avatar={<Avatar name="Scott Farquhar" src={sampleAvatar} />}
			author={<CommentAuthor>Scott Farquhar</CommentAuthor>}
			edited={<CommentEdited>Edited</CommentEdited>}
			time={<CommentTime>Jul 3, 2020</CommentTime>}
			content={
				<p>
					I'm super proud that 69% of our almost 5,000 Atlassian employees donated their time for
					volunteering in the last year. Thanks team!
				</p>
			}
		/>
	);
};

export default CommentDefaultExample;
