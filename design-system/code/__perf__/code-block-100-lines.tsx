import React from 'react';

import { CodeBlock } from '../src';

import { hundredLineExample } from './source-code-examples/100-line-example';

export default () => <CodeBlock text={hundredLineExample} language="tsx" />;
