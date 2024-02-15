import type { ADFEntity } from '@atlaskit/adf-utils/types';

export const embedCardAndEmptyExpand: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'embedCard',
      attrs: {
        url: 'https://embedCardTestUrl',
        layout: 'center',
      },
    },
    {
      type: 'expand',
      attrs: {
        title: '',
      },
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export const twoEmbedCards: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'embedCard',
      attrs: {
        url: 'https://embedCardTestUrl',
        layout: 'center',
      },
    },
    {
      type: 'embedCard',
      attrs: {
        url: 'https://embedCardTestUrl',
        layout: 'center',
      },
    },
  ],
};
