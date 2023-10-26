import React from 'react';

import { xcss } from '../src';
import UNSAFE_LINK from '../src/components/link';

const linkStyles = xcss({
  borderRadius: 'border.radius.100',
  color: 'color.text.inverse',
  display: 'inline-block',

  ':hover': {
    color: 'color.text.inverse',
  },
});

export default function Default() {
  return (
    <UNSAFE_LINK
      testId="link-styled"
      href="/home"
      backgroundColor="color.background.brand.bold"
      padding="space.100"
      xcss={linkStyles}
    >
      I am a link
    </UNSAFE_LINK>
  );
}
