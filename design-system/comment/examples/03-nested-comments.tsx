import React, { FC, ReactNode } from 'react';

import Avatar from '@atlaskit/avatar';
import {
  UNSAFE_Box as Box,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';

import Comment, { CommentAction, CommentAuthor } from '../src';

import avatarImg from './utils/sample-avatar';

const ExampleComment: FC<{ isHighlighted?: boolean; children?: ReactNode }> = ({
  children,
  isHighlighted,
}) => (
  <Comment
    highlighted={isHighlighted}
    avatar={<Avatar src={avatarImg} size="medium" />}
    author={<CommentAuthor href="/author">John Smith</CommentAuthor>}
    content={<Text>This comment is so generic it can be repeated</Text>}
    actions={[
      <CommentAction>Edit</CommentAction>,
      <CommentAction>Delete</CommentAction>,
    ]}
  >
    {children}
  </Comment>
);

export default () => (
  <Box display="block" padding="space.200" testId="nested">
    <ExampleComment isHighlighted>
      <ExampleComment>
        <ExampleComment />
        <ExampleComment isHighlighted />
        <ExampleComment />
      </ExampleComment>
    </ExampleComment>
  </Box>
);
