import React from 'react';

import Avatar from '@atlaskit/avatar';

import Comment, { CommentAuthor, CommentTime } from '../../src';
import sampleAvatar from '../utils/sample-avatar';

const CommentHighlightedExample = () => {
  return (
    <Comment
      highlighted
      avatar={<Avatar name="Scott Farquhar" src={sampleAvatar} />}
      author={<CommentAuthor>Scott Farquhar</CommentAuthor>}
      time={<CommentTime>Mar 14, 2022</CommentTime>}
      content={
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      }
    />
  );
};

export default CommentHighlightedExample;
