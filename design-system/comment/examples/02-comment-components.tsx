import React from 'react';

import { CommentAction } from '@atlaskit/comment/action-item';
import { CommentAuthor } from '@atlaskit/comment/author';
import { CommentEdited } from '@atlaskit/comment/edited';
import { CommentTime } from '@atlaskit/comment/time';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- TODO: migrate to @atlaskit/primitives/compiled
import Stack from '@atlaskit/primitives/stack';

export default (): React.JSX.Element => (
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
