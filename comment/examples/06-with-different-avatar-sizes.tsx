import React from 'react';
import Avatar, { SizeType } from '@atlaskit/avatar';
import avatarImg from './utils/sample-avatar.png';
import Comment, { CommentAction, CommentAuthor, CommentTime } from '../src';

const getSampleText = () =>
  `Cookie macaroon liquorice. Marshmallow donut lemon drops candy canes marshmallow topping chocolate cake. Croissant pastry soufflé waffle cake fruitcake. Brownie oat cake sugar plum.`;

const avatarWithSize = (size: SizeType) => (
  <Comment
    key={size}
    author={<CommentAuthor>John Smith</CommentAuthor>}
    avatar={<Avatar src={avatarImg} label="User avatar" size={size} />}
    type="Author"
    time={<CommentTime>30, August 2016</CommentTime>}
    content={
      <div>
        <p>{size} avatar</p>
        <p>{getSampleText()}</p>
      </div>
    }
    actions={[
      <CommentAction>Reply</CommentAction>,
      <CommentAction>Edit</CommentAction>,
      <CommentAction>Delete</CommentAction>,
      <CommentAction>Like</CommentAction>,
    ]}
  />
);

export default () => (
  <div>
    {['small', 'medium', 'large', 'xlarge'].map((size: any) =>
      avatarWithSize(size),
    )}
  </div>
);
