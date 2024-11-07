import React from 'react';

import { CommentAction, CommentAuthor, CommentEdited, CommentTime } from '@atlaskit/comment';
import Stack from '@atlaskit/primitives/stack';

export default () => (
	<Stack space="space.100">
		<CommentAuthor href="/author">John Smith</CommentAuthor>
		<CommentTime>30 August, 2016</CommentTime>
		<CommentEdited>Edited</CommentEdited>
		<CommentAction
			onClick={(e: React.MouseEvent<HTMLElement>) => {
				const element = e.target as HTMLElement;
				return console.log(element.textContent);
			}}
		>
			Like
		</CommentAction>
	</Stack>
);
