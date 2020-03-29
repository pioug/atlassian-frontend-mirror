import React from 'react';
import Avatar from '@atlaskit/avatar';
import Comment, {
  CommentAuthor,
  CommentTime,
  CommentAction,
  CommentEdited,
} from '../src';
import avatarImg from './utils/sample-avatar.png';

export default () => (
  <div>
    <Comment
      avatar={<Avatar src={avatarImg} label="Atlaskit avatar" size="medium" />}
      author={<CommentAuthor>John Smith</CommentAuthor>}
      type="author"
      edited={<CommentEdited>Edited</CommentEdited>}
      restrictedTo="Restricted to Admins Only"
      time={<CommentTime>30 August, 2016</CommentTime>}
      content={
        <p>
          Content goes here. This can include <a href="/link">links</a> and
          other content.
        </p>
      }
      actions={[
        <CommentAction>Reply</CommentAction>,
        <CommentAction>Edit</CommentAction>,
        <CommentAction>Like</CommentAction>,
      ]}
    />
  </div>
);
