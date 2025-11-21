import React from 'react';

import Avatar from '@atlaskit/avatar';
import Comment, { CommentAction, CommentAuthor, CommentTime } from '@atlaskit/comment';
import Stack from '@atlaskit/primitives/stack';

import avatarImg from './images/avatar_400x400.jpg';

const getSampleText = () =>
	`Cookie macaroon liquorice. Marshmallow donut lemon drops candy canes marshmallow topping chocolate cake. Croissant pastry soufflé waffle cake fruitcake. Brownie oat cake sugar plum.`;

export default (): React.JSX.Element => (
	<Stack space="space.300">
		{(['small', 'medium', 'large', 'xlarge'] as const).map((size) => (
			<Comment
				key={size}
				author={<CommentAuthor>John Smith</CommentAuthor>}
				avatar={<Avatar src={avatarImg} size={size} />}
				type="Author"
				time={<CommentTime>30, August 2016</CommentTime>}
				content={
					<div>
						<p>{size} avatar</p>
						<p>{getSampleText()}</p>
					</div>
				}
				actions={[
					<CommentAction>Reply</CommentAction>,
					<CommentAction>Edit</CommentAction>,
					<CommentAction>Delete</CommentAction>,
					<CommentAction>Like</CommentAction>,
				]}
			/>
		))}
	</Stack>
);
