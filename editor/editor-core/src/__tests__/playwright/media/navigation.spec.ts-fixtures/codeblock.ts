import type { ADFEntity } from '@atlaskit/adf-utils/types';

export const codeBlockAtMiddle: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'codeBlock',
      attrs: {},
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export const codeBlockAtStart: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'codeBlock',
      attrs: {},
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export const codeBlockAtEnd: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'codeBlock',
      attrs: {},
    },
  ],
};

export const multipleCodeBlocksAtMiddle: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'codeBlock',
      attrs: {},
    },
    {
      type: 'codeBlock',
      attrs: {},
    },
    {
      type: 'codeBlock',
      attrs: {},
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};
