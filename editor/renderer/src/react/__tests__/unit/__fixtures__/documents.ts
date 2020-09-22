export const simpleDocument = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Sorry',
          marks: [
            {
              type: 'annotation',
              attrs: {
                id: 'lol_1',
                annotationType: 'inlineComment',
              },
            },
          ],
        },
        {
          type: 'text',
          text: ' To Bother ',
          marks: [
            {
              type: 'annotation',
              attrs: {
                id: 'lol_1',
                annotationType: 'inlineComment',
              },
            },
            {
              type: 'annotation',
              attrs: {
                id: 'lol_2',
                annotationType: 'inlineComment',
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'You',
          marks: [
            {
              type: 'annotation',
              attrs: {
                id: 'lol_2',
                annotationType: 'inlineComment',
              },
            },
            {
              type: 'annotation',
              attrs: {
                id: 'lol_3',
                annotationType: 'inlineComment',
              },
            },
            {
              type: 'annotation',
              attrs: {
                id: 'lol_4',
                annotationType: 'inlineComment',
              },
            },
          ],
        },
      ],
    },
  ],
};
export const complexDocument = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'SIMPLE COMMENTS' }],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Status: ' },
        {
          type: 'status',
          attrs: {
            text: 'LOLOL',
            color: 'neutral',
            localId: 'd1f59a60-8640-415b-9336-05243e210f27',
            style: '',
          },
        },
        { type: 'text', text: ' ' },
        {
          type: 'status',
          attrs: {
            text: 'STATUS PURPLE',
            color: 'purple',
            localId: 'e6764f45-4d69-49f8-9e0a-3a83fb9c0db7',
            style: '',
          },
        },
        { type: 'text', text: ' ' },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'emoji',
          attrs: { shortName: ':dash:', id: '1f4a8', text: '💨' },
        },
        { type: 'text', text: ' ' },
        {
          type: 'emoji',
          attrs: { shortName: ':trident:', id: '1f531', text: '🔱' },
        },
        { type: 'text', text: ' ' },
      ],
    },
    {
      type: 'codeBlock',
      attrs: { language: null, uniqueId: null },
      content: [{ type: 'text', text: 'djdjdjdjdj\ndjdjjd\n\n' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'mention',
          attrs: {
            id: '11',
            text: '@Elaine Mattia',
            accessLevel: '',
            userType: null,
          },
        },
        { type: 'text', text: ' ' },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://www.google.com/',
                __confluenceMetadata: null,
              },
            },
          ],
          text: 'https://www.google.com/',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis at con',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'annotation',
              attrs: {
                id: 'inline-comment-id',
                annotationType: 'inlineComment',
              },
            },
          ],
          text:
            'sectetur lorem donec massa sapien faucibus et. Pellentesque habitant morbi tristique senectus et. Malesuada bibendum arcu vitae elementum. Cras fermentum odio eu feugiat pretium. Vitae sapien pellentesque habitant morbi tristique senectus. Ut pharetra sit amet aliquam id diam maecenas. Scelerisque varius morbi enim nunc faucibus a pellentesque sit amet. Nisi est sit amet facilisis magna etiam tempor orci. Nulla pharetra di',
        },
        { type: 'text', text: 'am s' },
        {
          type: 'text',
          marks: [
            {
              type: 'annotation',
              attrs: {
                id: 'inline-comment-id',
                annotationType: 'inlineComment',
              },
            },
          ],
          text:
            'it amet nisl. Massa ultricies mi quis hendrerit dolor magna eget. Sapien eget mi proin sed libero. Mattis aliquam f',
        },
        {
          type: 'text',
          text:
            'aucibus purus in massa tempor nec feugiat nisl. Etiam tempor orci eu lobortis. Viverra nibh cras pulvinar mattis nunc. Consequat semper viverra nam libero justo laoreet sit amet cursus. Egestas diam in arcu cursus euismod quis viverra. Turpis nunc eget lorem dolor. Praesent ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'annotation',
              attrs: {
                id: 'inline-comment-id',
                annotationType: 'inlineComment',
              },
            },
          ],
          text: 'elementum',
        },
        { type: 'text', text: ' facilisis leo vel fringilla est.' },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          marks: [
            {
              type: 'annotation',
              attrs: {
                id: '12e213d7-badd-4c2a-881e-f5d6b9af3752',
                annotationType: 'inlineComment',
              },
            },
          ],
          text: 'This line is an ',
        },
        {
          type: 'text',
          marks: [
            { type: 'strong' },
            {
              type: 'annotation',
              attrs: {
                id: '12e213d7-badd-4c2a-881e-f5d6b9af3752',
                annotationType: 'inlineComment',
              },
            },
          ],
          text: 'UNRESOLVED',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'annotation',
              attrs: {
                id: '12e213d7-badd-4c2a-881e-f5d6b9af3752',
                annotationType: 'inlineComment',
              },
            },
          ],
          text: ' comment',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          marks: [
            {
              type: 'annotation',
              attrs: {
                id: '9714aedf-5300-43f4-ac10-a2e4326189d2',
                annotationType: 'inlineComment',
              },
            },
          ],
          text: 'This line is a ',
        },
        {
          type: 'text',
          marks: [
            { type: 'strong' },
            {
              type: 'annotation',
              attrs: {
                id: '9714aedf-5300-43f4-ac10-a2e4326189d2',
                annotationType: 'inlineComment',
              },
            },
          ],
          text: 'RESOLVED',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'annotation',
              attrs: {
                id: '9714aedf-5300-43f4-ac10-a2e4326189d2',
                annotationType: 'inlineComment',
              },
            },
          ],
          text: ' comment',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'This line is plain text with no comment' },
      ],
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              marks: [
                {
                  type: 'annotation',
                  attrs: {
                    id: '13272b41-b9a9-427a-bd58-c00766999638',
                    annotationType: 'inlineComment',
                  },
                },
              ],
              text: 'This line is inside of blockquote ',
            },
            {
              type: 'text',
              marks: [
                { type: 'strong' },
                {
                  type: 'annotation',
                  attrs: {
                    id: '13272b41-b9a9-427a-bd58-c00766999638',
                    annotationType: 'inlineComment',
                  },
                },
              ],
              text: 'UNRESOLVED',
            },
            {
              type: 'text',
              marks: [
                {
                  type: 'annotation',
                  attrs: {
                    id: '13272b41-b9a9-427a-bd58-c00766999638',
                    annotationType: 'inlineComment',
                  },
                },
              ],
              text: ' comment',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              marks: [
                {
                  type: 'annotation',
                  attrs: {
                    id: '68ac8f3f-2fb6-4720-8439-c9da1f17b0b2',
                    annotationType: 'inlineComment',
                  },
                },
              ],
              text: 'This line is a ',
            },
            {
              type: 'text',
              marks: [
                { type: 'strong' },
                {
                  type: 'annotation',
                  attrs: {
                    id: '68ac8f3f-2fb6-4720-8439-c9da1f17b0b2',
                    annotationType: 'inlineComment',
                  },
                },
              ],
              text: 'RESOLVED',
            },
            {
              type: 'text',
              marks: [
                {
                  type: 'annotation',
                  attrs: {
                    id: '68ac8f3f-2fb6-4720-8439-c9da1f17b0b2',
                    annotationType: 'inlineComment',
                  },
                },
              ],
              text: ' comment',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'This line is plain text with no comment' },
          ],
        },
      ],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'annotation',
                      attrs: {
                        id: '80f91695-4e24-433d-93e1-6458b8bb2415',
                        annotationType: 'inlineComment',
                      },
                    },
                  ],
                  text: 'This line is inside of a bullet list',
                },
                {
                  type: 'text',
                  marks: [
                    { type: 'strong' },
                    {
                      type: 'annotation',
                      attrs: {
                        id: '80f91695-4e24-433d-93e1-6458b8bb2415',
                        annotationType: 'inlineComment',
                      },
                    },
                  ],
                  text: 'UNRESOLVED',
                },
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'annotation',
                      attrs: {
                        id: '80f91695-4e24-433d-93e1-6458b8bb2415',
                        annotationType: 'inlineComment',
                      },
                    },
                  ],
                  text: ' comment',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'annotation',
                      attrs: {
                        id: 'f963dc2a-797c-445d-9703-9381c82ccf55',
                        annotationType: 'inlineComment',
                      },
                    },
                  ],
                  text: 'This line is a ',
                },
                {
                  type: 'text',
                  marks: [
                    { type: 'strong' },
                    {
                      type: 'annotation',
                      attrs: {
                        id: 'f963dc2a-797c-445d-9703-9381c82ccf55',
                        annotationType: 'inlineComment',
                      },
                    },
                  ],
                  text: 'RESOLVED',
                },
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'annotation',
                      attrs: {
                        id: 'f963dc2a-797c-445d-9703-9381c82ccf55',
                        annotationType: 'inlineComment',
                      },
                    },
                  ],
                  text: ' comment',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'This line is plain text with no comment',
                },
              ],
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
        __autoSize: false,
      },
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'annotation',
                          attrs: {
                            id: 'be3e7d44-053d-454b-93d2-2575c6fca2c1',
                            annotationType: 'inlineComment',
                          },
                        },
                      ],
                      text: 'This line is inside of a tableCell ',
                    },
                    {
                      type: 'text',
                      marks: [
                        { type: 'strong' },
                        {
                          type: 'annotation',
                          attrs: {
                            id: 'be3e7d44-053d-454b-93d2-2575c6fca2c1',
                            annotationType: 'inlineComment',
                          },
                        },
                      ],
                      text: 'UNRESOLVED',
                    },
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'annotation',
                          attrs: {
                            id: 'be3e7d44-053d-454b-93d2-2575c6fca2c1',
                            annotationType: 'inlineComment',
                          },
                        },
                      ],
                      text: ' comment',
                    },
                  ],
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
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'annotation',
                          attrs: {
                            id: 'abb3279e-109a-4a05-b8b7-111363d81041',
                            annotationType: 'inlineComment',
                          },
                        },
                      ],
                      text: 'This line is a ',
                    },
                    {
                      type: 'text',
                      marks: [
                        { type: 'strong' },
                        {
                          type: 'annotation',
                          attrs: {
                            id: 'abb3279e-109a-4a05-b8b7-111363d81041',
                            annotationType: 'inlineComment',
                          },
                        },
                      ],
                      text: 'RESOLVED',
                    },
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'annotation',
                          attrs: {
                            id: 'abb3279e-109a-4a05-b8b7-111363d81041',
                            annotationType: 'inlineComment',
                          },
                        },
                      ],
                      text: ' comment',
                    },
                  ],
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
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'This line is plain text with no comment',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'NESTED COMMENTS' }],
    },
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
        __autoSize: false,
      },
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [172],
                background: null,
              },
              content: [{ type: 'paragraph' }],
            },
            {
              type: 'tableHeader',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [280],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'strong' }],
                      text: 'Inside unresolved',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [307],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'strong' }],
                      text: 'Inside resolved',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [172],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'strong' }],
                      text: 'Outside unresolved',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [280],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'annotation',
                          attrs: {
                            id: 'd1257edc-604a-4f8a-b3fa-8e24cbd0894b',
                            annotationType: 'inlineComment',
                          },
                        },
                      ],
                      text: 'aaa ',
                    },
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'annotation',
                          attrs: {
                            id: '98666c34-f666-49be-b17d-d01d112b5c1b',
                            annotationType: 'inlineComment',
                          },
                        },
                        {
                          type: 'annotation',
                          attrs: {
                            id: 'd1257edc-604a-4f8a-b3fa-8e24cbd0894b',
                            annotationType: 'inlineComment',
                          },
                        },
                      ],
                      text: 'AAA',
                    },
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'annotation',
                          attrs: {
                            id: 'd1257edc-604a-4f8a-b3fa-8e24cbd0894b',
                            annotationType: 'inlineComment',
                          },
                        },
                      ],
                      text: ' aaa',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [307],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'annotation',
                          attrs: {
                            id: '75a321e5-ee26-41c2-8ef1-c81849df3f40',
                            annotationType: 'inlineComment',
                          },
                        },
                      ],
                      text: 'aaa ',
                    },
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'annotation',
                          attrs: {
                            id: 'eef53b24-17c6-46e8-bab4-6f0b0478e80a',
                            annotationType: 'inlineComment',
                          },
                        },
                        {
                          type: 'annotation',
                          attrs: {
                            id: '75a321e5-ee26-41c2-8ef1-c81849df3f40',
                            annotationType: 'inlineComment',
                          },
                        },
                      ],
                      text: 'aaa',
                    },
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'annotation',
                          attrs: {
                            id: '75a321e5-ee26-41c2-8ef1-c81849df3f40',
                            annotationType: 'inlineComment',
                          },
                        },
                      ],
                      text: ' aaa',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [172],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'strong' }],
                      text: 'Outside resolved',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [280],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'annotation',
                          attrs: {
                            id: '93e89148-ad5c-4bdd-965f-60b91b0e7774',
                            annotationType: 'inlineComment',
                          },
                        },
                      ],
                      text: '~~~ ',
                    },
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'annotation',
                          attrs: {
                            id: '422510e2-3bff-4b67-a87f-e24e3ef38fe0',
                            annotationType: 'inlineComment',
                          },
                        },
                        {
                          type: 'annotation',
                          attrs: {
                            id: '93e89148-ad5c-4bdd-965f-60b91b0e7774',
                            annotationType: 'inlineComment',
                          },
                        },
                      ],
                      text: 'aaa',
                    },
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'annotation',
                          attrs: {
                            id: '93e89148-ad5c-4bdd-965f-60b91b0e7774',
                            annotationType: 'inlineComment',
                          },
                        },
                      ],
                      text: ' ~~~',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [307],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'annotation',
                          attrs: {
                            id: '9704428e-1b22-4bdd-8948-967658fda9b8',
                            annotationType: 'inlineComment',
                          },
                        },
                      ],
                      text: '~~~ ',
                    },
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'annotation',
                          attrs: {
                            id: 'a4ca35cb-8964-4f5a-b7ad-101c82c789f4',
                            annotationType: 'inlineComment',
                          },
                        },
                        {
                          type: 'annotation',
                          attrs: {
                            id: '9704428e-1b22-4bdd-8948-967658fda9b8',
                            annotationType: 'inlineComment',
                          },
                        },
                      ],
                      text: '~~~',
                    },
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'annotation',
                          attrs: {
                            id: '9704428e-1b22-4bdd-8948-967658fda9b8',
                            annotationType: 'inlineComment',
                          },
                        },
                      ],
                      text: ' ~~~',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Lorem ' },
        {
          type: 'emoji',
          attrs: { shortName: ':slight_smile:', id: '1f642', text: '🙂' },
        },
        { type: 'text', text: '  ipsum dolor sit amet.' },
      ],
    },
    { type: 'paragraph' },
  ],
};

