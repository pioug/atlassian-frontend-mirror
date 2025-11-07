import React from 'react';

import { MarkdownTransformer } from '@atlaskit/editor-markdown-transformer';
import { ReactRenderer } from '@atlaskit/renderer';
import { ADFEncoder } from '@atlaskit/renderer/utils';

// @ts-ignore
import DOCUMENT from '../src/network/retry-operation/README.md';

const adfEncoder = new ADFEncoder((schema) => new MarkdownTransformer(schema));
const document = adfEncoder.encode(DOCUMENT);

const _default_1: React.JSX.Element = <ReactRenderer document={document} />;
export default _default_1;
