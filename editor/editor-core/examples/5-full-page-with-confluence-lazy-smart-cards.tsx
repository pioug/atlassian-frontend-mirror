import { Example } from './5-full-page-with-confluence-smart-cards';

const exampleDocument = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'There is an inline card down below. Just start scrolling...',
        },
      ],
    },
  ]
    .concat(
      new Array(30).fill({
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: '...',
          },
        ],
      }),
    )
    .concat([
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Keep going...',
          },
        ],
      },
    ])
    .concat(
      new Array(30).fill({
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: '...',
          },
        ],
      }),
    )
    .concat([
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Check out this document ',
            marks: [{ type: 'em' }],
          },
          {
            type: 'inlineCard',
            attrs: {
              url: 'https://trello.com/c/gfrst89H/4-much-muffins',
            },
          },
          {
            type: 'text',
            text: ' and let me know what you think...',
            marks: [{ type: 'em' }],
          },
        ],
      } as any,
    ]),
};

export default () => Example(exampleDocument);
