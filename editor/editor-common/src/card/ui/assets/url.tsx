import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, GlyphProps } from '@atlaskit/icon/types';

const IconUrlGlyph = (props: CustomGlyphProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="6" y="15" width="20" height="2" rx="1" fill="currentColor" />
    </svg>
  );
};

export const IconUrl = (props: GlyphProps) => {
  return <Icon glyph={IconUrlGlyph} {...props} />;
};
