import React from 'react';

import Avatar from '@atlaskit/avatar';
import { Text } from '@atlaskit/primitives';

import Comment, { CommentAction, CommentAuthor, CommentEdited } from '../src';

import avatarImg from './images/avatar_400x400.jpg';

// hard coded for example to show how it looks with time
const getCommentEditTime = () => 'just now';

export default () => (
  <Comment
    avatar={<Avatar src={avatarImg} size="medium" />}
    author={<CommentAuthor>John Smith</CommentAuthor>}
    type="author"
    edited={<CommentEdited>Edited {getCommentEditTime()}</CommentEdited>}
    content={
      <Text>
        Content goes here. This can include <a href="/link">links</a> and other
        content.
      </Text>
    }
    actions={[
      <CommentAction>Reply</CommentAction>,
      <CommentAction>Edit</CommentAction>,
      <CommentAction>Like</CommentAction>,
    ]}
  />
);
