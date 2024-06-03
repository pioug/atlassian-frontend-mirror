import React from 'react';

import Heading from '@atlaskit/heading';

import Link from '../../src';

export default function FontStyleInheritance() {
  return (
    <Heading size="xxlarge">
      <Link href="/components/link/code">The link</Link> inherits font styles
    </Heading>
  );
}
