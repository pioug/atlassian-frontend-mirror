import type {
  DatasourceDataResponse,
  DatasourceResponse,
} from '@atlaskit/linking-types';

export const mockDatasourceDataResponse: DatasourceDataResponse = {
  data: [
    {
      id: 'EDM-12',
      description: 'Design datasource feature',
      createdAt: '2023-01-22T01:30:00.000-05:00',
      assigned: {
        displayName: 'Sasha',
      },
      state: 'IN PROGRESS',
    },
    {
      id: 'EDM-14',
      description: 'Implement datasource feature',
      createdAt: '2023-03-01T01:30:00.000-05:00',
      assigned: {
        displayName: 'Hana',
      },
      state: 'TO DO',
    },
    {
      id: 'EDM-15',
      description: 'Add Jira Provider',
      createdAt: '2023-03-31T01:30:00.000-05:00',
      assigned: {
        displayName: 'Princey',
      },
      state: 'TO DO',
    },
    {
      id: 'EDM-16',
      description: 'Plan team party',
      createdAt: '2023-05-01T01:30:00.000-05:00',
      assigned: {
        displayName: 'Nidhin',
      },
      state: 'TO DO',
    },
  ],
  nextPageCursor: 'c3RhcnRBdD01',
};

export const mockDatasourceResponse: DatasourceResponse = {
  ari: 'ari:cloud:linking-platform:datasource/12e74246-a3f1-46c1-9fd9-8d952aa9f12f',
  id: '12e74246-a3f1-46c1-9fd9-8d952aa9f12f',
  name: 'JQL Datasource',
  description: 'Fetches Issues using JQL',
  parameters: [
    {
      key: 'cloudId',
      type: 'string',
      description: 'Cloud Id',
    },
    {
      key: 'jql',
      type: 'string',
      description: 'JQL query to retrieve list of issues',
    },
  ],
  schema: {
    properties: [
      {
        key: 'id',
        type: 'string',
        title: 'Id',
      },
      {
        key: 'description',
        type: 'link',
        title: 'Description',
      },
      {
        key: 'createdAt',
        type: 'date',
        title: 'Created At',
      },
      {
        key: 'assigned',
        type: 'user',
        title: 'Assignee',
      },
      {
        key: 'state',
        type: 'status',
        title: 'Status',
      },
    ],
    defaultProperties: ['id', 'description', 'assigned', 'state'],
  },
};
