import React from 'react';

import { CodeBlock } from '@atlaskit/code';

const exampleCodeBlock = `export default ({ name }: { name: string }) => <div>Hello {name}</div>;`;

export default [<CodeBlock highlight="15" language="tsx" text={exampleCodeBlock} />];
