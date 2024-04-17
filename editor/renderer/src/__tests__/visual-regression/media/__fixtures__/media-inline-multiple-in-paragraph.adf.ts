import type { DocNode } from '@atlaskit/adf-schema';

export const mediaInlineMultipleInParagraphAdf: DocNode = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'this is a paragraph and a bunch of text with multiple media inline ',
        },
        {
          type: 'mediaInline',
          attrs: {
            id: 'a4d851f3-a9b7-40c7-8bd9-3df41b6481cd',
            type: 'image',
            collection: 'MediaServicesSample',
            alt: '',
            __external: false,
          },
        },
        {
          type: 'text',
          text: ' this is some filler text to create a new line ',
        },
        {
          type: 'mediaInline',
          attrs: {
            id: 'a4d851f3-a9b7-40c7-8bd9-3df41b6481cd',
            type: 'image',
            collection: 'MediaServicesSample',
            alt: '',
            __external: false,
          },
        },
        {
          type: 'text',
          text: ' and this is more text.',
        },
      ],
    },
  ],
};
