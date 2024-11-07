import React from 'react';

import Avatar from '@atlaskit/avatar';
import Comment, { CommentAuthor, CommentTime } from '@atlaskit/comment';

import sampleAvatar from '../images/avatar_400x400.jpg';

const CommentCustomHeadingLevelExample = () => {
	return (
		<Comment
			headingLevel="5"
			avatar={<Avatar name="Scott Farquhar" src={sampleAvatar} />}
			author={<CommentAuthor>Scott Farquhar</CommentAuthor>}
			time={<CommentTime>Mar 14, 2024</CommentTime>}
			content={
				<p>
					I’m passionate about our mission to unleash the potential of every team. Teams are so much
					more productive than a single person. If we can increase team bandwidth we can truly
					improve the world.
				</p>
			}
		/>
	);
};

export default CommentCustomHeadingLevelExample;
