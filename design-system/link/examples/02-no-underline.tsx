import React from 'react';

import Link from '../src';

export default function NoUnderlineExample() {
  return (
    <Link href="https://atlassian.com" isUnderlined={false}>
      No underline
    </Link>
  );
}
