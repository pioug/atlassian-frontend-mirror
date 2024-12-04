import React from 'react';

import Avatar from '@atlaskit/avatar';
import Comment, { CommentAuthor, CommentEdited, CommentTime } from '@atlaskit/comment';
import { Box, Text } from '@atlaskit/primitives/compiled';

import avatarImg from './images/avatar_400x400.jpg';

export default () => (
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
