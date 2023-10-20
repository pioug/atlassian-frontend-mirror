export const blockCardDatasourceAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'blockCard',
      attrs: {
        url: 'https://product-fabric.atlassian.net/issues/?jql=created%20%3E%3D%20-30d%20order%20by%20created%20DESC',
        datasource: {
          id: 'd8b75300-dfda-4519-b6cd-e49abbd50401',
          parameters: {
            cloudId: 'c97a19dd-05c1-4fe4-a742-3ef82dfdf1e7',
            jql: 'created >= -30d order by created DESC',
          },
          views: [
            {
              type: 'table',
              properties: {
                columns: [
                  { key: 'key' },
                  { key: 'type' },
                  { key: 'summary' },
                  { key: 'description' },
                  { key: 'assignee' },
                  { key: 'priority' },
                  { key: 'labels' },
                  { key: 'status' },
                  { key: 'created' },
                ],
              },
            },
          ],
        },
      },
    },
  ],
};
