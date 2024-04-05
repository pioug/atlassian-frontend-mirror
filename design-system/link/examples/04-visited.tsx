import React from 'react';

import Link from '../src';

export default function VisitedExample() {
  return (
    // Both link text and icon should be `color.link.visited`.
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <Link href="" target="_blank">
      I have been visited
    </Link>
  );
}
