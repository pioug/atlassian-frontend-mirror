import React from 'react';

import { CodeBlock } from '../src';

import { fiveHundredLineExample } from './source-code-examples/500-line-example';

export default () => <CodeBlock text={fiveHundredLineExample} language="tsx" />;
