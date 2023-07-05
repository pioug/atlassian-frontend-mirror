import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, GlyphProps } from '@atlaskit/icon/types';

const IconEmbedGlyph = (props: CustomGlyphProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 6c-1.10457 0-2 .89543-2 2v16c0 1.1046.89543 2 2 2h16c1.1046 0 2-.8954 2-2V8c0-1.10457-.8954-2-2-2H8Zm1 2c-.55228 0-1 .44772-1 1v2c0 .5523.44772 1 1 1h2c.5523 0 1-.4477 1-1V9c0-.55228-.4477-1-1-1H9Zm4.5 1.5c-.2761 0-.5.22386-.5.5 0 .2761.2239.5.5.5h10c.2761 0 .5-.2239.5-.5 0-.27614-.2239-.5-.5-.5h-10ZM9 14c-.55228 0-1 .4477-1 1v8c0 .5523.44772 1 1 1h14c.5523 0 1-.4477 1-1v-8c0-.5523-.4477-1-1-1H9Zm6 2.5c0 .8284-.6716 1.5-1.5 1.5s-1.5-.6716-1.5-1.5.6716-1.5 1.5-1.5 1.5.6716 1.5 1.5Zm0 5.5-1-1-2 2h8v-1.8L18 19l-3 3Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const IconEmbed = (props: GlyphProps) => {
  return <Icon glyph={IconEmbedGlyph} {...props} />;
};
