import React, { ReactNode } from 'react';
import Avatar from '@atlaskit/avatar';
import Comment, { CommentAuthor } from '../src';
import avatarImg from './utils/sample-avatar.png';

interface Props {
  children?: ReactNode;
}

const ExampleComment = ({ children }: Props) => (
  <Comment
    avatar={<Avatar src={avatarImg} label="Atlaskit avatar" size="medium" />}
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
