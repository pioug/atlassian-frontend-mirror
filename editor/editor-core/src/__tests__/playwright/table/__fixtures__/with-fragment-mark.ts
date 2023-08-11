export const withFragmentMark = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
        localId: '09e313ec-e90c-4a1d-9a0e-55113ec28a72',
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
                      text: '5',
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
                      text: '6',
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
                  content: [
                    {
                      type: 'text',
                      text: '9',
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
                      text: '7',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      marks: [
        {
          type: 'fragment',
          attrs: {
            localId: '6dfc2166-a8be-4cfd-9414-9ab9cea2cc51',
            name: 'Table 1',
          },
        },
      ],
    },
    {
      type: 'extension',
      attrs: {
        extensionType: 'com.atlassian.chart',
        extensionKey: 'chart:default',
        parameters: {
          chartType: 'BAR',
          chartGroup: {
            dataTab: {
              aggregateData: false,
              xAxisIdxField: '0',
              yAxisIdxField: ['1', '2'],
            },
            customizeTab: {
              styleField: {
                height: 350,
                showPoints: false,
                smooth: false,
                orientation: 'vertical',
              },
              titlesField: {
                chartTitle: 'Untitled chart',
                yLabel: 'Untitled axis',
                xLabel: '',
              },
              legendField: {
                legendPosition: 'auto',
                showLegend: true,
              },
            },
          },
          extensionTitle: 'Chart',
        },
        layout: 'default',
        localId: '2f4ea0ee-943a-4e9b-8d44-c3a89a5921c3',
      },
      marks: [
        {
          type: 'fragment',
          attrs: {
            localId: 'ad44b87e-6c82-44f8-92a8-4bf3116cc543',
            name: 'Chart 1',
          },
        },
        {
          type: 'dataConsumer',
          attrs: {
            sources: ['09e313ec-e90c-4a1d-9a0e-55113ec28a72'],
          },
        },
      ],
    },
  ],
};