export const nestedBulletList = {
  type: 'doc',
  content: [
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'a1',
                },
              ],
            },
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'b1',
                        },
                      ],
                    },
                    {
                      type: 'bulletList',
                      content: [
                        {
                          type: 'listItem',
                          content: [
                            {
                              type: 'paragraph',
                              content: [
                                {
                                  type: 'text',
                                  text: 'c1',
                                },
                              ],
                            },
                            {
                              type: 'bulletList',
                              content: [
                                {
                                  type: 'listItem',
                                  content: [
                                    {
                                      type: 'paragraph',
                                      content: [
                                        {
                                          type: 'text',
                                          text: 'd1',
                                        },
                                      ],
                                    },
                                    {
                                      type: 'bulletList',
                                      content: [
                                        {
                                          type: 'listItem',
                                          content: [
                                            {
                                              type: 'paragraph',
                                              content: [
                                                {
                                                  type: 'text',
                                                  text: 'e1',
                                                },
                                              ],
                                            },
                                            {
                                              type: 'bulletList',
                                              content: [
                                                {
                                                  type: 'listItem',
                                                  content: [
                                                    {
                                                      type: 'paragraph',
                                                      content: [
                                                        {
                                                          type: 'text',
                                                          text: 'f1',
                                                        },
                                                      ],
                                                    },
                                                  ],
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const nestedOrderedList = {
  type: 'doc',
  content: [
    {
      type: 'orderedList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'a1',
                },
              ],
            },
            {
              type: 'orderedList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'b1',
                        },
                      ],
                    },
                    {
                      type: 'orderedList',
                      content: [
                        {
                          type: 'listItem',
                          content: [
                            {
                              type: 'paragraph',
                              content: [
                                {
                                  type: 'text',
                                  text: 'c1',
                                },
                              ],
                            },
                            {
                              type: 'orderedList',
                              content: [
                                {
                                  type: 'listItem',
                                  content: [
                                    {
                                      type: 'paragraph',
                                      content: [
                                        {
                                          type: 'text',
                                          text: 'd1',
                                        },
                                      ],
                                    },
                                    {
                                      type: 'orderedList',
                                      content: [
                                        {
                                          type: 'listItem',
                                          content: [
                                            {
                                              type: 'paragraph',
                                              content: [
                                                {
                                                  type: 'text',
                                                  text: 'e1',
                                                },
                                              ],
                                            },
                                            {
                                              type: 'orderedList',
                                              content: [
                                                {
                                                  type: 'listItem',
                                                  content: [
                                                    {
                                                      type: 'paragraph',
                                                      content: [
                                                        {
                                                          type: 'text',
                                                          text: 'f1',
                                                        },
                                                      ],
                                                    },
                                                  ],
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const nestedBulletAndOrderedList = {
  type: 'doc',
  content: [
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'a1',
                },
              ],
            },
            {
              type: 'orderedList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'b1',
                        },
                      ],
                    },
                    {
                      type: 'bulletList',
                      content: [
                        {
                          type: 'listItem',
                          content: [
                            {
                              type: 'paragraph',
                              content: [
                                {
                                  type: 'text',
                                  text: 'c1',
                                },
                              ],
                            },
                            {
                              type: 'orderedList',
                              content: [
                                {
                                  type: 'listItem',
                                  content: [
                                    {
                                      type: 'paragraph',
                                      content: [
                                        {
                                          type: 'text',
                                          text: 'd1',
                                        },
                                      ],
                                    },
                                    {
                                      type: 'bulletList',
                                      content: [
                                        {
                                          type: 'listItem',
                                          content: [
                                            {
                                              type: 'paragraph',
                                              content: [
                                                {
                                                  type: 'text',
                                                  text: 'e1',
                                                },
                                              ],
                                            },
                                            {
                                              type: 'orderedList',
                                              content: [
                                                {
                                                  type: 'listItem',
                                                  content: [
                                                    {
                                                      type: 'paragraph',
                                                      content: [
                                                        {
                                                          type: 'text',
                                                          text: 'f1',
                                                        },
                                                      ],
                                                    },
                                                  ],
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
