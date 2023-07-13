import React from 'react';

import Avatar from '@atlaskit/avatar';

import Comment, { CommentAuthor, CommentEdited, CommentTime } from '../../src';
import sampleAvatar from '../images/avatar_400x400.jpg';

const CommentEditedExample = () => {
  return (
    <Comment
      edited={<CommentEdited>Edited</CommentEdited>}
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

export default CommentEditedExample;
