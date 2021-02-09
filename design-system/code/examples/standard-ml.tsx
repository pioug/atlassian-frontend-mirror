import React from 'react';

import { CodeBlock } from '../src';

const exampleCodeBlock = `signature REGEXP = sig
  val format : regexp -> string
end`;

export default function Component() {
  return (
    <div>
      <h2>Standard ML</h2>
      <CodeBlock language="standardml" text={exampleCodeBlock} />
    </div>
  );
}
