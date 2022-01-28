import React from 'react';
import { ClickSelectWrapper } from '../../../../ui/styles';
import { Emoji } from '@atlaskit/editor-common/emoji';
import type { EmojiProps } from '@atlaskit/editor-common/emoji';

export default function EmojiNode(props: EmojiProps) {
  return (
    <ClickSelectWrapper>
      <Emoji {...props} />
    </ClickSelectWrapper>
  );
}
