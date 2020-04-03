import React from 'react';
import RendererDemo from './helper/RendererDemo';

const document = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'mediaSingle',
      content: [
        {
          type: 'media',
          attrs: {
            type: 'external',
            url:
              'https://atlassian.design/uploads/guidelines/brand/personality/Artboard-1.png',
          },
        },
      ],
    },
  ],
};

export default function Example() {
  return <RendererDemo serializer="react" document={document} />;
}
