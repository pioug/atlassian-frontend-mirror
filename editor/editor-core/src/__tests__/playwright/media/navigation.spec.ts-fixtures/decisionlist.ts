import type { ADFEntity } from '@atlaskit/adf-utils/types';

export const decisionListAtMiddle: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'decisionList',
      attrs: {
        localId: 'ff57a749-8b4b-4f5e-87e2-c726d66b9ac5',
      },
      content: [
        {
          type: 'decisionItem',
          attrs: {
            localId: '3b8855ca-ac64-474f-9001-ebcad4968eaf',
            state: 'DECIDED',
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export const decisionListAtStart: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'decisionList',
      attrs: {
        localId: 'ff57a749-8b4b-4f5e-87e2-c726d66b9ac5',
      },
      content: [
        {
          type: 'decisionItem',
          attrs: {
            localId: '3b8855ca-ac64-474f-9001-ebcad4968eaf',
            state: 'DECIDED',
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export const decisionListAtEnd: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'decisionList',
      attrs: {
        localId: 'ff57a749-8b4b-4f5e-87e2-c726d66b9ac5',
      },
      content: [
        {
          type: 'decisionItem',
          attrs: {
            localId: '3b8855ca-ac64-474f-9001-ebcad4968eaf',
            state: 'DECIDED',
          },
        },
      ],
    },
  ],
};

export const multipleDecisionListsAtMiddle = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'decisionList',
      attrs: {
        localId: 'abc',
      },
      content: [
        {
          type: 'decisionItem',
          attrs: {
            localId: 'def',
            state: 'DECIDED',
          },
        },
      ],
    },
    {
      type: 'decisionList',
      attrs: {
        localId: 'ghi',
      },
      content: [
        {
          type: 'decisionItem',
          attrs: {
            localId: 'jkl',
            state: 'DECIDED',
          },
        },
      ],
    },
    {
      type: 'decisionList',
      attrs: {
        localId: 'mno',
      },
      content: [
        {
          type: 'decisionItem',
          attrs: {
            localId: 'pqr',
            state: 'DECIDED',
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};
