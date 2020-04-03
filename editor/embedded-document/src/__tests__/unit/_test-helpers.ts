export const providerUrl = 'http://provider';
export const docId = '123';
export const objectId = 'ari:cloud:demo::document/1';

export const validContent = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello World',
        },
      ],
    },
  ],
};

export const updatedContent = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello World!!!',
        },
      ],
    },
  ],
};

export const validGetResponse = {
  id: docId,
  objectId,
  createdBy: {},
  body: validContent,
};

export const validBatchGetResponse = [
  {
    id: docId,
    language: {
      default: {
        versions: [validGetResponse],
      },
    },
  },
];

export const validPutResponse = {
  id: docId,
  objectId,
  createdBy: {},
  body: updatedContent,
};
