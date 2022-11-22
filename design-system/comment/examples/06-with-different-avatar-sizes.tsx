/* eslint-disable @repo/internal/react/use-primitives */
import React from 'react';

import Avatar from '@atlaskit/avatar';
import Stack from '@atlaskit/ds-explorations/stack';

import Comment, { CommentAction, CommentAuthor, CommentTime } from '../src';

import avatarImg from './utils/sample-avatar';

const getSampleText = () =>
  `Cookie macaroon liquorice. Marshmallow donut lemon drops candy canes marshmallow topping chocolate cake. Croissant pastry soufflé waffle cake fruitcake. Brownie oat cake sugar plum.`;

export default () => (
  <Stack gap="scale.300">
    {(['small', 'medium', 'large', 'xlarge'] as const).map((size) => (
      <Comment
        key={size}
        author={<CommentAuthor>John Smith</CommentAuthor>}
        avatar={<Avatar src={avatarImg} size={size} />}
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
    ))}
  </Stack>
);
