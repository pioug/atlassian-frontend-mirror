/* eslint-disable @repo/internal/react/use-primitives */
import React from 'react';

import Avatar from '@atlaskit/avatar';

import Comment, { CommentAction, CommentAuthor, CommentTime } from '../../src';
import sampleAvatar from '../utils/sample-avatar';

const CommentNestedExample = () => {
  return (
    <Comment
      avatar={<Avatar name="Scott Farquhar" src={sampleAvatar} />}
      author={<CommentAuthor>Scott Farquhar</CommentAuthor>}
      type="author"
      time={<CommentTime>Mar 14, 2022</CommentTime>}
      content={
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      }
      actions={[
        <CommentAction>Reply</CommentAction>,
        <CommentAction>Edit</CommentAction>,
        <CommentAction>Like</CommentAction>,
      ]}
    >
      <Comment
        avatar={<Avatar name="John Smith" />}
        author={<CommentAuthor>John Smith</CommentAuthor>}
        time={<CommentTime>Mar 15, 2022</CommentTime>}
        content={
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur
          </p>
        }
        actions={[
          <CommentAction>Reply</CommentAction>,
          <CommentAction>Like</CommentAction>,
        ]}
      >
        <Comment
          avatar={<Avatar name="Sabina Vu" />}
          author={<CommentAuthor>Sabina Vu</CommentAuthor>}
          time={<CommentTime>Mar 15, 2022</CommentTime>}
          content={
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur
            </p>
          }
          actions={[
            <CommentAction>Reply</CommentAction>,
            <CommentAction>Like</CommentAction>,
          ]}
        />
      </Comment>
    </Comment>
  );
};

export default CommentNestedExample;
