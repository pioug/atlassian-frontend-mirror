import React from 'react';

import Stack from '@atlaskit/ds-explorations/stack';

import {
  CommentAction,
  CommentAuthor,
  CommentEdited,
  CommentTime,
} from '../src';

export default () => (
  <Stack gap="space.100">
    <CommentAuthor href="/author">John Smith</CommentAuthor>
    <CommentTime>30 August, 2016</CommentTime>
    <CommentEdited>Edited</CommentEdited>
    <CommentAction
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        const element = e.target as HTMLElement;
        return console.log(element.textContent);
      }}
    >
      Like
    </CommentAction>
  </Stack>
);
