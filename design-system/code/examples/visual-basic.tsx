import React from 'react';

import { CodeBlock } from '../src';

const exampleCodeBlock = `Function AddNumbers(ByVal X As Integer, ByVal Y As Integer)
  AddNumbers = X + Y
End Function`;

export default function Component() {
  return (
    <div>
      <h2>Visual Basic</h2>
      <CodeBlock language="visualbasic" text={exampleCodeBlock} />
    </div>
  );
}
