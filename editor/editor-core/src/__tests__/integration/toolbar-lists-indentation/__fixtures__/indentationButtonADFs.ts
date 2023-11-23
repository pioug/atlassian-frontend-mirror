export const adfs = {
  paragraph: {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'hello world',
          },
        ],
      },
    ],
  },
  indentedParagraph: {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'hello world',
          },
        ],
        marks: [
          {
            type: 'indentation',
            attrs: {
              level: 1,
            },
          },
        ],
      },
    ],
  },
  heading: {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: {
          level: 1,
        },
        content: [
          {
            type: 'text',
            text: 'hello world',
          },
        ],
      },
    ],
  },
  indentedHeading: {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: {
          level: 1,
        },
        content: [
          {
            type: 'text',
            text: 'hello world',
          },
        ],
        marks: [
          {
            type: 'indentation',
            attrs: {
              level: 1,
            },
          },
        ],
      },
    ],
  },
  list: {
    version: 1,
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
                    text: 'hello',
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
                    text: 'world',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  indentedList: {
    version: 1,
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
                    text: 'hello',
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
                            text: 'world',
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
  taskList: {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'taskList',
        attrs: {
          localId: 'b51e086c-6e66-466a-9d2c-20b153bc8cc0',
        },
        content: [
          {
            type: 'taskItem',
            attrs: {
              localId: 'b12934ee-3146-4a11-ad6c-7f218a7a259e',
              state: 'TODO',
            },
            content: [
              {
                type: 'text',
                text: 'hello',
              },
            ],
          },
          {
            type: 'taskItem',
            attrs: {
              localId: 'cb7e1790-014a-4111-838e-d2e1a2198ecf',
              state: 'TODO',
            },
            content: [
              {
                type: 'text',
                text: 'world',
              },
            ],
          },
        ],
      },
    ],
  },
  indentedTaskList: {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'taskList',
        attrs: {
          localId: 'b51e086c-6e66-466a-9d2c-20b153bc8cc0',
        },
        content: [
          {
            type: 'taskItem',
            attrs: {
              localId: 'b12934ee-3146-4a11-ad6c-7f218a7a259e',
              state: 'TODO',
            },
            content: [
              {
                type: 'text',
                text: 'hello',
              },
            ],
          },
          {
            type: 'taskList',
            attrs: {
              localId: '59b5d1dd-caaf-471c-b508-dca2fd48e8d0',
            },
            content: [
              {
                type: 'taskItem',
                attrs: {
                  localId: 'cb7e1790-014a-4111-838e-d2e1a2198ecf',
                  state: 'TODO',
                },
                content: [
                  {
                    type: 'text',
                    text: 'world',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};
