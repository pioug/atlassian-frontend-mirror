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

export const mediaWithAnnotation = (annotationId: string) => ({
  type: 'mediaSingle',
  attrs: {
    layout: 'center',
    width: 426,
    widthType: 'pixel',
  },
  content: [
    {
      type: 'media',
      attrs: {
        width: 1200,
        alt: 'dog-puppy.jpeg',
        id: 'c7ef3a01-d45c-41e3-a662-67ccb54d088f',
        collection: 'contentId-3533084563',
        type: 'file',
        height: 1197,
      },
      marks: [
        {
          type: 'annotation',
          attrs: {
            annotationType: 'inlineComment',
            id: `${annotationId}`,
          },
        },
      ],
    },
  ],
});

export const docWithTextAndMedia = {
  /**
   * Structure:
   * 0               17
   *  some plain text
     17                  38
      more formatted text
     38            51
       mediaSingle
     40       50
       caption
     51     84
       table
     60           73
       mediaSingle
     62       72
       caption
   */
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'some plain text',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'more formatted text',
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
          ],
        },
      ],
    },
    {
      type: 'mediaSingle',
      attrs: {
        layout: 'center',
        width: 426,
        widthType: 'pixel',
      },
      content: [
        {
          type: 'media',
          attrs: {
            id: '6ee23984-95e4-4e9c-bff3-3723de5db792',
            type: 'file',
            collection: 'MediaServicesSample',
            alt: '568c02f0-5949-4465-8f43-e7f9b1f7ead5.png',
            width: 500,
            height: 500,
          },
        },
        {
          type: 'caption',
          content: [
            {
              type: 'text',
              text: 'cute dog',
            },
          ],
        },
      ],
    },
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
        localId: '709775b2-c4ad-4b47-bb63-023bfc655bb4',
        width: 760,
      },
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'mediaSingle',
                  attrs: {
                    layout: 'center',
                    width: 426,
                    widthType: 'pixel',
                  },
                  content: [
                    {
                      type: 'media',
                      attrs: {
                        id: 'e407b8a4-edb3-42d2-8425-7aa022c815c0',
                        type: 'file',
                        collection: 'MediaServicesSample',
                        alt: 'catt.jpeg',
                        width: 2121,
                        height: 1194,
                      },
                    },
                    {
                      type: 'caption',
                      content: [
                        {
                          type: 'text',
                          text: 'cute cat',
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
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
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
  ],
};
