import React from 'react';

import { CodeBlock } from '../src';

const exampleCodeBlock = `procedure ShowTime;
// A procedure with no parameters`;

export default function Component() {
  return (
    <div>
      <h2>Delphi</h2>
      <CodeBlock language="delphi" text={exampleCodeBlock} />
    </div>
  );
}
