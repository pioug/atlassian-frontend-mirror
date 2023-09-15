export const datasourceDataResponse = {
  meta: {
    destinationObjectTypes: ['issue'],
    auth: [],
    product: 'jira',
    extensionKey: 'jira-object-provider',
    visibility: 'restricted',
    access: 'granted',
  },
  data: {
    totalCount: 4,
    items: [
      {
        id: {
          data: '12078',
        },
        key: {
          data: {
            url: 'https://atl-jb-atjong-1.jira-dev.com/browse/CWCD-3',
            text: 'CWCD-3',
          },
        },
        summary: {
          data: {
            url: 'https://atl-jb-atjong-1.jira-dev.com/browse/CWCD-3',
            text: 'dedede',
          },
        },
        issuetype: {
          data: {
            source:
              'https://atl-jb-atjong-1.jira-dev.com/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=medium',
            label: 'Task',
          },
        },
        priority: {
          data: {
            source:
              'https://atl-jb-atjong-1.jira-dev.com/images/icons/priorities/medium.svg',
            label: 'Medium',
          },
        },
        updated: {
          data: '2023-09-01T15:55:05.330+1000',
        },
        status: {
          data: {
            id: '2',
            text: 'To Do',
            style: {
              appearance: 'new',
            },
          },
        },
      },
      {
        id: {
          data: '12077',
        },
        key: {
          data: {
            url: 'https://atl-jb-atjong-1.jira-dev.com/browse/CWCD-2',
            text: 'CWCD-2',
          },
        },
        summary: {
          data: {
            url: 'https://atl-jb-atjong-1.jira-dev.com/browse/CWCD-2',
            text: 'bababa',
          },
        },
        issuetype: {
          data: {
            source:
              'https://atl-jb-atjong-1.jira-dev.com/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=medium',
            label: 'Task',
          },
        },
        priority: {
          data: {
            source:
              'https://atl-jb-atjong-1.jira-dev.com/images/icons/priorities/medium.svg',
            label: 'Medium',
          },
        },
        updated: {
          data: '2023-08-25T12:56:45.488+1000',
        },
        status: {
          data: {
            id: '2',
            text: 'To Do',
            style: {
              appearance: 'new',
            },
          },
        },
      },
      {
        id: {
          data: '12076',
        },
        key: {
          data: {
            url: 'https://atl-jb-atjong-1.jira-dev.com/browse/CWCD-1',
            text: 'CWCD-1',
          },
        },
        summary: {
          data: {
            url: 'https://atl-jb-atjong-1.jira-dev.com/browse/CWCD-1',
            text: 'Ho ho ho',
          },
        },
        issuetype: {
          data: {
            source:
              'https://atl-jb-atjong-1.jira-dev.com/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=medium',
            label: 'Task',
          },
        },
        priority: {
          data: {
            source:
              'https://atl-jb-atjong-1.jira-dev.com/images/icons/priorities/medium.svg',
            label: 'Medium',
          },
        },
        updated: {
          data: '2023-08-25T12:56:43.182+1000',
        },
        status: {
          data: {
            id: '2',
            text: 'To Do',
            style: {
              appearance: 'new',
            },
          },
        },
      },
      {
        id: {
          data: '12075',
        },
        key: {
          data: {
            url: 'https://atl-jb-atjong-1.jira-dev.com/browse/TS-104',
            text: 'TS-104',
          },
        },
        summary: {
          data: {
            url: 'https://atl-jb-atjong-1.jira-dev.com/browse/TS-104',
            text: 'aaaasdsa',
          },
        },
        issuetype: {
          data: {
            source:
              'https://atl-jb-atjong-1.jira-dev.com/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=medium',
            label: 'Task',
          },
        },
        priority: {
          data: {
            source:
              'https://atl-jb-atjong-1.jira-dev.com/images/icons/priorities/medium.svg',
            label: 'Medium',
          },
        },
        updated: {
          data: '2023-08-09T13:14:05.518+1000',
        },
        status: {
          data: {
            id: '2',
            text: 'ham ham aaa',
            style: {
              appearance: 'new',
            },
          },
        },
      },
    ],
    schema: {
      properties: [
        {
          key: 'assignee',
          type: 'user',
          title: 'Assignee',
          isList: false,
        },
        {
          key: 'issuetype',
          type: 'icon',
          title: 'Issue Type',
          isList: false,
        },
        {
          key: 'key',
          title: 'Key',
          type: 'link',
        },
        {
          key: 'priority',
          type: 'icon',
          title: 'Priority',
          isList: false,
        },
        {
          key: 'status',
          type: 'status',
          title: 'Status',
          isList: false,
        },
        {
          key: 'summary',
          type: 'link',
          title: 'Summary',
          isList: false,
        },
        {
          key: 'updated',
          type: 'datetime',
          title: 'Updated',
          isList: false,
        },
      ],
    },
  },
};
