import type { ADFEntity } from '@atlaskit/adf-utils/types';

export const taskListAtMiddle: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'taskList',
      attrs: {
        localId: 'a948637d-d242-43fe-9659-ee54f2117004',
      },
      content: [
        {
          type: 'taskItem',
          attrs: {
            localId: '25583a2e-e540-408c-b23b-78f21d99c32e',
            state: 'TODO',
          },
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

export const taskListAtStart: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'taskList',
      attrs: {
        localId: 'a948637d-d242-43fe-9659-ee54f2117004',
      },
      content: [
        {
          type: 'taskItem',
          attrs: {
            localId: '25583a2e-e540-408c-b23b-78f21d99c32e',
            state: 'TODO',
          },
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

export const taskListAtEnd: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'taskList',
      attrs: {
        localId: 'a948637d-d242-43fe-9659-ee54f2117004',
      },
      content: [
        {
          type: 'taskItem',
          attrs: {
            localId: '25583a2e-e540-408c-b23b-78f21d99c32e',
            state: 'TODO',
          },
          content: [],
        },
      ],
    },
  ],
};

export const multipletaskListsAtMiddle: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'taskList',
      attrs: {
        localId: '1a948637d-d242-43fe-9659-ee54f2117004',
      },
      content: [
        {
          type: 'taskItem',
          attrs: {
            localId: '25583a2e-e540-408c-b23b-78f21d99c32e',
            state: 'TODO',
          },
          content: [],
        },
      ],
    },
    {
      type: 'taskList',
      attrs: {
        localId: '2a948637d-d242-43fe-9659-ee54f2117004',
      },
      content: [
        {
          type: 'taskItem',
          attrs: {
            localId: '325583a2e-e540-408c-b23b-78f21d99c32e',
            state: 'TODO',
          },
          content: [],
        },
      ],
    },
    {
      type: 'taskList',
      attrs: {
        localId: '4a948637d-d242-43fe-9659-ee54f2117004',
      },
      content: [
        {
          type: 'taskItem',
          attrs: {
            localId: '525583a2e-e540-408c-b23b-78f21d99c32e',
            state: 'TODO',
          },
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
