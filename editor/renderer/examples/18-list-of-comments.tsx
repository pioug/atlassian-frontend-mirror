import React from 'react';
import RendererDemo from './helper/RendererDemo';
import { Provider, Client } from '@atlaskit/smart-card';

const myComment = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'wide',
      },
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                background: '#ffc400',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export default function Example() {
  return (
    <Provider client={new Client('staging')}>
      <RendererDemo
        appearance="comment"
        document={myComment}
        allowColumnSorting={true}
        serializer="react"
        showHowManyCopies
        copies={10}
      />
    </Provider>
  );
}
