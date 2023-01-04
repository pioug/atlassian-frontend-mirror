import type { DocNode } from '@atlaskit/adf-schema';

export const initialDoc: DocNode = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello!',
        },
      ],
    },
  ],
};
