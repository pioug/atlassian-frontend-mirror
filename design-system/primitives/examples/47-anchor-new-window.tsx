import React from 'react';

import UNSAFE_ANCHOR from '../src/components/anchor';

export default function AnchorNewWindow() {
  return (
    <UNSAFE_ANCHOR
      testId="anchor-new-window"
      href="https://www.atlassian.com"
      target="_blank"
    >
      I am an anchor
    </UNSAFE_ANCHOR>
  );
}
