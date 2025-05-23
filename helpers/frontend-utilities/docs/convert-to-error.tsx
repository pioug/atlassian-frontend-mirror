import React from 'react';

import { MarkdownTransformer } from '@atlaskit/editor-markdown-transformer';
import { ReactRenderer } from '@atlaskit/renderer';
import { ADFEncoder } from '@atlaskit/renderer/utils';

// @ts-ignore
import DOCUMENT from '../src/error-handling/convert-to-error/README.md';

const adfEncoder = new ADFEncoder((schema) => new MarkdownTransformer(schema));
const document = adfEncoder.encode(DOCUMENT);

export default <ReactRenderer document={document} />;
