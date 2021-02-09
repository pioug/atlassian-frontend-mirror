import React from 'react';

import { CodeBlock } from '../src';

const exampleCodeBlock = `unit Unit1;
interface
uses { these units are part of the Visual Component Library (VCL) }`;

export default function Component() {
  return (
    <div>
      <h2>Object Pascal</h2>
      <CodeBlock language="objectpascal" text={exampleCodeBlock} />
    </div>
  );
}
