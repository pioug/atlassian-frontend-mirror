import React from 'react';

import Avatar from '@atlaskit/avatar';

import Comment, { CommentAction, CommentAuthor, CommentTime } from '../src';

import avatarImg from './utils/sample-avatar.png';

export default () => (
  <Comment
    author={<CommentAuthor>John Smith</CommentAuthor>}
    avatar={<Avatar src={avatarImg} />}
    time={<CommentTime>30, August 2016</CommentTime>}
    type="Author"
    isSaving
    content={
      <div>
        <p>The time permalink should be replaced</p>
        <p>You should not be able to see my actions</p>
        <p>Also, this text should be grey!</p>
      </div>
    }
    restrictedTo="Restricted to atlassian-staff"
    actions={[<CommentAction>Like</CommentAction>]}
  />
);
