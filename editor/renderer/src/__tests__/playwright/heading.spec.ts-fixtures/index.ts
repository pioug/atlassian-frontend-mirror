import type { DocNode } from '@atlaskit/adf-schema';

export const headingNodeSimpleAdf: DocNode = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: {
        level: 1,
      },
      content: [
        {
          type: 'text',
          text: 'Heading 1',
        },
      ],
    },
  ],
};
