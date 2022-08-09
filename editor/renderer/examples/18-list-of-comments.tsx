import React from 'react';
import RendererDemo from './helper/RendererDemo';
import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';

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
    <SmartCardProvider client={new CardClient('staging')}>
      <RendererDemo
        appearance="comment"
        document={myComment}
        allowColumnSorting={true}
        serializer="react"
        showHowManyCopies
        copies={10}
      />
    </SmartCardProvider>
  );
}
