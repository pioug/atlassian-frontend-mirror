export const emptyDocument = {
  version: 1,
  type: 'doc',
  content: [],
};

export const layoutWithTwoColumns = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'layoutSection',
      content: [
        {
          type: 'layoutColumn',
          attrs: {
            width: 50,
          },
          content: [
            {
              type: 'paragraph',
              content: [],
            },
          ],
        },
        {
          type: 'layoutColumn',
          attrs: {
            width: 50,
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
};

export const layoutWithThreeColumns = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'layoutSection',
      content: [
        {
          type: 'layoutColumn',
          attrs: {
            width: 33.33,
          },
          content: [
            {
              type: 'paragraph',
              content: [],
            },
          ],
        },
        {
          type: 'layoutColumn',
          attrs: {
            width: 33.33,
          },
          content: [
            {
              type: 'paragraph',
              content: [],
            },
          ],
        },
        {
          type: 'layoutColumn',
          attrs: {
            width: 33.33,
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
};

export const layoutWithRightSideBar = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'layoutSection',
      content: [
        {
          type: 'layoutColumn',
          attrs: {
            width: 66.66,
          },
          content: [
            {
              type: 'paragraph',
              content: [],
            },
          ],
        },
        {
          type: 'layoutColumn',
          attrs: {
            width: 33.33,
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
};

export const tableWithOneCallAndMedia = (id: string) => ({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
      },
      content: [
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
                  },
                  content: [
                    {
                      type: 'media',
                      attrs: {
                        id,
                        type: 'file',
                        collection: 'MediaServicesSample',
                        width: 2378,
                        height: 628,
                      },
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
});

export const oneImage = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'mediaSingle',
      attrs: {
        layout: 'center',
      },
      content: [
        {
          type: 'media',
          attrs: {
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
            width: 2378,
            height: 628,
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export const threeImages = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'mediaSingle',
      attrs: {
        width: 66.67,
        layout: 'wrap-left',
      },
      content: [
        {
          type: 'media',
          attrs: {
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
            width: 2378,
            height: 628,
          },
        },
      ],
    },
    {
      type: 'mediaSingle',
      attrs: {
        width: 66.67,
        layout: 'wrap-right',
      },
      content: [
        {
          type: 'media',
          attrs: {
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
            width: 2378,
            height: 628,
          },
        },
      ],
    },
    {
      type: 'mediaSingle',
      attrs: {
        width: 41.666666666666664,
        layout: 'wrap-left',
      },
      content: [
        {
          type: 'media',
          attrs: {
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
            width: 2378,
            height: 628,
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};
