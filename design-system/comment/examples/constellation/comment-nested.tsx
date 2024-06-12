import React from 'react';

import Avatar from '@atlaskit/avatar';

import Comment, { CommentAction, CommentAuthor, CommentTime } from '../../src';
import sampleAvatar from '../images/avatar_400x400.jpg';

const CommentNestedExample = () => {
	return (
		<Comment
			avatar={<Avatar name="Scott Farquhar" src={sampleAvatar} />}
			author={<CommentAuthor>Scott Farquhar</CommentAuthor>}
			type="author"
			time={<CommentTime>Jun 3, 2022</CommentTime>}
			content={
				<p>
					Hard to believe it’s been 20 years since we started Atlassian, but we’re just getting
					started!
				</p>
			}
			actions={[
				<CommentAction>Reply</CommentAction>,
				<CommentAction>Edit</CommentAction>,
				<CommentAction>Like</CommentAction>,
			]}
		>
			<Comment
				avatar={<Avatar name="John Smith" />}
				author={<CommentAuthor>John Smith</CommentAuthor>}
				time={<CommentTime>Jun 3, 2022</CommentTime>}
				content={<p>Congratulations!</p>}
				actions={[<CommentAction>Reply</CommentAction>, <CommentAction>Like</CommentAction>]}
			>
				<Comment
					avatar={<Avatar name="Sabina Vu" />}
					author={<CommentAuthor>Sabina Vu</CommentAuthor>}
					time={<CommentTime>Jun 4, 2022</CommentTime>}
					content={<p>I wonder what Atlassian will be like 20 years from now?</p>}
					actions={[<CommentAction>Reply</CommentAction>, <CommentAction>Like</CommentAction>]}
				/>
			</Comment>
		</Comment>
	);
};

export default CommentNestedExample;
