import React from 'react';

import Avatar from '@atlaskit/avatar';
import Comment, {
	CommentAction,
	CommentAuthor,
	CommentEdited,
	CommentTime,
} from '@atlaskit/comment';

import sampleAvatar from '../images/avatar_400x400.jpg';

const CommentFullExample = () => {
	return (
		<Comment
			avatar={<Avatar name="Scott Farquhar" src={sampleAvatar} />}
			author={<CommentAuthor>Scott Farquhar</CommentAuthor>}
			type="author"
			edited={<CommentEdited>Edited</CommentEdited>}
			restrictedTo="Restricted to Admins Only"
			time={<CommentTime>Mar 14, 2024</CommentTime>}
			content={
				<p>
					During COVID we took a big bet on remote work. It made sense, as we already had employees
					in 10+ countries. Today, the majority of hires live over 2hrs from an office and these
					amazing, talented people couldn't work for us otherwise. Proud to be recognized as a great
					place to work.
				</p>
			}
			actions={[
				<CommentAction>Reply</CommentAction>,
				<CommentAction>Edit</CommentAction>,
				<CommentAction>Like</CommentAction>,
			]}
		/>
	);
};

export default CommentFullExample;
