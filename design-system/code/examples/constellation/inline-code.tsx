import React from 'react';

import { AkCode } from '../../src';

const jsCode = `const map = new Map({ key: 'value' })`;

export default function Component() {
  return (
    <span>
      This is inline javascript code:{' '}
      <AkCode language="javascript" text={jsCode} />, check it out.
    </span>
  );
}
