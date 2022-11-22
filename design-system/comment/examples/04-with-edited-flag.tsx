/* eslint-disable @repo/internal/react/use-primitives */
import React from 'react';

import Avatar from '@atlaskit/avatar';
import { UNSAFE_Text as Text } from '@atlaskit/ds-explorations';

import Comment, { CommentAction, CommentAuthor, CommentEdited } from '../src';

import avatarImg from './utils/sample-avatar';

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
