import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import { CommentAuthor } from '@atlaskit/comment/author';
import Comment from '@atlaskit/comment/comment';
import { CommentEdited } from '@atlaskit/comment/edited';
import { CommentTime } from '@atlaskit/comment/time';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Text } from '@atlaskit/primitives/compiled/text';

import avatarImg from './images/avatar_400x400.jpg';

export default (): React.JSX.Element => (
	<Box testId="comment">
		<Comment
			avatar={<Avatar src={avatarImg} name="John Smith" size="medium" />}
			author={<CommentAuthor>John Smith</CommentAuthor>}
			type="author"
			edited={<CommentEdited>Edited</CommentEdited>}
			restrictedTo="Restricted to Admins Only"
			time={<CommentTime>30 August, 2016</CommentTime>}
			content={<Text as="p">Content goes here.</Text>}
			headingLevel="5"
		/>
	</Box>
);
