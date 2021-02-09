import React from 'react';

import { CodeBlock } from '../src';

const exampleCodeBlock = `header {
  width: 100%;
  height: 40px;
}

.bg-grey {
  background: grey !important;
}

ul {
  list-style: none;
  margin-left: 0;
  padding-left: 0;
}

main > .side-menu li {
  padding-left: 1em;
  text-indent: -1em;
}

main > .side-menu li::before {
  content: "+";
  padding-right: 5px;
}`;

export default function Component() {
  return (
    <div>
      <h2>CSS</h2>
      <CodeBlock language="css" text={exampleCodeBlock} />
    </div>
  );
}
