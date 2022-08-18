import React from 'react';

import { MarkdownRenderer } from '../src/documentation/markdown-renderer';
// @ts-ignore
import input from '../src/storage/storage-client/README.md';

export default <MarkdownRenderer>{input}</MarkdownRenderer>;
