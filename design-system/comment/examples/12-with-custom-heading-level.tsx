import React from 'react';

import Avatar from '@atlaskit/avatar';
import { UNSAFE_Text as Text } from '@atlaskit/ds-explorations';
import Box from '@atlaskit/primitives/box';

import Comment, { CommentAuthor, CommentEdited, CommentTime } from '../src';

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
