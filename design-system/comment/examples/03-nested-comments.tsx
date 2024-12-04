import React, { type FC, type ReactNode } from 'react';

import Avatar from '@atlaskit/avatar';
import Comment, { CommentAction, CommentAuthor } from '@atlaskit/comment';
import { Box, Text } from '@atlaskit/primitives/compiled';

import avatarImg from './images/avatar_400x400.jpg';

const ExampleComment: FC<{ isHighlighted?: boolean; children?: ReactNode }> = ({
	children,
	isHighlighted,
}) => (
	<Comment
		highlighted={isHighlighted}
		avatar={<Avatar src={avatarImg} size="medium" />}
		author={<CommentAuthor href="/author">John Smith</CommentAuthor>}
		content={<Text as="p">This comment is so generic it can be repeated</Text>}
		actions={[<CommentAction>Edit</CommentAction>, <CommentAction>Delete</CommentAction>]}
	>
		{children}
	</Comment>
);

export default () => (
	<Box padding="space.200" testId="nested">
		<ExampleComment isHighlighted>
			<ExampleComment>
				<ExampleComment />
				<ExampleComment isHighlighted />
				<ExampleComment />
			</ExampleComment>
		</ExampleComment>
	</Box>
);
