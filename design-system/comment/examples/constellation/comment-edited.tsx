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
      time={<CommentTime>Jul 3, 2020</CommentTime>}
      content={
        <p>
          I'm super proud that 69% of our almost 5,000 Atlassian employees
          donated their time for volunteering in the last year. Thanks team!
        </p>
      }
    />
  );
};

export default CommentEditedExample;
