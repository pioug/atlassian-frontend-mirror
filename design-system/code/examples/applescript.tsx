import React from 'react';

import { CodeBlock } from '../src';

const exampleCodeBlock = `12 + 2 * 5
"DUMPtruck" is equal to "dumptruck"`;

export default function Component() {
  return (
    <div>
      <h2>AppleScript</h2>
      <CodeBlock language="applescript" text={exampleCodeBlock} />
    </div>
  );
}
