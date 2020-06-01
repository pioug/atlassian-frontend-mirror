import React from 'react';

import Avatar from '@atlaskit/avatar';

import Comment, { CommentAction, CommentAuthor, CommentEdited } from '../src';

import avatarImg from './utils/sample-avatar.png';

// hard coded for example to show how it looks with time
const getCommentEditTime = () => 'just now';

export default () => (
  <div>
    <Comment
      avatar={<Avatar src={avatarImg} size="medium" />}
      author={<CommentAuthor>John Smith</CommentAuthor>}
      type="author"
      edited={<CommentEdited>Edited {getCommentEditTime()}</CommentEdited>}
      content={
        <p>
          Content goes here. This can include <a href="/link">links</a> and
          other content.
        </p>
      }
      actions={[
        <CommentAction>Reply</CommentAction>,
        <CommentAction>Edit</CommentAction>,
        <CommentAction>Like</CommentAction>,
      ]}
    />
  </div>
);
