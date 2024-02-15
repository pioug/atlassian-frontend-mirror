import type { ADFEntity } from '@atlaskit/adf-utils/types';

export const bodiedExtensionAtMiddle: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'bodiedExtension',
      attrs: {
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'bodied-eh',
        layout: 'default',
        localId: '40ad9d08-ab53-438b-877e-f6a9dd0a401b',
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

export const bodiedExtensionAtStart: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'bodiedExtension',
      attrs: {
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'bodied-eh',
        layout: 'default',
        localId: '40ad9d08-ab53-438b-877e-f6a9dd0a401b',
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

export const bodiedExtensionAtEnd: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'bodiedExtension',
      attrs: {
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'bodied-eh',
        layout: 'default',
        localId: '40ad9d08-ab53-438b-877e-f6a9dd0a401b',
      },
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    },
  ],
};

export const multipleBodiedExtensionsAtMiddle: ADFEntity = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'bodiedExtension',
      attrs: {
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'bodied-eh',
        layout: 'default',
        localId: '40ad9d08-ab53-438b-877e-f6a9dd0a401b',
      },
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    },
    {
      type: 'bodiedExtension',
      attrs: {
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'bodied-eh',
        layout: 'default',
        localId: 'b40ad9d08-ab53-438b-877e-f6a9dd0a401b',
      },
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    },
    {
      type: 'bodiedExtension',
      attrs: {
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'bodied-eh',
        layout: 'default',
        localId: '4c0ad9d08-ab53-438b-877e-f6a9dd0a401b',
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
