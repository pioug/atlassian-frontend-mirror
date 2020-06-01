export const simpleTextWithAnnotation = (id: string) => ({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello!',
          marks: [
            {
              type: 'annotation',
              attrs: {
                id,
                annotationType: 'inlineComment',
              },
            },
          ],
        },
      ],
    },
  ],
});

export const annotationSpanningMultiText = (id: string) => ({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello!',
          marks: [
            {
              type: 'annotation',
              attrs: {
                id,
                annotationType: 'inlineComment',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello!',
          marks: [
            {
              type: 'annotation',
              attrs: {
                id,
                annotationType: 'inlineComment',
              },
            },
          ],
        },
      ],
    },
  ],
});

export const textWithOverlappingAnnotations = (id: string) => ({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello, ',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://www.atlassian.com',
              },
            },
            {
              type: 'annotation',
              attrs: {
                id: '0f8c5903-d571-4f55-97cb-a9bb986fcede',
                annotationType: 'inlineComment',
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'World!',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://www.atlassian.com',
              },
            },
            {
              type: 'strong',
            },
            {
              type: 'annotation',
              attrs: {
                id: '3bac13b6-b121-457e-adbc-a447ad21b7bd',
                annotationType: 'inlineComment',
              },
            },
            {
              type: 'annotation',
              attrs: {
                id: '0f8c5903-d571-4f55-97cb-a9bb986fcede',
                annotationType: 'inlineComment',
              },
            },
          ],
        },
        {
          type: 'text',
          text: ' ',
          marks: [
            {
              type: 'annotation',
              attrs: {
                id: '3bac13b6-b121-457e-adbc-a447ad21b7bd',
                annotationType: 'inlineComment',
              },
            },
            {
              type: 'annotation',
              attrs: {
                id: '0f8c5903-d571-4f55-97cb-a9bb986fcede',
                annotationType: 'inlineComment',
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'Look I can',
          marks: [
            {
              type: 'annotation',
              attrs: {
                id,
                annotationType: 'inlineComment',
              },
            },
            {
              type: 'annotation',
              attrs: {
                id: '3bac13b6-b121-457e-adbc-a447ad21b7bd',
                annotationType: 'inlineComment',
              },
            },
            {
              type: 'annotation',
              attrs: {
                id: '0f8c5903-d571-4f55-97cb-a9bb986fcede',
                annotationType: 'inlineComment',
              },
            },
          ],
        },
        {
          type: 'text',
          text: ' do ',
          marks: [
            {
              type: 'annotation',
              attrs: {
                id: '3bac13b6-b121-457e-adbc-a447ad21b7bd',
                annotationType: 'inlineComment',
              },
            },
            {
              type: 'annotation',
              attrs: {
                id: '0f8c5903-d571-4f55-97cb-a9bb986fcede',
                annotationType: 'inlineComment',
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'italic',
          marks: [
            {
              type: 'em',
            },
            {
              type: 'annotation',
              attrs: {
                id: '3bac13b6-b121-457e-adbc-a447ad21b7bd',
                annotationType: 'inlineComment',
              },
            },
            {
              type: 'annotation',
              attrs: {
                id: '0f8c5903-d571-4f55-97cb-a9bb986fcede',
                annotationType: 'inlineComment',
              },
            },
          ],
        },
        {
          type: 'text',
          text: ' ',
          marks: [
            {
              type: 'em',
            },
            {
              type: 'annotation',
              attrs: {
                id: '0f8c5903-d571-4f55-97cb-a9bb986fcede',
                annotationType: 'inlineComment',
              },
            },
          ],
        },
        {
          type: 'text',
          text: ', strong ',
          marks: [
            {
              type: 'em',
            },
            {
              type: 'strong',
            },
            {
              type: 'annotation',
              attrs: {
                id: '0f8c5903-d571-4f55-97cb-a9bb986fcede',
                annotationType: 'inlineComment',
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'and underlined text!',
          marks: [
            {
              type: 'em',
            },
            {
              type: 'strong',
            },
            {
              type: 'underline',
            },
            {
              type: 'annotation',
              attrs: {
                id: '0f8c5903-d571-4f55-97cb-a9bb986fcede',
                annotationType: 'inlineComment',
              },
            },
          ],
        },
        {
          type: 'text',
          text: ' and',
          marks: [
            {
              type: 'annotation',
              attrs: {
                id: '0f8c5903-d571-4f55-97cb-a9bb986fcede',
                annotationType: 'inlineComment',
              },
            },
          ],
        },
        {
          type: 'text',
          text: ' action mark',
        },
        {
          type: 'text',
          text: ' and invalid action mark',
        },
      ],
    },
  ],
});
