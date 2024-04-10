import type { DocNode } from '@atlaskit/adf-schema';

export const initialDoc: DocNode = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export const nextStepDoc: DocNode = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is some text',
        },
      ],
    },
  ],
};
