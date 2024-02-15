import type { ADFEntity } from '@atlaskit/adf-utils/types';

export const ruleAtMiddle: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'rule',
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export const ruleAtStart: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'rule',
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export const ruleAtEnd: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'rule',
    },
  ],
};
