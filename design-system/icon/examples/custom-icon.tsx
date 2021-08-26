import React from 'react';
import type { CustomGlyphProps, GlyphProps } from '@atlaskit/icon/types';
import { B300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Icon from '../src/entry-points/base';

function CanonicalGlyph(props: CustomGlyphProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M24 12c0 6.627-5.373 12-12 12-6.628 0-12-5.373-12-12C0 5.372 5.372 0 12 0c6.627 0 12 5.372 12 12zM12 2.92A9.08 9.08 0 002.92 12 9.08 9.08 0 0012 21.08 9.08 9.08 0 0021.081 12 9.08 9.08 0 0012 2.92zm0 16.722A7.64 7.64 0 014.36 12 7.64 7.64 0 0112 4.36 7.64 7.64 0 0119.641 12a7.64 7.64 0 01-7.64 7.641z"
      />
    </svg>
  );
}

function CanonicalIcon(props: GlyphProps) {
  return <Icon glyph={CanonicalGlyph} {...props} />;
}

export default function CustomIcon() {
  return (
    <div id="icon">
      <CanonicalIcon label="" size="small" />
      <CanonicalIcon label="" size="medium" />
      <CanonicalIcon label="" size="large" />
      <CanonicalIcon
        label=""
        size="small"
        primaryColor={token('color.iconBorder.brand', B300)}
      />
      <CanonicalIcon
        label=""
        size="medium"
        primaryColor={token('color.iconBorder.brand', B300)}
      />
      <CanonicalIcon
        label=""
        size="large"
        primaryColor={token('color.iconBorder.brand', B300)}
      />
    </div>
  );
}
