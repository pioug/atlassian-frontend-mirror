/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { gs } from '../utils';

export interface EmojiProps {
  /* Element to be displayed as an icon. We naively render this if it is provided. Allows us to pass in AK icons */
  emoji?: React.ReactNode;
}

export const Emoji = ({ emoji }: EmojiProps) => {
  return (
    <span
      css={{
        height: gs(2.5),
        width: gs(2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '-2px',
      }}
    >
      {emoji}
    </span>
  );
};
