import React from 'react';

import { xcss } from '@atlaskit/primitives';
import Anchor from '@atlaskit/primitives/anchor';

const anchorStyles = xcss({
  borderRadius: 'border.radius.100',
  color: 'color.text.accent.purple.bolder',
  fontWeight: 'bold',
  textDecoration: 'none',

  ':hover': {
    backgroundColor: 'color.background.accent.purple.bolder.hovered',
    color: 'color.text.inverse',
  },
  ':active': {
    backgroundColor: 'color.background.accent.purple.bolder.pressed',
    color: 'color.text.inverse',
  },
});

export default function AnchorStyled() {
  return (
    <Anchor
      xcss={anchorStyles}
      backgroundColor="color.background.accent.purple.subtler"
      padding="space.100"
      href="/components/primitives/anchor/usage"
    >
      Anchor
    </Anchor>
  );
}
