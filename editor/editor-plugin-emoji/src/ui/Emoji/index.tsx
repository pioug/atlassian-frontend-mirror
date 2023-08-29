/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { Emoji } from '@atlaskit/editor-common/emoji';
import type { EmojiProps } from '@atlaskit/editor-common/emoji';

// eslint-disable-next-line
const clickSelectWrapperStyle = css`
  // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
  user-select: all;
`;

export default function EmojiNode(props: EmojiProps) {
  return (
    <span css={clickSelectWrapperStyle}>
      <Emoji {...props} />
    </span>
  );
}
