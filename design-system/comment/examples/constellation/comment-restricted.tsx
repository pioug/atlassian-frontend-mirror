/* eslint-disable @repo/internal/react/use-primitives */
import React from 'react';

import Avatar from '@atlaskit/avatar';

import Comment, { CommentAuthor } from '../../src';
import sampleAvatar from '../utils/sample-avatar';

const CommentDefaultExample = () => {
  return (
    <Comment
      restrictedTo="Restricted to Admins"
      avatar={<Avatar name="Scott Farquhar" src={sampleAvatar} />}
      author={<CommentAuthor>Scott Farquhar</CommentAuthor>}
      content={
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      }
    />
  );
};

export default CommentDefaultExample;
