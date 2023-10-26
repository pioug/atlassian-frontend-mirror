import React from 'react';

import UNSAFE_LINK from '../src/components/link';

export default function Default() {
  return (
    <UNSAFE_LINK testId="link-default" href="/home">
      I am a link
    </UNSAFE_LINK>
  );
}
