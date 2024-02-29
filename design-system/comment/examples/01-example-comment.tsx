import React from 'react';

import Avatar from '@atlaskit/avatar';
import { Text } from '@atlaskit/primitives';

import Comment, {
  CommentAction,
  CommentAuthor,
  CommentEdited,
  CommentTime,
} from '../src';

import avatarImg from './images/avatar_400x400.jpg';

export default () => (
  <div data-testid="comment">
    <Comment
      avatar={<Avatar src={avatarImg} name="John Smith" size="medium" />}
      author={<CommentAuthor>John Smith</CommentAuthor>}
      type="author"
      edited={<CommentEdited>Edited</CommentEdited>}
      restrictedTo="Restricted to Admins Only"
      time={<CommentTime>30 August, 2016</CommentTime>}
      content={
        <Text as="p">
          Content goes here. This can include <a href="/link">links</a> and
          other content.
        </Text>
      }
      actions={[
        <CommentAction>Reply</CommentAction>,
        <CommentAction>Edit</CommentAction>,
        <CommentAction>Like</CommentAction>,
      ]}
    />
  </div>
);
