export const blockCardAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
    {
      type: 'blockCard',
      attrs: {
        data: {
          '@context': 'https://www.w3.org/ns/activitystreams',
          '@type': 'Document',
          name: 'Welcome to Atlassian!',
          url: 'http://www.atlassian.com',
          generator: {
            icon: 'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png',
          },
        },
      },
    },
  ],
};

export const unAuth = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'blockCard',
      attrs: {
        url: 'https://blockCardTestUrl/unauthorized',
      },
    },
    {
      type: 'blockCard',
      attrs: {
        url: 'https://blockCardTestUrl/forbidden',
      },
    },
  ],
};

export const multipleBlockCards = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
    {
      type: 'blockCard',
      attrs: {
        data: {
          '@context': 'https://www.w3.org/ns/activitystreams',
          '@type': 'Document',
          name: 'Welcome to Atlassian!',
          url: 'http://www.atlassian.com',
          generator: {
            icon: 'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png',
          },
        },
      },
    },
    {
      type: 'blockCard',
      attrs: {
        data: {
          '@context': 'https://www.w3.org/ns/activitystreams',
          '@type': 'Document',
          name: 'Welcome to Atlassian!',
          url: 'http://www.atlassian.com',
          generator: {
            icon: 'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png',
          },
        },
      },
    },
  ],
};

export const blockCardDatasource = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
    {
      type: 'blockCard',
      attrs: {
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
                  {
                    key: 'type',
                  },
                  {
                    key: 'summary',
                  },
                  {
                    key: 'assignee',
                  },
                ],
              },
            },
          ],
        },
        layout: 'center',
      },
    },
  ],
};

export const multipleBlockCardDatasource = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
    {
      type: 'blockCard',
      attrs: {
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
                  {
                    key: 'type',
                  },
                  {
                    key: 'summary',
                  },
                  {
                    key: 'assignee',
                  },
                ],
              },
            },
          ],
        },
        layout: 'center',
      },
    },
    {
      type: 'blockCard',
      attrs: {
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
                  {
                    key: 'type',
                  },
                  {
                    key: 'summary',
                  },
                  {
                    key: 'assignee',
                  },
                ],
              },
            },
          ],
        },
        layout: 'center',
      },
    },
  ],
};
