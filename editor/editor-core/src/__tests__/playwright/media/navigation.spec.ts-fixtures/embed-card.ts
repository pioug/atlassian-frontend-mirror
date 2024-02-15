import type { ADFEntity } from '@atlaskit/adf-utils/types';

export const embedCardAtMiddle: ADFEntity = {
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
      type: 'paragraph',
      content: [],
    },
  ],
};

export const embedCardAtStart: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'embedCard',
      attrs: {
        url: 'https://embedCardTestUrl',
        layout: 'center',
      },
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export const embedCardAtEnd: ADFEntity = {
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
  ],
};

export const multipleEmbedCardsAtMiddle: ADFEntity = {
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
    {
      type: 'embedCard',
      attrs: {
        url: 'https://embedCardTestUrl',
        layout: 'center',
      },
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};
