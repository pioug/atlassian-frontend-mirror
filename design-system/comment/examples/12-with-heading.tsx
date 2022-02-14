import React from 'react';

import Avatar from '@atlaskit/avatar';

import Comment, { CommentAuthor, CommentEdited, CommentTime } from '../src';

import avatarImg from './utils/sample-avatar.png';

export default () => (
  <div data-testid="comment">
    <Comment
      avatar={<Avatar src={avatarImg} name="John Smith" size="medium" />}
      author={<CommentAuthor>John Smith</CommentAuthor>}
      type="author"
      edited={<CommentEdited>Edited</CommentEdited>}
      restrictedTo="Restricted to Admins Only"
      time={<CommentTime>30 August, 2016</CommentTime>}
      content={<p>Content goes here.</p>}
      headingLevel="3"
    />
  </div>
);
