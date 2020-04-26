import React from 'react';
import { ClickSelectWrapper } from '../../../../ui/styles';
import { Emoji, EmojiProps } from '@atlaskit/editor-common';

export default function EmojiNode(props: EmojiProps) {
  return (
    <ClickSelectWrapper>
      <Emoji {...props} />
    </ClickSelectWrapper>
  );
}
