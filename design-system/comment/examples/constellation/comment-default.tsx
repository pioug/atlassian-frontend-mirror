import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import { CommentAuthor } from '@atlaskit/comment/author';
import Comment from '@atlaskit/comment/comment';
import { CommentEdited } from '@atlaskit/comment/edited';
import { CommentTime } from '@atlaskit/comment/time';

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
