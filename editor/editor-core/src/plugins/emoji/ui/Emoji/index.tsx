/** @jsx jsx */
import { jsx } from '@emotion/react';
import { clickSelectWrapperStyle } from '../../../../ui/styles';
import { Emoji } from '@atlaskit/editor-common/emoji';
import type { EmojiProps } from '@atlaskit/editor-common/emoji';

export default function EmojiNode(props: EmojiProps) {
  return (
    <span css={clickSelectWrapperStyle}>
      <Emoji {...props} />
    </span>
  );
}
