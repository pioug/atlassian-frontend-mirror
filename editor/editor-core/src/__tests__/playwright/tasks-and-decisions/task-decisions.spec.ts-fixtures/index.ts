export const paragraphWithDecisionList = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'test',
        },
      ],
    },
    {
      type: 'decisionList',
      attrs: {
        localId: '1c3b089f-6e80-4b01-8580-14f92568e7d8',
      },
      content: [
        {
          type: 'decisionItem',
          attrs: {
            localId: '897a3905-785c-4880-b494-327024cbeb5f',
            state: 'DECIDED',
          },
          content: [
            {
              type: 'text',
              text: 'test',
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

export const paragraphWithDecisionListWithoutContent = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'test',
        },
      ],
    },
    {
      type: 'decisionList',
      attrs: {
        localId: '1c3b089f-6e80-4b01-8580-14f92568e7d8',
      },
      content: [
        {
          type: 'decisionItem',
          attrs: {
            localId: '897a3905-785c-4880-b494-327024cbeb5f',
            state: 'DECIDED',
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

export const dateInTaskAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'taskList',
      attrs: {
        localId: '71f8c24d-4b69-48c4-9fa9-be30a8050158',
      },
      content: [
        {
          type: 'taskItem',
          attrs: {
            localId: '8a0fe9b4-f087-4079-90be-230c89902a30',
            state: 'TODO',
          },
          content: [
            {
              type: 'text',
              text: 'items 1',
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            localId: 'dfbd3b3f-915e-45cc-8fdb-4dcf57a3bcbe',
            state: 'TODO',
          },
          content: [
            {
              type: 'text',
              text: 'item 2',
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            localId: '543abf63-1883-4bbc-8a15-3dfeed52325d',
            state: 'TODO',
          },
          content: [
            {
              type: 'date',
              attrs: {
                timestamp: '1650499200000',
              },
            },
            {
              type: 'text',
              text: ' ',
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

export const taskListTableAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
        localId: 'd78ec861-f0a1-4d7a-8a36-dc40c74167be',
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
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'text',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'taskList',
                  attrs: {
                    localId: '083bb629-7515-4b56-ab23-186bd992dcb9',
                  },
                  content: [
                    {
                      type: 'taskItem',
                      attrs: {
                        localId: '8c2589ee-d854-418b-94b6-9546789087ff',
                        state: 'TODO',
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Action item 1',
                        },
                      ],
                    },
                    {
                      type: 'taskItem',
                      attrs: {
                        localId: 'cc4f1744-412d-446d-a320-c0930da84b6a',
                        state: 'TODO',
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Action item 2',
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
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'text',
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
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
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

export const decisionListInTableAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
        localId: '0dacb459-ffaa-4559-8b0d-62a27c8150c3',
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
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'text',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'decisionList',
                  attrs: {
                    localId: '958a258c-a9ad-479e-a9a3-82649c3daa10',
                  },
                  content: [
                    {
                      type: 'decisionItem',
                      attrs: {
                        localId: '46baa542-d7bb-4816-8012-e246bb2fb656',
                        state: 'DECIDED',
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Decision item 1',
                        },
                      ],
                    },
                    {
                      type: 'decisionItem',
                      attrs: {
                        localId: '93e8b5f4-ff81-4838-b0dd-f01834660d50',
                        state: 'DECIDED',
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Decision item 2',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'text',
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
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
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

export const decisionAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'decisionList',
      attrs: {
        localId: 'f3fc3d81-3ac5-4594-b3c5-bfc72e5263b9',
      },
      content: [
        {
          type: 'decisionItem',
          attrs: {
            localId: '356f2769-7562-40e2-9bfc-87d96be7279c',
            state: 'DECIDED',
          },
          content: [
            {
              type: 'text',
              text: 'decided this',
            },
          ],
        },
        {
          type: 'decisionItem',
          attrs: {
            localId: 'd8edf157-0f73-423b-ad3b-e3227ae63e7b',
            state: 'DECIDED',
          },
        },
      ],
    },
  ],
};
