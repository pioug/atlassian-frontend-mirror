import React from 'react';

import UNSAFE_ANCHOR from '../src/components/anchor';

export default function Default() {
  return (
    <UNSAFE_ANCHOR testId="anchor-default" href="/home">
      I am an anchor
    </UNSAFE_ANCHOR>
  );
}
