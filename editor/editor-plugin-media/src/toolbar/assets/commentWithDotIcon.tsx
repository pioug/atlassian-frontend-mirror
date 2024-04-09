import React from 'react';

import Icon from '@atlaskit/icon';
import type { GlyphProps } from '@atlaskit/icon/types';
import { Y300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const IconCommentWithDotGlyph = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.998 11.513C4.998 8.475 8.139 6.003 12 6.003C15.861 6.003 19.002 8.475 19.002 11.513C19.002 14.552 15.861 17.023 12 17.023C8.139 17.023 4.998 14.552 4.998 11.513ZM19.838 19.284V19.282C19.838 19.282 18.274 17.022 19.071 16.166L19.034 16.186C20.261 14.902 21 13.279 21 11.513C21 7.371 16.963 4 12 4C7.037 4 3 7.37 3 11.513C3 15.656 7.037 19.027 12 19.027C13.42 19.027 14.76 18.742 15.957 18.251C16.96 19.273 18.244 19.823 19.197 19.97L19.199 19.967C19.2515 19.9867 19.3069 19.9979 19.363 20C19.448 20 19.5317 19.9789 19.6067 19.9386C19.6816 19.8984 19.7453 19.8402 19.7923 19.7693C19.8392 19.6984 19.8679 19.6169 19.8757 19.5323C19.8835 19.4476 19.8712 19.3623 19.838 19.284Z"
        fill="currentColor"
      />
      <path
        d="M16 9H8C7.44772 9 7 9.44772 7 10C7 10.5523 7.44772 11 8 11H16C16.5523 11 17 10.5523 17 10C17 9.44772 16.5523 9 16 9Z"
        fill="currentColor"
      />
      <path
        d="M11 12H8C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14H11C11.5523 14 12 13.5523 12 13C12 12.4477 11.5523 12 11 12Z"
        fill="currentColor"
      />
      <rect
        x="14"
        y="2"
        width="8"
        height="8"
        rx="4"
        fill={token('color.background.warning.bold', Y300)}
      />
    </svg>
  );
};

export const CommentWithDotIcon = (props: GlyphProps) => {
  return <Icon glyph={IconCommentWithDotGlyph} {...props} />;
};
