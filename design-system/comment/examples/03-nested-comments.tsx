import React, { FC } from 'react';

import Avatar from '@atlaskit/avatar';

import Comment, { CommentAuthor } from '../src';

import avatarImg from './utils/sample-avatar';

const ExampleComment: FC = ({ children }) => (
  <Comment
    avatar={<Avatar src={avatarImg} size="medium" />}
    author={<CommentAuthor href="/author">John Smith</CommentAuthor>}
    content={<p>This comment is so generic it can be repeated</p>}
  >
    {children}
  </Comment>
);

export default () => (
  <div>
    <ExampleComment>
      <ExampleComment />
      <ExampleComment />
    </ExampleComment>
  </div>
);
