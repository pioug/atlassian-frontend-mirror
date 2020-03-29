import React from 'react';
import {
  CommentAuthor,
  CommentTime,
  CommentAction,
  CommentEdited,
} from '../src';

export default () => (
  <div>
    <div>
      <CommentAuthor href="/author">John Smith</CommentAuthor>
    </div>

    <div>
      <CommentTime>30 August, 2016</CommentTime>
    </div>
    <div>
      <CommentEdited>Edited</CommentEdited>
    </div>
    <div>
      <CommentAction
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          const element = e.target as HTMLElement;
          return console.log(element.textContent);
        }}
      >
        Like
      </CommentAction>
    </div>
  </div>
);
