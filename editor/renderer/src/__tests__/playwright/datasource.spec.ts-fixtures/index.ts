export const adf = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'heading',
      content: [
        {
          type: 'text',
          text: 'blockCard with jql table datasource',
        },
      ],
      attrs: {
        level: 3,
      },
    },
    {
      type: 'blockCard',
      attrs: {
        url: 'https://product-fabric.atlassian.net/issues/?jql=created%20%3E%3D%20-30d%20order%20by%20created%20DESC',
        datasource: {
          id: 'some-datasource-id',
          parameters: {
            cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
            jql: 'project=EDM',
          },
          views: [
            {
              type: 'table',
              properties: {
                columns: [
                  { key: 'summary' },
                  { key: 'assignee' },
                  { key: 'priority' },
                  { key: 'labels' },
                ],
              },
            },
          ],
        },
      },
    },
  ],
};
